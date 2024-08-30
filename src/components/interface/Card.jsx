import { createSignal, onMount, onCleanup } from 'solid-js';
import styles from './Card.module.css';
import { Envelope, Clock, Archive, Trash, DotsThree, ArrowLeft, Star } from 'phosphor-solid';

export default function Card(props) {
  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });
  let cardRef;

  const handleMouseMove = event => {
    if (cardRef) {
      const rect = cardRef.getBoundingClientRect();
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    }
  };

  onMount(() => {
    document.addEventListener('mousemove', handleMouseMove);
  });

  onCleanup(() => {
    document.removeEventListener('mousemove', handleMouseMove);
  });

  return (
    <div class={styles.scene}>
      <div
        class={styles.card}
        ref={cardRef}
        style={{
          '--mouse-x': `${mousePosition().x}px`,
          '--mouse-y': `${mousePosition().y}px`
        }}
      >
        <div class={styles['card-header']}>
          <div class={styles['header-left']}>
            <Envelope class={styles.icon} />
            <h2>Mail from JRG</h2>
          </div>
          <div class={styles['header-right']}>
            <button class={styles['icon-button']}>
              <Clock />
            </button>
            <button class={styles['icon-button']}>
              <Archive />
            </button>
            <button class={styles['icon-button']}>
              <Trash />
            </button>
            <button class={styles['icon-button']}>
              <DotsThree />
            </button>
          </div>
        </div>
        <div class={styles['card-body']}>
          <p class={styles['sent-from']}>JRG</p>
          <h1 class={styles.subject}>Product Manager</h1>
          <p class={styles['body-text']}>
            Hi,
            <br />
            <br />
            You found my site. Thank you for visiting. There is something you should know. You need
            to turn on your audio. To navigate this site, you must use your keyboard up, down, left,
            and right arrows. If that's okay, click the button below to turn on your audio.
          </p>
          <div class={styles['body-buttons']}>
            <button class={styles['text-button']}>Reply</button>
            <button class={styles['text-button']}>Forward</button>
            <button class={styles['text-button']}>Delete</button>
          </div>
        </div>
        <div class={styles['card-footer']}>
          <button class={styles['icon-button']}>
            <ArrowLeft />
          </button>
          <button class={styles['icon-button']}>
            <Archive />
          </button>
          <button class={styles['icon-button']}>
            <Trash />
          </button>
          <button class={styles['icon-button']}>
            <Star />
          </button>
        </div>
      </div>
    </div>
  );
}
