"use client";

import { useEffect, useState } from 'react';
import { sfx } from '@/utils/soundEffects';

export interface Reaction {
  id: string;
  emoji: string;
  left: number;
}

const EMOJI_LIST = ['🔥', '💀', '🚀', '🧠', '💩', '⚡', '👑'];

interface FloatingReactionsProps {
  reactions: Reaction[];
  onSendReaction?: (emoji: string) => void;
  isSpectator?: boolean;
}

export default function FloatingReactions({
  reactions,
  onSendReaction,
  isSpectator = false,
}: FloatingReactionsProps) {
  const [activeReactions, setActiveReactions] = useState<Reaction[]>([]);

  useEffect(() => {
    if (reactions.length > 0) {
      const latest = reactions[reactions.length - 1];
      setActiveReactions((prev) => [...prev, latest]);
      sfx.playReactionPop();

      const timer = setTimeout(() => {
        setActiveReactions((prev) => prev.filter((r) => r.id !== latest.id));
      }, 3200);

      return () => clearTimeout(timer);
    }
  }, [reactions]);

  return (
    <>
      {/* Floating Emojis Layer */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {activeReactions.map((r) => (
          <div
            key={r.id}
            style={{ left: `${r.left}%` }}
            className="absolute bottom-16 text-2xl sm:text-3xl animate-float-up select-none"
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* Spectator Bottom Emoji Dock */}
      {isSpectator && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#171A21] border border-[#2A2F38] px-3.5 py-1.5 rounded-xl shadow-xl flex items-center space-x-1.5 animate-in fade-in duration-200">
          <span className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider mr-1 hidden sm:inline">
            Reaction:
          </span>
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onSendReaction?.(emoji)}
              className="text-lg hover:scale-125 active:scale-95 transition transform duration-150 p-1 rounded hover:bg-[#0F1115]"
              title={`Send ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </>
  );
}