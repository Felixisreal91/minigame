const path = require('path');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const httpServer = app.listen(process.env.PORT || 3000, () => {
  const { port } = httpServer.address();
  console.log(`서버 실행 중: http://localhost:${port}`);
});

const io = new Server(httpServer);

// code -> { hostSocketId, participants: [{id, nickname}], status: 'waiting' | 'game-select' | 'playing',
//           currentGame: null | 'stop-at-7' | 'nunchi',
//           gameState: null | { round, results, expectedCount? }
//             stop-at-7 results: [{id, nickname, elapsedMs, diffMs}]
//             nunchi results:    [{id, nickname}] (배열 순서 = 누른 순서), expectedCount = 라운드 시작 시점 참가자 수 }
const rooms = new Map();

const TARGET_MS = 7000;

function sortedResults(gameState) {
  return [...gameState.results].sort((a, b) => a.diffMs - b.diffMs);
}

function generateRoomCode() {
  let code;
  do {
    code = String(Math.floor(1000 + Math.random() * 9000));
  } while (rooms.has(code));
  return code;
}

function broadcastRoomUpdate(code) {
  const room = rooms.get(code);
  if (!room) return;
  io.to(code).emit('room:update', { participants: room.participants });
}

function maybeEndNunchiRound(code, room) {
  const { expectedCount, results } = room.gameState;
  if (typeof expectedCount !== 'number' || expectedCount <= 0 || results.length < expectedCount) return;
  const ranked = results.map((r, i) => ({ nickname: r.nickname, order: i + 1 }));
  io.to(code).emit('game:round-end', { results: ranked });
}

io.on('connection', (socket) => {
  socket.on('host:create-room', (_payload, ack) => {
    const code = generateRoomCode();
    rooms.set(code, {
      hostSocketId: null,
      participants: [],
      status: 'waiting',
      currentGame: null,
      gameState: null,
    });
    ack?.({ success: true, code });
  });

  socket.on('host:attach', ({ code } = {}, ack) => {
    const room = rooms.get(code);
    if (!room) {
      ack?.({ success: false, error: '존재하지 않는 방입니다.' });
      return;
    }
    room.hostSocketId = socket.id;
    socket.data.role = 'host';
    socket.data.code = code;
    socket.join(code);
    ack?.({
      success: true,
      participants: room.participants,
      status: room.status,
      currentGame: room.currentGame,
      gameState: room.gameState,
    });
  });

  socket.on('player:join', ({ code, nickname } = {}, ack) => {
    const room = rooms.get(code);
    if (!room) {
      ack?.({ success: false, error: '존재하지 않는 방 코드입니다.' });
      return;
    }
    const trimmed = (nickname || '').trim();
    if (!trimmed) {
      ack?.({ success: false, error: '닉네임을 입력해주세요.' });
      return;
    }
    socket.data.role = 'player';
    socket.data.code = code;
    socket.data.nickname = trimmed;
    room.participants.push({ id: socket.id, nickname: trimmed });
    socket.join(code);
    ack?.({
      success: true,
      status: room.status,
      currentGame: room.currentGame,
      participants: room.participants,
    });
    broadcastRoomUpdate(code);
  });

  socket.on('host:start-game-select', ({ code } = {}, ack) => {
    const room = rooms.get(code);
    if (!room || room.hostSocketId !== socket.id) {
      ack?.({ success: false, error: '호스트만 게임을 시작할 수 있습니다.' });
      return;
    }
    room.status = 'game-select';
    room.currentGame = null;
    room.gameState = null;
    io.to(code).emit('game:select-screen');
    ack?.({ success: true });
  });

  socket.on('host:launch-game', ({ code, game } = {}, ack) => {
    const room = rooms.get(code);
    if (!room || room.hostSocketId !== socket.id) {
      ack?.({ success: false, error: '호스트만 게임을 시작할 수 있습니다.' });
      return;
    }
    room.status = 'playing';
    room.currentGame = game;
    room.gameState = { round: 1, results: [] };
    io.to(code).emit('game:launched', { game });
    ack?.({ success: true });
  });

  socket.on('host:round-start', ({ code } = {}, ack) => {
    const room = rooms.get(code);
    if (!room || room.hostSocketId !== socket.id || !room.gameState) {
      ack?.({ success: false, error: '라운드를 시작할 수 없습니다.' });
      return;
    }
    room.gameState.expectedCount = room.participants.length;
    io.to(code).emit('game:round-start', { round: room.gameState.round });
    ack?.({ success: true });
  });

  socket.on('player:submit-result', ({ code, round, elapsedMs } = {}, ack) => {
    const room = rooms.get(code);
    if (!room || room.status !== 'playing' || !room.gameState) {
      ack?.({ success: false, error: '진행 중인 라운드가 없습니다.' });
      return;
    }
    if (round !== room.gameState.round) {
      ack?.({ success: false, error: '이미 종료된 라운드입니다.' });
      return;
    }
    if (room.gameState.results.some((r) => r.id === socket.id)) {
      ack?.({ success: false, error: '이미 제출했습니다.' });
      return;
    }
    if (typeof elapsedMs !== 'number' || !Number.isFinite(elapsedMs) || elapsedMs < 0 || elapsedMs > 60000) {
      ack?.({ success: false, error: '올바르지 않은 기록입니다.' });
      return;
    }

    const nickname = socket.data.nickname || '참가자';
    const diffMs = Math.abs(elapsedMs - TARGET_MS);
    room.gameState.results.push({ id: socket.id, nickname, elapsedMs, diffMs });

    const results = sortedResults(room.gameState);
    ack?.({ success: true, elapsedMs, diffMs });
    io.to(code).emit('game:leaderboard-update', {
      results,
      totalParticipants: room.participants.length,
    });
  });

  socket.on('player:press', ({ code, round } = {}, ack) => {
    const room = rooms.get(code);
    if (!room || room.status !== 'playing' || room.currentGame !== 'nunchi' || !room.gameState) {
      ack?.({ success: false, error: '진행 중인 라운드가 없습니다.' });
      return;
    }
    if (round !== room.gameState.round) {
      ack?.({ success: false, error: '이미 종료된 라운드입니다.' });
      return;
    }
    if (room.gameState.results.some((r) => r.id === socket.id)) {
      ack?.({ success: false, error: '이미 눌렀습니다.' });
      return;
    }

    const nickname = socket.data.nickname || '참가자';
    room.gameState.results.push({ id: socket.id, nickname });
    const order = room.gameState.results.length;
    const totalExpected = room.gameState.expectedCount;
    ack?.({ success: true, order, totalExpected });

    io.to(code).emit('game:press-update', {
      pressedCount: room.gameState.results.length,
      totalParticipants: totalExpected,
    });

    maybeEndNunchiRound(code, room);
  });

  socket.on('host:reset-round', ({ code } = {}, ack) => {
    const room = rooms.get(code);
    if (!room || room.hostSocketId !== socket.id || !room.gameState) {
      ack?.({ success: false, error: '라운드를 초기화할 수 없습니다.' });
      return;
    }
    room.gameState.round += 1;
    room.gameState.results = [];
    io.to(code).emit('game:round-reset', {});
    ack?.({ success: true });
  });

  socket.on('host:back-to-game-select', ({ code } = {}, ack) => {
    const room = rooms.get(code);
    if (!room || room.hostSocketId !== socket.id) {
      ack?.({ success: false, error: '이동할 수 없습니다.' });
      return;
    }
    room.status = 'game-select';
    room.currentGame = null;
    room.gameState = null;
    io.to(code).emit('game:select-screen');
    ack?.({ success: true });
  });

  socket.on('disconnect', () => {
    const { role, code } = socket.data;
    if (!code || !rooms.has(code)) return;
    const room = rooms.get(code);

    if (role === 'host' && room.hostSocketId === socket.id) {
      rooms.delete(code);
      return;
    }

    if (role === 'player') {
      room.participants = room.participants.filter((p) => p.id !== socket.id);
      broadcastRoomUpdate(code);

      if (room.gameState) {
        const before = room.gameState.results.length;
        room.gameState.results = room.gameState.results.filter((r) => r.id !== socket.id);
        const wasRemoved = room.gameState.results.length !== before;

        if (room.currentGame === 'stop-at-7' && wasRemoved) {
          io.to(code).emit('game:leaderboard-update', {
            results: sortedResults(room.gameState),
            totalParticipants: room.participants.length,
          });
        }

        if (room.currentGame === 'nunchi' && room.status === 'playing' && !wasRemoved) {
          // 아직 안 누른 사람이 나갔으므로 이번 라운드의 기대 인원에서 제외
          if (typeof room.gameState.expectedCount === 'number') {
            room.gameState.expectedCount = Math.max(0, room.gameState.expectedCount - 1);
          }
          maybeEndNunchiRound(code, room);
        }
      }
    }
  });
});
