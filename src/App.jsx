import { createSignal, onMount, onCleanup, ErrorBoundary } from 'solid-js';
import { useTheme } from './contexts/ThemeContext';
import NameGrid from './components/interface/NameGrid';
import './App.css';

function App() {
  const [company, setCompany] = createSignal('');
  const [role, setRole] = createSignal('');
  const [timeLeft, setTimeLeft] = createSignal(60); // 60 seconds = 1 minute
  const { theme, themes } = useTheme();

  let timerInterval;

  onMount(() => {
    const urlPath = window.location.pathname;
    let pathSegments = urlPath.split('/').filter(Boolean);

    if (pathSegments.length >= 2) {
      setCompany(pathSegments[0]);
      setRole(pathSegments[1]);
    }

    // Start the timer
    timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  });

  onCleanup(() => {
    clearInterval(timerInterval); // Clear the timer interval
  });

  function handleLetterUnlock() {
    // Handle letter unlock logic
  }

  // Format time as MM:SS
  const formattedTime = () => {
    const minutes = Math.floor(timeLeft() / 60);
    const seconds = timeLeft() % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <ErrorBoundary
      fallback={err => {
        return <div>Error: {err.toString()}</div>;
      }}
    >
      <div class="top-column">
        <NameGrid
          company={company()}
          role={role()}
          onLetterUnlock={handleLetterUnlock}
        ></NameGrid>
      </div>
    </ErrorBoundary>
  );
}

export default App;
