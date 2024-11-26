import React from 'react';
import { AdminLayout } from '../../../components/Layout/AdminLayout';
import { Save, Clock, Upload, Plus, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NewCourse = () => {
  const navigate = useNavigate();
  const [course, setCourse] = React.useState({
    title: '',
    description: '',
    thumbnail: '',
    modules: [{ id: Date.now(), title: '', duration: 0 }]
  });

  const addModule = () => {
    setCourse(prev => ({
      ...prev,
      modules: [...prev.modules, { id: Date.now(), title: '', duration: 0 }]
    }));
  };

  const removeModule = (id: number) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.filter(module => module.id !== id)
    }));
  };

  const updateModule = (id: number, field: string, value: string | number) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === id ? { ...module, [field]: value } : module
      )
    }));
  };

  const calculateTotalDuration = () => {
    return course.modules.reduce((total, module) => total + (Number(module.duration) || 0), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to save the course
    console.log('Saving course:', {
      ...course,
      totalDuration: calculateTotalDuration()
    });
    
    // Simulate successful save and redirect
    alert('Curso salvo com sucesso!');
    navigate('/admin/courses');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Novo Curso</h1>
          <button 
            onClick={handleSubmit}
            className="btn flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Curso
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Título do Curso
                </label>
                <input
                  type="text"
                  value={course.title}
                  onChange={(e) => setCourse(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  rows={4}
                  value={course.description}
                  onChange={(e) => setCourse(prev => ({ ...prev, description: e.target.value }))}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Thumbnail
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input 
                          type="file" 
                          className="sr-only"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Handle file upload
                              console.log('File selected:', file);
                            }
                          }}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Módulos
                  </label>
                  <button
                    type="button"
                    onClick={addModule}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Módulo
                  </button>
                </div>

                <div className="space-y-4">
                  {course.modules.map((module, index) => (
                    <div
                      key={module.id}
                      className="flex gap-4 p-4 border rounded-lg bg-gray-50"
                    >
                      <div className="flex-1">
                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                          placeholder="Título do Módulo"
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="w-32">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          <input
                            type="number"
                            value={module.duration}
                            onChange={(e) => updateModule(module.id, 'duration', parseInt(e.target.value) || 0)}
                            placeholder="Horas"
                            required
                            min="0"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeModule(module.id)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Duração Total: {calculateTotalDuration()} horas
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};