import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import ComingSoonApp from './ComingSoonApp.jsx';

const container = document.getElementById('root');

if (container) {
  if (container.hasChildNodes()) {
    hydrateRoot(container, <ComingSoonApp />);
  } else {
    createRoot(container).render(<ComingSoonApp />);
  }
}
