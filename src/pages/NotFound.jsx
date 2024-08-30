import { A } from '@solidjs/router';

const NotFound = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <A href="/">Go back to the home page</A>
    </div>
  );
};

export default NotFound;
