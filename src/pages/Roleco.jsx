import { createSignal, onMount, createEffect, createResource } from 'solid-js';
import { Motion } from 'solid-motionone';
import NameGrid from '../components/interface/NameGrid';
import LoaderModal from '../components/interface/LoaderModal';
import confetti from 'canvas-confetti';

import PRD from '../components/interface/Prd';

async function fetchSheetData() {
  const sheetId = '1uwuzV2pK7VS9UwRjAC3VBr98IdMwaEQAvk64aoUPHS4';
  const sheetName = 'PortfolioCompData';
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    const data = JSON.parse(text.substr(47).slice(0, -2));

    const processedData = data.table.rows.map((row) => {
      const [comp_param, company_name, company_colors, prd_title, prd_subtitle, prd_md] = row.c;
      return {
        comp_param: comp_param?.v,
        company_name: company_name?.v,
        company_colors: company_colors?.v,
        prd_title: prd_title?.v,
        prd_subtitle: prd_subtitle?.v,
        prd_md: prd_md?.v
      };
    });

    return processedData;
  } catch (error) {
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
    setRole(props.role || '');
    setCompany(props.company || '');
  });

  onMount(() => {
    const content = document.querySelector('.hero-section');
    if (content) {
      setContentHeight(content.offsetHeight);
    }

    centerContent();

    window.addEventListener('resize', centerContent);
    window.addEventListener('keydown', preventArrowScroll);
    window.addEventListener('scroll', handleScroll);
  });

  createEffect(() => {
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
    // Functionality can be added here if needed
  }

  function handleAllLettersMatched() {
    setHeroUnlocked(true);
    setAllWordsMatched(true);

    const end = Date.now() + 2000;
    const companyData = sheetData()?.find(item => item.comp_param.toLowerCase() === company().toLowerCase());
    let colors = ['#bb0000', '#ffffff']; // Default colors as an array

    if (companyData && companyData.company_colors) {
      // Split the string into an array of colors
      colors = companyData.company_colors.replace(/[\[\]]/g, '').split(',').map(color => color.trim());
      console.log('Company colors:', colors);
    } else {
      console.log('Using default colors:', colors);
    }

    console.log('Colors type:', typeof colors);
    console.log('Colors value:', colors);

    const frame = () => {
      try {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 65,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 45,
          origin: { x: 1 },
          colors: colors
        });
      } catch (error) {
        console.error('Error in confetti function:', error);
      }

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }

  function handleScroll(event) {
    if (!heroUnlocked()) {
      event.preventDefault();
      window.scrollTo(0, 0);
    }
  }

  function handleModalClose() {
    setShowModal(false);
    setModalClosed(true);
  }

  function preventArrowScroll(e) {
    if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.key)) {
      e.preventDefault();
    }
  }

  function scrollToSecondSection() {
    setButtonClicked(true);
    setShowPRD(true);
    setScrolledToPRD(true);

    setTimeout(() => {
      const prdSection = document.querySelector('.prd-section');
      if (prdSection) {
        prdSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

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
                prd_title={sheetData().find(item => item.comp_param.toLowerCase() === company().toLowerCase())?.prd_title}
                prd_subtitle={sheetData().find(item => item.comp_param.toLowerCase() === company().toLowerCase())?.prd_subtitle}
              />
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Roleco;
