import { NextRequest, NextResponse } from 'next/server';
import { validateQuestion } from '@/lib/validation';
import { Question } from '@/models/Question';
import dbConnect from '@/lib/mongodb';
import { ZodError } from 'zod';
import { withAuth } from '@/lib/auth';
import jwt from 'jsonwebtoken';
import { User } from '@/models/User';
import { getToken } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';

// GET /api/questions
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const questions = await Question.find().populate('createdBy', 'username');
    return NextResponse.json(questions);
  } catch (error) {
    console.error('获取题目失败:', error);
    return NextResponse.json({ error: '获取题目失败' }, { status: 500 });
  }
}

// POST /api/questions
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const data = await req.json();
    const validatedData = validateQuestion(data);
    const question = await Question.create({
      ...validatedData,
      createdBy: token._id
    });
    return NextResponse.json(question);
  } catch (error) {
    console.error('创建题目失败:', error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: '数据验证失败', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: '创建题目失败' }, { status: 500 });
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