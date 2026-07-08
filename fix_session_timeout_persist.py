path = 'src/hooks/useSessionTimeout.ts'

with open(path, 'r') as f:
    content = f.read()

old = """  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
};"""

new = """  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const STORAGE_KEY = 'ami_last_activity_ts';

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    try { localStorage.setItem(STORAGE_KEY, String(lastActivityRef.current)); } catch {}
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

    // On mount/activation, check if we were already away longer than the
    // timeout (e.g. the tab was killed/reloaded by the mobile browser while
    // backgrounded). If so, log out immediately instead of restarting the timer.
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const elapsedSinceLoad = Date.now() - parseInt(stored, 10);
        if (elapsedSinceLoad >= timeoutMinutes * 60 * 1000) {
          onTimeout();
          return;
        }
      }
    } catch {}

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];
    events.forEach(e => window.addEventListener(e, resetTimer));

    // Also handle visibility change (tab switch / browser close)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        // Check if timeout has passed while away
        let lastActive = lastActivityRef.current;
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) lastActive = Math.max(lastActive, parseInt(stored, 10));
        } catch {}
        const elapsed = Date.now() - lastActive;
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
};"""

if new in content:
    print("Already patched, skipping")
elif old in content:
    content = content.replace(old, new, 1)
    with open(path, 'w') as f:
        f.write(content)
    print("Patched useSessionTimeout to persist and check last-activity across reloads")
else:
    print("Pattern not found — check manually")
