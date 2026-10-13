import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DoorOpen, Hash, Users } from 'lucide-react';
import OnScreenKeyboard from '@/components/kiosk/OnScreenKeyboard';
import { saveTeamSession } from '@/lib/roomHelpers';
import { getKioskId } from '@/lib/kioskId';
import { base44 } from '@/api/base44Client';

export default function JoinRoomScreen({ onJoined, onBack }) {
  const [tab, setTab] = useState('open');
  const [rooms, setRooms] = useState([]);
  const [code, setCode] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  const kioskId = getKioskId();

  useEffect(() => {
    if (tab !== 'open' || selectedRoom) return;
    const fetchRooms = async () => {
      try {
        const all = await base44.entities.Room.list('-created_date', 50);
        const now = Date.now();
        const open = all.filter(r => r.status === 'waiting' && !r.locked &&
          (now - new Date(r.last_activity || r.created_date).getTime()) < 15 * 60 * 1000);
        setRooms(open);
      } catch { setRooms([]); }
    };
    fetchRooms();
    const interval = setInterval(fetchRooms, 3000);
    return () => clearInterval(interval);
  }, [tab, selectedRoom]);

  const handleSelectRoom = (r) => { setSelectedRoom(r); setError(''); };

  const handleCodeSearch = async () => {
    if (code.length !== 6) return;
    setJoining(true);
    setError('');
    try {
      const found = await base44.entities.Room.filter({ code });
      if (!found || found.length === 0) { setError('חדר לא נמצא'); setJoining(false); return; }
      const r = found[0];
      if (r.status !== 'waiting' || r.locked) { setError('החדר סגור להצטרפות'); setJoining(false); return; }
      setSelectedRoom(r);
      setJoining(false);
    } catch { setError('שגיאה בחיפוש חדר'); setJoining(false); }
  };

  const handleJoin = async () => {
    if (!selectedRoom || !teamName.trim()) return;
    setJoining(true);
    try {
      const team = await base44.entities.Team.create({
        room_id: selectedRoom.id,
        team_name: teamName.trim(),
        score: 0,
        answers: '[]',
        kiosk_id: kioskId,
        finished: false,
      });
      saveTeamSession(selectedRoom.code, team.id);
      onJoined(selectedRoom, team);
    } catch { setError('שגיאה בהצטרפות'); setJoining(false); }
  };

  if (selectedRoom) {
    return (
      <motion.main className="flex flex-col h-full overflow-y-auto no-scrollbar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <header className="text-center pt-24 pb-4 px-8">
          <h2 className="text-4xl font-bold text-blue-700 mb-2">הצטרפות לחדר</h2>
          <p className="text-xl text-blue-500">{selectedRoom.name} • קוד: {selectedRoom.code}</p>
        </header>
        <section className="flex-1 flex flex-col items-center px-8 pb-8 gap-5">
          <div className="w-full max-w-2xl">
            <p className="text-xl font-bold text-blue-900 text-center mb-3">שם הקבוצה שלכם</p>
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border-2 border-blue-200 p-4 mb-3 min-h-[60px] flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-950">{teamName || <span className="text-blue-300 font-normal">הזינו שם קבוצה</span>}</span>
            </div>
            <OnScreenKeyboard value={teamName} onChange={setTeamName} maxLength={20} />
          </div>
          <motion.button
            onClick={handleJoin}
            disabled={!teamName.trim() || joining}
            className="px-16 py-6 rounded-full text-2xl font-bold shadow-2xl flex items-center gap-3 transition-all"
            style={{ background: teamName.trim() && !joining ? 'linear-gradient(135deg, #1E5AA8, #2A6BC4)' : '#cbd5e1', color: teamName.trim() && !joining ? 'white' : '#94a3b8' }}
            whileHover={teamName.trim() && !joining ? { scale: 1.03 } : {}}
            whileTap={teamName.trim() && !joining ? { scale: 0.96 } : {}}
          >
            {joining ? 'מצטרף...' : 'הצטרפות לחדר'}
          </motion.button>
          <button onClick={() => setSelectedRoom(null)} className="text-blue-500 text-lg hover:text-blue-700 transition-colors">→ חזרה לרשימת החדרים</button>
        </section>
      </motion.main>
    );
  }

  return (
    <motion.main className="flex flex-col h-full overflow-y-auto no-scrollbar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <header className="text-center pt-24 pb-4 px-8">
        <h2 className="text-4xl font-bold text-blue-700 mb-2">הצטרפות לחדר</h2>
        <p className="text-xl text-blue-500">בחרו חדר פתוח או הזינו קוד</p>
      </header>

      <div className="flex gap-2 justify-center mb-4 px-8">
        <button onClick={() => setTab('open')} className={`px-8 py-3 rounded-xl text-lg font-bold transition-colors ${tab === 'open' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-2 border-blue-200'}`}>חדרים פתוחים</button>
        <button onClick={() => setTab('code')} className={`px-8 py-3 rounded-xl text-lg font-bold transition-colors ${tab === 'code' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-2 border-blue-200'}`}>הזנת קוד</button>
      </div>

      <section className="flex-1 flex flex-col items-center px-8 pb-8 gap-4">
        {tab === 'open' ? (
          <div className="w-full max-w-2xl space-y-3">
            {rooms.length === 0 ? (
              <p className="text-center text-xl text-blue-400 py-12">אין חדרים פתוחים כרגע</p>
            ) : (
              rooms.map(r => (
                <button key={r.id} onClick={() => handleSelectRoom(r)} className="w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border-2 border-blue-100 hover:border-blue-400 transition-colors p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DoorOpen className="w-8 h-8 text-blue-500" />
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-950">{r.name}</div>
                      <div className="text-sm text-blue-500">קוד: {r.code}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Users className="w-5 h-5" />
                    <span className="text-lg font-bold">קבוצות</span>
                  </div>
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="w-full max-w-2xl flex flex-col items-center gap-4">
            <p className="text-xl font-bold text-blue-900 text-center">הזינו קוד חדר (6 ספרות)</p>
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border-2 border-blue-200 p-4 min-h-[60px] w-full max-w-md flex items-center justify-center">
              <span className="text-4xl font-bold text-blue-950 tracking-widest">{code || <span className="text-blue-300 font-normal text-2xl">------</span>}</span>
            </div>
            <OnScreenKeyboard value={code} onChange={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))} maxLength={6} />
            {error && <p className="text-red-500 text-lg">{error}</p>}
            <motion.button
              onClick={handleCodeSearch}
              disabled={code.length !== 6 || joining}
              className="px-12 py-5 rounded-full text-xl font-bold shadow-2xl flex items-center gap-2 transition-all"
              style={{ background: code.length === 6 && !joining ? 'linear-gradient(135deg, #1E5AA8, #2A6BC4)' : '#cbd5e1', color: code.length === 6 && !joining ? 'white' : '#94a3b8' }}
              whileHover={code.length === 6 && !joining ? { scale: 1.03 } : {}}
              whileTap={code.length === 6 && !joining ? { scale: 0.96 } : {}}
            >
              <Hash className="w-6 h-6" />
              חיפוש חדר
            </motion.button>
          </div>
        )}
      </section>

      <nav className="pb-6 flex justify-center">
        <button onClick={onBack} className="text-blue-500 text-xl hover:text-blue-700 transition-colors flex items-center gap-2">→ חזרה</button>
      </nav>
    </motion.main>
  );
}