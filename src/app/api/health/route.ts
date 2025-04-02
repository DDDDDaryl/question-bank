import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    await client.db('admin').command({ ping: 1 });
    return NextResponse.json({ message: '数据库连接成功！' });
  } catch (error) {
    console.error('数据库连接错误:', error);
    return NextResponse.json(
      { message: '数据库连接失败' },
      { status: 500 }
    );
  }
} 