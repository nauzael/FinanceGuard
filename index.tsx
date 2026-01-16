
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const mountApp = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('FinanceGuard: Cargado con éxito.');
  } catch (err) {
    console.error('Fallo al renderizar React:', err);
    document.body.innerHTML = `<div style="padding:20px; color:red;">Fallo fatal: ${err.message}</div>`;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
