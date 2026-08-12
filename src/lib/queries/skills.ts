import { supabase } from '@/lib/supabase';
import { Skill, SkillsByCategory } from '@/lib/types';

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
