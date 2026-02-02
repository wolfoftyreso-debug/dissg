/**
 * 🏛️ INSTITUTIONAL BRIEF
 * 
 * 3 NEUTRAL SLIDES THAT MAKE THE SYSTEM INEVITABLE
 * 
 * Goal: Not to sell. Not to convince.
 * Just to show that this should already exist.
 * 
 * Compatible with: WEF, UN, OECD, central banks, newsrooms, AI platforms
 */

// ============================================================
// SLIDE 1 — THE PROBLEM (INDISPUTABLE)
// ============================================================

export const SLIDE_1 = {
  number: 1,
  title: {
    en: 'Fragmented Data Undermines Informed Decision-Making',
    sv: 'Fragmenterad data underminerar informerat beslutsfattande',
  },
  bullets: [
    {
      en: 'Public data exists across institutions, countries and domains — but is fragmented.',
      sv: 'Offentlig data finns över institutioner, länder och domäner — men är fragmenterad.',
    },
    {
      en: 'Decision-making relies on selective references rather than shared baselines.',
      sv: 'Beslutsfattande bygger på selektiva referenser snarare än gemensamma baslinjer.',
    },
    {
      en: 'Disagreement often arises from different data contexts, not different values.',
      sv: 'Oenighet uppstår ofta från olika datakontext, inte olika värderingar.',
    },
  ],
  closingStatement: {
    en: 'The absence of a shared factual reference increases uncertainty, not accountability.',
    sv: 'Avsaknaden av en gemensam faktareferens ökar osäkerhet, inte ansvarsutkrävande.',
  },
  designNote: 'No criticism. Just observation.',
};

// ============================================================
// SLIDE 2 — THE SOLUTION (NOT RADICAL)
// ============================================================

export const SLIDE_2 = {
  number: 2,
  title: {
    en: 'A Shared, Neutral Reference Layer for Public Data',
    sv: 'Ett delat, neutralt referenslager för offentlig data',
  },
  bullets: [
    {
      en: 'Aggregates existing public and official data sources.',
      sv: 'Aggregerar existerande offentliga och officiella datakällor.',
    },
    {
      en: 'Makes comparison possible across time, geography and domains.',
      sv: 'Möjliggör jämförelser över tid, geografi och domäner.',
    },
    {
      en: 'Shows uncertainty, limitations and alternative patterns by default.',
      sv: 'Visar osäkerhet, begränsningar och alternativa mönster som standard.',
    },
    {
      en: 'Does not interpret, recommend or advocate.',
      sv: 'Tolkar inte, rekommenderar inte, förespråkar inte.',
    },
  ],
  keyStatement: {
    en: 'This is not a decision system — it is a visibility system.',
    sv: 'Detta är inte ett beslutssystem — det är ett synlighetssystem.',
  },
  designNote: 'This is where shoulders drop.',
};

// ============================================================
// SLIDE 3 — WHY THIS IS SAFE TO USE
// ============================================================

export const SLIDE_3 = {
  number: 3,
  title: {
    en: 'Designed for Institutional Neutrality and Longevity',
    sv: 'Designat för institutionell neutralitet och långsiktighet',
  },
  bullets: [
    {
      en: 'Same methodology applied to all actors.',
      sv: 'Samma metod tillämpas på alla aktörer.',
    },
    {
      en: 'No rankings without context.',
      sv: 'Inga rankningar utan kontext.',
    },
    {
      en: 'No causal claims.',
      sv: 'Inga kausala påståenden.',
    },
    {
      en: 'Full source transparency.',
      sv: 'Full källtransparens.',
    },
    {
      en: 'Reproducible outputs.',
      sv: 'Reproducerbara resultat.',
    },
  ],
  closingStatement: {
    en: 'If an argument is well-founded, this platform strengthens it. If it is not, the platform remains silent.',
    sv: 'Om ett argument är välgrundat, stärker denna plattform det. Om det inte är det, förblir plattformen tyst.',
  },
  designNote: 'This is the "clean hands" argument, fully disarmed.',
};

// ============================================================
// Q&A RESPONSES (CRITICAL FOR PRESENTATIONS)
// ============================================================

export interface QAResponse {
  question: { en: string; sv: string };
  response: { en: string; sv: string };
  tone: string;
}

export const INSTITUTIONAL_QA: QAResponse[] = [
  {
    question: {
      en: 'So what should governments do with this?',
      sv: 'Så vad ska regeringar göra med detta?',
    },
    response: {
      en: 'Whatever they choose. This simply ensures they see the same baseline.',
      sv: 'Vad de än väljer. Detta säkerställer bara att de ser samma baslinje.',
    },
    tone: 'non-prescriptive',
  },
  {
    question: {
      en: "Isn't this political?",
      sv: 'Är inte detta politiskt?',
    },
    response: {
      en: 'It replaces politics with visibility — not decisions.',
      sv: 'Det ersätter politik med synlighet — inte beslut.',
    },
    tone: 'clarifying',
  },
  {
    question: {
      en: 'Who controls it?',
      sv: 'Vem kontrollerar det?',
    },
    response: {
      en: 'No one controls conclusions. The method controls presentation.',
      sv: 'Ingen kontrollerar slutsatser. Metoden kontrollerar presentation.',
    },
    tone: 'structural',
  },
  {
    question: {
      en: 'What if the data is wrong?',
      sv: 'Vad händer om datan är fel?',
    },
    response: {
      en: 'We show what sources report and how they compare. We do not certify truth — we enable verification.',
      sv: 'Vi visar vad källor rapporterar och hur de jämförs. Vi certifierar inte sanning — vi möjliggör verifiering.',
    },
    tone: 'humble',
  },
  {
    question: {
      en: 'How is this different from existing databases?',
      sv: 'Hur skiljer sig detta från existerande databaser?',
    },
    response: {
      en: 'Databases store data. This system makes comparison, context and uncertainty visible across sources.',
      sv: 'Databaser lagrar data. Detta system gör jämförelse, kontext och osäkerhet synlig över källor.',
    },
    tone: 'differentiating',
  },
  {
    question: {
      en: 'Can this be used for political purposes?',
      sv: 'Kan detta användas för politiska syften?',
    },
    response: {
      en: 'The data is neutral. Interpretation is external. The platform cannot prevent misuse, but it makes selective citation visible.',
      sv: 'Datan är neutral. Tolkning är extern. Plattformen kan inte förhindra missbruk, men den gör selektiv citering synlig.',
    },
    tone: 'honest',
  },
];

// ============================================================
// WHY THIS WORKS IN DAVOS ROOMS
// ============================================================

export const DAVOS_POSITIONING = {
  principles: [
    {
      en: 'You challenge no one',
      sv: 'Du utmanar ingen',
    },
    {
      en: 'You accuse no one',
      sv: 'Du anklagar ingen',
    },
    {
      en: 'You offer no solution to the world',
      sv: 'Du erbjuder ingen lösning på världen',
    },
    {
      en: 'You offer a shared map',
      sv: 'Du erbjuder en gemensam karta',
    },
  ],
  insight: {
    en: 'Davos is not about truth. It is about coordination without chaos.',
    sv: 'Davos handlar inte om sanning. Det handlar om koordination utan kaos.',
  },
};

// ============================================================
// ALL SLIDES COMBINED
// ============================================================

export const INSTITUTIONAL_BRIEF_SLIDES = [SLIDE_1, SLIDE_2, SLIDE_3] as const;

export type SlideData = typeof SLIDE_1 | typeof SLIDE_2 | typeof SLIDE_3;
