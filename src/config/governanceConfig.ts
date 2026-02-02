/**
 * BLOCK 21 — GOVERNANCE, INTEGRITY & ANTI-CORRUPTION LAYER
 */

export interface AntiFeature {
  id: string;
  feature: string;
  featureSv: string;
  rationale: string;
  rationaleSv: string;
  addedDate: string;
  addedBy: string;
  permanent: boolean;
}

export const ANTI_FEATURE_LIST: AntiFeature[] = [
  { id: 'af_prediction', feature: 'Predictive "what will happen"', featureSv: 'Förutsägelser om "vad som kommer hända"', rationale: 'The system describes reality, not prophecy.', rationaleSv: 'Systemet beskriver verkligheten, inte profetior.', addedDate: '2024-01-01', addedBy: 'Founding principles', permanent: true },
  { id: 'af_recommendations', feature: 'Policy recommendations', featureSv: 'Policyrekommendationer', rationale: 'The system informs decisions but does not prescribe them.', rationaleSv: 'Systemet informerar beslut men föreskriver dem inte.', addedDate: '2024-01-01', addedBy: 'Founding principles', permanent: true },
  { id: 'af_people_ranking', feature: 'Rankings of individuals', featureSv: 'Rankning av människor', rationale: 'People are not scored.', rationaleSv: 'Människor rankas inte.', addedDate: '2024-01-01', addedBy: 'Founding principles', permanent: true },
  { id: 'af_country_ranking', feature: '"Best/worst country" rankings', featureSv: '"Bästa/sämsta land"-rankingar', rationale: 'Comparative insights yes, value judgments no.', rationaleSv: 'Jämförande insikter ja, värdeomdömen nej.', addedDate: '2024-01-01', addedBy: 'Founding principles', permanent: true },
  { id: 'af_ideological_scores', feature: 'Ideological scores', featureSv: 'Ideologiska poäng', rationale: 'Infrastructure, not agenda.', rationaleSv: 'Infrastruktur, inte agenda.', addedDate: '2024-01-01', addedBy: 'Founding principles', permanent: true },
  { id: 'af_personal_data', feature: 'Personal data', featureSv: 'Persondata', rationale: 'Aggregates only.', rationaleSv: 'Endast aggregat.', addedDate: '2024-01-01', addedBy: 'Founding principles', permanent: true },
  { id: 'af_sentiment', feature: 'Sentiment manipulation', featureSv: 'Sentimentmanipulation', rationale: 'Facts, not feelings.', rationaleSv: 'Fakta, inte känslor.', addedDate: '2024-01-01', addedBy: 'Founding principles', permanent: true },
  { id: 'af_alerts', feature: 'Breaking news / red alerts', featureSv: 'Breaking news / röda larm', rationale: 'Signal, not noise.', rationaleSv: 'Signal, inte brus.', addedDate: '2024-01-01', addedBy: 'Founding principles', permanent: true },
  { id: 'af_gamification', feature: 'Gamification', featureSv: 'Spelifiering', rationale: 'No dopamine loops.', rationaleSv: 'Inga dopaminloopar.', addedDate: '2024-01-01', addedBy: 'Founding principles', permanent: true },
  { id: 'af_ads', feature: 'Advertising', featureSv: 'Reklam', rationale: 'Independence required.', rationaleSv: 'Oberoende krävs.', addedDate: '2024-01-01', addedBy: 'Founding principles', permanent: true },
];

export const ANTI_FEATURE_POLICY = {
  isPublic: true,
  isVersioned: true,
  changeProcessSv: 'Kräver supermajoritet (>80%) + 30 dagars kommentarsperiod',
  statementSv: 'Denna lista bygger förtroende snabbare än tusen funktioner.',
} as const;

export const RED_TEAM_QUESTIONS = [
  { q: 'How can this be misinterpreted?', qSv: 'Hur kan detta misstolkas?' },
  { q: 'How can this be cherry-picked?', qSv: 'Hur kan detta cherry-pickas?' },
  { q: 'How can this be used propagandistically?', qSv: 'Hur kan detta användas propagandistiskt?' },
  { q: 'How can this be taken out of context?', qSv: 'Hur kan detta tas ur kontext?' },
] as const;

export const RED_TEAM_PRINCIPLE = { statementSv: 'Missbruk ska vara svårt, inte förbjudet.' } as const;

export const ACCOUNTABILITY_ROLES = [
  { domain: 'method', roleNameSv: 'Metodägare', description: 'Indicator definitions, calculations, weights.', isNamed: true, isTraceable: true, isLogged: true },
  { domain: 'code', roleNameSv: 'Teknikägare', description: 'Implementation, pipelines, integrity.', isNamed: true, isTraceable: true, isLogged: true },
  { domain: 'data', roleNameSv: 'Dataförvaltare', description: 'Source connections, quality, freshness.', isNamed: true, isTraceable: true, isLogged: true },
  { domain: 'approval', roleNameSv: 'Releaseansvarig', description: 'Change approval, impact assessment.', isNamed: true, isTraceable: true, isLogged: true },
  { domain: 'ops', roleNameSv: 'Driftansvarig', description: 'Availability, monitoring, incidents.', isNamed: true, isTraceable: true, isLogged: true },
];

export const ACCOUNTABILITY_PRINCIPLE = { statementSv: 'Samma ansvarskrav som vi ställer på politiker.' } as const;

export const NO_PERSONALITY_CULT = {
  rules: [
    { ruleSv: 'Inget "grundarens syn"' },
    { ruleSv: 'Inget personligt narrativ' },
    { ruleSv: 'Inget hero-skapande' },
    { ruleSv: 'Ingen tillskrivning till individer för systembeslut' },
  ],
  identitySv: 'Systemet är en infrastruktur, inte en röst.',
} as const;

export const OPEN_CHALLENGE_POLICY = { statementSv: 'Transparens utan kaos.' } as const;

export const BLOCK_21_DONE_WHEN = {
  criteriaSv: ['Systemet kan kritiseras öppet', 'Utan att falla isär', 'Utan att bli defensivt'],
  statementSv: 'Detta är vuxen systemdesign.',
} as const;
