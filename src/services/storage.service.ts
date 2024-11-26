import { supabase } from '../lib/supabase';

const THUMBNAIL_BUCKET = 'thumbnails';
const VIDEO_BUCKET = 'videos';
const ATTACHMENT_BUCKET = 'attachments';

export const storageService = {
  async createBucketIfNotExists(bucketName: string) {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === bucketName);

      if (!bucketExists) {
        const { error } = await supabase.storage.createBucket(bucketName, {
          public: true,
          allowedMimeTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'video/mp4',
            'video/webm',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ],
          fileSizeLimit: 50 * 1024 * 1024 // 50MB
        });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error creating bucket:', error);
      throw error;
    }
  },

  async uploadCourseThumbnail(file: File, courseId: string) {
    try {
      await this.createBucketIfNotExists(THUMBNAIL_BUCKET);

      const fileExt = file.name.split('.').pop();
      const filePath = `${courseId}/thumbnail.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(THUMBNAIL_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(THUMBNAIL_BUCKET)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      throw new Error('Erro ao fazer upload da imagem');
    }
  },

  async uploadVideo(file: File, courseId: string, lessonId: string) {
    try {
      await this.createBucketIfNotExists(VIDEO_BUCKET);

      const fileExt = file.name.split('.').pop();
      const filePath = `${courseId}/${lessonId}/video.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(VIDEO_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(VIDEO_BUCKET)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new Error('Erro ao fazer upload do vídeo');
    }
  },

  async uploadAttachment(file: File, courseId: string, lessonId: string) {
    try {
      await this.createBucketIfNotExists(ATTACHMENT_BUCKET);

      const fileExt = file.name.split('.').pop();
      const filePath = `${courseId}/${lessonId}/attachments/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(ATTACHMENT_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(ATTACHMENT_BUCKET)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw new Error('Erro ao fazer upload do arquivo');
    }
  },

  async deleteFile(bucketName: string, path: string) {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([path]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Erro ao excluir arquivo');
    }
  },

  getVideoUrl(courseId: string, lessonId: string) {
    const { data: { publicUrl } } = supabase.storage
      .from(VIDEO_BUCKET)
      .getPublicUrl(`${courseId}/${lessonId}/video.mp4`);

    return publicUrl;
  }
};