import { createSignal, createEffect } from 'solid-js';
import styles from './LoaderModal.module.css';
import { Robot, ArrowUp, ArrowRight, ArrowLeft, ArrowDown } from 'phosphor-solid';

const LoaderModal = props => {
  const [displayLines, setDisplayLines] = createSignal([]);
  const [showCursor, setShowCursor] = createSignal(true);
  const [progress, setProgress] = createSignal(0);
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [isTyping, setIsTyping] = createSignal(false); // Flag to track typing state

  const role = props.role;
  const company = props.company;

  const displayOutput = [
    ` Initializing ${company} ${role} Sequence`,
    ` Booting FindMyNextPM.exe...`,
    ` Welcome! Your next Product Manager has been selected.`,
    ` Click Anywhere to Start`
    // ` Roadmap Generator... LOADED`,
    // ` Stakeholder Alignment Protocols... ONLINE`,
    // ` Feature Prioritization Matrix... ACTIVATED`,
    // ` Market Research Analyzer... CONFIGURED`,
    // ` User Feedback Aggregator... SYNCED`,
    // ` Loading Advanced Modules...`,
    // ` Agile Workflow Integrator... INITIALIZING`,
    // ` Sprint Planning Module... READY`,
    // ` Cross-Functional Team Collaborator... ONLINE`,
    // ` MVP Launch Sequence... ENGAGED`,
    // ` KPI Tracker... SYNCHRONIZED`,
    // ` Risk Management Matrix... OPTIMIZED`,
    // ` Performing Final System Checks...`,
    // ` Innovation Engine... TUNED`,
    // ` Growth Strategy Analyzer... ACTIVE`,
    // ` Customer-Centric Design Framework... LOADED`,
    // ` Competitive Analysis... COMPLETE`,
    // ` Problem-Solving Algorithm... CALIBRATED`,
    // ` Recruiting Interface... CONNECTED`,
    // ` Talent Matchmaker... OPERATIONAL`,
    // ` Finalizing Boot Sequence...`,
    // ` System Ready!`,
    // ` C:\\>_`,
    // ` Launching FindMyNextPM.exe`,
    // ` C:\\>_`,
    // ` Matching with Ideal Profile...`,
    // ` Match Found! Loading Profile...`,
    // ` C:\\>_ ${role}`,
    // ` Welcome! You've found your next Product Manager.`,
    // ` Press Enter to Proceed`,
    // ` C:\\>_`,
    // ` System Ready!`,
    // ` Launching FindMyNextPM.exe`,
    // ` Connecting to Talent Database...`,
    // ` Searching for Product Manager Candidates...`,
    // ` C:\\>_`,
    // ` Matching with Ideal Profile...`,
    // ` Match Found! Loading Profile...`,
    // ` C:\\>_`,
  ];

  const totalSentences = displayOutput.length;

  // Increased timing constants for slower sequence
  const MIN_CHAR_DELAY = 30; // Increased from 10
  const MAX_CHAR_DELAY = 50; // Increased from 50
  const MIN_LINE_DELAY = 500; // Increased from 200
  const MAX_LINE_DELAY = 1000; // Increased from 500
  const CURSOR_BLINK_INTERVAL = 400; // Unchanged

  const processNextSentence = () => {
    if (currentIndex() < displayOutput.length && !isTyping()) {
      setIsTyping(true); // Set typing flag to true
      const sentence = displayOutput[currentIndex()];
      console.log(`Processing sentence: ${sentence}`); // Debug log
      let charIndex = 0;

      const typingInterval = setInterval(
        () => {
          if (charIndex < sentence.length) {
            setDisplayLines(prev => {
              let newLines = [...prev];
              // Always update the last line
              if (newLines.length === 0) {
                newLines.push(sentence.substring(0, charIndex + 1));
              } else {
                newLines[newLines.length - 1] = sentence.substring(0, charIndex + 1);
              }
              console.log(`Current display lines: ${JSON.stringify(newLines)}`); // Debug log
              return newLines.slice(-3); // Keep only last 3 lines
            });
            charIndex++;
          } else {
            clearInterval(typingInterval);
            setProgress(prev => {
              const newProgress = Math.min(100, prev + 100 / displayOutput.length);
              console.log(`Progress updated: ${newProgress}%`); // Debug log
              return newProgress;
            });

            // Move to the next sentence after a delay
            setTimeout(
              () => {
                const nextIndex = currentIndex() + 1;
                setCurrentIndex(nextIndex);
                console.log(`Moving to next sentence. Index: ${nextIndex}`); // Debug log

                if (nextIndex < displayOutput.length) {
                  setDisplayLines(prev => {
                    let newLines = [...prev, '']; // Add a new empty line for the next sentence
                    return newLines.slice(-3); // Keep only last 3 lines
                  });
                  setIsTyping(false); // Reset typing flag
                  processNextSentence();
                } else {
                  console.log('All sentences processed'); // Debug log
                  setIsTyping(false); // Reset typing flag
                }
              },
              Math.random() * (MAX_LINE_DELAY - MIN_LINE_DELAY) + MIN_LINE_DELAY
            );
          }
        },
        Math.random() * (MAX_CHAR_DELAY - MIN_CHAR_DELAY) + MIN_CHAR_DELAY
      );
    }
  };

  // Initial call to start the process
  processNextSentence();

  // Start processing sentences
  createEffect(() => {
    console.log('Starting to process sentences'); // Debug log
    processNextSentence();
  });

  // Cursor blinking effect
  createEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, CURSOR_BLINK_INTERVAL);

    return () => clearInterval(cursorInterval);
  });

  return (
    <div
      class={styles.modalOverlay}
      onClick={props.onClose}
    >
      <div class={styles.modal}>
        <div class={styles.content}>
          <div class={styles.textDisplay}>
            {displayLines().map((line, index) => (
              <div class={styles.terminalLine}>
                <Robot
                  size={16}
                  class="icon-align-bottom"
                  style={{
                    'vertical-align': 'text-top',
                    'margin-left': '2px'
                  }}
                />
                {line}
                {index === displayLines().length - 1 && showCursor() && (
                  <span
                    class={styles.cursor}
                    style={{
                      'vertical-align': 'text-top',
                      'margin-left': '2px'
                    }}
                  >
                    █
                  </span>
                )}
              </div>
            ))}
          </div>
          <div class={styles.progressContainer}>
            <div class={styles.progressBar}>
              <div
                class={styles.progressBarFill}
                style={{ width: `${progress()}%` }}
              />
            </div>
            <div class={styles.progressText}>{Math.round(progress())}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoaderModal;
