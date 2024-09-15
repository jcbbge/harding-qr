import { createSignal, createEffect, For, onMount, onCleanup, createMemo } from 'solid-js';
import { createStore } from 'solid-js/store';
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
  const getRandomLetter = () => alphabet[Math.floor(Math.random() * 26)];
  const padder = name => {
    const maxLength = Math.max(...fullName.map(name => name.length));
    const lengthPos = maxLength === 3 ? 4 : maxLength;

    if (lengthPos === 4 && fullName.indexOf(name) === 1) {
      return name.padEnd(lengthPos, ' ');
    } else {
      return name.padStart(lengthPos, ' ');
    }
  };

  return fullName.map((name, index) => {
    const paddedName = padder(name).padEnd(maxLength, ' ');
    return paddedName.split('').map(char => ({
      correctLetter: char,
      currentLetter: isVowel(char) ? getRandomLetter() : char,
      isVowel: isVowel(char),
      matched: (!isVowel(char) && char !== ' ') || (index > 0 && char !== ' '),
      isEmpty: char === ' '
    }));
  });
};

const NameGrid = ({ onLetterUnlock }) => {
  const [names, setNames] = createStore(initializeWordList());
  const [activeNameIndex, setActiveNameIndex] = createSignal(0);
  const [focusedPosition, setFocusedPosition] = createSignal({ row: 0, col: 1 });

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
        playSound(shiftKey ? letterChangeAudioDown : letterChangeAudio);
        return; // Exit the function early as we don't need to update focus for these keys
      case 'Tab':
        direction = shiftKey ? 'left' : 'right';
        playSound(shiftKey ? leftKeyAudio : rightKeyAudio);
        break;
      default:
        return;
    }

    if (direction) {
      const newPosition = findNextLetterBox(row, col, direction);
      console.log('newPosition', newPosition);
      console.log('beforeSetFocusedPosition', focusedPosition());

      setFocusedPosition({ row: newPosition.row, col: newPosition.col });
      setActiveNameIndex(newPosition.row);

      console.log('after setFocusedPosition', focusedPosition());

      // Log the current row, current index, and current letter
      const currentLetter = names[newPosition.row][newPosition.col];
      console.log('Navigation:', {
        row: newPosition.row,
        col: newPosition.col,
        letter: currentLetter.isEmpty ? 'Empty' : currentLetter.currentLetter,
        focusedPosition: focusedPosition()
      });
    }

    direction = undefined;
  };

  const playSound = audio => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(error => {});
    }
  };
  const updateLetterBox = (row, col, direction) => {
    const getNextLetter = (current, direction) => {
      const currentIndex = alphabet.indexOf(current.toUpperCase());
      return alphabet[(currentIndex + direction + 26) % 26];
    };

    const areAllWordsComplete = names => {
      return names.every(name => name.every(letter => letter.matched || letter.isEmpty));
    };

    setNames(row, col, letter => {
      if (!letter.isEmpty && letter.isVowel && !letter.matched) {
        const newLetter = getNextLetter(letter.currentLetter, direction);

        if (newLetter === letter.correctLetter) {
          onLetterUnlock(row, col);
          playSound(correctLetterAudio);
          return { ...letter, currentLetter: newLetter, matched: true };
        } else {
          playSound(direction > 0 ? letterChangeAudio : letterChangeAudioDown);
          return { ...letter, currentLetter: newLetter };
        }
      }
      return letter;
    });

    if (names[row].every(l => l.matched || l.isEmpty)) {
      setTimeout(() => {
        playSound(correctWordAudios[row]);
      }, 900);
    }

    if (areAllWordsComplete(names)) {
      setTimeout(() => {
        playSound(allWordsCompleteAudio);
      }, 900);
      setGameCompleted(true);
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

  return (
    <div class={styles.nameGrid}>
      <For each={names}>
        {(name, nameIndex) => (
          <div
            class={styles.nameRow}
            style={{ '--name-length': props.name.length }}
          >
            <For each={props.name}>
              {(letterObj, letterIndex) => {
                console.log('Rendering letter:', letterObj, 'at index:', letterIndex());

                const isFocused = createMemo(() => props.isFocused(letterIndex()));
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
                  const emptyIndexInRow = props.name
                    .slice(0, letterIndex())
                    .filter(l => l && l.isEmpty).length;
                  const emptyIndexInGrid = props.emptyCountBeforeRow + emptyIndexInRow + 1;

                  console.log('Empty box:', { emptyIndexInRow, emptyIndexInGrid });

                  let iconName;
                  switch (emptyIndexInGrid) {
                    case 1:
                      iconName = getItemIcon('theme', themeState.theme());
                      break;
                    case 2:
                      iconName = getItemIcon('mode', themeState.mode());
                      break;
                    case 3:
                      iconName = getItemIcon('pattern', themeState.pattern());
                      break;
                    default:
                      console.warn(`Unexpected empty index: ${emptyIndexInGrid}`);
                      return null;
                  }

                  console.log('Icon for empty box:', iconName);

                  return (
                    <div
                      class={letterBoxClass()}
                      onClick={() => handleSettingChange(letterIndex(), 1)}
                    >
                      {iconName && getIconImg(iconName)}
                    </div>
                  );
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
