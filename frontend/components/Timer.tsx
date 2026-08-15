"use client";

import { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimerProps {
  initialSeconds?: number;
  onTimeUp?: () => void;
  isLocked: boolean;
}

export default function Timer({ initialSeconds = 300, onTimeUp, isLocked }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (isLocked || timeLeft <= 0) return;

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
  }, [timeLeft, isLocked, onTimeUp]);

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