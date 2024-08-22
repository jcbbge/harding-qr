import { createContext, createSignal, createEffect, useContext } from 'solid-js';

const ThemeContext = createContext();

export function ThemeProvider(props) {
  const [currentTheme, setCurrentTheme] = createSignal('digital-dawn');
  const [appearanceMode, setAppearanceMode] = createSignal('system');

  createEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedMode = localStorage.getItem('appearance-mode');
    
    if (savedTheme) setCurrentTheme(savedTheme);
    if (savedMode) setAppearanceMode(savedMode);

    applyThemeAndMode();
  });

  const applyThemeAndMode = () => {
    document.body.setAttribute('data-theme', currentTheme());
    
    if (appearanceMode() === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.toggle('dark-mode', prefersDark);
    } else {
      document.body.classList.toggle('dark-mode', appearanceMode() === 'dark');
    }

    localStorage.setItem('theme', currentTheme());
    localStorage.setItem('appearance-mode', appearanceMode());
  };

  const toggleAppearanceMode = () => {
    const modes = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(appearanceMode());
    const nextIndex = (currentIndex + 1) % modes.length;
    setAppearanceMode(modes[nextIndex]);
    applyThemeAndMode();
  };

  const changeTheme = (newTheme) => {
    setCurrentTheme(newTheme);
    applyThemeAndMode();
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, appearanceMode, toggleAppearanceMode, changeTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}