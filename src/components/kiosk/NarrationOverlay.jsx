import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SIMULATION_SCRIPTS } from '@/data/simulationScripts';

export default function NarrationOverlay({ scriptId }) {
  const script = SIMULATION_SCRIPTS[scriptId];
  const [actIndex, setActIndex] = useState(0);

  useEffect(() => {
    if (!script) return;
    setActIndex(0);
    let delay = 0;
    const timers = [];
    script.acts.forEach((act, i) => {
      delay += act.duration;
      timers.push(setTimeout(() => setActIndex(i + 1), delay));
    });
    return () => timers.forEach(clearTimeout);
  }, [scriptId, script]);

  if (!script) return null;
  const act = script.acts[actIndex];
  const visible = actIndex < 3 && act;

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={actIndex}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-2xl pointer-events-none"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.4 }}
          role="status"
          aria-live="polite"
        >
          <div className="bg-blue-950/75 backdrop-blur-md rounded-2xl px-6 py-3 text-center shadow-xl">
            <span className="text-xs text-blue-300 font-bold tracking-wide block mb-1">{act.label}</span>
            <p className="text-lg text-white font-medium leading-snug">{act.narration}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}