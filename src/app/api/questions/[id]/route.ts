import { NextRequest, NextResponse } from 'next/server';
import { validateQuestion } from '@/lib/validation';
import QuestionModel from '@/models/mongodb/Question';
import dbConnect from '@/lib/mongodb';
import { ZodError } from 'zod';

// 辅助函数：返回验证错误响应
function validationErrorResponse(error: ZodError) {
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

// 辅助函数：返回成功响应
function successResponse(data: any) {
  return NextResponse.json(
    { success: true, data },
    { status: 200 }
  );
}

// 辅助函数：返回错误响应
function errorResponse(message: string, status: number = 500) {
  return NextResponse.json(
    { success: false, message },
    { status }
  );
}

// GET /api/questions/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const question = await QuestionModel.findById(params.id);
    
    if (!question) {
      return errorResponse('题目不存在', 404);
    }

    return successResponse({ question });
  } catch (error) {
    console.error('获取题目失败:', error);
    return errorResponse('获取题目失败');
  }
}

// PATCH /api/questions/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    // 验证数据
    try {
      validateQuestion(data);
    } catch (error) {
      if (error instanceof ZodError) {
        return validationErrorResponse(error);
      }
      throw error;
    }

    // 更新题目
    await dbConnect();
    const question = await QuestionModel.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true }
    );

    if (!question) {
      return errorResponse('题目不存在', 404);
    }

    return successResponse({ question });
  } catch (error) {
    console.error('更新题目失败:', error);
    return errorResponse('更新题目失败');
  }
}

// DELETE /api/questions/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const question = await QuestionModel.findByIdAndDelete(params.id);

    if (!question) {
      return errorResponse('题目不存在', 404);
    }

    return successResponse({ message: '删除成功' });
  } catch (error) {
    console.error('删除题目失败:', error);
    return errorResponse('删除题目失败');
  }
} 