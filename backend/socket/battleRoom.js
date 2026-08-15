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

export function setupBattleSockets(io) {
  io.on('connection', (socket) => {

    // 1. Join Room (Handles Players & Spectators)
    socket.on('join_room', ({ roomId, walletAddress, language = 'c', role }) => {
      if (!roomId) return;

      socket.join(roomId);

      if (!rooms.has(roomId)) {
        const randomProblem = problemsData[Math.floor(Math.random() * problemsData.length)];
        rooms.set(roomId, {
          roomId,
          problem: randomProblem,
          players: {},
          spectatorIds: new Set(),
          battleState: 'waiting',
          startTime: null,
          submissions: {},
          result: null,
          lastPublicTimestamp: 0,
          lastSpectatorTimestamp: 0,
        });
      }

      const room = rooms.get(roomId);
      const existingPlayerIds = Object.keys(room.players);

      // Join as Spectator if requested or if 2 players are already in the arena
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
        result: room.result,
      });
    });

    // 2. Language Change
    socket.on('language_change', ({ roomId, language }) => {
      const room = rooms.get(roomId);
      if (!room || !room.players[socket.id]) return;
      room.players[socket.id].language = language;
      socket.to(roomId).emit('opponent_language_update', { language });
    });

    // 3. Player Ready & Match Start
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
          durationSeconds: 300,
        });

        const intro = await generatePublicCommentary({
          player: playerList[0],
          problemTitle: room.problem.title,
          eventType: 'match_start',
        });
        io.to(roomId).emit('ai_commentary', { text: intro, timestamp: Date.now() });
      }

      io.to(roomId).emit('room_state', {
        roomId: room.roomId,
        problem: room.problem,
        players: Object.values(room.players),
        spectatorCount: room.spectatorIds.size,
        battleState: room.battleState,
      });
    });

    // 4. Code Keystroke Progress & Dual-Channel Commentary
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

      // 🎙️ Channel A: Public Commentary (Heard by all)
      const action = detectCodeAction(code, previousCode, player.starterCode, player.language);
      if (action !== 'idle' && action !== player.lastAction && now - room.lastPublicTimestamp > 9000) {
        player.lastAction = action;
        room.lastPublicTimestamp = now;

        const publicComment = await generatePublicCommentary({
          player,
          action,
          problemTitle: room.problem.title,
          eventType: 'keystroke',
        });

        io.to(roomId).emit('ai_commentary', { text: publicComment, timestamp: now });
      }

      // 🎙️ Channel B: Secret Grandmaster Booth Commentary (Sent ONLY to Spectators)
      const flaw = analyzeStrategicFlaws(code, player.starterCode, player.language);
      if (flaw && now - room.lastSpectatorTimestamp > 12000) {
        room.lastSpectatorTimestamp = now;
        const secretTacticalComment = await generateSpectatorStrategicCommentary({
          player,
          flaw,
          problemTitle: room.problem.title,
        });

        if (secretTacticalComment) {
          room.spectatorIds.forEach((specId) => {
            io.to(specId).emit('spectator_tactical_commentary', {
              text: secretTacticalComment,
              timestamp: now,
            });
          });
        }
      }
    });

    // 5. Floating Emoji Reaction from Spectators
    socket.on('send_reaction', ({ roomId, emoji }) => {
      const reaction = {
        id: Math.random().toString(36).substring(2, 9),
        emoji,
        left: Math.floor(Math.random() * 80) + 10, // random position between 10% and 90%
      };
      io.to(roomId).emit('floating_reaction', reaction);
    });

    // 6. Submit Code & Trigger Judge
    socket.on('submit_code', async ({ roomId, code, language }) => {
      const room = rooms.get(roomId);
      if (!room || !room.players[socket.id]) return;

      const player = room.players[socket.id];
      player.code = code;
      if (language) player.language = language;
      player.submitted = true;

      room.submissions[socket.id] = {
        walletAddress: player.walletAddress,
        slot: player.slot,
        code: code,
        language: player.language,
      };

      const submitComment = await generatePublicCommentary({
        player,
        problemTitle: room.problem.title,
        eventType: 'code_submitted',
      });
      io.to(roomId).emit('ai_commentary', { text: submitComment, timestamp: Date.now() });

      const playerList = Object.values(room.players);
      const allSubmitted = playerList.length === 2 && playerList.every((p) => p.submitted);

      if (allSubmitted || playerList.length === 1) {
        room.battleState = 'judging';
        io.to(roomId).emit('battle_judging_started');

        const p1 = playerList[0];
        const p2 = playerList[1] || playerList[0];

        const aiVerdict = await judgeBattle({
          problem: room.problem,
          player1: p1,
          player2: p2,
        });

        room.result = aiVerdict;
        room.battleState = 'completed';

        io.to(roomId).emit('battle_completed', {
          result: aiVerdict,
        });
      }

      io.to(roomId).emit('room_state', {
        roomId: room.roomId,
        problem: room.problem,
        players: Object.values(room.players),
        spectatorCount: room.spectatorIds.size,
        battleState: room.battleState,
        result: room.result,
      });
    });

    // 7. Disconnect
    socket.on('disconnect', () => {
      rooms.forEach((room, roomId) => {
        if (room.spectatorIds.has(socket.id)) {
          room.spectatorIds.delete(socket.id);
        }
        if (room.players[socket.id]) {
          delete room.players[socket.id];
          if (Object.keys(room.players).length === 0) {
            rooms.delete(roomId);
          }
        }
      });
    });
  });
}

export { rooms };