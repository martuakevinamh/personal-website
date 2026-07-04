import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { uploadImage, deleteImage } from '@/lib/storage';
import { NextRequest } from 'next/server';

/**
 * POST /api/upload — Protected: Upload gambar ke Supabase Storage
 * Body: FormData dengan field 'file' (File) dan 'folder' (string, opsional)
 *
 * Response: { data: { url: string }, error: null }
 */
export async function POST(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) return errorResponse('Unauthorized', 401);

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) return errorResponse('Missing field: file');

    // Validasi tipe file — hanya gambar raster (SVG dilarang karena bisa mengandung JS/XSS)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return errorResponse('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
    }

    // Validasi ukuran — max 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return errorResponse('File too large. Maximum size is 5MB.');
    }

    const url = await uploadImage(file, folder);
    if (!url) return errorResponse('Failed to upload image', 500);

    return successResponse({ url }, 201);
  } catch {
    return errorResponse('Invalid request', 500);
  }
}

/**
 * DELETE /api/upload — Protected: Hapus gambar dari Supabase Storage
 * Body: JSON { url: string }
 *
 * Response: { data: { deleted: true }, error: null }
 */
export async function DELETE(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) return errorResponse('Unauthorized', 401);

  try {
    const body = await request.json();
    const { url } = body;

    if (!url) return errorResponse('Missing field: url');

    const success = await deleteImage(url);
    if (!success) return errorResponse('Failed to delete image', 500);

    return successResponse({ deleted: true });
  } catch {
    return errorResponse('Invalid request body');
  }
}
