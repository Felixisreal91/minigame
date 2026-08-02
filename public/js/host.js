const socket = io();

const params = new URLSearchParams(location.search);
const code = params.get('code');

const manageScreen = document.getElementById('manage-screen');
const gameSelectScreen = document.getElementById('game-select-screen');
const gameHostScreen = document.getElementById('game-host-screen');
const nunchiHostScreen = document.getElementById('nunchi-host-screen');

const roomCodeEl = document.getElementById('room-code');
const qrCanvas = document.getElementById('qr-canvas');
const participantListEl = document.getElementById('participant-list');
const participantCountEl = document.getElementById('participant-count');
const emptyParticipantsEl = document.getElementById('empty-participants');
const startPlayBtn = document.getElementById('start-play-btn');
const backToManageBtn = document.getElementById('back-to-manage-btn');
const gameSelectCountEl = document.getElementById('game-select-count');
const gameSelectParticipantListEl = document.getElementById('game-select-participant-list');
const gameSelectParticipantCountEl = document.getElementById('game-select-participant-count');
const gameSelectEmptyParticipantsEl = document.getElementById('game-select-empty-participants');
const gameCardStopAt7 = document.getElementById('game-card-stop-at-7');
const gameCardNunchi = document.getElementById('game-card-nunchi');
const gameSelectCodeBadge = document.getElementById('game-select-code-badge');
const gameSelectQrPopover = document.getElementById('game-select-qr-popover');
const gameSelectQrCanvas = document.getElementById('game-select-qr-canvas');

const gameHostReady = document.getElementById('game-host-ready');
const gameHostReadyMessage = document.getElementById('game-host-ready-message');
const gameHostStartBtn = document.getElementById('game-host-start-btn');
const gameHostCountdown = document.getElementById('game-host-countdown');
const gameHostCountdownNumber = document.getElementById('game-host-countdown-number');
const gameHostLeaderboard = document.getElementById('game-host-leaderboard');
const gameHostLeaderboardList = document.getElementById('game-host-leaderboard-list');
const gameHostLeaderboardCount = document.getElementById('game-host-leaderboard-count');
const gameHostLeaderboardEmpty = document.getElementById('game-host-leaderboard-empty');
const gameHostResetBtn = document.getElementById('game-host-reset-btn');
const gameHostBackBtn = document.getElementById('game-host-back-btn');

const nunchiHostReady = document.getElementById('nunchi-host-ready');
const nunchiHostStartBtn = document.getElementById('nunchi-host-start-btn');
const nunchiHostCountdown = document.getElementById('nunchi-host-countdown');
const nunchiHostCountdownNumber = document.getElementById('nunchi-host-countdown-number');
const nunchiHostProgress = document.getElementById('nunchi-host-progress');
const nunchiHostProgressText = document.getElementById('nunchi-host-progress-text');
const nunchiHostReveal = document.getElementById('nunchi-host-reveal');
const nunchiHostRevealList = document.getElementById('nunchi-host-reveal-list');
const nunchiHostResetBtn = document.getElementById('nunchi-host-reset-btn');
const nunchiHostBackBtn = document.getElementById('nunchi-host-back-btn');

let participantCount = 0;
let activeGame = null; // 'stop-at-7' | 'nunchi'
let countdownTimer = null;

if (!code) {
  alert('잘못된 접근입니다. 방을 다시 만들어주세요.');
  location.href = '/';
}

roomCodeEl.textContent = code;
gameSelectCodeBadge.textContent = code;

gameSelectCodeBadge.addEventListener('click', () => {
  gameSelectQrPopover.classList.toggle('hidden');
});

function showTopScreen(screen) {
  manageScreen.classList.toggle('hidden', screen !== 'manage');
  gameSelectScreen.classList.toggle('hidden', screen !== 'game-select');
  gameHostScreen.classList.toggle('hidden', screen !== 'game-host');
  nunchiHostScreen.classList.toggle('hidden', screen !== 'nunchi-host');
}

function showHostGameSubView(view) {
  gameHostReady.classList.toggle('hidden', view !== 'ready');
  gameHostCountdown.classList.toggle('hidden', view !== 'countdown');
  gameHostLeaderboard.classList.toggle('hidden', view !== 'leaderboard');
}

function showNunchiSubView(view) {
  nunchiHostReady.classList.toggle('hidden', view !== 'ready');
  nunchiHostCountdown.classList.toggle('hidden', view !== 'countdown');
  nunchiHostProgress.classList.toggle('hidden', view !== 'progress');
  nunchiHostReveal.classList.toggle('hidden', view !== 'reveal');
}

function renderParticipants(participants) {
  participantCount = participants.length;
  const listHtml = participants
    .map((p, i) => `<li><span class="num">${i + 1}</span>${escapeHtml(p.nickname)}</li>`)
    .join('');

  participantCountEl.textContent = `${participantCount}명`;
  emptyParticipantsEl.classList.toggle('hidden', participantCount > 0);
  participantListEl.innerHTML = listHtml;

  gameSelectCountEl.textContent = `참가자 ${participantCount}명과 함께`;
  gameSelectParticipantCountEl.textContent = `${participantCount}명`;
  gameSelectEmptyParticipantsEl.classList.toggle('hidden', participantCount > 0);
  gameSelectParticipantListEl.innerHTML = listHtml;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatSeconds(ms) {
  return `${(ms / 1000).toFixed(2)}초`;
}

function renderHostLeaderboard(results, totalParticipants) {
  gameHostLeaderboardCount.textContent = `${results.length}/${totalParticipants}명 제출`;
  gameHostLeaderboardEmpty.classList.toggle('hidden', results.length > 0);
  gameHostLeaderboardList.innerHTML = results
    .map(
      (r, i) =>
        `<li><span class="num">${i + 1}</span>${escapeHtml(r.nickname)} — ${formatSeconds(r.elapsedMs)} (${formatSeconds(r.diffMs)} 차이)</li>`
    )
    .join('');
}

function renderNunchiProgress(pressedCount, totalParticipants) {
  nunchiHostProgressText.textContent = `${pressedCount}/${totalParticipants}명 눌렀어요`;
}

function renderNunchiReveal(results) {
  const lastOrder = results.length;
  nunchiHostRevealList.innerHTML = results
    .map((r) => {
      const isLoser = r.order === lastOrder;
      return `<li class="${isLoser ? 'loser' : ''}"><span class="num">${r.order}</span>${escapeHtml(r.nickname)}${isLoser ? ' — 🫠 졌습니다!' : ''}</li>`;
    })
    .join('');
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

socket.emit('host:attach', { code }, (res) => {
  if (!res?.success) {
    alert(res?.error || '방에 연결할 수 없습니다.');
    location.href = '/';
    return;
  }
  renderParticipants(res.participants);
  if (res.status === 'game-select') {
    showTopScreen('game-select');
  } else if (res.status === 'playing' && res.gameState) {
    activeGame = res.currentGame;
    if (res.currentGame === 'stop-at-7') {
      showTopScreen('game-host');
      showHostGameSubView('leaderboard');
      renderHostLeaderboard(res.gameState.results, res.participants.length);
    } else if (res.currentGame === 'nunchi') {
      showTopScreen('nunchi-host');
      showNunchiSubView('progress');
      renderNunchiProgress(res.gameState.results.length, res.gameState.expectedCount ?? res.participants.length);
    }
  }
});

socket.on('room:update', ({ participants }) => {
  renderParticipants(participants);
});

startPlayBtn.addEventListener('click', () => {
  startPlayBtn.disabled = true;
  socket.emit('host:start-game-select', { code }, (res) => {
    startPlayBtn.disabled = false;
    if (res?.success) {
      showTopScreen('game-select');
    } else {
      alert(res?.error || '게임 선택 화면으로 이동할 수 없습니다.');
    }
  });
});

backToManageBtn.addEventListener('click', () => {
  showTopScreen('manage');
});

gameCardStopAt7.addEventListener('click', () => {
  gameCardStopAt7.disabled = true;
  socket.emit('host:launch-game', { code, game: 'stop-at-7' }, (res) => {
    gameCardStopAt7.disabled = false;
    if (res?.success) {
      activeGame = 'stop-at-7';
      showTopScreen('game-host');
      gameHostReadyMessage.textContent = '버튼을 누르면 모든 참가자가 동시에 시작합니다';
      showHostGameSubView('ready');
    } else {
      alert(res?.error || '게임을 시작할 수 없습니다.');
    }
  });
});

gameCardNunchi.addEventListener('click', () => {
  gameCardNunchi.disabled = true;
  socket.emit('host:launch-game', { code, game: 'nunchi' }, (res) => {
    gameCardNunchi.disabled = false;
    if (res?.success) {
      activeGame = 'nunchi';
      showTopScreen('nunchi-host');
      showNunchiSubView('ready');
    } else {
      alert(res?.error || '게임을 시작할 수 없습니다.');
    }
  });
});

gameHostStartBtn.addEventListener('click', () => {
  gameHostStartBtn.disabled = true;
  socket.emit('host:round-start', { code }, (res) => {
    if (!res?.success) {
      gameHostStartBtn.disabled = false;
      alert(res?.error || '라운드를 시작할 수 없습니다.');
    }
  });
});

nunchiHostStartBtn.addEventListener('click', () => {
  nunchiHostStartBtn.disabled = true;
  socket.emit('host:round-start', { code }, (res) => {
    if (!res?.success) {
      nunchiHostStartBtn.disabled = false;
      alert(res?.error || '라운드를 시작할 수 없습니다.');
    }
  });
});

socket.on('game:round-start', () => {
  if (activeGame === 'stop-at-7') {
    showHostGameSubView('countdown');
    runCountdown(gameHostCountdownNumber, () => {
      showHostGameSubView('leaderboard');
      renderHostLeaderboard([], participantCount);
    });
  } else if (activeGame === 'nunchi') {
    showNunchiSubView('countdown');
    runCountdown(nunchiHostCountdownNumber, () => {
      showNunchiSubView('progress');
      renderNunchiProgress(0, participantCount);
    });
  }
});

socket.on('game:round-reset', () => {
  clearInterval(countdownTimer);
  if (activeGame === 'stop-at-7') {
    gameHostStartBtn.disabled = false;
    gameHostReadyMessage.textContent = '버튼을 누르면 모든 참가자가 동시에 시작합니다';
    showHostGameSubView('ready');
  } else if (activeGame === 'nunchi') {
    nunchiHostStartBtn.disabled = false;
    showNunchiSubView('ready');
  }
});

socket.on('game:leaderboard-update', ({ results, totalParticipants }) => {
  renderHostLeaderboard(results, totalParticipants);
});

socket.on('game:press-update', ({ pressedCount, totalParticipants }) => {
  renderNunchiProgress(pressedCount, totalParticipants);
});

socket.on('game:round-end', ({ results }) => {
  renderNunchiReveal(results);
  showNunchiSubView('reveal');
});

gameHostResetBtn.addEventListener('click', () => {
  socket.emit('host:reset-round', { code }, (res) => {
    if (!res?.success) {
      alert(res?.error || '다시 시작할 수 없습니다.');
    }
  });
});

gameHostBackBtn.addEventListener('click', () => {
  socket.emit('host:back-to-game-select', { code }, (res) => {
    if (res?.success) {
      showTopScreen('game-select');
    } else {
      alert(res?.error || '이동할 수 없습니다.');
    }
  });
});

nunchiHostResetBtn.addEventListener('click', () => {
  socket.emit('host:reset-round', { code }, (res) => {
    if (!res?.success) {
      alert(res?.error || '다시 시작할 수 없습니다.');
    }
  });
});

nunchiHostBackBtn.addEventListener('click', () => {
  socket.emit('host:back-to-game-select', { code }, (res) => {
    if (res?.success) {
      showTopScreen('game-select');
    } else {
      alert(res?.error || '이동할 수 없습니다.');
    }
  });
});

// QR 렌더링은 마지막에: 실패해도 위의 참가자 목록/게임플레이 버튼 동작에 영향 없도록
try {
  const joinUrl = `${location.origin}/?code=${code}`;
  QRCode.toCanvas(qrCanvas, joinUrl, { width: 180, margin: 1 }, (err) => {
    if (err) console.error('QR 생성 실패:', err);
  });
  QRCode.toCanvas(gameSelectQrCanvas, joinUrl, { width: 140, margin: 1 }, (err) => {
    if (err) console.error('QR 생성 실패:', err);
  });
} catch (err) {
  console.error('QR 생성 실패:', err);
}
