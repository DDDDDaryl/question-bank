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
          _id: 1,
          title: 1,
          content: 1,
          type: 1,
          difficulty: 1,
          options: 1,
          explanation: 1,
          tags: 1,
          createdBy: 1
        },
      },
    ]);

    // 格式化问题数据，确保选项格式正确
    const formattedQuestions = questions.map((question: Partial<Question>) => {
      // 添加调试日志
      console.log('原始问题数据:', JSON.stringify(question, null, 2));
      
      if (!question.options || !Array.isArray(question.options)) {
        console.error('选项数据无效:', question.options);
        question.options = [];
      }

      const formattedOptions = question.options.map((option: any): QuestionOption => {
        // 添加调试日志
        console.log('原始选项数据:', JSON.stringify(option, null, 2));

        // 如果选项已经是正确的格式，直接返回
        if (option && typeof option === 'object' && 'content' in option && 'isCorrect' in option) {
          return {
            content: String(option.content),
            isCorrect: Boolean(option.isCorrect)
          };
        }

        // 如果选项是字符串，转换为正确的格式
        if (typeof option === 'string') {
          return {
            content: option,
            isCorrect: false
          };
        }

        // 如果选项是数组（可能是 MongoDB 的序列化问题）
        if (Array.isArray(option)) {
          return {
            content: String(option[0] || '选项内容缺失'),
            isCorrect: Boolean(option[1])
          };
        }

        // 如果选项格式不正确，返回一个默认值
        console.error('无效的选项格式:', option);
        return {
          content: '选项内容缺失',
          isCorrect: false
        };
      });

      // 确保至少有一个正确答案
      const hasCorrectAnswer = formattedOptions.some(option => option.isCorrect);
      if (!hasCorrectAnswer && formattedOptions.length > 0) {
        // 如果没有正确答案，将第一个选项标记为正确
        formattedOptions[0].isCorrect = true;
        console.log('没有正确答案，已将第一个选项标记为正确答案');
      }

      const formattedQuestion = {
        ...question,
        options: formattedOptions
      };

      // 添加调试日志
      console.log('格式化后的问题数据:', JSON.stringify(formattedQuestion, null, 2));

      return formattedQuestion;
    });

    // 过滤掉没有选项的题目
    const validQuestions = formattedQuestions.filter((q: Partial<Question>) => q.options && q.options.length > 0);

    if (validQuestions.length === 0) {
      return NextResponse.json({
        success: false,
        message: '没有找到有效的题目'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      questions: validQuestions,
    });
  } catch (error) {
    console.error('获取随机题目失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取随机题目失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
} 