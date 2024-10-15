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

  const jsxElements = [
    <div class="name-intro">
      <span class="name-left">
        <img id="ficon" src="/assets/icons/arrow-narrow-left.svg" alt="Left arrow" class="icon" />
        <img src="/assets/icons/arrow-narrow-right.svg" alt="Right arrow" class="icon" />
        <img src="/assets/icons/arrow-narrow-up.svg" alt="Up arrow" class="icon" />
        <img src="/assets/icons/arrow-narrow-down.svg" alt="Down arrow" class="icon" />
        <img src="/assets/icons/space.svg" alt="Spacebar" class="icon" />
        <img src="/assets/icons/arrow-back.svg" alt="Return key" class="icon" />
      </span>
      <span class="name-right">Hi. I'm</span>
    </div>,
    <div class="product-intro">
      <span class="product-left">I do</span>
      <span class="product-right">
        <img id="ficon" src="/assets/icons/arrow-narrow-left.svg" alt="Left arrow" class="icon" />
        <img src="/assets/icons/arrow-narrow-right.svg" alt="Right arrow" class="icon" />
        <img src="/assets/icons/arrow-narrow-up.svg" alt="Up arrow" class="icon" />
        <img src="/assets/icons/arrow-narrow-down.svg" alt="Down arrow" class="icon" />
        <img src="/assets/icons/space.svg" alt="Spacebar" class="icon" />
        <img src="/assets/icons/arrow-back.svg" alt="Return key" class="icon" />
      </span>
    </div>,
    <div class="code-intro">
      <span class="code-left"><s>Design</s> <s>Management</s> <b>Stuff.</b></span>
      <span class="code-right">I also</span>
    </div>
  ];    

  const gridWords = ['JOURNEY', 'WONDERS'];
  const gridElements = [
    <div class="stlon">
        <span class="stlon-left">I consider every</span>
        <span class="stlon-right"><p>project a</p></span>
    </div>,
    <div class="stltw">
      <span class="stltw-left"><p>filled with</p></span>
      <span class="stltw-right"><p>hidden</p></span>
    </div>,
    <div class="stlth">
      <span class="stlth-left"><p>waiting,</p></span>
      <span class="stlth-right"><p>to be discovered.</p></span>
    </div>
  ];  
  const gridWords2 = ['SPARK', 'FORGE'];
  const gridElements2 = [
    <div class="product-intro">
      <span class="product-left">
        I build  
      </span>
      <span class="product-right">worlds that</span>
    </div>,
    <div class="code-intro">
      <span class="code-left">joy, </span>
      <span class="code-right">
      invite exploration, and
      </span>
    </div>,
    <div class="code-intro">
      <span class="code-left">connections. </span>
      <span class="code-right"></span>
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
          <div class="name-grid-container">
            <DisplayGrid
              gridWords={gridWords}
              gridElements={gridElements}
            />
          </div>
        </section>
        <section class="snap-section">
          <div class="name-grid-container">
            <DisplayGrid
              gridWords={gridWords2}
              gridElements={gridElements2}
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
