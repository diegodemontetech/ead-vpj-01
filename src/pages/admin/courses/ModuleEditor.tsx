import React from 'react';
import { AdminLayout } from '../../../components/Layout/AdminLayout';
import { Save, Plus, Trash, Upload, Clock, FileText } from 'lucide-react';
import { Module, Lesson } from '../../../types';

interface ModuleEditorProps {
  moduleId?: string;
}

export const ModuleEditor = ({ moduleId }: ModuleEditorProps) => {
  const [module, setModule] = React.useState<Partial<Module>>({
    title: '',
    description: '',
    duration: 0,
    lessons: [],
    order: 0,
  });

  const addLesson = () => {
    setModule((prev) => ({
      ...prev,
      lessons: [
        ...(prev.lessons || []),
        {
          id: Date.now().toString(),
          title: '',
          description: '',
          videoUrl: '',
          duration: 0,
          attachments: [],
          completed: false,
          order: prev.lessons?.length || 0,
        },
      ],
    }));
  };

  const removeLesson = (lessonId: string) => {
    setModule((prev) => ({
      ...prev,
      lessons: prev.lessons?.filter((lesson) => lesson.id !== lessonId),
    }));
  };

  const updateLesson = (lessonId: string, updates: Partial<Lesson>) => {
    setModule((prev) => ({
      ...prev,
      lessons: prev.lessons?.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, ...updates } : lesson
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving module:', module);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            {moduleId ? 'Editar Módulo' : 'Novo Módulo'}
          </h1>
          <button
            onClick={handleSubmit}
            className="btn flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Módulo
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Título do Módulo
                </label>
                <input
                  type="text"
                  value={module.title}
                  onChange={(e) =>
                    setModule((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  value={module.description}
                  onChange={(e) =>
                    setModule((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Aulas
                  </label>
                  <button
                    type="button"
                    onClick={addLesson}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Aula
                  </button>
                </div>

                <div className="space-y-4">
                  {module.lessons?.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="border rounded-lg bg-gray-50 p-4"
                    >
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) =>
                                updateLesson(lesson.id, {
                                  title: e.target.value,
                                })
                              }
                              placeholder="Título da Aula"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeLesson(lesson.id)}
                            className="ml-4 p-2 text-red-600 hover:text-red-700"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </div>

                        <div>
                          <input
                            type="text"
                            value={lesson.videoUrl}
                            onChange={(e) =>
                              updateLesson(lesson.id, {
                                videoUrl: e.target.value,
                              })
                            }
                            placeholder="URL do Vídeo (YouTube)"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>

                        <div className="flex gap-4">
                          <div className="flex-1">
                            <textarea
                              value={lesson.description}
                              onChange={(e) =>
                                updateLesson(lesson.id, {
                                  description: e.target.value,
                                })
                              }
                              placeholder="Descrição da Aula"
                              rows={2}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div className="w-32">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 text-gray-400 mr-2" />
                              <input
                                type="number"
                                value={lesson.duration}
                                onChange={(e) =>
                                  updateLesson(lesson.id, {
                                    duration: parseInt(e.target.value),
                                  })
                                }
                                placeholder="Minutos"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Material de Apoio
                          </label>
                          <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                  <span>Upload a file</span>
                                  <input type="file" className="sr-only" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PDF, DOC up to 10MB
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};