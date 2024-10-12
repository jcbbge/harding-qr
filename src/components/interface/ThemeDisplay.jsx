import { useTheme } from '../../contexts/ThemeContext';
import styles from './ThemeDisplay.module.css';

export function ThemeDisplay() {
  const [theme, { getItemIcon }] = useTheme();

  const getIconImg = (iconName) => {
    const isDarkMode = theme.mode() === 'dark';
    return (
      <img
        src={`/assets/icons/${iconName}.svg`}
        alt={`${iconName} icon`}
        class={`${styles.icon} ${isDarkMode ? styles.iconInverted : ''}`}
      />
    );
  };

  const renderThemeItem = (type, index) => {
    const iconName = getItemIcon(type, theme[type]());
    return (
      <div class={`${styles.themeItemContainer} ${index !== 0 ? styles.borderLeft : ''}`}>
        <span class={styles.themeItem}>
          {getIconImg(iconName)}
          <span class={styles.themeText}>{theme[type]()}</span>
        </span>
      </div>
    );
  };

  return (
    <div class={styles.themeDisplay}>
      {renderThemeItem('theme', 0)}
      {renderThemeItem('mode', 1)}
      {renderThemeItem('pattern', 2)}
    </div>
  );
}
