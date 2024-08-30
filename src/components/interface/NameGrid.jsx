import { createSignal, createEffect, For, onMount, onCleanup, Show } from 'solid-js';
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

const fullName = ['JOSHUA', 'RUSSELL', 'GANTT', 'NOTION', 'PRODUCT', 'MANAGER'];
// const fullName = ['MVP', 'KPI', 'OKR'];
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const isVowel = char => 'AEIOU'.includes(char.toUpperCase());
const getRandomLetter = () => alphabet[Math.floor(Math.random() * 26)];
const getNextLetter = (current, direction) => {
  const currentIndex = alphabet.indexOf(current.toUpperCase());
  return alphabet[(currentIndex + direction + 26) % 26];
};

const areAllWordsComplete = names => {
  return names.every(name => name.every(letter => letter.currentLetter === letter.correctLetter));
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

const createInitialNames = () => {
  const paddedNames = fullName.map(name => padder(name));

  return paddedNames.map(name =>
    name.split('').map(char => ({
      correctLetter: char,
      currentLetter: isVowel(char) ? getRandomLetter() : char,
      isVowel: isVowel(char),
      matched: !isVowel(char) && char !== ' '
    }))
  );
};

const NameGrid = ({ onLetterUnlock }) => {
  const { theme, changeTheme, themes } = useTheme();
  console.log('NameGrid: Component rendered');
  console.log('NameGrid: Current theme:', theme());
  console.log('NameGrid: Available themes:', themes);
  const [themeIndex, setThemeIndex] = createSignal(themes.findIndex(t => t.name === theme()));
  console.log('NameGrid: Theme index:', themeIndex());

  let letterChangeAudio,
    letterChangeAudioDown,
    correctLetterAudio,
    allWordsCompleteAudio,
    leftKeyAudio,
    rightKeyAudio;
  let correctWordAudios = [];
  let lastTouchY = 0;

  const [names, setNames] = createSignal(createInitialNames());
  const [activeNameIndex, setActiveNameIndex] = createSignal(0);
  const [activeVowelIndex, setActiveVowelIndex] = createSignal(
    names()[0].findIndex(char => char.isVowel)
  );
  const [gameCompleted, setGameCompleted] = createSignal(false);
  const [focusedPosition, setFocusedPosition] = createSignal({ row: 0, col: 0 });

  // Add this effect to set initial focus
  createEffect(() => {
    const initialVowelIndex = names()[0].findIndex(char => char.isVowel);
    setFocusedPosition({ row: 0, col: initialVowelIndex });
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
      if (currentLetter.isVowel || currentLetter.correctLetter === ' ') {
        return { row, col };
      }

      if (row === startRow && col === startCol) {
        // We've gone full circle, no vowels or blanks found
        return { row: startRow, col: startCol };
      }
    }
  };

  const cycleTheme = direction => {
    console.log('NameGrid: Cycling theme, direction:', direction);
    const currentIndex = themes.findIndex(t => t.name === theme());
    console.log('NameGrid: Current theme index:', currentIndex);
    const newIndex = (currentIndex + direction + themes.length) % themes.length;
    console.log('NameGrid: New theme index:', newIndex);
    const newTheme = themes[newIndex].name;
    console.log('NameGrid: New theme:', newTheme);
    changeTheme(newTheme);
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
        console.log(row, col);
        console.log('NameGrid: Up arrow or W key pressed');

        // if (row === firstEmptyIndex().row && col === firstEmptyIndex().col) {
        //     if (key === 'ArrowUp') {
        //         setActiveThemeIndex((prev) => (prev - 1 + themes.length) % themes.length);
        //         changeTheme(themes[activeThemeIndex()].name);
        //     } else if (key === 'ArrowDown') {
        //         setActiveThemeIndex((prev) => (prev + 1) % themes.length);
        //         changeTheme(themes[activeThemeIndex()].name);
        //     }
        // }
        if (names()[row][col].isVowel && !names()[row][col].matched) {
          console.log('NameGrid: Changing letter up');
          changeLetter(row, col, 1);
        }
        break;
      case 'ArrowDown':
      case 's':
        console.log(row, col);
        console.log('NameGrid: Down arrow or S key pressed');
        if (names()[row][col].isVowel && !names()[row][col].matched) {
          console.log('NameGrid: Changing letter down');
          changeLetter(row, col, -1);
        }
        break;
      case 'Enter':
      case ' ':
        if (names()[row][col].isVowel && !names()[row][col].matched) {
          changeLetter(row, col, 1);
        }
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

  const moveToNextVowel = () => {
    const currentName = names()[activeNameIndex()];
    const nextVowelIndex = currentName.findIndex(
      (char, index) => index > activeVowelIndex() && char.isVowel && !char.matched
    );

    if (nextVowelIndex !== -1) {
      setActiveVowelIndex(nextVowelIndex);
    } else {
      const nextNameIndex = names().findIndex(
        (name, index) =>
          index > activeNameIndex() && name.some(char => char.isVowel && !char.matched)
      );

      if (nextNameIndex !== -1) {
        setActiveNameIndex(nextNameIndex);
        setActiveVowelIndex(
          names()[nextNameIndex].findIndex(char => char.isVowel && !char.matched)
        );
      } else {
        handleAllWordsComplete();
      }
    }
  };

  const isLastVowelInWord = (nameIndex, charIndex) => {
    const name = names()[nameIndex];
    return name.slice(charIndex + 1).every(char => !char.isVowel);
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

  const handleScroll = event => {
    event.preventDefault();
    const { row, col } = focusedPosition();
    const currentName = names()[row];
    const currentLetter = currentName[col];

    console.log('Scroll event detected:', { row, col, currentLetter });

    if (currentLetter.isVowel && !currentLetter.matched) {
      const delta = Math.sign(event.deltaY);
      console.log('Changing letter:', { delta });
      changeLetter(row, col, delta);

      // Force a re-render
      setNames(prevNames => [...prevNames]);
    }
  };

  const handleTouchMove = event => {
    lastTouchY = event.touches[0].clientY;
  };

  const changeLetter = (row, col, delta) => {
    setNames(prevNames => {
      const newNames = prevNames.map((name, nameIndex) => {
        if (nameIndex === row) {
          return name.map((letter, letterIndex) => {
            if (letterIndex === col && letter.isVowel && !letter.matched) {
              const newLetter = getNextLetter(letter.currentLetter, delta);

              console.log('Letter changing:', {
                from: letter.currentLetter,
                to: newLetter,
                row,
                col
              });

              if (newLetter === letter.correctLetter) {
                onLetterUnlock(row, col);
                handleCorrectLetter();
                return { ...letter, currentLetter: newLetter, matched: true };
              } else {
                handleLetterChange(delta);
                return { ...letter, currentLetter: newLetter };
              }
            }
            return letter;
          });
        }
        return name;
      });

      // Check if the word is complete after changing the letter
      if (newNames[row].every(letter => letter.matched)) {
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
            {(name, nameIndex) => (
              <GridRow
                name={name}
                isActiveName={nameIndex() === activeNameIndex()}
                activeVowelIndex={activeVowelIndex()}
                focusedPosition={focusedPosition()}
                rowIndex={nameIndex()}
                currentTheme={theme()}
              />
            )}
          </For>
        </div>
      </DebugWrapper>
    </div>
  );
};

export default NameGrid;
