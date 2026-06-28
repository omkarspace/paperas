import { createClient } from "@supabase/supabase-js";

const BUCKET_NAME = "papers";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function uploadPDF(file: Buffer, key: string): Promise<string> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(key, file, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(key);

  return urlData.publicUrl;
}

export async function getPresignedUploadUrl(key: string, _contentType: string): Promise<string> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUploadUrl(key);

  if (error) throw error;

  return data.signedUrl;
}

export function generateS3Key(userId: string, filename: string): string {
  const timestamp = Date.now();
  const sanitized = filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 100);
  return `${userId}/${timestamp}-${sanitized}`;
}
