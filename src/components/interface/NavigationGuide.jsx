import { For } from 'solid-js';
import styles from './NavigationGuide.module.css';

const navigationRules = [
  { key: '←→↑↓', description: 'Move focus' },
  { key: 'Tab / Shift+Tab', description: 'Move focus (wraps around)' },
  { key: 'Space / Enter', description: 'Change letter / setting' },
  { key: 'Shift + Space / Enter', description: 'Change letter / setting (reverse)' }
];

const NavigationGuide = () => {
  return (
    <div class={styles.guideContainer}>
      <h3 class={styles.guideTitle}>Keyboard Navigation Guide</h3>
      <ul class={styles.guideList}>
        <For each={navigationRules}>
          {rule => (
            <li class={styles.guideItem}>
              <span class={styles.guideKey}>{rule.key}</span>
              <span class={styles.guideDescription}>{rule.description}</span>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};

export default NavigationGuide;
