import { createContext, useContext, createSignal } from 'solid-js';
import {
  Cpu,
  Rocket,
  Waves,
  ShoppingCart,
  Buildings,
  GameController,
  Faders,
  Television,
  Train,
  Lightning,
  FloppyDisk,
  Eye
} from 'phosphor-solid';

const themes = [
  { name: 'digital-dawn', icon: Cpu },
  { name: 'cyber-punk', icon: Faders },
  { name: 'retro-wave', icon: Television },
  { name: 'echo-sphere', icon: Rocket },
  { name: 'rail-pop', icon: Train },
  { name: 'charge-back', icon: Lightning },
  { name: 'urban-pulse', icon: Buildings },
  { name: 'neon-nostalgia', icon: GameController },
  { name: 'pastel-pop', icon: FloppyDisk },
  { name: 'vision-tech', icon: Eye },
  { name: 'surfside-vibes', icon: Waves },
  { name: 'mall-rat', icon: ShoppingCart }
];

const ThemeContext = createContext();

export function ThemeProvider(props) {
  const [theme, setTheme] = createSignal(themes[0].name);

  const changeTheme = newTheme => {
    const themeExists = themes.some(t => t.name === newTheme);
    if (themeExists) {
      setTheme(newTheme);
    } else {
      console.warn('Invalid theme:', newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, themes }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
