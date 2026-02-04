/**
 * AI GOVERNANCE: Response Builder
 * 
 * Constructs properly formatted diagnostic responses
 * following the mandatory two-layer structure.
 */

import type { LayeredResponse } from './allowed-patterns';

// =============================================================================
// RESPONSE BUILDER
// =============================================================================

export interface DiagnosticObservation {
  parameter: string;
  value: number | string;
  unit: string;
  setpoint?: { min?: number; max?: number };
  deviation?: { percent: number; direction: 'above' | 'below' };
  trend?: { direction: 'up' | 'down' | 'stable'; period: string };
  source: string;
  lastUpdated: string;
}

export interface DiagnosticRelationship {
  type: 'verified' | 'uncertain' | 'unknown';
  description: string;
  confidence?: number;
  evidence?: string;
}

export interface DiagnosticLimitation {
  type: 'data_gap' | 'methodology' | 'comparability' | 'uncertainty';
  description: string;
  affectedPeriod?: string;
  affectedParameters?: string[];
}

export interface DiagnosticResponseInput {
  observations: DiagnosticObservation[];
  relationships: DiagnosticRelationship[];
  limitations: DiagnosticLimitation[];
}

// =============================================================================
// FORMAT FUNCTIONS
// =============================================================================

function formatObservation(obs: DiagnosticObservation, language: 'sv' | 'en'): string {
  const parts: string[] = [];
  
  // Base value
  if (language === 'sv') {
    parts.push(`${obs.parameter}: ${obs.value} ${obs.unit}`);
  } else {
    parts.push(`${obs.parameter}: ${obs.value} ${obs.unit}`);
  }
  
  // Setpoint comparison
  if (obs.setpoint) {
    const setpointStr = obs.setpoint.min !== undefined && obs.setpoint.max !== undefined
      ? `${obs.setpoint.min}–${obs.setpoint.max}`
      : obs.setpoint.min !== undefined
        ? `≥${obs.setpoint.min}`
        : `≤${obs.setpoint.max}`;
    
    if (language === 'sv') {
      parts.push(`(börvärde: ${setpointStr} ${obs.unit})`);
    } else {
      parts.push(`(setpoint: ${setpointStr} ${obs.unit})`);
    }
  }
  
  // Deviation
  if (obs.deviation) {
    const dir = obs.deviation.direction === 'above' 
      ? (language === 'sv' ? 'över' : 'above')
      : (language === 'sv' ? 'under' : 'below');
    
    if (language === 'sv') {
      parts.push(`— ${obs.deviation.percent}% ${dir} normalintervall`);
    } else {
      parts.push(`— ${obs.deviation.percent}% ${dir} normal range`);
    }
  }
  
  // Trend
  if (obs.trend) {
    const arrow = obs.trend.direction === 'up' ? '↑' 
      : obs.trend.direction === 'down' ? '↓' : '→';
    
    if (language === 'sv') {
      parts.push(`[trend: ${arrow} ${obs.trend.period}]`);
    } else {
      parts.push(`[trend: ${arrow} ${obs.trend.period}]`);
    }
  }
  
  return parts.join(' ');
}

function formatRelationship(rel: DiagnosticRelationship, language: 'sv' | 'en'): string {
  let result = `• ${rel.description}`;
  
  if (rel.confidence !== undefined) {
    if (language === 'sv') {
      result += ` (konfidens: ${rel.confidence}%)`;
    } else {
      result += ` (confidence: ${rel.confidence}%)`;
    }
  }
  
  if (rel.evidence) {
    result += ` — ${rel.evidence}`;
  }
  
  return result;
}

function formatLimitation(lim: DiagnosticLimitation, language: 'sv' | 'en'): string {
  let result = `• ${lim.description}`;
  
  if (lim.affectedPeriod) {
    if (language === 'sv') {
      result += ` (period: ${lim.affectedPeriod})`;
    } else {
      result += ` (period: ${lim.affectedPeriod})`;
    }
  }
  
  if (lim.affectedParameters && lim.affectedParameters.length > 0) {
    if (language === 'sv') {
      result += ` [påverkar: ${lim.affectedParameters.join(', ')}]`;
    } else {
      result += ` [affects: ${lim.affectedParameters.join(', ')}]`;
    }
  }
  
  return result;
}

// =============================================================================
// MAIN BUILDER
// =============================================================================

export function buildDiagnosticResponse(
  input: DiagnosticResponseInput,
  language: 'sv' | 'en' = 'sv'
): string {
  const lines: string[] = [];
  
  // Header
  if (language === 'sv') {
    lines.push('═══════════════════════════════════════');
    lines.push('LAGER 1 – VAD DATA VISAR');
    lines.push('═══════════════════════════════════════');
  } else {
    lines.push('═══════════════════════════════════════');
    lines.push('LAYER 1 – WHAT DATA SHOWS');
    lines.push('═══════════════════════════════════════');
  }
  
  lines.push('');
  
  // Observations
  for (const obs of input.observations) {
    lines.push(formatObservation(obs, language));
  }
  
  lines.push('');
  
  // Layer 2 header
  if (language === 'sv') {
    lines.push('═══════════════════════════════════════');
    lines.push('LAGER 2 – VAD KAN OCH INTE KAN SÄGAS');
    lines.push('═══════════════════════════════════════');
  } else {
    lines.push('═══════════════════════════════════════');
    lines.push('LAYER 2 – WHAT CAN AND CANNOT BE SAID');
    lines.push('═══════════════════════════════════════');
  }
  
  lines.push('');
  
  // Verified relationships
  const verified = input.relationships.filter(r => r.type === 'verified');
  if (verified.length > 0) {
    lines.push(language === 'sv' ? 'VERIFIERADE SAMBAND:' : 'VERIFIED RELATIONSHIPS:');
    for (const rel of verified) {
      lines.push(formatRelationship(rel, language));
    }
    lines.push('');
  }
  
  // Uncertain relationships
  const uncertain = input.relationships.filter(r => r.type === 'uncertain');
  if (uncertain.length > 0) {
    lines.push(language === 'sv' ? 'OSÄKRA SAMBAND:' : 'UNCERTAIN RELATIONSHIPS:');
    for (const rel of uncertain) {
      lines.push(formatRelationship(rel, language));
    }
    lines.push('');
  }
  
  // Unknown relationships
  const unknown = input.relationships.filter(r => r.type === 'unknown');
  if (unknown.length > 0) {
    lines.push(language === 'sv' ? 'KAN EJ AVGÖRAS:' : 'CANNOT BE DETERMINED:');
    for (const rel of unknown) {
      lines.push(formatRelationship(rel, language));
    }
    lines.push('');
  }
  
  // Limitations
  if (input.limitations.length > 0) {
    lines.push(language === 'sv' ? 'DATABEGRÄNSNINGAR:' : 'DATA LIMITATIONS:');
    for (const lim of input.limitations) {
      lines.push(formatLimitation(lim, language));
    }
  }
  
  // Footer
  lines.push('');
  lines.push('───────────────────────────────────────');
  if (language === 'sv') {
    lines.push('[Diagnostiskt svar – ingen tolkning eller rekommendation]');
  } else {
    lines.push('[Diagnostic response – no interpretation or recommendation]');
  }
  
  return lines.join('\n');
}

// =============================================================================
// STRUCTURED RESPONSE (for programmatic use)
// =============================================================================

export function buildStructuredResponse(input: DiagnosticResponseInput): LayeredResponse {
  return {
    layer1_observation: {
      rawData: input.observations.map(obs => 
        `${obs.parameter}: ${obs.value} ${obs.unit}`
      ),
      noInterpretation: true,
    },
    layer2_constraints: {
      verifiedRelationships: input.relationships
        .filter(r => r.type === 'verified')
        .map(r => r.description),
      uncertainRelationships: input.relationships
        .filter(r => r.type === 'uncertain')
        .map(r => r.description),
      unknownRelationships: input.relationships
        .filter(r => r.type === 'unknown')
        .map(r => r.description),
      dataLimitations: input.limitations.map(l => l.description),
    },
  };
}
