"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Award, Flame, Search, ExternalLink, ShieldCheck } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  address: string;
  wins: number;
  losses: number;
  winRate: string;
  totalMaticWon: number;
  badgeLevel: 'Grandmaster' | 'Master' | 'Diamond' | 'Gold';
}

const MOCK_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    address: '0x71C...4982',
    wins: 42,
    losses: 4,
    winRate: '91.3%',
    totalMaticWon: 8.4,
    badgeLevel: 'Grandmaster',
  },
  {
    rank: 2,
    address: '0x32A...81F0',
    wins: 35,
    losses: 7,
    winRate: '83.3%',
    totalMaticWon: 7.0,
    badgeLevel: 'Grandmaster',
  },
  {
    rank: 3,
    address: '0x99B...E32C',
    wins: 28,
    losses: 6,
    winRate: '82.3%',
    totalMaticWon: 5.6,
    badgeLevel: 'Master',
  },
  {
    rank: 4,
    address: '0x14D...9041',
    wins: 21,
    losses: 8,
    winRate: '72.4%',
    totalMaticWon: 4.2,
    badgeLevel: 'Diamond',
  },
  {
    rank: 5,
    address: '0xFA3...291B',
    wins: 16,
    losses: 5,
    winRate: '76.1%',
    totalMaticWon: 3.2,
    badgeLevel: 'Gold',
  },
];

export default function LeaderboardPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = MOCK_LEADERBOARD.filter((user) =>
    user.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-arena-neonCyan/30 bg-arena-neonCyan/10 text-arena-neonCyan text-xs font-mono mb-4">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span>ON-CHAIN TOURNAMENT RANKINGS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-100">
          Hall of Code Champions
        </h1>
        <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
          Top Web3 developers ranked by AI referee evaluations, battle win rates, and Soulbound badge count on Polygon Amoy.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8 relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by wallet address (e.g. 0x71C...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-arena-card border border-arena-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-arena-neonCyan transition font-mono"
        />
      </div>

      {/* Leaderboard Table Card */}
      <div className="bg-arena-card border border-arena-border rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-arena-border bg-arena-bg/60 text-gray-400 text-xs font-mono uppercase tracking-wider">
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6">Warrior</th>
                <th className="py-4 px-6">Soulbound Tier</th>
                <th className="py-4 px-6 text-center">W / L</th>
                <th className="py-4 px-6 text-center">Win Rate</th>
                <th className="py-4 px-6 text-right">POL / MATIC Won</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-arena-border text-sm font-mono">
              {filteredUsers.map((user) => (
                <tr
                  key={user.rank}
                  className="hover:bg-arena-bg/40 transition group"
                >
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
                        user.rank === 1
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                          : user.rank === 2
                          ? 'bg-gray-400/20 text-gray-300 border border-gray-400/40'
                          : user.rank === 3
                          ? 'bg-amber-700/20 text-amber-500 border border-amber-700/40'
                          : 'text-gray-400'
                      }`}
                    >
                      {user.rank}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <Link
                      href={`/profile/${user.address}`}
                      className="font-bold text-gray-200 group-hover:text-arena-neonCyan flex items-center space-x-1.5 transition"
                    >
                      <span>{user.address}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                    </Link>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                        user.badgeLevel === 'Grandmaster'
                          ? 'bg-purple-500/20 text-arena-neonPurple border border-purple-500/40'
                          : user.badgeLevel === 'Master'
                          ? 'bg-cyan-500/20 text-arena-neonCyan border border-cyan-500/40'
                          : 'bg-emerald-500/20 text-arena-neonGreen border border-emerald-500/40'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{user.badgeLevel}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-gray-300">
                    <span className="text-arena-neonGreen">{user.wins}W</span> /{' '}
                    <span className="text-arena-neonRed">{user.losses}L</span>
                  </td>
                  <td className="py-4 px-6 text-center text-gray-200">
                    {user.winRate}
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-yellow-400">
                    +{user.totalMaticWon} POL
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}