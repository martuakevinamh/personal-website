import { NextResponse } from 'next/server';

/**
 * Standar response sukses — { data: T, error: null }
 */
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ data, error: null }, { status });
}

/**
 * Standar response error — { data: null, error: string }
 */
export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ data: null, error: message }, { status });
}
