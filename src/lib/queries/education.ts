import { supabase } from '@/lib/supabase';
import { Education } from '@/lib/types';

export async function getEducation(): Promise<Education[]> {
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[getEducation] Error:', error.message);
    return [];
  }

  return data || [];
}
