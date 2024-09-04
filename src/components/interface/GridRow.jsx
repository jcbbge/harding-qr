import { For, createMemo } from 'solid-js';
import styles from './NameGrid.module.css';
import { useTheme } from '../../contexts/ThemeContext';

const GridRow = props => {
  const [
    { theme, mode, pattern, themeList, modeList, patternList },
    { updateTheme, updateMode, updatePattern }
  ] = useTheme();

  const currentThemeInfo = createMemo(() => {
    return themeList.find(t => t.name === theme()) || { name: 'default', icon: 'palette' };
  });

  const currentModeInfo = createMemo(() => {
    return modeList.find(m => m.name === mode()) || { name: 'system', icon: 'sun-moon' };
  });

  const currentPatternInfo = createMemo(() => {
    return (
      patternList.find(p => p.name === pattern()) || { name: 'default', icon: 'layout-dashboard' }
    );
  });

  const handleSettingChange = (letterIndex, delta) => {
    props.onChangeSetting(props.rowIndex, letterIndex, delta);
  };

  const renderLetterBox = (letterObj, letterIndex) => {
    if (letterObj.isEmpty) {
      const emptyIndexInRow = props.name.slice(0, letterIndex).filter(l => l.isEmpty).length;
      const emptyIndexInGrid = props.emptyCountBeforeRow + emptyIndexInRow + 1;

      let iconName, currentSetting, updateFunction;
      switch (emptyIndexInGrid) {
        case 1:
          iconName = currentThemeInfo().icon;
          currentSetting = theme;
          updateFunction = updateTheme;
          break;
        case 2:
          iconName = currentModeInfo().icon;
          currentSetting = mode;
          updateFunction = updateMode;
          break;
        case 3:
          iconName = currentPatternInfo().icon;
          currentSetting = pattern;
          updateFunction = updatePattern;
          break;
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
          <svg
            src={`/src/assets/icons/${iconName}.svg`}
            size={28}
            class={`${styles.settingIcon} ${styles.desktopIcon}`}
          />
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
