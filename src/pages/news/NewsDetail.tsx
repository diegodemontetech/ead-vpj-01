import React from 'react';
import { MainLayout } from '../../components/Layout/MainLayout';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Tag, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Clock, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  LinkedinShareButton 
} from 'react-share';
import { toast } from 'sonner';

export const NewsDetail = () => {
  const { newsId } = useParams();
  const shareUrl = window.location.href;

  const news = {
    id: newsId,
    title: 'Novo Curso de Gestão de Pastagens',
    content: `
      <p class="text-xl text-gray-300 mb-8 leading-relaxed">Estamos muito empolgados em anunciar o lançamento do nosso mais novo curso sobre gestão eficiente de pastagens!</p>
      
      <h2>O que você vai aprender</h2>
      <ul>
        <li>Técnicas modernas de manejo de pastagens</li>
        <li>Otimização da produção por hectare</li>
        <li>Sistemas de rotação eficientes</li>
        <li>Análise e correção de solo</li>
      </ul>

      <p>O curso foi desenvolvido por especialistas do setor e traz o que há de mais atual em termos de práticas e tecnologias para o manejo de pastagens.</p>

      <blockquote>
        "A gestão eficiente de pastagens é fundamental para a sustentabilidade e lucratividade da pecuária moderna."
      </blockquote>

      <h2>Módulos do Curso</h2>
      <ol>
        <li>Fundamentos do Manejo de Pastagens</li>
        <li>Análise e Correção do Solo</li>
        <li>Sistemas de Rotação</li>
        <li>Tecnologias e Ferramentas</li>
      </ol>

      <p>As inscrições já estão abertas e as vagas são limitadas. Não perca esta oportunidade de aprimorar seus conhecimentos e melhorar os resultados da sua propriedade.</p>
    `,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    category: 'announcement',
    publishedAt: new Date().toISOString(),
    author: {
      id: '1',
      name: 'João Silva',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      role: 'Coordenador de Cursos',
    },
    featured: true,
    tags: ['cursos', 'pastagens', 'novidade'],
    readTime: '5 min'
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copiado para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar o link. Tente novamente.');
    }
  };

  return (
    <MainLayout>
      <article>
        {/* Hero Image */}
        <div className="relative h-[70vh] -mt-16">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
          <Link
            to="/news"
            className="inline-flex items-center text-gray-400 hover:text-white mb-8"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Voltar para Notícias
          </Link>

          <div className="mb-8">
            <span className="news-category mb-4">
              {news.category === 'announcement' ? 'Anúncio' : 'Evento'}
            </span>
            <h1 className="font-['Playfair_Display'] text-5xl font-bold text-white mt-4 mb-6">
              {news.title}
            </h1>
            
            <div className="flex items-center justify-between border-b border-gray-800 pb-6">
              <div className="flex items-center">
                <img
                  src={news.author.avatar}
                  alt={news.author.name}
                  className="w-12 h-12 rounded-full border-2 border-white mr-4"
                />
                <div>
                  <p className="font-medium text-white">{news.author.name}</p>
                  <p className="text-sm text-gray-400">{news.author.role}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(new Date(news.publishedAt), "d 'de' MMMM, yyyy", { locale: ptBR })}
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {news.readTime} de leitura
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {/* Tags and Share */}
          <div className="flex items-center justify-between py-6 border-t border-gray-800">
            <div className="flex items-center gap-2">
              {news.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#2F2F2F] text-gray-300"
                >
                  <Tag className="w-4 h-4 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <FacebookShareButton url={shareUrl}>
                <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-[#2F2F2F] rounded-full transition-colors">
                  <Facebook className="w-5 h-5" />
                </button>
              </FacebookShareButton>
              
              <TwitterShareButton url={shareUrl}>
                <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-[#2F2F2F] rounded-full transition-colors">
                  <Twitter className="w-5 h-5" />
                </button>
              </TwitterShareButton>
              
              <LinkedinShareButton url={shareUrl}>
                <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-[#2F2F2F] rounded-full transition-colors">
                  <Linkedin className="w-5 h-5" />
                </button>
              </LinkedinShareButton>
              
              <button
                onClick={copyShareLink}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-full transition-colors"
              >
                <LinkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </article>
    </MainLayout>
  );
};