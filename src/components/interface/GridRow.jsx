import { For, createMemo } from 'solid-js';
import styles from './NameGrid.module.css';
import { useTheme } from '../../contexts/ThemeContext';

const accentVariables = ['accent-unexpected'];

const GridRow = props => {
  const { appearance, themes } = useTheme();

  const ThemeIconName = createMemo(() => {
    return props.currentThemeIcon;
  });

  const ModeIcon = createMemo(() => {
    switch (appearance.mode) {
      case 'light':
        return 'sun';
      case 'dark':
        return 'moon';
      default:
        return 'sun-moon';
    }
  });

  const renderLetterBox = (letterObj, letterIndex) => {
    if (letterObj.isEmpty) {
      const emptyIndexInRow = props.name.slice(0, letterIndex).filter(l => l.isEmpty).length + 1;
      const emptyIndexInGrid = props.emptyCountBeforeRow + emptyIndexInRow;

      let displayContent = ' ';
      if (emptyIndexInGrid <= 3) {
        let iconName;
        switch (emptyIndexInGrid) {
          case 1:
            iconName = ThemeIconName();
            break;
          case 2:
            iconName = ModeIcon();
            break;
          case 3:
            iconName = 'layout-dashboard';
            break;
        }
        console.log(`Rendering icon for empty box ${emptyIndexInGrid}:`, iconName);
        displayContent = (
          <svg
            src={`/src/assets/icons/${iconName}.svg`}
            size={28}
            class={`${styles.settingIcon} ${styles.desktopIcon}`}
          />
        );
      }

      return (
        <div
          class={`${styles.letterBox} ${styles.emptyBox} ${
            props.focusedPosition.row === props.rowIndex &&
            letterIndex === props.focusedPosition.col
              ? styles.focused
              : ''
          }`}
        >
          {displayContent}
        </div>
      );
    }

    const accentVar = createMemo(() =>
      letterObj.correctLetter === ' ' ? `--${getNextAccentVariable()}` : null
    );

    return (
      <div
        class={`${styles.letterBox}
                ${letterObj.matched ? styles.matched : ''}
                ${props.isActiveName && letterIndex === props.activeVowelIndex ? styles.active : ''}
                ${props.focusedPosition.row === props.rowIndex && letterIndex === props.focusedPosition.col ? styles.focused : ''}
                ${accentVar() ? styles.accentBackground : ''}`}
        style={accentVar() ? { '--accent-var': `var(${accentVar()})` } : {}}
        role="button"
        tabIndex={
          props.focusedPosition.row === props.rowIndex && letterIndex === props.focusedPosition.col
            ? 0
            : -1
        }
      >
        {<span>{letterObj.currentLetter}</span>}
      </div>
    );
  };

  return (
    <div
      class={styles.nameRow}
      style={{ '--name-length': props.name.length }}
    >
      <For each={props.name}>
        {(letterObj, letterIndex) => renderLetterBox(letterObj, letterIndex())}
      </For>
    </div>
  );
};

export default GridRow;
