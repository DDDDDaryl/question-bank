import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/mongodb/User';
import { withAuth } from '@/lib/auth';

export const GET = withAuth(async (request: NextRequest, user: any) => {
  try {
    await dbConnect();
    const userData = await UserModel.findById(user._id).select('subscribedTags');
    
    if (!userData) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      tags: userData.subscribedTags
    });
  } catch (error) {
    console.error('获取订阅标签失败:', error);
    return NextResponse.json(
      { success: false, message: '获取订阅标签失败' },
      { status: 500 }
    );
  }
});

export const PUT = withAuth(async (request: NextRequest, user: any) => {
  try {
    const { tags }: { tags: string[] } = await request.json();
    await dbConnect();
    
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { $set: { subscribedTags: tags } },
      { new: true }
    ).select('subscribedTags');
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      tags: updatedUser.subscribedTags
    });
  } catch (error) {
    console.error('更新订阅标签失败:', error);
    return NextResponse.json(
      { success: false, message: '更新订阅标签失败' },
      { status: 500 }
    );
  }
}); 