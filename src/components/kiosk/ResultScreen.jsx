import { motion } from 'framer-motion';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Leaderboard from '@/components/kiosk/Leaderboard';
import { base44 } from '@/api/base44Client';

function getLevel(percentage) {
  if (percentage === 100) return { label: 'מושלם!\nכל התשובות נכונות', icon: '🏅' };
  if (percentage >= 80) return { label: 'מצטיינים', icon: '🏅' };
  if (percentage >= 60) return { label: 'מומחים', icon: '🏅' };
  if (percentage >= 40) return { label: 'מתקדמים', icon: '🏅' };
  return { label: 'מתחילים', icon: '🏅' };
}

export default function ResultScreen({ score, correctCount, total, onNewGame, onHome, playerName }) {
  const percentage = Math.round((correctCount / total) * 100);
  const level = getLevel(percentage);
  useEffect(() => {
    if (playerName) {
      base44.entities.ScoreEntry.create({
        player_name: playerName,
        score,
        correct_count: correctCount,
        total,
        mode: 'single',
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const duration = 2500;
    const end = Date.now() + duration;
    const colors = ['#1E5AA8', '#32C96A', '#FF7A30', '#4A9FDB'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    });
  }, []);

  return (
    <motion.main
      className="relative flex flex-col items-center justify-center h-full p-8 text-center overflow-y-auto no-scrollbar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 1, delay: 0.2 }}
        className="text-9xl mb-2"
        aria-hidden="true"
      >
        {level.icon}
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-5xl font-bold text-blue-950 mb-1 whitespace-pre-line"
      >
        {level.label}
      </motion.h2>
      <p className="text-2xl text-blue-500 mb-8">הטריוויה הושלמה</p>

      {playerName && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <p className="text-xl text-blue-500">שחקן / קבוצה</p>
          <p className="text-4xl font-bold text-blue-950">{playerName}</p>
        </motion.div>
      )}

      <motion.section
        className="bg-white/80 backdrop-blur-md rounded-3xl p-10 shadow-xl mb-8 min-w-[420px]"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        aria-label="תוצאות"
      >
        <motion.div
          className="text-7xl font-bold mb-1"
          style={{ color: '#1E5AA8' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.9 }}
        >
          {percentage}%
        </motion.div>
        <p className="text-xl text-blue-400 mb-5">אחוז הצלחה</p>
        <div className="h-px bg-blue-100 mb-6" />
        <div className="flex items-center justify-center gap-3 flex-wrap text-2xl">
          <span className="font-bold text-blue-950">{score} נקודות</span>
          <span className="text-blue-300 font-bold">|</span>
          <span className="font-bold text-blue-950">
            {correctCount} תשובות נכונות מתוך {total} שאלות
          </span>
        </div>
      </motion.section>

      {playerName && (
        <Leaderboard />
      )}

      <motion.nav
        className="w-full max-w-md space-y-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.button
          onClick={onNewGame}
          className="w-full min-h-[90px] rounded-2xl text-white text-3xl font-bold shadow-lg"
          style={{ background: 'linear-gradient(135deg, #1E5AA8, #2A6BC4)' }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
        >
          משחק חדש
        </motion.button>
        <motion.button
          onClick={onHome}
          className="w-full min-h-[90px] rounded-2xl bg-white border-2 border-blue-200 text-blue-700 text-3xl font-bold shadow-lg hover:border-blue-400 transition-colors"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
        >
          חזרה למסך הראשי
        </motion.button>
      </motion.nav>
    </motion.main>
  );
}