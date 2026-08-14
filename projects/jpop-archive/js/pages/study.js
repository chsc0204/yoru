// ===== Japanese Study 페이지 =====
let studyPageState = { jlpt: 'ALL', category: 'ALL' };
let quizState = null;

function renderStudy(container) {
  container.innerHTML = `
    <div class="page container">
      <div class="section-head">
        <div>
          <h1 class="page-title">Japanese Study</h1>
          <p class="page-desc">J-POP 곡·아티스트 명에서 착안한 짧은 일본어 학습 카드입니다.</p>
        </div>
        <button type="button" class="btn btn-primary" id="startQuizBtn">🎯 랜덤 퀴즈 풀기</button>
      </div>

      <div id="studyBrowse">
        <div class="toolbar" id="studyFilters"></div>
        <div class="grid grid-2" id="vocabGrid"></div>
        <div id="vocabEmpty" hidden></div>
      </div>

      <div id="studyQuiz" hidden></div>
    </div>`;

  renderStudyFilters();
  renderVocabGrid();

  qs('#startQuizBtn').addEventListener('click', startQuiz);
}

function renderStudyFilters() {
  const bar = qs('#studyFilters');
  const jlptLevels = ['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'];
  const categories = ['ALL', ...new Set(VOCABULARY.map((v) => v.category))];

  bar.innerHTML = `
    <select id="jlptSelect">
      ${jlptLevels.map((l) => `<option value="${l}">${l === 'ALL' ? '전체 JLPT 레벨' : l}</option>`).join('')}
    </select>
    <select id="categorySelect">
      ${categories.map((c) => `<option value="${c}">${c === 'ALL' ? '전체 카테고리' : c}</option>`).join('')}
    </select>
  `;
  qs('#jlptSelect').value = studyPageState.jlpt;
  qs('#categorySelect').value = studyPageState.category;

  qs('#jlptSelect').addEventListener('change', (e) => {
    studyPageState.jlpt = e.target.value;
    renderVocabGrid();
  });
  qs('#categorySelect').addEventListener('change', (e) => {
    studyPageState.category = e.target.value;
    renderVocabGrid();
  });
}

function renderVocabGrid() {
  const grid = qs('#vocabGrid');
  const emptyEl = qs('#vocabEmpty');

  const list = VOCABULARY.filter((v) => {
    const matchesJlpt = studyPageState.jlpt === 'ALL' || v.jlpt === studyPageState.jlpt;
    const matchesCategory = studyPageState.category === 'ALL' || v.category === studyPageState.category;
    return matchesJlpt && matchesCategory;
  });

  if (list.length === 0) {
    grid.innerHTML = '';
    emptyEl.hidden = false;
    emptyEl.innerHTML = emptyStateHTML('조건에 맞는 학습 카드가 없습니다.');
    return;
  }

  emptyEl.hidden = true;
  grid.innerHTML = list.map(vocabCardHTML).join('');
  bindInteractions(grid);
}

// ---------- Quiz ----------
function buildQuizQuestions(count = 5) {
  const pool = [...VOCABULARY].sort(() => Math.random() - 0.5).slice(0, count);
  return pool.map((v) => {
    const distractors = VOCABULARY.filter((o) => o.id !== v.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((o) => o.meaning);
    const options = [...distractors, v.meaning].sort(() => Math.random() - 0.5);
    return { word: v.word, reading: v.reading, correct: v.meaning, options };
  });
}

function startQuiz() {
  quizState = { questions: buildQuizQuestions(5), index: 0, score: 0 };
  qs('#studyBrowse').hidden = true;
  qs('#studyQuiz').hidden = false;
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const quizEl = qs('#studyQuiz');
  const total = quizState.questions.length;
  const q = quizState.questions[quizState.index];

  quizEl.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-progress">질문 ${quizState.index + 1} / ${total} · 점수 ${quizState.score}</div>
      <div class="quiz-question">"${q.word}"（${q.reading}）의 뜻은?</div>
      <div class="quiz-options" id="quizOptions">
        ${q.options.map((opt, i) => `<button type="button" class="quiz-option" data-option="${i}">${i + 1}. ${opt}</button>`).join('')}
      </div>
      <div id="quizFeedback"></div>
    </div>`;

  qsa('.quiz-option', quizEl).forEach((btn) => {
    btn.addEventListener('click', () => answerQuiz(btn, q));
  });
}

function answerQuiz(btn, question) {
  const chosen = question.options[Number(btn.dataset.option)];
  const isCorrect = chosen === question.correct;

  qsa('.quiz-option').forEach((b) => {
    b.disabled = true;
    const optionText = question.options[Number(b.dataset.option)];
    if (optionText === question.correct) b.classList.add('correct');
    else if (b === btn) b.classList.add('incorrect');
  });

  if (isCorrect) quizState.score += 1;

  const feedback = qs('#quizFeedback');
  feedback.innerHTML = `
    <div class="quiz-result" style="color:${isCorrect ? 'var(--color-success)' : 'var(--color-danger)'}">
      ${isCorrect ? '✓ 정답입니다!' : `✗ 오답입니다. 정답은 "${question.correct}"`}
    </div>
    <div style="text-align:center; margin-top:16px;">
      <button type="button" class="btn btn-primary" id="quizNextBtn">
        ${quizState.index + 1 < quizState.questions.length ? '다음 문제' : '결과 보기'}
      </button>
    </div>`;

  qs('#quizNextBtn').addEventListener('click', () => {
    quizState.index += 1;
    if (quizState.index < quizState.questions.length) {
      renderQuizQuestion();
    } else {
      renderQuizResult();
    }
  });
}

function renderQuizResult() {
  const total = quizState.questions.length;
  qs('#studyQuiz').innerHTML = `
    <div class="quiz-card quiz-score">
      <div class="quiz-score-value">${quizState.score} / ${total}</div>
      <p style="color:var(--color-text-secondary); margin-bottom:24px;">퀴즈가 끝났습니다!</p>
      <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
        <button type="button" class="btn btn-primary" id="quizRetryBtn">다시 풀기</button>
        <button type="button" class="btn btn-outline" id="quizBackBtn">학습으로 돌아가기</button>
      </div>
    </div>`;

  qs('#quizRetryBtn').addEventListener('click', startQuiz);
  qs('#quizBackBtn').addEventListener('click', () => {
    qs('#studyQuiz').hidden = true;
    qs('#studyBrowse').hidden = false;
  });
}
