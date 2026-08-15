"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swords, Bot, Award, Coins, Flame, ArrowRight, ShieldCheck, PlayCircle } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [customRoomId, setCustomRoomId] = useState('');

  const generateRandomRoom = () => {
    const randomId = 'battle-' + Math.random().toString(36).substring(2, 8);
    router.push(`/battle/${randomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoomId.trim()) return;
    router.push(`/battle/${customRoomId.trim()}`);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Glow Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-arena-neonCyan/15 via-arena-neonPurple/15 to-arena-neonRed/10 blur-[130px] -z-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-20 text-center">
        
        {/* Live Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-arena-neonCyan/40 bg-arena-neonCyan/5 text-arena-neonCyan text-xs font-mono mb-8 glow-cyan">
          <span className="w-2 h-2 rounded-full bg-arena-neonCyan animate-ping" />
          <span>LIVE 1V1 AI CODING ARENA</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
          Where Developers <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-arena-neonCyan via-indigo-400 to-arena-neonPurple">
            Battle for Code Supremacy
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Stake testnet MATIC, enter real-time 1v1 Monaco editor battles, get judged by <span className="text-arena-neonCyan font-semibold">Google Gemini AI</span>, and mint Soulbound reputation badges.
        </p>

        {/* CTA Arena Launcher */}
        <div className="mt-10 max-w-md mx-auto bg-arena-card border border-arena-border p-6 rounded-2xl glow-purple shadow-2xl">
          <h3 className="text-sm font-mono text-gray-300 mb-4 uppercase tracking-wider text-left flex items-center justify-between">
            <span>Instant Matchmaking</span>
            <Flame className="h-4 w-4 text-arena-neonRed animate-bounce" />
          </h3>

          <div className="space-y-4">
            <button
              onClick={generateRandomRoom}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-arena-neonCyan to-arena-neonPurple text-black font-bold text-base hover:opacity-95 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
            >
              <Swords className="h-5 w-5" />
              <span>Create New Battle Arena</span>
            </button>

            <div className="flex items-center my-2 text-xs text-gray-500 font-mono">
              <span className="flex-1 border-t border-arena-border"></span>
              <span className="px-3">OR JOIN EXISTING</span>
              <span className="flex-1 border-t border-arena-border"></span>
            </div>

            <form onSubmit={handleJoinRoom} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Room Code (e.g. battle-x92a)"
                value={customRoomId}
                onChange={(e) => setCustomRoomId(e.target.value)}
                className="flex-1 bg-arena-bg border border-arena-border rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-arena-neonCyan transition"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-arena-card border border-arena-border hover:border-arena-neonPurple rounded-xl text-gray-200 hover:text-arena-neonPurple transition flex items-center justify-center"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16 border-t border-arena-border/60">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-200 mb-12">
          Engineered for Competitive Developers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Feature 1 */}
          <div className="bg-arena-card/60 border border-arena-border p-6 rounded-2xl hover:border-arena-neonCyan/60 transition group">
            <div className="w-12 h-12 rounded-xl bg-arena-neonCyan/10 border border-arena-neonCyan/30 flex items-center justify-center mb-4 text-arena-neonCyan group-hover:scale-110 transition-transform">
              <Swords className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-100">Live 1v1 Split Arena</h3>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
              Side-by-side Monaco code editors synchronized over Socket.io with live keystroke feedback and countdown timers.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-arena-card/60 border border-arena-border p-6 rounded-2xl hover:border-arena-neonPurple/60 transition group">
            <div className="w-12 h-12 rounded-xl bg-arena-neonPurple/10 border border-arena-neonPurple/30 flex items-center justify-center mb-4 text-arena-neonPurple group-hover:scale-110 transition-transform">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-100">Gemini AI Referee</h3>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
              AI doesn't just check unit tests. Gemini scores time complexity, code aesthetics, and delivers live sports commentary.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-arena-card/60 border border-arena-border p-6 rounded-2xl hover:border-yellow-500/60 transition group">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mb-4 text-yellow-400 group-hover:scale-110 transition-transform">
              <Coins className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-100">Polygon Amoy Escrow</h3>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
              Smart contracts escrow both players' testnet stakes and instantly release the pot to the AI-verified victor.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-arena-card/60 border border-arena-border p-6 rounded-2xl hover:border-arena-neonRed/60 transition group">
            <div className="w-12 h-12 rounded-xl bg-arena-neonRed/10 border border-arena-neonRed/30 flex items-center justify-center mb-4 text-arena-neonRed group-hover:scale-110 transition-transform">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-100">Soulbound Badges</h3>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
              Non-transferable on-chain ERC-721 NFT badges update with every battle won, cementing your developer reputation.
            </p>
          </div>

        </div>
      </section>

      {/* How it Works Step-by-Step */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-arena-card/40 border border-arena-border rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-6 text-center text-gray-200">How A Battle Works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-arena-neonCyan font-mono font-bold text-lg mb-1">01. STAKE & JOIN</div>
              <p className="text-xs text-gray-400">Connect MetaMask on Polygon Amoy, create a room, and share the link with an opponent.</p>
            </div>
            <div>
              <div className="text-arena-neonPurple font-mono font-bold text-lg mb-1">02. SOLVE IN CODE</div>
              <p className="text-xs text-gray-400">Both players get the same algorithmic problem and race against the live timer.</p>
            </div>
            <div>
              <div className="text-arena-neonGreen font-mono font-bold text-lg mb-1">03. AI VERDICT</div>
              <p className="text-xs text-gray-400">Gemini evaluates both codes, announces the winner, and triggers the on-chain payout.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}