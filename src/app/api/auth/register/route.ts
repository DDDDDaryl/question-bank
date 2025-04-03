import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { UserModel } from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { username, email, password } = data;

    // 确保数据库连接
    await connectDB();

    // 检查用户名是否已存在
    const existingUsername = await UserModel.findOne({ username });
    if (existingUsername) {
      return NextResponse.json(
        { message: '用户名已被使用' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { message: '邮箱已被注册' },
        { status: 400 }
      );
    }

    // 加密密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建新用户
    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role: 'user',
      subscribedTags: [],
      lastLoginAt: new Date(),
    });

    // 生成JWT令牌
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

    // 设置cookie
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
      message: '注册成功',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('注册失败:', error);
    return NextResponse.json(
      { message: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
} 