const socket = io();

const params = new URLSearchParams(location.search);
const code = params.get('code');

const manageScreen = document.getElementById('manage-screen');
const gameSelectScreen = document.getElementById('game-select-screen');
const gameHostScreen = document.getElementById('game-host-screen');
const nunchiHostScreen = document.getElementById('nunchi-host-screen');
const tolHostScreen = document.getElementById('tol-host-screen');

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
const gameCardTruthOrLie = document.getElementById('game-card-truth-or-lie');
const gameCardBluffingNumber = document.getElementById('game-card-bluffing-number');
const gameCardLiarGame = document.getElementById('game-card-liar-game');
const hostCodeBadge = document.getElementById('host-code-badge');
const hostQrPopover = document.getElementById('host-qr-popover');
const hostQrPopoverCode = document.getElementById('host-qr-popover-code');
const hostQrCanvas = document.getElementById('host-qr-canvas');
const hostStopBtn = document.getElementById('host-stop-btn');

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

const tolHostWriting = document.getElementById('tol-host-writing');
const tolHostWritingProgress = document.getElementById('tol-host-writing-progress');
const tolHostWritingComplete = document.getElementById('tol-host-writing-complete');
const tolHostFirstRoundBtn = document.getElementById('tol-host-first-round-btn');
const tolHostReveal = document.getElementById('tol-host-reveal');
const tolHostRoundIndicator = document.getElementById('tol-host-round-indicator');
const tolHostRevealSentence = document.getElementById('tol-host-reveal-sentence');
const tolHostGuessProgress = document.getElementById('tol-host-guess-progress');
const tolHostResult = document.getElementById('tol-host-result');
const tolHostResultRoundIndicator = document.getElementById('tol-host-result-round-indicator');
const tolHostResultSentence = document.getElementById('tol-host-result-sentence');
const tolHostResultAnswer = document.getElementById('tol-host-result-answer');
const tolHostCorrectCount = document.getElementById('tol-host-correct-count');
const tolHostCorrectList = document.getElementById('tol-host-correct-list');
const tolHostIncorrectCount = document.getElementById('tol-host-incorrect-count');
const tolHostIncorrectList = document.getElementById('tol-host-incorrect-list');
const tolHostNextRoundBtn = document.getElementById('tol-host-next-round-btn');
const tolHostRestartBtn = document.getElementById('tol-host-restart-btn');
const tolHostBackBtn = document.getElementById('tol-host-back-btn');

const bluffingHostScreen = document.getElementById('bluffing-host-screen');
const bluffingHostRange = document.getElementById('bluffing-host-range');
const bluffingHostReady = document.getElementById('bluffing-host-ready');
const bluffingHostReadyMessage = document.getElementById('bluffing-host-ready-message');
const bluffingHostStartBtn = document.getElementById('bluffing-host-start-btn');
const bluffingHostPicking = document.getElementById('bluffing-host-picking');
const bluffingHostPickProgress = document.getElementById('bluffing-host-pick-progress');
const bluffingHostResult = document.getElementById('bluffing-host-result');
const bluffingHostRoundIndicator = document.getElementById('bluffing-host-round-indicator');
const bluffingHostPicksList = document.getElementById('bluffing-host-picks-list');
const bluffingHostEliminatedCount = document.getElementById('bluffing-host-eliminated-count');
const bluffingHostEliminatedList = document.getElementById('bluffing-host-eliminated-list');
const bluffingHostNext = document.getElementById('bluffing-host-next');
const bluffingHostNextRoundBtn = document.getElementById('bluffing-host-next-round-btn');
const bluffingHostFinal = document.getElementById('bluffing-host-final');
const bluffingHostSurvivorsList = document.getElementById('bluffing-host-survivors-list');
const bluffingHostFinalEliminatedList = document.getElementById('bluffing-host-final-eliminated-list');
const bluffingHostRestartBtn = document.getElementById('bluffing-host-restart-btn');
const bluffingHostBackBtn = document.getElementById('bluffing-host-back-btn');

const liarHostScreen = document.getElementById('liar-host-screen');
const liarHostOption = document.getElementById('liar-host-option');
const liarHostReady = document.getElementById('liar-host-ready');
const liarHostReadyMessage = document.getElementById('liar-host-ready-message');
const liarHostStartBtn = document.getElementById('liar-host-start-btn');
const liarHostVoting = document.getElementById('liar-host-voting');
const liarHostVoteProgress = document.getElementById('liar-host-vote-progress');
const liarHostResult = document.getElementById('liar-host-result');
const liarHostResultBanner = document.getElementById('liar-host-result-banner');
const liarHostResultWord = document.getElementById('liar-host-result-word');
const liarHostResultLiar = document.getElementById('liar-host-result-liar');
const liarHostVoteTallyList = document.getElementById('liar-host-vote-tally-list');
const liarHostNextRoundBtn = document.getElementById('liar-host-next-round-btn');
const liarHostBackBtn = document.getElementById('liar-host-back-btn');

let participantCount = 0;
let activeGame = null; // 'stop-at-7' | 'nunchi' | 'truth-or-lie' | 'bluffing-number' | 'liar-game'
let countdownTimer = null;
let currentTopScreen = null;

if (!code) {
  alert('잘못된 접근입니다. 방을 다시 만들어주세요.');
  location.href = '/';
}

roomCodeEl.textContent = code;
hostQrPopoverCode.textContent = code;

hostCodeBadge.addEventListener('click', () => {
  hostQrPopover.classList.toggle('hidden');
});

function showTopScreen(screen) {
  currentTopScreen = screen;
  manageScreen.classList.toggle('hidden', screen !== 'manage');
  gameSelectScreen.classList.toggle('hidden', screen !== 'game-select');
  gameHostScreen.classList.toggle('hidden', screen !== 'game-host');
  nunchiHostScreen.classList.toggle('hidden', screen !== 'nunchi-host');
  tolHostScreen.classList.toggle('hidden', screen !== 'tol-host');
  bluffingHostScreen.classList.toggle('hidden', screen !== 'bluffing-host');
  liarHostScreen.classList.toggle('hidden', screen !== 'liar-host');
  hostStopBtn.classList.toggle('hidden', screen === 'game-select' || screen === 'manage');
}

function showLiarHostSubView(view) {
  liarHostOption.classList.toggle('hidden', view !== 'option');
  liarHostReady.classList.toggle('hidden', view !== 'ready');
  liarHostVoting.classList.toggle('hidden', view !== 'voting');
  liarHostResult.classList.toggle('hidden', view !== 'result');
}

function renderLiarHostVoteProgress(votedCount, totalParticipants) {
  liarHostVoteProgress.textContent = `${votedCount}/${totalParticipants}명 투표`;
}

function renderLiarHostVoteTally(voteTally) {
  liarHostVoteTallyList.innerHTML = voteTally
    .map(
      (v) =>
        `<li class="${v.isLiar ? 'loser' : ''}">${escapeHtml(v.nickname)} — ${v.votes}표${v.isLiar ? ' (라이어)' : ''}</li>`
    )
    .join('');
}

function showBluffingHostSubView(view) {
  bluffingHostRange.classList.toggle('hidden', view !== 'range');
  bluffingHostReady.classList.toggle('hidden', view !== 'ready');
  bluffingHostPicking.classList.toggle('hidden', view !== 'picking');
  bluffingHostResult.classList.toggle('hidden', view !== 'result');
}

function renderBluffingHostPickProgress(pickedCount, totalParticipants) {
  bluffingHostPickProgress.textContent = `${pickedCount}/${totalParticipants}명 선택`;
}

function renderBluffingHostResult(round, picks, eliminated) {
  bluffingHostRoundIndicator.textContent = `${round}라운드 결과`;
  bluffingHostPicksList.innerHTML = picks
    .map((p, i) => `<li><span class="num">${i + 1}</span>${escapeHtml(p.nickname)} — ${p.number}</li>`)
    .join('');
  bluffingHostEliminatedCount.textContent = `${eliminated.length}명`;
  bluffingHostEliminatedList.innerHTML = eliminated
    .map((p) => `<li class="loser">${escapeHtml(p.nickname)} — ${p.number}</li>`)
    .join('');
}

function renderBluffingHostFinal(survivors, eliminatedLog) {
  bluffingHostSurvivorsList.innerHTML =
    survivors.length > 0
      ? survivors.map((n, i) => `<li><span class="num">${i + 1}</span>${escapeHtml(n)}</li>`).join('')
      : '<li>생존자가 없어요</li>';
  bluffingHostFinalEliminatedList.innerHTML = eliminatedLog
    .map((e) => `<li>${escapeHtml(e.nickname)} — ${e.round}라운드 탈락</li>`)
    .join('');
}

function showTolHostSubView(view) {
  tolHostWriting.classList.toggle('hidden', view !== 'writing');
  tolHostWritingComplete.classList.toggle('hidden', view !== 'writing-complete');
  tolHostReveal.classList.toggle('hidden', view !== 'reveal');
  tolHostResult.classList.toggle('hidden', view !== 'result');
}

function renderTolHostWritingProgress(submittedCount, totalParticipants) {
  tolHostWritingProgress.textContent = `${submittedCount}/${totalParticipants}명 제출`;
}

function renderTolHostGuessProgress(answeredCount, totalParticipants) {
  tolHostGuessProgress.textContent = `${answeredCount}/${totalParticipants}명 응답`;
}

function renderTolHostResult({
  sentence,
  isTrue,
  authorNickname,
  correctGuessers,
  incorrectGuessers,
  roundNumber,
  totalRounds,
  isLastRound,
}) {
  tolHostResultRoundIndicator.textContent = `${roundNumber}/${totalRounds} 라운드`;
  tolHostResultSentence.textContent = sentence;
  tolHostResultAnswer.textContent = `정답: ${isTrue ? '진실' : '거짓'} · 작성자: ${authorNickname}`;
  tolHostCorrectCount.textContent = `${correctGuessers.length}명`;
  tolHostIncorrectCount.textContent = `${incorrectGuessers.length}명`;
  tolHostCorrectList.innerHTML = correctGuessers
    .map((n, i) => `<li><span class="num">${i + 1}</span>${escapeHtml(n)}</li>`)
    .join('');
  tolHostIncorrectList.innerHTML = incorrectGuessers
    .map((n, i) => `<li><span class="num">${i + 1}</span>${escapeHtml(n)}</li>`)
    .join('');
  tolHostNextRoundBtn.classList.toggle('hidden', isLastRound);
  tolHostRestartBtn.classList.toggle('hidden', !isLastRound);
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

function renderNunchiReveal(results, eliminated) {
  const eliminatedSet = new Set(eliminated);
  nunchiHostRevealList.innerHTML = results
    .map((r) => {
      const isLoser = eliminatedSet.has(r.nickname);
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
  if (res.status === 'waiting') {
    showTopScreen('manage');
  } else if (res.status === 'game-select') {
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
    } else if (res.currentGame === 'truth-or-lie') {
      showTopScreen('tol-host');
      const gs = res.gameState;
      if (gs.phase === 'writing') {
        showTolHostSubView('writing');
        renderTolHostWritingProgress(gs.sentences.length, gs.expectedCount);
      } else if (gs.phase === 'writing-complete') {
        showTolHostSubView('writing-complete');
      } else {
        // 'guessing' 또는 'result' 중 호스트가 새로고침한 경우: 현재 문장만 복원
        const authorEntry = gs.sentences.find((s) => s.id === gs.order[gs.currentIndex]);
        tolHostRoundIndicator.textContent = `${gs.currentIndex + 1}/${gs.order.length} 라운드`;
        tolHostRevealSentence.textContent = authorEntry ? authorEntry.sentence : '';
        renderTolHostGuessProgress(gs.guesses.length, gs.expectedGuessers);
        showTolHostSubView('reveal');
      }
    } else if (res.currentGame === 'bluffing-number') {
      showTopScreen('bluffing-host');
      const gs = res.gameState;
      if (!gs.range) {
        showBluffingHostSubView('range');
      } else if (gs.round === 0) {
        showBluffingHostSubView('ready');
        bluffingHostReadyMessage.textContent = `${gs.range.min}~${gs.range.max} 사이의 숫자를 고르는 게임이에요`;
      } else {
        // 라운드 도중 호스트가 새로고침한 경우: 진행 상황만 복원
        showBluffingHostSubView('picking');
        renderBluffingHostPickProgress(gs.picks.length, gs.expectedPicks);
      }
    } else if (res.currentGame === 'liar-game') {
      showTopScreen('liar-host');
      const gs = res.gameState;
      if (gs.round === 0) {
        showLiarHostSubView('ready');
        liarHostReadyMessage.textContent = '시작을 누르면 라이어가 정해져요';
      } else if (gs.liarId) {
        // 라운드 도중 호스트가 새로고침한 경우: 진행 상황만 복원
        showLiarHostSubView('voting');
        renderLiarHostVoteProgress(gs.votes.length, gs.expectedVotes);
      } else {
        showLiarHostSubView('ready');
        liarHostReadyMessage.textContent = '시작을 누르면 라이어가 정해져요';
      }
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

gameCardTruthOrLie.addEventListener('click', () => {
  gameCardTruthOrLie.disabled = true;
  socket.emit('host:launch-game', { code, game: 'truth-or-lie' }, (res) => {
    gameCardTruthOrLie.disabled = false;
    if (res?.success) {
      activeGame = 'truth-or-lie';
      showTopScreen('tol-host');
      showTolHostSubView('writing');
      renderTolHostWritingProgress(0, participantCount);
    } else {
      alert(res?.error || '게임을 시작할 수 없습니다.');
    }
  });
});

gameCardBluffingNumber.addEventListener('click', () => {
  gameCardBluffingNumber.disabled = true;
  socket.emit('host:launch-game', { code, game: 'bluffing-number' }, (res) => {
    gameCardBluffingNumber.disabled = false;
    if (res?.success) {
      activeGame = 'bluffing-number';
      showTopScreen('bluffing-host');
      showBluffingHostSubView('range');
    } else {
      alert(res?.error || '게임을 시작할 수 없습니다.');
    }
  });
});

document.querySelectorAll('.bluffing-range-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const max = Number(btn.dataset.max);
    document.querySelectorAll('.bluffing-range-btn').forEach((b) => {
      b.disabled = true;
    });
    socket.emit('host:select-range', { code, max }, (res) => {
      document.querySelectorAll('.bluffing-range-btn').forEach((b) => {
        b.disabled = false;
      });
      if (res?.success) {
        showBluffingHostSubView('ready');
        bluffingHostReadyMessage.textContent = `1~${max} 사이의 숫자를 고르는 게임이에요`;
      } else {
        alert(res?.error || '범위를 선택할 수 없습니다.');
      }
    });
  });
});

gameCardLiarGame.addEventListener('click', () => {
  gameCardLiarGame.disabled = true;
  socket.emit('host:launch-game', { code, game: 'liar-game' }, (res) => {
    gameCardLiarGame.disabled = false;
    if (res?.success) {
      activeGame = 'liar-game';
      showTopScreen('liar-host');
      showLiarHostSubView('option');
    } else {
      alert(res?.error || '게임을 시작할 수 없습니다.');
    }
  });
});

document.querySelectorAll('.liar-option-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const revealCategory = btn.dataset.reveal === 'true';
    document.querySelectorAll('.liar-option-btn').forEach((b) => {
      b.disabled = true;
    });
    socket.emit('host:set-liar-option', { code, revealCategory }, (res) => {
      document.querySelectorAll('.liar-option-btn').forEach((b) => {
        b.disabled = false;
      });
      if (res?.success) {
        showLiarHostSubView('ready');
        liarHostReadyMessage.textContent = '시작을 누르면 라이어가 정해져요';
      } else {
        alert(res?.error || '옵션을 설정할 수 없습니다.');
      }
    });
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

function requestRoundStart(triggerBtn) {
  triggerBtn.disabled = true;
  socket.emit('host:round-start', { code }, (res) => {
    triggerBtn.disabled = false;
    if (!res?.success) {
      alert(res?.error || '라운드를 시작할 수 없습니다.');
    }
  });
}

bluffingHostStartBtn.addEventListener('click', () => requestRoundStart(bluffingHostStartBtn));
bluffingHostNextRoundBtn.addEventListener('click', () => requestRoundStart(bluffingHostNextRoundBtn));
liarHostStartBtn.addEventListener('click', () => requestRoundStart(liarHostStartBtn));
liarHostNextRoundBtn.addEventListener('click', () => requestRoundStart(liarHostNextRoundBtn));

function requestTolNextRound() {
  socket.emit('host:next-round', { code }, (res) => {
    if (!res?.success) {
      alert(res?.error || '다음 라운드로 넘어갈 수 없습니다.');
    }
  });
}

tolHostFirstRoundBtn.addEventListener('click', requestTolNextRound);
tolHostNextRoundBtn.addEventListener('click', requestTolNextRound);

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
  } else if (activeGame === 'bluffing-number') {
    showBluffingHostSubView('picking');
    renderBluffingHostPickProgress(0, participantCount);
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
  } else if (activeGame === 'truth-or-lie') {
    showTolHostSubView('writing');
    renderTolHostWritingProgress(0, participantCount);
  } else if (activeGame === 'bluffing-number') {
    showBluffingHostSubView('range');
  } else if (activeGame === 'liar-game') {
    liarHostStartBtn.disabled = false;
    liarHostReadyMessage.textContent = '시작을 누르면 라이어가 정해져요';
    showLiarHostSubView('ready');
  }
});

socket.on('game:leaderboard-update', ({ results, totalParticipants }) => {
  renderHostLeaderboard(results, totalParticipants);
});

socket.on('game:press-update', ({ pressedCount, totalParticipants }) => {
  renderNunchiProgress(pressedCount, totalParticipants);
});

socket.on('game:round-end', ({ results, eliminated }) => {
  renderNunchiReveal(results, eliminated);
  showNunchiSubView('reveal');
});

socket.on('game:writing-progress', ({ submittedCount, totalParticipants }) => {
  if (activeGame !== 'truth-or-lie') return;
  renderTolHostWritingProgress(submittedCount, totalParticipants);
});

socket.on('game:writing-complete', () => {
  if (activeGame !== 'truth-or-lie') return;
  showTolHostSubView('writing-complete');
});

socket.on('game:round-reveal', ({ sentence, roundNumber, totalRounds }) => {
  if (activeGame !== 'truth-or-lie') return;
  tolHostRoundIndicator.textContent = `${roundNumber}/${totalRounds} 라운드`;
  tolHostRevealSentence.textContent = sentence;
  renderTolHostGuessProgress(0, participantCount);
  showTolHostSubView('reveal');
});

socket.on('game:guess-progress', ({ answeredCount, totalParticipants }) => {
  if (activeGame !== 'truth-or-lie') return;
  renderTolHostGuessProgress(answeredCount, totalParticipants);
});

socket.on('game:round-result', (payload) => {
  if (activeGame !== 'truth-or-lie') return;
  renderTolHostResult(payload);
  showTolHostSubView('result');
});

socket.on('game:pick-progress', ({ pickedCount, totalParticipants }) => {
  if (activeGame !== 'bluffing-number') return;
  renderBluffingHostPickProgress(pickedCount, totalParticipants);
});

socket.on('game:round-result', (payload) => {
  if (activeGame !== 'bluffing-number') return;
  const { round, picks, eliminated, isGameOver, survivors, eliminatedLog } = payload;

  renderBluffingHostResult(round, picks, eliminated);
  bluffingHostNext.classList.toggle('hidden', isGameOver);
  bluffingHostFinal.classList.toggle('hidden', !isGameOver);
  if (isGameOver) {
    renderBluffingHostFinal(survivors, eliminatedLog);
  }

  showBluffingHostSubView('result');
});

socket.on('game:liar-round-start', () => {
  if (activeGame !== 'liar-game') return;
  showLiarHostSubView('voting');
  renderLiarHostVoteProgress(0, participantCount);
});

socket.on('game:vote-progress', ({ votedCount, totalParticipants }) => {
  if (activeGame !== 'liar-game') return;
  renderLiarHostVoteProgress(votedCount, totalParticipants);
});

socket.on('game:round-result', ({ category, word, liarNickname, voteTally, participantsWin }) => {
  if (activeGame !== 'liar-game') return;
  liarHostResultBanner.textContent = participantsWin ? '🎉 참가자 승!' : '🤥 라이어 승!';
  liarHostResultWord.textContent = `${word} (${category})`;
  liarHostResultLiar.textContent = `라이어는 ${liarNickname}였습니다`;
  renderLiarHostVoteTally(voteTally);
  showLiarHostSubView('result');
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

tolHostRestartBtn.addEventListener('click', () => {
  socket.emit('host:reset-round', { code }, (res) => {
    if (!res?.success) {
      alert(res?.error || '다시 시작할 수 없습니다.');
    }
  });
});

tolHostBackBtn.addEventListener('click', () => {
  socket.emit('host:back-to-game-select', { code }, (res) => {
    if (res?.success) {
      showTopScreen('game-select');
    } else {
      alert(res?.error || '이동할 수 없습니다.');
    }
  });
});

bluffingHostRestartBtn.addEventListener('click', () => {
  socket.emit('host:reset-round', { code }, (res) => {
    if (!res?.success) {
      alert(res?.error || '다시 시작할 수 없습니다.');
    }
  });
});

bluffingHostBackBtn.addEventListener('click', () => {
  socket.emit('host:back-to-game-select', { code }, (res) => {
    if (res?.success) {
      showTopScreen('game-select');
    } else {
      alert(res?.error || '이동할 수 없습니다.');
    }
  });
});

liarHostBackBtn.addEventListener('click', () => {
  socket.emit('host:back-to-game-select', { code }, (res) => {
    if (res?.success) {
      showTopScreen('game-select');
    } else {
      alert(res?.error || '이동할 수 없습니다.');
    }
  });
});

hostStopBtn.addEventListener('click', () => {
  const isMidGame = ['game-host', 'nunchi-host', 'tol-host', 'bluffing-host', 'liar-host'].includes(currentTopScreen);
  if (isMidGame && !confirm('진행 중인 게임을 중단하고 게임 선택 화면으로 돌아갈까요?')) {
    return;
  }
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
  QRCode.toCanvas(hostQrCanvas, joinUrl, { width: 140, margin: 1 }, (err) => {
    if (err) console.error('QR 생성 실패:', err);
  });
} catch (err) {
  console.error('QR 생성 실패:', err);
}
