import React from 'react';
import { MainLayout } from '../../components/Layout/MainLayout';
import { useInView } from 'react-intersection-observer';
import { Calendar, Tag, ChevronRight, ChevronLeft, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsItem } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const NewsList = () => {
  const [news, setNews] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const { ref, inView } = useInView();

  // Simulated news data - replace with API call
  const fetchNews = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newNews: NewsItem[] = [
      {
        id: '1',
        title: 'Novo Curso de Gestão de Pastagens',
        content: 'Estamos muito empolgados em anunciar o lançamento do nosso mais novo curso sobre gestão eficiente de pastagens. Este curso foi desenvolvido em parceria com os maiores especialistas do setor...',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
        category: 'announcement',
        publishedAt: new Date().toISOString(),
        author: {
          id: '1',
          name: 'João Silva',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        },
        featured: true,
        tags: ['cursos', 'pastagens', 'novidade']
      },
      {
        id: '2',
        title: 'Webinar: Nutrição Animal - Estratégias para Maximizar a Produtividade',
        content: 'Participe do nosso próximo webinar sobre nutrição animal e aprenda técnicas avançadas para otimizar a alimentação do seu rebanho...',
        image: 'https://images.unsplash.com/photo-1516367971920-2d4794f9d669',
        category: 'event',
        publishedAt: new Date().toISOString(),
        author: {
          id: '2',
          name: 'Maria Santos',
          avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
        featured: true,
        tags: ['webinar', 'nutrição', 'evento']
      },
      {
        id: '3',
        title: 'Nova Parceria com Universidade',
        content: 'Firmamos uma importante parceria com a Universidade Federal para desenvolvimento de pesquisas...',
        image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3',
        category: 'announcement',
        publishedAt: new Date().toISOString(),
        author: {
          id: '3',
          name: 'Carlos Mendes',
          avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        },
        featured: true,
        tags: ['parceria', 'pesquisa', 'educação']
      },
      {
        id: '4',
        title: 'Resultados do Programa de Mentoria',
        content: 'Confira os impressionantes resultados alcançados pelos participantes do nosso programa de mentoria...',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
        category: 'announcement',
        publishedAt: new Date().toISOString(),
        author: {
          id: '4',
          name: 'Ana Paula',
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        },
        featured: true,
        tags: ['mentoria', 'resultados', 'sucesso']
      },
      {
        id: '5',
        title: 'Dicas para Manejo de Pastagens',
        content: 'Confira as melhores práticas para otimizar o manejo de suas pastagens...',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
        category: 'article',
        publishedAt: new Date().toISOString(),
        author: {
          id: '5',
          name: 'Pedro Santos',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        },
        featured: false,
        tags: ['pastagens', 'manejo', 'dicas']
      },
      {
        id: '6',
        title: 'Tecnologias para Pecuária',
        content: 'Descubra as últimas inovações tecnológicas para o setor pecuário...',
        image: 'https://images.unsplash.com/photo-1516367971920-2d4794f9d669',
        category: 'article',
        publishedAt: new Date().toISOString(),
        author: {
          id: '6',
          name: 'Ana Clara',
          avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
        },
        featured: false,
        tags: ['tecnologia', 'inovação', 'pecuária']
      }
    ];

    setNews(prev => [...prev, ...newNews]);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchNews();
  }, [page]);

  React.useEffect(() => {
    if (inView) {
      setPage(prev => prev + 1);
    }
  }, [inView]);

  const featuredNews = news.filter(item => item.featured);
  const regularNews = news.filter(item => !item.featured);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured News Carousel */}
        <div className="mb-16">
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={{
              prevEl: '.swiper-button-prev',
              nextEl: '.swiper-button-next',
            }}
            pagination={{ 
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-white/50 !opacity-50',
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-[#E50914] !opacity-100'
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="relative h-[600px] rounded-2xl overflow-hidden group"
          >
            {featuredNews.map((news, index) => (
              <SwiperSlide key={`featured-${news.id}-${index}`}>
                <Link to={`/news/${news.id}`} className="block h-full">
                  <div className="relative h-full">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-12">
                      <div className="max-w-3xl">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#E50914] text-white mb-6">
                          Em Destaque
                        </span>
                        <h2 className="font-['Playfair_Display'] text-5xl font-bold text-white mb-6 leading-tight">
                          {news.title}
                        </h2>
                        <p className="text-xl text-gray-200 mb-8 line-clamp-3 font-['Source_Serif_Pro']">
                          {news.content}
                        </p>
                        <div className="flex items-center text-white">
                          <img
                            src={news.author.avatar}
                            alt={news.author.name}
                            className="w-12 h-12 rounded-full border-2 border-white mr-4"
                          />
                          <div>
                            <p className="font-medium">{news.author.name}</p>
                            <div className="flex items-center text-sm text-gray-300">
                              <Calendar className="w-4 h-4 mr-2" />
                              {format(new Date(news.publishedAt), "d 'de' MMMM, yyyy", { locale: ptBR })}
                              <span className="mx-2">•</span>
                              <Clock className="w-4 h-4 mr-2" />
                              5 min de leitura
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
            <button className="swiper-button-prev !w-10 !h-10 !bg-[#E50914] rounded-full !text-white after:!text-[0] opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="swiper-button-next !w-10 !h-10 !bg-[#E50914] rounded-full !text-white after:!text-[0] opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-6 h-6" />
            </button>
          </Swiper>
        </div>

        {/* Latest News Grid */}
        <div className="mb-12">
          <h2 className="font-['Playfair_Display'] text-4xl font-bold text-white mb-8">
            Últimas Notícias
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularNews.map((news, index) => (
              <Link
                key={`regular-${news.id}-${index}`}
                to={`/news/${news.id}`}
                className="group bg-[#1F1F1F] rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="news-category">
                      {news.category === 'announcement' ? 'Anúncio' : 'Evento'}
                    </span>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      5 min
                    </div>
                  </div>
                  <h3 className="font-['Playfair_Display'] text-2xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[#E50914] transition-colors">
                    {news.title}
                  </h3>
                  <p className="font-['Source_Serif_Pro'] text-gray-400 mb-4 line-clamp-2">
                    {news.content}
                  </p>
                  <div className="flex items-center">
                    <img
                      src={news.author.avatar}
                      alt={news.author.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {news.author.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {format(new Date(news.publishedAt), "d 'de' MMM, yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Loading indicator */}
        <div ref={ref} className="flex justify-center py-8">
          {loading && (
            <div className="w-8 h-8 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </div>
    </MainLayout>
  );
};