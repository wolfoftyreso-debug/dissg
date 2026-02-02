/**
 * 📈 PROBABILISTIC SCENARIO LAB
 * 
 * Advanced user mode — responsibility on the user.
 * This is not analysis from the platform.
 * This is calculation the user performs with platform data.
 */

// ============================================================
// CORE PRINCIPLE
// ============================================================

export const SCENARIO_CORE_PRINCIPLE = {
  title: {
    en: 'Core Principle',
    sv: 'Grundprincip',
  },
  statement: {
    en: 'The platform makes no predictions. Users can create probabilistic scenarios based on selected assumptions.',
    sv: 'Plattformen gör inga prognoser. Användare kan skapa probabilistiska scenarier baserat på valda antaganden.',
  },
  characteristics: [
    { en: 'User-generated', sv: 'Användargenererad' },
    { en: 'Account-bound', sv: 'Kontobunden' },
    { en: 'Traceable', sv: 'Spårbar' },
    { en: 'Reproducible', sv: 'Reproducerbar' },
  ],
  conclusion: {
    en: 'The platform provides the engine, not the conclusion.',
    sv: 'Plattformen tillhandahåller motor, inte slutsats.',
  },
};

// ============================================================
// MODE DISTINCTION (CRITICAL)
// ============================================================

export type PlatformMode = 'observation' | 'scenario';

export const MODE_DISTINCTION = {
  title: {
    en: 'Mode Distinction',
    sv: 'Lägesåtskillnad',
  },
  observation: {
    id: 'observation' as PlatformMode,
    label: { en: 'Observation Mode', sv: 'Observationsläge' },
    description: { en: 'The platform speaks', sv: 'Plattformen talar' },
    color: 'bg-primary/10 border-primary text-primary',
    icon: '📊',
  },
  scenario: {
    id: 'scenario' as PlatformMode,
    label: { en: 'Scenario Mode', sv: 'Scenarioläge' },
    description: { en: 'The user experiments', sv: 'Användaren experimenterar' },
    color: 'bg-amber-500/10 border-amber-500 text-amber-700',
    icon: '🧪',
    watermark: { en: 'User-generated scenario', sv: 'Användarskapat scenario' },
  },
  principle: {
    en: 'No one can say "the system said".',
    sv: 'Ingen kan säga "systemet sa".',
  },
};

// ============================================================
// AVAILABLE MODEL TYPES
// ============================================================

export type ScenarioModelType = 
  | 'historical_frequency'
  | 'bayesian_update'
  | 'regression_probability'
  | 'monte_carlo';

export interface ModelTypeDefinition {
  id: ScenarioModelType;
  label: { en: string; sv: string };
  description: { en: string; sv: string };
  complexity: 'basic' | 'intermediate' | 'advanced';
  icon: string;
}

export const SCENARIO_MODEL_TYPES: ModelTypeDefinition[] = [
  {
    id: 'historical_frequency',
    label: { en: 'Historical Frequency', sv: 'Historisk frekvens' },
    description: {
      en: 'How often has this outcome occurred in similar historical periods?',
      sv: 'Hur ofta har detta utfall inträffat i liknande historiska perioder?',
    },
    complexity: 'basic',
    icon: '📅',
  },
  {
    id: 'bayesian_update',
    label: { en: 'Bayesian Update', sv: 'Bayesiansk uppdatering' },
    description: {
      en: 'Update prior beliefs based on new evidence.',
      sv: 'Uppdatera tidigare uppfattningar baserat på nya bevis.',
    },
    complexity: 'intermediate',
    icon: '🔄',
  },
  {
    id: 'regression_probability',
    label: { en: 'Regression-Based Probability', sv: 'Regressionsbaserad sannolikhet' },
    description: {
      en: 'Estimate outcome probabilities based on variable relationships.',
      sv: 'Uppskatta utfallssannolikheter baserat på variabelsamband.',
    },
    complexity: 'intermediate',
    icon: '📈',
  },
  {
    id: 'monte_carlo',
    label: { en: 'Monte Carlo Simulation', sv: 'Monte Carlo-simulering' },
    description: {
      en: 'Generate probability distributions through repeated random sampling.',
      sv: 'Generera sannolikhetsfördelningar genom upprepad slumpmässig sampling.',
    },
    complexity: 'advanced',
    icon: '🎲',
  },
];

// ============================================================
// USER SCENARIO INPUTS
// ============================================================

export const SCENARIO_INPUTS = {
  title: {
    en: 'What the User Can Select',
    sv: 'Vad användaren kan välja',
  },
  inputs: [
    {
      id: 'indicators',
      label: { en: 'Indicators (A, B, C…)', sv: 'Indikatorer (A, B, C…)' },
      icon: '📊',
    },
    {
      id: 'periods',
      label: { en: 'Historical periods', sv: 'Historiska perioder' },
      icon: '📅',
    },
    {
      id: 'population',
      label: { en: 'Comparison population', sv: 'Jämförelsepopulation' },
      icon: '🌍',
    },
    {
      id: 'model',
      label: { en: 'Model type', sv: 'Modelltyp' },
      icon: '🧮',
    },
    {
      id: 'assumptions',
      label: { en: 'Assumptions (explicit!)', sv: 'Antaganden (explicita!)' },
      icon: '⚙️',
    },
  ],
  outputs: [
    { en: 'Probability intervals', sv: 'Sannolikhetsintervall' },
    { en: 'Uncertainty ranges', sv: 'Osäkerhetsintervall' },
    { en: 'Sensitivity to assumptions', sv: 'Känslighet för antaganden' },
  ],
  principle: {
    en: 'Nothing happens without the user choosing everything.',
    sv: 'Inget händer utan att användaren väljer allt.',
  },
};

// ============================================================
// OUTPUT PRESENTATION RULES
// ============================================================

export const OUTPUT_RULES = {
  title: {
    en: 'How Output Is Presented',
    sv: 'Hur output presenteras',
  },
  never: {
    label: { en: 'Never', sv: 'Aldrig' },
    examples: [
      { en: '"This will happen"', sv: '"Detta kommer hända"' },
      { en: '"The best action is"', sv: '"Bästa åtgärden är"' },
      { en: '"The system recommends"', sv: '"Systemet rekommenderar"' },
    ],
  },
  always: {
    label: { en: 'Always', sv: 'Alltid' },
    templates: [
      {
        en: 'Given the selected assumptions and historical patterns, the following outcome ranges were observed.',
        sv: 'Givet de valda antagandena och historiska mönstren observerades följande utfallsintervall.',
      },
      {
        en: 'Under these conditions, similar historical configurations were associated with outcomes within this interval.',
        sv: 'Under dessa förhållanden var liknande historiska konfigurationer förknippade med utfall inom detta intervall.',
      },
    ],
  },
  mandatoryDisclaimer: {
    en: 'Results are conditional on assumptions and do not represent predictions or recommendations.',
    sv: 'Resultat är villkorade av antaganden och representerar inte prognoser eller rekommendationer.',
  },
};

// ============================================================
// TRACEABILITY & ACCOUNTABILITY
// ============================================================

export const TRACEABILITY = {
  title: {
    en: 'Traceability & Accountability',
    sv: 'Spårbarhet & ansvar',
  },
  requirements: [
    { en: 'Saved with user ID', sv: 'Sparas med användar-ID' },
    { en: 'Timestamped', sv: 'Har tidsstämpel' },
    { en: 'Version history', sv: 'Har versionshistorik' },
    { en: 'Full list of assumptions', sv: 'Har full lista av antaganden' },
    { en: 'Shareable with disclaimer intact', sv: 'Kan delas med disclaimer intakt' },
  ],
  standardDisclaimer: {
    en: 'This scenario was created by the user using selected data and assumptions. The platform does not validate conclusions or intended use.',
    sv: 'Detta scenario skapades av användaren med valda data och antaganden. Plattformen validerar inte slutsatser eller avsedd användning.',
  },
  principle: {
    en: 'This protects both you and the user.',
    sv: 'Det här skyddar både er och användaren.',
  },
};

// ============================================================
// BUILT-IN COUNTERWEIGHT (SMART)
// ============================================================

export const COUNTERWEIGHT_SYSTEM = {
  title: {
    en: 'Built-in Counterweight',
    sv: 'Inbyggd motvikt',
  },
  triggers: [
    { en: 'Drawing strong conclusions', sv: 'Drar starka slutsatser' },
    { en: 'Exporting report', sv: 'Exporterar rapport' },
    { en: 'Sharing externally', sv: 'Delar externt' },
  ],
  systemResponse: {
    en: 'This scenario is not sufficient as a standalone decision basis. Consider conducting a broader evidence review.',
    sv: 'Detta scenario är inte tillräckligt som ensamt beslutsunderlag. Överväg att genomföra en bredare evidensgranskning.',
  },
  linkedResources: [
    { en: 'Case study module', sv: 'Fallstudiemodul' },
    { en: 'Method guide', sv: 'Metodguide' },
    { en: 'Requirements for supplementary evidence', sv: 'Krav på kompletterande underlag' },
  ],
  principle: {
    en: 'The system encourages responsibility, not action.',
    sv: 'Systemet uppmuntrar ansvar, inte action.',
  },
};

// ============================================================
// WHY THIS IS POWERFUL BUT SAFE
// ============================================================

export const SAFETY_RATIONALE = {
  title: {
    en: 'Why This Is Powerful But Safe',
    sv: 'Varför detta är kraftfullt men säkert',
  },
  points: [
    { en: 'Advanced users get the tools they want', sv: 'Avancerade användare får verktyg de vill ha' },
    { en: 'No one can blame the platform', sv: 'Ingen kan skylla på plattformen' },
    { en: 'Predictions are hypothesis generators, not decisions', sv: 'Prognoser är hypotesgeneratorer, inte beslut' },
    { en: 'Everything is transparent and challengeable', sv: 'Allt är transparent och ifrågasättbart' },
  ],
  usedBy: {
    label: { en: 'This is exactly how these work internally:', sv: 'Detta är exakt hur dessa arbetar internt:' },
    examples: [
      { en: 'Quant funds', sv: 'Kvantfonder' },
      { en: 'Central banks', sv: 'Centralbanker' },
      { en: 'Research institutes', sv: 'Forskningsinstitut' },
    ],
  },
  conclusion: {
    en: 'You just make it visible.',
    sv: 'Ni gör det bara synligt.',
  },
};

// ============================================================
// PHILOSOPHY ALIGNMENT
// ============================================================

export const PHILOSOPHY_ALIGNMENT = {
  quote: {
    en: '"A report is never a definitive decision basis."',
    sv: '"En rapport är aldrig ett definitivt beslutsunderlag."',
  },
  systemDoes: [
    { en: 'Reinforces this', sv: 'Förstärker det' },
    { en: 'Reminds of this', sv: 'Påminner om det' },
    { en: 'Builds protection against oversimplification', sv: 'Bygger skydd mot förenkling' },
  ],
  conclusion: {
    en: 'This makes you more mature than almost all analysis platforms.',
    sv: 'Det gör er mognare än nästan alla analysplattformar.',
  },
};

// ============================================================
// COMPLETION CRITERIA
// ============================================================

export const SCENARIO_COMPLETION_CRITERIA = {
  title: {
    en: 'Completion Criteria',
    sv: 'Klart-kriterium',
  },
  intro: {
    en: 'This module is correctly built when:',
    sv: 'Denna modul är korrekt byggd när:',
  },
  criteria: [
    { en: 'No output can be read as recommendation', sv: 'Ingen output kan läsas som rekommendation' },
    { en: 'All assumptions are explicit', sv: 'Alla antaganden är explicita' },
    { en: 'Responsibility always lies with the user', sv: 'Ansvar alltid ligger på användaren' },
    { en: 'The system actively encourages broader analysis', sv: 'Systemet aktivt uppmanar till bredare analys' },
    { en: 'Legal and ethical protection is watertight', sv: 'Juridiskt och etiskt skydd är vattentätt' },
  ],
};

// ============================================================
// FINAL CONCLUSION
// ============================================================

export const SCENARIO_CONCLUSION = {
  statement: {
    en: 'Yes — probability-based tools are reasonable.',
    sv: 'Ja — sannolikhetsbaserade verktyg är rimliga.',
  },
  conditions: {
    label: { en: 'But only when:', sv: 'Men bara när:' },
    items: [
      { en: 'They are user-driven', sv: 'De är användarstyrda' },
      { en: 'Assumptions are visible', sv: 'Antaganden syns' },
      { en: 'Uncertainty dominates presentation', sv: 'Osäkerhet dominerar presentationen' },
      { en: 'The system says "this is not enough"', sv: 'Systemet säger "detta är inte nog"' },
    ],
  },
  final: {
    notThis: { en: 'Then it is not speculation.', sv: 'Då är det inte spekulation.' },
    butThis: { en: 'It is disciplined exploration.', sv: 'Det är disciplinerad utforskning.' },
  },
};
