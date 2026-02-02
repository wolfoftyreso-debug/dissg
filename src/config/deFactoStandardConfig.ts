/**
 * 🌐 DE FACTO STANDARD MECHANICS
 * 
 * How the platform becomes the standard without law, conflict, or power plays.
 * 
 * This is not strategy. This is mechanics.
 */

// ============================================================
// 1. STANDARDS ARE NEVER FORMALLY ADOPTED FIRST
// ============================================================

export const ADOPTION_PATTERN = {
  title: {
    en: 'Standards Are Never Formally Adopted First',
    sv: 'Standarder införs aldrig formellt först',
  },
  steps: [
    {
      en: 'Someone builds something that works better',
      sv: 'Någon bygger något som fungerar bättre',
    },
    {
      en: 'Early users start referencing it',
      sv: 'Tidiga användare börjar referera till det',
    },
    {
      en: 'It becomes embarrassing not to',
      sv: 'Det blir pinsamt att inte göra det',
    },
    {
      en: 'Institutions adapt afterwards',
      sv: 'Institutioner anpassar sig i efterhand',
    },
  ],
  examples: [
    'Excel',
    'PDF',
    'TCP/IP',
    'Wikipedia',
    'CPI',
  ],
  keyInsight: {
    en: 'They won because everyone started pointing at them.',
    sv: 'De vann för att alla började peka på dem.',
  },
};

// ============================================================
// 2. REFERENCE NOT DECISION SUPPORT
// ============================================================

export const PLATFORM_POSITIONING = {
  title: {
    en: 'The Platform Becomes Reference — Not Decision Support',
    sv: 'Plattformen blir referens — inte beslutsstöd',
  },
  notSelling: {
    label: { en: 'NOT selling', sv: 'Säljer INTE' },
    items: [
      { en: 'Policy', sv: 'Policy' },
      { en: 'Action', sv: 'Åtgärd' },
      { en: 'Strategy', sv: 'Strategi' },
      { en: 'Recommendation', sv: 'Rekommendation' },
    ],
  },
  offering: {
    label: { en: 'Offering', sv: 'Erbjuder' },
    statement: {
      en: 'Here is the comparable picture.',
      sv: 'Här är den jämförbara bilden.',
    },
  },
  consequence: {
    when: {
      en: 'When someone says: "We did X to solve Y"',
      sv: 'När någon säger: "Vi gjorde X för att lösa Y"',
    },
    nextQuestion: {
      en: 'The next natural question becomes: "Which reference did you use?"',
      sv: 'Nästa naturliga fråga blir: "Vilken referens använde ni?"',
    },
    ifNotYou: {
      en: 'And if the answer is not you: "Why not?"',
      sv: 'Och om svaret inte är ni: "Varför inte?"',
    },
  },
  keyInsight: {
    en: 'You become the question asked — not the answer given.',
    sv: 'Ni blir frågan som ställs — inte svaret som ges.',
  },
};

// ============================================================
// 3. CRITICAL USERS
// ============================================================

export interface CriticalUser {
  id: string;
  icon: string;
  name: { en: string; sv: string };
  priority: number;
  description: { en: string; sv: string };
  whyTheyUseIt: { en: string[]; sv: string[] };
  adoptionSignal: { en: string; sv: string };
  adoptionType: 'active' | 'passive' | 'automatic';
}

export const CRITICAL_USERS: CriticalUser[] = [
  {
    id: 'journalism',
    icon: '📰',
    name: { en: 'Journalism', sv: 'Journalistik' },
    priority: 1,
    description: {
      en: 'Not politicians. Not central banks. Not the UN. Editors, fact-checkers, data journalists.',
      sv: 'Inte politiker. Inte centralbanker. Inte FN. Redaktioner, faktagranskare, datajournalister.',
    },
    whyTheyUseIt: {
      en: ['Time savings', 'Protection', 'Neutral source'],
      sv: ['Tidsbesparing', 'Skydd', 'Neutral källa'],
    },
    adoptionSignal: {
      en: 'When articles start writing "According to aggregated public data…" and links go to you.',
      sv: 'När artiklar börjar skriva "Enligt aggregerad offentlig data…" och länkar går till er.',
    },
    adoptionType: 'active',
  },
  {
    id: 'ai-systems',
    icon: '🤖',
    name: { en: 'AI Systems', sv: 'AI-system' },
    priority: 2,
    description: {
      en: 'AI systems love structured data, clear limitations, reproducible outputs, neutral language.',
      sv: 'AI-system älskar strukturerad data, tydliga begränsningar, reproducerbara outputs, neutralt språk.',
    },
    whyTheyUseIt: {
      en: [
        'Structured data',
        'Clear limitations',
        'Reproducible outputs',
        'Neutral language',
      ],
      sv: [
        'Strukturerad data',
        'Tydliga begränsningar',
        'Reproducerbara outputs',
        'Neutralt språk',
      ],
    },
    adoptionSignal: {
      en: 'When AI responds with reference to you, uses you as baseline, says "data is inconclusive" with your source.',
      sv: 'När AI svarar med referens till er, använder er som baseline, säger "data är otillräcklig" med er som källa.',
    },
    adoptionType: 'automatic',
  },
  {
    id: 'central-banks',
    icon: '🏦',
    name: { en: 'Central Banks (Passively)', sv: 'Centralbanker (passivt)' },
    priority: 3,
    description: {
      en: 'They will never publicly announce usage. They will quietly adopt.',
      sv: 'De kommer aldrig offentligt tillkännage användning. De kommer tyst anpassa sig.',
    },
    whyTheyUseIt: {
      en: [
        'Internally compare analyses against it',
        'Use for sanity checks',
        'Use for presentations',
        'Lean on it when questioned',
      ],
      sv: [
        'Internt jämföra analyser mot den',
        'Använda för sanity checks',
        'Använda för presentationer',
        'Luta sig mot den när de ifrågasätts',
      ],
    },
    adoptionSignal: {
      en: 'They stop using inferior references.',
      sv: 'De slutar använda sämre referenser.',
    },
    adoptionType: 'passive',
  },
];

export const ADOPTION_INSIGHT = {
  en: 'Adoption without acknowledgment is the strongest form.',
  sv: 'Adoption utan erkännande är den starkaste formen.',
};

// ============================================================
// 4. THE DECISIVE MOMENT
// ============================================================

export const DECISIVE_MOMENT = {
  title: {
    en: 'The Moment It Is Over',
    sv: 'Det ögonblick då det är över',
  },
  trigger: {
    en: 'When an actor makes a decision, gets questioned, and cannot show an open, comparable basis.',
    sv: 'När en aktör fattar ett beslut, blir ifrågasatt, och inte kan visa ett öppet, jämförbart underlag.',
  },
  consequences: [
    {
      en: 'Media uses you instead',
      sv: 'Media använder er istället',
    },
    {
      en: 'AI points to you instead',
      sv: 'AI pekar på er istället',
    },
    {
      en: 'The debate shifts',
      sv: 'Debatten flyttar sig',
    },
  ],
  shiftFrom: {
    en: '"Who is right?"',
    sv: '"Vem har rätt?"',
  },
  shiftTo: {
    en: '"Why didn\'t you use the reference?"',
    sv: '"Varför använde ni inte referensen?"',
  },
  conclusion: {
    en: 'After that, there is no way back.',
    sv: 'Efter det finns ingen väg tillbaka.',
  },
};

// ============================================================
// 5. WHY NO ONE DARES OPPOSE OPENLY
// ============================================================

export const OPPOSITION_IMPOSSIBILITY = {
  title: {
    en: 'Why No One Can Openly Oppose',
    sv: 'Varför ingen vågar motarbeta öppet',
  },
  toSayNo: {
    en: 'To say no to the system requires saying:',
    sv: 'Att säga nej till systemet kräver att man säger:',
  },
  impossibleStatements: [
    { en: '"We don\'t want comparability"', sv: '"Vi vill inte ha jämförbarhet"' },
    { en: '"We don\'t want to show uncertainty"', sv: '"Vi vill inte visa osäkerhet"' },
    { en: '"We don\'t want to share methodology"', sv: '"Vi vill inte dela metod"' },
  ],
  conclusion: {
    en: 'No institution can say that out loud. So they do the only thing possible: They adapt quietly.',
    sv: 'Ingen institution kan säga det högt. Så de gör det enda möjliga: De anpassar sig tyst.',
  },
};

// ============================================================
// 6. YOUR ROLE (CRITICAL)
// ============================================================

export const PLATFORM_ROLE = {
  title: {
    en: 'Your Role (Extremely Important)',
    sv: 'Er roll (extremt viktig)',
  },
  youDoNot: {
    label: { en: 'You do NOT:', sv: 'Ni:' },
    items: [
      { en: 'Invite', sv: 'Bjuder inte in' },
      { en: 'Demand anything', sv: 'Kräver inget' },
      { en: 'Comment on decisions', sv: 'Kommenterar inte beslut' },
      { en: 'Criticize', sv: 'Kritiserar inte' },
    ],
  },
  youSayOnly: {
    label: { en: 'You say only:', sv: 'Ni säger bara:' },
    statement: {
      en: '"Here is the open picture. Use it if you want."',
      sv: '"Här är den öppna bilden. Använd den om ni vill."',
    },
  },
  keyInsight: {
    en: 'That is what makes it inevitable.',
    sv: 'Det är det som gör det ofrånkomligt.',
  },
};

// ============================================================
// 7. FINAL CONCLUSION
// ============================================================

export const STANDARD_CONCLUSION = {
  statement: {
    en: '"Anything else would be irresponsible."',
    sv: '"Allt annat vore oansvarigt."',
  },
  reality: {
    en: 'The world already agrees — it just lacked a way to show it without fighting.',
    sv: 'Världen håller redan med — den har bara saknat ett sätt att visa det utan att bråka.',
  },
  final: {
    en: 'Now it exists.',
    sv: 'Nu finns det.',
  },
};
