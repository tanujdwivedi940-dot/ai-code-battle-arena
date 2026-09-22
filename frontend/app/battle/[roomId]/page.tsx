"use client";

import { useParams, useSearchParams } from 'next/navigation';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { useState } from 'react';
import { useBattleSocket } from '@/hooks/useBattleSocket';
import ProblemCard from '@/components/ProblemCard';
import BattleEditor from '@/components/BattleEditor';
import Timer from '@/components/Timer';
import CommentaryFeed from '@/components/CommentaryFeed';
import WinnerModal from '@/components/WinnerModal';
import FloatingReactions from '@/components/FloatingReactions';
import { 
  Copy, 
  Check, 
  Swords, 
  Send, 
  Bot, 
  Eye, 
  Users, 
  Clock, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Coins,
  Loader2, 
  Lock,
  ShieldCheck
} from 'lucide-react';
import { sfx } from '@/utils/soundEffects';
import { BATTLE_ARENA_ADDRESS, BATTLE_ARENA_ABI, STAKE_TIERS } from '@/config/contracts';

export default function BattleRoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.roomId as string;
  const requestedRole = searchParams.get('view') || undefined;
  const problemId = searchParams.get('problem') || undefined;

  const { address, isConnected } = useAccount();
  const [copied, setCopied] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [customMinsInput, setCustomMinsInput] = useState('');

  // 💰 Staking Contract Call
  const { writeContract, data: stakeTxHash, isPending: isStakingTx } = useWriteContract();
  const { isLoading: isWaitingStakeReceipt } = useWaitForTransactionReceipt({ hash: stakeTxHash });

  const {
    socketId,
    isSpectator,
    spectatorCount,
    players,
    problem,
    battleState,
    persona,
    durationSeconds,
    stakeAmount,
    myLanguage,
    opponentLanguage,
    isOptimisticallySubmitted,
    setStakeTier,
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

  // 🤖 Check if battle is versus an AI Bot
  const isVersusBot = Boolean(player2?.isBot || opponent?.isBot);
  const isMyCodeLocked = Boolean(isOptimisticallySubmitted || me?.submitted || battleState === 'judging' || battleState === 'completed');

  // 💰 Staking Handler (Only prompts MetaMask if playing against a real human with stake > 0)
  const handleStakeAndReady = async () => {
    const requiredStake = isVersusBot ? 0 : parseFloat(stakeAmount || '0.005');

    // 🚀 Free for AI Bots or 0 POL tier -> Immediate Ready Up without MetaMask popup!
    if (isVersusBot || requiredStake === 0 || !isConnected) {
      sendReady(false);
      return;
    }

    try {
      const cleanAmount = String(parseFloat(stakeAmount) || 0.005);
      const cleanRoomId = String(roomId).split('?')[0].trim();

      writeContract(
        {
          address: BATTLE_ARENA_ADDRESS,
          abi: BATTLE_ARENA_ABI,
          functionName: 'stake',
          args: [cleanRoomId],
          value: parseEther(cleanAmount),
          gas: 120000n, // 🔒 Explicit gas limit prevents MetaMask simulation failure!
        },
        {
          onSuccess: () => {
            sendReady(true);
          },
          onError: (err) => {
            console.warn('Staking cancelled or fallback:', err);
            sendReady(false);
          },
        }
      );
    } catch (err) {
      console.error('Staking execution error:', err);
      sendReady(false);
    }
  };

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
            <div className="flex items-center space-x-3 text-xs text-gray-400 mt-0.5 font-mono">
              <span className={`flex items-center space-x-1 ${isVersusBot ? 'text-arena-neonCyan' : 'text-yellow-400'}`}>
                {isVersusBot ? <Bot className="w-3.5 h-3.5" /> : <Coins className="w-3.5 h-3.5" />}
                <span>
                  {isVersusBot
                    ? 'AI Boss Fight (Free Practice - 0 POL)'
                    : parseFloat(stakeAmount) > 0
                    ? `Stake Pool: ${(parseFloat(stakeAmount) * 2).toFixed(3)} POL`
                    : 'Free Practice (0 POL)'}
                </span>
              </span>
              {spectatorCount > 0 && (
                <span className="inline-flex items-center space-x-1 text-arena-neonCyan">
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
              <Timer initialSeconds={durationSeconds} isLocked={isMyCodeLocked} onTimeUp={submitCode} />
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

      {/* 🌟 LOBBY VIEW 🌟 */}
      {battleState === 'waiting' && (
        <div className="max-w-4xl mx-auto my-6 space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 💰 1. Staking Tier Selector */}
            <div className="bg-arena-card border border-arena-border p-4 rounded-2xl shadow-xl flex flex-col justify-between text-left space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <h4 className="text-xs font-bold font-mono text-gray-200">Stake Tier</h4>
                </div>
                <span className="text-xs font-mono font-bold text-yellow-400">
                  {isVersusBot ? '0 POL (Free)' : parseFloat(stakeAmount) > 0 ? `${stakeAmount} POL` : 'Free'}
                </span>
              </div>

              {isVersusBot ? (
                <div className="p-2.5 rounded-xl bg-arena-neonCyan/10 border border-arena-neonCyan/30 text-[11px] font-mono text-arena-neonCyan flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>AI Boss Mode: 0 Stake Required. Free Training!</span>
                </div>
              ) : isCreator ? (
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                  {STAKE_TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setStakeTier(tier.amount)}
                      className={`p-1.5 rounded-xl border text-center transition ${
                        stakeAmount === tier.amount
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500 font-bold shadow-md'
                          : 'bg-arena-bg border-arena-border text-gray-400 hover:text-white'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] font-mono text-gray-500">
                  Host set match stake to {stakeAmount} POL. Total Pot: {(parseFloat(stakeAmount) * 2).toFixed(3)} POL.
                </p>
              )}
            </div>

            {/* ⏱️ 2. Match Duration */}
            <div className="bg-arena-card border border-arena-border p-4 rounded-2xl shadow-xl flex flex-col justify-between text-left space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-arena-neonCyan" />
                  <h4 className="text-xs font-bold font-mono text-gray-200">Match Duration</h4>
                </div>
                <span className="text-xs font-mono font-bold text-arena-neonCyan">
                  {isUnlimited ? '∞ Unlimited' : `${Math.floor(durationSeconds / 60)}m`}
                </span>
              </div>

              {isCreator ? (
                <div className="space-y-1.5">
                  <div className="grid grid-cols-4 gap-1.5 font-mono text-[11px]">
                    {[
                      { mins: 2, label: '2m' },
                      { mins: 5, label: '5m' },
                      { mins: 10, label: '10m' },
                      { mins: 0, label: '∞ No' },
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
                </div>
              ) : (
                <p className="text-[11px] font-mono text-gray-500">
                  Timer: {isUnlimited ? '∞ Unlimited Mode' : `${Math.floor(durationSeconds / 60)} minutes`}.
                </p>
              )}
            </div>

            {/* 🎙️ 3. Referee Persona */}
            <div className="bg-arena-card border border-arena-border p-4 rounded-2xl shadow-xl flex flex-col justify-between text-left space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-arena-neonPurple" />
                  <h4 className="text-xs font-bold font-mono text-gray-200">Referee Persona</h4>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                {[
                  { id: 'esports', name: '🎙️ Pro' },
                  { id: 'gordon_ramsay', name: '🔥 Gordon' },
                  { id: 'anime', name: '⚡ Anime' },
                  { id: 'drill_sergeant', name: '🪖 Drill' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => changePersona(p.id)}
                    className={`py-1.5 rounded-xl border text-center transition ${
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
                Status: {player1?.ready ? (!isVersusBot && parseFloat(stakeAmount) > 0 ? '💰 STAKED & READY 🔥' : '🔥 READY') : 'Not Ready'}
              </p>

              {me?.slot === 'player1' && !me?.ready && (
                <button
                  onClick={handleStakeAndReady}
                  disabled={isStakingTx || isWaitingStakeReceipt}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-arena-neonCyan to-arena-neonPurple text-black font-bold rounded-xl text-sm hover:scale-[1.02] transition font-mono shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {isStakingTx || isWaitingStakeReceipt ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Depositing Stake to Escrow...</span>
                    </>
                  ) : (
                    <>
                      {isVersusBot ? <Swords className="w-4 h-4" /> : <Coins className="w-4 h-4" />}
                      <span>
                        {isVersusBot
                          ? 'Ready Up (Free vs AI)'
                          : parseFloat(stakeAmount) > 0
                          ? `Stake ${stakeAmount} POL & Ready Up`
                          : 'Ready Up (Free)'}
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Slot 2: Player 2 OR AI Bot */}
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
                Status: {player2?.ready ? (player2.isBot ? '🔥 READY' : parseFloat(stakeAmount) > 0 ? '💰 STAKED & READY 🔥' : '🔥 READY') : 'Not Ready'}
              </p>

              {me?.slot === 'player2' && !me?.ready && !player2?.isBot && (
                <button
                  onClick={handleStakeAndReady}
                  disabled={isStakingTx || isWaitingStakeReceipt}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-arena-neonPurple to-pink-500 text-white font-bold rounded-xl text-sm hover:scale-[1.02] transition font-mono shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {isStakingTx || isWaitingStakeReceipt ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Depositing Stake to Escrow...</span>
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4" />
                      <span>{parseFloat(stakeAmount) > 0 ? `Stake ${stakeAmount} POL & Ready Up` : 'Ready Up (Free)'}</span>
                    </>
                  )}
                </button>
              )}

              {/* Spawn AI Bot */}
              {!player2 && (
                <div className="mt-4 pt-3 border-t border-arena-border space-y-2">
                  <span className="text-[11px] font-mono text-gray-400 block text-left font-bold">
                    No Opponent Online? Fight an AI Bot (100% Free):
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
                isSubmitted={isMyCodeLocked}
                isBlurred={false}
                accentColor="cyan"
              />

              {!isSpectator && (
                <button
                  onClick={submitCode}
                  disabled={isMyCodeLocked}
                  className={`w-full py-3.5 rounded-xl font-bold font-mono text-sm flex items-center justify-center space-x-2 transition shadow-xl ${
                    isMyCodeLocked
                      ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-arena-neonGreen to-emerald-500 hover:brightness-110 text-black cursor-pointer glow-cyan'
                  }`}
                >
                  {isMyCodeLocked ? (
                    <>
                      <Lock className="w-4 h-4 text-arena-neonGreen" />
                      <span>{battleState === 'judging' ? 'EVALUATING IN PROGRESS...' : 'CODE SUBMITTED & LOCKED'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>SUBMIT CODE FOR EVALUATION</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Player 2 / Opponent */}
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