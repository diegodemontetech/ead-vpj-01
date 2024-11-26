import React from 'react';
import { MainLayout } from '../../components/Layout/MainLayout';
import { Link } from 'react-router-dom';
import { Play, Clock, Users, Star } from 'lucide-react';
import { clsx } from 'clsx';

export const CourseList = () => {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

  const categories = [
    { id: 'pastagens', name: 'Gestão de Pastagens' },
    { id: 'nutricao', name: 'Nutrição Animal' },
    { id: 'reproducao', name: 'Reprodução' },
    { id: 'gestao', name: 'Gestão Rural' }
  ];

  const courses = [
    {
      id: '1',
      title: 'Gestão de Pastagens',
      description: 'Aprenda técnicas avançadas de gestão de pastagens para maximizar a produtividade.',
      instructor: 'Dr. João Silva',
      thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
      duration: '40h',
      students: 45,
      rating: 4.8,
      progress: null,
      category: 'pastagens'
    },
    {
      id: '2',
      title: 'Nutrição Animal',
      description: 'Fundamentos e práticas avançadas de nutrição animal para pecuária.',
      instructor: 'Dra. Maria Santos',
      thumbnail: 'https://images.unsplash.com/photo-1516367971920-2d4794f9d669',
      duration: '35h',
      students: 32,
      rating: 4.5,
      progress: 60,
      category: 'nutricao'
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredCourses = selectedCategories.length > 0
    ? courses.filter(course => selectedCategories.includes(course.category))
    : courses;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-white">Catálogo de Cursos</h1>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={clsx(
                'px-6 py-3 min-h-[3rem] text-sm font-bold font-["Poppins"] rounded-full border transition-colors duration-200 flex items-center justify-center whitespace-nowrap',
                selectedCategories.includes(category.id)
                  ? 'bg-[#8B0000] text-white border-[#8B0000] hover:bg-[#660000]'
                  : 'bg-[#1B3C59] text-white border-[#1B3C59] hover:bg-[#2B4C69]'
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="group course-card"
            >
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="course-card-image"
                />
                <div className="course-card-overlay">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <button className="btn w-full flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      Começar Curso
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="course-card-content">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-white font-medium">{course.rating}</span>
                  </div>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{course.duration}</span>
                  </div>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{course.students} alunos</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <img
                    src={`https://ui-avatars.com/api/?name=${course.instructor}&background=random`}
                    alt={course.instructor}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div>
                    <p className="text-sm text-white font-medium">
                      {course.instructor}
                    </p>
                    <p className="text-xs text-gray-400">Instrutor</p>
                  </div>
                </div>

                {course.progress !== null && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Progresso</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-[#E50914] h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};