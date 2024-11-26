import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../components/Layout/MainLayout';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Dashboard = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = React.useState(0);

  // Mock data for featured banners
  const featuredBanners = [
    {
      id: '1',
      courseId: '1',
      title: 'Gestão de Pastagens',
      description: 'Aprenda técnicas avançadas de manejo de pastagens para maximizar a produtividade do seu rebanho. Este curso abrange desde conceitos básicos até estratégias avançadas de manejo.',
      thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    },
    {
      id: '2',
      courseId: '2',
      title: 'Nutrição Animal',
      description: 'Domine os fundamentos e práticas avançadas de nutrição animal para otimizar o desempenho do seu rebanho.',
      thumbnail: 'https://images.unsplash.com/photo-1516367971920-2d4794f9d669',
    },
  ];

  // Mock data for new courses
  const newCourses = [
    {
      id: '1',
      title: 'Gestão de Pastagens',
      instructor: 'Dr. João Silva',
      duration: '40h',
      thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    },
    {
      id: '2',
      title: 'Nutrição Animal',
      instructor: 'Dra. Maria Santos',
      duration: '35h',
      thumbnail: 'https://images.unsplash.com/photo-1516367971920-2d4794f9d669',
    },
    {
      id: '3',
      title: 'Reprodução Bovina',
      instructor: 'Dr. Pedro Costa',
      duration: '45h',
      thumbnail: 'https://images.unsplash.com/photo-1605118983127-00fe14ce3fd8',
    },
    {
      id: '4',
      title: 'Gestão Rural',
      instructor: 'Eng. Ana Paula',
      duration: '30h',
      thumbnail: 'https://images.unsplash.com/photo-1560493676-04071c5f467b',
    },
  ];

  // Mock data for continue watching
  const continueWatching = [
    {
      id: '1',
      title: 'Gestão de Pastagens',
      progress: 75,
      lastWatched: 'Módulo 3: Manejo Rotacional',
      thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    },
    {
      id: '2',
      title: 'Nutrição Animal',
      progress: 45,
      lastWatched: 'Módulo 2: Suplementação',
      thumbnail: 'https://images.unsplash.com/photo-1516367971920-2d4794f9d669',
    },
    {
      id: '3',
      title: 'Reprodução Bovina',
      progress: 30,
      lastWatched: 'Módulo 1: Fundamentos',
      thumbnail: 'https://images.unsplash.com/photo-1605118983127-00fe14ce3fd8',
    },
    {
      id: '4',
      title: 'Gestão Rural',
      progress: 15,
      lastWatched: 'Módulo 1: Introdução',
      thumbnail: 'https://images.unsplash.com/photo-1560493676-04071c5f467b',
    },
  ];

  // Mock data for latest news
  const latestNews = [
    {
      id: '1',
      title: 'Novo Curso de Gestão de Pastagens',
      excerpt: 'Aprenda técnicas avançadas de manejo de pastagens...',
      category: 'Novidade',
      date: new Date(),
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    },
    {
      id: '2',
      title: 'Webinar: Nutrição Animal',
      excerpt: 'Participe do nosso próximo webinar sobre nutrição...',
      category: 'Evento',
      date: new Date(),
      image: 'https://images.unsplash.com/photo-1516367971920-2d4794f9d669',
    },
  ];

  // Auto-rotate banners
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) =>
        prev === featuredBanners.length - 1 ? 0 : prev + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout>
      {/* Featured Banner */}
      <div className="relative h-[85vh] -mt-16">
        {featuredBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentBannerIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0">
              <img
                src={banner.thumbnail}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/20" />
            </div>
            
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-32">
              <div className="max-w-2xl">
                <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                  {banner.title}
                </h1>
                <p className="text-xl text-gray-300 mb-8 line-clamp-3">
                  {banner.description}
                </p>
                <div className="flex items-center space-x-4">
                  <Link to={`/courses/${banner.courseId}`} className="btn">
                    <Play className="w-5 h-5 mr-2" />
                    Começar
                  </Link>
                  <button className="btn-secondary">
                    <Info className="w-5 h-5 mr-2" />
                    Mais Informações
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Banner Navigation Dots */}
        <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featuredBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentBannerIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* New Courses */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Novos Cursos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newCourses.map(course => (
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
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <button className="btn w-full flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />
                        Começar
                      </button>
                    </div>
                  </div>
                </div>
                <div className="course-card-content">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{course.instructor}</span>
                    <span>{course.duration}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Continue Watching */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Continue Assistindo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {continueWatching.map(course => (
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
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <button className="btn w-full flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />
                        Continuar
                      </button>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0">
                    <div className="bg-[#E50914] h-1" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
                <div className="course-card-content">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-1">
                    {course.lastWatched}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest News */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Últimas Notícias</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {latestNews.map(news => (
              <Link
                key={news.id}
                to={`/news/${news.id}`}
                className="group bg-[#1F1F1F] rounded-lg overflow-hidden hover:ring-2 hover:ring-gray-700 transition-all"
              >
                <div className="flex">
                  <div className="w-48 h-32">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-[#E50914] text-white rounded-full mb-2">
                      {news.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#E50914] transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                      {news.excerpt}
                    </p>
                    <time className="text-xs text-gray-500">
                      {format(news.date, "d 'de' MMMM", { locale: ptBR })}
                    </time>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};