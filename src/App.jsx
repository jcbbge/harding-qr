import { createSignal, onMount } from 'solid-js';
import NameGrid from './components/interface/NameGrid';
import styles from './App.module.css';
import Card from './components/interface/Card';

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
    <div class={styles.appContainer}>
      <div class={styles.contentLayer}>
        <div class={styles.topColumn}>
          <NameGrid
            company={company()}
            role={role()}
            onLetterUnlock={handleLetterUnlock}
          />
        </div>
        <div class={styles.bottomColumn}>

          <Card><p>Unlock Letters</p></Card>
        </div>
      </div>
    </div>
  );
}

export default App;
