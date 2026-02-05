 /**
  * SYSTEMISK UTVECKLINGSPLAN
  * 
  * Baserad på analys av nuläge 2026-02-05
  * 
  * Identifierade områden prioriterade efter:
  * 1. Kritisk infrastruktur & säkerhet
  * 2. SEO/AI-dominans (maskinläsbarhet)
  * 3. Pedagogik & UX
  * 4. Beslutsstöd
  * 5. Palantir-crusher (avancerad analys)
  */
 
 export interface DevelopmentPriority {
   id: number;
   code: string;
   name: string;
   description: string;
   phase: 1 | 2 | 3 | 4 | 5;
   status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
   dependencies: number[];
   estimatedWeeks: number;
   businessImpact: 'critical' | 'high' | 'medium' | 'low';
   technicalComplexity: 'high' | 'medium' | 'low';
   currentState: string;
   targetState: string;
   actionItems: string[];
   metrics: string[];
 }
 
 // =============================================================================
 // NULÄGESANALYS (2026-02-05)
 // =============================================================================
 
 export const CURRENT_STATE_ANALYSIS = {
   strengths: [
     '90+ sidor implementerade',
     '100+ komponenter',
     '200+ config-filer med robust typsystem',
     '43 edge functions för backend-logik',
     'Omfattande databas med 70+ tabeller',
     'Global geografisk täckning (195+ länder)',
     'Lambda-systemet för balansmått',
     'AI-grounding-infrastruktur påbörjad',
   ],
   weaknesses: [
     'RLS-policies saknas på vissa tabeller',
     'SECURITY DEFINER views identifierade',
     'Funktioner saknar search_path',
     'Fragmenterad navigation (90+ routes)',
     'Inkonsekvent mobil-UX',
     'Schema.org JSON-LD ofullständig',
     'Sitemap ofullständig för SEO',
     'AI-cite endpoints ej fullt integrerade',
   ],
   securityFindings: {
     critical: 1, // SECURITY DEFINER view
     warnings: 41, // RLS och search_path
     info: 1, // RLS enabled no policy
   },
   coverage: {
     pages: 90,
     components: 100,
     edgeFunctions: 43,
     databaseTables: 70,
   },
 };
 
 // =============================================================================
 // FAS 1 (Vecka 1-2): GRUNDLÄGGANDE INFRASTRUKTUR
 // =============================================================================
 
 export const PHASE_1_PRIORITIES: DevelopmentPriority[] = [
   {
     id: 1,
     code: 'SEC-FIX',
     name: 'Säkerhetsåtgärder',
     description: 'Åtgärda alla identifierade säkerhetsproblem i databasen',
     phase: 1,
     status: 'not_started',
     dependencies: [],
     estimatedWeeks: 1,
     businessImpact: 'critical',
     technicalComplexity: 'medium',
     currentState: '41 linter-varningar, 1 kritiskt fel (SECURITY DEFINER), permissiva RLS-policies',
     targetState: 'Noll säkerhetsvarningar, alla funktioner med search_path, restriktiva RLS',
     actionItems: [
       'Åtgärda SECURITY DEFINER views',
       'Lägg till search_path på alla funktioner',
       'Ersätt USING (true) med korrekta villkor',
       'Lägg till saknade RLS-policies',
       'Granska profiles-tabellens exponering',
     ],
     metrics: ['0 säkerhetsvarningar', 'Alla tabeller har RLS', 'Alla funktioner har search_path'],
   },
   {
     id: 6,
     code: 'NAV-STRUCT',
     name: 'Navigationsstruktur',
     description: 'Konsolidera 90+ routes till en navigerbar hierarki',
     phase: 1,
     status: 'not_started',
     dependencies: [],
     estimatedWeeks: 1,
     businessImpact: 'high',
     technicalComplexity: 'medium',
     currentState: '90+ fragmenterade routes, inkonsekvent sidebar',
     targetState: 'Max 20 primära routes med tydlig hierarki',
     actionItems: [
       'Gruppera sidor i domäner (Data, Analys, Verktyg, System)',
       'Implementera breadcrumb-navigation',
       'Skapa konsekvent sidebar med collapse-grupper',
       'Ta bort eller konsolidera demo-sidor',
     ],
     metrics: ['<20 primära menypunkter', 'Max 3 klick till valfri sida', '100% breadcrumb-täckning'],
   },
   {
     id: 11,
     code: 'MOBILE-UX',
     name: 'Mobil-först UX',
     description: 'Säkerställ konsekvent mobil-upplevelse på alla sidor',
     phase: 1,
     status: 'not_started',
     dependencies: [6],
     estimatedWeeks: 1,
     businessImpact: 'high',
     technicalComplexity: 'low',
     currentState: 'Inkonsekvent mobil-layout, overflow-problem, touch-targets för små',
     targetState: 'Alla sidor responsiva, touch-targets ≥44px, ingen horisontell scroll',
     actionItems: [
       'Audit alla sidor på mobil viewport',
       'Fixa overflow och scroll-problem',
       'Öka touch-targets till ≥44px',
       'Testa på 320px, 375px, 768px breakpoints',
     ],
     metrics: ['0 horisontell scroll', 'Touch-targets ≥44px', 'LCP <2.5s på mobil'],
   },
 ];
 
 // =============================================================================
 // FAS 2 (Vecka 3-4): SEO/AI-DOMINANS
 // =============================================================================
 
 export const PHASE_2_PRIORITIES: DevelopmentPriority[] = [
   {
     id: 2,
     code: 'JSONLD',
     name: 'Schema.org JSON-LD',
     description: 'Fullständig maskinläsbar metadata på alla sidor',
     phase: 2,
     status: 'not_started',
     dependencies: [1],
     estimatedWeeks: 1,
     businessImpact: 'critical',
     technicalComplexity: 'medium',
     currentState: 'Partiell JSON-LD, saknar Dataset, Organization, WebApplication',
     targetState: 'Komplett Schema.org på varje sida, indexerbar av AI-agenter',
     actionItems: [
       'Implementera Organization på alla sidor',
       'Lägg till Dataset för varje datakälla',
       'WebApplication för verktyg',
       'BreadcrumbList för navigation',
       'FAQPage för help-sidor',
     ],
     metrics: ['100% sidor med JSON-LD', 'Validerar i Rich Results Test', 'AI-grounding score >90%'],
   },
   {
     id: 3,
     code: 'CITE-API',
     name: 'Cite API Completion',
     description: 'Fullt fungerande /cite/{type}/{code} endpoints',
     phase: 2,
     status: 'not_started',
     dependencies: [2],
     estimatedWeeks: 1,
     businessImpact: 'critical',
     technicalComplexity: 'high',
     currentState: 'Edge function exists men ofullständig integration',
     targetState: 'Alla entiteter citerbara via immutabla länkar med SHA-256 verification',
     actionItems: [
       'Komplettera cite edge function',
       'Lägg till /cite/country/{code}',
       'Lägg till /cite/indicator/{code}',
       'Implementera /cite/fact/{hash}',
       'QR-kod-generering för verification',
     ],
     metrics: ['100% entiteter citerbara', 'SHA-256 verification', 'QR-kod på varje fact'],
   },
   {
     id: 4,
     code: 'SITEMAP-SEO',
     name: 'Sitemap & SEO Optimization',
     description: 'Komplett sitemap och meta-optimization',
     phase: 2,
     status: 'not_started',
     dependencies: [2],
     estimatedWeeks: 0.5,
     businessImpact: 'high',
     technicalComplexity: 'low',
     currentState: 'Sitemap edge function finns men genererar ej alla sidor',
     targetState: 'Dynamisk sitemap med alla 90+ sidor, <60 char titles, <160 char descriptions',
     actionItems: [
       'Uppdatera sitemap edge function',
       'Lägg till alla publika sidor',
       'Optimera meta-titles',
       'Optimera meta-descriptions',
       'Canonical URLs på alla sidor',
     ],
     metrics: ['100% sidor i sitemap', 'Google Search Console indexering', 'Core Web Vitals pass'],
   },
 ];
 
 // =============================================================================
 // FAS 3 (Vecka 5-6): PEDAGOGIK
 // =============================================================================
 
 export const PHASE_3_PRIORITIES: DevelopmentPriority[] = [
   {
     id: 7,
     code: 'EXPLAIN-ENGINE',
     name: 'Explain Engine Enhancement',
     description: 'Interaktiv AI-driven förklaringsmotor på alla datapunkter',
     phase: 3,
     status: 'not_started',
     dependencies: [1, 6],
     estimatedWeeks: 1,
     businessImpact: 'high',
     technicalComplexity: 'high',
     currentState: 'ExplainEngine.tsx finns men ej integrerad överallt',
     targetState: 'Varje indikator och datapunkt har AI-förklaring on-demand',
     actionItems: [
       'Integrera ExplainEngine i alla indicator-views',
       'Lägg till context-aware förklaringar',
       'Implementera "Auditor Voice" konsekvent',
       'Cache förklaringar i database',
     ],
     metrics: ['100% indikatorer med förklaring', 'Svarstid <2s', 'User satisfaction >4/5'],
   },
   {
     id: 8,
     code: 'DEPTH-LAYER',
     name: '5-Layer Truth Depth',
     description: 'Komplett 5-lagers djupdykning (Observation→Data→Source)',
     phase: 3,
     status: 'not_started',
     dependencies: [7],
     estimatedWeeks: 1,
     businessImpact: 'high',
     technicalComplexity: 'medium',
     currentState: 'Partiell implementation, ej konsekvent',
     targetState: 'Varje datapunkt har 5 klickbara lager enligt Spotless-protokollet',
     actionItems: [
       'Standardisera depth-navigation',
       'Implementera L0-L4 på alla indikatorer',
       'Lägg till "Limitations" på varje nivå',
       'Assumption Exposer på varje vy',
     ],
     metrics: ['100% indikatorer med 5 lager', 'Inga dead-ends', 'Source traceability'],
   },
   {
     id: 9,
     code: 'ONBOARD-FLOW',
     name: 'Onboarding Flow',
     description: 'Guidad onboarding för nya användare',
     phase: 3,
     status: 'not_started',
     dependencies: [6, 8],
     estimatedWeeks: 0.5,
     businessImpact: 'medium',
     technicalComplexity: 'low',
     currentState: 'OnboardingPage finns men ej integrerad som default-flow',
     targetState: '15-sekunders snapshot, progressiv fördjupning',
     actionItems: [
       'Trigger onboarding för nya användare',
       'Implementera progressive disclosure',
       'Lägg till "quick wins" efter onboarding',
       'Track completion rate',
     ],
     metrics: ['Onboarding completion >70%', 'Time-to-value <60s', 'Return rate >50%'],
   },
   {
     id: 10,
     code: 'HELP-SYSTEM',
     name: 'Kontextuell hjälp',
     description: 'In-context help och tooltips överallt',
     phase: 3,
     status: 'not_started',
     dependencies: [7],
     estimatedWeeks: 0.5,
     businessImpact: 'medium',
     technicalComplexity: 'low',
     currentState: 'Help-sida finns men ingen kontextuell hjälp',
     targetState: 'Varje komplex komponent har inline-hjälp',
     actionItems: [
       'Lägg till info-tooltips på alla index',
       'Implementera "What this shows" på charts',
       'Lägg till "Limitations" på alla metrics',
       'FAQ-sektion per domän',
     ],
     metrics: ['100% charts med hjälp', 'Support tickets -50%', 'User satisfaction +20%'],
   },
 ];
 
 // =============================================================================
 // FAS 4 (Vecka 7-8): BESLUTSSTÖD
 // =============================================================================
 
 export const PHASE_4_PRIORITIES: DevelopmentPriority[] = [
   {
     id: 12,
     code: 'DECISION-LINK',
     name: 'Decision-Outcome Linking',
     description: 'Automatisk koppling mellan beslut och utfall',
     phase: 4,
     status: 'not_started',
     dependencies: [1, 7],
     estimatedWeeks: 1,
     businessImpact: 'critical',
     technicalComplexity: 'high',
     currentState: 'DecisionTimeline finns, men ingen automatisk outcome-tracking',
     targetState: 'Varje policy-beslut spåras mot KPI-utfall',
     actionItems: [
       'Implementera decision_outcomes tracking',
       'Lägg till attribution_score beräkning',
       'Visualisera decision→outcome correlation',
       'Flagga inconsistencies automatiskt',
     ],
     metrics: ['100% beslut med outcome-tracking', 'Attribution score på varje', 'Inconsistency alerts'],
   },
   {
     id: 13,
     code: 'ALERT-SYSTEM',
     name: 'KPI Alert System',
     description: 'Automatiska varningar vid kritiska avvikelser',
     phase: 4,
     status: 'not_started',
     dependencies: [12],
     estimatedWeeks: 1,
     businessImpact: 'high',
     technicalComplexity: 'medium',
     currentState: 'kpi-alerts edge function finns men ej integrerad i UI',
     targetState: 'Real-time notifications vid threshold breaches',
     actionItems: [
       'Integrera kpi-alerts med notification system',
       'Implementera threshold-konfiguration per KPI',
       'Lägg till email/push notifications',
       'Dashboard widget för aktiva alerts',
     ],
     metrics: ['Alert latency <5 min', 'False positive rate <10%', 'User engagement +30%'],
   },
   {
     id: 14,
     code: 'SCENARIO-LAB',
     name: 'Scenario Lab Enhancement',
     description: 'What-if simuleringar för policy-beslut',
     phase: 4,
     status: 'not_started',
     dependencies: [12],
     estimatedWeeks: 1,
     businessImpact: 'high',
     technicalComplexity: 'high',
     currentState: 'ScenarioDemo finns men begränsad funktionalitet',
     targetState: 'Fullständig scenario-motor med historisk validering',
     actionItems: [
       'Utöka scenarioLabConfig',
       'Implementera multi-variable scenarios',
       'Lägg till historisk backtesting',
       'Confidence intervals på predictions',
     ],
     metrics: ['10+ scenario-typer', 'Backtesting accuracy >80%', 'User engagement'],
   },
   {
     id: 15,
     code: 'REPORT-GEN',
     name: 'Automated Report Generation',
     description: 'Automatisk generering av sammanfattande rapporter',
     phase: 4,
     status: 'not_started',
     dependencies: [7, 12],
     estimatedWeeks: 1,
     businessImpact: 'medium',
     technicalComplexity: 'medium',
     currentState: 'Export-funktionalitet finns men ingen automatisk rapportgenerering',
     targetState: 'Schemalagda rapporter med AI-sammanfattningar',
     actionItems: [
       'Implementera report templates',
       'AI-genererade sammanfattningar',
       'PDF/Excel export',
       'Schemaläggning (daglig/veckovis)',
     ],
     metrics: ['5+ report-typer', 'Export completion >95%', 'Time saved >2h/vecka'],
   },
 ];
 
 // =============================================================================
 // FAS 5 (Vecka 9-12): PALANTIR-CRUSHER
 // =============================================================================
 
 export const PHASE_5_PRIORITIES: DevelopmentPriority[] = [
   {
     id: 16,
     code: 'CAUSAL-CHAIN',
     name: 'Causal Chain Discovery',
     description: 'Automatisk identifiering av kausala kedjor',
     phase: 5,
     status: 'not_started',
     dependencies: [12, 13],
     estimatedWeeks: 2,
     businessImpact: 'critical',
     technicalComplexity: 'high',
     currentState: 'causal_chains tabell finns men ingen AI-driven discovery',
     targetState: 'AI identifierar och validerar kausala kedjor automatiskt',
     actionItems: [
       'Implementera causal discovery algorithm',
       'Integrera med AI-observation edge function',
       'Visualisera causal graphs',
       'Confidence scoring på varje länk',
     ],
     metrics: ['Discovered chains >100', 'Validation accuracy >70%', 'User trust score'],
   },
   {
     id: 17,
     code: 'CROSS-DOMAIN',
     name: 'Cross-Domain Intelligence',
     description: 'Identifiera samband mellan domäner (hälsa↔ekonomi↔utbildning)',
     phase: 5,
     status: 'not_started',
     dependencies: [16],
     estimatedWeeks: 2,
     businessImpact: 'high',
     technicalComplexity: 'high',
     currentState: 'crossDomainConfig finns men ej implementerad',
     targetState: 'Automatisk cross-domain correlation discovery',
     actionItems: [
       'Implementera cross-domain correlation engine',
       'Visualisera inter-domain relationships',
       'Alert på unexpected correlations',
       'Historical pattern matching',
     ],
     metrics: ['Cross-domain insights >50', 'User engagement +40%', 'Discovery rate'],
   },
   {
     id: 18,
     code: 'PREDICT-ENGINE',
     name: 'Predictive Analytics',
     description: 'Forecasting med confidence intervals',
     phase: 5,
     status: 'not_started',
     dependencies: [16, 17],
     estimatedWeeks: 2,
     businessImpact: 'critical',
     technicalComplexity: 'high',
     currentState: 'kpi-forecast edge function finns men begränsad',
     targetState: 'Multi-scenario forecasting med real-time streaming',
     actionItems: [
       'Utöka forecasting models',
       'Implementera ensemble predictions',
       'Confidence interval visualization',
       'Backtest validation',
     ],
     metrics: ['Forecast accuracy >75%', 'MAPE <15%', 'User adoption >50%'],
   },
   {
     id: 19,
     code: 'ANOMALY-DETECT',
     name: 'Anomaly Detection',
     description: 'Automatisk identifiering av avvikelser och mönsterbrott',
     phase: 5,
     status: 'not_started',
     dependencies: [16],
     estimatedWeeks: 1,
     businessImpact: 'high',
     technicalComplexity: 'medium',
     currentState: 'deviationSignalSystem config finns men ej aktiv',
     targetState: 'Real-time anomaly detection på alla KPIs',
     actionItems: [
       'Implementera statistical anomaly detection',
       'ML-baserad pattern recognition',
       'Alert integration',
       'Historical anomaly archive',
     ],
     metrics: ['Detection latency <1h', 'False positive rate <5%', 'Anomalies caught >90%'],
   },
   {
     id: 20,
     code: 'SELF-LEARN',
     name: 'Self-Learning System',
     description: 'Systemet lär sig från användning och förbättras automatiskt',
     phase: 5,
     status: 'not_started',
     dependencies: [16, 17, 18, 19],
     estimatedWeeks: 2,
     businessImpact: 'critical',
     technicalComplexity: 'high',
     currentState: 'selfLearningCoreConfig finns men ej aktiverad',
     targetState: 'Kontinuerlig förbättring baserat på data och feedback',
     actionItems: [
       'Implementera learning loop',
       'Automatic model retraining',
       'User feedback integration',
       'A/B testing framework',
     ],
     metrics: ['Weekly improvement rate', 'Model accuracy over time', 'User satisfaction trend'],
   },
 ];
 
 // =============================================================================
 // AGGREGERAD PLAN
 // =============================================================================
 
 export const ALL_PRIORITIES: DevelopmentPriority[] = [
   ...PHASE_1_PRIORITIES,
   ...PHASE_2_PRIORITIES,
   ...PHASE_3_PRIORITIES,
   ...PHASE_4_PRIORITIES,
   ...PHASE_5_PRIORITIES,
 ];
 
 export const PHASE_SUMMARY = {
   phase1: {
     name: 'Grundläggande infrastruktur',
     weeks: '1-2',
     focus: 'Säkerhet, Navigation, Mobil-UX',
     ids: [1, 6, 11],
     estimatedEffort: '3 veckor',
   },
   phase2: {
     name: 'SEO/AI-dominans',
     weeks: '3-4',
     focus: 'JSON-LD, Cite API, Sitemap',
     ids: [2, 3, 4],
     estimatedEffort: '2.5 veckor',
   },
   phase3: {
     name: 'Pedagogik',
     weeks: '5-6',
     focus: 'Explain Engine, Depth Layers, Onboarding, Help',
     ids: [7, 8, 9, 10],
     estimatedEffort: '3 veckor',
   },
   phase4: {
     name: 'Beslutsstöd',
     weeks: '7-8',
     focus: 'Decision Linking, Alerts, Scenarios, Reports',
     ids: [12, 13, 14, 15],
     estimatedEffort: '4 veckor',
   },
   phase5: {
     name: 'Palantir-crusher',
     weeks: '9-12',
     focus: 'Causal Chains, Cross-Domain, Prediction, Anomaly, Self-Learning',
     ids: [16, 17, 18, 19, 20],
     estimatedEffort: '9 veckor',
   },
 };
 
 // =============================================================================
 // FAS 1 DETALJERAT GENOMFÖRANDE
 // =============================================================================
 
 export const PHASE_1_EXECUTION_PLAN = {
   week1: {
     day1_2: {
       task: 'Säkerhetsåtgärder - Databas',
       actions: [
         'Identifiera alla SECURITY DEFINER views',
         'Migrera till SECURITY INVOKER eller skapa wrapper-funktioner',
         'Lägg till search_path på alla funktioner',
       ],
     },
     day3_4: {
       task: 'Säkerhetsåtgärder - RLS',
       actions: [
         'Ersätt USING (true) på INSERT/UPDATE/DELETE',
         'Lägg till saknade RLS-policies',
         'Granska profiles-tabellens exponering',
       ],
     },
     day5: {
       task: 'Navigationsstruktur - Analys',
       actions: [
         'Kategorisera alla 90+ routes',
         'Definiera domänhierarki',
         'Skapa ny sidbar-struktur',
       ],
     },
   },
   week2: {
     day1_2: {
       task: 'Navigationsstruktur - Implementation',
       actions: [
         'Implementera ny sidebar med collapse-grupper',
         'Lägg till breadcrumb på alla sidor',
         'Konsolidera/ta bort demo-sidor',
       ],
     },
     day3_4: {
       task: 'Mobil-UX',
       actions: [
         'Audit alla sidor på 375px viewport',
         'Fixa overflow och scroll-problem',
         'Öka touch-targets',
       ],
     },
     day5: {
       task: 'Fas 1 QA',
       actions: [
         'Kör säkerhetsscan igen',
         'Verifiera navigation fungerar',
         'Mobil-test på riktiga enheter',
       ],
     },
   },
 };