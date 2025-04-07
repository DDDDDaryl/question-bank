import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Question } from '@/models/mongodb/Question';
import { Mistake } from '@/models/mongodb/Mistake';

export async function GET() {
  try {
    await dbConnect();
    const mistakes = await Mistake.find().populate('questionId');
    return NextResponse.json(mistakes);
  } catch (error) {
    console.error('获取错题失败:', error);
    return NextResponse.json(
      { error: '获取错题失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { questionIds } = await request.json();
    
    if (!Array.isArray(questionIds)) {
      return NextResponse.json(
        { error: '无效的请求数据' },
        { status: 400 }
      );
    }

    const mistakes = await Promise.all(
      questionIds.map(async (questionId) => {
        const question = await Question.findById(questionId);
        if (!question) {
          throw new Error(`题目不存在: ${questionId}`);
        }
        return Mistake.create({ questionId });
      })
    );

    return NextResponse.json({
      message: '错题保存成功',
      mistakes
    });
  } catch (error) {
    console.error('保存错题失败:', error);
    return NextResponse.json(
      { error: '保存错题失败' },
      { status: 500 }
    );
  }
} 