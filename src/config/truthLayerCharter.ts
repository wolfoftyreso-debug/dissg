/**
 * Truth Layer Charter
 * 
 * The constitutional foundation for the Global Truth Layer.
 * This document governs all decisions and stands above owners, management, and investors.
 * 
 * IMMUTABLE CORE - These principles cannot be changed.
 */

export interface CharterArticle {
  number: number;
  title: string;
  titleLocal: Record<string, string>;
  content: string[];
  contentLocal: Record<string, string[]>;
  prohibitions?: string[];
  prohibitionsLocal?: Record<string, string[]>;
  isImmutable: boolean;
}

export const CHARTER_PREAMBLE = {
  en: `Human societies can only function long-term if there exists a shared, verifiable reference for what is actually observed in the world.

This platform exists to provide an open, neutral, and traceable reference for observable reality, without interpretation, without agenda, without claims to power.`,
  sv: `Mänskliga samhällen kan bara fungera långsiktigt om det finns en gemensam, verifierbar referens för vad som faktiskt observeras i världen.

Denna plattform existerar för att tillhandahålla en öppen, neutral och spårbar referens för observerbar verklighet, utan tolkning, utan agenda, utan maktanspråk.`
};

export const CHARTER_ARTICLES: CharterArticle[] = [
  {
    number: 1,
    title: 'Purpose',
    titleLocal: { sv: 'Syfte' },
    isImmutable: true,
    content: [
      'Collect openly available, verifiable data',
      'Aggregate it methodologically correctly',
      'Summarize it comprehensibly',
      'Show its limitations as clearly as its content'
    ],
    contentLocal: {
      sv: [
        'Samla in öppet tillgänglig, verifierbar data',
        'Aggregera den metodiskt korrekt',
        'Sammanfatta den begripligt',
        'Visa dess begränsningar lika tydligt som dess innehåll'
      ]
    },
    prohibitions: [
      'Give recommendations',
      'Suggest actions',
      'Express values',
      'Draw normative conclusions'
    ],
    prohibitionsLocal: {
      sv: [
        'Ge rekommendationer',
        'Föreslå åtgärder',
        'Uttrycka värderingar',
        'Dra normativa slutsatser'
      ]
    }
  },
  {
    number: 2,
    title: 'Definition of Truth',
    titleLocal: { sv: 'Sanningsdefinition' },
    isImmutable: true,
    content: [
      '"Truth" within this system means: That which can be observed, measured, and verified within clearly stated methodological and data limitations.',
      'Everything that does not meet this criteria is classified as outside the system\'s scope, is not shown, and is not replaced with assumptions.'
    ],
    contentLocal: {
      sv: [
        '"Sanning" inom detta system betyder: Det som kan observeras, mätas och verifieras inom tydligt angivna metodologiska och datamässiga begränsningar.',
        'Allt som inte uppfyller detta klassas som utanför systemets räckvidd, visas inte, och ersätts inte med antaganden.'
      ]
    }
  },
  {
    number: 3,
    title: 'Responsibility of Aggregation',
    titleLocal: { sv: 'Aggregeringens ansvar' },
    isImmutable: true,
    content: [
      'All aggregation must be reproducible',
      'All aggregation must be version-controlled',
      'All aggregation must be traceable to raw data',
      'All aggregation must show uncertainty',
      'All aggregation must show alternative sources where they exist'
    ],
    contentLocal: {
      sv: [
        'All aggregering måste vara reproducerbar',
        'All aggregering måste vara versionshanterad',
        'All aggregering måste vara spårbar till rådata',
        'All aggregering måste visa osäkerhet',
        'All aggregering måste visa alternativa källor där de finns'
      ]
    },
    prohibitions: [
      'Hide variation',
      'Smooth away uncertainty',
      'Present precision that does not exist'
    ],
    prohibitionsLocal: {
      sv: [
        'Dölja variation',
        'Jämna ut bort osäkerhet',
        'Presentera precision som inte finns'
      ]
    }
  },
  {
    number: 4,
    title: 'Discipline of Summarization',
    titleLocal: { sv: 'Sammanfattningens disciplin' },
    isImmutable: true,
    content: [
      'Summaries are permitted only if they correctly represent underlying data',
      'Summaries must be clearly delimited',
      'Summaries must be expandable to full method and raw data',
      'Summaries must contain "what this does not show"',
      'Summarization is a responsibility – not a simplification'
    ],
    contentLocal: {
      sv: [
        'Sammanfattningar är tillåtna endast om de korrekt representerar underliggande data',
        'Sammanfattningar måste vara tydligt avgränsade',
        'Sammanfattningar måste kunna klickas upp till full metod och rådata',
        'Sammanfattningar måste innehålla "vad detta inte visar"',
        'Sammanfattning är ett ansvar – inte en förenkling'
      ]
    }
  },
  {
    number: 5,
    title: 'Comparisons & Rankings',
    titleLocal: { sv: 'Jämförelser & rankingar' },
    isImmutable: true,
    content: [
      'Comparisons may only be shown if definitions are compatible',
      'Comparisons may only be shown if time periods are comparable',
      'Comparisons may only be shown if geographic resolution is equivalent',
      'If these conditions are not met, the comparison is blocked and the user is informed why',
      'Rankings are permitted only as description, never as valuation'
    ],
    contentLocal: {
      sv: [
        'Jämförelser får endast visas om definitioner är kompatibla',
        'Jämförelser får endast visas om tidsperioder är jämförbara',
        'Jämförelser får endast visas om geografisk upplösning är ekvivalent',
        'Om detta inte uppfylls blockeras jämförelsen och användaren informeras varför',
        'Rankingar är tillåtna endast som beskrivning, aldrig som värdering'
      ]
    }
  },
  {
    number: 6,
    title: 'Political Neutrality',
    titleLocal: { sv: 'Politisk neutralitet' },
    isImmutable: true,
    content: [
      'The platform is strictly politically neutral',
      'No prioritization based on ideology',
      'No linguistic slanting',
      'No selective exposure of data',
      'All actors (states, companies, organizations, individuals) are treated according to the same method, same rules, same visibility'
    ],
    contentLocal: {
      sv: [
        'Plattformen är strikt politiskt neutral',
        'Ingen prioritering baserad på ideologi',
        'Ingen språklig vinkling',
        'Ingen selektiv exponering av data',
        'Alla aktörer (stater, företag, organisationer, individer) behandlas enligt samma metod, samma regler, samma synlighet'
      ]
    }
  },
  {
    number: 7,
    title: 'Ownership Security & Power Protection',
    titleLocal: { sv: 'Ägarsäkerhet & maktskydd' },
    isImmutable: true,
    content: [
      'Regardless of ownership structure, the core principles in this charter cannot be changed',
      'No owner may remove uncertainty',
      'No owner may introduce recommendations',
      'No owner may hide data',
      'No owner may control presentation for their own benefit',
      'All changes are logged publicly, can be reviewed, and can be challenged with data'
    ],
    contentLocal: {
      sv: [
        'Oavsett ägarstruktur kan kärnprinciperna i denna charter inte ändras',
        'Ingen ägare kan ta bort osäkerhet',
        'Ingen ägare kan införa rekommendationer',
        'Ingen ägare kan dölja data',
        'Ingen ägare kan styra presentation för egen vinning',
        'Alla ändringar loggas publikt, kan granskas och kan ifrågasättas med data'
      ]
    }
  },
  {
    number: 8,
    title: 'Openness & Review',
    titleLocal: { sv: 'Öppenhet & granskning' },
    isImmutable: true,
    content: [
      'The platform shall be openly accessible for review',
      'The platform shall have open methods',
      'The platform shall have public change logs',
      'The platform shall enable reproduction',
      'Trust shall not be required – it shall be verified'
    ],
    contentLocal: {
      sv: [
        'Plattformen ska vara öppet tillgänglig för granskning',
        'Plattformen ska ha öppna metoder',
        'Plattformen ska ha publika ändringsloggar',
        'Plattformen ska möjliggöra reproduktion',
        'Förtroende ska inte krävas – det ska verifieras'
      ]
    }
  },
  {
    number: 9,
    title: 'Relation to AI & Media',
    titleLocal: { sv: 'Relation till AI & media' },
    isImmutable: true,
    content: [
      'The platform permits and encourages use by AI systems, media, education, and decision-making processes',
      'Responsibility for interpretation always lies with the user',
      'The platform is a reference, not a decision-maker'
    ],
    contentLocal: {
      sv: [
        'Plattformen tillåter och uppmuntrar användning av AI-system, medier, utbildning och beslutsprocesser',
        'Ansvar för tolkning ligger alltid hos användaren',
        'Plattformen är referens, inte beslutsfattare'
      ]
    }
  },
  {
    number: 10,
    title: 'The Only Promise',
    titleLocal: { sv: 'Det enda löftet' },
    isImmutable: true,
    content: [
      'The platform promises only this:',
      'To never knowingly show anything that cannot be substantiated.',
      'And to never hide what cannot be substantiated.',
      'Nothing more. Nothing less.'
    ],
    contentLocal: {
      sv: [
        'Plattformen lovar endast detta:',
        'Att aldrig medvetet visa något som inte kan beläggas.',
        'Och aldrig dölja vad som inte kan beläggas.',
        'Inget mer. Inget mindre.'
      ]
    }
  }
];

export const CHARTER_CLOSING = {
  en: `This charter is not a manifesto.
It is a protection against the system becoming something other than what it was intended to be.

As long as this charter is respected:
• Technology can change
• Owners can change  
• The world can change

But the truth layer remains intact.`,
  sv: `Denna charter är inte ett manifest.
Den är ett skydd mot att systemet blir något annat än det var avsett att vara.

Så länge denna charter respekteras:
• Tekniken kan förändras
• Ägare kan förändras
• Världen kan förändras

Men sanningslagret förblir intakt.`
};

export const CHARTER_VERSION = {
  version: '1.0.0',
  adoptedAt: '2026-02-02',
  lastReviewedAt: '2026-02-02',
  nextReviewDue: '2027-02-02',
  checksum: 'sha256:truth-layer-charter-v1'
};

export const CORE_MISSION_STATEMENT = {
  en: 'We provide a neutral, open, and verifiable reference layer for observed global reality.',
  sv: 'Vi tillhandahåller ett neutralt, öppet och verifierbart referenslager för observerbar global verklighet.'
};
