import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash, Save, ChevronDown, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useSupabaseQuery, useSupabaseMutation } from '../../../hooks/useSupabaseQuery';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';

const groupSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string(),
  permissions: z.object({
    features: z.array(z.enum(['certificates', 'ranking', 'news'])).default([]),
  }).default({
    features: [],
  }),
});

type GroupFormData = z.infer<typeof groupSchema>;

export function GroupSettings() {
  const [expandedCourses, setExpandedCourses] = React.useState<string[]>([]);
  const [expandedModules, setExpandedModules] = React.useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = React.useState<{
    courses: { [key: string]: boolean };
    modules: { [key: string]: boolean };
    lessons: { [key: string]: boolean };
  }>({
    courses: {},
    modules: {},
    lessons: {},
  });
  const [isCreating, setIsCreating] = React.useState(false);

  const { data: courses } = useSupabaseQuery({
    key: ['courses'],
    query: () => supabase
      .from('courses')
      .select(`
        id,
        title,
        modules (
          id,
          title,
          lessons (
            id,
            title
          )
        )
      `),
  });

  const { data: groups, refetch: refetchGroups } = useSupabaseQuery({
    key: ['groups'],
    query: () => supabase
      .from('groups')
      .select(`
        *,
        permissions:group_permissions(*)
      `),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      permissions: {
        features: [],
      },
    },
  });

  const toggleCourse = (courseId: string) => {
    setExpandedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const togglePermission = (type: 'courses' | 'modules' | 'lessons', id: string) => {
    setSelectedPermissions(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [id]: !prev[type][id],
      },
    }));

    if (type === 'courses') {
      const course = courses?.find(c => c.id === id);
      if (course) {
        const newValue = !selectedPermissions.courses[id];
        
        course.modules?.forEach(module => {
          setSelectedPermissions(prev => ({
            ...prev,
            modules: {
              ...prev.modules,
              [module.id]: newValue,
            },
            lessons: {
              ...prev.lessons,
              ...module.lessons.reduce((acc, lesson) => ({
                ...acc,
                [lesson.id]: newValue,
              }), {}),
            },
          }));
        });
      }
    }
  };

  const onSubmit = async (data: GroupFormData) => {
    try {
      // First create the group
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: data.name,
          description: data.description,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Then create permissions
      const permissions = [
        // Course permissions
        ...Object.entries(selectedPermissions.courses)
          .filter(([_, selected]) => selected)
          .map(([id]) => ({
            group_id: group.id,
            resource_type: 'course',
            resource_id: id,
            permission: 'read',
          })),
        // Module permissions
        ...Object.entries(selectedPermissions.modules)
          .filter(([_, selected]) => selected)
          .map(([id]) => ({
            group_id: group.id,
            resource_type: 'module',
            resource_id: id,
            permission: 'read',
          })),
        // Lesson permissions
        ...Object.entries(selectedPermissions.lessons)
          .filter(([_, selected]) => selected)
          .map(([id]) => ({
            group_id: group.id,
            resource_type: 'lesson',
            resource_id: id,
            permission: 'read',
          })),
        // Feature permissions
        ...data.permissions.features.map(feature => ({
          group_id: group.id,
          resource_type: 'feature',
          resource_id: null,
          permission: feature,
        })),
      ];

      if (permissions.length > 0) {
        const { error: permissionsError } = await supabase
          .from('group_permissions')
          .insert(permissions);

        if (permissionsError) throw permissionsError;
      }

      toast.success('Grupo criado com sucesso!');
      reset();
      setSelectedPermissions({
        courses: {},
        modules: {},
        lessons: {},
      });
      setIsCreating(false);
      refetchGroups();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar grupo');
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;

      toast.success('Grupo excluído com sucesso!');
      refetchGroups();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir grupo');
    }
  };

  return (
    <div className="space-y-6">
      {/* Groups List */}
      <div className="bg-[#1F1F1F] rounded-lg shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-medium text-white">
                Grupos
              </h2>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="btn flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Grupo
            </button>
          </div>

          <div className="space-y-4">
            {groups?.map((group: any) => (
              <div
                key={group.id}
                className="flex items-center justify-between p-4 bg-[#2F2F2F] rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-white">{group.name}</h3>
                  <p className="text-sm text-gray-400">{group.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteGroup(group.id)}
                  className="p-2 text-red-500 hover:text-red-400"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Group Form */}
      {isCreating && (
        <div className="bg-[#1F1F1F] rounded-lg shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-white mb-6">
              Novo Grupo
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Nome do Grupo
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-[#2F2F2F] text-white shadow-sm focus:border-[#E50914] focus:ring-[#E50914]"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Descrição
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-[#2F2F2F] text-white shadow-sm focus:border-[#E50914] focus:ring-[#E50914]"
                />
              </div>

              {/* Course Permissions */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Permissões de Acesso aos Cursos
                </label>
                <div className="border border-gray-700 rounded-lg divide-y divide-gray-700">
                  {courses?.map((course: any) => (
                    <div key={course.id} className="bg-[#2F2F2F]">
                      <button
                        type="button"
                        onClick={() => toggleCourse(course.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-[#3F3F3F] text-white"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedPermissions.courses[course.id] || false}
                            onChange={() => togglePermission('courses', course.id)}
                            className="h-4 w-4 text-[#E50914] focus:ring-[#E50914] border-gray-600 rounded mr-3"
                            onClick={e => e.stopPropagation()}
                          />
                          <span className="font-medium">
                            {course.title}
                          </span>
                        </div>
                        {expandedCourses.includes(course.id) ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </button>

                      {expandedCourses.includes(course.id) && (
                        <div className="pl-8 pr-4 pb-4 space-y-3">
                          {course.modules?.map((module: any) => (
                            <div key={module.id} className="bg-[#3F3F3F] rounded-lg">
                              <button
                                type="button"
                                onClick={() => toggleModule(module.id)}
                                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#4F4F4F] text-white"
                              >
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedPermissions.modules[module.id] || false}
                                    onChange={() => togglePermission('modules', module.id)}
                                    className="h-4 w-4 text-[#E50914] focus:ring-[#E50914] border-gray-600 rounded mr-3"
                                    onClick={e => e.stopPropagation()}
                                  />
                                  <span className="text-sm font-medium">
                                    {module.title}
                                  </span>
                                </div>
                                {expandedModules.includes(module.id) ? (
                                  <ChevronDown className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-400" />
                                )}
                              </button>

                              {expandedModules.includes(module.id) && (
                                <div className="pl-8 pr-4 pb-3 pt-1 space-y-2">
                                  {module.lessons?.map((lesson: any) => (
                                    <div
                                      key={lesson.id}
                                      className="flex items-center p-2 rounded hover:bg-[#5F5F5F] text-white"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selectedPermissions.lessons[lesson.id] || false}
                                        onChange={() => togglePermission('lessons', lesson.id)}
                                        className="h-4 w-4 text-[#E50914] focus:ring-[#E50914] border-gray-600 rounded mr-3"
                                      />
                                      <span className="text-sm">
                                        {lesson.title}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature Permissions */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Permissões de Recursos
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('permissions.features')}
                      value="certificates"
                      className="h-4 w-4 text-[#E50914] focus:ring-[#E50914] border-gray-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-300">
                      Certificados
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('permissions.features')}
                      value="ranking"
                      className="h-4 w-4 text-[#E50914] focus:ring-[#E50914] border-gray-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-300">
                      Ranking
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('permissions.features')}
                      value="news"
                      className="h-4 w-4 text-[#E50914] focus:ring-[#E50914] border-gray-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-300">
                      Notícias
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Criar Grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}