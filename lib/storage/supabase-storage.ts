import { createClient } from '@/lib/supabase/client';
import { StorageProvider, UploadResult } from './types';

export class SupabaseStorageProvider implements StorageProvider {
  private bucket: string;

  constructor(bucket: string = 'wedding-media') {
    this.bucket = bucket;
  }

  async uploadFile(file: File | Blob | Buffer, path: string, contentType: string): Promise<UploadResult> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from(this.bucket)
        .upload(path, file, {
          contentType,
          upsert: true,
        });

      if (error) {
        return { url: '', path, error: error.message };
      }

      const publicUrl = this.getPublicUrl(data.path);
      return { url: publicUrl, path: data.path };
    } catch (err: any) {
      return { url: '', path, error: err.message || 'Unknown upload error' };
    }
  }

  async deleteFile(path: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient();
      const { error } = await supabase.storage.from(this.bucket).remove([path]);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  getPublicUrl(path: string): string {
    const supabase = createClient();
    const { data } = supabase.storage.from(this.bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
