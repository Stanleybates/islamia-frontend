import { useEffect, useRef, useCallback } from "react";

interface UseSessionTimeoutProps {
  timeoutMinutes: number;
  onTimeout: () => void;
  isActive: boolean; // only run when logged in
}

const useSessionTimeout = ({ timeoutMinutes, onTimeout, isActive }: UseSessionTimeoutProps) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onTimeout();
    }, timeoutMinutes * 60 * 1000);
  }, [timeoutMinutes, onTimeout]);

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];
    events.forEach(e => window.addEventListener(e, resetTimer));

    // Also handle visibility change (tab switch / browser close)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        // Check if timeout has passed while away
        const elapsed = Date.now() - lastActivityRef.current;
        if (elapsed >= timeoutMinutes * 60 * 1000) {
          onTimeout();
        } else {
          resetTimer();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Start the timer
    resetTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      document.removeEventListener("visibilitychange", handleVisibility);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, resetTimer, timeoutMinutes, onTimeout]);
};

export default useSessionTimeout;
