export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

export interface StorageProvider {
  uploadFile(file: File | Blob | Buffer, path: string, contentType: string): Promise<UploadResult>;
  deleteFile(path: string): Promise<{ success: boolean; error?: string }>;
  getPublicUrl(path: string): string;
}
