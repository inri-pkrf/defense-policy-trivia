import { motion } from 'framer-motion';
import { Play, X, Lock, Unlock, Trash2, Users, DoorOpen } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { shuffleQuestions } from '@/data/questions';

export default function WaitingRoom({ room, teams, team, isHost, onLeave }) {
  const handleStart = async () => {
    const qs = shuffleQuestions(room.question_count);
    await base44.entities.Room.update(room.id, {
      status: 'countdown',
      question_data: JSON.stringify(qs),
      countdown_starts_at: new Date(Date.now() + 5000).toISOString(),
      locked: true,
      last_activity: new Date().toISOString(),
    });
  };

  const handleCancel = async () => {
    await base44.entities.Room.update(room.id, {
      status: 'closed',
      last_activity: new Date().toISOString(),
    });
    onLeave();
  };

  const handleRemoveTeam = async (teamId) => {
    await base44.entities.Team.delete(teamId).catch(() => {});
  };

  const handleToggleLock = async () => {
    await base44.entities.Room.update(room.id, {
      locked: !room.locked,
      last_activity: new Date().toISOString(),
    });
  };

  return (
    <motion.main className="flex flex-col h-full overflow-y-auto no-scrollbar pt-[76px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8 gap-6">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl text-center max-w-md w-full">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DoorOpen className="w-6 h-6 text-blue-500" />
            <h2 className="text-3xl font-bold text-blue-950">{room.name}</h2>
          </div>
          <p className="text-lg text-blue-500 mb-1">קוד החדר</p>
          <p className="text-5xl font-bold text-blue-700 tracking-widest">{room.code}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-bold text-blue-950">קבוצות מחוברות ({teams.length})</h3>
            </div>
            {isHost && (
              <button onClick={handleToggleLock} className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors ${room.locked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {room.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                {room.locked ? 'נעול' : 'פתוח'}
              </button>
            )}
          </div>
          <div className="space-y-2">
            {teams.map(t => (
              <div key={t.id} className={`flex items-center justify-between rounded-xl px-4 py-3 ${t.id === team?.id ? 'bg-blue-100 border-2 border-blue-300' : 'bg-blue-50'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🟢</span>
                  <span className="text-lg font-medium text-blue-950">{t.team_name}</span>
                </div>
                {isHost && t.id !== team?.id && (
                  <button onClick={() => handleRemoveTeam(t.id)} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {isHost ? (
          <div className="flex flex-col gap-3 w-full max-w-md">
            <motion.button
              onClick={handleStart}
              disabled={teams.length < 2}
              className="w-full min-h-[72px] rounded-2xl text-white text-2xl font-bold shadow-lg flex items-center justify-center gap-3"
              style={{ background: teams.length < 2 ? '#cbd5e1' : 'linear-gradient(135deg, #1E5AA8, #2A6BC4)' }}
              whileHover={teams.length >= 2 ? { scale: 1.01 } : {}}
              whileTap={teams.length >= 2 ? { scale: 0.97 } : {}}
            >
              <Play className="w-7 h-7" fill="white" />
              התחלת התחרות
            </motion.button>
            {teams.length < 2 && (
              <p className="text-center text-blue-500 text-sm">נדרשות לפחות 2 קבוצות כדי להתחיל</p>
            )}
            <button onClick={handleCancel} className="w-full min-h-[56px] rounded-2xl bg-white border-2 border-red-200 text-red-600 text-xl font-bold shadow-lg hover:border-red-400 transition-colors flex items-center justify-center gap-2">
              <X className="w-6 h-6" />
              ביטול החדר
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="text-xl text-blue-600 font-medium">
              ממתינים למארח להתחיל את המשחק...
            </motion.div>
            <button onClick={onLeave} className="text-blue-500 text-lg hover:text-blue-700 transition-colors">יציאה מהחדר</button>
          </div>
        )}
      </div>
    </motion.main>
  );
}