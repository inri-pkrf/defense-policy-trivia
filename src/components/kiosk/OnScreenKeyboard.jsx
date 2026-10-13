import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';

// Standard Israeli Hebrew keyboard layout (QWERTY-mapped)
const HEBREW_ROWS = [
  ['ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ'],
  ['ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ף'],
  ['ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ'],
];

const NUMBER_ROW = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

const EMOJIS = ['🏆', '😊', '⭐', '🎯'];

export default function OnScreenKeyboard({ value, onChange, maxLength = 20 }) {
  const handleKey = (key) => {
    if (value.length < maxLength) {
      onChange(value + key);
    }
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const handleSpace = () => {
    if (value.length < maxLength && value.length > 0 && !value.endsWith(' ')) {
      onChange(value + ' ');
    }
  };

  return (
    <div dir="ltr" className="w-full max-w-2xl mx-auto space-y-2">
      {/* Number row */}
      <div className="flex gap-1.5 justify-center">
        {NUMBER_ROW.map((digit) => (
          <motion.button
            key={digit}
            onClick={() => handleKey(digit)}
            className="flex-1 min-w-[36px] h-12 rounded-xl bg-blue-50 border-2 border-blue-200 text-blue-900 text-xl font-bold shadow-sm hover:bg-blue-100 transition-colors flex items-center justify-center"
            whileTap={{ scale: 0.92 }}
          >
            {digit}
          </motion.button>
        ))}
      </div>

      {/* Hebrew letter rows - standard Israeli layout */}
      {HEBREW_ROWS.map((row, i) => (
        <div key={i} className="flex gap-2 justify-center">
          {row.map((letter) => (
            <motion.button
              key={letter}
              onClick={() => handleKey(letter)}
              className="flex-1 min-w-[44px] h-14 rounded-xl bg-white border-2 border-blue-200 text-blue-900 text-2xl font-bold shadow-sm hover:bg-blue-50 transition-colors flex items-center justify-center"
              whileTap={{ scale: 0.92 }}
            >
              {letter}
            </motion.button>
          ))}
        </div>
      ))}

      {/* Bottom row: Delete + Space + Emojis */}
      <div className="flex gap-2 justify-center items-center">
        <motion.button
          onClick={handleBackspace}
          className="w-14 h-14 rounded-xl bg-blue-50 border-2 border-blue-200 text-blue-700 shadow-sm hover:bg-blue-100 transition-colors flex items-center justify-center"
          whileTap={{ scale: 0.92 }}
          aria-label="מחיקה"
        >
          <Delete className="w-5 h-5" />
        </motion.button>
        <motion.button
          onClick={handleSpace}
          className="flex-[3] h-14 rounded-xl bg-white border-2 border-blue-200 text-blue-500 shadow-sm hover:bg-blue-50 transition-colors flex items-center justify-center text-sm font-medium"
          whileTap={{ scale: 0.92 }}
        >
          רווח
        </motion.button>
        {EMOJIS.map((emoji) => (
          <motion.button
            key={emoji}
            onClick={() => handleKey(emoji)}
            className="w-14 h-14 rounded-xl bg-white border-2 border-blue-200 text-2xl shadow-sm hover:bg-blue-50 transition-colors flex items-center justify-center"
            whileTap={{ scale: 0.92 }}
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
}