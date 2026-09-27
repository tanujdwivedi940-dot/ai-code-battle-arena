"use client";

import { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX, Radio, ShieldAlert } from 'lucide-react';
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
    utterance.rate = latestMessage.isTactical ? 1.05 : 1.15;
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
    <div className={`rounded-xl p-2.5 sm:p-3 mb-3 shadow-sm transition-all border ${
      latestMessage?.isTactical
        ? 'bg-cp-card border-cp-accent/40'
        : 'bg-cp-card border-cp-border'
    }`}>
      <div className="flex items-center justify-between gap-3">
        
        <div className="flex items-center space-x-2 flex-1 overflow-hidden">
          {latestMessage?.isTactical ? (
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-cp-accent/10 text-cp-accent border border-cp-accent/30 text-[10px] font-mono shrink-0">
              <ShieldAlert className="w-3 h-3" />
              <span className="font-bold">BOOTH ANALYSIS</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-cp-bg text-cp-blue border border-cp-border text-[10px] font-mono shrink-0">
              <Radio className="w-3 h-3 text-cp-success" />
              <span className="font-bold uppercase tracking-wider">LIVE STADIUM CASTER</span>
            </div>
          )}

          <div className="flex-1 overflow-hidden text-left">
            <p className={`text-xs font-mono truncate ${latestMessage?.isTactical ? 'text-cp-accent' : 'text-cp-text'}`}>
              {latestMessage ? (
                <span>"{latestMessage.text}"</span>
              ) : (
                <span className="text-cp-muted italic">Waiting for tournament action to kick off...</span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={toggleVoice}
          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-cp-bg border border-cp-border text-[11px] font-mono text-cp-muted hover:text-cp-heading transition shrink-0"
        >
          {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-cp-success" /> : <VolumeX className="w-3.5 h-3.5 text-cp-muted" />}
          <span className="font-semibold uppercase text-[10px]">{voiceEnabled ? 'VOICE ON' : 'MUTED'}</span>
        </button>

      </div>
    </div>
  );
}