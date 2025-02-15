import { useEffect } from "react";

export const useHideMobileKeyboard = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.activeElement instanceof HTMLElement &&
        document.activeElement.blur();
    }
  }, []);
};
