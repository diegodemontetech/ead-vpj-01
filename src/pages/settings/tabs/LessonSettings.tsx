import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Plus, Trash, Upload } from 'lucide-react';
import { useSupabaseQuery } from '../../../hooks/useSupabaseQuery';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import { storageService } from '../../../services/storage.service';

const lessonSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string(),
  duration: z.number().min(1, 'Duração deve ser maior que 0'),
  module_id: z.string().min(1, 'Selecione um módulo'),
  required_for_completion: z.boolean().default(true),
  order_index: z.number().min(0),
});

type LessonFormData = z.infer<typeof lessonSchema>;

export function LessonSettings() {
  const [videoFile, setVideoFile] = React.useState<File | null>(null);
  const [videoPreview, setVideoPreview] = React.useState<string | null>(null);
  const [attachments, setAttachments] = React.useState<File[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedCourseId, setSelectedCourseId] = React.useState<string>('');
  const [isCreating, setIsCreating] = React.useState(false);

  const { data: courses } = useSupabaseQuery({
    key: ['courses'],
    query: () => supabase
      .from('courses')
      .select('*')
      .order('title'),
  });

  const { data: modules } = useSupabaseQuery({
    key: ['modules', selectedCourseId],
    query: () => supabase
      .from('modules')
      .select('*')
      .eq('course_id', selectedCourseId)
      .order('order_index'),
    enabled: !!selectedCourseId,
  });

  const { data: lessons, refetch: refetchLessons } = useSupabaseQuery({
    key: ['lessons'],
    query: () => supabase
      .from('lessons')
      .select(`
        *,
        module:modules(
          title,
          course:courses(title)
        )
      `)
      .order('created_at', { ascending: false }),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      required_for_completion: true,
      order_index: 0,
    },
  });

  const selectedModuleId = watch('module_id');

  const onVideoSelect = (file: File) => {
    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 50MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('video/')) {
      toast.error('Por favor, selecione um arquivo de vídeo válido');
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;
      
      toast.success('Aula excluída com sucesso!');
      refetchLessons();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir aula');
    }
  };

  const onSubmit = async (data: LessonFormData) => {
    try {
      setIsLoading(true);

      if (!videoFile) {
        toast.error('Por favor, selecione um vídeo para a aula');
        return;
      }

      // First create the lesson
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .insert({
          ...data,
          order_index: data.order_index || 0,
        })
        .select()
        .single();

      if (lessonError) throw lessonError;

      // Get course ID from module
      const { data: module } = await supabase
        .from('modules')
        .select('course_id')
        .eq('id', data.module_id)
        .single();

      if (!module) throw new Error('Módulo não encontrado');

      // Upload video to Supabase Storage
      const videoUrl = await storageService.uploadVideo(
        videoFile,
        module.course_id,
        lesson.id
      );

      // Update lesson with video URL
      const { error: updateError } = await supabase
        .from('lessons')
        .update({ video_url: videoUrl })
        .eq('id', lesson.id);

      if (updateError) throw updateError;

      // Upload attachments if any
      if (attachments.length > 0) {
        for (const file of attachments) {
          const fileExt = file.name.split('.').pop();
          const filePath = `lessons/${lesson.id}/attachments/${Date.now()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('lesson-attachments')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('lesson-attachments')
            .getPublicUrl(filePath);

          // Create attachment record
          const { error: attachmentError } = await supabase
            .from('attachments')
            .insert({
              lesson_id: lesson.id,
              title: file.name,
              url: publicUrl,
              type: fileExt === 'pdf' ? 'pdf' : 'doc',
              size: file.size,
            });

          if (attachmentError) throw attachmentError;
        }
      }

      toast.success('Aula criada com sucesso!');
      reset();
      setVideoFile(null);
      setVideoPreview(null);
      setAttachments([]);
      setIsCreating(false);
      refetchLessons();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar aula');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Lessons List */}
      <div className="bg-[#1F1F1F] rounded-lg shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-white">
              Aulas
            </h2>
            <button
              onClick={() => setIsCreating(true)}
              className="btn flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nova Aula
            </button>
          </div>

          <div className="space-y-4">
            {lessons?.map((lesson: any) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-4 bg-[#2F2F2F] rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-white">{lesson.title}</h3>
                  <p className="text-sm text-gray-400">
                    {lesson.module.course.title} - {lesson.module.title}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteLesson(lesson.id)}
                  className="p-2 text-red-500 hover:text-red-400"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Lesson Form */}
      {isCreating && (
        <div className="bg-[#1F1F1F] rounded-lg shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-white mb-6">
              Nova Aula
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Curso
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-[#2F2F2F] text-white shadow-sm focus:border-[#E50914] focus:ring-[#E50914]"
                  >
                    <option value="">Selecione um curso</option>
                    {courses?.map((course: any) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Módulo
                  </label>
                  <select
                    {...register('module_id')}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-[#2F2F2F] text-white shadow-sm focus:border-[#E50914] focus:ring-[#E50914]"
                    disabled={!selectedCourseId}
                  >
                    <option value="">Selecione um módulo</option>
                    {modules?.map((module: any) => (
                      <option key={module.id} value={module.id}>
                        {module.title}
                      </option>
                    ))}
                  </select>
                  {errors.module_id && (
                    <p className="mt-1 text-sm text-red-500">{errors.module_id.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Título da Aula
                  </label>
                  <input
                    type="text"
                    {...register('title')}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-[#2F2F2F] text-white shadow-sm focus:border-[#E50914] focus:ring-[#E50914]"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Descrição
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-[#2F2F2F] text-white shadow-sm focus:border-[#E50914] focus:ring-[#E50914]"
                  />
                </div>

                {/* Video Upload */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Vídeo da Aula
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      {videoPreview ? (
                        <video
                          src={videoPreview}
                          className="mx-auto h-48 w-auto"
                          controls
                        />
                      ) : (
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="flex text-sm text-gray-400">
                        <label className="relative cursor-pointer bg-[#2F2F2F] rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none">
                          <span>Selecionar vídeo</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) onVideoSelect(file);
                            }}
                          />
                        </label>
                        <p className="pl-1">ou arraste e solte</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        MP4, WebM até 50MB
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Duração (minutos)
                  </label>
                  <input
                    type="number"
                    {...register('duration', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-[#2F2F2F] text-white shadow-sm focus:border-[#E50914] focus:ring-[#E50914]"
                  />
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-500">{errors.duration.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Ordem
                  </label>
                  <input
                    type="number"
                    {...register('order_index', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-[#2F2F2F] text-white shadow-sm focus:border-[#E50914] focus:ring-[#E50914]"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('required_for_completion')}
                      className="h-4 w-4 text-[#E50914] focus:ring-[#E50914] border-gray-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-300">
                      Obrigatória para conclusão do módulo
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    reset();
                    setVideoFile(null);
                    setVideoPreview(null);
                    setAttachments([]);
                  }}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn flex items-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Criar Aula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}