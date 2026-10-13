import { motion, AnimatePresence } from 'framer-motion';

export default function EmergencyAlert({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <>
          <motion.div
            className="absolute inset-0 pointer-events-none z-30"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              boxShadow: [
                'inset 0 0 30px rgba(255,122,48,0.3)',
                'inset 0 0 80px rgba(231,76,60,0.5)',
                'inset 0 0 30px rgba(255,122,48,0.3)',
              ],
            }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.3 },
              boxShadow: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{ borderRadius: '24px' }}
          />
          <motion.div
            className="absolute top-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div
              className="text-white px-10 py-4 rounded-full text-2xl font-bold shadow-2xl flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, #FF7A30, #E74C3C)' }}
            >
              <span className="text-3xl">⚠</span>
              <span>התקבלה התרעה</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}