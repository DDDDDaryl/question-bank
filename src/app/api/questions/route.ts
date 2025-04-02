import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Question from '@/models/mongodb/Question';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/apiResponse';
import { validateQuestion } from '@/lib/validation';

// GET /api/questions - 获取题目列表
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const difficulty = searchParams.get('difficulty');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    // 构建查询条件
    const query: any = {};
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    // 获取题目列表
    const questions = await Question.find(query).sort({ createdAt: -1 });

    return successResponse({ questions });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

// POST /api/questions - 创建新题目
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // 获取请求数据
    const data = await request.json();

    // 验证数据
    const errors = validateQuestion(data);
    if (errors) {
      return validationErrorResponse(errors);
    }

    // 创建新题目
    const question = await Question.create(data);

    return successResponse({ question }, '题目创建成功');
  } catch (error) {
    return errorResponse(error as Error);
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