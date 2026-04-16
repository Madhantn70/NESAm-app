import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize mocks correctly (as imported in core/api/index.ts)
import './core/api';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
