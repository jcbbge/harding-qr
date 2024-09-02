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
  const [activeVowelIndex, setActiveVowelIndex] = createSignal(
    names()[0].findIndex(char => char.isVowel)
  );
  const [gameCompleted, setGameCompleted] = createSignal(false);
  const [focusedPosition, setFocusedPosition] = createSignal({ row: 0, col: 0 });

  const totalEmptyCount = createMemo(() =>
    names().reduce((count, name) => count + name.filter(letter => letter.isEmpty).length, 0)
  );

  createEffect(() => {
    const initialVowelIndex = names()[activeNameIndex()].findIndex(char => char.isVowel);
    setFocusedPosition({ row: activeNameIndex(), col: initialVowelIndex });
  });

  const findNextVowelOrBlank = (startRow, startCol, direction) => {
    let row = startRow;
    let col = startCol;

    while (true) {
      col += direction;

      if (col < 0 || col >= names()[row].length) {
        row += direction;
        if (row < 0) {
          row = names().length - 1;
          col = names()[row].length - 1;
        } else if (row >= names().length) {
          row = 0;
          col = 0;
        } else {
          col = direction > 0 ? 0 : names()[row].length - 1;
        }
      }

      const currentLetter = names()[row][col];
      if (currentLetter.isVowel || currentLetter.isEmpty) {
        return { row, col };
      }

      if (row === startRow && col === startCol) {
        return { row: startRow, col: startCol };
      }
    }
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
    const { key } = event;
    const { row, col } = focusedPosition();
    console.log('NameGrid: Key pressed:::::', key);
    console.log('NameGrid: Focused position:::::', { row, col });

    let newPosition;

    switch (key) {
      case 'ArrowLeft':
      case 'a':
        newPosition = findNextVowelOrBlank(row, col, -1);
        playSound(leftKeyAudio);
        break;
      case 'ArrowRight':
      case 'd':
        newPosition = findNextVowelOrBlank(row, col, 1);
        playSound(rightKeyAudio);
        break;
      case 'ArrowUp':
      case 'w':
        changeLetter(row, col, 1);
        break;
      case 'ArrowDown':
      case 's':
        changeLetter(row, col, -1);
        break;
      case 'Enter':
      case ' ':
        changeLetter(row, col, 1);
        return;
      default:
        return;
    }

    if (newPosition) {
      console.log('NameGrid: New position:', newPosition);
      setFocusedPosition(newPosition);
      setActiveNameIndex(newPosition.row);
      setActiveVowelIndex(newPosition.col);
    }
    event.preventDefault();
  };

  const playSound = audio => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(error => console.error('Error playing audio:', error));
    } else {
      console.warn('Audio object is not available.');
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
    console.log('Correct letter guessed!');
    playSound(correctLetterAudio);
  };

  const handleWordComplete = nameIndex => {
    console.log(`Word ${nameIndex + 1} (${fullName[nameIndex]}) is complete!`);
    playSound(correctWordAudios[nameIndex]);
  };

  const handleAllWordsComplete = () => {
    if (!gameCompleted()) {
      console.log('All words completed! Game over!');
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
    setActiveVowelIndex(col);
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

              console.log('Rendering GridRow:', {
                nameIndex: nameIndex(),
                currentMode: appearance.mode,
                emptyCountBeforeRow
              }); // Debug log

              return (
                <GridRow
                  name={name}
                  isActiveName={nameIndex() === activeNameIndex()}
                  activeVowelIndex={activeVowelIndex()}
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
