import { render } from 'solid-js/web';
import { ErrorBoundary } from 'solid-js';
import { Router, Route, useParams } from '@solidjs/router';
import { Navigate } from '@solidjs/router';
import 'solid-devtools';

import { ThemeProvider } from './contexts/ThemeContext';
import BackgroundPattern from './components/interface/BackgroundPattern';
import Footer from './components/interface/Footer';
import Header from './components/interface/Header';

import App from './App';
import Roleco from './pages/Roleco';
import Scrumble from './pages/Scrumble';
import NotFound from './pages/NotFound';
import About from './pages/About';

import './index.css';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?'
  );
}

// Create and append background elements
const gradientBase = document.createElement('div');
gradientBase.className = 'gradient-base';
document.body.insertBefore(gradientBase, root);

const gradientOverlay = document.createElement('div');
gradientOverlay.className = 'gradient-overlay';
document.body.insertBefore(gradientOverlay, root);

const patternLayer = document.createElement('div');
patternLayer.className = 'pattern-layer';
document.body.insertBefore(patternLayer, root);

const RolecoWrapper = () => {

  const params = useParams();
  const parseRoleco = (param) => {

    if (!param || param.length < 3) {
      return null;
    }
    // Handle old URL format
    if (param.startsWith('pm')) {
      return {
        role: 'product manager',
        company: param.slice(2)
      }
    }
    if (param.startsWith('po')) {
      return {
        role: 'product owner',
        company: param.slice(2)
      }
    }
    
    // Handle new URL format - default to product manager
    return {
      role: 'product manager',
      company: param
    }
  };

  const parsedParams = parseRoleco(params.roleco);

  if (!parsedParams) {
    return <Navigate href="/" />;
  }

  return (
    <Roleco
      role={parsedParams.role.toUpperCase()}
      company={parsedParams.company.toUpperCase()}
      testMode={false}
    />
  );
};

const Layout = props => {
  return (
    <div class="layout">
      <Header />
      <main>
          {props.children}
      </main>
      <Footer />
    </div>
  );
};

render(
  () => (
    <ErrorBoundary fallback={err => <div>Error: {err.toString()}</div>}>
      <ThemeProvider>
        <BackgroundPattern />
        <Router root={Layout}>
          <Route
            path="/"
            component={App}
          />
          <Route
            path="/:roleco"
            component={RolecoWrapper}
          />
          <Route
            path="/about"
            component={About}
          />
          {/* <Route
            path="/scrumble"
            component={Scrumble}
          /> */}
          <Route
            path="*404"
            component={NotFound}
          />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  ),
  root
);
