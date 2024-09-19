import { render, fireEvent, screen } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import NameGrid from '../src/components/interface/NameGrid';
import * as ThemeContext from '../src/contexts/ThemeContext';

describe('NameGrid Theme Settings', () => {
  let mockUpdateTheme;

  beforeEach(() => {
    mockUpdateTheme = jest.fn(delta => {
      console.log('mockUpdateTheme called with:', delta);
    });

    const [theme, setTheme] = createSignal('cyber-punk');
    const themeList = [
      { name: 'digital-dawn', icon: 'cpu' },
      { name: 'cyber-punk', icon: 'layers-difference' },
      { name: 'retro-wave', icon: 'device-tv-old' }
    ];

    jest.spyOn(ThemeContext, 'useTheme').mockImplementation(() => [
      {
        theme,
        themeList,
        mode: () => 'light',
        pattern: () => 'wavy',
        modeList: [],
        patternList: []
      },
      {
        updateTheme: delta => {
          mockUpdateTheme(delta);
          const currentIndex = themeList.findIndex(t => t.name === theme());
          const newIndex = (currentIndex + delta + themeList.length) % themeList.length;
          setTheme(themeList[newIndex].name);
          console.log('Theme updated to:', themeList[newIndex].name);
        },
        updateMode: jest.fn(),
        updatePattern: jest.fn(),
        getItemIcon: (type, name) => `${type}-${name}-icon`
      }
    ]);
  });

  test('renders theme setting box with correct initial icon', async () => {
    render(() => <NameGrid onLetterUnlock={() => {}} />);

    const themeBox = screen.getByAltText(/theme-cyber-punk-icon icon/i);
    expect(themeBox).toBeInTheDocument();
  });

  test('updates theme setting with keyboard navigation', async () => {
    const { container } = render(() => <NameGrid onLetterUnlock={() => {}} />);

    const themeBox = container.querySelector('.letterBox.emptyBox');
    expect(themeBox).toBeInTheDocument();

    // Test forward navigation
    fireEvent.keyDown(themeBox, { key: 'Enter' });
    await Promise.resolve();
    expect(mockUpdateTheme).toHaveBeenCalled();
    expect(container.querySelector('.letterBox.emptyBox img')).toHaveAttribute(
      'alt',
      'theme-retro-wave-icon icon'
    );

    // Test backward navigation
    fireEvent.keyDown(themeBox, { key: 'Enter', shiftKey: true });
    await Promise.resolve();
    expect(mockUpdateTheme).toHaveBeenCalled();
    expect(container.querySelector('.letterBox.emptyBox img')).toHaveAttribute(
      'alt',
      'theme-cyber-punk-icon icon'
    );

    // Test spacebar
    fireEvent.keyDown(themeBox, { key: ' ' });
    await Promise.resolve();
    expect(mockUpdateTheme).toHaveBeenCalled();
    expect(container.querySelector('.letterBox.emptyBox img')).toHaveAttribute(
      'alt',
      'theme-retro-wave-icon icon'
    );

    // Test shift + spacebar
    fireEvent.keyDown(themeBox, { key: ' ', shiftKey: true });
    await Promise.resolve();
    expect(mockUpdateTheme).toHaveBeenCalled();
    expect(container.querySelector('.letterBox.emptyBox img')).toHaveAttribute(
      'alt',
      'theme-cyber-punk-icon icon'
    );
  });

  test('cycles through all theme options', async () => {
    const { container } = render(() => <NameGrid onLetterUnlock={() => {}} />);

    const themeBox = container.querySelector('.letterBox.emptyBox');
    expect(themeBox).toBeInTheDocument();

    const themes = ['cyber-punk', 'retro-wave', 'digital-dawn'];

    for (let i = 0; i < themes.length; i++) {
      // Simulate pressing the Return key to cycle through themes
      fireEvent.keyDown(themeBox, { key: 'Enter' });
      await Promise.resolve(); // Wait for any state updates

      const currentThemeIcon = container.querySelector('.letterBox.emptyBox img');
      expect(currentThemeIcon).toHaveAttribute(
        'alt',
        `theme-${themes[(i + 1) % themes.length]}-icon icon`
      );
    }

    expect(mockUpdateTheme).toHaveBeenCalledTimes(themes.length);
  });
});
