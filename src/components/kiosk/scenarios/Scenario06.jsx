import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import EmergencyAlert from '../EmergencyAlert';
import { Person } from '../shared/Figures';

export default function Scenario06({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1200),
      setTimeout(() => setPhase(2), 2800),
      setTimeout(() => setPhase(3), 4800),
      setTimeout(() => onComplete(), 5200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: phase >= 2 ? (phase >= 3 ? 1.4 : 1.2) : 1,
          x: phase >= 2 ? -60 : 0,
        }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #C8E4FF 0%, #EAF5FF 100%)' }} />

        <div className="absolute" style={{ top: '8%', left: '5%', right: '5%', bottom: '5%', border: '3px solid #5A87B0', borderRadius: '16px', background: '#F8FAFC' }}>
          <div className="absolute top-0 left-0 right-0 h-4 bg-blue-300 rounded-t-xl" />
          <div className="absolute top-8 left-6 text-sm font-bold text-blue-800">כיתת לימוד</div>

          <div className="absolute" style={{ top: '18%', left: '8%', right: '8%', height: '40%' }}>
            <div className="flex flex-wrap gap-3 justify-center items-end h-full">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    x: phase >= 2 ? [0, 120 + (i % 3) * 10] : 0,
                    y: phase >= 2 ? [0, -20 - (i % 2) * 5] : 0,
                    opacity: phase >= 2 ? [1, 0.3] : 1,
                  }}
                  transition={{ duration: 1.5, delay: i * 0.08, ease: 'easeInOut' }}
                >
                  <Person pose="standing" shirt={['#1E5AA8', '#E74C3C', '#32C96A', '#FF7A30'][i % 4]} size={0.5} />
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="absolute"
            style={{ top: '18%', left: '15%' }}
            animate={{ x: phase >= 2 ? 120 : 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <Person pose="walking" shirt="#9C27B0" size={0.55} />
          </motion.div>

          <motion.div
            className="absolute"
            style={{ right: '5%', top: '15%', width: '25%', height: '55%', borderRadius: '12px', background: '#32C96A', opacity: 0.2, border: '2px solid #32C96A' }}
            animate={{ opacity: phase >= 2 ? [0.2, 0.5, 0.2] : 0.1, scale: phase >= 2 ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 1.5, repeat: phase >= 2 ? Infinity : 0 }}
          >
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-green-700 whitespace-nowrap">
              מרחב מוגן
            </div>
          </motion.div>

          {phase >= 2 && (
            <motion.div
              className="absolute"
              style={{ right: '12%', top: '35%' }}
              initial={{ scale: 0 }}
              animate={{ scale: 0.5 }}
              transition={{ delay: 1, type: 'spring' }}
            >
              <Person pose="crouching" shirt="#32C96A" size={0.5} />
            </motion.div>
          )}

          {phase >= 2 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, type: 'spring' }}
              className="absolute bottom-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full"
            >
              כולם מוגנים ✓
            </motion.div>
          )}
        </div>
      </motion.div>

      <EmergencyAlert active={phase >= 1 && phase < 3} />
    </div>
  );
}