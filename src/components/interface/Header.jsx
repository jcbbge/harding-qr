import styles from './Header.module.css';
import { useTheme } from '../../contexts/ThemeContext';
  
  const Header = () => {
  const [theme] = useTheme();
    const isDarkMode = theme.mode() === 'dark';
  return (
    <header class={styles.header}>
        <nav class={styles.navMenu}>
          <div class={styles.navLeft}>
            <span class={styles.navLink}>
              <a href="/">
                <img
                  src={`/assets/icons/home.svg`}
                  alt={`home icon`}
                  class={`${styles.icon} ${isDarkMode ? styles.iconInverted : ''}`}
                />
                <span class={styles.themeText}>Home</span>
              </a>
            </span>
          </div>

          <div class={styles.navRight}>
            <span class={styles.navLink}>
              <a href="/scrumble">
                <img
                  src={`/assets/icons/brand-apple-arcade.svg`}
                  alt={`home icon`}
                  class={`${styles.icon} ${isDarkMode ? styles.iconInverted : ''}`}
                />
                <span class={styles.themeText}>Scrumble</span>
              </a>
            </span>
          </div>
        </nav>
    </header>
  );
};

export default Header;
