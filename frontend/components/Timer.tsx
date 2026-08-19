"use client";

import { useEffect, useState } from 'react';
import { Clock, AlertTriangle, Infinity as InfinityIcon } from 'lucide-react';

interface TimerProps {
  initialSeconds?: number;
  onTimeUp?: () => void;
  isLocked: boolean;
}

export default function Timer({ initialSeconds = 300, onTimeUp, isLocked }: TimerProps) {
  const isUnlimited = !initialSeconds || initialSeconds <= 0;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (isUnlimited || isLocked || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isLocked, isUnlimited, onTimeUp]);

  // ♾️ UNLIMITED NO-TIMER MODE
  if (isUnlimited) {
    return (
      <div className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-arena-neonCyan/40 bg-arena-neonCyan/10 text-arena-neonCyan font-mono font-bold text-xs shadow-md glow-cyan">
        <InfinityIcon className="w-4 h-4 text-arena-neonCyan animate-pulse" />
        <span>NO TIMER (UNLIMITED)</span>
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft < 30;

  return (
    <div
      className={`flex items-center space-x-2 px-4 py-2 rounded-xl border font-mono font-bold text-sm transition-all ${
        isUrgent
          ? 'bg-arena-neonRed/20 border-arena-neonRed text-arena-neonRed animate-pulse glow-red'
          : 'bg-arena-card border-arena-border text-gray-200'
      }`}
    >
      {isUrgent ? <AlertTriangle className="w-4 h-4 text-arena-neonRed animate-bounce" /> : <Clock className="w-4 h-4 text-arena-neonCyan" />}
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}