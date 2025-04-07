import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// 需要保护的路由
const protectedRoutes = [
  '/questions',
  '/profile',
  '/admin',
  '/api/questions',
  '/api/user',
  '/api/admin',
];

// 公开路由
const publicRoutes = [
  '/',
  '/auth',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/health',
];

// 静态资源路由
const staticRoutes = [
  '/_next',
  '/static',
  '/api-docs',
  '/favicon.ico',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 静态资源不需要验证
  if (staticRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 检查是否是需要保护的路由
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // 获取token
  const token = request.cookies.get('token')?.value;

  if (!token) {
    // 未登录用户访问受保护的路由
    if (isProtectedRoute) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, message: '未授权访问' },
          { status: 401 }
        );
      }
      const url = new URL('/auth', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    // 未登录用户可以访问非保护路由
    return NextResponse.next();
  }

  try {
    // 验证token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    await jwtVerify(token, secret);

    // 如果已登录且访问登录页面，重定向到首页
    if (pathname === '/auth') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // 已登录用户可以访问所有路由
    return NextResponse.next();
  } catch (error) {
    // token 验证失败，清除 cookie 并重定向到登录页面
    const response = NextResponse.redirect(new URL('/auth', request.url));
    response.cookies.delete('token');

    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: 'token无效' },
        { 
          status: 401,
          headers: {
            'Set-Cookie': 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax'
          }
        }
      );
    }

    return response;
  }
}

// 配置需要进行中间件处理的路由
export const config = {
  matcher: [
    /*
     * 匹配所有路由除了:
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (浏览器图标)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 