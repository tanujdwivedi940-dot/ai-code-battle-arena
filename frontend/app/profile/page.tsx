"use client";

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User, Swords } from 'lucide-react';

export default function ProfileRedirect() {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected && address) {
      router.replace(`/profile/${address}`);
    }
  }, [isConnected, address, router]);

  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-arena-card border border-arena-border rounded-3xl text-center shadow-2xl space-y-4 glow-purple">
      <div className="p-4 rounded-2xl bg-arena-neonPurple/10 border border-arena-neonPurple/30 text-arena-neonPurple inline-block">
        <User className="w-10 h-10" />
      </div>
      <h2 className="text-xl font-bold font-mono text-gray-100">Connect Wallet to View Profile</h2>
      <p className="text-xs text-gray-400 font-mono leading-relaxed">
        Connect your MetaMask wallet on Polygon Amoy to view your on-chain battle history, win record, and Soulbound NFT badges.
      </p>
    </div>
  );
}