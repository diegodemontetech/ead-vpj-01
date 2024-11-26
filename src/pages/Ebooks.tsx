import React from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { Link } from 'react-router-dom';
import { Book, Download, Star } from 'lucide-react';
import { clsx } from 'clsx';

interface Category {
  id: string;
  name: string;
}

interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  thumbnail: string;
  category: string;
  downloads: number;
  rating: number;
}

export const Ebooks = () => {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

  const categories: Category[] = [
    { id: 'pastagens', name: 'Gestão de Pastagens' },
    { id: 'nutricao', name: 'Nutrição Animal' },
    { id: 'reproducao', name: 'Reprodução' },
    { id: 'gestao', name: 'Gestão Rural' }
  ];

  const ebooks: Ebook[] = [
    {
      id: '1',
      title: 'Gestão Moderna de Pastagens',
      author: 'Dr. João Silva',
      description: 'Um guia completo sobre técnicas modernas de gestão de pastagens.',
      thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
      category: 'pastagens',
      downloads: 245,
      rating: 4.8
    },
    {
      id: '2',
      title: 'Nutrição Animal Avançada',
      author: 'Dra. Maria Santos',
      description: 'Fundamentos e práticas avançadas de nutrição animal.',
      thumbnail: 'https://images.unsplash.com/photo-1516367971920-2d4794f9d669',
      category: 'nutricao',
      downloads: 183,
      rating: 4.5
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredEbooks = selectedCategories.length > 0
    ? ebooks.filter(ebook => selectedCategories.includes(ebook.category))
    : ebooks;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-white">Biblioteca Digital</h1>
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

        {/* Ebooks Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredEbooks.map(ebook => (
            <Link
              key={ebook.id}
              to={`/ebooks/${ebook.id}`}
              className="group ebook-card"
            >
              <div className="relative">
                <img
                  src={ebook.thumbnail}
                  alt={ebook.title}
                  className="ebook-card-image"
                />
                <div className="ebook-card-overlay">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <button className="btn w-full flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="ebook-card-content">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                  {ebook.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  por {ebook.author}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-400">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-white font-medium">{ebook.rating}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Download className="w-4 h-4 mr-1" />
                    <span>{ebook.downloads}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};