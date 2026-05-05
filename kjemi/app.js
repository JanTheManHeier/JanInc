// Kjemi 2 Pugge-App
// Hovedlogikk: Quiz-motor, flashcards, fremdriftssporing

(function() {
  'use strict';

  // Usage tracking
  const API_BASE = '/api';
  let sessionStartTime = Date.now();

  function trackEvent(event, data = {}) {
    try {
      const payload = { event, ...data };
      navigator.sendBeacon(
        `${API_BASE}/kjemi-usage`,
        new Blob([JSON.stringify(payload)], { type: 'application/json' })
      );
    } catch (e) { /* silent fail */ }
  }

  // Track session start
  trackEvent('session_start');

  // Registrerte kapitler
  const chapters = [];

  function registerChapter(data) {
    chapters.push(data);
  }

  // Registrer tilgjengelige kapitler
  if (window.SYRER_OG_BASER) registerChapter(window.SYRER_OG_BASER);
  if (window.LIKEVEKTER) registerChapter(window.LIKEVEKTER);
  if (window.REDOKS) registerChapter(window.REDOKS);
  if (window.ENTROPI_ENTALPI) registerChapter(window.ENTROPI_ENTALPI);
  if (window.ORGANISK) registerChapter(window.ORGANISK);
  if (window.LOSELIGHET) registerChapter(window.LOSELIGHET);
  if (window.KATALYSE_SYNTESE) registerChapter(window.KATALYSE_SYNTESE);
  if (window.MAKROMOLEKYLER) registerChapter(window.MAKROMOLEKYLER);

  // State
  const state = {
    currentChapter: null,
    currentMode: null,
    questions: [],
    currentIndex: 0,
    score: 0,
    total: 0,
    wrongAnswers: [],
    isFlipped: false,
    lastMode: null,
    roundSize: 10
  };

  // Progress (localStorage)
  const STORAGE_KEY = 'kjemi2-progress';

  function loadProgress() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : { correct: 0, wrong: 0, streak: 0, bestStreak: 0, wrongQuestions: {} };
    } catch {
      return { correct: 0, wrong: 0, streak: 0, bestStreak: 0, wrongQuestions: {} };
    }
  }

  function saveProgress(progress) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }

  function getProgress() {
    return loadProgress();
  }

  // Utility
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function $(id) {
    return document.getElementById(id);
  }

  function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const view = $(id);
    if (view) view.classList.add('active');
  }

  // Render chapter list
  function renderChapters() {
    const list = $('chapter-list');
    if (!list) return;
    list.innerHTML = '';
    chapters.forEach((ch, i) => {
      const btn = document.createElement('button');
      btn.className = 'chapter-card';
      btn.innerHTML = `
        <span class="chapter-icon">🧪</span>
        <span class="chapter-info">
          <h3>${ch.title}</h3>
          <p>${ch.description}</p>
        </span>
      `;
      btn.onclick = () => selectChapter(i);
      list.appendChild(btn);
    });
  }

  function selectChapter(index) {
    state.currentChapter = chapters[index];
    $('chapter-title').textContent = state.currentChapter.title;
    updateStats();
    updateReviewCount();
    showView('view-mode');
  }

  function updateStats() {
    const progress = getProgress();
    $('stat-correct').textContent = progress.correct;
    $('stat-wrong').textContent = progress.wrong;
    $('stat-streak').textContent = progress.streak;
  }

  function updateReviewCount() {
    const progress = getProgress();
    const chId = state.currentChapter.id;
    const wrongQ = progress.wrongQuestions[chId] || [];
    const count = wrongQ.length;
    $('review-count').textContent = count > 0 ? `${count} spørsmål å øve på` : 'Ingen feil ennå';
  }

  // Start modes
  function startMode(mode) {
    state.currentMode = mode;
    state.lastMode = mode;
    state.currentIndex = 0;
    state.score = 0;
    state.wrongAnswers = [];

    const ch = state.currentChapter;
    const limit = state.roundSize;

    switch(mode) {
      case 'quiz':
        state.questions = shuffle(ch.multipleChoice);
        if (limit > 0) state.questions = state.questions.slice(0, limit);
        state.total = state.questions.length;
        showView('view-quiz');
        renderQuizQuestion();
        break;
      case 'flashcards':
        state.questions = shuffle(ch.flashcards);
        if (limit > 0) state.questions = state.questions.slice(0, limit);
        state.total = state.questions.length;
        showView('view-flashcards');
        renderFlashcard();
        break;
      case 'truefalse':
        state.questions = shuffle(ch.trueFalse);
        if (limit > 0) state.questions = state.questions.slice(0, limit);
        state.total = state.questions.length;
        showView('view-truefalse');
        renderTFQuestion();
        break;
      case 'review':
        startReviewMode();
        break;
    }
  }

  function startReviewMode() {
    const progress = getProgress();
    const chId = state.currentChapter.id;
    const wrongQ = progress.wrongQuestions[chId] || [];

    if (wrongQ.length === 0) {
      alert('Ingen feil å øve på! Prøv en quiz først.');
      return;
    }

    // Collect questions that were answered wrong
    const ch = state.currentChapter;
    const reviewQuestions = [];

    wrongQ.forEach(q => {
      if (q.type === 'mc') {
        const found = ch.multipleChoice.find(mc => mc.question === q.question);
        if (found) reviewQuestions.push({ ...found, _type: 'mc' });
      } else if (q.type === 'tf') {
        const found = ch.trueFalse.find(tf => tf.statement === q.question);
        if (found) reviewQuestions.push({ ...found, _type: 'tf' });
      }
    });

    if (reviewQuestions.length === 0) {
      alert('Ingen spørsmål å øve på.');
      return;
    }

    state.questions = shuffle(reviewQuestions);
    state.total = state.questions.length;
    state.currentMode = 'review';

    // Use quiz view for review, but mix question types
    showView('view-quiz');
    renderReviewQuestion();
  }

  function renderReviewQuestion() {
    const q = state.questions[state.currentIndex];
    if (!q) { showResults(); return; }

    if (q._type === 'mc') {
      renderQuizQuestion();
    } else if (q._type === 'tf') {
      showView('view-truefalse');
      renderTFQuestion();
    }
  }

  // Quiz (Multiple Choice)
  function renderQuizQuestion() {
    const q = state.questions[state.currentIndex];
    if (!q) { showResults(); return; }

    updateProgress('quiz');
    $('quiz-question').textContent = q.question;
    $('quiz-feedback').classList.add('hidden');

    const optionsEl = $('quiz-options');
    optionsEl.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    // Shuffle options but track correct answer
    const optionIndices = [...Array(q.options.length).keys()];
    const shuffledIndices = shuffle(optionIndices);

    shuffledIndices.forEach((origIdx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      const letterIdx = optionsEl.children.length;
      btn.innerHTML = `
        <span class="option-letter">${letters[letterIdx]}</span>
        <span>${q.options[origIdx]}</span>
      `;
      btn.dataset.index = origIdx;
      btn.onclick = () => selectOption(btn, origIdx, q.correct);
      optionsEl.appendChild(btn);
    });
  }

  function selectOption(btn, selectedIdx, correctIdx) {
    const optionsEl = $('quiz-options');
    const buttons = optionsEl.querySelectorAll('.option-btn');

    // Disable all
    buttons.forEach(b => {
      b.classList.add('disabled');
      const idx = parseInt(b.dataset.index);
      if (idx === correctIdx) b.classList.add('correct');
    });

    const q = state.questions[state.currentIndex];
    const isCorrect = selectedIdx === correctIdx;

    if (isCorrect) {
      btn.classList.add('correct');
      btn.classList.add('pop');
      state.score++;
      recordAnswer(true, q.question, 'mc');
    } else {
      btn.classList.add('wrong');
      btn.classList.add('shake');
      state.wrongAnswers.push(q);
      recordAnswer(false, q.question, 'mc');
    }

    // Show feedback
    const feedback = $('quiz-feedback');
    feedback.classList.remove('hidden', 'correct-feedback', 'wrong-feedback');
    feedback.classList.add(isCorrect ? 'correct-feedback' : 'wrong-feedback');
    $('quiz-feedback-text').textContent = (isCorrect ? '✓ Riktig! ' : '✗ Feil. ') + q.explanation;
  }

  function nextQuestion() {
    state.currentIndex++;
    if (state.currentIndex >= state.total) {
      showResults();
    } else if (state.currentMode === 'review') {
      renderReviewQuestion();
    } else {
      renderQuizQuestion();
    }
  }

  // True/False
  function renderTFQuestion() {
    const q = state.questions[state.currentIndex];
    if (!q) { showResults(); return; }

    updateProgress('tf');
    $('tf-statement').textContent = q.statement || q.question;
    $('tf-feedback').classList.add('hidden');
    $('tf-buttons').classList.remove('hidden');

    // Reset button styles
    const trueBtn = document.querySelector('.btn-true');
    const falseBtn = document.querySelector('.btn-false');
    trueBtn.className = 'btn-true';
    falseBtn.className = 'btn-false';
    trueBtn.disabled = false;
    falseBtn.disabled = false;
  }

  function answerTF(answer) {
    const q = state.questions[state.currentIndex];
    const isCorrect = answer === q.correct;

    const trueBtn = document.querySelector('.btn-true');
    const falseBtn = document.querySelector('.btn-false');
    trueBtn.disabled = true;
    falseBtn.disabled = true;

    if (q.correct === true) {
      trueBtn.classList.add('selected-correct');
      if (!isCorrect) falseBtn.classList.add('selected-wrong');
    } else {
      falseBtn.classList.add('selected-correct');
      if (!isCorrect) trueBtn.classList.add('selected-wrong');
    }

    if (isCorrect) {
      state.score++;
      recordAnswer(true, q.statement, 'tf');
    } else {
      state.wrongAnswers.push(q);
      recordAnswer(false, q.statement, 'tf');
    }

    const feedback = $('tf-feedback');
    feedback.classList.remove('hidden', 'correct-feedback', 'wrong-feedback');
    feedback.classList.add(isCorrect ? 'correct-feedback' : 'wrong-feedback');
    $('tf-feedback-text').textContent = (isCorrect ? '✓ Riktig! ' : '✗ Feil. ') + q.explanation;
  }

  function nextTF() {
    state.currentIndex++;
    if (state.currentIndex >= state.total) {
      showResults();
    } else if (state.currentMode === 'review') {
      renderReviewQuestion();
    } else {
      renderTFQuestion();
    }
  }

  // Flashcards
  function renderFlashcard() {
    const q = state.questions[state.currentIndex];
    if (!q) { showResults(); return; }

    updateProgress('flash');
    state.isFlipped = false;

    const card = $('flashcard');
    card.classList.remove('flipped');

    $('flash-front').textContent = q.front;
    $('flash-back').textContent = q.back;
    $('flash-actions').classList.add('hidden');
    $('flip-hint').classList.remove('hidden');
  }

  function flipCard() {
    const card = $('flashcard');
    state.isFlipped = !state.isFlipped;

    if (state.isFlipped) {
      card.classList.add('flipped');
      $('flash-actions').classList.remove('hidden');
      $('flip-hint').classList.add('hidden');
    } else {
      card.classList.remove('flipped');
      $('flash-actions').classList.add('hidden');
      $('flip-hint').classList.remove('hidden');
    }
  }

  function flashcardResult(knew) {
    if (knew) {
      state.score++;
    } else {
      state.wrongAnswers.push(state.questions[state.currentIndex]);
    }

    state.currentIndex++;
    if (state.currentIndex >= state.total) {
      showResults();
    } else {
      renderFlashcard();
    }
  }

  // Progress tracking
  function recordAnswer(correct, question, type) {
    const progress = loadProgress();
    const chId = state.currentChapter.id;

    if (correct) {
      progress.correct++;
      progress.streak++;
      if (progress.streak > progress.bestStreak) {
        progress.bestStreak = progress.streak;
      }
      // Remove from wrong questions if previously wrong
      if (progress.wrongQuestions[chId]) {
        progress.wrongQuestions[chId] = progress.wrongQuestions[chId].filter(q => q.question !== question);
      }
    } else {
      progress.wrong++;
      progress.streak = 0;
      // Add to wrong questions
      if (!progress.wrongQuestions[chId]) {
        progress.wrongQuestions[chId] = [];
      }
      const exists = progress.wrongQuestions[chId].find(q => q.question === question);
      if (!exists) {
        progress.wrongQuestions[chId].push({ question, type });
      }
    }

    saveProgress(progress);
  }

  function updateProgress(prefix) {
    const percent = state.total > 0 ? ((state.currentIndex) / state.total * 100) : 0;
    const fill = $(`${prefix}-progress`);
    const text = $(`${prefix}-progress-text`);
    if (fill) fill.style.width = `${percent}%`;
    if (text) text.textContent = `${state.currentIndex + 1} / ${state.total}`;
  }

  // Results
  function showResults() {
    showView('view-results');
    const percent = state.total > 0 ? Math.round((state.score / state.total) * 100) : 0;

    $('results-percent').textContent = `${percent}%`;
    $('results-circle-path').setAttribute('stroke-dasharray', `${percent}, 100`);

    let msg = '';
    if (percent === 100) msg = '🎉 Perfekt! Du kan dette!';
    else if (percent >= 80) msg = '👏 Veldig bra! Nesten alt riktig.';
    else if (percent >= 60) msg = '👍 Bra jobba! Øv litt mer på det du bommet på.';
    else if (percent >= 40) msg = '📚 Halvveis! Les kapittelet igjen og prøv på nytt.';
    else msg = '💪 Ikke gi opp! Les teorien og prøv igjen.';

    $('results-summary').textContent = `${state.score} av ${state.total} riktig. ${msg}`;

    // Track round completion
    const duration = Math.round((Date.now() - sessionStartTime) / 1000);
    trackEvent('round_complete', {
      chapter: state.currentChapter ? state.currentChapter.id : null,
      mode: state.currentMode,
      score: state.score,
      total: state.total,
      duration
    });
    sessionStartTime = Date.now();

    updateStats();
    updateReviewCount();
  }

  function restartMode() {
    if (state.lastMode) {
      startMode(state.lastMode);
    }
  }

  function showModeSelect() {
    updateStats();
    updateReviewCount();
    showView('view-mode');
  }

  function showHome() {
    showView('view-home');
  }

  // Initialize
  function init() {
    renderChapters();
    showView('view-home');
  }

  function setRoundSize(size) {
    state.roundSize = size;
    document.querySelectorAll('.round-btn').forEach(btn => {
      btn.classList.remove('active');
      if (parseInt(btn.textContent) === size || (size === 0 && btn.textContent === 'Alle')) {
        btn.classList.add('active');
      }
    });
  }

  // Public API
  window.app = {
    showHome,
    showModeSelect,
    startMode,
    nextQuestion,
    flipCard,
    flashcardResult,
    answerTF,
    nextTF,
    restartMode,
    setRoundSize
  };

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
