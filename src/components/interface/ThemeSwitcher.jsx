import { For } from 'solid-js';
import { useTheme } from '../../contexts/ThemeContext';

const themes = ['digital-dawn', 'cyber-punk', 'retro-wave']; // Add more themes as needed

const ThemeSwitcher = () => {
  const { currentTheme, changeTheme } = useTheme();

  return (
    <select value={currentTheme()} onChange={(e) => changeTheme(e.target.value)}>
      <For each={themes}>
        {(theme) => <option value={theme}>{theme}</option>}
      </For>
    </select>
  );
};

export default ThemeSwitcher;