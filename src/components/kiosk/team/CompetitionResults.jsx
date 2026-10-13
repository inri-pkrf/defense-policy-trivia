import { motion } from 'framer-motion';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { base44 } from '@/api/base44Client';

export default function CompetitionResults({ teams, room, team, onExit }) {
  const sorted = [...teams].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  useEffect(() => {
    if (team) {
      base44.entities.ScoreEntry.create({
        player_name: team.team_name,
        score: team.score,
        correct_count: Math.round(team.score / 10),
        total: room.question_count,
        mode: 'team',
      }).catch(() => {});
    }
    const colors = ['#1E5AA8', '#32C96A', '#FF7A30', '#4A9FDB'];
    const end = Date.now() + 4000;
    (function frame() {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 }, colors });
  }, []);

  return (
    <motion.main className="flex flex-col h-full items-center justify-center overflow-y-auto no-scrollbar pt-[76px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', duration: 1, delay: 0.2 }} className="text-8xl mb-2">🏆</motion.div>
      <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-5xl font-bold text-blue-950 mb-1">הקבוצה הזוכה</motion.h2>
      {winner && (
        <motion.p initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.7, type: 'spring' }} className="text-4xl font-bold mb-6" style={{ color: '#1E5AA8' }}>{winner.team_name}</motion.p>
      )}

      <section className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl mb-6 max-w-md w-full mx-8">
        <h3 className="text-2xl font-bold text-blue-950 mb-4 text-center">דירוג סופי</h3>
        <div className="space-y-2">
          {sorted.map((t, i) => (
            <div key={t.id} className={`flex items-center justify-between rounded-2xl px-5 py-3 ${i === 0 ? 'bg-orange-50 border-2 border-orange-200' : 'bg-blue-50'}`}>
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${i === 0 ? 'bg-orange-500 text-white' : 'bg-blue-200 text-blue-700'}`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </span>
                <span className="text-lg font-bold text-blue-950">{t.team_name}</span>
              </div>
              <span className="text-xl font-bold text-blue-700">{t.score} נק'</span>
            </div>
          ))}
        </div>
      </section>

      <motion.nav className="w-full max-w-md space-y-3 px-8" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}>
        <button onClick={onExit} className="w-full min-h-[72px] rounded-2xl text-white text-2xl font-bold shadow-lg" style={{ background: 'linear-gradient(135deg, #1E5AA8, #2A6BC4)' }}>
          חזרה למסך הראשי
        </button>
      </motion.nav>
    </motion.main>
  );
}