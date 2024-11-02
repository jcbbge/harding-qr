import { createSignal, onMount, createEffect } from 'solid-js';
import NameGrid from './components/interface/NameGrid';
import DisplayGrid from './components/interface/DisplayGrid';

function App() {
  const [company, setCompany] = createSignal('');
  const [role, setRole] = createSignal('');
  const [contentHeight, setContentHeight] = createSignal(0);
  const [heroUnlocked, setHeroUnlocked] = createSignal(false);

  onMount(() => {
    const urlPath = window.location.pathname;
    let pathSegments = urlPath.split('/').filter(Boolean);

    if (pathSegments.length >= 2) {
      setCompany(pathSegments[0]);
      setRole(pathSegments[1]);
    }

    // Get the height of the content
    const content = document.querySelector('.hero-section');
    if (content) {
      setContentHeight(content.offsetHeight);
    }

    // Center the content
    centerContent();

    // Add resize event listener
    window.addEventListener('resize', centerContent);

    // Add this event listener to prevent default scrolling on arrow keys
    window.addEventListener('keydown', preventArrowScroll);

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
  });

  createEffect(() => {
    // Recenter content when contentHeight changes
    centerContent();
  });

  function centerContent() {
    const snapContainer = document.querySelector('.snap-container');
    const viewportHeight = window.innerHeight;
    const scrollPosition = (viewportHeight - contentHeight()) / 2;
    
    if (snapContainer) {
      snapContainer.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: 'auto'
      });
    }
  }

  function handleLetterUnlock() {
    console.log('Letter unlocked App.jsx callback');
  }

  function handleAllLettersMatched() {
    setHeroUnlocked(true);
    console.log('All letters matched, hero section unlocked');
  }

  function handleScroll(event) {
    if (!heroUnlocked()) {
      event.preventDefault();
      window.scrollTo(0, 0);
    }
  }

  return (
    <div class="main-content">
      <div class={`snap-container ${heroUnlocked() ? 'unlocked' : ''}`}>
        <section class="snap-section hero-section">
          <div class="name-grid-container">
            <NameGrid
              company={company()}
              role={role()}
              onLetterUnlock={handleLetterUnlock}
              onAllLettersMatched={handleAllLettersMatched}
              displayGridHeaders={true}
            />
          </div>
        </section>
        <section class="snap-section">
          <div class="name-grid-container">
            <DisplayGrid
              dreamCoder={true}
            />
            <DisplayGrid
              joyEngineer={true}
            />
          </div>
        </section>
        <section class="snap-section">
          <div class="name-grid-container">
            <DisplayGrid
              letsWork={true}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

// Add this function to prevent default scrolling on arrow keys
function preventArrowScroll(e) {
  if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.key)) {
    e.preventDefault();
  }
}

export default App;
