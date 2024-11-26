import React from 'react';
import { Sidebar } from './Sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="py-6 px-8">
          {children}
        </div>
      </main>
    </div>
  );
};