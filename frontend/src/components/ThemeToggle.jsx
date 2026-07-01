import { useTheme } from "../theme/ThemeContext.jsx";
import { Sun, Moon } from "./Icons.jsx";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`relative grid h-10 w-10 place-items-center rounded-xl border border-line/12 bg-surface/50 text-text transition-colors hover:bg-line/[0.06] ${className}`}
    >
      <span
        className="transition-all duration-500"
        style={{
          transform: isDark ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0)",
          opacity: isDark ? 1 : 0,
          position: isDark ? "static" : "absolute",
        }}
      >
        <Moon size={18} />
      </span>
      <span
        className="transition-all duration-500"
        style={{
          transform: !isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)",
          opacity: !isDark ? 1 : 0,
          position: !isDark ? "static" : "absolute",
        }}
      >
        <Sun size={18} />
      </span>
    </button>
  );
}
