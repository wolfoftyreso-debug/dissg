/**
 * 🔒 Data Validator
 * 
 * Validates data sufficiency before ANY content is displayed.
 * If data is insufficient → content is blocked, not approximated.
 */

import type {
  DataAvailability,
  DataSufficiencyCheck,
  VerificationProof,
  SourceDetail,
} from '@/types/realityOnly';

// ============================================
// SUFFICIENCY THRESHOLDS
// ============================================

export const SUFFICIENCY_THRESHOLDS = {
  minDataPoints: 3,           // Minimum data points for a trend
  minCoverage: 70,            // Minimum % coverage for geographic views
  minConfidence: 60,          // Minimum average confidence
  maxStaleDays: 365,          // Maximum days before data is "stale"
  minSources: 1,              // Minimum independent sources
  conflictThreshold: 0.15,    // Max coefficient of variation before "conflicting"
} as const;

// ============================================
// DATA SUFFICIENCY CHECK
// ============================================

interface CheckInput {
  indicatorId: string;
  geoScope: string | string[];
  timeRange: { start: string; end: string };
  availableData: Array<{
    date: string;
    value: number;
    confidence: number;
    source: string;
    region?: string;
  }>;
}

/**
 * Check if data is sufficient for display
 */
export function checkDataSufficiency(input: CheckInput): DataSufficiencyCheck {
  const { indicatorId, geoScope, timeRange, availableData } = input;
  
  // Filter data to requested time range
  const startDate = new Date(timeRange.start);
  const endDate = new Date(timeRange.end);
  const relevantData = availableData.filter(d => {
    const date = new Date(d.date);
    return date >= startDate && date <= endDate;
  });
  
  // Calculate required data points (rough estimate: one per month)
  const monthsDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
  const requiredDataPoints = Math.max(SUFFICIENCY_THRESHOLDS.minDataPoints, Math.floor(monthsDiff));
  
  // Calculate coverage
  const geoScopes = Array.isArray(geoScope) ? geoScope : [geoScope];
  const coveredRegions = new Set(relevantData.map(d => d.region || 'global'));
  const coveragePercent = (coveredRegions.size / geoScopes.length) * 100;
  
  // Calculate average confidence
  const avgConfidence = relevantData.length > 0
    ? relevantData.reduce((sum, d) => sum + d.confidence, 0) / relevantData.length
    : 0;
  
  // Count unique sources
  const sources = new Set(relevantData.map(d => d.source));
  
  // Check for staleness
  const latestData = relevantData.reduce((latest, d) => {
    const date = new Date(d.date);
    return date > latest ? date : latest;
  }, new Date(0));
  const staleDays = (Date.now() - latestData.getTime()) / (1000 * 60 * 60 * 24);
  
  // Find missing periods (simplified)
  const missingPeriods: string[] = [];
  const missingRegions = geoScopes.filter(r => !coveredRegions.has(r));
  
  // Determine availability
  let availability: DataAvailability = 'verified';
  let isSufficient = true;
  
  if (relevantData.length < SUFFICIENCY_THRESHOLDS.minDataPoints) {
    availability = 'insufficient';
    isSufficient = false;
  } else if (staleDays > SUFFICIENCY_THRESHOLDS.maxStaleDays) {
    availability = 'stale';
    isSufficient = false;
  } else if (coveragePercent < SUFFICIENCY_THRESHOLDS.minCoverage) {
    availability = 'partial';
  } else if (avgConfidence < SUFFICIENCY_THRESHOLDS.minConfidence) {
    availability = 'partial';
  }
  
  // Check for conflicting data
  if (relevantData.length > 1) {
    const values = relevantData.map(d => d.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const cv = Math.sqrt(variance) / Math.abs(mean); // Coefficient of variation
    
    if (cv > SUFFICIENCY_THRESHOLDS.conflictThreshold && sources.size > 1) {
      availability = 'conflicting';
      isSufficient = false;
    }
  }
  
  return {
    indicatorId,
    geoScope: Array.isArray(geoScope) ? geoScope.join(',') : geoScope,
    timeRange,
    result: {
      isSufficient,
      availability,
      requiredDataPoints,
      availableDataPoints: relevantData.length,
      coveragePercent: Math.round(coveragePercent),
      missingPeriods,
      missingRegions,
      averageConfidence: Math.round(avgConfidence),
      sourceCount: sources.size,
    },
  };
}

// ============================================
// VERIFICATION PROOF GENERATION
// ============================================

interface ProofInput {
  entityId: string;
  sources: SourceDetail[];
  aggregationLogic: string;
  exclusions?: Array<{ sourceId: string; reason: string; impact: string }>;
}

/**
 * Generate verification proof for any content
 */
export function generateVerificationProof(input: ProofInput): VerificationProof {
  const { entityId, sources, aggregationLogic, exclusions = [] } = input;
  
  // Generate hash (simplified - would use crypto in production)
  const hashInput = JSON.stringify({ entityId, sources: sources.map(s => s.id), aggregationLogic });
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    hash = ((hash << 5) - hash) + hashInput.charCodeAt(i);
    hash = hash & hash;
  }
  const hashStr = `RO-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
  
  return {
    hash: hashStr,
    qrCodeUrl: `/api/v1/qr/${hashStr}`,
    buildPageUrl: `/verify/${hashStr}`,
    sources,
    aggregationLogic,
    exclusions: exclusions.map(e => ({
      sourceId: e.sourceId,
      reason: e.reason as 'user_choice' | 'quality' | 'methodology' | 'coverage',
      impact: e.impact as 'minor' | 'moderate' | 'significant',
      impactDescription: `Exclusion of ${e.sourceId} has ${e.impact} impact on results.`,
    })),
    versionStatus: '1.0.0-live',
    generatedAt: new Date().toISOString(),
    validUntil: null, // Live data, always current
  };
}

// ============================================
// BLOCKING CHECKS
// ============================================

/**
 * Should this content be blocked from display?
 */
export function shouldBlockContent(availability: DataAvailability): boolean {
  return availability === 'insufficient' || availability === 'conflicting';
}

/**
 * Should this content show warnings?
 */
export function shouldWarnContent(availability: DataAvailability): boolean {
  return availability === 'partial' || availability === 'stale';
}

/**
 * Get blocking reason for UI
 */
export function getBlockingReason(
  availability: DataAvailability,
  language: 'en' | 'sv' = 'en'
): { title: string; description: string } | null {
  if (!shouldBlockContent(availability)) return null;
  
  const reasons: Record<string, Record<'en' | 'sv', { title: string; description: string }>> = {
    insufficient: {
      en: {
        title: 'Insufficient Data',
        description: 'Verified data is insufficient to present this view for the selected scope and period.',
      },
      sv: {
        title: 'Otillräcklig data',
        description: 'Verifierad data är otillräcklig för att visa denna vy för valt omfång och period.',
      },
    },
    conflicting: {
      en: {
        title: 'Conflicting Sources',
        description: 'Data sources provide conflicting values that cannot be reliably aggregated.',
      },
      sv: {
        title: 'Motstridiga källor',
        description: 'Datakällor ger motstridiga värden som inte kan aggregeras tillförlitligt.',
      },
    },
  };
  
  return reasons[availability]?.[language] || null;
}
