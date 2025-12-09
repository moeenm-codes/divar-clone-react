// src/contexts/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const THEME_KEY = "divar-theme"; // مثل دیوار واقعی

export const themeOptions = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark",
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved || themeOptions.SYSTEM;
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);

    const applyTheme = () => {
      const effectiveTheme =
        theme === themeOptions.SYSTEM
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? themeOptions.DARK
            : themeOptions.LIGHT
          : theme;

      document.documentElement.setAttribute(
        "data-theme",
        effectiveTheme === themeOptions.DARK ? "dark" : "light"
      );
    };

    applyTheme();

    if (theme === themeOptions.SYSTEM) {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme();
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
