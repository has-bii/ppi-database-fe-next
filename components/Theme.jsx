// components/ThemeToggle.js
import { useTheme } from "./ThemeProvider";

function Theme() {
  const { toggleTheme, theme } = useTheme();

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={toggleTheme}
        className={`theme-btn ${theme === "dark" ? "active" : ""}`}
      >
        <span className="theme-btn-circle" />
      </button>
      <p className="text-sm text-white/75 dark:text-white/75">
        {theme === "light" ? "Dark" : "Light"} mode
      </p>
    </div>
  );
}

export default Theme;
