// ============================================================
// Database Table Types (mirrors supabase_schema.sql)
// ============================================================

export interface Personal {
  id: number;
  name: string;
  role: string | null;
  bio: string | null;
  location: string | null;
  email: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  resume_url: string | null;
  profile_images: { src: string; position?: string; zoom?: number }[] | null;
  stats: { label: string; value: string }[] | null;
  created_at: string;
}

export interface Skill {
  id: number;
  name: string;
  category: 'Frontend' | 'Backend & AI' | 'Tools & Others' | string;
  sort_order: number;
  created_at: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  start_year: string;
  end_year: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Experience {
  id: number;
  title: string;
  organization: string;
  type: 'organization' | 'committee' | string;
  start_date: string | null;
  end_date: string | null; // NULL = "Sekarang" / Present
  description: string | null;
  created_at: string;
}

export interface ExperienceImage {
  id: number;
  experience_id: number;
  src: string;
  position: string;
  zoom: number;
  sort_order: number;
  created_at: string;
}

export interface Project {
  id: number;
  title: string;
  description: string | null;
  tags: string[] | null;
  demo_url: string | null;
  github_url: string | null;
  featured: boolean;
  status: 'ongoing' | 'completed' | null;
  created_at: string;
}

export interface ProjectImage {
  id: number;
  project_id: number;
  src: string;
  position: string;
  zoom: number;
  sort_order: number;
  created_at: string;
}

// ============================================================
// Extended Types with Relations (Joined Queries)
// ============================================================

export interface ExperienceWithImages extends Experience {
  experience_images: ExperienceImage[];
}

export interface ProjectWithImages extends Project {
  project_images: ProjectImage[];
}

// ============================================================
// Utility / Grouped Types
// ============================================================

export type SkillsByCategory = Record<string, Skill[]>;

// ============================================================
// Payload Types (for create / update operations — no id/created_at)
// ============================================================

export type PersonalPayload = Omit<Personal, 'id' | 'created_at'>;
export type SkillPayload = Omit<Skill, 'id' | 'created_at'>;
export type EducationPayload = Omit<Education, 'id' | 'created_at'>;
export type ExperiencePayload = Omit<Experience, 'id' | 'created_at'>;
export type ExperienceImagePayload = Omit<ExperienceImage, 'id' | 'created_at'>;
export type ProjectPayload = Omit<Project, 'id' | 'created_at'>;
export type ProjectImagePayload = Omit<ProjectImage, 'id' | 'created_at'>;

// ============================================================
// Generic API Response Wrapper
// ============================================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
