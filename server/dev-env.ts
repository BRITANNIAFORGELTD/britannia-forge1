// server/dev-env.ts
// Dev-only env loader + safe fallbacks. No secrets committed.
import 'dotenv/config';

// Only set fallbacks when not in production:
if (process.env.NODE_ENV !== 'production') {
  // Keep port stable for the admin UI
  if (!process.env.PORT) process.env.PORT = '5050';

  // Default frontend URL for local development
  if (!process.env.FRONTEND_URL) {
    process.env.FRONTEND_URL = 'http://localhost:5050';
  }

  // Use Supabase only; no Neon fallback
  if (!process.env.DATABASE_URL) {
    const supa = process.env.SUPABASE_DATABASE_URL;
    if (supa) process.env.DATABASE_URL = supa;
  }

  // Avoid TLS verification issues with Supabase pooler certificates in local dev
  if (!process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }
}


