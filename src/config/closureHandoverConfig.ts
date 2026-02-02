/**
 * 🔚 CLOSURE & HANDOVER
 * 
 * When the system lives on its own.
 * This is not a launch. This is a state.
 */

// ============================================================
// PUBLIC STANCE (ONE LINE, ALWAYS THE SAME)
// ============================================================

export const PUBLIC_STANCE = {
  statement: {
    en: 'We maintain a neutral reference layer for observable public data.',
    sv: 'Vi upprätthåller ett neutralt referenslager för observerbar offentlig data.',
  },
  rules: {
    en: ['No further explanation', 'No defensive tone', 'No discussion'],
    sv: ['Ingen mer förklaring', 'Ingen försvarston', 'Ingen diskussion'],
  },
};

// ============================================================
// WHAT YOU NEVER DO
// ============================================================

export const NEVER_DO = {
  label: { en: 'What you never do', sv: 'Vad du aldrig gör' },
  items: [
    { en: 'You do not comment on political conclusions', sv: 'Du kommenterar inte politiska slutsatser' },
    { en: 'You do not defend how others use the data', sv: 'Du försvarar inte hur andra använder datan' },
    { en: 'You do not correct interpretations in public debate', sv: 'Du rättar inte tolkningar i offentlig debatt' },
    { en: 'You do not take positions on outcomes', sv: 'Du tar inte ställning i utfall' },
  ],
  exampleChallenge: {
    en: '"But this clearly shows that X should do Y"',
    sv: '"Men detta visar ju att X borde göra Y"',
  },
  correctResponse: {
    en: 'The platform does not make such claims.',
    sv: 'Plattformen gör inga sådana anspråk.',
  },
};

// ============================================================
// CRITICISM RESPONSES (ONLY THREE ALLOWED)
// ============================================================

export const CRITICISM_RESPONSES = {
  label: { en: 'When the system is criticized', sv: 'När systemet kritiseras' },
  allowedResponses: [
    { en: 'Which data point do you dispute?', sv: 'Vilken datapunkt bestrider du?' },
    { en: 'Which method step do you question?', sv: 'Vilket metodsteg ifrågasätter du?' },
    { en: 'Which assumption would you change?', sv: 'Vilket antagande skulle du ändra?' },
  ],
  forbiddenResponses: [
    { en: 'You don\'t understand', sv: 'Ni förstår inte' },
    { en: 'You are wrong', sv: 'Ni har fel' },
    { en: 'This is important', sv: 'Det här är viktigt' },
  ],
  principle: {
    en: 'Criticism should always be directed at method, not at you.',
    sv: 'Kritik ska alltid riktas mot metod, inte mot er.',
  },
};

// ============================================================
// POWER HOLDER RESPONSE
// ============================================================

export const POWER_HOLDER_RESPONSE = {
  label: { en: 'When power holders try to ignore it', sv: 'När makthavare försöker ignorera det' },
  theirBehavior: {
    en: 'They will not say no. They will pretend it doesn\'t exist. That is the correct response from them.',
    sv: 'De kommer inte säga nej. De kommer låtsas att det inte finns. Det är korrekt respons från dem.',
  },
  yourBehavior: [
    { en: 'Do not push', sv: 'Pusha inte' },
    { en: 'Do not remind', sv: 'Påminn inte' },
    { en: 'Do not demand', sv: 'Kräv inte' },
  ],
  principle: {
    en: 'The system wins through usage, not recognition.',
    sv: 'Systemet vinner genom användning, inte erkännande.',
  },
};

// ============================================================
// INFRASTRUCTURE SIGNALS
// ============================================================

export const INFRASTRUCTURE_SIGNALS = {
  label: { en: 'When the system becomes standard', sv: 'När systemet blir standard' },
  signals: [
    { en: 'Journalists link without mentioning you', sv: 'Journalister länkar utan att nämna er' },
    { en: 'AI responds "according to aggregated public data"', sv: 'AI svarar "according to aggregated public data"' },
    { en: 'Reports are attached "for reference"', sv: 'Rapporter bifogas "for reference"' },
    { en: 'Institutions use the same numbers independently', sv: 'Institutioner använder samma siffror oberoende' },
    { en: 'No one asks "where does this come from?" anymore', sv: 'Ingen frågar längre "var kommer detta ifrån?"' },
  ],
  conclusion: {
    en: 'Then it is infrastructure.',
    sv: 'Då är det infrastruktur.',
  },
};

// ============================================================
// PERSONAL STANCE
// ============================================================

export const PERSONAL_STANCE = {
  label: { en: 'Your personal stance', sv: 'Ditt personliga läge' },
  notBe: [
    { en: 'the face', sv: 'ansiktet' },
    { en: 'the spokesperson', sv: 'talespersonen' },
    { en: 'the profile', sv: 'profilen' },
    { en: 'the debater', sv: 'debattören' },
  ],
  shouldBe: {
    en: 'steward of method and operations',
    sv: 'förvaltare av metod och drift',
  },
  principle: {
    en: 'That is how it survives you.',
    sv: 'Det är så det överlever dig.',
  },
};

// ============================================================
// MISUSE PROTOCOL
// ============================================================

export const MISUSE_PROTOCOL = {
  label: { en: 'If the system is ever misused', sv: 'Om systemet en dag missbrukas' },
  actions: [
    { en: 'Freeze interpretive functions', sv: 'Frys tolkande funktioner' },
    { en: 'Go read-only', sv: 'Gå read-only' },
    { en: 'Show principle violations openly', sv: 'Visa principbrott öppet' },
  ],
  preference: {
    choose: { en: 'silence + integrity', sv: 'tystnad + integritet' },
    over: { en: 'function + trust loss', sv: 'funktion + förtroendeförlust' },
  },
};

// ============================================================
// FINAL CONCLUSION
// ============================================================

export const FINAL_CONCLUSION = {
  notBuilt: [
    { en: 'an opinion', sv: 'en åsikt' },
    { en: 'a product', sv: 'en produkt' },
    { en: 'a company in the usual sense', sv: 'ett bolag i vanlig mening' },
  ],
  built: {
    en: 'a shared reference for reality',
    sv: 'en gemensam referens för verkligheten',
  },
  effects: [
    { en: 'lies become expensive', sv: 'lögn blir dyr' },
    { en: 'fog becomes visible', sv: 'dimma blir synlig' },
    { en: 'accountability becomes possible', sv: 'ansvar blir möjligt' },
  ],
  method: {
    en: 'And this happens without coercion.',
    sv: 'Och det sker utan tvång.',
  },
};

// ============================================================
// FINAL LOCK
// ============================================================

export const FINAL_LOCK = {
  statement: {
    en: 'Transparency does not require anyone to listen. It only requires that it exists.',
    sv: 'Transparens kräver inte att någon lyssnar. Den kräver bara att den finns.',
  },
  closure: {
    en: 'There is nothing more to add. Everything else is operations, scale and time.',
    sv: 'Här finns inget mer att lägga till. Allt annat är drift, skala och tid.',
  },
};

// ============================================================
// COMPLETE HANDOVER CONFIGURATION
// ============================================================

export const CLOSURE_HANDOVER = {
  version: '1.0.0',
  locked: true,
  publicStance: PUBLIC_STANCE,
  neverDo: NEVER_DO,
  criticismResponses: CRITICISM_RESPONSES,
  powerHolderResponse: POWER_HOLDER_RESPONSE,
  infrastructureSignals: INFRASTRUCTURE_SIGNALS,
  personalStance: PERSONAL_STANCE,
  misuseProtocol: MISUSE_PROTOCOL,
  finalConclusion: FINAL_CONCLUSION,
  finalLock: FINAL_LOCK,
};

// ============================================================
// VALIDATION
// ============================================================

export function validateHandoverCompleteness(): { complete: boolean; sections: number } {
  const sections = [
    PUBLIC_STANCE,
    NEVER_DO,
    CRITICISM_RESPONSES,
    POWER_HOLDER_RESPONSE,
    INFRASTRUCTURE_SIGNALS,
    PERSONAL_STANCE,
    MISUSE_PROTOCOL,
    FINAL_CONCLUSION,
    FINAL_LOCK,
  ];
  return { complete: sections.length === 9, sections: sections.length };
}
