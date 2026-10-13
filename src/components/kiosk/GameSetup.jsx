import { useState } from 'react';
import { motion } from 'framer-motion';
import { Timer, TimerOff, Check, Shield, User, Users } from 'lucide-react';
import NumberPicker from '@/components/kiosk/NumberPicker';
import OnScreenKeyboard from '@/components/kiosk/OnScreenKeyboard';
import { questions } from '@/data/questions';

export default function GameSetup({ onStart, onBack }) {
  const [mode, setMode] = useState('untimed');
  const [count, setCount] = useState(7);
  const [participation, setParticipation] = useState('anonymous');
  const [name, setName] = useState('');
  const maxQuestions = questions.length;
  const canStart = participation === 'anonymous' || name.trim().length > 0;

  return (
    <motion.main
      className="flex flex-col h-full overflow-y-auto no-scrollbar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <header className="text-center pt-24 pb-6 px-8">
        <h2 className="text-5xl font-bold text-blue-700 mb-3">התאימו את המשחק</h2>
        <p className="text-2xl text-blue-500">בחרו את אופי המשחק ואת כמות התרחישים</p>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-8 pb-8 gap-5" aria-label="התאמת משחק">
        <div className="w-full max-w-4xl">
          <p className="text-2xl font-bold text-blue-900 text-center mb-5">מצב משחק</p>
          <div className="grid grid-cols-2 gap-6">
            <ModeCard
              selected={mode === 'timed'}
              onSelect={() => setMode('timed')}
              icon={<Timer className="w-16 h-16" strokeWidth={1.5} />}
              title="עם זמן"
              description="לכל שאלה מוקצב זמן למענה"
            />
            <ModeCard
              selected={mode === 'untimed'}
              onSelect={() => setMode('untimed')}
              icon={<TimerOff className="w-16 h-16" strokeWidth={1.5} />}
              title="ללא זמן"
              description="ענו בקצב שלכם, ללא הגבלת זמן"
            />
          </div>
        </div>

        <div className="w-full max-w-4xl">
          <p className="text-2xl font-bold text-blue-900 text-center mb-5">אופן השתתפות</p>
          <div className="grid grid-cols-2 gap-6">
            <ModeCard
              selected={participation === 'anonymous'}
              onSelect={() => setParticipation('anonymous')}
              icon={<User className="w-16 h-16" strokeWidth={1.5} />}
              title="משחק אנונימי"
              description="משחק ללא הזנת שם"
            />
            <ModeCard
              selected={participation === 'named'}
              onSelect={() => setParticipation('named')}
              icon={<Users className="w-16 h-16" strokeWidth={1.5} />}
              title="משחק עם שם"
              description="הזינו שם קבוצה או משתתף/ת"
            />
          </div>
        </div>

        {participation === 'named' && (
          <div className="w-full max-w-2xl">
            <p className="text-2xl font-bold text-blue-900 text-center mb-5">שם הקבוצה / המשתתף/ת</p>
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border-2 border-blue-200 p-5 mb-4 min-h-[72px] flex items-center justify-center">
              <span className="text-3xl font-bold text-blue-950">
                {name || <span className="text-blue-300 font-normal">שם הקבוצה / המשתתף/ת</span>}
              </span>
            </div>
            <OnScreenKeyboard value={name} onChange={setName} maxLength={20} />
          </div>
        )}

        <div className="w-full max-w-md">
          <p className="text-2xl font-bold text-blue-900 text-center mb-5">כמות שאלות</p>
          <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border-2 border-blue-100 p-4">
            <NumberPicker min={5} max={maxQuestions} value={count} onChange={setCount} />
          </div>
        </div>

        <motion.button
          onClick={() => canStart && onStart({ mode, count, participation, name: participation === 'named' ? name.trim() : null })}
          className="px-20 py-7 rounded-full text-3xl font-bold shadow-2xl flex items-center gap-4 transition-all"
          style={{
            background: canStart ? 'linear-gradient(135deg, #1E5AA8, #2A6BC4)' : '#cbd5e1',
            color: canStart ? 'white' : '#94a3b8',
          }}
          whileHover={canStart ? { scale: 1.03 } : {}}
          whileTap={canStart ? { scale: 0.96 } : {}}
          disabled={!canStart}
        >
          התחלת הטריוויה
          <Shield className="w-9 h-9" fill={canStart ? 'white' : '#94a3b8'} />
        </motion.button>
      </section>

      <nav className="pb-6 flex justify-center">
        <button
          onClick={onBack}
          className="text-blue-500 text-xl hover:text-blue-700 transition-colors flex items-center gap-2"
        >
          → חזרה
        </button>
      </nav>
    </motion.main>
  );
}

function ModeCard({ selected, onSelect, icon, title, description }) {
  return (
    <motion.button
      onClick={onSelect}
      className={`relative rounded-3xl p-8 shadow-lg border-2 transition-colors min-h-[200px] flex flex-col items-center justify-center gap-4 ${
        selected ? 'border-blue-600 bg-blue-50' : 'border-blue-100 bg-white/80 hover:border-blue-300'
      }`}
      whileTap={{ scale: 0.97 }}
      animate={selected ? { scale: 1.02 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {selected && (
        <motion.div
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-md"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <Check className="w-5 h-5 text-white" strokeWidth={3} />
        </motion.div>
      )}
      <div className={selected ? 'text-blue-600' : 'text-blue-400'}>{icon}</div>
      <div className="text-3xl font-bold text-blue-950">{title}</div>
      <div className="text-lg text-blue-500 text-center">{description}</div>
    </motion.button>
  );
}