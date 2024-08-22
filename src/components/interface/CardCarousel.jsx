import { createSignal, createEffect, For } from 'solid-js';
import styles from './CardCarousel.module.css';

const CardCarousel = (props) => {
  const [activeCardIndex, setActiveCardIndex] = createSignal(0);

  createEffect(() => {
    // Update active card based on letter unlocks
    setActiveCardIndex(props.unlockedLetters);
  });

  return (
    <div class={styles.cardCarousel}>
      <For each={props.cards}>
        {(card, index) => (
          <div 
            class={`${styles.card} ${index() === activeCardIndex() ? styles.active : ''}`}
            style={{ '--delay': `${index() * 0.1}s` }}
          >
            <h2 class={styles.cardTitle}>{card.title}</h2>
            <h3 class={styles.cardSubtitle}>{card.subtitle}</h3>
            <div class={styles.cardContent}>
              {card.content}
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export default CardCarousel;