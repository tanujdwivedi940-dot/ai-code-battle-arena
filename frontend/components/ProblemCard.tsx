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
    <div className="bg-cp-card border border-cp-border rounded-xl overflow-hidden mb-3 shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-cp-nav border-b border-cp-border">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-md bg-cp-card text-cp-blue border border-cp-border">
            <Code2 className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center space-x-2">
            <h2 className="font-bold text-cp-heading text-sm">{problem.title}</h2>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold uppercase ${
              problem.difficulty === 'Easy'
                ? 'bg-cp-success/10 text-cp-success border border-cp-success/30'
                : problem.difficulty === 'Medium'
                ? 'bg-cp-accent/10 text-cp-accent border border-cp-accent/30'
                : 'bg-cp-error/10 text-cp-error border border-cp-error/30'
            }`}>
              {problem.difficulty}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Tab buttons */}
          <div className="flex rounded-md bg-cp-bg p-0.5 border border-cp-border">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-2.5 py-0.5 text-xs font-mono rounded transition flex items-center space-x-1 ${
                activeTab === 'description'
                  ? 'bg-cp-card text-cp-blue font-semibold'
                  : 'text-cp-muted hover:text-cp-heading'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>Problem</span>
            </button>
            <button
              onClick={() => setActiveTab('examples')}
              className={`px-2.5 py-0.5 text-xs font-mono rounded transition flex items-center space-x-1 ${
                activeTab === 'examples'
                  ? 'bg-cp-card text-cp-blue font-semibold'
                  : 'text-cp-muted hover:text-cp-heading'
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span>Examples ({problem.examples?.length || 0})</span>
            </button>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded text-cp-muted hover:text-cp-heading hover:bg-cp-bg transition"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Body content */}
      {!isCollapsed && (
        <div className="p-3.5 max-h-52 overflow-y-auto text-xs text-cp-text leading-relaxed font-sans text-left">
          {activeTab === 'description' ? (
            <div className="space-y-1.5 whitespace-pre-line font-mono text-xs leading-relaxed text-cp-text">
              {problem.description}
            </div>
          ) : (
            <div className="space-y-2 font-mono text-xs">
              {problem.examples && problem.examples.length > 0 ? (
                problem.examples.map((ex: any, idx: number) => (
                  <div key={idx} className="bg-cp-bg border border-cp-border rounded-lg p-2.5 space-y-1">
                    <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-cp-muted border-b border-cp-border pb-1">
                      <CheckCircle2 className="w-3 h-3 text-cp-blue" />
                      <span>Example {idx + 1}:</span>
                    </div>
                    <div>
                      <span className="text-cp-blue font-semibold">Input: </span>
                      <span className="text-cp-heading">{ex.input}</span>
                    </div>
                    <div>
                      <span className="text-cp-success font-semibold">Output: </span>
                      <span className="text-cp-heading">{ex.output}</span>
                    </div>
                    {ex.explanation && (
                      <div className="text-cp-muted text-[11px] pt-0.5">
                        <span className="text-cp-accent font-semibold">Explanation: </span>
                        <span>{ex.explanation}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-cp-muted italic">No examples provided.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}