import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App.jsx';

const container = document.getElementById('root');

if (container) {
  // If root has server-rendered HTML, hydrate it. Otherwise mount cleanly.
  if (container.hasChildNodes()) {
    hydrateRoot(container, <App />);
  } else {
    createRoot(container).render(<App />);
  }
}
