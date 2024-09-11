import { For, createMemo, createSignal } from 'solid-js';
import styles from './GridRow.module.css';
import { useTheme } from '../../contexts/ThemeContext';

const GridRow = props => {
  console.log('GridRow props:', {
    ...props,
    nameLength: props.name.length,
    emptyBoxes: props.name.filter(l => l.isEmpty).length
  });

  const [
    { theme, mode, pattern, themeList, modeList, patternList },
    { updateTheme, updateMode, updatePattern, getItemIcon }
  ] = useTheme();

  const handleSettingChange = (letterIndex, delta) => {
    props.onChangeSetting(props.rowIndex, letterIndex, delta);
  };

  const getIconImg = iconName => {
    const [error, setError] = createSignal(false);

    return (
      <>
        <img
          src={`/src/assets/icons/${iconName}.svg`}
          alt={`${iconName} icon`}
          class={`${styles.settingIcon} ${styles.desktopIcon}`}
          onError={() => setError(true)}
          style={{ display: error() ? 'none' : 'inline' }}
        />
        {error() && <span class={styles.iconFallback}>{iconName.charAt(0).toUpperCase()}</span>}
      </>
    );
  };

  const renderLetterBox = (letterObj, letterIndex) => {
    console.log(
      `Rendering letter box: ${JSON.stringify(letterObj)}, isEmpty: ${letterObj.isEmpty}, index: ${letterIndex}`
    );

    if (letterObj.isEmpty) {
      console.warn(`Letter box is empty, rendering icon`);

      const emptyIndexInRow = props.name.slice(0, letterIndex).filter(l => l.isEmpty).length;
      const emptyIndexInGrid = emptyIndexInRow + 1; // Removed props.emptyCountBeforeRow

      console.log(`Empty box details:`, {
        emptyIndexInRow,
        emptyIndexInGrid,
        letterIndex,
        totalEmptyBoxes: props.name.filter(l => l.isEmpty).length
      });

      let iconName, currentSetting, updateFunction;

      switch (emptyIndexInGrid) {
        case 1:
          iconName = getItemIcon('theme', theme());
          currentSetting = theme;
          updateFunction = updateTheme;
          console.log('Case 1: Theme', { iconName, currentSetting: currentSetting() });
          break;
        case 2:
          iconName = getItemIcon('mode', mode());
          currentSetting = mode;
          updateFunction = updateMode;
          console.log('Case 2: Mode', { iconName, currentSetting: currentSetting() });
          break;
        case 3:
          iconName = getItemIcon('pattern', pattern());
          currentSetting = pattern;
          updateFunction = updatePattern;
          console.log('Case 3: Pattern', { iconName, currentSetting: currentSetting() });
          break;
        default:
          console.warn(`Unexpected empty index: ${emptyIndexInGrid}`);
          return null;
      }

      return (
        <div
          class={`${styles.letterBox} ${styles.emptyBox} ${
            props.focusedPosition.row === props.rowIndex &&
            letterIndex === props.focusedPosition.col
              ? styles.focused
              : ''
          }`}
          onClick={() => handleSettingChange(letterIndex, 1)}
        >
          {getIconImg(iconName)}
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
