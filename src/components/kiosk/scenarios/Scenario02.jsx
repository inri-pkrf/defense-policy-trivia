import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import EmergencyAlert from '../EmergencyAlert';
import { Car, Cloud, Person } from '../shared/Figures';

export default function Scenario02({ onComplete }) {
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
          scale: phase >= 2 ? (phase >= 3 ? 1.6 : 1.3) : 1,
          x: phase >= 2 ? -80 : 0,
          y: phase >= 3 ? -40 : 0,
        }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #B8D8F0 0%, #D5EAF7 40%, #7BC97B 55%, #5BAE5B 100%)' }} />

        <motion.div className="absolute top-8 right-10" animate={{ x: [0, -40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}>
          <Cloud scale={1} />
        </motion.div>

        <div className="absolute" style={{ top: '50%', left: 0, right: 0, height: '4px', background: '#FFD700', opacity: 0.6 }} />

        <div className="absolute" style={{ top: '45%', left: 0, right: 0, height: '50%', background: '#5A5A6A' }}>
          <div className="absolute top-1/3 left-0 right-0 h-1 border-t-2 border-dashed border-white opacity-40" />
        </div>

        <div className="absolute" style={{ top: '50%', left: '70%', width: '6px', height: '45%', background: '#888' }} />

        <motion.div
          className="absolute"
          style={{ top: '52%', left: '20%' }}
          animate={{
            x: phase === 0 ? [0, 100, 0] : phase === 1 ? 200 : phase >= 2 ? 260 : 0,
            opacity: phase >= 3 ? 0 : 1,
          }}
          transition={{
            x: phase === 0 ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : { duration: 1.5, ease: 'easeOut' },
            opacity: { duration: 0.5 },
          }}
        >
          <Car color="#E74C3C" />
        </motion.div>

        {phase >= 2 && phase < 3 && (
          <motion.div
            className="absolute"
            style={{ top: '55%', left: '42%' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Person pose="walking" shirt="#FF7A30" size={0.7} />
          </motion.div>
        )}

        {phase >= 3 && (
          <motion.div
            className="absolute"
            style={{ top: '60%', left: '38%' }}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 0.7, rotate: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Person pose="lying" shirt="#FF7A30" size={1} />
          </motion.div>
        )}

        <motion.div
          className="absolute"
          style={{ top: '57%', left: '35%' }}
          animate={{ opacity: phase >= 3 ? [0, 0.8, 0] : 0, scale: [1, 1.5, 1] }}
          transition={{ duration: 1.5, repeat: phase >= 3 ? Infinity : 0 }}
        >
          <div className="w-10 h-10 rounded-full bg-green-400 opacity-30" />
        </motion.div>
      </motion.div>

      <EmergencyAlert active={phase >= 1 && phase < 3} />
    </div>
  );
}