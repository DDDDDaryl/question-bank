import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { UserProfile } from '@/types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '7d';

interface JWTPayload {
  _id: string;
  username: string;
  email: string;
  role: string;
}

export function generateToken(user: UserProfile): string {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

export function setAuthCookie(token: string): void {
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

export function removeAuthCookie(): void {
  cookies().delete('token');
}

export async function getToken(): Promise<JWTPayload | null> {
  const token = cookies().get('token')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token验证失败:', error);
    return null;
  }
}

export async function verifyAuth(request: NextRequest): Promise<UserProfile | null> {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as UserProfile;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function withAuth(handler: Function) {
  return async (request: NextRequest) => {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '未授权访问' },
        { status: 401 }
      );
    }
    return handler(request, user);
  };
}

export function withAdminAuth(handler: Function) {
  return async (request: NextRequest) => {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: '需要管理员权限' },
        { status: 403 }
      );
    }
    return handler(request, user);
  };
} 