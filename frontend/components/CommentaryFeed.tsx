"use client";

import { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX, Radio, Eye, ShieldAlert } from 'lucide-react';
import { CommentaryMessage } from '@/hooks/useBattleSocket';

interface CommentaryFeedProps {
  messages: CommentaryMessage[];
  isSpectator?: boolean;
}

export default function CommentaryFeed({ messages, isSpectator = false }: CommentaryFeedProps) {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const latestMessage = messages[messages.length - 1];
  const lastSpokenRef = useRef<string>('');

  useEffect(() => {
    if (!voiceEnabled || !latestMessage || typeof window === 'undefined') return;
    if (latestMessage.text === lastSpokenRef.current) return;

    lastSpokenRef.current = latestMessage.text;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(latestMessage.text);
    utterance.rate = latestMessage.isTactical ? 1.05 : 1.15; // Deeper tone for spectator analysis
    utterance.pitch = latestMessage.isTactical ? 0.95 : 1.05;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((v) => v.lang.startsWith('en') && v.name.includes('Natural')) 
      || voices.find((v) => v.lang.startsWith('en'));

    if (englishVoice) utterance.voice = englishVoice;

    window.speechSynthesis.speak(utterance);
  }, [messages, voiceEnabled, latestMessage]);

  const toggleVoice = () => {
    if (voiceEnabled) window.speechSynthesis.cancel();
    setVoiceEnabled(!voiceEnabled);
  };

  return (
    <div className={`border rounded-2xl p-3.5 mb-4 shadow-lg overflow-hidden relative transition-all ${
      latestMessage?.isTactical
        ? 'bg-amber-950/40 border-amber-500/60 glow-red'
        : 'bg-arena-card border-arena-border glow-purple'
    }`}>
      <div className="flex items-center justify-between gap-3">
        
        <div className="flex items-center space-x-3 flex-1 overflow-hidden">
          {latestMessage?.isTactical ? (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-mono shrink-0 animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="font-bold">BOOTH TACTICAL ANALYSIS</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-arena-neonPurple/20 text-arena-neonPurple border border-arena-neonPurple/30 text-xs font-mono shrink-0">
              <Radio className="w-3.5 h-3.5 animate-pulse text-arena-neonRed" />
              <span className="font-bold">LIVE STADIUM CASTER</span>
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            <p className={`text-xs font-mono truncate ${latestMessage?.isTactical ? 'text-amber-200 font-semibold' : 'text-gray-100'}`}>
              {latestMessage ? (
                <span className="italic">"{latestMessage.text}"</span>
              ) : (
                <span className="text-gray-500 italic">Waiting for tournament action to kick off...</span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={toggleVoice}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition shrink-0 ${
            voiceEnabled
              ? 'bg-arena-neonCyan/10 border-arena-neonCyan/40 text-arena-neonCyan'
              : 'bg-gray-800 border-gray-700 text-gray-400'
          }`}
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{voiceEnabled ? 'VOICE ON' : 'MUTED'}</span>
        </button>

      </div>
    </div>
  );
}