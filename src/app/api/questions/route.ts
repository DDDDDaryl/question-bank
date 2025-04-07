import { NextRequest, NextResponse } from 'next/server';
import { validateQuestion } from '@/lib/validation';
import { Question } from '@/models/mongodb/Question';
import dbConnect from '@/lib/mongodb';
import { ZodError } from 'zod';
import { withAuth } from '@/lib/auth';
import jwt from 'jsonwebtoken';
import { UserModel } from '@/models/mongodb/User';
import { getToken } from '@/lib/auth';

// GET /api/questions
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    let query: any = {};
    if (tag) {
      query.tags = tag;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [questions, total] = await Promise.all([
      Question.find(query).skip(skip).limit(limit),
      Question.countDocuments(query),
    ]);

    if (!questions || questions.length === 0) {
      return NextResponse.json({
        questions: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      });
    }

    // 确保每个问题的选项都有正确的结构
    const formattedQuestions = questions.map(question => {
      const formattedOptions = question.options.map((option: any) => {
        // 如果选项已经是正确的格式，直接返回
        if (option && typeof option === 'object' && 'content' in option && 'isCorrect' in option) {
          return option;
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
        ...question.toObject(),
        options: formattedOptions
      };
    });

    return NextResponse.json({
      questions: formattedQuestions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('获取题目失败:', error);
    return NextResponse.json(
      { error: '获取题目失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}

// POST /api/questions
export async function POST(req: NextRequest) {
  try {
    const db = await dbConnect();
    if (!db.connection.readyState) {
      throw new Error('数据库连接失败');
    }
    
    const token = await getToken();
    if (!token) {
      return NextResponse.json(
        { message: '未授权' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const validatedData = validateQuestion(data);
    const question = await Question.create({
      ...validatedData,
      createdBy: token._id
    });

    return NextResponse.json({
      message: '创建成功',
      question,
    });
  } catch (error) {
    console.error('创建题目失败:', error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: '数据验证失败', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: '创建题目失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}

// PUT /api/questions - 批量更新题目
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { questions } = body;
    
    if (!Array.isArray(questions)) {
      throw new Error('请求体必须包含题目数组');
    }
    
    const operations = questions.map(question => ({
      updateOne: {
        filter: { _id: question._id },
        update: { $set: question },
        upsert: true
      }
    }));
    
    const result = await Question.bulkWrite(operations);
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    const operations = data.map((update: any) => ({
      updateOne: {
        filter: { _id: update._id },
        update: { $set: update }
      }
    }));

    const result = await Question.bulkWrite(operations);
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error updating questions:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update questions',
      },
      { status: 500 }
    );
  }
} 