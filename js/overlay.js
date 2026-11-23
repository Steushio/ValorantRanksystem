/**
 * Valorant Live Rank Overlay - Core Controller & Renderer
 */

(function () {
  const audio = new window.OverlayAudio();

  // State
  let config = {};
  let currentData = null;
  let previousData = null;
  let pollIntervalId = null;
  let sessionState = {
    startRr: null,
    startTierId: null,
    wins: 0,
    losses: 0,
    netRr: 0
  };

  /**
   * Parse URL Query Parameters
   */
  function parseConfigFromUrl() {
    const params = new URLSearchParams(window.location.search);
    
    return {
      puuid: params.get('puuid') || '',
      name: params.get('name') || '',
      tag: (params.get('tag') || '').replace(/^#/, ''),
      region: (params.get('region') || 'na').toLowerCase(),
      platform: (params.get('platform') || 'pc').toLowerCase(),
      apiKey: params.get('key') || params.get('api_key') || '',
      layout: params.get('layout') || 'pill', // 'pill', 'card', 'minimal', 'wide'
      theme: params.get('theme') || 'tactical', // 'tactical', 'neon', 'glass', 'dark'
      scale: parseFloat(params.get('scale')) || 1.0,
      refresh: Math.max(30, parseInt(params.get('refresh'), 10) || 60),
      showName: params.get('showName') !== 'false',
      showPeak: params.get('showPeak') !== 'false',
      showDelta: params.get('showDelta') !== 'false',
      showSession: params.get('showSession') !== 'false',
      showRankName: params.get('showRankName') !== 'false',
      sound: params.get('sound') === 'true',
      demo: params.get('demo') === 'true',
      demoTier: parseInt(params.get('demoTier'), 10) || 19,
      demoRr: parseInt(params.get('demoRr'), 10) || 72,
      resetSession: params.get('reset') === '1'
    };
  }

  function getSessionKey() {
    return `val_overlay_session_${config.puuid || (config.name + '_' + config.tag)}`;
  }

  /**
   * Initialize Session Storage
   */
  function initSession(initialData) {
    const sessionKey = getSessionKey();
    if (config.resetSession) {
      sessionStorage.removeItem(sessionKey);
    }

    const saved = sessionStorage.getItem(sessionKey);
    if (saved) {
      try {
        sessionState = JSON.parse(saved);
        return;
      } catch (e) {
        console.warn('Failed to parse saved session:', e);
      }
    }

    sessionState = {
      startRr: initialData.rr,
      startTierId: initialData.tierId,
      wins: 0,
      losses: 0,
      netRr: 0
    };
    saveSession();
  }

  function saveSession() {
    const sessionKey = getSessionKey();
    sessionStorage.setItem(sessionKey, JSON.stringify(sessionState));
  }

  /**
   * Update Session Tracking based on new match data
   */
  function updateSessionOnDataChange(newData, oldData) {
    if (!oldData) return;

    const eloDiff = (newData.elo || 0) - (oldData.elo || 0);
    const rrDiff = (newData.rr || 0) - (oldData.rr || 0);

    if (eloDiff > 0 || (eloDiff === 0 && rrDiff > 0)) {
      sessionState.wins += 1;
      sessionState.netRr += Math.abs(newData.lastChange > 0 ? newData.lastChange : rrDiff);
      audio.playRrGain();
    } else if (eloDiff < 0 || (eloDiff === 0 && rrDiff < 0)) {
      sessionState.losses += 1;
      sessionState.netRr -= Math.abs(newData.lastChange < 0 ? Math.abs(newData.lastChange) : Math.abs(rrDiff));
      audio.playRrLoss();
    }

    // Check rank up
    if (newData.tierId > oldData.tierId) {
      audio.playRankUp();
      triggerRankUpAnimation(newData);
    }

    saveSession();
  }

  /**
   * Trigger Rank Up Special Celebration
   */
  function triggerRankUpAnimation(data) {
    const container = document.getElementById('overlay-container');
    if (!container) return;
    container.classList.add('rank-up-anim');
    setTimeout(() => {
      container.classList.remove('rank-up-anim');
    }, 3000);
  }

  /**
   * Animate Number Transition
   */
  function animateNumber(element, start, end, duration = 800, prefix = '', suffix = '') {
    if (!element) return;
    const startTime = performance.now();
    const diff = end - start;

    function frame(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + diff * ease);
      element.textContent = `${prefix}${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        element.textContent = `${prefix}${end}${suffix}`;
      }
    }

    requestAnimationFrame(frame);
  }

  /**
   * Apply Theme and Layout CSS Classes
   */
  function applyStyles(tierData) {
    const root = document.documentElement;
    const container = document.getElementById('overlay-container');
    if (!container) return;

    // Set layout and theme
    container.className = `overlay-layout-${config.layout} overlay-theme-${config.theme}`;

    // Apply scaling
    container.style.transform = `scale(${config.scale})`;
    container.style.transformOrigin = 'top left';

    // Apply dynamic tier colors
    root.style.setProperty('--tier-color', tierData.color);
    root.style.setProperty('--tier-glow', tierData.glow);
  }

  /**
   * Render Data to DOM Elements
   */
  function render(data) {
    applyStyles(data);

    // Rank Emblem
    const emblemImg = document.getElementById('tier-emblem');
    if (emblemImg && emblemImg.src !== data.icon) {
      emblemImg.src = data.icon;
      emblemImg.alt = data.tierName;
    }

    // Player Name
    const nameEl = document.getElementById('player-name');
    const nameWrap = document.getElementById('player-name-wrap');
    if (nameEl) {
      nameEl.textContent = `${data.playerName}#${data.playerTag}`;
    }
    if (nameWrap) {
      nameWrap.style.display = config.showName ? 'flex' : 'none';
    }

    // Rank Name
    const rankTitleEl = document.getElementById('rank-title');
    if (rankTitleEl) {
      rankTitleEl.textContent = data.tierName.toUpperCase();
      rankTitleEl.style.display = config.showRankName ? 'block' : 'none';
    }

    // Leaderboard Placement (Immortal / Radiant)
    const leaderboardBadge = document.getElementById('leaderboard-badge');
    if (leaderboardBadge) {
      if (data.leaderboardRank) {
        leaderboardBadge.textContent = `#${data.leaderboardRank}`;
        leaderboardBadge.style.display = 'inline-block';
      } else {
        leaderboardBadge.style.display = 'none';
      }
    }

    // RR Progress Bar & Text
    const rrTextEl = document.getElementById('rr-value');
    const rrBarEl = document.getElementById('rr-fill-bar');
    const rrMaxLabel = document.getElementById('rr-max-label');
    
    const prevRr = previousData ? previousData.rr : 0;
    const targetRr = data.rr;

    if (rrTextEl) {
      animateNumber(rrTextEl, prevRr, targetRr, 600);
    }

    if (rrBarEl) {
      const percentage = data.maxRr ? Math.min(100, Math.max(0, targetRr)) : 100;
      rrBarEl.style.width = `${percentage}%`;
    }

    if (rrMaxLabel) {
      rrMaxLabel.textContent = data.maxRr ? `/ ${data.maxRr} RR` : 'RR';
    }

    // Last Match Delta Badge
    const deltaWrap = document.getElementById('delta-badge');
    const deltaValue = document.getElementById('delta-value');
    const deltaArrow = document.getElementById('delta-arrow');

    if (deltaWrap && deltaValue && deltaArrow) {
      if (config.showDelta && data.lastChange !== 0) {
        deltaWrap.style.display = 'inline-flex';
        const isPositive = data.lastChange > 0;
        deltaWrap.className = `delta-badge ${isPositive ? 'delta-gain' : 'delta-loss'}`;
        deltaValue.textContent = `${isPositive ? '+' : ''}${data.lastChange} RR`;
        deltaArrow.innerHTML = isPositive ? '&#9650;' : '&#9660;';
      } else {
        deltaWrap.style.display = 'none';
      }
    }

    // Peak Rank
    const peakWrap = document.getElementById('peak-badge-wrap');
    const peakText = document.getElementById('peak-text');
    if (peakWrap && peakText) {
      if (config.showPeak && data.peakTierName && data.peakTierName !== 'UNRANKED') {
        peakWrap.style.display = 'inline-flex';
        peakText.textContent = `PEAK: ${data.peakTierName.toUpperCase()}${data.peakSeason ? ` (${data.peakSeason})` : ''}`;
      } else {
        peakWrap.style.display = 'none';
      }
    }

    // Session Stats
    const sessionWrap = document.getElementById('session-wrap');
    const sessionRecord = document.getElementById('session-record');
    const sessionNet = document.getElementById('session-net');

    if (sessionWrap && sessionRecord && sessionNet) {
      if (config.showSession) {
        sessionWrap.style.display = 'inline-flex';
        sessionRecord.textContent = `${sessionState.wins}W - ${sessionState.losses}L`;
        
        const net = sessionState.netRr;
        sessionNet.textContent = `${net >= 0 ? '+' : ''}${net} RR`;
        sessionNet.className = `session-net-value ${net > 0 ? 'text-gain' : net < 0 ? 'text-loss' : 'text-neutral'}`;
      } else {
        sessionWrap.style.display = 'none';
      }
    }

    // Clear loading or error display
    showOverlayContent();
  }

  function showOverlayContent() {
    const errorEl = document.getElementById('overlay-error');
    const mainEl = document.getElementById('overlay-content');
    if (errorEl) errorEl.style.display = 'none';
    if (mainEl) mainEl.style.display = 'flex';
  }

  function showError(msg, isWarning = false) {
    const errorEl = document.getElementById('overlay-error');
    const mainEl = document.getElementById('overlay-content');
    
    // If we already have loaded data, keep content visible and show small status bar
    if (currentData) {
      const statusPill = document.getElementById('status-pill');
      if (statusPill) {
        statusPill.textContent = msg;
        statusPill.style.display = 'block';
        setTimeout(() => {
          statusPill.style.display = 'none';
        }, 5000);
      }
      return;
    }

    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.className = isWarning ? 'overlay-status warning' : 'overlay-status error';
      errorEl.style.display = 'block';
    }
    if (mainEl && !currentData) {
      mainEl.style.display = 'none';
    }
  }

  /**
   * Main Fetch and Update Routine
   */
  async function refreshData() {
    const refreshDot = document.getElementById('refresh-indicator');
    if (refreshDot) refreshDot.classList.add('refreshing');

    try {
      let data;
      if (config.demo) {
        data = window.ValorantApi.getDemoMmrData(config.demoTier, config.demoRr, 21);
      } else {
        if (!config.puuid && (!config.name || !config.tag)) {
          throw new Error('Configure player PUUID or Name and Tag in overlay URL');
        }
        data = await window.ValorantApi.fetchValorantMmr({
          puuid: config.puuid,
          name: config.name,
          tag: config.tag,
          region: config.region,
          platform: config.platform,
          apiKey: config.apiKey
        });
      }

      if (!sessionState.startRr && sessionState.startRr !== 0) {
        initSession(data);
      } else if (previousData) {
        updateSessionOnDataChange(data, previousData);
      }

      previousData = currentData;
      currentData = data;
      render(data);

    } catch (err) {
      console.error('Valorant Overlay Error:', err);
      showError(err.message);
    } finally {
      if (refreshDot) {
        setTimeout(() => refreshDot.classList.remove('refreshing'), 600);
      }
    }
  }

  /**
   * Initial Setup
   */
  function init() {
    config = parseConfigFromUrl();
    audio.enabled = config.sound;

    // Check if configuration parameters are present
    const hasParams = config.puuid || (config.name && config.tag) || config.demo;
    if (!hasParams) {
      const noConfigEl = document.getElementById('no-config-banner');
      if (noConfigEl) {
        noConfigEl.style.display = 'flex';
      }
      return;
    }

    // Initial fetch
    refreshData();

    // Polling schedule
    if (pollIntervalId) clearInterval(pollIntervalId);
    pollIntervalId = setInterval(refreshData, config.refresh * 1000);
  }

  // Run on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API for iframe preview / dashboard communication
  window.OverlayController = {
    updateConfig: (newConfig) => {
      config = { ...config, ...newConfig };
      audio.enabled = config.sound;
      refreshData();
    },
    resetSession: () => {
      sessionState = {
        startRr: currentData ? currentData.rr : 0,
        startTierId: currentData ? currentData.tierId : 0,
        wins: 0,
        losses: 0,
        netRr: 0
      };
      saveSession();
      if (currentData) render(currentData);
    }
  };
})();
