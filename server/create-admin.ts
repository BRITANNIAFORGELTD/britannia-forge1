#!/usr/bin/env node
/**
 * Secure Admin User Creation Script
 * Usage: npm run create-admin
 */

import { db } from './db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

// Helper to hash passwords with bcrypt
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Helper function to generate secure random password
function generateSecurePassword(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function createAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourdomain.com';
    const adminPassword = process.env.ADMIN_PASSWORD || generateSecurePassword();
    
    // Check if admin user already exists
    const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
    
    if (existingAdmin.length > 0) {
      console.log('❌ Admin user already exists:', adminEmail);
      return;
    }
    
    // Create admin user
    const adminUser = await db.insert(users).values({
      fullName: 'System Administrator',
      email: adminEmail,
      password: await hashPassword(adminPassword),
      userType: 'admin',
      emailVerified: true,
      emailVerificationCode: null,
      emailVerificationExpires: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('🔐 Secure Admin URL: http://localhost:5050/admin/login');
    console.log('');
    console.log('⚠️  IMPORTANT: Store these credentials securely and change the password after first login!');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the script in ESM context when executed directly
import { fileURLToPath } from 'url';
import path from 'path';
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  createAdminUser()
    .then(() => {
      console.log('Admin user creation completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}

export { createAdminUser };