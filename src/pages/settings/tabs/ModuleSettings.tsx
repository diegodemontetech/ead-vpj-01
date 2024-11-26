import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Plus, Trash } from 'lucide-react';
import { useSupabaseQuery } from '../../../hooks/useSupabaseQuery';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';

const moduleSchema = z.object({
  course_id: z.string().min(1, 'Selecione um curso'),
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string(),
  duration: z.number().min(1, 'Duração deve ser maior que 0'),
  order_index: z.number().min(0),
  required_for_completion: z.boolean().default(true),
});

type ModuleFormData = z.infer<typeof moduleSchema>;

export function ModuleSettings() {
  const [isCreating, setIsCreating] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const { data: courses } = useSupabaseQuery({
    key: ['courses'],
    query: () => supabase
      .from('courses')
      .select('*')
      .order('title'),
  });

  const { data: modules, refetch: refetchModules } = useSupabaseQuery({
    key: ['modules'],
    query: () => supabase
      .from('modules')
      .select(`
        *,
        course:courses(title)
      `)
      .order('created_at', { ascending: false }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      required_for_completion: true,
      order_index: 0,
    },
  });

  const handleDeleteModule = async (moduleId: string) => {
    try {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId);

      if (error) throw error;
      
      toast.success('Módulo excluído com sucesso!');
      refetchModules();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir módulo');
    }
  };

  const onSubmit = async (data: ModuleFormData) => {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('modules')
        .insert(data);

      if (error) throw error;

      toast.success('Módulo criado com sucesso!');
      reset();
      setIsCreating(false);
      refetchModules();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar módulo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Modules List */}
      <div className="bg-[#1F1F1F] rounded-lg shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-white">
              Módulos
            </h2>
            <button
              onClick={() => setIsCreating(true)}
              className="btn flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Módulo
            </button>
          </div>

          <div className="space-y-4">
            {modules?.map((module: any) => (
              <div
                key={module.id}
                className="flex items-center justify-between p-4 bg-[#2F2F2F] rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-white">{module.title}</h3>
                  <p className="text-sm text-gray-400">
                    {module.course.title}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteModule(module.id)}
                  className="p-2 text-red-500 hover:text-red-400"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Module Form */}
      {isCreating && (
        <div className="bg-[#1F1F1F] rounded-lg shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-white mb-6">
              Novo Módulo
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Curso
                  </label>
                  <select
                    {...register('course_id')}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-[#2F2F2F] text-white shadow-sm focus:border-[#E50914] focus:ring-[#E50914]"
                  >
                    <option value="">Selecione um curso</option>
                    {courses?.map((course: any) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  {errors.course_id && (
                    <p className="mt-1 text-sm text-red-500">{errors.course_id.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Título do Módulo
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
                      Obrigatório para conclusão do curso
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
                  Criar Módulo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}