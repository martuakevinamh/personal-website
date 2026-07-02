import { supabase } from '@/lib/supabase';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// ─── GET /api/projects/[id] ────────────────────────────────────────────────
// Public: Ambil satu project + gambar berdasarkan ID
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId)) return errorResponse('Invalid id', 400);

  const { data, error } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('id', numId)
    .single();

  if (error) return errorResponse(error.code === 'PGRST116' ? 'Not found' : error.message, error.code === 'PGRST116' ? 404 : 500);

  return successResponse(data);
}

// ─── PUT /api/projects/[id] ────────────────────────────────────────────────
// Protected: Update project berdasarkan ID
export async function PUT(request: NextRequest, { params }: Params) {
  const user = await requireAuth(request);
  if (!user) return errorResponse('Unauthorized', 401);

  const { id } = await params;
  const numId = Number(id);
  if (isNaN(numId)) return errorResponse('Invalid id', 400);

  try {
    const payload = await request.json();
    // Buang field yang tidak boleh diubah lewat API ini
    delete payload.id;
    delete payload.created_at;
    delete payload.project_images;

    if (Object.keys(payload).length === 0) {
      return errorResponse('No fields to update');
    }

    const { data, error } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', numId)
      .select()
      .single();

    if (error) return errorResponse(error.message);
    return successResponse(data);
  } catch {
    return errorResponse('Invalid request body');
  }
}

// ─── DELETE /api/projects/[id] ─────────────────────────────────────────────
// Protected: Hapus project + gambar terkait (CASCADE di DB)
export async function DELETE(request: NextRequest, { params }: Params) {
  const user = await requireAuth(request);
  if (!user) return errorResponse('Unauthorized', 401);

  const { id } = await params;
  const numId = Number(id);
  if (isNaN(numId)) return errorResponse('Invalid id', 400);

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', numId);

  if (error) return errorResponse(error.message);
  return successResponse({ deleted: true });
}
