import { createSignal, onMount, createEffect } from 'solid-js';
import { Motion } from 'solid-motionone';
import NameGrid from '../components/interface/NameGrid';
import LoaderModal from '../components/interface/LoaderModal';
import styles from './Roleco.module.css';
import confetti from 'canvas-confetti';

const MatchFoundButton = (props) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, easing: 'ease-out' }} /* Changed duration from 0.5 to 1.5 seconds */
      class={styles.matchFoundButton}
      onClick={props.onClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class={styles.buttonIcon}>
        <path d="M12 16l-6-6h12l-6 6z" />
      </svg>
      Match Found
    </Motion.div>
  );
};

const Roleco = props => {
  const [company, setCompany] = createSignal(props.company || '');
  const [role, setRole] = createSignal(props.role || '');
  const [contentHeight, setContentHeight] = createSignal(0);
  const [heroUnlocked, setHeroUnlocked] = createSignal(props.testMode || false);
  const [showModal, setShowModal] = createSignal(!props.testMode);
  const [modalClosed, setModalClosed] = createSignal(props.testMode || false);
  const [allWordsMatched, setAllWordsMatched] = createSignal(props.testMode || false);
  const [buttonClicked, setButtonClicked] = createSignal(false);

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
    setAllWordsMatched(true);
    console.log('All letters matched, hero section unlocked');

    const end = Date.now() + 2000; // 5 seconds

    // Go Buckeyes!
    const colors = ['#bb0000', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 65,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 45,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
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
    setShowModal(false);
    setModalClosed(true);
    return;
  }

  function preventArrowScroll(e) {
    if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.key)) {
      e.preventDefault();
    }
    return;
  }

  function scrollToSecondSection() {
    setButtonClicked(true);
    const secondSection = document.querySelector('.snap-section:nth-child(2)');
    if (secondSection) {
      secondSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  console.log('Roleco: Current state', { role: role(), company: company() });

  return (
    <>
      {showModal() && !props.testMode && (
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
              {!props.testMode && (
                <NameGrid
                  wordList={[company(), role().split(' ')[0], role().split(' ')[1]]}
                  onLetterUnlock={handleLetterUnlock}
                  onAllLettersMatched={handleAllLettersMatched}
                  modalClosed={modalClosed()}
                />
              )}
            </div>
            {(allWordsMatched() || props.testMode) && !buttonClicked() && (
              <div class={styles.buttonContainer}>
                <MatchFoundButton onClick={scrollToSecondSection} />
              </div>
            )}
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
