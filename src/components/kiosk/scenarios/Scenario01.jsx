import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import EmergencyAlert from '../EmergencyAlert';
import { Building, Car, Cloud, Person } from '../shared/Figures';

const SERVICES = [
{ label: 'בית חולים', color: '#E8F5E9', border: '#32C96A', x: 8, h: 150 },
{ label: 'תחנת כיבוי', color: '#FFF3E0', border: '#FF7A30', x: 28, h: 120 },
{ label: 'סופרמרקט', color: '#EAF5FF', border: '#1E5AA8', x: 48, h: 100 },
{ label: 'תשתית חשמל', color: '#E3F2FD', border: '#4A9FDB', x: 68, h: 130 },
{ label: 'תחבורה ציבורית', color: '#F3E5F5', border: '#9C27B0', x: 88, h: 90 }];


export default function Scenario01({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
    setTimeout(() => setPhase(1), 1300),
    setTimeout(() => setPhase(2), 2900),
    setTimeout(() => setPhase(3), 4800),
    setTimeout(() => onComplete(), 5200)];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: phase >= 2 ? phase >= 3 ? 1.3 : 1.15 : 1,
          x: phase >= 2 ? -20 : 0
        }}
        transition={{ duration: 1, ease: 'easeInOut' }}>
        
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #C8E4FF 0%, #EAF5FF 50%, #F0F8FF 100%)' }} />

        <motion.div className="absolute top-6 right-10" animate={{ x: [0, -30, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}>
          <Cloud scale={1} />
        </motion.div>
        <motion.div className="absolute top-12 left-16" animate={{ x: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}>
          <Cloud scale={0.7} />
        </motion.div>

        <div className="absolute bottom-0 w-full flex items-end justify-around px-4">
          {SERVICES.map((s, i) =>
          <div key={i} className="flex flex-col items-center relative">
              <motion.div
              animate={{
                opacity: phase >= 1 && phase < 2 ? 0.5 : 1
              }}
              transition={{ duration: 0.5 }}>
              
                <Building width={55} height={s.h} color={s.color} roofColor={s.border} />
              </motion.div>
              <motion.div
              className="absolute -inset-2 rounded-2xl pointer-events-none"
              animate={{
                opacity: phase >= 2 && i < 4 ? [0, 0.7, 0] : 0,
                scale: phase >= 2 && i < 4 ? [1, 1.05, 1] : 1
              }}
              transition={{ duration: 2, repeat: phase >= 2 ? Infinity : 0, delay: i * 0.2 }}
              style={{ boxShadow: `0 0 25px ${s.border}`, border: `2px solid ${s.border}` }} />
            
              <div className="text-sm font-bold text-blue-900 mt-1 whitespace-nowrap bg-white/60 px-2 rounded">{s.label}</div>
              {phase >= 2 && i < 4 &&
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.2, type: 'spring' }}
              className="absolute -top-6 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              
                  פועל ✓
                </motion.div>
            }
            </div>
          )}
        </div>

        <motion.div className="absolute bottom-1 right-0" animate={{ x: ['100%', '-100px'] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>
          <Car color="#E74C3C" />
        </motion.div>

        <motion.div className="absolute bottom-2 left-10" animate={{ x: [0, 60, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
          <Person pose="walking" shirt="#1E5AA8" size={0.6} />
        </motion.div>
      </motion.div>

      <EmergencyAlert active={phase >= 1 && phase < 3} />
    </div>);

}