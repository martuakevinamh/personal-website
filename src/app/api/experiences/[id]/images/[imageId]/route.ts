import { supabase } from '@/lib/supabase';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string; imageId: string }> };

// ─── PUT /api/experiences/[id]/images/[imageId] ───────────────────────────
// Protected: Update metadata gambar (position, sort_order)
export async function PUT(request: NextRequest, { params }: Params) {
  const user = await requireAuth(request);
  if (!user) return errorResponse('Unauthorized', 401);

  const { id, imageId } = await params;
  const numId = Number(id);
  const numImageId = Number(imageId);

  if (isNaN(numId) || isNaN(numImageId)) return errorResponse('Invalid id', 400);

  try {
    const payload = await request.json();
    delete payload.id;
    delete payload.created_at;
    delete payload.experience_id;

    if (Object.keys(payload).length === 0) {
      return errorResponse('No fields to update');
    }

    const { data, error } = await supabase
      .from('experience_images')
      .update(payload)
      .eq('id', numImageId)
      .eq('experience_id', numId) // Pastikan gambar memang milik experience ini
      .select()
      .single();

    if (error) return errorResponse(error.message);
    return successResponse(data);
  } catch {
    return errorResponse('Invalid request body');
  }
}

// ─── DELETE /api/experiences/[id]/images/[imageId] ────────────────────────
// Protected: Hapus gambar dari experience
export async function DELETE(request: NextRequest, { params }: Params) {
  const user = await requireAuth(request);
  if (!user) return errorResponse('Unauthorized', 401);

  const { id, imageId } = await params;
  const numId = Number(id);
  const numImageId = Number(imageId);

  if (isNaN(numId) || isNaN(numImageId)) return errorResponse('Invalid id', 400);

  const { error } = await supabase
    .from('experience_images')
    .delete()
    .eq('id', numImageId)
    .eq('experience_id', numId); // Pastikan gambar memang milik experience ini

  if (error) return errorResponse(error.message);
  return successResponse({ deleted: true });
}
