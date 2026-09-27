"use client";

import { useState, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Lock, CheckCircle2, ChevronDown, ShieldAlert, EyeOff, ShieldBan } from 'lucide-react';
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
}: BattleEditorProps) {
  const [mechSwitch, setMechSwitch] = useState<'thock' | 'clicky' | 'linear' | 'off'>('thock');
  const [showPasteAlert, setShowPasteAlert] = useState(false);
  const alertTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerPasteWarning = () => {
    sfx.playBuzzer();
    setShowPasteAlert(true);
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    alertTimerRef.current = setTimeout(() => setShowPasteAlert(false), 2500);
  };

  const handleEditorChange = (val: string | undefined) => {
    const text = val || '';
    if (!readOnly && !isSubmitted) {
      sfx.playMechKeyClick(mechSwitch);
    }
    onChange?.(text);
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.onKeyDown((e) => {
      const isCtrlOrMetaV = (e.ctrlKey || e.metaKey) && e.keyCode === monaco.KeyCode.KeyV;
      const isShiftInsert = e.shiftKey && e.keyCode === monaco.KeyCode.Insert;

      if (isCtrlOrMetaV || isShiftInsert) {
        e.preventDefault();
        e.stopPropagation();
        triggerPasteWarning();
      }
    });

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
        e.preventDefault();
      }}
      className="flex flex-col h-[480px] sm:h-[500px] rounded-xl bg-cp-card border border-cp-border overflow-hidden relative select-none shadow-sm"
    >
      {/* Editor Top Toolbar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-cp-nav border-b border-cp-border">
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-cp-blue" />
          <span className="font-semibold text-cp-heading truncate max-w-[200px]">{title}</span>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Mechanical Keyboard Selector */}
          {!readOnly && !isSubmitted && (
            <div className="flex items-center space-x-1 bg-cp-bg border border-cp-border px-2 py-0.5 rounded text-[10px] font-mono text-cp-muted">
              <span>⌨️</span>
              <select
                value={mechSwitch}
                onChange={(e) => setMechSwitch(e.target.value as any)}
                className="bg-transparent text-cp-text focus:outline-none cursor-pointer"
              >
                <option value="thock" className="bg-cp-card">Thock</option>
                <option value="clicky" className="bg-cp-card">Clicky</option>
                <option value="linear" className="bg-cp-card">Linear</option>
                <option value="off" className="bg-cp-card">Mute</option>
              </select>
            </div>
          )}

          {isBlurred && (
            <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded bg-cp-card text-cp-muted border border-cp-border">
              <EyeOff className="w-3 h-3 text-cp-accent" />
              <span>ANTI-CHEAT</span>
            </span>
          )}

          {isSubmitted && (
            <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded bg-cp-success/10 text-cp-success border border-cp-success/30">
              <CheckCircle2 className="w-3 h-3" />
              <span>SUBMITTED</span>
            </span>
          )}

          {/* Language Selector */}
          {!readOnly && !isSubmitted ? (
            <div className="relative">
              <select
                value={language}
                onChange={(e) => onLanguageChange?.(e.target.value)}
                className="appearance-none bg-cp-bg hover:bg-[#1E232B] border border-cp-border text-cp-text text-xs font-mono py-0.5 pl-2 pr-5 rounded focus:outline-none transition cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id} className="bg-cp-card text-cp-text">
                    {lang.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-cp-muted absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          ) : (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cp-bg border border-cp-border text-cp-muted uppercase font-bold">
              {SUPPORTED_LANGUAGES.find((l) => l.id === language)?.name || language}
            </span>
          )}
        </div>
      </div>

      {/* Monaco Code Area */}
      <div className="flex-1 relative overflow-hidden bg-cp-bg">
        
        {/* Anti-Paste Alert */}
        {showPasteAlert && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-cp-error text-white font-mono text-xs px-3 py-1.5 rounded-lg shadow-lg flex items-center space-x-2">
            <ShieldBan className="w-4 h-4 text-white shrink-0" />
            <span>Anti-Cheat Alert: Paste is disabled in 1v1 Battles.</span>
          </div>
        )}

        <div className={`h-full ${isBlurred ? 'filter blur-[7px] select-none pointer-events-none opacity-25' : ''}`}>
          <Editor
            height="100%"
            language={SUPPORTED_LANGUAGES.find((l) => l.id === language)?.monaco || 'c'}
            theme="vs-dark"
            value={code}
            onMount={handleEditorMount}
            onChange={handleEditorChange}
            options={{
              readOnly: readOnly || isSubmitted || isBlurred,
              contextmenu: false,
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              fontFamily: "'Fira Code', 'Courier New', monospace",
              formatOnPaste: false,
              padding: { top: 8 },
            }}
          />
        </div>

        {/* Fog of War Overlay */}
        {isBlurred && (
          <div className="absolute inset-0 bg-cp-bg/85 flex flex-col items-center justify-center p-4 text-center z-20 pointer-events-none select-none">
            <div className="p-2.5 rounded-xl bg-cp-card border border-cp-border text-cp-muted mb-2 shadow-sm">
              <ShieldAlert className="w-6 h-6 text-cp-accent" />
            </div>
            <h4 className="font-mono font-bold text-cp-heading text-xs uppercase tracking-wider mb-1">
              FOG OF WAR ANTI-CHEAT ACTIVE
            </h4>
            <p className="text-[11px] font-mono text-cp-muted max-w-xs leading-relaxed">
              Opponent code stream is obfuscated during live combat. Keystrokes & velocity stay synced.
            </p>
          </div>
        )}

        {/* Lock Overlay when Submitted */}
        {isSubmitted && !isBlurred && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none z-10">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cp-card border border-cp-border text-cp-text font-mono text-xs">
              <Lock className="w-3.5 h-3.5 text-cp-success" />
              <span>Solution locked for AI evaluation</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}