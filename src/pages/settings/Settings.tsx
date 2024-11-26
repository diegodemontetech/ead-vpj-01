import React from 'react';
import { MainLayout } from '../../components/Layout/MainLayout';
import { Tab } from '@headlessui/react';
import { UserSettings } from './tabs/UserSettings';
import { GroupSettings } from './tabs/GroupSettings';
import { CourseSettings } from './tabs/CourseSettings';
import { ModuleSettings } from './tabs/ModuleSettings';
import { LessonSettings } from './tabs/LessonSettings';
import { QuizSettings } from './tabs/QuizSettings';
import { NewsSettings } from './tabs/NewsSettings';
import { EbookSettings } from './tabs/EbookSettings';
import { clsx } from 'clsx';
import { 
  Users, 
  Group, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Newspaper,
  Book,
  Layout as LayoutIcon,
  Video,
  PlusCircle,
  Settings as SettingsIcon
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Navigate } from 'react-router-dom';

export function Settings() {
  const { user } = useAuthStore();

  // Redirect non-admin users
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const tabs = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <LayoutIcon className="w-5 h-5" />,
      component: UserSettings,
      group: 'main'
    },
    { 
      id: 'users', 
      label: 'Usuários', 
      icon: <Users className="w-5 h-5" />,
      component: UserSettings,
      group: 'main'
    },
    { 
      id: 'groups', 
      label: 'Grupos', 
      icon: <Group className="w-5 h-5" />,
      component: GroupSettings,
      group: 'main'
    },
    { 
      id: 'courses', 
      label: 'Cursos', 
      icon: <BookOpen className="w-5 h-5" />,
      component: CourseSettings,
      group: 'main'
    },
    { 
      id: 'modules', 
      label: 'Módulos', 
      icon: <Video className="w-5 h-5" />,
      component: ModuleSettings,
      group: 'main'
    },
    { 
      id: 'lessons', 
      label: 'Aulas', 
      icon: <FileText className="w-5 h-5" />,
      component: LessonSettings,
      group: 'content'
    },
    { 
      id: 'quizzes', 
      label: 'Avaliações', 
      icon: <GraduationCap className="w-5 h-5" />,
      component: QuizSettings,
      group: 'content'
    },
    { 
      id: 'news', 
      label: 'Notícias', 
      icon: <Newspaper className="w-5 h-5" />,
      component: NewsSettings,
      group: 'content'
    },
    { 
      id: 'ebooks', 
      label: 'E-books', 
      icon: <Book className="w-5 h-5" />,
      component: EbookSettings,
      group: 'content'
    },
    { 
      id: 'settings', 
      label: 'Configurações', 
      icon: <SettingsIcon className="w-5 h-5" />,
      component: UserSettings,
      group: 'content'
    }
  ];

  const mainTabs = tabs.filter(tab => tab.group === 'main');
  const contentTabs = tabs.filter(tab => tab.group === 'content');

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Configurações
          </h1>
          <p className="mt-2 text-gray-400">
            Gerencie usuários, cursos, conteúdo e configurações da plataforma.
          </p>
        </div>

        <div className="bg-[#1F1F1F] rounded-lg shadow-lg">
          <Tab.Group>
            <div className="border-b border-gray-700">
              {/* Main Tabs */}
              <Tab.List className="flex -mb-px space-x-8 px-6 border-b border-gray-700">
                {mainTabs.map((tab) => (
                  <Tab
                    key={tab.id}
                    className={({ selected }) =>
                      clsx(
                        'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm focus:outline-none',
                        selected
                          ? 'border-[#E50914] text-white'
                          : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                      )
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={clsx(
                          'mr-3',
                          selected ? 'text-[#E50914]' : 'text-gray-400 group-hover:text-gray-300'
                        )}>
                          {tab.icon}
                        </span>
                        {tab.label}
                      </>
                    )}
                  </Tab>
                ))}
              </Tab.List>

              {/* Content Tabs */}
              <Tab.List className="flex -mb-px space-x-8 px-6 mt-2">
                {contentTabs.map((tab) => (
                  <Tab
                    key={tab.id}
                    className={({ selected }) =>
                      clsx(
                        'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm focus:outline-none',
                        selected
                          ? 'border-[#E50914] text-white'
                          : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                      )
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={clsx(
                          'mr-3',
                          selected ? 'text-[#E50914]' : 'text-gray-400 group-hover:text-gray-300'
                        )}>
                          {tab.icon}
                        </span>
                        {tab.label}
                      </>
                    )}
                  </Tab>
                ))}
              </Tab.List>
            </div>

            <Tab.Panels className="p-6">
              {[...mainTabs, ...contentTabs].map((tab) => (
                <Tab.Panel
                  key={tab.id}
                  className={clsx(
                    'focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:ring-opacity-50'
                  )}
                >
                  <tab.component />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </MainLayout>
  );
}