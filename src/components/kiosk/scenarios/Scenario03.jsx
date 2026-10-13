import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import EmergencyAlert from '../EmergencyAlert';

const AREAS = [
  { label: 'לובי', color: '#E74C3C', x: 10, y: 70, w: 25, h: 25, safe: false },
  { label: 'חדר עם חלון', color: '#FF7A30', x: 40, y: 40, w: 22, h: 25, safe: false },
  { label: 'קומה עליונה', color: '#FF7A30', x: 40, y: 10, w: 22, h: 25, safe: false },
  { label: 'חדר מדרגות פנימי', color: '#32C96A', x: 70, y: 35, w: 22, h: 45, safe: true },
];

export default function Scenario03({ onComplete }) {
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
          scale: phase >= 2 ? (phase >= 3 ? 1.5 : 1.2) : 1,
          x: phase >= 2 ? -40 : 0,
        }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #C8E4FF 0%, #EAF5FF 100%)' }} />

        <div className="absolute" style={{ top: '10%', left: '8%', right: '8%', bottom: '5%', border: '3px solid #5A87B0', borderRadius: '12px', background: '#F8FAFC' }}>
          <div className="absolute top-0 left-0 right-0 h-3 bg-blue-300 rounded-t-lg" />

          {AREAS.map((area, i) => (
            <motion.div
              key={i}
              className="absolute rounded-lg flex items-center justify-center text-center"
              style={{
                left: `${area.x}%`,
                top: `${area.y}%`,
                width: `${area.w}%`,
                height: `${area.h}%`,
                background: area.color,
                opacity: 0.3,
                border: `2px solid ${area.color}`,
              }}
              animate={{
                opacity: phase >= 1 ? (phase >= 2 ? [0.2, 0.5, 0.2] : 0.3) : 0.15,
                scale: phase >= 2 && area.safe ? 1.05 : 1,
              }}
              transition={{
                duration: 1.5,
                repeat: phase >= 1 ? Infinity : 0,
                delay: i * 0.2,
              }}
            >
              <span className="text-xs font-bold text-white px-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                {area.label}
              </span>
            </motion.div>
          ))}

          {phase >= 2 && (
            <motion.div
              className="absolute rounded-lg pointer-events-none"
              style={{
                left: '68%',
                top: '33%',
                width: '26%',
                height: '49%',
                boxShadow: '0 0 30px #32C96A',
                border: '3px solid #32C96A',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm text-blue-700 font-medium bg-white/60 px-3 rounded">
          חתך מבנה — השוואת רמות הגנה
        </div>
      </motion.div>

      <EmergencyAlert active={phase >= 1 && phase < 3} />
    </div>
  );
}