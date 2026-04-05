let currentLanguage = 'fr';
let currentTheme = 'blue';

function t(key, params = {}) {
    let str = TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS['en'][key] || key;
    Object.keys(params).forEach(p => {
        str = str.replace(`{${p}}`, params[p]);
    });
    return str;
}

function applyTheme(themeName) {
    const dashboardContainer = document.getElementById('dashboard');
    if (!dashboardContainer) return;
    dashboardContainer.setAttribute('data-theme', themeName);
    const themeVars = themes[themeName];
    if (themeVars) {
        Object.keys(themeVars).forEach(varName => {
            dashboardContainer.style.setProperty(varName, themeVars[varName]);
        });
    }
    currentTheme = themeName;
    chrome.storage.local.set({ theme: currentTheme });
}

function applyLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.placeholder) el.placeholder = t(key);
            } else {
                el.textContent = t(key);
            }
        }
    });
    const startBtn = document.getElementById('startBtn');
    if (startBtn) startBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/></svg> ${t('btn_start')}`;
    const stopBtn = document.getElementById('stopBtn');
    if (stopBtn) stopBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg> ${t('btn_stop')}`;
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg> ${t('btn_reset')}`;
    document.querySelectorAll('.stat-label').forEach((el, idx) => {
        if (idx === 0) el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px;vertical-align:middle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> ${t('success_stat')}`;
        else if (idx === 1) el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px;vertical-align:middle"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> ${t('errors_stat')}`;
        else if (idx === 2) el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px;vertical-align:middle"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${t('time_stat')}`;
    });
    const progressHeader = document.querySelector('.progress-header span:first-child');
    if (progressHeader) progressHeader.innerHTML = `<svg style="width:10px;height:10px;vertical-align:middle;stroke:var(--neon-blue);stroke-width:2" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.22-8.55M3 3v6h6"/></svg> ${t('progress_label')}`;
    const dashboardContainer = document.getElementById('dashboard');
    if (dashboardContainer) {
        if (lang === 'ar') {
            dashboardContainer.style.direction = 'rtl';
            dashboardContainer.style.textAlign = 'right';
        } else {
            dashboardContainer.style.direction = 'ltr';
            dashboardContainer.style.textAlign = 'left';
        }
    }
    chrome.storage.local.set({ language: currentLanguage });
}

function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function getCurrentQuestion() {
    const container = document.querySelector('#isi-tes-soal');
    return container ? container.innerText.trim() : null;
}
function getQuestionNumber() {
    const titleSpan = document.getElementById('judul-soal');
    if (titleSpan) {
        const match = titleSpan.innerText.match(/\d+/);
        if (match) return parseInt(match[0]);
    }
    return null;
}
function selectAnswer(answerText) {
    const radioButtons = document.querySelectorAll('#isi-tes-soal .radio');
    for (let radio of radioButtons) {
        const labelText = radio.innerText.trim();
        if (labelText.includes(answerText) || answerText.includes(labelText)) {
            const input = radio.querySelector('input[type="radio"]');
            if (input && !input.checked) { input.click(); return true; }
        }
    }
    return false;
}
function goToQuestion(questionNumber) {
    return new Promise(resolve => {
        const btn = document.getElementById(`btn-soal-${questionNumber}`);
        if (btn) { btn.click(); setTimeout(resolve, 1500); }
        else resolve();
    });
}

async function getAIAnswer(question) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "getAIAnswer", question }, response => {
            if (chrome.runtime.lastError) reject(chrome.runtime.lastError.message);
            else if (response.success) resolve(response.answer);
            else reject(response.error);
        });
    });
}