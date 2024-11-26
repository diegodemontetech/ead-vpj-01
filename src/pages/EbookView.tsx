import React from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { useParams, Link } from 'react-router-dom';
import { Download, ChevronLeft, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Clock, User, Calendar } from 'lucide-react';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  LinkedinShareButton 
} from 'react-share';
import { toast } from 'sonner';

interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  thumbnail: string;
  category: string;
  releaseYear: string;
  downloads: number;
  pdfUrl: string;
  publishedAt: string;
}

export const EbookView = () => {
  const { ebookId } = useParams();
  const shareUrl = window.location.href;

  // Mock data - replace with API call
  const ebook: Ebook = {
    id: ebookId!,
    title: 'Gestão Moderna de Pastagens',
    author: 'Dr. João Silva',
    description: `
      Este e-book aborda as técnicas mais modernas de gestão de pastagens, incluindo:
      
      • Manejo rotacional avançado
      • Análise e correção de solo
      • Integração lavoura-pecuária
      • Sistemas silvipastoris
      • Tecnologias para monitoramento de pastagens
      
      Ideal para produtores rurais, técnicos e estudantes que buscam aprimorar seus conhecimentos em gestão de pastagens.
    `,
    thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    category: 'Gestão de Pastagens',
    releaseYear: '2024',
    downloads: 245,
    pdfUrl: '/ebooks/gestao-moderna-pastagens.pdf',
    publishedAt: '2024-03-15',
  };

  const handleDownload = () => {
    // In a real application, you would handle the download through your backend
    // For now, we'll just show a success message
    toast.success('Download iniciado!');
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            to="/ebooks"
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Voltar para Biblioteca
          </Link>
        </div>

        <div className="bg-[#1F1F1F] rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Thumbnail */}
              <div className="aspect-[2/3] relative">
                <img
                  src={ebook.thumbnail}
                  alt={ebook.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>

              {/* Details */}
              <div className="md:col-span-2">
                <h1 className="text-3xl font-bold text-white mb-4">
                  {ebook.title}
                </h1>

                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center text-gray-400">
                    <User className="w-4 h-4 mr-2" />
                    <span>{ebook.author}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{ebook.releaseYear}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Download className="w-4 h-4 mr-2" />
                    <span>{ebook.downloads} downloads</span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Sobre este e-book
                  </h2>
                  <div className="whitespace-pre-wrap text-gray-300">
                    {ebook.description}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleDownload}
                    className="btn flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>

                  <div className="flex items-center space-x-2">
                    <FacebookShareButton url={shareUrl}>
                      <button className="p-2 text-blue-400 hover:bg-gray-800 rounded-full transition-colors">
                        <Facebook className="w-5 h-5" />
                      </button>
                    </FacebookShareButton>
                    
                    <TwitterShareButton url={shareUrl}>
                      <button className="p-2 text-blue-400 hover:bg-gray-800 rounded-full transition-colors">
                        <Twitter className="w-5 h-5" />
                      </button>
                    </TwitterShareButton>
                    
                    <LinkedinShareButton url={shareUrl}>
                      <button className="p-2 text-blue-400 hover:bg-gray-800 rounded-full transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </button>
                    </LinkedinShareButton>
                    
                    <button
                      onClick={copyShareLink}
                      className="p-2 text-gray-400 hover:bg-gray-800 rounded-full transition-colors"
                    >
                      <LinkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Ebooks - You can add this section later */}
        {/* <div className="mt-12">
          <h2 className="text-2xl font-semibold text-white mb-6">
            E-books Relacionados
          </h2>
          // Add related ebooks grid here
        </div> */}
      </div>
    </MainLayout>
  );
};