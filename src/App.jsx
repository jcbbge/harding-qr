import { createSignal, onMount, createEffect } from 'solid-js';
import NameGrid from './components/interface/NameGrid';

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

  const jsxElements = [
    <div class="name-intro">
      <span class="name-left">← →</span>
      <span class="name-right">Hi. I'm Joshua</span>
    </div>,
    <div class="product-intro">
      <span class="product-left">I do</span>
      <span class="product-right">ꜛ ꜜ &#x2423; ⮐</span>
    </div>,
    <div class="code-intro">
      <span class="code-left"><s>Design</s> <s>Management</s> <b>Stuff.</b></span>
      <span class="code-right">I also</span>
    </div>
  ];    

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
              jsxElements={jsxElements}
            />
          </div>
        </section>
        <section class="snap-section">
          <h2>Section 2</h2>
          <p>Content for section 2 goes here.</p>
        </section>
        <section class="snap-section">
          <h2>Section 3</h2>
          <p>Content for section 3 goes here.</p>
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
