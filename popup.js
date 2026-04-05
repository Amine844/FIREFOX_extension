// popup.js – FINAL VERSION (State Persistence + HTTPS support)

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleDashboardBtn');
  const btnText = document.getElementById('btnText');
  const statusEl = document.getElementById('popupStatus');
  const statusText = document.getElementById('statusText');

  // Small debug indicator (● = visible, ○ = hidden)
  const debugSpan = document.createElement('span');
  debugSpan.style.fontSize = '8px';
  debugSpan.style.marginLeft = '8px';
  debugSpan.style.opacity = '0.6';
  statusEl.appendChild(debugSpan);

  // Default state
  let state = { isVisible: true };

  // UI configuration (texts + styles)
  const UI_CONFIG = {
    texts: {
      visible: {
        btn: 'Hide Dashboard',
        status: 'Connected to OneFD ✓',
        class: 'success'
      },
      hidden: {
        btn: 'Show Dashboard',
        status: 'Dashboard Hidden',
        class: 'warning'
      }
    },
    errors: {
      page: { text: '❌ Not a OneFD page', class: 'error' },
      comm: { text: '⚠️ Connection Error – reload the page', class: 'error' },
      noScript: { text: '⚠️ Extension not active – reload OneFD', class: 'error' }
    }
  };

  // ===== Update UI based on state =====
  function renderUI() {
    const config = state.isVisible
      ? UI_CONFIG.texts.visible
      : UI_CONFIG.texts.hidden;

    toggleBtn.dataset.state = state.isVisible ? 'visible' : 'hidden';
    toggleBtn.setAttribute('aria-pressed', state.isVisible);
    btnText.textContent = config.btn;

    statusText.textContent = config.status;
    statusEl.className = `status ${config.class}`;

    debugSpan.textContent = state.isVisible ? '●' : '○';

    console.log('UI:', state.isVisible ? 'VISIBLE' : 'HIDDEN');
  }

  // ===== Save state (Chrome storage + fallback) =====
  function saveState() {
    return new Promise((resolve) => {
      try {
        if (chrome?.storage?.local) {
          chrome.storage.local.set(
            { dashboardVisible: state.isVisible },
            () => {
              if (chrome.runtime.lastError) {
                console.warn('Storage error → using localStorage fallback');
                localStorage.setItem('dashboardVisible', state.isVisible);
              }
              console.log('State saved:', state.isVisible);
              resolve();
            }
          );
        } else {
          localStorage.setItem('dashboardVisible', state.isVisible);
          resolve();
        }
      } catch (e) {
        console.error('Save failed:', e);
        localStorage.setItem('dashboardVisible', state.isVisible);
        resolve();
      }
    });
  }

  // ===== Load saved state =====
  function loadState() {
    return new Promise((resolve) => {
      try {
        if (chrome?.storage?.local) {
          chrome.storage.local.get('dashboardVisible', (res) => {
            if (chrome.runtime.lastError) {
              const saved = localStorage.getItem('dashboardVisible');
              if (saved !== null) state.isVisible = saved === 'true';
            } else if (typeof res.dashboardVisible === 'boolean') {
              state.isVisible = res.dashboardVisible;
            } else {
              const saved = localStorage.getItem('dashboardVisible');
              if (saved !== null) state.isVisible = saved === 'true';
            }
            console.log('Loaded state:', state.isVisible);
            resolve();
          });
        } else {
          const saved = localStorage.getItem('dashboardVisible');
          if (saved !== null) state.isVisible = saved === 'true';
          resolve();
        }
      } catch (e) {
        console.error('Load failed:', e);
        resolve();
      }
    });
  }

  // ===== Get current active tab =====
  function getActiveTab() {
    return new Promise((resolve) => {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (tabs) => resolve(tabs[0] || null)
      );
    });
  }

  // ===== Check if content script is alive =====
  async function isContentScriptReady(tabId) {
    try {
      await chrome.tabs.sendMessage(tabId, { action: 'ping' });
      return true;
    } catch (e) {
      return false;
    }
  }

  // ===== Toggle dashboard visibility =====
  async function toggleDashboard() {
    // Button click animation
    toggleBtn.style.transform = 'scale(0.97)';
    setTimeout(() => (toggleBtn.style.transform = ''), 100);

    const tab = await getActiveTab();

    // Check if we are on a OneFD page
    if (!tab?.url?.includes('onefd.edu.dz')) {
      statusText.textContent = UI_CONFIG.errors.page.text;
      statusEl.className = `status ${UI_CONFIG.errors.page.class}`;
      return;
    }

    // First, check if the content script is ready
    const scriptReady = await isContentScriptReady(tab.id);
    if (!scriptReady) {
      statusText.textContent = UI_CONFIG.errors.noScript.text;
      statusEl.className = `status ${UI_CONFIG.errors.noScript.class}`;
      return;
    }

    try {
      // Send message to content script
      await chrome.tabs.sendMessage(tab.id, { action: 'toggleDashboard' });

      // Toggle state
      state.isVisible = !state.isVisible;

      // Update UI
      renderUI();

      // Save state
      await saveState();

    } catch (err) {
      statusText.textContent = UI_CONFIG.errors.comm.text;
      statusEl.className = `status ${UI_CONFIG.errors.comm.class}`;
      console.warn('Message error:', err);
    }
  }

  // ===== Initialize popup =====
  loadState().then(() => {
    renderUI();
    toggleBtn.addEventListener('click', toggleDashboard);
    console.log('Popup ready ✔');
  });
});