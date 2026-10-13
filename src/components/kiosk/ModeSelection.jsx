import { motion } from 'framer-motion';
import { User, Users } from 'lucide-react';

export default function ModeSelection({ onSelectSingle, onSelectTeam, onBack }) {
  return (
    <motion.main
      className="flex flex-col h-full overflow-y-auto no-scrollbar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <header className="text-center pt-24 pb-6 px-8">
        <h2 className="text-5xl font-bold text-blue-700 mb-3">בחרו את אופן המשחק</h2>
        <p className="text-2xl text-blue-500">האם תרצו לשחק לבד או להתחרות בקבוצות?</p>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-8 pb-8 gap-6">
        <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
          <ModeCard
            onSelect={onSelectSingle}
            icon={<User className="w-16 h-16" strokeWidth={1.5} />}
            title="שחקן יחיד"
            description="משחק אישי בקצב שלכם"
          />
          <ModeCard
            onSelect={onSelectTeam}
            icon={<Users className="w-16 h-16" strokeWidth={1.5} />}
            title="תחרות קבוצות"
            description="התחרו בין קבוצות בזמן אמת"
          />
        </div>
      </section>

      <nav className="pb-6 flex justify-center">
        <button onClick={onBack} className="text-blue-500 text-xl hover:text-blue-700 transition-colors flex items-center gap-2">
          → חזרה
        </button>
      </nav>
    </motion.main>
  );
}

function ModeCard({ onSelect, icon, title, description }) {
  return (
    <motion.button
      onClick={onSelect}
      className="relative rounded-3xl p-8 shadow-lg border-2 border-blue-100 bg-white/80 hover:border-blue-400 transition-colors min-h-[240px] flex flex-col items-center justify-center gap-4"
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="text-blue-500">{icon}</div>
      <div className="text-3xl font-bold text-blue-950">{title}</div>
      <div className="text-lg text-blue-500 text-center">{description}</div>
    </motion.button>
  );
}