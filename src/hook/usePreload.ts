import { useRef } from "react";

const usePreloadQuery = <T>(query: () => Promise<T>) => {
  const hasFetched = useRef(false);

  const preload = () => {
    if (hasFetched.current) return;
    query()
      .then((res) => {
        hasFetched.current = true;
        console.log("ok", res);
      })
      .catch((err) => {
        console.error("Errore nel fetching", err);
      });
  };

  return { preload };
};

export default usePreloadQuery;
