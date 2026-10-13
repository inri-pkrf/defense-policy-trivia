import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import EmergencyAlert from '../EmergencyAlert';
import { Person, Building } from '../shared/Figures';

export default function Scenario04({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1200),
      setTimeout(() => setPhase(2), 2800),
      setTimeout(() => setPhase(3), 4800),
      setTimeout(() => onComplete(), 5200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  useEffect(() => {
    if (phase < 1) return;
    const interval = setInterval(() => {
      setCounter((c) => {
        if (phase >= 2 && c >= 400) return 400;
        if (c >= 400) return 400;
        return c + (phase >= 2 ? 50 : 20);
      });
    }, 200);
    return () => clearInterval(interval);
  }, [phase]);

  const outdoorLimit = 100;
  const indoorLimit = 400;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: phase >= 2 ? 1.15 : 1,
          x: phase >= 2 ? -50 : 0,
        }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #B8D8F0 0%, #D5EAF7 30%, #7BC97B 40%, #5BAE5B 100%)' }} />

        <div className="absolute" style={{ top: '15%', left: '8%', width: '45%', height: '55%' }}>
          <div className="text-center mb-2 text-sm font-bold text-blue-800">שטח פתוח</div>
          <div className="relative w-full h-full rounded-2xl" style={{ background: 'rgba(123,201,123,0.2)', border: '2px dashed #5BAE5B' }}>
            {Array.from({ length: Math.min(counter, 20) }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${15 + (i % 5) * 16}%`,
                  bottom: `${5 + Math.floor(i / 5) * 18}%`,
                }}
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 0.5, y: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Person pose="standing" shirt={['#1E5AA8', '#E74C3C', '#32C96A', '#FF7A30'][i % 4]} size={0.4} />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="absolute" style={{ top: '15%', right: '8%', width: '35%', height: '60%' }}>
          <div className="text-center mb-2 text-sm font-bold text-blue-800">אולם מקורה</div>
          <div className="relative w-full h-full">
            <Building width={'100%'} height={'100%'} color="#7BA7CC" />
            {counter > outdoorLimit && (
              <div className="absolute inset-0 flex items-center justify-center">
                {Array.from({ length: Math.min(Math.max(counter - outdoorLimit, 0), 20) }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${20 + (i % 4) * 18}%`,
                      top: `${20 + Math.floor(i / 4) * 25}%`,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 0.35 }}
                    transition={{ type: 'spring' }}
                  >
                    <Person pose="standing" shirt={['#1E5AA8', '#E74C3C', '#32C96A', '#FF7A30'][i % 4]} size={0.4} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <motion.div
          className="absolute top-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-8 py-4 shadow-xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-5xl font-bold text-center" style={{ color: counter > 100 ? '#1E5AA8' : '#32C96A' }}>
            {counter}
          </div>
          <div className="text-sm text-center text-blue-500">משתתפים</div>
        </motion.div>

        {phase >= 2 && (
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-50 rounded-xl px-4 py-2 text-center shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="text-sm text-blue-700 font-medium">מספר המשתתפים תלו בסוג השטח</div>
            <div className="text-xs text-blue-400 mt-1">פתוח: עד 100 · מקורה: עד 400</div>
          </motion.div>
        )}
      </motion.div>

      <EmergencyAlert active={phase >= 1 && phase < 3} />
    </div>
  );
}