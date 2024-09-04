import { createEffect } from 'solid-js';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './BackgroundPattern.module.css';

const BackgroundPattern = () => {
  const { appearance, patterns } = useTheme();

  createEffect(() => {
    if (patterns && appearance.pattern) {
      const currentPattern = patterns.find(p => p.name === appearance.pattern);
      if (currentPattern) {
        document.body.className = currentPattern.cssClass;
      }
    }
  });

  return (
    <div
      class={styles.backgroundOverlay}
      style={{ 'pointer-events': 'none' }}
    />
  );
};

export default BackgroundPattern;
