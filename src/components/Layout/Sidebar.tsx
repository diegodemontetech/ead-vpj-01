import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  Users, 
  Settings,
  Layout as LayoutIcon,
  GraduationCap,
  PlusCircle,
  Group,
  FileText,
  Video,
  Award
} from 'lucide-react';

interface MenuItem {
  title: string;
  path?: string;
  icon: React.ReactNode;
  submenu?: {
    title: string;
    path: string;
    icon?: React.ReactNode;
  }[];
}

export const Sidebar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = React.useState<string[]>(['courses']);

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: <LayoutIcon className="w-5 h-5" />,
    },
    {
      title: 'Cursos',
      icon: <BookOpen className="w-5 h-5" />,
      submenu: [
        { 
          title: 'Lista de Cursos', 
          path: '/admin/courses',
          icon: <FileText className="w-4 h-4" />
        },
        { 
          title: 'Novo Curso', 
          path: '/admin/courses/new',
          icon: <PlusCircle className="w-4 h-4" />
        },
        { 
          title: 'Módulos', 
          path: '/admin/modules',
          icon: <Video className="w-4 h-4" />
        },
      ],
    },
    {
      title: 'Usuários',
      icon: <Users className="w-5 h-5" />,
      submenu: [
        { 
          title: 'Lista de Usuários', 
          path: '/admin/users',
          icon: <Users className="w-4 h-4" />
        },
        { 
          title: 'Novo Usuário', 
          path: '/admin/users/new',
          icon: <PlusCircle className="w-4 h-4" />
        },
        { 
          title: 'Grupos', 
          path: '/admin/groups',
          icon: <Group className="w-4 h-4" />
        },
      ],
    },
    {
      title: 'Certificados',
      path: '/admin/certificates',
      icon: <Award className="w-5 h-5" />,
    },
    {
      title: 'Configurações',
      path: '/admin/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title)
        ? prev.filter((menu) => menu !== title)
        : [...prev, title]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen fixed left-0 top-0 shadow-xl">
      <div className="flex items-center justify-center h-16 bg-gray-900 border-b border-gray-700">
        <img
          src="https://vpjalimentos.com.br/wp-content/uploads/2019/11/Logo_VPJ_Pecuaria_500x500-1.png"
          alt="VPJ EAD"
          className="h-12 w-auto"
        />
      </div>
      <nav className="mt-5 px-3">
        {menuItems.map((item) => (
          <div key={item.title} className="mb-3">
            {item.submenu ? (
              <>
                <button
                  onClick={() => toggleMenu(item.title)}
                  className="w-full flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-150 ease-in-out"
                >
                  {item.icon}
                  <span className="ml-3 flex-1 text-sm font-medium">{item.title}</span>
                  {openMenus.includes(item.title) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {openMenus.includes(item.title) && (
                  <div className="mt-2 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`flex items-center pl-10 pr-4 py-2 text-sm rounded-lg transition-colors duration-150 ease-in-out ${
                          isActive(subItem.path)
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.path!}
                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-150 ease-in-out ${
                  isActive(item.path!)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.title}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};