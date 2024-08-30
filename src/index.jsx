/* @refresh reload */
import { render } from 'solid-js/web';
import { Router, Route, useParams, useNavigate } from '@solidjs/router';
import { Navigate } from '@solidjs/router';
import 'solid-devtools';

import { ThemeProvider } from './contexts/ThemeContext';

import './index.css';

import App from './App';
import Roleco from './pages/Roleco';
import Scrumble from './pages/Scrumble';
import NotFound from './pages/NotFound';

console.log('index.jsx: Starting to render');

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

console.log('index.jsx: Background elements created');

const RolecoWrapper = () => {
  console.log('RolecoWrapper: Component rendered');
  const params = useParams();
  const navigate = useNavigate();

  const parseRoleco = rolecoParam => {
    if (!rolecoParam || rolecoParam.length < 3) {
      return null;
    }

    const roleCode = rolecoParam.substring(0, 2).toLowerCase();
    const company = rolecoParam.substring(2);

    let role;
    switch (roleCode) {
      case 'pm':
        role = 'product manager';
        break;
      case 'po':
        role = 'product owner';
        break;
      default:
        return null;
    }

    return { role, company };
  };

  const parsedParams = parseRoleco(params.roleco);

  if (!parsedParams) {
    return <Navigate href="/" />;
  }

  return <Roleco role={parsedParams.role} company={parsedParams.company} />;
};

// Render the app
console.log('index.jsx: About to render app');

const Layout = props => {
  console.log('Layout: Component rendered', props);
  return (
    <>
      <header>
        <nav class="navContainer">
          <a href="/" class="navLink">
            Home
          </a>
          <a href="/pmnotion" class="navLink">
            PM Notion
          </a>
          <a href="/scrumble" class="navLink">
            Scrumble
          </a>
        </nav>
      </header>

      {props.children}
      <footer>Footer</footer>
    </>
  );
};

render(
  () => (
    <ThemeProvider>
      <Router root={Layout}>
        {console.log('index.jsx: Inside ThemeProvider')}
        <Route path="/" component={App} />
        <Route path="/:roleco" component={RolecoWrapper} />
        <Route path="/scrumble" component={Scrumble} />
        <Route path="*404" component={NotFound} />
      </Router>
    </ThemeProvider>
  ),
  root
);

console.log('index.jsx: Render complete');
