import React from 'react';
import { MainSidebar } from './MainSidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = React.useState(true);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header />
      <MainSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <main className={`pt-16 ${isCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        {children}
      </main>
    </div>
  );
};