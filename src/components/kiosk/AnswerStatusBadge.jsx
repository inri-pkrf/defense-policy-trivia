import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export default function AnswerStatusBadge({ isCorrect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`self-center inline-flex items-center gap-2 px-5 py-2 rounded-full text-white font-bold text-base shadow-lg ${
        isCorrect ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      {isCorrect ? 'תשובה נכונה' : 'תשובה לא נכונה'}
      {isCorrect ? <Check className="w-5 h-5" strokeWidth={3} /> : <X className="w-5 h-5" strokeWidth={3} />}
    </motion.div>
  );
}