/**
 * WAVE 16 — BLOCK EB, EC
 * CONFLICT & DIVERGENCE ENGINE + GLOBAL SIGNAL BROKER
 * 
 * Divergens är information – inte fel.
 * Decentraliserad relevans.
 */

// ============================================
// BLOCK EB: CONFLICT & DIVERGENCE ENGINE
// ============================================

export type DivergenceType = 
  | 'source_conflict'      // Olika källor ger olika värden
  | 'method_conflict'      // Olika metoder ger olika resultat
  | 'time_conflict'        // Olika tidsperioder/uppdateringsfrekvens
  | 'definition_conflict'; // Olika definitioner av samma begrepp

export type DivergenceSeverity = 
  | 'minor'      // <5% skillnad
  | 'moderate'   // 5-15% skillnad
  | 'significant' // 15-30% skillnad
  | 'major';     // >30% skillnad

export interface DivergenceRecord {
  divergence_id: string;
  detected_at: string;
  
  type: DivergenceType;
  severity: DivergenceSeverity;
  
  subject: {
    kpi_id?: string;
    index_id?: string;
    observation_id?: string;
    description: string;
  };
  
  analyses: Array<{
    node_id: string;
    node_name: string;
    value: number;
    unit: string;
    methodology: string;
    source: string;
    confidence: number;
    timestamp: string;
  }>;
  
  comparison: {
    min_value: number;
    max_value: number;
    spread_percent: number;
    mean_value: number;
    std_deviation: number;
  };
  
  explanation: {
    why_different: string;
    methodology_differences: string[];
    source_differences: string[];
    definition_differences: string[];
  };
  
  status: 'active' | 'acknowledged' | 'resolved' | 'permanent';
  
  // Transparency
  public_display: string;
}

export const DIVERGENCE_TYPES_CONFIG = {
  source_conflict: {
    name: 'Källkonflikt',
    description: 'Olika datakällor rapporterar olika värden för samma mått',
    common_causes: [
      'Olika insamlingsmetoder',
      'Olika tidsförskjutning',
      'Olika geografisk täckning',
    ],
    resolution: 'Visa båda med källhänvisning',
  },
  method_conflict: {
    name: 'Metodkonflikt',
    description: 'Olika analysmetoder ger olika resultat',
    common_causes: [
      'Olika statistiska modeller',
      'Olika antaganden',
      'Olika justeringar',
    ],
    resolution: 'Visa alla metoder med förklaringar',
  },
  time_conflict: {
    name: 'Tidskonflikt',
    description: 'Data från olika tidsperioder eller uppdateringsfrekvenser',
    common_causes: [
      'Olika rapporteringsperioder',
      'Olika eftersläpning',
      'Olika aggregeringsnivåer',
    ],
    resolution: 'Visa tidslinjer och senaste uppdatering',
  },
  definition_conflict: {
    name: 'Definitionskonflikt',
    description: 'Olika system definierar samma begrepp olika',
    common_causes: [
      'Nationella vs internationella definitioner',
      'Historiska vs nuvarande definitioner',
      'Domänspecifika variationer',
    ],
    resolution: 'Visa definitionsskillnader explicit',
  },
} as const;

export const DIVERGENCE_UI_CONFIG = {
  displayTemplate: {
    headline: 'Två öppna analyser visar olika resultat',
    subheadline: 'Här är varför',
    principle: 'Detta är radikal transparens',
  },
  
  visualization: {
    showAllValues: true,
    highlightDifferences: true,
    showMethodologyComparison: true,
    showSourceComparison: true,
    allowUserPreference: false, // Don't let users hide divergence
  },
  
  messaging: {
    never_say: [
      'Det korrekta värdet är...',
      'Den bästa analysen...',
      'Fel i data...',
    ],
    always_say: [
      'Olika analyser visar...',
      'Skillnaden beror på...',
      'Metoderna skiljer sig i...',
    ],
  },
} as const;

// ============================================
// BLOCK EC: GLOBAL SIGNAL BROKER
// ============================================

export type BrokerSignalType = 
  | 'observation'
  | 'change'
  | 'pattern'
  | 'anomaly'
  | 'learning';

export interface BrokeredSignal {
  signal_id: string;
  created_at: string;
  
  type: BrokerSignalType;
  
  source: {
    node_id: string;
    node_name: string;
    node_trust_score: number;
  };
  
  payload: {
    subject: string;
    description: string;
    magnitude: number;
    domains: string[];
    regions: string[];
  };
  
  confidence: number;
  
  traceability: {
    lineage_url: string;
    methodology_url: string;
    raw_data_url: string;
    reproducible: boolean;
  };
  
  propagation: {
    originated_at: string;
    hops: number;
    received_by_nodes: string[];
  };
  
  // Local priority (determined by receiving node)
  local_priority: number | null;
}

export const SIGNAL_BROKER_CONFIG = {
  signalTypes: {
    observation: {
      name: 'Observation',
      description: 'Faktisk förändring observerad i data',
      priority_base: 0.5,
    },
    change: {
      name: 'Change',
      description: 'Signifikant förändring från tidigare värde',
      priority_base: 0.6,
    },
    pattern: {
      name: 'Pattern',
      description: 'Återkommande mönster identifierat',
      priority_base: 0.4,
    },
    anomaly: {
      name: 'Anomaly',
      description: 'Ovanlig avvikelse från förväntat',
      priority_base: 0.7,
    },
    learning: {
      name: 'Learning',
      description: 'Ny kunskap eller bekräftat samband',
      priority_base: 0.3,
    },
  },
  
  rules: {
    no_central_amplification: {
      rule: 'Ingen signal förstoras centralt',
      description: 'Signaler behåller sin ursprungliga styrka',
      enforcement: 'protocol',
    },
    no_political_prioritization: {
      rule: 'Ingen signal prioriteras politiskt',
      description: 'Prioritering baseras endast på objektiva kriterier',
      enforcement: 'audit',
    },
    local_prioritization: {
      rule: 'Prioritering sker lokalt per nod',
      description: 'Varje nod bestämmer vad som är relevant för dess användare',
      enforcement: 'design',
    },
  },
  
  requirements: {
    allSignalsMustHave: [
      'confidence',
      'source',
      'traceability',
    ],
  },
  
  principle: 'Decentraliserad relevans.',
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function createDivergenceRecord(
  type: DivergenceType,
  subject: DivergenceRecord['subject'],
  analyses: DivergenceRecord['analyses']
): DivergenceRecord {
  const values = analyses.map(a => a.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const spread = ((max - min) / mean) * 100;
  
  let severity: DivergenceSeverity = 'minor';
  if (spread > 30) severity = 'major';
  else if (spread > 15) severity = 'significant';
  else if (spread > 5) severity = 'moderate';
  
  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  return {
    divergence_id: `div_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    detected_at: new Date().toISOString(),
    type,
    severity,
    subject,
    analyses,
    comparison: {
      min_value: min,
      max_value: max,
      spread_percent: spread,
      mean_value: mean,
      std_deviation: stdDev,
    },
    explanation: {
      why_different: DIVERGENCE_TYPES_CONFIG[type].description,
      methodology_differences: analyses.map(a => a.methodology),
      source_differences: analyses.map(a => a.source),
      definition_differences: [],
    },
    status: 'active',
    public_display: `${DIVERGENCE_UI_CONFIG.displayTemplate.headline}. ${DIVERGENCE_TYPES_CONFIG[type].name}: ${spread.toFixed(1)}% skillnad mellan ${analyses.length} analyser.`,
  };
}

export function createBrokeredSignal(
  type: BrokerSignalType,
  source: BrokeredSignal['source'],
  payload: BrokeredSignal['payload'],
  confidence: number
): BrokeredSignal {
  return {
    signal_id: `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
    type,
    source,
    payload,
    confidence,
    traceability: {
      lineage_url: `/api/lineage/signal/${type}`,
      methodology_url: '/docs/methodology',
      raw_data_url: `/api/raw/${type}`,
      reproducible: true,
    },
    propagation: {
      originated_at: new Date().toISOString(),
      hops: 0,
      received_by_nodes: [],
    },
    local_priority: null, // Set by receiving node
  };
}

export function getDivergenceDisplayText(record: DivergenceRecord): string {
  const template = DIVERGENCE_UI_CONFIG.displayTemplate;
  return `${template.headline}. ${template.subheadline}: ${record.explanation.why_different}`;
}

export const DIVERGENCE_STATUS = {
  version: '16.0',
  blocks: ['EB', 'EC'],
  capabilities: [
    'divergence_detection',
    'conflict_visualization',
    'signal_brokering',
    'decentralized_prioritization',
  ],
  principle: 'Divergens är information – inte fel.',
} as const;
