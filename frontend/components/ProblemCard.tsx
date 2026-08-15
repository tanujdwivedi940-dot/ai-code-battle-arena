"use client";

import { useState } from 'react';
import { Problem } from '@/hooks/useBattleSocket';
import { Code2, Terminal, ChevronDown, ChevronUp } from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
}

export default function ProblemCard({ problem }: ProblemCardProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'examples'>('description');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-arena-card border border-arena-border rounded-2xl overflow-hidden mb-4 shadow-lg">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-arena-bg/80 border-b border-arena-border">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-arena-neonCyan/10 text-arena-neonCyan border border-arena-neonCyan/30">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-gray-100 text-base">{problem.title}</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
              {problem.difficulty}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Tab buttons */}
          <div className="flex rounded-lg bg-arena-card p-1 border border-arena-border">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-3 py-1 text-xs font-mono rounded-md transition ${
                activeTab === 'description'
                  ? 'bg-arena-neonCyan/20 text-arena-neonCyan font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Problem
            </button>
            <button
              onClick={() => setActiveTab('examples')}
              className={`px-3 py-1 text-xs font-mono rounded-md transition ${
                activeTab === 'examples'
                  ? 'bg-arena-neonPurple/20 text-arena-neonPurple font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Examples ({problem.examples?.length || 0})
            </button>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-arena-border transition"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Body content */}
      {!isCollapsed && (
        <div className="p-5 max-h-56 overflow-y-auto text-sm text-gray-300 font-sans leading-relaxed">
          {activeTab === 'description' ? (
            <p className="whitespace-pre-line">{problem.description}</p>
          ) : (
            <div className="space-y-3">
              {problem.examples?.map((ex, idx) => (
                <div key={idx} className="bg-arena-bg border border-arena-border rounded-xl p-3 font-mono text-xs">
                  <div className="text-gray-400">
                    <span className="text-arena-neonCyan font-bold">Input:</span> {ex.input}
                  </div>
                  <div className="text-gray-300 mt-1">
                    <span className="text-arena-neonGreen font-bold">Output:</span> {ex.output}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}