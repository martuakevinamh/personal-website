import { supabase } from '@/lib/supabase';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { NextRequest } from 'next/server';
import { getPersonal } from '@/lib/queries/personal';

// GET /api/personal — Public: Ambil data personal
export async function GET() {
  const personal = await getPersonal();

  if (!personal) {
    return errorResponse('Personal data not found', 404);
  }

  return successResponse(personal);
}

// PUT /api/personal — Protected: Update data personal (admin only)
export async function PUT(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) {
    return errorResponse('Unauthorized', 401);
  }

  try {
    const body = await request.json();
    const id = body.id;
    const payload = { ...body };
    delete payload.id;
    delete payload.created_at;

    if (!id) {
      return errorResponse('Missing required field: id');
    }

    const { data, error } = await supabase
      .from('personal')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message);
    }

    return successResponse(data);
  } catch {
    return errorResponse('Invalid request body');
  }
}
