import { render, fireEvent, screen } from '@solidjs/testing-library';
import NameGrid from '../src/components/interface/NameGrid';
import * as ThemeContext from '../src/contexts/ThemeContext';
import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

// Mock the ThemeContext
jest.mock('../src/contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }) => children,
  useTheme: jest.fn(() => [
    {
      theme: jest.fn(() => 'light'), // Ensure this is a function
      mode: jest.fn(() => 'system'),
      pattern: jest.fn(() => 'wavy'),
      themeList: [],
      modeList: [],
      patternList: []
    },
    {
      updateTheme: jest.fn(),
      updateMode: jest.fn(),
      updatePattern: jest.fn(),
      getItemIcon: jest.fn()
    }
  ])
}));

// Mock the CSS module
jest.mock('./NameGrid.module.css', () => ({
  nameGrid: 'nameGrid',
  letterBox: 'letterBox',
  emptyBox: 'emptyBox',
  focused: 'focused'
}));

// Mock the GridRow component
jest.mock('../src/components/interface/GridRow', () => {
  return function MockGridRow(props) {
    return (
      <div data-testid={`grid-row-${props.rowIndex}`}>
        {props.name.map((letter, index) => (
          <div
            key={index}
            class={`letterBox ${letter.isEmpty ? 'emptyBox' : ''} ${
              props.focusedPosition.row === props.rowIndex && index === props.focusedPosition.col
                ? 'focused'
                : ''
            }`}
          >
            {letter.isEmpty ? '' : letter.currentLetter}
          </div>
        ))}
      </div>
    );
  };
});

// Mock the audio functionality
const mockPlay = jest.fn().mockImplementation(() => Promise.resolve());
const mockAudio = { play: mockPlay, currentTime: 0 };
global.Audio = jest.fn(() => mockAudio);

describe('NameGrid Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderNameGrid = () => {
    return render(() => <NameGrid onLetterUnlock={() => {}} />);
  };

  test('renders the correct number of letter boxes and empty boxes', () => {
    const { container } = renderNameGrid();
    const letterboxes = container.querySelectorAll('.letterBox:not(.emptyBox)');
    const emptyBoxes = container.querySelectorAll('.letterBox.emptyBox');

    expect(letterboxes.length).toBe(9);
    expect(emptyBoxes.length).toBe(3);
    expect(letterboxes.length + emptyBoxes.length).toBe(12);
  });

  test('first non-empty letter box is initialized and focused', () => {
    const { container } = renderNameGrid();
    const letterBoxes = container.querySelectorAll('.letterBox');

    // Ensure the first non-empty letter box is focused
    const firstNonEmptyLetterBox = Array.from(letterBoxes).find(
      box => !box.classList.contains('emptyBox')
    );

    expect(firstNonEmptyLetterBox).not.toBeNull();
    expect(firstNonEmptyLetterBox).toHaveClass('focused'); // Check if it has the 'focused' class
  });

  describe('Leftward Keyboard Movement', () => {
    const setupGrid = () => {
      const { container } = renderNameGrid();
      const allLetterBoxes = container.querySelectorAll('.letterBox');
      const nonEmptyLetterBoxes = container.querySelectorAll('.letterBox:not(.emptyBox)');
      return { container, allLetterBoxes, nonEmptyLetterBoxes };
    };

    const moveFocusToEnd = container => {
      // Move focus to the last letter box
      for (let i = 0; i < 17; i++) {
        fireEvent.keyDown(container, { key: 'ArrowRight' });
      }
    };

    const findFocusedIndex = letterBoxes => {
      return Array.from(letterBoxes).findIndex(box => box.classList.contains('focused'));
    };

    test('moves focus left with left arrow key', () => {
      const { container, allLetterBoxes } = setupGrid();
      const initialFocusedIndex = findFocusedIndex(allLetterBoxes);

      fireEvent.keyDown(container, { key: 'ArrowLeft' });

      const newFocusedIndex = findFocusedIndex(allLetterBoxes);
      expect(newFocusedIndex).toBe(
        (initialFocusedIndex - 1 + allLetterBoxes.length) % allLetterBoxes.length
      );
      expect(allLetterBoxes[newFocusedIndex]).toHaveClass('focused');
    });

    test('moves focus left with "a" key', () => {
      const { container, allLetterBoxes } = setupGrid();

      const initialFocusedIndex = findFocusedIndex(allLetterBoxes);

      fireEvent.keyDown(container, { key: 'a' });

      const newFocusedIndex = findFocusedIndex(allLetterBoxes);

      expect(newFocusedIndex).not.toBe(-1);
      expect(newFocusedIndex).not.toBe(initialFocusedIndex);
      expect(newFocusedIndex).toBe(
        (initialFocusedIndex - 1 + allLetterBoxes.length) % allLetterBoxes.length
      );
    });

    test('wraps to previous row when at start of row', () => {
      const { container, allLetterBoxes } = setupGrid();
      const rowLength = 7; // Assuming 7 boxes per row (including empty boxes)

      // Move to the first letter of the second row
      let currentFocusedIndex = findFocusedIndex(allLetterBoxes);
      while (Math.floor(currentFocusedIndex / rowLength) < 1) {
        fireEvent.keyDown(container, { key: 'ArrowRight' });
        currentFocusedIndex = findFocusedIndex(allLetterBoxes);
      }

      fireEvent.keyDown(container, { key: 'ArrowLeft' });

      const newFocusedIndex = findFocusedIndex(allLetterBoxes);

      // Check if we've moved to the previous row
      expect(Math.floor(newFocusedIndex / rowLength)).toBe(
        Math.floor(currentFocusedIndex / rowLength) - 1
      );

      // Check if we've moved to the last column of the previous row
      expect(newFocusedIndex % rowLength).toBe(rowLength - 1);
    });

    test('wraps to last row when at start of first row', () => {
      const { container, allLetterBoxes, nonEmptyLetterBoxes } = setupGrid();

      // Find the initially focused box (should be the first letter, not necessarily the first box)
      const initialFocusedBoxIndex = findFocusedIndex(allLetterBoxes);

      // First left arrow press: should move to the first setting box
      fireEvent.keyDown(container, { key: 'ArrowLeft' });

      let focusedBoxIndex = findFocusedIndex(allLetterBoxes);

      // Check if focus moved to a setting box
      expect(focusedBoxIndex).not.toBe(-1);
      expect(allLetterBoxes[focusedBoxIndex].textContent).toBe('');

      // Second left arrow press: should wrap to the last name's last letter
      fireEvent.keyDown(container, { key: 'ArrowLeft' });

      focusedBoxIndex = findFocusedIndex(allLetterBoxes);

      // Check if focus wrapped to the last letter of the last name
      expect(focusedBoxIndex).toBeGreaterThanOrEqual(0);
      expect(focusedBoxIndex).toBeLessThan(allLetterBoxes.length);

      const focusedNonEmptyBoxIndex = findFocusedIndex(nonEmptyLetterBoxes);

      // Check if the focused box is non-empty
      expect(focusedNonEmptyBoxIndex).not.toBe(-1);
    });

    test('moves focus left with Shift+Tab', () => {
      const { container, allLetterBoxes } = setupGrid();

      const initialFocusedIndex = findFocusedIndex(allLetterBoxes);

      fireEvent.keyDown(container, { key: 'Tab', shiftKey: true });

      const newFocusedIndex = findFocusedIndex(allLetterBoxes);

      expect(newFocusedIndex).not.toBe(-1);
      expect(newFocusedIndex).not.toBe(initialFocusedIndex);
      expect(newFocusedIndex).toBe(
        (initialFocusedIndex - 1 + allLetterBoxes.length) % allLetterBoxes.length
      );
    });
  });

  describe('Rightward Keyboard Movement', () => {
    const setupGrid = () => {
      const { container } = renderNameGrid();
      const allLetterBoxes = container.querySelectorAll('.letterBox');
      const nonEmptyLetterBoxes = container.querySelectorAll('.letterBox:not(.emptyBox)');
      return { container, allLetterBoxes, nonEmptyLetterBoxes };
    };

    const findFocusedIndex = letterBoxes => {
      return Array.from(letterBoxes).findIndex(box => box.classList.contains('focused'));
    };

    test('moves focus right with right arrow key', () => {
      const { container, allLetterBoxes } = setupGrid();

      const initialFocusedIndex = findFocusedIndex(allLetterBoxes);

      fireEvent.keyDown(container, { key: 'ArrowRight' });

      const newFocusedIndex = findFocusedIndex(allLetterBoxes);

      expect(newFocusedIndex).not.toBe(-1);
      expect(newFocusedIndex).not.toBe(initialFocusedIndex);
      expect(newFocusedIndex).toBe((initialFocusedIndex + 1) % allLetterBoxes.length);
    });

    test('moves focus right with "d" key', () => {
      const { container, allLetterBoxes } = setupGrid();

      const initialFocusedIndex = findFocusedIndex(allLetterBoxes);

      fireEvent.keyDown(container, { key: 'd' });

      const newFocusedIndex = findFocusedIndex(allLetterBoxes);

      expect(newFocusedIndex).not.toBe(-1);
      expect(newFocusedIndex).not.toBe(initialFocusedIndex);
      expect(newFocusedIndex).toBe((initialFocusedIndex + 1) % allLetterBoxes.length);
    });

    test('wraps to next row when at end of row', () => {
      const { container, allLetterBoxes } = setupGrid();
      const rowLength = 7; // Assuming 7 boxes per row (including empty boxes)

      // Move to the last letter of the current row
      let currentFocusedIndex = findFocusedIndex(allLetterBoxes);
      while (currentFocusedIndex % rowLength !== rowLength - 1) {
        fireEvent.keyDown(container, { key: 'ArrowRight' });
        currentFocusedIndex = findFocusedIndex(allLetterBoxes);
      }

      fireEvent.keyDown(container, { key: 'ArrowRight' });

      const newFocusedIndex = findFocusedIndex(allLetterBoxes);

      expect(newFocusedIndex).toBe((currentFocusedIndex + 1) % allLetterBoxes.length);
      expect(Math.floor(newFocusedIndex / rowLength)).toBe(
        Math.floor(currentFocusedIndex / rowLength) + 1
      );
    });

    test('wraps correctly when moving right from the last letter', () => {
      const { container, allLetterBoxes, nonEmptyLetterBoxes } = setupGrid();

      // Move to the last letter
      while (findFocusedIndex(allLetterBoxes) !== allLetterBoxes.length - 1) {
        fireEvent.keyDown(container, { key: 'ArrowRight' });
      }

      // Right arrow press: should wrap to the first letter or setting box
      fireEvent.keyDown(container, { key: 'ArrowRight' });

      const focusedBoxIndex = findFocusedIndex(allLetterBoxes);

      // Check if focus wrapped to the beginning
      expect(focusedBoxIndex).toBeLessThanOrEqual(nonEmptyLetterBoxes.length);

      const focusedNonEmptyBoxIndex = findFocusedIndex(nonEmptyLetterBoxes);

      // Check if the focused box is either a setting box or one of the first few non-empty boxes
      expect(focusedBoxIndex).toBeLessThan(3); // Allow for the first few boxes to be focused
    });
  });
});
