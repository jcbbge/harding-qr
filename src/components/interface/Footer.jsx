import { createSignal, onMount } from 'solid-js';
import '../../index.css';

const Footer = () => {
  const [currentYear, setCurrentYear] = createSignal('');

  onMount(() => {
    setCurrentYear(new Date().getFullYear().toString());
  });

  return (
    <footer class="footerContainer">
      👨🏾‍💻&nbsp;<a href="https://www.solidjs.com">solid.js</a>&nbsp;site by jrg &copy; {currentYear()}
      . All rights reserved.
    </footer>
  );
};

export default Footer;
