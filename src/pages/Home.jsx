import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import { shuffleQuestions } from '@/data/questions';
import { useIdleTimer } from '@/hooks/useIdleTimer';
import IdleScreen from '@/components/kiosk/IdleScreen';
import GameSetup from '@/components/kiosk/GameSetup';
import TopBar from '@/components/kiosk/TopBar';
import QuestionCard from '@/components/kiosk/QuestionCard';
import AnswerButton from '@/components/kiosk/AnswerButton';
import ExplanationCard from '@/components/kiosk/ExplanationCard';
import ResultScreen from '@/components/kiosk/ResultScreen';
import ExitConfirmDialog from '@/components/kiosk/ExitConfirmDialog';
import TopNavbar from '@/components/kiosk/TopNavbar';
import AnswerStatusBadge from '@/components/kiosk/AnswerStatusBadge';
import FlyingPoints from '@/components/kiosk/FlyingPoints';
import { base44 } from '@/api/base44Client';
import ModeSelection from '@/components/kiosk/ModeSelection';
import TeamCompetition from '@/components/kiosk/team/TeamCompetition';

export default function Home() {
  const [phase, setPhase] = useState('idle');
  const [gameQuestions, setGameQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [scenarioComplete, setScenarioComplete] = useState(false);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const [gameMode, setGameMode] = useState('untimed');
  const [timeLeft, setTimeLeft] = useState(null);
  const [playerName, setPlayerName] = useState(null);
  const [flyingPoints, setFlyingPoints] = useState([]);
  const [justAnswered, setJustAnswered] = useState(false);

  const QUESTION_TIME = 30;
  const explanationTimer = useRef(null);

  const resetToIdle = useCallback(() => {
    if (explanationTimer.current) { clearTimeout(explanationTimer.current); explanationTimer.current = null; }
    setPhase('idle');
    setGameQuestions([]);
    setQIndex(0);
    setScore(0);
    setScenarioComplete(false);
    setAnswers({});
    setShowExplanation(false);
    setShowExit(false);
    setTimeLeft(null);
    setPlayerName(null);
    setFlyingPoints([]);
    setJustAnswered(false);
  }, []);

  const currentAnswer = answers[qIndex] !== undefined ? answers[qIndex] : null;

  const currentStreak = useMemo(() => {
    let lastAnswered = -1;
    for (let i = qIndex; i >= 0; i--) {
      if (answers[i] !== undefined) {
        lastAnswered = i;
        break;
      }
    }
    if (lastAnswered === -1) return 0;
    let s = 0;
    for (let i = lastAnswered; i >= 0; i--) {
      if (answers[i] !== undefined && gameQuestions[i] && answers[i] === gameQuestions[i].correctAnswer) {
        s++;
      } else {
        break;
      }
    }
    return s;
  }, [answers, qIndex, gameQuestions]);

  const firstUnanswered = useMemo(() => {
    for (let i = 0; i < gameQuestions.length; i++) {
      if (answers[i] === undefined) return i;
    }
    return gameQuestions.length - 1;
  }, [answers, gameQuestions]);

  const { showWarning, countdown } = useIdleTimer({
    timeoutMs: 10 * 60 * 1000,
    warningMs: 30 * 1000,
    onTimeout: resetToIdle,
  });

  const currentQuestion = gameQuestions[qIndex];

  useEffect(() => {
    if (phase === 'playing' && scenarioComplete && !showExplanation && currentAnswer === null && gameMode === 'timed') {
      setTimeLeft(QUESTION_TIME);
    }
  }, [phase, scenarioComplete, showExplanation, currentAnswer, gameMode, qIndex]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || currentAnswer !== null) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, currentAnswer]);

  useEffect(() => {
    if (timeLeft === 0 && phase === 'playing' && scenarioComplete && !showExplanation && currentAnswer === null) {
      setAnswers((prev) => ({ ...prev, [qIndex]: -1 }));
      setShowExplanation(true);
      setTimeLeft(null);
    }
  }, [timeLeft, phase, scenarioComplete, showExplanation, currentAnswer, qIndex]);

  useEffect(() => {
    if (currentAnswer !== null) {
      setTimeLeft(null);
    }
  }, [currentAnswer]);

  useEffect(() => {
    if (phase === 'results' && gameQuestions.length > 0) {
      base44.functions.invoke('submitScoreToSheet', {
        teamName: playerName || 'אנונימי',
        score,
        correctCount: Math.round(score / 10),
        total: gameQuestions.length,
      }).catch(() => {});
    }
  }, [phase]);

  const startGame = ({ mode, count, participation, name }) => {
    if (explanationTimer.current) { clearTimeout(explanationTimer.current); explanationTimer.current = null; }
    setGameMode(mode);
    setPlayerName(participation === 'named' ? name : null);
    setGameQuestions(shuffleQuestions(count));
    setQIndex(0);
    setScore(0);
    setScenarioComplete(true);
    setAnswers({});
    setShowExplanation(false);
    setTimeLeft(null);
    setPhase('playing');
    setJustAnswered(false);
  };

  const handleAnswerSelect = (index) => {
    if (currentAnswer !== null) return;
    setJustAnswered(true);
    setAnswers((prev) => ({ ...prev, [qIndex]: index }));
    if (index === currentQuestion.correctAnswer) {
      setScore((s) => s + 10);
      const flyId = Date.now();
      setFlyingPoints((prev) => [...prev, { id: flyId, isStreak: false }]);
      const newStreak = currentStreak + 1;
      if (newStreak >= 2) {
        setTimeout(() => {
          setFlyingPoints((prev) => [...prev, { id: flyId + 1, isStreak: true, streakCount: newStreak }]);
        }, 300);
      }
    }
    if (explanationTimer.current) clearTimeout(explanationTimer.current);
    explanationTimer.current = setTimeout(() => {
      setShowExplanation(true);
      setJustAnswered(false);
    }, 1400);
  };

  const goToQuestion = (index) => {
    if (explanationTimer.current) { clearTimeout(explanationTimer.current); explanationTimer.current = null; }
    setTimeLeft(null);
    setQIndex(index);
    setScenarioComplete(true);
    setShowExplanation(answers[index] !== undefined);
    setJustAnswered(false);
  };

  const handleNext = () => {
    if (explanationTimer.current) { clearTimeout(explanationTimer.current); explanationTimer.current = null; }
    setTimeLeft(null);
    if (qIndex + 1 >= gameQuestions.length) {
      setPhase('results');
    } else {
      const newIndex = qIndex + 1;
      setQIndex(newIndex);
      setScenarioComplete(true);
      setShowExplanation(answers[newIndex] !== undefined);
      setJustAnswered(false);
    }
  };

  const handleBack = () => {
    if (explanationTimer.current) { clearTimeout(explanationTimer.current); explanationTimer.current = null; }
    setTimeLeft(null);
    setJustAnswered(false);
    if (phase === 'results') {
      setPhase('playing');
      setScenarioComplete(true);
      setShowExplanation(true);
      return;
    }
    if (qIndex > 0) {
      const newIndex = qIndex - 1;
      setQIndex(newIndex);
      setScenarioComplete(true);
      setShowExplanation(answers[newIndex] !== undefined);
    } else {
      setPhase('setup');
    }
  };

  const handleExit = () => {
    setShowExit(false);
    resetToIdle();
  };

  return (
    <div
      dir="rtl"
      lang="he"
      className="fixed inset-0 overflow-hidden select-none"
      role="application"
      aria-label="מה תעשו עכשיו - סימולציית התגוננות פיקוד העורף"
      style={{
        background: 'linear-gradient(180deg, #EAF5FF 0%, #C8E4FF 100%)',
        fontFamily: "'Heebo', 'Rubik', system-ui, -apple-system, sans-serif",
      }}
    >
      <TopNavbar />
      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div key="idle" className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <IdleScreen onStart={() => setPhase('mode-select')} />
          </motion.div>
        )}

        {phase === 'setup' && (
          <motion.div key="setup" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <GameSetup onStart={startGame} onBack={() => setPhase('mode-select')} />
          </motion.div>
        )}

        {phase === 'mode-select' && (
          <motion.div key="mode-select" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <ModeSelection
              onSelectSingle={() => setPhase('setup')}
              onSelectTeam={() => setPhase('team')}
              onBack={resetToIdle}
            />
          </motion.div>
        )}

        {phase === 'team' && (
          <motion.div key="team" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <TeamCompetition onExit={resetToIdle} />
          </motion.div>
        )}

        {phase === 'playing' && currentQuestion && (
          <motion.main key={`play-${currentQuestion.id}`} className="absolute inset-0 flex flex-col pt-[76px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <TopBar
              qIndex={qIndex}
              total={gameQuestions.length}
              score={score}
              streak={currentStreak}
              timed={gameMode === 'timed'}
              timeLeft={timeLeft}
              answers={answers}
              gameQuestions={gameQuestions}
              onHome={() => setShowExit(true)}
              onBack={handleBack}
              onJump={goToQuestion}
              latestIndex={firstUnanswered}
            />

            <div className="flex-1 relative overflow-hidden">
              {scenarioComplete && (
                <div className="absolute inset-0 flex flex-col p-6 gap-3 z-10 justify-center">
                  {currentAnswer !== null && !showExplanation && (
                    <AnswerStatusBadge isCorrect={currentAnswer === currentQuestion.correctAnswer} />
                  )}
                  {gameMode === 'timed' && timeLeft !== null && timeLeft > 0 && currentAnswer === null && (
                    <motion.div
                      className={`flex items-center gap-3 px-8 py-3 rounded-full shadow-2xl self-center ${timeLeft <= 10 ? 'bg-red-500' : 'bg-blue-600'} text-white`}
                      animate={timeLeft <= 10 ? {
                        boxShadow: ['0 0 0 0 rgba(239,68,68,0.7)', '0 0 0 16px rgba(239,68,68,0)'],
                      } : {}}
                      transition={timeLeft <= 10 ? { duration: 1, repeat: Infinity, ease: 'easeOut' } : {}}
                    >
                      <Clock className="w-7 h-7" />
                      <span className="text-4xl font-bold">{timeLeft}</span>
                    </motion.div>
                  )}
                  <QuestionCard question={currentQuestion} />
                  <div className="grid grid-cols-2 gap-4 px-4">
                    {currentQuestion.answers.map((answer, i) => (
                      <AnswerButton
                        key={i}
                        index={i}
                        text={answer}
                        selectedAnswer={currentAnswer}
                        correctAnswer={currentQuestion.correctAnswer}
                        onSelect={() => handleAnswerSelect(i)}
                      />
                    ))}
                  </div>
                  {!justAnswered && currentAnswer !== null && !showExplanation && qIndex < firstUnanswered && (
                    <div className="flex items-center justify-center gap-3 px-4 pb-4 pt-2">
                      <button
                        onClick={() => goToQuestion(firstUnanswered)}
                        className="min-h-[56px] px-6 rounded-2xl bg-white border-2 border-blue-200 text-blue-700 text-xl font-bold shadow-lg hover:border-blue-400 transition-colors"
                      >
                        מעבר לשאלה הנוכחית
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {showExplanation && (
              <ExplanationCard
                question={currentQuestion}
                isCorrect={currentAnswer === currentQuestion.correctAnswer}
                onNext={handleNext}
                onClose={() => setShowExplanation(false)}
                onPrev={handleBack}
                isLast={qIndex + 1 >= gameQuestions.length}
                isFirst={qIndex === 0}
              />
            )}
          </motion.main>
        )}

        {phase === 'results' && (
          <motion.div key="results" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <ResultScreen
              score={score}
              correctCount={Math.round(score / 10)}
              total={gameQuestions.length}
              playerName={playerName}
              onNewGame={() => setPhase('setup')}
              onHome={resetToIdle}
              onBack={handleBack}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExit && (
          <ExitConfirmDialog onContinue={() => setShowExit(false)} onExit={handleExit} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWarning && phase !== 'idle' && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: 'rgba(15,30,60,0.7)' }}
            role="alertdialog"
            aria-label="אזהרת איפוס אוטומטי"
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl text-center"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
            >
              <div className="text-5xl mb-4">⏰</div>
              <h3 className="text-2xl font-bold text-blue-950 mb-4">המשחק עומד להתאפס</h3>
              <p className="text-lg text-blue-600 mb-2">געו במסך כדי להמשיך</p>
              <div className="text-6xl font-bold text-orange-500 mb-4">{countdown}</div>
              <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-orange-500"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: countdown, ease: 'linear' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {flyingPoints.map((fp) => (
        <FlyingPoints
          key={fp.id}
          id={fp.id}
          isStreak={fp.isStreak}
          streakCount={fp.streakCount}
          onComplete={() => setFlyingPoints((prev) => prev.filter((f) => f.id !== fp.id))}
        />
      ))}
    </div>
  );
}