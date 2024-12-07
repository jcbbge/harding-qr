import { createSignal, onMount, createEffect, createResource } from 'solid-js';
import { Motion } from 'solid-motionone';
import NameGrid from '../components/interface/NameGrid';
import LoaderModal from '../components/interface/LoaderModal';
import confetti from 'canvas-confetti';
import Airtable from 'airtable'
import { useNavigate } from '@solidjs/router';
import { Show } from 'solid-js';

import PRD from '../components/interface/Prd';

// Airtable client setup
const airtableClient = () => {
  return new Airtable({
    apiKey: import.meta.env.VITE_AIRTABLE_API_KEY
  }).base('appAJc59Qfb9sP9zo')
} 

// New fetch function - removed cache operations
const fetchCompanyData = async (companyName) => {
  if (!companyName) return null;
  
  const base = airtableClient();
  
  try {
    const records = await base('params')
      .select({
        filterByFormula: `LOWER({comp_param}) = LOWER("${companyName}")`,
        maxRecords: 1
      })
      .firstPage();

    if (!records.length) {
      return null;
    }

    const record = records[0];
    let wordlist = record.get('grid_wordlist');
    
    if (typeof wordlist === 'string') {
      const prepared = wordlist.replace(/'/g, '"');
      wordlist = JSON.parse(prepared);
    }

    const logoAttachment = record.get('company_logo');
    const logoUrl = Array.isArray(logoAttachment) && logoAttachment[0]?.url;

    return {
      name: record.get('company_name'),
      company_colors: record.get('company_colors'),
      prd_title: record.get('prd_title'),
      prd_subtitle: record.get('prd_subtitle'),
      prd_md: record.get('prd_md'),
      wordlist: Array.isArray(wordlist) ? wordlist : [],
      company_logo: logoUrl
    };
  } catch (error) {
    console.error('Error fetching from Airtable:', error);
    throw error;
  }
};

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
  const navigate = useNavigate();
  const [scrolledToPRD, setScrolledToPRD] = createSignal(false);

  // Replace createSignal for companyData with createResource
  const [companyData, { refetch }] = createResource(
    () => props.company?.toLowerCase(),
    fetchCompanyData
  );

  // Update the createEffect that watches companyData
  createEffect(() => {
    // Only redirect if we have a completed response that's null (not while loading)
    if (!companyData.loading && companyData() === null) {
      navigate('/', { replace: true });
    }
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
    setAllWordsMatched(true);

    const end = Date.now() + 2000;
    const colors = companyData()?.company_colors
      ? companyData().company_colors.replace(/[\[\]]/g, '').split(',').map(color => color.trim())
      : [
          getComputedStyle(document.documentElement).getPropertyValue('--accent-opposite').trim(),
          getComputedStyle(document.documentElement).getPropertyValue('--accent-fun').trim()
        ];

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
    setHeroUnlocked(true);
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
      { companyData() && showModal() && !props.testMode && (
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
                <Show 
                  when={!companyData.loading} 
                  fallback={<div>Loading...</div>}
                >
                  <NameGrid
                    wordList={
                      companyData()?.wordlist || [
                        company(),
                        role().split(' ')[0], 
                        role().split(' ')[1]
                      ]
                    }
                    onLetterUnlock={handleLetterUnlock}
                    onAllLettersMatched={handleAllLettersMatched}
                    modalClosed={modalClosed()}
                  />
                </Show>
              )}
            </div>
            {(allWordsMatched() || props.testMode) && !buttonClicked() && (
              <div class="buttonContainer">
                <MatchFoundButton onClick={scrollToSecondSection} />
              </div>
            )}
          </section>
          <section class="snap-section prd-section">
            {(showPRD() || scrolledToPRD()) && companyData() && (
              <PRD 
                md_content={companyData().prd_md || ''}
                company={companyData().name}
                role={role()}
                prd_title={companyData().prd_title}
                prd_subtitle={companyData().prd_subtitle}
              />
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Roleco;
