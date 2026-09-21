"use client";

import { useState } from 'react';
import { Problem } from '@/hooks/useBattleSocket';
import { Code2, Terminal, ChevronDown, ChevronUp, FileText, CheckCircle2 } from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
}

export default function ProblemCard({ problem }: ProblemCardProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'examples'>('description');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-arena-card border border-arena-border rounded-2xl overflow-hidden mb-4 shadow-xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-arena-bg/80 border-b border-arena-border">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-arena-neonCyan/10 text-arena-neonCyan border border-arena-neonCyan/30">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-gray-100 text-base">{problem.title}</h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                problem.difficulty === 'Easy'
                  ? 'bg-emerald-500/15 text-arena-neonGreen border border-emerald-500/30'
                  : problem.difficulty === 'Medium'
                  ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                  : 'bg-red-500/15 text-arena-neonRed border border-red-500/30'
              }`}>
                {problem.difficulty}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Tab buttons */}
          <div className="flex rounded-lg bg-arena-card p-1 border border-arena-border">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-3 py-1 text-xs font-mono rounded-md transition flex items-center space-x-1.5 ${
                activeTab === 'description'
                  ? 'bg-arena-neonCyan/20 text-arena-neonCyan font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Problem</span>
            </button>
            <button
              onClick={() => setActiveTab('examples')}
              className={`px-3 py-1 text-xs font-mono rounded-md transition flex items-center space-x-1.5 ${
                activeTab === 'examples'
                  ? 'bg-arena-neonPurple/20 text-arena-neonPurple font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Examples ({problem.examples?.length || 0})</span>
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
        <div className="p-5 max-h-64 overflow-y-auto text-sm text-gray-300 leading-relaxed font-sans text-left">
          {activeTab === 'description' ? (
            <div className="space-y-2 whitespace-pre-line font-mono text-xs leading-relaxed text-gray-200">
              {problem.description}
            </div>
          ) : (
            <div className="space-y-3 font-mono text-xs">
              {problem.examples && problem.examples.length > 0 ? (
                problem.examples.map((ex: any, idx: number) => (
                  <div key={idx} className="bg-arena-bg border border-arena-border rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center space-x-2 text-[11px] font-bold text-gray-400 border-b border-arena-border/50 pb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-arena-neonCyan" />
                      <span>Example {idx + 1}:</span>
                    </div>
                    <div>
                      <span className="text-arena-neonCyan font-bold">Input: </span>
                      <span className="text-gray-200">{ex.input}</span>
                    </div>
                    <div>
                      <span className="text-arena-neonGreen font-bold">Output: </span>
                      <span className="text-gray-200">{ex.output}</span>
                    </div>
                    {ex.explanation && (
                      <div className="text-gray-400 text-[11px] pt-1">
                        <span className="text-yellow-400 font-bold">Explanation: </span>
                        <span>{ex.explanation}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic">No examples provided.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 