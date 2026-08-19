import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { judgeBattle } from '../services/geminiJudge.js';
import {
  generatePublicCommentary,
  generateSpectatorStrategicCommentary,
  detectCodeAction,
  analyzeStrategicFlaws,
} from '../services/geminiCommentary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const problemsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/problems.json'), 'utf-8')
);

const rooms = new Map();

// 🤖 Tiered Bot Solution Generator
function getBotCodeForProblem(problem, difficulty = 'intermediate') {
  const title = (problem.title || '').toLowerCase();
  const id = (problem.id || '').toLowerCase();

  // 1. Two Sum
  if (title.includes('two sum') || id.includes('two-sum')) {
    if (difficulty === 'noob') {
      return `// Noob Bot: O(N^2) Brute Force Nested Loop\nfunction twoSum(nums, target) {\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] + nums[j] === target) {\n        return [i, j];\n      }\n    }\n  }\n  return [];\n}`;
    }
    if (difficulty === 'intermediate') {
      return `// Cyber-Gemini: O(N) Two-Pass Hash Map with Object Table\nfunction twoSum(nums, target) {\n  const lookup = {};\n  for (let i = 0; i < nums.length; i++) {\n    lookup[nums[i]] = i;\n  }\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (lookup[complement] !== undefined && lookup[complement] !== i) {\n      return [i, lookup[complement]];\n    }\n  }\n  return [];\n}`;
    }
    return `// ⚡ Grandmaster AI: Optimal O(N) Single-Pass Hash Map\nfunction twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (seen.has(diff)) return [seen.get(diff), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}`;
  }

  // 2. Binary Search
  if (title.includes('binary search') || id.includes('binary-search')) {
    if (difficulty === 'noob') {
      return `// Noob Bot: O(N) Linear Search\nfunction search(nums, target) {\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] === target) return i;\n  }\n  return -1;\n}`;
    }
    if (difficulty === 'intermediate') {
      return `// Cyber-Gemini: O(log N) Recursive Search\nfunction search(nums, target) {\n  function binaryRec(left, right) {\n    if (left > right) return -1;\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] > target) return binaryRec(left, mid - 1);\n    return binaryRec(mid + 1, right);\n  }\n  return binaryRec(0, nums.length - 1);\n}`;
    }
    return `// ⚡ Grandmaster AI: Optimal O(log N) Time, O(1) Space\nfunction search(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = left + Math.floor((right - left) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`;
  }

  // 3. Valid Parentheses
  if (title.includes('parentheses') || id.includes('parentheses')) {
    if (difficulty === 'noob') {
      return `// Noob Bot: O(N^2) String Replacement\nfunction isValid(s) {\n  let prev = '';\n  while (s.length !== prev.length) {\n    prev = s;\n    s = s.replace('()', '').replace('[]', '').replace('{}', '');\n  }\n  return s.length === 0;\n}`;
    }
    if (difficulty === 'intermediate') {
      return `// Cyber-Gemini: O(N) Array Stack\nfunction isValid(s) {\n  const stack = [];\n  for (let i = 0; i < s.length; i++) {\n    const ch = s[i];\n    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);\n    else {\n      const top = stack.pop();\n      if (ch === ')' && top !== '(') return false;\n      if (ch === ']' && top !== '[') return false;\n      if (ch === '}' && top !== '{') return false;\n    }\n  }\n  return stack.length === 0;\n}`;
    }
    return `// ⚡ Grandmaster AI: Optimal O(N) Hash Map Lookup Stack\nfunction isValid(s) {\n  if (s.length % 2 !== 0) return false;\n  const pairs = { ')': '(', ']': '[', '}': '{' };\n  const stack = [];\n  for (let i = 0; i < s.length; i++) {\n    const c = s[i];\n    if (pairs[c]) {\n      if (stack.pop() !== pairs[c]) return false;\n    } else {\n      stack.push(c);\n    }\n  }\n  return stack.length === 0;\n}`;
  }

  // Universal Fallback
  if (difficulty === 'noob') {
    return `// Noob Bot: Brute Force Approach\nfunction solve(input) {\n  let result = [];\n  for (let i = 0; i < input.length; i++) {\n    for (let j = 0; j < input.length; j++) {\n      if (i !== j && input[i] === input[j]) result.push(input[i]);\n    }\n  }\n  return result[0] || input[0];\n}`;
  }
  if (difficulty === 'intermediate') {
    return `// Cyber-Gemini: Standard Sorting Approach\nfunction solve(input) {\n  const sorted = [...input].sort((a, b) => a - b);\n  const frequency = {};\n  for (const item of sorted) {\n    frequency[item] = (frequency[item] || 0) + 1;\n  }\n  return sorted[0];\n}`;
  }
  return `// ⚡ Grandmaster AI: Optimal Single-Pass In-Place\nfunction solve(input) {\n  let left = 0, right = input.length - 1;\n  while (left < right) {\n    if (input[left] === input[right]) return input[left];\n    left++;\n    right--;\n  }\n  return input[0];\n}`;
}

// 🤖 REALISTIC HUMAN-LIKE AI TYPING SIMULATOR
function startBotTypingSimulation(io, room, botPlayer, difficulty = 'intermediate') {
  const targetCode = getBotCodeForProblem(room.problem, difficulty);
  let currentIdx = 0;
  const totalChars = targetCode.length;

  const initialThinkTimeMs = difficulty === 'noob' ? 6000 : difficulty === 'intermediate' ? 4000 : 2500;

  setTimeout(() => {
    if (room.battleState !== 'in-progress' || !room.players[botPlayer.id]) return;

    const charsPerTick = difficulty === 'noob' ? [1, 2] : difficulty === 'intermediate' ? [2, 3] : [3, 4];
    const tickIntervalMs = difficulty === 'noob' ? 380 : difficulty === 'intermediate' ? 260 : 190;

    const typingTimer = setInterval(() => {
      if (room.battleState !== 'in-progress' || !room.players[botPlayer.id]) {
        clearInterval(typingTimer);
        return;
      }

      if (Math.random() < 0.08) return;

      const randomChunk = charsPerTick[Math.floor(Math.random() * charsPerTick.length)];
      currentIdx = Math.min(totalChars, currentIdx + randomChunk);
      const codeChunk = targetCode.substring(0, currentIdx);
      botPlayer.code = codeChunk;

      io.to(room.roomId).emit('opponent_code_update', {
        playerId: botPlayer.id,
        code: codeChunk,
      });

      if (currentIdx >= totalChars) {
        clearInterval(typingTimer);
        const submitDelay = difficulty === 'noob' ? 6000 : difficulty === 'intermediate' ? 4000 : 2500;

        setTimeout(() => {
          if (room.battleState === 'in-progress') {
            botPlayer.submitted = true;
            io.to(room.roomId).emit('ai_commentary', {
              text: `🤖 ${botPlayer.walletAddress} has finished verifying test cases and submitted!`,
              timestamp: Date.now(),
            });
            checkBattleCompletion(io, room);
          }
        }, submitDelay);
      }
    }, tickIntervalMs);
  }, initialThinkTimeMs);
}

async function checkBattleCompletion(io, room) {
  const playerList = Object.values(room.players);
  const allSubmitted = playerList.length === 2 && playerList.every((p) => p.submitted);

  if (allSubmitted || playerList.length === 1) {
    room.battleState = 'judging';
    io.to(room.roomId).emit('battle_judging_started');

    const p1 = playerList.find((p) => p.slot === 'player1') || playerList[0];
    const p2 = playerList.find((p) => p.slot === 'player2') || playerList[1] || p1;

    const aiVerdict = await judgeBattle({
      problem: room.problem,
      player1: p1,
      player2: p2,
    });

    room.result = aiVerdict;
    room.battleState = 'completed';

    io.to(room.roomId).emit('battle_completed', {
      result: aiVerdict,
    });
  }

  io.to(room.roomId).emit('room_state', {
    roomId: room.roomId,
    problem: room.problem,
    players: Object.values(room.players),
    spectatorCount: room.spectatorIds.size,
    battleState: room.battleState,
    persona: room.persona,
    durationSeconds: room.durationSeconds,
    result: room.result,
  });
}

export function setupBattleSockets(io) {
  io.on('connection', (socket) => {

    // 1. Join Room
    socket.on('join_room', ({ roomId, walletAddress, language = 'c', role, problemId, persona = 'esports' }) => {
      if (!roomId) return;
      socket.join(roomId);

      if (!rooms.has(roomId)) {
        let selectedProblem = problemsData.find((p) => p.id === problemId);
        if (!selectedProblem) {
          selectedProblem = problemsData[Math.floor(Math.random() * problemsData.length)];
        }

        rooms.set(roomId, {
          roomId,
          problem: selectedProblem,
          players: {},
          spectatorIds: new Set(),
          battleState: 'waiting',
          persona: persona,
          durationSeconds: 300, // Default 5 mins (0 = Unlimited)
          startTime: null,
          submissions: {},
          result: null,
          lastPublicTimestamp: 0,
          lastSpectatorTimestamp: 0,
        });
      }

      const room = rooms.get(roomId);
      const existingPlayerIds = Object.keys(room.players);
      const isSpectator = role === 'spectator' || existingPlayerIds.length >= 2;

      if (isSpectator) {
        room.spectatorIds.add(socket.id);
        socket.emit('spectator_joined', { isSpectator: true });
      } else {
        const playerSlot = existingPlayerIds.length === 0 ? 'player1' : 'player2';
        room.players[socket.id] = {
          id: socket.id,
          slot: playerSlot,
          walletAddress: walletAddress || `0xPlayer_${socket.id.substring(0, 4)}`,
          ready: false,
          isBot: false,
          language: language,
          code: room.problem.starterCode,
          previousCode: room.problem.starterCode,
          starterCode: room.problem.starterCode,
          submitted: false,
          lastAction: 'idle',
        };
      }

      io.to(roomId).emit('room_state', {
        roomId: room.roomId,
        problem: room.problem,
        players: Object.values(room.players),
        spectatorCount: room.spectatorIds.size,
        battleState: room.battleState,
        persona: room.persona,
        durationSeconds: room.durationSeconds,
        result: room.result,
      });
    });

    // 2. ⏱️ Room Creator Sets Match Duration (Supports Custom Minutes & 0 for Unlimited)
    socket.on('set_duration', ({ roomId, durationMinutes }) => {
      const room = rooms.get(roomId);
      if (!room || room.battleState !== 'waiting') return;

      if (durationMinutes === 0 || durationMinutes === 'unlimited') {
        room.durationSeconds = 0; // 0 represents Unlimited / No Timer Mode
      } else {
        const mins = Math.max(1, Math.min(180, parseInt(durationMinutes, 10) || 5));
        room.durationSeconds = mins * 60;
      }

      io.to(roomId).emit('duration_updated', { durationSeconds: room.durationSeconds });
      io.to(roomId).emit('room_state', {
        roomId: room.roomId,
        problem: room.problem,
        players: Object.values(room.players),
        spectatorCount: room.spectatorIds.size,
        battleState: room.battleState,
        persona: room.persona,
        durationSeconds: room.durationSeconds,
        result: room.result,
      });
    });

    // 3. Spawn AI Bot Boss
    socket.on('spawn_bot', ({ roomId, difficulty = 'intermediate' }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      const botId = `bot_${Math.random().toString(36).substring(2, 7)}`;
      const botNames = {
        noob: '🤖 NoobBot [Level 1]',
        intermediate: '🤖 Cyber-Gemini [Level 50]',
        grandmaster: '⚡ Grandmaster AI [Level 99]',
      };

      room.players[botId] = {
        id: botId,
        slot: 'player2',
        walletAddress: botNames[difficulty] || botNames.intermediate,
        ready: true,
        isBot: true,
        botDifficulty: difficulty,
        language: 'javascript',
        code: room.problem.starterCode,
        previousCode: room.problem.starterCode,
        starterCode: room.problem.starterCode,
        submitted: false,
        lastAction: 'idle',
      };

      io.to(roomId).emit('room_state', {
        roomId: room.roomId,
        problem: room.problem,
        players: Object.values(room.players),
        spectatorCount: room.spectatorIds.size,
        battleState: room.battleState,
        persona: room.persona,
        durationSeconds: room.durationSeconds,
      });
    });

    // 4. Change AI Referee Persona
    socket.on('change_persona', ({ roomId, persona }) => {
      const room = rooms.get(roomId);
      if (!room) return;
      room.persona = persona;
      io.to(roomId).emit('persona_updated', { persona });
    });

    // 5. Player Ready & Match Start
    socket.on('player_ready', async ({ roomId }) => {
      const room = rooms.get(roomId);
      if (!room || !room.players[socket.id]) return;

      room.players[socket.id].ready = true;
      const playerList = Object.values(room.players);
      const allReady = playerList.length === 2 && playerList.every((p) => p.ready);

      if (allReady) {
        room.battleState = 'in-progress';
        room.startTime = Date.now();
        io.to(roomId).emit('battle_start', {
          problem: room.problem,
          startTime: room.startTime,
          durationSeconds: room.durationSeconds !== undefined ? room.durationSeconds : 300,
        });

        const botPlayer = playerList.find((p) => p.isBot);
        if (botPlayer) {
          startBotTypingSimulation(io, room, botPlayer, botPlayer.botDifficulty);
        }

        const intro = await generatePublicCommentary({
          player: playerList[0],
          problemTitle: room.problem.title,
          eventType: 'match_start',
          persona: room.persona,
        });
        io.to(roomId).emit('ai_commentary', { text: intro, timestamp: Date.now() });
      }

      io.to(roomId).emit('room_state', {
        roomId: room.roomId,
        problem: room.problem,
        players: Object.values(room.players),
        spectatorCount: room.spectatorIds.size,
        battleState: room.battleState,
        persona: room.persona,
        durationSeconds: room.durationSeconds,
      });
    });

    // 6. Code Keystroke Sync
    socket.on('code_update', async ({ roomId, code, language }) => {
      const room = rooms.get(roomId);
      if (!room || !room.players[socket.id] || room.battleState !== 'in-progress') return;

      const player = room.players[socket.id];
      const previousCode = player.code;
      player.code = code;
      if (language) player.language = language;

      socket.to(roomId).emit('opponent_code_update', {
        playerId: socket.id,
        code: code,
      });

      const now = Date.now();
      const action = detectCodeAction(code, previousCode, player.starterCode, player.language);
      if (action !== 'idle' && action !== player.lastAction && now - room.lastPublicTimestamp > 9000) {
        player.lastAction = action;
        room.lastPublicTimestamp = now;

        const publicComment = await generatePublicCommentary({
          player,
          action,
          problemTitle: room.problem.title,
          eventType: 'keystroke',
          persona: room.persona,
        });

        io.to(roomId).emit('ai_commentary', { text: publicComment, timestamp: now });
      }
    });

    // 7. Submit Code
    socket.on('submit_code', async ({ roomId, code, language }) => {
      const room = rooms.get(roomId);
      if (!room || !room.players[socket.id]) return;

      const player = room.players[socket.id];
      player.code = code;
      if (language) player.language = language;
      player.submitted = true;

      const submitComment = await generatePublicCommentary({
        player,
        problemTitle: room.problem.title,
        eventType: 'code_submitted',
        persona: room.persona,
      });
      io.to(roomId).emit('ai_commentary', { text: submitComment, timestamp: Date.now() });

      checkBattleCompletion(io, room);
    });

    // 8. Reactions & Disconnect
    socket.on('send_reaction', ({ roomId, emoji }) => {
      io.to(roomId).emit('floating_reaction', {
        id: Math.random().toString(36).substring(2, 9),
        emoji,
        left: Math.floor(Math.random() * 80) + 10,
      });
    });

    socket.on('disconnect', () => {
      rooms.forEach((room, roomId) => {
        if (room.spectatorIds.has(socket.id)) room.spectatorIds.delete(socket.id);
        if (room.players[socket.id]) {
          delete room.players[socket.id];
          if (Object.keys(room.players).length === 0) rooms.delete(roomId);
        }
      });
    });
  });
}

export { rooms };