import { useTheme } from '../../contexts/ThemeContext';
import styles from './ThemeDisplay.module.css';

export function ThemeDisplay() {
  const [theme, { getItemIcon }] = useTheme();

  const getIconImg = (iconName) => {
    return (
      <img
        src={`/assets/icons/${iconName}.svg`}
        alt={`${iconName} icon`}
        class={styles.icon}
      />
    );
  };

  const renderThemeItem = (type) => {
    const iconName = getItemIcon(type, theme[type]());
    return (
      <span class={styles.themeItem}>
        {getIconImg(iconName)}
        <span class={styles.themeText}>{theme[type]()}</span>
      </span>
    );
  };

  return (
    <div class={styles.themeDisplay}>
      {renderThemeItem('theme')}
      {renderThemeItem('mode')}
      {renderThemeItem('pattern')}
    </div>
  );
}
