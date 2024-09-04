import { createSignal, onMount, onCleanup } from 'solid-js';
import NameGrid from './components/interface/NameGrid';
import './App.css';

function App() {
  const [company, setCompany] = createSignal('');
  const [role, setRole] = createSignal('');

  onMount(() => {
    const urlPath = window.location.pathname;
    let pathSegments = urlPath.split('/').filter(Boolean);

    if (pathSegments.length >= 2) {
      setCompany(pathSegments[0]);
      setRole(pathSegments[1]);
    }
  });

  function handleLetterUnlock() {
    // Handle letter unlock logic
    console.log('Letter unlocked App.jsx callback');
  }

  return (
    <>
      <div class="top-column">
        <NameGrid
          company={company()}
          role={role()}
          onLetterUnlock={handleLetterUnlock}
        ></NameGrid>
      </div>
      <div class="bottom-column">
        <p>Unlock Letters</p>
      </div>
    </>
  );
}

export default App;
