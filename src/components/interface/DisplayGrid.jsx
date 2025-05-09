import { For, Show, createSignal } from 'solid-js';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './DisplayGrid.module.css';

const DisplayGrid = (props) => {
  const [theme] = useTheme();

  const isVowel = (letter) => ['A', 'E', 'I', 'O', 'U'].includes(letter.toUpperCase());
  const MAX_LENGTH = 7;

  const padWord = (word) => {
    const padding = ' '.repeat(Math.max(0, MAX_LENGTH - word.length));
    return padding + word;
  };

  const dcQuestions = [
    "What's the most unexpected way technology has delighted you recently?",
    "What's the most surprising way technology has made you smile lately?",
    "When was the last time a digital experience left you in awe?",
    "What's one tech innovation you wish existed but doesn't... yet?",
    "How has technology unexpectedly simplified your life recently?",
    "What could we build together that would make the digital world a little more magical?",
    "Imagine we had a digital sandbox to play in. What should we create first?",
    "If we could solve one problem with technology, what would you choose?",
    "What's your wildest tech dream? Let's brainstorm how to make it real!"
  ];

  const dcGridWord = ['DIGITAL'];
  const dcTopHeader = [
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}>I craft</span>
      <span class={styles.dgHeaderRight}><p></p></span>
    </div>
  ];
  const dcBottomHeader = [
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}>experiences that surprise</span>
      <span class={styles.dgHeaderRight}><p></p></span>
    </div>,
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}>and delight.</span>
      <span class={styles.dgHeaderRight}><p></p></span>
    </div>
  ];

  const jeGridWord = ['MAGICAL'];
  const jeTopHeader = [
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}></span>
      <span class={styles.dgHeaderRight}>And transform</span>
    </div>,
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}><p></p></span>
      <span class={styles.dgHeaderRight}>lines of code into</span>
    </div>
  ];
  const jeBottomHeader = [
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}><p></p></span>
      <span class={styles.dgHeaderRight}>user journeys.</span>
    </div>
  ];

  const [randomQuestion, setRandomQuestion] = createSignal({ headers: [], text: '' });

  const randomizeQuestion = () => {
    const randomIndex = Math.floor(Math.random() * dcQuestions.length);
    const selectedQuestion = dcQuestions[randomIndex];
    
    // Split the question into words
    const words = selectedQuestion.split(' ');
    
    // Create the three parts
    const part1 = words.slice(0, 5).join(' ');
    const part2 = words.slice(5, 9).join(' ');
    const part3 = words.slice(9).join(' ');
    
    // Create JSX elements using the same structure as jeBottomHeader
    const questionHeaders = [
      <div class={styles.dgHeader}>
        <span class={styles.dgHeaderLeft}>{part1}</span>
      </div>,
      <div class={styles.dgHeader}>
        <span class={styles.dgHeaderLeft}>{part2}</span>
      </div>,
      <div class={styles.dgHeader}>
        <span class={styles.dgHeaderLeft}>{part3}</span>
      </div>
    ];
    
    setRandomQuestion({ headers: questionHeaders, text: selectedQuestion });
  };

  if (props.letsWork) {
    randomizeQuestion();
  }

  const lwGridWord = ['KNOW'];
  const lwTopHeader = [
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}>
          <img src="/assets/icons/arrow-narrow-down.svg" alt="Down arrow" class={`icon ${styles.gridArrow}`} data-grid-position="0" />
          <img src="/assets/icons/arrow-narrow-down.svg" alt="Down arrow" class={`icon ${styles.gridArrow}`} data-grid-position="2" />
      </span>
      <span class={styles.dgHeaderRight}>Let me</span>
    </div>
  ];
  const lwBottomHeader = [
    <>
      <div class={styles.dgHeader}>
        <span class={styles.dgHeaderLeft}>
            <img src="/assets/icons/arrow-narrow-up.svg" alt="Up arrow" class={`icon ${styles.gridArrow}`} data-grid-position="1" />
        </span>
        <span class={styles.dgHeaderRight}>If you like my site,</span>
      </div>
      <div class={styles.dgHeader}>
        <span class={styles.dgHeaderLeft}><p></p></span>
        <span class={styles.dgHeaderRight}>then let me know</span>
      </div>
      <div class={styles.dgHeader}>
        <span class={styles.dgHeaderLeft}><p></p></span>
        <span class={styles.dgHeaderRight}>that too.</span>
      </div>
    </>
  ];

  const digitalGridWord = ['DESIGN'];
  const digitalTopHeader = [
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}></span>
      <span class={styles.dgHeaderRight}><p>Joshua</p></span>
    </div>,
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}></span>
      <span class={styles.dgHeaderRight}><p>innovates at</p></span>
    </div>,
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}> </span>
      <span class={styles.dgHeaderRight}><p>the crossroads of</p></span>
    </div>,
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}> </span>
      <span class={styles.dgHeaderRight}><p>tech and human-centered</p></span>
    </div>
  ];
  const digitalBottomHeader = [
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}></span>
      <span class={styles.dgHeaderRight}><p>Blending technical skill</p></span>
    </div>,
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}></span>
      <span class={styles.dgHeaderRight}><p>and creative vision,</p></span>
    </div>,
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}></span>
      <span class={styles.dgHeaderRight}><p>he transforms</p></span>
    </div>,
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}></span>
      <span class={styles.dgHeaderRight}><p>challenges</p></span>
    </div>
  ];

  const interactionGridWord = ['YOUR'];
  const interactionTopHeader = [
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}>into</span>
      <span class={styles.dgHeaderRight}><p></p></span>
    </div>,
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}>elegant solutions.</span>
      <span class={styles.dgHeaderRight}><p></p></span>
    </div>,
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}>He's not just building products,</span>
      <span class={styles.dgHeaderRight}><p></p></span>
    </div>,
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}>but shaping digital</span>
      <span class={styles.dgHeaderRight}><p></p></span>
    </div>,
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}>interactions.</span>
      <span class={styles.dgHeaderRight}><p></p></span>
    </div>,
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}>Connect</span>
      <span class={styles.dgHeaderRight}><p>with</p></span>
    </div>,
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}></span>
      <span class={styles.dgHeaderRight}><p>Joshua to bring</p></span>
    </div>,
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}></span>
      <span class={styles.dgHeaderRight}><p>fresh perspectives to</p></span>
    </div>
  ];
  const interactionBottomHeader = [
    <div class={styles.dgHeader}>
      <span class={styles.dgHeaderLeft}></span>
      <span class={styles.dgHeaderRight}><p>next project.</p></span>
    </div>
  ];

  const getGridContent = () => {
    if (props.dreamCoder) {
      return {
        gridWords: dcGridWord,
        topHeaders: dcTopHeader,
        bottomHeaders: dcBottomHeader
      };
    }
    if (props.joyEngineer) {
      return {
        gridWords: jeGridWord,
        topHeaders: jeTopHeader,
        bottomHeaders: jeBottomHeader
      };
    }
    if (props.letsWork) {
      return {
        gridWords: lwGridWord,
        topHeaders: lwTopHeader,
        bottomHeaders: lwBottomHeader
      };
    }
    if (props.digital) {
      return {
        gridWords: digitalGridWord,
        topHeaders: digitalTopHeader,
        bottomHeaders: digitalBottomHeader
      };
    }
    if (props.interaction) {
      return {
        gridWords: interactionGridWord,
        topHeaders: interactionTopHeader,
        bottomHeaders: interactionBottomHeader
      };
    }
    return {
      gridWords: props.gridWords || [],
      topHeaders: [],
      bottomHeaders: []
    };
  };

  const content = getGridContent();

  const getSettingIcon = (letter, nameIndex, letterIndex) => {
    if ((props.letsWork || props.interaction) && letter === ' ') {
      const emptyIndexInRow = padWord(props.letsWork ? lwGridWord[nameIndex] : interactionGridWord[nameIndex])
        .split('')
        .slice(0, letterIndex)
        .filter(l => l === ' ').length;
      const emptyIndexInGrid = emptyIndexInRow;

      const icons = {
        0: {
          src: '/assets/icons/mail.svg',
          href: 'mailto:' + ['abc', 'joshuarussell.xyz'].join('@') + 
               '?subject=Hello%20Joshua&body=' + 
               encodeURIComponent(`I visited your website and wanted to reach out...\n\nRegarding your question:\n"${randomQuestion().text}"\n\nMy thoughts are:`),
          alt: 'Send email'
        },
        1: {
          src: '/assets/icons/butterfly.svg',
          href: 'https://bsky.app/profile/grussellj.bsky.social',
          alt: 'Bluesky'
        },
        2: {
          src: '/assets/icons/brand-linkedin.svg',
          href: 'https://www.linkedin.com/in/joshua-g-b2430b11b/',
          alt: 'LinkedIn'
        }
      };

      if (icons[emptyIndexInGrid]) {
        const isDarkMode = theme.mode() === 'dark';
        const icon = icons[emptyIndexInGrid];
        
        return (
          <a
            href={icon.href}
            target="_blank"
            rel="noopener noreferrer"
            class={styles.iconLink}
            aria-label={icon.alt}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={icon.src}
              alt={icon.alt}
              class={`${styles.icon} ${isDarkMode ? styles.iconInverted : ''}`}
            />
          </a>
        );
      }
    }
    return null;
  };

  return (
    <div class={styles.displayGrid} style={{ "max-width": "486px", margin: "0 auto" }}>
      <Show when={props.letsWork}>
        <div class={styles.displayContent}>
          <For each={randomQuestion().headers}>
            {(header) => header}
          </For>
        </div>
      </Show>

      <For each={content.gridWords}>
        {(word, nameIndex) => (
          <>
            <Show when={content.topHeaders.length > 0}>
              <div class={styles.displayContent}>
                <For each={content.topHeaders}>
                  {(header) => header}
                </For>
              </div>
            </Show>

            <div
              class={styles.displayRow}
              style={{ '--name-length': MAX_LENGTH }}
            >
              <For each={padWord(word)}>
                {(letter, letterIndex) => (
                  <div class={`${styles.displayLetter} ${styles.matched} ${isVowel(letter) ? styles.vowel : ''} ${letter === ' ' ? styles.emptyBox : ''}`}>
                    {letter === ' ' ? 
                      getSettingIcon(letter, nameIndex(), letterIndex()) : 
                      <span>{letter}</span>
                    }
                  </div>
                )}
              </For>
            </div>

            <Show when={content.bottomHeaders.length > 0}>
              <div class={styles.displayContent}>
                <For each={content.bottomHeaders}>
                  {(header) => header}
                </For>
              </div>
            </Show>
          </>
        )}
      </For>    
    </div>
  );
};

export default DisplayGrid;
