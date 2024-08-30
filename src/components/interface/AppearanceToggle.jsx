import { createMemo } from 'solid-js';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './AppearanceToggle.module.css';

const AppearanceToggle = () => {
  const { appearanceMode, toggleAppearanceMode } = useTheme();

  const displayText = createMemo(() => {
    switch (appearanceMode()) {
      case 'light':
        return '☀️ Light';
      case 'dark':
        return '🌙 Dark';
      case 'system':
        return '🖥️ System';
      default:
        return 'Unknown';
    }
  });

  return (
    <button class={styles.appearanceToggle} onClick={toggleAppearanceMode}>
      {displayText()}
    </button>
  );
};

export default AppearanceToggle;
