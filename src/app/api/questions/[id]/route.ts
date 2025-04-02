import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Question from '@/models/mongodb/Question';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationErrorResponse,
} from '@/lib/apiResponse';
import { validateQuestion } from '@/lib/validation';
import { isValidObjectId, toObjectId } from '@/lib/objectId';

// GET /api/questions/[id] - 获取单个题目
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // 验证 ID 格式
    if (!isValidObjectId(params.id)) {
      return notFoundResponse('题目不存在');
    }

    // 获取题目
    const question = await Question.findById(toObjectId(params.id));
    if (!question) {
      return notFoundResponse('题目不存在');
    }

    return successResponse({ question });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

// PATCH /api/questions/[id] - 更新单个题目
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // 验证 ID 格式
    if (!isValidObjectId(params.id)) {
      return notFoundResponse('题目不存在');
    }

    // 获取请求数据
    const data = await request.json();

    // 验证数据
    const errors = validateQuestion(data);
    if (errors) {
      return validationErrorResponse(errors);
    }

    // 更新题目
    const question = await Question.findByIdAndUpdate(
      toObjectId(params.id),
      data,
      { new: true }
    );

    if (!question) {
      return notFoundResponse('题目不存在');
    }

    return successResponse({ question }, '题目更新成功');
  } catch (error) {
    return errorResponse(error as Error);
  }
}

// DELETE /api/questions/[id] - 删除单个题目
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // 验证 ID 格式
    if (!isValidObjectId(params.id)) {
      return notFoundResponse('题目不存在');
    }

    // 删除题目
    const question = await Question.findByIdAndDelete(toObjectId(params.id));
    if (!question) {
      return notFoundResponse('题目不存在');
    }

    return successResponse({ question }, '题目删除成功');
  } catch (error) {
    return errorResponse(error as Error);
  }
} 