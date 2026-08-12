import { supabase } from '@/lib/supabase';
import { Personal } from '@/lib/types';

/**
 * Mengambil data personal pemilik website (baris pertama/tunggal).
 * Digunakan oleh Hero, About, dan Contact sections.
 */
export async function getPersonal(): Promise<Personal | null> {
  const { data, error } = await supabase
    .from('personal')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[getPersonal] Error:', error.message);
    return null;
  }

  return data;
}
