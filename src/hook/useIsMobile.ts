import { useState, useEffect } from "react";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    // Funzione per aggiornare lo stato quando cambia la dimensione
    const handleResize = () => setIsMobile(mediaQuery.matches);

    // Verifica iniziale
    handleResize();

    // Aggiunge il listener per i cambiamenti
    mediaQuery.addEventListener("change", handleResize);

    // Rimuove il listener quando il componente viene smontato
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return isMobile;
};
