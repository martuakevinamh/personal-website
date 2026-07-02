import { supabase } from '@/lib/supabase';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { NextRequest } from 'next/server';

// ─── GET /api/skills ──────────────────────────────────────────────────────
// Public: Ambil semua skill
// Query params: ?category=Frontend|Backend+%26+AI|Tools+%26+Others
export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category');

  let query = supabase
    .from('skills')
    .select('*')
    .order('sort_order', { ascending: true });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) return errorResponse(error.message, 500);

  return successResponse(data ?? []);
}

// ─── POST /api/skills ─────────────────────────────────────────────────────
// Protected: Tambah skill baru
// Body: { name, category, sort_order? }
export async function POST(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) return errorResponse('Unauthorized', 401);

  try {
    const body = await request.json();
    const { name, category, sort_order = 0 } = body;

    if (!name || !category) {
      return errorResponse('Missing required fields: name, category');
    }

    const validCategories = ['Frontend', 'Backend & AI', 'Tools & Others'];
    if (!validCategories.includes(category)) {
      return errorResponse(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
    }

    const { data, error } = await supabase
      .from('skills')
      .insert({ name, category, sort_order })
      .select()
      .single();

    if (error) return errorResponse(error.message);
    return successResponse(data, 201);
  } catch {
    return errorResponse('Invalid request body');
  }
}
