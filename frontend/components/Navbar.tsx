"use client";

import Link from 'next/link';
import { Swords, Trophy, User } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function Navbar() {
  const { address } = useAccount();

  return (
    <nav className="border-b border-arena-border/80 bg-arena-bg/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-lg bg-arena-card border border-arena-border group-hover:border-cyan-500/50 transition">
              <Swords className="h-6 w-6 text-arena-neonCyan group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-arena-neonCyan via-indigo-400 to-arena-neonPurple">
                AI CODE BATTLE
              </span>
              <span className="text-[10px] text-gray-400 font-mono tracking-widest -mt-1">
                POLYGON AMOY ARENA
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-arena-neonCyan text-sm font-medium transition">
              Arena
            </Link>
            <Link href="/leaderboard" className="flex items-center space-x-1.5 text-gray-300 hover:text-arena-neonPurple text-sm font-medium transition">
              <Trophy className="h-4 w-4" />
              <span>Leaderboard</span>
            </Link>
            <Link 
              href={address ? `/profile/${address}` : '#'}
              className={`flex items-center space-x-1.5 text-sm font-medium transition ${
                address ? 'text-gray-300 hover:text-arena-neonCyan' : 'text-gray-500 cursor-not-allowed'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
          </div>

          {/* Real RainbowKit Connect Button */}
          <div className="flex items-center">
            <ConnectButton 
              accountStatus="avatar"
              chainStatus="icon"
              showBalance={false}
            />
          </div>

        </div>
      </div>
    </nav>
  );
}