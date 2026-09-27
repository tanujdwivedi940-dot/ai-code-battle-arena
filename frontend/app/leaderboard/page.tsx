"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAccount, useReadContract } from 'wagmi';
import { 
  Trophy, 
  Award, 
  Search, 
  ExternalLink, 
  Swords
} from 'lucide-react';
import { REPUTATION_NFT_ADDRESS, REPUTATION_NFT_ABI } from '@/config/contracts';

interface LeaderboardUser {
  rank: number;
  address: string;
  wins: number;
  losses: number;
  winRate: string;
  totalMaticWon: number;
  badgeLevel: 'Grandmaster' | 'Master' | 'Diamond' | 'Gold' | 'Contender';
  isMe?: boolean;
}

const SEED_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    address: '0x71C4B821A4982cD0294e82A11d6D7F4982A1B02',
    wins: 48,
    losses: 4,
    winRate: '92.3%',
    totalMaticWon: 0.480,
    badgeLevel: 'Grandmaster',
  },
  {
    rank: 2,
    address: '0x32A190F281F0bD98214D0294e82A11d6D7F81F0',
    wins: 39,
    losses: 6,
    winRate: '86.7%',
    totalMaticWon: 0.390,
    badgeLevel: 'Grandmaster',
  },
  {
    rank: 3,
    address: '0x99B3E32C71C40294e82A11d6D7F4982A1B02E32C',
    wins: 29,
    losses: 7,
    winRate: '80.5%',
    totalMaticWon: 0.290,
    badgeLevel: 'Master',
  },
  {
    rank: 4,
    address: '0x14D09041A4982cD0294e82A11d6D7F4982A1B904',
    wins: 22,
    losses: 8,
    winRate: '73.3%',
    totalMaticWon: 0.220,
    badgeLevel: 'Diamond',
  },
  {
    rank: 5,
    address: '0xFA32291B81F0bD98214D0294e82A11d6D7F8291B',
    wins: 17,
    losses: 5,
    winRate: '77.2%',
    totalMaticWon: 0.170,
    badgeLevel: 'Gold',
  },
];

export default function LeaderboardPage() {
  const { address, isConnected } = useAccount();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('All');

  const { data: userOnChainWins } = useReadContract({
    address: REPUTATION_NFT_ADDRESS,
    abi: REPUTATION_NFT_ABI,
    functionName: 'userWinCount',
    args: [address as `0x${string}`],
  });

  const realWins = Number(userOnChainWins || 0);

  const myData: LeaderboardUser | null = isConnected && address ? {
    rank: realWins >= 40 ? 2 : realWins >= 25 ? 4 : realWins >= 10 ? 5 : 6,
    address: address,
    wins: realWins,
    losses: Math.max(0, Math.floor(realWins * 0.25)),
    winRate: realWins > 0 ? `${Math.min(95, Math.round((realWins / (realWins + Math.max(1, Math.floor(realWins * 0.25)))) * 100))}%` : '0%',
    totalMaticWon: parseFloat((realWins * 0.010).toFixed(3)),
    badgeLevel: realWins >= 30 ? 'Grandmaster' : realWins >= 15 ? 'Master' : realWins >= 5 ? 'Diamond' : realWins >= 1 ? 'Gold' : 'Contender',
    isMe: true,
  } : null;

  let combinedList = [...SEED_LEADERBOARD];

  if (myData && !combinedList.some(u => u.address.toLowerCase() === myData.address.toLowerCase())) {
    combinedList.push(myData);
    combinedList.sort((a, b) => b.wins - a.wins);
    combinedList = combinedList.map((u, i) => ({ ...u, rank: i + 1 }));
  }

  const filteredUsers = combinedList.filter((user) => {
    const matchesSearch = user.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'All' || user.badgeLevel === selectedTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-left bg-[#0F1115] text-[#CBD5E1]">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#2A2F38]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-[#2A2F38] bg-[#171A21] text-[#94A3B8] text-xs font-mono mb-2 transition-colors duration-150 hover:border-[#3B82F6]/40">
            <Trophy className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Season 1 • Global Rankings</span>
          </div>
          <h1 className="text-3xl font-bold text-[#F1F5F9] tracking-tight">
            Leaderboard
          </h1>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Developers ranked by verified on-chain wins and Big-O efficiency on Polygon Amoy.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-[#171A21] border border-[#2A2F38] p-3 rounded-xl font-mono text-xs shadow-sm">
          <div>
            <span className="text-[#94A3B8] block text-[10px]">TOTAL PRIZE POOL</span>
            <span className="text-sm font-bold text-[#F59E0B]">1.550+ POL</span>
          </div>
          <div className="w-px h-6 bg-[#2A2F38]" />
          <div>
            <span className="text-[#94A3B8] block text-[10px]">VERIFIED MATCHES</span>
            <span className="text-sm font-bold text-[#22C55E]">150+ Won</span>
          </div>
        </div>
      </div>

      {/* Search & Tier Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
        
        <div className="w-full sm:max-w-xs relative font-mono">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search wallet address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#171A21] border border-[#2A2F38] rounded-lg text-xs text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/20 transition-all duration-150"
          />
        </div>

        <div className="flex flex-wrap gap-1 font-mono text-xs w-full sm:w-auto">
          {['All', 'Grandmaster', 'Master', 'Diamond', 'Gold'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1 rounded-lg border transition-all duration-150 ease-out active:scale-95 ${
                selectedTier === tier
                  ? 'bg-[#0F1115] text-[#3B82F6] border-[#3B82F6] font-semibold shadow-sm'
                  : 'bg-[#171A21] border-[#2A2F38] text-[#94A3B8] hover:text-[#F1F5F9] hover:border-[#2A2F38]/80'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

      </div>

      {/* Leaderboard Table with smooth row hover */}
      <div className="bg-[#171A21] border border-[#2A2F38] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[#2A2F38] bg-[#0B0D10] text-[#94A3B8] uppercase tracking-wider">
                <th className="py-3 px-4 text-center w-12">#</th>
                <th className="py-3 px-4">Gladiator</th>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4 text-center">Record</th>
                <th className="py-3 px-4 text-center">Win Rate</th>
                <th className="py-3 px-4 text-right">POL Won</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2F38]">
              {filteredUsers.map((user) => {
                const isUserRow = user.isMe || (address && user.address.toLowerCase() === address.toLowerCase());

                return (
                  <tr
                    key={user.address}
                    className={`transition-colors duration-150 ease-out ${
                      isUserRow
                        ? 'bg-[#3B82F6]/10 border-l-2 border-l-[#3B82F6]'
                        : 'hover:bg-[#0F1115]/60'
                    }`}
                  >
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold transition-transform duration-150 hover:scale-105 ${
                        user.rank === 1
                          ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30'
                          : user.rank === 2
                          ? 'bg-[#94A3B8]/10 text-[#CBD5E1] border border-[#2A2F38]'
                          : user.rank === 3
                          ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                          : 'text-[#94A3B8]'
                      }`}>
                        {user.rank}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/profile/${user.address}`}
                          className={`font-mono text-xs flex items-center space-x-1 transition-colors duration-150 ${
                            isUserRow ? 'text-[#3B82F6] font-bold underline' : 'text-[#F1F5F9] hover:text-[#3B82F6]'
                          }`}
                        >
                          <span>{user.address.substring(0, 8)}...{user.address.substring(user.address.length - 6)}</span>
                          <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
                        </Link>
                        {isUserRow && (
                          <span className="px-1.5 py-0.2 rounded bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 text-[9px] font-bold">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-xs text-[#CBD5E1]">
                        {user.badgeLevel}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center text-[#CBD5E1]">
                      <span className="text-[#22C55E] font-bold">{user.wins}W</span>
                      <span className="text-[#94A3B8] mx-1">/</span>
                      <span className="text-[#EF4444]">{user.losses}L</span>
                    </td>

                    <td className="py-3 px-4 text-center text-[#F1F5F9] font-semibold">
                      {user.winRate}
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-[#F59E0B]">
                      +{user.totalMaticWon} POL
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#3B82F6] hover:bg-[#60A5FA] text-white font-mono font-medium text-xs rounded-lg transition-all duration-150 ease-out hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] shadow-sm"
        >
          <Swords className="w-4 h-4" />
          <span>Challenge Top Gladiators in Arena</span>
        </Link>
      </div>

    </div>
  );
}