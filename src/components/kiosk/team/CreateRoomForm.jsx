import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import OnScreenKeyboard from '@/components/kiosk/OnScreenKeyboard';
import { generateRoomCode, saveTeamSession } from '@/lib/roomHelpers';
import { getKioskId } from '@/lib/kioskId';
import { base44 } from '@/api/base44Client';
import { questions } from '@/data/questions';

const TIME_OPTIONS = [30, 45, 60, 90, 120];
const QUESTION_OPTIONS = [5, 6, 7, 8, 9, 10];

export default function CreateRoomForm({ onCreated, onBack }) {
  const [roomName, setRoomName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [questionCount, setQuestionCount] = useState(7);
  const [timePerQuestion, setTimePerQuestion] = useState(60);
  const [creating, setCreating] = useState(false);

  const kioskId = getKioskId();
  const canCreate = roomName.trim().length > 0 && teamName.trim().length > 0;

  const handleCreate = async () => {
    if (!canCreate || creating) return;
    setCreating(true);
    try {
      const code = generateRoomCode();
      const now = new Date().toISOString();
      const room = await base44.entities.Room.create({
        code,
        name: roomName.trim(),
        status: 'waiting',
        host_kiosk_id: kioskId,
        question_count: questionCount,
        time_per_question: timePerQuestion,
        question_data: '',
        current_question_index: 0,
        countdown_starts_at: '',
        question_started_at: '',
        locked: false,
        last_activity: now,
      });
      const team = await base44.entities.Team.create({
        room_id: room.id,
        team_name: teamName.trim(),
        score: 0,
        answers: '[]',
        kiosk_id: kioskId,
        finished: false,
      });
      saveTeamSession(code, team.id);
      onCreated(room, team);
    } catch (e) {
      setCreating(false);
    }
  };

  return (
    <motion.main className="flex flex-col h-full overflow-y-auto no-scrollbar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <header className="text-center pt-24 pb-4 px-8">
        <h2 className="text-4xl font-bold text-blue-700 mb-2">יצירת חדר חדש</h2>
        <p className="text-xl text-blue-500">הגדירו את החדר ואת הקבוצה שלכם</p>
      </header>

      <section className="flex-1 flex flex-col items-center px-8 pb-8 gap-5">
        <div className="w-full max-w-2xl">
          <p className="text-xl font-bold text-blue-900 text-center mb-3">שם החדר</p>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border-2 border-blue-200 p-4 mb-3 min-h-[60px] flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-950">{roomName || <span className="text-blue-300 font-normal">הזינו שם לחדר</span>}</span>
          </div>
          <OnScreenKeyboard value={roomName} onChange={setRoomName} maxLength={20} />
        </div>

        <div className="w-full max-w-2xl">
          <p className="text-xl font-bold text-blue-900 text-center mb-3">מספר שאלות</p>
          <div className="flex gap-2 justify-center">
            {QUESTION_OPTIONS.map(n => (
              <button key={n} onClick={() => setQuestionCount(n)} className={`w-14 h-14 rounded-xl text-xl font-bold transition-colors ${questionCount === n ? 'bg-blue-600 text-white border-2 border-blue-700' : 'bg-white text-blue-700 border-2 border-blue-200 hover:border-blue-400'}`}>{n}</button>
            ))}
          </div>
        </div>

        <div className="w-full max-w-2xl">
          <p className="text-xl font-bold text-blue-900 text-center mb-3">זמן לכל שאלה</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {TIME_OPTIONS.map(t => (
              <button key={t} onClick={() => setTimePerQuestion(t)} className={`px-6 h-14 rounded-xl text-xl font-bold transition-colors ${timePerQuestion === t ? 'bg-blue-600 text-white border-2 border-blue-700' : 'bg-white text-blue-700 border-2 border-blue-200 hover:border-blue-400'}`}>{t} שניות</button>
            ))}
          </div>
        </div>

        <div className="w-full max-w-2xl">
          <p className="text-xl font-bold text-blue-900 text-center mb-3">שם הקבוצה שלכם</p>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border-2 border-blue-200 p-4 mb-3 min-h-[60px] flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-950">{teamName || <span className="text-blue-300 font-normal">הזינו שם קבוצה</span>}</span>
          </div>
          <OnScreenKeyboard value={teamName} onChange={setTeamName} maxLength={20} />
        </div>

        <motion.button
          onClick={handleCreate}
          disabled={!canCreate || creating}
          className="px-16 py-6 rounded-full text-2xl font-bold shadow-2xl flex items-center gap-3 transition-all"
          style={{ background: canCreate && !creating ? 'linear-gradient(135deg, #1E5AA8, #2A6BC4)' : '#cbd5e1', color: canCreate && !creating ? 'white' : '#94a3b8' }}
          whileHover={canCreate && !creating ? { scale: 1.03 } : {}}
          whileTap={canCreate && !creating ? { scale: 0.96 } : {}}
        >
          {creating ? 'יוצר חדר...' : 'צרו חדר'}
          <Check className="w-7 h-7" />
        </motion.button>
      </section>

      <nav className="pb-6 flex justify-center">
        <button onClick={onBack} className="text-blue-500 text-xl hover:text-blue-700 transition-colors flex items-center gap-2">→ חזרה</button>
      </nav>
    </motion.main>
  );
}