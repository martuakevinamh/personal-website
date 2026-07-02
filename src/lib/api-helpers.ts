import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Validasi sesi Supabase dari Authorization header (Bearer token).
 * Gunakan di API routes yang butuh autentikasi admin.
 *
 * Contoh:
 *   const user = await requireAuth(request);
 *   if (!user) return errorResponse('Unauthorized', 401);
 */
export async function requireAuth(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) return null;
  return data.user;
}

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
