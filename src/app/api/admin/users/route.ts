import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { UserModel } from '@/models/mongodb/User';
import { getToken } from '@/lib/auth';

// 获取用户列表和统计信息
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

    // 获取所有用户
    const users = await UserModel.find()
      .select('-password')
      .sort({ createdAt: -1 });

    // 计算统计信息
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [activeUsers, totalTags] = await Promise.all([
      UserModel.countDocuments({ lastLoginAt: { $gte: sevenDaysAgo } }),
      UserModel.aggregate([
        {
          $group: {
            _id: null,
            totalTags: { $sum: { $size: '$tags' } }
          }
        }
      ])
    ]);

    const stats = {
      totalUsers: users.length,
      activeUsers,
      averageTagsPerUser: users.length > 0 ? (totalTags[0]?.totalTags || 0) / users.length : 0
    };

    return NextResponse.json({
      users,
      stats
    });
  } catch (error) {
    console.error('获取用户数据失败:', error);
    return NextResponse.json(
      { message: '获取用户数据失败' },
      { status: 500 }
    );
  }
}

// 更新用户状态
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
    const { userId, isActive } = data;

    if (!userId) {
      return NextResponse.json(
        { message: '用户ID不能为空' },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: '用户不存在' },
        { status: 404 }
      );
    }

    user.isActive = isActive;
    await user.save();

    return NextResponse.json({
      message: '更新成功',
      user
    });
  } catch (error) {
    console.error('更新用户状态失败:', error);
    return NextResponse.json(
      { message: '更新用户状态失败' },
      { status: 500 }
    );
  }
} 