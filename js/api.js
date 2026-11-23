/**
 * Valorant Live Rank Overlay - HenrikDev API Client & Tier Mappings
 */

const TIER_MAP = {
  0: { name: 'UNRANKED', division: 'UNRANKED', color: '#7c8893', glow: 'rgba(124, 136, 147, 0.35)' },
  1: { name: 'UNRANKED', division: 'UNRANKED', color: '#7c8893', glow: 'rgba(124, 136, 147, 0.35)' },
  2: { name: 'UNRANKED', division: 'UNRANKED', color: '#7c8893', glow: 'rgba(124, 136, 147, 0.35)' },
  3: { name: 'IRON 1', division: 'IRON', color: '#687480', glow: 'rgba(104, 116, 128, 0.4)' },
  4: { name: 'IRON 2', division: 'IRON', color: '#778491', glow: 'rgba(119, 132, 145, 0.4)' },
  5: { name: 'IRON 3', division: 'IRON', color: '#8897a6', glow: 'rgba(136, 151, 166, 0.4)' },
  6: { name: 'BRONZE 1', division: 'BRONZE', color: '#97724a', glow: 'rgba(151, 114, 74, 0.4)' },
  7: { name: 'BRONZE 2', division: 'BRONZE', color: '#ab8458', glow: 'rgba(171, 132, 88, 0.4)' },
  8: { name: 'BRONZE 3', division: 'BRONZE', color: '#c49969', glow: 'rgba(196, 153, 105, 0.4)' },
  9: { name: 'SILVER 1', division: 'SILVER', color: '#96a1aa', glow: 'rgba(150, 161, 170, 0.4)' },
  10: { name: 'SILVER 2', division: 'SILVER', color: '#b0bac3', glow: 'rgba(176, 186, 195, 0.4)' },
  11: { name: 'SILVER 3', division: 'SILVER', color: '#cad5df', glow: 'rgba(202, 213, 223, 0.4)' },
  12: { name: 'GOLD 1', division: 'GOLD', color: '#cf9f2e', glow: 'rgba(207, 159, 46, 0.45)' },
  13: { name: 'GOLD 2', division: 'GOLD', color: '#e5b53d', glow: 'rgba(229, 181, 61, 0.45)' },
  14: { name: 'GOLD 3', division: 'GOLD', color: '#f7cb52', glow: 'rgba(247, 203, 82, 0.5)' },
  15: { name: 'PLATINUM 1', division: 'PLATINUM', color: '#2b96a9', glow: 'rgba(43, 150, 169, 0.45)' },
  16: { name: 'PLATINUM 2', division: 'PLATINUM', color: '#38b0c5', glow: 'rgba(56, 176, 197, 0.45)' },
  17: { name: 'PLATINUM 3', division: 'PLATINUM', color: '#4dc9e0', glow: 'rgba(77, 201, 224, 0.5)' },
  18: { name: 'DIAMOND 1', division: 'DIAMOND', color: '#9c5ed6', glow: 'rgba(156, 94, 214, 0.45)' },
  19: { name: 'DIAMOND 2', division: 'DIAMOND', color: '#b275ec', glow: 'rgba(178, 117, 236, 0.5)' },
  20: { name: 'DIAMOND 3', division: 'DIAMOND', color: '#c78dff', glow: 'rgba(199, 141, 255, 0.55)' },
  21: { name: 'ASCENDANT 1', division: 'ASCENDANT', color: '#1fa677', glow: 'rgba(31, 166, 119, 0.5)' },
  22: { name: 'ASCENDANT 2', division: 'ASCENDANT', color: '#27c48d', glow: 'rgba(39, 196, 141, 0.55)' },
  23: { name: 'ASCENDANT 3', division: 'ASCENDANT', color: '#35e4a5', glow: 'rgba(53, 228, 165, 0.6)' },
  24: { name: 'IMMORTAL 1', division: 'IMMORTAL', color: '#b91c4d', glow: 'rgba(185, 28, 77, 0.55)' },
  25: { name: 'IMMORTAL 2', division: 'IMMORTAL', color: '#d8285e', glow: 'rgba(216, 40, 94, 0.6)' },
  26: { name: 'IMMORTAL 3', division: 'IMMORTAL', color: '#f23c75', glow: 'rgba(242, 60, 117, 0.65)' },
  27: { name: 'RADIANT', division: 'RADIANT', color: '#ffea78', glow: 'rgba(255, 234, 120, 0.75)' }
};

const VALORANT_API_TIER_UUID = '03621f52-342b-cf4e-4f86-9350a49c6d04';

/**
 * Returns tier icon URL from official Valorant API CDN
 */
function getTierIconUrl(tierId, size = 'large') {
  const safeId = Math.max(0, Math.min(27, parseInt(tierId, 10) || 0));
  const iconType = size === 'small' ? 'smallicon.png' : 'largeicon.png';
  return `https://media.valorant-api.com/competitivetiers/${VALORANT_API_TIER_UUID}/${safeId}/${iconType}`;
}

/**
 * Returns complete tier styling and metadata
 */
function getTierMeta(tierId) {
  const safeId = Math.max(0, Math.min(27, parseInt(tierId, 10) || 0));
  const base = TIER_MAP[safeId] || TIER_MAP[0];
  return {
    id: safeId,
    name: base.name,
    division: base.division,
    color: base.color,
    glow: base.glow,
    icon: getTierIconUrl(safeId, 'large'),
    smallIcon: getTierIconUrl(safeId, 'small'),
    isRadiant: safeId === 27,
    isImmortal: safeId >= 24 && safeId <= 26
  };
}

/**
 * Fetches Riot account info (including permanent PUUID) by Name and Tag
 */
async function fetchAccountByRiotId({ name, tag, apiKey = '' }) {
  if (!name || !tag) {
    throw new Error('Player Name and Tagline are required.');
  }

  const cleanName = encodeURIComponent(name.trim());
  const cleanTag = encodeURIComponent(tag.trim().replace(/^#/, ''));
  const headers = {};
  if (apiKey) headers['Authorization'] = apiKey.trim();
  const apiKeyQuery = apiKey ? `?api_key=${encodeURIComponent(apiKey.trim())}` : '';

  const url = `https://api.henrikdev.xyz/valorant/v1/account/${cleanName}/${cleanTag}${apiKeyQuery}`;
  const response = await fetch(url, { headers });

  if (response.status === 401 || response.status === 403) {
    throw new Error('API Key is missing or invalid.');
  }
  if (response.status === 404) {
    throw new Error(`Account ${name}#${tag} not found.`);
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch account info (${response.status})`);
  }

  const json = await response.json();
  if (json && json.data) {
    return {
      puuid: json.data.puuid,
      name: json.data.name,
      tag: json.data.tag,
      region: json.data.region
    };
  }
  throw new Error('Invalid account response structure');
}

/**
 * Fetches MMR from HenrikDev API by either permanent PUUID or Name + Tag
 */
async function fetchValorantMmr({ name, tag, puuid, region = 'na', platform = 'pc', apiKey = '' }) {
  const cleanRegion = (region || 'na').toLowerCase().trim();
  const cleanPlatform = (platform || 'pc').toLowerCase().trim();
  const cleanPuuid = (puuid || '').trim();

  if (!cleanPuuid && (!name || !tag)) {
    throw new Error('Either a permanent PUUID or both Player Name and Tagline are required.');
  }

  const cleanName = name ? encodeURIComponent(name.trim()) : '';
  const cleanTag = tag ? encodeURIComponent(tag.trim().replace(/^#/, '')) : '';

  const headers = {};
  if (apiKey) {
    headers['Authorization'] = apiKey.trim();
  }

  const apiKeyQuery = apiKey ? `?api_key=${encodeURIComponent(apiKey.trim())}` : '';

  // 1. Try v3 endpoint (by PUUID if available, otherwise by Name/Tag)
  const v3Url = cleanPuuid
    ? `https://api.henrikdev.xyz/valorant/v3/by-puuid/mmr/${cleanRegion}/${cleanPlatform}/${cleanPuuid}${apiKeyQuery}`
    : `https://api.henrikdev.xyz/valorant/v3/mmr/${cleanRegion}/${cleanPlatform}/${cleanName}/${cleanTag}${apiKeyQuery}`;

  try {
    const response = await fetch(v3Url, { headers });

    if (response.status === 401 || response.status === 403) {
      throw new Error('API Key is missing or invalid. Please check your HenrikDev API key.');
    }
    if (response.status === 429) {
      throw new Error('HenrikDev API rate limit reached. Waiting for next cycle...');
    }
    if (response.status === 404) {
      const identifier = cleanPuuid ? `PUUID "${cleanPuuid}"` : `Player ${name}#${tag}`;
      throw new Error(`${identifier} not found in region "${cleanRegion}". Verify region and spelling.`);
    }

    if (response.ok) {
      const json = await response.json();
      if (json && json.data) {
        return parseV3MmrResponse(json.data, cleanRegion, cleanPuuid);
      }
    }

    console.warn(`HenrikDev v3 responded with status ${response.status}. Attempting v1 fallback...`);
  } catch (err) {
    if (err.message.includes('API Key') || err.message.includes('rate limit') || err.message.includes('not found')) {
      throw err;
    }
    console.warn('v3 fetch error:', err.message);
  }

  // 2. Fallback to v1 endpoint
  const v1Url = cleanPuuid
    ? `https://api.henrikdev.xyz/valorant/v1/by-puuid/mmr/${cleanRegion}/${cleanPuuid}${apiKeyQuery}`
    : `https://api.henrikdev.xyz/valorant/v1/mmr/${cleanRegion}/${cleanName}/${cleanTag}${apiKeyQuery}`;

  const v1Resp = await fetch(v1Url, { headers });

  if (v1Resp.status === 401 || v1Resp.status === 403) {
    throw new Error('API Key is missing or invalid.');
  }
  if (v1Resp.status === 429) {
    throw new Error('HenrikDev API rate limit reached.');
  }
  if (!v1Resp.ok) {
    const errText = await v1Resp.text().catch(() => '');
    throw new Error(`HenrikDev API error (${v1Resp.status}): ${errText || v1Resp.statusText}`);
  }

  const v1Json = await v1Resp.json();
  if (!v1Json || !v1Json.data) {
    throw new Error('Invalid response structure received from API.');
  }

  return parseV1MmrResponse(v1Json.data, cleanRegion, cleanPuuid);
}

/**
 * Normalizes HenrikDev v3 MMR response
 */
function parseV3MmrResponse(data, region, fallbackPuuid = '') {
  const current = data.current || {};
  const peak = data.peak || {};
  const account = data.account || {};
  const seasonal = Array.isArray(data.seasonal) && data.seasonal.length > 0 ? data.seasonal[0] : null;

  const tierId = current.tier ? current.tier.id : 0;
  const tierMeta = getTierMeta(tierId);

  const peakTierId = peak.tier ? peak.tier.id : 0;
  const peakMeta = getTierMeta(peakTierId);

  const actWins = seasonal ? (seasonal.wins || 0) : 0;
  const actGames = seasonal ? (seasonal.games || 0) : 0;
  const actLosses = Math.max(0, actGames - actWins);

  return {
    puuid: account.puuid || data.puuid || fallbackPuuid,
    playerName: account.name || 'Agent',
    playerTag: account.tag || '0000',
    region: region.toUpperCase(),
    tierId,
    tierName: current.tier?.name || tierMeta.name,
    division: tierMeta.division,
    rr: typeof current.rr === 'number' ? current.rr : 0,
    maxRr: tierMeta.isRadiant ? null : 100,
    elo: current.elo || 0,
    lastChange: typeof current.last_change === 'number' ? current.last_change : 0,
    leaderboardRank: current.leaderboard_placement || null,
    peakTierId,
    peakTierName: peak.tier?.name || peakMeta.name,
    peakSeason: peak.season?.short ? peak.season.short.toUpperCase() : '',
    actWins,
    actLosses,
    actGames,
    color: tierMeta.color,
    glow: tierMeta.glow,
    icon: tierMeta.icon,
    smallIcon: tierMeta.smallIcon,
    isDemo: false,
    timestamp: Date.now()
  };
}

/**
 * Normalizes HenrikDev v1 MMR response
 */
function parseV1MmrResponse(data, region, fallbackPuuid = '') {
  const tierId = data.currenttier || 0;
  const tierMeta = getTierMeta(tierId);

  return {
    puuid: data.puuid || fallbackPuuid,
    playerName: data.name || 'Agent',
    playerTag: data.tag || '0000',
    region: region.toUpperCase(),
    tierId,
    tierName: data.currenttierpatched || tierMeta.name,
    division: tierMeta.division,
    rr: typeof data.ranking_in_tier === 'number' ? data.ranking_in_tier : 0,
    maxRr: tierMeta.isRadiant ? null : 100,
    elo: data.elo || 0,
    lastChange: typeof data.mmr_change_to_last_game === 'number' ? data.mmr_change_to_last_game : 0,
    leaderboardRank: null,
    peakTierId: tierId,
    peakTierName: data.currenttierpatched || tierMeta.name,
    peakSeason: '',
    actWins: 0,
    actLosses: 0,
    actGames: 0,
    color: tierMeta.color,
    glow: tierMeta.glow,
    icon: (data.images && data.images.large) ? data.images.large : tierMeta.icon,
    smallIcon: (data.images && data.images.small) ? data.images.small : tierMeta.smallIcon,
    isDemo: false,
    timestamp: Date.now()
  };
}

/**
 * Returns mock/demo data for instant previewing in dashboard
 */
function getDemoMmrData(tierId = 18, rr = 68, lastChange = 21) {
  const meta = getTierMeta(tierId);
  return {
    puuid: 'demo-puuid-0000-1111-2222',
    playerName: 'Jett',
    playerTag: 'WIND',
    region: 'NA',
    tierId: meta.id,
    tierName: meta.name,
    division: meta.division,
    rr: meta.isRadiant ? 450 : rr,
    maxRr: meta.isRadiant ? null : 100,
    elo: 1500 + meta.id * 50 + rr,
    lastChange,
    leaderboardRank: meta.isRadiant ? 134 : (meta.isImmortal ? 842 : null),
    peakTierId: Math.min(27, meta.id + 2),
    peakTierName: getTierMeta(Math.min(27, meta.id + 2)).name,
    peakSeason: 'E9A2',
    actWins: 14,
    actLosses: 8,
    actGames: 22,
    color: meta.color,
    glow: meta.glow,
    icon: meta.icon,
    smallIcon: meta.smallIcon,
    isDemo: true,
    timestamp: Date.now()
  };
}

// Export for window
if (typeof window !== 'undefined') {
  window.ValorantApi = {
    TIER_MAP,
    getTierMeta,
    getTierIconUrl,
    fetchAccountByRiotId,
    fetchValorantMmr,
    getDemoMmrData
  };
}
