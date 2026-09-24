"use client";

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User, Swords } from 'lucide-react';
import Link from 'next/link';

export default function ProfileRedirect() {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected && address) {
      router.replace(`/profile/${address}`);
    }
  }, [isConnected, address, router]);

  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-arena-card border border-arena-border rounded-3xl text-center shadow-2xl space-y-5 glow-purple font-mono">
      <div className="p-4 rounded-2xl bg-arena-neonPurple/10 border border-arena-neonPurple/30 text-arena-neonPurple inline-block">
        <User className="w-10 h-10" />
      </div>
      <h2 className="text-xl font-bold text-gray-100">Connect Wallet to View Profile</h2>
      <p className="text-xs text-gray-400 leading-relaxed">
        Connect your MetaMask wallet on Polygon Amoy to view your live verified on-chain battle history, win record, and Soulbound NFT badges.
      </p>
      <Link
        href="/"
        className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-arena-neonCyan to-arena-neonPurple text-black font-bold text-xs rounded-xl hover:scale-105 transition shadow-lg"
      >
        <Swords className="w-4 h-4" />
        <span>Return to Arena Lobby</span>
      </Link>
    </div>
  );
}