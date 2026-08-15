"use client";

import { useEffect, useState } from 'react';
import { sfx } from '@/utils/soundEffects';

export interface Reaction {
  id: string;
  emoji: string;
  left: number; // percentage across screen
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

      // Clean up after floating animation ends
      const timer = setTimeout(() => {
        setActiveReactions((prev) => prev.filter((r) => r.id !== latest.id));
      }, 3500);

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
            className="absolute bottom-16 text-3xl sm:text-4xl animate-float-up select-none"
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* Spectator Emoji Dock at the bottom */}
      {isSpectator && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-arena-card/90 backdrop-blur-md border border-arena-neonPurple/50 px-4 py-2 rounded-2xl shadow-2xl flex items-center space-x-2 glow-purple animate-in fade-in slide-in-from-bottom-4 duration-300">
          <span className="text-[11px] font-mono font-bold text-arena-neonPurple uppercase tracking-wider mr-1 hidden sm:inline">
            Cheer:
          </span>
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onSendReaction?.(emoji)}
              className="text-xl sm:text-2xl hover:scale-135 active:scale-95 transition transform duration-150 p-1.5 rounded-lg hover:bg-arena-bg"
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