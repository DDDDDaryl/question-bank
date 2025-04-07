import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Question } from '@/models/mongodb/Question';
import { Mistake } from '@/models/mongodb/Mistake';
import { withAuth } from '@/lib/auth';

export const GET = withAuth(async (request: NextRequest, user: any) => {
  try {
    await dbConnect();
    const mistakes = await Mistake.find({ userId: user._id })
      .populate('questionId')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      mistakes: mistakes.map(mistake => ({
        _id: mistake._id,
        questionId: mistake.questionId,
        createdAt: mistake.createdAt
      }))
    });
  } catch (error) {
    console.error('获取错题失败:', error);
    return NextResponse.json(
      { success: false, message: '获取错题失败' },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (request: NextRequest, user: any) => {
  try {
    await dbConnect();
    const { questionIds } = await request.json();
    
    if (!Array.isArray(questionIds)) {
      return NextResponse.json(
        { success: false, message: '无效的请求数据' },
        { status: 400 }
      );
    }

    const mistakes = await Promise.all(
      questionIds.map(async (questionId) => {
        const question = await Question.findById(questionId);
        if (!question) {
          throw new Error(`题目不存在: ${questionId}`);
        }
        // 检查是否已存在相同的错题记录
        const existingMistake = await Mistake.findOne({
          userId: user._id,
          questionId: questionId
        });
        
        if (!existingMistake) {
          return Mistake.create({
            userId: user._id,
            questionId: questionId
          });
        }
        return existingMistake;
      })
    );

    return NextResponse.json({
      success: true,
      message: '错题保存成功',
      mistakes
    });
  } catch (error) {
    console.error('保存错题失败:', error);
    return NextResponse.json(
      { success: false, message: '保存错题失败' },
      { status: 500 }
    );
  }
}); 