import { supabase } from '@/lib/supabase';
import { Skill, SkillPayload, SkillsByCategory } from '@/lib/types';

/**
 * Mengambil semua skill, diurutkan berdasarkan sort_order.
 */
export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[getSkills] Error:', error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Mengambil skill dan mengelompokkannya per kategori.
 * Digunakan oleh Skills section di halaman utama.
 * Contoh output: { 'Frontend': [...], 'Backend & AI': [...] }
 */
export async function getSkillsByCategory(): Promise<SkillsByCategory> {
  const skills = await getSkills();

  return skills.reduce<SkillsByCategory>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});
}

/**
 * Menambah skill baru. Digunakan oleh admin panel.
 */
export async function createSkill(payload: SkillPayload): Promise<Skill | null> {
  const { data, error } = await supabase
    .from('skills')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('[createSkill] Error:', error.message);
    return null;
  }

  return data;
}

/**
 * Mengupdate skill berdasarkan id. Digunakan oleh admin panel.
 */
export async function updateSkill(
  id: number,
  payload: Partial<SkillPayload>
): Promise<Skill | null> {
  const { data, error } = await supabase
    .from('skills')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[updateSkill] Error:', error.message);
    return null;
  }

  return data;
}

/**
 * Menghapus skill berdasarkan id. Digunakan oleh admin panel.
 */
export async function deleteSkill(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[deleteSkill] Error:', error.message);
    return false;
  }

  return true;
}

/**
 * Update urutan sort_order dari banyak skill sekaligus.
 * Digunakan untuk drag-and-drop reorder di admin panel.
 */
export async function reorderSkills(
  updates: { id: number; sort_order: number }[]
): Promise<boolean> {
  const promises = updates.map(({ id, sort_order }) =>
    supabase.from('skills').update({ sort_order }).eq('id', id)
  );

  const results = await Promise.all(promises);
  const hasError = results.some(({ error }) => error !== null);

  if (hasError) {
    console.error('[reorderSkills] Error: one or more updates failed');
    return false;
  }

  return true;
}
