/**
 * MODULE — COGNITIVE BIAS EXPOSURE LAYER (CBEL)
 * "Visa inte bara datan – visa hur vårt tänkande snedvrider den."
 * 
 * BLOCK WA–WH: Metakognitionslager för operativ verklighetsförståelse
 * 
 * OBRYTBAR PRINCIP:
 * Systemet ska aldrig vara smartare än användaren.
 * Det ska hjälpa användaren bli smartare.
 */

// ═══════════════════════════════════════════════════════════════
// CORE PRINCIPLE
// ═══════════════════════════════════════════════════════════════

export const CBEL_CORE_PRINCIPLE = {
  systemQuestion: 'Vilka kända kognitiva snedvridningar riskerar att påverka tolkningen av denna data, i denna kontext?',
  focus: 'hjälpa användaren förstå sina egna fallgropar',
  statement: 'Systemet ska aldrig vara smartare än användaren. Det ska hjälpa användaren bli smartare.',
  statementSv: 'Systemet ska aldrig vara smartare än användaren. Det ska hjälpa användaren bli smartare.',
  enforced: true,
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK WA — BIAS MAP (GRUNDSTRUKTUR)
// Endast bias direkt relevanta för dataanalys
// ═══════════════════════════════════════════════════════════════

export type BiasType =
  | 'confirmation'
  | 'availability'
  | 'recency'
  | 'framing'
  | 'base_rate_neglect'
  | 'causality'
  | 'survivorship'
  | 'anchoring'
  | 'outcome'
  | 'hindsight'
  | 'optimism'
  | 'status_quo';

export interface BiasDefinition {
  type: BiasType;
  name: string;
  nameSv: string;
  description: string;
  descriptionSv: string;
  shortExplanation: string;
  shortExplanationSv: string;
  commonIn: string[];
  riskLevel: 'low' | 'medium' | 'high';
  mitigationHint: string;
  mitigationHintSv: string;
}

export const BIAS_DEFINITIONS: Record<BiasType, BiasDefinition> = {
  confirmation: {
    type: 'confirmation',
    name: 'Confirmation Bias',
    nameSv: 'Bekräftelsebias',
    description: 'The tendency to search for, interpret, and recall information that confirms pre-existing beliefs.',
    descriptionSv: 'Tendensen att söka, tolka och minnas information som bekräftar befintliga övertygelser.',
    shortExplanation: 'We see what we expect to see',
    shortExplanationSv: 'Vi ser det vi förväntar oss att se',
    commonIn: ['Political analysis', 'Investment decisions', 'Policy evaluation'],
    riskLevel: 'high',
    mitigationHint: 'Actively seek disconfirming evidence',
    mitigationHintSv: 'Sök aktivt efter motbevis',
  },
  availability: {
    type: 'availability',
    name: 'Availability Bias',
    nameSv: 'Tillgänglighetsbias',
    description: 'Overweighting information that is easily recalled, often because it is recent or emotionally charged.',
    descriptionSv: 'Övervärdering av information som lätt minns, ofta för att den är nylig eller känslomässigt laddad.',
    shortExplanation: 'What we recently saw feels bigger',
    shortExplanationSv: 'Det vi nyligen sett känns större',
    commonIn: ['Risk assessment', 'Media consumption', 'Trend analysis'],
    riskLevel: 'high',
    mitigationHint: 'Check base rates and historical data',
    mitigationHintSv: 'Kontrollera grundnivåer och historisk data',
  },
  recency: {
    type: 'recency',
    name: 'Recency Bias',
    nameSv: 'Recency bias',
    description: 'Giving disproportionate weight to the most recent data points.',
    descriptionSv: 'Att ge oproportionerlig vikt åt de senaste datapunkterna.',
    shortExplanation: 'The latest data point feels most important',
    shortExplanationSv: 'Senaste datapunkten känns viktigast',
    commonIn: ['Market analysis', 'Performance reviews', 'Trend interpretation'],
    riskLevel: 'medium',
    mitigationHint: 'Zoom out to see full historical context',
    mitigationHintSv: 'Zooma ut för att se fullständig historisk kontext',
  },
  framing: {
    type: 'framing',
    name: 'Framing Effect',
    nameSv: 'Inramningseffekt',
    description: 'Drawing different conclusions from the same information depending on how it is presented.',
    descriptionSv: 'Att dra olika slutsatser från samma information beroende på hur den presenteras.',
    shortExplanation: 'How it is shown changes what we think',
    shortExplanationSv: 'Hur något visas påverkar vad vi tänker',
    commonIn: ['Charts and graphs', 'News headlines', 'Statistical reports'],
    riskLevel: 'high',
    mitigationHint: 'Ask: would I conclude the same if shown differently?',
    mitigationHintSv: 'Fråga: skulle jag dra samma slutsats om det visades annorlunda?',
  },
  base_rate_neglect: {
    type: 'base_rate_neglect',
    name: 'Base Rate Neglect',
    nameSv: 'Grundnivåförbiseende',
    description: 'Ignoring general prevalence information in favor of specific case information.',
    descriptionSv: 'Att ignorera generell förekomstinformation till förmån för specifik fallinformation.',
    shortExplanation: 'We forget how common things actually are',
    shortExplanationSv: 'Vi glömmer hur vanliga saker faktiskt är',
    commonIn: ['Medical diagnosis', 'Risk assessment', 'Probability judgments'],
    riskLevel: 'high',
    mitigationHint: 'Always check: what is the baseline?',
    mitigationHintSv: 'Kontrollera alltid: vad är baslinjen?',
  },
  causality: {
    type: 'causality',
    name: 'Causality Bias',
    nameSv: 'Kausalitetsbias',
    description: 'The tendency to infer causation from correlation or coincidence.',
    descriptionSv: 'Tendensen att sluta sig till orsakssamband från korrelation eller sammanträffande.',
    shortExplanation: 'We want causes even when there are none',
    shortExplanationSv: 'Vi vill ha orsaker även när det saknas',
    commonIn: ['Policy attribution', 'Success stories', 'Before/after comparisons'],
    riskLevel: 'high',
    mitigationHint: 'Ask: what else could explain this?',
    mitigationHintSv: 'Fråga: vad annat kan förklara detta?',
  },
  survivorship: {
    type: 'survivorship',
    name: 'Survivorship Bias',
    nameSv: 'Överlevnadsbias',
    description: 'Focusing on successful outcomes while ignoring failures that are less visible.',
    descriptionSv: 'Att fokusera på lyckade utfall medan misslyckanden som är mindre synliga ignoreras.',
    shortExplanation: 'We only see what survived',
    shortExplanationSv: 'Vi ser bara det som överlevde',
    commonIn: ['Business case studies', 'Investment analysis', 'Best practices'],
    riskLevel: 'high',
    mitigationHint: 'Ask: what about those who failed?',
    mitigationHintSv: 'Fråga: vad hände med de som misslyckades?',
  },
  anchoring: {
    type: 'anchoring',
    name: 'Anchoring Bias',
    nameSv: 'Förankringsbias',
    description: 'Over-relying on the first piece of information encountered.',
    descriptionSv: 'Att överförlita sig på den första informationen man stöter på.',
    shortExplanation: 'First numbers stick',
    shortExplanationSv: 'Första siffran fastnar',
    commonIn: ['Negotiations', 'Estimates', 'Forecasting'],
    riskLevel: 'medium',
    mitigationHint: 'Generate estimates before seeing others',
    mitigationHintSv: 'Skapa egna uppskattningar innan du ser andras',
  },
  outcome: {
    type: 'outcome',
    name: 'Outcome Bias',
    nameSv: 'Utfallsbias',
    description: 'Judging decisions based on outcomes rather than decision quality.',
    descriptionSv: 'Att bedöma beslut baserat på utfall snarare än beslutskvalitet.',
    shortExplanation: 'Good outcome feels like good decision',
    shortExplanationSv: 'Bra utfall känns som bra beslut',
    commonIn: ['Performance evaluation', 'Policy assessment', 'Strategy review'],
    riskLevel: 'medium',
    mitigationHint: 'Evaluate the decision process, not just results',
    mitigationHintSv: 'Utvärdera beslutsprocessen, inte bara resultatet',
  },
  hindsight: {
    type: 'hindsight',
    name: 'Hindsight Bias',
    nameSv: 'Efterklokhetsbias',
    description: 'The tendency to see past events as having been predictable.',
    descriptionSv: 'Tendensen att se tidigare händelser som förutsägbara.',
    shortExplanation: 'It feels obvious in retrospect',
    shortExplanationSv: 'Det känns självklart i efterhand',
    commonIn: ['Crisis analysis', 'Historical interpretation', 'Failure review'],
    riskLevel: 'medium',
    mitigationHint: 'Consider what was known at the time',
    mitigationHintSv: 'Tänk på vad som var känt vid tidpunkten',
  },
  optimism: {
    type: 'optimism',
    name: 'Optimism Bias',
    nameSv: 'Optimismbias',
    description: 'Overestimating the likelihood of positive outcomes.',
    descriptionSv: 'Att överskatta sannolikheten för positiva utfall.',
    shortExplanation: 'We think good things are more likely for us',
    shortExplanationSv: 'Vi tror att bra saker är mer sannolika för oss',
    commonIn: ['Project planning', 'Risk assessment', 'Forecasting'],
    riskLevel: 'medium',
    mitigationHint: 'Check: what is the historical success rate?',
    mitigationHintSv: 'Kontrollera: vad är den historiska framgångsfrekvensen?',
  },
  status_quo: {
    type: 'status_quo',
    name: 'Status Quo Bias',
    nameSv: 'Status quo-bias',
    description: 'Preference for the current state of affairs, even when change would be beneficial.',
    descriptionSv: 'Preferens för nuvarande tillstånd, även när förändring skulle vara fördelaktig.',
    shortExplanation: 'Change feels riskier than it is',
    shortExplanationSv: 'Förändring känns mer riskfyllt än det är',
    commonIn: ['Policy reform', 'Organizational change', 'Investment decisions'],
    riskLevel: 'medium',
    mitigationHint: 'Evaluate options as if starting fresh',
    mitigationHintSv: 'Utvärdera alternativ som om du började från början',
  },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK WB — CONTEXTUAL BIAS TRIGGER
// Aktiverar bias-varningar endast när relevanta
// ═══════════════════════════════════════════════════════════════

export type DataContext =
  | 'rapid_increase'
  | 'rapid_decrease'
  | 'extreme_event'
  | 'comparison_no_control'
  | 'recent_change'
  | 'success_story'
  | 'before_after'
  | 'single_case'
  | 'truncated_scale'
  | 'policy_attribution';

export interface BiasTrigger {
  context: DataContext;
  contextNameSv: string;
  triggeredBiases: BiasType[];
  warningTemplate: string;
  warningTemplateSv: string;
}

export const BIAS_TRIGGERS: BiasTrigger[] = [
  {
    context: 'rapid_increase',
    contextNameSv: 'Snabb uppgång',
    triggeredBiases: ['recency', 'availability', 'framing'],
    warningTemplate: 'Rapid increases often trigger recency and availability biases.',
    warningTemplateSv: 'I denna typ av snabb uppgång är det vanligt att övervärdera den senaste datapunkten.',
  },
  {
    context: 'rapid_decrease',
    contextNameSv: 'Snabb nedgång',
    triggeredBiases: ['recency', 'availability', 'causality'],
    warningTemplate: 'Sharp drops can trigger availability bias and premature causal attribution.',
    warningTemplateSv: 'Vid snabba nedgångar är det vanligt att söka orsaker även när sambandet är oklart.',
  },
  {
    context: 'extreme_event',
    contextNameSv: 'Extrem händelse',
    triggeredBiases: ['availability', 'base_rate_neglect', 'hindsight'],
    warningTemplate: 'Extreme events dominate memory and can distort probability estimates.',
    warningTemplateSv: 'Extrema händelser dominerar minnet och kan snedvrida sannolikhetsbedömningar.',
  },
  {
    context: 'comparison_no_control',
    contextNameSv: 'Jämförelse utan kontrollgrupp',
    triggeredBiases: ['causality', 'confirmation', 'survivorship'],
    warningTemplate: 'Comparisons without control groups invite causal inference errors.',
    warningTemplateSv: 'Vid jämförelser utan kontrollgrupp är det lätt att felaktigt anta orsakssamband.',
  },
  {
    context: 'recent_change',
    contextNameSv: 'Nylig förändring',
    triggeredBiases: ['recency', 'anchoring'],
    warningTemplate: 'Recent changes may anchor your interpretation.',
    warningTemplateSv: 'Nyliga förändringar kan förankra din tolkning oproportionerligt.',
  },
  {
    context: 'success_story',
    contextNameSv: 'Framgångsberättelse',
    triggeredBiases: ['survivorship', 'outcome', 'confirmation'],
    warningTemplate: 'Success stories may hide failed attempts with similar approaches.',
    warningTemplateSv: 'Framgångsberättelser döljer ofta misslyckade försök med liknande ansatser.',
  },
  {
    context: 'before_after',
    contextNameSv: 'Före/efter-jämförelse',
    triggeredBiases: ['causality', 'hindsight', 'framing'],
    warningTemplate: 'Before/after comparisons can suggest false causation.',
    warningTemplateSv: 'Före/efter-jämförelser kan antyda falskt orsakssamband.',
  },
  {
    context: 'single_case',
    contextNameSv: 'Enstaka fall',
    triggeredBiases: ['availability', 'base_rate_neglect', 'survivorship'],
    warningTemplate: 'Single cases are not representative of general patterns.',
    warningTemplateSv: 'Enstaka fall är inte representativa för generella mönster.',
  },
  {
    context: 'truncated_scale',
    contextNameSv: 'Avkortad skala',
    triggeredBiases: ['framing', 'anchoring'],
    warningTemplate: 'Truncated scales can exaggerate perceived changes.',
    warningTemplateSv: 'Avkortade skalor kan överdriva upplevda förändringar.',
  },
  {
    context: 'policy_attribution',
    contextNameSv: 'Policyattribuering',
    triggeredBiases: ['causality', 'confirmation', 'outcome'],
    warningTemplate: 'Policy effects are difficult to isolate from other factors.',
    warningTemplateSv: 'Policyeffekter är svåra att isolera från andra faktorer.',
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK WC — BIAS-AWARE UI HINTS
// Diskreta hjälpmedel, inte föreläsningar
// ═══════════════════════════════════════════════════════════════

export interface UIBiasHint {
  id: string;
  biasType: BiasType;
  context: string;
  hintText: string;
  hintTextSv: string;
  placement: 'tooltip' | 'inline' | 'callout';
}

export const UI_BIAS_HINTS: UIBiasHint[] = [
  {
    id: 'hint-scale',
    biasType: 'framing',
    context: 'chart_view',
    hintText: 'Note: This scale does not start at zero.',
    hintTextSv: 'Observera att denna skala inte startar vid noll.',
    placement: 'tooltip',
  },
  {
    id: 'hint-recency',
    biasType: 'recency',
    context: 'trend_view',
    hintText: 'The most recent data point may appear more significant than historical context suggests.',
    hintTextSv: 'Senaste datapunkten kan verka mer betydelsefull än historisk kontext antyder.',
    placement: 'callout',
  },
  {
    id: 'hint-causality',
    biasType: 'causality',
    context: 'comparison_view',
    hintText: 'This shows correlation, not proven causation.',
    hintTextSv: 'Detta visar korrelation, inte bevisat orsakssamband.',
    placement: 'inline',
  },
  {
    id: 'hint-survivorship',
    biasType: 'survivorship',
    context: 'success_view',
    hintText: 'This shows successful cases only. Consider what is not shown.',
    hintTextSv: 'Detta visar endast framgångsrika fall. Tänk på vad som inte visas.',
    placement: 'callout',
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK WD — BEFORE / AFTER VIEW
// Visa skillnad mellan spontan tolkning och kontextuell
// ═══════════════════════════════════════════════════════════════

export interface BeforeAfterExample {
  id: string;
  biasType: BiasType;
  scenario: string;
  scenarioSv: string;
  withoutContext: string;
  withoutContextSv: string;
  withContext: string;
  withContextSv: string;
  insight: string;
  insightSv: string;
}

export const BEFORE_AFTER_EXAMPLES: BeforeAfterExample[] = [
  {
    id: 'ba-1',
    biasType: 'recency',
    scenario: 'Sharp quarterly increase in key metric',
    scenarioSv: 'Skarp kvartalsökning i nyckelmått',
    withoutContext: 'This metric increased by 15% this quarter – a dramatic improvement!',
    withoutContextSv: 'Detta mått ökade med 15% detta kvartal – en dramatisk förbättring!',
    withContext: 'This quarter\'s 15% increase follows three quarters of decline and returns to 2022 levels.',
    withContextSv: 'Kvartalets 15% ökning följer tre kvartal av nedgång och återgår till 2022 års nivåer.',
    insight: 'Recent changes feel larger without historical perspective.',
    insightSv: 'Nyliga förändringar känns större utan historiskt perspektiv.',
  },
  {
    id: 'ba-2',
    biasType: 'base_rate_neglect',
    scenario: 'New policy shows 80% success rate',
    scenarioSv: 'Ny policy visar 80% framgångsfrekvens',
    withoutContext: '80% of cases improved after the new policy was implemented.',
    withoutContextSv: '80% av fallen förbättrades efter att den nya policyn infördes.',
    withContext: 'The baseline improvement rate without intervention is 75%. The policy shows 80%.',
    withContextSv: 'Grundnivån för förbättring utan intervention är 75%. Policyn visar 80%.',
    insight: 'Without knowing the base rate, any number can seem impressive.',
    insightSv: 'Utan att känna till grundnivån kan vilken siffra som helst verka imponerande.',
  },
  {
    id: 'ba-3',
    biasType: 'survivorship',
    scenario: 'Successful companies share these traits',
    scenarioSv: 'Framgångsrika företag delar dessa egenskaper',
    withoutContext: 'All successful startups in our study had aggressive growth strategies.',
    withoutContextSv: 'Alla framgångsrika startups i vår studie hade aggressiva tillväxtstrategier.',
    withContext: '90% of failed startups also had aggressive growth strategies. It is not a differentiator.',
    withContextSv: '90% av misslyckade startups hade också aggressiva tillväxtstrategier. Det är inte en särskiljande faktor.',
    insight: 'Looking only at winners hides what losers had in common with them.',
    insightSv: 'Att bara titta på vinnare döljer vad förlorare hade gemensamt med dem.',
  },
  {
    id: 'ba-4',
    biasType: 'framing',
    scenario: 'Employment statistics presentation',
    scenarioSv: 'Presentation av sysselsättningsstatistik',
    withoutContext: 'Unemployment dropped from 8% to 7% – a 12.5% reduction!',
    withoutContextSv: 'Arbetslösheten sjönk från 8% till 7% – en 12,5% minskning!',
    withContext: 'Unemployment dropped from 8% to 7%, a 1 percentage point change within normal variance.',
    withContextSv: 'Arbetslösheten sjönk från 8% till 7%, en förändring på 1 procentenhet inom normal varians.',
    insight: 'Relative vs absolute framing changes perceived magnitude.',
    insightSv: 'Relativ vs absolut inramning ändrar upplevd storlek.',
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK WE — PERSONAL BIAS PROFILE (PRIVAT)
// Självinsikt, inte ranking
// ═══════════════════════════════════════════════════════════════

export interface PersonalBiasProfile {
  userId: string;
  observedPatterns: {
    biasType: BiasType;
    occurrences: number;
    lastObserved: string;
    contexts: string[];
  }[];
  totalAnalyses: number;
  lastUpdated: string;
}

export const PERSONAL_PROFILE_PRINCIPLES = {
  private: {
    sv: 'Helt privat – bara du kan se detta.',
    en: 'Completely private – only you can see this.',
  },
  noScores: {
    sv: 'Inga poäng eller betyg.',
    en: 'No scores or grades.',
  },
  selfInsight: {
    sv: 'Detta är självinsikt, inte ranking.',
    en: 'This is self-insight, not ranking.',
  },
  voluntary: {
    sv: 'Du kan rensa din profil när som helst.',
    en: 'You can clear your profile at any time.',
  },
} as const;

// Mock personal profile
export const MOCK_PERSONAL_PROFILE: PersonalBiasProfile = {
  userId: 'demo-user',
  observedPatterns: [
    {
      biasType: 'recency',
      occurrences: 7,
      lastObserved: '2024-11-28',
      contexts: ['trend_analysis', 'quarterly_review'],
    },
    {
      biasType: 'confirmation',
      occurrences: 5,
      lastObserved: '2024-11-25',
      contexts: ['policy_evaluation', 'comparison'],
    },
    {
      biasType: 'causality',
      occurrences: 4,
      lastObserved: '2024-11-22',
      contexts: ['before_after', 'correlation_view'],
    },
  ],
  totalAnalyses: 42,
  lastUpdated: '2024-11-28',
};

// ═══════════════════════════════════════════════════════════════
// BLOCK WF — LEARNING LINKAGE
// Lärande i kontext slår teori
// ═══════════════════════════════════════════════════════════════

export interface LearningLink {
  biasType: BiasType;
  shortExplanation: string;
  shortExplanationSv: string;
  exampleInSystem: string;
  exampleInSystemSv: string;
  alternativeView: string;
  alternativeViewSv: string;
  learningPathId: string;
}

export const LEARNING_LINKS: Record<BiasType, LearningLink> = {
  confirmation: {
    biasType: 'confirmation',
    shortExplanation: 'We unconsciously seek information that confirms what we already believe.',
    shortExplanationSv: 'Vi söker omedvetet information som bekräftar det vi redan tror.',
    exampleInSystem: 'See how the same data can support different narratives depending on selection.',
    exampleInSystemSv: 'Se hur samma data kan stödja olika narrativ beroende på urval.',
    alternativeView: 'View data that challenges the current interpretation.',
    alternativeViewSv: 'Visa data som utmanar den nuvarande tolkningen.',
    learningPathId: 'lp-confirmation-bias',
  },
  availability: {
    biasType: 'availability',
    shortExplanation: 'Events that are easy to recall feel more common than they are.',
    shortExplanationSv: 'Händelser som är lätta att minnas känns vanligare än de är.',
    exampleInSystem: 'Compare recent headline events to their actual frequency.',
    exampleInSystemSv: 'Jämför nyliga rubrikhändelser med deras faktiska frekvens.',
    alternativeView: 'View statistical base rates alongside memorable events.',
    alternativeViewSv: 'Visa statistiska grundnivåer tillsammans med minnesvärda händelser.',
    learningPathId: 'lp-availability-bias',
  },
  recency: {
    biasType: 'recency',
    shortExplanation: 'The most recent information weighs more heavily than it should.',
    shortExplanationSv: 'Den senaste informationen väger tyngre än den borde.',
    exampleInSystem: 'See how the latest quarter compares to longer trends.',
    exampleInSystemSv: 'Se hur senaste kvartalet jämförs med längre trender.',
    alternativeView: 'Extend timeline to show multi-year patterns.',
    alternativeViewSv: 'Förläng tidslinjen för att visa fleråriga mönster.',
    learningPathId: 'lp-recency-bias',
  },
  framing: {
    biasType: 'framing',
    shortExplanation: 'How data is presented affects what conclusions we draw.',
    shortExplanationSv: 'Hur data presenteras påverkar vilka slutsatser vi drar.',
    exampleInSystem: 'See the same data shown with different scales and formats.',
    exampleInSystemSv: 'Se samma data visad med olika skalor och format.',
    alternativeView: 'Toggle between relative and absolute presentations.',
    alternativeViewSv: 'Växla mellan relativ och absolut presentation.',
    learningPathId: 'lp-framing-effect',
  },
  base_rate_neglect: {
    biasType: 'base_rate_neglect',
    shortExplanation: 'We forget to consider how common something is in general.',
    shortExplanationSv: 'Vi glömmer att beakta hur vanligt något är i allmänhet.',
    exampleInSystem: 'See intervention results alongside baseline rates.',
    exampleInSystemSv: 'Se interventionsresultat tillsammans med baslinjenivåer.',
    alternativeView: 'Always show baseline comparison.',
    alternativeViewSv: 'Visa alltid baslinjen för jämförelse.',
    learningPathId: 'lp-base-rate',
  },
  causality: {
    biasType: 'causality',
    shortExplanation: 'We see causes where there may only be correlation or coincidence.',
    shortExplanationSv: 'Vi ser orsaker där det kanske bara finns korrelation eller sammanträffande.',
    exampleInSystem: 'See spurious correlations that have no causal relationship.',
    exampleInSystemSv: 'Se falska korrelationer som saknar orsakssamband.',
    alternativeView: 'View with causality confidence indicators.',
    alternativeViewSv: 'Visa med kausalitetskonfidensindikatorer.',
    learningPathId: 'lp-causality',
  },
  survivorship: {
    biasType: 'survivorship',
    shortExplanation: 'We only see what succeeded, not what failed.',
    shortExplanationSv: 'Vi ser bara det som lyckades, inte det som misslyckades.',
    exampleInSystem: 'See success cases alongside failure cases with similar characteristics.',
    exampleInSystemSv: 'Se framgångsfall tillsammans med misslyckanden med liknande egenskaper.',
    alternativeView: 'Include failed cases in the analysis.',
    alternativeViewSv: 'Inkludera misslyckade fall i analysen.',
    learningPathId: 'lp-survivorship',
  },
  anchoring: {
    biasType: 'anchoring',
    shortExplanation: 'First numbers we see become reference points that bias later judgments.',
    shortExplanationSv: 'Första siffrorna vi ser blir referenspunkter som snedvrider senare bedömningar.',
    exampleInSystem: 'See how initial estimates influence final conclusions.',
    exampleInSystemSv: 'Se hur initiala uppskattningar påverkar slutliga slutsatser.',
    alternativeView: 'Generate your own estimate before viewing data.',
    alternativeViewSv: 'Skapa din egen uppskattning innan du ser data.',
    learningPathId: 'lp-anchoring',
  },
  outcome: {
    biasType: 'outcome',
    shortExplanation: 'We judge decisions by results, not by decision quality.',
    shortExplanationSv: 'Vi bedömer beslut efter resultat, inte efter beslutskvalitet.',
    exampleInSystem: 'See decisions that were sound but had poor outcomes.',
    exampleInSystemSv: 'Se beslut som var välgrundade men hade dåliga utfall.',
    alternativeView: 'Evaluate the information available at decision time.',
    alternativeViewSv: 'Utvärdera informationen som var tillgänglig vid beslutstillfället.',
    learningPathId: 'lp-outcome',
  },
  hindsight: {
    biasType: 'hindsight',
    shortExplanation: 'Past events seem more predictable than they were.',
    shortExplanationSv: 'Tidigare händelser verkar mer förutsägbara än de var.',
    exampleInSystem: 'See what forecasters actually predicted before events.',
    exampleInSystemSv: 'Se vad prognosmakare faktiskt förutspådde före händelser.',
    alternativeView: 'View contemporary predictions, not retrospective analysis.',
    alternativeViewSv: 'Visa samtida prognoser, inte retrospektiv analys.',
    learningPathId: 'lp-hindsight',
  },
  optimism: {
    biasType: 'optimism',
    shortExplanation: 'We overestimate positive outcomes for ourselves.',
    shortExplanationSv: 'Vi överskattar positiva utfall för oss själva.',
    exampleInSystem: 'See historical success rates for similar projects.',
    exampleInSystemSv: 'Se historiska framgångsfrekvenser för liknande projekt.',
    alternativeView: 'View reference class forecasting data.',
    alternativeViewSv: 'Visa data från referensklassförväntningar.',
    learningPathId: 'lp-optimism',
  },
  status_quo: {
    biasType: 'status_quo',
    shortExplanation: 'We prefer the current state even when change is beneficial.',
    shortExplanationSv: 'Vi föredrar nuvarande tillstånd även när förändring är fördelaktig.',
    exampleInSystem: 'See what comparable entities gained from similar changes.',
    exampleInSystemSv: 'Se vad jämförbara enheter vann på liknande förändringar.',
    alternativeView: 'Evaluate as if making a fresh choice.',
    alternativeViewSv: 'Utvärdera som om du gjorde ett nytt val.',
    learningPathId: 'lp-status-quo',
  },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK WG — COLLECTIVE BIAS PATTERNS (AGGREGERAT)
// Meta-förståelse, inte pekande
// ═══════════════════════════════════════════════════════════════

export interface CollectiveBiasPattern {
  domain: string;
  domainSv: string;
  mostCommonBiases: BiasType[];
  prevalence: Record<BiasType, number>; // percentage
  trend: 'increasing' | 'stable' | 'decreasing';
  insight: string;
  insightSv: string;
}

export const COLLECTIVE_BIAS_PATTERNS: CollectiveBiasPattern[] = [
  {
    domain: 'Economic Policy',
    domainSv: 'Ekonomisk politik',
    mostCommonBiases: ['confirmation', 'causality', 'recency'],
    prevalence: { confirmation: 34, causality: 28, recency: 22, availability: 8, framing: 5, base_rate_neglect: 3, survivorship: 0, anchoring: 0, outcome: 0, hindsight: 0, optimism: 0, status_quo: 0 },
    trend: 'stable',
    insight: 'Economic discussions frequently exhibit confirmation and causal attribution biases.',
    insightSv: 'Ekonomiska diskussioner uppvisar ofta bekräftelse- och kausalitetsbiaser.',
  },
  {
    domain: 'Public Health',
    domainSv: 'Folkhälsa',
    mostCommonBiases: ['availability', 'base_rate_neglect', 'framing'],
    prevalence: { availability: 38, base_rate_neglect: 25, framing: 18, recency: 10, confirmation: 6, causality: 3, survivorship: 0, anchoring: 0, outcome: 0, hindsight: 0, optimism: 0, status_quo: 0 },
    trend: 'decreasing',
    insight: 'Health topics are strongly influenced by recent news and base rate neglect.',
    insightSv: 'Hälsofrågor påverkas starkt av nyliga nyheter och grundnivåförbiseende.',
  },
  {
    domain: 'Climate & Environment',
    domainSv: 'Klimat & Miljö',
    mostCommonBiases: ['framing', 'recency', 'availability'],
    prevalence: { framing: 32, recency: 26, availability: 20, confirmation: 12, causality: 6, base_rate_neglect: 4, survivorship: 0, anchoring: 0, outcome: 0, hindsight: 0, optimism: 0, status_quo: 0 },
    trend: 'increasing',
    insight: 'Environmental discussions are shaped by how data is framed and recent events.',
    insightSv: 'Miljödiskussioner formas av hur data inramas och av nyliga händelser.',
  },
  {
    domain: 'Business & Markets',
    domainSv: 'Företag & Marknader',
    mostCommonBiases: ['survivorship', 'outcome', 'recency'],
    prevalence: { survivorship: 35, outcome: 24, recency: 18, optimism: 12, anchoring: 7, confirmation: 4, availability: 0, framing: 0, base_rate_neglect: 0, causality: 0, hindsight: 0, status_quo: 0 },
    trend: 'stable',
    insight: 'Business analysis often focuses on survivors and judges by outcomes.',
    insightSv: 'Affärsanalyser fokuserar ofta på överlevare och bedömer efter utfall.',
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK WH — SAFETY & HUMILITY GUARD
// Ingen överlägsenhet
// ═══════════════════════════════════════════════════════════════

export const HUMILITY_GUARD = {
  statement: 'All humans, including the creators of this system, are affected by cognitive biases. This tool exists to reduce them – not eliminate them.',
  statementSv: 'Alla människor, inklusive systemets skapare, påverkas av kognitiva bias. Detta verktyg finns för att minska dem – inte eliminera dem.',
  enforced: true,
  alwaysVisible: true,
} as const;

// ═══════════════════════════════════════════════════════════════
// SYSTEM STATUS
// ═══════════════════════════════════════════════════════════════

export const COGNITIVE_BIAS_SYSTEM = {
  name: 'Cognitive Bias Exposure Layer',
  acronym: 'CBEL',
  version: '1.0',
  blocks: ['WA', 'WB', 'WC', 'WD', 'WE', 'WF', 'WG', 'WH'],
  core_principle: CBEL_CORE_PRINCIPLE,
  humility_guard: HUMILITY_GUARD,
  result: 'Hjälper användare förstå hur kognitiva bias påverkar tolkning – utan överlägsenhet.',
} as const;
