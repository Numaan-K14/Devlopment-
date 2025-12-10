import { useEffect, useRef } from "react";

export const useFetchEveryMinute = (callback: () => void, enabled: boolean) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchWithDelay = () => {
      callback();

      timeoutRef.current = setTimeout(fetchWithDelay, 60000);
    };

    fetchWithDelay();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [callback, enabled]);
};
