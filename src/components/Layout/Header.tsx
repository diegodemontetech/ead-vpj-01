import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Settings, Award, Clock, BookOpen } from 'lucide-react';
import { NotificationBell } from '../ui/NotificationBell';
import { Link, useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const stats = [
    {
      icon: <BookOpen className="w-5 h-5 text-blue-400 hover:text-blue-300 transition-colors" />,
      path: '/courses',
      title: 'Meus Cursos'
    },
    {
      icon: <Award className="w-5 h-5 text-green-400 hover:text-green-300 transition-colors" />,
      path: '/certificates',
      title: 'Certificados'
    },
    {
      icon: <Clock className="w-5 h-5 text-purple-400 hover:text-purple-300 transition-colors" />,
      path: '/dashboard',
      title: 'Horas de Estudo'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#141414] shadow-lg h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-end items-center h-full">
          <div className="flex items-center space-x-6">
            {stats.map((stat, index) => (
              <Link
                key={index}
                to={stat.path}
                className="p-2 rounded-full hover:bg-[#2F2F2F] transition-colors"
                title={stat.title}
              >
                {stat.icon}
              </Link>
            ))}

            <NotificationBell />

            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <img
                  src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}`}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#2F2F2F] rounded-md shadow-lg py-1 z-50">
                  {user?.role === 'admin' && (
                    <Link
                      to="/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#3F3F3F]"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Configurações
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#3F3F3F]"
                  >
                    <Award className="w-4 h-4 mr-3" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}