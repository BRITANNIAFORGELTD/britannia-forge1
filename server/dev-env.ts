// server/dev-env.ts
// Dev-only env loader + safe fallbacks. No secrets committed.
import 'dotenv/config';

// Only set fallbacks when not in production:
if (process.env.NODE_ENV !== 'production') {
  // Keep port stable for the admin UI
  if (!process.env.PORT) process.env.PORT = '5001';

  // If DATABASE_URL isn't provided, fall back to the known-good pooler URL
  // (this mirrors the old dev-server.cjs behavior — **no secrets printed**).
  if (!process.env.DATABASE_URL) {
    // Prefer an alternate var if present (some setups used this)
    const supa = process.env.SUPABASE_DATABASE_URL;
    process.env.DATABASE_URL = supa || 'postgresql://aws-0-eu-west-2.pooler.supabase.com:5432/postgres';
  }
}


