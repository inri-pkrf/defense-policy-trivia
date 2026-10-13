import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DoorOpen, Users } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getKioskId } from '@/lib/kioskId';
import { loadTeamSession, clearTeamSession } from '@/lib/roomHelpers';
import CreateRoomForm from './CreateRoomForm';
import JoinRoomScreen from './JoinRoomScreen';
import WaitingRoom from './WaitingRoom';
import CompetitionCountdown from './CompetitionCountdown';
import CompetitionPlay from './CompetitionPlay';
import LiveRankings from './LiveRankings';
import CompetitionResults from './CompetitionResults';

export default function TeamCompetition({ onExit }) {
  const [subPhase, setSubPhase] = useState('menu');
  const [room, setRoom] = useState(null);
  const [team, setTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const kioskId = getKioskId();
  const recoveryDone = useRef(false);
  const advancingRef = useRef(false);

  const isHost = room?.host_kiosk_id === kioskId;

  // Recovery on mount
  useEffect(() => {
    if (recoveryDone.current) return;
    recoveryDone.current = true;
    const session = loadTeamSession();
    if (!session) return;
    (async () => {
      try {
        const foundRooms = await base44.entities.Room.filter({ code: session.roomCode });
        if (foundRooms && foundRooms.length > 0) {
          const r = foundRooms[0];
          if (r.status !== 'closed') {
            const foundTeam = await base44.entities.Team.get(session.teamId);
            if (foundTeam) {
              setRoom(r);
              setTeam(foundTeam);
              if (r.status === 'waiting') setSubPhase('waiting');
              else if (r.status === 'countdown') setSubPhase('countdown');
              else if (r.status === 'playing') setSubPhase('play');
              else if (r.status === 'rankings') setSubPhase('rankings');
              else if (r.status === 'results') setSubPhase('results');
              return;
            }
          }
        }
        clearTeamSession();
      } catch {}
    })();
  }, []);

  // Subscribe to room changes
  useEffect(() => {
    if (!room) return;
    const unsub = base44.entities.Room.subscribe((event) => {
      if (event.data?.id === room.id) setRoom(event.data);
    });
    return unsub;
  }, [room?.id]);

  // Subscribe to team changes
  useEffect(() => {
    if (!room) return;
    const fetchTeams = async () => {
      try {
        const all = await base44.entities.Team.filter({ room_id: room.id });
        setTeams(all);
        const myTeam = all.find(t => t.kiosk_id === kioskId);
        if (myTeam) setTeam(myTeam);
      } catch {}
    };
    fetchTeams();
    const unsub = base44.entities.Team.subscribe(() => fetchTeams());
    return unsub;
  }, [room?.id]);

  // Parse questions
  useEffect(() => {
    if (room?.question_data) {
      try { setQuestions(JSON.parse(room.question_data)); } catch {}
    }
  }, [room?.question_data]);

  // React to room status changes
  useEffect(() => {
    if (!room) return;
    const status = room.status;
    if (status === 'countdown' && subPhase !== 'countdown') setSubPhase('countdown');
    else if (status === 'playing' && (subPhase === 'countdown' || subPhase === 'rankings')) setSubPhase('play');
    else if (status === 'rankings' && subPhase !== 'rankings') setSubPhase('rankings');
    else if (status === 'results' && subPhase !== 'results') setSubPhase('results');
    else if (status === 'closed') { clearTeamSession(); onExit(); }
  }, [room?.status]);

  // HOST: countdown → playing
  useEffect(() => {
    if (!isHost || !room || room.status !== 'countdown') return;
    const startTime = new Date(room.countdown_starts_at).getTime();
    const delay = startTime + 500 - Date.now();
    const timer = setTimeout(() => {
      base44.entities.Room.update(room.id, {
        status: 'playing',
        current_question_index: 0,
        question_started_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
      });
    }, Math.max(0, delay));
    return () => clearTimeout(timer);
  }, [isHost, room?.status, room?.countdown_starts_at]);

  // Reset advancing flag when question changes
  useEffect(() => {
    advancingRef.current = false;
  }, [room?.current_question_index, room?.status]);

  // HOST: advance question when timer ends
  useEffect(() => {
    if (!isHost || !room || room.status !== 'playing' || advancingRef.current) return;
    const startTime = new Date(room.question_started_at).getTime();
    const endTime = startTime + room.time_per_question * 1000;
    const delay = endTime - Date.now();
    if (delay <= 0) { advancingRef.current = true; advanceQuestion(); return; }
    const timer = setTimeout(() => {
      if (advancingRef.current) return;
      advancingRef.current = true;
      advanceQuestion();
    }, delay);
    return () => clearTimeout(timer);
  }, [isHost, room?.status, room?.question_started_at, room?.current_question_index]);

  // HOST: advance when all teams have answered
  useEffect(() => {
    if (!isHost || !room || room.status !== 'playing' || advancingRef.current) return;
    if (teams.length < 2) return;
    const currentIdx = room.current_question_index;
    const allAnswered = teams.every(t => {
      try {
        const ans = JSON.parse(t.answers || '[]');
        return ans.some(a => a.questionIndex === currentIdx);
      } catch { return false; }
    });
    if (allAnswered) {
      advancingRef.current = true;
      advanceQuestion();
    }
  }, [isHost, room?.status, room?.current_question_index, teams]);

  // HOST: advance after rankings
  useEffect(() => {
    if (!isHost || !room || room.status !== 'rankings') return;
    const timer = setTimeout(() => advanceAfterRankings(), 5000);
    return () => clearTimeout(timer);
  }, [isHost, room?.status]);

  const advanceQuestion = () => {
    if (!room) return;
    const currentIdx = room.current_question_index;
    const isLast = currentIdx + 1 >= room.question_count;
    const showRankings = (currentIdx + 1) % 3 === 0 && !isLast;
    const now = new Date().toISOString();
    if (isLast) {
      base44.entities.Room.update(room.id, { status: 'results', last_activity: now });
    } else if (showRankings) {
      base44.entities.Room.update(room.id, { status: 'rankings', last_activity: now });
    } else {
      base44.entities.Room.update(room.id, {
        current_question_index: currentIdx + 1,
        question_started_at: new Date().toISOString(),
        last_activity: now,
      });
    }
  };

  const advanceAfterRankings = () => {
    if (!room) return;
    const nextIdx = room.current_question_index + 1;
    const isLast = nextIdx >= room.question_count;
    const now = new Date().toISOString();
    if (isLast) {
      base44.entities.Room.update(room.id, { status: 'results', last_activity: now });
    } else {
      base44.entities.Room.update(room.id, {
        status: 'playing',
        current_question_index: nextIdx,
        question_started_at: new Date().toISOString(),
        last_activity: now,
      });
    }
  };

  const handleAnswer = async (questionIndex, selectedIndex, isCorrect, timeRemaining, totalTime) => {
    if (!team || !room) return;
    try {
      const answers = JSON.parse(team.answers || '[]');
      if (answers.some(a => a.questionIndex === questionIndex)) return;
      const speedBonus = isCorrect ? Math.round((timeRemaining / totalTime) * 5) : 0;
      const points = isCorrect ? 10 + speedBonus : 0;
      answers.push({ questionIndex, selectedIndex, isCorrect, points });
      const updated = await base44.entities.Team.update(team.id, {
        answers: JSON.stringify(answers),
        score: team.score + points,
      });
      setTeam(updated);
    } catch {}
  };

  const handleCreated = (r, t) => { setRoom(r); setTeam(t); setSubPhase('waiting'); };
  const handleJoined = (r, t) => { setRoom(r); setTeam(t); setSubPhase('waiting'); };

  return (
    <AnimatePresence mode="wait">
      {subPhase === 'menu' && (
        <motion.div key="tc-menu" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <TeamMenu onCreate={() => setSubPhase('create')} onJoin={() => setSubPhase('join')} onBack={onExit} />
        </motion.div>
      )}
      {subPhase === 'create' && (
        <motion.div key="tc-create" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <CreateRoomForm onCreated={handleCreated} onBack={() => setSubPhase('menu')} />
        </motion.div>
      )}
      {subPhase === 'join' && (
        <motion.div key="tc-join" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <JoinRoomScreen onJoined={handleJoined} onBack={() => setSubPhase('menu')} />
        </motion.div>
      )}
      {subPhase === 'waiting' && room && (
        <motion.div key="tc-waiting" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <WaitingRoom room={room} teams={teams} team={team} isHost={isHost} onLeave={() => { clearTeamSession(); onExit(); }} />
        </motion.div>
      )}
      {subPhase === 'countdown' && room && (
        <motion.div key="tc-countdown" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <CompetitionCountdown room={room} />
        </motion.div>
      )}
      {subPhase === 'play' && room && questions.length > 0 && (
        <motion.div key="tc-play" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <CompetitionPlay room={room} team={team} teams={teams} questions={questions} onAnswer={handleAnswer} />
        </motion.div>
      )}
      {subPhase === 'rankings' && (
        <motion.div key="tc-rankings" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <LiveRankings teams={teams} room={room} />
        </motion.div>
      )}
      {subPhase === 'results' && (
        <motion.div key="tc-results" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <CompetitionResults teams={teams} room={room} team={team} onExit={() => { clearTeamSession(); onExit(); }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TeamMenu({ onCreate, onJoin, onBack }) {
  return (
    <motion.main className="flex flex-col h-full overflow-y-auto no-scrollbar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <header className="text-center pt-24 pb-6 px-8">
        <h2 className="text-4xl font-bold text-blue-700 mb-2">תחרות קבוצות</h2>
        <p className="text-xl text-blue-500">צרו חדר חדש או הצטרפו לחדר קיים</p>
      </header>
      <section className="flex-1 flex flex-col items-center justify-center px-8 pb-8 gap-6">
        <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
          <motion.button onClick={onCreate} className="rounded-3xl p-8 shadow-lg border-2 border-blue-100 bg-white/80 hover:border-blue-400 transition-colors min-h-[200px] flex flex-col items-center justify-center gap-4" whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
            <DoorOpen className="w-16 h-16 text-blue-500" strokeWidth={1.5} />
            <div className="text-3xl font-bold text-blue-950">צרו חדר</div>
            <div className="text-lg text-blue-500 text-center">צרו חדר חדש והזמינו קבוצות</div>
          </motion.button>
          <motion.button onClick={onJoin} className="rounded-3xl p-8 shadow-lg border-2 border-blue-100 bg-white/80 hover:border-blue-400 transition-colors min-h-[200px] flex flex-col items-center justify-center gap-4" whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
            <Users className="w-16 h-16 text-blue-500" strokeWidth={1.5} />
            <div className="text-3xl font-bold text-blue-950">הצטרפו לחדר</div>
            <div className="text-lg text-blue-500 text-center">בחרו חדר פתוח או הזינו קוד</div>
          </motion.button>
        </div>
      </section>
      <nav className="pb-6 flex justify-center">
        <button onClick={onBack} className="text-blue-500 text-xl hover:text-blue-700 transition-colors flex items-center gap-2">→ חזרה</button>
      </nav>
    </motion.main>
  );
}