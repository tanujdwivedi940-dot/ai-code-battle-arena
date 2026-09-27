"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Swords, 
  Bot, 
  Award, 
  Coins, 
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
  Zap,
  Flame
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Algorithms', name: 'Algorithms', icon: Binary, count: 20, desc: 'Sorting, Searching, Dynamic Programming & Graph Theory' },
  { id: 'Data Structures', name: 'Data Structures', icon: Layers, count: 20, desc: 'Arrays, Linked Lists, Stacks, Queues, Trees & Hash Maps' },
  { id: 'Mathematics', name: 'Mathematics', icon: Calculator, count: 20, desc: 'Number Theory, Combinatorics, Sieve & Geometry' },
  { id: 'Artificial Intelligence', name: 'Artificial Intelligence', icon: Bot, count: 20, desc: 'Game Trees, Minimax, Heuristics & Decision Models' },
  { id: 'C', name: 'C Language', icon: Cpu, count: 20, desc: 'Pointers, Dynamic Malloc, Bitwise & Struct Memory' },
  { id: 'C++', name: 'C++', icon: Code2, count: 20, desc: 'STL Containers, Custom Functors, RAII & Templates' },
  { id: 'Java', name: 'Java', icon: Code2, count: 20, desc: 'Collections Framework, Concurrency, Streams & OOP' },
  { id: 'Python', name: 'Python', icon: Code2, count: 20, desc: 'Comprehensions, Generators, Decorators & Itertools' },
  { id: 'Ruby', name: 'Ruby', icon: Zap, count: 20, desc: 'Blocks, Enumerable Methods, Hashes & Metaprogramming' },
  { id: 'SQL', name: 'SQL', icon: Database, count: 20, desc: 'Window Functions, Aggregations, Joins & Subqueries' },
  { id: 'Databases', name: 'Databases', icon: Database, count: 20, desc: 'ACID Transactions, Indexes, Normalization & Sharding' },
  { id: 'Linux Shell', name: 'Linux Shell', icon: Terminal, count: 20, desc: 'Bash Scripting, Pipes, grep, awk & Log Analysis' },
  { id: 'Functional Programming', name: 'Functional Programming', icon: Binary, count: 20, desc: 'Currying, Pipe, Monads & Pure Functions' },
  { id: 'Regex', name: 'Regex', icon: Search, count: 20, desc: 'Pattern Matching, Lookaheads, IP & String Parsing' },
  { id: 'React', name: 'React', icon: Zap, count: 20, desc: 'Custom Hooks, State Architecture & Lifecycle Optimizations' },
];

export default function LandingPage() {
  const router = useRouter();
  const [customRoomId, setCustomRoomId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);
  const [problems, setProblems] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProblems() {
      try {
        const res = await fetch('/data/problems.json');
        if (res.ok) {
          const data = await res.json();
          setProblems(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchProblems();
  }, []);

  const openTopicModal = () => {
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

  const availableSubtopics = selectedCategory
    ? Array.from(new Set(problems.filter((p) => p.category === selectedCategory).map((p) => p.subtopic)))
    : [];

  const matchingProblems = problems.filter(
    (p) => p.category === selectedCategory && p.subtopic === selectedSubtopic
  );

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#CBD5E1]">
      
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 pt-12 sm:pt-16 pb-12 sm:pb-16 text-center">
        
        {/* Status Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-[#2A2F38] bg-[#171A21] text-[#94A3B8] text-xs font-mono mb-6 transition-all duration-200 hover:border-[#3B82F6]/50">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span>15 PRACTICE DOMAINS • LIVE 1V1 AI CODING ARENA</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F1F5F9] max-w-4xl mx-auto leading-tight">
          Where Developers <br />
          <span className="text-[#3B82F6]">Battle for Code Supremacy</span>
        </h1>

        <p className="mt-4 text-xs sm:text-sm text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
          Race side-by-side in Monaco code editors. Evaluated by Gemini AI on Big-O complexity and code elegance, backed by trustless on-chain reputation.
        </p>

        {/* Action Card with tactile buttons & smooth focus inputs */}
        <div className="mt-8 max-w-md mx-auto bg-[#171A21] border border-[#2A2F38] p-5 rounded-2xl text-left space-y-3 shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between text-xs font-mono text-[#F1F5F9] font-semibold uppercase tracking-wider mb-2">
            <span>Choose Your Challenge</span>
            <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
          </div>

          <button
            onClick={openTopicModal}
            className="w-full bg-[#3B82F6] hover:bg-[#60A5FA] text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition-all duration-150 ease-out hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] cursor-pointer shadow-sm"
          >
            <Swords className="h-4 w-4" />
            <span>Browse 15 Domains & Battle</span>
          </button>

          <button
            onClick={handleQuickBattle}
            className="w-full bg-[#0F1115] hover:bg-[#1E232B] border border-[#2A2F38] hover:border-[#2A2F38]/90 text-[#CBD5E1] hover:text-white py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center space-x-1.5 transition-all duration-150 ease-out hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] cursor-pointer"
          >
            <Shuffle className="h-3.5 w-3.5 text-[#94A3B8]" />
            <span>Quick Match (Random Challenge)</span>
          </button>

          <div className="flex items-center my-2 text-[10px] text-[#94A3B8] font-mono">
            <span className="flex-1 border-t border-[#2A2F38]"></span>
            <span className="px-2.5 uppercase">OR ENTER ROOM ID</span>
            <span className="flex-1 border-t border-[#2A2F38]"></span>
          </div>

          <form onSubmit={handleJoinRoom} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. battle-x92a"
              value={customRoomId}
              onChange={(e) => setCustomRoomId(e.target.value)}
              className="flex-1 bg-[#0F1115] border border-[#2A2F38] rounded-xl px-3 py-1.5 text-xs text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/20 font-mono transition-all duration-150"
            />
            <button
              type="submit"
              className="bg-[#0F1115] hover:bg-[#1E232B] border border-[#2A2F38] hover:border-[#3B82F6] text-[#F1F5F9] px-3.5 py-1.5 rounded-xl text-xs flex items-center justify-center transition-all duration-150 active:scale-95"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

      </section>

      {/* 🌟 3-TIER DOMAIN SELECTION MODAL (Smooth Scale + Fade In) 🌟 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 transition-opacity duration-200">
          <div className="bg-[#171A21] border border-[#2A2F38] max-w-4xl w-full max-h-[85vh] rounded-2xl p-5 sm:p-6 flex flex-col relative shadow-2xl animate-modal-in">
            
            {/* Modal Header & Breadcrumbs */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2F38]">
              <div className="flex items-center space-x-2 text-xs font-mono">
                <button
                  onClick={() => { setSelectedCategory(null); setSelectedSubtopic(null); }}
                  className={`transition-colors duration-150 ${!selectedCategory ? 'text-[#3B82F6] font-bold' : 'text-[#94A3B8] hover:text-[#CBD5E1]'}`}
                >
                  1. All 15 Domains
                </button>

                {selectedCategory && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                    <button
                      onClick={() => setSelectedSubtopic(null)}
                      className={`transition-colors duration-150 shrink-0 ${!selectedSubtopic ? 'text-[#3B82F6] font-bold' : 'text-[#94A3B8] hover:text-[#CBD5E1]'}`}
                    >
                      2. {selectedCategory}
                    </button>
                  </>
                )}

                {selectedSubtopic && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                    <span className="text-[#22C55E] font-bold shrink-0">3. {selectedSubtopic}</span>
                  </>
                )}
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0F1115] transition-colors duration-150 active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto py-4 text-left">
              
              {/* LEVEL 1: ALL DOMAINS (1-2px lift on hover) */}
              {!selectedCategory && (
                <div className="space-y-3">
                  <div className="mb-2">
                    <h3 className="text-sm sm:text-base font-bold text-[#F1F5F9]">Practice Skills & Domains</h3>
                    <p className="text-xs text-[#94A3B8]">Select a discipline to start your 1v1 arena challenge.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className="bg-[#0F1115] border border-[#2A2F38] hover:border-[#3B82F6] p-3.5 sm:p-4 rounded-xl cursor-pointer flex flex-col justify-between transition-all duration-200 ease-out hover:-translate-y-[2px] active:translate-y-0 group shadow-sm"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="p-1.5 rounded-md bg-[#171A21] border border-[#2A2F38] text-[#3B82F6] transition-transform duration-200 group-hover:scale-105">
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171A21] text-[#94A3B8] border border-[#2A2F38]">
                                {cat.count} Challenges
                              </span>
                            </div>
                            <h4 className="text-xs sm:text-sm font-semibold text-[#F1F5F9] group-hover:text-[#3B82F6] transition-colors duration-150">{cat.name}</h4>
                            <p className="text-[11px] text-[#94A3B8] mt-1 line-clamp-2 leading-relaxed">{cat.desc}</p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-[#2A2F38] flex items-center justify-between text-[11px] text-[#94A3B8] group-hover:text-[#3B82F6] font-mono transition-colors duration-150">
                            <span>Explore Subtopics</span>
                            <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* LEVEL 2: SUBTOPICS */}
              {selectedCategory && !selectedSubtopic && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#F1F5F9]">{selectedCategory} Subtopics</h3>
                      <p className="text-xs text-[#94A3B8]">Select an exact algorithmic concept.</p>
                    </div>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="bg-[#0F1115] hover:bg-[#1E232B] border border-[#2A2F38] text-[#CBD5E1] px-2.5 py-1 rounded-md text-xs flex items-center space-x-1 transition-all duration-150 active:scale-95"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availableSubtopics.map((sub) => {
                      const count = problems.filter((p) => p.category === selectedCategory && p.subtopic === sub).length;
                      return (
                        <div
                          key={sub}
                          onClick={() => setSelectedSubtopic(sub)}
                          className="bg-[#0F1115] border border-[#2A2F38] hover:border-[#3B82F6] p-3.5 sm:p-4 rounded-xl cursor-pointer flex flex-col justify-between transition-all duration-200 ease-out hover:-translate-y-[2px] active:translate-y-0 group"
                        >
                          <div>
                            <span className="text-[10px] font-mono uppercase text-[#94A3B8] font-bold block mb-1">SUBTOPIC</span>
                            <h4 className="text-xs sm:text-sm font-semibold text-[#F1F5F9] group-hover:text-[#3B82F6] transition-colors duration-150">{sub}</h4>
                          </div>
                          <div className="mt-3 pt-2 border-t border-[#2A2F38] flex items-center justify-between text-[11px] text-[#94A3B8] group-hover:text-[#3B82F6] font-mono transition-colors duration-150">
                            <span>{count} {count === 1 ? 'Challenge' : 'Challenges'}</span>
                            <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* LEVEL 3: CHALLENGES */}
              {selectedCategory && selectedSubtopic && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#F1F5F9]">{selectedSubtopic} Challenges</h3>
                      <p className="text-xs text-[#94A3B8]">Pick a challenge to launch your 1v1 battle arena!</p>
                    </div>
                    <button
                      onClick={() => setSelectedSubtopic(null)}
                      className="bg-[#0F1115] hover:bg-[#1E232B] border border-[#2A2F38] text-[#CBD5E1] px-2.5 py-1 rounded-md text-xs flex items-center space-x-1 transition-all duration-150 active:scale-95"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                  </div>

                  {matchingProblems.map((prob) => (
                    <div
                      key={prob.id}
                      className="bg-[#0F1115] border border-[#2A2F38] hover:border-[#3B82F6] p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-150 ease-out hover:-translate-y-[1px]"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-[#F1F5F9]">{prob.title}</h4>
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                            prob.difficulty === 'Easy'
                              ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30'
                              : prob.difficulty === 'Medium'
                              ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30'
                              : 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30'
                          }`}>
                            {prob.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-[#94A3B8] line-clamp-1">{prob.description}</p>
                      </div>

                      <button
                        onClick={() => handleLaunchProblemBattle(prob.id)}
                        className="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 shrink-0 transition-all duration-150 ease-out hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98]"
                      >
                        <Swords className="w-3.5 h-3.5" />
                        <span>Battle on This</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* Feature Grid with subtle 1px raise on hover */}
      <section className="max-w-5xl mx-auto px-4 py-12 border-t border-[#2A2F38]">
        <h2 className="text-center text-base sm:text-lg font-semibold text-[#F1F5F9] mb-6">
          Engineered for competitive developers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
          <div className="bg-[#171A21] border border-[#2A2F38] p-4 rounded-xl space-y-1.5 transition-all duration-200 ease-out hover:-translate-y-[2px] hover:border-[#3B82F6]/50">
            <div className="w-7 h-7 rounded-lg bg-[#0F1115] border border-[#2A2F38] flex items-center justify-center text-[#3B82F6]">
              <Swords className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-[#F1F5F9]">Live 1v1 Split Arena</h3>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Monaco code editors in C, Python, and JS with sub-50ms keystroke synchronization.
            </p>
          </div>

          <div className="bg-[#171A21] border border-[#2A2F38] p-4 rounded-xl space-y-1.5 transition-all duration-200 ease-out hover:-translate-y-[2px] hover:border-[#F59E0B]/50">
            <div className="w-7 h-7 rounded-lg bg-[#0F1115] border border-[#2A2F38] flex items-center justify-center text-[#F59E0B]">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-[#F1F5F9]">Gemini AI Referee</h3>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Automated grading on Big-O space-time complexity, correctness, and live voice commentary.
            </p>
          </div>

          <div className="bg-[#171A21] border border-[#2A2F38] p-4 rounded-xl space-y-1.5 transition-all duration-200 ease-out hover:-translate-y-[2px] hover:border-[#22C55E]/50">
            <div className="w-7 h-7 rounded-lg bg-[#0F1115] border border-[#2A2F38] flex items-center justify-center text-[#22C55E]">
              <Coins className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-[#F1F5F9]">Trustless Escrow</h3>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Smart contracts hold micro-stakes on Polygon Amoy and release the prize to the victor.
            </p>
          </div>

          <div className="bg-[#171A21] border border-[#2A2F38] p-4 rounded-xl space-y-1.5 transition-all duration-200 ease-out hover:-translate-y-[2px] hover:border-[#3B82F6]/50">
            <div className="w-7 h-7 rounded-lg bg-[#0F1115] border border-[#2A2F38] flex items-center justify-center text-[#3B82F6]">
              <Award className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-[#F1F5F9]">Soulbound Badges</h3>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Non-transferable on-chain ERC-721 tokens verifying authentic developer skill.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}