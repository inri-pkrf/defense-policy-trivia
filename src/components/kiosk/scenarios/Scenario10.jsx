import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Building, Car, Cloud, Person } from '../shared/Figures';

export default function Scenario10({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1300),
      setTimeout(() => setPhase(2), 3000),
      setTimeout(() => setPhase(3), 4900),
      setTimeout(() => onComplete(), 5300),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: phase >= 2 ? (phase >= 3 ? 1.2 : 0.9) : 1,
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #B8D8F0 0%, #D5EAF7 40%, #EAF5FF 100%)' }} />

        <motion.div className="absolute top-6 right-10" animate={{ x: [0, -40, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}>
          <Cloud scale={1.1} />
        </motion.div>
        <motion.div className="absolute top-12 left-16" animate={{ x: [0, 40, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}>
          <Cloud scale={0.7} />
        </motion.div>

        <div className="absolute bottom-0 w-full flex items-end justify-around px-4">
          <Building width={55} height={110} color="#9BC1DE" />
          <Building width={75} height={170} color="#7BA7CC" />
          <Building width={65} height={140} color="#6B95C0" />
          <Building width={85} height={200} color="#5A87B0" />
          <Building width={60} height={125} color="#9BC1DE" />
          <Building width={70} height={160} color="#7BA7CC" />
        </div>

        <motion.div className="absolute bottom-1 right-0" animate={{ x: ['100vw', '-200px'] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
          <Car color="#E74C3C" />
        </motion.div>

        <motion.div className="absolute bottom-2 left-1/4" animate={{ x: [0, 60, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
          <Person pose="walking" shirt="#32C96A" size={0.6} />
        </motion.div>
        <motion.div className="absolute bottom-2 right-1/3" animate={{ x: [0, -50, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
          <Person pose="walking" shirt="#1E5AA8" size={0.6} />
        </motion.div>

        {phase >= 1 && (
          <motion.div
            className="absolute top-12 left-1/2 -translate-x-1/2 z-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 1 }}
          >
            <svg width="120" height="140" viewBox="0 0 120 140">
              <defs>
                <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E5AA8" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#2A6BC4" stopOpacity="0.7" />
                </linearGradient>
              </defs>
              <path d="M60,5 L110,25 L110,75 Q110,120 60,135 Q10,120 10,75 L10,25 Z" fill="url(#shieldGrad)" stroke="#1E5AA8" strokeWidth="2" />
              <path d="M60,20 L95,35 L95,72 Q95,105 60,118 Q25,105 25,72 L25,35 Z" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
              <text x="60" y="75" textAnchor="middle" fontSize="36" fill="white">🛡️</text>
            </svg>
          </motion.div>
        )}

        {phase >= 2 && (
          <motion.div
            className="absolute top-32 left-1/2 -translate-x-1/2 z-10 text-center max-w-md"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white/80 backdrop-blur-md rounded-2xl px-6 py-3 shadow-xl">
              <div className="text-lg font-bold text-blue-950">הגנה על החיים לצד שמירה על חוסן ושגרת חירום</div>
            </div>
          </motion.div>
        )}

        {phase >= 1 && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ background: 'radial-gradient(circle at 50% 30%, rgba(255,122,48,0.2), transparent 70%)' }}
          />
        )}
      </motion.div>

    </div>
  );
}