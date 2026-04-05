// Dashboard HTML (not appended automatically)
const dashboardDiv = document.createElement('div');
dashboardDiv.innerHTML = `
    <style>
        /* === PREMIUM CSS VARIABLES === */
        #dashboard {
            --bg-primary: linear-gradient(135deg, #0a0e17 0%, #1a1a2e 50%, #16213e 100%);
            --bg-solid: #0f172a;
            --bg-glass: #1e293b;
            --bg-glass-hover: #2d3a4f;
            --border-glass: rgba(100, 120, 180, 0.25);
            --neon-blue: #0099FF;
            --neon-green: #00ff9d;
            --neon-purple: #b76eff;
            --neon-red: #ff4d6a;
            --text-primary: #f0f4ff;
            --text-secondary: #a8b3cf;
            --text-muted: #6b7594;
            --shadow-soft: 0 8px 32px rgba(0, 0, 0, 0.35);
            --shadow-glow-blue: 0 0 20px rgba(0, 153, 255, 0.4);
            --shadow-glow-green: 0 0 20px rgba(0, 255, 157, 0.4);
            --shadow-glow-red: 0 0 20px rgba(255, 77, 106, 0.4);
            --shadow-glow-purple: 0 0 25px rgba(183, 110, 255, 0.35);
            --radius-sm: 12px;
            --radius-md: 16px;
            --radius-lg: 20px;
            --radius-full: 9999px;
            --transition-fast: 0.2s ease;
            --transition-normal: 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            --progress-fill: linear-gradient(90deg, #0099FF, #b76eff);
            --stat-value: #0099FF;
            --font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
            transition: all 0.3s ease;
        }
        
        @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
        @keyframes float-particle {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.6; }
            90% { opacity: 0.6; }
            100% { transform: translateY(-20px) rotate(720deg); opacity: 0; }
        }
        @keyframes border-glow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        @keyframes gradient-shift-error {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.8; }
            70% { transform: scale(1.8); opacity: 0; }
            100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes countPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.12); }
            100% { transform: scale(1); }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            75% { transform: translateX(2px); }
        }

        .dashboard-container {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 360px;
            min-height: 520px;
            background: var(--bg-solid);
            backdrop-filter: none;
            border: 1px solid var(--border-glass);
            border-radius: var(--radius-lg);
            z-index: 9999;
            box-shadow: var(--shadow-soft), var(--shadow-glow-purple);
            font-family: var(--font-family);
            direction: ltr;
            color: var(--text-primary);
            animation: slideIn 0.3s ease-out;
            transition: all var(--transition-normal);
            overflow: hidden;
            padding: 18px;
        }
        
        .dashboard-container::before {
            content: '';
            position: absolute;
            inset: -2px;
            background: linear-gradient(45deg, transparent 0%, var(--neon-purple) 25%, transparent 50%, var(--neon-blue) 75%, transparent 100%);
            border-radius: calc(var(--radius-lg) + 2px);
            z-index: -1;
            opacity: 0.15;
            animation: border-glow 4s linear infinite;
            pointer-events: none;
        }
        
        .dashboard-container:hover {
            box-shadow: var(--shadow-soft), var(--shadow-glow-purple), 0 0 40px rgba(183, 110, 255, 0.2);
            transform: translateY(-2px);
        }

        .bg-particles {
            position: absolute;
            inset: 0;
            pointer-events: none;
            overflow: hidden;
            z-index: 0;
        }
        .particle {
            position: absolute;
            width: 3px;
            height: 3px;
            background: var(--neon-blue);
            border-radius: 50%;
            opacity: 0.15;
            animation: float-particle 15s infinite linear;
            box-shadow: 0 0 10px var(--neon-blue);
        }
        .particle:nth-child(2) { left: 20%; animation-delay: -5s; background: var(--neon-purple); box-shadow: 0 0 10px var(--neon-purple); }
        .particle:nth-child(3) { left: 40%; animation-delay: -10s; background: var(--neon-green); box-shadow: 0 0 10px var(--neon-green); }
        .particle:nth-child(4) { left: 60%; animation-delay: -2s; }
        .particle:nth-child(5) { left: 80%; animation-delay: -7s; background: var(--neon-purple); box-shadow: 0 0 10px var(--neon-purple); }

        .dashboard-header {
            text-align: center;
            padding-bottom: 12px;
            margin-bottom: 14px;
            border-bottom: 1px solid var(--border-glass);
            cursor: move;
            user-select: none;
        }
        .dashboard-header h3 {
            margin: 0;
            font-size: 17px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: linear-gradient(90deg, var(--text-primary), var(--neon-blue));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .dashboard-header p {
            margin: 4px 0 0 0;
            font-size: 11px;
            color: var(--text-muted);
            opacity: 0.9;
        }
        .ai-badge {
            font-size: 18px;
            animation: float-icon 3s ease-in-out infinite;
            display: inline-block;
            line-height: 1;
        }
        .ai-badge svg {
            width: 18px;
            height: 18px;
            vertical-align: middle;
            stroke: var(--neon-blue);
            stroke-width: 1.5;
        }
        @keyframes float-icon {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
        }

        .dashboard-content { padding: 0; }

        .config-section {
            margin-bottom: 16px;
        }
        .config-row {
            display: flex;
            gap: 8px;
            margin-bottom: 8px;
            align-items: center;
        }
        .config-row label {
            font-size: 12px;
            width: 45px;
            color: var(--text-secondary);
        }
        .config-row input, .config-row select {
            flex: 1;
            padding: 10px 12px;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-glass);
            background: var(--bg-glass);
            color: var(--text-primary);
            font-size: 13px;
            outline: none;
            transition: all var(--transition-fast);
        }
        .config-row input::placeholder { color: var(--text-muted); }
        .config-row input:focus {
            background: var(--bg-glass-hover);
            border-color: var(--neon-blue);
            box-shadow: 0 0 0 3px rgba(0, 153, 255, 0.2);
        }
        .config-row button {
            padding: 9px 12px;
            border-radius: var(--radius-md);
            border: none;
            background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
            color: #0a0e17;
            font-weight: 700;
            font-size: 11px;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all var(--transition-normal);
            box-shadow: 0 4px 12px rgba(0, 153, 255, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        }
        .config-row button svg {
            width: 14px;
            height: 14px;
            stroke: #0a0e17;
            stroke-width: 2;
        }
        .config-row button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 153, 255, 0.5);
        }
        .config-row button.saved {
            background: linear-gradient(135deg, var(--neon-green), #00cc88);
            box-shadow: 0 4px 12px rgba(0, 255, 157, 0.3);
        }
        .config-status {
            font-size: 11px;
            margin-top: 8px;
            text-align: center;
            color: var(--neon-green);
        }

        .settings-panel {
            background: var(--bg-glass);
            border: 1px solid var(--border-glass);
            border-radius: var(--radius-md);
            margin-bottom: 16px;
            padding: 12px;
            display: none;
            transition: all var(--transition-normal);
        }
        .settings-panel.open {
            display: block;
            animation: fadeIn 0.2s ease-out;
        }
        .settings-row {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
            align-items: center;
        }
        .settings-row label {
            font-size: 12px;
            width: 70px;
            color: var(--text-secondary);
        }
        .settings-row select {
            flex: 1;
            padding: 8px 10px;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-glass);
            background: var(--bg-glass);
            color: var(--text-primary);
            font-size: 12px;
        }
        .settings-row button {
            flex: 1;
            padding: 9px;
            border-radius: var(--radius-md);
            border: none;
            background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
            color: #0a0e17;
            font-weight: 700;
            font-size: 11px;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all var(--transition-normal);
        }
        .settings-row button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 153, 255, 0.25);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin: 12px 0 18px;
        }
        .stat-card {
            background: var(--bg-glass);
            border: 1px solid var(--border-glass);
            border-radius: var(--radius-md);
            padding: 10px 8px;
            text-align: center;
            transition: all var(--transition-normal);
        }
        .stat-card:hover {
            background: var(--bg-glass-hover);
            border-color: rgba(100, 120, 180, 0.4);
            transform: translateY(-2px);
        }
        .stat-value {
            font-size: 17px;
            font-weight: 700;
            display: block;
            margin-bottom: 2px;
            transition: color var(--transition-fast);
        }
        .stat-label {
            font-size: 9px;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.4px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 3px;
        }
        .stat-label svg {
            width: 10px;
            height: 10px;
            vertical-align: middle;
        }
        .stat-card.success .stat-label svg { stroke: var(--neon-green); }
        .stat-card.error .stat-label svg { stroke: var(--neon-red); }
        .stat-card.time .stat-label svg { stroke: var(--neon-blue); }
        .stat-card.success .stat-value { color: var(--neon-green); }
        .stat-card.error .stat-value { color: var(--neon-red); }
        .stat-card.time .stat-value { color: var(--neon-blue); }
        .stat-value.updating {
            animation: countPulse 0.2s ease;
        }

        .progress-section {
            margin: 12px 0 16px;
        }
        .progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 11px;
            color: var(--text-secondary);
        }
        .progress-header svg {
            width: 10px;
            height: 10px;
            vertical-align: middle;
            stroke: var(--neon-blue);
            stroke-width: 2;
        }
        .progress-bar-container {
            height: 7px;
            background: rgba(45, 55, 85, 0.7);
            border-radius: var(--radius-full);
            overflow: hidden;
            position: relative;
            border: 1px solid var(--border-glass);
        }
        .progress-bar-fill {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, var(--neon-blue), var(--neon-purple));
            border-radius: var(--radius-full);
            position: relative;
            transition: width var(--transition-slow);
            box-shadow: 0 0 15px rgba(0, 153, 255, 0.4);
        }
        .progress-bar-fill::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
            animation: shimmer 2s infinite;
            opacity: 0.6;
        }
        .progress-bar-fill.running {
            background: linear-gradient(90deg, var(--neon-green), #00cc88);
            box-shadow: 0 0 15px rgba(0, 255, 157, 0.4);
        }
        .progress-bar-fill.error {
            background: linear-gradient(90deg, var(--neon-red), #ff6b85);
            box-shadow: 0 0 15px rgba(255, 77, 106, 0.4);
            animation: progress-shake 0.3s ease-in-out infinite;
        }

        .status-section {
            margin-bottom: 16px;
        }
        .status-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 14px;
            padding: 10px 14px;
            background: var(--bg-glass);
            border-radius: var(--radius-md);
            border: 1px solid var(--border-glass);
            transition: all var(--transition-normal);
        }
        .status-dot {
            width: 14px;
            height: 14px;
            border-radius: var(--radius-full);
            position: relative;
            flex-shrink: 0;
            transition: background var(--transition-fast), box-shadow var(--transition-fast);
        }
        .status-dot::after {
            content: '';
            position: absolute;
            inset: -4px;
            border-radius: var(--radius-full);
            animation: pulse-ring 2s infinite;
            opacity: 0;
            transition: opacity var(--transition-fast);
        }
        .status-dot.ready { background: var(--neon-blue); box-shadow: 0 0 12px var(--neon-blue); }
        .status-dot.ready::after { background: var(--neon-blue); opacity: 0.6; }
        .status-dot.running { background: var(--neon-green); box-shadow: 0 0 12px var(--neon-green); }
        .status-dot.running::after { background: var(--neon-green); opacity: 0.6; }
        .status-dot.error { background: var(--neon-red); box-shadow: 0 0 12px var(--neon-red); }
        .status-dot.error::after { background: var(--neon-red); opacity: 0.6; }
        .status-message {
            font-size: 13px;
            font-weight: 500;
            color: var(--text-secondary);
            transition: color var(--transition-fast);
        }
        .status-message.ready { color: var(--neon-blue); }
        .status-message.running { color: var(--neon-green); }
        .status-message.error { color: var(--neon-red); }
        .status-time {
            font-size: 11px;
            color: var(--text-muted);
            margin-top: 4px;
            text-align: center;
            opacity: 0.9;
        }

        .button-group {
            display: flex;
            gap: 8px;
            margin-bottom: 14px;
        }
        .btn {
            flex: 1;
            padding: 9px 8px;
            border: none;
            border-radius: var(--radius-md);
            font-weight: 600;
            font-size: 11px;
            cursor: pointer;
            transition: all var(--transition-normal);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .btn svg {
            width: 14px;
            height: 14px;
            stroke-width: 2;
            flex-shrink: 0;
        }
        .btn-primary {
            background: linear-gradient(135deg, rgba(0, 153, 255, 0.15), rgba(183, 110, 255, 0.15));
            color: var(--neon-blue);
            border: 1px solid rgba(0, 153, 255, 0.4);
        }
        .btn-primary svg { stroke: var(--neon-blue); fill: var(--neon-blue); }
        .btn-primary:hover:not(:disabled) {
            border-color: var(--neon-blue);
            box-shadow: 0 4px 15px rgba(0, 153, 255, 0.25);
            transform: translateY(-2px);
        }
        .btn-danger {
            background: linear-gradient(135deg, rgba(255, 77, 106, 0.15), rgba(255, 107, 133, 0.15));
            color: var(--neon-red);
            border: 1px solid rgba(255, 77, 106, 0.4);
        }
        .btn-danger svg { stroke: var(--neon-red); fill: var(--neon-red); }
        .btn-danger:hover:not(:disabled) {
            border-color: var(--neon-red);
            box-shadow: 0 4px 15px rgba(255, 77, 106, 0.25);
            transform: translateY(-2px);
        }
        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
            border: 1px solid var(--border-glass);
        }
        .btn-secondary svg { stroke: var(--text-primary); }
        .btn-secondary:hover:not(:disabled) {
            background: var(--bg-glass-hover);
            border-color: rgba(100, 120, 180, 0.5);
            transform: translateY(-2px);
        }
        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none !important;
        }
        .btn:disabled svg { opacity: 0.6; }
        .btn:active:not(:disabled) { transform: translateY(0); }

        .dashboard-footer {
            font-size: 10px;
            text-align: center;
            color: var(--text-muted);
            border-top: 1px solid var(--border-glass);
            padding-top: 12px;
            margin-top: 4px;
            line-height: 1.5;
            opacity: 0.9;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
        }
        .dashboard-footer .icon-row {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .dashboard-footer svg {
            width: 10px;
            height: 10px;
            vertical-align: middle;
        }
        .dashboard-footer .lock-icon svg { stroke: var(--neon-blue); }
        .dashboard-footer .pin-icon svg { stroke: var(--neon-purple); }
        .dashboard-footer strong {
            color: var(--neon-blue);
            font-weight: 600;
        }

        .minimize-btn, .settings-toggle-btn {
            cursor: pointer;
            background: rgba(255,255,255,0.1);
            border: 1px solid var(--border-glass);
            color: var(--text-primary);
            width: 28px;
            height: 28px;
            border-radius: var(--radius-sm);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all var(--transition-fast);
            margin-left: 8px;
            font-size: 14px;
        }
        .minimize-btn:hover, .settings-toggle-btn:hover {
            background: var(--bg-glass-hover);
            border-color: rgba(100, 120, 180, 0.4);
        }
        .draggable { cursor: move; }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: var(--neon-blue); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--neon-purple); }
        
        .fade-in { animation: fadeIn 0.3s ease forwards; }
    </style>

    <div class="dashboard-container" id="dashboard">
        <div class="bg-particles">
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
        </div>

        <div class="dashboard-header draggable">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>
                    <span class="ai-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="8" width="18" height="12" rx="2"/>
                            <path d="M12 8V4M8 20v2M16 20v2M7 12h2M15 12h2"/>
                        </svg>
                    </span>
                    <span data-i18n="app_title">AutoSolve Dashboard</span>
                </h3>
                <div>
                    <button class="settings-toggle-btn" id="settingsToggleBtn">⚙️</button>
                    <button class="minimize-btn" id="minimizeBtn">−</button>
                </div>
            </div>
            <p data-i18n="app_subtitle">Assistant IA • Réponse automatique</p>
        </div>

        <div id="dashboardContent">
            <div class="dashboard-content">
                <div class="settings-panel" id="settingsPanel">
                    <div class="settings-row">
                        <label data-i18n="theme_label">Thème</label>
                        <select id="themeSelect">
                            <option value="blue">Blue</option>
                            <option value="red">Red</option>
                            <option value="green">Green</option>
                            <option value="purple">Purple</option>
                            <option value="white">White</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>
                    <div class="settings-row">
                        <label data-i18n="language_label">Langue</label>
                        <select id="languageSelect">
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                            <option value="ar">العربية</option>
                        </select>
                    </div>
                    <div class="settings-row">
                        <button id="applySettingsBtn" data-i18n="apply_btn">Appliquer</button>
                    </div>
                </div>

                <div class="config-section">
                    <div class="config-row">
                        <label data-i18n="api_key_label">🔑</label>
                        <input type="text" id="apiKeyInput" data-i18n-placeholder="api_key_placeholder" placeholder="">
                        <button id="saveApiKeyBtn">
                            <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                <polyline points="17 21 17 13 7 13 7 21"/>
                                <polyline points="7 3 7 8 15 8"/>
                            </svg>
                        </button>
                    </div>
                    <div class="config-row">
                        <label data-i18n="level_label">📚</label>
                        <select id="levelSelect">
                            <option value="1as">1AS</option>
                            <option value="2as">2AS</option>
                            <option value="3as">3AS</option>
                        </select>
                        <button id="saveLevelBtn">
                            <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                <polyline points="17 21 17 13 7 13 7 21"/>
                                <polyline points="7 3 7 8 15 8"/>
                            </svg>
                        </button>
                    </div>
                    <div id="configStatus" class="config-status" data-i18n="config_loaded">✅ Configuration chargée</div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card success">
                        <span class="stat-value" id="successCount">0</span>
                        <span class="stat-label" data-i18n="success_stat">
                            <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            Réussies
                        </span>
                    </div>
                    <div class="stat-card error">
                        <span class="stat-value" id="errorCount">0</span>
                        <span class="stat-label" data-i18n="errors_stat">
                            <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="15" y1="9" x2="9" y2="15"/>
                                <line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                            Échecs
                        </span>
                    </div>
                    <div class="stat-card time">
                        <span class="stat-value" id="timeElapsed">0s</span>
                        <span class="stat-label" data-i18n="time_stat">
                            <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            Temps
                        </span>
                    </div>
                </div>

                <div class="progress-section">
                    <div class="progress-header">
                        <span>
                            <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 12a9 9 0 1 1-6.22-8.55M3 3v6h6"/>
                            </svg>
                            <span data-i18n="progress_label">Progression</span>
                        </span>
                        <span id="progressText">0 / ${TOTAL_QUESTIONS}</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" id="progressBarFill"></div>
                    </div>
                </div>

                <div class="status-section">
                    <div class="status-header">
                        <div class="status-dot ready" id="statusDot"></div>
                        <span class="status-message ready" id="statusMessage" data-i18n="status_ready">✅ Système prêt</span>
                    </div>
                    <div class="status-time" id="lastUpdate" data-i18n="last_update">Dernière mise à jour: --</div>
                </div>

                <div class="button-group">
                    <button class="btn btn-primary" id="startBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px">
                            <circle cx="12" cy="12" r="10"/>
                            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
                        </svg>
                        <span data-i18n="btn_start">Démarrer</span>
                    </button>
                    <button class="btn btn-danger" id="stopBtn" disabled>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px">
                            <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>
                        </svg>
                        <span data-i18n="btn_stop">Arrêter</span>
                    </button>
                    <button class="btn btn-secondary" id="resetBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px">
                            <polyline points="23 4 23 10 17 10"/>
                            <polyline points="1 20 1 14 7 14"/>
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                        </svg>
                        <span data-i18n="btn_reset">Réinitialiser</span>
                    </button>
                </div>
            </div>

            <div class="dashboard-footer">
                <div class="icon-row lock-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <strong data-i18n="footer_created">Created by AMINE HDD</strong>
                </div>
                <div class="icon-row pin-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-2zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    <span data-i18n="footer_control">Cliquez pour contrôler le tableau de bord</span>
                </div>
            </div>
        </div>
    </div>
`;