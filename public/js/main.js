const socket = io();

const landingScreen = document.getElementById('landing-screen');
const waitingScreen = document.getElementById('waiting-screen');
const gameSelectMirrorScreen = document.getElementById('game-select-mirror-screen');
const gameScreen = document.getElementById('game-screen');
const nunchiScreen = document.getElementById('nunchi-screen');

const createRoomBtn = document.getElementById('create-room-btn');
const joinCodeInput = document.getElementById('join-code-input');
const joinNicknameInput = document.getElementById('join-nickname-input');
const joinRoomBtn = document.getElementById('join-room-btn');
const joinError = document.getElementById('join-error');

const waitingNickname = document.getElementById('waiting-nickname');
const waitingMessage = document.getElementById('waiting-message');

const mirrorParticipantList = document.getElementById('mirror-participant-list');
const mirrorParticipantCount = document.getElementById('mirror-participant-count');
const mirrorEmptyParticipants = document.getElementById('mirror-empty-participants');

const gameReady = document.getElementById('game-ready');
const gameReadyMessage = document.getElementById('game-ready-message');
const gameCountdown = document.getElementById('game-countdown');
const gameCountdownNumber = document.getElementById('game-countdown-number');
const gameStopwatch = document.getElementById('game-stopwatch');
const gameStopwatchTime = document.getElementById('game-stopwatch-time');
const gameStopBtn = document.getElementById('game-stop-btn');
const gameResult = document.getElementById('game-result');
const gameMyResult = document.getElementById('game-my-result');
const gameLeaderboardList = document.getElementById('game-leaderboard-list');
const gameLeaderboardCount = document.getElementById('game-leaderboard-count');

const nunchiReady = document.getElementById('nunchi-ready');
const nunchiReadyMessage = document.getElementById('nunchi-ready-message');
const nunchiCountdown = document.getElementById('nunchi-countdown');
const nunchiCountdownNumber = document.getElementById('nunchi-countdown-number');
const nunchiPress = document.getElementById('nunchi-press');
const nunchiPressBtn = document.getElementById('nunchi-press-btn');
const nunchiPressStatus = document.getElementById('nunchi-press-status');
const nunchiReveal = document.getElementById('nunchi-reveal');
const nunchiRevealList = document.getElementById('nunchi-reveal-list');

let joinedCode = null;
let activeGame = null; // 'stop-at-7' | 'nunchi'
let currentRound = null;
let countdownTimer = null;
let rafId = null;
let stopwatchStartAt = null;
let myNunchiOrder = null;

// QR 스캔으로 접속한 경우 코드 자동 채움
const params = new URLSearchParams(location.search);
const prefillCode = params.get('code');
if (prefillCode) {
  joinCodeInput.value = prefillCode;
  joinNicknameInput.focus();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatSeconds(ms) {
  return `${(ms / 1000).toFixed(2)}초`;
}

function showTopScreen(screen) {
  landingScreen.classList.toggle('hidden', screen !== 'landing');
  waitingScreen.classList.toggle('hidden', screen !== 'waiting');
  gameSelectMirrorScreen.classList.toggle('hidden', screen !== 'game-select');
  gameScreen.classList.toggle('hidden', screen !== 'stop-at-7');
  nunchiScreen.classList.toggle('hidden', screen !== 'nunchi');
}

function renderMirrorParticipants(participants) {
  mirrorParticipantCount.textContent = `${participants.length}명`;
  mirrorEmptyParticipants.classList.toggle('hidden', participants.length > 0);
  mirrorParticipantList.innerHTML = participants
    .map((p, i) => `<li><span class="num">${i + 1}</span>${escapeHtml(p.nickname)}</li>`)
    .join('');
}

function showGameSubView(view) {
  gameReady.classList.toggle('hidden', view !== 'ready');
  gameCountdown.classList.toggle('hidden', view !== 'countdown');
  gameStopwatch.classList.toggle('hidden', view !== 'stopwatch');
  gameResult.classList.toggle('hidden', view !== 'result');
}

function showNunchiSubView(view) {
  nunchiReady.classList.toggle('hidden', view !== 'ready');
  nunchiCountdown.classList.toggle('hidden', view !== 'countdown');
  nunchiPress.classList.toggle('hidden', view !== 'press');
  nunchiReveal.classList.toggle('hidden', view !== 'reveal');
}

function showActiveGameReady(message) {
  showTopScreen(activeGame);
  if (activeGame === 'stop-at-7') {
    gameReadyMessage.textContent = message;
    showGameSubView('ready');
  } else if (activeGame === 'nunchi') {
    nunchiReadyMessage.textContent = message;
    showNunchiSubView('ready');
  }
}

function runCountdown(numberEl, onDone) {
  const seq = ['3', '2', '1', '시작!'];
  let i = 0;
  numberEl.textContent = seq[i];
  countdownTimer = setInterval(() => {
    i += 1;
    if (i < seq.length) {
      numberEl.textContent = seq[i];
    } else {
      clearInterval(countdownTimer);
      onDone();
    }
  }, 700);
}

createRoomBtn.addEventListener('click', () => {
  createRoomBtn.disabled = true;
  socket.emit('host:create-room', {}, (res) => {
    if (res?.success) {
      location.href = `/host.html?code=${res.code}`;
    } else {
      createRoomBtn.disabled = false;
      alert('방 생성에 실패했습니다. 다시 시도해주세요.');
    }
  });
});

joinRoomBtn.addEventListener('click', () => {
  const code = joinCodeInput.value.trim();
  const nickname = joinNicknameInput.value.trim();
  joinError.textContent = '';

  if (code.length !== 4) {
    joinError.textContent = '방 코드 4자리를 입력해주세요.';
    return;
  }
  if (!nickname) {
    joinError.textContent = '닉네임을 입력해주세요.';
    return;
  }

  joinRoomBtn.disabled = true;
  socket.emit('player:join', { code, nickname }, (res) => {
    joinRoomBtn.disabled = false;
    if (!res?.success) {
      joinError.textContent = res?.error || '입장에 실패했습니다.';
      return;
    }

    joinedCode = code;

    if (res.status === 'playing' && res.currentGame) {
      activeGame = res.currentGame;
      showActiveGameReady('라운드 대기 중이에요. 다음 라운드에 참여할 수 있어요!');
      return;
    }

    if (res.status === 'game-select') {
      showTopScreen('game-select');
      renderMirrorParticipants(res.participants || []);
      return;
    }

    showTopScreen('waiting');
    waitingNickname.textContent = `${nickname}님`;
    waitingMessage.textContent = '호스트가 게임을 시작하길 기다리는 중...';
  });
});

socket.on('room:update', ({ participants }) => {
  renderMirrorParticipants(participants);
});

socket.on('game:select-screen', () => {
  if (!joinedCode) return;
  activeGame = null;
  showTopScreen('game-select');
});

socket.on('game:launched', ({ game }) => {
  if (!joinedCode) return;
  activeGame = game;
  showActiveGameReady('호스트가 시작하면 카운트다운이 시작돼요');
});

socket.on('game:round-start', ({ round }) => {
  if (!joinedCode) return;
  currentRound = round;
  if (activeGame === 'stop-at-7') {
    showGameSubView('countdown');
    runCountdown(gameCountdownNumber, startStopwatch);
  } else if (activeGame === 'nunchi') {
    showNunchiSubView('countdown');
    runCountdown(nunchiCountdownNumber, startNunchiPress);
  }
});

socket.on('game:round-reset', () => {
  if (!joinedCode) return;
  clearInterval(countdownTimer);
  cancelAnimationFrame(rafId);
  myNunchiOrder = null;
  showActiveGameReady('호스트가 시작하면 카운트다운이 시작돼요');
});

// ---- 7초 맞히기 ----

socket.on('game:leaderboard-update', ({ results, totalParticipants }) => {
  if (activeGame !== 'stop-at-7') return;
  renderLeaderboard(results, totalParticipants);
});

function startStopwatch() {
  showGameSubView('stopwatch');
  gameStopBtn.disabled = false;
  stopwatchStartAt = performance.now();

  const tick = () => {
    const elapsed = performance.now() - stopwatchStartAt;
    gameStopwatchTime.textContent = (elapsed / 1000).toFixed(2);
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);
}

gameStopBtn.addEventListener('click', () => {
  cancelAnimationFrame(rafId);
  gameStopBtn.disabled = true;

  const elapsedMs = performance.now() - stopwatchStartAt;
  gameMyResult.textContent = formatSeconds(elapsedMs);
  showGameSubView('result');

  socket.emit('player:submit-result', { code: joinedCode, round: currentRound, elapsedMs }, (res) => {
    if (res?.success) {
      gameMyResult.textContent = `${formatSeconds(res.elapsedMs)} · 7.00초와 ${formatSeconds(res.diffMs)} 차이`;
    }
  });
});

function renderLeaderboard(results, totalParticipants) {
  gameLeaderboardCount.textContent = `${results.length}/${totalParticipants}명 제출`;
  gameLeaderboardList.innerHTML = results
    .map(
      (r, i) =>
        `<li><span class="num">${i + 1}</span>${escapeHtml(r.nickname)} — ${formatSeconds(r.elapsedMs)} (${formatSeconds(r.diffMs)} 차이)</li>`
    )
    .join('');
}

// ---- 눈치게임 ----

function startNunchiPress() {
  showNunchiSubView('press');
  nunchiPressBtn.disabled = false;
  nunchiPressStatus.textContent = '';
}

nunchiPressBtn.addEventListener('click', () => {
  nunchiPressBtn.disabled = true;
  socket.emit('player:press', { code: joinedCode, round: currentRound }, (res) => {
    if (res?.success) {
      myNunchiOrder = res.order;
      nunchiPressStatus.textContent = `${res.order}번째로 눌렀어요!`;
    } else {
      nunchiPressStatus.textContent = res?.error || '오류가 발생했습니다.';
    }
  });
});

socket.on('game:press-update', ({ pressedCount, totalParticipants }) => {
  if (activeGame !== 'nunchi') return;
  const progress = `${pressedCount}/${totalParticipants}명 눌렀어요`;
  nunchiPressStatus.textContent = myNunchiOrder
    ? `${myNunchiOrder}번째로 눌렀어요! (${progress})`
    : progress;
});

socket.on('game:round-end', ({ results }) => {
  if (activeGame !== 'nunchi') return;
  renderNunchiReveal(results);
  showNunchiSubView('reveal');
});

function renderNunchiReveal(results) {
  const lastOrder = results.length;
  nunchiRevealList.innerHTML = results
    .map((r) => {
      const isLoser = r.order === lastOrder;
      return `<li class="${isLoser ? 'loser' : ''}"><span class="num">${r.order}</span>${escapeHtml(r.nickname)}${isLoser ? ' — 🫠 졌습니다!' : ''}</li>`;
    })
    .join('');
}
