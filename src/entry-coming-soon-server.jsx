import React from 'react';
import { renderToString } from 'react-dom/server';
import ComingSoonApp from './ComingSoonApp.jsx';

export function render() {
  return renderToString(<ComingSoonApp />);
}

export default render;
