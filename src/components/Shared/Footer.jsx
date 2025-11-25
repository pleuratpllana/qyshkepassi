import  { memo } from "react";
import { useTheme } from "../../context/ThemeContext";

const Footer = () => {
  const { isLight } = useTheme();

  return (
    <footer className={`w-full text-center py-4 text-xs transition-colors duration-300 bg-[var(--color-bg)] text-[var(--color-text)]`}>
      2025 © All rights reserved. Developed by PleuratPllana
    </footer>
  );
};

export default memo(Footer);
