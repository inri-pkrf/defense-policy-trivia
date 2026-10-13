import { motion } from 'framer-motion';
import { Fragment } from 'react';

const STATIONS = [
  { step: 1, icon: '🎮', title: 'בחרו משחק', desc: 'בחרו מצב משחק וכמות שאלות' },
  { step: 2, icon: '❓', title: 'ענו נכון', desc: 'בחרו את התשובה מארבע אפשרויות' },
  { step: 3, icon: '🏆', title: 'גלו דירוג', desc: 'בדקו אחוז הצלחה ומיקום בטבלה' },
];

const CONNECTORS = ['✨', '⚡'];

export default function HowItWorks() {
  return (
    <div className="flex flex-row items-start justify-center w-full max-w-4xl mx-auto mb-4 px-4">
      {STATIONS.map((station, i) => (
        <Fragment key={i}>
          <Station index={i} {...station} />
          {i < STATIONS.length - 1 && (
            <div className="flex items-start pt-7 px-0.5">
              <div className="flex items-center gap-1">
                <div className="w-5 border-t-2 border-dashed border-blue-300" />
                <span className="text-base">{CONNECTORS[i]}</span>
                <div className="w-5 border-t-2 border-dashed border-blue-300" />
              </div>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}

function Station({ step, icon, title, desc, index }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center max-w-[160px] flex-1"
      initial={{ scale: 0, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.4, type: 'spring', stiffness: 180, damping: 14 }}
    >
      <div className="relative mb-2">
        <div className="w-14 h-14 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center text-2xl">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
          {step}
        </div>
      </div>
      <h3 className="text-base font-bold text-blue-950 mb-1">{title}</h3>
      <p className="text-xs text-blue-600 leading-snug min-h-[32px]">{desc}</p>
    </motion.div>
  );
}