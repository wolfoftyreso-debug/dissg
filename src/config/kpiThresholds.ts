/**
 * KPI TRÖSKELVÄRDEN FÖR AUTOMATISK STATUSBERÄKNING
 * ═══════════════════════════════════════════════════════════════
 * 
 * Varje KPI har trösklar som definierar:
 * - positive: Värdet är bra
 * - warning: Värdet avviker från önskat
 * - critical: Värdet är alarmerande
 * 
 * För inverterade KPI:er (där lägre är bättre) appliceras logiken omvänt.
 */

import type { KPIStatus } from '@/types/kpi';

export interface KPIThresholds {
  /** Gränsvärde för positiv status (lägsta acceptabla för icke-inverterade) */
  positive: number;
  /** Gränsvärde för varning (under detta blir det warning) */
  warning: number;
  /** Gränsvärde för kritisk status (under detta blir det critical) */
  critical: number;
  /** Trendprocent som triggar varning oavsett värde */
  trendWarning?: number;
  /** Trendprocent som triggar kritisk oavsett värde */
  trendCritical?: number;
}

/**
 * Trösklar per KPI-ID
 * 
 * Konvention:
 * - För normala KPI:er (högre = bättre): positive > warning > critical
 * - För inverterade KPI:er (lägre = bättre): critical > warning > positive
 */
export const KPI_THRESHOLDS: Record<string, KPIThresholds> = {
  // ═══════════════════════════════════════════════════════════════
  // A. DEMOGRAFI & HÄLSA
  // ═══════════════════════════════════════════════════════════════
  life_expectancy: {
    positive: 82,     // Justera för realistiska svenska värden
    warning: 81,
    critical: 79,
    trendWarning: -0.5,
    trendCritical: -1.0,
  },
  excess_mortality: {
    // Inverterad: lägre är bättre
    positive: 3,      // Under 3% är bra
    warning: 5,       // 3-5% är varning
    critical: 8,      // Över 8% är kritiskt
    trendWarning: 2.0,
    trendCritical: 5.0,
  },
  working_age_functional: {
    positive: 70,     // Justerat för svenska nivåer
    warning: 65,
    critical: 60,
    trendWarning: -1.5,
    trendCritical: -3.0,
  },

  // ═══════════════════════════════════════════════════════════════
  // B. ARBETE & PRODUKTIVITET
  // ═══════════════════════════════════════════════════════════════
  employment_rate_net: {
    positive: 67,     // Justerat för svenska nivåer
    warning: 63,
    critical: 58,
    trendWarning: -1.5,
    trendCritical: -3.0,
  },
  productivity_per_hour: {
    positive: 550,
    warning: 500,
    critical: 450,
    trendWarning: -3.0,
    trendCritical: -5.0,
  },
  long_term_unemployment: {
    // Inverterad
    positive: 1.5,
    warning: 2.5,
    critical: 4.0,
    trendWarning: 0.5,
    trendCritical: 1.0,
  },

  // ═══════════════════════════════════════════════════════════════
  // C. EKONOMISK BÄRKRAFT
  // ═══════════════════════════════════════════════════════════════
  tax_base_capacity: {
    positive: 95,
    warning: 90,
    critical: 85,
  },
  structural_deficit: {
    // Inverterad
    positive: 1.0,
    warning: 2.5,
    critical: 4.0,
    trendWarning: 0.5,
    trendCritical: 1.0,
  },
  dependency_ratio: {
    // Inverterad
    positive: 70,
    warning: 75,
    critical: 80,
  },

  // ═══════════════════════════════════════════════════════════════
  // D. SOCIAL STABILITET
  // ═══════════════════════════════════════════════════════════════
  homicide_rate: {
    // Inverterad
    positive: 1.0,
    warning: 1.3,
    critical: 1.6,
    trendWarning: 5.0,
    trendCritical: 10.0,
  },
  gini_coefficient: {
    // Inverterad
    positive: 0.28,
    warning: 0.32,
    critical: 0.36,
  },
  trust_in_institutions: {
    positive: 65,
    warning: 55,
    critical: 45,
    trendWarning: -5.0,
    trendCritical: -10.0,
  },

  // ═══════════════════════════════════════════════════════════════
  // E. KÄRNSYSTEMENS FUNKTION
  // ═══════════════════════════════════════════════════════════════
  healthcare_wait_time: {
    // Inverterad (lägre är bättre)
    positive: 30,
    warning: 60,
    critical: 90,
  },
  education_completion: {
    positive: 85,
    warning: 75,
    critical: 65,
  },
  judicial_processing_time: {
    // Inverterad
    positive: 120,
    warning: 180,
    critical: 240,
  },

  // ═══════════════════════════════════════════════════════════════
  // F. INFRASTRUKTUR
  // ═══════════════════════════════════════════════════════════════
  housing_deficit: {
    // Inverterad
    positive: 50000,
    warning: 100000,
    critical: 150000,
  },
  energy_supply_stability: {
    positive: 99.5,
    warning: 98,
    critical: 95,
  },
  transport_reliability: {
    positive: 92,
    warning: 85,
    critical: 78,
  },

  // ═══════════════════════════════════════════════════════════════
  // G. SYSTEMRISK & STYRNING
  // ═══════════════════════════════════════════════════════════════
  reform_implementation_rate: {
    positive: 80,
    warning: 60,
    critical: 40,
  },
  data_transparency_index: {
    positive: 75,
    warning: 60,
    critical: 45,
  },
  fiscal_rule_compliance: {
    positive: 95,
    warning: 80,
    critical: 65,
  },

  // Population (extra KPI)
  population_total: {
    positive: 10500000,
    warning: 10000000,
    critical: 9500000,
    trendWarning: -0.5,
    trendCritical: -1.0,
  },
};

/**
 * Standardtrösklar för KPI:er utan specifik konfiguration
 */
export const DEFAULT_THRESHOLDS: KPIThresholds = {
  positive: 80,
  warning: 60,
  critical: 40,
};

/**
 * Beräkna status baserat på värde och trösklar
 */
export function calculateKPIStatus(
  kpiId: string,
  value: number,
  isInverted: boolean = false,
  trendPercent: number = 0
): { status: KPIStatus; reason: string } {
  const thresholds = KPI_THRESHOLDS[kpiId] || DEFAULT_THRESHOLDS;
  
  // Kontrollera trend först (om konfigurerat)
  if (thresholds.trendCritical !== undefined && Math.abs(trendPercent) >= thresholds.trendCritical) {
    const direction = trendPercent > 0 
      ? (isInverted ? 'ökning' : 'ökning')
      : (isInverted ? 'minskning' : 'minskning');
    return {
      status: 'critical',
      reason: `Kritisk ${direction} (${trendPercent > 0 ? '+' : ''}${trendPercent.toFixed(1)}%)`,
    };
  }
  
  if (thresholds.trendWarning !== undefined && Math.abs(trendPercent) >= thresholds.trendWarning) {
    const direction = trendPercent > 0 ? 'ökning' : 'minskning';
    const isBadTrend = isInverted ? trendPercent > 0 : trendPercent < 0;
    if (isBadTrend) {
      return {
        status: 'warning',
        reason: `Varning: ${direction} (${trendPercent > 0 ? '+' : ''}${trendPercent.toFixed(1)}%)`,
      };
    }
  }

  // Värdebaserad status
  if (isInverted) {
    // För inverterade KPI:er (lägre är bättre)
    if (value <= thresholds.positive) {
      return { status: 'positive', reason: `Värdet ${value} är under positiv tröskel (${thresholds.positive})` };
    }
    if (value <= thresholds.warning) {
      return { status: 'warning', reason: `Värdet ${value} är under varningströskel (${thresholds.warning})` };
    }
    if (value >= thresholds.critical) {
      return { status: 'critical', reason: `Värdet ${value} överskrider kritisk tröskel (${thresholds.critical})` };
    }
    return { status: 'warning', reason: `Värdet ${value} är mellan varning och kritisk` };
  } else {
    // För normala KPI:er (högre är bättre)
    if (value >= thresholds.positive) {
      return { status: 'positive', reason: `Värdet ${value} uppnår positiv tröskel (${thresholds.positive})` };
    }
    if (value >= thresholds.warning) {
      return { status: 'warning', reason: `Värdet ${value} är under positiv men över varning (${thresholds.warning})` };
    }
    if (value <= thresholds.critical) {
      return { status: 'critical', reason: `Värdet ${value} underskrider kritisk tröskel (${thresholds.critical})` };
    }
    return { status: 'warning', reason: `Värdet ${value} är mellan kritisk och varning` };
  }
}

/**
 * Beräkna trend baserat på nuvarande och tidigare värde
 */
export function calculateTrend(
  currentValue: number,
  previousValue: number | null | undefined
): { trend: 'up' | 'down' | 'stable'; trendPercent: number } {
  if (!previousValue || previousValue === 0) {
    return { trend: 'stable', trendPercent: 0 };
  }

  const percentChange = ((currentValue - previousValue) / previousValue) * 100;
  
  // Definiera vad som räknas som "stable" (under 0.5% förändring)
  if (Math.abs(percentChange) < 0.5) {
    return { trend: 'stable', trendPercent: Math.round(percentChange * 100) / 100 };
  }

  return {
    trend: percentChange > 0 ? 'up' : 'down',
    trendPercent: Math.round(percentChange * 100) / 100,
  };
}

/**
 * Hämta trösklar för en KPI
 */
export function getThresholds(kpiId: string): KPIThresholds {
  return KPI_THRESHOLDS[kpiId] || DEFAULT_THRESHOLDS;
}

/**
 * Validera att alla definierade KPI:er har trösklar
 */
export function getMissingThresholds(kpiIds: string[]): string[] {
  return kpiIds.filter(id => !KPI_THRESHOLDS[id]);
}
