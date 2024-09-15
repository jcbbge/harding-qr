import { createEffect } from 'solid-js';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './BackgroundPattern.module.css';

const BackgroundPattern = () => {
  const [themeState] = useTheme();

  createEffect(() => {
    const patternLayer = document.querySelector('.pattern-layer');

    if (patternLayer && themeState.pattern) {
      const currentPattern = themeState.patternList.find(p => p.name === themeState.pattern());
      if (currentPattern) {
        // Remove all existing pattern classes
        patternLayer.classList.forEach(className => {
          if (className.startsWith('bg-')) {
            patternLayer.classList.remove(className);
          }
        });
        // Add the new pattern class
        patternLayer.classList.add(currentPattern.class);
      }
    } else {
      console.warn('Pattern layer not found or theme state is missing pattern information');
    }
  });

  return null; // This component doesn't render anything visible
};

export default BackgroundPattern;
