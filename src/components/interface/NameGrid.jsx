import { createSignal, createEffect, For, Show, onMount, onCleanup, createMemo } from 'solid-js';
import { createStore } from 'solid-js/store';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './NameGrid.module.css';
import MobileScrollUnlock from './MobileScrollUnlock';
import { Howl } from 'howler';

import letterChangeSound from '../../assets/sounds/natural-tap-1.wav';
import letterChangeSoundDown from '../../assets/sounds/natural-tap-3.wav';
import correctLetterSound from '../../assets/sounds/success.wav';
import correctWordSound1 from '../../assets/sounds/musical-tap-1.wav';
import correctWordSound2 from '../../assets/sounds/musical-tap-3.wav';
import correctWordSound3 from '../../assets/sounds/musical-tap-2.wav';
import allWordsCompleteSound from '../../assets/sounds/atmostphere-2.wav';
import leftKeySound from '../../assets/sounds/button-4.wav';
import rightKeySound from '../../assets/sounds/button-6.wav';

// Add this function near the top of the component, after the imports and before the NameGrid function
const findFirstVowelPosition = (names) => {
  for (let row = 0; row < names.length; row++) {
    for (let col = 0; col < names[row].length; col++) {
      if (names[row][col].isVowel) {
        return { row, col };
      }
    }
  }
  return { row: 0, col: 0 }; // Fallback to first position if no vowels found
};

const NameGrid = (props) => {

    // let wordList = ['OKR', 'API', 'EOD'];
let wordList = ['JOSHUA', 'PRODUCT', 'CODE'];
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Replace the sounds object with this optimized version
const sounds = {
  letterChange: new Howl({
    src: [letterChangeSound],
    preload: true,
    html5: false, // Change to WebAudio API
    pool: 5 // Increase pool size
  }),
  letterChangeDown: new Howl({
    src: [letterChangeSoundDown],
    preload: true,
    html5: false,
    pool: 5
  }),
  correctLetter: new Howl({
    src: [correctLetterSound],
    preload: true,
    html5: false,
    pool: 3
  }),
  allWordsComplete: new Howl({
    src: [allWordsCompleteSound],
    preload: true,
    html5: false,
    pool: 1 // Only needs 1 since it plays once
  }),
  leftKey: new Howl({
    src: [leftKeySound],
    preload: true,
    html5: false,
    pool: 5
  }),
  rightKey: new Howl({
    src: [rightKeySound],
    preload: true,
    html5: false,
    pool: 5
  })
};

const correctWordSounds = [
  new Howl({ src: [correctWordSound1], preload: true, html5: false, pool: 2 }),
  new Howl({ src: [correctWordSound2], preload: true, html5: false, pool: 2 }),
  new Howl({ src: [correctWordSound3], preload: true, html5: false, pool: 2 })
];

if(props.wordList)
  wordList = props.wordList;

const maxLength = Math.max(...wordList.map(name => name.length)) + 1;

const initializeWordList = () => {


  const isVowel = char => 'AEIOU'.includes(char.toUpperCase());
  const getRandomLetter = (exclude) => {
    const availableLetters = alphabet.replace(exclude.toUpperCase(), '');
    return availableLetters[Math.floor(Math.random() * availableLetters.length)];
  };

  const longestWordLength = Math.max(...wordList.map(word => word.length));
  const allSameLength = wordList.every(word => word.length === longestWordLength);
  const totalColumns = allSameLength ? longestWordLength + 1 : longestWordLength;

  const padder = (word) => {
    const spacesToAdd = totalColumns - word.length;
    return word.padStart(totalColumns, ' ');
  };

  const paddedNames = wordList.map(padder);

  const result = paddedNames.map(name => {
    return name.split('').map(char => ({
      correctLetter: char,
      currentLetter: isVowel(char) ? getRandomLetter(char) : char,
      isVowel: isVowel(char),
      matched: !isVowel(char) && char !== ' ',
      isEmpty: char === ' '
    }));
  });

  return result;
};
  const [theme, { updateTheme, updateMode, updatePattern, getItemIcon }] = useTheme();
  const [names, setNames] = createStore(initializeWordList());
  const [activeNameIndex, setActiveNameIndex] = createSignal(0);
  // Replace the existing focusedPosition signal initialization with this:
  const [focusedPosition, setFocusedPosition] = createSignal(findFirstVowelPosition(names));
  const [isMobile, setIsMobile] = createSignal(false);
  const [touchStartY, setTouchStartY] = createSignal(0);
  const [lastTouchTime, setLastTouchTime] = createSignal(0);
  const [isGridFocused, setIsGridFocused] = createSignal(false);

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
    
    if (props.role && props.company) {
      wordList = [props.company, split(props.role, ' ')];
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

  const [focusedElement, setFocusedElement] = createSignal(null);

  // Replace the existing setFocus function with this:
  const setFocus = (row, col) => {
    setFocusedPosition({ row, col });
    setActiveNameIndex(row);
    setIsGridFocused(true);
    const selector = `[data-row="${row}"][data-col="${col}"]`;
    setFocusedElement(selector);
    
    // Add this part to focus the element directly
    setTimeout(() => {
      const element = document.querySelector(selector);
      if (element) {
        element.focus();
        // Add this line to prevent focus from being lost
        element.addEventListener('blur', (event) => event.preventDefault(), { once: true });
      }
    }, 0);
  };

  // Add this effect to handle focus
  createEffect(() => {
    const selector = focusedElement();
    if (selector) {
      const element = document.querySelector(selector);
      if (element) {
        element.focus();
      }
    }
  });

  // Add this near the top of the component, after the signals and stores
  let debounceTimer;
  const debouncedUpdateLetterBox = (row, col, direction, isShiftEquivalent) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      updateLetterBox(row, col, direction, isShiftEquivalent);
    }, 100); // 200ms debounce time, adjust as needed
  };

  // Add these signals to track if audio is loaded
  const [audioLoaded, setAudioLoaded] = createSignal(false);

  // Modify the gridNavigate function
  const gridNavigate = event => {
    const { key, shiftKey } = event;
    const { row, col } = focusedPosition();
    let direction;

    // Prevent default for all navigation keys
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'w', 's', 'd', ' ', 'Tab', 'Enter'].includes(key)) {
      event.preventDefault();
    }

    switch (key) {
      case 'ArrowLeft':
      case 'a':
        direction = 'left';
        playSound(sounds.leftKey);
        break;
      case 'ArrowRight':
      case 'd':
        direction = 'right';
        playSound(sounds.rightKey);
        break;
      case 'ArrowUp':
      case 'w':
        direction = 'up';
        playSound(sounds.rightKey);
        break;
      case 'ArrowDown':
      case 's':
        direction = 'down';
        playSound(sounds.rightKey);
        break;
      case 'Enter':
      case ' ':
        debouncedUpdateLetterBox(row, col, shiftKey ? -1 : 1, false);
        return;
      case 'Tab':
        direction = shiftKey ? 'left' : 'right';
        playSound(shiftKey ? sounds.leftKey : sounds.rightKey);
        break;
      default:
        return;
    }

    if (direction) {
      const newPosition = findNextLetterBox(row, col, direction);
      setFocus(newPosition.row, newPosition.col);
    }

    direction = undefined;
  };

  // Modify the playSound function to handle the pool better
  const playSound = (sound) => {
    if (sound) {
      // Stop any currently playing instances of this sound
      sound.stop();
      // Play new instance
      sound.play();
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
          playSound(direction > 0 ? sounds.letterChange : sounds.letterChangeDown);
          break;
        case 1:
          updateMode(direction);
          playSound(direction > 0 ? sounds.letterChange : sounds.letterChangeDown);
          break;
        case 2:
          updatePattern(direction);
          playSound(direction > 0 ? sounds.letterChange : sounds.letterChangeDown);
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
            const isLastVowel = names[row].filter(l => l.isVowel && !l.matched).length === 1;
            const isLastWord = names.every(
              (word, index) => index === row || word.every(l => !l.isVowel || l.matched)
            );

            if (isLastWord && isLastVowel) {
              playSound(sounds.allWordsComplete);
            } else if (isLastVowel) {
              playSound(correctWordSounds[row]);
            } else {
              playSound(sounds.correctLetter);
            }

            return { ...letter, currentLetter: newLetter, matched: true };
          }
          
          playSound(direction > 0 ? sounds.letterChange : sounds.letterChangeDown);
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

  const handleClickOutside = (event) => {
    const gridElement = document.querySelector(`.${styles.nameGrid}`);
    if (gridElement && !gridElement.contains(event.target)) {
      resetFocus();
    }
  };

  const handleFocusChange = () => {
    if (!document.activeElement || !document.activeElement.closest(`.${styles.nameGrid}`)) {
      resetFocus();
    }
  };

  const resetFocus = () => {
    setFocusedPosition({ row: -1, col: -1 });
    setIsGridFocused(false);
  };

  onMount(() => {
    window.addEventListener('keydown', gridNavigate);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (isMobile()) {
      disableOverscroll();
    }

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('focusin', handleFocusChange);

    // Set initial focus to the first vowel position
    const firstVowelPosition = findFirstVowelPosition(names);
    setFocus(firstVowelPosition.row, firstVowelPosition.col);
    setIsGridFocused(true);

    // Set audioLoaded to true since Howler handles loading internally
    setAudioLoaded(true);
  });

  onCleanup(() => {
    window.removeEventListener('keydown', gridNavigate);
    window.removeEventListener('resize', checkMobile);

    enableOverscroll();

    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('focusin', handleFocusChange);
    clearTimeout(debounceTimer); // Clear the debounce timer on cleanup
  });

  const handleTouchStart = (event, rowIndex, colIndex) => {
    if (!isMobile()) return;
    event.preventDefault();
    setTouchStartY(event.touches[0].clientY);
    setLastTouchTime(Date.now());
    setFocus(rowIndex, colIndex);
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
      setFocus(rowIndex, colIndex);
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
    const isDarkMode = theme.mode() === 'dark';
    return (
        <img
          src={`/assets/icons/${iconName}.svg`}
          alt={`${iconName} icon`}
          class={`${styles.icon} ${isDarkMode ? styles.iconInverted : ''}`}
        />
    );
  };

  const handleLetterChange = (direction) => {
    // Call the existing letterChange function with the direction
    updateLetterBox(focusedPosition().row, focusedPosition().col, direction);
  };
  const handleClick = (e, rowIndex, colIndex) => {
    setFocus(rowIndex, colIndex);
    // Use querySelector instead of e.currentTarget
    setTimeout(() => {
      const element = document.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex}"]`);
      if (element) {
        element.focus();
        // Add this line to prevent focus from being lost
        element.addEventListener('blur', (event) => event.preventDefault(), { once: true });
      }
    }, 0);
  }

  createEffect(() => {
    if (props.modalClosed) {
      // Set focus to the first vowel position when the modal is closed
      const firstVowelPosition = findFirstVowelPosition(names);
      setFocus(firstVowelPosition.row, firstVowelPosition.col);
      setIsGridFocused(true);
    }
  });

  const gridHeaders = [
    <div class="name-intro">
      <span class="name-left">
        <img id="ficon" src="/assets/icons/arrow-narrow-left.svg" alt="Left arrow" class="icon" />
        <img src="/assets/icons/arrow-narrow-right.svg" alt="Right arrow" class="icon" />
        <img src="/assets/icons/arrow-narrow-up.svg" alt="Up arrow" class="icon" />
        <img src="/assets/icons/arrow-narrow-down.svg" alt="Down arrow" class="icon" />
        <img src="/assets/icons/space.svg" alt="Spacebar" class="icon" />
        <img src="/assets/icons/arrow-back.svg" alt="Return key" class="icon" />
      </span>
      <span class="name-right">Hi. I'm</span>
    </div>,
    <div class="product-intro">
      <span class="product-left">I do</span>
      <span class="product-right">
        <img id="ficon" src="/assets/icons/arrow-narrow-left.svg" alt="Left arrow" class="icon" />
        <img src="/assets/icons/arrow-narrow-right.svg" alt="Right arrow" class="icon" />
        <img src="/assets/icons/arrow-narrow-up.svg" alt="Up arrow" class="icon" />
        <img src="/assets/icons/arrow-narrow-down.svg" alt="Down arrow" class="icon" />
        <img src="/assets/icons/space.svg" alt="Spacebar" class="icon" />
        <img src="/assets/icons/arrow-back.svg" alt="Return key" class="icon" />
      </span>
    </div>,
    <div class="code-intro">
      <span class="code-left"><s class="">design</s> <s class="">management</s> <b class="">stuff.</b></span>
      <span class="code-right"> &nbsp;I also</span>
    </div>
  ];

  return (
    <div class={`${styles.nameGrid} ${props.displayGridHeaders ? styles.nameGridWithHeaders : ''}`}>
      <For each={names}>
        {(name, nameIndex) => (
          <>
            <Show when={props.displayGridHeaders && gridHeaders[nameIndex()]}>
              <div class={styles.jsxElement}>{gridHeaders[nameIndex()]}</div>
            </Show>
            <div
              class={`${styles.nameRow} ${props.displayGridHeaders ? styles.nameRowWithHeaders : ''}`}
              style={{ '--name-length': name.length }}
            >
              <For each={name}>
                {(letterObj, letterIndex) => {
                  const isFocused = createMemo(() => {
                    const focused = isGridFocused() &&
                      nameIndex() === focusedPosition().row &&
                      letterIndex() === focusedPosition().col;

                    return focused;
                  });

                  const letterBoxClass = createMemo(() => {
                    const classes = [styles.letterBox];
                    if (letterObj.isEmpty) {
                      classes.push(styles.emptyBox);
                    } else {
                      if (letterObj.matched) classes.push(styles.matched);
                      if (letterObj.isVowel) classes.push(styles.vowel);
                      if (letterObj.isVowel && letterObj.matched) {
                        classes.push(styles.accentBackground);
                      } else if (letterObj.isVowel && !letterObj.matched) {
                        classes.push(styles.accentOpposite);
                      }
                    }
                    if (isFocused()) {
                      classes.push(styles.focused);
                    }
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
                      tabIndex={0}
                      data-row={nameIndex()}
                      data-col={letterIndex()}
                      onClick={(e) => handleClick(e, nameIndex(), letterIndex())}
                      onTouchStart={(e) => handleTouchStart(e, nameIndex(), letterIndex())}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={(e) => handleTouchEnd(e, nameIndex(), letterIndex())}
                      onFocus={(e) => {
                        setFocusedPosition({ row: nameIndex(), col: letterIndex() });
                        setIsGridFocused(true);
                      }}
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
      <Show when={props.displayGridHeaders}>
        <div class="name-intro">
            <span class="name-left">Lately,</span>
            <span class="name-right">I've been building w/ AI.</span>
        </div>
      </Show>
    </div>
  );
};

export default NameGrid;
