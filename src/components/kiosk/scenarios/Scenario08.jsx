import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import EmergencyAlert from '../EmergencyAlert';
import { Bus, Cloud } from '../shared/Figures';

export default function Scenario08({ onComplete }) {
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
          scale: phase >= 2 ? (phase >= 3 ? 1.7 : 1.4) : 1,
          x: phase >= 2 ? -60 : 0,
        }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #B8D8F0 0%, #D5EAF7 50%, #6B7280 60%, #5A5A6A 100%)' }} />

        <motion.div className="absolute top-8 right-10" animate={{ x: [0, -30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}>
          <Cloud scale={0.9} />
        </motion.div>

        <div className="absolute" style={{ top: '58%', left: 0, right: 0, height: '40%', background: '#5A5A6A' }}>
          <div className="absolute top-1/3 left-0 right-0 h-1 border-t-2 border-dashed border-white opacity-40" />
        </div>

        <motion.div
          className="absolute"
          style={{ top: '52%', left: '15%' }}
          animate={{
            x: phase === 0 ? [0, 150, 0] : 200,
          }}
          transition={{ duration: phase === 0 ? 4 : 1.5, repeat: phase === 0 ? Infinity : 0, ease: phase === 0 ? 'easeInOut' : 'easeOut' }}
        >
          <Bus color="#3498DB" />
        </motion.div>

        {phase >= 2 && (
          <div className="absolute" style={{ top: '52%', left: '42%' }}>
            <svg width="160" height="80" viewBox="0 0 160 80">
              <rect x="5" y="5" width="150" height="60" rx="8" fill="#3498DB" />
              <rect x="12" y="12" width="22" height="20" rx="2" fill="#A8D4F0" opacity="0.7" />
              <rect x="40" y="12" width="22" height="20" rx="2" fill="#A8D4F0" opacity="0.7" />
              <rect x="68" y="12" width="22" height="20" rx="2" fill="#A8D4F0" opacity="0.7" />
              <rect x="96" y="12" width="22" height="20" rx="2" fill="#A8D4F0" opacity="0.7" />
              <rect x="124" y="12" width="22" height="20" rx="2" fill="#A8D4F0" opacity="0.7" />
              <rect x="6" y="25" width="8" height="35" rx="2" fill="#2C5F8A" />

              {phase >= 2 && (
                <>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.circle
                      key={i}
                      cx={22 + i * 28}
                      cy={45}
                      r="7"
                      fill="#E8B894"
                      initial={{ cy: 30 }}
                      animate={{ cy: [30, 48, 48] }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                    />
                  ))}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.rect
                      key={`arm-${i}`}
                      x={16 + i * 28}
                      y={38}
                      width="12"
                      height="4"
                      rx="2"
                      fill="#E8B894"
                      initial={{ y: 25 }}
                      animate={{ y: [25, 38, 38] }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                    />
                  ))}
                </>
              )}

              <circle cx="35" cy="67" r="8" fill="#2C2C3E" />
              <circle cx="125" cy="67" r="8" fill="#2C2C3E" />
            </svg>
          </div>
        )}

        {phase >= 2 && (
          <motion.div
            className="absolute"
            style={{ top: '70%', left: '45%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0], scale: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-32 h-8 bg-green-400 rounded-full opacity-30" />
          </motion.div>
        )}
      </motion.div>

      <EmergencyAlert active={phase >= 1 && phase < 3} />
    </div>
  );
}