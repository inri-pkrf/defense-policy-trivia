import { motion } from 'framer-motion';

export default function FlyingPoints({ id, isStreak, streakCount, onComplete }) {
  const color = isStreak ? '#FF6B35' : '#1E5AA8';
  const glowColor = isStreak ? 'rgba(255,107,53,0.7)' : 'rgba(30,90,168,0.7)';

  return (
    <motion.div
      className="fixed z-[65] pointer-events-none"
      initial={{
        left: '50%',
        top: '42%',
        x: '-50%',
        y: '-50%',
        scale: 1.8,
        opacity: 0,
      }}
      animate={{
        left: isStreak ? '11%' : '4%',
        top: '68px',
        x: '-50%',
        y: '-50%',
        scale: 0.4,
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 1.4,
        ease: 'easeInOut',
        times: [0, 0.15, 0.75, 1],
      }}
      onAnimationComplete={onComplete}
    >
      <span
        className="text-4xl font-bold"
        style={{
          color,
          textShadow: `0 0 15px ${glowColor}, 0 0 30px ${glowColor}, 0 0 45px ${glowColor}`,
        }}
      >
        {isStreak ? `🔥 ${streakCount}` : '+10'}
      </span>
    </motion.div>
  );
}