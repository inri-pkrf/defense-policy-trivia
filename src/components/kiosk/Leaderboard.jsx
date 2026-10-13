import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

const MAX_ENTRIES = 10;

const FILTERS = [
  { key: 'today', label: 'היום' },
  { key: 'week', label: 'השבוע' },
  { key: 'all', label: 'כל הזמנים' },
];

function getStartOfPeriod(filter) {
  const now = new Date();
  if (filter === 'today') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (filter === 'week') {
    const day = now.getDay();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - day);
    sunday.setHours(0, 0, 0, 0);
    return sunday;
  }
  return null;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState('today');

  const fetchEntries = async (f) => {
    try {
      const all = await base44.entities.ScoreEntry.list('-score', 100);
      const startDate = getStartOfPeriod(f);
      let filtered = all;
      if (startDate) {
        filtered = all.filter((e) => new Date(e.created_date) >= startDate);
      }
      setEntries(filtered.slice(0, MAX_ENTRIES));
    } catch {
      setEntries([]);
    }
  };

  useEffect(() => {
    fetchEntries(filter);
  }, [filter]);

  useEffect(() => {
    const unsubscribe = base44.entities.ScoreEntry.subscribe(() => {
      fetchEntries(filter);
    });
    return unsubscribe;
  }, [filter]);

  if (entries.length === 0) return null;

  const ranks = entries.map((entry, i) => {
    const firstSame = entries.findIndex((e) => (e.score || 0) === (entry.score || 0));
    return firstSame + 1;
  });

  return (
    <motion.section
      className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl w-full max-w-md mb-8"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2 }}
      aria-label="לוח תוצאות"
    >
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-bold text-blue-950">לוח תוצאות</h3>
        <Trophy className="w-6 h-6 text-orange-500" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 bg-blue-50 rounded-xl p-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
              filter === f.key ? 'bg-blue-600 text-white shadow-md' : 'text-blue-500 hover:bg-blue-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {entries.map((entry, i) => {
          const rank = ranks[i];
          const isFirst = rank === 1;
          const pct = Math.round((entry.correct_count / entry.total) * 100);
          return (
            <div
              key={entry.id || i}
              className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
                isFirst ? 'bg-orange-50 border-2 border-orange-200' : 'bg-blue-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                    isFirst ? 'bg-orange-500 text-white' : 'bg-blue-200 text-blue-700'
                  }`}
                >
                  {isFirst ? '🥇' : rank}
                </span>
                <span className="text-lg font-medium text-blue-950">{entry.player_name}</span>
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-blue-700">{pct}%</div>
                <div className="text-xs text-blue-500">
                  {entry.correct_count} מתוך {entry.total} | {entry.score} נקודות
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}