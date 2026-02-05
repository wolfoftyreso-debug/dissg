/**
 * REGIONAL STRATEGY
 * 
 * Priority order for institutional adoption:
 * 1. EU (GDPR-compatible by design)
 * 2. UK
 * 3. Canada
 * 4. Australia
 * 5. Japan
 */

import type { RegionConfig, RegionCode } from './types';

// ============================================================================
// REGION CONFIGURATIONS
// ============================================================================

export const REGION_CONFIGS: readonly RegionConfig[] = [
  {
    code: 'eu',
    name: 'European Union',
    wave: 'wave_2_institutional',
    priority: 1,
    regulatory_notes: 'GDPR-compatible by design. No personal data processing required.',
    primary_languages: ['en', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'sv'],
    gdpr_applicable: true,
    ccpa_applicable: false,
  },
  {
    code: 'uk',
    name: 'United Kingdom',
    wave: 'wave_2_institutional',
    priority: 2,
    regulatory_notes: 'Post-Brexit UK GDPR. Financial conduct considerations.',
    primary_languages: ['en'],
    gdpr_applicable: true,
    ccpa_applicable: false,
  },
  {
    code: 'ca',
    name: 'Canada',
    wave: 'wave_2_institutional',
    priority: 3,
    regulatory_notes: 'PIPEDA compliance. Bilingual requirements (EN/FR).',
    primary_languages: ['en', 'fr'],
    gdpr_applicable: false,
    ccpa_applicable: false,
  },
  {
    code: 'au',
    name: 'Australia',
    wave: 'wave_2_institutional',
    priority: 4,
    regulatory_notes: 'Privacy Act 1988. APEC Cross-Border Privacy Rules.',
    primary_languages: ['en'],
    gdpr_applicable: false,
    ccpa_applicable: false,
  },
  {
    code: 'jp',
    name: 'Japan',
    wave: 'wave_2_institutional',
    priority: 5,
    regulatory_notes: 'APPI compliance. High institutional trust culture.',
    primary_languages: ['ja', 'en'],
    gdpr_applicable: false,
    ccpa_applicable: false,
  },
  {
    code: 'us',
    name: 'United States',
    wave: 'wave_1_universal',
    priority: 1,
    regulatory_notes: 'State-level privacy laws. CCPA in California.',
    primary_languages: ['en', 'es'],
    gdpr_applicable: false,
    ccpa_applicable: true,
  },
  {
    code: 'latam',
    name: 'Latin America',
    wave: 'wave_3_global_south',
    priority: 1,
    regulatory_notes: 'LGPD in Brazil. Varying privacy frameworks.',
    primary_languages: ['es', 'pt'],
    gdpr_applicable: false,
    ccpa_applicable: false,
  },
  {
    code: 'mena',
    name: 'Middle East & North Africa',
    wave: 'wave_3_global_south',
    priority: 2,
    regulatory_notes: 'Emerging privacy frameworks. Cultural considerations.',
    primary_languages: ['ar', 'en', 'fr'],
    gdpr_applicable: false,
    ccpa_applicable: false,
  },
  {
    code: 'africa',
    name: 'Sub-Saharan Africa',
    wave: 'wave_3_global_south',
    priority: 3,
    regulatory_notes: 'AU Convention on Cyber Security. Varying national laws.',
    primary_languages: ['en', 'fr', 'pt', 'ar'],
    gdpr_applicable: false,
    ccpa_applicable: false,
  },
  {
    code: 'asia',
    name: 'Asia-Pacific',
    wave: 'wave_3_global_south',
    priority: 4,
    regulatory_notes: 'Diverse privacy frameworks. APEC CBPR consideration.',
    primary_languages: ['zh', 'hi', 'en', 'ja'],
    gdpr_applicable: false,
    ccpa_applicable: false,
  },
  {
    code: 'global',
    name: 'Global (Default)',
    wave: 'wave_1_universal',
    priority: 0,
    regulatory_notes: 'Baseline global compliance. No regional specifics.',
    primary_languages: ['en'],
    gdpr_applicable: false,
    ccpa_applicable: false,
  },
] as const;

// ============================================================================
// UTILITIES
// ============================================================================

export function getRegionByCode(code: RegionCode): RegionConfig | undefined {
  return REGION_CONFIGS.find(r => r.code === code);
}

export function getRegionsByWave(wave: string): readonly RegionConfig[] {
  return REGION_CONFIGS.filter(r => r.wave === wave);
}

export function getGDPRRegions(): readonly RegionConfig[] {
  return REGION_CONFIGS.filter(r => r.gdpr_applicable);
}

export function getCCPARegions(): readonly RegionConfig[] {
  return REGION_CONFIGS.filter(r => r.ccpa_applicable);
}

export function getRegionPriorityOrder(): readonly RegionConfig[] {
  return [...REGION_CONFIGS].sort((a, b) => a.priority - b.priority);
}
