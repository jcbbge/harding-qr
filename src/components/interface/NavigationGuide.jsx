import { For } from 'solid-js';
import styles from './NavigationGuide.module.css';

const navigationKeys = ['Tab', 'Shift+Tab', 'Space', 'Enter'];
const modificationKeys = ['Space', 'Enter', 'Shift + Space', 'Shift + Enter'];

const Kbd = props => <kbd class={styles.kbd}>{props.children}</kbd>;

const WASDLayout = () => (
  <div class={styles.wasdGrid}>
    <div class={styles.topKey}>
      <Kbd>W</Kbd>
    </div>
    <Kbd>A</Kbd>
    <Kbd>S</Kbd>
    <Kbd>D</Kbd>
  </div>
);

const ArrowLayout = () => (
  <div class={styles.arrowGrid}>
    <div class={styles.topKey}>
      <Kbd>↑</Kbd>
    </div>
    <Kbd>←</Kbd>
    <Kbd>↓</Kbd>
    <Kbd>→</Kbd>
  </div>
);

const NavigationGuide = () => {
  return (
    <>
      <h3>Help Menu</h3>
      <section class={styles.section}>
        <p class={styles.sectionTitle}>Keyboard Navigation</p>
        <div class={styles.keyLayouts}>
          <div>
            <WASDLayout />
          </div>
          <div>
            <ArrowLayout />
          </div>
        </div>
        <div class={styles.keyColumns}>
          <div class={styles.keyColumn}>
            <For each={navigationKeys.slice(0, 2)}>{key => <Kbd>{key}</Kbd>}</For>
          </div>
          <div class={styles.keyColumn}>
            <For each={navigationKeys.slice(2)}>{key => <Kbd>{key}</Kbd>}</For>
          </div>
        </div>
      </section>

      <section class={styles.section}>
        <h3 class={styles.sectionTitle}>Character Adjustment</h3>
        <div class={styles.keyColumns}>
          <div class={styles.keyColumn}>
            <For each={modificationKeys.slice(0, 2)}>{key => <Kbd>{key}</Kbd>}</For>
          </div>
          <div class={styles.keyColumn}>
            <For each={modificationKeys.slice(2)}>{key => <Kbd>{key}</Kbd>}</For>
          </div>
        </div>
      </section>
    </>
  );
};

export default NavigationGuide;
