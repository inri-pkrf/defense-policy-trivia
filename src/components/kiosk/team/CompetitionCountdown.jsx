import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CompetitionCountdown({ room }) {
  const [display, setDisplay] = useState('3');

  useEffect(() => {
    if (!room.countdown_starts_at) return;
    const startTime = new Date(room.countdown_starts_at).getTime();
    const update = () => {
      const remaining = startTime - Date.now();
      if (remaining > 3000) setDisplay('3');
      else if (remaining > 2000) setDisplay('2');
      else if (remaining > 1000) setDisplay('1');
      else if (remaining > -1000) setDisplay('GO!');
    };
    update();
    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, [room.countdown_starts_at]);

  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <h2 className="text-3xl font-bold text-blue-700 mb-8">מתחילים!</h2>
      <AnimatePresence mode="wait">
        <motion.div
          key={display}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[12rem] font-bold"
          style={{ color: display === 'GO!' ? '#32C96A' : '#1E5AA8' }}
        >
          {display}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}