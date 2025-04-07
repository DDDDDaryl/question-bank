import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import QuestionModel from '@/models/mongodb/Question';
import type { Question, QuestionOption } from '@/types/question';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const count = Number(searchParams.get('count')) || 10;

    await dbConnect();
    const questions = await QuestionModel.aggregate([
      { $sample: { size: count } },
      {
        $project: {
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      },
    ]);

    // 格式化问题数据，确保选项格式正确
    const formattedQuestions = questions.map((question: Partial<Question>) => {
      const formattedOptions = (question.options || []).map((option: any): QuestionOption => {
        // 如果选项已经是正确的格式，直接返回
        if (option && typeof option === 'object' && 'content' in option && 'isCorrect' in option) {
          return option as QuestionOption;
        }
        // 如果选项是字符串，转换为正确的格式
        if (typeof option === 'string') {
          return {
            content: option,
            isCorrect: false
          };
        }
        // 如果选项格式不正确，返回一个默认值
        return {
          content: '选项内容缺失',
          isCorrect: false
        };
      });

      return {
        ...question,
        options: formattedOptions
      };
    });

    return NextResponse.json({
      success: true,
      questions: formattedQuestions,
    });
  } catch (error) {
    console.error('Failed to fetch random questions:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取随机题目失败',
      },
      { status: 500 }
    );
  }
} 