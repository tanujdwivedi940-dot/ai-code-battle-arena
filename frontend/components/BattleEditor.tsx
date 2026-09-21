"use client";

import { useState, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Lock, CheckCircle2, ChevronDown, ShieldAlert, EyeOff, ShieldBan, AlertOctagon } from 'lucide-react';
import { sfx } from '@/utils/soundEffects';

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
  isBlurred?: boolean;
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
  isBlurred = false,
  accentColor = 'cyan',
}: BattleEditorProps) {
  const isCyan = accentColor === 'cyan';
  const [mechSwitch, setMechSwitch] = useState<'thock' | 'clicky' | 'linear' | 'off'>('thock');
  const [showPasteAlert, setShowPasteAlert] = useState(false);
  const alertTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 🚫 Trigger Anti-Paste Warning & Sound
  const triggerPasteWarning = () => {
    sfx.playBuzzer();
    setShowPasteAlert(true);
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    alertTimerRef.current = setTimeout(() => setShowPasteAlert(false), 2800);
  };

  const handleEditorChange = (val: string | undefined) => {
    const text = val || '';
    if (!readOnly && !isSubmitted) {
      sfx.playMechKeyClick(mechSwitch);
    }
    onChange?.(text);
  };

  // 🛡️ Intercept Keyboard Shortcuts (Ctrl+V, Cmd+V, Shift+Insert) inside Monaco
  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.onKeyDown((e) => {
      // Detect Ctrl+V or Cmd+V (Mac) or Shift+Insert
      const isCtrlOrMetaV = (e.ctrlKey || e.metaKey) && e.keyCode === monaco.KeyCode.KeyV;
      const isShiftInsert = e.shiftKey && e.keyCode === monaco.KeyCode.Insert;

      if (isCtrlOrMetaV || isShiftInsert) {
        e.preventDefault();
        e.stopPropagation();
        triggerPasteWarning();
      }
    });

    // Override Monaco internal paste action
    editor.addAction({
      id: 'block-paste-action',
      label: 'Paste is Disabled',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV,
        monaco.KeyMod.Shift | monaco.KeyCode.Insert,
      ],
      run: () => {
        triggerPasteWarning();
      },
    });
  };

  return (
    <div 
      onPaste={(e) => {
        e.preventDefault();
        triggerPasteWarning();
      }}
      onContextMenu={(e) => {
        // Disables right-click inside the editor container
        e.preventDefault();
      }}
      className={`flex flex-col h-[530px] rounded-2xl bg-arena-card border ${isCyan ? 'border-arena-neonCyan/40 glow-cyan' : 'border-arena-neonPurple/40 glow-purple'} overflow-hidden shadow-2xl transition-all relative select-none`}
    >
      
      {/* Editor Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-arena-bg border-b border-arena-border">
        <div className="flex items-center space-x-2 font-mono text-xs">
          <div className={`w-2.5 h-2.5 rounded-full ${isCyan ? 'bg-arena-neonCyan' : 'bg-arena-neonPurple'}`} />
          <span className="font-bold text-gray-200">{title}</span>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Mechanical Keyboard Switch Selector */}
          {!readOnly && !isSubmitted && (
            <div className="flex items-center space-x-1 bg-arena-card border border-arena-border px-2 py-0.5 rounded-lg text-[10px] font-mono text-gray-400">
              <span>⌨️</span>
              <select
                value={mechSwitch}
                onChange={(e) => setMechSwitch(e.target.value as any)}
                className="bg-transparent text-arena-neonCyan focus:outline-none cursor-pointer"
              >
                <option value="thock" className="bg-arena-card">Thock Switch</option>
                <option value="clicky" className="bg-arena-card">Blue Clicky</option>
                <option value="linear" className="bg-arena-card">Red Linear</option>
                <option value="off" className="bg-arena-card">Mute Keys</option>
              </select>
            </div>
          )}

          {isBlurred && (
            <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded bg-arena-neonPurple/20 text-arena-neonPurple border border-arena-neonPurple/30 font-bold">
              <EyeOff className="w-3 h-3" />
              <span>ANTI-CHEAT</span>
            </span>
          )}

          {isSubmitted && (
            <span className="inline-flex items-center space-x-1 text-[11px] font-mono px-2 py-0.5 rounded bg-arena-neonGreen/20 text-arena-neonGreen border border-arena-neonGreen/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SUBMITTED</span>
            </span>
          )}

          {/* Language Selector */}
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

      {/* Monaco Code Area */}
      <div className="flex-1 relative overflow-hidden">
        
        {/* 🚨 Red Flash Anti-Cheat Warning Toast */}
        {showPasteAlert && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-arena-neonRed/90 border border-red-400 text-white font-mono text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 animate-bounce glow-red">
            <ShieldBan className="w-4 h-4 text-white shrink-0" />
            <span className="font-bold">ANTI-CHEAT ALERT: Copy/Paste is disabled in 1v1 Battles! Type your solution.</span>
          </div>
        )}

        <div className={`h-full ${isBlurred ? 'filter blur-[7px] select-none pointer-events-none opacity-30 transition-all duration-500' : ''}`}>
          <Editor
            height="100%"
            language={SUPPORTED_LANGUAGES.find((l) => l.id === language)?.monaco || 'c'}
            theme="vs-dark"
            value={code}
            onMount={handleEditorMount}
            onChange={handleEditorChange}
            options={{
              readOnly: readOnly || isSubmitted || isBlurred,
              contextmenu: false, // 🚫 Disables Monaco right-click context menu
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              fontFamily: "'Fira Code', 'Courier New', monospace",
              formatOnPaste: false,
              padding: { top: 12 },
            }}
          />
        </div>

        {/* Fog of War Overlay */}
        {isBlurred && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-20 pointer-events-none select-none">
            <div className="p-3.5 rounded-2xl bg-arena-card/90 border border-arena-neonPurple/60 text-arena-neonPurple glow-purple mb-3 animate-pulse shadow-2xl">
              <ShieldAlert className="w-8 h-8 mx-auto text-arena-neonPurple" />
            </div>
            <h4 className="font-mono font-bold text-gray-100 text-sm tracking-wider uppercase mb-1">
              Fog of War Anti-Cheat Active
            </h4>
            <p className="text-[11px] font-mono text-gray-400 max-w-xs leading-relaxed">
              Opponent code stream is obfuscated during live combat. Keystrokes & velocity stay synced.
            </p>
          </div>
        )}

        {/* Lock Overlay when Submitted */}
        {isSubmitted && !isBlurred && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none z-10">
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