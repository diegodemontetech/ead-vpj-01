import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { CourseList } from './pages/courses/CourseList';
import { CourseView } from './pages/courses/CourseView';
import { LessonView } from './pages/courses/LessonView';
import { ModuleExam } from './pages/courses/ModuleExam';
import { CertificateView } from './pages/certificates/CertificateView';
import { CertificateList } from './pages/certificates/CertificateList';
import { Settings } from './pages/settings/Settings';
import { NewsList } from './pages/news/NewsList';
import { NewsDetail } from './pages/news/NewsDetail';
import { Ebooks } from './pages/Ebooks';
import { EbookView } from './pages/EbookView';
import { useAuthStore } from './store/useAuthStore';
import { Login } from './pages/auth/Login';

export default function App() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/:courseId" element={<CourseView />} />
        <Route path="/courses/:courseId/modules/:moduleId/lessons/:lessonId" element={<LessonView />} />
        <Route path="/courses/:courseId/modules/:moduleId/exam" element={<ModuleExam />} />
        <Route path="/certificates" element={<CertificateList />} />
        <Route path="/certificates/:certificateId" element={<CertificateView />} />
        <Route path="/settings/*" element={<Settings />} />
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/:newsId" element={<NewsDetail />} />
        <Route path="/ebooks" element={<Ebooks />} />
        <Route path="/ebooks/:ebookId" element={<EbookView />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}