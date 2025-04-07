import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from '@/lib/auth';

export async function adminAuthMiddleware(request: NextRequest) {
  try {
    const token = await getToken();
    
    if (!token || !token.isAdmin) {
      return NextResponse.json(
        { message: '未授权访问' },
        { status: 401 }
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error('管理员验证失败:', error);
    return NextResponse.json(
      { message: '验证失败' },
      { status: 500 }
    );
  }
} 