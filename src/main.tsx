import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext.tsx';
import App from './App.tsx';
import './index.css';

// Auto-bypass ngrok interstitial warning and support resilient tunneling
const originalFetch = window.fetch;
window.fetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
  const headers = new Headers(init.headers || {});
  if (!headers.has('ngrok-skip-browser-warning')) {
    headers.set('ngrok-skip-browser-warning', '69420');
  }
  return originalFetch(input, { ...init, headers });
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
);

