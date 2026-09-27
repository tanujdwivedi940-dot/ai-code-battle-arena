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

  if (isUnlimited) {
    return (
      <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border border-cp-border bg-cp-card text-cp-blue font-mono font-semibold text-xs shadow-sm">
        <InfinityIcon className="w-3.5 h-3.5" />
        <span>Unlimited</span>
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft < 30;

  return (
    <div
      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border font-mono font-semibold text-xs transition-all ${
        isUrgent
          ? 'bg-cp-error/10 border-cp-error/40 text-cp-error'
          : 'bg-cp-card border-cp-border text-cp-heading'
      }`}
    >
      {isUrgent ? <AlertTriangle className="w-3.5 h-3.5 text-cp-error" /> : <Clock className="w-3.5 h-3.5 text-cp-blue" />}
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}