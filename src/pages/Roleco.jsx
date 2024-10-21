import { createSignal, onMount, createEffect, createResource } from 'solid-js';
import { Motion } from 'solid-motionone';
import NameGrid from '../components/interface/NameGrid';
import LoaderModal from '../components/interface/LoaderModal';
import confetti from 'canvas-confetti';

import PRD from '../components/interface/Prd';

// Add this new function to fetch data from the Google Sheet
async function fetchSheetData() {
  const sheetId = '1uwuzV2pK7VS9UwRjAC3VBr98IdMwaEQAvk64aoUPHS4';
  const sheetName = 'PortfolioCompData'; // Update this if your sheet has a different name
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    const data = JSON.parse(text.substr(47).slice(0, -2));

    console.log('Fetched sheet data:', data); // Debug log

    const processedData = data.table.rows.map(row => {
      const [comp_param, company_name, company_colors, prd_md] = row.c;
      return {
        comp_param: comp_param?.v,
        company_name: company_name?.v,
        company_colors: company_colors?.v,
        prd_md: prd_md?.v
      };
    });

    console.log('Processed sheet data:', processedData); // Debug log
    return processedData;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return [];
  }
}

const MatchFoundButton = (props) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, easing: 'ease-out' }}
      class="matchFoundButton"
      onClick={props.onClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="buttonIcon">
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
  const [showPRD, setShowPRD] = createSignal(false);
  const [sheetData] = createResource(fetchSheetData);
  const [scrolledToPRD, setScrolledToPRD] = createSignal(false);

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

  createEffect(() => {
    const data = sheetData();
    if (data) {
      console.log('Sheet data loaded:', data); // Debug log
      const companyData = data.find(item => item.comp_param.toLowerCase() === company().toLowerCase());
      console.log('Found company data:', companyData); // Debug log
    }
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

    const end = Date.now() + 2000;
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
    setShowPRD(true); // Ensure PRD is set to show
    setScrolledToPRD(true); // Set this to true to trigger the scroll effect

    // Use setTimeout to ensure the DOM has updated before scrolling
    setTimeout(() => {
      const prdSection = document.querySelector('.prd-section');
      if (prdSection) {
        prdSection.scrollIntoView({ behavior: 'smooth' });
        console.log('Scrolling to PRD section');
      } else {
        console.log('PRD section not found');
      }
    }, 100);
  }

  console.log('Roleco: Current state', { role: role(), company: company() });

  const handleReveal = () => {
    setShowPRD(true);
  };

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
              <div class="buttonContainer">
                <MatchFoundButton onClick={scrollToSecondSection} />
              </div>
            )}
          </section>
          <section class="snap-section prd-section">
            {(showPRD() || scrolledToPRD()) && sheetData() && (
              <PRD 
                md_content={sheetData().find(item => item.comp_param.toLowerCase() === company().toLowerCase())?.prd_md || ''}
                company={company()}
                role={role()}
              />
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Roleco;
