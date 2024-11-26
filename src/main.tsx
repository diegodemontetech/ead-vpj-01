import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SupabaseProvider } from './providers/SupabaseProvider';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SupabaseProvider>
      <App />
    </SupabaseProvider>
  </StrictMode>
);