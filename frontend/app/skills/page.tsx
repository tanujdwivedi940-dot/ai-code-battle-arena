"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Code2, 
  Binary, 
  Cpu, 
  Calculator, 
  Layers, 
  Search, 
  Swords, 
  ChevronRight, 
  ArrowLeft,
  Sparkles,
  Bot,
  Database,
  Terminal,
  Zap
} from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  category: string;
  subtopic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
}

const ALL_15_DOMAINS = [
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

export default function SkillsPage() {
  const router = useRouter();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // 🔄 Fetch all 300 problems from public/data/problems.json
  useEffect(() => {
    async function loadProblems() {
      try {
        const res = await fetch('/data/problems.json');
        if (res.ok) {
          const data = await res.json();
          setProblems(data);
        }
      } catch (err) {
        console.error('Failed to load problems:', err);
      }
    }
    loadProblems();
  }, []);

  // Launch Battle on Specific Problem
  const handleStartBattle = (problemId: string) => {
    const randomRoomId = 'battle-' + Math.random().toString(36).substring(2, 8);
    router.push(`/battle/${randomRoomId}?problem=${problemId}`);
  };

  // Filter Problems for Selected Domain
  const activeProblems = problems.filter((p) => {
    const matchesTopic = !selectedTopic || p.category === selectedTopic;
    const matchesSubdomain = selectedSubdomain === 'All' || p.subtopic === selectedSubdomain;
    const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTopic && matchesSubdomain && matchesDifficulty && matchesSearch;
  });

  const availableSubdomains = Array.from(
    new Set(
      problems
        .filter((p) => !selectedTopic || p.category === selectedTopic)
        .map((p) => p.subtopic)
        .filter(Boolean)
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-left">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-arena-border">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-arena-neonCyan/10 border border-arena-neonCyan/30 text-arena-neonCyan text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>15 PRACTICE DOMAINS • 300+ CHALLENGES</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-100">
            {selectedTopic ? selectedTopic : 'Practice Skills & Battle Domains'}
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-mono">
            {selectedTopic 
              ? `Select any challenge in ${selectedTopic} to launch an instant 1v1 battle arena!`
              : 'Choose a programming language, data structure, or algorithmic field to compete in.'
            }
          </p>
        </div>

        {selectedTopic && (
          <button
            onClick={() => { setSelectedTopic(null); setSelectedSubdomain('All'); }}
            className="flex items-center space-x-2 px-4 py-2 bg-arena-card border border-arena-border hover:border-arena-neonCyan rounded-xl text-xs font-mono text-gray-300 transition"
          >
            <ArrowLeft className="w-4 h-4 text-arena-neonCyan" />
            <span>All 15 Domains</span>
          </button>
        )}
      </div>

      {/* 1. ALL 15 DOMAINS GRID (Matching HackerRank Layout) */}
      {!selectedTopic ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_15_DOMAINS.map((topic) => {
            const Icon = topic.icon;
            const count = problems.filter((p) => p.category === topic.id).length || topic.count;

            return (
              <div
                key={topic.id}
                onClick={() => {
                  setSelectedTopic(topic.id);
                  setSelectedSubdomain('All');
                  setSelectedDifficulty('All');
                  setSearchTerm('');
                }}
                className="bg-arena-card border border-arena-border hover:border-arena-neonCyan/70 rounded-2xl p-6 transition duration-200 cursor-pointer group shadow-xl hover:scale-[1.02] relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-arena-neonCyan/10 text-arena-neonCyan border border-arena-neonCyan/30 group-hover:scale-110 transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-gray-800 text-gray-300 border border-gray-700 font-bold">
                    {count} Challenges
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-100 group-hover:text-arena-neonCyan transition">
                  {topic.name}
                </h3>
                <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                  {topic.desc}
                </p>

                <div className="mt-6 pt-4 border-t border-arena-border flex items-center justify-between text-xs font-mono text-arena-neonCyan">
                  <span>Explore 20 Problems</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (

        /* 2. PROBLEMS LIST & SIDEBAR FILTERS */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Filter */}
          <div className="space-y-6">
            
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-arena-card border border-arena-border rounded-xl text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-arena-neonCyan transition font-mono"
              />
            </div>

            {/* Subdomain Filter */}
            <div className="bg-arena-card border border-arena-border rounded-2xl p-4">
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 mb-3 tracking-wider">Subdomains</h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedSubdomain('All')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                    selectedSubdomain === 'All'
                      ? 'bg-arena-neonCyan/20 text-arena-neonCyan font-bold'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-arena-bg'
                  }`}
                >
                  All Subdomains
                </button>
                {availableSubdomains.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubdomain(sub)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition truncate ${
                      selectedSubdomain === sub
                        ? 'bg-arena-neonCyan/20 text-arena-neonCyan font-bold'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-arena-bg'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="bg-arena-card border border-arena-border rounded-2xl p-4">
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 mb-3 tracking-wider">Difficulty</h4>
              <div className="space-y-1.5">
                {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                      selectedDifficulty === diff
                        ? 'bg-arena-neonPurple/20 text-arena-neonPurple font-bold'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-arena-bg'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Problems List */}
          <div className="lg:col-span-3 space-y-4">
            {activeProblems.length === 0 ? (
              <div className="bg-arena-card border border-arena-border rounded-2xl p-12 text-center text-gray-500 font-mono text-sm">
                No challenges found matching your filters.
              </div>
            ) : (
              activeProblems.map((prob) => (
                <div
                  key={prob.id}
                  className="bg-arena-card border border-arena-border hover:border-arena-neonCyan/50 rounded-2xl p-5 sm:p-6 transition shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center space-x-2.5">
                      <h3 className="text-base font-bold text-gray-100 group-hover:text-arena-neonCyan transition">
                        {prob.title}
                      </h3>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                        prob.difficulty === 'Easy'
                          ? 'bg-emerald-500/15 text-arena-neonGreen border border-emerald-500/30'
                          : prob.difficulty === 'Medium'
                          ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                          : 'bg-red-500/15 text-arena-neonRed border border-red-500/30'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-mono text-gray-500">
                      <span>{prob.subtopic}</span>
                      <span>•</span>
                      <span>15 Points</span>
                      <span>•</span>
                      <span className="text-arena-neonGreen">94% AI Pass Rate</span>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed pt-1 line-clamp-2">
                      {prob.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleStartBattle(prob.id)}
                    className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-arena-neonCyan to-arena-neonPurple hover:brightness-110 text-black font-mono font-bold text-xs shrink-0 transition hover:scale-105 shadow-xl glow-cyan"
                  >
                    <Swords className="w-4 h-4" />
                    <span>Battle on This</span>
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
}