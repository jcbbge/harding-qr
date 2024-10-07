import { createSignal, createContext, useContext, createEffect, onCleanup } from 'solid-js';

const themeList = [
  { name: 'digital-dawn', icon: 'cpu' },
  { name: 'cyber-punk', icon: 'layers-difference' },
  { name: 'retro-wave', icon: 'device-tv-old' },
  { name: 'rail-pop', icon: 'track' },
  { name: 'charge-back', icon: 'recharging' },
  { name: 'urban-pulse', icon: 'building-skyscraper' },
  { name: 'neon-nostalgia', icon: 'brand-apple-arcade' },
  { name: 'pastel-pop', icon: 'lollipop' },
  { name: 'vision-tech', icon: 'device-vision-pro' },
  { name: 'surfside-vibes', icon: 'wave-sine' },
  { name: 'mall-rat', icon: 'shopping-bag' },
  { name: 'byte-blitz', icon: 'components' }
];

const modeList = [
  { name: 'light', icon: 'sun' },
  { name: 'dark', icon: 'moon-stars' },
  { name: 'system', icon: 'sun-moon' }
];

const patternList = [
  { name: 'zigzag', class: 'bg-zigzag', icon: 'timeline' },
  { name: 'cross', class: 'bg-cross', icon: 'plus' },
  { name: 'rectangles', class: 'bg-rectangles', icon: 'square' },
  { name: 'boxes', class: 'bg-boxes', icon: 'grid-3x3' },
  { name: 'polka', class: 'bg-polka', icon: 'grid-dots' }
  // { name: 'coffee', class: 'bg-coffee', icon: 'coffee' },
  // { name: 'polaroid', class: 'bg-polaroid', icon: 'camera' },
  // { name: 'icecream', class: 'bg-icecream', icon: 'ice-cream' }
];

const ThemeContext = createContext();

export function ThemeProvider(props) {
  const initialTheme = localStorage.getItem('theme') || themeList[0].name;

  const [theme, setTheme] = createSignal(initialTheme);
  const [mode, setMode] = createSignal(localStorage.getItem('mode') || 'system');
  const [pattern, setPattern] = createSignal(
    localStorage.getItem('pattern') || patternList[0].name
  );

  const getItemIcon = (type, name) => {
    let list;
    switch (type) {
      case 'theme':
        list = themeList;
        break;
      case 'mode':
        list = modeList;
        break;
      case 'pattern':
        list = patternList;
        break;
      default:
        return '';
    }
    const item = list.find(item => item.name === name);
    return item ? item.icon : '';
  };

  const themeContext = [
    { theme, mode, pattern, themeList, modeList, patternList },
    {
      updateTheme(delta, forcedTheme = null) {
        if (forcedTheme) {
          setTheme(forcedTheme);
        } else {
          const currentIndex = themeList.findIndex(t => t.name === theme());
          if (currentIndex === -1) {
            console.warn('Current theme not found in themeList. Resetting to first theme.');
            setTheme(themeList[0].name);
            return;
          }
          const newIndex = (currentIndex + delta + themeList.length) % themeList.length;
          const newTheme = themeList[newIndex].name;
          setTheme(newTheme);
        }
        const updatedTheme = theme();
        localStorage.setItem('theme', updatedTheme);
        document.documentElement.setAttribute('data-theme', updatedTheme);
      },
      updateMode(delta) {
        const modes = ['light', 'dark', 'system'];
        const currentIndex = modes.indexOf(mode());
        const newIndex = (currentIndex + delta + modes.length) % modes.length;
        const newMode = modes[newIndex];
        setMode(newMode);
        localStorage.setItem('mode', newMode);
        updateAppearanceMode(newMode);
      },
      updatePattern(delta) {
        const currentIndex = patternList.findIndex(p => p.name === pattern());
        const newIndex = (currentIndex + delta + patternList.length) % patternList.length;
        const newPattern = patternList[newIndex].name;
        setPattern(newPattern);
        localStorage.setItem('pattern', newPattern);
      },
      getItemIcon // Add this new function to the context
    }
  ];

  const updateAppearanceMode = mode => {
    if (mode === 'system') {
      const isDarkMode = window.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : false;
      document.documentElement.classList.toggle('dark-mode', isDarkMode);
    } else {
      document.documentElement.classList.toggle('dark-mode', mode === 'dark');
    }
  };

  const handleSystemThemeChange = e => {
    if (mode() === 'system') {
      document.documentElement.classList.toggle('dark-mode', e.matches);
    }
  };

  createEffect(() => {
    if (theme()) {
      themeContext[1].updateTheme(0); // This will trigger the updateTheme function without changing the theme
    } else {
      console.warn('Theme is undefined. Setting to default theme.');
      setTheme(themeList[0].name);
    }
    updateAppearanceMode(mode());
    themeContext[1].updatePattern(0);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addListener(handleSystemThemeChange);

    onCleanup(() => {
      mediaQuery.removeListener(handleSystemThemeChange);
    });
  });

  return <ThemeContext.Provider value={themeContext}>{props.children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
