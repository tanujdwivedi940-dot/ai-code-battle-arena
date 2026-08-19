"use client";

import { useParams, useSearchParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import { useBattleSocket } from '@/hooks/useBattleSocket';
import ProblemCard from '@/components/ProblemCard';
import BattleEditor from '@/components/BattleEditor';
import Timer from '@/components/Timer';
import CommentaryFeed from '@/components/CommentaryFeed';
import WinnerModal from '@/components/WinnerModal';
import FloatingReactions from '@/components/FloatingReactions';
import { Copy, Check, Swords, Send, Bot, Eye, Users, Clock, Volume2, VolumeX, Sparkles, Infinity as InfinityIcon } from 'lucide-react';
import { sfx } from '@/utils/soundEffects';

export default function BattleRoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.roomId as string;
  const requestedRole = searchParams.get('view') || undefined;
  const problemId = searchParams.get('problem') || undefined;

  const { address } = useAccount();
  const [copied, setCopied] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [customMinsInput, setCustomMinsInput] = useState('');

  const {
    socketId,
    isSpectator,
    spectatorCount,
    players,
    problem,
    battleState,
    persona,
    durationSeconds,
    myLanguage,
    opponentLanguage,
    setMatchDuration,
    setMyLanguage,
    myCode,
    opponentCode,
    commentary,
    reactions,
    result,
    sendReady,
    spawnBot,
    changePersona,
    sendCodeUpdate,
    submitCode,
    sendReaction,
  } = useBattleSocket(roomId, address, requestedRole, problemId);

  const me = players.find((p) => p.id === socketId);
  const opponent = players.find((p) => p.id !== socketId);
  const player1 = players.find((p) => p.slot === 'player1');
  const player2 = players.find((p) => p.slot === 'player2');
  const isCreator = me?.slot === 'player1';

  const isUnlimited = durationSeconds === 0;

  const copyInviteLink = (asSpectator = false) => {
    const url = asSpectator ? `${window.location.origin}/battle/${roomId}?view=spectator` : window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMusic = () => {
    if (isMusicMuted) {
      sfx.startBattleMusic(100);
      setIsMusicMuted(false);
    } else {
      sfx.stopBattleMusic();
      setIsMusicMuted(true);
    }
  };

  const handleCustomMinsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customMinsInput, 10);
    if (!isNaN(val) && val > 0) {
      setMatchDuration(val);
      setCustomMinsInput('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 relative">
      <FloatingReactions reactions={reactions} onSendReaction={sendReaction} isSpectator={isSpectator} />

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-arena-card border border-arena-border rounded-2xl mb-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-arena-neonCyan/20 to-arena-neonPurple/20 border border-arena-neonCyan/30">
            <Swords className="h-6 w-6 text-arena-neonCyan" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold font-mono text-gray-100">ARENA: {roomId}</h1>
              {isSpectator && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-arena-neonPurple border border-purple-500/40 uppercase font-bold flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>SPECTATOR</span>
                </span>
              )}
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${
                battleState === 'in-progress'
                  ? 'bg-arena-neonRed/20 text-arena-neonRed border border-arena-neonRed/30 animate-pulse'
                  : battleState === 'judging'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-bounce'
                  : battleState === 'completed'
                  ? 'bg-arena-neonGreen/20 text-arena-neonGreen border border-arena-neonGreen/30'
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              }`}>
                {battleState}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-400 mt-0.5">
              <span>Polygon Amoy 1v1 Arena</span>
              {spectatorCount > 0 && (
                <span className="inline-flex items-center space-x-1 text-arena-neonCyan font-mono">
                  <Users className="w-3 h-3" />
                  <span>{spectatorCount} Spectating</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {battleState === 'in-progress' && (
            <>
              <Timer initialSeconds={durationSeconds} isLocked={me?.submitted || false} onTimeUp={submitCode} />
              <button
                onClick={toggleMusic}
                className="p-2 rounded-xl bg-arena-bg border border-arena-border hover:border-arena-neonCyan text-gray-300 transition"
                title={isMusicMuted ? 'Unmute Battle Music' : 'Mute Battle Music'}
              >
                {isMusicMuted ? <VolumeX className="w-4 h-4 text-gray-500" /> : <Volume2 className="w-4 h-4 text-arena-neonGreen animate-pulse" />}
              </button>
            </>
          )}

          <button
            onClick={() => copyInviteLink(false)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-arena-bg border border-arena-border hover:border-arena-neonCyan rounded-xl text-xs font-mono text-gray-200 transition"
          >
            {copied ? <Check className="h-4 w-4 text-arena-neonGreen" /> : <Copy className="h-4 w-4 text-arena-neonCyan" />}
            <span>{copied ? 'Copied' : 'Share Battle'}</span>
          </button>

          <button
            onClick={() => copyInviteLink(true)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-arena-bg border border-arena-border hover:border-arena-neonPurple rounded-xl text-xs font-mono text-arena-neonPurple transition"
          >
            <Eye className="h-4 w-4" />
            <span>Spectator Link</span>
          </button>
        </div>
      </div>

      {/* Live AI Commentary Ticker */}
      <CommentaryFeed messages={commentary} isSpectator={isSpectator} />

      {/* 🌟 LOBBY VIEW: CUSTOM TIMER + UNLIMITED MODE + PERSONAS + BOT BOSS 🌟 */}
      {battleState === 'waiting' && (
        <div className="max-w-4xl mx-auto my-6 space-y-5">
          
          {/* Top Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* ⏱️ Battle Duration & Unlimited Control */}
            <div className="bg-arena-card border border-arena-border p-4 rounded-2xl shadow-xl flex flex-col justify-between text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-arena-neonCyan" />
                  <h4 className="text-xs font-bold font-mono text-gray-200">
                    Match Duration {isCreator ? '(Host Controls)' : ''}
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold text-arena-neonCyan">
                  {isUnlimited ? '∞ Unlimited' : `${Math.floor(durationSeconds / 60)} Mins`}
                </span>
              </div>

              {isCreator ? (
                <div className="space-y-2">
                  {/* Preset Buttons + Unlimited Button */}
                  <div className="grid grid-cols-5 gap-1.5 font-mono text-xs">
                    {[
                      { mins: 2, label: '2m' },
                      { mins: 5, label: '5m' },
                      { mins: 10, label: '10m' },
                      { mins: 15, label: '15m' },
                      { mins: 0, label: '∞ No Timer' },
                    ].map((t) => (
                      <button
                        key={t.label}
                        onClick={() => setMatchDuration(t.mins)}
                        className={`py-1.5 rounded-xl border text-center transition ${
                          (t.mins === 0 && isUnlimited) || (!isUnlimited && Math.floor(durationSeconds / 60) === t.mins)
                            ? 'bg-arena-neonCyan/20 text-arena-neonCyan border-arena-neonCyan font-bold'
                            : 'bg-arena-bg border-arena-border text-gray-400 hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Minutes Input Box */}
                  <form onSubmit={handleCustomMinsSubmit} className="flex gap-2 pt-1">
                    <input
                      type="number"
                      min="1"
                      max="180"
                      placeholder="Custom Mins (e.g. 7, 20)..."
                      value={customMinsInput}
                      onChange={(e) => setCustomMinsInput(e.target.value)}
                      className="flex-1 bg-arena-bg border border-arena-border rounded-xl px-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-arena-neonCyan font-mono"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-arena-card border border-arena-border hover:border-arena-neonCyan text-arena-neonCyan font-mono text-xs rounded-xl transition font-bold"
                    >
                      Set Custom
                    </button>
                  </form>
                </div>
              ) : (
                <p className="text-[11px] font-mono text-gray-500">
                  Host is setting the timer to {isUnlimited ? '∞ Unlimited Mode' : `${Math.floor(durationSeconds / 60)} minutes`}.
                </p>
              )}
            </div>

            {/* 🎙️ AI Referee Persona */}
            <div className="bg-arena-card border border-arena-border p-4 rounded-2xl shadow-xl flex flex-col justify-between text-left space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-arena-neonPurple" />
                  <h4 className="text-xs font-bold font-mono text-gray-200">Referee Persona</h4>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-xs">
                {[
                  { id: 'esports', name: '🎙️ Pro' },
                  { id: 'gordon_ramsay', name: '🔥 Gordon' },
                  { id: 'anime', name: '⚡ Anime' },
                  { id: 'drill_sergeant', name: '🪖 Drill' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => changePersona(p.id)}
                    className={`py-2 rounded-xl border text-center transition ${
                      persona === p.id
                        ? 'bg-arena-neonPurple/20 text-arena-neonPurple border-arena-neonPurple font-bold'
                        : 'bg-arena-bg border-arena-border text-gray-400 hover:text-white'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Lobby Slots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Slot 1: Player 1 */}
            <div className={`bg-arena-card border p-6 rounded-2xl shadow-xl ${
              me?.slot === 'player1' ? 'border-arena-neonCyan glow-cyan' : 'border-arena-border'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-arena-neonCyan/10 text-arena-neonCyan border border-arena-neonCyan/30">
                  PLAYER 1 {me?.slot === 'player1' ? '(YOU)' : ''}
                </span>
                <span className={`w-3 h-3 rounded-full ${player1 ? 'bg-arena-neonGreen' : 'bg-gray-600'}`} />
              </div>
              <h3 className="font-mono text-sm text-gray-300 truncate">
                {player1 ? player1.walletAddress : 'Waiting for player...'}
              </h3>
              <p className="text-xs text-gray-500 mt-1 font-mono">
                Status: {player1?.ready ? '🔥 READY' : player1 ? 'Not Ready' : 'Empty Slot'}
              </p>
              {me?.slot === 'player1' && !me?.ready && (
                <button
                  onClick={sendReady}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-arena-neonCyan to-arena-neonPurple text-black font-bold rounded-xl text-sm hover:scale-[1.02] transition font-mono"
                >
                  Ready Up
                </button>
              )}
            </div>

            {/* Slot 2: Player 2 OR Spawn AI Bot Boss */}
            <div className={`bg-arena-card border p-6 rounded-2xl shadow-xl ${
              me?.slot === 'player2' ? 'border-arena-neonPurple glow-purple' : 'border-arena-border'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-arena-neonPurple/10 text-arena-neonPurple border border-arena-neonPurple/30">
                  {player2?.isBot ? '🤖 AI BOSS' : 'PLAYER 2'} {me?.slot === 'player2' ? '(YOU)' : ''}
                </span>
                <span className={`w-3 h-3 rounded-full ${player2 ? 'bg-arena-neonGreen' : 'bg-arena-neonRed animate-ping'}`} />
              </div>
              <h3 className="font-mono text-sm text-gray-300 truncate">
                {player2 ? player2.walletAddress : 'Waiting for opponent...'}
              </h3>
              <p className="text-xs text-gray-500 mt-1 font-mono">
                Status: {player2?.ready ? '🔥 READY' : player2 ? 'Not Ready' : 'Empty Slot'}
              </p>

              {me?.slot === 'player2' && !me?.ready && (
                <button
                  onClick={sendReady}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-arena-neonPurple to-pink-500 text-white font-bold rounded-xl text-sm hover:scale-[1.02] transition font-mono"
                >
                  Ready Up
                </button>
              )}

              {/* 🤖 SPAWN AI BOT BOSS IF EMPTY */}
              {!player2 && (
                <div className="mt-4 pt-3 border-t border-arena-border space-y-2">
                  <span className="text-[11px] font-mono text-gray-400 block text-left font-bold">
                    No Friend Online? Fight an AI Bot:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                    <button
                      onClick={() => spawnBot('noob')}
                      className="p-2 rounded-xl bg-arena-bg border border-arena-border hover:border-emerald-500 text-emerald-400 font-bold transition"
                    >
                      Noob Bot
                    </button>
                    <button
                      onClick={() => spawnBot('intermediate')}
                      className="p-2 rounded-xl bg-arena-bg border border-arena-border hover:border-arena-neonCyan text-arena-neonCyan font-bold transition"
                    >
                      Cyber-Gemini
                    </button>
                    <button
                      onClick={() => spawnBot('grandmaster')}
                      className="p-2 rounded-xl bg-arena-bg border border-arena-border hover:border-arena-neonRed text-arena-neonRed font-bold transition"
                    >
                      Grandmaster
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* LIVE BATTLE & JUDGING VIEW */}
      {(battleState === 'in-progress' || battleState === 'judging' || battleState === 'completed') && (
        <div className="space-y-4">
          {problem && <ProblemCard problem={problem} />}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Player 1 Editor */}
            <div className="space-y-3">
              <BattleEditor
                title={isSpectator ? `PLAYER 1 (${player1?.walletAddress.substring(0, 6)}...)` : `YOUR ARENA (${me?.walletAddress ? `${me.walletAddress.substring(0, 6)}...` : 'YOU'})`}
                code={isSpectator ? player1?.code || '' : myCode}
                language={isSpectator ? player1?.language : myLanguage}
                onLanguageChange={setMyLanguage}
                onChange={sendCodeUpdate}
                readOnly={isSpectator}
                isSubmitted={isSpectator ? player1?.submitted : me?.submitted}
                isBlurred={false}
                accentColor="cyan"
              />

              {!isSpectator && (
                <button
                  onClick={submitCode}
                  disabled={me?.submitted || battleState !== 'in-progress'}
                  className={`w-full py-3.5 rounded-xl font-bold font-mono text-sm flex items-center justify-center space-x-2 transition shadow-xl ${
                    me?.submitted
                      ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-arena-neonGreen to-emerald-500 hover:brightness-110 text-black cursor-pointer glow-cyan'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>{me?.submitted ? 'CODE SUBMITTED & LOCKED' : 'SUBMIT CODE FOR EVALUATION'}</span>
                </button>
              )}
            </div>

            {/* Player 2 / Opponent Live Stream */}
            <div className="space-y-3">
              <BattleEditor
                title={isSpectator ? `PLAYER 2 (${player2?.walletAddress.substring(0, 6)}...)` : `OPPONENT (${opponent?.walletAddress ? `${opponent.walletAddress.substring(0, 6)}...` : 'OPPONENT'})`}
                code={isSpectator ? player2?.code || '' : opponentCode}
                language={isSpectator ? player2?.language : opponentLanguage}
                readOnly={true}
                isSubmitted={isSpectator ? player2?.submitted : opponent?.submitted}
                isBlurred={!isSpectator && battleState === 'in-progress'}
                accentColor="purple"
              />

              <div className="p-3.5 rounded-xl bg-arena-card border border-arena-border text-center text-xs font-mono text-gray-400">
                {(isSpectator ? player2?.submitted : opponent?.submitted) ? (
                  <span className="text-arena-neonGreen font-semibold">Opponent submitted! Code locked for evaluation.</span>
                ) : (
                  <span>Opponent typing live. Fog of war anti-cheat enabled.</span>
                )}
              </div>
            </div>
          </div>

          {/* AI Referee Animation */}
          {battleState === 'judging' && (
            <div className="p-8 rounded-2xl bg-arena-card border border-yellow-500/50 glow-purple text-center my-6 animate-pulse">
              <Bot className="w-10 h-10 text-yellow-400 mx-auto animate-bounce mb-3" />
              <h2 className="text-xl font-bold text-gray-100">
                {persona === 'gordon_ramsay' ? '🔥 Gordon Ramsay Inspecting Your Dish...' : persona === 'anime' ? '⚡ Grandmaster Anime Elder Evaluating Power Levels...' : 'Google Gemini AI Referee Evaluating...'}
              </h2>
              <p className="text-xs text-gray-400 mt-2 font-mono">
                Evaluating logic, time complexity, and memory management.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Winner Post-Match Modal */}
      {battleState === 'completed' && result && (
        <WinnerModal
          result={result}
          userAddress={me?.walletAddress || address}
          mySlot={me?.slot}
        />
      )}

    </div>
  );
}