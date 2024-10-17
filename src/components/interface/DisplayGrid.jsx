import { For, Show } from 'solid-js';
import styles from './DisplayGrid.module.css';

const DisplayGrid = (props) => {
  console.log("DisplayGrid props:", props);

  const isVowel = (letter) => ['A', 'E', 'I', 'O', 'U'].includes(letter.toUpperCase());
  const MAX_LENGTH = 7;

  const padWord = (word) => {
    const padding = ' '.repeat(Math.max(0, MAX_LENGTH - word.length));
    return padding + word;
  };

  return (
    <div class={styles.displayGrid}>
      <For each={props.gridWords}>
        {(word, nameIndex) => (
          <>
            <Show when={props.gridElements && props.gridElements[nameIndex()]}>
              <div class={styles.displayContent}>{props.gridElements[nameIndex()]}</div>
            </Show>
            <div
              class={styles.displayRow}
              style={{ '--name-length': MAX_LENGTH }}
            >
              <For each={padWord(word)}>
                {(letter) => (
                  <div class={`${styles.displayLetter} ${styles.matched} ${isVowel(letter) ? styles.vowel : ''} ${letter === ' ' ? styles.emptyBox : ''}`}>
                    <span>{letter !== ' ' ? letter : ''}</span>
                  </div>
                )}
              </For>
            </div>
            <Show when={props.gridElements && nameIndex() === props.gridWords.length - 1}>
              <div class={styles.displayContent}>{props.gridElements[props.gridElements.length - 1]}</div>
            </Show>
          </>
        )}
      </For>    
    </div>
  );
};

export default DisplayGrid;
