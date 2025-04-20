import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';

const Home = lazy(() => import('./pages/Home'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <>
      <Route
        path="/"
        component={Home}
      />
      <Route
        path="*"
        component={NotFound}
      />
    </>
  );
}

export default App;
