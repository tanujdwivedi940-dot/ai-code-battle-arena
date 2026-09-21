"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Reaction } from '@/components/FloatingReactions';
import { sfx } from '@/utils/soundEffects';

export interface Player {
  id: string;
  slot: 'player1' | 'player2';
  walletAddress: string;
  ready: boolean;
  staked?: boolean;
  isBot?: boolean;
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
  const titleLower = (problem.title || '').toLowerCase();
  const idLower = (problem.id || '').toLowerCase();
  const funcName = problem.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');

  if (lang === 'c') {
    if (titleLower.includes('binary search') || idLower.includes('binary-search')) {
      return `#include <stdio.h>\n#include <stdlib.h>\n\n// Problem: Binary Search\nint search(int* nums, int numsSize, int target) {\n    int left = 0;\n    int right = numsSize - 1;\n    // Write your O(log n) binary search in C\n    \n    return -1;\n}\n`;
    }
    if (titleLower.includes('parentheses') || titleLower.includes('valid')) {
      return `#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n#include <string.h>\n\n// Problem: ${problem.title}\nbool isValid(char* s) {\n    // Write your solution in C\n    return false;\n}\n`;
    }
    if (titleLower.includes('list') || titleLower.includes('linked')) {
      return `#include <stdio.h>\n#include <stdlib.h>\n\nstruct ListNode {\n    int val;\n    struct ListNode *next;\n};\n\nstruct ListNode* reverseList(struct ListNode* head) {\n    // Write your solution in C\n    return NULL;\n}\n`;
    }
    return `#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n\nint* solution(int* nums, int numsSize, int* returnSize) {\n    *returnSize = 0;\n    return NULL;\n}\n`;
  }

  if (lang === 'python') {
    return `class Solution:\n    def ${funcName}(self, *args):\n        # Write your ${problem.title} solution in Python 3\n        pass\n`;
  }

  if (lang === 'java') {
    if (titleLower.includes('binary search') || idLower.includes('binary-search')) {
      return `class Solution {\n    public int search(int[] nums, int target) {\n        // Write your Java solution here\n        return -1;\n    }\n}\n`;
    }
    return `import java.util.*;\n\nclass Solution {\n    public void solve() {\n        // Write your Java solution here\n    }\n}\n`;
  }

  if (lang === 'cpp') {
    if (titleLower.includes('binary search') || idLower.includes('binary-search')) {
      return `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your C++ solution\n        return -1;\n    }\n};\n`;
    }
    return `#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution\n};\n`;
  }

  return problem.starterCode || `function ${funcName}(...args) {\n  // Write your solution here\n\n}`;
}

export function useBattleSocket(
  roomId: string,
  walletAddress?: string,
  requestedRole?: string,
  problemId?: string
) {
  const [socketId, setSocketId] = useState<string>('');
  const [isSpectator, setIsSpectator] = useState<boolean>(requestedRole === 'spectator');
  const [spectatorCount, setSpectatorCount] = useState<number>(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [battleState, setBattleState] = useState<'waiting' | 'in-progress' | 'judging' | 'completed'>('waiting');
  const [persona, setPersonaState] = useState<string>('esports');
  const [durationSeconds, setDurationSeconds] = useState<number>(300);
  const [stakeAmount, setStakeAmountState] = useState<string>('0.005');
  const [isOptimisticallySubmitted, setIsOptimisticallySubmitted] = useState<boolean>(false);

  const [myLanguage, setMyLanguageState] = useState<string>('c');
  const [opponentLanguage, setOpponentLanguage] = useState<string>('c');

  const [myCode, setMyCode] = useState<string>('');
  const [opponentCode, setOpponentCode] = useState<string>('');
  const [commentary, setCommentary] = useState<CommentaryMessage[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [result, setResult] = useState<any>(null);

  const myCodeRef = useRef<string>('');
  const myLanguageRef = useRef<string>('c');
  const socketRef = useRef<Socket | null>(null);
  const initializedRef = useRef<boolean>(false);

  useEffect(() => {
    myLanguageRef.current = myLanguage;
  }, [myLanguage]);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    const socket: Socket = io(socketUrl);
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketId(socket.id || '');
      const initialTemplate = problem ? getStarterTemplate(problem, myLanguageRef.current) : '';
      socket.emit('join_room', {
        roomId,
        walletAddress,
        language: myLanguageRef.current,
        role: requestedRole,
        problemId: problemId,
        persona: persona,
        starterCode: initialTemplate,
      });
    });

    socket.on('spectator_joined', () => setIsSpectator(true));

    socket.on('room_state', (data) => {
      setPlayers(data.players || []);
      setProblem(data.problem || null);
      setSpectatorCount(data.spectatorCount || 0);
      setBattleState(data.battleState || 'waiting');
      if (data.persona) setPersonaState(data.persona);
      if (data.durationSeconds !== undefined) setDurationSeconds(data.durationSeconds);
      if (data.stakeAmount) setStakeAmountState(data.stakeAmount);
      if (data.result) setResult(data.result);

      const isPlayerSeat = (data.players || []).some((p: Player) => p.id === socket.id);
      if (isPlayerSeat) setIsSpectator(false);

      if (data.problem && !initializedRef.current) {
        initializedRef.current = true;
        const initialTemplate = getStarterTemplate(data.problem, myLanguageRef.current);
        myCodeRef.current = initialTemplate;
        setMyCode(initialTemplate);
        setOpponentCode(getStarterTemplate(data.problem, 'c'));
      }
    });

    socket.on('duration_updated', (data) => setDurationSeconds(data.durationSeconds));
    socket.on('persona_updated', (data) => setPersonaState(data.persona));

    socket.on('battle_start', (data) => {
      setProblem(data.problem);
      if (data.durationSeconds !== undefined) setDurationSeconds(data.durationSeconds);
      if (data.stakeAmount) setStakeAmountState(data.stakeAmount);
      setBattleState('in-progress');
      setIsOptimisticallySubmitted(false);
      sfx.playFightStart();
      sfx.startBattleMusic(100);
    });

    socket.on('opponent_code_update', (data) => setOpponentCode(data.code));
    socket.on('opponent_language_update', (data) => setOpponentLanguage(data.language));

    socket.on('ai_commentary', (message: CommentaryMessage) => {
      setCommentary((prev) => [...prev, { ...message, isTactical: false }]);
    });

    socket.on('spectator_tactical_commentary', (message: CommentaryMessage) => {
      setCommentary((prev) => [...prev, { ...message, isTactical: true }]);
    });

    socket.on('floating_reaction', (reaction: Reaction) => {
      setReactions((prev) => [...prev, reaction]);
    });

    socket.on('battle_judging_started', () => {
      setBattleState('judging');
      sfx.stopBattleMusic();
    });

    socket.on('battle_completed', (data) => {
      setResult(data.result);
      setBattleState('completed');
      sfx.stopBattleMusic();
    });

    return () => {
      sfx.stopBattleMusic();
      socket.disconnect();
    };
  }, [roomId, walletAddress, requestedRole, problemId, persona]);

  const sendReady = (isStaked = false) => {
    socketRef.current?.emit('player_ready', { roomId, isStaked });
  };

  const setStakeTier = (amount: string) => {
    setStakeAmountState(amount);
    socketRef.current?.emit('set_stake', { roomId, stakeAmount: amount });
  };

  const setMatchDuration = (minutes: number) => {
    socketRef.current?.emit('set_duration', { roomId, durationMinutes: minutes });
  };

  const spawnBot = (difficulty: 'noob' | 'intermediate' | 'grandmaster') => {
    socketRef.current?.emit('spawn_bot', { roomId, difficulty });
  };

  const changePersona = (newPersona: string) => {
    setPersonaState(newPersona);
    socketRef.current?.emit('change_persona', { roomId, persona: newPersona });
  };

  const setMyLanguage = (lang: string) => {
    setMyLanguageState(lang);
    myLanguageRef.current = lang;
    if (problem) {
      const template = getStarterTemplate(problem, lang);
      myCodeRef.current = template;
      setMyCode(template);
      socketRef.current?.emit('code_update', { roomId, code: template, language: lang });
    }
    socketRef.current?.emit('language_change', { roomId, language: lang });
  };

  const sendCodeUpdate = useCallback((code: string) => {
    myCodeRef.current = code;
    setMyCode(code);
    socketRef.current?.emit('code_update', { roomId, code, language: myLanguageRef.current });
  }, [roomId]);

  // ⚡ Passes current starter template alongside submitted code
  const submitCode = useCallback(() => {
    const finalCode = myCodeRef.current || myCode;
    const currentStarter = problem ? getStarterTemplate(problem, myLanguageRef.current) : '';
    setIsOptimisticallySubmitted(true);
    sfx.playSubmitSound();
    socketRef.current?.emit('submit_code', {
      roomId,
      code: finalCode,
      language: myLanguageRef.current,
      starterCode: currentStarter,
    });
  }, [roomId, myCode, problem]);

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
    persona,
    durationSeconds,
    stakeAmount,
    myLanguage,
    opponentLanguage,
    isOptimisticallySubmitted,
    setStakeTier,
    setMatchDuration,
    setMyLanguage,
    myCode,
    opponentCode,
    commentary,
    reactions,
    result,
    sendReady,
    spawnBot,
    changePersona,
    sendCodeUpdate,
    submitCode,
    sendReaction,
  };
}