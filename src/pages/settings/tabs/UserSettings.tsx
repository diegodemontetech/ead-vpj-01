import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Save, UserPlus } from 'lucide-react';
import { useSupabaseQuery } from '../../../hooks/useSupabaseQuery';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import { authService } from '../../../services/auth.service';

const userSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['admin', 'student']),
  department: z.string(),
  position: z.string(),
  group_id: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserSettings() {
  const [isCreating, setIsCreating] = React.useState(false);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const { data: groups, isLoading: isLoadingGroups } = useSupabaseQuery({
    key: ['groups'],
    query: () => supabase.from('groups').select('*'),
  });

  const { data: users, isLoading: isLoadingUsers, refetch: refetchUsers } = useSupabaseQuery({
    key: ['users'],
    query: () => supabase
      .from('users')
      .select(`
        *,
        groups:user_groups(
          group:groups(*)
        )
      `),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'student',
    },
  });

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Usuário excluído com sucesso!');
      refetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir usuário');
    }
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsLoading(true);

      // Create user with auth service
      const { user } = await authService.signUp({
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
      });

      if (!user) throw new Error('Erro ao criar usuário');

      // Add user to group if selected
      if (data.group_id) {
        const { error: groupError } = await supabase
          .from('user_groups')
          .insert({
            user_id: user.id,
            group_id: data.group_id,
          });

        if (groupError) throw groupError;
      }

      toast.success('Usuário criado com sucesso!');
      reset();
      setIsCreating(false);
      setAvatarPreview(null);
      refetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar usuário');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Users List */}
      <div className="bg-[#1F1F1F] rounded-lg shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-medium text-white">
                Usuários
              </h2>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="btn flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Novo Usuário
            </button>
          </div>

          {isLoadingUsers ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : users && users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-[#2F2F2F]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Departamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Grupo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#1F1F1F] divide-y divide-gray-700">
                  {users.map((user: any) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={user.avatar_url}
                            alt={user.name}
                            className="h-8 w-8 rounded-full"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{user.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{user.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {user.groups?.[0]?.group?.name || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">
              Nenhum usuário encontrado
            </p>
          )}
        </div>
      </div>

      {/* Create User Form */}
      {isCreating && (
        <div className="bg-[#1F1F1F] rounded-lg shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-white mb-6">
              Novo Usuário
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={avatarPreview || 'https://via.placeholder.com/150'}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer">
                    <Upload className="w-4 h-4 text-gray-600" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setAvatarPreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-[#2F2F2F] text-white shadow-sm focus:border-[#E50914] focus:ring-[#E50914]"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-[#2F2F2F] text-white shadow-sm focus:border-[#E50914] focus:ring-[#E50914]"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Senha
                  </label>
                  <input
                    type="password"
                    {...register('password')}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-[#2F2F2F] text-white shadow-sm focus:border-[#E50914] focus:ring-[#E50914]"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Tipo de Usuário
                  </label>
                  <select
                    {...register('role')}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-[#2F2F2F] text-white shadow-sm focus:border-[#E50914] focus:ring-[#E50914]"
                  >
                    <option value="student">Aluno</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Departamento
                  </label>
                  <select
                    {...register('department')}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-[#2F2F2F] text-white shadow-sm focus:border-[#E50914] focus:ring-[#E50914]"
                  >
                    <option value="">Selecione um departamento</option>
                    <option value="Administrativo">Administrativo</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Controladoria">Controladoria</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Logística">Logística</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operações">Operações</option>
                    <option value="Pecuária">Pecuária</option>
                    <option value="Produção">Produção</option>
                    <option value="Qualidade">Qualidade</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
                    <option value="Tecnologia da Informação">Tecnologia da Informação</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Cargo
                  </label>
                  <input
                    type="text"
                    {...register('position')}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-[#2F2F2F] text-white shadow-sm focus:border-[#E50914] focus:ring-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Grupo
                  </label>
                  <select
                    {...register('group_id')}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-[#2F2F2F] text-white shadow-sm focus:border-[#E50914] focus:ring-[#E50914]"
                    disabled={isLoadingGroups}
                  >
                    <option value="">Selecione um grupo</option>
                    {groups?.map((group: any) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Criar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}