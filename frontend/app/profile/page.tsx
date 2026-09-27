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
    <div className="max-w-md mx-auto my-20 p-6 bg-[#171A21] border border-[#2A2F38] rounded-xl text-center shadow-lg space-y-4 font-mono text-[#CBD5E1]">
      <div className="p-3 rounded-lg bg-[#0F1115] border border-[#2A2F38] text-[#3B82F6] inline-block">
        <User className="w-8 h-8" />
      </div>
      <h2 className="text-base font-bold text-[#F1F5F9]">Connect Wallet to View Profile</h2>
      <p className="text-xs text-[#94A3B8] leading-relaxed">
        Connect your MetaMask wallet on Polygon Amoy to view your verified on-chain battle history, win record, and Soulbound NFT badges.
      </p>
      <Link
        href="/"
        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#3B82F6] hover:bg-[#60A5FA] text-white font-medium text-xs rounded-lg transition"
      >
        <Swords className="w-3.5 h-3.5" />
        <span>Return to Arena</span>
      </Link>
    </div>
  );
}