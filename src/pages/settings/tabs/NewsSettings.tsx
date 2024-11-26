import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Save } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const newsSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  content: z.string(),
  category: z.enum(['announcement', 'update', 'event']),
  featured: z.boolean(),
  tags: z.array(z.string()),
});

type NewsFormData = z.infer<typeof newsSchema>;

export const NewsSettings = () => {
  const [image, setImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      featured: false,
      tags: [],
    },
  });

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxFiles: 1,
  });

  const onSubmit = async (data: NewsFormData) => {
    try {
      const formData = new FormData();
      if (image) {
        formData.append('image', image);
      }
      formData.append('data', JSON.stringify(data));
      
      // Here you would typically make an API call to save the news
      console.log('Form data:', formData);
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Adicionar Nova Notícia
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem da Notícia
            </label>
            <div
              {...getRootProps()}
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-400 transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto h-32 w-32 object-cover rounded-lg"
                  />
                ) : (
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600">
                  <input {...getInputProps()} />
                  <p className="pl-1">
                    {isDragActive
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

          <div className="grid grid-cols-1 gap-6">
            <div>
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
                Conteúdo
              </label>
              <textarea
                {...register('content')}
                rows={6}
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
                <option value="announcement">Anúncio</option>
                <option value="update">Atualização</option>
                <option value="event">Evento</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tags (separadas por vírgula)
              </label>
              <input
                type="text"
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(tag => tag.trim());
                  register('tags').onChange({
                    target: { value: tags, name: 'tags' }
                  });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('featured')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Destacar notícia
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn flex items-center gap-2">
              <Save className="w-4 h-4" />
              Salvar Notícia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};