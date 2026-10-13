import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import QuestionCard from '@/components/kiosk/QuestionCard';
import AnswerButton from '@/components/kiosk/AnswerButton';

export default function CompetitionPlay({ room, team, teams, questions, onAnswer }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [localAnswer, setLocalAnswer] = useState(null);

  const currentIdx = room.current_question_index;
  const currentQuestion = questions[currentIdx];

  const teamAnswers = useMemo(() => {
    try { return JSON.parse(team?.answers || '[]'); } catch { return []; }
  }, [team?.answers]);

  const answeredCount = useMemo(() => {
    if (!teams) return 0;
    return teams.filter(t => {
      try {
        const ans = JSON.parse(t.answers || '[]');
        return ans.some(a => a.questionIndex === currentIdx);
      } catch { return false; }
    }).length;
  }, [teams, currentIdx]);

  const teamAnswer = teamAnswers.find(a => a.questionIndex === currentIdx);

  useEffect(() => {
    setLocalAnswer(null);
  }, [currentIdx]);

  const answer = localAnswer !== null ? localAnswer : (teamAnswer ? teamAnswer.selectedIndex : null);

  useEffect(() => {
    if (!room.question_started_at) return;
    const startTime = new Date(room.question_started_at).getTime();
    const endTime = startTime + room.time_per_question * 1000;
    const update = () => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    };
    update();
    const interval = setInterval(update, 200);
    return () => clearInterval(interval);
  }, [room.question_started_at, room.time_per_question, currentIdx]);

  if (!currentQuestion) return null;

  const handleSelect = (index) => {
    if (answer !== null) return;
    setLocalAnswer(index);
    const isCorrect = index === currentQuestion.correctAnswer;
    onAnswer(currentIdx, index, isCorrect, timeLeft || 0, room.time_per_question);
  };

  return (
    <motion.main key={`comp-${currentIdx}`} className="absolute inset-0 flex flex-col pt-[76px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between px-8 py-3">
        <span className="text-xl font-bold text-blue-950">שאלה {currentIdx + 1} / {room.question_count}</span>
        {timeLeft !== null && answer === null && (
          <motion.div
            className={`flex items-center gap-2 px-5 py-2 rounded-full shadow-lg ${timeLeft <= 10 ? 'bg-red-500' : 'bg-blue-600'} text-white`}
            animate={timeLeft <= 10 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}
          >
            <Clock className="w-5 h-5" />
            <span className="text-2xl font-bold">{timeLeft}</span>
          </motion.div>
        )}
      </div>

      <div className="flex-1 flex flex-col p-6 gap-3 justify-center">
        <QuestionCard question={currentQuestion} />
        <div className="grid grid-cols-2 gap-4 px-4">
          {currentQuestion.answers.map((answerText, i) => (
            <AnswerButton
              key={i}
              index={i}
              text={answerText}
              selectedAnswer={answer}
              correctAnswer={currentQuestion.correctAnswer}
              onSelect={() => handleSelect(i)}
            />
          ))}
        </div>
        {answer !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-blue-600 text-xl font-medium py-2"
          >
            {answeredCount} מתוך {teams?.length || 0} קבוצות ענו — ממתינים לשאר...
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}