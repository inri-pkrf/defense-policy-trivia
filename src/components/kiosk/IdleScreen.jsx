import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import CityBackground from './CityBackground';
import HowItWorks from './HowItWorks';

const MESSAGES = [
  'מה תעשו עכשיו?',
  'בואו לבדוק איך פועלים נכון בזמן חירום',
  'טריוויה בנושא מדיניות התגוננות מתחילה כאן'];

export default function IdleScreen({ onStart }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.main
      className="relative h-full w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}>

      <CityBackground />

      <section className="absolute inset-0 flex flex-col items-center justify-center z-20 px-8 pt-16 pb-32">
        <div className="text-center mb-6">
          <div className="h-24 flex items-center justify-center mb-4">
            <AnimatePresence mode="wait">
              <motion.h1
                key={msgIndex}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-6xl font-bold text-blue-950 text-center"
                style={{ textShadow: '0 2px 10px rgba(255,255,255,0.8)' }}>
                {MESSAGES[msgIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <h2 className="text-2xl text-blue-700 font-medium mb-8 uppercase no-underline" style={{ textShadow: '0 1px 5px rgba(255,255,255,0.8)' }}>
            טריוויה בנושא מדיניות התגוננות
          </h2>
        </div>

        <HowItWorks />

        <motion.button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen?.().catch(() => {});
            }
            onStart();
          }}
          className="px-20 py-8 rounded-full text-white text-5xl font-bold shadow-2xl flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg, #1E5AA8, #2A6BC4)' }}
          animate={{
            scale: [1, 1.03, 1],
            boxShadow: [
              '0 10px 30px rgba(30,90,168,0.3)',
              '0 15px 50px rgba(30,90,168,0.5)',
              '0 10px 30px rgba(30,90,168,0.3)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          whileTap={{ scale: 0.95 }}>

          <span>התחלה</span>
          <span className="text-6xl">🎯</span>
        </motion.button>
      </section>
    </motion.main>);
}