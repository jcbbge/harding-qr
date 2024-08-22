console.log('Starting app');

/* @refresh reload */
import { render } from 'solid-js/web';
import 'solid-devtools'

import './index.css';
import App from './App';

console.log('Imports completed');

const root = document.getElementById('root');

console.log('Root element:', root);

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

console.log('About to render');

// Create and append background elements
const gradientBase = document.createElement('div');
gradientBase.className = 'gradient-base';
document.body.insertBefore(gradientBase, root);

const gradientOverlay = document.createElement('div');
gradientOverlay.className = 'gradient-overlay';
document.body.insertBefore(gradientOverlay, root);

// Render the app
render(() => <App />, root);

console.log('Render called');