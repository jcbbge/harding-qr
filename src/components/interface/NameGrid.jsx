import { createSignal, createEffect, For, onMount, onCleanup, Show, createMemo } from 'solid-js';
import styles from './NameGrid.module.css';
import GridRow from './GridRow';
import { useTheme } from '../../contexts/ThemeContext';

import letterChangeSound from '../../assets/sounds/natural-tap-1.wav';
import letterChangeSoundDown from '../../assets/sounds/natural-tap-3.wav';
import correctLetterSound from '../../assets/sounds/success.wav';
import correctWordSound1 from '../../assets/sounds/musical-tap-1.wav';
import correctWordSound2 from '../../assets/sounds/musical-tap-3.wav';
import correctWordSound3 from '../../assets/sounds/musical-tap-2.wav';
import allWordsCompleteSound from '../../assets/sounds/atmostphere-2.wav';
import leftKeySound from '../../assets/sounds/button-4.wav';
import rightKeySound from '../../assets/sounds/button-6.wav';

import DebugWrapper from '../util/DebugWrapper';

const fullName = ['JOSHUA', 'RUSSELL', 'GANTT'];
// const fullName = ['MVP', 'KPI', 'OKR'];
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const isVowel = char => 'AEIOU'.includes(char.toUpperCase());
const getRandomLetter = () => alphabet[Math.floor(Math.random() * 26)];
const getNextLetter = (current, direction) => {
  const currentIndex = alphabet.indexOf(current.toUpperCase());
  return alphabet[(currentIndex + direction + 26) % 26];
};

const areAllWordsComplete = names => {
  return names.every(name => name.every(letter => letter.matched || letter.isEmpty));
};

const padder = name => {
  const maxLength = Math.max(...fullName.map(name => name.length));
  const lengthPos = maxLength === 3 ? 4 : maxLength;

  if (lengthPos === 4 && fullName.indexOf(name) === 1) {
    return name.padEnd(lengthPos, ' ');
  } else {
    return name.padStart(lengthPos, ' ');
  }
};

const NameGrid = ({ onLetterUnlock }) => {
  const { appearance, updateTheme, updateMode, updateBackground, themes } = useTheme();

  let letterChangeAudio,
    letterChangeAudioDown,
    correctLetterAudio,
    allWordsCompleteAudio,
    leftKeyAudio,
    rightKeyAudio;
  let correctWordAudios = [];
  let lastTouchY = 0;

  const getMaxWordLength = () => Math.max(...fullName.map(name => name.length), 4);

  const createInitialNames = () => {
    const maxLength = getMaxWordLength();
    return fullName.map(name => {
      const paddedName = padder(name).padEnd(maxLength, ' ');
      return paddedName.split('').map(char => ({
        correctLetter: char,
        currentLetter: isVowel(char) ? getRandomLetter() : char,
        isVowel: isVowel(char),
        matched: !isVowel(char) && char !== ' ',
        isEmpty: char === ' '
      }));
    });
  };

  const [names, setNames] = createSignal(createInitialNames());
  const [activeNameIndex, setActiveNameIndex] = createSignal(0);
  const [gameCompleted, setGameCompleted] = createSignal(false);
  const [focusedPosition, setFocusedPosition] = createSignal({ row: 0, col: 1 });

  const totalEmptyCount = createMemo(() =>
    names().reduce((count, name) => count + name.filter(letter => letter.isEmpty).length, 0)
  );

  createEffect(() => {
    const firstNonEmptyPosition = names().reduce((pos, row, rowIndex) => {
      if (pos) return pos;
      const colIndex = row.findIndex(letter => !letter.isEmpty);
      return colIndex !== -1 ? { row: rowIndex, col: colIndex } : null;
    }, null);

    if (firstNonEmptyPosition) {
      setFocusedPosition(firstNonEmptyPosition);
    }
  });

  const findNextLetterBox = (currentRow, currentCol, direction) => {
    const totalRows = names().length;
    const totalCols = names()[0].length; // Assuming all rows have the same length

    let newRow = currentRow;
    let newCol = currentCol;

    switch (direction) {
      case 'left':
        if (currentCol === 0) {
          newRow = (currentRow - 1 + totalRows) % totalRows;
          newCol = totalCols - 1;
        } else {
          newCol = currentCol - 1;
        }
        break;
      case 'right':
        if (currentCol === totalCols - 1) {
          newRow = (currentRow + 1) % totalRows;
          newCol = 0;
        } else {
          newCol = currentCol + 1;
        }
        break;
      case 'up':
        newRow = (currentRow - 1 + totalRows) % totalRows;
        break;
      case 'down':
        newRow = (currentRow + 1) % totalRows;
        break;
    }

    return { row: newRow, col: newCol };
  };

  const changeThemeSetting = delta => {
    const currentIndex = themes.findIndex(t => t.name === appearance.theme);
    const newIndex = (currentIndex + delta + themes.length) % themes.length;
    updateTheme(themes[newIndex].name);
  };

  const changeModeSetting = delta => {
    const modes = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(appearance.mode);
    const newIndex = (currentIndex + delta + modes.length) % modes.length;
    updateMode(modes[newIndex]);
  };

  const changeBackgroundSetting = delta => {
    const backgrounds = ['default', 'gradient', 'solid'];
    const currentIndex = backgrounds.indexOf(appearance.background);
    const newIndex = (currentIndex + delta + backgrounds.length) % backgrounds.length;
    updateBackground(backgrounds[newIndex]);
  };

  const changeSetting = (row, col, delta) => {
    const emptyIndexInGrid =
      names()
        .slice(0, row)
        .flat()
        .filter(letter => letter.isEmpty).length +
      names()
        [row].slice(0, col)
        .filter(letter => letter.isEmpty).length +
      1;

    switch (emptyIndexInGrid) {
      case 1:
        changeThemeSetting(delta);
        break;
      case 2:
        changeModeSetting(delta);
        break;
      case 3:
        changeBackgroundSetting(delta);
        break;
    }
  };

  const handleKeyDown = event => {
    const { key, shiftKey } = event;
    const { row, col } = focusedPosition();
    let newPosition;
    let direction;

    // Prevent default behavior for space and tab keys
    if (key === ' ' || key === 'Tab') {
      event.preventDefault();
    }

    switch (key) {
      case 'ArrowLeft':
      case 'a':
        direction = 'left';
        playSound(leftKeyAudio);
        break;
      case 'ArrowRight':
      case 'd':
        direction = 'right';
        playSound(rightKeyAudio);
        break;
      case 'ArrowUp':
      case 'w':
        direction = 'up';
        playSound(rightKeyAudio);
        break;
      case 'ArrowDown':
      case 's':
        direction = 'down';
        playSound(rightKeyAudio);
        break;
      case 'Enter':
      case ' ':
        handleLetterOrSettingChange(row, col, shiftKey ? -1 : 1);
        return;
      case 'Tab':
        direction = shiftKey ? 'left' : 'right';
        playSound(shiftKey ? leftKeyAudio : rightKeyAudio);
        break;
      default:
        return;
    }

    if (direction) {
      newPosition = findNextLetterBox(row, col, direction);
      setFocusedPosition(newPosition);
      setActiveNameIndex(newPosition.row);
    }
    event.preventDefault();
  };

  const handleLetterOrSettingChange = (row, col, direction) => {
    const letter = names()[row][col];
    if (letter.isEmpty) {
      changeSetting(row, col, direction);
    } else {
      changeLetter(row, col, direction);
    }
  };

  const playSound = audio => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(error => {});
    }
  };

  const handleLetterChange = direction => {
    if (direction > 0) {
      playSound(letterChangeAudio);
    } else {
      playSound(letterChangeAudioDown);
    }
  };

  const handleCorrectLetter = () => {
    playSound(correctLetterAudio);
  };

  const handleWordComplete = nameIndex => {
    playSound(correctWordAudios[nameIndex]);
  };

  const handleAllWordsComplete = () => {
    if (!gameCompleted()) {
      setTimeout(() => {
        playSound(allWordsCompleteAudio);
      }, 400);
      setGameCompleted(true);
    }
  };

  const changeLetter = (row, col, delta) => {
    setNames(prevNames => {
      const newNames = prevNames.map((name, nameIndex) => {
        if (nameIndex === row) {
          return name.map((letter, letterIndex) => {
            if (letterIndex === col) {
              if (letter.isEmpty) {
                changeSetting(row, col, delta);
                return letter; // Return unchanged for empty boxes
              } else if (letter.isVowel && !letter.matched) {
                const newLetter = getNextLetter(letter.currentLetter, delta);
                if (newLetter === letter.correctLetter) {
                  onLetterUnlock(row, col);
                  handleCorrectLetter();
                  return { ...letter, currentLetter: newLetter, matched: true };
                } else {
                  handleLetterChange(delta);
                  return { ...letter, currentLetter: newLetter };
                }
              }
            }
            return letter;
          });
        }
        return name;
      });

      // Check if the word is complete after changing the letter
      if (newNames[row].every(letter => letter.matched || letter.isEmpty)) {
        handleWordComplete(row);
      }

      // Check if all words are complete
      if (areAllWordsComplete(newNames)) {
        handleAllWordsComplete();
      }

      return newNames;
    });

    // Update focusedPosition to maintain the current active letter
    setFocusedPosition({ row, col });
    setActiveNameIndex(row);
  };

  const [timerStarted, setTimerStarted] = createSignal(false);
  const [timeRemaining, setTimeRemaining] = createSignal(300); // 5 minutes in seconds

  const startTimer = () => {
    if (!timerStarted()) {
      setTimerStarted(true);
      const timer = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 0) {
            clearInterval(timer);
            return 0;
          }
          return time - 1;
        });
      }, 1000);

      onCleanup(() => clearInterval(timer));
    }
  };

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  onMount(async () => {
    window.addEventListener('keydown', handleKeyDown);
    letterChangeAudio = new Audio(letterChangeSound);
    letterChangeAudioDown = new Audio(letterChangeSoundDown);
    correctLetterAudio = new Audio(correctLetterSound);
    correctWordAudios = [
      new Audio(correctWordSound1),
      new Audio(correctWordSound2),
      new Audio(correctWordSound3)
    ];
    allWordsCompleteAudio = new Audio(allWordsCompleteSound);
    leftKeyAudio = new Audio(leftKeySound);
    rightKeyAudio = new Audio(rightKeySound);
  });

  onCleanup(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div>
      <DebugWrapper
        label="createInitialNames"
        value={createInitialNames()}
      >
        <Show when={timerStarted()}>
          <div class={styles.timer}>Time remaining: {formatTime(timeRemaining())}</div>
        </Show>
        <div class={styles.nameGrid}>
          <For each={names()}>
            {(name, nameIndex) => {
              const emptyCountBeforeRow = names()
                .slice(0, nameIndex())
                .flat()
                .filter(letter => letter.isEmpty).length;

              return (
                <GridRow
                  name={name}
                  isActiveName={nameIndex() === activeNameIndex()}
                  focusedPosition={focusedPosition()}
                  rowIndex={nameIndex()}
                  currentTheme={appearance.theme}
                  currentMode={appearance.mode}
                  currentBackground={appearance.background}
                  totalEmptyCount={totalEmptyCount()}
                  emptyCountBeforeRow={emptyCountBeforeRow}
                />
              );
            }}
          </For>
        </div>
      </DebugWrapper>
    </div>
  );
};

export default NameGrid;
