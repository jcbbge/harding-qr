import { For } from 'solid-js';
import { useTheme } from '../../contexts/ThemeContext';

const themes = [
  'digital-dawn',
  'cyber-punk',
  'retro-wave',
  'echo-sphere',
  'rail-pop',
  'charge-back',
  'urban-pulse',
];

const ThemeSwitcher = () => {
  const { currentTheme, changeTheme } = useTheme();

  return (
    <select value={currentTheme()} onChange={(e) => changeTheme(e.target.value)}>
      <For each={themes}>
        {(theme) => <option value={theme}>{theme.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>}
      </For>
    </select>
  );
};

export default ThemeSwitcher;