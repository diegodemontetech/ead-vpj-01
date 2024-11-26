import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Plus, Trash, Upload } from 'lucide-react';
import { useSupabaseQuery } from '../../../hooks/useSupabaseQuery';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';

const courseSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  category: z.string().min(1, 'Selecione uma categoria'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.number().min(1, 'Duração deve ser maior que 0'),
});

type CourseFormData = z.infer<typeof courseSchema>;

export function CourseSettings() {
  const [thumbnail, setThumbnail] = React.useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);

  const { data: courses, refetch: refetchCourses } = useSupabaseQuery({
    key: ['courses'],
    query: () => supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      duration: 0,
      level: 'beginner',
    },
  });

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
      
      toast.success('Curso excluído com sucesso!');
      refetchCourses();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir curso');
    }
  };

  const onSubmit = async (data: CourseFormData) => {
    try {
      setIsLoading(true);

      // First create the course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          ...data,
          prerequisites: [],
          students_count: 0,
          rating: 0,
        })
        .select()
        .single();

      if (courseError) throw courseError;

      // If there's a thumbnail, upload it
      if (thumbnail && course) {
        const fileExt = thumbnail.name.split('.').pop();
        const filePath = `courses/${course.id}/thumbnail.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('course-thumbnails')
          .upload(filePath, thumbnail, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('course-thumbnails')
          .getPublicUrl(filePath);

        // Update course with thumbnail URL
        const { error: updateError } = await supabase
          .from('courses')
          .update({ thumbnail_url: publicUrl })
          .eq('id', course.id);

        if (updateError) throw updateError;
      }

      toast.success('Curso criado com sucesso!');
      reset();
      setThumbnail(null);
      setThumbnailPreview(null);
      setIsCreating(false);
      refetchCourses();
    } catch (error: any) {
      console.error('Erro ao criar curso:', error);
      toast.error(error.message || 'Erro ao criar curso');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Courses List */}
      <div className="bg-[#1F1F1F] rounded-lg shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-white">
              Cursos
            </h2>
            <button
              onClick={() => setIsCreating(true)}
              className="btn flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Curso
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses?.map((course: any) => (
              <div
                key={course.id}
                className="bg-[#2F2F2F] rounded-lg overflow-hidden"
              >
                <div className="relative aspect-video">
                  <img
                    src={course.thumbnail_url || 'https://placehold.co/600x400?text=Sem+Imagem'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 text-red-500 hover:text-red-400 bg-white rounded-full"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-white mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-400">
                    {course.category} • {course.duration}h
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Course Form */}
      {isCreating && (
        <div className="bg-[#1F1F1F] rounded-lg shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-white mb-6">
              Novo Curso
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Thumbnail do Curso
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                      />
                    ) : (
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-400">
                      <label className="relative cursor-pointer bg-[#2F2F2F] rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none">
                        <span>Selecionar imagem</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setThumbnail(file);
                              setThumbnailPreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>
                      <p className="pl-1">ou arraste e solte</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG até 5MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Título do Curso
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
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Categoria
                  </label>
                  <select
                    {...register('category')}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-[#2F2F2F] text-white shadow-sm focus:border-[#E50914] focus:ring-[#E50914]"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="pastagens">Gestão de Pastagens</option>
                    <option value="nutricao">Nutrição Animal</option>
                    <option value="reproducao">Reprodução</option>
                    <option value="gestao">Gestão Rural</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Nível
                  </label>
                  <select
                    {...register('level')}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-[#2F2F2F] text-white shadow-sm focus:border-[#E50914] focus:ring-[#E50914]"
                  >
                    <option value="beginner">Iniciante</option>
                    <option value="intermediate">Intermediário</option>
                    <option value="advanced">Avançado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Duração (horas)
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
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    reset();
                    setThumbnail(null);
                    setThumbnailPreview(null);
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
                  Criar Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}