import { useTheme } from '../../contexts/ThemeContext';

const AppearanceToggle = () => {
  const { appearanceMode, toggleAppearanceMode } = useTheme();

  return (
    <button onClick={toggleAppearanceMode}>
      Appearance: {appearanceMode()}
    </button>
  );
};

export default AppearanceToggle;