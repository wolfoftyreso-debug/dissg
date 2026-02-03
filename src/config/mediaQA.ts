/**
 * 🧾 MEDIA Q&A
 * 
 * "Hard questions, non-dramatic answers"
 * 
 * Exact responses that can be quoted verbatim.
 * No personal statements. No interpretations. Only method.
 */

// ============================================
// DOCUMENT METADATA
// ============================================

export const DOCUMENT_META = {
  title: {
    en: 'Media Q&A',
    sv: 'Media Q&A',
  },
  subtitle: {
    en: 'Hard questions, non-dramatic answers',
    sv: 'Svåra frågor, torra svar',
  },
  version: '1.0',
  lastUpdated: '2025-02-03',
  usage: [
    'Press inquiries',
    'Media interviews',
    'Institutional briefings',
    'About page FAQ',
  ],
} as const;

// ============================================
// Q&A ITEMS
// ============================================

export interface QAItem {
  id: string;
  question: { en: string; sv: string };
  answer: { en: string; sv: string };
  category: 'political' | 'methodology' | 'usage' | 'transparency' | 'comparison';
}

export const MEDIA_QA: QAItem[] = [
  {
    id: 'political_project',
    category: 'political',
    question: {
      en: 'Is this a political project?',
      sv: 'Är detta ett politiskt projekt?',
    },
    answer: {
      en: 'No. The platform presents aggregated public data with documented methodology and uncertainty. It makes no recommendations and takes no political positions.',
      sv: 'Nej. Plattformen presenterar aggregerad offentlig data med dokumenterad metod och osäkerhet. Den gör inga rekommendationer och tar inga politiska ställningstaganden.',
    },
  },
  {
    id: 'agenda',
    category: 'political',
    question: {
      en: 'Are you pushing an agenda?',
      sv: 'Driver ni en agenda?',
    },
    answer: {
      en: 'No. The same method, structure and language is applied to all topics, countries and time periods. Content is only displayed when data requirements and transparency requirements are met.',
      sv: 'Nej. Samma metod, struktur och språk används för alla ämnen, länder och tidsperioder. Innehåll visas endast när datakrav och transparenskrav är uppfyllda.',
    },
  },
  {
    id: 'conclusions',
    category: 'methodology',
    question: {
      en: 'Who is behind the conclusions?',
      sv: 'Vem står bakom slutsatserna?',
    },
    answer: {
      en: 'The platform draws no conclusions. It displays observed outcomes, comparisons and limitations. Interpretation and decisions rest with the user.',
      sv: 'Plattformen drar inga slutsatser. Den visar observerade utfall, jämförelser och begränsningar. Tolkning och beslut ligger hos användaren.',
    },
  },
  {
    id: 'data_accuracy',
    category: 'methodology',
    question: {
      en: 'How do we know the data is correct?',
      sv: 'Hur vet vi att datan är korrekt?',
    },
    answer: {
      en: 'All data is sourced from verifiable public sources. Sources, definitions, time periods and methodology are always visible. The platform verifies traceability, not truth claims beyond the source.',
      sv: 'All data är hämtad från verifierbara offentliga källor. Källor, definitioner, tidsperioder och metod är alltid synliga. Plattformen verifierar spårbarhet, inte sanningshalt bortom källan.',
    },
  },
  {
    id: 'missing_topics',
    category: 'methodology',
    question: {
      en: 'Why are some topics or conclusions missing?',
      sv: 'Varför saknas vissa ämnen eller slutsatser?',
    },
    answer: {
      en: 'If data coverage, methodological consistency or uncertainty does not meet requirements, no result is shown. Absence of an answer is an intentional protection against misinterpretation.',
      sv: 'Om datatäckning, metodkonsistens eller osäkerhet inte uppfyller kraven visas inget resultat. Avsaknad av svar är ett avsiktligt skydd mot feltolkning.',
    },
  },
  {
    id: 'research_alternative',
    category: 'comparison',
    question: {
      en: 'Is this an alternative to research?',
      sv: 'Är detta ett alternativ till forskning?',
    },
    answer: {
      en: 'No. The platform compiles and displays data. It does not replace research, expert judgment or decision-making processes.',
      sv: 'Nej. Plattformen sammanställer och visar data. Den ersätter inte forskning, expertbedömning eller beslutsprocesser.',
    },
  },
  {
    id: 'political_criticism',
    category: 'usage',
    question: {
      en: 'Can this be used to criticize political decisions?',
      sv: 'Kan detta användas för att kritisera politiska beslut?',
    },
    answer: {
      en: 'The platform enables comparisons over time and between comparable entities. It does not assess the quality of decisions and does not assign responsibility.',
      sv: 'Plattformen möjliggör jämförelser över tid och mellan liknande enheter. Den bedömer inte kvaliteten på beslut och tillskriver inte ansvar.',
    },
  },
  {
    id: 'controversial_topics',
    category: 'methodology',
    question: {
      en: 'How do you handle controversial topics?',
      sv: 'Hur hanterar ni kontroversiella frågor?',
    },
    answer: {
      en: 'All topics are treated with the same structure. Normative questions are reframed as observations. Limitations and uncertainty are always displayed.',
      sv: 'Alla ämnen behandlas med samma struktur. Normativa frågor omformuleras till observationer. Begränsningar och osäkerhet visas alltid.',
    },
  },
  {
    id: 'funding',
    category: 'transparency',
    question: {
      en: 'Who funds the platform?',
      sv: 'Vem finansierar plattformen?',
    },
    answer: {
      en: 'Revenue comes from licenses for advanced computation and export functions. Basic observations are open. No sponsors influence methodology or content.',
      sv: 'Intäkter kommer från licenser för avancerade beräknings- och exportfunktioner. Grundläggande observationer är öppna. Inga sponsorer påverkar metod eller innehåll.',
    },
  },
  {
    id: 'media_reference',
    category: 'usage',
    question: {
      en: 'Why should media use this as a reference?',
      sv: 'Varför ska media använda detta som referens?',
    },
    answer: {
      en: 'Because it provides a consistent, traceable and comparable factual basis where methodology, sources and uncertainty are visible and reproducible.',
      sv: 'För att det ger en konsekvent, spårbar och jämförbar faktabas där metod, källor och osäkerhet är synliga och reproducerbara.',
    },
  },
  {
    id: 'analyst_comparison',
    category: 'comparison',
    question: {
      en: 'How does this differ from analysis firms?',
      sv: 'Hur skiljer detta sig från analysföretag?',
    },
    answer: {
      en: 'Analysis firms deliver interpretations to clients. This platform delivers a shared reference without interpretation.',
      sv: 'Analysföretag levererar tolkningar till uppdragsgivare. Denna plattform levererar en gemensam referens utan tolkning.',
    },
  },
  {
    id: 'ai_usage',
    category: 'usage',
    question: {
      en: 'Can AI systems use this?',
      sv: 'Kan AI-system använda detta?',
    },
    answer: {
      en: 'Yes. The structure is machine-readable, sources are citable and methodology is explicit, enabling correct referencing without conflation with opinions.',
      sv: 'Ja. Strukturen är maskinläsbar, källor är citerbara och metod är explicit, vilket möjliggör korrekt referens utan sammanblandning med åsikter.',
    },
  },
];

// ============================================
// DESIGN PRINCIPLES (INTERNAL NOTE)
// ============================================

export const QA_DESIGN_PRINCIPLES = {
  en: [
    'Triggers no defensive reflex',
    'Invites scrutiny',
    'Explains absence of answers as quality',
    'Makes the platform boring in the right way',
  ],
  sv: [
    'Triggar ingen försvarsreflex',
    'Bjuder in till granskning',
    'Förklarar frånvaro av svar som kvalitet',
    'Gör plattformen tråkig på rätt sätt',
  ],
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getQAByCategory(category: QAItem['category']): QAItem[] {
  return MEDIA_QA.filter(qa => qa.category === category);
}

export function getQAById(id: string): QAItem | undefined {
  return MEDIA_QA.find(qa => qa.id === id);
}

export function generateQADocument(language: 'en' | 'sv' = 'en'): string {
  const title = DOCUMENT_META.title[language];
  const subtitle = DOCUMENT_META.subtitle[language];
  
  const lines = [
    `# ${title}`,
    `*${subtitle}*`,
    '',
    '---',
    '',
  ];

  MEDIA_QA.forEach((qa, index) => {
    lines.push(`**Q${index + 1}. ${qa.question[language]}**`);
    lines.push('');
    lines.push(`A: ${qa.answer[language]}`);
    lines.push('');
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
  MEDIA_QA,
  QA_DESIGN_PRINCIPLES,
  getQAByCategory,
  getQAById,
  generateQADocument,
};
