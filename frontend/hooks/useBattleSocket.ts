"use client";

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Reaction } from '@/components/FloatingReactions';
import { sfx } from '@/utils/soundEffects';

export interface Player {
  id: string;
  slot: 'player1' | 'player2';
  walletAddress: string;
  ready: boolean;
  code: string;
  language: string;
  submitted: boolean;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  starterCode: string;
  examples: { input: string; output: string }[];
}

export interface CommentaryMessage {
  text: string;
  timestamp: number;
  isTactical?: boolean;
}

export function getStarterTemplate(problem: Problem | null, lang: string): string {
  if (!problem) return '';
  const funcName = problem.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');

  switch (lang) {
    case 'c':
      return `#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n#include <string.h>\n\n// Write your ${problem.title} solution in C\nint* ${funcName}(int* nums, int numsSize, int target, int* returnSize) {\n    *returnSize = 0;\n    return NULL;\n}\n`;
    case 'cpp':
      return `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your ${problem.title} solution in C++\n};\n`;
    case 'python':
      return `def ${funcName}(*args):\n    # Write your ${problem.title} solution in Python 3\n    pass\n`;
    case 'java':
      return `import java.util.*;\n\nclass Solution {\n    // Write your ${problem.title} solution in Java\n}\n`;
    case 'typescript':
      return `function ${funcName}(...args: any[]): any {\n  // Write your ${problem.title} solution in TypeScript\n}\n`;
    case 'javascript':
    default:
      return problem.starterCode;
  }
}

export function useBattleSocket(roomId: string, walletAddress?: string, requestedRole?: string) {
  const [socketId, setSocketId] = useState<string>('');
  const [isSpectator, setIsSpectator] = useState<boolean>(requestedRole === 'spectator');
  const [spectatorCount, setSpectatorCount] = useState<number>(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [battleState, setBattleState] = useState<'waiting' | 'in-progress' | 'judging' | 'completed'>('waiting');

  const [myLanguage, setMyLanguageState] = useState<string>('c');
  const [opponentLanguage, setOpponentLanguage] = useState<string>('c');

  const [myCode, setMyCode] = useState<string>('');
  const [opponentCode, setOpponentCode] = useState<string>('');
  const [commentary, setCommentary] = useState<CommentaryMessage[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [result, setResult] = useState<any>(null);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    const socket: Socket = io(socketUrl);
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketId(socket.id || '');
      socket.emit('join_room', { roomId, walletAddress, language: myLanguage, role: requestedRole });
    });

    socket.on('spectator_joined', () => {
      setIsSpectator(true);
    });

    socket.on('room_state', (data) => {
      setPlayers(data.players || []);
      setProblem(data.problem || null);
      setSpectatorCount(data.spectatorCount || 0);
      setBattleState(data.battleState || 'waiting');
      if (data.result) setResult(data.result);

      if (data.problem && !myCode) {
        setMyCode(getStarterTemplate(data.problem, myLanguage));
        setOpponentCode(getStarterTemplate(data.problem, 'c'));
      }
    });

    socket.on('battle_start', (data) => {
      setProblem(data.problem);
      setMyCode(getStarterTemplate(data.problem, myLanguage));
      setOpponentCode(getStarterTemplate(data.problem, opponentLanguage));
      setBattleState('in-progress');
      sfx.playFightStart(); // 🥊 Play Arcade Fight Siren!
    });

    socket.on('opponent_code_update', (data) => {
      setOpponentCode(data.code);
    });

    socket.on('opponent_language_update', (data) => {
      setOpponentLanguage(data.language);
    });

    // Standard Public Commentary
    socket.on('ai_commentary', (message: CommentaryMessage) => {
      setCommentary((prev) => [...prev, { ...message, isTactical: false }]);
    });

    // 🔒 Secret Spectator-Only Grandmaster Tactical Commentary
    socket.on('spectator_tactical_commentary', (message: CommentaryMessage) => {
      setCommentary((prev) => [...prev, { ...message, isTactical: true }]);
    });

    // Floating Emoji Reactions
    socket.on('floating_reaction', (reaction: Reaction) => {
      setReactions((prev) => [...prev, reaction]);
    });

    socket.on('battle_judging_started', () => {
      setBattleState('judging');
    });

    socket.on('battle_completed', (data) => {
      setResult(data.result);
      setBattleState('completed');
      sfx.playVictory(); // 🏆 Play Victory Sound!
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, walletAddress, requestedRole]);

  const sendReady = () => {
    socketRef.current?.emit('player_ready', { roomId });
  };

  const setMyLanguage = (lang: string) => {
    setMyLanguageState(lang);
    if (problem) {
      setMyCode(getStarterTemplate(problem, lang));
    }
    socketRef.current?.emit('language_change', { roomId, language: lang });
  };

  const sendCodeUpdate = (code: string) => {
    setMyCode(code);
    socketRef.current?.emit('code_update', { roomId, code, language: myLanguage });
  };

  const submitCode = () => {
    sfx.playSubmitSound(); // 🔒 Play Submit Chime
    socketRef.current?.emit('submit_code', { roomId, code: myCode, language: myLanguage });
  };

  const sendReaction = (emoji: string) => {
    socketRef.current?.emit('send_reaction', { roomId, emoji });
  };

  return {
    socketId,
    isSpectator,
    spectatorCount,
    players,
    problem,
    battleState,
    myLanguage,
    opponentLanguage,
    setMyLanguage,
    myCode,
    opponentCode,
    commentary,
    reactions,
    result,
    sendReady,
    sendCodeUpdate,
    submitCode,
    sendReaction,
  };
}