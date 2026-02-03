/**
 * STRIM Seed Data: Treatments
 * 
 * LARO som första behandlingsmetod.
 */

import type { ValidatedTreatment } from '../validation';

const NOW = new Date().toISOString();

export const SEED_TREATMENTS: ValidatedTreatment[] = [
  // ==========================================================================
  // LARO
  // ==========================================================================
  {
    canonical_slug: 'laro',
    name_sv: 'LARO – Läkemedelsassisterad rehabilitering vid opioidberoende',
    name_en: 'Opioid Agonist Treatment (OAT)',
    
    definition: 'LARO är en behandlingsform där opioider med lång halveringstid (metadon eller buprenorfin) ges under kontrollerade former för att minska abstinenssymptom, minska suget efter illegala opioider och möjliggöra social rehabilitering. Behandlingen är långvarig och kombineras med psykosociala insatser.',
    
    method_type: 'combined',
    
    evidence_level: 'level_1a',
    evidence_summary: 'LARO har starkt vetenskapligt stöd. Systematiska översikter visar att behandlingen minskar mortalitet, illegal opioidanvändning och kriminalitet samt förbättrar social funktion och livskvalitet.',
    
    sweden_context: 'LARO har funnits i Sverige sedan 1966. Behandlingen ges idag av specialistmottagningar inom regioner. Tillgängligheten har ökat sedan 2000-talet men varierar geografiskt.',
    sweden_availability: 'widely_available',
    
    risks: [
      'Överdosrisk vid behandlingsstart, särskilt med metadon',
      'Risk för läckage av läkemedel till illegal marknad',
      'Biverkningar inkluderar förstoppning, svettningar och viktökning',
    ],
    limitations: [
      'Kräver regelbundna mottagningsbesök, särskilt initialt',
      'Strikt reglering kan upplevas som hindrande',
      'Behandlingen är långvarig, ofta livslång',
    ],
    contraindications: [
      'Överkänslighet mot metadon eller buprenorfin',
      'Akut alkohol- eller sedativapåverkan vid behandlingsstart',
    ],
    
    introduction_year: 1966,
    historical_context: 'LARO infördes i Sverige 1966 vid Ulleråkers sjukhus i Uppsala som ett av de första programmen i Europa. Restriktionerna var länge strikta men har lättats under 2000-talet.',
    
    used_for_diagnoses: ['opioidberoende'],
    regulated_by_laws: ['narkotikalagstiftning'],
    
    sources: [
      {
        name: 'Socialstyrelsen – Nationella riktlinjer för vård och stöd vid missbruk och beroende',
        url: 'https://www.socialstyrelsen.se',
        retrieved_at: NOW,
        type: 'primary',
        organization_type: 'government',
      },
      {
        name: 'SBU – Behandling av opioidberoende',
        url: 'https://www.sbu.se',
        retrieved_at: NOW,
        type: 'primary',
        organization_type: 'government',
      },
      {
        name: 'Cochrane – Methadone maintenance therapy',
        url: 'https://www.cochrane.org',
        retrieved_at: NOW,
        type: 'secondary',
        organization_type: 'academic',
      },
    ],
    
    status: 'active',
    version: 1,
  },
];

export default SEED_TREATMENTS;
