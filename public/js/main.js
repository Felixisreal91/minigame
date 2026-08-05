const socket = io();

const landingScreen = document.getElementById('landing-screen');
const waitingScreen = document.getElementById('waiting-screen');
const gameSelectMirrorScreen = document.getElementById('game-select-mirror-screen');
const gameScreen = document.getElementById('game-screen');
const lightScreen = document.getElementById('light-screen');
const nunchiScreen = document.getElementById('nunchi-screen');

const createRoomBtn = document.getElementById('create-room-btn');
const joinCodeInput = document.getElementById('join-code-input');
const joinNicknameInput = document.getElementById('join-nickname-input');
const joinRoomBtn = document.getElementById('join-room-btn');
const joinError = document.getElementById('join-error');
const clearCacheBtn = document.getElementById('clear-cache-btn');

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

const lightReady = document.getElementById('light-ready');
const lightPlaying = document.getElementById('light-playing');
const lightIndicator = document.getElementById('light-indicator');
const lightTapBtn = document.getElementById('light-tap-btn');
const lightStatusText = document.getElementById('light-status-text');
const lightResult = document.getElementById('light-result');
const lightResultBanner = document.getElementById('light-result-banner');
const lightResultEliminated = document.getElementById('light-result-eliminated');
const lightReactionList = document.getElementById('light-reaction-list');

const indianScreen = document.getElementById('indian-poker-screen');
const indianReady = document.getElementById('indian-poker-ready');
const indianPlaying = document.getElementById('indian-poker-playing');
const indianOthersList = document.getElementById('indian-poker-others-list');
const indianGoBtn = document.getElementById('indian-poker-go-btn');
const indianStopBtn = document.getElementById('indian-poker-stop-btn');
const indianStatusText = document.getElementById('indian-poker-status-text');
const indianResult = document.getElementById('indian-poker-result');
const indianResultBanner = document.getElementById('indian-poker-result-banner');
const indianRevealList = document.getElementById('indian-poker-reveal-list');

const mbtiScreen = document.getElementById('mbti-screen');
const mbtiReady = document.getElementById('mbti-ready');
const mbtiTargetForm = document.getElementById('mbti-target-form');
const mbtiAnswerForm = document.getElementById('mbti-answer-form');
const mbtiAnswerSubmitBtn = document.getElementById('mbti-answer-submit-btn');
const mbtiAnswerWait = document.getElementById('mbti-answer-wait');
const mbtiAnswerWaitText = document.getElementById('mbti-answer-wait-text');
const mbtiGuessing = document.getElementById('mbti-guessing');
const mbtiGuessButtons = document.getElementById('mbti-guess-buttons');
const mbtiGuessTargetName = document.getElementById('mbti-guess-target-name');
const mbtiGuessTitle = document.getElementById('mbti-guess-title');
const mbtiGuessOption0 = document.getElementById('mbti-guess-option-0');
const mbtiGuessOption1 = document.getElementById('mbti-guess-option-1');
const mbtiGuessDone = document.getElementById('mbti-guess-done');
const mbtiGuessTargetWait = document.getElementById('mbti-guess-target-wait');
const mbtiResult = document.getElementById('mbti-result');
const mbtiResultBanner = document.getElementById('mbti-result-banner');
const mbtiResultAxis = document.getElementById('mbti-result-axis');
const mbtiResultList = document.getElementById('mbti-result-list');
const mbtiScoreboardList = document.getElementById('mbti-scoreboard-list');
const mbtiResultWaitText = document.getElementById('mbti-result-wait-text');

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

const liarScreen = document.getElementById('liar-screen');
const liarReady = document.getElementById('liar-ready');
const liarReadyMessage = document.getElementById('liar-ready-message');
const liarVoting = document.getElementById('liar-voting');
const liarRoleMessage = document.getElementById('liar-role-message');
const liarRoleSub = document.getElementById('liar-role-sub');
const liarVoteButtons = document.getElementById('liar-vote-buttons');
const liarVoteList = document.getElementById('liar-vote-list');
const liarVoteDone = document.getElementById('liar-vote-done');
const liarVoteStatus = document.getElementById('liar-vote-status');
const liarResult = document.getElementById('liar-result');
const liarResultBanner = document.getElementById('liar-result-banner');
const liarResultPersonal = document.getElementById('liar-result-personal');
const liarResultWord = document.getElementById('liar-result-word');
const liarResultLiar = document.getElementById('liar-result-liar');
const liarVoteTallyList = document.getElementById('liar-vote-tally-list');

let joinedCode = null;
let myNickname = null;
let activeGame = null; // 'stop-at-7' | 'nunchi' | 'truth-or-lie' | 'bluffing-number' | 'liar-game'
let currentRound = null;
let countdownTimer = null;
let rafId = null;
let stopwatchStartAt = null;
let myNunchiOrder = null;
let tolIsTrueSelected = null;
let tolCurrentRound = null;
let tolIsAuthorThisRound = false;
let bluffingCurrentRound = null;
let liarCurrentRound = null;
let liarIsLiar = false;
let lightCurrentRound = null;
let lightHasTapped = false;
let indianCurrentRound = null;
let indianHasChosen = false;
let mbtiIsTarget = false;
let mbtiAnswerSelections = {};
let mbtiStageIndex = null;
let mbtiHasGuessed = false;

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
  liarScreen.classList.toggle('hidden', screen !== 'liar-game');
  lightScreen.classList.toggle('hidden', screen !== 'traffic-light');
  indianScreen.classList.toggle('hidden', screen !== 'indian-poker');
  mbtiScreen.classList.toggle('hidden', screen !== 'mbti-guess');
}

function showLightSubView(view) {
  lightReady.classList.toggle('hidden', view !== 'ready');
  lightPlaying.classList.toggle('hidden', view !== 'playing');
  lightResult.classList.toggle('hidden', view !== 'result');
}

function startLightPlaying() {
  lightHasTapped = false;
  lightTapBtn.disabled = false;
  lightTapBtn.classList.remove('light-btn--red');
  lightTapBtn.classList.add('light-btn--green');
  lightIndicator.textContent = '🟢';
  lightStatusText.textContent = '지금 누르면 탈락이에요!';
  showTopScreen('traffic-light');
  showLightSubView('playing');
}

function renderLightResult({ reason, eliminatedNickname, taps }) {
  const iAmEliminated = eliminatedNickname === myNickname;
  if (reason === 'early') {
    lightResultBanner.textContent = iAmEliminated ? '😱 초록불에 눌렀어요!' : '😱 초록불에 눌러서 탈락!';
  } else {
    lightResultBanner.textContent = iAmEliminated ? '🐌 가장 늦게 눌렀어요!' : '🐌 가장 늦게 눌러서 탈락!';
  }
  lightResultEliminated.textContent = `${eliminatedNickname}님 탈락`;
  lightReactionList.innerHTML = taps
    .map((t) => {
      const isLoser = t.nickname === eliminatedNickname;
      return `<li class="${isLoser ? 'loser' : ''}">${escapeHtml(t.nickname)} — ${t.reactionMs}ms</li>`;
    })
    .join('');
}

function showIndianSubView(view) {
  indianReady.classList.toggle('hidden', view !== 'ready');
  indianPlaying.classList.toggle('hidden', view !== 'playing');
  indianResult.classList.toggle('hidden', view !== 'result');
}

function renderIndianOthers(others) {
  indianOthersList.innerHTML = others
    .map((o) => `<li>${escapeHtml(o.nickname)} — <strong>${o.number}</strong></li>`)
    .join('');
}

function renderIndianResult({ reveal, winnerNickname }) {
  if (winnerNickname) {
    indianResultBanner.textContent =
      winnerNickname === myNickname ? '🏆 당신이 승리했어요!' : `🏆 ${winnerNickname}님 승리!`;
  } else {
    indianResultBanner.textContent = '승자가 없어요 (전원 Stop)';
  }
  indianRevealList.innerHTML = reveal
    .map((r) => {
      const isWinner = r.nickname === winnerNickname;
      const choiceLabel = r.choice === 'go' ? 'GO' : r.choice === 'stop' ? 'STOP' : '미선택';
      return `<li class="${isWinner ? 'winner' : ''}">${escapeHtml(r.nickname)} — ${r.number} (${choiceLabel})</li>`;
    })
    .join('');
}

function showMbtiSubView(view) {
  mbtiReady.classList.toggle('hidden', view !== 'ready');
  mbtiTargetForm.classList.toggle('hidden', view !== 'target-form');
  mbtiGuessing.classList.toggle('hidden', view !== 'guessing');
  mbtiResult.classList.toggle('hidden', view !== 'result');
}

function resetMbtiAnswerForm() {
  mbtiAnswerSelections = {};
  document.querySelectorAll('.mbti-answer-btn').forEach((btn) => {
    btn.classList.remove('selected');
    btn.disabled = false;
  });
  mbtiAnswerSubmitBtn.disabled = true;
}

function showMbtiTargetFormRole(targetNickname) {
  mbtiAnswerForm.classList.toggle('hidden', !mbtiIsTarget);
  mbtiAnswerWait.classList.toggle('hidden', mbtiIsTarget);
  if (!mbtiIsTarget) {
    mbtiAnswerWaitText.textContent = `${targetNickname}님이 자신의 MBTI를 입력하는 중이에요...`;
  } else {
    resetMbtiAnswerForm();
  }
  showMbtiSubView('target-form');
}

function showMbtiGuessingRole({ title, options, targetNickname }) {
  mbtiHasGuessed = false;
  mbtiGuessButtons.classList.toggle('hidden', mbtiIsTarget);
  mbtiGuessDone.classList.add('hidden');
  mbtiGuessTargetWait.classList.toggle('hidden', !mbtiIsTarget);
  if (!mbtiIsTarget) {
    mbtiGuessTargetName.textContent = `${targetNickname}님의 MBTI를 맞혀보세요`;
    mbtiGuessTitle.textContent = title;
    mbtiGuessOption0.textContent = options[0];
    mbtiGuessOption1.textContent = options[1];
    mbtiGuessOption0.disabled = false;
    mbtiGuessOption1.disabled = false;
  }
  showMbtiSubView('guessing');
}

function renderMbtiResult({ axisKey, correctLetter, targetNickname, results, scoreboard, isLastStage }) {
  const myResult = results.find((r) => r.nickname === myNickname);
  if (mbtiIsTarget) {
    mbtiResultBanner.textContent = isLastStage ? '🎉 최종 결과!' : `정답: ${correctLetter}`;
  } else if (myResult) {
    mbtiResultBanner.textContent = myResult.correct ? '정답! 🎉' : '아쉬워요 😅';
  } else {
    mbtiResultBanner.textContent = `정답: ${correctLetter}`;
  }
  mbtiResultAxis.textContent = `${targetNickname}님의 ${axisKey.toUpperCase()} 정답은 ${correctLetter}`;
  mbtiResultList.innerHTML = results
    .map((r) => `<li class="${r.correct ? 'winner' : 'loser'}">${escapeHtml(r.nickname)} — ${r.guess} ${r.correct ? '✅' : '❌'}</li>`)
    .join('');
  mbtiScoreboardList.innerHTML = scoreboard
    .map((s, i) => `<li><span class="num">${i + 1}</span>${escapeHtml(s.nickname)} — ${s.correctCount}개 정답</li>`)
    .join('');
  mbtiResultWaitText.textContent = isLastStage
    ? '호스트가 다음 라운드를 준비하고 있어요'
    : '호스트가 다음 단계를 준비하고 있어요';
  showMbtiSubView('result');
}

function showLiarSubView(view) {
  liarReady.classList.toggle('hidden', view !== 'ready');
  liarVoting.classList.toggle('hidden', view !== 'voting');
  liarResult.classList.toggle('hidden', view !== 'result');
}

function renderLiarVoteList(participants) {
  liarVoteList.innerHTML = '';
  participants
    .filter((p) => p.id !== socket.id)
    .forEach((p) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ghost liar-vote-btn';
      btn.textContent = p.nickname;
      btn.addEventListener('click', () => submitLiarVote(p.id));
      liarVoteList.appendChild(btn);
    });
}

function submitLiarVote(votedForId) {
  Array.from(liarVoteList.children).forEach((b) => {
    b.disabled = true;
  });
  socket.emit('player:submit-vote', { code: joinedCode, round: liarCurrentRound, votedForId }, (res) => {
    if (res?.success) {
      liarVoteButtons.classList.add('hidden');
      liarVoteDone.classList.remove('hidden');
      liarVoteStatus.textContent = '투표 완료! 기다리는 중...';
    } else {
      Array.from(liarVoteList.children).forEach((b) => {
        b.disabled = false;
      });
      alert(res?.error || '투표에 실패했습니다.');
    }
  });
}

function renderLiarVoteTally(voteTally) {
  liarVoteTallyList.innerHTML = voteTally
    .map(
      (v) =>
        `<li class="${v.isLiar ? 'loser' : ''}">${escapeHtml(v.nickname)} — ${v.votes}표${v.isLiar ? ' (라이어)' : ''}</li>`
    )
    .join('');
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

clearCacheBtn.addEventListener('click', async () => {
  clearCacheBtn.disabled = true;
  try {
    localStorage.clear();
    sessionStorage.clear();
    if (window.caches) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
    if (navigator.serviceWorker) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((reg) => reg.unregister()));
    }
  } catch (err) {
    console.error('캐시 삭제 중 오류:', err);
  }
  location.href = `${location.pathname}?t=${Date.now()}`;
});

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

const PARTICIPANT_SESSION_KEY = 'minigame:participant';

function persistJoinSession(code, nickname) {
  try {
    localStorage.setItem(PARTICIPANT_SESSION_KEY, JSON.stringify({ code, nickname }));
  } catch (err) {
    // localStorage 사용 불가 환경(프라이빗 모드 등) - 새로고침 복원만 안 될 뿐 기능에는 영향 없음
  }
}

function clearJoinSession() {
  try {
    localStorage.removeItem(PARTICIPANT_SESSION_KEY);
  } catch (err) {
    // 무시
  }
}

function applyJoinResult(res, code, nickname) {
  joinedCode = code;
  myNickname = nickname;

  if (res.status === 'playing' && res.currentGame) {
    activeGame = res.currentGame;
    if (activeGame === 'truth-or-lie') {
      showTolSpectatorWaiting('라운드가 진행 중이에요. 다음 라운드부터 참여할 수 있어요!');
    } else if (activeGame === 'bluffing-number') {
      showTopScreen('bluffing-number');
      showBluffingSubView('ready');
      bluffingReadyMessage.textContent = '라운드가 진행 중이에요. 다음 라운드부터 참여할 수 있어요!';
    } else if (activeGame === 'liar-game') {
      showTopScreen('liar-game');
      showLiarSubView('ready');
      liarReadyMessage.textContent = '라운드가 진행 중이에요. 다음 라운드부터 참여할 수 있어요!';
    } else if (activeGame === 'traffic-light') {
      showTopScreen('traffic-light');
      showLightSubView('ready');
    } else if (activeGame === 'indian-poker') {
      showTopScreen('indian-poker');
      showIndianSubView('ready');
    } else if (activeGame === 'mbti-guess') {
      showTopScreen('mbti-guess');
      showMbtiSubView('ready');
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
}

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
    persistJoinSession(code, nickname);
    applyJoinResult(res, code, nickname);
  });
});

// 새로고침 시 이전 세션(방 코드+닉네임)이 남아있으면 조용히 자동 재입장 시도
(function restoreParticipantSession() {
  const revealPage = () => document.documentElement.classList.remove('restoring');

  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(PARTICIPANT_SESSION_KEY) || 'null');
  } catch (err) {
    saved = null;
  }
  if (!saved?.code || !saved?.nickname) {
    revealPage();
    return;
  }

  // 서버 응답이 지연되거나 오지 않는 경우를 대비한 안전장치 (화면이 계속 숨겨진 채로 남지 않도록)
  const safetyTimer = setTimeout(revealPage, 4000);

  socket.emit('player:join', { code: saved.code, nickname: saved.nickname }, (res) => {
    clearTimeout(safetyTimer);
    if (!res?.success) {
      clearJoinSession();
      revealPage();
      return;
    }
    applyJoinResult(res, saved.code, saved.nickname);
    revealPage();
  });
})();

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
  } else if (game === 'liar-game') {
    showTopScreen('liar-game');
    showLiarSubView('ready');
    liarReadyMessage.textContent = '호스트가 준비 중이에요';
  } else if (game === 'traffic-light') {
    showTopScreen('traffic-light');
    showLightSubView('ready');
  } else if (game === 'indian-poker') {
    showTopScreen('indian-poker');
    showIndianSubView('ready');
  } else if (game === 'mbti-guess') {
    showTopScreen('mbti-guess');
    showMbtiSubView('ready');
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
  } else if (activeGame === 'traffic-light') {
    lightCurrentRound = round;
    startLightPlaying();
  }
});

socket.on('game:light-turned-red', () => {
  if (activeGame !== 'traffic-light' || lightHasTapped) return;
  lightTapBtn.classList.remove('light-btn--green');
  lightTapBtn.classList.add('light-btn--red');
  lightIndicator.textContent = '🔴';
  lightStatusText.textContent = '지금 누르세요!';
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
  } else if (activeGame === 'liar-game') {
    showTopScreen('liar-game');
    showLiarSubView('ready');
    liarReadyMessage.textContent = '호스트가 다음 라운드를 준비하고 있어요';
  } else if (activeGame === 'traffic-light') {
    showTopScreen('traffic-light');
    showLightSubView('ready');
  } else if (activeGame === 'indian-poker') {
    showTopScreen('indian-poker');
    showIndianSubView('ready');
  } else if (activeGame === 'mbti-guess') {
    showTopScreen('mbti-guess');
    showMbtiSubView('ready');
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

socket.on('game:round-end', ({ results, eliminated }) => {
  if (activeGame !== 'nunchi') return;
  renderNunchiReveal(results, eliminated);
  showNunchiSubView('reveal');
});

// ---- 신호등 게임 ----

lightTapBtn.addEventListener('click', () => {
  if (lightHasTapped) return;
  lightHasTapped = true;
  lightTapBtn.disabled = true;
  lightStatusText.textContent = '제출함, 결과 기다리는 중...';
  socket.emit('player:tap-light', { code: joinedCode, round: lightCurrentRound }, (res) => {
    if (!res?.success) {
      lightHasTapped = false;
      lightTapBtn.disabled = false;
      lightStatusText.textContent = res?.error || '오류가 발생했습니다.';
    }
  });
});

socket.on('game:round-result', (payload) => {
  if (activeGame !== 'traffic-light') return;
  renderLightResult(payload);
  showLightSubView('result');
});

// ---- 인디언 포커 ----

socket.on('game:indian-poker-round-start', ({ round, others }) => {
  if (!joinedCode) return;
  activeGame = 'indian-poker';
  indianCurrentRound = round;
  indianHasChosen = false;
  indianGoBtn.disabled = false;
  indianStopBtn.disabled = false;
  indianStatusText.classList.add('hidden');
  renderIndianOthers(others);
  showTopScreen('indian-poker');
  showIndianSubView('playing');
});

function submitIndianChoice(choice) {
  if (indianHasChosen) return;
  indianHasChosen = true;
  indianGoBtn.disabled = true;
  indianStopBtn.disabled = true;
  socket.emit('player:submit-choice', { code: joinedCode, round: indianCurrentRound, choice }, (res) => {
    if (res?.success) {
      indianStatusText.classList.remove('hidden');
      indianStatusText.textContent = `${choice === 'go' ? 'GO' : 'STOP'} 선택 완료! 기다리는 중...`;
    } else {
      indianHasChosen = false;
      indianGoBtn.disabled = false;
      indianStopBtn.disabled = false;
      alert(res?.error || '선택에 실패했습니다.');
    }
  });
}

indianGoBtn.addEventListener('click', () => submitIndianChoice('go'));
indianStopBtn.addEventListener('click', () => submitIndianChoice('stop'));

socket.on('game:round-result', (payload) => {
  if (activeGame !== 'indian-poker') return;
  renderIndianResult(payload);
  showIndianSubView('result');
});

// ---- MBTI 맞히기 ----

socket.on('game:mbti-target-selected', ({ targetId, targetNickname }) => {
  if (!joinedCode) return;
  activeGame = 'mbti-guess';
  mbtiIsTarget = targetId === socket.id;
  showTopScreen('mbti-guess');
  showMbtiTargetFormRole(targetNickname);
});

document.querySelectorAll('.mbti-answer-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const axis = btn.dataset.axis;
    mbtiAnswerSelections[axis] = btn.dataset.value;
    document.querySelectorAll(`.mbti-answer-btn[data-axis="${axis}"]`).forEach((b) => {
      b.classList.toggle('selected', b === btn);
    });
    mbtiAnswerSubmitBtn.disabled = !['ei', 'sn', 'ft', 'pj'].every((a) => mbtiAnswerSelections[a]);
  });
});

mbtiAnswerSubmitBtn.addEventListener('click', () => {
  mbtiAnswerSubmitBtn.disabled = true;
  document.querySelectorAll('.mbti-answer-btn').forEach((b) => {
    b.disabled = true;
  });
  socket.emit(
    'player:submit-mbti-answer',
    {
      code: joinedCode,
      ei: mbtiAnswerSelections.ei,
      sn: mbtiAnswerSelections.sn,
      ft: mbtiAnswerSelections.ft,
      pj: mbtiAnswerSelections.pj,
    },
    (res) => {
      if (!res?.success) {
        mbtiAnswerSubmitBtn.disabled = false;
        document.querySelectorAll('.mbti-answer-btn').forEach((b) => {
          b.disabled = false;
        });
        alert(res?.error || '제출에 실패했습니다.');
      }
    }
  );
});

socket.on('game:mbti-stage-start', ({ stageIndex, title, options, targetNickname }) => {
  if (activeGame !== 'mbti-guess') return;
  mbtiStageIndex = stageIndex;
  showMbtiGuessingRole({ title, options, targetNickname });
});

function submitMbtiGuess(guess) {
  if (mbtiHasGuessed) return;
  mbtiHasGuessed = true;
  mbtiGuessOption0.disabled = true;
  mbtiGuessOption1.disabled = true;
  socket.emit('player:submit-mbti-guess', { code: joinedCode, stageIndex: mbtiStageIndex, guess }, (res) => {
    if (res?.success) {
      mbtiGuessButtons.classList.add('hidden');
      mbtiGuessDone.classList.remove('hidden');
    } else {
      mbtiHasGuessed = false;
      mbtiGuessOption0.disabled = false;
      mbtiGuessOption1.disabled = false;
      alert(res?.error || '선택에 실패했습니다.');
    }
  });
}

mbtiGuessOption0.addEventListener('click', () => submitMbtiGuess(mbtiGuessOption0.textContent));
mbtiGuessOption1.addEventListener('click', () => submitMbtiGuess(mbtiGuessOption1.textContent));

socket.on('game:round-result', (payload) => {
  if (activeGame !== 'mbti-guess') return;
  renderMbtiResult(payload);
});

function renderNunchiReveal(results, eliminated) {
  const eliminatedSet = new Set(eliminated);
  nunchiRevealList.innerHTML = results
    .map((r) => {
      const isLoser = eliminatedSet.has(r.nickname);
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

// ---- 라이어 게임 ----

socket.on('game:liar-round-start', ({ round, isLiar, category, word, participants }) => {
  if (activeGame !== 'liar-game') return;
  liarCurrentRound = round;
  liarIsLiar = isLiar;

  if (isLiar) {
    liarRoleMessage.textContent = '당신이 라이어입니다! 🤫';
    liarRoleSub.textContent = category ? `카테고리: ${category}` : '아무 정보도 없어요. 잘 숨어보세요!';
  } else {
    liarRoleMessage.textContent = `제시어: ${word}`;
    liarRoleSub.textContent = `카테고리: ${category}`;
  }

  liarVoteButtons.classList.remove('hidden');
  liarVoteDone.classList.add('hidden');
  renderLiarVoteList(participants);

  showTopScreen('liar-game');
  showLiarSubView('voting');
});

socket.on('game:vote-progress', ({ votedCount, totalParticipants }) => {
  if (activeGame !== 'liar-game') return;
  if (!liarVoteDone.classList.contains('hidden')) {
    liarVoteStatus.textContent = `투표 완료! (${votedCount}/${totalParticipants}명 투표)`;
  }
});

socket.on('game:round-result', ({ category, word, liarNickname, voteTally, participantsWin }) => {
  if (activeGame !== 'liar-game') return;

  liarResultBanner.textContent = participantsWin ? '🎉 참가자 승!' : '🤥 라이어 승!';
  if (liarIsLiar) {
    liarResultPersonal.textContent = participantsWin ? '당신이 들켰어요!' : '당신이 성공적으로 숨었어요!';
  } else {
    liarResultPersonal.textContent = participantsWin ? '참가자들이 라이어를 찾았어요!' : '라이어를 찾지 못했어요...';
  }
  liarResultWord.textContent = `${word} (${category})`;
  liarResultLiar.textContent = `라이어는 ${liarNickname}였습니다`;
  renderLiarVoteTally(voteTally);

  showLiarSubView('result');
});
