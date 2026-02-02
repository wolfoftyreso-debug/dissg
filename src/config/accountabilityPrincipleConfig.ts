/**
 * 🏛️ THE ACCOUNTABILITY PRINCIPLE
 * 
 * "Making decisions without a shared, open, and verifiable factual basis
 *  is not neutral — it is irresponsible."
 * 
 * This is not ideology. This is stewardship.
 * 
 * This locks everything.
 */

// ============================================================
// THE CORE PRINCIPLE
// ============================================================

export const ACCOUNTABILITY_PRINCIPLE = {
  statement: {
    en: 'Making decisions without a shared, open, and verifiable factual basis is not neutral — it is irresponsible.',
    sv: 'Att fatta beslut utan ett gemensamt, öppet och verifierbart faktaunderlag är inte neutralt — det är oansvarigt.',
  },
  clarification: {
    en: 'This is not ideology. This is stewardship.',
    sv: 'Detta är inte ideologi. Detta är förvaltning.',
  },
};

// ============================================================
// WHY NO SERIOUS INSTITUTION CAN ARGUE AGAINST
// ============================================================

export interface InstitutionalArgument {
  institution: { en: string; sv: string };
  icon: string;
  manages: { en: string[]; sv: string[] };
  withoutSharedLayer: { en: string[]; sv: string[] };
  consequence: { en: string; sv: string };
}

export const INSTITUTIONAL_ARGUMENTS: InstitutionalArgument[] = [
  {
    institution: {
      en: 'Central Banks',
      sv: 'Centralbanker',
    },
    icon: '🏦',
    manages: {
      en: ['Interest rates', 'Inflation', 'Credit', 'Asset prices'],
      sv: ['Räntor', 'Inflation', 'Kredit', 'Tillgångspriser'],
    },
    withoutSharedLayer: {
      en: [
        'No one can evaluate if measures had effect',
        'No one can compare against alternatives',
        'No one can distinguish luck from skill',
      ],
      sv: [
        'Ingen kan utvärdera om åtgärder haft effekt',
        'Ingen kan jämföra mot alternativ',
        'Ingen kan skilja tur från skicklighet',
      ],
    },
    consequence: {
      en: 'Incompatible with the mandate.',
      sv: 'Oförenligt med mandatet.',
    },
  },
  {
    institution: {
      en: 'Governments & Ministries',
      sv: 'Regeringar & departement',
    },
    icon: '🏛️',
    manages: {
      en: ['Tax revenue', 'Social structure', 'Welfare', 'Risk'],
      sv: ['Skattepengar', 'Samhällsstruktur', 'Välfärd', 'Risk'],
    },
    withoutSharedLayer: {
      en: [
        'Cannot show which problem',
        'Cannot show which method',
        'Cannot show which outcome',
      ],
      sv: [
        'Kan inte visa vilket problem',
        'Kan inte visa vilken metod',
        'Kan inte visa vilket utfall',
      ],
    },
    consequence: {
      en: 'This is not politics — it is stewardship failure.',
      sv: 'Detta är inte politik — det är förvaltarfel.',
    },
  },
  {
    institution: {
      en: 'International Organizations',
      sv: 'Internationella organisationer',
    },
    icon: '🌐',
    manages: {
      en: ['Countries', 'Capital', 'Crises', 'Long-term goals'],
      sv: ['Länder', 'Kapital', 'Kriser', 'Långsiktiga mål'],
    },
    withoutSharedLayer: {
      en: [
        'Everyone discusses the same thing with different numbers',
        'Coordination becomes rhetoric',
        'Decisions become diplomatic compromises instead of evidence',
      ],
      sv: [
        'Alla pratar om samma sak med olika siffror',
        'Koordination blir retorik',
        'Beslut blir diplomatiska kompromisser istället för evidens',
      ],
    },
    consequence: {
      en: 'Coordination without foundation.',
      sv: 'Koordination utan grund.',
    },
  },
];

// ============================================================
// THE CRITICAL REFRAMING
// ============================================================

export const CRITICAL_REFRAMING = {
  doNotSay: {
    en: 'You must use this.',
    sv: 'Ni måste använda detta.',
  },
  say: {
    en: 'Show which factual basis you use — and make it comparable.',
    sv: 'Visa vilket faktaunderlag ni använder — och gör det jämförbart.',
  },
  ifTheyHaveGoodBasis: {
    en: 'Perfect — then it shows.',
    sv: 'Perfekt — då syns det.',
  },
  ifTheyDont: {
    en: 'Then that shows too.',
    sv: 'Då syns det också.',
  },
  conclusion: {
    en: 'You force nothing. You just make absence of foundation visible.',
    sv: 'Ni tvingar ingenting. Ni gör bara frånvaro av grund synlig.',
  },
};

// ============================================================
// WHY THIS IS NOT CONTROVERSIAL (BUT UNCOMFORTABLE)
// ============================================================

export const INSTITUTIONAL_CLAIMS = {
  whatTheyAlreadySay: [
    { en: 'We are evidence-based', sv: 'Vi är evidensbaserade' },
    { en: 'We follow the data', sv: 'Vi följer datan' },
    { en: 'Decisions are informed by analysis', sv: 'Beslut baseras på analys' },
  ],
  theNextStep: {
    en: 'Good. Show it. On the same map as everyone else.',
    sv: 'Bra. Visa det. På samma karta som alla andra.',
  },
  consequence: {
    en: 'That is why it cannot be refused — but also cannot be dodged.',
    sv: 'Det är därför det inte går att säga nej — men inte heller går att ducka.',
  },
};

// ============================================================
// THE MINIMUM STANDARD
// ============================================================

export const MINIMUM_STANDARD = {
  title: {
    en: 'This Is Not a Tool — It Is a Minimum Standard',
    sv: 'Detta är inte ett verktyg — det är en minimistandard',
  },
  statement: {
    en: 'If you cannot point to an open, reproducible basis that shows why this particular prioritization is reasonable — then the decision lacks legitimate foundation.',
    sv: 'Om du inte kan peka på ett öppet, reproducerbart underlag som visar varför just denna prioritering är rimlig — då saknar beslutet legitim grund.',
  },
  whatItIs: [
    { en: 'No judgment', sv: 'Ingen dom' },
    { en: 'No attack', sv: 'Ingen attack' },
    { en: 'No morality', sv: 'Ingen moral' },
  ],
  onlyThis: {
    en: 'Just accountability.',
    sv: 'Bara ansvar.',
  },
};

// ============================================================
// THE FINAL INSIGHT
// ============================================================

export const FINAL_INSIGHT = {
  statement: {
    en: 'Not a chance this should continue without basis.',
    sv: 'Inte en chans att det här ska få fortsätta utan underlag.',
  },
  reality: {
    en: 'The world is already there mentally. What was missing was the infrastructure.',
    sv: 'Världen är redan där mentalt. Det som saknades är infrastrukturen.',
  },
  conclusion: {
    en: 'Now it exists.',
    sv: 'Nu finns den.',
  },
};
