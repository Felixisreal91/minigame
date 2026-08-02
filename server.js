require('dotenv').config();
const path = require('path');
const express = require('express');
const { Server } = require('socket.io');
const { createClient } = require('@supabase/supabase-js');

const supabase =
  process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
    : null;

if (!supabase) {
  console.warn('SUPABASE_URL/SUPABASE_ANON_KEY가 없어 게임 결과가 저장되지 않습니다.');
}

// 활성 방의 게임 결과를 Supabase에 부가 기록 (fire-and-forget, 실패해도 실시간 진행에 영향 없음)
function saveGameResult(roomCode, game, round, payload) {
  if (!supabase) return;
  supabase
    .from('game_results')
    .insert({ room_code: roomCode, game, round, payload })
    .then(({ error }) => {
      if (error) console.error('Supabase insert 실패:', error.message);
    })
    .catch((err) => console.error('Supabase insert 네트워크 오류:', err.message));
}

// 호스트가 방을 나가면 그 방의 결과를 모두 삭제 (활성 방 동안만 유지)
function deleteGameResults(roomCode) {
  if (!supabase) return;
  supabase
    .from('game_results')
    .delete()
    .eq('room_code', roomCode)
    .then(({ error }) => {
      if (error) console.error('Supabase delete 실패:', error.message);
    })
    .catch((err) => console.error('Supabase delete 네트워크 오류:', err.message));
}

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const httpServer = app.listen(process.env.PORT || 3000, () => {
  const { port } = httpServer.address();
  console.log(`서버 실행 중: http://localhost:${port}`);
});

const io = new Server(httpServer);

// code -> { hostSocketId, participants: [{id, nickname}], status: 'waiting' | 'game-select' | 'playing',
//           currentGame: null | 'stop-at-7' | 'nunchi' | 'truth-or-lie' | 'bluffing-number',
//           gameState: null | (게임별로 모양이 다름, createInitialGameState 참고) }
//   stop-at-7: { round, results: [{id, nickname, elapsedMs, diffMs}] }
//   nunchi:    { round, results: [{id, nickname}] (배열 순서 = 누른 순서), expectedCount }
//   truth-or-lie: {
//     phase: 'writing' | 'writing-complete' | 'guessing' | 'result',
//     sentences: [{id, nickname, sentence, isTrue}], expectedCount,
//     order: [id, ...] (셔플된 작성자 순서), currentIndex,
//     guesses: [{id, nickname, guess}] (라운드마다 초기화), expectedGuessers,
//   }
//   bluffing-number: {
//     range: null | {min:1, max}, round, alive: [id,...], picks: [{id,nickname,number}] (라운드마다 초기화),
//     expectedPicks, eliminatedLog: [{nickname, round}] (누적), gameOver,
//   }
const rooms = new Map();

const TARGET_MS = 7000;

function sortedResults(gameState) {
  return [...gameState.results].sort((a, b) => a.diffMs - b.diffMs);
}

function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function createInitialGameState(game) {
  if (game === 'truth-or-lie') {
    return {
      phase: 'writing',
      sentences: [],
      expectedCount: 0,
      order: [],
      currentIndex: -1,
      guesses: [],
      expectedGuessers: 0,
    };
  }
  if (game === 'bluffing-number') {
    return {
      range: null,
      round: 0,
      alive: [],
      picks: [],
      expectedPicks: 0,
      eliminatedLog: [],
      gameOver: false,
    };
  }
  return { round: 1, results: [] };
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
  saveGameResult(code, 'nunchi', room.gameState.round, { results: ranked });
}

function maybeCompleteWriting(code, room) {
  const gs = room.gameState;
  if (gs.phase !== 'writing') return;
  if (gs.expectedCount <= 0 || gs.sentences.length < gs.expectedCount) return;
  gs.phase = 'writing-complete';
  gs.order = shuffle(gs.sentences.map((s) => s.id));
  gs.currentIndex = -1;
  io.to(code).emit('game:writing-complete', {});
}

function maybeRevealRoundResult(code, room) {
  const gs = room.gameState;
  if (gs.phase !== 'guessing') return;
  if (gs.expectedGuessers > 0 && gs.guesses.length < gs.expectedGuessers) return;

  const authorId = gs.order[gs.currentIndex];
  const authorEntry = gs.sentences.find((s) => s.id === authorId);
  const correctGuessers = gs.guesses.filter((g) => g.guess === authorEntry.isTrue).map((g) => g.nickname);
  const incorrectGuessers = gs.guesses.filter((g) => g.guess !== authorEntry.isTrue).map((g) => g.nickname);

  gs.phase = 'result';
  const payload = {
    sentence: authorEntry.sentence,
    isTrue: authorEntry.isTrue,
    authorNickname: authorEntry.nickname,
    correctGuessers,
    incorrectGuessers,
    roundNumber: gs.currentIndex + 1,
    totalRounds: gs.order.length,
    isLastRound: gs.currentIndex >= gs.order.length - 1,
  };
  io.to(code).emit('game:round-result', payload);
  saveGameResult(code, 'truth-or-lie', payload.roundNumber, payload);
}

function buildBluffingSummary(room, gs) {
  const survivors = room.participants.filter((p) => gs.alive.includes(p.id)).map((p) => p.nickname);
  const eliminatedLog = [...gs.eliminatedLog].sort((a, b) => b.round - a.round);
  return { survivors, eliminatedLog };
}

function resolveBluffingRound(code, room) {
  const gs = room.gameState;
  if (gs.gameOver) return;

  const byNumber = new Map();
  for (const p of gs.picks) {
    if (!byNumber.has(p.number)) byNumber.set(p.number, []);
    byNumber.get(p.number).push(p);
  }
  const duplicateGroups = [...byNumber.values()].filter((g) => g.length > 1);

  let eliminatedThisRound;
  if (duplicateGroups.length > 0) {
    eliminatedThisRound = duplicateGroups.flat();
  } else if (gs.picks.length > 0) {
    const minNumber = Math.min(...gs.picks.map((p) => p.number));
    eliminatedThisRound = gs.picks.filter((p) => p.number === minNumber);
  } else {
    eliminatedThisRound = [];
  }

  const eliminatedIds = new Set(eliminatedThisRound.map((p) => p.id));
  gs.alive = gs.alive.filter((id) => !eliminatedIds.has(id));
  eliminatedThisRound.forEach((p) => gs.eliminatedLog.push({ nickname: p.nickname, round: gs.round }));

  const isGameOver = gs.alive.length <= 1;
  if (isGameOver) gs.gameOver = true;

  const payload = {
    round: gs.round,
    picks: [...gs.picks].sort((a, b) => a.number - b.number).map((p) => ({ nickname: p.nickname, number: p.number })),
    eliminated: eliminatedThisRound.map((p) => ({ nickname: p.nickname, number: p.number })),
    remainingCount: gs.alive.length,
    isGameOver,
  };
  if (isGameOver) {
    Object.assign(payload, buildBluffingSummary(room, gs));
  }
  io.to(code).emit('game:round-result', payload);
  saveGameResult(code, 'bluffing-number', gs.round, payload);
}

function maybeResolveBluffingRound(code, room) {
  const gs = room.gameState;
  if (gs.gameOver) return;
  if (gs.picks.length < gs.expectedPicks) return;
  resolveBluffingRound(code, room);
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
    room.gameState = createInitialGameState(game);
    if (game === 'truth-or-lie') {
      room.gameState.expectedCount = room.participants.length;
    }
    io.to(code).emit('game:launched', { game });
    ack?.({ success: true });
  });

  socket.on('host:select-range', ({ code, max } = {}, ack) => {
    const room = rooms.get(code);
    if (!room || room.hostSocketId !== socket.id || room.currentGame !== 'bluffing-number' || !room.gameState) {
      ack?.({ success: false, error: '범위를 선택할 수 없습니다.' });
      return;
    }
    if (![5, 10, 15, 20, 25].includes(max)) {
      ack?.({ success: false, error: '올바르지 않은 범위입니다.' });
      return;
    }
    room.gameState.range = { min: 1, max };
    ack?.({ success: true });
  });

  socket.on('host:round-start', ({ code } = {}, ack) => {
    const room = rooms.get(code);
    if (!room || room.hostSocketId !== socket.id || !room.gameState) {
      ack?.({ success: false, error: '라운드를 시작할 수 없습니다.' });
      return;
    }

    if (room.currentGame === 'bluffing-number') {
      const gs = room.gameState;
      if (!gs.range) {
        ack?.({ success: false, error: '먼저 숫자 범위를 선택해주세요.' });
        return;
      }
      if (gs.round === 0) {
        gs.alive = room.participants.map((p) => p.id);
      }
      if (gs.alive.length <= 1) {
        ack?.({ success: false, error: '더 이상 진행할 수 없습니다.' });
        return;
      }
      gs.round += 1;
      gs.picks = [];
      gs.expectedPicks = gs.alive.length;
      io.to(code).emit('game:round-start', { round: gs.round, min: gs.range.min, max: gs.range.max, alive: gs.alive });
      ack?.({ success: true });
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

  socket.on('player:submit-pick', ({ code, round, number } = {}, ack) => {
    const room = rooms.get(code);
    if (!room || room.status !== 'playing' || room.currentGame !== 'bluffing-number' || !room.gameState) {
      ack?.({ success: false, error: '진행 중인 라운드가 없습니다.' });
      return;
    }
    const gs = room.gameState;
    if (!gs.range || round !== gs.round) {
      ack?.({ success: false, error: '이미 종료된 라운드입니다.' });
      return;
    }
    if (!gs.alive.includes(socket.id)) {
      ack?.({ success: false, error: '이미 탈락했습니다.' });
      return;
    }
    if (gs.picks.some((p) => p.id === socket.id)) {
      ack?.({ success: false, error: '이미 선택했습니다.' });
      return;
    }
    if (
      typeof number !== 'number' ||
      !Number.isInteger(number) ||
      number < gs.range.min ||
      number > gs.range.max
    ) {
      ack?.({ success: false, error: '올바르지 않은 숫자입니다.' });
      return;
    }

    const nickname = socket.data.nickname || '참가자';
    gs.picks.push({ id: socket.id, nickname, number });
    ack?.({ success: true });

    io.to(code).emit('game:pick-progress', {
      pickedCount: gs.picks.length,
      totalParticipants: gs.expectedPicks,
    });

    maybeResolveBluffingRound(code, room);
  });

  socket.on('player:submit-sentence', ({ code, sentence, isTrue } = {}, ack) => {
    const room = rooms.get(code);
    if (
      !room ||
      room.status !== 'playing' ||
      room.currentGame !== 'truth-or-lie' ||
      !room.gameState ||
      room.gameState.phase !== 'writing'
    ) {
      ack?.({ success: false, error: '문장을 제출할 수 없습니다.' });
      return;
    }
    if (room.gameState.sentences.some((s) => s.id === socket.id)) {
      ack?.({ success: false, error: '이미 제출했습니다.' });
      return;
    }
    const trimmed = (sentence || '').trim();
    if (!trimmed || trimmed.length > 100) {
      ack?.({ success: false, error: '문장은 1자 이상 100자 이하로 입력해주세요.' });
      return;
    }
    if (typeof isTrue !== 'boolean') {
      ack?.({ success: false, error: '진실/거짓을 선택해주세요.' });
      return;
    }

    const nickname = socket.data.nickname || '참가자';
    room.gameState.sentences.push({ id: socket.id, nickname, sentence: trimmed, isTrue });
    ack?.({ success: true });

    io.to(code).emit('game:writing-progress', {
      submittedCount: room.gameState.sentences.length,
      totalParticipants: room.gameState.expectedCount,
    });

    maybeCompleteWriting(code, room);
  });

  socket.on('host:next-round', ({ code } = {}, ack) => {
    const room = rooms.get(code);
    if (!room || room.hostSocketId !== socket.id || room.currentGame !== 'truth-or-lie' || !room.gameState) {
      ack?.({ success: false, error: '다음 라운드로 넘어갈 수 없습니다.' });
      return;
    }
    const gs = room.gameState;
    if (gs.phase !== 'writing-complete' && gs.phase !== 'result') {
      ack?.({ success: false, error: '지금은 라운드를 시작할 수 없습니다.' });
      return;
    }
    if (gs.currentIndex + 1 >= gs.order.length) {
      ack?.({ success: false, error: '모든 라운드가 끝났습니다.' });
      return;
    }

    gs.currentIndex += 1;
    gs.guesses = [];
    gs.phase = 'guessing';

    const authorId = gs.order[gs.currentIndex];
    const authorEntry = gs.sentences.find((s) => s.id === authorId);
    const authorStillPresent = room.participants.some((p) => p.id === authorId);
    gs.expectedGuessers = Math.max(0, room.participants.length - (authorStillPresent ? 1 : 0));

    const payload = {
      sentence: authorEntry.sentence,
      roundNumber: gs.currentIndex + 1,
      totalRounds: gs.order.length,
    };
    io.to(code).except(authorId).emit('game:round-reveal', { ...payload, isAuthor: false });
    io.to(authorId).emit('game:round-reveal', { ...payload, isAuthor: true });

    ack?.({ success: true });
    maybeRevealRoundResult(code, room);
  });

  socket.on('player:submit-guess', ({ code, round, guess } = {}, ack) => {
    const room = rooms.get(code);
    if (
      !room ||
      room.status !== 'playing' ||
      room.currentGame !== 'truth-or-lie' ||
      !room.gameState ||
      room.gameState.phase !== 'guessing'
    ) {
      ack?.({ success: false, error: '지금은 답변할 수 없습니다.' });
      return;
    }
    const gs = room.gameState;
    if (round !== gs.currentIndex + 1) {
      ack?.({ success: false, error: '이미 종료된 라운드입니다.' });
      return;
    }
    const authorId = gs.order[gs.currentIndex];
    if (socket.id === authorId) {
      ack?.({ success: false, error: '본인 문장은 맞힐 수 없어요.' });
      return;
    }
    if (gs.guesses.some((g) => g.id === socket.id)) {
      ack?.({ success: false, error: '이미 답변했습니다.' });
      return;
    }
    if (typeof guess !== 'boolean') {
      ack?.({ success: false, error: '올바르지 않은 답변입니다.' });
      return;
    }

    const nickname = socket.data.nickname || '참가자';
    gs.guesses.push({ id: socket.id, nickname, guess });
    ack?.({ success: true });

    io.to(code).emit('game:guess-progress', {
      answeredCount: gs.guesses.length,
      totalParticipants: gs.expectedGuessers,
    });

    maybeRevealRoundResult(code, room);
  });

  socket.on('host:reset-round', ({ code } = {}, ack) => {
    const room = rooms.get(code);
    if (!room || room.hostSocketId !== socket.id || !room.gameState) {
      ack?.({ success: false, error: '라운드를 초기화할 수 없습니다.' });
      return;
    }
    if (room.currentGame === 'truth-or-lie') {
      room.gameState = createInitialGameState('truth-or-lie');
      room.gameState.expectedCount = room.participants.length;
    } else if (room.currentGame === 'bluffing-number') {
      room.gameState = createInitialGameState('bluffing-number');
    } else {
      if (room.currentGame === 'stop-at-7' && room.gameState.results.length > 0) {
        saveGameResult(code, 'stop-at-7', room.gameState.round, { results: sortedResults(room.gameState) });
      }
      room.gameState.round += 1;
      room.gameState.results = [];
    }
    io.to(code).emit('game:round-reset', {});
    ack?.({ success: true });
  });

  socket.on('host:back-to-game-select', ({ code } = {}, ack) => {
    const room = rooms.get(code);
    if (!room || room.hostSocketId !== socket.id) {
      ack?.({ success: false, error: '이동할 수 없습니다.' });
      return;
    }
    if (room.currentGame === 'stop-at-7' && room.gameState?.results?.length > 0) {
      saveGameResult(code, 'stop-at-7', room.gameState.round, { results: sortedResults(room.gameState) });
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
      deleteGameResults(code);
      return;
    }

    if (role === 'player') {
      room.participants = room.participants.filter((p) => p.id !== socket.id);
      broadcastRoomUpdate(code);

      if (!room.gameState) return;

      if (room.currentGame === 'stop-at-7') {
        const before = room.gameState.results.length;
        room.gameState.results = room.gameState.results.filter((r) => r.id !== socket.id);
        if (room.gameState.results.length !== before) {
          io.to(code).emit('game:leaderboard-update', {
            results: sortedResults(room.gameState),
            totalParticipants: room.participants.length,
          });
        }
      } else if (room.currentGame === 'nunchi' && room.status === 'playing') {
        // 이미 누른 참가자의 기록은 유지하고, 아직 안 누른 참가자가 나갔을 때만 기대 인원에서 제외
        const hadPressed = room.gameState.results.some((r) => r.id === socket.id);
        if (!hadPressed && typeof room.gameState.expectedCount === 'number') {
          room.gameState.expectedCount = Math.max(0, room.gameState.expectedCount - 1);
        }
        maybeEndNunchiRound(code, room);
      } else if (room.currentGame === 'truth-or-lie' && room.status === 'playing') {
        const gs = room.gameState;
        if (gs.phase === 'writing') {
          const hadSubmitted = gs.sentences.some((s) => s.id === socket.id);
          if (!hadSubmitted) {
            gs.expectedCount = Math.max(0, gs.expectedCount - 1);
          }
          maybeCompleteWriting(code, room);
        } else if (gs.phase === 'guessing') {
          const authorId = gs.order[gs.currentIndex];
          const hadGuessed = gs.guesses.some((g) => g.id === socket.id);
          if (socket.id !== authorId && !hadGuessed) {
            gs.expectedGuessers = Math.max(0, gs.expectedGuessers - 1);
          }
          maybeRevealRoundResult(code, room);
        }
      } else if (room.currentGame === 'bluffing-number' && room.status === 'playing') {
        const gs = room.gameState;
        const wasAlive = gs.alive.includes(socket.id);
        if (wasAlive) {
          const hadPicked = gs.picks.some((p) => p.id === socket.id);
          gs.alive = gs.alive.filter((id) => id !== socket.id);
          if (!hadPicked) {
            gs.expectedPicks = Math.max(0, gs.expectedPicks - 1);
          }
          if (gs.alive.length <= 1 && !gs.gameOver) {
            gs.gameOver = true;
            const payload = {
              round: gs.round,
              picks: [],
              eliminated: [],
              remainingCount: gs.alive.length,
              isGameOver: true,
              ...buildBluffingSummary(room, gs),
            };
            io.to(code).emit('game:round-result', payload);
            saveGameResult(code, 'bluffing-number', gs.round, payload);
          } else {
            maybeResolveBluffingRound(code, room);
          }
        }
      }
    }
  });
});
