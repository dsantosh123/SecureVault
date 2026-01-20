// lib/admin/auth.ts
// Admin JWT Authentication & Session Management
// Simple implementation without external dependencies

import crypto from 'crypto';

// Types
export interface AdminUser {
  id: string;
  email: string;
  role: 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN';
  name: string;
}

export interface AdminSession {
  user: AdminUser;
  token: string;
  expiresAt: number;
}

export interface JWTPayload {
  adminId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Configuration
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your-super-secret-admin-key-change-in-production';
const JWT_EXPIRY_SECONDS = 8 * 60 * 60; // 8 hours

/**
 * Base64 URL encode
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Base64 URL decode
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf-8');
}

/**
 * Generate JWT token for admin user
 */
export async function generateAdminToken(admin: AdminUser): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    adminId: admin.id,
    email: admin.email,
    role: admin.role,
    iat: now,
    exp: now + JWT_EXPIRY_SECONDS,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verify and decode admin JWT token
 */
export async function verifyAdminToken(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    if (signature !== expectedSignature) {
      console.error('Invalid token signature');
      return null;
    }

    // Decode payload
    const payload = JSON.parse(base64UrlDecode(encodedPayload));

    return {
      adminId: payload.adminId,
      email: payload.email,
      role: payload.role,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(payload: JWTPayload): boolean {
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Get admin session from token
 */
export async function getAdminSession(token: string): Promise<AdminSession | null> {
  const payload = await verifyAdminToken(token);
  
  if (!payload || isTokenExpired(payload)) {
    return null;
  }

  return {
    user: {
      id: payload.adminId,
      email: payload.email,
      role: payload.role as 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN',
      name: payload.email.split('@')[0],
    },
    token,
    expiresAt: payload.exp * 1000,
  };
}

/**
 * Validate admin credentials (for login)
 * NOTE: In production, use bcrypt to compare hashed passwords
 */
export async function validateAdminCredentials(
  email: string,
  password: string
): Promise<AdminUser | null> {
  // TODO: Replace with actual database query
  const adminUsers = [
    {
      id: 'ADMIN-001',
      email: 'john@securevault-admin.com',
      password: 'hashed_password_here',
      role: 'ROLE_ADMIN' as const,
      name: 'John Doe',
    },
    {
      id: 'ADMIN-002',
      email: 'sarah@securevault-admin.com',
      password: 'hashed_password_here',
      role: 'ROLE_SUPER_ADMIN' as const,
      name: 'Sarah Smith',
    },
  ];

  const admin = adminUsers.find(a => a.email === email);
  
  if (!admin) {
    return null;
  }

  // TODO: Use bcrypt.compare(password, admin.password) in production
  const isValidPassword = password === 'admin123'; // REMOVE IN PRODUCTION

  if (!isValidPassword) {
    return null;
  }

  return {
    id: admin.id,
    email: admin.email,
    role: admin.role,
    name: admin.name,
  };
}

/**
 * Check if admin email domain is valid
 */
export function isValidAdminEmail(email: string): boolean {
  const allowedDomains = ['securevault-admin.com'];
  const domain = email.split('@')[1];
  return allowedDomains.includes(domain);
}

/**
 * Create admin session response
 */
export async function createAdminSession(admin: AdminUser): Promise<{
  token: string;
  expiresAt: number;
  user: Omit<AdminUser, 'id'>;
}> {
  const token = await generateAdminToken(admin);
  const expiresAt = Date.now() + JWT_EXPIRY_SECONDS * 1000;

  return {
    token,
    expiresAt,
    user: {
      email: admin.email,
      role: admin.role,
      name: admin.name,
    },
  };
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Rate limiting for login attempts
 */
interface LoginAttempt {
  email: string;
  timestamp: number;
  success: boolean;
}

const loginAttempts = new Map<string, LoginAttempt[]>();

export function checkRateLimit(email: string): {
  allowed: boolean;
  remainingAttempts: number;
  resetTime: number;
} {
  const MAX_ATTEMPTS = 5;
  const WINDOW_MS = 15 * 60 * 1000;
  const now = Date.now();

  const attempts = loginAttempts.get(email) || [];
  const recentAttempts = attempts.filter(a => now - a.timestamp < WINDOW_MS);

  loginAttempts.set(email, recentAttempts);

  const failedAttempts = recentAttempts.filter(a => !a.success).length;

  if (failedAttempts >= MAX_ATTEMPTS) {
    const oldestAttempt = recentAttempts[0];
    const resetTime = oldestAttempt.timestamp + WINDOW_MS;

    return {
      allowed: false,
      remainingAttempts: 0,
      resetTime,
    };
  }

  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - failedAttempts,
    resetTime: 0,
  };
}

export function recordLoginAttempt(email: string, success: boolean): void {
  const attempts = loginAttempts.get(email) || [];
  attempts.push({
    email,
    timestamp: Date.now(),
    success,
  });
  loginAttempts.set(email, attempts);
}

/**
 * Clean up expired sessions
 */
export function cleanupExpiredSessions(): void {
  const now = Date.now();
  const CLEANUP_THRESHOLD = 60 * 60 * 1000;

  for (const [email, attempts] of loginAttempts.entries()) {
    const validAttempts = attempts.filter(
      a => now - a.timestamp < CLEANUP_THRESHOLD
    );

    if (validAttempts.length === 0) {
      loginAttempts.delete(email);
    } else {
      loginAttempts.set(email, validAttempts);
    }
  }
}

export const __testing__ = {
  JWT_EXPIRY_SECONDS,
  loginAttempts,
};