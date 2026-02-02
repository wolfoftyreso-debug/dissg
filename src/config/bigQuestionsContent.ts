/**
 * 📝 BIG QUESTIONS LAYER - EXAKT COPY & CONTENT
 * 
 * All text för globala frågor, förklaringar, varningar och UI-element.
 * Strikt neutralt språk. Inga värdeladdade ord.
 */

// ============================================================
// MAIN QUESTIONS - FULL CONTENT
// ============================================================

export interface QuestionContent {
  readonly id: string;
  readonly title: {
    sv: string;
    en: string;
  };
  readonly subtitle: {
    sv: string;
    en: string;
  };
  readonly description: {
    sv: string;
    en: string;
  };
  readonly what_it_means: {
    sv: string;
    en: string;
  };
  readonly what_it_doesnt_mean: {
    sv: string;
    en: string;
  };
  readonly uncertainty_note: {
    sv: string;
    en: string;
  };
  readonly related_questions: readonly string[];
  readonly icon: string;
  readonly color: string;
}

export const QUESTION_CONTENT: readonly QuestionContent[] = [
  {
    id: 'structural_challenges',
    title: {
      sv: 'Vad är världens största strukturella utmaningar just nu?',
      en: 'What are the world\'s biggest structural challenges right now?',
    },
    subtitle: {
      sv: 'Långsiktiga mönster som påverkar miljarder människor',
      en: 'Long-term patterns affecting billions of people',
    },
    description: {
      sv: 'Denna vy sammanställer data om systemiska utmaningar som demografi, klimat, resursfördelning och geopolitisk stabilitet. Informationen kommer från internationella organisationer och vetenskapliga publikationer.',
      en: 'This view compiles data on systemic challenges such as demographics, climate, resource distribution, and geopolitical stability. The information comes from international organizations and scientific publications.',
    },
    what_it_means: {
      sv: 'Du ser en sammanställning av vad etablerade institutioner identifierar som strukturella utmaningar. Varje datapunkt kan spåras till sin ursprungskälla.',
      en: 'You see a compilation of what established institutions identify as structural challenges. Each data point can be traced to its original source.',
    },
    what_it_doesnt_mean: {
      sv: 'Detta är inte en prognos om framtiden. Det är inte en lista över "problem som måste lösas". Det är en beskrivning av observerade mönster.',
      en: 'This is not a forecast about the future. It is not a list of "problems that need to be solved." It is a description of observed patterns.',
    },
    uncertainty_note: {
      sv: 'Definitionen av "strukturell utmaning" varierar mellan källor. Vi visar var definitionerna skiljer sig.',
      en: 'The definition of "structural challenge" varies between sources. We show where definitions differ.',
    },
    related_questions: ['global_economy_reality', 'regional_impact'],
    icon: 'layers',
    color: 'blue',
  },
  {
    id: 'global_economy_reality',
    title: {
      sv: 'Hur ser den globala ekonomin faktiskt ut – bortom rubriker?',
      en: 'What does the global economy actually look like – beyond headlines?',
    },
    subtitle: {
      sv: 'Ekonomi som levnadsvillkor, inte som marknad',
      en: 'Economy as living conditions, not as market',
    },
    description: {
      sv: 'Ekonomisk data presenterad ur perspektivet: vad betyder detta för människors vardagsliv? Fokus på tillväxt, produktivitet, skuldsättning, fördelning och offentliga finanser.',
      en: 'Economic data presented from the perspective: what does this mean for people\'s everyday lives? Focus on growth, productivity, debt, distribution, and public finances.',
    },
    what_it_means: {
      sv: 'Du ser ekonomiska indikatorer översatta till vad de innebär för hushåll, arbetstagare och samhällen på olika nivåer.',
      en: 'You see economic indicators translated into what they mean for households, workers, and communities at different levels.',
    },
    what_it_doesnt_mean: {
      sv: 'Detta är inte investeringsrådgivning. Det är inte en bedömning av om ekonomin är "bra" eller "dålig". Det är en beskrivning av tillstånd.',
      en: 'This is not investment advice. It is not an assessment of whether the economy is "good" or "bad." It is a description of conditions.',
    },
    uncertainty_note: {
      sv: 'Ekonomiska data har ofta 1-3 månaders fördröjning. Reviderade siffror kan avvika från preliminära.',
      en: 'Economic data often has 1-3 months delay. Revised figures may differ from preliminary ones.',
    },
    related_questions: ['structural_challenges', 'ai_scaling_impact'],
    icon: 'trending-up',
    color: 'green',
  },
  {
    id: 'ai_scaling_impact',
    title: {
      sv: 'Vad händer med arbete, produktivitet och försörjning när AI skalar?',
      en: 'What happens to work, productivity, and livelihoods as AI scales?',
    },
    subtitle: {
      sv: 'Anpassning, inte skrämsel',
      en: 'Adaptation, not alarmism',
    },
    description: {
      sv: 'Historiska mönster för hur automatisering påverkat arbetsmarknader, vilka kompetenser som ersatts, förstärkts eller uppstått, och hur snabbt förändringen sker i olika regioner.',
      en: 'Historical patterns for how automation has affected labor markets, which competencies have been replaced, amplified, or emerged, and how fast change is happening in different regions.',
    },
    what_it_means: {
      sv: 'Du ser data om faktiska förändringar på arbetsmarknader, baserat på historik och nutid. Du ser skillnaden mellan teknisk möjlighet och faktisk implementering.',
      en: 'You see data on actual changes in labor markets, based on history and present. You see the difference between technical possibility and actual implementation.',
    },
    what_it_doesnt_mean: {
      sv: 'Vi säger aldrig "X% kommer att förlora jobbet". Vi visar istället: "I regioner med dessa egenskaper har denna typ av arbete minskat/ökat över tid."',
      en: 'We never say "X% will lose their jobs." Instead, we show: "In regions with these characteristics, this type of work has decreased/increased over time."',
    },
    uncertainty_note: {
      sv: 'Hastigheten på AI-adoption är osäker. Expertbedömningar varierar kraftigt. Vi visar spridningen.',
      en: 'The speed of AI adoption is uncertain. Expert assessments vary widely. We show the spread.',
    },
    related_questions: ['technological_transition', 'regional_impact'],
    icon: 'cpu',
    color: 'purple',
  },
  {
    id: 'regional_impact',
    title: {
      sv: 'Vilka grupper, regioner och kommuner påverkas mest – och varför?',
      en: 'Which groups, regions, and municipalities are most affected – and why?',
    },
    subtitle: {
      sv: 'Lokal verklighet i global kontext',
      en: 'Local reality in global context',
    },
    description: {
      sv: 'Drill-down från global nivå ner till enskild kommun. Samma fråga, samma semantik, men data anpassad för varje nivå.',
      en: 'Drill-down from global level down to individual municipality. Same question, same semantics, but data adapted for each level.',
    },
    what_it_means: {
      sv: 'Du ser hur globala trender manifesteras lokalt. Du kan jämföra din kommun med liknande kommuner, din region, eller landssnittet.',
      en: 'You see how global trends manifest locally. You can compare your municipality with similar municipalities, your region, or the national average.',
    },
    what_it_doesnt_mean: {
      sv: 'Detta är inte en ranking av "bästa" eller "sämsta" kommuner. Det är en beskrivning av observerade tillstånd med osäkerhetsmarginal.',
      en: 'This is not a ranking of "best" or "worst" municipalities. It is a description of observed conditions with uncertainty margin.',
    },
    uncertainty_note: {
      sv: 'Datakvalitet varierar kraftigt mellan kommuner. Vi visar alltid datatillgänglighet (Tier A-D) för transparens.',
      en: 'Data quality varies significantly between municipalities. We always show data availability (Tier A-D) for transparency.',
    },
    related_questions: ['structural_challenges', 'historical_interventions'],
    icon: 'map-pin',
    color: 'orange',
  },
  {
    id: 'historical_interventions',
    title: {
      sv: 'Vilka åtgärdstyper har historiskt haft störst effekt i liknande lägen?',
      en: 'Which types of interventions have historically had the greatest effect in similar situations?',
    },
    subtitle: {
      sv: 'Användaren drar slutsatsen själv',
      en: 'The user draws the conclusion themselves',
    },
    description: {
      sv: 'Historisk analys av åtgärdskategorier (utbildningsreformer, infrastruktur, social trygghet, lokal självförsörjning) – under vilka förutsättningar de fungerat och när de inte fungerat.',
      en: 'Historical analysis of intervention categories (education reforms, infrastructure, social security, local self-sufficiency) – under what conditions they have worked and when they have not.',
    },
    what_it_means: {
      sv: 'Du ser mönster från historien. "I sammanhang där X och Y var uppfyllda, sammanföll detta med förbättring i Z."',
      en: 'You see patterns from history. "In contexts where X and Y were met, this coincided with improvement in Z."',
    },
    what_it_doesnt_mean: {
      sv: 'Vi säger aldrig "gör så här". Vi ger inga policyrekommendationer. Vi visar vad som hänt och under vilka omständigheter.',
      en: 'We never say "do this." We give no policy recommendations. We show what happened and under what circumstances.',
    },
    uncertainty_note: {
      sv: 'Kausalitet är svår att fastställa i samhällsvetenskap. Vi visar korrelationer och sammanfall, inte bevisade orsakssamband.',
      en: 'Causality is difficult to establish in social science. We show correlations and coincidences, not proven causal relationships.',
    },
    related_questions: ['technological_transition', 'regional_impact'],
    icon: 'history',
    color: 'amber',
  },
  {
    id: 'technological_transition',
    title: {
      sv: 'Vad krävs för att teknisk omställning ska leda till ett bättre samhälle, inte ett hårdare?',
      en: 'What is required for technological transition to lead to a better society, not a harsher one?',
    },
    subtitle: {
      sv: 'Historiska paralleller och scenariointervall',
      en: 'Historical parallels and scenario intervals',
    },
    description: {
      sv: 'Jämförelse av tidigare teknologiska skiften (industrialisering, elektrifiering, digitalisering) och vad som sammanföll med positiva respektive negativa utfall för olika grupper.',
      en: 'Comparison of previous technological shifts (industrialization, electrification, digitization) and what coincided with positive versus negative outcomes for different groups.',
    },
    what_it_means: {
      sv: 'Du ser historiska mönster och vad olika institutioner bedömer om framtiden. Vi visar spridningen mellan optimistiska, neutrala och pessimistiska scenarier.',
      en: 'You see historical patterns and what various institutions assess about the future. We show the spread between optimistic, neutral, and pessimistic scenarios.',
    },
    what_it_doesnt_mean: {
      sv: 'Vi gör inga egna prognoser. Vi säger inte "detta kommer att hända". Vi visar vad världen tror och varför.',
      en: 'We make no predictions of our own. We do not say "this will happen." We show what the world believes and why.',
    },
    uncertainty_note: {
      sv: 'Framtiden är osäker per definition. Alla scenarier är spekulativa. Vi visar osäkerheten explicit.',
      en: 'The future is uncertain by definition. All scenarios are speculative. We show the uncertainty explicitly.',
    },
    related_questions: ['ai_scaling_impact', 'historical_interventions'],
    icon: 'sparkles',
    color: 'teal',
  },
] as const;

// ============================================================
// DRILL-DOWN LEVEL LABELS
// ============================================================

export const LEVEL_LABELS = {
  world: {
    sv: 'Världen',
    en: 'World',
  },
  continent: {
    sv: 'Kontinent',
    en: 'Continent',
  },
  country: {
    sv: 'Land',
    en: 'Country',
  },
  region: {
    sv: 'Region',
    en: 'Region',
  },
  municipality: {
    sv: 'Kommun',
    en: 'Municipality',
  },
} as const;

// ============================================================
// UI LABELS & MESSAGES
// ============================================================

export const UI_LABELS = {
  see_details: {
    sv: 'Visa detaljer',
    en: 'See details',
  },
  drill_down: {
    sv: 'Zooma in',
    en: 'Drill down',
  },
  drill_up: {
    sv: 'Zooma ut',
    en: 'Drill up',
  },
  compare: {
    sv: 'Jämför',
    en: 'Compare',
  },
  sources: {
    sv: 'Källor',
    en: 'Sources',
  },
  uncertainty: {
    sv: 'Osäkerhet',
    en: 'Uncertainty',
  },
  methodology: {
    sv: 'Metod',
    en: 'Methodology',
  },
  what_this_means: {
    sv: 'Vad detta betyder',
    en: 'What this means',
  },
  what_this_doesnt_mean: {
    sv: 'Vad detta inte betyder',
    en: 'What this doesn\'t mean',
  },
  data_quality: {
    sv: 'Datakvalitet',
    en: 'Data quality',
  },
  last_updated: {
    sv: 'Senast uppdaterad',
    en: 'Last updated',
  },
  create_mission: {
    sv: 'Skapa mission',
    en: 'Create mission',
  },
  follow_this: {
    sv: 'Följ denna',
    en: 'Follow this',
  },
  add_to_dashboard: {
    sv: 'Lägg till i dashboard',
    en: 'Add to dashboard',
  },
} as const;

// ============================================================
// WARNINGS & DISCLAIMERS
// ============================================================

export const WARNINGS = {
  no_forecast: {
    sv: 'Systemet gör inga egna prognoser. All framåtblickande information kommer från namngivna externa källor.',
    en: 'The system makes no forecasts of its own. All forward-looking information comes from named external sources.',
  },
  no_recommendations: {
    sv: 'Systemet ger inga policyrekommendationer. Du drar dina egna slutsatser.',
    en: 'The system gives no policy recommendations. You draw your own conclusions.',
  },
  correlation_not_causation: {
    sv: 'Samband i data innebär inte orsakssamband. Vi visar korrelationer, inte bevisad kausalitet.',
    en: 'Correlation in data does not imply causation. We show correlations, not proven causality.',
  },
  data_lag: {
    sv: 'Data har ofta 1-6 månaders fördröjning beroende på källa och typ.',
    en: 'Data often has 1-6 months lag depending on source and type.',
  },
  uncertainty_inherent: {
    sv: 'All data har osäkerhet. Vi visar den explicit istället för att dölja den.',
    en: 'All data has uncertainty. We show it explicitly instead of hiding it.',
  },
  tier_explanation: {
    sv: 'Datatäckning varierar. Tier A = full statistik, Tier D = minimal. Vi visar alltid vilken nivå som gäller.',
    en: 'Data coverage varies. Tier A = full statistics, Tier D = minimal. We always show which level applies.',
  },
} as const;

// ============================================================
// MISSIONS UI COPY
// ============================================================

export const MISSIONS_COPY = {
  title: {
    sv: 'Mina Missions',
    en: 'My Missions',
  },
  create_title: {
    sv: 'Skapa en ny Mission',
    en: 'Create a new Mission',
  },
  create_description: {
    sv: 'Definiera vad du vill följa och förbättra. Få uppdateringar när saker rör sig.',
    en: 'Define what you want to follow and improve. Get updates when things move.',
  },
  focus_type_label: {
    sv: 'Vad vill du fokusera på?',
    en: 'What do you want to focus on?',
  },
  focus_municipality: {
    sv: 'Min kommun',
    en: 'My municipality',
  },
  focus_region: {
    sv: 'Min region',
    en: 'My region',
  },
  focus_country: {
    sv: 'Mitt land',
    en: 'My country',
  },
  focus_topic: {
    sv: 'Ett ämne',
    en: 'A topic',
  },
  topic_examples: {
    sv: 'T.ex. arbete, utbildning, hälsa, klimat',
    en: 'E.g. work, education, health, climate',
  },
  direction_improving: {
    sv: 'Rör sig i positiv riktning',
    en: 'Moving in positive direction',
  },
  direction_declining: {
    sv: 'Rör sig i negativ riktning',
    en: 'Moving in negative direction',
  },
  direction_stable: {
    sv: 'Stabilt',
    en: 'Stable',
  },
  direction_unclear: {
    sv: 'Oklart',
    en: 'Unclear',
  },
  no_missions: {
    sv: 'Du har inga aktiva missions än. Skapa din första för att börja följa utvecklingen.',
    en: 'You have no active missions yet. Create your first to start following the development.',
  },
  requires_pro: {
    sv: 'Missions kräver ett Pro-konto. Uppgradera för att spara och följa.',
    en: 'Missions require a Pro account. Upgrade to save and follow.',
  },
  principle: {
    sv: 'Ansvar utan skuld.',
    en: 'Responsibility without blame.',
  },
} as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getQuestionContent(id: string): QuestionContent | undefined {
  return QUESTION_CONTENT.find(q => q.id === id);
}

export function getTranslation(
  content: { sv: string; en: string },
  language: 'sv' | 'en'
): string {
  return content[language] || content.en;
}

export function getAllQuestions(language: 'sv' | 'en') {
  return QUESTION_CONTENT.map(q => ({
    id: q.id,
    title: getTranslation(q.title, language),
    subtitle: getTranslation(q.subtitle, language),
    icon: q.icon,
    color: q.color,
  }));
}
