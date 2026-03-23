'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Check, Timer } from 'lucide-react';
import type { RecipeStep as RecipeStepType } from '@/lib/mockAI';

interface Props {
  step: RecipeStepType;
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
      animate={{ opacity: isActive ? 1 : 0.4, x: 0, scale: isActive ? 1 : 0.97 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-[2rem] p-6 mb-5 border backdrop-blur-xl transition-all duration-500 relative overflow-hidden ${isCompleted ? 'bg-neon-emerald/5 border-neon-emerald/30 shadow-[0_0_20px_rgba(0,232,143,0.1)]' : isActive ? 'bg-white/5 border-neon-orange/40 shadow-[0_8px_32px_rgba(255,107,0,0.15)]' : 'bg-white/[0.02] border-white/5'}`}
    >
      {isActive && !isCompleted && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-orange/10 blur-[50px] rounded-full pointer-events-none" />
      )}

      {/* Step header */}
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div
          className={`w-12 h-12 rounded-[1rem] flex items-center justify-center font-black text-lg flex-shrink-0 shadow-inner ${isCompleted ? 'bg-neon-emerald text-[#050505] shadow-[0_0_15px_rgba(0,232,143,0.5)]' : isActive ? 'bg-neon-orange text-[#050505] shadow-[0_0_15px_rgba(255,107,0,0.5)]' : 'bg-white/10 text-zinc-400'}`}
        >
          {isCompleted ? <Check size={22} strokeWidth={3} /> : stepNumber}
        </div>
        <div>
          <p className="text-[10px] font-black tracking-widest uppercase text-zinc-500 mb-0.5">
            Step {stepNumber} <span className="text-zinc-700">/</span> {totalSteps}
          </p>
          <h3 className={`font-extrabold text-lg leading-tight ${isCompleted ? 'text-emerald-50' : isActive ? 'text-white' : 'text-zinc-300'}`}>{step.title}</h3>
        </div>
      </div>

      {/* Instruction */}
      <p className={`leading-relaxed text-[15px] mb-6 font-medium relative z-10 ${isActive ? 'text-zinc-200' : 'text-zinc-500'}`}>{step.instruction}</p>

      {/* Timer button */}
      {step.timerSeconds && isActive && !isCompleted && (
        <motion.button
          onClick={handleTimer}
          whileTap={{ scale: 0.96 }}
          className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold mb-5 w-full justify-center transition-all relative z-10 ${timerRunning ? 'bg-neon-amber/20 text-amber-300 border border-neon-amber/50 shadow-[0_0_20px_rgba(255,184,0,0.3)]' : 'bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/10'}`}
          aria-label={timerRunning ? 'Pause timer' : 'Start timer'}
        >
          {timerRunning ? (
            <>
              <Timer size={18} className="animate-pulse" />
              <span>{formatTime(timeLeft)} remaining — tap to pause</span>
            </>
          ) : timeLeft === 0 ? (
            <>
              <Check size={18} className="text-neon-emerald" />
              <span className="text-neon-emerald">Timer done!</span>
            </>
          ) : (
            <>
              <Play size={18} />
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
          className="w-full py-4 rounded-xl font-black text-[#050505] text-base relative z-10 overflow-hidden group"
          style={{
            background: 'linear-gradient(135deg, #FFB800, #FF6B00)',
            boxShadow: '0 8px 25px rgba(255,107,0,0.4)',
          }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Tap when done <Check size={20} strokeWidth={3} />
          </span>
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      )}
    </motion.div>
  );
}
