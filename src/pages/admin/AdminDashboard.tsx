import React from 'react';
import { MainLayout } from '../../components/Layout/MainLayout';
import { Tab } from '@headlessui/react';
import { UserSettings } from '../settings/tabs/UserSettings';
import { GroupSettings } from '../settings/tabs/GroupSettings';
import { CourseSettings } from '../settings/tabs/CourseSettings';
import { LessonSettings } from '../settings/tabs/LessonSettings';
import { QuizSettings } from '../settings/tabs/QuizSettings';
import { NewsSettings } from '../settings/tabs/NewsSettings';
import { clsx } from 'clsx';
import { 
  Users, 
  Group, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Newspaper,
  Search,
  Filter,
  Plus,
  ArrowUpRight
} from 'lucide-react';

export const AdminDashboard = () => {
  const tabs = [
    { 
      id: 'users', 
      label: 'Usuários', 
      icon: <Users className="w-5 h-5" />,
      component: UserSettings,
      stats: {
        total: 245,
        active: 180,
        new: 12
      }
    },
    { 
      id: 'groups', 
      label: 'Grupos', 
      icon: <Group className="w-5 h-5" />,
      component: GroupSettings,
      stats: {
        total: 8,
        active: 6
      }
    },
    { 
      id: 'courses', 
      label: 'Cursos', 
      icon: <BookOpen className="w-5 h-5" />,
      component: CourseSettings,
      stats: {
        total: 12,
        active: 8,
        draft: 4
      }
    },
    { 
      id: 'lessons', 
      label: 'Aulas', 
      icon: <FileText className="w-5 h-5" />,
      component: LessonSettings,
      stats: {
        total: 156,
        videos: 120,
        documents: 36
      }
    },
    { 
      id: 'quizzes', 
      label: 'Avaliações', 
      icon: <GraduationCap className="w-5 h-5" />,
      component: QuizSettings,
      stats: {
        total: 24,
        avgScore: 8.5
      }
    },
    { 
      id: 'news', 
      label: 'Notícias', 
      icon: <Newspaper className="w-5 h-5" />,
      component: NewsSettings,
      stats: {
        total: 45,
        featured: 3
      }
    }
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Administração</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gerencie usuários, cursos, conteúdo e configurações da plataforma.
          </p>
        </div>

        <div className="mt-4">
          <Tab.Group>
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Selecione uma aba
              </label>
              <select
                id="tabs"
                name="tabs"
                className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                defaultValue={tabs[0].id}
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <Tab.List className="flex -mb-px space-x-8">
                  {tabs.map((tab) => (
                    <Tab
                      key={tab.id}
                      className={({ selected }) =>
                        clsx(
                          'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm focus:outline-none',
                          selected
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        )
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={clsx(
                            'mr-3',
                            selected ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
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
            </div>

            <Tab.Panels className="mt-8">
              {tabs.map((tab, idx) => (
                <Tab.Panel
                  key={tab.id}
                  className={clsx(
                    'space-y-6',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500'
                  )}
                >
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(tab.stats).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-white overflow-hidden shadow rounded-lg"
                      >
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {tab.icon}
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 uppercase">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </dt>
                                <dd className="flex items-baseline">
                                  <div className="text-2xl font-semibold text-gray-900">
                                    {value}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-medium text-gray-900">
                        Ações Rápidas
                      </h2>
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            placeholder="Buscar..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <button className="btn-secondary flex items-center gap-2">
                          <Filter className="w-4 h-4" />
                          Filtros
                        </button>
                        <button className="btn flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          Adicionar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="p-6">
                      <tab.component />
                    </div>
                  </div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </MainLayout>
  );
};