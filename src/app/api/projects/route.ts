import { supabase } from '@/lib/supabase';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { NextRequest } from 'next/server';

// ─── GET /api/projects ────────────────────────────────────────────────────
// Public: Ambil semua project beserta gambar-gambarnya
// Query params: ?status=ongoing|completed  ?featured=true
export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get('status');
  const featured = request.nextUrl.searchParams.get('featured');

  let query = supabase
    .from('projects')
    .select('*, project_images(*)')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (status === 'ongoing' || status === 'completed') {
    query = query.eq('status', status);
  }

  if (featured === 'true') {
    query = query.eq('featured', true);
  }

  const { data, error } = await query;
  if (error) return errorResponse(error.message, 500);

  return successResponse(data ?? []);
}

// ─── POST /api/projects ───────────────────────────────────────────────────
// Protected: Tambah project baru
// Body: { title, description?, tags?, demo_url?, github_url?, featured?, status? }
export async function POST(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) return errorResponse('Unauthorized', 401);

  try {
    const body = await request.json();
    const { title, description, tags, demo_url, github_url, featured, status } = body;

    if (!title) return errorResponse('Missing required field: title');

    if (status && !['ongoing', 'completed'].includes(status)) {
      return errorResponse('Invalid status. Must be "ongoing" or "completed"');
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        title,
        description,
        tags: tags ?? [],
        demo_url,
        github_url,
        featured: featured ?? false,
        status,
      })
      .select()
      .single();

    if (error) return errorResponse(error.message);
    return successResponse(data, 201);
  } catch {
    return errorResponse('Invalid request body');
  }
}
