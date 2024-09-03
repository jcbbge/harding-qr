import { render, fireEvent, screen } from '@solidjs/testing-library';
import { ThemeProvider } from '../../contexts/ThemeContext';
import NameGrid from './NameGrid';

// Mock the CSS module
jest.mock('./NameGrid.module.css', () => ({
  nameGrid: 'nameGrid',
  letterBox: 'letterBox',
  emptyBox: 'emptyBox',
  focused: 'focused'
}));

// Mock the audio functionality
const mockPlay = jest.fn();
const mockAudio = { play: mockPlay, currentTime: 0 };
global.Audio = jest.fn(() => mockAudio);

describe('NameGrid Component', () => {
  const renderNameGrid = () => {
    return render(() => (
      <ThemeProvider>
        <NameGrid onLetterUnlock={() => {}} />
      </ThemeProvider>
    ));
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

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

    console.log('First non-empty letter box:', firstNonEmptyLetterBox);
    console.log('First non-empty letter box classes:', firstNonEmptyLetterBox?.className);

    letterBoxes.forEach((box, index) => {
      console.log(`Box ${index} classes:`, box.className);
      if (box.classList.contains('focused')) {
        console.log(`Focused box found at index ${index}`);
      }
    });

    expect(firstNonEmptyLetterBox).not.toBeNull();
    expect(firstNonEmptyLetterBox).toHaveClass('focused');

    // Check if the focused box is the first non-empty box
    const focusedBox = Array.from(letterBoxes).find(box => box.classList.contains('focused'));
    const focusedBoxIndex = Array.from(letterBoxes).findIndex(box =>
      box.classList.contains('focused')
    );
    const firstNonEmptyBoxIndex = Array.from(letterBoxes).findIndex(
      box => !box.classList.contains('emptyBox')
    );

    expect(focusedBoxIndex).toBe(firstNonEmptyBoxIndex);
    expect(focusedBox).toBe(firstNonEmptyLetterBox);

    if (focusedBox) {
      console.log('Actually focused box:', focusedBox);
      console.log('Actually focused box classes:', focusedBox.className);
      console.log('Focused box index:', focusedBoxIndex);
      console.log('First non-empty box index:', firstNonEmptyBoxIndex);
    } else {
      console.log('No box is focused');
    }
  });

  // describe('Directional Movement', () => {

  //   const setupGrid = () => {
  //     const { container } = renderNameGrid();
  //     const letterBoxes = container.querySelectorAll('.letterBox:not(.emptyBox)');
  //     return { container, letterBoxes };
  //   };

  //   const testDirectionalMovement = async (key, expectedIndex) => {
  //     const { container, letterBoxes } = setupGrid();
  //     await fireEvent.keyDown(container, { key });
  //     expect(letterBoxes[expectedIndex]).toHaveClass('focused');
  //   };

  // });
});
