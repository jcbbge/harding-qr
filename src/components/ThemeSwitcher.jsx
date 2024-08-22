import { createSignal, createEffect } from "solid-js";

const ThemeSwitcher = () => {
  const [isDarkMode, setIsDarkMode] = createSignal(false);
  const [currentTheme, setCurrentTheme] = createSignal('digital-dawn');

  createEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedMode = localStorage.getItem('darkMode');
    
    if (savedTheme) setCurrentTheme(savedTheme);
    if (savedMode) setIsDarkMode(savedMode === 'true');

    // Check system preference if no saved preference
    if (!savedMode) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }

    applyTheme();
  });

  const applyTheme = () => {
    document.body.classList.toggle('dark-mode', isDarkMode());
    document.body.setAttribute('data-theme', currentTheme());
    localStorage.setItem('theme', currentTheme());
    localStorage.setItem('darkMode', isDarkMode().toString());
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode());
    applyTheme();
  };

  const changeTheme = (event) => {
    setCurrentTheme(event.target.value);
    applyTheme();
  };

  return (
    <div class="theme-switcher">
      <button onClick={toggleDarkMode}>
        {isDarkMode() ? '☀️' : '🌙'}
      </button>
      <select value={currentTheme()} onChange={changeTheme}>
        <option value="digital-dawn">Digital Dawn</option>
        {/* Add more theme options here */}
      </select>
    </div>
  );
};

export default ThemeSwitcher;