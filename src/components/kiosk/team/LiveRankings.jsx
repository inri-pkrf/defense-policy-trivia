import { motion } from 'framer-motion';

export default function LiveRankings({ teams, room }) {
  const sorted = [...teams].sort((a, b) => b.score - a.score);

  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center pt-[76px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <h2 className="text-4xl font-bold text-blue-950 mb-2">דירוג נוכחי</h2>
      <p className="text-lg text-blue-500 mb-6">שאלה {room.current_question_index + 1} / {room.question_count}</p>
      <div className="space-y-3 w-full max-w-md px-8">
        {sorted.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center justify-between rounded-2xl px-6 py-4 ${i === 0 ? 'bg-orange-50 border-2 border-orange-200' : 'bg-blue-50'}`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold ${i === 0 ? 'bg-orange-500 text-white' : i === 1 ? 'bg-blue-300 text-blue-800' : i === 2 ? 'bg-blue-200 text-blue-700' : 'bg-blue-100 text-blue-600'}`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
              </span>
              <span className="text-xl font-bold text-blue-950">{t.team_name}</span>
            </div>
            <span className="text-2xl font-bold text-blue-700">{t.score}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}