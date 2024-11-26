import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash, Save, Tag } from 'lucide-react';
import { clsx } from 'clsx';

const categorySchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  usageCount: {
    courses: number;
    ebooks: number;
  };
}

export const CategorySettings = () => {
  const [categories, setCategories] = React.useState<Category[]>([
    {
      id: '1',
      name: 'Gestão de Pastagens',
      description: 'Conteúdo relacionado ao manejo e gestão de pastagens',
      color: '#2563EB',
      usageCount: { courses: 2, ebooks: 1 },
    },
    {
      id: '2',
      name: 'Nutrição Animal',
      description: 'Material sobre nutrição e alimentação animal',
      color: '#16A34A',
      usageCount: { courses: 1, ebooks: 2 },
    },
  ]);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      color: '#2563EB',
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (selectedCategory) {
        setCategories(prev => prev.map(cat => 
          cat.id === selectedCategory.id ? { ...cat, ...data } : cat
        ));
      } else {
        setCategories(prev => [...prev, {
          id: Date.now().toString(),
          ...data,
          usageCount: { courses: 0, ebooks: 0 },
        }]);
      }
      reset();
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const deleteCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category && (category.usageCount.courses > 0 || category.usageCount.ebooks > 0)) {
      alert('Não é possível excluir uma categoria em uso');
      return;
    }
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    if (selectedCategory?.id === categoryId) {
      setSelectedCategory(null);
      reset();
    }
  };

  return (
    <div className="space-y-6">
      {/* Category List */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              Categorias
            </h2>
            <button
              onClick={() => {
                setSelectedCategory(null);
                reset();
              }}
              className="btn flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nova Categoria
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <div
                key={category.id}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        reset(category);
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className={clsx(
                        "text-red-600 hover:text-red-700",
                        (category.usageCount.courses > 0 || category.usageCount.ebooks > 0) && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                  <span>{category.usageCount.courses} cursos</span>
                  <span>{category.usageCount.ebooks} e-books</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Form */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {selectedCategory ? 'Editar Categoria' : 'Nova Categoria'}
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cor
                </label>
                <div className="mt-1 flex items-center space-x-3">
                  <input
                    type="color"
                    {...register('color')}
                    className="h-10 w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    {...register('color')}
                    className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="#000000"
                  />
                </div>
                {errors.color && (
                  <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn flex items-center gap-2">
                <Save className="w-4 h-4" />
                {selectedCategory ? 'Atualizar Categoria' : 'Criar Categoria'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};