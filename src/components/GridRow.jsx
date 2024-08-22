import { For } from 'solid-js';
import styles from './NameGrid.module.css';

const GridRow = (props) => {
  return (
    <div class={styles.nameRow} style={{"--name-length": props.name.length}}>
      <For each={props.name}>
        {(letterObj, letterIndex) => (
          <div 
            class={`${styles.letterBox} 
                    ${letterObj.isVowel ? styles.vowel : ''} 
                    ${letterObj.matched ? styles.matched : ''} 
                    ${props.isActiveName && letterIndex() === props.activeVowelIndex ? styles.active : ''} 
                    ${props.focusedPosition.row === props.rowIndex && letterIndex() === props.focusedPosition.col ? styles.focused : ''}`}
            tabIndex={props.focusedPosition.row === props.rowIndex && letterIndex() === props.focusedPosition.col ? 0 : -1}
          >
            <span>{letterObj.currentLetter}</span>
          </div>
        )}
      </For>
    </div>
  );
};

export default GridRow;