import { createSignal, createEffect, For, Show, onMount, onCleanup, createMemo } from 'solid-js';
import { createStore } from 'solid-js/store';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './NameGrid.module.css';
import MobileScrollUnlock from './MobileScrollUnlock';

import letterChangeSound from '../../assets/sounds/natural-tap-1.wav';
import letterChangeSoundDown from '../../assets/sounds/natural-tap-3.wav';
import correctLetterSound from '../../assets/sounds/success.wav';
import correctWordSound1 from '../../assets/sounds/musical-tap-1.wav';
import correctWordSound2 from '../../assets/sounds/musical-tap-3.wav';
import correctWordSound3 from '../../assets/sounds/musical-tap-2.wav';
import allWordsCompleteSound from '../../assets/sounds/atmostphere-2.wav';
import leftKeySound from '../../assets/sounds/button-4.wav';
import rightKeySound from '../../assets/sounds/button-6.wav';



const NameGrid = (props) => {

    // const fullName = ['OKR', 'API', 'EOD'];
let fullName = ['JOSHUA', 'PRODUCT', 'CODE'];
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let letterChangeAudio,
  letterChangeAudioDown,
  correctLetterAudio,
  allWordsCompleteAudio,
  leftKeyAudio,
  rightKeyAudio;
let correctWordAudios = [];

    if(props.wordList) {
      fullName = props.wordList;
    }

const initializeWordList = () => {
  const maxLength = Math.max(...fullName.map(name => name.length), 4);
  console.log('Debug: maxLength', maxLength);
  const [totalLengthCount, setTotalLengthCount] = createSignal(0);

  const isVowel = char => 'AEIOU'.includes(char.toUpperCase());
  const getRandomLetter = (exclude) => {
    const availableLetters = alphabet.replace(exclude.toUpperCase(), '');
    return availableLetters[Math.floor(Math.random() * availableLetters.length)];
  };

  const padder = (name, index) => {
    console.log(`Debug: Padding name "${name}" at index ${index}`);
    console.log(`Debug: Initial name length: ${name.length}`);
    console.log(`Debug: Total length count before: ${totalLengthCount()}`);

    let paddedName = name;
    const difference = maxLength - name.length;

    if (totalLengthCount() < 3) {
      const spaceToAdd = Math.min(difference, 3 - totalLengthCount());
      paddedName = paddedName.padStart(name.length + spaceToAdd, ' ');
      setTotalLengthCount(prev => prev + spaceToAdd);
    }

    // Always pad to maxLength, regardless of where the spaces were added
    paddedName = paddedName.padEnd(maxLength, ' ');

    console.log(`Debug: Final padded name: "${paddedName}", length: ${paddedName.length}`);
    console.log(`Debug: Total length count after: ${totalLengthCount()}`);
    return paddedName;
  };

  const paddedNames = fullName.map(padder);
  console.log('Debug: paddedNames', paddedNames);
  console.log('Debug: paddedNames lengths', paddedNames.map(name => name.length));

  return paddedNames.map(name => {
    const result = name.split('').map(char => ({
      correctLetter: char,
      currentLetter: isVowel(char) ? getRandomLetter(char) : char,
      isVowel: isVowel(char),
      matched: !isVowel(char) && char !== ' ',
      isEmpty: char === ' '
    }));
    console.log('Debug: processed name', result);
    return result;
    });
  };
  const [theme, { updateTheme, updateMode, updatePattern, getItemIcon }] = useTheme();
  const [names, setNames] = createStore(initializeWordList());
  const [activeNameIndex, setActiveNameIndex] = createSignal(0);
  const [focusedPosition, setFocusedPosition] = createSignal({ row: 0, col: 1 });
  const [isMobile, setIsMobile] = createSignal(false);
  const [touchStartY, setTouchStartY] = createSignal(0);
  const [lastTouchTime, setLastTouchTime] = createSignal(0);

  // Add this line to get the maxLength
  const maxLength = Math.max(...fullName.map(name => name.length), 4);

  // Add this effect to set the CSS custom property
  createEffect(() => {
    document.documentElement.style.setProperty('--grid-columns', maxLength.toString());
  });

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

  createEffect(() => {
    const allMatched = names.every(word => word.every(letter => !letter.isVowel || letter.matched));
    if (allMatched) {
      props.onAllLettersMatched();
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

  const updateLetterBox = (row, col, direction, isShiftEquivalent = false) => {
    const letterObj = names[row][col];

    if (letterObj.isEmpty) {
      const emptyIndexInRow = names[row].slice(0, col).filter(l => l.isEmpty).length;
      const emptyIndexInGrid =
        names.slice(0, row).reduce((count, r) => count + r.filter(l => l.isEmpty).length, 0) +
        emptyIndexInRow;

      switch (emptyIndexInGrid) {
        case 0:
          updateTheme(direction);
          playSound(direction > 0 ? letterChangeAudio : letterChangeAudioDown);
          break;
        case 1:
          updateMode(direction);
          playSound(direction > 0 ? letterChangeAudio : letterChangeAudioDown);
          break;
        case 2:
          updatePattern(direction);
          playSound(direction > 0 ? letterChangeAudio : letterChangeAudioDown);
          break;
        default:
          // This is a truly empty letterbox, do nothing and don't play any sound
          return;
      }
      return;
    }

    const getNextLetter = (current, direction) => {
      const currentIndex = alphabet.indexOf(current.toUpperCase());
      return alphabet[(currentIndex + direction + 26) % 26];
    };

    // Only update and play sound if the letter is a vowel
    if (letterObj.isVowel) {
      setNames(row, col, letter => {
        if (!letter.isEmpty && !letter.matched) {
          const newLetter = getNextLetter(letter.currentLetter, isShiftEquivalent ? -direction : direction);

          if (newLetter === letter.correctLetter) {
            props.onLetterUnlock(row, col);
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

  const checkMobile = () => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  };

  const disableOverscroll = () => {
    document.body.style.overscrollBehaviorY = 'contain';
  };

  const enableOverscroll = () => {
    document.body.style.overscrollBehaviorY = 'auto';
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

    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (isMobile()) {
      disableOverscroll();
    }
  });

  onCleanup(() => {
    window.removeEventListener('keydown', gridNavigate);
    window.removeEventListener('resize', checkMobile);

    enableOverscroll();
  });

  const handleTouchStart = (event, rowIndex, colIndex) => {
    if (!isMobile()) return;
    event.preventDefault();
    setTouchStartY(event.touches[0].clientY);
    setLastTouchTime(Date.now());
    setFocusedPosition({ row: rowIndex, col: colIndex });
    setActiveNameIndex(rowIndex);
  };

  const handleTouchMove = (event) => {
    if (!isMobile()) return;
    event.preventDefault();
  };

  const handleTouchEnd = (event, rowIndex, colIndex) => {
    if (!isMobile()) return;
    event.preventDefault();
    const touchEndY = event.changedTouches[0].clientY;
    const diffY = touchEndY - touchStartY();
    const timeDiff = Date.now() - lastTouchTime();

    if (Math.abs(diffY) > 50) {
      // Vertical swipe
      handleVerticalSwipe(rowIndex, colIndex, diffY > 0);
    } else if (timeDiff < 300) {
      // Tap event (if touch duration is less than 300ms)
      setFocusedPosition({ row: rowIndex, col: colIndex });
      setActiveNameIndex(rowIndex);
    }
  };

  const handleVerticalSwipe = (rowIndex, colIndex, isDownSwipe) => {
    const { row, col } = focusedPosition();
    if (row === rowIndex && col === colIndex) {
      const letterObj = names[row][col];
      if (letterObj.isVowel || letterObj.isEmpty) {
        updateLetterBox(row, col, isDownSwipe ? 1 : -1);
      }
    }
  };

  const getIconImg = iconName => {
    const [error, setError] = createSignal(false);
    const isDarkMode = theme.mode() === 'dark';
    return (
      <>
        <img
          src={`/assets/icons/${iconName}.svg`}
          alt={`${iconName} icon`}
          class={`${styles.icon} ${isDarkMode ? styles.iconInverted : ''}`}
          onError={() => setError(true)}
          style={{ display: error() ? 'none' : 'inline' }}
        />
        {error() && <span class={styles.iconFallback}>{iconName.charAt(0).toUpperCase()}</span>}
      </>
    );
  };

  const handleLetterChange = (direction) => {
    // Call the existing letterChange function with the direction
    updateLetterBox(focusedPosition().row, focusedPosition().col, direction);
  };

  return (
    <div class={styles.nameGrid}>
      <For each={names}>
        {(name, nameIndex) => (
          <>
            <Show when={props.jsxElements && props.jsxElements[nameIndex()]}>
              <div class={styles.jsxElement}>{props.jsxElements[nameIndex()]}</div>
            </Show>
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

                  const getSettingIcon = createMemo(() => {
                    if (letterObj.isEmpty) {
                      const emptyIndexInRow = name
                        .slice(0, letterIndex())
                        .filter(l => l && l.isEmpty).length;
                      const emptyIndexInGrid =
                        names.slice(0, nameIndex()).reduce((count, row) => {
                          return count + row.filter(l => l.isEmpty).length;
                        }, 0) + emptyIndexInRow;

                      switch (emptyIndexInGrid) {
                        case 0:
                          return getIconImg(getItemIcon('theme', theme.theme()));
                        case 1:
                          return getIconImg(getItemIcon('mode', theme.mode()));
                        case 2:
                          return getIconImg(getItemIcon('pattern', theme.pattern()));
                        default:
                          return null;
                      }
                    }
                    return null;
                  });

                  return (
                    <div
                      class={letterBoxClass()}
                      role="button"
                      tabIndex={isFocused() ? 0 : -1}
                      onClick={() => !isMobile() && props.onCellClick(nameIndex(), letterIndex())}
                      onTouchStart={(e) => handleTouchStart(e, nameIndex(), letterIndex())}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={(e) => handleTouchEnd(e, nameIndex(), letterIndex())}
                    >
                      {letterObj.isEmpty ? getSettingIcon() : <span>{letterObj.currentLetter}</span>}
                    </div>
                  );
                }}
              </For>
            </div>
          </>
        )}
      </For>
      {/* <MobileScrollUnlock
        isMobile={isMobile()}
        onLetterChange={handleLetterChange}
      /> */}
    </div>
  );
};

export default NameGrid;