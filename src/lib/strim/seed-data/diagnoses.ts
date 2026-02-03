/**
 * STRIM Seed Data: Diagnoses
 * 
 * De första 2 diagnoserna för att etablera kunskapsgrafen.
 */

import type { ValidatedDiagnosis } from '../validation';

const NOW = new Date().toISOString();

export const SEED_DIAGNOSES: ValidatedDiagnosis[] = [
  // ==========================================================================
  // ALKOHOLBEROENDE
  // ==========================================================================
  {
    canonical_slug: 'alkoholberoende',
    name_sv: 'Alkoholberoende',
    name_en: 'Alcohol dependence syndrome',
    
    icd_10_code: 'F10.2',
    icd_11_code: '6C40.2',
    dsm_5_code: '303.90',
    
    definition: 'Alkoholberoende är ett tillstånd karakteriserat av nedsatt kontroll över alkoholkonsumtion, fortsatt användning trots negativa konsekvenser, toleransutveckling och abstinenssymptom vid utebliven konsumtion. Diagnosen ställs enligt ICD-10 kriterier F10.2.',
    
    diagnostic_criteria: {
      summary: 'Minst tre av sex kriterier uppfyllda under senaste året enligt ICD-10.',
      key_indicators: [
        'Stark önskan eller tvång att konsumera alkohol',
        'Svårigheter att kontrollera konsumtionen',
        'Abstinenssymptom vid minskning eller upphörande',
        'Toleransutveckling',
        'Försummelse av andra aktiviteter till förmån för alkohol',
        'Fortsatt konsumtion trots uppenbara skadliga konsekvenser',
      ],
      exclusion_criteria: [
        'Symtom förklaras ej bättre av annat medicinskt tillstånd',
      ],
    },
    
    prevalence: {
      sweden_estimate: '5–6% av vuxen befolkning uppfyller kriterier under livstiden',
      uncertainty_note: 'Prevalensskattningar varierar beroende på mätmetod och definition',
      data_year: 2020,
      source: 'Folkhälsomyndigheten',
    },
    
    common_comorbidities: [
      { condition: 'Depression', frequency: 'common' },
      { condition: 'Ångestsyndrom', frequency: 'common' },
      { condition: 'Annat substansberoende', frequency: 'occasional' },
      { condition: 'Personlighetssyndrom', frequency: 'occasional' },
    ],
    
    treatment_overview: 'Behandling inkluderar farmakologiska och psykosociala interventioner. Läkemedel som disulfiram, naltrexon och akamprosat har dokumenterad effekt. Psykosociala metoder omfattar KBT, motiverande samtal och 12-stegsbaserade program.',
    
    definition_changes: [
      {
        period: 'ICD-9 → ICD-10',
        change: 'Övergång från bredare alkoholismbegreppet till specificerade beroendekriterier.',
      },
      {
        period: 'DSM-5 (2013)',
        change: 'Sammanslagning av missbruk och beroende till "alcohol use disorder" med svårighetsgradering.',
      },
    ],
    
    caused_by_substances: ['alkohol'],
    treated_by_methods: ['laro', 'kbt', 'tolvstegsbehandling'],
    
    sources: [
      {
        name: 'Socialstyrelsen – Nationella riktlinjer för missbruks- och beroendevård',
        url: 'https://www.socialstyrelsen.se',
        retrieved_at: NOW,
        type: 'primary',
        organization_type: 'government',
      },
      {
        name: 'WHO – ICD-10',
        url: 'https://www.who.int/classifications/icd',
        retrieved_at: NOW,
        type: 'primary',
        organization_type: 'international',
      },
    ],
    
    status: 'active',
    version: 1,
  },

  // ==========================================================================
  // OPIOIDBEROENDE
  // ==========================================================================
  {
    canonical_slug: 'opioidberoende',
    name_sv: 'Opioidberoende',
    name_en: 'Opioid dependence',
    
    icd_10_code: 'F11.2',
    icd_11_code: '6C43.2',
    dsm_5_code: '304.00',
    
    definition: 'Opioidberoende är ett tillstånd karakteriserat av tvångsmässig opioidanvändning, tolerans, abstinens och fortsatt användning trots skadliga konsekvenser. Tillståndet kan uppstå vid användning av illegala opioider (heroin, fentanyl) eller vid långvarig behandling med opioidanalgetika.',
    
    diagnostic_criteria: {
      summary: 'Beroendesyndrom enligt ICD-10 F11.2 kräver minst tre kriterier uppfyllda under senaste året.',
      key_indicators: [
        'Stark längtan eller tvång att använda opioider',
        'Nedsatt förmåga att kontrollera användningen',
        'Fysiologisk abstinens vid utsättning',
        'Toleransutveckling kräver högre doser',
        'Progressiv försummelse av alternativa aktiviteter',
        'Fortsatt användning trots uppenbara negativa konsekvenser',
      ],
    },
    
    prevalence: {
      sweden_estimate: 'Uppskattningsvis 8 000–10 000 personer med opioidberoende',
      uncertainty_note: 'Mörkertalet är betydande. Uppskattningar baseras på vårddata och dödsfallsstatistik.',
      data_year: 2021,
      source: 'Folkhälsomyndigheten',
    },
    
    common_comorbidities: [
      { condition: 'Hepatit C', frequency: 'common' },
      { condition: 'Depression', frequency: 'common' },
      { condition: 'Ångestsyndrom', frequency: 'common' },
      { condition: 'HIV', frequency: 'occasional' },
      { condition: 'Annat substansberoende', frequency: 'common' },
    ],
    
    treatment_overview: 'Läkemedelsassisterad rehabilitering vid opioidberoende (LARO) med metadon eller buprenorfin är förstahandsbehandling enligt Socialstyrelsens riktlinjer. Psykosociala insatser kompletterar farmakologisk behandling.',
    
    definition_changes: [
      {
        period: '1960–1980-tal',
        change: 'Opioidberoende erkänns alltmer som medicinskt tillstånd snarare än moralistiskt problem.',
      },
      {
        period: '2000-tal',
        change: 'Utvidgad förståelse för receptbelagda opioiders roll i beroendeutveckling.',
      },
    ],
    
    caused_by_substances: ['heroin', 'fentanyl'],
    treated_by_methods: ['laro'],
    
    sources: [
      {
        name: 'Socialstyrelsen – Nationella riktlinjer för missbruks- och beroendevård',
        url: 'https://www.socialstyrelsen.se',
        retrieved_at: NOW,
        type: 'primary',
        organization_type: 'government',
      },
      {
        name: 'Läkemedelsverket – Behandlingsrekommendationer',
        url: 'https://www.lakemedelsverket.se',
        retrieved_at: NOW,
        type: 'primary',
        organization_type: 'government',
      },
    ],
    
    status: 'active',
    version: 1,
  },
];

export default SEED_DIAGNOSES;
