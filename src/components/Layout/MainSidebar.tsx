import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  Home,
  Newspaper,
  BookOpen,
  Settings,
  Book,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { clsx } from 'clsx';

interface MainSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const MainSidebar = ({ isCollapsed, onToggle }: MainSidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [logoError, setLogoError] = React.useState(false);

  const menuItems = [
    {
      title: 'Home',
      path: '/dashboard',
      icon: <Home className="w-5 h-5" />
    },
    {
      title: 'Notícias',
      path: '/news',
      icon: <Newspaper className="w-5 h-5" />
    },
    {
      title: 'Cursos',
      path: '/courses',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      title: 'E-books',
      path: '/ebooks',
      icon: <Book className="w-5 h-5" />
    }
  ];

  // Add settings link if user is admin
  if (user?.role === 'admin') {
    menuItems.push({
      title: 'Configurações',
      path: '/settings',
      icon: <Settings className="w-5 h-5" />
    });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div 
      className={clsx(
        "fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl transition-all duration-300 z-40 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Fixed Logo Container */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-16 bg-gray-900 border-b border-gray-700">
          {!logoError ? (
            <img
              src="https://vpjalimentos.com.br/wp-content/uploads/2019/11/Logo_VPJ_Pecuaria_500x500-1.png"
              alt="VPJ EAD"
              className={clsx(
                "transition-all duration-300",
                isCollapsed ? "h-8 w-8" : "h-12 w-auto"
              )}
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className={clsx(
              "flex items-center justify-center font-bold text-white",
              isCollapsed ? "text-lg" : "text-2xl"
            )}>
              VPJ
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-4 top-20 bg-gray-800 rounded-full p-2 text-gray-400 hover:text-white shadow-lg"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
      
      {/* Scrollable Navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 mt-5 px-3">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={clsx(
                "flex items-center px-3 py-2 mb-2 rounded-lg transition-colors duration-150 ease-in-out",
                isActive(item.path)
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.title : undefined}
            >
              {item.icon}
              {!isCollapsed && (
                <span className="ml-3 font-medium">{item.title}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="flex-shrink-0 p-3 border-t border-gray-700">
          <button
            onClick={logout}
            className={clsx(
              "flex items-center w-full px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && (
              <span className="ml-3 font-medium">Sair</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};