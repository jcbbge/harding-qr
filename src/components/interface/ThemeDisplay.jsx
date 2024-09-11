import { useTheme } from '../../contexts/ThemeContext';
import styles from './ThemeDisplay.module.css';
import { createEffect, createSignal } from 'solid-js';

// Import SVG icons
import { default as MoonStarsIcon } from '/src/assets/icons/moon-stars.svg?component';
import { default as RadarIcon } from '/src/assets/icons/radar-2.svg?component';
import { default as WaveSineIcon } from '/src/assets/icons/wave-sine.svg?component';
// Import other icons as needed

const iconComponents = {
  'moon-stars': MoonStarsIcon,
  'radar-2': RadarIcon,
  'wave-sine': WaveSineIcon
};

export function ThemeDisplay() {
  const [theme, { getItemIcon }] = useTheme();

  const getIconImg = iconName => {
    const [error, setError] = createSignal(false);

    return (
      <>
        <img
          src={`/src/assets/icons/${iconName}.svg`}
          alt={`${iconName} icon`}
          class={styles.icon}
          onError={() => setError(true)}
          style={{ display: error() ? 'none' : 'inline' }}
        />
        {error() && <span class={styles.iconFallback}>{iconName.charAt(0).toUpperCase()}</span>}
      </>
    );
  };

  const logAndRenderIcon = (type, name) => {
    const iconName = getItemIcon(type, name());
    return getIconImg(iconName);
  };

  return (
    <div class={styles.themeDisplay}>
      <p>
        {logAndRenderIcon('theme', theme.theme)}
        Current Theme: {theme.theme()}
      </p>
      <p>
        {logAndRenderIcon('mode', theme.mode)}
        Current Mode: {theme.mode()}
      </p>
      <p>
        {logAndRenderIcon('pattern', theme.pattern)}
        Current Pattern: {theme.pattern()}
      </p>
    </div>
  );
}
