import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
import { judgeBattle } from '../services/geminiJudge.js';
import { getUniversalBotCode } from '../services/botCodeEngine.js';
import {
  generatePublicCommentary,
  generateSpectatorStrategicCommentary,
  detectCodeAction,
  analyzeStrategicFlaws,
} from '../services/geminiCommentary.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RPC_URL = process.env.AMOY_RPC_URL || 'https://polygon-amoy-bor-rpc.publicnode.com';
const REFEREE_PRIVATE_KEY = process.env.REFEREE_PRIVATE_KEY || process.env.PRIVATE_KEY || '';
const BATTLE_ARENA_ADDRESS = process.env.BATTLE_ARENA_ADDRESS || '0x93B16c50a8251C0997B2A0bE02F4a28f0533eda2';

let refereeContract = null;
if (REFEREE_PRIVATE_KEY) {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(REFEREE_PRIVATE_KEY, provider);
    const abi = [
      'function settleBattle(string roomId, address winner, string problemTitle, uint256 winnerScore, string tokenUri) external'
    ];
    refereeContract = new ethers.Contract(BATTLE_ARENA_ADDRESS, abi, wallet);
  } catch (err) {
    console.warn('⚠️ Blockchain referee relayer initialization skipped:', err.message);
  }
}

const problemsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/problems.json'), 'utf-8')
);

const rooms = new Map();

// 🤖 FAST, REALISTIC HUMAN-LIKE AI TYPING SIMULATOR
async function startBotTypingSimulation(io, room, botPlayer, difficulty = 'intermediate') {
  // ⚡ Fetches 100% problem-relevant code for any of the 300 problems instantly
  const targetCode = await getUniversalBotCode(room.problem, difficulty, botPlayer.language);
  let currentIdx = 0;
  const totalChars = targetCode.length;

  const initialThinkTimeMs = difficulty === 'noob' ? 3500 : difficulty === 'intermediate' ? 2200 : 1500;

  setTimeout(() => {
    if (room.battleState !== 'in-progress' || !room.players[botPlayer.id]) return;

    const charsPerTick = difficulty === 'noob' ? [1, 2] : difficulty === 'intermediate' ? [2, 3, 4] : [4, 5, 6];
    const tickIntervalMs = difficulty === 'noob' ? 320 : difficulty === 'intermediate' ? 220 : 150;

    const typingTimer = setInterval(() => {
      if (room.battleState !== 'in-progress' || !room.players[botPlayer.id]) {
        clearInterval(typingTimer);
        return;
      }

      if (Math.random() < 0.05) return; // natural pause

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
        const submitDelay = difficulty === 'noob' ? 4500 : difficulty === 'intermediate' ? 3000 : 1800;

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

async function checkAndStartBattle(io, room) {
  const playerList = Object.values(room.players);
  const allReady = playerList.length === 2 && playerList.every((p) => p.ready);

  if (allReady && room.battleState === 'waiting') {
    room.battleState = 'in-progress';
    room.startTime = Date.now();

    io.to(room.roomId).emit('battle_start', {
      problem: room.problem,
      startTime: room.startTime,
      durationSeconds: room.durationSeconds !== undefined ? room.durationSeconds : 300,
      stakeAmount: room.stakeAmount || '0.005',
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
    io.to(room.roomId).emit('ai_commentary', { text: intro, timestamp: Date.now() });
  }

  io.to(room.roomId).emit('room_state', {
    roomId: room.roomId,
    problem: room.problem,
    players: Object.values(room.players),
    spectatorCount: room.spectatorIds.size,
    battleState: room.battleState,
    persona: room.persona,
    durationSeconds: room.durationSeconds,
    stakeAmount: room.stakeAmount || '0.005',
    result: room.result,
  });
}

async function checkBattleCompletion(io, room) {
  const playerList = Object.values(room.players);
  const allSubmitted = playerList.length === 2 && playerList.every((p) => p.submitted);

  if (allSubmitted || playerList.length === 1) {
    room.battleState = 'judging';
    io.to(room.roomId).emit('battle_judging_started');

    io.to(room.roomId).emit('room_state', {
      roomId: room.roomId,
      problem: room.problem,
      players: Object.values(room.players),
      spectatorCount: room.spectatorIds.size,
      battleState: 'judging',
      persona: room.persona,
      durationSeconds: room.durationSeconds,
      stakeAmount: room.stakeAmount || '0.005',
      result: null,
    });

    const p1 = playerList.find((p) => p.slot === 'player1') || playerList[0];
    const p2 = playerList.find((p) => p.slot === 'player2') || playerList[1] || p1;

    const aiVerdict = await judgeBattle({
      problem: room.problem,
      player1: p1,
      player2: p2,
    });

    let payoutTxHash = null;
    const isRealWinner = aiVerdict.winnerAddress && aiVerdict.winnerAddress.startsWith('0x') && aiVerdict.winnerAddress !== 'DRAW';
    const hasBot = playerList.some((p) => p.isBot);

    if (refereeContract && isRealWinner && !hasBot && parseFloat(room.stakeAmount || '0') > 0) {
      try {
        const tx = await refereeContract.settleBattle(
          room.roomId,
          aiVerdict.winnerAddress,
          room.problem.title,
          aiVerdict.scores?.player1?.total || 90,
          `ipfs://badge/${room.roomId}`
        );
        payoutTxHash = tx.hash;
      } catch (err) {
        console.warn('⚠️ Settlement skipped:', err.message);
      }
    }

    aiVerdict.payoutTxHash = payoutTxHash;
    aiVerdict.payoutAmount = hasBot ? '0' : (parseFloat(room.stakeAmount || '0.005') * 2).toFixed(3);

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
    stakeAmount: room.stakeAmount || '0.005',
    result: room.result,
  });
}

export function setupBattleSockets(io) {
  io.on('connection', (socket) => {

    // 1. Join Room
    socket.on('join_room', ({ roomId, walletAddress, language = 'c', role, problemId, persona = 'esports', starterCode }) => {
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
          durationSeconds: 300,
          stakeAmount: '0.005',
          startTime: null,
          submissions: {},
          result: null,
          lastPublicTimestamp: 0,
          lastSpectatorTimestamp: 0,
        });
      }

      const room = rooms.get(roomId);
      const playerList = Object.values(room.players);

      const existingUserPlayer = playerList.find(
        (p) => !p.isBot && walletAddress && p.walletAddress.toLowerCase() === walletAddress.toLowerCase()
      );

      if (existingUserPlayer) {
        delete room.players[existingUserPlayer.id];
        existingUserPlayer.id = socket.id;
        room.players[socket.id] = existingUserPlayer;
        room.spectatorIds.delete(socket.id);
      } else {
        const p1Taken = playerList.some((p) => p.slot === 'player1');
        const p2Taken = playerList.some((p) => p.slot === 'player2');
        const isFull = p1Taken && p2Taken;
        const wantsSpectate = role === 'spectator';

        if (wantsSpectate || isFull) {
          room.spectatorIds.add(socket.id);
          socket.emit('spectator_joined', { isSpectator: true });
        } else {
          const slot = !p1Taken ? 'player1' : 'player2';
          room.players[socket.id] = {
            id: socket.id,
            slot: slot,
            walletAddress: walletAddress || `0xPlayer_${socket.id.substring(0, 4)}`,
            ready: false,
            staked: false,
            isBot: false,
            language: language,
            code: starterCode || room.problem.starterCode,
            previousCode: starterCode || room.problem.starterCode,
            starterCode: starterCode || room.problem.starterCode,
            submitted: false,
            lastAction: 'idle',
          };
          room.spectatorIds.delete(socket.id);
        }
      }

      io.to(roomId).emit('room_state', {
        roomId: room.roomId,
        problem: room.problem,
        players: Object.values(room.players),
        spectatorCount: room.spectatorIds.size,
        battleState: room.battleState,
        persona: room.persona,
        durationSeconds: room.durationSeconds,
        stakeAmount: room.stakeAmount || '0.005',
        result: room.result,
      });
    });

    // 2. Set Stake
    socket.on('set_stake', ({ roomId, stakeAmount }) => {
      const room = rooms.get(roomId);
      if (!room || room.battleState !== 'waiting') return;
      room.stakeAmount = stakeAmount || '0.005';
      io.to(roomId).emit('room_state', {
        roomId: room.roomId,
        problem: room.problem,
        players: Object.values(room.players),
        spectatorCount: room.spectatorIds.size,
        battleState: room.battleState,
        persona: room.persona,
        durationSeconds: room.durationSeconds,
        stakeAmount: room.stakeAmount,
        result: room.result,
      });
    });

    // 3. Set Duration
    socket.on('set_duration', ({ roomId, durationMinutes }) => {
      const room = rooms.get(roomId);
      if (!room || room.battleState !== 'waiting') return;

      if (durationMinutes === 0 || durationMinutes === 'unlimited') {
        room.durationSeconds = 0;
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
        stakeAmount: room.stakeAmount || '0.005',
        result: room.result,
      });
    });

    // 4. Spawn AI Bot
    socket.on('spawn_bot', async ({ roomId, difficulty = 'intermediate' }) => {
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
        staked: true,
        isBot: true,
        botDifficulty: difficulty,
        language: 'javascript',
        code: room.problem.starterCode,
        previousCode: room.problem.starterCode,
        starterCode: room.problem.starterCode,
        submitted: false,
        lastAction: 'idle',
      };

      await checkAndStartBattle(io, room);
    });

    // 5. Change Persona
    socket.on('change_persona', ({ roomId, persona }) => {
      const room = rooms.get(roomId);
      if (!room) return;
      room.persona = persona;
      io.to(roomId).emit('persona_updated', { persona });
    });

    // 6. Player Ready
    socket.on('player_ready', async ({ roomId, isStaked }) => {
      const room = rooms.get(roomId);
      if (!room || !room.players[socket.id]) return;

      room.players[socket.id].ready = true;
      if (isStaked) room.players[socket.id].staked = true;

      await checkAndStartBattle(io, room);
    });

    // 7. Code Update
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

    // 8. Submit Code
    socket.on('submit_code', async ({ roomId, code, language, starterCode }) => {
      const room = rooms.get(roomId);
      if (!room || !room.players[socket.id]) return;

      const player = room.players[socket.id];
      player.code = code;
      if (language) player.language = language;
      if (starterCode) player.starterCode = starterCode;
      player.submitted = true;

      io.to(roomId).emit('room_state', {
        roomId: room.roomId,
        problem: room.problem,
        players: Object.values(room.players),
        spectatorCount: room.spectatorIds.size,
        battleState: room.battleState,
        persona: room.persona,
        durationSeconds: room.durationSeconds,
        stakeAmount: room.stakeAmount || '0.005',
        result: room.result,
      });

      const submitComment = await generatePublicCommentary({
        player,
        problemTitle: room.problem.title,
        eventType: 'code_submitted',
        persona: room.persona,
      });
      io.to(roomId).emit('ai_commentary', { text: submitComment, timestamp: Date.now() });

      checkBattleCompletion(io, room);
    });

    // 9. Reactions & Disconnect
    socket.on('send_reaction', ({ roomId, emoji }) => {
      io.to(roomId).emit('floating_reaction', {
        id: Math.random().toString(36).substring(2, 9),
        emoji,
        left: Math.floor(Math.random() * 80) + 10,
      });
    });

    socket.on('disconnect', () => {
      rooms.forEach((room, roomId) => {
        if (room.spectatorIds.has(socket.id)) {
          room.spectatorIds.delete(socket.id);
        }
        if (room.players[socket.id]) {
          delete room.players[socket.id];
          const remainingHumans = Object.values(room.players).filter((p) => !p.isBot);
          if (remainingHumans.length === 0) {
            rooms.delete(roomId);
          }
        }
      });
    });
  });
}

export { rooms };