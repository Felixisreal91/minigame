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

const tolScreen = document.getElementById('tol-screen');
const tolWriting = document.getElementById('tol-writing');
const tolWriteForm = document.getElementById('tol-write-form');
const tolWriteDone = document.getElementById('tol-write-done');
const tolWriteProgress = document.getElementById('tol-write-progress');
const tolSentenceInput = document.getElementById('tol-sentence-input');
const tolTruthBtn = document.getElementById('tol-truth-btn');
const tolLieBtn = document.getElementById('tol-lie-btn');
const tolSubmitSentenceBtn = document.getElementById('tol-submit-sentence-btn');
const tolWriteError = document.getElementById('tol-write-error');

const tolReveal = document.getElementById('tol-reveal');
const tolRoundIndicator = document.getElementById('tol-round-indicator');
const tolRevealSentence = document.getElementById('tol-reveal-sentence');
const tolGuessButtons = document.getElementById('tol-guess-buttons');
const tolGuessTrueBtn = document.getElementById('tol-guess-true-btn');
const tolGuessFalseBtn = document.getElementById('tol-guess-false-btn');
const tolAuthorWait = document.getElementById('tol-author-wait');
const tolAuthorWaitText = document.getElementById('tol-author-wait-text');
const tolGuessDone = document.getElementById('tol-guess-done');
const tolGuessProgress = document.getElementById('tol-guess-progress');

const tolResult = document.getElementById('tol-result');
const tolResultRoundIndicator = document.getElementById('tol-result-round-indicator');
const tolResultSentence = document.getElementById('tol-result-sentence');
const tolResultAnswer = document.getElementById('tol-result-answer');
const tolCorrectCount = document.getElementById('tol-correct-count');
const tolCorrectList = document.getElementById('tol-correct-list');
const tolIncorrectCount = document.getElementById('tol-incorrect-count');
const tolIncorrectList = document.getElementById('tol-incorrect-list');

const bluffingScreen = document.getElementById('bluffing-screen');
const bluffingReady = document.getElementById('bluffing-ready');
const bluffingReadyMessage = document.getElementById('bluffing-ready-message');
const bluffingPicking = document.getElementById('bluffing-picking');
const bluffingPicker = document.getElementById('bluffing-picker');
const bluffingPickerInstruction = document.getElementById('bluffing-picker-instruction');
const bluffingNumberGrid = document.getElementById('bluffing-number-grid');
const bluffingPickedWait = document.getElementById('bluffing-picked-wait');
const bluffingPickedStatus = document.getElementById('bluffing-picked-status');
const bluffingSpectateWait = document.getElementById('bluffing-spectate-wait');
const bluffingResult = document.getElementById('bluffing-result');
const bluffingRoundIndicator = document.getElementById('bluffing-round-indicator');
const bluffingPicksList = document.getElementById('bluffing-picks-list');
const bluffingEliminatedCount = document.getElementById('bluffing-eliminated-count');
const bluffingEliminatedList = document.getElementById('bluffing-eliminated-list');
const bluffingContinue = document.getElementById('bluffing-continue');
const bluffingFinal = document.getElementById('bluffing-final');
const bluffingSurvivorsList = document.getElementById('bluffing-survivors-list');
const bluffingFinalEliminatedList = document.getElementById('bluffing-final-eliminated-list');

let joinedCode = null;
let activeGame = null; // 'stop-at-7' | 'nunchi' | 'truth-or-lie' | 'bluffing-number'
let currentRound = null;
let countdownTimer = null;
let rafId = null;
let stopwatchStartAt = null;
let myNunchiOrder = null;
let tolIsTrueSelected = null;
let tolCurrentRound = null;
let tolIsAuthorThisRound = false;
let bluffingCurrentRound = null;

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
  tolScreen.classList.toggle('hidden', screen !== 'truth-or-lie');
  bluffingScreen.classList.toggle('hidden', screen !== 'bluffing-number');
}

function showBluffingSubView(view) {
  bluffingReady.classList.toggle('hidden', view !== 'ready');
  bluffingPicking.classList.toggle('hidden', view !== 'picking');
  bluffingResult.classList.toggle('hidden', view !== 'result');
}

function renderBluffingNumberGrid(min, max) {
  bluffingNumberGrid.innerHTML = '';
  for (let n = min; n <= max; n += 1) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'bluffing-number-btn';
    btn.textContent = String(n);
    btn.addEventListener('click', () => submitBluffingPick(n));
    bluffingNumberGrid.appendChild(btn);
  }
}

function submitBluffingPick(number) {
  Array.from(bluffingNumberGrid.children).forEach((b) => {
    b.disabled = true;
  });
  socket.emit('player:submit-pick', { code: joinedCode, round: bluffingCurrentRound, number }, (res) => {
    if (res?.success) {
      bluffingPicker.classList.add('hidden');
      bluffingPickedWait.classList.remove('hidden');
      bluffingPickedStatus.textContent = `${number}번을 선택했어요! 기다리는 중...`;
    } else {
      Array.from(bluffingNumberGrid.children).forEach((b) => {
        b.disabled = false;
      });
      alert(res?.error || '선택에 실패했습니다.');
    }
  });
}

function renderBluffingRoundReveal(picks, eliminated, round) {
  bluffingRoundIndicator.textContent = `${round}라운드 결과`;
  bluffingPicksList.innerHTML = picks
    .map((p, i) => `<li><span class="num">${i + 1}</span>${escapeHtml(p.nickname)} — ${p.number}</li>`)
    .join('');
  bluffingEliminatedCount.textContent = `${eliminated.length}명`;
  bluffingEliminatedList.innerHTML = eliminated
    .map((p) => `<li class="loser">${escapeHtml(p.nickname)} — ${p.number}</li>`)
    .join('');
}

function renderBluffingFinal(survivors, eliminatedLog) {
  bluffingSurvivorsList.innerHTML =
    survivors.length > 0
      ? survivors.map((n, i) => `<li><span class="num">${i + 1}</span>${escapeHtml(n)}</li>`).join('')
      : '<li>생존자가 없어요</li>';
  bluffingFinalEliminatedList.innerHTML = eliminatedLog
    .map((e) => `<li>${escapeHtml(e.nickname)} — ${e.round}라운드 탈락</li>`)
    .join('');
}

function showTolSubView(view) {
  tolWriting.classList.toggle('hidden', view !== 'writing');
  tolReveal.classList.toggle('hidden', view !== 'reveal');
  tolResult.classList.toggle('hidden', view !== 'result');
}

function resetTolWriteForm() {
  tolWriteForm.classList.remove('hidden');
  tolWriteDone.classList.add('hidden');
  tolSentenceInput.value = '';
  tolSentenceInput.disabled = false;
  tolIsTrueSelected = null;
  tolTruthBtn.classList.remove('selected');
  tolLieBtn.classList.remove('selected');
  tolSubmitSentenceBtn.disabled = false;
  tolWriteError.textContent = '';
}

function showTolSpectatorWaiting(message) {
  showTopScreen('truth-or-lie');
  showTolSubView('writing');
  tolWriteForm.classList.add('hidden');
  tolWriteDone.classList.remove('hidden');
  tolWriteProgress.textContent = message;
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
      if (activeGame === 'truth-or-lie') {
        showTolSpectatorWaiting('라운드가 진행 중이에요. 다음 라운드부터 참여할 수 있어요!');
      } else if (activeGame === 'bluffing-number') {
        showTopScreen('bluffing-number');
        showBluffingSubView('ready');
        bluffingReadyMessage.textContent = '라운드가 진행 중이에요. 다음 라운드부터 참여할 수 있어요!';
      } else {
        showActiveGameReady('라운드 대기 중이에요. 다음 라운드에 참여할 수 있어요!');
      }
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
  if (game === 'truth-or-lie') {
    showTopScreen('truth-or-lie');
    showTolSubView('writing');
    resetTolWriteForm();
  } else if (game === 'bluffing-number') {
    showTopScreen('bluffing-number');
    showBluffingSubView('ready');
    bluffingReadyMessage.textContent = '호스트가 범위를 정하고 있어요';
  } else {
    showActiveGameReady('호스트가 시작하면 카운트다운이 시작돼요');
  }
});

socket.on('game:round-start', ({ round, min, max, alive }) => {
  if (!joinedCode) return;
  currentRound = round;
  if (activeGame === 'stop-at-7') {
    showGameSubView('countdown');
    runCountdown(gameCountdownNumber, startStopwatch);
  } else if (activeGame === 'nunchi') {
    showNunchiSubView('countdown');
    runCountdown(nunchiCountdownNumber, startNunchiPress);
  } else if (activeGame === 'bluffing-number') {
    bluffingCurrentRound = round;
    showTopScreen('bluffing-number');
    showBluffingSubView('picking');
    const amIAlive = alive.includes(socket.id);
    bluffingSpectateWait.classList.toggle('hidden', amIAlive);
    bluffingPicker.classList.toggle('hidden', !amIAlive);
    bluffingPickedWait.classList.add('hidden');
    if (amIAlive) {
      bluffingPickerInstruction.textContent = `${min}~${max} 사이의 숫자를 골라주세요`;
      renderBluffingNumberGrid(min, max);
    }
  }
});

socket.on('game:round-reset', () => {
  if (!joinedCode) return;
  clearInterval(countdownTimer);
  cancelAnimationFrame(rafId);
  myNunchiOrder = null;
  if (activeGame === 'truth-or-lie') {
    showTopScreen('truth-or-lie');
    showTolSubView('writing');
    resetTolWriteForm();
  } else if (activeGame === 'bluffing-number') {
    showTopScreen('bluffing-number');
    showBluffingSubView('ready');
    bluffingReadyMessage.textContent = '호스트가 범위를 정하고 있어요';
  } else {
    showActiveGameReady('호스트가 시작하면 카운트다운이 시작돼요');
  }
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

// ---- 진실 혹은 거짓 ----

tolTruthBtn.addEventListener('click', () => {
  tolIsTrueSelected = true;
  tolTruthBtn.classList.add('selected');
  tolLieBtn.classList.remove('selected');
});

tolLieBtn.addEventListener('click', () => {
  tolIsTrueSelected = false;
  tolLieBtn.classList.add('selected');
  tolTruthBtn.classList.remove('selected');
});

tolSubmitSentenceBtn.addEventListener('click', () => {
  const sentence = tolSentenceInput.value.trim();
  tolWriteError.textContent = '';

  if (!sentence) {
    tolWriteError.textContent = '문장을 입력해주세요.';
    return;
  }
  if (sentence.length > 100) {
    tolWriteError.textContent = '100자 이하로 입력해주세요.';
    return;
  }
  if (tolIsTrueSelected === null) {
    tolWriteError.textContent = '진실인지 거짓인지 선택해주세요.';
    return;
  }

  tolSubmitSentenceBtn.disabled = true;
  socket.emit(
    'player:submit-sentence',
    { code: joinedCode, sentence, isTrue: tolIsTrueSelected },
    (res) => {
      if (res?.success) {
        tolWriteForm.classList.add('hidden');
        tolWriteDone.classList.remove('hidden');
        tolWriteProgress.textContent = '제출 완료! 다른 사람들을 기다리는 중...';
      } else {
        tolSubmitSentenceBtn.disabled = false;
        tolWriteError.textContent = res?.error || '제출에 실패했습니다.';
      }
    }
  );
});

socket.on('game:writing-progress', ({ submittedCount, totalParticipants }) => {
  if (activeGame !== 'truth-or-lie') return;
  if (!tolWriteDone.classList.contains('hidden')) {
    tolWriteProgress.textContent = `제출 완료! ${submittedCount}/${totalParticipants}명 제출됨`;
  }
});

socket.on('game:writing-complete', () => {
  if (activeGame !== 'truth-or-lie') return;
  tolWriteForm.classList.add('hidden');
  tolWriteDone.classList.remove('hidden');
  tolWriteProgress.textContent = '모든 문장이 준비됐어요! 호스트가 첫 라운드를 시작하면 시작돼요';
});

socket.on('game:round-reveal', ({ sentence, roundNumber, totalRounds, isAuthor }) => {
  if (activeGame !== 'truth-or-lie') return;
  tolCurrentRound = roundNumber;
  tolIsAuthorThisRound = isAuthor;

  tolRoundIndicator.textContent = `${roundNumber}/${totalRounds} 라운드`;
  tolRevealSentence.textContent = sentence;

  tolGuessButtons.classList.toggle('hidden', isAuthor);
  tolAuthorWait.classList.toggle('hidden', !isAuthor);
  tolAuthorWaitText.textContent = '이건 당신이 쓴 문장이에요! 다른 사람들이 맞히는 중...';
  tolGuessDone.classList.add('hidden');
  tolGuessTrueBtn.disabled = false;
  tolGuessFalseBtn.disabled = false;

  showTopScreen('truth-or-lie');
  showTolSubView('reveal');
});

function submitTolGuess(guess) {
  tolGuessTrueBtn.disabled = true;
  tolGuessFalseBtn.disabled = true;
  socket.emit('player:submit-guess', { code: joinedCode, round: tolCurrentRound, guess }, (res) => {
    if (res?.success) {
      tolGuessButtons.classList.add('hidden');
      tolGuessDone.classList.remove('hidden');
      tolGuessProgress.textContent = '답변 제출 완료! 기다리는 중...';
    } else {
      tolGuessTrueBtn.disabled = false;
      tolGuessFalseBtn.disabled = false;
      alert(res?.error || '답변 제출에 실패했습니다.');
    }
  });
}

tolGuessTrueBtn.addEventListener('click', () => submitTolGuess(true));
tolGuessFalseBtn.addEventListener('click', () => submitTolGuess(false));

socket.on('game:guess-progress', ({ answeredCount, totalParticipants }) => {
  if (activeGame !== 'truth-or-lie') return;
  const progress = `${answeredCount}/${totalParticipants}명 응답`;
  if (tolIsAuthorThisRound) {
    tolAuthorWaitText.textContent = `이건 당신이 쓴 문장이에요! 다른 사람들이 맞히는 중... (${progress})`;
  } else if (!tolGuessDone.classList.contains('hidden')) {
    tolGuessProgress.textContent = `답변 제출 완료! (${progress})`;
  }
});

socket.on('game:round-result', ({ sentence, isTrue, authorNickname, correctGuessers, incorrectGuessers, roundNumber, totalRounds }) => {
  if (activeGame !== 'truth-or-lie') return;

  tolResultRoundIndicator.textContent = `${roundNumber}/${totalRounds} 라운드`;
  tolResultSentence.textContent = sentence;
  tolResultAnswer.textContent = `정답: ${isTrue ? '진실' : '거짓'} · 작성자: ${authorNickname}`;
  tolCorrectCount.textContent = `${correctGuessers.length}명`;
  tolIncorrectCount.textContent = `${incorrectGuessers.length}명`;
  tolCorrectList.innerHTML = correctGuessers
    .map((n, i) => `<li><span class="num">${i + 1}</span>${escapeHtml(n)}</li>`)
    .join('');
  tolIncorrectList.innerHTML = incorrectGuessers
    .map((n, i) => `<li><span class="num">${i + 1}</span>${escapeHtml(n)}</li>`)
    .join('');

  showTolSubView('result');
});

// ---- 블러핑 넘버 ----

socket.on('game:pick-progress', ({ pickedCount, totalParticipants }) => {
  if (activeGame !== 'bluffing-number') return;
  if (!bluffingPickedWait.classList.contains('hidden')) {
    bluffingPickedStatus.textContent = `선택 완료! (${pickedCount}/${totalParticipants}명 선택)`;
  }
});

socket.on('game:round-result', (payload) => {
  if (activeGame !== 'bluffing-number') return;
  const { round, picks, eliminated, isGameOver, survivors, eliminatedLog } = payload;

  renderBluffingRoundReveal(picks, eliminated, round);
  bluffingContinue.classList.toggle('hidden', isGameOver);
  bluffingFinal.classList.toggle('hidden', !isGameOver);
  if (isGameOver) {
    renderBluffingFinal(survivors, eliminatedLog);
  }

  showTopScreen('bluffing-number');
  showBluffingSubView('result');
});
