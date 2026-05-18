import { useState, useEffect, useCallback } from "react";

type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return (saved as Theme) || "dark";
  });

  // Apply theme on mount and whenever theme changes
  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
      html.style.colorScheme = "dark";
      // Remove any previously applied inline bg/color so CSS takes over
      document.body.style.removeProperty("background-color");
      document.body.style.removeProperty("color");
    } else {
      html.classList.remove("dark");
      html.style.colorScheme = "light";
      document.body.style.removeProperty("background-color");
      document.body.style.removeProperty("color");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, setTheme, toggleTheme };
}
