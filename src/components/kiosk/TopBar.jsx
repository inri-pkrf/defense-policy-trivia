import { motion } from 'framer-motion';
import { Home as HomeIcon, ArrowRight, Flame } from 'lucide-react';
import QuizProgress from './QuizProgress';
import AnimatedScore from './AnimatedScore';

export default function TopBar({ qIndex, total, score, streak = 0, timed = false, timeLeft = 0, answers = {}, gameQuestions = [], onHome, onBack, onJump, latestIndex }) {
  return (
    <header className="flex-shrink-0 pt-8 pb-3 bg-blue-50/60 backdrop-blur-md border-b border-blue-100 px-6">
      <div className="flex items-center justify-between mb-3 gap-3">
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onBack}
            className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
            aria-label="חזרה אחורה"
          >
            <ArrowRight className="w-7 h-7 text-blue-700" />
          </button>
          <button
            onClick={onHome}
            className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
            aria-label="חזרה לפתיחה"
          >
            <HomeIcon className="w-7 h-7 text-blue-700" />
          </button>
        </div>

        <div className="text-center flex-1 min-w-0">
          <div className="flex items-center justify-center gap-3">
            <p className="text-sm text-blue-500">
              שאלה {qIndex + 1} מתוך {total}
            </p>

          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {streak >= 2 && (
            <div className="bg-orange-100 rounded-2xl px-4 py-2 text-center flex items-center gap-1.5" title={`רצף ${streak} תשובות נכונות`}>
              <span className="text-xl font-bold text-orange-600">{streak}</span>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
          )}
          <AnimatedScore score={score} />
        </div>
      </div>

      <QuizProgress total={total} current={qIndex} answers={answers} gameQuestions={gameQuestions} onJump={onJump} latestIndex={latestIndex} />
    </header>
  );
}