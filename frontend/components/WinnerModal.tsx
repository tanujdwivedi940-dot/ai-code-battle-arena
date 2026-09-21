"use client";

import { useEffect, useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Zap, 
  Copy, 
  Check, 
  AlertTriangle,
  Lightbulb,
  FileCode,
  MinusCircle,
  PlusCircle,
  Activity,
  Cpu,
  HardDrive,
  ShieldAlert,
  Swords,
  Code2,
  ExternalLink,
  Loader2,
  Coins,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { triggerPartyPopper, triggerSadDefeatAnimation } from '@/utils/confetti';
import { sfx } from '@/utils/soundEffects';
import { REPUTATION_NFT_ADDRESS, REPUTATION_NFT_ABI } from '@/config/contracts';

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
  const [activeTab, setActiveTab] = useState<'verdict' | 'viewCodes' | 'codeReview' | 'optimalSolution'>('verdict');
  const [copiedOptimal, setCopiedOptimal] = useState(false);
  const [copiedMyCode, setCopiedMyCode] = useState(false);
  const [copiedOpponentCode, setCopiedOpponentCode] = useState(false);

  const { address } = useAccount();
  const { writeContract, data: txHash, isPending: isMinting } = useWriteContract();
  const { isLoading: isWaitingForTx, isSuccess: isMintSuccess } = useWaitForTransactionReceipt({ hash: txHash });

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

  // Mint Soulbound NFT
  const handleClaimSoulboundBadge = () => {
    if (!address) return;
    try {
      writeContract({
        address: REPUTATION_NFT_ADDRESS,
        abi: REPUTATION_NFT_ABI,
        functionName: 'mintWinnerBadge',
        args: [
          address,
          `ipfs://badge/${result.scores.player1.total}`,
          '1v1 Algorithmic Battle Arena',
          BigInt(myScore.total || 90)
        ],
      });
    } catch (err) {
      console.error('Minting error:', err);
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
      'S+': 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black border-yellow-300 font-extrabold',
      'S': 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black border-yellow-300 font-bold',
      'A': 'bg-arena-neonGreen/20 text-arena-neonGreen border-arena-neonGreen/40 font-bold',
      'B': 'bg-cyan-500/20 text-arena-neonCyan border-cyan-500/40 font-bold',
      'C': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40 font-bold',
      'F': 'bg-arena-neonRed/20 text-arena-neonRed border-arena-neonRed/40 font-bold',
    };
    return map[grade] || map['B'];
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className={`bg-arena-card border max-w-4xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative my-auto animate-in fade-in zoom-in duration-300 ${
        isUserWinner ? 'border-arena-neonGreen/50 glow-cyan' : isDraw ? 'border-yellow-500/50' : 'border-arena-neonRed/50 glow-red'
      }`}>
        
        {/* Header Ribbon */}
        <div className="text-center pb-6 border-b border-arena-border">
          <div className="inline-flex p-3 rounded-2xl mb-2 animate-bounce">
            {isUserWinner ? (
              <div className="p-3 bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 rounded-2xl">
                <Trophy className="w-10 h-10" />
              </div>
            ) : isDraw ? (
              <div className="p-3 bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 rounded-2xl">
                <Swords className="w-10 h-10 text-yellow-400" />
              </div>
            ) : (
              <div className="p-3 bg-arena-neonRed/15 border border-arena-neonRed/30 text-arena-neonRed rounded-2xl shadow-xl">
                <Swords className="w-10 h-10 text-arena-neonRed" />
              </div>
            )}
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-100 font-mono tracking-wide">
            {isUserWinner ? '🎉 VICTORY ACHIEVED!' : isDraw ? '⚖️ MATCH DRAW' : 'DEFEAT - MATCH CONCLUDED'}
          </h2>
          
          <p className="text-xs font-mono text-arena-neonCyan mt-1">
            {isDraw ? 'Result: Tied Match' : `Winner: ${result.winnerAddress}`}
          </p>

          {/* 🎖️ REWARD CLAIM BANNER */}
          {isUserWinner && (
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-yellow-500/15 via-arena-neonGreen/15 to-arena-neonCyan/15 border border-yellow-500/40 shadow-xl max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-left font-mono">
              <div>
                <div className="flex items-center space-x-2 text-yellow-400 text-sm font-extrabold">
                  {hasRealPayout ? <Coins className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                  <span>
                    {hasRealPayout
                      ? `+${result.payoutAmount} POL Prize Pool Released!`
                      : '🏆 Victory Badge Unlocked!'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {hasRealPayout
                    ? 'Smart contract escrow settled.'
                    : 'Claim your non-transferable Soulbound NFT on Polygon Amoy.'}
                </p>
              </div>

              {/* Soulbound Badge Claim */}
              {isMintSuccess ? (
                <span className="text-arena-neonGreen text-xs font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>NFT Badge Minted!</span>
                </span>
              ) : (
                <button
                  onClick={handleClaimSoulboundBadge}
                  disabled={isMinting || isWaitingForTx}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  {isMinting || isWaitingForTx ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Minting...</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-3.5 h-3.5" />
                      <span>Claim Soulbound NFT</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          <p className="text-xs text-gray-400 mt-3 italic bg-arena-bg px-4 py-2 rounded-xl border border-arena-border inline-block max-w-xl">
            "{result.highlightQuote}"
          </p>

          {/* Navigation Tabs */}
          <div className="flex justify-center mt-5">
            <div className="bg-arena-bg border border-arena-border p-1 rounded-xl flex flex-wrap gap-1 font-mono text-xs">
              <button
                onClick={() => setActiveTab('verdict')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                  activeTab === 'verdict' ? 'bg-arena-neonCyan/20 text-arena-neonCyan font-bold' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Marks & Scores</span>
              </button>

              <button
                onClick={() => setActiveTab('viewCodes')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                  activeTab === 'viewCodes' ? 'bg-arena-neonCyan/20 text-arena-neonCyan font-bold' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>View Submissions Code</span>
              </button>

              <button
                onClick={() => setActiveTab('codeReview')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                  activeTab === 'codeReview' ? 'bg-arena-neonPurple/20 text-arena-neonPurple font-bold' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Mistakes & Review</span>
              </button>

              <button
                onClick={() => setActiveTab('optimalSolution')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                  activeTab === 'optimalSolution' ? 'bg-arena-neonGreen/20 text-arena-neonGreen font-bold' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>AI Master Solution</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: MARKS & SCORES */}
        {activeTab === 'verdict' && (
          <div className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* YOUR SCORECARD */}
              <div className={`p-5 rounded-2xl border text-left flex flex-col justify-between ${
                isUserWinner ? 'bg-arena-neonGreen/5 border-arena-neonGreen/40' : isDraw ? 'bg-arena-bg border-yellow-500/40' : 'bg-arena-bg border-arena-neonRed/40'
              }`}>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full font-bold bg-arena-neonCyan/20 text-arena-neonCyan border border-arena-neonCyan/30">
                      YOUR SUBMISSION (YOU)
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-md border text-xs font-mono ${getGradeBadge(myScore.grade)}`}>
                        Grade: {myScore.grade || 'B'}
                      </span>
                      <span className={`text-xl font-extrabold font-mono ${isUserWinner ? 'text-arena-neonGreen' : isDraw ? 'text-yellow-400' : 'text-arena-neonRed'}`}>
                        {myScore.total}/100
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] font-mono text-gray-400 truncate mb-4">
                    Wallet: {myScore.address} • Tests: <span className="text-arena-neonGreen font-bold">{myScore.testCasesPassed || '8/10 (80%)'}</span>
                  </p>

                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <div className="flex justify-between text-gray-300 mb-1">
                        <span className="flex items-center space-x-1.5"><Activity className="w-3.5 h-3.5 text-arena-neonCyan" /><span>Correctness:</span></span>
                        <span className="font-bold text-arena-neonCyan">{myScore.correctness}/40</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-arena-neonCyan h-full rounded-full transition-all duration-1000" style={{ width: `${(myScore.correctness / 40) * 100}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-gray-300 mb-1">
                        <span className="flex items-center space-x-1.5"><Cpu className="w-3.5 h-3.5 text-yellow-400" /><span>Time Complexity:</span></span>
                        <span className="font-bold text-yellow-400">{myScore.timeComplexityScore ?? 20}/25</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-yellow-400 h-full rounded-full transition-all duration-1000" style={{ width: `${((myScore.timeComplexityScore ?? 20) / 25) * 100}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-gray-300 mb-1">
                        <span className="flex items-center space-x-1.5"><HardDrive className="w-3.5 h-3.5 text-arena-neonPurple" /><span>Space & Memory:</span></span>
                        <span className="font-bold text-arena-neonPurple">{myScore.spaceComplexityScore ?? 12}/15</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-arena-neonPurple h-full rounded-full transition-all duration-1000" style={{ width: `${((myScore.spaceComplexityScore ?? 12) / 15) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-arena-border text-xs text-gray-300 leading-relaxed font-mono">
                  <span className="text-arena-neonCyan font-bold">Feedback for You: </span>
                  {myScore.feedback}
                </div>
              </div>

              {/* OPPONENT'S SCORECARD */}
              <div className="p-5 bg-arena-bg border border-arena-border rounded-2xl text-left flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full font-bold bg-gray-800 text-gray-400 border border-gray-700">
                      OPPONENT'S SUBMISSION
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-md border text-xs font-mono ${getGradeBadge(opponentScore.grade)}`}>
                        Grade: {opponentScore.grade || 'B'}
                      </span>
                      <span className="text-xl font-extrabold font-mono text-arena-neonPurple">
                        {opponentScore.total}/100
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] font-mono text-gray-400 truncate mb-4">
                    Wallet: {opponentScore.address} • Tests: <span className="text-arena-neonGreen font-bold">{opponentScore.testCasesPassed || '8/10 (80%)'}</span>
                  </p>

                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <div className="flex justify-between text-gray-400 mb-1">
                        <span>Correctness:</span>
                        <span>{opponentScore.correctness}/40</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gray-500 h-full rounded-full" style={{ width: `${(opponentScore.correctness / 40) * 100}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-gray-400 mb-1">
                        <span>Time Complexity:</span>
                        <span>{opponentScore.timeComplexityScore ?? 20}/25</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gray-500 h-full rounded-full" style={{ width: `${((opponentScore.timeComplexityScore ?? 20) / 25) * 100}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-gray-400 mb-1">
                        <span>Space & Memory:</span>
                        <span>{opponentScore.spaceComplexityScore ?? 12}/15</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gray-500 h-full rounded-full" style={{ width: `${((opponentScore.spaceComplexityScore ?? 12) / 15) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-arena-border text-xs text-gray-400 leading-relaxed font-mono">
                  <span className="text-arena-neonPurple font-bold">Opponent Feedback: </span>
                  {opponentScore.feedback}
                </div>
              </div>
            </div>

            <div className="p-4 bg-arena-bg/60 border border-arena-border rounded-xl text-xs text-gray-300 text-left font-mono">
              <span className="text-arena-neonCyan font-bold">Referee Decision: </span> 
              {result.reasoning}
            </div>
          </div>
        )}

        {/* TAB 2: VIEW SUBMISSION CODES */}
        {activeTab === 'viewCodes' && (
          <div className="space-y-4 pt-6 text-left font-mono">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-arena-bg border border-arena-border rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-arena-border mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-arena-neonCyan uppercase">YOUR CODE</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 uppercase">
                      {myScore.language || 'JS'}
                    </span>
                  </div>
                  <button
                    onClick={() => copyText(myScore.code || '// No code', 'my')}
                    className="p-1.5 rounded-lg bg-arena-card border border-arena-border hover:border-gray-500 text-gray-300 transition flex items-center space-x-1 text-xs"
                  >
                    {copiedMyCode ? <Check className="w-3.5 h-3.5 text-arena-neonGreen" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMyCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="bg-black/60 rounded-xl p-3 overflow-x-auto text-xs text-gray-200 leading-relaxed max-h-72 flex-1">
                  <pre><code>{myScore.code || '// No code submitted'}</code></pre>
                </div>
              </div>

              <div className="bg-arena-bg border border-arena-border rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-arena-border mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-arena-neonPurple uppercase">OPPONENT'S CODE</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 uppercase">
                      {opponentScore.language || 'JS'}
                    </span>
                  </div>
                  <button
                    onClick={() => copyText(opponentScore.code || '// No code', 'opp')}
                    className="p-1.5 rounded-lg bg-arena-card border border-arena-border hover:border-gray-500 text-gray-300 transition flex items-center space-x-1 text-xs"
                  >
                    {copiedOpponentCode ? <Check className="w-3.5 h-3.5 text-arena-neonGreen" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedOpponentCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="bg-black/60 rounded-xl p-3 overflow-x-auto text-xs text-gray-200 leading-relaxed max-h-72 flex-1">
                  <pre><code>{opponentScore.code || '// No code submitted'}</code></pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MISTAKES & REVIEW */}
        {activeTab === 'codeReview' && (
          <div className="space-y-6 pt-6 text-left font-mono">
            <div className="p-4 bg-arena-neonPurple/10 border border-arena-neonPurple/40 rounded-2xl">
              <div className="flex items-center space-x-2 text-arena-neonPurple font-bold text-xs mb-1">
                <Zap className="w-4 h-4" />
                <span>COMPARATIVE ANALYSIS:</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {result.comparisonAnalysis || result.reasoning}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-arena-bg border border-arena-border rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-arena-neonCyan flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Your Point Deductions & Mistakes</span>
                </h4>

                {myScore.scoreDeductions && myScore.scoreDeductions.length > 0 && (
                  <div className="space-y-1.5">
                    {myScore.scoreDeductions.map((d, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-arena-neonRed">
                        <MinusCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-arena-bg border border-arena-border rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-arena-neonPurple flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Opponent's Deductions</span>
                </h4>

                {opponentScore.scoreDeductions && opponentScore.scoreDeductions.length > 0 ? (
                  <div className="space-y-1.5">
                    {opponentScore.scoreDeductions.map((d, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-arena-neonRed">
                        <MinusCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">No deductions recorded.</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AI MASTER SOLUTION */}
        {activeTab === 'optimalSolution' && (
          <div className="space-y-4 pt-6 text-left font-mono">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-arena-bg p-4 rounded-xl border border-arena-border">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-arena-neonGreen/10 text-arena-neonGreen border border-arena-neonGreen/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-200">Gold-Standard Benchmark Solution</h4>
                  <p className="text-[11px] text-gray-500">Provided by Google Gemini AI Referee</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="px-2.5 py-1 rounded bg-arena-neonCyan/15 text-arena-neonCyan border border-arena-neonCyan/30 font-bold">
                  Time: {result.optimalSolution?.timeComplexity || 'O(N)'}
                </span>
                <span className="px-2.5 py-1 rounded bg-arena-neonPurple/15 text-arena-neonPurple border border-arena-neonPurple/30 font-bold">
                  Space: {result.optimalSolution?.spaceComplexity || 'O(1)'}
                </span>
                <button
                  onClick={() => copyText(result.optimalSolution?.code || '', 'optimal')}
                  className="px-3 py-1 bg-arena-card border border-arena-border hover:border-gray-500 rounded-lg text-gray-300 flex items-center space-x-1 transition"
                >
                  {copiedOptimal ? <Check className="w-3.5 h-3.5 text-arena-neonGreen" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedOptimal ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
            </div>

            <div className="bg-arena-bg border border-arena-border rounded-xl p-4 overflow-x-auto text-xs text-gray-200 leading-relaxed max-h-56">
              <pre><code>{result.optimalSolution?.code || '// Optimal solution loaded'}</code></pre>
            </div>

            <div className="p-3.5 bg-arena-bg/40 border border-arena-border rounded-xl text-xs text-gray-400">
              <span className="text-arena-neonGreen font-bold">Algorithmic Breakdown: </span>
              {result.optimalSolution?.explanation || 'Optimal logic with minimal space overhead.'}
            </div>
          </div>
        )}

        {/* Modal Bottom Actions */}
        <div className="mt-8 pt-4 border-t border-arena-border flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 py-3 bg-arena-card border border-arena-border hover:border-gray-500 text-gray-200 text-center font-bold text-xs rounded-xl transition flex items-center justify-center font-mono"
          >
            <span>Back to Arena Lobby</span>
          </Link>
          <Link
            href={userAddress ? `/profile/${userAddress}` : '/leaderboard'}
            className="flex-1 py-3 bg-gradient-to-r from-arena-neonCyan to-arena-neonPurple text-black text-center font-bold text-xs rounded-xl hover:scale-[1.02] transition flex items-center justify-center space-x-2 font-mono shadow-xl glow-cyan"
          >
            <span>View On-Chain Soulbound Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}