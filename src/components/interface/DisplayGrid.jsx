import { For, Show, createSignal } from 'solid-js';
import styles from './DisplayGrid.module.css';

const DisplayGrid = (props) => {
  console.log("DisplayGrid props:", props);

  const isVowel = (letter) => ['A', 'E', 'I', 'O', 'U'].includes(letter.toUpperCase());
  const MAX_LENGTH = 7;

  const padWord = (word) => {
    const padding = ' '.repeat(Math.max(0, MAX_LENGTH - word.length));
    return padding + word;
  };


  /*
    https://bsky.app/profile/grussellj.bsky.social
    https://www.linkedin.com/in/joshua-g-b2430b11b/
  */ 
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

  const [randomQuestion, setRandomQuestion] = createSignal('');

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
    
    setRandomQuestion(questionHeaders);
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
    return {
      gridWords: props.gridWords || [],
      topHeaders: [],
      bottomHeaders: []
    };
  };

  const content = getGridContent();

  return (
    <div class={styles.displayGrid} style={{ "max-width": "486px", margin: "0 auto" }}>
      <Show when={props.letsWork}>
        <div class={styles.displayContent}>
            <For each={randomQuestion()}>
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
                {(letter) => (
                  <div class={`${styles.displayLetter} ${styles.matched} ${isVowel(letter) ? styles.vowel : ''} ${letter === ' ' ? styles.emptyBox : ''}`}>
                    <span>{letter !== ' ' ? letter : ''}</span>
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
