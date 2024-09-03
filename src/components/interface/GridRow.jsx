import { For, createMemo } from 'solid-js';
import styles from './NameGrid.module.css';
import { useTheme } from '../../contexts/ThemeContext';
import { Dynamic } from 'solid-js/web';
import { Sun, Moon, Gear, SquareHalf } from 'phosphor-solid';

const accentVariables = ['accent-unexpected'];

const GridRow = props => {
  let colorIndex = 0;
  const { appearance, themes } = useTheme();

  const getNextAccentVariable = () => {
    const variable = accentVariables[colorIndex];
    colorIndex = (colorIndex + 1) % accentVariables.length;
    return variable;
  };

  const ThemeIcon = createMemo(() => {
    const currentThemeObj = themes.find(t => t.name === appearance.theme);
    return currentThemeObj ? currentThemeObj.icon : null;
  });

  const ModeIcon = createMemo(() => {
    switch (appearance.mode) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      case 'system':
      default:
        return Gear;
    }
  });

  const renderLetterBox = (letterObj, letterIndex) => {
    if (letterObj.isEmpty) {
      const emptyIndexInRow = props.name.slice(0, letterIndex).filter(l => l.isEmpty).length + 1;
      const emptyIndexInGrid = props.emptyCountBeforeRow + emptyIndexInRow;

      let displayContent = ' ';
      if (emptyIndexInGrid <= 3) {
        let settingComponent;
        switch (emptyIndexInGrid) {
          case 1:
            settingComponent = (
              <Dynamic
                component={ThemeIcon()}
                size={28}
                class={`${styles.settingIcon} ${styles.desktopIcon}`}
              />
            );
            break;
          case 2:
            const CurrentModeIcon = ModeIcon();
            settingComponent = (
              <CurrentModeIcon
                size={28}
                class={`${styles.settingIcon} ${styles.desktopIcon}`}
              />
            );
            break;
          case 3:
            settingComponent = (
              <SquareHalf
                size={28}
                class={`${styles.settingIcon} ${styles.desktopIcon}`}
              />
            );
            break;
        }
        displayContent = settingComponent;
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
