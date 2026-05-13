import { useState, useEffect } from "react";

type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return (saved as Theme) || "dark";
  });

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
      document.body.style.backgroundColor = "hsl(150, 35%, 4%)";
      document.body.style.color = "#d4af37";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#000000";
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return { theme, setTheme, toggleTheme };
}
