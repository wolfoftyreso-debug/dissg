/**
 * LAMBDA LAUNCH PROTOCOL
 * 
 * "Arrive without announcement. Become indispensable through accuracy."
 * 
 * How Lambda is introduced to the world without PR, without backlash.
 * Silent adoption through undeniable utility.
 */

// =============================================================================
// CORE PHILOSOPHY
// =============================================================================

export const LAUNCH_PHILOSOPHY = {
  principle: {
    sv: 'Anländ utan annonsering. Bli oumbärlig genom precision.',
    en: 'Arrive without announcement. Become indispensable through accuracy.',
  },
  anti_pattern: {
    sv: 'Ingen TED-talk. Ingen viral kampanj. Inga löften.',
    en: 'No TED talk. No viral campaign. No promises.',
  },
};

// =============================================================================
// PHASE 1: SILENT SEEDING
// =============================================================================

export interface LaunchPhase {
  id: string;
  phase: number;
  name: { sv: string; en: string };
  duration: string;
  description: { sv: string; en: string };
  actions: { sv: string; en: string }[];
  success_criteria: { sv: string; en: string }[];
  forbidden: { sv: string; en: string }[];
}

export const LAUNCH_PHASES: LaunchPhase[] = [
  {
    id: 'silent_seeding',
    phase: 1,
    name: { sv: 'Tyst utsäde', en: 'Silent Seeding' },
    duration: '3-6 months',
    description: {
      sv: 'Systemet finns, fungerar, men marknadsförs inte',
      en: 'System exists, works, but is not marketed',
    },
    actions: [
      { sv: 'Publicera dokumentation', en: 'Publish documentation' },
      { sv: 'Öppna API utan fanfar', en: 'Open API without fanfare' },
      { sv: 'Bjud in 5-10 forskare för validering', en: 'Invite 5-10 researchers for validation' },
      { sv: 'Svara endast på direkta frågor', en: 'Answer only direct questions' },
    ],
    success_criteria: [
      { sv: 'Forskare börjar citera spontant', en: 'Researchers begin citing spontaneously' },
      { sv: 'Inga kritiska buggar rapporteras', en: 'No critical bugs reported' },
      { sv: 'API-användning växer organiskt', en: 'API usage grows organically' },
    ],
    forbidden: [
      { sv: 'Pressmeddelanden', en: 'Press releases' },
      { sv: 'Sociala medier-kampanjer', en: 'Social media campaigns' },
      { sv: 'Jämförelser med andra system', en: 'Comparisons to other systems' },
    ],
  },
  {
    id: 'quiet_validation',
    phase: 2,
    name: { sv: 'Tyst validering', en: 'Quiet Validation' },
    duration: '6-12 months',
    description: {
      sv: 'Låt andra upptäcka och validera',
      en: 'Let others discover and validate',
    },
    actions: [
      { sv: 'Publicera metoddokumentation', en: 'Publish methodology documentation' },
      { sv: 'Öppna för peer review', en: 'Open for peer review' },
      { sv: 'Svara på akademiska förfrågningar', en: 'Respond to academic inquiries' },
      { sv: 'Bygg stöd för replikering', en: 'Build support for replication' },
    ],
    success_criteria: [
      { sv: 'Första oberoende replikering', en: 'First independent replication' },
      { sv: 'Journalister börjar använda som källa', en: 'Journalists begin using as source' },
      { sv: 'Inga metodkritiker hittar systematiska fel', en: 'No method critics find systematic errors' },
    ],
    forbidden: [
      { sv: 'Försvara mot kritik proaktivt', en: 'Proactively defend against criticism' },
      { sv: 'Söka mediauppmärksamhet', en: 'Seek media attention' },
      { sv: 'Göra anspråk på auktoritet', en: 'Claim authority' },
    ],
  },
  {
    id: 'organic_adoption',
    phase: 3,
    name: { sv: 'Organisk adoption', en: 'Organic Adoption' },
    duration: '12-24 months',
    description: {
      sv: 'Systemet sprids genom användning, inte marknadsföring',
      en: 'System spreads through use, not marketing',
    },
    actions: [
      { sv: 'Förbättra baserat på faktisk användning', en: 'Improve based on actual usage' },
      { sv: 'Expandera datatäckning på begäran', en: 'Expand data coverage on request' },
      { sv: 'Bygg institutionella partnerskap', en: 'Build institutional partnerships' },
      { sv: 'Dokumentera framgångshistorier passivt', en: 'Document success stories passively' },
    ],
    success_criteria: [
      { sv: 'Myndigheter refererar i rapporter', en: 'Governments reference in reports' },
      { sv: 'AI-system börjar använda som ground truth', en: 'AI systems begin using as ground truth' },
      { sv: 'Förtroendepoäng överstiger konkurrenter', en: 'Trust score exceeds competitors' },
    ],
    forbidden: [
      { sv: 'Aggressiv expansion', en: 'Aggressive expansion' },
      { sv: 'Poängräkning mot konkurrenter', en: 'Scorekeeping against competitors' },
      { sv: 'Politiska uttalanden', en: 'Political statements' },
    ],
  },
  {
    id: 'institutional_standard',
    phase: 4,
    name: { sv: 'Institutionell standard', en: 'Institutional Standard' },
    duration: 'Ongoing',
    description: {
      sv: 'Lambda blir de facto referens genom kvalitet',
      en: 'Lambda becomes de facto reference through quality',
    },
    actions: [
      { sv: 'Erbjud utbildning för institutioner', en: 'Offer training for institutions' },
      { sv: 'Publicera årliga metodrevisioner', en: 'Publish annual methodology reviews' },
      { sv: 'Bygg långsiktiga dataavtal', en: 'Build long-term data agreements' },
      { sv: 'Fortsätt förbättra precision', en: 'Continue improving precision' },
    ],
    success_criteria: [
      { sv: 'Internationella organisationer citerar', en: 'International organizations cite' },
      { sv: 'Akademiska kurser inkluderar Lambda', en: 'Academic courses include Lambda' },
      { sv: 'Konkurrenter imiterar arkitektur', en: 'Competitors imitate architecture' },
    ],
    forbidden: [
      { sv: 'Söka officiell certifiering', en: 'Seek official certification' },
      { sv: 'Politiska allianser', en: 'Political alliances' },
      { sv: 'Exklusivavtal', en: 'Exclusive agreements' },
    ],
  },
];

// =============================================================================
// ANTI-BACKLASH PROTOCOL
// =============================================================================

export const ANTI_BACKLASH = {
  principles: [
    {
      sv: 'Påstå aldrig överlägsenhet',
      en: 'Never claim superiority',
    },
    {
      sv: 'Kritisera aldrig konkurrenter',
      en: 'Never criticize competitors',
    },
    {
      sv: 'Försvar alltid genom reproducerbarhet, aldrig retorik',
      en: 'Always defend through reproducibility, never rhetoric',
    },
    {
      sv: 'Acceptera fel öppet när de hittas',
      en: 'Accept errors openly when found',
    },
    {
      sv: 'Tacka kritiker för att de förbättrar systemet',
      en: 'Thank critics for improving the system',
    },
  ],
  response_to_attack: {
    sv: 'Här är datan. Här är metoden. Visa felet.',
    en: 'Here is the data. Here is the method. Show the error.',
  },
};

// =============================================================================
// COMMUNICATION GUIDELINES
// =============================================================================

export const COMMUNICATION_RULES = {
  allowed: [
    'methodology_documentation',
    'data_source_lists',
    'uncertainty_disclosure',
    'version_changelogs',
    'academic_responses',
  ],
  forbidden: [
    'marketing_materials',
    'competitive_analysis',
    'success_claims',
    'future_promises',
    'political_commentary',
  ],
  tone: {
    sv: 'Kliniskt. Sakligt. Utan affekt.',
    en: 'Clinical. Factual. Without affect.',
  },
};

// =============================================================================
// SUCCESS METRICS (INTERNAL ONLY)
// =============================================================================

export const SUCCESS_METRICS = {
  year_1: [
    { metric: 'independent_citations', target: 50 },
    { metric: 'api_monthly_requests', target: 10000 },
    { metric: 'replication_attempts', target: 3 },
    { metric: 'critical_bugs_found', target: 0 },
  ],
  year_3: [
    { metric: 'independent_citations', target: 500 },
    { metric: 'institutional_users', target: 20 },
    { metric: 'ai_integrations', target: 10 },
    { metric: 'methodology_reviews', target: 5 },
  ],
  year_5: [
    { metric: 'de_facto_standard_recognition', target: true },
    { metric: 'fork_resistant', target: true },
    { metric: 'self_sustaining', target: true },
  ],
};

export const LAUNCH_DOCTRINE = {
  sv: 'Det bästa lanseringsprotokollet är inget protokoll. Bara konsekvent kvalitet.',
  en: 'The best launch protocol is no protocol. Just consistent quality.',
};
