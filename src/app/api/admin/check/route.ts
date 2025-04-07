import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { UserModel } from '@/models/mongodb/User';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const users = await UserModel.find().select('-password');
    
    return NextResponse.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('获取用户数据失败:', error);
    return NextResponse.json(
      { success: false, message: '获取用户数据失败' },
      { status: 500 }
    );
  }
} 