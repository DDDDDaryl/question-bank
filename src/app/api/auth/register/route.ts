import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@/models/mongodb/User';
import dbConnect from '@/lib/mongodb';
import { SystemSettings } from '@/models/mongodb/SystemSettings';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const ADMIN_REGISTRATION_CODE = process.env.ADMIN_REGISTRATION_CODE || 'ADMIN_2024';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // 检查是否允许新用户注册
    const settings = await SystemSettings.findOne();
    if (settings && !settings.allowNewRegistrations) {
      return NextResponse.json(
        { message: '当前不允许新用户注册' },
        { status: 403 }
      );
    }

    const { username, email, password, registrationCode } = await request.json();

    // 验证必填字段
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: '用户名、邮箱和密码都是必需的' },
        { status: 400 }
      );
    }

    // 检查用户名和邮箱是否已存在
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return NextResponse.json(
        { message: '用户名或邮箱已被注册' },
        { status: 400 }
      );
    }

    // 创建新用户
    const user = new UserModel({
      username,
      email,
      password,
      isAdmin: registrationCode === ADMIN_REGISTRATION_CODE,
      isActive: true,
      lastLoginAt: new Date(),
      tags: []
    });

    await user.save();

    // 生成JWT令牌
    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.isAdmin ? 'admin' : 'user',
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

    return NextResponse.json({
      message: '注册成功',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    return NextResponse.json(
      { message: '注册失败', error: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
} 