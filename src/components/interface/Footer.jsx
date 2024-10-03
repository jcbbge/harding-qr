import { createSignal, onMount } from 'solid-js';
import { ThemeDisplay } from './ThemeDisplay';

const Footer = () => {
  const [currentYear, setCurrentYear] = createSignal('');

  onMount(() => {
    setCurrentYear(new Date().getFullYear().toString());
  });

  return (
    <footer class="bg-accent-fun">
      <ThemeDisplay></ThemeDisplay>
      <span>
        👨🏾‍💻&nbsp;<a href="https://www.solidjs.com">solid.js</a>&nbsp;site by jrg &copy; {currentYear()} &nbsp; All rights reserved.
      </span>
    </footer>
  );
};

export default Footer;
