import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // 创建响应对象
    const response = NextResponse.json(
      { success: true },
      { 
        status: 200,
        headers: {
          // 设置多个相同的Set-Cookie头以确保在各种环境下都能正确清除cookie
          'Set-Cookie': [
            // 标准方式
            'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
            // 添加Domain属性
            'token=; Path=/; Domain=localhost; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
            // 不同路径
            'token=; Path=/api; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax'
          ].join(', ')
        }
      }
    );

    return response;
  } catch (error) {
    console.error('登出失败:', error);
    return NextResponse.json(
      { success: false, message: '登出失败' },
      { status: 500 }
    );
  }
} 