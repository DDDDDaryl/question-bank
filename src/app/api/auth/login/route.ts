import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { UserModel } from '@/models/mongodb/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // 确保数据库连接
    await connectDB();

    // 查找用户
    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: '邮箱或密码错误' },
        { status: 401 }
      );
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: '邮箱或密码错误' },
        { status: 401 }
      );
    }

    // 更新最后登录时间
    user.lastLoginAt = new Date();
    await user.save();

    // 生成 JWT token
    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // 设置 cookie
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7天
      path: '/',
    });

    // 返回用户信息（不包含密码）
    const userWithoutPassword = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      subscribedTags: user.subscribedTags,
    };

    return NextResponse.json({
      message: '登录成功',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json(
      { message: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
} 