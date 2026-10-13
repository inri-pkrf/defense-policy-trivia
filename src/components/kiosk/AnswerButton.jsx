import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

const LETTERS = ['א', 'ב', 'ג', 'ד'];

export default function AnswerButton({ index, text, selectedAnswer, correctAnswer, onSelect }) {
  const [ripples, setRipples] = useState([]);

  const isSelected = selectedAnswer === index;
  const isCorrect = index === correctAnswer;
  const showResult = selectedAnswer !== null;

  let stateClass = 'bg-white border-blue-200 hover:border-blue-400';
  let badgeClass = 'bg-blue-100 text-blue-700';
  if (showResult && isCorrect) {
    stateClass = 'bg-green-50 border-green-500';
    badgeClass = 'bg-green-500 text-white';
  } else if (showResult && isSelected && !isCorrect) {
    stateClass = 'bg-red-50 border-red-500';
    badgeClass = 'bg-red-500 text-white';
  } else if (showResult) {
    stateClass = 'bg-white border-gray-200 opacity-50';
    badgeClass = 'bg-gray-200 text-gray-500';
  }

  const handleClick = (e) => {
    if (showResult) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX || rect.left + rect.width / 2) - rect.left;
    const y = (e.clientY || rect.top + rect.height / 2) - rect.top;
    const id = Date.now() + index;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 650);
    onSelect();
  };

  return (
    <motion.button
      className={`relative overflow-hidden w-full h-64 rounded-2xl border-2 px-5 py-1 flex items-center gap-3 text-right shadow-lg transition-colors ${stateClass}`}
      onClick={handleClick}
      disabled={showResult}
      whileTap={showResult ? {} : { scale: 0.96 }}
      animate={showResult && isSelected && !isCorrect ? { x: [0, -8, 8, -6, 6, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="absolute rounded-full bg-white/50 pointer-events-none"
            style={{ left: r.x, top: r.y, translateX: '-50%', translateY: '-50%' }}
            initial={{ width: 0, height: 0, opacity: 0.5 }}
            animate={{ width: 400, height: 400, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold ${badgeClass} relative z-10`}>
        {LETTERS[index]}
      </div>
      <div className="text-2xl font-medium text-blue-950 flex-1 leading-snug relative z-10">{text}</div>
      {showResult && isCorrect && <Check className="w-6 h-6 text-green-500 flex-shrink-0 relative z-10" />}
      {showResult && isSelected && !isCorrect && <X className="w-6 h-6 text-red-500 flex-shrink-0 relative z-10" />}
    </motion.button>
  );
}