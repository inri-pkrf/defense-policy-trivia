import { motion } from 'framer-motion';
import { Info, Check, AlertCircle, X, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ExplanationCard({ question, isCorrect, onNext, onClose, onPrev, isLast, isFirst }) {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ background: 'rgba(15,30,60,0.45)' }}
      role="dialog"
      aria-label="הסבר ומשוב"
    >
      <motion.article
        className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative"
        initial={{ y: 60, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors z-10"
            aria-label="סגירה"
          >
            <X className="w-5 h-5 text-blue-700" />
          </button>
        )}

        <div className="text-center mb-6">
          {isCorrect ? (
            <div className="inline-flex items-center gap-3 text-green-500">
              <span className="text-3xl font-bold">כל הכבוד!</span>
              <Check className="w-10 h-10" strokeWidth={3} />
            </div>
          ) : (
            <div className="inline-flex items-center gap-3 text-orange-500">
              <span className="text-3xl font-bold">הידעתם?</span>
              <AlertCircle className="w-10 h-10" strokeWidth={3} />
            </div>
          )}
        </div>

        <section className="rounded-2xl p-5 mb-6" style={{ background: '#EAF5FF' }}>
          <div className="flex items-center gap-2 text-blue-600 font-medium mb-3">
            <h3 className="text-lg">הסבר</h3>
            <Info className="w-5 h-5" />
          </div>
          <p className="text-xl text-blue-950 leading-relaxed">{question.explanation}</p>
        </section>

        <div className="flex gap-3">
          {onPrev && !isFirst && (
            <motion.button
              onClick={onPrev}
              className="flex items-center justify-center gap-2 min-h-[70px] px-6 rounded-2xl bg-white border-2 border-blue-200 text-blue-700 text-xl font-bold shadow-lg hover:border-blue-400 transition-colors"
              whileTap={{ scale: 0.97 }}
            >
              הקודם
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          )}
          <motion.button
            onClick={onNext}
            className="flex-1 flex items-center justify-center gap-2 min-h-[70px] rounded-2xl text-white text-2xl font-bold shadow-lg"
            style={{ background: 'linear-gradient(135deg, #1E5AA8, #2A6BC4)' }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLast ? 'סיום הטריוויה 🎯' : 'המשיכו לשאלה הבאה'}
            {!isLast && <ArrowLeft className="w-6 h-6" />}
          </motion.button>
        </div>
      </motion.article>
    </motion.div>
  );
}