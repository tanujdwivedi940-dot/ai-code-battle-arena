"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Swords, 
  Bot, 
  Award, 
  Coins, 
  Flame, 
  ArrowRight, 
  Layers, 
  Binary, 
  Cpu, 
  Calculator, 
  Code2, 
  X, 
  ChevronRight, 
  ArrowLeft,
  Shuffle,
  Terminal,
  Database,
  Search,
  Sparkles,
  Zap
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Algorithms', name: 'Algorithms', icon: Binary, count: 20, desc: 'Sorting, Searching, Dynamic Programming, Two Pointers & Graphs' },
  { id: 'Data Structures', name: 'Data Structures', icon: Layers, count: 20, desc: 'Arrays, Linked Lists, Stacks, Queues, Trees, Heaps & Hash Tables' },
  { id: 'Mathematics', name: 'Mathematics', icon: Calculator, count: 20, desc: 'Number Theory, Combinatorics, Sieve of Eratosthenes & Geometry' },
  { id: 'Artificial Intelligence', name: 'Artificial Intelligence', icon: Bot, count: 20, desc: 'Game Search Trees, Minimax, Heuristics, KNN & Decision Engines' },
  { id: 'C', name: 'C Language', icon: Cpu, count: 20, desc: 'Pointers, Dynamic Memory (malloc/free), Bitwise & Structs' },
  { id: 'C++', name: 'C++', icon: Code2, count: 20, desc: 'STL Containers, Custom Functors, RAII, Templates & OOP' },
  { id: 'Java', name: 'Java', icon: Code2, count: 20, desc: 'Collections Framework, OOP Design Patterns, Streams & Multithreading' },
  { id: 'Python', name: 'Python', icon: Code2, count: 20, desc: 'List Comprehensions, Generators, Decorators, Itertools & Slicing' },
  { id: 'Ruby', name: 'Ruby', icon: Sparkles, count: 20, desc: 'Blocks, Enumerable Methods, Hashes, Procs & Metaprogramming' },
  { id: 'SQL', name: 'SQL', icon: Database, count: 20, desc: 'Aggregations, Window Functions, Self Joins & Subqueries' },
  { id: 'Databases', name: 'Databases', icon: Database, count: 20, desc: 'ACID Transactions, Indexes, Normalization & Schema Consistency' },
  { id: 'Linux Shell', name: 'Linux Shell', icon: Terminal, count: 20, desc: 'Bash Scripting, Pipes, grep, awk, sed & Text Processing' },
  { id: 'Functional Programming', name: 'Functional Programming', icon: Binary, count: 20, desc: 'Currying, Pipe, Pure Functions, Monads & Immutability' },
  { id: 'Regex', name: 'Regex', icon: Search, count: 20, desc: 'Pattern Matching, Quantifiers, Lookaheads, IP & Email Validation' },
  { id: 'React', name: 'React', icon: Zap, count: 20, desc: 'Custom Hooks, State Management, Portals & Lifecycle Architecture' },
];

export default function LandingPage() {
  const router = useRouter();
  const [customRoomId, setCustomRoomId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);
  const [problems, setProblems] = useState<any[]>([]);

  // Open topic browser modal and fetch all questions
  const openTopicModal = async () => {
    try {
      const res = await fetch('/data/problems.json');
      if (res.ok) {
        const data = await res.json();
        setProblems(data);
      }
    } catch {
      // Fallback
    }
    setSelectedCategory(null);
    setSelectedSubtopic(null);
    setIsModalOpen(true);
  };

  const handleQuickBattle = () => {
    const randomId = 'battle-' + Math.random().toString(36).substring(2, 8);
    router.push(`/battle/${randomId}`);
  };

  const handleLaunchProblemBattle = (problemId: string) => {
    const randomId = 'battle-' + Math.random().toString(36).substring(2, 8);
    router.push(`/battle/${randomId}?problem=${problemId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoomId.trim()) return;
    router.push(`/battle/${customRoomId.trim()}`);
  };

  // Subtopics generator
  const availableSubtopics = selectedCategory
    ? Array.from(new Set(problems.filter((p) => p.category === selectedCategory).map((p) => p.subtopic)))
    : [];

  const matchingProblems = problems.filter(
    (p) => p.category === selectedCategory && p.subtopic === selectedSubtopic
  );

  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-arena-neonCyan/15 via-arena-neonPurple/15 to-arena-neonRed/10 blur-[130px] -z-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-20 text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-arena-neonCyan/40 bg-arena-neonCyan/5 text-arena-neonCyan text-xs font-mono mb-8 glow-cyan">
          <span className="w-2 h-2 rounded-full bg-arena-neonCyan animate-ping" />
          <span>15 PRACTICE DOMAINS • LIVE 1V1 AI CODING ARENA</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
          Where Developers <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-arena-neonCyan via-indigo-400 to-arena-neonPurple">
            Battle for Code Supremacy
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Select from 15 HackerRank-style domains (Algorithms, SQL, C, React, AI), enter real-time Monaco editor battles, get judged by <span className="text-arena-neonCyan font-semibold">Gemini AI</span>, and mint Soulbound reputation badges.
        </p>

        {/* CTA Arena Launcher */}
        <div className="mt-10 max-w-md mx-auto bg-arena-card border border-arena-border p-6 rounded-2xl glow-purple shadow-2xl">
          <h3 className="text-sm font-mono text-gray-300 mb-4 uppercase tracking-wider text-left flex items-center justify-between">
            <span>Choose Your Challenge</span>
            <Flame className="h-4 w-4 text-arena-neonRed animate-bounce" />
          </h3>

          <div className="space-y-3">
            <button
              onClick={openTopicModal}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-arena-neonCyan to-arena-neonPurple text-black font-bold text-base hover:opacity-95 hover:scale-[1.02] transition-all duration-200 cursor-pointer shadow-xl glow-cyan"
            >
              <Swords className="h-5 w-5" />
              <span>Browse 15 Domains & Battle</span>
            </button>

            <button
              onClick={handleQuickBattle}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-arena-bg border border-arena-border hover:border-arena-neonPurple text-gray-300 hover:text-white font-mono text-xs transition"
            >
              <Shuffle className="h-4 w-4 text-arena-neonPurple" />
              <span>Quick Match (Random Challenge)</span>
            </button>

            <div className="flex items-center my-2 text-xs text-gray-500 font-mono">
              <span className="flex-1 border-t border-arena-border"></span>
              <span className="px-3">OR ENTER ROOM ID</span>
              <span className="flex-1 border-t border-arena-border"></span>
            </div>

            <form onSubmit={handleJoinRoom} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Room Code (e.g. battle-x92a)"
                value={customRoomId}
                onChange={(e) => setCustomRoomId(e.target.value)}
                className="flex-1 bg-arena-bg border border-arena-border rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-arena-neonCyan transition font-mono"
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

      {/* 🌟 3-TIER 15-DOMAIN SELECTION DASHBOARD MODAL 🌟 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-arena-card border border-arena-border max-w-5xl w-full max-h-[85vh] rounded-3xl p-6 sm:p-8 glow-cyan shadow-2xl flex flex-col relative animate-in fade-in zoom-in duration-200">
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center justify-between pb-4 border-b border-arena-border">
              <div className="flex items-center space-x-2 text-xs sm:text-sm font-mono overflow-x-auto">
                <button
                  onClick={() => { setSelectedCategory(null); setSelectedSubtopic(null); }}
                  className={`hover:text-arena-neonCyan transition ${!selectedCategory ? 'text-arena-neonCyan font-bold' : 'text-gray-400'}`}
                >
                  1. All 15 Domains
                </button>

                {selectedCategory && (
                  <>
                    <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                    <button
                      onClick={() => setSelectedSubtopic(null)}
                      className={`hover:text-arena-neonCyan transition shrink-0 ${!selectedSubtopic ? 'text-arena-neonCyan font-bold' : 'text-gray-400'}`}
                    >
                      2. {selectedCategory}
                    </button>
                  </>
                )}

                {selectedSubtopic && (
                  <>
                    <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                    <span className="text-arena-neonGreen font-bold shrink-0">3. {selectedSubtopic}</span>
                  </>
                )}
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-arena-border transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto py-6">
              
              {/* LEVEL 1: 15-DOMAIN GRID (Matching HackerRank Screenshot) */}
              {!selectedCategory && (
                <div className="space-y-4">
                  <div className="text-left mb-6">
                    <h2 className="text-2xl font-extrabold text-gray-100">Practice Skills & Domains</h2>
                    <p className="text-xs text-gray-400 font-mono mt-1">Select a discipline to start your 1v1 arena challenge.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className="bg-arena-bg border border-arena-border hover:border-arena-neonCyan/70 rounded-2xl p-5 transition duration-200 cursor-pointer group shadow-lg hover:scale-[1.02]"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="p-2.5 rounded-xl bg-arena-neonCyan/10 text-arena-neonCyan border border-arena-neonCyan/30 group-hover:scale-110 transition">
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
                              {cat.count} Challenges
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-100 group-hover:text-arena-neonCyan transition">
                            {cat.name}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                            {cat.desc}
                          </p>
                          <div className="mt-4 pt-3 border-t border-arena-border/50 flex items-center justify-between text-xs font-mono text-arena-neonCyan">
                            <span>Explore Subtopics</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* LEVEL 2: SUBTOPICS */}
              {selectedCategory && !selectedSubtopic && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-left">
                      <h2 className="text-xl font-bold text-gray-100">{selectedCategory} Subtopics</h2>
                      <p className="text-xs text-gray-400 font-mono mt-1">Select an exact algorithmic technique or concept.</p>
                    </div>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="flex items-center space-x-1 text-xs font-mono text-arena-neonCyan hover:underline"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to All Domains</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableSubtopics.map((sub) => {
                      const count = problems.filter(
                        (p) => p.category === selectedCategory && p.subtopic === sub
                      ).length;

                      return (
                        <div
                          key={sub}
                          onClick={() => setSelectedSubtopic(sub)}
                          className="bg-arena-bg border border-arena-border hover:border-arena-neonPurple/70 rounded-2xl p-5 transition duration-200 cursor-pointer group shadow-lg hover:scale-[1.02]"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono font-bold text-arena-neonPurple uppercase">
                              SUBTOPIC
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                              {count} {count === 1 ? 'Challenge' : 'Challenges'}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-gray-100 group-hover:text-arena-neonPurple transition">
                            {sub}
                          </h3>
                          <div className="mt-4 pt-3 border-t border-arena-border/50 flex items-center justify-between text-xs font-mono text-arena-neonPurple">
                            <span>View Questions</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* LEVEL 3: PROBLEMS & BATTLE LAUNCHER */}
              {selectedCategory && selectedSubtopic && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-left">
                      <h2 className="text-xl font-bold text-gray-100">{selectedSubtopic} Challenges</h2>
                      <p className="text-xs text-gray-400 font-mono mt-1">Pick a challenge to launch your 1v1 battle arena!</p>
                    </div>
                    <button
                      onClick={() => setSelectedSubtopic(null)}
                      className="flex items-center space-x-1 text-xs font-mono text-arena-neonCyan hover:underline"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Subtopics</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {matchingProblems.map((prob) => (
                      <div
                        key={prob.id}
                        className="bg-arena-bg border border-arena-border hover:border-arena-neonCyan/60 rounded-2xl p-5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                      >
                        <div className="space-y-1 max-w-lg text-left">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-base font-bold text-gray-100 group-hover:text-arena-neonCyan transition">
                              {prob.title}
                            </h3>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                              prob.difficulty === 'Easy'
                                ? 'bg-emerald-500/15 text-arena-neonGreen border border-emerald-500/30'
                                : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                            }`}>
                              {prob.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            {prob.description}
                          </p>
                        </div>

                        <button
                          onClick={() => handleLaunchProblemBattle(prob.id)}
                          className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-arena-neonCyan to-arena-neonPurple hover:brightness-110 text-black font-mono font-bold text-xs shrink-0 transition hover:scale-105 shadow-xl glow-cyan"
                        >
                          <Swords className="w-4 h-4" />
                          <span>Battle on This</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16 border-t border-arena-border/60">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-200 mb-12">
          Engineered for Competitive Developers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-arena-card/60 border border-arena-border p-6 rounded-2xl hover:border-arena-neonCyan/60 transition group">
            <div className="w-12 h-12 rounded-xl bg-arena-neonCyan/10 border border-arena-neonCyan/30 flex items-center justify-center mb-4 text-arena-neonCyan group-hover:scale-110 transition-transform">
              <Swords className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-100">Live 1v1 Split Arena</h3>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
              Monaco code editors supporting 15 disciplines with live keystroke feedback.
            </p>
          </div>

          <div className="bg-arena-card/60 border border-arena-border p-6 rounded-2xl hover:border-arena-neonPurple/60 transition group">
            <div className="w-12 h-12 rounded-xl bg-arena-neonPurple/10 border border-arena-neonPurple/30 flex items-center justify-center mb-4 text-arena-neonPurple group-hover:scale-110 transition-transform">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-100">Gemini AI Referee</h3>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
              Google Gemini scores time complexity, code aesthetics, and delivers dual-channel commentary.
            </p>
          </div>

          <div className="bg-arena-card/60 border border-arena-border p-6 rounded-2xl hover:border-yellow-500/60 transition group">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mb-4 text-yellow-400 group-hover:scale-110 transition-transform">
              <Coins className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-100">Polygon Amoy Escrow</h3>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
              Smart contracts escrow both players' testnet stakes and instantly release the pot to the victor.
            </p>
          </div>

          <div className="bg-arena-card/60 border border-arena-border p-6 rounded-2xl hover:border-arena-neonRed/60 transition group">
            <div className="w-12 h-12 rounded-xl bg-arena-neonRed/10 border border-arena-neonRed/30 flex items-center justify-center mb-4 text-arena-neonRed group-hover:scale-110 transition-transform">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-100">Soulbound Badges</h3>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
              Non-transferable on-chain ERC-721 NFT badges update with every battle won.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}