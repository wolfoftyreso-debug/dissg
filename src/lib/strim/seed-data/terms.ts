/**
 * STRIM Seed Data: Terms/Concepts
 * 
 * Beroende och Skademinimering som första begrepp.
 */

import type { ValidatedTerm } from '../validation';

const NOW = new Date().toISOString();

export const SEED_TERMS: ValidatedTerm[] = [
  // ==========================================================================
  // BEROENDE
  // ==========================================================================
  {
    canonical_slug: 'beroende',
    term_sv: 'Beroende',
    term_en: 'Dependence',
    
    definition_sv: 'Beroende är ett tillstånd karakteriserat av tvångsmässig substansanvändning trots negativa konsekvenser, förlust av kontroll över användningen, och fysiologiska eller psykologiska abstinenssymptom vid upphörande. Beroende definieras medicinskt enligt ICD- och DSM-system.',
    definition_en: 'Dependence is a condition characterized by compulsive substance use despite negative consequences, loss of control over use, and physiological or psychological withdrawal symptoms upon cessation.',
    
    alternative_definitions: [
      {
        source: 'WHO',
        definition: 'Ett kluster av beteendemässiga, kognitiva och fysiologiska fenomen som utvecklas efter upprepat substansbruk.',
        context: 'ICD-10 klinisk definition',
      },
      {
        source: 'American Psychiatric Association',
        definition: 'Substansbrukssyndrom med måttlig till svår svårighetsgrad.',
        context: 'DSM-5 terminologi (ersätter tidigare uppdelning missbruk/beroende)',
      },
    ],
    
    usage_context: ['healthcare', 'research', 'policy'],
    
    historical_usage: [
      {
        period: 'Före 1900',
        usage: 'Beroende betraktades primärt som moralisk svaghet eller karaktärsbrist.',
      },
      {
        period: '1900-tal',
        usage: 'Gradvis medicalisering av beroendebegreppet, "sjukdomsmodellen" etableras.',
      },
      {
        period: '2000-tal',
        usage: 'Neurobiologisk förståelse dominerar. Beroende ses som kronisk hjärnsjukdom påverkad av genetik och miljö.',
      },
    ],
    
    used_in_laws: ['narkotikalagstiftning'],
    associated_diagnoses: ['alkoholberoende', 'opioidberoende'],
    associated_substances: ['alkohol', 'heroin', 'fentanyl'],
    related_concepts: ['skademinimering'],
    
    sources: [
      {
        name: 'WHO – Lexicon of alcohol and drug terms',
        url: 'https://www.who.int',
        retrieved_at: NOW,
        type: 'primary',
        organization_type: 'international',
      },
      {
        name: 'Socialstyrelsen – Termbank',
        url: 'https://termbank.socialstyrelsen.se',
        retrieved_at: NOW,
        type: 'primary',
        organization_type: 'government',
      },
    ],
    
    status: 'active',
    version: 1,
  },

  // ==========================================================================
  // SKADEMINIMERING
  // ==========================================================================
  {
    canonical_slug: 'skademinimering',
    term_sv: 'Skademinimering',
    term_en: 'Harm reduction',
    
    definition_sv: 'Skademinimering är ett samlingsbegrepp för strategier, program och insatser som syftar till att minska negativa konsekvenser av substansbruk utan att nödvändigtvis kräva avhållsamhet som mål. Exempel inkluderar sprututbytesprogram, naloxonutdelning och lågtröskelverksamheter.',
    definition_en: 'Harm reduction encompasses policies, programs and practices that aim to minimize negative health, social and economic impacts of substance use without necessarily requiring abstinence.',
    
    alternative_definitions: [
      {
        source: 'Harm Reduction International',
        definition: 'Policies, programmes and practices that aim primarily to reduce the adverse health, social and economic consequences of the use of legal and illegal psychoactive drugs.',
        context: 'Internationell standarddefinition',
      },
      {
        source: 'UNODC',
        definition: 'En uppsättning praktiska strategier och idéer som syftar till att minska negativa konsekvenser av droganvändning.',
        context: 'FN:s narkotikakonvention',
      },
    ],
    
    usage_context: ['healthcare', 'policy', 'research'],
    
    historical_usage: [
      {
        period: '1980-tal',
        usage: 'Begreppet uppstår som svar på HIV/AIDS-epidemins spridning bland personer som injicerar droger.',
      },
      {
        period: '1990-tal',
        usage: 'Sprututbytesprogram och LARO etableras i Sverige som skademinimerande insatser.',
      },
      {
        period: '2010-tal',
        usage: 'Naloxonutdelning och drogkonsumtionsrum diskuteras. Debatt om utvidgad skademinimering.',
      },
    ],
    
    used_in_laws: [],
    associated_diagnoses: ['opioidberoende'],
    associated_substances: ['heroin', 'fentanyl'],
    related_concepts: ['beroende'],
    
    sources: [
      {
        name: 'Folkhälsomyndigheten – Skademinimering',
        url: 'https://www.folkhalsomyndigheten.se',
        retrieved_at: NOW,
        type: 'primary',
        organization_type: 'government',
      },
      {
        name: 'Harm Reduction International',
        url: 'https://www.hri.global',
        retrieved_at: NOW,
        type: 'secondary',
        organization_type: 'international',
      },
      {
        name: 'EMCDDA – Harm reduction',
        url: 'https://www.emcdda.europa.eu',
        retrieved_at: NOW,
        type: 'secondary',
        organization_type: 'international',
      },
    ],
    
    status: 'active',
    version: 1,
  },
];

export default SEED_TERMS;
