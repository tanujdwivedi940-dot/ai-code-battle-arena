"use client";

import { useParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { 
  Award, 
  ShieldCheck, 
  Trophy, 
  Flame, 
  Code2, 
  Calendar, 
  ExternalLink, 
  Swords,
  Activity,
  Zap,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ProfilePage() {
  const params = useParams();
  const rawAddress = (params.address as string) || '0x0000000000000000000000000000000000000000';
  const { address: connectedAddress } = useAccount();
  const [copied, setCopied] = useState(false);

  const isMyProfile = connectedAddress && connectedAddress.toLowerCase() === rawAddress.toLowerCase();

  const copyAddress = () => {
    navigator.clipboard.writeText(rawAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dynamic Player Statistics
  const stats = {
    battlesCount: 18,
    wins: 14,
    losses: 4,
    winRate: '77.8%',
    totalStakedWon: '3.4 POL',
    avgScore: '92.4/100',
    globalRank: '#4 in Arena',
  };

  // Soulbound Reputation Badges (ERC-721 On-Chain Collection)
  const badges = [
    {
      id: '1',
      title: 'Grandmaster Algorithmist',
      problem: 'Two Sum & Fast Hash Map Lookup',
      score: 98,
      date: 'Feb 2025',
      tier: 'Grandmaster',
      color: 'from-amber-400 to-yellow-600',
      description: 'Awarded for achieving a 98/100 single-pass linear time complexity solution.'
    },
    {
      id: '2',
      title: 'O(1) Space Memory Wizard',
      problem: 'In-Place Singly Linked List Reversal',
      score: 95,
      date: 'Feb 2025',
      tier: 'Diamond',
      color: 'from-cyan-400 to-blue-600',
      description: 'Awarded for executing pointer reversal with strictly O(1) auxiliary space.'
    },
    {
      id: '3',
      title: 'Low-Level C Systems Slayer',
      problem: 'Pointer Arithmetic & Dynamic Malloc',
      score: 92,
      date: 'Feb 2025',
      tier: 'Platinum',
      color: 'from-purple-500 to-pink-600',
      description: 'Mastery over raw memory management, double pointers, and boundary safety.'
    },
    {
      id: '4',
      title: 'Dynamic Programming Master',
      problem: 'Kadane Maximum Subarray & Coin Change',
      score: 90,
      date: 'Jan 2025',
      tier: 'Gold',
      color: 'from-emerald-400 to-teal-600',
      description: 'Optimal state transition formulation with memoization table optimization.'
    },
  ];

  // Match History
  const matchHistory = [
    { id: 'battle-r921', problem: 'Two Sum Target Search', result: 'VICTORY', score: 98, opponent: '0x71C4...821A', lang: 'JavaScript', date: 'Just now' },
    { id: 'battle-x402', problem: 'Reverse Singly Linked List', result: 'VICTORY', score: 95, opponent: '0x32A1...90F2', lang: 'C', date: '2 hours ago' },
    { id: 'battle-k819', problem: 'Valid Parentheses Stack', result: 'VICTORY', score: 92, opponent: '0x99B3...E32C', lang: 'Java', date: 'Yesterday' },
    { id: 'battle-p110', problem: 'Coin Change Minimum', result: 'DEFEAT', score: 74, opponent: '0xFA32...291B', lang: 'Python', date: '2 days ago' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8 text-left">
      
      {/* 1. Profile Top Card */}
      <div className="bg-arena-card border border-arena-border rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl glow-purple">
        <div className="absolute top-0 right-0 w-80 h-80 bg-arena-neonCyan/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-arena-neonCyan to-arena-neonPurple p-0.5 glow-cyan shrink-0">
              <div className="w-full h-full bg-arena-card rounded-2xl flex items-center justify-center font-mono font-bold text-arena-neonCyan text-xl">
                {rawAddress.substring(2, 4).toUpperCase()}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-bold font-mono text-gray-100">
                  {rawAddress.substring(0, 8)}...{rawAddress.substring(rawAddress.length - 6)}
                </h1>
                <button
                  onClick={copyAddress}
                  className="p-1 rounded-lg bg-arena-bg border border-arena-border hover:border-arena-neonCyan text-gray-400 hover:text-white transition"
                  title="Copy Wallet Address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-arena-neonGreen" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-arena-neonGreen/20 text-arena-neonGreen border border-arena-neonGreen/30 text-[10px] font-mono font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>ON-CHAIN VERIFIED</span>
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs text-gray-400 font-mono">
                <span>Polygon Amoy Network</span>
                <span>•</span>
                <a
                  href={`https://amoy.polygonscan.com/address/${rawAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-arena-neonCyan hover:underline flex items-center space-x-1"
                >
                  <span>View on Polygonscan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="px-5 py-2.5 bg-gradient-to-r from-arena-neonCyan to-arena-neonPurple text-black font-bold text-xs font-mono rounded-xl hover:scale-105 transition shadow-lg shrink-0 flex items-center space-x-2"
          >
            <Swords className="w-4 h-4" />
            <span>Enter Battle Arena</span>
          </Link>
        </div>

        {/* Stats Matrix Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-arena-border font-mono">
          <div className="bg-arena-bg/60 p-4 rounded-xl border border-arena-border">
            <p className="text-xs text-gray-400">Total Battles</p>
            <p className="text-xl font-bold text-gray-100 mt-1">{stats.battlesCount}</p>
          </div>
          <div className="bg-arena-bg/60 p-4 rounded-xl border border-arena-border">
            <p className="text-xs text-gray-400">Win Rate</p>
            <p className="text-xl font-bold text-arena-neonGreen mt-1">{stats.winRate} ({stats.wins}W / {stats.losses}L)</p>
          </div>
          <div className="bg-arena-bg/60 p-4 rounded-xl border border-arena-border">
            <p className="text-xs text-gray-400">POL / MATIC Won</p>
            <p className="text-xl font-bold text-yellow-400 mt-1">+{stats.totalStakedWon}</p>
          </div>
          <div className="bg-arena-bg/60 p-4 rounded-xl border border-arena-border">
            <p className="text-xs text-gray-400">Avg AI Code Score</p>
            <p className="text-xl font-bold text-arena-neonPurple mt-1">{stats.avgScore}</p>
          </div>
        </div>
      </div>

      {/* 2. Soulbound NFT Reputation Badges */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-arena-neonCyan" />
            <h2 className="text-xl font-bold text-gray-100 font-mono">
              Soulbound Reputation Badges (ERC-721)
            </h2>
          </div>
          <span className="text-xs font-mono text-gray-400">
            {badges.length} Badges Minted
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="bg-arena-card border border-arena-border rounded-2xl p-5 hover:border-arena-neonCyan/50 transition duration-300 relative group overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className={`h-24 rounded-xl bg-gradient-to-br ${badge.color} p-3 flex flex-col justify-between mb-4 shadow-lg`}>
                  <div className="flex justify-between items-start">
                    <Award className="w-7 h-7 text-black/80" />
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-black/50 text-white backdrop-blur-md rounded-md uppercase">
                      {badge.tier}
                    </span>
                  </div>
                  <div className="text-black font-mono font-extrabold text-xs">
                    AI Referee Score: {badge.score}/100
                  </div>
                </div>

                <h3 className="font-bold text-gray-100 text-sm font-mono">{badge.title}</h3>
                <p className="text-xs text-gray-400 mt-1 font-mono">{badge.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-arena-border flex items-center justify-between text-[11px] font-mono text-gray-500">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{badge.date}</span>
                </span>
                <span className="text-arena-neonCyan font-bold tracking-wider">SOULBOUND</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recent 1v1 Battle History */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-arena-neonPurple" />
          <h2 className="text-xl font-bold text-gray-100 font-mono">
            Recent 1v1 Match History
          </h2>
        </div>

        <div className="bg-arena-card border border-arena-border rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-arena-border bg-arena-bg/60 text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Challenge</th>
                  <th className="py-3.5 px-5">Language</th>
                  <th className="py-3.5 px-5">Opponent</th>
                  <th className="py-3.5 px-5 text-center">Result</th>
                  <th className="py-3.5 px-5 text-right">AI Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-arena-border">
                {matchHistory.map((m, idx) => (
                  <tr key={idx} className="hover:bg-arena-bg/40 transition">
                    <td className="py-4 px-5 font-bold text-gray-200">{m.problem}</td>
                    <td className="py-4 px-5 text-arena-neonCyan font-semibold uppercase">{m.lang}</td>
                    <td className="py-4 px-5 text-gray-400">{m.opponent}</td>
                    <td className="py-4 px-5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.result === 'VICTORY'
                          ? 'bg-arena-neonGreen/15 text-arena-neonGreen border border-arena-neonGreen/30'
                          : 'bg-arena-neonRed/15 text-arena-neonRed border border-arena-neonRed/30'
                      }`}>
                        {m.result}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right font-bold text-yellow-400">{m.score}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}