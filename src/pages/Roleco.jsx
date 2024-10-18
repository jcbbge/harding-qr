import { createSignal, onMount, createEffect } from 'solid-js';
import NameGrid from '../components/interface/NameGrid';
import LoaderModal from '../components/interface/LoaderModal';

const Roleco = props => {
  const [company, setCompany] = createSignal(props.company || '');
  const [role, setRole] = createSignal(props.role || '');
  const [contentHeight, setContentHeight] = createSignal(0);
  const [heroUnlocked, setHeroUnlocked] = createSignal(false);
  const [showModal, setShowModal] = createSignal(true);

  createEffect(() => {
    console.log('Roleco: Props changed', { role: props.role, company: props.company });
    setRole(props.role || '');
    setCompany(props.company || '');
  });

  onMount(() => {
    console.log('Roleco: Component mounted', { role: role(), company: company() });
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
    return;

  });

  createEffect(() => {
    // Recenter content when contentHeight changes
    centerContent();
    return;
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
    return;

  }

  function handleLetterUnlock() {
    console.log('Letter unlocked App.jsx callback');
    return;
  }

  function handleAllLettersMatched() {
    setHeroUnlocked(true);
    console.log('All letters matched, hero section unlocked');
    return;
  }

  function handleScroll(event) {
    if (!heroUnlocked()) {
      event.preventDefault();
      window.scrollTo(0, 0);
    }
    return;
  }

  function handleModalClose() {
    return setShowModal(false);
  }

  function preventArrowScroll(e) {
    if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.key)) {
      e.preventDefault();
    }
    return;
  }
console.log('Roleco: Current state', { role: role(), company: company() });

  return (
    <>
      {showModal() && (
        <LoaderModal
          role={role()}
          company={company()}
          onClose={handleModalClose}
        />
      )}
      <div class="main-content">
        <div class={`snap-container ${heroUnlocked() ? 'unlocked' : ''}`}>
          <section class="snap-section hero-section">
            <div class="name-grid-container">
              <NameGrid
                wordList={[company(), role().split(' ')[0], role().split(' ')[1]]}
                onLetterUnlock={handleLetterUnlock}
                onAllLettersMatched={handleAllLettersMatched}
              />
            </div>
          </section>
          <section class="snap-section">
            <div class="name-grid-container">
              PRD DOCUMENT TEMPLATE GOES HERE...
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Roleco;
