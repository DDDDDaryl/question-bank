import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/mongodb/User';
import { withAuth } from '@/lib/auth';
import { UpdateProfileData } from '@/types/user';

export const GET = withAuth(async (request: NextRequest, user: any) => {
  try {
    console.log('User from token:', user);
    
    if (!user || !user.userId) {
      console.error('No user ID in token');
      return NextResponse.json(
        { success: false, message: '未授权访问' },
        { status: 401 }
      );
    }

    await dbConnect();
    console.log('Attempting to find user with ID:', user.userId);
    
    const userData = await UserModel.findById(user.userId).select('-password');
    console.log('User data from DB:', userData);
    
    if (!userData) {
      console.error('User not found in database');
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }
    
    const userResponse = {
      _id: userData._id,
      username: userData.username,
      email: userData.email,
      role: userData.role || 'user',
      subscribedTags: userData.subscribedTags || [],
      isAdmin: userData.role === 'admin',
      isActive: userData.isActive
    };
    
    console.log('Sending user response:', userResponse);
    
    return NextResponse.json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return NextResponse.json(
      { success: false, message: '获取用户信息失败' },
      { status: 500 }
    );
  }
});

export const PATCH = withAuth(async (request: NextRequest, user: any) => {
  try {
    const data: UpdateProfileData = await request.json();
    await dbConnect();
    
    // 如果要更新邮箱，检查是否已被使用
    if (data.email) {
      const existingUser = await UserModel.findOne({
        email: data.email,
        _id: { $ne: user.userId }
      });
      
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: '邮箱已被使用' },
          { status: 400 }
        );
      }
    }
    
    // 如果要更新用户名，检查是否已被使用
    if (data.username) {
      const existingUser = await UserModel.findOne({
        username: data.username,
        _id: { $ne: user.userId }
      });
      
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: '用户名已被使用' },
          { status: 400 }
        );
      }
    }
    
    const updatedUser = await UserModel.findByIdAndUpdate(
      user.userId,
      { $set: data },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    return NextResponse.json(
      { success: false, message: '更新用户信息失败' },
      { status: 500 }
    );
  }
}); 