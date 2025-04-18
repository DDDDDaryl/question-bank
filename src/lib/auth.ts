import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { UserProfile } from '@/types/user';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  isAdmin: boolean;
  role?: 'user' | 'admin';
  iat?: number;
  exp?: number;
}

export function generateToken(user: UserProfile): string {
  return jwt.sign(
    {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isAdmin: user.role === 'admin'
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
    const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function verifyAuth(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function withAuth(handler: (request: NextRequest, user: JWTPayload) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    try {
      console.log('Verifying authentication...');
      const token = request.cookies.get('token')?.value;
      
      if (!token) {
        console.error('No token found in cookies');
        return NextResponse.json(
          { success: false, message: '未授权访问' },
          { status: 401 }
        );
      }

      console.log('Token found, verifying...');
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      console.log('Token verified, user:', decoded);

      return handler(request, decoded);
    } catch (error) {
      console.error('Authentication error:', error);
      if (error instanceof jwt.JsonWebTokenError) {
        return NextResponse.json(
          { success: false, message: '无效的认证令牌' },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { success: false, message: '认证失败' },
        { status: 401 }
      );
    }
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