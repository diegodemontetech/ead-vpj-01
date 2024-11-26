import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'diegodemontevpj@gmail.com',
      password: 'admin123',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await signIn(data);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="https://vpjalimentos.com.br/wp-content/uploads/2019/11/Logo_VPJ_Pecuaria_500x500-1.png"
            alt="VPJ EAD"
            className="h-16 w-auto"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/200x200?text=VPJ';
            }}
          />
        </div>

        {/* Login Form */}
        <div className="bg-[#1F1F1F] rounded-lg p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Bem-vindo de volta
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-[#2F2F2F] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-[#E50914]"
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  {...register('password')}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-[#2F2F2F] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-[#E50914]"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E50914] hover:bg-[#B81D24] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E50914] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Entrar'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-400">
              Esqueceu sua senha?{' '}
              <button
                onClick={() => toast.info('Entre em contato com o administrador')}
                className="font-medium text-[#E50914] hover:text-[#B81D24]"
              >
                Recuperar acesso
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}