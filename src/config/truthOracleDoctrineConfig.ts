/**
 * THE TRUTH ORACLE DOCTRINE
 * 
 * Plattformens sista oföränderliga princip.
 * Detta är inte en funktion – det är en samhällslogik.
 * 
 * ÖPPEN TRANSPARENS · INGET MANIPULATIVT MELLANLAGER
 */

export const TRUTH_ORACLE_DOCTRINE = {
  // Grundsats (orubblig)
  coreStatement: {
    sv: 'Ingen politiker, organisation eller aktör har någon annan legitim funktion än att föreslå förbättringar av observerbara utfall och övertyga människor om dem med öppet redovisat underlag.',
    en: 'No politician, organization, or actor has any legitimate function other than to propose improvements to observable outcomes and convince people of them with openly disclosed evidence.',
  },
  
  // Den obligatoriska disclaimern
  platformDisclaimer: {
    sv: 'Denna plattform säger inte vad du ska tycka. Den visar vad som kan observeras.',
    en: 'This platform does not tell you what to think. It shows what can be observed.',
  },

  // Vad systemet ÄR
  systemIs: [
    { sv: 'Ett globalt sanningslager', en: 'A global truth layer' },
    { sv: 'Ett offentligt minne', en: 'A public memory' },
    { sv: 'Ett observationsorakel', en: 'An observation oracle' },
  ],

  // Vad systemet INTE är
  systemIsNot: [
    { sv: 'En regering', en: 'A government' },
    { sv: 'En domare', en: 'A judge' },
    { sv: 'En moralisk aktör', en: 'A moral actor' },
    { sv: 'En beslutsfattare', en: 'A decision-maker' },
  ],

  // Politikens legitima form
  legitimatePolitics: {
    requirements: [
      { sv: 'Problem måste visas i data', en: 'Problems must be shown in data' },
      { sv: 'Förslag måste vila på evidensrapport', en: 'Proposals must rest on evidence reports' },
      { sv: 'Metod måste vara testbar', en: 'Methods must be testable' },
      { sv: 'Resultat måste följas upp', en: 'Results must be followed up' },
    ],
    formula: {
      sv: 'hypotes → metod → uppföljning',
      en: 'hypothesis → method → follow-up',
    },
  },

  // Vad som INTE ger auktoritet
  noAuthority: [
    { sv: 'Politikers ord', en: "Politicians' words" },
    { sv: 'Titlar', en: 'Titles' },
    { sv: 'Makt', en: 'Power' },
  ],

  // Vad som GER legitimitet
  legitimacySources: [
    { sv: 'Öppna data', en: 'Open data' },
    { sv: 'Transparent metod', en: 'Transparent methodology' },
    { sv: 'Redovisad osäkerhet', en: 'Disclosed uncertainty' },
  ],

  // De få frågor som räcker
  fundamentalQuestions: [
    { sv: 'Vad värderar jag högst?', en: 'What do I value most?' },
    { sv: 'Vilka utfall accepterar jag?', en: 'Which outcomes do I accept?' },
    { sv: 'Vilka risker är jag villig att ta?', en: 'What risks am I willing to take?' },
    { sv: 'Hur mycket osäkerhet tolererar jag?', en: 'How much uncertainty do I tolerate?' },
    { sv: 'Hur vill jag att människor ska leva – givet verkligheten?', en: 'How do I want people to live – given reality?' },
  ],

  // Icke-ideologisk grund
  neutralityPrinciples: [
    { sv: 'Icke-västerländskt', en: 'Non-Western-centric' },
    { sv: 'Icke-ideologiskt', en: 'Non-ideological' },
    { sv: 'Icke-moraliserande', en: 'Non-moralizing' },
    { sv: 'Icke-normativt', en: 'Non-normative' },
  ],
} as const;

// User Covenant - användarens åtagande
export const USER_COVENANT = {
  title: {
    sv: 'Användaröverenskommelse',
    en: 'User Covenant',
  },
  
  preamble: {
    sv: 'Genom att använda denna plattform accepterar du följande principer:',
    en: 'By using this platform, you accept the following principles:',
  },

  articles: [
    {
      number: 1,
      title: { sv: 'Observation, inte sanning', en: 'Observation, not truth' },
      text: {
        sv: 'Plattformen visar observerade mönster. Den gör inga anspråk på absolut sanning.',
        en: 'The platform shows observed patterns. It makes no claims to absolute truth.',
      },
    },
    {
      number: 2,
      title: { sv: 'Eget omdöme', en: 'Own judgment' },
      text: {
        sv: 'Du ansvarar för dina egna slutsatser. Plattformen ger kontext, inte direktiv.',
        en: 'You are responsible for your own conclusions. The platform provides context, not directives.',
      },
    },
    {
      number: 3,
      title: { sv: 'Ingen manipulation', en: 'No manipulation' },
      text: {
        sv: 'All data visas utan redaktionell vinkling. Metodändringar loggas publikt.',
        en: 'All data is shown without editorial bias. Method changes are publicly logged.',
      },
    },
    {
      number: 4,
      title: { sv: 'Transparent osäkerhet', en: 'Transparent uncertainty' },
      text: {
        sv: 'Osäkerhet döljs aldrig. Om vi inte vet, säger vi det.',
        en: 'Uncertainty is never hidden. If we do not know, we say so.',
      },
    },
    {
      number: 5,
      title: { sv: 'Ingen prognos', en: 'No forecast' },
      text: {
        sv: 'Plattformen förutsäger inte framtiden. Den visar vad som har hänt.',
        en: 'The platform does not predict the future. It shows what has happened.',
      },
    },
    {
      number: 6,
      title: { sv: 'Ingen rekommendation', en: 'No recommendation' },
      text: {
        sv: 'Plattformen ger aldrig råd om vad du bör göra eller tycka.',
        en: 'The platform never advises what you should do or think.',
      },
    },
  ],

  closing: {
    sv: 'Detta är ett observationsorakel. Människan tänker. Maskinen visar.',
    en: 'This is an observation oracle. The human thinks. The machine shows.',
  },
} as const;

// Politiker-riktlinjer
export const POLITICIAN_USAGE_GUIDE = {
  title: {
    sv: 'Riktlinjer för politisk användning',
    en: 'Guidelines for Political Use',
  },

  legitimeUses: [
    {
      sv: 'Hänvisa till observerade utfall som grund för förslag',
      en: 'Reference observed outcomes as basis for proposals',
    },
    {
      sv: 'Visa historiska trender som kontext för beslut',
      en: 'Show historical trends as context for decisions',
    },
    {
      sv: 'Jämföra utfall mellan regioner med metodtransparens',
      en: 'Compare outcomes between regions with method transparency',
    },
    {
      sv: 'Följa upp tidigare beslut mot faktiska utfall',
      en: 'Follow up previous decisions against actual outcomes',
    },
  ],

  forbiddenUses: [
    {
      sv: 'Hävda att plattformen stödjer en viss politik',
      en: 'Claim that the platform supports a certain policy',
    },
    {
      sv: 'Selektivt citera data utan att visa osäkerhet',
      en: 'Selectively cite data without showing uncertainty',
    },
    {
      sv: 'Använda korrelationer som bevis för kausalitet',
      en: 'Use correlations as proof of causality',
    },
    {
      sv: 'Hänvisa till plattformen som auktoritet för egna åsikter',
      en: 'Reference the platform as authority for own opinions',
    },
  ],

  requiredDisclaimer: {
    sv: 'Vid all offentlig referens till plattformen måste följande anges: "Observerade data från [Plattform]. Tolkningar och slutsatser är mina egna."',
    en: 'When publicly referencing the platform, the following must be stated: "Observed data from [Platform]. Interpretations and conclusions are my own."',
  },
} as const;

// Juridisk safe-harbor
export const LEGAL_SAFE_HARBOR = {
  title: {
    sv: 'Juridisk ansvarsfriskrivning',
    en: 'Legal Safe Harbor',
  },

  sections: [
    {
      heading: { sv: 'Inget råd', en: 'No Advice' },
      text: {
        sv: 'Inget innehåll på denna plattform utgör finansiell, medicinsk, juridisk, politisk eller annan professionell rådgivning. All information presenteras uteslutande i observationssyfte.',
        en: 'No content on this platform constitutes financial, medical, legal, political, or other professional advice. All information is presented solely for observational purposes.',
      },
    },
    {
      heading: { sv: 'Ingen garanti', en: 'No Warranty' },
      text: {
        sv: 'Data presenteras "som den är" utan garantier om fullständighet, aktualitet eller tillförlitlighet. Användare uppmanas att verifiera all information genom primärkällor.',
        en: 'Data is presented "as is" without warranties of completeness, timeliness, or reliability. Users are encouraged to verify all information through primary sources.',
      },
    },
    {
      heading: { sv: 'Ingen kausalitet', en: 'No Causation' },
      text: {
        sv: 'Visade samband och korrelationer implicerar aldrig orsakssamband. Plattformen gör inga anspråk på att förklara varför något har hänt.',
        en: 'Displayed associations and correlations never imply causation. The platform makes no claims to explain why something has happened.',
      },
    },
    {
      heading: { sv: 'Användaransvar', en: 'User Responsibility' },
      text: {
        sv: 'Användaren bär fullt ansvar för alla beslut baserade på information från plattformen. Plattformen kan inte hållas ansvarig för konsekvenser av sådana beslut.',
        en: 'The user bears full responsibility for all decisions based on information from the platform. The platform cannot be held liable for consequences of such decisions.',
      },
    },
    {
      heading: { sv: 'Metodtransparens', en: 'Method Transparency' },
      text: {
        sv: 'All metodologi är öppet dokumenterad. Användare uppmanas att granska metodbeskrivningar för att förstå hur data har bearbetats.',
        en: 'All methodology is openly documented. Users are encouraged to review method descriptions to understand how data has been processed.',
      },
    },
  ],

  finalStatement: {
    sv: 'DENNA PLATTFORM SÄGER INTE VAD DU SKA TYCKA. DEN VISAR VAD SOM KAN OBSERVERAS.',
    en: 'THIS PLATFORM DOES NOT TELL YOU WHAT TO THINK. IT SHOWS WHAT CAN BE OBSERVED.',
  },
} as const;
