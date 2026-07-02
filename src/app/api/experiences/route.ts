import { supabase } from '@/lib/supabase';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { NextRequest } from 'next/server';

// ─── GET /api/experiences ─────────────────────────────────────────────────
// Public: Ambil semua experience beserta gambar-gambarnya
// Query params: ?type=organization|committee
export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type');

  let query = supabase
    .from('experiences')
    .select('*, experience_images(*)')
    .order('start_date', { ascending: false });

  if (type === 'organization' || type === 'committee') {
    query = query.eq('type', type);
  }

  const { data, error } = await query;
  if (error) return errorResponse(error.message, 500);

  return successResponse(data ?? []);
}

// ─── POST /api/experiences ────────────────────────────────────────────────
// Protected: Tambah experience baru
// Body: { title, organization, type, start_date?, end_date?, description? }
export async function POST(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) return errorResponse('Unauthorized', 401);

  try {
    const body = await request.json();
    const { title, organization, type, start_date, end_date, description } = body;

    if (!title || !organization || !type) {
      return errorResponse('Missing required fields: title, organization, type');
    }

    if (!['organization', 'committee'].includes(type)) {
      return errorResponse('Invalid type. Must be "organization" or "committee"');
    }

    const { data, error } = await supabase
      .from('experiences')
      .insert({ title, organization, type, start_date, end_date, description })
      .select()
      .single();

    if (error) return errorResponse(error.message);
    return successResponse(data, 201);
  } catch {
    return errorResponse('Invalid request body');
  }
}
