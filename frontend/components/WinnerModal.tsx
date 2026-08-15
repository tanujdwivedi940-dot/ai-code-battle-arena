"use client";

import { Trophy, Award, CheckCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface BattleResult {
  winnerAddress: string;
  reasoning: string;
  scores: {
    player1: {
      address: string;
      correctness: number;
      efficiency: number;
      readability: number;
      creativity: number;
      total: number;
      feedback: string;
    };
    player2: {
      address: string;
      correctness: number;
      efficiency: number;
      readability: number;
      creativity: number;
      total: number;
      feedback: string;
    };
  };
  highlightQuote: string;
}

interface WinnerModalProps {
  result: BattleResult;
  userAddress?: string;
}

export default function WinnerModal({ result, userAddress }: WinnerModalProps) {
  const isUserWinner =
    userAddress && result.winnerAddress.toLowerCase() === userAddress.toLowerCase();

  const p1 = result.scores.player1;
  const p2 = result.scores.player2;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-arena-card border border-arena-border max-w-2xl w-full rounded-3xl p-6 sm:p-8 glow-cyan shadow-2xl relative animate-in fade-in zoom-in duration-300">
        
        {/* Header Ribbon */}
        <div className="text-center">
          <div className="inline-flex p-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 mb-3 animate-bounce">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-100 font-mono">
            {isUserWinner ? '🎉 VICTORY ACHIEVED!' : '⚔️ BATTLE CONCLUDED'}
          </h2>
          <p className="text-xs font-mono text-arena-neonCyan mt-1">
            Winner: {result.winnerAddress}
          </p>
          <p className="text-xs text-gray-400 mt-2 italic bg-arena-bg p-3 rounded-xl border border-arena-border">
            "{result.highlightQuote}"
          </p>
        </div>

        {/* AI Scores Matrix */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          
          {/* Player 1 Card */}
          <div className="p-4 bg-arena-bg border border-arena-border rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-mono text-gray-400 truncate max-w-[100px]">
                {p1.address}
              </span>
              <span className="text-xs font-bold text-arena-neonCyan">{p1.total}/100</span>
            </div>
            <div className="space-y-1 text-[11px] font-mono text-gray-400">
              <div className="flex justify-between"><span>Correctness:</span><span>{p1.correctness}/40</span></div>
              <div className="flex justify-between"><span>Efficiency:</span><span>{p1.efficiency}/25</span></div>
              <div className="flex justify-between"><span>Readability:</span><span>{p1.readability}/20</span></div>
              <div className="flex justify-between"><span>Creativity:</span><span>{p1.creativity}/15</span></div>
            </div>
            <p className="text-[11px] text-gray-300 mt-3 pt-2 border-t border-arena-border">
              {p1.feedback}
            </p>
          </div>

          {/* Player 2 Card */}
          <div className="p-4 bg-arena-bg border border-arena-border rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-mono text-gray-400 truncate max-w-[100px]">
                {p2.address}
              </span>
              <span className="text-xs font-bold text-arena-neonPurple">{p2.total}/100</span>
            </div>
            <div className="space-y-1 text-[11px] font-mono text-gray-400">
              <div className="flex justify-between"><span>Correctness:</span><span>{p2.correctness}/40</span></div>
              <div className="flex justify-between"><span>Efficiency:</span><span>{p2.efficiency}/25</span></div>
              <div className="flex justify-between"><span>Readability:</span><span>{p2.readability}/20</span></div>
              <div className="flex justify-between"><span>Creativity:</span><span>{p2.creativity}/15</span></div>
            </div>
            <p className="text-[11px] text-gray-300 mt-3 pt-2 border-t border-arena-border">
              {p2.feedback}
            </p>
          </div>

        </div>

        {/* Reasoning breakdown */}
        <div className="mt-4 p-3 bg-arena-bg/50 border border-arena-border rounded-xl text-xs text-gray-300">
          <span className="text-arena-neonCyan font-bold">Referee AI Verdict:</span> {result.reasoning}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 py-3 bg-arena-card border border-arena-border hover:border-gray-500 text-gray-200 text-center font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2"
          >
            <span>Back to Arena Lobby</span>
          </Link>
          <Link
            href={userAddress ? `/profile/${userAddress}` : '/leaderboard'}
            className="flex-1 py-3 bg-gradient-to-r from-arena-neonCyan to-arena-neonPurple text-black text-center font-bold text-xs rounded-xl hover:scale-[1.02] transition flex items-center justify-center space-x-2"
          >
            <span>View On-Chain Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}