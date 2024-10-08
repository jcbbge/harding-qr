import { createSignal, onMount } from 'solid-js';
import { ThemeDisplay } from './ThemeDisplay';
import styles from './Footer.module.css';

const Footer = () => {
  const [currentYear, setCurrentYear] = createSignal('');

  onMount(() => {
    setCurrentYear(new Date().getFullYear().toString());
  });

  return (
    <footer class={styles.footer}>
      <div class={styles.footerMenu}>
        <div class={styles.footerLeft}>
          <ThemeDisplay />
        </div>
        <p class={styles.footerText}>
          <a href="https://www.solidjs.com">solid.js</a> 👨🏾‍💻 site by jrg &copy; {currentYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
