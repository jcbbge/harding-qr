import { createContext, createSignal, createEffect, useContext } from 'solid-js';

const ThemeContext = createContext();

export function ThemeProvider(props) {
  const [currentTheme, setCurrentTheme] = createSignal('digital-dawn');
  const [appearanceMode, setAppearanceMode] = createSignal('system');
  const [systemPreference, setSystemPreference] = createSignal(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  const applyThemeAndMode = () => {
    document.body.setAttribute('data-theme', currentTheme());
    
    const effectiveMode = appearanceMode() === 'system' ? systemPreference() : appearanceMode();
    document.body.classList.toggle('dark-mode', effectiveMode === 'dark');
  };

  createEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedMode = localStorage.getItem('appearance-mode');
    
    if (savedTheme) setCurrentTheme(savedTheme);
    if (savedMode) setAppearanceMode(savedMode);

    applyThemeAndMode();
  });

  createEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  });

  createEffect(() => {
    // This effect will run whenever systemPreference or appearanceMode changes
    applyThemeAndMode();
  });

  const toggleAppearanceMode = () => {
    const modes = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(appearanceMode());
    const nextIndex = (currentIndex + 1) % modes.length;
    setAppearanceMode(modes[nextIndex]);
  };

  createEffect(() => {
    localStorage.setItem('theme', currentTheme());
    localStorage.setItem('appearance-mode', appearanceMode());
  });

  const changeTheme = (newTheme) => {
    setCurrentTheme(newTheme);
  };

  const contextValue = {
    currentTheme,
    appearanceMode,
    toggleAppearanceMode,
    changeTheme,
    systemPreference
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}