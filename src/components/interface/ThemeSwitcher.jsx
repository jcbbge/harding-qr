import { For } from 'solid-js';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeSwitcher = () => {
  const { theme, changeTheme, themes } = useTheme();

  return (
    <select value={theme()} onChange={e => changeTheme(e.target.value)}>
      <For each={themes}>
        {themeObj => (
          <option value={themeObj.name}>
            {themeObj.name
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </option>
        )}
      </For>
    </select>
  );
};

export default ThemeSwitcher;
