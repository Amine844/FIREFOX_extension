// ----- LAZY INITIALIZATION -----
let dashboardInitialized = false;
let toggleBtn = null;
let dashboardVisible = false;

// ----- CREATE TOGGLE BUTTON (always visible) -----
function createToggleButton() {
    if (toggleBtn) return;
    toggleBtn = document.createElement('div');
    toggleBtn.id = 'autosolve-toggle-btn';
    toggleBtn.innerHTML = '📊';
    toggleBtn.setAttribute('title', 'Toggle AutoSolve Dashboard');
    toggleBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #0099FF, #b76eff);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10000;
        font-size: 24px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        user-select: none;
    `;
    toggleBtn.addEventListener('mouseenter', () => {
        toggleBtn.style.transform = 'scale(1.1)';
        toggleBtn.style.boxShadow = '0 0 20px rgba(0,153,255,0.8)';
    });
    toggleBtn.addEventListener('mouseleave', () => {
        toggleBtn.style.transform = 'scale(1)';
        toggleBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    });
    toggleBtn.addEventListener('click', () => {
        dashboardVisible = !dashboardVisible;
        chrome.storage.local.set({ dashboardVisible: dashboardVisible });
        if (!dashboardInitialized && dashboardVisible) {
            initDashboard();
            const dashboardContainer = document.getElementById('dashboard');
            if (dashboardContainer) dashboardContainer.style.display = 'block';
        } else if (dashboardInitialized) {
            const dashboardContainer = document.getElementById('dashboard');
            if (dashboardContainer) dashboardContainer.style.display = dashboardVisible ? 'block' : 'none';
        }
    });
    document.body.appendChild(toggleBtn);
}

// ----- ENSURE DASHBOARD VISIBLE (for popup start) -----
function ensureDashboardVisible() {
    if (!dashboardInitialized) {
        initDashboard();
    }
    const dashboardContainer = document.getElementById('dashboard');
    if (dashboardContainer) {
        dashboardContainer.style.display = 'block';
        dashboardVisible = true;
        chrome.storage.local.set({ dashboardVisible: true });
    }
}

// ----- INITIALIZE DASHBOARD (append and setup) -----
function initDashboard() {
    if (dashboardInitialized) return;
    document.body.appendChild(dashboardDiv);
    dashboardInitialized = true;

    // ---- DOM elements ----
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const resetBtn = document.getElementById('resetBtn');
    const minimizeBtn = document.getElementById('minimizeBtn');
    const settingsToggleBtn = document.getElementById('settingsToggleBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const themeSelect = document.getElementById('themeSelect');
    const languageSelect = document.getElementById('languageSelect');
    const applySettingsBtn = document.getElementById('applySettingsBtn');
    const dashboardContent = document.getElementById('dashboardContent');
    const successCountEl = document.getElementById('successCount');
    const errorCountEl = document.getElementById('errorCount');
    const timeElapsedEl = document.getElementById('timeElapsed');
    const progressText = document.getElementById('progressText');
    const progressBarFill = document.getElementById('progressBarFill');
    const statusMessageEl = document.getElementById('statusMessage');
    const statusDot = document.getElementById('statusDot');
    const lastUpdateEl = document.getElementById('lastUpdate');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
    const levelSelect = document.getElementById('levelSelect');
    const saveLevelBtn = document.getElementById('saveLevelBtn');
    const configStatus = document.getElementById('configStatus');

    // Load theme & language
    chrome.storage.local.get(["theme", "language"], (result) => {
        if (result.theme && themes[result.theme]) {
            currentTheme = result.theme;
            themeSelect.value = currentTheme;
            applyTheme(currentTheme);
        } else {
            applyTheme('blue');
        }
        if (result.language && TRANSLATIONS[result.language]) {
            currentLanguage = result.language;
            languageSelect.value = currentLanguage;
            applyLanguage(currentLanguage);
        } else {
            applyLanguage('fr');
        }
    });

    settingsToggleBtn.addEventListener('click', () => {
        settingsPanel.classList.toggle('open');
    });

    applySettingsBtn.addEventListener('click', () => {
        const newTheme = themeSelect.value;
        const newLang = languageSelect.value;
        applyTheme(newTheme);
        applyLanguage(newLang);
        settingsPanel.classList.remove('open');
    });

    // Drag to move dashboard
    let isDragging = false, xOffset = 0, yOffset = 0, initialX, initialY, currentX, currentY;
    const dashboardEl = document.getElementById('dashboard');
    const draggableHeader = dashboardEl.querySelector('.draggable');
    draggableHeader.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    function dragStart(e) {
        if (e.target === minimizeBtn || e.target.closest('.minimize-btn') || e.target === settingsToggleBtn || e.target.closest('.settings-toggle-btn')) return;
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        if (e.target === draggableHeader || draggableHeader.contains(e.target)) isDragging = true;
    }
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            dashboardEl.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
    }
    function dragEnd(e) { isDragging = false; }

    let minimized = false;
    minimizeBtn.addEventListener('click', () => {
        minimized = !minimized;
        dashboardContent.style.display = minimized ? 'none' : 'block';
        minimizeBtn.textContent = minimized ? '+' : '−';
        dashboardEl.style.width = minimized ? 'auto' : '360px';
    });

    function loadConfig() {
        chrome.runtime.sendMessage({ action: "getConfig" }, (response) => {
            if (response) {
                if (response.apiKeySuffix) apiKeyInput.value = response.apiKeySuffix;
                if (response.level) {
                    currentLevel = response.level;
                    levelSelect.value = currentLevel;
                }
                configStatus.textContent = t('config_loaded');
                configStatus.style.color = "var(--neon-green)";
            }
        });
    }
    loadConfig();

    saveApiKeyBtn.addEventListener('click', () => {
        const suffix = apiKeyInput.value.trim();
        if (!suffix) {
            configStatus.textContent = "❌ " + t('api_missing');
            configStatus.style.color = "var(--neon-red)";
            return;
        }
        chrome.runtime.sendMessage({ action: "setApiKeySuffix", suffix }, (res) => {
            if (res.success) {
                saveApiKeyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
                saveApiKeyBtn.classList.add('saved');
                configStatus.textContent = t('config_saved_key');
                configStatus.style.color = "var(--neon-green)";
                setTimeout(() => {
                    saveApiKeyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>';
                    saveApiKeyBtn.classList.remove('saved');
                    configStatus.textContent = t('config_ready');
                }, 2000);
            }
        });
    });

    saveLevelBtn.addEventListener('click', () => {
        const level = levelSelect.value;
        chrome.runtime.sendMessage({ action: "setLevel", level }, (res) => {
            if (res.success) {
                currentLevel = level;
                configStatus.textContent = t('config_level_selected', { level: level.toUpperCase() });
                configStatus.style.color = "var(--neon-green)";
                const currentUrl = window.location.href;
                if (!currentUrl.includes(`e-devoir-${level}`)) {
                    setStatus(t('config_wrong_level', { current: currentUrl.match(/e-devoir-(\w+)/)?.[1] ?? '?', selected: level }), true);
                } else {
                    setStatus(t('config_level_active', { level: level.toUpperCase() }), false);
                }
                setTimeout(() => { configStatus.textContent = t('config_ready'); }, 2000);
            }
        });
    });

    updateUI();
    setStatus(t('status_ready'));
    startBtn.onclick = solveAllQuestions;
    stopBtn.onclick = stopSolving;
    resetBtn.onclick = resetDashboard;
}

// ----- Message listener (handle popup commands) -----
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'start') {
        ensureDashboardVisible();
        solveAllQuestions();
        sendResponse({ success: true });
    } else if (request.action === 'stop') {
        if (dashboardInitialized) stopSolving();
        sendResponse({ success: true });
    } else if (request.action === 'reset') {
        if (dashboardInitialized) resetDashboard();
        sendResponse({ success: true });
    } else if (request.action === 'toggleDashboard') {
        dashboardVisible = !dashboardVisible;
        chrome.storage.local.set({ dashboardVisible: dashboardVisible });
        if (!dashboardInitialized && dashboardVisible) {
            initDashboard();
            const dc = document.getElementById('dashboard');
            if (dc) dc.style.display = 'block';
        } else if (dashboardInitialized) {
            const dc = document.getElementById('dashboard');
            if (dc) dc.style.display = dashboardVisible ? 'block' : 'none';
        }
        sendResponse({ success: true, visible: dashboardVisible });
    } else if (request.action === 'getStatus') {
        sendResponse({ isProcessing, stats, answers, startTime });
    }
    return true;
});

// ----- Load saved visibility and create toggle button -----
chrome.storage.local.get(["dashboardVisible"], (result) => {
    dashboardVisible = result.dashboardVisible === true;
    createToggleButton();
    if (dashboardVisible) {
        if (!dashboardInitialized) initDashboard();
        const dashboardContainer = document.getElementById('dashboard');
        if (dashboardContainer) dashboardContainer.style.display = 'block';
    }
});

// Expose helper for console
window.AutoSolve = { start: solveAllQuestions, stop: stopSolving, reset: resetDashboard, getStatus: () => ({ isProcessing, stats, answers, startTime }) };