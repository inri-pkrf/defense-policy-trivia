import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import EmergencyAlert from '../EmergencyAlert';
import { Person, Phone } from '../shared/Figures';

const CHECKLIST = [
  { label: 'אמצעי התרעה (יישומון + כריזה)', icon: '📱' },
  { label: 'מרחב מוגן כשיר', icon: '🏠' },
  { label: 'תדרוך עובדים', icon: '📋' },
  { label: 'שילוט הכוונה', icon: '🚏' },
];

export default function Scenario09({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const [checked, setChecked] = useState(0);

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
    if (phase < 2) return;
    const interval = setInterval(() => {
      setChecked((c) => (c >= CHECKLIST.length ? CHECKLIST.length : c + 1));
    }, 400);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: phase >= 2 ? (phase >= 3 ? 1.3 : 1.15) : 1,
        }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #D5EAF7 0%, #EAF5FF 50%, #E0E8F0 100%)' }} />

        <div className="absolute" style={{ top: '8%', left: '5%', width: '50%', height: '65%' }}>
          <svg width="100%" height="100%" viewBox="0 0 200 250" preserveAspectRatio="xMidYMid meet">
            <rect x="10" y="20" width="180" height="220" rx="4" fill="#9BA8B8" />
            <rect x="8" y="16" width="184" height="10" rx="3" fill="#7A8A9A" />
            {[0, 1, 2].map((r) =>
              [0, 1, 2, 3].map((c) => (
                <rect key={`${r}-${c}`} x={22 + c * 40} y={35 + r * 55} width="28" height="35" rx="2" fill="#B8D8F0" opacity="0.3" />
              ))
            )}
            <rect x="80" y="180" width="40" height="60" rx="2" fill="#6A7A8A" />
            <rect x="15" y="230" width="170" height="6" fill="#5A6A7A" />
          </svg>
          <div className="text-center text-sm font-bold text-blue-800 mt-1">מפעל חיוני</div>
        </div>

        <div className="absolute" style={{ top: '12%', right: '5%', width: '42%' }}>
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl">
            <div className="text-lg font-bold text-blue-950 mb-3 text-center">רשימת היערכות</div>
            <div className="space-y-2">
              {CHECKLIST.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 rounded-xl p-2"
                  style={{
                    background: i < checked ? 'rgba(50,201,106,0.15)' : 'rgba(200,200,200,0.1)',
                  }}
                  animate={{
                    scale: i === checked - 1 ? [1, 1.05, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-2xl">{item.icon}</div>
                  <div className="text-sm text-blue-900 flex-1 font-medium">{item.label}</div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: i < checked ? 1 : 0 }}
                    transition={{ type: 'spring' }}
                    className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold"
                  >
                    ✓
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute" style={{ bottom: '8%', left: '15%' }}>
          <Person pose="standing" shirt="#1E5AA8" size={0.7} />
        </div>
        <div className="absolute" style={{ bottom: '8%', left: '28%' }}>
          <Person pose="walking" shirt="#32C96A" size={0.7} />
        </div>

        <motion.div
          className="absolute"
          style={{ bottom: '12%', right: '15%' }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Phone scale={0.7} screenContent="alert" />
        </motion.div>

        {checked >= CHECKLIST.length && (
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-full font-bold shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            מוכנים ✓
          </motion.div>
        )}
      </motion.div>

      <EmergencyAlert active={phase >= 1 && phase < 3} />
    </div>
  );
}