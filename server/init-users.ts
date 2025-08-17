import 'dotenv/config';
import { Pool } from 'pg';

async function initUsers() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is required');

  const pool = new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  const client = await pool.connect();
  try {
    // Minimal users table to support auth; matches shared/schema.ts fields subset
    await client.query(`
      create table if not exists users (
        id serial primary key,
        full_name varchar(255) not null,
        email varchar(255) not null unique,
        password varchar(255) not null,
        phone varchar(20),
        address text,
        city varchar(100),
        postcode varchar(20),
        email_verified boolean default false,
        email_verification_token varchar(255),
        email_verification_code varchar(6),
        email_verification_expires timestamp,
        reset_password_token varchar(255),
        reset_password_expires timestamp,
        user_type varchar(20) default 'customer',
        stripe_customer_id varchar(255),
        stripe_subscription_id varchar(255),
        created_at timestamp default now(),
        updated_at timestamp default now()
      );
    `);

    console.log('Users table ensured');
  } finally {
    client.release();
    await pool.end();
  }
}

initUsers().catch((err) => {
  console.error('Init users failed:', err);
  process.exit(1);
});


