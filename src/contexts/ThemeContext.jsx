import { createContext, useContext, createEffect, onCleanup } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Icon } from '../components/util/Icon';

const themes = [
  { name: 'digital-dawn', icon: 'cpu' },
  { name: 'cyber-punk', icon: 'layers-difference' },
  { name: 'retro-wave', icon: 'device-tv-old' },
  { name: 'echo-sphere', icon: 'sphere' },
  { name: 'rail-pop', icon: 'track' },
  { name: 'charge-back', icon: 'recharging' },
  { name: 'urban-pulse', icon: 'building-skyscraper' },
  { name: 'neon-nostalgia', icon: 'brand-apple-arcade' },
  { name: 'pastel-pop', icon: 'lollipop' },
  { name: 'vision-tech', icon: 'device-vision-pro' },
  { name: 'surfside-vibes', icon: 'wave-sine' },
  { name: 'mall-rat', icon: 'shopping-bag' }
];

const ThemeContext = createContext();

export function ThemeProvider(props) {
  const [appearance, setAppearance] = createStore({
    theme: localStorage.getItem('theme') || themes[0].name,
    mode: localStorage.getItem('mode') || 'system',
    background: localStorage.getItem('background') || 'default'
  });

  const updateTheme = newTheme => {
    const themeExists = themes.some(t => t.name === newTheme);
    if (themeExists) {
      setAppearance('theme', newTheme);
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    } else {
      console.warn('Invalid theme:', newTheme);
    }
  };

  const updateMode = newMode => {
    if (['light', 'dark', 'system'].includes(newMode)) {
      setAppearance('mode', newMode);
      localStorage.setItem('mode', newMode);
      updateAppearanceMode(newMode);
    } else {
      console.warn('Invalid mode:', newMode);
    }
  };

  const updateBackground = newBackground => {
    if (['default', 'gradient', 'solid'].includes(newBackground)) {
      setAppearance('background', newBackground);
      localStorage.setItem('background', newBackground);
    } else {
      console.warn('Invalid background:', newBackground);
    }
  };

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
    if (appearance.mode === 'system') {
      document.documentElement.classList.toggle('dark-mode', e.matches);
    }
  };

  createEffect(() => {
    updateAppearanceMode(appearance.mode);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addListener(handleSystemThemeChange);

    onCleanup(() => {
      mediaQuery.removeListener(handleSystemThemeChange);
    });
  });

  const contextValue = {
    appearance,
    updateTheme,
    updateMode,
    updateBackground,
    themes
  };

  return <ThemeContext.Provider value={contextValue}>{props.children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
