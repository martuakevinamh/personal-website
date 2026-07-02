import { supabase } from '@/lib/supabase';
import {
  Project,
  ProjectImage,
  ProjectImagePayload,
  ProjectPayload,
  ProjectWithImages,
} from '@/lib/types';

/**
 * Mengambil semua project beserta gambar-gambarnya.
 * Secara default diurutkan: featured dulu, lalu berdasarkan created_at terbaru.
 */
export async function getProjects(): Promise<ProjectWithImages[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_images (*)
    `)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getProjects] Error:', error.message);
    return [];
  }

  return (data ?? []).map((proj) => ({
    ...proj,
    project_images: (proj.project_images ?? []).sort(
      (a: ProjectImage, b: ProjectImage) => a.sort_order - b.sort_order
    ),
  }));
}

/**
 * Mengambil project yang sedang berjalan (status = 'ongoing').
 */
export async function getOngoingProjects(): Promise<ProjectWithImages[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_images (*)
    `)
    .eq('status', 'ongoing')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getOngoingProjects] Error:', error.message);
    return [];
  }

  return (data ?? []).map((proj) => ({
    ...proj,
    project_images: (proj.project_images ?? []).sort(
      (a: ProjectImage, b: ProjectImage) => a.sort_order - b.sort_order
    ),
  }));
}

/**
 * Mengambil project yang sudah selesai (status = 'completed').
 */
export async function getCompletedProjects(): Promise<ProjectWithImages[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_images (*)
    `)
    .eq('status', 'completed')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getCompletedProjects] Error:', error.message);
    return [];
  }

  return (data ?? []).map((proj) => ({
    ...proj,
    project_images: (proj.project_images ?? []).sort(
      (a: ProjectImage, b: ProjectImage) => a.sort_order - b.sort_order
    ),
  }));
}

/**
 * Mengambil project yang ditandai featured.
 */
export async function getFeaturedProjects(): Promise<ProjectWithImages[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_images (*)
    `)
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getFeaturedProjects] Error:', error.message);
    return [];
  }

  return (data ?? []).map((proj) => ({
    ...proj,
    project_images: (proj.project_images ?? []).sort(
      (a: ProjectImage, b: ProjectImage) => a.sort_order - b.sort_order
    ),
  }));
}

/**
 * Mengambil satu project berdasarkan id (termasuk gambar).
 */
export async function getProjectById(
  id: number
): Promise<ProjectWithImages | null> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_images (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('[getProjectById] Error:', error.message);
    return null;
  }

  return {
    ...data,
    project_images: (data.project_images ?? []).sort(
      (a: ProjectImage, b: ProjectImage) => a.sort_order - b.sort_order
    ),
  };
}

/**
 * Menambah project baru. Digunakan oleh admin panel.
 */
export async function createProject(
  payload: ProjectPayload
): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('[createProject] Error:', error.message);
    return null;
  }

  return data;
}

/**
 * Mengupdate project berdasarkan id. Digunakan oleh admin panel.
 */
export async function updateProject(
  id: number,
  payload: Partial<ProjectPayload>
): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[updateProject] Error:', error.message);
    return null;
  }

  return data;
}

/**
 * Menghapus project berdasarkan id.
 * Gambar terkait terhapus otomatis (ON DELETE CASCADE).
 */
export async function deleteProject(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[deleteProject] Error:', error.message);
    return false;
  }

  return true;
}

// ============================================================
// Project Images
// ============================================================

/**
 * Menambah gambar ke project tertentu.
 */
export async function addProjectImage(
  payload: ProjectImagePayload
): Promise<ProjectImage | null> {
  const { data, error } = await supabase
    .from('project_images')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('[addProjectImage] Error:', error.message);
    return null;
  }

  return data;
}

/**
 * Menghapus gambar project berdasarkan id-nya.
 */
export async function deleteProjectImage(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('project_images')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[deleteProjectImage] Error:', error.message);
    return false;
  }

  return true;
}

/**
 * Update metadata gambar project (posisi, zoom, sort_order).
 */
export async function updateProjectImage(
  id: number,
  payload: Partial<ProjectImagePayload>
): Promise<ProjectImage | null> {
  const { data, error } = await supabase
    .from('project_images')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[updateProjectImage] Error:', error.message);
    return null;
  }

  return data;
}
