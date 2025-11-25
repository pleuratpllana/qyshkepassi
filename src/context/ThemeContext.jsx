import { createContext, useContext, useState, useLayoutEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isLight, setIsLight] = useState(() => {
    const saved = localStorage.getItem("isLight");
    if (saved !== null) return saved === "true";
    return window.matchMedia("(prefers-color-scheme: light)").matches;
  });

  useLayoutEffect(() => {
    if (isLight) document.documentElement.classList.add("light");
    else document.documentElement.classList.remove("light");
    localStorage.setItem("isLight", isLight);
  }, [isLight]);

  const toggleTheme = () => setIsLight(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isLight, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
