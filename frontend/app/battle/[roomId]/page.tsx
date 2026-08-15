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
import { Copy, Check, Swords, Send, Bot, Eye, Users } from 'lucide-react';

export default function BattleRoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.roomId as string;
  const requestedRole = searchParams.get('view') || undefined;

  const { address } = useAccount();
  const [copied, setCopied] = useState(false);

  const {
    socketId,
    isSpectator,
    spectatorCount,
    players,
    problem,
    battleState,
    myLanguage,
    opponentLanguage,
    setMyLanguage,
    myCode,
    opponentCode,
    commentary,
    reactions,
    result,
    sendReady,
    sendCodeUpdate,
    submitCode,
    sendReaction,
  } = useBattleSocket(roomId, address, requestedRole);

  const me = players.find((p) => p.id === socketId);
  const opponent = players.find((p) => p.id !== socketId);

  const player1 = players.find((p) => p.slot === 'player1');
  const player2 = players.find((p) => p.slot === 'player2');

  const copyInviteLink = (asSpectator = false) => {
    const url = asSpectator ? `${window.location.origin}/battle/${roomId}?view=spectator` : window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 relative">
      
      {/* Floating Twitch-Style Emoji Layer */}
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
            <Timer isLocked={me?.submitted || false} onTimeUp={submitCode} />
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

      {/* LOBBY VIEW */}
      {battleState === 'waiting' && (
        <div className="max-w-3xl mx-auto my-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Slot 1 */}
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
                  className="mt-6 w-full py-3 bg-gradient-to-r from-arena-neonCyan to-arena-neonPurple text-black font-bold rounded-xl text-sm hover:scale-[1.02] transition"
                >
                  Ready Up
                </button>
              )}
            </div>

            {/* Slot 2 */}
            <div className={`bg-arena-card border p-6 rounded-2xl shadow-xl ${
              me?.slot === 'player2' ? 'border-arena-neonPurple glow-purple' : 'border-arena-border'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-arena-neonPurple/10 text-arena-neonPurple border border-arena-neonPurple/30">
                  PLAYER 2 {me?.slot === 'player2' ? '(YOU)' : ''}
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
                  className="mt-6 w-full py-3 bg-gradient-to-r from-arena-neonPurple to-pink-500 text-white font-bold rounded-xl text-sm hover:scale-[1.02] transition"
                >
                  Ready Up
                </button>
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
            
            {/* Player 1 Editor View */}
            <div className="space-y-3">
              <BattleEditor
                title={isSpectator ? `PLAYER 1 (${player1?.walletAddress.substring(0, 6)}...)` : `YOUR ARENA (${me?.walletAddress ? `${me.walletAddress.substring(0, 6)}...` : 'YOU'})`}
                code={isSpectator ? player1?.code || '' : myCode}
                language={isSpectator ? player1?.language : myLanguage}
                onLanguageChange={setMyLanguage}
                onChange={sendCodeUpdate}
                readOnly={isSpectator}
                isSubmitted={isSpectator ? player1?.submitted : me?.submitted}
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

            {/* Player 2 Editor View */}
            <div className="space-y-3">
              <BattleEditor
                title={isSpectator ? `PLAYER 2 (${player2?.walletAddress.substring(0, 6)}...)` : `OPPONENT (${opponent?.walletAddress ? `${opponent.walletAddress.substring(0, 6)}...` : 'OPPONENT'})`}
                code={isSpectator ? player2?.code || '' : opponentCode}
                language={isSpectator ? player2?.language : opponentLanguage}
                readOnly={true}
                isSubmitted={isSpectator ? player2?.submitted : opponent?.submitted}
                accentColor="purple"
              />

              <div className="p-3.5 rounded-xl bg-arena-card border border-arena-border text-center text-xs font-mono text-gray-400">
                {(isSpectator ? player2?.submitted : opponent?.submitted) ? (
                  <span className="text-arena-neonGreen font-semibold">Submitted solution locked for AI evaluation!</span>
                ) : (
                  <span>Live typing in progress...</span>
                )}
              </div>
            </div>
          </div>

          {/* AI Referee Animation */}
          {battleState === 'judging' && (
            <div className="p-8 rounded-2xl bg-arena-card border border-yellow-500/50 glow-purple text-center my-6 animate-pulse">
              <Bot className="w-10 h-10 text-yellow-400 mx-auto animate-bounce mb-3" />
              <h2 className="text-xl font-bold text-gray-100">Google Gemini AI Referee Evaluating...</h2>
              <p className="text-xs text-gray-400 mt-2 font-mono">
                Scoring correctness, time complexity, and memory management across both submissions.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Winner Post-Match Modal */}
      {battleState === 'completed' && result && (
        <WinnerModal result={result} userAddress={address || me?.walletAddress} />
      )}

    </div>
  );
}