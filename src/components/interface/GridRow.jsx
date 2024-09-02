import { For, createMemo } from 'solid-js';
import styles from './NameGrid.module.css';
import { useTheme } from '../../contexts/ThemeContext';
import { Dynamic } from 'solid-js/web';

const accentVariables = ['accent-unexpected'];

const GridRow = props => {
  let colorIndex = 0;
  const { themes } = useTheme();

  const getNextAccentVariable = () => {
    const variable = accentVariables[colorIndex];
    colorIndex = (colorIndex + 1) % accentVariables.length;
    return variable;
  };

  const ThemeIcon = createMemo(() => {
    const currentThemeObj = themes.find(t => t.name === props.currentTheme);
    return currentThemeObj ? currentThemeObj.icon : null;
  });

  return (
    <div
      class={styles.nameRow}
      style={{ '--name-length': props.gridSize }}
    >
      <For each={props.name}>
        {(letterObj, letterIndex) => {
          const accentVar = createMemo(() =>
            letterObj.correctLetter === ' ' ? `--${getNextAccentVariable()}` : null
          );

          return (
            <div
              class={`${styles.letterBox}
                      ${letterObj.isVowel ? styles.vowel : ''}
                      ${letterObj.matched ? styles.matched : ''}
                      ${props.isActiveName && letterIndex() === props.activeVowelIndex ? styles.active : ''}
                      ${props.focusedPosition.row === props.rowIndex && letterIndex() === props.focusedPosition.col ? styles.focused : ''}
                      ${accentVar() ? styles.accentBackground : ''}`}
              style={accentVar() ? { '--accent-var': `var(${accentVar()})` } : {}}
              tabIndex={
                props.focusedPosition.row === props.rowIndex &&
                letterIndex() === props.focusedPosition.col
                  ? 0
                  : -1
              }
            >
              {<span>{letterObj.currentLetter}</span>}
            </div>
          );
        }}
      </For>
    </div>
  );
};

export default GridRow;
