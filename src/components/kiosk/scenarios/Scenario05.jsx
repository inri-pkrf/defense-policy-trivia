import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import EmergencyAlert from '../EmergencyAlert';
import { Person } from '../shared/Figures';

export default function Scenario05({ onComplete }) {
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
          scale: phase >= 3 ? 1.2 : 1,
          x: phase >= 2 ? -20 : 0,
        }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #C8E4FF 0%, #EAF5FF 50%, #5BAE5B 80%)' }} />

        <div className="absolute bottom-0 left-0 right-0" style={{ height: '20%', background: '#5BAE5B' }} />

        <div className="absolute" style={{ left: '12%', bottom: '20%', width: '30%', height: '55%' }}>
          <div className="text-center mb-2 text-sm font-bold text-blue-800">מבנה בטון</div>
          <svg width="100%" height="100%" viewBox="0 0 120 200" preserveAspectRatio="xMidYMid meet">
            <rect x="10" y="20" width="100" height="180" rx="4" fill="#7D7D8D" />
            <rect x="8" y="16" width="104" height="10" rx="3" fill="#6D6D7D" />
            {[0, 1, 2, 3].map((r) =>
              [0, 1, 2].map((c) => (
                <rect key={`${r}-${c}`} x={20 + c * 30} y={35 + r * 40} width="20" height="25" rx="2" fill="#B8D8F0" opacity="0.4" />
              ))
            )}
            <rect x="50" y="160" width="20" height="40" rx="2" fill="#5D5D6D" />
          </svg>
          <motion.div
            className="absolute -inset-2 rounded-2xl pointer-events-none"
            animate={{ opacity: phase >= 2 ? [0, 0.7, 0] : 0, scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: phase >= 2 ? Infinity : 0 }}
            style={{ boxShadow: '0 0 25px #32C96A', border: '2px solid #32C96A' }}
          />
          {phase >= 2 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap"
            >
              מוגן ✓
            </motion.div>
          )}
        </div>

        <div className="absolute" style={{ right: '12%', bottom: '20%', width: '28%', height: '40%' }}>
          <div className="text-center mb-2 text-sm font-bold text-blue-800">מבנה קל (קרוואן)</div>
          <svg width="100%" height="100%" viewBox="0 0 140 120" preserveAspectRatio="xMidYMid meet">
            <rect x="10" y="30" width="120" height="70" rx="3" fill="#D4A76A" />
            <rect x="10" y="25" width="120" height="8" rx="2" fill="#C49A5A" />
            <rect x="25" y="50" width="25" height="25" rx="2" fill="#A8D4F0" opacity="0.5" />
            <rect x="90" y="50" width="25" height="25" rx="2" fill="#A8D4F0" opacity="0.5" />
            <rect x="60" y="70" width="20" height="30" rx="2" fill="#B4955A" />
            <rect x="5" y="95" width="130" height="8" rx="2" fill="#8B7355" />
          </svg>
          <motion.div
            className="absolute -inset-2 rounded-2xl pointer-events-none"
            animate={{ opacity: phase >= 2 ? [0, 0.8, 0] : 0, scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: phase >= 2 ? Infinity : 0 }}
            style={{ boxShadow: '0 0 25px #E74C3C', border: '2px solid #E74C3C' }}
          />
          {phase >= 2 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap"
            >
              לא מוגן ✗
            </motion.div>
          )}
        </div>

        {phase >= 2 && (
          <motion.div
            className="absolute"
            style={{ right: '18%', bottom: '20%' }}
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: 60, opacity: [1, 1, 0] }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            <Person pose="walking" shirt="#E74C3C" size={0.6} />
          </motion.div>
        )}

        {phase >= 3 && (
          <motion.div
            className="absolute"
            style={{ right: '30%', bottom: '20%' }}
            initial={{ scale: 0 }}
            animate={{ scale: 0.7, rotate: -90 }}
            transition={{ duration: 0.5 }}
          >
            <Person pose="lying" shirt="#E74C3C" size={0.8} />
          </motion.div>
        )}
      </motion.div>

      <EmergencyAlert active={phase >= 1 && phase < 3} />
    </div>
  );
}