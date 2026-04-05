// ========== CORE SOLVING LOGIC ==========
let isProcessing = false;
let answers = {};
let stats = { success: 0, errors: 0 };
let startTime = null;
let timerInterval = null;
let currentLevel = "1as";

async function processQuestion(num) {
    setStatus(t('status_analyzing', { num }));
    const question = getCurrentQuestion();
    if (!question) {
        setStatus(t('status_reading_fail', { num }), true);
        stats.errors++;
        updateUI();
        return false;
    }
    setStatus(t('status_consulting_ai', { num }));
    try {
        const answer = await getAIAnswer(question);
        setStatus(t('status_answer_received', { num }));
        await wait(100);
        const selected = selectAnswer(answer);
        if (selected) {
            setStatus(`✓ ${t('status_answer_received', { num })}`);
            answers[num] = answer;
            stats.success++;
            updateUI();
            await wait(100);
            return true;
        } else {
            setStatus(t('status_select_fail', { num }), true);
            stats.errors++;
            updateUI();
            return false;
        }
    } catch (error) {
        setStatus(t('status_error_question', { num, error }), true);
        stats.errors++;
        updateUI();
        return false;
    }
}

async function solveAllQuestions() {
    const currentUrl = window.location.href;
    if (!currentUrl.includes(`e-devoir-${currentLevel}`)) {
        setStatus(t('config_wrong_level', { current: currentUrl.match(/e-devoir-(\w+)/)?.[1] ?? '?', selected: currentLevel }), true);
        return;
    }
    if (isProcessing) return;
    isProcessing = true;
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const resetBtn = document.getElementById('resetBtn');
    if (startBtn) startBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = false;
    if (resetBtn) resetBtn.disabled = true;
    startTime = Date.now();
    startTimer();
    setStatus(t('status_running'));

    for (let q = 1; q <= TOTAL_QUESTIONS; q++) {
        if (!isProcessing) { setStatus(t('status_stopped')); break; }
        await goToQuestion(q);
        await wait(100);
        const currentNum = getQuestionNumber();
        if (currentNum !== q) { setStatus(t('status_nav_error', { q }), true); continue; }
        await processQuestion(q);
        await wait(200);
    }
    if (isProcessing) {
        const totalTime = Math.floor((Date.now() - startTime) / 1000);
        setStatus(t('status_complete', { success: stats.success, total: TOTAL_QUESTIONS, time: totalTime }));
    }
    stopTimer();
    isProcessing = false;
    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
    if (resetBtn) resetBtn.disabled = false;
    setStatus(t('status_ready'));
}

function stopSolving() {
    isProcessing = false;
    setStatus(t('status_stopped'));
    stopTimer();
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const resetBtn = document.getElementById('resetBtn');
    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
    if (resetBtn) resetBtn.disabled = false;
}

function resetDashboard() {
    answers = {};
    stats = { success: 0, errors: 0 };
    startTime = null;
    updateUI();
    setStatus(t('status_reset'));
    if (timerInterval) clearInterval(timerInterval);
    const timeElapsedEl = document.getElementById('timeElapsed');
    const progressBarFill = document.getElementById('progressBarFill');
    const progressText = document.getElementById('progressText');
    if (timeElapsedEl) timeElapsedEl.textContent = "0s";
    if (progressBarFill) progressBarFill.style.width = '0%';
    if (progressText) progressText.textContent = `0 / ${TOTAL_QUESTIONS}`;
}

function updateUI() {
    if (!dashboardInitialized) return;
    const successCountEl = document.getElementById('successCount');
    const errorCountEl = document.getElementById('errorCount');
    const progressText = document.getElementById('progressText');
    const progressBarFill = document.getElementById('progressBarFill');
    const lastUpdateEl = document.getElementById('lastUpdate');
    const total = stats.success + stats.errors;
    if (successCountEl) successCountEl.textContent = stats.success;
    if (errorCountEl) errorCountEl.textContent = stats.errors;
    if (progressText) progressText.textContent = `${total} / ${TOTAL_QUESTIONS}`;
    if (progressBarFill) progressBarFill.style.width = `${(total / TOTAL_QUESTIONS) * 100}%`;
    if (lastUpdateEl) lastUpdateEl.textContent = t('last_update', { time: new Date().toLocaleTimeString() });
}

function setStatus(msg, isError = false) {
    if (!dashboardInitialized) return;
    const statusDot = document.getElementById('statusDot');
    const statusMessageEl = document.getElementById('statusMessage');
    const progressBarFill = document.getElementById('progressBarFill');
    if (!statusDot || !statusMessageEl) return;
    ['ready', 'running', 'error'].forEach(s => {
        statusDot.classList.remove(s);
        statusMessageEl.classList.remove(s);
        if (progressBarFill) progressBarFill.classList.remove(s);
    });

    if (isError) {
        statusDot.classList.add('error');
        statusMessageEl.classList.add('error');
        if (progressBarFill) progressBarFill.classList.add('error');
    } else if (isProcessing) {
        statusDot.classList.add('running');
        statusMessageEl.classList.add('running');
        if (progressBarFill) progressBarFill.classList.add('running');
    } else {
        statusDot.classList.add('ready');
        statusMessageEl.classList.add('ready');
    }

    statusMessageEl.innerHTML = msg;
    if (!isError) {
        setTimeout(() => {
            if (statusMessageEl.innerHTML === msg) {
                statusMessageEl.style.color = 'var(--text-primary)';
            }
        }, 3000);
    }
}
function updateTimeElapsed() {
    const timeElapsedEl = document.getElementById('timeElapsed'); 

    if (startTime && timeElapsedEl) {
        timeElapsedEl.textContent = t('time_seconds', {
            time: Math.floor((Date.now() - startTime) / 1000)
        });
    }
}
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimeElapsed, 1000);
}
function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
}