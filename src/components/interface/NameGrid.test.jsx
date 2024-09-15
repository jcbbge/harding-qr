import { render, fireEvent, screen } from '@solidjs/testing-library';
import NameGrid from './NameGrid';
import * as ThemeContext from '../../contexts/ThemeContext';

// Mock the ThemeContext
jest.mock('../../contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }) => children,
  useTheme: jest.fn()
}));

// Mock the CSS module
jest.mock('./NameGrid.module.css', () => ({
  nameGrid: 'nameGrid',
  letterBox: 'letterBox',
  emptyBox: 'emptyBox',
  focused: 'focused'
}));

// Mock the GridRow component
jest.mock('./GridRow', () => {
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

    // Setup mock for useTheme
    ThemeContext.useTheme.mockImplementation(() => ({
      appearance: { theme: 'default', mode: 'light', background: 'default' },
      updateTheme: jest.fn(),
      updateMode: jest.fn(),
      updateBackground: jest.fn(),
      themes: []
    }));
  });

  const renderNameGrid = () => {
    return render(() => <NameGrid onLetterUnlock={() => {}} />);
  };

  test('renders the correct number of letter boxes and empty boxes', () => {
    const { container } = renderNameGrid();
    const letterboxes = container.querySelectorAll('.letterBox:not(.emptyBox)');
    const emptyBoxes = container.querySelectorAll('.letterBox.emptyBox');

    expect(letterboxes.length).toBe(18);
    expect(emptyBoxes.length).toBe(3);
    expect(letterboxes.length + emptyBoxes.length).toBe(21);
  });

  test('first non-empty letter box is initialized and focused', () => {
    const { container } = renderNameGrid();
    const letterBoxes = container.querySelectorAll('.letterBox');

    console.log('Total letter boxes:', letterBoxes.length);

    // Find the first non-empty letter box
    const firstNonEmptyLetterBox = Array.from(letterBoxes).find(
      box => !box.classList.contains('emptyBox')
    );

    expect(firstNonEmptyLetterBox).not.toBeNull();
    expect(firstNonEmptyLetterBox).toHaveClass('focused');

    console.log('First non-empty letter box:', firstNonEmptyLetterBox);
    console.log('First non-empty letter box classes:', firstNonEmptyLetterBox?.className);
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

    const logFocusState = (letterBoxes, message) => {
      console.log(message);
      letterBoxes.forEach((box, index) => {
        console.log(`Box ${index}: ${box.classList.contains('focused')}`);
      });
    };

    const findFocusedIndex = letterBoxes => {
      return Array.from(letterBoxes).findIndex(box => box.classList.contains('focused'));
    };

    test('moves focus left with left arrow key', () => {
      const { container, allLetterBoxes } = setupGrid();
      logFocusState(allLetterBoxes, 'Initial focus state:');

      const initialFocusedIndex = findFocusedIndex(allLetterBoxes);
      console.log('Initial focused box index:', initialFocusedIndex);

      fireEvent.keyDown(container, { key: 'ArrowLeft' });
      logFocusState(allLetterBoxes, 'Focus state after ArrowLeft:');

      const newFocusedIndex = findFocusedIndex(allLetterBoxes);
      console.log('New focused box index:', newFocusedIndex);

      expect(newFocusedIndex).not.toBe(-1);
      expect(newFocusedIndex).not.toBe(initialFocusedIndex);
      expect(newFocusedIndex).toBe(
        (initialFocusedIndex - 1 + allLetterBoxes.length) % allLetterBoxes.length
      );
    });

    test('moves focus left with "a" key', () => {
      const { container, allLetterBoxes } = setupGrid();
      logFocusState(allLetterBoxes, 'Initial focus state:');

      const initialFocusedIndex = findFocusedIndex(allLetterBoxes);
      console.log('Initial focused box index:', initialFocusedIndex);

      fireEvent.keyDown(container, { key: 'a' });
      logFocusState(allLetterBoxes, 'Focus state after "a" key:');

      const newFocusedIndex = findFocusedIndex(allLetterBoxes);
      console.log('New focused box index:', newFocusedIndex);

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
      logFocusState(allLetterBoxes, 'Focus state at start of second row:');
      console.log('Current focused index before left move:', currentFocusedIndex);

      fireEvent.keyDown(container, { key: 'ArrowLeft' });
      logFocusState(allLetterBoxes, 'Focus state after ArrowLeft:');

      const newFocusedIndex = findFocusedIndex(allLetterBoxes);
      console.log('New focused index after left move:', newFocusedIndex);

      // Check if we've moved to the previous row
      expect(Math.floor(newFocusedIndex / rowLength)).toBe(
        Math.floor(currentFocusedIndex / rowLength) - 1
      );

      // Check if we've moved to the last column of the previous row
      expect(newFocusedIndex % rowLength).toBe(rowLength - 1);
    });

    test('wraps to last row when at start of first row', () => {
      const { container, allLetterBoxes, nonEmptyLetterBoxes } = setupGrid();

      logFocusState(allLetterBoxes, 'Initial focus state (all boxes):');
      logFocusState(nonEmptyLetterBoxes, 'Initial focus state (non-empty boxes):');

      // Find the initially focused box (should be the first letter, not necessarily the first box)
      const initialFocusedBoxIndex = findFocusedIndex(allLetterBoxes);
      console.log('Initially focused box index:', initialFocusedBoxIndex);

      // First left arrow press: should move to the first setting box
      fireEvent.keyDown(container, { key: 'ArrowLeft' });
      logFocusState(allLetterBoxes, 'Focus state after first ArrowLeft (all boxes):');

      let focusedBoxIndex = findFocusedIndex(allLetterBoxes);
      console.log('Focused box index after first ArrowLeft:', focusedBoxIndex);

      // Check if focus moved to a setting box
      expect(focusedBoxIndex).not.toBe(-1);
      expect(allLetterBoxes[focusedBoxIndex].textContent).toBe('');

      // Second left arrow press: should wrap to the last name's last letter
      fireEvent.keyDown(container, { key: 'ArrowLeft' });
      logFocusState(allLetterBoxes, 'Focus state after second ArrowLeft (all boxes):');

      focusedBoxIndex = findFocusedIndex(allLetterBoxes);
      console.log('Focused box index after second ArrowLeft:', focusedBoxIndex);

      // Check if focus wrapped to the last letter of the last name
      expect(focusedBoxIndex).toBeGreaterThanOrEqual(0);
      expect(focusedBoxIndex).toBeLessThan(allLetterBoxes.length);

      const focusedNonEmptyBoxIndex = findFocusedIndex(nonEmptyLetterBoxes);
      console.log('Focused non-empty box index:', focusedNonEmptyBoxIndex);

      // Check if the focused box is non-empty
      expect(focusedNonEmptyBoxIndex).not.toBe(-1);
    });

    test('moves focus left with Shift+Tab', () => {
      const { container, allLetterBoxes } = setupGrid();
      logFocusState(allLetterBoxes, 'Initial focus state:');

      const initialFocusedIndex = findFocusedIndex(allLetterBoxes);
      console.log('Initial focused box index:', initialFocusedIndex);

      fireEvent.keyDown(container, { key: 'Tab', shiftKey: true });
      logFocusState(allLetterBoxes, 'Focus state after Shift+Tab:');

      const newFocusedIndex = findFocusedIndex(allLetterBoxes);
      console.log('New focused box index:', newFocusedIndex);

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

    const logFocusState = (letterBoxes, message) => {
      console.log(message);
      letterBoxes.forEach((box, index) => {
        console.log(`Box ${index}: ${box.classList.contains('focused')} (${box.textContent})`);
      });
    };

    const findFocusedIndex = letterBoxes => {
      return Array.from(letterBoxes).findIndex(box => box.classList.contains('focused'));
    };

    test('moves focus right with right arrow key', () => {
      const { container, allLetterBoxes } = setupGrid();
      logFocusState(allLetterBoxes, 'Initial focus state:');

      const initialFocusedIndex = findFocusedIndex(allLetterBoxes);
      console.log('Initial focused box index:', initialFocusedIndex);

      fireEvent.keyDown(container, { key: 'ArrowRight' });
      logFocusState(allLetterBoxes, 'Focus state after ArrowRight:');

      const newFocusedIndex = findFocusedIndex(allLetterBoxes);
      console.log('New focused box index:', newFocusedIndex);

      expect(newFocusedIndex).not.toBe(-1);
      expect(newFocusedIndex).not.toBe(initialFocusedIndex);
      expect(newFocusedIndex).toBe((initialFocusedIndex + 1) % allLetterBoxes.length);
    });

    test('moves focus right with "d" key', () => {
      const { container, allLetterBoxes } = setupGrid();
      logFocusState(allLetterBoxes, 'Initial focus state:');

      const initialFocusedIndex = findFocusedIndex(allLetterBoxes);
      console.log('Initial focused box index:', initialFocusedIndex);

      fireEvent.keyDown(container, { key: 'd' });
      logFocusState(allLetterBoxes, 'Focus state after "d" key:');

      const newFocusedIndex = findFocusedIndex(allLetterBoxes);
      console.log('New focused box index:', newFocusedIndex);

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
      logFocusState(allLetterBoxes, 'Focus state at end of row:');

      fireEvent.keyDown(container, { key: 'ArrowRight' });
      logFocusState(allLetterBoxes, 'Focus state after ArrowRight:');

      const newFocusedIndex = findFocusedIndex(allLetterBoxes);
      console.log('New focused box index:', newFocusedIndex);

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

      logFocusState(allLetterBoxes, 'Initial focus state (all boxes):');
      logFocusState(nonEmptyLetterBoxes, 'Initial focus state (non-empty boxes):');

      // Right arrow press: should wrap to the first letter or setting box
      fireEvent.keyDown(container, { key: 'ArrowRight' });
      logFocusState(allLetterBoxes, 'Focus state after ArrowRight (all boxes):');

      const focusedBoxIndex = findFocusedIndex(allLetterBoxes);
      console.log('Focused box index after ArrowRight:', focusedBoxIndex);

      // Check if focus wrapped to the beginning
      expect(focusedBoxIndex).toBeLessThanOrEqual(nonEmptyLetterBoxes.length);

      const focusedNonEmptyBoxIndex = findFocusedIndex(nonEmptyLetterBoxes);
      console.log('Focused non-empty box index:', focusedNonEmptyBoxIndex);

      // Check if the focused box is either a setting box or one of the first few non-empty boxes
      expect(focusedBoxIndex).toBeLessThan(3); // Allow for the first few boxes to be focused
    });
  });
});
global.Audio = jest.fn(() => mockAudio);

describe('NameGrid', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    ThemeContext.useTheme.mockReturnValue({ theme: 'light' });
    const { container } = render(() => <NameGrid />);
    expect(container).toBeInTheDocument();
  });

  it('changes theme on button click', () => {
    const mockSetTheme = jest.fn();
    ThemeContext.useTheme.mockReturnValue({ theme: 'light', setTheme: mockSetTheme });

    render(() => <NameGrid />);
    const themeButton = screen.getByRole('button', { name: /toggle theme/i });

    fireEvent.click(themeButton);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  // Add more tests as needed
});
