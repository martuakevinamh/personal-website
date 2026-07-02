import { supabase } from '@/lib/supabase';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// ─── GET /api/experiences/[id]/images ─────────────────────────────────────
// Public: Ambil semua gambar dari experience tertentu
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId)) return errorResponse('Invalid id', 400);

  const { data, error } = await supabase
    .from('experience_images')
    .select('*')
    .eq('experience_id', numId)
    .order('sort_order', { ascending: true });

  if (error) return errorResponse(error.message, 500);
  return successResponse(data ?? []);
}

// ─── POST /api/experiences/[id]/images ────────────────────────────────────
// Protected: Tambah gambar ke experience tertentu
// Body: { src: string, position?: string, sort_order?: number }
export async function POST(request: NextRequest, { params }: Params) {
  const user = await requireAuth(request);
  if (!user) return errorResponse('Unauthorized', 401);

  const { id } = await params;
  const numId = Number(id);
  if (isNaN(numId)) return errorResponse('Invalid id', 400);

  try {
    const body = await request.json();
    const { src, position = 'center center', sort_order = 0 } = body;

    if (!src) return errorResponse('Missing required field: src');

    // Verifikasi experience exists
    const { error: expError } = await supabase
      .from('experiences')
      .select('id')
      .eq('id', numId)
      .single();

    if (expError) return errorResponse('Experience not found', 404);

    const { data, error } = await supabase
      .from('experience_images')
      .insert({ experience_id: numId, src, position, sort_order })
      .select()
      .single();

    if (error) return errorResponse(error.message);
    return successResponse(data, 201);
  } catch {
    return errorResponse('Invalid request body');
  }
}
