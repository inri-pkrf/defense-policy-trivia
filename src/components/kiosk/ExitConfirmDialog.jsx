import { motion } from 'framer-motion';

export default function ExitConfirmDialog({ onContinue, onExit }) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: 'rgba(15,30,60,0.55)' }}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl text-center"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.4 }}
      >
        <h3 className="text-3xl font-bold text-blue-950 mb-8">האם ברצונכם לצאת מהמשחק?</h3>
        <div className="space-y-3">
          <motion.button
            onClick={onContinue}
            className="w-full min-h-[80px] rounded-2xl text-white text-2xl font-bold shadow-lg"
            style={{ background: 'linear-gradient(135deg, #1E5AA8, #2A6BC4)' }}
            whileTap={{ scale: 0.97 }}
          >
            המשך משחק
          </motion.button>
          <motion.button
            onClick={onExit}
            className="w-full min-h-[80px] rounded-2xl bg-white border-2 border-blue-200 text-blue-700 text-2xl font-bold shadow-lg hover:border-blue-400 transition-colors"
            whileTap={{ scale: 0.97 }}
          >
            חזרה לפתיחה
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}