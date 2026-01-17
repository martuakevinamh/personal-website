import { supabase } from "@/lib/supabase";

export async function uploadImage(file: File, folder: string = "uploads"): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio") // Assuming bucket name is 'portfolio'
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from("portfolio")
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Upload exception:", error);
    return null;
  }
}
