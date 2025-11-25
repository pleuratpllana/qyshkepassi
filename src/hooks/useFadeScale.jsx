import { useMemo } from "react";

export const useFadeScale = () => {
  const fadeScale = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
  }), []);

  return fadeScale;
};
