import React from 'react';
import { AdminLayout } from '../../../components/Layout/AdminLayout';
import { PlusCircle, Search, Filter, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CourseList = () => {
  const courses = [
    {
      id: '1',
      title: 'Gestão de Pastagens',
      students: 45,
      modules: 4,
      status: 'active',
      thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: '2',
      title: 'Nutrição Animal',
      students: 32,
      modules: 3,
      status: 'draft',
      thumbnail: 'https://images.unsplash.com/photo-1516367971920-2d4794f9d669?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Cursos</h1>
          <Link
            to="/admin/courses/new"
            className="btn flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Novo Curso
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar cursos..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button className="btn-secondary flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <button className="p-1 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{course.modules} módulos</span>
                      <span>{course.students} alunos</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          course.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {course.status === 'active' ? 'Ativo' : 'Rascunho'}
                      </span>
                      <Link
                        to={`/admin/courses/${course.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        Editar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};