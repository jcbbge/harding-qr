import { createSignal, createEffect } from 'solid-js';
import styles from './LoaderModal.module.css';

const LoaderModal = props => {
  const [displayLines, setDisplayLines] = createSignal([]);
  const [showCursor, setShowCursor] = createSignal(true);
  const [progress, setProgress] = createSignal(0);
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [isTyping, setIsTyping] = createSignal(false);
  const [isLoadingComplete, setIsLoadingComplete] = createSignal(false);

  const role = props.role;
  const company = props.company;

  const spacebar = '\u2423';
  const returnKey = '\u23CE';
  const shiftKey = '\u21E7';
  const displayOutput = [
    ` Welcome!`,
    ` Initializing ${company} ${role} Sequence`,
    ` Booting FindMyNextPM.exe...`,
    ` Recruiting Interface... CONNECTED`,
    ` Talent Matchmaker... OPERATIONAL`,
    ` Finalizing Boot ${company} Sequence...`,
    ` Launching FindMyNextPM.exe`,
    ` Connecting to Talent Database...`,
    ` Searching for ${role} Candidates...`,
    ` Potential Match Found. Loading Profile...`,
    ` ${company} ${role} Sequence Ready.`,
    ` HELP MENU`,
    ` KEYBOARD NAVIGATION:`,
    ` Use ← → ↑ ↓ Arrow Keys or W A S D Letter Keys`,
    ` CHANGE SQUARES:`,
    ` Use ${returnKey} Return Key (${shiftKey} Shift + ${returnKey} Return Key)`,
    ` OR ${spacebar} Spacebar (${shiftKey} Shift + ${spacebar} Spacebar)`,
    ` Click Anywhere to Start`,
  ];

  const totalSentences = displayOutput.length;

  // Timing constants for controlling the speed of the animation
  const MIN_CHAR_DELAY = 10; // Minimum delay between characters (in milliseconds)
  const MAX_CHAR_DELAY = 30; // Maximum delay between characters (in milliseconds)
  const MIN_LINE_DELAY = 10; // Minimum delay between lines (in milliseconds)
  const MAX_LINE_DELAY = 100; // Maximum delay between lines (in milliseconds)
  const CURSOR_BLINK_INTERVAL = 350; // Cursor blink interval (in milliseconds)

  const processNextSentence = () => {
    if (currentIndex() < displayOutput.length && !isTyping()) {
      setIsTyping(true);
      const sentence = displayOutput[currentIndex()];
      let charIndex = 0;

      const typingInterval = setInterval(
        () => {
          if (charIndex < sentence.length) {
            setDisplayLines(prev => {
              let newLines = [...prev];
              if (newLines.length === 0) {
                newLines.push(sentence.substring(0, charIndex + 1));
              } else {
                newLines[newLines.length - 1] = sentence.substring(0, charIndex + 1);
              }
              return newLines.slice(-10); // Changed from -3 to -10
            });
            charIndex++;
          } else {
            clearInterval(typingInterval);
            setProgress(prev => {
              // Adjust this calculation to change how quickly the progress bar fills
              const newProgress = Math.min(100, prev + 110 / displayOutput.length);
              return newProgress;
            });

            setTimeout(
              () => {
                const nextIndex = currentIndex() + 1;
                setCurrentIndex(nextIndex);

                if (nextIndex < displayOutput.length) {
                  setDisplayLines(prev => {
                    let newLines = [...prev, ''];
                    return newLines.slice(-7);
                  });
                  setIsTyping(false);
                  processNextSentence();
                } else {
                  setIsTyping(false);
                  setIsLoadingComplete(true);  // Set loading as complete
                }
              },
              // Adjust this to change the delay between lines
              Math.random() * (MAX_LINE_DELAY - MIN_LINE_DELAY) + MIN_LINE_DELAY
            );
          }
        },
        // Adjust this to change the typing speed
        Math.random() * (MAX_CHAR_DELAY - MIN_CHAR_DELAY) + MIN_CHAR_DELAY
      );
    }
  };

  // Initial call to start the process
  processNextSentence();

  // Start processing sentences
  createEffect(() => {
    processNextSentence();
  });

  // Cursor blinking effect
  createEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, CURSOR_BLINK_INTERVAL);

    return () => clearInterval(cursorInterval);
  });

  const handleClose = (event) => {
    event.stopPropagation();
    if (isLoadingComplete()) {
      props.onClose();
    }
  };

  const getCustomContent = (company, role) => {
    const lowercaseCompany = company.toLowerCase()
    if (lowercaseCompany === 'gumroad' || lowercaseCompany === 'antiwork') {
      return {
        title: 'FIND MY NEXT DESIGNGINEER',
        subtitle: `${company}'s internal application framework to find top PRODUCT / DESIGNER / ENGINEER / AI BUILDER candidates`
      }
    }
    return {
      title: 'Find My Next PM',
      subtitle: `${company}'s internal application framework to find top ${role} candidates`
    }
  }

  return (
    <div class={styles.modalOverlay} onClick={handleClose}>
      <div class={styles.modal}>
        <table class={styles.tab}>
          <tbody>
            <tr>
              <td colspan="2" rowspan="2" class={styles.widthAuto}>
                <h1 class={styles.title}>{getCustomContent(company, role).title}</h1>
                <span class={styles.subtitle}>{getCustomContent(company, role).subtitle}</span>
              </td>
              <th>Version</th>
              <td class={styles.widthMin}>v0.2.1</td>
            </tr>
            <tr>
              <th>Updated</th>
              <td class={styles.widthMin}><time style="white-space: pre;">2024-10-15</time></td>
            </tr>
            <tr>
              <th class={styles.widthMin}>Author</th>
              <td class={styles.widthAuto}>Gantt, Joshua Russell</td>
              <th class={styles.widthMin}>License</th>
              <td>MIT</td>
            </tr>
          </tbody>
        </table>
        <div class={styles.content}>
          <div class={styles.textDisplay}>
            {displayLines().map((line, index) => (
              <div class={styles.terminalLine}>
                <svg
                  class={styles.icon}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M8 9l3 3l-3 3" />
                  <path d="M13 15l3 0" />
                  <path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
                </svg>
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
