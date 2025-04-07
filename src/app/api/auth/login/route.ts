import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { UserModel } from '@/models/mongodb/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    console.log('Login attempt for email:', email);

    // 确保数据库连接
    await dbConnect();
    console.log('Database connected');

    // 查找用户
    const user = await UserModel.findOne({ email });
    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      return NextResponse.json(
        { success: false, message: '邮箱或密码错误' },
        { status: 401 }
      );
    }

    // 检查用户是否被禁用
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: '账号已被禁用，请联系管理员' },
        { status: 403 }
      );
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: '邮箱或密码错误' },
        { status: 401 }
      );
    }

    // 更新最后登录时间
    user.lastLoginAt = new Date();
    await user.save();

    // 生成 JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        isAdmin: user.role === 'admin'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('Token generated');

    // 设置 cookie
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7天
      path: '/',
    });
    console.log('Cookie set');

    // 返回用户信息（不包含密码）
    const userWithoutPassword = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      subscribedTags: user.subscribedTags,
      isAdmin: user.role === 'admin',
      isActive: user.isActive
    };

    console.log('Login successful for user:', userWithoutPassword.username);

    return NextResponse.json({
      success: true,
      message: '登录成功',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json(
      { success: false, message: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
} 