import { A } from '@solidjs/router';

export default function NotFound() {
  return (
    <div class="container mx-auto p-4">
      <h1 class="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <A href="/">Go back to the home page</A>
    </div>
  );
}
