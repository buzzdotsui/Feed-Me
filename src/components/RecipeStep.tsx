'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Check, Timer } from 'lucide-react';
import { RecipeStep } from '@/lib/mockAI';

interface Props {
  step: RecipeStep;
  stepNumber: number;
  totalSteps: number;
  isActive: boolean;
  isCompleted: boolean;
  onComplete: () => void;
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function RecipeStep({ step, stepNumber, totalSteps, isActive, isCompleted, onComplete }: Props) {
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(step.timerSeconds ?? 0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setTimerRunning(false);
            clearInterval(intervalRef.current!);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current!);
  }, [timerRunning]);

  function handleTimer() {
    if (timeLeft === 0) {
      setTimeLeft(step.timerSeconds!);
      setTimerRunning(false);
    } else {
      setTimerRunning((r) => !r);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: isActive ? 1 : 0.5, x: 0, scale: isActive ? 1 : 0.97 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl p-6 mb-4 border-2"
      style={{
        backgroundColor: isCompleted ? '#F0FDF4' : isActive ? '#FFFBF6' : '#F9F5EE',
        borderColor: isCompleted ? '#86EFAC' : isActive ? '#FF6B35' : '#E5DDD0',
      }}
    >
      {/* Step header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
          style={{
            backgroundColor: isCompleted ? '#16A34A' : isActive ? '#FF6B35' : '#D4C9BC',
            color: '#fff',
          }}
        >
          {isCompleted ? <Check size={16} /> : stepNumber}
        </div>
        <div>
          <p className="text-xs text-stone-500 font-medium">
            Step {stepNumber} of {totalSteps}
          </p>
          <h3 className="font-bold text-stone-900 text-base leading-tight">{step.title}</h3>
        </div>
      </div>

      {/* Instruction */}
      <p className="text-stone-700 leading-relaxed text-[15px] mb-4">{step.instruction}</p>

      {/* Timer button */}
      {step.timerSeconds && isActive && !isCompleted && (
        <motion.button
          onClick={handleTimer}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold mb-4 w-full justify-center"
          style={{
            backgroundColor: timerRunning ? '#FEF3C7' : '#FFF4EC',
            color: timerRunning ? '#92400E' : '#EA580C',
            border: `2px solid ${timerRunning ? '#FCD34D' : '#FED7AA'}`,
          }}
          aria-label={timerRunning ? 'Pause timer' : 'Start timer'}
        >
          {timerRunning ? (
            <>
              <Timer size={16} />
              <span>{formatTime(timeLeft)} remaining — tap to pause</span>
            </>
          ) : timeLeft === 0 ? (
            <>
              <Check size={16} />
              <span>Timer done! ✅</span>
            </>
          ) : (
            <>
              <Play size={16} />
              <span>Start {formatTime(step.timerSeconds)} timer</span>
            </>
          )}
        </motion.button>
      )}

      {/* Done button */}
      {isActive && !isCompleted && (
        <motion.button
          onClick={onComplete}
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 rounded-2xl font-bold text-white text-base"
          style={{
            background: 'linear-gradient(135deg, #FF6B35, #E85A24)',
            boxShadow: '0 4px 16px rgba(255,107,53,0.28)',
          }}
        >
          Tap when done ✓
        </motion.button>
      )}
    </motion.div>
  );
}
