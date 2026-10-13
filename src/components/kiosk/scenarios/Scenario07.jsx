import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import EmergencyAlert from '../EmergencyAlert';
import { Cloud, Person, Phone, Tree } from '../shared/Figures';

export default function Scenario07({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1300),
      setTimeout(() => setPhase(2), 2900),
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
          scale: phase >= 2 ? (phase >= 3 ? 1.8 : 1.5) : 1,
          x: phase >= 2 ? -40 : 0,
        }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #B8D8F0 0%, #D5EAF7 40%, #7BC97B 55%, #5BAE5B 100%)' }} />

        <motion.div className="absolute top-8 right-12" animate={{ x: [0, -30, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}>
          <Cloud scale={1} />
        </motion.div>
        <motion.div className="absolute top-16 left-16" animate={{ x: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}>
          <Cloud scale={0.6} />
        </motion.div>

        <div className="absolute bottom-2 left-8"><Tree scale={0.9} /></div>
        <div className="absolute bottom-2 right-10"><Tree scale={0.7} /></div>

        <motion.div
          className="absolute"
          style={{ bottom: '5%', left: '30%' }}
          animate={{ x: phase === 0 ? [0, 80, 0] : 40 }}
          transition={{ duration: phase === 0 ? 5 : 1, repeat: phase === 0 ? Infinity : 0, ease: 'easeInOut' }}
        >
          <Person pose="walking" shirt="#1E5AA8" size={0.8} />
        </motion.div>

        {phase >= 1 && (
          <motion.div
            className="absolute"
            style={{ bottom: '12%', left: '38%' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: phase >= 2 ? [1, 1.3, 1] : 1,
              opacity: 1,
              rotate: phase >= 2 ? [0, -5, 5, -3, 3, 0] : 0,
            }}
            transition={{
              scale: { duration: 0.8, repeat: phase >= 2 ? Infinity : 0 },
              rotate: { duration: 0.5, repeat: phase >= 2 ? Infinity : 0 },
              opacity: { duration: 0.3 },
            }}
          >
            <Phone scale={1.2} screenContent="alert" />
          </motion.div>
        )}

        {phase >= 2 && (
          <motion.div
            className="absolute"
            style={{ bottom: '25%', left: '36%' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl whitespace-nowrap">
              📍 התרעה לפי מיקום
            </div>
          </motion.div>
        )}

        {phase >= 2 && (
          <motion.div
            className="absolute"
            style={{ top: '40%', left: '40%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0], scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="w-40 h-40 rounded-full border-4 border-orange-400" />
          </motion.div>
        )}
      </motion.div>

      <EmergencyAlert active={phase >= 1 && phase < 3} />
    </div>
  );
}