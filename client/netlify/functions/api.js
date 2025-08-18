// Netlify Function to handle production auth endpoints using Supabase
// Endpoints supported:
// - POST /api/auth/login
// - GET  /api/auth/me

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE');
  return createClient(url, serviceRole, { auth: { persistSession: false, autoRefreshToken: false } });
}

function json(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...corsHeaders(),
      ...headers,
    },
    body: JSON.stringify(body),
  };
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  };
}

function getOriginalPath(event) {
  const h = event.headers || {};
  const candidates = [
    h['x-original-uri'],
    h['x-rewrite-url'],
    h['x-forwarded-uri'],
    h['x-forwarded-path'],
    h['x-netlify-original-pathname'],
  ].filter(Boolean);
  if (candidates.length) return candidates[0];
  return event.path || '';
}

function readTokenFromRequest(event) {
  const h = event.headers || {};
  const auth = h['authorization'] || h['Authorization'];
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7);
  const cookie = h['cookie'] || h['Cookie'] || '';
  const m = cookie.match(/(?:^|; )admin_token=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : '';
}

function setJwtCookie(token) {
  const attrs = [
    `admin_token=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
  ];
  return attrs.join('; ');
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers: { ...corsHeaders() } };
    }

    const path = getOriginalPath(event);
    const supabase = getSupabase();

    // POST /api/auth/login
    if (event.httpMethod === 'POST' && path.endsWith('/api/auth/login')) {
      let body = {};
      try { body = JSON.parse(event.body || '{}'); } catch {}
      const email = (body.email || '').toString();
      const password = (body.password || '').toString();
      if (!email || !password) {
        return json(400, { error: 'Email and password are required' });
      }

      const { data, error } = await supabase
        .from('admin_users')
        .select('id, email, password_hash')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (error) {
        console.error('[functions/auth/login] supabase error', error);
        return json(500, { error: 'Server error' });
      }
      if (!data) return json(401, { error: 'Invalid credentials' });

      const ok = await bcrypt.compare(password, data.password_hash);
      if (!ok) return json(401, { error: 'Invalid credentials' });

      const token = jwt.sign(
        { sub: data.id, email: data.email },
        process.env.JWT_SECRET || 'change-me',
        { expiresIn: '12h' }
      );

      return json(200, {
        success: true,
        message: 'Login successful',
        user: { id: data.id, email: data.email },
        token,
        requiresVerification: false,
      }, {
        'Set-Cookie': setJwtCookie(token),
      });
    }

    // GET /api/auth/me
    if (event.httpMethod === 'GET' && path.endsWith('/api/auth/me')) {
      try {
        const token = readTokenFromRequest(event);
        if (!token) return json(401, { error: 'Access token required' });
        const claims = jwt.verify(token, process.env.JWT_SECRET || 'change-me');
        return json(200, { id: Number(claims.sub), email: String(claims.email || '') });
      } catch {
        return json(401, { error: 'Unauthorized' });
      }
    }

    return json(404, { error: 'Not found' });
  } catch (e) {
    console.error('[functions/api] unexpected', e);
    return json(500, { error: 'Server error' });
  }
};


