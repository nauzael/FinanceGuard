
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const init = () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error("No se pudo encontrar el elemento raíz para montar la aplicación.");
    }

    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    console.log('FinanceGuard: Aplicación montada correctamente');

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  } catch (error) {
    console.error('Error durante la inicialización:', error);
    const errorDisplay = document.getElementById('error-display');
    if (errorDisplay) {
      errorDisplay.style.display = 'block';
      errorDisplay.innerHTML = `<div style="padding: 20px; background: white; color: red; border-bottom: 2px solid red;">Error de inicio: ${error.message}</div>`;
    }
  }
};

// Asegurar que el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
