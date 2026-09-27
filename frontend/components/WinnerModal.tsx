"use client";

import { useEffect, useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { 
  Trophy, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  FileCode, 
  MinusCircle, 
  Activity, 
  Cpu, 
  HardDrive, 
  ShieldAlert, 
  Swords, 
  Coins, 
  Award,
  Code2,
  Lightbulb,
  Loader2,
  ShieldCheck,
  AlertOctagon,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { triggerPartyPopper, triggerSadDefeatAnimation } from '@/utils/confetti';
import { sfx } from '@/utils/soundEffects';
import { 
  BATTLE_ARENA_ADDRESS, 
  BATTLE_ARENA_ABI, 
  REPUTATION_NFT_ADDRESS, 
  REPUTATION_NFT_ABI 
} from '@/config/contracts';
import { AuditEvent } from '@/hooks/useBattleSocket';

interface PlayerScore {
  address: string;
  code?: string;
  language?: string;
  grade?: string;
  testCasesPassed?: string;
  correctness: number;
  timeComplexityScore?: number;
  spaceComplexityScore?: number;
  cleanliness?: number;
  total: number;
  scoreDeductions?: string[];
  scoreBonuses?: string[];
  feedback: string;
  mistakes?: string[];
}

interface BattleResult {
  winnerAddress: string;
  reasoning: string;
  comparisonAnalysis?: string;
  payoutTxHash?: string;
  payoutAmount?: string;
  isDisqualified?: boolean;
  disqualifiedPlayerAddress?: string;
  auditLog?: AuditEvent[];
  scores: {
    player1: PlayerScore;
    player2: PlayerScore;
  };
  optimalSolution?: {
    language: string;
    timeComplexity: string;
    spaceComplexity: string;
    code: string;
    explanation: string;
  };
  highlightQuote: string;
}

interface WinnerModalProps {
  result: BattleResult;
  userAddress?: string;
  mySlot?: 'player1' | 'player2' | string;
}

export default function WinnerModal({ result, userAddress, mySlot }: WinnerModalProps) {
  const [activeTab, setActiveTab] = useState<'verdict' | 'viewCodes' | 'codeReview' | 'auditLog' | 'optimalSolution'>('verdict');
  const [copiedOptimal, setCopiedOptimal] = useState(false);
  const [copiedMyCode, setCopiedMyCode] = useState(false);
  const [copiedOpponentCode, setCopiedOpponentCode] = useState(false);

  const { address } = useAccount();

  const { writeContract: writeNftMint, data: nftTxHash, isPending: isMintingNft } = useWriteContract();
  const { isLoading: isWaitingNftTx, isSuccess: isNftMintSuccess } = useWaitForTransactionReceipt({ hash: nftTxHash });

  const { writeContract: writePrizeClaim, data: prizeTxHash, isPending: isClaimingPrize } = useWriteContract();
  const { isLoading: isWaitingPrizeTx, isSuccess: isPrizeClaimSuccess } = useWaitForTransactionReceipt({ hash: prizeTxHash });

  const p1 = result.scores.player1;
  const p2 = result.scores.player2;

  const isP1Me = mySlot === 'player1' || (!mySlot && userAddress && p1.address.toLowerCase() === userAddress.toLowerCase());
  const myScore = isP1Me ? p1 : p2;
  const opponentScore = isP1Me ? p2 : p1;

  const isDraw = result.winnerAddress.toUpperCase() === 'DRAW';
  const isUserWinner = !isDraw && (
    (userAddress && result.winnerAddress.toLowerCase() === userAddress.toLowerCase()) ||
    (mySlot && result.winnerAddress.toLowerCase() === myScore.address.toLowerCase())
  );

  const hasRealPayout = parseFloat(result.payoutAmount || '0') > 0;

  useEffect(() => {
    if (isUserWinner) {
      triggerPartyPopper();
      sfx.playVictory();
      setTimeout(() => triggerPartyPopper(), 700);
    } else if (!isDraw) {
      triggerSadDefeatAnimation();
      sfx.playDefeat();
    }
  }, [isUserWinner, isDraw]);

  const handleClaimPrizePool = () => {
    if (!address) return;
    try {
      const pathRoomId = window.location.pathname.split('/').pop()?.split('?')[0] || '';
      writePrizeClaim({
        address: BATTLE_ARENA_ADDRESS,
        abi: BATTLE_ARENA_ABI,
        functionName: 'claimPrize',
        args: [pathRoomId],
      } as any);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClaimSoulboundBadge = () => {
    if (!address) return;
    try {
      writeNftMint({
        address: REPUTATION_NFT_ADDRESS,
        abi: REPUTATION_NFT_ABI,
        functionName: 'claimBadge',
        args: [
          `ipfs://badge/${result.scores?.player1?.total || 90}`,
          '1v1 Algorithmic Battle Arena',
          BigInt(myScore.total || 90)
        ],
      } as any);
    } catch (err) {
      console.error(err);
    }
  };

  const copyText = (text: string, type: 'optimal' | 'my' | 'opp') => {
    navigator.clipboard.writeText(text);
    if (type === 'optimal') {
      setCopiedOptimal(true);
      setTimeout(() => setCopiedOptimal(false), 2000);
    } else if (type === 'my') {
      setCopiedMyCode(true);
      setTimeout(() => setCopiedMyCode(false), 2000);
    } else {
      setCopiedOpponentCode(true);
      setTimeout(() => setCopiedOpponentCode(false), 2000);
    }
  };

  const getGradeBadge = (grade = 'B') => {
    const map: Record<string, string> = {
      'S+': 'bg-cp-success/15 text-cp-success border border-cp-success/40 font-bold',
      'S': 'bg-cp-success/15 text-cp-success border border-cp-success/40 font-bold',
      'A': 'bg-cp-blue/15 text-cp-blue border border-cp-blue/40 font-bold',
      'B': 'bg-cp-card text-cp-text border border-cp-border font-semibold',
      'C': 'bg-cp-accent/15 text-cp-accent border border-cp-accent/40 font-semibold',
      'F': 'bg-cp-error/15 text-cp-error border border-cp-error/40 font-bold',
    };
    return map[grade] || map['B'];
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-cp-card border border-cp-border max-w-3xl w-full rounded-2xl p-5 sm:p-6 shadow-2xl relative my-auto animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="text-center pb-4 border-b border-cp-border">
          <div className="inline-flex p-2.5 rounded-xl bg-cp-bg border border-cp-border mb-2">
            {isUserWinner ? (
              <Trophy className="w-6 h-6 text-cp-accent" />
            ) : isDraw ? (
              <Swords className="w-6 h-6 text-cp-muted" />
            ) : result.isDisqualified ? (
              <AlertOctagon className="w-6 h-6 text-cp-error animate-pulse" />
            ) : (
              <Swords className="w-6 h-6 text-cp-error" />
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-cp-heading tracking-tight">
            {isUserWinner 
              ? (result.isDisqualified ? 'VICTORY BY OPPONENT DISQUALIFICATION' : 'VICTORY ACHIEVED!') 
              : isDraw 
              ? 'MATCH DRAW' 
              : result.isDisqualified 
              ? 'DISQUALIFIED - ANTI-CHEAT TERMINATION' 
              : 'DEFEAT - MATCH CONCLUDED'}
          </h2>
          
          <p className="text-xs font-mono text-cp-muted mt-1">
            {isDraw ? 'Result: Tied Match' : `Winner: ${result.winnerAddress}`}
          </p>

          {/* Reward Banner */}
          {isUserWinner && (
            <div className="mt-3 p-3 rounded-xl bg-cp-bg border border-cp-border max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div>
                <div className="flex items-center space-x-1.5 text-cp-heading text-xs font-semibold">
                  {hasRealPayout ? <Coins className="w-3.5 h-3.5 text-cp-accent" /> : <Award className="w-3.5 h-3.5 text-cp-blue" />}
                  <span>{hasRealPayout ? `+${result.payoutAmount} POL Prize Available` : 'Victory Trophy Available'}</span>
                </div>
                <p className="text-[11px] text-cp-muted mt-0.5">
                  {isPrizeClaimSuccess
                    ? 'POL transferred directly to your wallet.'
                    : 'Claim your non-transferable Soulbound NFT badge on Polygon Amoy.'}
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {hasRealPayout && !isPrizeClaimSuccess && (
                  <button
                    onClick={handleClaimPrizePool}
                    disabled={isClaimingPrize || isWaitingPrizeTx}
                    className="bg-cp-blue hover:bg-cp-blueHover text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition shadow-sm"
                  >
                    {isClaimingPrize || isWaitingPrizeTx ? 'Withdrawing...' : 'Withdraw POL'}
                  </button>
                )}

                {isNftMintSuccess ? (
                  <span className="text-cp-success text-xs font-semibold flex items-center space-x-1 bg-cp-success/10 px-2.5 py-1 rounded-lg border border-cp-success/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>NFT Minted</span>
                  </span>
                ) : (
                  <button
                    onClick={handleClaimSoulboundBadge}
                    disabled={isMintingNft || isWaitingNftTx}
                    className="bg-cp-bg hover:bg-[#1E232B] border border-cp-border hover:border-cp-blue text-cp-heading px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition"
                  >
                    {isMintingNft || isWaitingNftTx ? (
                      <span className="flex items-center space-x-1">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Minting...</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5 text-cp-blue" />
                        <span>Claim Badge</span>
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          <p className="text-xs text-cp-text mt-2.5 italic bg-cp-bg px-3.5 py-1.5 rounded-xl border border-cp-border inline-block max-w-xl leading-relaxed">
            "{result.highlightQuote}"
          </p>

          {/* Navigation Tabs */}
          <div className="flex justify-center mt-3">
            <div className="bg-cp-bg p-0.5 rounded-xl border border-cp-border flex flex-wrap gap-1 text-xs font-medium">
              <button
                onClick={() => setActiveTab('verdict')}
                className={`px-3 py-1 rounded-lg transition flex items-center space-x-1 ${
                  activeTab === 'verdict' ? 'bg-cp-card text-cp-blue font-semibold border border-cp-border' : 'text-cp-muted hover:text-cp-heading'
                }`}
              >
                <Trophy className="w-3 h-3" />
                <span>Scores</span>
              </button>

              <button
                onClick={() => setActiveTab('viewCodes')}
                className={`px-3 py-1 rounded-lg transition flex items-center space-x-1 ${
                  activeTab === 'viewCodes' ? 'bg-cp-card text-cp-blue font-semibold border border-cp-border' : 'text-cp-muted hover:text-cp-heading'
                }`}
              >
                <Code2 className="w-3 h-3" />
                <span>Submissions</span>
              </button>

              <button
                onClick={() => setActiveTab('codeReview')}
                className={`px-3 py-1 rounded-lg transition flex items-center space-x-1 ${
                  activeTab === 'codeReview' ? 'bg-cp-card text-cp-blue font-semibold border border-cp-border' : 'text-cp-muted hover:text-cp-heading'
                }`}
              >
                <FileCode className="w-3 h-3" />
                <span>Mistakes</span>
              </button>

              {/* 🛡️ ANTI-CHEAT AUDIT TIMELINE TAB */}
              <button
                onClick={() => setActiveTab('auditLog')}
                className={`px-3 py-1 rounded-lg transition flex items-center space-x-1 ${
                  activeTab === 'auditLog' ? 'bg-cp-card text-cp-blue font-semibold border border-cp-border' : 'text-cp-muted hover:text-cp-heading'
                }`}
              >
                <ShieldCheck className="w-3 h-3 text-cp-accent" />
                <span>Audit Log ({result.auditLog?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('optimalSolution')}
                className={`px-3 py-1 rounded-lg transition flex items-center space-x-1 ${
                  activeTab === 'optimalSolution' ? 'bg-cp-card text-cp-blue font-semibold border border-cp-border' : 'text-cp-muted hover:text-cp-heading'
                }`}
              >
                <Lightbulb className="w-3 h-3" />
                <span>Master Solution</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: MARKS & SCORES */}
        {activeTab === 'verdict' && (
          <div className="space-y-3 pt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-left">
              
              {/* YOUR SCORECARD */}
              <div className="bg-cp-bg border border-cp-border p-4 rounded-xl flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cp-card border border-cp-border text-cp-blue font-bold">
                      YOUR SUBMISSION (YOU)
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <span className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold ${getGradeBadge(myScore.grade)}`}>
                        Grade: {myScore.grade || 'B'}
                      </span>
                      <span className="text-base font-bold font-mono text-cp-heading">
                        {myScore.total}/100
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] font-mono text-cp-muted mb-3 truncate">
                    Wallet: {myScore.address} • Tests: <span className="text-cp-heading font-semibold">{myScore.testCasesPassed || '0/10'}</span>
                  </p>

                  <div className="space-y-2.5 font-mono text-xs">
                    <div>
                      <div className="flex justify-between text-cp-text text-xs mb-0.5">
                        <span className="flex items-center space-x-1.5">
                          <Activity className="w-3 h-3 text-cp-blue" />
                          <span>Correctness:</span>
                        </span>
                        <span className="text-cp-heading font-semibold">{myScore.correctness}/40</span>
                      </div>
                      <div className="w-full bg-cp-card h-1.5 rounded-full overflow-hidden border border-cp-border/50">
                        <div className="bg-cp-blue h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (myScore.correctness / 40) * 100)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-cp-text text-xs mb-0.5">
                        <span className="flex items-center space-x-1.5">
                          <Cpu className="w-3 h-3 text-cp-accent" />
                          <span>Time Complexity:</span>
                        </span>
                        <span className="text-cp-heading font-semibold">{myScore.timeComplexityScore ?? 0}/25</span>
                      </div>
                      <div className="w-full bg-cp-card h-1.5 rounded-full overflow-hidden border border-cp-border/50">
                        <div className="bg-cp-accent h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ((myScore.timeComplexityScore ?? 0) / 25) * 100)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-cp-text text-xs mb-0.5">
                        <span className="flex items-center space-x-1.5">
                          <HardDrive className="w-3 h-3 text-cp-blue" />
                          <span>Space & Memory:</span>
                        </span>
                        <span className="text-cp-heading font-semibold">{myScore.spaceComplexityScore ?? 0}/15</span>
                      </div>
                      <div className="w-full bg-cp-card h-1.5 rounded-full overflow-hidden border border-cp-border/50">
                        <div className="bg-cp-blue h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ((myScore.spaceComplexityScore ?? 0) / 15) * 100)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-cp-text text-xs mb-0.5">
                        <span className="flex items-center space-x-1.5">
                          <FileCode className="w-3 h-3 text-cp-success" />
                          <span>Cleanliness & Style:</span>
                        </span>
                        <span className="text-cp-heading font-semibold">{myScore.cleanliness ?? 0}/20</span>
                      </div>
                      <div className="w-full bg-cp-card h-1.5 rounded-full overflow-hidden border border-cp-border/50">
                        <div className="bg-cp-success h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ((myScore.cleanliness ?? 0) / 20) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-cp-border text-xs text-cp-text leading-relaxed font-sans">
                  <span className="text-cp-blue font-semibold font-mono">Feedback for You: </span>
                  {myScore.feedback}
                </div>
              </div>

              {/* OPPONENT'S SCORECARD */}
              <div className="bg-cp-bg border border-cp-border p-4 rounded-xl flex flex-col justify-between shadow-sm opacity-90">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cp-card border border-cp-border text-cp-muted font-bold">
                      OPPONENT'S SUBMISSION
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <span className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold ${getGradeBadge(opponentScore.grade)}`}>
                        Grade: {opponentScore.grade || 'B'}
                      </span>
                      <span className="text-base font-bold font-mono text-cp-text">
                        {opponentScore.total}/100
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] font-mono text-cp-muted mb-3 truncate">
                    Wallet: {opponentScore.address} • Tests: <span className="text-cp-text font-semibold">{opponentScore.testCasesPassed || '0/10'}</span>
                  </p>

                  <div className="space-y-2.5 font-mono text-xs">
                    <div>
                      <div className="flex justify-between text-cp-muted text-xs mb-0.5">
                        <span>Correctness:</span>
                        <span className="text-cp-text font-semibold">{opponentScore.correctness}/40</span>
                      </div>
                      <div className="w-full bg-cp-card h-1.5 rounded-full overflow-hidden border border-cp-border/50">
                        <div className="bg-cp-muted h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (opponentScore.correctness / 40) * 100)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-cp-muted text-xs mb-0.5">
                        <span>Time Complexity:</span>
                        <span className="text-cp-text font-semibold">{opponentScore.timeComplexityScore ?? 0}/25</span>
                      </div>
                      <div className="w-full bg-cp-card h-1.5 rounded-full overflow-hidden border border-cp-border/50">
                        <div className="bg-cp-muted h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ((opponentScore.timeComplexityScore ?? 0) / 25) * 100)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-cp-muted text-xs mb-0.5">
                        <span>Space & Memory:</span>
                        <span className="text-cp-text font-semibold">{opponentScore.spaceComplexityScore ?? 0}/15</span>
                      </div>
                      <div className="w-full bg-cp-card h-1.5 rounded-full overflow-hidden border border-cp-border/50">
                        <div className="bg-cp-muted h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ((opponentScore.spaceComplexityScore ?? 0) / 15) * 100)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-cp-muted text-xs mb-0.5">
                        <span>Cleanliness:</span>
                        <span className="text-cp-text font-semibold">{opponentScore.cleanliness ?? 0}/20</span>
                      </div>
                      <div className="w-full bg-cp-card h-1.5 rounded-full overflow-hidden border border-cp-border/50">
                        <div className="bg-cp-muted h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ((opponentScore.cleanliness ?? 0) / 20) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-cp-border text-xs text-cp-muted leading-relaxed font-sans">
                  <span className="text-cp-muted font-semibold font-mono">Opponent Feedback: </span>
                  {opponentScore.feedback}
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-cp-bg border border-cp-border rounded-xl text-xs text-cp-text text-left leading-relaxed">
              <span className="text-cp-heading font-bold font-mono">Referee Decision: </span> 
              {result.reasoning}
            </div>
          </div>
        )}

        {/* TAB 2: CODE DIFF (PRESERVES SUBMITTED CODES) */}
        {activeTab === 'viewCodes' && (
          <div className="space-y-3 pt-3 text-left font-mono">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              {/* YOUR SUBMITTED CODE */}
              <div className="bg-cp-bg border border-cp-border p-3.5 rounded-xl flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-cp-border mb-2.5">
                  <span className="text-xs font-bold text-cp-blue uppercase">Your Code ({myScore.language || 'C'})</span>
                  <button
                    onClick={() => copyText(myScore.code || '// No code', 'my')}
                    className="bg-cp-card hover:bg-[#1E232B] border border-cp-border text-cp-text px-2.5 py-1 rounded-md text-xs flex items-center space-x-1.5 transition active:scale-95"
                  >
                    {copiedMyCode ? <Check className="w-3 h-3 text-cp-success" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedMyCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-[#090A0F] rounded-lg p-2.5 overflow-x-auto text-xs text-cp-text leading-relaxed max-h-60 border border-cp-border/50">
                  <pre><code>{myScore.code || '// No code submitted'}</code></pre>
                </div>
              </div>

              {/* OPPONENT'S SUBMITTED CODE */}
              <div className="bg-cp-bg border border-cp-border p-3.5 rounded-xl flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-cp-border mb-2.5">
                  <span className="text-xs font-bold text-cp-accent uppercase">Opponent Code ({opponentScore.language || 'JS'})</span>
                  <button
                    onClick={() => copyText(opponentScore.code || '// No code', 'opp')}
                    className="bg-cp-card hover:bg-[#1E232B] border border-cp-border text-cp-text px-2.5 py-1 rounded-md text-xs flex items-center space-x-1.5 transition active:scale-95"
                  >
                    {copiedOpponentCode ? <Check className="w-3 h-3 text-cp-success" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedOpponentCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-[#090A0F] rounded-lg p-2.5 overflow-x-auto text-xs text-cp-text leading-relaxed max-h-60 border border-cp-border/50">
                  <pre><code>{opponentScore.code || '// No code submitted'}</code></pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MISTAKES */}
        {activeTab === 'codeReview' && (
          <div className="space-y-3 pt-3 text-left font-sans">
            <div className="p-3 bg-cp-bg border border-cp-border rounded-xl">
              <div className="flex items-center space-x-1.5 text-cp-blue font-bold text-xs font-mono mb-1">
                <span>COMPARATIVE ANALYSIS</span>
              </div>
              <p className="text-xs text-cp-text leading-relaxed">
                {result.comparisonAnalysis || result.reasoning}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-cp-bg border border-cp-border p-3.5 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-cp-blue font-mono flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-cp-blue" />
                  <span>Your Point Deductions & Notes</span>
                </h4>

                {myScore.scoreDeductions && myScore.scoreDeductions.length > 0 ? (
                  <div className="space-y-1.5 font-mono">
                    {myScore.scoreDeductions.map((d, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-cp-error">
                        <MinusCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-cp-success flex items-center space-x-1.5 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>No critical errors detected.</span>
                  </span>
                )}
              </div>

              <div className="bg-cp-bg border border-cp-border p-3.5 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-cp-muted font-mono flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-cp-muted" />
                  <span>Opponent Notes</span>
                </h4>

                {opponentScore.scoreDeductions && opponentScore.scoreDeductions.length > 0 ? (
                  <div className="space-y-1.5 font-mono">
                    {opponentScore.scoreDeductions.map((d, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-cp-error">
                        <MinusCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-cp-muted font-mono">No deductions recorded.</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 🛡️ TAB 4: ANTI-CHEAT AUDIT TIMELINE */}
        {activeTab === 'auditLog' && (
          <div className="space-y-3 pt-3 text-left font-mono">
            <div className="p-3 bg-cp-bg border border-cp-border rounded-xl">
              <div className="flex items-center space-x-1.5 text-cp-accent font-bold text-xs mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cp-accent" />
                <span>CRYPTOGRAPHIC BATTLE AUDIT TIMELINE</span>
              </div>
              <p className="text-[11px] text-cp-muted leading-relaxed font-sans">
                Immutable, server-recorded chronological security events verifying competitive integrity, focus timestamps, and anti-cheat triggers for this match.
              </p>
            </div>

            <div className="bg-cp-bg border border-cp-border rounded-xl p-3 max-h-64 overflow-y-auto space-y-2">
              {result.auditLog && result.auditLog.length > 0 ? (
                result.auditLog.map((event, idx) => {
                  const isViolation = event.eventType.includes('SWITCH') || event.eventType.includes('TIMEOUT') || event.eventType.includes('TERMINATED');
                  const isSuccess = event.eventType.includes('RETURNED') || event.eventType.includes('COMPLETED');
                  const dateStr = new Date(event.timestamp).toLocaleTimeString();

                  return (
                    <div 
                      key={event.id || idx}
                      className="p-2.5 rounded-lg bg-cp-card border border-cp-border/80 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                            isViolation 
                              ? 'bg-cp-error/15 text-cp-error border border-cp-error/30'
                              : isSuccess
                              ? 'bg-cp-success/15 text-cp-success border border-cp-success/30'
                              : 'bg-cp-blue/15 text-cp-blue border border-cp-blue/30'
                          }`}>
                            {event.eventType}
                          </span>
                          <span className="text-cp-muted text-[11px]">[{dateStr}]</span>
                        </div>
                        <p className="text-[11px] text-cp-text font-mono">
                          Target: <span className="text-cp-heading font-semibold">{event.playerSlot.toUpperCase()}</span> ({event.walletAddress.substring(0, 8)}...)
                        </p>
                        {event.metadata && Object.keys(event.metadata).length > 0 && (
                          <p className="text-[10px] text-cp-muted">
                            Details: {JSON.stringify(event.metadata)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-cp-muted text-xs italic">
                  No anti-cheat violations or anomalies recorded. Clean match execution.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: MASTER SOLUTION */}
        {activeTab === 'optimalSolution' && (
          <div className="space-y-3 pt-3 text-left font-mono">
            <div className="flex items-center justify-between bg-cp-bg p-2.5 rounded-xl border border-cp-border text-xs">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md bg-cp-card border border-cp-border text-cp-blue font-bold">
                  Time: {result.optimalSolution?.timeComplexity || 'O(N)'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-cp-card border border-cp-border text-cp-muted font-bold">
                  Space: {result.optimalSolution?.spaceComplexity || 'O(1)'}
                </span>
              </div>
              <button
                onClick={() => copyText(result.optimalSolution?.code || '', 'optimal')}
                className="bg-cp-card hover:bg-[#1E232B] border border-cp-border text-cp-text px-2.5 py-1 rounded-lg text-xs flex items-center space-x-1 transition active:scale-95"
              >
                {copiedOptimal ? <Check className="w-3 h-3 text-cp-success" /> : <Copy className="w-3 h-3" />}
                <span>{copiedOptimal ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="bg-[#090A0F] border border-cp-border rounded-xl p-3 overflow-x-auto text-xs text-cp-text leading-relaxed max-h-56">
              <pre><code>{result.optimalSolution?.code || '// Solution loaded'}</code></pre>
            </div>

            <div className="p-2.5 bg-cp-bg border border-cp-border rounded-xl text-xs text-cp-muted leading-relaxed font-sans">
              <span className="text-cp-success font-bold font-mono">Algorithmic Breakdown: </span>
              {result.optimalSolution?.explanation || 'Optimal solution structure.'}
            </div>
          </div>
        )}

        {/* Bottom Modal Actions */}
        <div className="mt-5 pt-3 border-t border-cp-border flex flex-col sm:flex-row gap-2.5">
          <Link
            href="/"
            className="flex-1 bg-cp-bg hover:bg-[#1E232B] border border-cp-border text-cp-text hover:text-cp-heading py-2.5 rounded-xl text-center text-xs sm:text-sm font-semibold transition active:scale-[0.98]"
          >
            Back to Arena Lobby
          </Link>
          <Link
            href={userAddress ? `/profile/${userAddress}` : '/leaderboard'}
            className="flex-1 bg-cp-blue hover:bg-cp-blueHover text-white py-2.5 rounded-xl text-center text-xs sm:text-sm font-semibold flex items-center justify-center space-x-1.5 transition active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <span>View On-Chain Soulbound Badges</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}