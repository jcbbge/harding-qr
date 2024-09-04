import {
  createSignal,
  createEffect,
  For,
  onMount,
  onCleanup,
  Show,
  createMemo,
  createResource
} from 'solid-js';
import { createStore } from 'solid-js/store';
import styles from './NameGrid.module.css';
import GridRow from './GridRow';

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
  let letterChangeAudio,
    letterChangeAudioDown,
    correctLetterAudio,
    allWordsCompleteAudio,
    leftKeyAudio,
    rightKeyAudio;
  let correctWordAudios = [];

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

  const [names, setNames] = createStore(createInitialNames());
  const [activeNameIndex, setActiveNameIndex] = createSignal(0);
  const [gameCompleted, setGameCompleted] = createSignal(false);
  const [focusedPosition, setFocusedPosition] = createSignal({ row: 0, col: 1 });

  const totalEmptyCount = createMemo(() =>
    names.reduce((count, name) => count + name.filter(letter => letter.isEmpty).length, 0)
  );

  createEffect(() => {
    const firstNonEmptyPosition = names.reduce((pos, row, rowIndex) => {
      if (pos) return pos;
      const colIndex = row.findIndex(letter => !letter.isEmpty);
      return colIndex !== -1 ? { row: rowIndex, col: colIndex } : null;
    }, null);

    if (firstNonEmptyPosition) {
      setFocusedPosition(firstNonEmptyPosition);
      setActiveNameIndex(firstNonEmptyPosition.row);
    }
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

  const handleKeyDown = event => {
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
        handleLetterChange(row, col, shiftKey ? -1 : 1);
        playSound(shiftKey ? letterChangeAudioDown : letterChangeAudio);
        break;
      case 'Tab':
        direction = shiftKey ? 'left' : 'right';
        playSound(shiftKey ? leftKeyAudio : rightKeyAudio);
        break;
      default:
        return;
    }

    if (direction) {
      const newPosition = findNextLetterBox(row, col, direction);
      setFocusedPosition(newPosition);
      setActiveNameIndex(newPosition.row);
    }

    direction = undefined;
  };

  const playSound = audio => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(error => {});
    }
  };

  const handleLetterChange = (row, col, direction) => {
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
      playSound(correctWordAudios[row]);
    }

    if (areAllWordsComplete(names)) {
      setTimeout(() => {
        playSound(allWordsCompleteAudio);
      }, 600);
      setGameCompleted(true);
    }
  };

  onMount(() => {
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
    <>
      <div class={styles.nameGrid}>
        <For each={names}>
          {(name, nameIndex) => {
            const emptyCountBeforeRow = names
              .slice(0, nameIndex)
              .flat()
              .filter(letter => letter.isEmpty).length;

            return (
              <GridRow
                name={name}
                isActiveName={nameIndex() === activeNameIndex()}
                focusedPosition={focusedPosition()}
                rowIndex={nameIndex()}
                totalEmptyCount={totalEmptyCount()}
                emptyCountBeforeRow={emptyCountBeforeRow}
                onLetterChange={handleLetterChange}
              />
            );
          }}
        </For>
      </div>
    </>
  );
};

export default NameGrid;
