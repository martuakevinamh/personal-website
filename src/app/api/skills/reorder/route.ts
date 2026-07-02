import { supabase } from '@/lib/supabase';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { NextRequest } from 'next/server';

// ─── POST /api/skills/reorder ─────────────────────────────────────────────
// Protected: Update sort_order banyak skill sekaligus (untuk drag-and-drop)
// Body: { updates: Array<{ id: number, sort_order: number }> }
export async function POST(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) return errorResponse('Unauthorized', 401);

  try {
    const body = await request.json();
    const { updates } = body as { updates: { id: number; sort_order: number }[] };

    if (!Array.isArray(updates) || updates.length === 0) {
      return errorResponse('Missing or empty field: updates');
    }

    // Validasi setiap item
    for (const item of updates) {
      if (typeof item.id !== 'number' || typeof item.sort_order !== 'number') {
        return errorResponse('Each update must have numeric id and sort_order');
      }
    }

    // Jalankan semua update secara paralel
    const promises = updates.map(({ id, sort_order }) =>
      supabase.from('skills').update({ sort_order }).eq('id', id)
    );

    const results = await Promise.all(promises);
    const failed = results.filter(({ error }) => error !== null);

    if (failed.length > 0) {
      return errorResponse(`${failed.length} update(s) failed`, 500);
    }

    return successResponse({ reordered: updates.length });
  } catch {
    return errorResponse('Invalid request body');
  }
}
