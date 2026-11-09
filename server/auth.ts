import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db, AdminUser, verifyPassword, generateSalt } from './db';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'vineyard-b2b-tet2027-super-secret-salt-key';

// Rate limiting & Brute force protection
interface FailedAttempt {
  count: number;
  lockedUntil: number;
}
const failedAttempts = new Map<string, FailedAttempt>();

export function checkBruteForce(identifier: string): { locked: boolean; waitMinutes: number } {
  const record = failedAttempts.get(identifier);
  if (!record) return { locked: false, waitMinutes: 0 };
  const now = Date.now();
  if (record.lockedUntil > now) {
    const remaining = Math.ceil((record.lockedUntil - now) / 60000);
    return { locked: true, waitMinutes: remaining };
  }
  if (record.lockedUntil <= now && record.count >= 5) {
    // Reset after lock expired
    failedAttempts.delete(identifier);
  }
  return { locked: false, waitMinutes: 0 };
}

export function recordFailedAttempt(identifier: string) {
  const now = Date.now();
  const record = failedAttempts.get(identifier) || { count: 0, lockedUntil: 0 };
  record.count += 1;
  if (record.count >= 5) {
    // Lock for 15 minutes
    record.lockedUntil = now + 15 * 60 * 1000;
  }
  failedAttempts.set(identifier, record);
}

export function clearFailedAttempts(identifier: string) {
  failedAttempts.delete(identifier);
}

// Token generation using signed HMAC payload
export function generateAuthToken(user: AdminUser): string {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  };
  const str = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(str).digest('base64url');
  return `${str}.${sig}`;
}

export function verifyAuthToken(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [str, sig] = parts;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(str).digest('base64url');
    if (sig !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(str, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch (err) {
    return null;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: AdminUser;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token = '';
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(/admin_token=([^;]+)/);
    if (match) token = match[1];
  }

  if (!token) {
    return next();
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    return next();
  }

  const users = db.get('users');
  const user = users.find((u) => u.id === payload.sub && u.status === 'active');
  if (user) {
    req.user = user;
  }
  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Phiên làm việc đã hết hạn hoặc chưa đăng nhập. Vui lòng đăng nhập lại.'
    });
  }
  next();
}

export function requireRole(allowedRoles: AdminUser['role'][]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Vui lòng đăng nhập.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Bạn không có quyền hạn truy cập module này.'
      });
    }
    next();
  };
}
