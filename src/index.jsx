/* @refresh reload */
import { render } from 'solid-js/web';
import { Router, Route, useParams, useNavigate } from '@solidjs/router';
import { Navigate } from '@solidjs/router';

import 'solid-devtools'

import './index.css';
import App from './App';
import Roleco from './pages/Roleco';
import Scrumble from './pages/Scrumble';
import NotFound from './pages/NotFound';


const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

// Create and append background elements
const gradientBase = document.createElement('div');
gradientBase.className = 'gradient-base';
document.body.insertBefore(gradientBase, root);

const gradientOverlay = document.createElement('div');
gradientOverlay.className = 'gradient-overlay';
document.body.insertBefore(gradientOverlay, root);


const RolecoWrapper = () => {
  const params = useParams();
  const navigate = useNavigate();
  
  const parseRoleco = (rolecoParam) => {
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
render(() => (
    <Router>
        <Route path="/" component={App} />
        <Route 
          path="/:roleco"
          component={RolecoWrapper}
        />
        <Route path="/scrumble" component={Scrumble} />
        <Route path="*404" component={NotFound} />
    </Router>
), root);