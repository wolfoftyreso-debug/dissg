/**
 * BLOCK 11: ACCOUNT, SESSION & STATE MODEL
 * 
 * Free = förstå världen (session-bound, stateless)
 * Paid = arbeta med världen (persistent)
 */

export type SessionTier = 'free' | 'pro' | 'org' | 'platform';
export type SessionType = 'anonymous' | 'authenticated';

export interface SessionCapabilities {
  // State persistence
  saveViews: boolean;
  saveCorrelations: boolean;
  saveScenarios: boolean;
  versionHistory: boolean;
  
  // Export
  exportCsv: boolean;
  exportJson: boolean;
  exportParquet: boolean;
  exportGraphics: boolean;
  
  // API
  apiAccess: boolean;
  webhooks: boolean;
  feeds: boolean;
  
  // History
  analysisHistory: boolean;
  undo: boolean;
}

export interface SessionState {
  type: SessionType;
  tier: SessionTier;
  isPersistent: boolean;
  capabilities: SessionCapabilities;
}

// Free session - all state is session-bound, resets on reload
export const FREE_SESSION: SessionState = {
  type: 'anonymous',
  tier: 'free',
  isPersistent: false,
  capabilities: {
    saveViews: false,
    saveCorrelations: false,
    saveScenarios: false,
    versionHistory: false,
    exportCsv: false,
    exportJson: false,
    exportParquet: false,
    exportGraphics: false,
    apiAccess: false,
    webhooks: false,
    feeds: false,
    analysisHistory: false,
    undo: false,
  }
};

// Pro session - individual analysts, journalists
export const PRO_SESSION: SessionState = {
  type: 'authenticated',
  tier: 'pro',
  isPersistent: true,
  capabilities: {
    saveViews: true,
    saveCorrelations: true,
    saveScenarios: true,
    versionHistory: true,
    exportCsv: true,
    exportJson: true,
    exportParquet: false,
    exportGraphics: true,
    apiAccess: true,
    webhooks: false,
    feeds: true,
    analysisHistory: true,
    undo: true,
  }
};

// Org session - companies, agencies
export const ORG_SESSION: SessionState = {
  type: 'authenticated',
  tier: 'org',
  isPersistent: true,
  capabilities: {
    saveViews: true,
    saveCorrelations: true,
    saveScenarios: true,
    versionHistory: true,
    exportCsv: true,
    exportJson: true,
    exportParquet: true,
    exportGraphics: true,
    apiAccess: true,
    webhooks: true,
    feeds: true,
    analysisHistory: true,
    undo: true,
  }
};

// Platform session - heavy API usage, white-label
export const PLATFORM_SESSION: SessionState = {
  type: 'authenticated',
  tier: 'platform',
  isPersistent: true,
  capabilities: {
    saveViews: true,
    saveCorrelations: true,
    saveScenarios: true,
    versionHistory: true,
    exportCsv: true,
    exportJson: true,
    exportParquet: true,
    exportGraphics: true,
    apiAccess: true,
    webhooks: true,
    feeds: true,
    analysisHistory: true,
    undo: true,
  }
};

// Get session by tier
export function getSessionByTier(tier: SessionTier): SessionState {
  switch (tier) {
    case 'free': return FREE_SESSION;
    case 'pro': return PRO_SESSION;
    case 'org': return ORG_SESSION;
    case 'platform': return PLATFORM_SESSION;
    default: return FREE_SESSION;
  }
}

// Check if capability is available
export function hasCapability(session: SessionState, capability: keyof SessionCapabilities): boolean {
  return session.capabilities[capability];
}

// UI copy for session state - BLOCK 11 requirement: clear, no dark patterns
export const SESSION_UI_COPY = {
  free: {
    stateWarning: "Dina inställningar sparas inte i gratisläget.",
    exportBlocked: "Export kräver Pro-konto.",
    historyBlocked: "Analyshistorik kräver Pro-konto.",
    apiBlocked: "API-åtkomst kräver Pro-konto.",
    upgradePrompt: "Logga in för att spara din analys",
    description: "Full insyn, session-bunden analys",
  },
  pro: {
    stateInfo: "Alla ändringar sparas automatiskt.",
    exportInfo: "Full export tillgänglig (CSV, JSON, PNG/SVG).",
    historyInfo: "Se din analyshistorik i profilen.",
    apiInfo: "API-åtkomst aktiverad (60 anrop/minut).",
    description: "Persistent analys, export, API",
  },
  org: {
    stateInfo: "Team-arbetsyta med delning.",
    exportInfo: "Full export inklusive Parquet.",
    apiInfo: "API-åtkomst med webhooks (600 anrop/minut).",
    description: "Team, automation, utökad API",
  },
  platform: {
    stateInfo: "Enterprise-konfiguration.",
    apiInfo: "Obegränsad API, white-label tillåten.",
    description: "Obegränsad, SLA, on-premise option",
  }
};

// Upgrade paths - what tier to suggest
export function getUpgradePath(currentTier: SessionTier, blockedCapability: keyof SessionCapabilities): SessionTier | null {
  const tierOrder: SessionTier[] = ['free', 'pro', 'org', 'platform'];
  const currentIndex = tierOrder.indexOf(currentTier);
  
  for (let i = currentIndex + 1; i < tierOrder.length; i++) {
    const session = getSessionByTier(tierOrder[i]);
    if (session.capabilities[blockedCapability]) {
      return tierOrder[i];
    }
  }
  return null;
}
