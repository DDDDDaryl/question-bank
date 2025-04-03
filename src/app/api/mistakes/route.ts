import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import Question from '@/models/Question';
import Mistake from '@/models/Mistake';

export async function GET() {
  try {
    await connectToDatabase();
    const mistakes = await Mistake.find().populate('questionId');

    return NextResponse.json({
      success: true,
      mistakes,
    });
  } catch (error) {
    console.error('Failed to fetch mistakes:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取错题失败',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { questionIds } = await request.json();
    
    await connectToDatabase();
    
    // 将题目 ID 转换为 ObjectId 并创建错题记录
    const mistakes = questionIds.map((id: string) => ({
      questionId: new ObjectId(id),
      timestamp: new Date(),
    }));
    
    await Mistake.insertMany(mistakes);

    return NextResponse.json({
      success: true,
      message: '错题保存成功',
    });
  } catch (error) {
    console.error('Failed to save mistakes:', error);
    return NextResponse.json(
      {
        success: false,
        message: '保存错题失败',
      },
      { status: 500 }
    );
  }
} 