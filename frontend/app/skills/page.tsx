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
  { id: 'Ruby', name: 'Ruby', icon: Zap, count: 20, desc: 'Blocks, Enumerable Methods, Hashes, Procs & Metaprogramming' },
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

  const handleStartBattle = (problemId: string) => {
    const randomRoomId = 'battle-' + Math.random().toString(36).substring(2, 8);
    router.push(`/battle/${randomRoomId}?problem=${problemId}`);
  };

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
    <div className="max-w-7xl mx-auto px-4 py-8 text-left bg-[#0F1115] text-[#CBD5E1]">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#2A2F38]">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-[#171A21] border border-[#2A2F38] text-[#94A3B8] text-[11px] font-mono mb-2 transition-colors duration-150 hover:border-[#3B82F6]/40">
            <span>15 Practice Domains • 300+ Problems</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F1F5F9]">
            {selectedTopic ? selectedTopic : 'Practice Skills & Domains'}
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5 font-mono">
            {selectedTopic 
              ? `Select any challenge in ${selectedTopic} to launch a 1v1 battle.`
              : 'Choose a programming language, data structure, or algorithmic field.'
            }
          </p>
        </div>

        {selectedTopic && (
          <button
            onClick={() => { setSelectedTopic(null); setSelectedSubdomain('All'); }}
            className="bg-[#171A21] hover:bg-[#1E232B] border border-[#2A2F38] hover:border-[#3B82F6] text-[#CBD5E1] px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-150 ease-out active:scale-95 flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>All Domains</span>
          </button>
        )}
      </div>

      {/* 1. ALL 15 DOMAINS GRID (1-2px lift on hover) */}
      {!selectedTopic ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                className="bg-[#171A21] border border-[#2A2F38] hover:border-[#3B82F6] p-4 rounded-xl cursor-pointer flex flex-col justify-between transition-all duration-200 ease-out hover:-translate-y-[2px] active:translate-y-0 group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="p-1.5 rounded-md bg-[#0F1115] border border-[#2A2F38] text-[#3B82F6] transition-transform duration-200 group-hover:scale-105">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0F1115] text-[#94A3B8] border border-[#2A2F38]">
                      {count} Problems
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#F1F5F9] group-hover:text-[#3B82F6] transition-colors duration-150">
                    {topic.name}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2 leading-relaxed">
                    {topic.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#2A2F38] flex items-center justify-between text-[11px] font-mono text-[#94A3B8] group-hover:text-[#3B82F6] transition-colors duration-150">
                  <span>Explore 20 Problems</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (

        /* 2. PROBLEMS LIST & FILTERS */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar Filter */}
          <div className="space-y-4">
            
            {/* Search */}
            <div className="relative font-mono">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-[#171A21] border border-[#2A2F38] rounded-lg text-xs text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/20 transition-all duration-150"
              />
            </div>

            {/* Subdomain Filter */}
            <div className="bg-[#171A21] border border-[#2A2F38] rounded-xl p-3.5 shadow-sm">
              <h4 className="text-[11px] font-mono font-bold uppercase text-[#94A3B8] mb-2.5">Subdomains</h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedSubdomain('All')}
                  className={`w-full text-left px-2.5 py-1 rounded text-xs font-mono transition-all duration-150 ease-out active:scale-95 ${
                    selectedSubdomain === 'All'
                      ? 'bg-[#0F1115] text-[#3B82F6] border border-[#2A2F38] font-semibold'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0F1115]/50'
                  }`}
                >
                  All Subdomains
                </button>
                {availableSubdomains.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubdomain(sub)}
                    className={`w-full text-left px-2.5 py-1 rounded text-xs font-mono transition-all duration-150 ease-out active:scale-95 truncate ${
                      selectedSubdomain === sub
                        ? 'bg-[#0F1115] text-[#3B82F6] border border-[#2A2F38] font-semibold'
                        : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0F1115]/50'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="bg-[#171A21] border border-[#2A2F38] rounded-xl p-3.5 shadow-sm">
              <h4 className="text-[11px] font-mono font-bold uppercase text-[#94A3B8] mb-2.5">Difficulty</h4>
              <div className="space-y-1">
                {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`w-full text-left px-2.5 py-1 rounded text-xs font-mono transition-all duration-150 ease-out active:scale-95 ${
                      selectedDifficulty === diff
                        ? 'bg-[#0F1115] text-[#3B82F6] border border-[#2A2F38] font-semibold'
                        : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#0F1115]/50'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Problems List */}
          <div className="lg:col-span-3 space-y-2.5">
            {activeProblems.length === 0 ? (
              <div className="bg-[#171A21] border border-[#2A2F38] rounded-xl p-8 text-center text-[#94A3B8] font-mono text-xs">
                No challenges found matching your filters.
              </div>
            ) : (
              activeProblems.map((prob) => (
                <div
                  key={prob.id}
                  className="bg-[#171A21] border border-[#2A2F38] hover:border-[#3B82F6] p-4 rounded-xl transition-all duration-150 ease-out hover:-translate-y-[1px] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 text-left">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-semibold text-[#F1F5F9] group-hover:text-[#3B82F6] transition-colors duration-150">
                        {prob.title}
                      </h3>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                        prob.difficulty === 'Easy'
                          ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30'
                          : prob.difficulty === 'Medium'
                          ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30'
                          : 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </div>

                    <p className="text-xs text-[#94A3B8] line-clamp-1">
                      {prob.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleStartBattle(prob.id)}
                    className="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-3.5 py-1.5 rounded-lg font-mono font-medium text-xs shrink-0 transition-all duration-150 ease-out hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <span>Battle</span>
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