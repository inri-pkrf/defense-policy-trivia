import { useEffect, useRef, useState } from 'react';

export function useIdleTimer({ timeoutMs, warningMs = 30000, onTimeout }) {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  useEffect(() => {
    let idleTimeout, countdownInterval;

    const reset = () => {
      setShowWarning(false);
      clearTimeout(idleTimeout);
      clearInterval(countdownInterval);

      idleTimeout = setTimeout(() => {
        setShowWarning(true);
        setCountdown(Math.ceil(warningMs / 1000));
        countdownInterval = setInterval(() => {
          setCountdown((c) => {
            if (c <= 1) {
              clearInterval(countdownInterval);
              onTimeoutRef.current();
              return 0;
            }
            return c - 1;
          });
        }, 1000);
      }, timeoutMs - warningMs);
    };

    const events = ['touchstart', 'mousedown', 'pointerdown', 'keydown'];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      clearTimeout(idleTimeout);
      clearInterval(countdownInterval);
    };
  }, [timeoutMs, warningMs]);

  return { showWarning, countdown };
}