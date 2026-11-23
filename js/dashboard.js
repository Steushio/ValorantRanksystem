/**
 * Valorant Live Rank Overlay - Configuration Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const inputName = document.getElementById('input-name');
  const inputTag = document.getElementById('input-tag');
  const inputPuuid = document.getElementById('input-puuid');
  const toggleUsePuuid = document.getElementById('toggle-use-puuid');
  const selectRegion = document.getElementById('select-region');
  const inputKey = document.getElementById('input-key');
  const btnToggleKey = document.getElementById('btn-toggle-key');
  const sliderScale = document.getElementById('slider-scale');
  const scaleDisplay = document.getElementById('scale-display');
  const selectRefresh = document.getElementById('select-refresh');

  const toggleName = document.getElementById('toggle-name');
  const toggleRankName = document.getElementById('toggle-rank-name');
  const toggleDelta = document.getElementById('toggle-delta');
  const togglePeak = document.getElementById('toggle-peak');
  const toggleSession = document.getElementById('toggle-session');
  const toggleSound = document.getElementById('toggle-sound');
  const toggleDemo = document.getElementById('toggle-demo');

  const demoControlsGroup = document.getElementById('demo-controls-group');
  const selectDemoTier = document.getElementById('select-demo-tier');
  const sliderDemoRr = document.getElementById('slider-demo-rr');
  const demoRrDisplay = document.getElementById('demo-rr-display');

  const previewIframe = document.getElementById('preview-iframe');
  const previewCanvas = document.getElementById('preview-canvas');
  const generatedUrlInput = document.getElementById('generated-url');
  const btnCopyUrl = document.getElementById('btn-copy-url');
  const btnOpenTab = document.getElementById('btn-open-tab');
  const btnTestApi = document.getElementById('btn-test-api');
  const testStatusBox = document.getElementById('test-status-box');

  const obsWidthText = document.getElementById('obs-width-text');
  const obsHeightText = document.getElementById('obs-height-text');

  // Layout size presets for OBS Studio
  const LAYOUT_PRESETS = {
    pill: { width: 520, height: 95 },
    card: { width: 380, height: 160 },
    minimal: { width: 300, height: 75 },
    wide: { width: 660, height: 110 }
  };

  // Populate Demo Tier Selector
  if (selectDemoTier) {
    selectDemoTier.innerHTML = '';
    for (let i = 0; i <= 27; i++) {
      const meta = window.ValorantApi.getTierMeta(i);
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = meta.name;
      if (i === 19) opt.selected = true; // Diamond 2 default
      selectDemoTier.appendChild(opt);
    }
  }

  // Load saved credentials from localStorage
  if (localStorage.getItem('val_hdev_key')) {
    inputKey.value = localStorage.getItem('val_hdev_key');
  }
  if (localStorage.getItem('val_riot_name')) {
    inputName.value = localStorage.getItem('val_riot_name');
  }
  if (localStorage.getItem('val_riot_tag')) {
    inputTag.value = localStorage.getItem('val_riot_tag');
  }
  if (localStorage.getItem('val_riot_puuid') && inputPuuid) {
    inputPuuid.value = localStorage.getItem('val_riot_puuid');
  }
  if (localStorage.getItem('val_region')) {
    selectRegion.value = localStorage.getItem('val_region');
  }

  // Key visibility toggle
  btnToggleKey.addEventListener('click', () => {
    if (inputKey.type === 'password') {
      inputKey.type = 'text';
      btnToggleKey.textContent = 'Hide';
    } else {
      inputKey.type = 'password';
      btnToggleKey.textContent = 'Show';
    }
  });

  // Scale display update
  sliderScale.addEventListener('input', () => {
    scaleDisplay.textContent = `${Math.round(sliderScale.value * 100)}%`;
    updateOverlay();
  });

  // Demo RR display update
  sliderDemoRr.addEventListener('input', () => {
    demoRrDisplay.textContent = `${sliderDemoRr.value} RR`;
    updateOverlay();
  });

  // Toggle demo mode UI
  toggleDemo.addEventListener('change', () => {
    if (toggleDemo.checked) {
      demoControlsGroup.style.display = 'block';
    } else {
      demoControlsGroup.style.display = 'none';
    }
    updateOverlay();
  });

  // Background style switchers for preview canvas
  document.querySelectorAll('.preview-bg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preview-bg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const bg = btn.dataset.bg;
      previewCanvas.className = `preview-canvas bg-${bg}`;
    });
  });

  // Get selected radio value
  function getSelectedRadio(name) {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : '';
  }

  /**
   * Build query parameters object
   */
  function buildConfig() {
    const layout = getSelectedRadio('layout') || 'pill';
    const theme = getSelectedRadio('theme') || 'tactical';
    const isDemo = toggleDemo.checked;

    return {
      puuid: inputPuuid ? inputPuuid.value.trim() : '',
      usePuuid: toggleUsePuuid ? toggleUsePuuid.checked : true,
      name: inputName.value.trim(),
      tag: inputTag.value.trim().replace(/^#/, ''),
      region: selectRegion.value,
      key: inputKey.value.trim(),
      layout,
      theme,
      scale: parseFloat(sliderScale.value) || 1.0,
      refresh: parseInt(selectRefresh.value, 10) || 60,
      showName: toggleName.checked,
      showRankName: toggleRankName.checked,
      showDelta: toggleDelta.checked,
      showPeak: togglePeak.checked,
      showSession: toggleSession.checked,
      sound: toggleSound.checked,
      demo: isDemo,
      demoTier: parseInt(selectDemoTier.value, 10) || 19,
      demoRr: parseInt(sliderDemoRr.value, 10) || 72
    };
  }

  /**
   * Construct full URL for Browser Source
   */
  function generateUrl(cfg) {
    const base = new URL('overlay.html', window.location.href);
    
    if (cfg.demo) {
      base.searchParams.set('demo', 'true');
      base.searchParams.set('demoTier', cfg.demoTier);
      base.searchParams.set('demoRr', cfg.demoRr);
    } else {
      if (cfg.usePuuid && cfg.puuid) {
        base.searchParams.set('puuid', cfg.puuid);
      } else {
        if (cfg.name) base.searchParams.set('name', cfg.name);
        if (cfg.tag) base.searchParams.set('tag', cfg.tag);
      }
      if (cfg.region) base.searchParams.set('region', cfg.region);
      if (cfg.key) base.searchParams.set('key', cfg.key);
    }

    base.searchParams.set('layout', cfg.layout);
    base.searchParams.set('theme', cfg.theme);
    if (cfg.scale !== 1.0) base.searchParams.set('scale', cfg.scale);
    if (cfg.refresh !== 60) base.searchParams.set('refresh', cfg.refresh);
    if (!cfg.showName) base.searchParams.set('showName', 'false');
    if (!cfg.showRankName) base.searchParams.set('showRankName', 'false');
    if (!cfg.showDelta) base.searchParams.set('showDelta', 'false');
    if (!cfg.showPeak) base.searchParams.set('showPeak', 'false');
    if (!cfg.showSession) base.searchParams.set('showSession', 'false');
    if (cfg.sound) base.searchParams.set('sound', 'true');

    return base.toString();
  }

  /**
   * Update Preview and URL fields
   */
  function updateOverlay() {
    const cfg = buildConfig();

    // Save to localStorage
    if (cfg.key) localStorage.setItem('val_hdev_key', cfg.key);
    if (cfg.name) localStorage.setItem('val_riot_name', cfg.name);
    if (cfg.tag) localStorage.setItem('val_riot_tag', cfg.tag);
    if (cfg.puuid) localStorage.setItem('val_riot_puuid', cfg.puuid);
    if (cfg.region) localStorage.setItem('val_region', cfg.region);

    const fullUrl = generateUrl(cfg);
    generatedUrlInput.value = fullUrl;

    // Update OBS size recommendations
    const preset = LAYOUT_PRESETS[cfg.layout] || LAYOUT_PRESETS.pill;
    const scaledWidth = Math.round(preset.width * cfg.scale);
    const scaledHeight = Math.round(preset.height * cfg.scale);
    obsWidthText.textContent = `${scaledWidth} px`;
    obsHeightText.textContent = `${scaledHeight} px`;

    // Resize iframe container to fit layout nicely
    previewIframe.style.width = `${scaledWidth + 30}px`;
    previewIframe.style.height = `${scaledHeight + 30}px`;

    // Update iframe source
    if (previewIframe.contentWindow && previewIframe.contentWindow.OverlayController) {
      previewIframe.contentWindow.OverlayController.updateConfig(cfg);
    } else {
      previewIframe.src = fullUrl;
    }
  }

  // Attach change listeners to all form fields
  [
    inputName, inputTag, inputPuuid, toggleUsePuuid, selectRegion, inputKey, selectRefresh,
    toggleName, toggleRankName, toggleDelta, togglePeak, toggleSession, toggleSound,
    selectDemoTier
  ].filter(Boolean).forEach(el => {
    el.addEventListener('input', updateOverlay);
    el.addEventListener('change', updateOverlay);
  });

  document.querySelectorAll('input[name="layout"], input[name="theme"]').forEach(radio => {
    radio.addEventListener('change', updateOverlay);
  });

  // Copy URL to clipboard
  btnCopyUrl.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(generatedUrlInput.value);
      const originalText = btnCopyUrl.innerHTML;
      btnCopyUrl.classList.add('copied');
      btnCopyUrl.innerHTML = '&#10003; Copied!';
      setTimeout(() => {
        btnCopyUrl.classList.remove('copied');
        btnCopyUrl.innerHTML = originalText;
      }, 2000);
    } catch (e) {
      generatedUrlInput.select();
      document.execCommand('copy');
    }
  });

  // Open overlay in new tab
  btnOpenTab.addEventListener('click', () => {
    window.open(generatedUrlInput.value, '_blank');
  });

  // Test API live connection
  btnTestApi.addEventListener('click', async () => {
    const name = inputName.value.trim();
    const tag = inputTag.value.trim().replace(/^#/, '');
    const region = selectRegion.value;
    const key = inputKey.value.trim();

    if (!name || !tag) {
      showTestStatus('Please enter your Riot Name and Tagline above first.', 'error');
      return;
    }

    showTestStatus('Testing HenrikDev API connection...', 'pending');
    btnTestApi.disabled = true;

    try {
      const data = await window.ValorantApi.fetchValorantMmr({
        puuid: inputPuuid ? inputPuuid.value.trim() : '',
        name,
        tag,
        region,
        apiKey: key
      });

      if (data.puuid && inputPuuid) {
        inputPuuid.value = data.puuid;
        localStorage.setItem('val_riot_puuid', data.puuid);
      }

      showTestStatus(
        `SUCCESS! Connected to ${data.playerName}#${data.playerTag} (${data.tierName}, ${data.rr} RR) — PUUID Linked (Name-Change Proof!)`,
        'success'
      );

      // If test succeeded, ensure demo mode is turned off so user sees their real rank
      if (toggleDemo.checked) {
        toggleDemo.checked = false;
        demoControlsGroup.style.display = 'none';
        updateOverlay();
      }
    } catch (err) {
      showTestStatus(`API Error: ${err.message}`, 'error');
    } finally {
      btnTestApi.disabled = false;
    }
  });

  function showTestStatus(msg, type) {
    testStatusBox.style.display = 'block';
    testStatusBox.className = `test-status-box ${type}`;
    testStatusBox.textContent = msg;
  }

  // Simulation test buttons for stream testing
  const btnSimGain = document.getElementById('btn-sim-gain');
  const btnSimLoss = document.getElementById('btn-sim-loss');
  const btnSimRankUp = document.getElementById('btn-sim-rankup');
  const btnResetSession = document.getElementById('btn-reset-session');

  if (btnSimGain) {
    btnSimGain.addEventListener('click', () => {
      let currentRr = parseInt(sliderDemoRr.value, 10);
      sliderDemoRr.value = Math.min(100, currentRr + 22);
      demoRrDisplay.textContent = `${sliderDemoRr.value} RR`;
      if (!toggleDemo.checked) {
        toggleDemo.checked = true;
        demoControlsGroup.style.display = 'block';
      }
      updateOverlay();
    });
  }

  if (btnSimLoss) {
    btnSimLoss.addEventListener('click', () => {
      let currentRr = parseInt(sliderDemoRr.value, 10);
      sliderDemoRr.value = Math.max(0, currentRr - 17);
      demoRrDisplay.textContent = `${sliderDemoRr.value} RR`;
      if (!toggleDemo.checked) {
        toggleDemo.checked = true;
        demoControlsGroup.style.display = 'block';
      }
      updateOverlay();
    });
  }

  if (btnSimRankUp) {
    btnSimRankUp.addEventListener('click', () => {
      let currentTier = parseInt(selectDemoTier.value, 10);
      selectDemoTier.value = Math.min(27, currentTier + 1);
      sliderDemoRr.value = 10;
      demoRrDisplay.textContent = '10 RR';
      if (!toggleDemo.checked) {
        toggleDemo.checked = true;
        demoControlsGroup.style.display = 'block';
      }
      updateOverlay();
    });
  }

  if (btnResetSession) {
    btnResetSession.addEventListener('click', () => {
      if (previewIframe.contentWindow && previewIframe.contentWindow.OverlayController) {
        previewIframe.contentWindow.OverlayController.resetSession();
      }
    });
  }

  // Initial trigger
  updateOverlay();
});
