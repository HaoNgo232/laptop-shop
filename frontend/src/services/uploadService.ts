import { apiClient } from '@/services/api';

class UploadService {
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return await apiClient.upload<{ url: string }>(
      '/api/admin/upload',
      formData,
    );
  }
}

export const uploadService = new UploadService();
