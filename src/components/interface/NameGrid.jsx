import { createSignal, createEffect, For, onMount, onCleanup, createMemo } from 'solid-js';
import { createStore } from 'solid-js/store';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './NameGrid.module.css';

import letterChangeSound from '../../assets/sounds/natural-tap-1.wav';
import letterChangeSoundDown from '../../assets/sounds/natural-tap-3.wav';
import correctLetterSound from '../../assets/sounds/success.wav';
import correctWordSound1 from '../../assets/sounds/musical-tap-1.wav';
import correctWordSound2 from '../../assets/sounds/musical-tap-3.wav';
import correctWordSound3 from '../../assets/sounds/musical-tap-2.wav';
import allWordsCompleteSound from '../../assets/sounds/atmostphere-2.wav';
import leftKeySound from '../../assets/sounds/button-4.wav';
import rightKeySound from '../../assets/sounds/button-6.wav';

const fullName = ['JOSHUA', 'RUSSELL', 'GANTT'];
// const fullName = ['PRD', 'KPI', 'OKR'];
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let letterChangeAudio,
  letterChangeAudioDown,
  correctLetterAudio,
  allWordsCompleteAudio,
  leftKeyAudio,
  rightKeyAudio;
let correctWordAudios = [];

const initializeWordList = () => {
  const maxLength = Math.max(...fullName.map(name => name.length), 4);
  const isVowel = char => 'AEIOU'.includes(char.toUpperCase());
  const getRandomLetter = (exclude) => {
    const availableLetters = alphabet.replace(exclude.toUpperCase(), '');
    return availableLetters[Math.floor(Math.random() * availableLetters.length)];
  };
  const padder = name => {
    const lengthPos = maxLength === 3 ? 4 : maxLength;

    if (lengthPos === 4 && fullName.indexOf(name) === 1) {
      return name.padEnd(lengthPos, ' ');
    } else {
      return name.padStart(lengthPos, ' ');
    }
  };

  const paddedNames = fullName.map(padder);

  return paddedNames.map(name => {
    return name.split('').map(char => ({
      correctLetter: char,
      currentLetter: isVowel(char) ? getRandomLetter(char) : char,
      isVowel: isVowel(char),
      matched: !isVowel(char) && char !== ' ',
      isEmpty: char === ' '
    }));
  });
};

const NameGrid = ({ onLetterUnlock }) => {
  const [theme, { updateTheme, updateMode, updatePattern, getItemIcon }] = useTheme();
  const [names, setNames] = createStore(initializeWordList());
  const [activeNameIndex, setActiveNameIndex] = createSignal(0);
  const [focusedPosition, setFocusedPosition] = createSignal({ row: 0, col: 1 });

  // Load theme from local storage on mount
  onMount(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      updateTheme(0, storedTheme);
    }
  });

  // Log theme changes and update local storage
  createEffect(() => {
    const currentTheme = theme.theme();
    localStorage.setItem('theme', currentTheme);
  });

  const findNextLetterBox = (currentRow, currentCol, direction) => {
    const totalRows = names.length;
    const totalCols = names[0].length;

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

  const gridNavigate = event => {
    const { key, shiftKey } = event;
    const { row, col } = focusedPosition();
    let direction;

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
        updateLetterBox(row, col, shiftKey ? -1 : 1);
        return;
      case 'Tab':
        direction = shiftKey ? 'left' : 'right';
        playSound(shiftKey ? leftKeyAudio : rightKeyAudio);
        break;
      default:
        return;
    }

    if (direction) {
      const newPosition = findNextLetterBox(row, col, direction);
      setFocusedPosition({ row: newPosition.row, col: newPosition.col });
      setActiveNameIndex(newPosition.row);
    }

    direction = undefined;
  };

  const playSound = audio => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    } else {
      console.error('Audio not found');
    }
  };

  const updateLetterBox = (row, col, direction) => {
    const letterObj = names[row][col];

    // Log the current state and parameters at the start of the function
    if (letterObj.isEmpty) {
      const emptyIndexInRow = names[row].slice(0, col).filter(l => l.isEmpty).length;
      const emptyIndexInGrid =
        names.slice(0, row).reduce((count, r) => count + r.filter(l => l.isEmpty).length, 0) +
        emptyIndexInRow;

      switch (emptyIndexInGrid) {
        case 0:
          updateTheme(direction);
          break;
        case 1:
          updateMode(direction);
          break;
        case 2:
          updatePattern(direction);
          break;
      }
      playSound(direction > 0 ? letterChangeAudio : letterChangeAudioDown);
      return;
    }

    const getNextLetter = (current, direction) => {
      const currentIndex = alphabet.indexOf(current.toUpperCase());
      return alphabet[(currentIndex + direction + 26) % 26];
    };

    // Only call setNames if the letter is a vowel
    if (letterObj.isVowel) {
      setNames(row, col, letter => {
        if (!letter.isEmpty && !letter.matched) {
          const newLetter = getNextLetter(letter.currentLetter, direction);

          if (newLetter === letter.correctLetter) {
            onLetterUnlock(row, col);
            // Check if this is the last unmatched vowel in the word
            const isLastVowel = names[row].filter(l => l.isVowel && !l.matched).length === 1;

            // Check if this is the last word with unmatched vowels
            const isLastWord = names.every(
              (word, index) => index === row || word.every(l => !l.isVowel || l.matched)
            );

            if (isLastWord && isLastVowel) {
              playSound(allWordsCompleteAudio);
            } else if (isLastVowel) {
              playSound(correctWordAudios[row]);
            } else {
              playSound(correctLetterAudio);
            }

            return { ...letter, currentLetter: newLetter, matched: true };
          }
          // Play sound for vowels
          playSound(direction > 0 ? letterChangeAudio : letterChangeAudioDown);
          return { ...letter, currentLetter: newLetter };
        }
        return letter;
      });
    }
  };

  onMount(() => {
    window.addEventListener('keydown', gridNavigate);
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
    window.removeEventListener('keydown', gridNavigate);
  });

  const getIconImg = iconName => {
    const [error, setError] = createSignal(false);

    return (
      <>
        <img
          src={`/src/assets/icons/${iconName}.svg`}
          alt={`${iconName} icon`}
          class={styles.icon}
          onError={() => setError(true)}
          style={{ display: error() ? 'none' : 'inline' }}
        />
        {error() && <span class={styles.iconFallback}>{iconName.charAt(0).toUpperCase()}</span>}
      </>
    );
  };

  const logAndRenderIcon = (type, name) => {
    const iconName = getItemIcon(type, name());
    return getIconImg(iconName);
  };

  const getThemeIcon = () => {
    const iconName = getItemIcon('theme', theme.theme());
    return iconName;
  };

  return (
    <div class={styles.nameGrid}>
      <For each={names}>
        {(name, nameIndex) => (
          <div
            class={styles.nameRow}
            style={{ '--name-length': name.length }}
          >
            <For each={name}>
              {(letterObj, letterIndex) => {
                const isFocused = createMemo(
                  () =>
                    nameIndex() === focusedPosition().row && letterIndex() === focusedPosition().col
                );

                const letterBoxClass = createMemo(() => {
                  const classes = [styles.letterBox];
                  if (letterObj.isEmpty) {
                    classes.push(styles.emptyBox, styles.accentUnexpected);
                  } else {
                    if (letterObj.matched) classes.push(styles.matched);
                    if (letterObj.isVowel) classes.push(styles.vowel);
                    if (letterObj.isVowel && letterObj.matched) {
                      classes.push(styles.accentBackground);
                    } else if (letterObj.isVowel && !letterObj.matched) {
                      classes.push(styles.accentOpposite);
                    }
                  }
                  if (isFocused()) classes.push(styles.focused);
                  return classes.join(' ');
                });

                if (letterObj.isEmpty) {
                  const emptyIndexInRow = name
                    .slice(0, letterIndex())
                    .filter(l => l && l.isEmpty).length;
                  const emptyIndexInGrid =
                    names.slice(0, nameIndex()).reduce((count, row) => {
                      return count + row.filter(l => l.isEmpty).length;
                    }, 0) + emptyIndexInRow;

                  let iconElement;
                  switch (emptyIndexInGrid) {
                    case 0:
                      iconElement = (
                        <div class={letterBoxClass()}>{getIconImg(getThemeIcon())}</div>
                      );
                      break;
                    case 1:
                      iconElement = (
                        <div class={letterBoxClass()}>{logAndRenderIcon('mode', theme.mode)}</div>
                      );
                      break;
                    case 2:
                      iconElement = (
                        <div class={letterBoxClass()}>
                          {logAndRenderIcon('pattern', theme.pattern)}
                        </div>
                      );
                      break;
                    default:
                      return null;
                  }

                  return iconElement;
                }

                return (
                  <div
                    class={letterBoxClass()}
                    role="button"
                    tabIndex={isFocused() ? 0 : -1}
                  >
                    <span>{letterObj.currentLetter}</span>
                  </div>
                );
              }}
            </For>
          </div>
        )}
      </For>
    </div>
  );
};

export default NameGrid;
