import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import QuestionModel from '@/models/mongodb/Question';

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

    return NextResponse.json({
      success: true,
      questions,
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