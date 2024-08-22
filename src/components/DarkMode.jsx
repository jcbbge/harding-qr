import { createSignal, createEffect } from "solid-js";

export default function DarkMode() {
  const [isDark, setIsDark] = createSignal(false);

  createEffect(() => {
    document.body.classList.toggle("dark-mode", isDark());
  });

  const toggleDarkMode = () => {
    setIsDark(!isDark());
  };

  return (
    <button onClick={toggleDarkMode} class="dark-mode-switch" aria-label="Toggle dark mode">
      {isDark() ? "🌙" : "☀️"}
    </button>
  );
}
