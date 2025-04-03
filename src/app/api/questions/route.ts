import { NextRequest, NextResponse } from 'next/server';
import { validateQuestion } from '@/lib/validation';
import QuestionModel from '@/models/mongodb/Question';
import dbConnect from '@/lib/mongodb';
import { ZodError } from 'zod';

// GET /api/questions
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const difficulty = searchParams.get('difficulty');
    const tag = searchParams.get('tag');

    // 构建查询条件
    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    if (type) {
      query.type = type;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }
    if (tag) {
      query.tags = tag;
    }

    // 获取题目列表
    const questions = await QuestionModel.find(query).sort({ createdAt: -1 });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('获取题目列表失败:', error);
    return NextResponse.json(
      { success: false, message: '获取题目列表失败' },
      { status: 500 }
    );
  }
}

// POST /api/questions
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 验证数据
    try {
      validateQuestion(data);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { 
            success: false, 
            message: '验证失败',
            errors: error.errors.map(err => ({
              path: err.path.join('.'),
              message: err.message
            }))
          },
          { status: 400 }
        );
      }
      throw error;
    }

    // 创建题目
    await dbConnect();
    const question = await QuestionModel.create(data);

    return NextResponse.json(
      { success: true, data: { question } },
      { status: 201 }
    );
  } catch (error) {
    console.error('创建题目失败:', error);
    return NextResponse.json(
      { success: false, message: '创建题目失败' },
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
    
    const result = await QuestionModel.bulkWrite(operations);
    
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

    const result = await QuestionModel.bulkWrite(operations);
    
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