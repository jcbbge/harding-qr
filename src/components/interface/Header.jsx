import styles from './Header.module.css';

const Header = () => {
  return (
    <header class={styles.header}>
      <nav class={styles.navMenu}>
        <div class={styles.navLeft}>
          <span class={styles.navLink}>
            <a href="/">
              <svg class={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
              </svg>
              <span class={styles.hideOnMobile}>Home</span>
            </a>
          </span>
        </div>

        <div class={styles.navRight}>
          <span class={styles.navLink}>
            <a href="/scrumble">
              <svg class={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M20 12.5v4.75a.734 .734 0 0 1 -.055 .325a.704 .704 0 0 1 -.348 .366l-5.462 2.58a5 5 0 0 1 -4.27 0l-5.462 -2.58a.705 .705 0 0 1 -.401 -.691l0 -4.75" />
                <path d="M4.431 12.216l5.634 -2.332a5.065 5.065 0 0 1 3.87 0l5.634 2.332a.692 .692 0 0 1 .028 1.269l-5.462 2.543a5.064 5.064 0 0 1 -4.27 0l-5.462 -2.543a.691 .691 0 0 1 .028 -1.27z" />
                <path d="M12 7l0 6" />
              </svg>
              <span class={`${styles.themeText} ${styles.hideOnMobile}`}>Scrumble</span>
            </a>
          </span>
        </div>
      </nav>
    </header>
  );
};

export default Header;
