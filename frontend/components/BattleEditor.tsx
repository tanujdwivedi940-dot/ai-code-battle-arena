"use client";

import Editor from '@monaco-editor/react';
import { Lock, CheckCircle2, ChevronDown } from 'lucide-react';

export const SUPPORTED_LANGUAGES = [
  { id: 'c', name: 'C', monaco: 'c' },
  { id: 'cpp', name: 'C++ 20', monaco: 'cpp' },
  { id: 'python', name: 'Python 3', monaco: 'python' },
  { id: 'javascript', name: 'JavaScript', monaco: 'javascript' },
  { id: 'typescript', name: 'TypeScript', monaco: 'typescript' },
  { id: 'java', name: 'Java', monaco: 'java' },
];

interface BattleEditorProps {
  title: string;
  code: string;
  language?: string;
  onLanguageChange?: (lang: string) => void;
  onChange?: (code: string) => void;
  readOnly?: boolean;
  isSubmitted?: boolean;
  accentColor?: 'cyan' | 'purple';
}

export default function BattleEditor({
  title,
  code,
  language = 'c',
  onLanguageChange,
  onChange,
  readOnly = false,
  isSubmitted = false,
  accentColor = 'cyan',
}: BattleEditorProps) {
  const isCyan = accentColor === 'cyan';

  return (
    <div className={`flex flex-col h-[530px] rounded-2xl bg-arena-card border ${isCyan ? 'border-arena-neonCyan/40 glow-cyan' : 'border-arena-neonPurple/40 glow-purple'} overflow-hidden shadow-2xl transition-all`}>
      {/* Editor top toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-arena-bg border-b border-arena-border">
        <div className="flex items-center space-x-2 font-mono text-xs">
          <div className={`w-2.5 h-2.5 rounded-full ${isCyan ? 'bg-arena-neonCyan' : 'bg-arena-neonPurple'}`} />
          <span className="font-bold text-gray-200">{title}</span>
        </div>

        <div className="flex items-center space-x-3">
          {isSubmitted && (
            <span className="inline-flex items-center space-x-1 text-[11px] font-mono px-2 py-0.5 rounded bg-arena-neonGreen/20 text-arena-neonGreen border border-arena-neonGreen/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SUBMITTED</span>
            </span>
          )}
          {readOnly && (
            <span className="inline-flex items-center space-x-1 text-[11px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
              <Lock className="w-3 h-3" />
              <span>LOCKED</span>
            </span>
          )}

          {/* Language Selector Dropdown */}
          {!readOnly && !isSubmitted ? (
            <div className="relative">
              <select
                value={language}
                onChange={(e) => onLanguageChange?.(e.target.value)}
                className="appearance-none bg-arena-card hover:bg-gray-800 border border-arena-border hover:border-arena-neonCyan text-arena-neonCyan text-xs font-mono py-1 pl-3 pr-7 rounded-lg focus:outline-none transition cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id} className="bg-arena-card text-gray-200">
                    {lang.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          ) : (
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-arena-card border border-arena-border text-arena-neonCyan uppercase font-bold">
              {SUPPORTED_LANGUAGES.find((l) => l.id === language)?.name || language}
            </span>
          )}
        </div>
      </div>

      {/* Monaco code area */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={SUPPORTED_LANGUAGES.find((l) => l.id === language)?.monaco || 'c'}
          theme="vs-dark"
          value={code}
          onChange={(val) => onChange?.(val || '')}
          options={{
            readOnly: readOnly || isSubmitted,
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            fontFamily: "'Fira Code', 'Courier New', monospace",
            formatOnPaste: true,
            padding: { top: 12 },
          }}
        />

        {/* Lock Overlay when submitted */}
        {isSubmitted && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-arena-card/90 border border-arena-border text-gray-300 font-mono text-sm shadow-2xl">
              <Lock className="w-4 h-4 text-arena-neonGreen" />
              <span>Solution locked for AI evaluation</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}