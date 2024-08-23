import { For } from 'solid-js';
import { useTheme } from '../../contexts/ThemeContext';

const themes = [
  'digital-dawn',
  'cyber-punk',
  'retro-wave',
  'sand-martin',
  'rail-pop',
  'charge-back',
  'echo-sphere',
  'urban-pulse',
  'modular-rhythm'
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