"use client";

import { useState } from 'react';
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
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  category: string;
  subdomain: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
}

const TOPICS = [
  { id: 'Data Structures', name: 'Data Structures', icon: Layers, count: 4, desc: 'Arrays, Linked Lists, Stacks, Queues, Heaps & Hash Maps' },
  { id: 'Algorithms', name: 'Algorithms', icon: Binary, count: 6, desc: 'Dynamic Programming, Two Pointers, Searching & Sorting' },
  { id: 'Strings & Hashing', name: 'Strings & Hashing', icon: Code2, count: 2, desc: 'Anagrams, Frequency Tables & String Processing' },
  { id: 'Mathematics', name: 'Mathematics', icon: Calculator, count: 1, desc: 'Number Theory, Palindromes & Math Logic' },
  { id: 'C & Low Level', name: 'C & Low Level', icon: Cpu, count: 2, desc: 'Pointers, Memory Manipulation & Array Searching' },
];

const ALL_PROBLEMS: Problem[] = [
  { id: 'two-sum', title: 'Two Sum', category: 'Data Structures', subdomain: 'Arrays & Hash Tables', difficulty: 'Easy', description: 'Find two indices in an array that add up to a target sum using constant time lookup.' },
  { id: 'reverse-linked-list', title: 'Reverse Linked List', category: 'Data Structures', subdomain: 'Linked Lists', difficulty: 'Easy', description: 'Reverse a singly linked list in-place and return the new head node.' },
  { id: 'valid-parentheses', title: 'Valid Parentheses', category: 'Data Structures', subdomain: 'Stacks & Queues', difficulty: 'Easy', description: 'Determine if an input bracket string has matching and valid closing order.' },
  { id: 'top-k-frequent-elements', title: 'Top K Frequent Elements', category: 'Data Structures', subdomain: 'Heaps & Hash Tables', difficulty: 'Medium', description: 'Return the k most frequent elements using bucket sort or a min-heap.' },
  { id: 'container-with-most-water', title: 'Container With Most Water', category: 'Algorithms', subdomain: 'Two Pointers', difficulty: 'Medium', description: 'Find two vertical lines that maximize the area of water trapped between them.' },
  { id: 'longest-substring-without-repeating-characters', title: 'Longest Substring Without Repeating Characters', category: 'Algorithms', subdomain: 'Sliding Window', difficulty: 'Medium', description: 'Calculate the length of the longest substring with unique characters.' },
  { id: 'binary-search', title: 'Binary Search', category: 'Algorithms', subdomain: 'Searching', difficulty: 'Easy', description: 'Search for target element in sorted array in strictly O(log n) time.' },
  { id: 'maximum-subarray', title: 'Maximum Subarray (Kadanes)', category: 'Algorithms', subdomain: 'Dynamic Programming', difficulty: 'Medium', description: 'Find contiguous subarray with maximum sum using Kadanes algorithm.' },
  { id: 'climbing-stairs', title: 'Climbing Stairs', category: 'Algorithms', subdomain: 'Dynamic Programming', difficulty: 'Easy', description: 'Find total distinct ways to climb n stairs taking 1 or 2 steps.' },
  { id: 'coin-change', title: 'Coin Change', category: 'Algorithms', subdomain: 'Dynamic Programming', difficulty: 'Medium', description: 'Calculate minimum coins required to make exact amount, or return -1.' },
  { id: 'valid-anagram', title: 'Valid Anagram', category: 'Strings & Hashing', subdomain: 'Strings', difficulty: 'Easy', description: 'Check if string t is an anagram permutation of string s.' },
  { id: 'group-anagrams', title: 'Group Anagrams', category: 'Strings & Hashing', subdomain: 'Hash Tables', difficulty: 'Medium', description: 'Group anagram strings together into separate sub-arrays.' },
  { id: 'palindrome-number', title: 'Palindrome Number', category: 'Mathematics', subdomain: 'Math & Logic', difficulty: 'Easy', description: 'Check if integer is a palindrome without converting to a string.' },
  { id: 'find-minimum-in-rotated-sorted-array', title: 'Find Minimum in Rotated Sorted Array', category: 'C & Low Level', subdomain: 'Pointers & Arrays', difficulty: 'Medium', description: 'Find minimum element in sorted rotated array in O(log n) time.' },
  { id: 'merge-intervals', title: 'Merge Intervals', category: 'Algorithms', subdomain: 'Intervals', difficulty: 'Medium', description: 'Merge all overlapping range intervals into a clean array.' },
];

export default function SkillsPage() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Start Battle on Specific Problem
  const handleStartBattle = (problemId: string) => {
    const randomRoomId = 'battle-' + Math.random().toString(36).substring(2, 8);
    router.push(`/battle/${randomRoomId}?problem=${problemId}`);
  };

  // Filter Problems
  const activeProblems = ALL_PROBLEMS.filter((p) => {
    const matchesTopic = !selectedTopic || p.category === selectedTopic;
    const matchesSubdomain = selectedSubdomain === 'All' || p.subdomain === selectedSubdomain;
    const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTopic && matchesSubdomain && matchesDifficulty && matchesSearch;
  });

  const availableSubdomains = Array.from(
    new Set(
      ALL_PROBLEMS.filter((p) => !selectedTopic || p.category === selectedTopic).map((p) => p.subdomain)
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-arena-border">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-arena-neonCyan/10 border border-arena-neonCyan/30 text-arena-neonCyan text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HACKERRANK-STYLE SKILL ARENA</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-100">
            {selectedTopic ? selectedTopic : 'Practice Skills & Battle Topics'}
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-mono">
            {selectedTopic 
              ? `Select a challenge in ${selectedTopic} to launch an instant 1v1 battle arena!`
              : 'Choose a skill domain or algorithmic category to compete in.'
            }
          </p>
        </div>

        {selectedTopic && (
          <button
            onClick={() => { setSelectedTopic(null); setSelectedSubdomain('All'); }}
            className="flex items-center space-x-2 px-4 py-2 bg-arena-card border border-arena-border hover:border-arena-neonCyan rounded-xl text-xs font-mono text-gray-300 transition"
          >
            <ArrowLeft className="w-4 h-4 text-arena-neonCyan" />
            <span>All Topics</span>
          </button>
        )}
      </div>

      {/* 1. TOPIC GRID VIEW (When No Topic is Selected) */}
      {!selectedTopic ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOPICS.map((topic) => {
            const Icon = topic.icon;
            return (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className="bg-arena-card border border-arena-border hover:border-arena-neonCyan/70 rounded-2xl p-6 transition duration-200 cursor-pointer group shadow-xl hover:scale-[1.02] relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-arena-neonCyan/10 text-arena-neonCyan border border-arena-neonCyan/30 group-hover:scale-110 transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-gray-800 text-gray-400 border border-gray-700">
                    {topic.count} Challenges
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-100 group-hover:text-arena-neonCyan transition">
                  {topic.name}
                </h3>
                <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                  {topic.desc}
                </p>

                <div className="mt-6 pt-4 border-t border-arena-border flex items-center justify-between text-xs font-mono text-arena-neonCyan">
                  <span>Explore Problems</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (

        /* 2. PROBLEMS LIST & SIDEBAR FILTERS (When A Topic is Clicked) */
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
                          : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-mono text-gray-500">
                      <span>{prob.subdomain}</span>
                      <span>•</span>
                      <span>15 Points</span>
                      <span>•</span>
                      <span className="text-arena-neonGreen">94% AI Pass Rate</span>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed pt-1">
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