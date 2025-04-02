import { NextResponse } from 'next/server';

export function successResponse(data: any, message = 'Success') {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status: 200 }
  );
}

export function errorResponse(error: string | Error, status = 400) {
  const message = error instanceof Error ? error.message : error;
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status }
  );
}

export function notFoundResponse(message = 'Not Found') {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 404 }
  );
}

export function validationErrorResponse(errors: Record<string, string[]>) {
  return NextResponse.json(
    {
      success: false,
      message: 'Validation Error',
      errors,
    },
    { status: 422 }
  );
} 