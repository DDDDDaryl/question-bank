import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Question from '@/models/mongodb/Question';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/apiResponse';
import { isValidObjectId } from '@/lib/objectId';

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

function validateQuestion(data: any): ValidationResult {
  if (!data) {
    return { isValid: false, message: "请求数据不能为空" };
  }

  // 验证必填字段
  const requiredFields = ['title', 'type', 'content', 'options', 'answer', 'difficulty'];
  for (const field of requiredFields) {
    if (!data[field]) {
      return { isValid: false, message: `${field} 字段是必需的` };
    }
  }

  // 验证选项数组
  if (!Array.isArray(data.options) || data.options.length < 2) {
    return { isValid: false, message: "选项至少需要2个" };
  }

  // 验证答案
  if (data.type === 'SINGLE_CHOICE') {
    if (!data.options.includes(data.answer)) {
      return { isValid: false, message: "单选题答案必须是选项之一" };
    }
  } else if (data.type === 'MULTIPLE_CHOICE') {
    if (!Array.isArray(data.answer) || !data.answer.every((ans: string) => data.options.includes(ans))) {
      return { isValid: false, message: "多选题答案必须是选项的子集" };
    }
  }

  return { isValid: true };
}

// GET /api/questions - 获取题目列表
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    const query: any = {};
    
    // 处理搜索参数
    const search = searchParams.get('search');
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    
    // 处理类型筛选
    const type = searchParams.get('type');
    if (type) {
      query.type = type;
    }
    
    // 处理难度筛选
    const difficulty = searchParams.get('difficulty');
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    // 处理标签筛选
    const tags = searchParams.get('tags');
    if (tags) {
      query.tags = { $in: tags.split(',').map(tag => tag.trim()) };
    }

    const questions = await Question.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      message: 'Success',
      data: { questions }
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch questions',
      },
      { status: 500 }
    );
  }
}

// POST /api/questions - 创建新题目
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // 验证请求数据
    const validationResult = validateQuestion(data);
    if (!validationResult) {
      return NextResponse.json(
        {
          success: false,
          message: "验证失败：无效的请求数据",
        },
        { status: 400 }
      );
    }
    
    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: validationResult.message || "验证失败",
        },
        { status: 400 }
      );
    }

    const question = await Question.create(data);
    
    return NextResponse.json({
      success: true,
      message: '题目创建成功',
      data: { question }
    });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create question',
      },
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