import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function AnimatedScore({ score }) {
  const [displayScore, setDisplayScore] = useState(score);
  const [glowing, setGlowing] = useState(false);
  const prevScoreRef = useRef(score);

  useEffect(() => {
    const prevScore = prevScoreRef.current;
    if (score > prevScore) {
      setGlowing(true);

      const start = prevScore;
      const end = score;
      const duration = 700;
      const startTime = Date.now();

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayScore(Math.round(start + (end - start) * eased));
        if (progress >= 1) clearInterval(interval);
      }, 16);

      const glowTimer = setTimeout(() => setGlowing(false), 1200);

      prevScoreRef.current = score;
      return () => {
        clearInterval(interval);
        clearTimeout(glowTimer);
      };
    }
    prevScoreRef.current = score;
    setDisplayScore(score);
  }, [score]);

  return (
    <div className="relative bg-blue-100 rounded-2xl px-5 py-2 text-center">
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={glowing ? { boxShadow: '0 0 18px 2px rgba(30,90,168,0.5)' } : { boxShadow: '0 0 0px rgba(30,90,168,0)' }}
        transition={{ duration: 0.3 }}
      />
      <p className="text-sm text-blue-500 relative">ניקוד</p>
      <p className="text-xl font-bold text-blue-700 relative">{displayScore}</p>
    </div>
  );
}