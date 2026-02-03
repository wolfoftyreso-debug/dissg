/**
 * Presskit Configuration
 * 
 * Global Reference Layer for Verified Public Data
 * This is a content package – not marketing material.
 * 
 * Design principles:
 * - Method first
 * - Zero aesthetic distraction
 * - No icons, slogans, or hero images
 * - Neutral typography, grayscale/discrete blue only
 */

// =============================================================================
// 1. SHORT DESCRIPTION (ONE PARAGRAPH – ALL THAT'S NEEDED)
// =============================================================================

export const PLATFORM_DESCRIPTION = {
  en: `This platform is a global aggregation layer for verified public data from official statistical agencies and regulated institutions. It provides a consistent, transparent reference for observing outcomes across health, economy, environment and public policy, without offering conclusions or recommendations.`,
  
  sv: `Denna plattform är ett globalt aggregeringslager för verifierad offentlig data från officiella statistikmyndigheter och reglerade institutioner. Den tillhandahåller en konsekvent, transparent referens för att observera utfall inom hälsa, ekonomi, miljö och offentlig politik, utan att erbjuda slutsatser eller rekommendationer.`,
};

// =============================================================================
// 2. MEDIA USAGE RIGHTS
// =============================================================================

export const MEDIA_USAGE = {
  allowed: {
    en: [
      'Cite data with source attribution',
      'Link to specific views',
      'Compare time series',
      'Describe observed changes',
      'Reference methodology documentation',
    ],
    sv: [
      'Citera data med källhänvisning',
      'Länka till specifika vyer',
      'Jämföra tidsserier',
      'Beskriva observerade förändringar',
      'Referera till metoddokumentation',
    ],
  },
  
  not_allowed: {
    en: [
      'Attribute opinions to the platform',
      'Use as policy argument',
      'Draw causal conclusions',
      'Imply endorsement of interpretations',
      'Present as predictive tool',
    ],
    sv: [
      'Tillskriva plattformen åsikter',
      'Använda som policyargument',
      'Dra kausala slutsatser',
      'Antyda stöd för tolkningar',
      'Presentera som prognosverktyg',
    ],
  },
  
  standard_citation: {
    en: 'According to aggregated public data compiled from official sources…',
    sv: 'Enligt aggregerad offentlig data sammanställd från officiella källor…',
  },
};

// =============================================================================
// 3. METHODOLOGY (THE CORE)
// =============================================================================

export const METHODOLOGY = {
  data_sources: {
    categories: [
      {
        code: 'national_statistics',
        name_en: 'National Statistical Agencies',
        name_sv: 'Nationella statistikmyndigheter',
        examples: ['SCB', 'Eurostat', 'BLS', 'ONS'],
      },
      {
        code: 'international_institutions',
        name_en: 'International Institutions',
        name_sv: 'Internationella institutioner',
        examples: ['WHO', 'OECD', 'IMF', 'World Bank', 'UN'],
      },
      {
        code: 'regulated_databases',
        name_en: 'Regulated Public Databases',
        name_sv: 'Reglerade offentliga databaser',
        examples: ['Central banks', 'Health authorities', 'Environmental agencies'],
      },
    ],
  },
  
  principles: {
    en: [
      'Only verifiable sources are used',
      'Original definitions are preserved',
      'Historical breakpoints are documented',
      'Uncertainty and data gaps are always shown',
      'No interpolation without explicit disclosure',
      'Methodology changes trigger version updates',
    ],
    sv: [
      'Endast verifierbara källor används',
      'Originaldefinitioner bevaras',
      'Historiska brytpunkter dokumenteras',
      'Osäkerhet och datagap visas alltid',
      'Ingen interpolering utan explicit redovisning',
      'Metodförändringar utlöser versionsuppdateringar',
    ],
  },
  
  publication_rule: {
    en: 'If a topic cannot meet transparency and coverage requirements, it is not shown.',
    sv: 'Om ett ämne inte kan uppfylla krav på transparens och täckning visas det inte.',
  },
};

// =============================================================================
// 4. WHAT THIS IS NOT (IMPORTANT)
// =============================================================================

export const PLATFORM_NEGATION = {
  is_not: {
    en: [
      'An analysis company',
      'A policy institute',
      'A research project',
      'An opinion forum',
      'A forecasting service',
      'A consulting firm',
    ],
    sv: [
      'Ett analysföretag',
      'Ett policyinstitut',
      'Ett forskningsprojekt',
      'Ett opinionsforum',
      'En prognostjänst',
      'Ett konsultföretag',
    ],
  },
  
  is: {
    en: 'A shared factual layer',
    sv: 'Ett gemensamt faktalager',
  },
};

// =============================================================================
// 5. WHY THIS EXISTS NOW
// =============================================================================

export const EXISTENCE_RATIONALE = {
  historical_gaps: {
    en: [
      'Data has existed for a long time',
      'Comparability has been lacking',
      'Transparency has been fragmented',
    ],
    sv: [
      'Data har funnits länge',
      'Jämförbarhet har saknats',
      'Transparens har varit fragmenterad',
    ],
  },
  
  technology_enables: {
    en: [
      'Consistent structure across sources',
      'Global comparison capabilities',
      'Machine-readable transparency',
      'Real-time verification',
    ],
    sv: [
      'Konsistent struktur över källor',
      'Global jämförbarhet',
      'Maskinläsbar transparens',
      'Realtidsverifiering',
    ],
  },
};

// =============================================================================
// 6. FAQ (SHORT VERSION)
// =============================================================================

export const PRESS_FAQ = [
  {
    code: 'political',
    question_en: 'Is this political?',
    question_sv: 'Är detta politiskt?',
    answer_en: 'No. The same method is used for all.',
    answer_sv: 'Nej. Samma metod används för alla.',
  },
  {
    code: 'responsibility',
    question_en: 'Who is responsible for conclusions?',
    question_sv: 'Vem ansvarar för slutsatser?',
    answer_en: 'The user.',
    answer_sv: 'Användaren.',
  },
  {
    code: 'errors',
    question_en: 'Can this have errors?',
    question_sv: 'Kan detta ha fel?',
    answer_en: 'Yes. That is why limitations and uncertainty are shown.',
    answer_sv: 'Ja. Därför visas begränsningar och osäkerhet.',
  },
  {
    code: 'no_answer',
    question_en: 'Why are some answers "no answer"?',
    question_sv: 'Varför är vissa svar "inga svar"?',
    answer_en: 'Because it is more correct than speculation.',
    answer_sv: 'För att det är mer korrekt än spekulation.',
  },
  {
    code: 'funding',
    question_en: 'How is this funded?',
    question_sv: 'Hur finansieras detta?',
    answer_en: 'Through tiered licensing. Observation is free. Computation is paid.',
    answer_sv: 'Genom licensnivåer. Observation är gratis. Beräkning är betald.',
  },
  {
    code: 'ownership',
    question_en: 'Who owns the data?',
    question_sv: 'Vem äger datan?',
    answer_en: 'Original sources retain ownership. This platform only aggregates and structures.',
    answer_sv: 'Ursprungskällorna behåller äganderätten. Denna plattform aggregerar och strukturerar endast.',
  },
];

// =============================================================================
// 7. CONTACT POLICY (MINIMALIST)
// =============================================================================

export const CONTACT_POLICY = {
  statement_en: 'For questions regarding methodology or data sources, refer to the public documentation. No interviews or commentary are provided.',
  
  statement_sv: 'För frågor om metodik eller datakällor, se den offentliga dokumentationen. Inga intervjuer eller kommentarer ges.',
  
  principle: {
    en: 'The platform speaks through the system, not through quotes.',
    sv: 'Plattformen talar genom systemet, inte genom citat.',
  },
  
  available_channels: [
    {
      type: 'documentation',
      url: '/methodology',
      description_en: 'Full methodology documentation',
      description_sv: 'Fullständig metoddokumentation',
    },
    {
      type: 'data_sources',
      url: '/sources',
      description_en: 'Complete source registry',
      description_sv: 'Komplett källregister',
    },
    {
      type: 'citation_guide',
      url: '/ai-reference',
      description_en: 'AI and media citation standards',
      description_sv: 'AI- och media-citeringsstandard',
    },
  ],
};

// =============================================================================
// 8. VISUAL GUIDELINES (PRESS)
// =============================================================================

export const VISUAL_GUIDELINES = {
  prohibited: [
    'icons',
    'slogans',
    'hero_images',
    'promotional_graphics',
    'testimonials',
    'stock_photography',
  ],
  
  permitted: [
    'screenshots_of_fact_views',
    'data_visualizations',
    'methodology_diagrams',
    'neutral_typography',
  ],
  
  color_palette: {
    primary: 'grayscale',
    accent: 'discrete_blue',
    backgrounds: 'white_or_light_gray',
    avoid: ['gradients', 'bright_colors', 'decorative_elements'],
  },
  
  typography: {
    style: 'neutral',
    priority: 'readability_over_style',
    avoid: ['display_fonts', 'decorative_typography'],
  },
};

// =============================================================================
// 9. CLOSING STATEMENT
// =============================================================================

export const CLOSING_STATEMENT = {
  en: 'Transparency does not require agreement. Only a shared reference.',
  sv: 'Transparens kräver inte enighet. Endast en gemensam referens.',
};

// =============================================================================
// 10. PRESS KIT EFFECTIVENESS PRINCIPLES
// =============================================================================

export const PRESSKIT_PRINCIPLES = {
  why_this_works: {
    en: [
      'It is boring (in the right way)',
      'It gives nothing to misinterpret',
      'It offers no conflicts',
      'It makes the people behind it uninteresting',
      'It makes the system interesting as a reference',
    ],
    sv: [
      'Det är tråkigt (på rätt sätt)',
      'Det ger inget att feltolka',
      'Det erbjuder inga konflikter',
      'Det gör personerna bakom ointressanta',
      'Det gör systemet intressant som referens',
    ],
  },
};

// =============================================================================
// GENERATOR FUNCTION
// =============================================================================

export function generatePresskit(language: 'en' | 'sv' = 'en'): string {
  const isEn = language === 'en';
  
  const sections = [
    `# ${isEn ? 'PRESSKIT' : 'PRESSKIT'}`,
    '',
    `## ${isEn ? 'Global Reference Layer for Verified Public Data' : 'Globalt referenslager för verifierad offentlig data'}`,
    '',
    '*' + (isEn ? 'This is a content package – not marketing material' : 'Detta är ett innehållspaket – inte marknadsföringsmaterial') + '*',
    '',
    '---',
    '',
    `## ${isEn ? '1. Description' : '1. Beskrivning'}`,
    '',
    isEn ? PLATFORM_DESCRIPTION.en : PLATFORM_DESCRIPTION.sv,
    '',
    '---',
    '',
    `## ${isEn ? '2. Media Usage' : '2. Mediaanvändning'}`,
    '',
    `### ${isEn ? 'Allowed' : 'Tillåtet'}`,
    ...(isEn ? MEDIA_USAGE.allowed.en : MEDIA_USAGE.allowed.sv).map(item => `- ${item}`),
    '',
    `### ${isEn ? 'Not Recommended' : 'Ej rekommenderat'}`,
    ...(isEn ? MEDIA_USAGE.not_allowed.en : MEDIA_USAGE.not_allowed.sv).map(item => `- ${item}`),
    '',
    `**${isEn ? 'Standard citation' : 'Standardcitering'}:** "${isEn ? MEDIA_USAGE.standard_citation.en : MEDIA_USAGE.standard_citation.sv}"`,
    '',
    '---',
    '',
    `## ${isEn ? '3. Methodology' : '3. Metodik'}`,
    '',
    `### ${isEn ? 'Data Sources' : 'Datakällor'}`,
    ...METHODOLOGY.data_sources.categories.map(cat => 
      `- **${isEn ? cat.name_en : cat.name_sv}**: ${cat.examples.join(', ')}`
    ),
    '',
    `### ${isEn ? 'Principles' : 'Principer'}`,
    ...(isEn ? METHODOLOGY.principles.en : METHODOLOGY.principles.sv).map(p => `- ${p}`),
    '',
    `> ${isEn ? METHODOLOGY.publication_rule.en : METHODOLOGY.publication_rule.sv}`,
    '',
    '---',
    '',
    `## ${isEn ? '4. What This Is Not' : '4. Vad detta inte är'}`,
    '',
    `${isEn ? 'This is not' : 'Detta är inte'}:`,
    ...(isEn ? PLATFORM_NEGATION.is_not.en : PLATFORM_NEGATION.is_not.sv).map(item => `- ${item}`),
    '',
    `**${isEn ? 'This is' : 'Detta är'}:** ${isEn ? PLATFORM_NEGATION.is.en : PLATFORM_NEGATION.is.sv}`,
    '',
    '---',
    '',
    `## ${isEn ? '5. FAQ' : '5. Vanliga frågor'}`,
    '',
    ...PRESS_FAQ.map(faq => 
      `**${isEn ? faq.question_en : faq.question_sv}**\n${isEn ? faq.answer_en : faq.answer_sv}\n`
    ),
    '',
    '---',
    '',
    `## ${isEn ? '6. Contact' : '6. Kontakt'}`,
    '',
    isEn ? CONTACT_POLICY.statement_en : CONTACT_POLICY.statement_sv,
    '',
    `*${isEn ? CONTACT_POLICY.principle.en : CONTACT_POLICY.principle.sv}*`,
    '',
    '---',
    '',
    `## ${isEn ? '7. Visual Guidelines' : '7. Visuella riktlinjer'}`,
    '',
    `**${isEn ? 'Not permitted' : 'Ej tillåtet'}:** ${VISUAL_GUIDELINES.prohibited.join(', ')}`,
    '',
    `**${isEn ? 'Permitted' : 'Tillåtet'}:** ${VISUAL_GUIDELINES.permitted.join(', ')}`,
    '',
    '---',
    '',
    `> **${isEn ? CLOSING_STATEMENT.en : CLOSING_STATEMENT.sv}**`,
  ];
  
  return sections.join('\n');
}

// =============================================================================
// STRUCTURED EXPORT FOR API/JSON
// =============================================================================

export function getPresskitData(language: 'en' | 'sv' = 'en') {
  const isEn = language === 'en';
  
  return {
    description: isEn ? PLATFORM_DESCRIPTION.en : PLATFORM_DESCRIPTION.sv,
    media_usage: {
      allowed: isEn ? MEDIA_USAGE.allowed.en : MEDIA_USAGE.allowed.sv,
      not_allowed: isEn ? MEDIA_USAGE.not_allowed.en : MEDIA_USAGE.not_allowed.sv,
      standard_citation: isEn ? MEDIA_USAGE.standard_citation.en : MEDIA_USAGE.standard_citation.sv,
    },
    methodology: {
      sources: METHODOLOGY.data_sources.categories.map(cat => ({
        code: cat.code,
        name: isEn ? cat.name_en : cat.name_sv,
        examples: cat.examples,
      })),
      principles: isEn ? METHODOLOGY.principles.en : METHODOLOGY.principles.sv,
      publication_rule: isEn ? METHODOLOGY.publication_rule.en : METHODOLOGY.publication_rule.sv,
    },
    identity: {
      is_not: isEn ? PLATFORM_NEGATION.is_not.en : PLATFORM_NEGATION.is_not.sv,
      is: isEn ? PLATFORM_NEGATION.is.en : PLATFORM_NEGATION.is.sv,
    },
    faq: PRESS_FAQ.map(faq => ({
      code: faq.code,
      question: isEn ? faq.question_en : faq.question_sv,
      answer: isEn ? faq.answer_en : faq.answer_sv,
    })),
    contact: {
      statement: isEn ? CONTACT_POLICY.statement_en : CONTACT_POLICY.statement_sv,
      principle: isEn ? CONTACT_POLICY.principle.en : CONTACT_POLICY.principle.sv,
      channels: CONTACT_POLICY.available_channels.map(ch => ({
        type: ch.type,
        url: ch.url,
        description: isEn ? ch.description_en : ch.description_sv,
      })),
    },
    visual_guidelines: VISUAL_GUIDELINES,
    closing_statement: isEn ? CLOSING_STATEMENT.en : CLOSING_STATEMENT.sv,
  };
}
