/**
 * 📘 HOW TO READ THIS DATA
 * 
 * A practical guide to understanding observed public outcomes.
 * 
 * This guide helps users interpret data correctly and
 * prevents misuse before it happens.
 */

// ============================================
// DOCUMENT METADATA
// ============================================

export const DOCUMENT_META = {
  title: {
    en: 'How to Read This Data',
    sv: 'Hur man läser denna data',
  },
  subtitle: {
    en: 'A practical guide to understanding observed public outcomes',
    sv: 'En praktisk guide till att förstå observerade offentliga utfall',
  },
  version: '1.0',
  lastUpdated: '2025-02-03',
} as const;

// ============================================
// INTRODUCTION
// ============================================

export const INTRODUCTION = {
  heading: {
    en: 'What this platform shows',
    sv: 'Vad denna plattform visar',
  },
  content: {
    en: `This platform presents aggregated, verifiable public data to help users understand what has been observed, how it compares across time and place, and where uncertainty remains.

It does not tell you what to think or what decisions to make.`,
    sv: `Denna plattform presenterar aggregerad, verifierbar offentlig data för att hjälpa användare förstå vad som har observerats, hur det jämförs över tid och plats, och var osäkerhet kvarstår.

Den säger inte åt dig vad du ska tycka eller vilka beslut du ska fatta.`,
  },
} as const;

// ============================================
// GUIDE SECTIONS
// ============================================

export interface GuideSection {
  id: string;
  number: number;
  title: { en: string; sv: string };
  content: { en: string; sv: string };
  keyPoints?: { en: string[]; sv: string[] };
  doNot?: { en: string[]; sv: string[] };
  analogy?: { en: string; sv: string };
}

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'scope',
    number: 1,
    title: {
      en: 'Start with the scope',
      sv: 'Börja med omfattningen',
    },
    content: {
      en: 'Every view clearly states:',
      sv: 'Varje vy anger tydligt:',
    },
    keyPoints: {
      en: [
        'Time period analyzed',
        'Geographic coverage',
        'Indicators included',
        'Data coverage (%)',
      ],
      sv: [
        'Analyserad tidsperiod',
        'Geografisk täckning',
        'Inkluderade indikatorer',
        'Datatäckning (%)',
      ],
    },
    analogy: {
      en: 'Results only apply within the stated scope. If coverage is low, conclusions should be cautious.',
      sv: 'Resultat gäller endast inom angiven omfattning. Om täckningen är låg bör slutsatser vara försiktiga.',
    },
  },
  {
    id: 'observed_change',
    number: 2,
    title: {
      en: 'Understand "observed change"',
      sv: 'Förstå "observerad förändring"',
    },
    content: {
      en: 'Charts show what changed, not why it changed.',
      sv: 'Diagram visar vad som förändrades, inte varför det förändrades.',
    },
    keyPoints: {
      en: [
        'It reflects recorded measurements',
        'It does not imply intent',
        'It does not assign cause',
      ],
      sv: [
        'Det återspeglar registrerade mätningar',
        'Det antyder inte avsikt',
        'Det tillskriver inte orsak',
      ],
    },
    analogy: {
      en: 'Think of it as a thermometer, not a diagnosis.',
      sv: 'Tänk på det som en termometer, inte en diagnos.',
    },
  },
  {
    id: 'comparisons',
    number: 3,
    title: {
      en: 'Read comparisons carefully',
      sv: 'Läs jämförelser noggrant',
    },
    content: {
      en: 'Comparisons help answer:',
      sv: 'Jämförelser hjälper till att besvara:',
    },
    keyPoints: {
      en: [
        'Is this typical or unusual?',
        'How does this compare to similar countries or periods?',
      ],
      sv: [
        'Är detta typiskt eller ovanligt?',
        'Hur jämförs detta med liknande länder eller perioder?',
      ],
    },
    doNot: {
      en: [
        'success or failure',
        'good or bad policy',
        'right or wrong decisions',
      ],
      sv: [
        'framgång eller misslyckande',
        'bra eller dålig politik',
        'rätt eller fel beslut',
      ],
    },
    analogy: {
      en: 'They show difference, not judgment.',
      sv: 'De visar skillnad, inte bedömning.',
    },
  },
  {
    id: 'correlation',
    number: 4,
    title: {
      en: 'Correlation is not causation',
      sv: 'Korrelation är inte kausalitet',
    },
    content: {
      en: 'Some views show indicators that move together over time.',
      sv: 'Vissa vyer visar indikatorer som rör sig tillsammans över tid.',
    },
    keyPoints: {
      en: [
        'They change in similar patterns',
        'The relationship may be indirect',
        'Other factors may be involved',
      ],
      sv: [
        'De förändras i liknande mönster',
        'Relationen kan vara indirekt',
        'Andra faktorer kan vara inblandade',
      ],
    },
    analogy: {
      en: 'The platform always shows stability and uncertainty to prevent overinterpretation.',
      sv: 'Plattformen visar alltid stabilitet och osäkerhet för att förhindra övertolkning.',
    },
  },
  {
    id: 'uncertainty',
    number: 5,
    title: {
      en: 'Pay attention to uncertainty',
      sv: 'Var uppmärksam på osäkerhet',
    },
    content: {
      en: 'Every serious dataset has limits.',
      sv: 'Varje seriöst dataset har begränsningar.',
    },
    keyPoints: {
      en: [
        'Data gaps',
        'Changes in definitions',
        'Short time series',
        'Low coverage warnings',
      ],
      sv: [
        'Dataglapp',
        'Förändringar i definitioner',
        'Korta tidsserier',
        'Varningar om låg täckning',
      ],
    },
    analogy: {
      en: 'If uncertainty is high, the platform will say so explicitly.',
      sv: 'Om osäkerheten är hög kommer plattformen att säga det uttryckligen.',
    },
  },
  {
    id: 'cannot_conclude',
    number: 6,
    title: {
      en: 'Read "What cannot be concluded"',
      sv: 'Läs "Vad som inte kan slutledas"',
    },
    content: {
      en: 'This section is critical.',
      sv: 'Denna sektion är kritisk.',
    },
    keyPoints: {
      en: [
        'What the data does not show',
        'Which claims cannot be supported',
        'Why some questions remain unanswered',
      ],
      sv: [
        'Vad datan inte visar',
        'Vilka påståenden som inte kan stödjas',
        'Varför vissa frågor förblir obesvarade',
      ],
    },
    analogy: {
      en: 'Absence of a conclusion is not a flaw — it is a safeguard.',
      sv: 'Frånvaro av en slutsats är inte en brist — det är ett skydd.',
    },
  },
  {
    id: 'scenarios',
    number: 7,
    title: {
      en: 'About scenarios and simulations',
      sv: 'Om scenarier och simuleringar',
    },
    content: {
      en: 'Some tools allow users to explore scenarios.',
      sv: 'Vissa verktyg låter användare utforska scenarier.',
    },
    keyPoints: {
      en: [
        'These are user-generated',
        'Results depend entirely on selected assumptions',
        'The platform does not validate conclusions',
      ],
      sv: [
        'Dessa är användargenererade',
        'Resultat beror helt på valda antaganden',
        'Plattformen validerar inte slutsatser',
      ],
    },
    analogy: {
      en: 'Scenarios are tools for exploration, not answers.',
      sv: 'Scenarier är verktyg för utforskning, inte svar.',
    },
  },
  {
    id: 'responsible_use',
    number: 8,
    title: {
      en: 'How to use this responsibly',
      sv: 'Hur man använder detta ansvarsfullt',
    },
    content: {
      en: 'This platform is best used to:',
      sv: 'Denna plattform används bäst för att:',
    },
    keyPoints: {
      en: [
        'establish a factual baseline',
        'inform discussion',
        'compare outcomes transparently',
        'identify where more research is needed',
      ],
      sv: [
        'etablera en faktabaserad grundlinje',
        'informera diskussion',
        'jämföra utfall transparent',
        'identifiera var mer forskning behövs',
      ],
    },
    doNot: {
      en: [
        'prove intent',
        'assign blame',
        'justify predetermined conclusions',
      ],
      sv: [
        'bevisa avsikt',
        'tillskriva skuld',
        'rättfärdiga förutbestämda slutsatser',
      ],
    },
  },
  {
    id: 'key_principle',
    number: 9,
    title: {
      en: 'Key principle to remember',
      sv: 'Nyckelprincip att komma ihåg',
    },
    content: {
      en: `The platform shows what can be observed —
and makes clear what cannot be concluded.

Understanding both is essential.`,
      sv: `Plattformen visar vad som kan observeras —
och gör klart vad som inte kan slutledas.

Att förstå båda är väsentligt.`,
    },
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getSectionById(id: string): GuideSection | undefined {
  return GUIDE_SECTIONS.find(s => s.id === id);
}

export function generateReadingGuide(language: 'en' | 'sv' = 'en'): string {
  const lines = [
    `# ${DOCUMENT_META.title[language]}`,
    '',
    `*${DOCUMENT_META.subtitle[language]}*`,
    '',
    '---',
    '',
    `## ${INTRODUCTION.heading[language]}`,
    '',
    INTRODUCTION.content[language],
    '',
    '---',
    '',
  ];

  GUIDE_SECTIONS.forEach(section => {
    lines.push(`## ${section.number}) ${section.title[language]}`);
    lines.push('');
    lines.push(section.content[language]);
    lines.push('');

    if (section.keyPoints) {
      section.keyPoints[language].forEach(point => {
        lines.push(`• ${point}`);
      });
      lines.push('');
    }

    if (section.doNot) {
      const doNotLabel = language === 'en' ? 'They do not indicate:' : 'De anger inte:';
      lines.push(doNotLabel);
      section.doNot[language].forEach(point => {
        lines.push(`• ${point}`);
      });
      lines.push('');
    }

    if (section.analogy) {
      lines.push(`*${section.analogy[language]}*`);
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  });

  lines.push(`Version: ${DOCUMENT_META.version} | Last updated: ${DOCUMENT_META.lastUpdated}`);

  return lines.join('\n');
}

// ============================================
// EXPORT
// ============================================

export default {
  DOCUMENT_META,
  INTRODUCTION,
  GUIDE_SECTIONS,
  getSectionById,
  generateReadingGuide,
};
