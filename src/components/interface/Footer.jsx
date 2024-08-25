import { createSignal, onMount } from 'solid-js';
import styles from './Footer.module.css';

const Footer = () => {
    const [currentYear, setCurrentYear] = createSignal('');

    onMount(() => {
        setCurrentYear(new Date().getFullYear().toString());
    });

    return (
        <footer class={styles.footer}>
            <div class={styles.gameDetails}>
                {/* Add game details here */}
            </div>
            <div class={styles.copyright}>
                © {currentYear()} Your Name. All rights reserved.
            </div>
            <div class={styles.devWatermark}>
                👨🏾‍💻 by josh w/ <a href="https://www.solidjs.com">Solid.js</a>
            </div>
        </footer>
    );
};


export default Footer;