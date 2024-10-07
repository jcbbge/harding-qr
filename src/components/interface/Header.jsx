import styles from './Header.module.css';

const Header = () => {
  return (
    <header class={styles.header}>
      <nav class={styles.navMenu}>
        <div>
          <a href="/" class={styles.navLink}>Home</a>
        </div>
        <div>
          <a href="/scrumble" class={styles.navLink}>!Play Scrumble</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
