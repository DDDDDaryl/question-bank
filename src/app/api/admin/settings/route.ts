import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { SystemSettings } from '@/models/mongodb/SystemSettings';
import { getToken } from '@/lib/auth';

// 获取系统设置
export async function GET(request: NextRequest) {
  try {
    const token = await getToken();
    if (!token || !token.isAdmin) {
      return NextResponse.json(
        { message: '未授权访问' },
        { status: 401 }
      );
    }

    await dbConnect();
    let settings = await SystemSettings.findOne();

    if (!settings) {
      settings = await SystemSettings.create({
        allowNewRegistrations: true
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('获取系统设置失败:', error);
    return NextResponse.json(
      { message: '获取系统设置失败' },
      { status: 500 }
    );
  }
}

// 更新系统设置
export async function PATCH(request: NextRequest) {
  try {
    const token = await getToken();
    if (!token || !token.isAdmin) {
      return NextResponse.json(
        { message: '未授权访问' },
        { status: 401 }
      );
    }

    const data = await request.json();
    await dbConnect();

    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings();
    }

    // 更新设置
    Object.assign(settings, data);
    await settings.save();

    return NextResponse.json({
      message: '更新成功',
      settings
    });
  } catch (error) {
    console.error('更新系统设置失败:', error);
    return NextResponse.json(
      { message: '更新系统设置失败' },
      { status: 500 }
    );
  }
} 