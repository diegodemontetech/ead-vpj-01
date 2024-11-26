import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Save, Trash, Book } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const ebookSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  author: z.string().min(3, 'Nome do autor deve ter pelo menos 3 caracteres'),
  description: z.string(),
  category: z.enum(['pastagens', 'nutricao', 'reproducao', 'gestao']),
  publishedAt: z.string(),
});

type EbookFormData = z.infer<typeof ebookSchema>;

interface Ebook extends EbookFormData {
  id: string;
  thumbnail: string;
  pdfUrl: string;
  downloads: number;
}

export const EbookSettings = () => {
  const [ebooks, setEbooks] = React.useState<Ebook[]>([]);
  const [selectedEbook, setSelectedEbook] = React.useState<Ebook | null>(null);
  const [thumbnail, setThumbnail] = React.useState<File | null>(null);
  const [pdf, setPdf] = React.useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = React.useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EbookFormData>({
    resolver: zodResolver(ebookSchema),
  });

  const onDropThumbnail = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  }, []);

  const onDropPDF = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setPdf(file);
  }, []);

  const {
    getRootProps: getThumbnailRootProps,
    getInputProps: getThumbnailInputProps,
    isDragActive: isThumbnailDragActive,
  } = useDropzone({
    onDrop: onDropThumbnail,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxFiles: 1,
  });

  const {
    getRootProps: getPDFRootProps,
    getInputProps: getPDFInputProps,
    isDragActive: isPDFDragActive,
  } = useDropzone({
    onDrop: onDropPDF,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const onSubmit = async (data: EbookFormData) => {
    try {
      const formData = new FormData();
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }
      if (pdf) {
        formData.append('pdf', pdf);
      }
      formData.append('data', JSON.stringify(data));
      
      // Here you would typically make an API call to save the ebook
      const mockEbook: Ebook = {
        id: Date.now().toString(),
        ...data,
        thumbnail: thumbnailPreview,
        pdfUrl: 'mock-pdf-url.pdf',
        downloads: 0,
      };

      if (selectedEbook) {
        setEbooks(prev => prev.map(eb => 
          eb.id === selectedEbook.id ? mockEbook : eb
        ));
      } else {
        setEbooks(prev => [...prev, mockEbook]);
      }

      reset();
      setSelectedEbook(null);
      setThumbnail(null);
      setPdf(null);
      setThumbnailPreview('');
    } catch (error) {
      console.error('Error saving ebook:', error);
    }
  };

  const deleteEbook = (ebookId: string) => {
    setEbooks(prev => prev.filter(eb => eb.id !== ebookId));
    if (selectedEbook?.id === ebookId) {
      setSelectedEbook(null);
      reset();
      setThumbnail(null);
      setPdf(null);
      setThumbnailPreview('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Ebook List */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              E-books
            </h2>
            <button
              onClick={() => {
                setSelectedEbook(null);
                reset();
                setThumbnail(null);
                setPdf(null);
                setThumbnailPreview('');
              }}
              className="btn flex items-center gap-2"
            >
              <Book className="w-4 h-4" />
              Novo E-book
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ebooks.map(ebook => (
              <div
                key={ebook.id}
                className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={ebook.thumbnail}
                    alt={ebook.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {ebook.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    por {ebook.author}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {ebook.downloads} downloads
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedEbook(ebook);
                          reset(ebook);
                          setThumbnailPreview(ebook.thumbnail);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteEbook(ebook.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ebook Form */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {selectedEbook ? 'Editar E-book' : 'Novo E-book'}
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Thumbnail Upload */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capa do E-book
                </label>
                <div
                  {...getThumbnailRootProps()}
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-400 ${
                    isThumbnailDragActive ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                >
                  <div className="space-y-1 text-center">
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt="Preview"
                        className="mx-auto h-32 w-24 object-cover rounded-lg"
                      />
                    ) : (
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600">
                      <input {...getThumbnailInputProps()} />
                      <p className="pl-1">
                        {isThumbnailDragActive
                          ? 'Solte a imagem aqui'
                          : 'Arraste uma imagem ou clique para selecionar'}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG até 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* PDF Upload */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arquivo PDF
                </label>
                <div
                  {...getPDFRootProps()}
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-400 ${
                    isPDFDragActive ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                >
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <input {...getPDFInputProps()} />
                      <p className="pl-1">
                        {pdf ? pdf.name : 'Arraste o PDF ou clique para selecionar'}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF até 50MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Título
                </label>
                <input
                  type="text"
                  {...register('title')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Autor
                </label>
                <input
                  type="text"
                  {...register('author')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.author && (
                  <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data de Publicação
                </label>
                <input
                  type="date"
                  {...register('publishedAt')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Categoria
                </label>
                <select
                  {...register('category')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="pastagens">Gestão de Pastagens</option>
                  <option value="nutricao">Nutrição Animal</option>
                  <option value="reproducao">Reprodução</option>
                  <option value="gestao">Gestão Rural</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn flex items-center gap-2">
                <Save className="w-4 h-4" />
                {selectedEbook ? 'Atualizar E-book' : 'Salvar E-book'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};