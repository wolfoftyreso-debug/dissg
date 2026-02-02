/**
 * EXPLAIN THIS LIKE I'M HUMAN (ETLIH)
 * 
 * "Förklara exakt det jag tittar på – på rätt nivå, utan att förenkla bort sanningen."
 * 
 * Kontextmedveten förklaringsmotor som alltid vet:
 * - vad användaren tittar på
 * - vilken skala
 * - vilken osäkerhet
 * - vilken risk för feltolkning
 */

// === 1. CORE PRINCIPLE ===

export const ETLIH_CORE_PRINCIPLE = {
  sv: 'Systemet förklarar vad datan visar – inte vad användaren ska tycka eller göra.',
  en: 'The system explains what the data shows – not what the user should think or do.'
};

export const ETLIH_NEVER_DOES = [
  { sv: 'Rådgivning', en: 'Advice' },
  { sv: 'Åsikter', en: 'Opinions' },
  { sv: 'Prognoser', en: 'Forecasts' }
];

// === 2. EXPLANATION LEVELS ===

export type ExplanationLevel = 'quick' | 'understanding' | 'systemic';

export interface ExplanationLevelConfig {
  id: ExplanationLevel;
  number: 1 | 2 | 3;
  label: string;
  labelSv: string;
  duration: string;
  durationSv: string;
  audience: string;
  audienceSv: string;
  color: string;
  description: string;
  descriptionSv: string;
}

export const EXPLANATION_LEVELS: ExplanationLevelConfig[] = [
  {
    id: 'quick',
    number: 1,
    label: 'Quick Orientation',
    labelSv: 'Snabb orientering',
    duration: '10-20 sec',
    durationSv: '10-20 sek',
    audience: 'Anyone',
    audienceSv: 'Vem som helst',
    color: 'hsl(142, 76%, 36%)',
    description: 'Simple, correct. What is shown and what it means at the most basic level.',
    descriptionSv: 'Extremt enkelt. Extremt korrekt. Vad som visas och vad det betyder på grundnivå.'
  },
  {
    id: 'understanding',
    number: 2,
    label: 'Understand Connections',
    labelSv: 'Förstå samband',
    duration: '1-2 min',
    durationSv: '1-2 min',
    audience: 'Curious, journalists, decision-makers',
    audienceSv: 'Nyfikna, journalister, beslutsfattare',
    color: 'hsl(45, 93%, 47%)',
    description: 'Explains relationships, not causes. What moves together and why it might.',
    descriptionSv: 'Förklarar relation, inte orsak. Vad som rör sig tillsammans och varför det kan göra det.'
  },
  {
    id: 'systemic',
    number: 3,
    label: 'Systemic Explanation',
    labelSv: 'Systemisk förklaring',
    duration: '5+ min',
    durationSv: '5+ min',
    audience: 'Analysts, strategists, researchers',
    audienceSv: 'Analytiker, strateger, forskare',
    color: 'hsl(217, 91%, 60%)',
    description: 'Context + history + limitations. Places data in larger structural context.',
    descriptionSv: 'Kontext + historik + begränsningar. Placerar datan i större strukturellt sammanhang.'
  }
];

// === 3. CONTEXT AWARENESS ===

export interface DataContext {
  indicator: string;
  indicatorLabel: string;
  geography: 'global' | 'regional' | 'national' | 'local';
  geographyLabel: string;
  timePeriod: string;
  timeSpan: 'short' | 'medium' | 'long'; // <1yr, 1-10yr, 10+yr
  zoomLevel: 'overview' | 'detailed' | 'granular';
  sensitivity: 'low' | 'medium' | 'high';
  dataQuality: number; // 0-100
  uncertainty: number; // 0-100
  currentValue?: number;
  trend?: 'up' | 'down' | 'stable';
  changePercent?: number;
}

// === 4. MISINTERPRETATION WARNINGS ===

export interface MisinterpretationWarning {
  condition: (ctx: DataContext) => boolean;
  message: string;
  messageSv: string;
}

export const MISINTERPRETATION_WARNINGS: MisinterpretationWarning[] = [
  {
    condition: (ctx) => ctx.timeSpan === 'short',
    message: 'Short time periods can amplify variation.',
    messageSv: 'Kort tidsperiod kan förstärka variation.'
  },
  {
    condition: (ctx) => ctx.uncertainty > 30,
    message: 'This data has significant uncertainty margins.',
    messageSv: 'Denna data har betydande osäkerhetsmarginaler.'
  },
  {
    condition: (ctx) => ctx.sensitivity === 'high',
    message: 'Low values may reflect low reporting rather than actual occurrence.',
    messageSv: 'Låga värden kan spegla låg rapportering snarare än faktisk förekomst.'
  },
  {
    condition: (ctx) => ctx.dataQuality < 70,
    message: 'Data quality is limited for this indicator.',
    messageSv: 'Datakvaliteten är begränsad för denna indikator.'
  },
  {
    condition: (ctx) => ctx.changePercent && Math.abs(ctx.changePercent) > 20,
    message: 'This change may appear large, partly due to scale.',
    messageSv: 'Denna förändring kan uppfattas som stor, delvis på grund av skalan.'
  },
  {
    condition: (ctx) => ctx.zoomLevel === 'granular',
    message: 'Detailed view may obscure larger patterns.',
    messageSv: 'Detaljerad vy kan dölja större mönster.'
  }
];

// === 5. "WHAT THIS DOES NOT MEAN" ===

export const DOES_NOT_MEAN = {
  default: [
    { sv: 'att X orsakar Y', en: 'that X causes Y' },
    { sv: 'att detta gäller alla individer', en: 'that this applies to all individuals' },
    { sv: 'att detta kommer fortsätta', en: 'that this will continue' }
  ],
  correlation: [
    { sv: 'att det finns ett orsakssamband', en: 'that there is a causal relationship' },
    { sv: 'att sambandet är stabilt över tid', en: 'that the relationship is stable over time' },
    { sv: 'att samma mönster gäller överallt', en: 'that the same pattern applies everywhere' }
  ],
  sensitive: [
    { sv: 'att siffran speglar verklig förekomst', en: 'that the number reflects actual occurrence' },
    { sv: 'att låga värden är "bättre" eller "sämre"', en: 'that low values are "better" or "worse"' },
    { sv: 'att detta beskriver individer', en: 'that this describes individuals' }
  ]
};

// === 6. LANGUAGE PRINCIPLES ===

export const LANGUAGE_PRINCIPLES = [
  { sv: 'Korta meningar', en: 'Short sentences' },
  { sv: 'Vardagliga ord', en: 'Everyday words' },
  { sv: 'Inga kulturellt laddade metaforer', en: 'No culturally loaded metaphors' },
  { sv: 'Inga akademiska termer utan förklaring', en: 'No academic terms without explanation' }
];

export const READABILITY_TARGET = {
  sv: 'En 19-åring i vilket land som helst ska förstå.',
  en: 'A 19-year-old in any country should understand.'
};

// === 7. WHY AM I SEEING THIS ===

export interface VisibilityReason {
  type: 'high_impact' | 'significant_change' | 'user_interest' | 'system_priority' | 'correlation';
  label: string;
  labelSv: string;
}

export const VISIBILITY_REASONS: VisibilityReason[] = [
  { type: 'high_impact', label: 'High impact on system', labelSv: 'Stor påverkan på systemet' },
  { type: 'significant_change', label: 'Significant recent change', labelSv: 'Betydande nylig förändring' },
  { type: 'user_interest', label: 'Matches your focus area', labelSv: 'Matchar ditt fokusområde' },
  { type: 'system_priority', label: 'System priority indicator', labelSv: 'Systemprioriterad indikator' },
  { type: 'correlation', label: 'Connected to other changes', labelSv: 'Kopplad till andra förändringar' }
];

// === 8. LINKED RESOURCES ===

export interface LinkedResource {
  type: 'learning_path' | 'historical' | 'map' | 'scenario';
  label: string;
  labelSv: string;
  icon: string;
}

export const LINKED_RESOURCES: LinkedResource[] = [
  { type: 'learning_path', label: 'Guided Learning Path', labelSv: 'Guidad lärstig', icon: '📚' },
  { type: 'historical', label: 'Historical Parallels', labelSv: 'Historiska paralleller', icon: '📜' },
  { type: 'map', label: 'Map View', labelSv: 'Kartvy', icon: '🗺️' },
  { type: 'scenario', label: 'Scenarios', labelSv: 'Scenarier', icon: '🔮' }
];

// === 9. SYSTEM PROMPTS FOR AI ===

export const getSystemPrompt = (level: ExplanationLevel, language: 'sv' | 'en'): string => {
  const base = language === 'sv' 
    ? `Du är en neutral förklaringsmotor för samhällsdata. 
Du förklarar ENDAST vad datan visar – aldrig vad användaren ska tycka, göra eller känna.
Du ger ALDRIG råd, åsikter eller prognoser.
Du använder korta meningar och vardagliga ord.
Du undviker kulturellt laddade metaforer.
Du säger alltid "visar", "sammanfaller med", "förändras" – aldrig "bättre", "sämre", "lyckades", "misslyckades".`
    : `You are a neutral explanation engine for societal data.
You explain ONLY what the data shows – never what the user should think, do, or feel.
You NEVER give advice, opinions, or forecasts.
You use short sentences and everyday words.
You avoid culturally loaded metaphors.
You always say "shows", "coincides with", "changes" – never "better", "worse", "succeeded", "failed".`;

  const levelInstructions = {
    quick: language === 'sv'
      ? 'Ge en KORT förklaring (2-3 meningar). Vad visar grafen/siffran? Vad betyder riktningen? Säg explicit vad det INTE säger.'
      : 'Give a SHORT explanation (2-3 sentences). What does the graph/number show? What does the direction mean? Explicitly state what it does NOT say.',
    understanding: language === 'sv'
      ? 'Förklara samband och kontext (4-6 meningar). Vad rör sig tillsammans? Vilka möjliga faktorer kan påverka? Betona att samband inte är orsak.'
      : 'Explain connections and context (4-6 sentences). What moves together? What possible factors could influence? Emphasize that correlation is not causation.',
    systemic: language === 'sv'
      ? 'Ge en systemisk förklaring (8-12 meningar). Placera i historiskt och strukturellt sammanhang. Vilka liknande mönster har setts? Vilka begränsningar har analysen?'
      : 'Give a systemic explanation (8-12 sentences). Place in historical and structural context. What similar patterns have been seen? What limitations does the analysis have?'
  };

  return `${base}\n\n${levelInstructions[level]}`;
};

// === 10. HELPER FUNCTIONS ===

export const getApplicableWarnings = (ctx: DataContext): MisinterpretationWarning[] => {
  return MISINTERPRETATION_WARNINGS.filter(w => w.condition(ctx));
};

export const getLevelConfig = (level: ExplanationLevel): ExplanationLevelConfig => {
  return EXPLANATION_LEVELS.find(l => l.id === level) || EXPLANATION_LEVELS[0];
};
