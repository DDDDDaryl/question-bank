import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    return successResponse({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    return errorResponse(error as Error);
  }
} 