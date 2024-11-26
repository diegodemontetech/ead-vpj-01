import React from 'react';
import { MainLayout } from '../../components/Layout/MainLayout';
import { Play, FileText, CheckCircle, Lock, ChevronRight, Clock, Users, PlayCircle } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export const CourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // This would typically come from an API
  const course = {
    id: courseId,
    title: 'Gestão de Pastagens',
    description: 'Aprenda técnicas avançadas de gestão de pastagens para maximizar a produtividade do seu rebanho. Este curso abrange desde conceitos básicos até estratégias avançadas de manejo.',
    thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    introVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 40,
    students: 45,
    instructor: 'Dr. João Silva',
    progress: 35,
    modules: [
      {
        id: '1',
        title: 'Introdução à Gestão de Pastagens',
        description: 'Fundamentos e conceitos básicos de manejo de pastagens',
        completed: true,
        duration: 10,
        lessons: [
          {
            id: '1',
            title: 'Conceitos Básicos',
            duration: '45:00',
            completed: true,
            type: 'video',
            description: 'Nesta aula, você aprenderá os conceitos fundamentais de gestão de pastagens.',
            attachments: [
              { id: '1', title: 'Material de Apoio - Conceitos Básicos', type: 'pdf' }
            ]
          },
          {
            id: '2',
            title: 'Tipos de Pastagens',
            duration: '38:00',
            completed: true,
            type: 'video',
            description: 'Conheça os diferentes tipos de pastagens e suas características.',
            attachments: []
          }
        ]
      },
      {
        id: '2',
        title: 'Manejo Rotacional',
        description: 'Técnicas avançadas de rotação de pastagens',
        completed: false,
        duration: 15,
        lessons: [
          {
            id: '3',
            title: 'Princípios do Pastejo Rotacionado',
            duration: '52:00',
            completed: false,
            type: 'video',
            description: 'Aprenda os princípios fundamentais do sistema de pastejo rotacionado.',
            attachments: []
          },
          {
            id: '4',
            title: 'Avaliação Final',
            duration: '30:00',
            completed: false,
            type: 'quiz',
            description: 'Teste seus conhecimentos sobre manejo rotacional.',
            attachments: []
          }
        ]
      }
    ]
  };

  const navigateToLesson = (moduleId: string, lessonId: string, type: string) => {
    if (type === 'quiz') {
      navigate(`/courses/${courseId}/modules/${moduleId}/exam`);
    } else {
      navigate(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
    }
  };

  const totalLessons = course.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );

  const completedLessons = course.modules.reduce(
    (total, module) =>
      total + module.lessons.filter((lesson) => lesson.completed).length,
    0
  );

  const progress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px)] bg-gray-100">
        {/* Course Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
                <p className="text-gray-600 mb-6">{course.description}</p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {course.duration} horas
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {course.students} alunos
                  </div>
                </div>
              </div>
              <div className="md:w-1/3">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progresso do curso</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    {completedLessons} de {totalLessons} aulas concluídas
                  </p>
                  <button 
                    onClick={() => {
                      const firstIncompleteLesson = course.modules
                        .find(m => m.lessons.some(l => !l.completed))
                        ?.lessons.find(l => !l.completed);
                      
                      if (firstIncompleteLesson) {
                        const moduleId = course.modules.find(m => 
                          m.lessons.some(l => l.id === firstIncompleteLesson.id)
                        )?.id;
                        navigateToLesson(moduleId!, firstIncompleteLesson.id, firstIncompleteLesson.type);
                      }
                    }}
                    className="btn w-full flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Continuar Curso
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Intro Video */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-8">
            <iframe
              src={course.introVideo}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Course Content */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Conteúdo do Curso
              </h2>
              <div className="space-y-4">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="border rounded-lg">
                    <div className="p-4 bg-gray-50 rounded-t-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Módulo {moduleIndex + 1}: {module.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {module.description}
                          </p>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {module.duration}h
                        </div>
                      </div>
                    </div>
                    <div className="divide-y">
                      {module.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => navigateToLesson(module.id, lesson.id, lesson.type)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center">
                            {lesson.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            ) : lesson.type === 'quiz' ? (
                              <FileText className="w-5 h-5 text-blue-500 mr-3" />
                            ) : (
                              <Play className="w-5 h-5 text-gray-400 mr-3" />
                            )}
                            <div className="text-left">
                              <h4 className="font-medium text-gray-900">
                                {lesson.title}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {lesson.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center ml-4">
                            <span className="text-sm text-gray-500 mr-4">
                              {lesson.duration}
                            </span>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};