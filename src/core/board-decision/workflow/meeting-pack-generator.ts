/**
 * MEETING PACK GENERATOR
 * 
 * Generates complete meeting pack from DPD + Agenda.
 * Rule: No extra material without indexing.
 */

import type { DecisionPreparationDocument } from '../types';
import type { BoardAgenda } from '../agenda-generator';
import type { MeetingPack, DataAppendix, UncertaintyOverview } from './types';
import { generateChecksum } from './utils';

/**
 * Generate meeting pack for board distribution
 */
export function generateMeetingPack(params: {
  dpd: DecisionPreparationDocument;
  agenda: BoardAgenda;
  meeting_date: string;
}): MeetingPack {
  const { dpd, agenda, meeting_date } = params;
  
  const pack_id = `pack_${dpd.dpd_id}_${Date.now()}`;
  
  const data_appendix = extractDataAppendix(dpd);
  const uncertainty_overview = generateUncertaintyOverview(dpd);
  const limitations = generateLimitations(dpd);
  
  const pack: MeetingPack = {
    pack_id,
    generated_at: new Date().toISOString(),
    meeting_date,
    
    dpd,
    agenda,
    
    data_appendix,
    uncertainty_overview,
    limitations,
    
    locked: false,
    checksum: '',
  };
  
  pack.checksum = generateChecksum(pack);
  
  return pack;
}

/**
 * Extract data appendix from DPD
 */
function extractDataAppendix(dpd: DecisionPreparationDocument): DataAppendix {
  const sources = dpd.relevant_data.map(d => ({
    source_id: d.source,
    name: d.metric,
    last_updated: d.last_updated,
    version: '1.0',
  }));
  
  const indexes = dpd.relevant_indexes.map(i => ({
    index_id: i.index_id,
    name: i.index_name,
    value: i.value,
    trend: i.trend,
  }));
  
  return { sources, indexes };
}

/**
 * Generate uncertainty overview
 */
function generateUncertaintyOverview(dpd: DecisionPreparationDocument): UncertaintyOverview {
  const { known, uncertain, unknown } = dpd.knowledge_status;
  
  // Find dimensions with highest uncertainty
  const highUncertaintyDimensions: string[] = [];
  for (const [_altId, consequences] of Object.entries(dpd.consequence_surfaces)) {
    for (const c of consequences) {
      if (c.uncertainty === 'high' && !highUncertaintyDimensions.includes(c.dimension)) {
        highUncertaintyDimensions.push(c.dimension);
      }
    }
  }
  
  // Identify data gaps
  const dataGaps = dpd.relevant_data
    .filter(d => d.uncertainty > 0.25)
    .map(d => `${d.metric}: uncertainty ${(d.uncertainty * 100).toFixed(0)}%`);
  
  return {
    known_count: known.length,
    uncertain_count: uncertain.length,
    unknown_count: unknown.length,
    highest_uncertainty_dimensions: highUncertaintyDimensions,
    data_gaps: dataGaps,
  };
}

/**
 * Generate limitations section
 */
function generateLimitations(dpd: DecisionPreparationDocument): string[] {
  const limitations: string[] = [
    'This document does NOT recommend any alternative',
    'This document does NOT predict outcomes',
    'This document does NOT replace board responsibility',
    'Uncertainty estimates are themselves uncertain',
  ];
  
  if (dpd.disclaimers.custom) {
    limitations.push(...dpd.disclaimers.custom);
  }
  
  // Add specific limitations based on data
  const highUncertaintyData = dpd.relevant_data.filter(d => d.uncertainty > 0.3);
  if (highUncertaintyData.length > 0) {
    limitations.push(
      `${highUncertaintyData.length} data point(s) have uncertainty >30%`
    );
  }
  
  if (dpd.knowledge_status.unknown.length > 2) {
    limitations.push(
      `${dpd.knowledge_status.unknown.length} factors are explicitly unknown`
    );
  }
  
  return limitations;
}

/**
 * Lock meeting pack (prevents further changes)
 */
export function lockMeetingPack(pack: MeetingPack): MeetingPack {
  return {
    ...pack,
    locked: true,
    checksum: generateChecksum({ ...pack, locked: true }),
  };
}

/**
 * Validate meeting pack integrity
 */
export function validateMeetingPack(pack: MeetingPack): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check required components
  if (!pack.dpd) errors.push('Missing DPD');
  if (!pack.agenda) errors.push('Missing agenda');
  if (!pack.data_appendix) errors.push('Missing data appendix');
  if (!pack.uncertainty_overview) errors.push('Missing uncertainty overview');
  
  // Check DPD-agenda alignment
  if (pack.dpd && pack.agenda) {
    if (pack.agenda.dpd_id !== pack.dpd.dpd_id) {
      errors.push('Agenda does not reference correct DPD');
    }
  }
  
  // Check limitations exist
  if (!pack.limitations || pack.limitations.length === 0) {
    errors.push('Missing limitations section');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

export const MEETING_PACK_MASTERPROMPT = `
You are a Meeting Pack Generator.
Generate complete meeting packs from Decision Preparation Documents.

RULES:
1. Include all uncertainty explicitly
2. Include all limitations explicitly
3. No extra material without source indexing
4. No interpretation or recommendation
5. Pack must be self-contained

OUTPUT:
- DPD (locked version)
- Agenda (time-allocated)
- Data appendix (all sources)
- Uncertainty overview
- Limitations ("What this does NOT mean")
`;
