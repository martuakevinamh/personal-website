import { supabase } from '@/lib/supabase';

const BUCKET = 'portfolio';

/**
 * Upload file gambar ke Supabase Storage bucket 'portfolio'.
 * Mengembalikan public URL gambar atau null jika gagal.
 *
 * @param file - File yang akan diupload
 * @param folder - Subfolder dalam bucket (default: 'uploads')
 */
export async function uploadImage(
  file: File,
  folder: string = 'uploads'
): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file);

    if (uploadError) {
      console.error('[uploadImage] Error uploading:', uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error('[uploadImage] Exception:', error);
    return null;
  }
}

/**
 * Hapus file dari Supabase Storage berdasarkan public URL-nya.
 * Mengembalikan true jika berhasil, false jika gagal.
 *
 * @param publicUrl - Public URL gambar yang ingin dihapus
 */
export async function deleteImage(publicUrl: string): Promise<boolean> {
  try {
    // Ekstrak path file dari public URL
    // Format URL: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
    const url = new URL(publicUrl);
    const pathSegments = url.pathname.split(`/object/public/${BUCKET}/`);

    if (pathSegments.length < 2) {
      console.error('[deleteImage] Invalid URL format, cannot extract path:', publicUrl);
      return false;
    }

    const filePath = decodeURIComponent(pathSegments[1]);
    const { error } = await supabase.storage.from(BUCKET).remove([filePath]);

    if (error) {
      console.error('[deleteImage] Error deleting:', error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[deleteImage] Exception:', error);
    return false;
  }
}

/**
 * Upload multiple gambar sekaligus dan kembalikan array public URLs.
 * Gambar yang gagal diupload akan di-skip (null tidak dimasukkan ke hasil).
 *
 * @param files - Array File yang akan diupload
 * @param folder - Subfolder dalam bucket
 */
export async function uploadImages(
  files: File[],
  folder: string = 'uploads'
): Promise<string[]> {
  const results = await Promise.all(files.map((file) => uploadImage(file, folder)));
  return results.filter((url): url is string => url !== null);
}

/**
 * Dapatkan public URL dari sebuah path dalam bucket.
 * Berguna untuk membangun URL dari path yang tersimpan di database.
 *
 * @param filePath - Path file di dalam bucket (contoh: 'projects/image.jpg')
 */
export function getPublicUrl(filePath: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}
