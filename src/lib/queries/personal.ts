import { supabase } from '@/lib/supabase';
import { Personal, PersonalPayload } from '@/lib/types';

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

/**
 * Update sebagian atau seluruh data personal berdasarkan id.
 * Digunakan oleh admin panel.
 */
export async function updatePersonal(
  id: number,
  payload: Partial<PersonalPayload>
): Promise<Personal | null> {
  const { data, error } = await supabase
    .from('personal')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[updatePersonal] Error:', error.message);
    return null;
  }

  return data;
}

/**
 * Upsert data personal — insert jika belum ada, update jika sudah ada.
 * Digunakan untuk inisialisasi data pertama kali.
 */
export async function upsertPersonal(
  payload: PersonalPayload
): Promise<Personal | null> {
  const { data, error } = await supabase
    .from('personal')
    .upsert(payload)
    .select()
    .single();

  if (error) {
    console.error('[upsertPersonal] Error:', error.message);
    return null;
  }

  return data;
}
