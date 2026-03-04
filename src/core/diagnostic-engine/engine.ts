/**
 * DIAGNOSTIC ENGINE
 * 
 * Pure logic module for diagnostic sessions.
 * No UI dependencies. Can be used by API/agents directly.
 */

import type {
  DiagnosticScope,
  DiagnosticSession,
  DiagnosticResult,
  CauseDetails,
  ActiveFaultCode,
  MeasureBlock,
  GuidedStep,
  ProbableCause,
  DeepAnalysis,
} from './types';
import {
  generateSessionId,
  computeUncertainty,
  rankCauses,
  computeLambda,
  determineLambdaStatus,
} from './utils';

// =============================================================================
// STATIC DATA (will be replaced by DB queries)
// =============================================================================

const GLOBAL_FAULT_CODES: ActiveFaultCode[] = [
  { code: 'GLO-CLI-WAR-001', severity: 'critical', description: 'Klimatsystemavvikelse', explanation: 'Global medeltemperatur och extremväderfrekvens avviker signifikant från historiska baslinjer. Mätblock för CO₂-koncentration, havsyttemperatur och isutbredning visar ihållande trend utanför tolerans sedan 2015. Felkoden triggas när ≥3 klimatrelaterade sensorer samtidigt överstiger börvärde med >15%.', triggeredAt: '2024-01-01' },
  { code: 'GLO-DEM-STR-301', severity: 'critical', description: 'Strukturell demokratisk erosion globalt', explanation: 'Demokratiindex, pressfrihet och institutionell tillit visar samordnad nedgång i >40% av mätta länder. Mönstret är strukturellt (ej cykliskt) baserat på 15 års trendanalys. Felkoden triggas vid ihållande nedgång i ≥3 demokratirelaterade mätblock under ≥5 år.', triggeredAt: '2024-02-01' },
  { code: 'GLO-INE-TRE-002', severity: 'systemic', description: 'Global ojämlikhetsacceleration', explanation: 'Gini-koefficienten och topp-10%-inkomstandelen accelererar i de flesta OECD-länder. Trenden har ökat i hastighet sedan 2019. Felkoden triggas när ojämlikhetsmåttets ändringstakt överstiger det historiska genomsnittet med >2 standardavvikelser under ≥3 på varandra följande mätperioder.', triggeredAt: '2024-02-15' },
  { code: 'GLO-DEM-FER-003', severity: 'warning', description: 'Fertilitetskris i utvecklade länder', explanation: 'Total fertilitet (TFR) ligger under reproduktionsnivån (2.1) i 75% av utvecklade ekonomier. Nedgången accelererar i Östasien och Sydeuropa. Felkoden triggas när TFR understiger 1.5 i >5 länder med BNP/capita >30 000 USD.', triggeredAt: '2024-03-01' },
];

const COUNTRY_FAULT_CODES: ActiveFaultCode[] = [
  { code: 'HEA-SUB-SYS-402', severity: 'critical', description: 'Systemiskt missbruksproblem', explanation: 'Opioidrelaterade dödsfall, alkoholrelaterad sjuklighet och psykiatrisk samsjuklighet överstiger samtliga börvärden. Mönstret tyder på systemisk orsak snarare än isolerad substansproblematik. Felkoden triggas vid samtidig avvikelse i ≥3 substansrelaterade mätblock.', triggeredAt: '2024-01-15' },
  { code: 'SOC-HOU-STR-021', severity: 'warning', description: 'Strukturellt bostadsproblem', explanation: 'Bostadsbestånd i förhållande till efterfrågan understiger börvärde (ratio <1.0). Nybyggnationstakten är otillräcklig för att kompensera befolkningstillväxt och urbanisering. Felkoden triggas vid persistent bostadsbrist (ratio <1.0) under ≥3 år.', triggeredAt: '2024-02-20' },
  { code: 'ECO-INE-TRE-145', severity: 'warning', description: 'Ökande inkomstojämlikhet', explanation: 'Gini-koefficienten ökar stadigt och överstiger det OECD-genomsnittliga börvärdet (0.30). Ökningen drivs primärt av kapitalinkomstfördelning. Felkoden triggas vid Gini >0.32 med positiv trend under ≥5 år.', triggeredAt: '2024-03-10' },
];

const GLOBAL_MEASURES: MeasureBlock[] = [
  { code: 'ECO-INE-GINI', name: 'Global Gini-koefficient', currentValue: 0.70, unit: '', setpointMin: 0.30, setpointMax: 0.45, status: 'critical', trend: 'stable', trendPeriod: '1990–2025', lastUpdated: '2024-11-12', source: 'World Bank' },
  { code: 'GOV-DEM-TURNOUT', name: 'Globalt valdeltagande', currentValue: 66.2, unit: '%', setpointMin: 70, setpointMax: null, status: 'warning', trend: 'stable', trendPeriod: '2000–2024', lastUpdated: '2024-11-01', source: 'IDEA International' },
  { code: 'GOV-DEM-INDEX', name: 'Demokratiindex (global)', currentValue: 5.29, unit: 'index', setpointMin: 6.0, setpointMax: null, status: 'critical', trend: 'down', trendPeriod: '2015–2024', lastUpdated: '2024-10-01', source: 'Economist Intelligence Unit' },
  { code: 'GOV-DEM-FREEDOM', name: 'Global frihet', currentValue: 55.0, unit: 'poäng', setpointMin: 60, setpointMax: null, status: 'warning', trend: 'down', trendPeriod: '2010–2024', lastUpdated: '2024-09-01', source: 'Freedom House' },
  { code: 'GOV-DEM-PRESS', name: 'Global pressfrihet', currentValue: 44.3, unit: 'index', setpointMin: 60, setpointMax: null, status: 'critical', trend: 'down', trendPeriod: '2015–2024', lastUpdated: '2024-08-01', source: 'Reporters Without Borders' },
  { code: 'DEM-FER-RATE', name: 'Global fertilitet (TFR)', currentValue: 2.31, unit: '', setpointMin: 2.1, setpointMax: 2.5, status: 'within_tolerance', trend: 'down', trendPeriod: '1990–2025', lastUpdated: '2024-11-01', source: 'UN Population Division' },
  { code: 'ENV-EMI-CO2', name: 'Global CO2 per capita', currentValue: 4.7, unit: 'ton', setpointMin: null, setpointMax: 2.0, status: 'critical', trend: 'stable', trendPeriod: '1990–2025', lastUpdated: '2024-08-01', source: 'Global Carbon Project' },
  { code: 'HEA-LIF-EXPECT', name: 'Global livslängd', currentValue: 72.8, unit: 'år', setpointMin: 75, setpointMax: null, status: 'warning', trend: 'up', trendPeriod: '1990–2025', lastUpdated: '2024-10-01', source: 'WHO' },
];

const COUNTRY_MEASURES: MeasureBlock[] = [
  { code: 'ECO-INE-GINI', name: 'Inkomstojämlikhet (Gini)', currentValue: 0.34, unit: '', setpointMin: 0.25, setpointMax: 0.30, status: 'critical', trend: 'up', trendPeriod: '2005–2025', lastUpdated: '2024-11-12', source: 'OECD' },
  { code: 'HEA-SUB-OPIOID', name: 'Opioidrelaterade dödsfall', currentValue: 8.2, unit: 'per 100k', setpointMin: null, setpointMax: 5.0, status: 'critical', trend: 'up', trendPeriod: '2015–2025', lastUpdated: '2024-10-01', source: 'WHO' },
  { code: 'SOC-HOU-SUPPLY', name: 'Bostadsbestånd vs efterfrågan', currentValue: 0.92, unit: 'ratio', setpointMin: 1.0, setpointMax: 1.2, status: 'warning', trend: 'down', trendPeriod: '2010–2025', lastUpdated: '2024-09-15', source: 'UN Habitat' },
  { code: 'SOC-TRU-INST', name: 'Institutionell tillit', currentValue: 62, unit: '%', setpointMin: 65, setpointMax: null, status: 'warning', trend: 'down', trendPeriod: '2000–2025', lastUpdated: '2024-06-01', source: 'World Values Survey' },
  { code: 'GOV-DEM-TURNOUT', name: 'Valdeltagande', currentValue: 84.2, unit: '%', setpointMin: 80, setpointMax: null, status: 'within_tolerance', trend: 'stable', trendPeriod: '2000–2024', lastUpdated: '2024-09-15', source: 'National Electoral Commission' },
  { code: 'GOV-DEM-INDEX', name: 'Demokratiindex', currentValue: 9.39, unit: 'index', setpointMin: 8.0, setpointMax: null, status: 'within_tolerance', trend: 'stable', trendPeriod: '2010–2024', lastUpdated: '2024-10-01', source: 'Economist Intelligence Unit' },
];

const DEFAULT_GUIDED_STEPS: GuidedStep[] = [
  { id: 'step-1', title: 'Granska historik för primärt mätblock', description: '', type: 'review_history', completed: true, locked: false, requiredMeasureBlocks: ['ECO-INE-GINI'] },
  { id: 'step-2', title: 'Jämför med peer-system', description: '', type: 'peer_compare', completed: true, locked: false, requiredMeasureBlocks: ['ECO-INE-GINI'] },
  { id: 'step-3', title: 'Visa korrelation mot sekundära mätblock', description: '', type: 'correlation', completed: true, locked: false, requiredMeasureBlocks: ['ECO-INE-GINI'] },
  { id: 'step-4', title: 'Kontrollera tidsförskjutning', description: '', type: 'timelag', completed: true, locked: false, requiredMeasureBlocks: ['ECO-INE-GINI'] },
  { id: 'step-5', title: 'Bekräfta datakvalitet', description: '', type: 'data_quality', completed: true, locked: false, requiredMeasureBlocks: ['ECO-INE-GINI'] },
];

const DEFAULT_CAUSES: ProbableCause[] = [
  { rank: 1, description: 'Kapitalinkomsternas ökande andel', probability: 42, evidence: 'Stark korrelation', relatedCountries: 12, yearsOfData: 20 },
  { rank: 2, description: 'Förändrad arbetsmarknadsstruktur', probability: 31, evidence: 'Tidsförskjutning 3–5 år', relatedCountries: 8, yearsOfData: 15 },
  { rank: 3, description: 'Systemisk effekt av globalisering', probability: 17, evidence: 'Ej isolerbar till en parameter', relatedCountries: 25, yearsOfData: 30 },
];

const CAUSE_DETAILS_MAP: Record<number, CauseDetails> = {
  1: {
    mechanism: 'Sedan 1990-talet har kapitalinkomsternas andel av BNP ökat från ~25% till ~35% i de flesta OECD-länder. Denna förskjutning drivs av automatisering, globalisering av kapitalmarknader och fördelaktiga skattesystem för kapitalvinster jämfört med löneinkomster.',
    evidenceChain: [
      'Piketty & Saez (2003): Toppinkomstandelar har ökat stadigt sedan 1980',
      'IMF Working Paper (2017): Kapitalandelen korrelerar med ojämlikhet i 42 länder',
      'OECD (2021): Skattesystemens progressivitet har minskat i 28 av 38 länder',
    ],
    limitations: [
      'Kausalriktningen är ej entydig – ojämlikhet kan också driva kapitalkoncentration',
      'Mätningen av kapitalinkomster varierar mellan länder',
      'Skuggekonomins storlek påverkar datakvaliteten i vissa regioner',
    ],
  },
  2: {
    mechanism: 'Övergången från industri- till tjänste- och kunskapsekonomi har skapat en polariserad arbetsmarknad med hög efterfrågan på specialistkompetens och minskad efterfrågan på mellanskiktsjobb. Effekten visar sig med 3–5 års fördröjning efter strukturella förändringar.',
    evidenceChain: [
      'Autor (2015): "Job polarization" dokumenterad i USA och EU sedan 1990',
      'ILO (2019): Mellanskiktsjobb minskat med 15% i utvecklade ekonomier',
      'OECD (2022): Utbildningspremien har ökat 40% på 20 år',
    ],
    limitations: [
      'Teknologisk förändring samverkar med globalisering – svårt att isolera',
      'Effekten varierar kraftigt beroende på nationell arbetsmarknadspolitik',
    ],
  },
  3: {
    mechanism: 'Globaliseringen har ökat den totala produktiviteten men fördelat vinsterna ojämnt. Kapitalägare och högt kvalificerade arbetstagare har gynnats oproportionerligt, medan lågkvalificerade arbetsmarknader utsatts för konkurrens från lågkostnadsländer.',
    evidenceChain: [
      'Milanovic (2016): "Elephant curve" visar globala inkomstförändringar',
      'WTO (2018): Handelsintegration korrelerar med ökad nationell ojämlikhet',
      'World Bank (2020): Global fattigdom minskat men nationell ojämlikhet ökat',
    ],
    limitations: [
      'Globaliseringens effekter är multidimensionella och ej isolerbara till en variabel',
      'Olika mätmetoder ger olika resultat beroende på tidsperiod och geografi',
      'Systemisk effekt – ingen enskild policy kan adressera samtliga kanaler',
    ],
  },
};

const DEEP_ANALYSES: Record<string, DeepAnalysis> = {
  review_history: {
    finding: 'Primärt mätblock visar en ihållande trend utanför tolerans sedan 2015. Avvikelsen accelererade efter 2019 med en genomsnittlig ökningstakt på 0.8% per år.',
    methodology: 'Linjär regression (OLS) med säsongskorrigering. Konfidensintervall: 95%. Breakpoint-analys identifierade strukturellt skift 2015–2016.',
    dataPoints: [
      '2010: Inom tolerans (börvärde ±5%)',
      '2015: Första avvikelsen registrerad (+7% över övre gräns)',
      '2019: Acceleration identifierad (trendlutning ökade 2.1x)',
      '2024: Nuvarande avvikelse: +23% över börvärde',
    ],
  },
  peer_compare: {
    finding: 'Systemet presterar sämre än 78% av jämförbara peer-system. Medianen bland peers ligger 15 procentenheter närmare börvärde.',
    methodology: 'Z-score-normalisering mot OECD-medianen. Peer-grupp: 15 system med liknande BNP/capita, befolkningstäthet och institutionell mognad.',
    dataPoints: [
      'Peer-median: 0.29 (inom tolerans)',
      'Aktuellt system: 0.34 (utanför tolerans)',
      'Bästa peer: 0.24 (Danmark)',
      'Sämsta peer: 0.39 (USA)',
    ],
    peerComparison: {
      peers: [
        { name: 'Danmark', value: 0.24 },
        { name: 'Norge', value: 0.27 },
        { name: 'Finland', value: 0.28 },
        { name: 'Peer-median', value: 0.29 },
        { name: 'Aktuellt', value: 0.34 },
        { name: 'UK', value: 0.35 },
        { name: 'USA', value: 0.39 },
      ],
      position: 'Under peer-median, rank 11 av 15',
    },
  },
  correlation: {
    finding: 'Stark samvariation identifierad med sekundärt mätblock SOC-POV-RATE (r = 0.82). Sambandet är stabilt över tid (10+ år) och geografi (12+ länder).',
    methodology: 'Pearson-korrelation med Granger-kausalitetstest. Kontrollerat för BNP/capita, urbaniseringsgrad och demografisk struktur. Placebo-test: 3 slumpmässiga variabler testade.',
    dataPoints: [
      'Korrelationskoefficient (r): 0.82',
      'p-värde: < 0.001',
      'Observerad i 12 av 15 peer-länder',
      'Stabil över perioden 2005–2024',
      'Placebo-test: Inga falska positiva',
    ],
    correlation: {
      label: 'ECO-INE-GINI ↔ SOC-POV-RATE',
      value: 0.82,
      interpretation: 'Stark positiv samvariation. När ojämlikheten ökar, ökar även fattigdomsindikatorn med en fördröjning på 2–3 år. Sambandet är konsistent men kausalitet kan ej fastställas enbart från data.',
    },
  },
  timelag: {
    finding: 'Tidsförskjutningsanalys visar att förändringar i primärt mätblock föregås av policyförändringar med 3–5 års fördröjning.',
    methodology: 'Cross-korrelation med variabel lag (0–10 år). Optimal lag identifierad genom maximal korrelation. Bootstrapping (n=1000) för konfidensintervall.',
    dataPoints: [
      'Optimal tidsförskjutning: 4 år (r = 0.87 vid lag 4)',
      'Konfidensintervall: 3–5 år (95% CI)',
      'Effekten avtar efter 7 år (r < 0.4)',
      'Reversed causality-test: Ej signifikant (p = 0.34)',
    ],
    timeLag: {
      delayYears: 4,
      explanation: 'Policyförändringar (t.ex. skattestruktur, arbetsmarknadsreglering) behöver i genomsnitt 4 år innan full effekt observeras i ojämlikhetsmåttet. Detta är konsistent med liknande analyser i peer-länder.',
    },
  },
  data_quality: {
    finding: 'Datakvaliteten bedöms som HÖG. Täckningsgrad 94%, tre oberoende källor bekräftar trenden. Inga signifikanta avbrott i tidsserien.',
    methodology: 'Triangulering mot tre oberoende källor (OECD, World Bank, nationell statistik). Saknade datapunkter: 2 av 35 år (interpolerade). Metodförändringar: 1 (2012, mindre påverkan).',
    dataPoints: [
      'Källtäckning: 94% (33 av 35 år)',
      'Oberoende bekräftelse: 3 av 3 källor',
      'Metodförändring 2012: Uppdaterad beräkningsmetod, retroaktivt korrigerad',
      'Senaste uppdatering: 2024-11-12',
    ],
    dataQuality: {
      coverage: 94,
      reliability: 'Hög',
      gaps: ['2003 (interpolerad)', '2007 (interpolerad)'],
    },
  },
};

// =============================================================================
// ENGINE CLASS
// =============================================================================

export class DiagnosticEngine {
  createSession(scope: DiagnosticScope): DiagnosticResult {
    const lambda = computeLambda(scope.level);
    const faultCodes = scope.level === 'global' ? GLOBAL_FAULT_CODES : COUNTRY_FAULT_CODES;
    const measures = scope.level === 'global' ? GLOBAL_MEASURES : COUNTRY_MEASURES;
    const causes = rankCauses(DEFAULT_CAUSES);

    const session: DiagnosticSession = {
      id: generateSessionId(scope.code),
      startedAt: new Date().toISOString(),
      system: {
        level: scope.level,
        name: scope.name,
        code: scope.code,
        periodStart: '1990',
        periodEnd: '2025',
        dataCoverage: scope.dataCoverage,
        lambda,
        lambdaStatus: determineLambdaStatus(lambda),
      },
      activeFaultCodes: faultCodes,
      selectedFaultCode: faultCodes[0]?.code ?? null,
      measureBlocks: measures,
      guidedSteps: DEFAULT_GUIDED_STEPS,
      probableCauses: causes,
      canClose: true,
      completedSteps: 5,
      totalSteps: 5,
    };

    return {
      session,
      uncertainty: computeUncertainty(causes),
      causeDetails: CAUSE_DETAILS_MAP,
    };
  }

  getDeepAnalysis(stepType: string): DeepAnalysis {
    return DEEP_ANALYSES[stepType] ?? DEEP_ANALYSES.review_history;
  }

  getCauseDetails(rank: number): CauseDetails | undefined {
    return CAUSE_DETAILS_MAP[rank];
  }
}

export function createDiagnosticEngine(): DiagnosticEngine {
  return new DiagnosticEngine();
}
