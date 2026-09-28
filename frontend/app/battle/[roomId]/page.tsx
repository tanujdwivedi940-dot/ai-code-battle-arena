"use client";

import { useParams, useSearchParams } from 'next/navigation';
import { useAccount, useWriteContract } from 'wagmi';
import { parseEther, parseGwei } from 'viem';
import { useState, useEffect, useRef, Suspense } from 'react';
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
  ShieldCheck,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { sfx } from '@/utils/soundEffects';
import { BATTLE_ARENA_ADDRESS, BATTLE_ARENA_ABI, STAKE_TIERS } from '@/config/contracts';

function BattleArenaContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.roomId as string;
  const requestedRole = searchParams.get('view') || undefined;
  const problemId = searchParams.get('problem') || undefined;

  const { address, isConnected } = useAccount();
  const [copied, setCopied] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [customMinsInput, setCustomMinsInput] = useState('');

  const { writeContractAsync, isPending: isStakingTx } = useWriteContract();

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
    antiCheatWarning,
    auditLog,
    reportTabSwitch,
    reportFocusReturned,
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

  const player1 = players.find((p) => p.slot === 'player1');
  const player2 = players.find((p) => p.slot === 'player2');

  const me = players.find((p) => 
    (socketId && p.id === socketId) || 
    (address && p.walletAddress.toLowerCase() === address.toLowerCase())
  );

  const isMePlayer1 = me?.slot === 'player1';
  const isMePlayer2 = me?.slot === 'player2';

  const opponent = isMePlayer1 ? player2 : player1;
  const isCreator = isMePlayer1;
  const isUnlimited = durationSeconds === 0;

  const isVersusBot = Boolean(player2?.isBot || opponent?.isBot);
  const isMyCodeLocked = Boolean(isOptimisticallySubmitted || me?.submitted || battleState === 'judging' || battleState === 'completed');

  // Stop battle music when match concludes
  useEffect(() => {
    if (battleState === 'completed') {
      sfx.stopBattleMusic();
    }
  }, [battleState]);

  // Anti-cheat tab switch listener
  const isTabCurrentlyAwayRef = useRef<boolean>(false);

  useEffect(() => {
    if (battleState !== 'in-progress' || isSpectator || me?.submitted) {
      isTabCurrentlyAwayRef.current = false;
      return;
    }

    const handleTabLoss = () => {
      if (document.visibilityState === 'hidden' || !document.hasFocus()) {
        if (!isTabCurrentlyAwayRef.current) {
          isTabCurrentlyAwayRef.current = true;
          reportTabSwitch();
        }
      }
    };

    const handleTabReturn = () => {
      if (document.visibilityState === 'visible' && document.hasFocus()) {
        if (isTabCurrentlyAwayRef.current) {
          isTabCurrentlyAwayRef.current = false;
          reportFocusReturned();
        }
      }
    };

    document.addEventListener('visibilitychange', handleTabLoss);
    document.addEventListener('visibilitychange', handleTabReturn);
    window.addEventListener('blur', handleTabLoss);
    window.addEventListener('focus', handleTabReturn);

    return () => {
      document.removeEventListener('visibilitychange', handleTabLoss);
      document.removeEventListener('visibilitychange', handleTabReturn);
      window.removeEventListener('blur', handleTabLoss);
      window.removeEventListener('focus', handleTabReturn);
    };
  }, [battleState, isSpectator, me?.submitted, reportTabSwitch, reportFocusReturned]);

  // ⚡ FIXED: Passes 30 Gwei to satisfy Polygon Amoy minimum 25 Gwei validator fee
  const handleStakeAndReady = async () => {
    const requiredStake = isVersusBot ? 0 : parseFloat(stakeAmount || '0.005');

    if (isVersusBot || requiredStake === 0 || !isConnected) {
      sendReady(false);
      return;
    }

    try {
      const cleanAmount = String(parseFloat(stakeAmount) || 0.005);
      const cleanRoomId = String(roomId).split('?')[0].trim();

      await writeContractAsync({
        address: BATTLE_ARENA_ADDRESS,
        abi: BATTLE_ARENA_ABI,
        functionName: 'stake',
        args: [cleanRoomId],
        value: parseEther(cleanAmount),
        maxPriorityFeePerGas: parseGwei('30'), // Exceeds the 25 Gwei minimum
        maxFeePerGas: parseGwei('60'),
      } as any);

      sendReady(true);
    } catch (err) {
      console.warn('Staking cancelled or fallback:', err);
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 relative text-cp-text">
      <FloatingReactions reactions={reactions} onSendReaction={sendReaction} isSpectator={isSpectator} />

      {/* 5-SECOND RETURN COUNTDOWN OVERLAY */}
      {antiCheatWarning && antiCheatWarning.active && battleState === 'in-progress' && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-cp-card border border-cp-error max-w-md w-full rounded-2xl p-6 sm:p-8 text-center shadow-2xl space-y-4 animate-modal-in">
            <div className="w-14 h-14 rounded-2xl bg-cp-error/10 border border-cp-error/30 flex items-center justify-center mx-auto text-cp-error animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cp-error">
                Anti-Cheat Violation (Warning {antiCheatWarning.switchCount}/2)
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-cp-heading">
                Return to the battle
              </h2>
            </div>

            <p className="text-xs text-cp-muted leading-relaxed font-mono">
              Switching tabs or minimizing the window is prohibited. You must refocus this tab immediately or your match will be terminated.
            </p>

            <div className="py-3 px-4 rounded-xl bg-cp-bg border border-cp-error/40 inline-flex items-center space-x-2 font-mono font-bold text-2xl text-cp-error">
              <Clock className="w-6 h-6 animate-spin" />
              <span>{antiCheatWarning.countdown}s remaining</span>
            </div>

            <p className="text-[10px] font-mono text-cp-muted">
              Focus returned will resume the battle automatically.
            </p>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-cp-card border border-cp-border flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl mb-3 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-cp-bg border border-cp-border flex items-center justify-center text-cp-blue">
            <Swords className="h-4 w-4" />
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-2">
              <h1 className="text-xs sm:text-sm font-bold font-mono text-cp-heading uppercase">{roomId}</h1>
              {isSpectator && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cp-bg text-cp-muted border border-cp-border font-semibold flex items-center space-x-1">
                  <Eye className="w-2.5 h-2.5 text-cp-accent" />
                  <span>SPECTATOR</span>
                </span>
              )}
              <span className={`text-[9px] font-mono px-2 py-0.2 rounded uppercase font-bold ${
                battleState === 'in-progress'
                  ? 'bg-cp-error/10 text-cp-error border border-cp-error/30'
                  : battleState === 'judging'
                  ? 'bg-cp-accent/10 text-cp-accent border border-cp-accent/30'
                  : battleState === 'completed'
                  ? 'bg-cp-success/10 text-cp-success border border-cp-success/30'
                  : 'bg-cp-bg text-cp-muted border border-cp-border'
              }`}>
                {battleState}
              </span>
            </div>
            <div className="flex items-center space-x-2.5 text-[11px] text-cp-muted mt-0.5 font-mono">
              <span className="flex items-center space-x-1">
                {isVersusBot ? <Bot className="w-3 h-3 text-cp-blue" /> : <Coins className="w-3 h-3 text-cp-accent" />}
                <span>
                  {isVersusBot
                    ? 'AI Boss Fight (Free Practice - 0 POL)'
                    : parseFloat(stakeAmount) > 0
                    ? `Stake Pool: ${(parseFloat(stakeAmount) * 2).toFixed(3)} POL`
                    : 'Free Practice (0 POL)'}
                </span>
              </span>
              {spectatorCount > 0 && (
                <span className="inline-flex items-center space-x-1 text-cp-muted">
                  <Users className="w-3 h-3" />
                  <span>{spectatorCount} Spectating</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {battleState === 'in-progress' && (
            <>
              <Timer initialSeconds={durationSeconds} isLocked={isMyCodeLocked} onTimeUp={submitCode} />
              <button
                onClick={toggleMusic}
                className="p-1.5 rounded-lg bg-cp-bg border border-cp-border text-cp-muted hover:text-cp-heading transition"
                title={isMusicMuted ? 'Unmute Battle Music' : 'Mute Battle Music'}
              >
                {isMusicMuted ? <VolumeX className="w-3.5 h-3.5 text-cp-muted" /> : <Volume2 className="w-3.5 h-3.5 text-cp-success" />}
              </button>
            </>
          )}

          <button
            onClick={() => copyInviteLink(false)}
            className="bg-cp-bg hover:bg-[#1E232B] border border-cp-border text-cp-text hover:text-white flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono transition"
          >
            {copied ? <Check className="h-3 w-3 text-cp-success" /> : <Copy className="h-3 w-3 text-cp-muted" />}
            <span>{copied ? 'Copied' : 'Share Battle'}</span>
          </button>

          <button
            onClick={() => copyInviteLink(true)}
            className="bg-cp-bg hover:bg-[#1E232B] border border-cp-border text-cp-muted hover:text-cp-heading flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono transition"
          >
            <Eye className="h-3 w-3" />
            <span>Spectator Link</span>
          </button>
        </div>
      </div>

      {/* Live Commentary Feed */}
      <CommentaryFeed messages={commentary} isSpectator={isSpectator} />

      {/* LOBBY VIEW */}
      {battleState === 'waiting' && (
        <div className="max-w-4xl mx-auto my-4 space-y-3.5 text-left">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* 1. Stake Tier */}
            <div className="bg-cp-card border border-cp-border p-3.5 rounded-2xl flex flex-col justify-between space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Coins className="w-3.5 h-3.5 text-cp-accent" />
                  <h4 className="text-xs font-semibold text-cp-heading">Stake Tier</h4>
                </div>
                <span className="text-xs font-mono font-bold text-cp-accent">
                  {isVersusBot ? '0.005 POL' : parseFloat(stakeAmount) > 0 ? `${stakeAmount} POL` : 'Free'}
                </span>
              </div>

              {isVersusBot ? (
                <div className="p-2 rounded-xl bg-cp-bg border border-cp-border text-[10px] font-mono text-cp-muted">
                  Host set match stake to 0.005 POL. Total Pot: 0.010 POL.
                </div>
              ) : isCreator ? (
                <div className="grid grid-cols-2 gap-1 font-mono text-[10px]">
                  {STAKE_TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setStakeTier(tier.amount)}
                      className={`p-1 rounded-lg border text-center transition ${
                        stakeAmount === tier.amount
                          ? 'bg-cp-bg text-cp-accent border-cp-accent font-bold shadow-sm'
                          : 'bg-cp-bg border-cp-border text-cp-muted hover:text-cp-heading'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] font-mono text-cp-muted">
                  Host set match stake to {stakeAmount} POL. Total Pot: {(parseFloat(stakeAmount) * 2).toFixed(3)} POL.
                </p>
              )}
            </div>

            {/* 2. Match Duration */}
            <div className="bg-cp-card border border-cp-border p-3.5 rounded-2xl flex flex-col justify-between space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-cp-blue" />
                  <h4 className="text-xs font-semibold text-cp-heading">Match Duration</h4>
                </div>
                <span className="text-xs font-mono font-bold text-cp-blue">
                  {isUnlimited ? '∞ Unlimited' : `${Math.floor(durationSeconds / 60)}m`}
                </span>
              </div>

              {isCreator ? (
                <div className="space-y-1">
                  <div className="grid grid-cols-4 gap-1 font-mono text-[10px]">
                    {[
                      { mins: 2, label: '2m' },
                      { mins: 5, label: '5m' },
                      { mins: 10, label: '10m' },
                      { mins: 0, label: '∞ No' },
                    ].map((t) => (
                      <button
                        key={t.label}
                        onClick={() => setMatchDuration(t.mins)}
                        className={`py-1 rounded-lg border text-center transition ${
                          (t.mins === 0 && isUnlimited) || (!isUnlimited && Math.floor(durationSeconds / 60) === t.mins)
                            ? 'bg-cp-bg text-cp-blue border-cp-blue font-bold'
                            : 'bg-cp-bg border-cp-border text-cp-muted hover:text-cp-heading'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[10px] font-mono text-cp-muted">
                  Timer: {isUnlimited ? '∞ Unlimited Mode' : `${Math.floor(durationSeconds / 60)} minutes`}.
                </p>
              )}
            </div>

            {/* 3. AI Persona */}
            <div className="bg-cp-card border border-cp-border p-3.5 rounded-2xl flex flex-col justify-between space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cp-accent" />
                  <h4 className="text-xs font-semibold text-cp-heading">Referee Persona</h4>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 font-mono text-[10px]">
                {[
                  { id: 'esports', name: '🎙️ Pro' },
                  { id: 'gordon_ramsay', name: '🔥 Gordon' },
                  { id: 'anime', name: '⚡ Anime' },
                  { id: 'drill_sergeant', name: '🪖 Drill' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => changePersona(p.id)}
                    className={`py-1 rounded-lg border text-center transition ${
                      persona === p.id
                        ? 'bg-cp-bg text-cp-blue border-cp-blue font-bold'
                        : 'bg-cp-bg border-cp-border text-cp-muted hover:text-cp-heading'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Lobby Slots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Slot 1: Host */}
            <div className="bg-cp-card border border-cp-blue/40 p-5 rounded-2xl text-left flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cp-blue/10 text-cp-blue border border-cp-blue/30 font-bold uppercase">
                    PLAYER 1 {isMePlayer1 ? '(YOU)' : ''}
                  </span>
                  <span className={`w-2.5 h-2.5 rounded-full ${player1?.ready ? 'bg-cp-success' : 'bg-cp-blue animate-pulse'}`} />
                </div>
                <h3 className="font-mono text-xs text-cp-heading truncate font-semibold">
                  {player1?.walletAddress || 'Waiting for player...'}
                </h3>
                <p className="text-[10px] text-cp-muted mt-0.5 font-mono">
                  Status: {player1?.ready ? (!isVersusBot && parseFloat(stakeAmount) > 0 ? '💰 STAKED & READY 🔥' : '🔥 READY') : player1 ? 'Ready to Start' : 'Not Joined'}
                </p>
              </div>

              {isMePlayer1 && !player1?.ready && (
                <button
                  onClick={handleStakeAndReady}
                  disabled={isStakingTx}
                  className="mt-4 w-full bg-cp-blue hover:bg-cp-blueHover text-white py-2.5 rounded-xl text-xs font-bold font-mono transition shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  {isStakingTx ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Depositing Stake on Polygon...</span>
                    </>
                  ) : (
                    <>
                      <Coins className="w-3.5 h-3.5" />
                      <span>{isVersusBot ? 'Ready Up (Free vs AI)' : parseFloat(stakeAmount) > 0 ? `Stake ${stakeAmount} POL & Ready Up` : 'Ready Up'}</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Slot 2: Guest / Bot */}
            <div className="bg-cp-card border border-cp-border p-5 rounded-2xl text-left flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cp-bg text-cp-muted border border-cp-border font-bold uppercase">
                    {player2?.isBot ? '🤖 AI BOSS' : 'PLAYER 2'} {isMePlayer2 ? '(YOU)' : ''}
                  </span>
                  <span className={`w-2.5 h-2.5 rounded-full ${player2?.ready ? 'bg-cp-success' : player2 ? 'bg-cp-accent' : 'bg-gray-600'}`} />
                </div>
                <h3 className="font-mono text-xs text-cp-heading truncate font-semibold">
                  {player2?.walletAddress || 'Waiting for opponent...'}
                </h3>
                <p className="text-[10px] text-cp-muted mt-0.5 font-mono">
                  Status: {player2?.ready ? (player2.isBot ? '🔥 READY' : parseFloat(stakeAmount) > 0 ? '💰 STAKED & READY 🔥' : '🔥 READY') : player2 ? 'Ready to Start' : 'Not Joined'}
                </p>
              </div>

              {isMePlayer2 && !player2?.ready && !player2?.isBot && (
                <button
                  onClick={handleStakeAndReady}
                  disabled={isStakingTx}
                  className="mt-4 w-full bg-cp-blue hover:bg-cp-blueHover text-white py-2.5 rounded-xl text-xs font-bold font-mono transition shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  {isStakingTx ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Depositing Stake on Polygon...</span>
                    </>
                  ) : (
                    <>
                      <Coins className="w-3.5 h-3.5" />
                      <span>{parseFloat(stakeAmount) > 0 ? `Stake ${stakeAmount} POL & Ready Up` : 'Ready Up'}</span>
                    </>
                  )}
                </button>
              )}

              {!player2 && (
                <div className="mt-3 pt-2.5 border-t border-cp-border space-y-1.5">
                  <span className="text-[10px] font-mono text-cp-muted block uppercase font-bold">
                    No Opponent Online? Fight an AI Bot (100% Free):
                  </span>
                  <div className="grid grid-cols-3 gap-1 font-mono text-[10px]">
                    <button
                      onClick={() => spawnBot('noob')}
                      className="bg-cp-bg hover:bg-[#1E232B] border border-cp-border p-1.5 rounded-lg text-cp-success font-semibold transition"
                    >
                      Noob Bot
                    </button>
                    <button
                      onClick={() => spawnBot('intermediate')}
                      className="bg-cp-bg hover:bg-[#1E232B] border border-cp-border p-1.5 rounded-lg text-cp-blue font-semibold transition"
                    >
                      Cyber-Gemini
                    </button>
                    <button
                      onClick={() => spawnBot('grandmaster')}
                      className="bg-cp-bg hover:bg-[#1E232B] border border-cp-border p-1.5 rounded-lg text-cp-error font-semibold transition"
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

      {/* LIVE BATTLE */}
      {(battleState === 'in-progress' || battleState === 'judging' || battleState === 'completed') && (
        <div className="space-y-3">
          {problem && <ProblemCard problem={problem} />}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            <div className="space-y-2">
              <BattleEditor
                title={isSpectator ? `PLAYER 1 (${player1?.walletAddress.substring(0, 6)}...)` : `YOUR ARENA (${me?.walletAddress ? `${me.walletAddress.substring(0, 6)}...` : 'YOU'})`}
                code={isSpectator ? player1?.code || '' : myCode}
                language={isSpectator ? player1?.language : myLanguage}
                onLanguageChange={setMyLanguage}
                onChange={sendCodeUpdate}
                readOnly={isSpectator}
                isSubmitted={isMyCodeLocked}
                isBlurred={false}
              />

              {!isSpectator && (
                <button
                  onClick={submitCode}
                  disabled={isMyCodeLocked}
                  className={`w-full py-3 rounded-xl text-xs font-bold font-mono flex items-center justify-center space-x-2 transition shadow-sm ${
                    isMyCodeLocked
                      ? 'bg-cp-card text-cp-muted border border-cp-border cursor-not-allowed shadow-none'
                      : 'bg-cp-success hover:brightness-110 text-black cursor-pointer'
                  }`}
                >
                  {isMyCodeLocked ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-cp-muted" />
                      <span>{battleState === 'judging' ? 'EVALUATING IN PROGRESS...' : 'CODE SUBMITTED & LOCKED'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>SUBMIT CODE FOR EVALUATION</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="space-y-2">
              <BattleEditor
                title={isSpectator ? `PLAYER 2 (${player2?.walletAddress.substring(0, 6)}...)` : `OPPONENT (${opponent?.walletAddress ? `${opponent.walletAddress.substring(0, 6)}...` : 'OPPONENT'})`}
                code={isSpectator ? player2?.code || '' : opponentCode}
                language={isSpectator ? player2?.language : opponentLanguage}
                readOnly={true}
                isSubmitted={isSpectator ? player2?.submitted : opponent?.submitted}
                isBlurred={!isSpectator && battleState === 'in-progress'}
              />

              <div className="p-2.5 rounded-xl bg-cp-card border border-cp-border text-center text-[11px] font-mono text-cp-muted">
                {(isSpectator ? player2?.submitted : opponent?.submitted) ? (
                  <span className="text-cp-success font-semibold">Opponent submitted! Code locked for evaluation.</span>
                ) : (
                  <span>Opponent typing live. Fog of war anti-cheat enabled.</span>
                )}
              </div>
            </div>
          </div>

          {battleState === 'judging' && (
            <div className="p-4 rounded-xl bg-cp-card border border-cp-border text-center my-3">
              <Bot className="w-5 h-5 text-cp-blue mx-auto mb-1 animate-bounce" />
              <h2 className="text-xs font-bold text-cp-heading">
                {persona === 'gordon_ramsay' ? 'Gordon Ramsay Reviewing Code...' : persona === 'anime' ? 'AI Grandmaster Evaluating...' : 'Google Gemini AI Referee Evaluating...'}
              </h2>
              <p className="text-[10px] text-cp-muted mt-0.5 font-mono">
                Evaluating logic, time complexity, and memory management across submissions.
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

export default function BattleRoomPageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-mono text-xs text-cp-muted">Loading Battle Arena...</div>}>
      <BattleArenaContent />
    </Suspense>
  );
}