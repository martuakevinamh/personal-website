import { supabase } from '@/lib/supabase';
import {
  Experience,
  ExperienceImage,
  ExperienceImagePayload,
  ExperiencePayload,
  ExperienceWithImages,
} from '@/lib/types';

/**
 * Mengambil semua experience beserta gambar-gambarnya, diurutkan dari terbaru.
 * Digunakan oleh Experience section di halaman utama.
 */
export async function getExperiences(): Promise<ExperienceWithImages[]> {
  const { data, error } = await supabase
    .from('experiences')
    .select(`
      *,
      experience_images (*)
    `)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('[getExperiences] Error:', error.message);
    return [];
  }

  return (data ?? []).map((exp) => ({
    ...exp,
    experience_images: (exp.experience_images ?? []).sort(
      (a: ExperienceImage, b: ExperienceImage) => a.sort_order - b.sort_order
    ),
  }));
}

/**
 * Mengambil satu experience berdasarkan id (termasuk gambar).
 */
export async function getExperienceById(
  id: number
): Promise<ExperienceWithImages | null> {
  const { data, error } = await supabase
    .from('experiences')
    .select(`
      *,
      experience_images (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('[getExperienceById] Error:', error.message);
    return null;
  }

  return {
    ...data,
    experience_images: (data.experience_images ?? []).sort(
      (a: ExperienceImage, b: ExperienceImage) => a.sort_order - b.sort_order
    ),
  };
}

/**
 * Menambah experience baru. Digunakan oleh admin panel.
 */
export async function createExperience(
  payload: ExperiencePayload
): Promise<Experience | null> {
  const { data, error } = await supabase
    .from('experiences')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('[createExperience] Error:', error.message);
    return null;
  }

  return data;
}

/**
 * Mengupdate experience berdasarkan id. Digunakan oleh admin panel.
 */
export async function updateExperience(
  id: number,
  payload: Partial<ExperiencePayload>
): Promise<Experience | null> {
  const { data, error } = await supabase
    .from('experiences')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[updateExperience] Error:', error.message);
    return null;
  }

  return data;
}

/**
 * Menghapus experience berdasarkan id.
 * Gambar terkait terhapus otomatis (ON DELETE CASCADE).
 */
export async function deleteExperience(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[deleteExperience] Error:', error.message);
    return false;
  }

  return true;
}

// ============================================================
// Experience Images
// ============================================================

/**
 * Menambah gambar ke experience tertentu.
 */
export async function addExperienceImage(
  payload: ExperienceImagePayload
): Promise<ExperienceImage | null> {
  const { data, error } = await supabase
    .from('experience_images')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('[addExperienceImage] Error:', error.message);
    return null;
  }

  return data;
}

/**
 * Menghapus gambar experience berdasarkan id-nya.
 */
export async function deleteExperienceImage(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('experience_images')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[deleteExperienceImage] Error:', error.message);
    return false;
  }

  return true;
}

/**
 * Update posisi dan sort_order gambar experience.
 */
export async function updateExperienceImage(
  id: number,
  payload: Partial<ExperienceImagePayload>
): Promise<ExperienceImage | null> {
  const { data, error } = await supabase
    .from('experience_images')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[updateExperienceImage] Error:', error.message);
    return null;
  }

  return data;
}
