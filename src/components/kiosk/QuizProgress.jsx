import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Fragment } from 'react';

export default function QuizProgress({ total, current, answers = {}, gameQuestions = [], onJump, latestIndex }) {
  return (
    <div className="flex items-center justify-center gap-0.5 overflow-x-auto no-scrollbar py-1 max-w-full">
      {Array.from({ length: total }).map((_, i) => {
        const isCurrent = i === current;
        const isLatest = latestIndex !== undefined && i === latestIndex && latestIndex !== current;
        const isAnswered = answers[i] !== undefined;
        const isCorrect = isAnswered && gameQuestions[i] && answers[i] === gameQuestions[i].correctAnswer;
        const isIncorrect = isAnswered && !isCorrect;

        let bgClass = 'bg-white border-blue-200';
        let textClass = 'text-blue-300';

        if (isCorrect) {
          bgClass = 'bg-green-500 border-green-500';
          textClass = 'text-white';
        } else if (isIncorrect) {
          bgClass = 'bg-red-500 border-red-500';
          textClass = 'text-white';
        } else if (isCurrent || isLatest) {
          bgClass = 'bg-blue-600 border-blue-600';
          textClass = 'text-white';
        } else if (i < current) {
          bgClass = 'bg-blue-200 border-blue-200';
          textClass = 'text-blue-500';
        }

        const isClickable = (isAnswered || isLatest) && onJump;

        return (
          <Fragment key={i}>
            {i > 0 && (
              <div className={`h-0.5 w-2.5 flex-shrink-0 rounded-full ${i <= current ? 'bg-blue-400' : 'bg-blue-100'}`} />
            )}
            <motion.div
              className={`relative flex items-center justify-center rounded-full border-2 flex-shrink-0 ${bgClass} ${textClass} ${isClickable ? 'cursor-pointer hover:scale-110' : ''}`}
              animate={{
                width: (isCurrent || isLatest) ? 34 : 24,
                height: (isCurrent || isLatest) ? 34 : 24,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              onClick={isClickable ? () => onJump(i) : undefined}
            >
              {(isCurrent || isLatest) && (
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ boxShadow: '0 0 0 3px rgba(30,90,168,0.25)' }}
                  animate={{ opacity: [0.3, 0.9, 0.3] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              {isCorrect ? (
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              ) : isIncorrect ? (
                <X className="w-3.5 h-3.5" strokeWidth={3} />
              ) : (
                <span className="text-xs font-bold">{i + 1}</span>
              )}
            </motion.div>
          </Fragment>
        );
      })}
    </div>
  );
}