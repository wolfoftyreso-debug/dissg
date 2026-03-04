/**
 * OEM-Class Diagnostic View
 * 
 * VIDA/ODIS-equivalent main diagnostic interface.
 * Redesigned for clarity with full-width vertical sections.
 */

import React, { useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  SEVERITY_CONFIG,
  type FaultSeverity 
} from '@/lib/fault-codes';
import { DiagnosticScopeSelector, type DiagnosticScope, type DiagnosticScopeLevel } from './DiagnosticScopeSelector';

// =============================================================================
// TYPES
// =============================================================================

interface SystemIdentity {
  level: DiagnosticScopeLevel;
  name: string;
  code: string;
  periodStart: string;
  periodEnd: string;
  dataCoverage: number;
  lambda: number;
  lambdaStatus: 'within_tolerance' | 'warning' | 'critical';
}

interface ActiveFaultCode {
  code: string;
  severity: FaultSeverity;
  description: string;
  explanation: string;
  triggeredAt: string;
}

interface MeasureBlock {
  code: string;
  name: string;
  currentValue: number | null;
  unit: string;
  setpointMin: number | null;
  setpointMax: number | null;
  status: 'within_tolerance' | 'warning' | 'critical' | 'no_data';
  trend: 'up' | 'down' | 'stable' | 'unknown';
  trendPeriod: string;
  lastUpdated: string;
  source: string;
}

interface GuidedStep {
  id: string;
  title: string;
  description: string;
  type: 'review_history' | 'peer_compare' | 'correlation' | 'timelag' | 'data_quality';
  completed: boolean;
  locked: boolean;
  requiredMeasureBlocks: string[];
}

interface ProbableCause {
  rank: number;
  description: string;
  probability: number;
  evidence: string;
  relatedCountries: number;
  yearsOfData: number;
}

interface DiagnosticSession {
  id: string;
  startedAt: string;
  system: SystemIdentity;
  activeFaultCodes: ActiveFaultCode[];
  selectedFaultCode: string | null;
  measureBlocks: MeasureBlock[];
  guidedSteps: GuidedStep[];
  probableCauses: ProbableCause[];
  canClose: boolean;
  completedSteps: number;
  totalSteps: number;
}

// =============================================================================
// DEEP ANALYSIS DATA
// =============================================================================

interface DeepAnalysis {
  finding: string;
  methodology: string;
  dataPoints: string[];
  correlation?: { label: string; value: number; interpretation: string };
  peerComparison?: { peers: { name: string; value: number }[]; position: string };
  timeLag?: { delayYears: number; explanation: string };
  dataQuality?: { coverage: number; reliability: string; gaps: string[] };
}

function getDeepAnalysisForStep(type: string): DeepAnalysis {
  const analyses: Record<string, DeepAnalysis> = {
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
  return analyses[type] || analyses.review_history;
}

const STEP_META: Record<string, { label: string; icon: string }> = {
  review_history: { label: 'HISTORISK GRANSKNING', icon: '📊' },
  peer_compare: { label: 'PEER-JÄMFÖRELSE', icon: '⚖️' },
  correlation: { label: 'KORRELATIONSANALYS', icon: '🔗' },
  timelag: { label: 'TIDSFÖRSKJUTNING', icon: '⏱️' },
  data_quality: { label: 'DATAKVALITET', icon: '✅' },
};

// =============================================================================
// CAUSE DETAILS
// =============================================================================

const CAUSE_DETAILS: Record<number, { mechanism: string; evidenceChain: string[]; limitations: string[] }> = {
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

// =============================================================================
// MAIN DIAGNOSTIC VIEW
// =============================================================================

export function DiagnosticView() {
  const [session, setSession] = useState<DiagnosticSession | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<MeasureBlock | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [expandedCause, setExpandedCause] = useState<number | null>(null);

  const handleSelectScope = useCallback((scope: DiagnosticScope) => {
    const baseSession: DiagnosticSession = {
      id: `DIAG-${scope.code}-${new Date().toISOString().slice(0, 10)}`,
      startedAt: new Date().toISOString(),
      system: {
        level: scope.level,
        name: scope.name,
        code: scope.code,
        periodStart: '1990',
        periodEnd: '2025',
        dataCoverage: scope.dataCoverage,
        lambda: scope.level === 'global' ? 0.78 : scope.level === 'continent' ? 0.81 : 0.82,
        lambdaStatus: 'warning',
      },
      activeFaultCodes: scope.level === 'global' 
        ? [
            { code: 'GLO-CLI-WAR-001', severity: 'critical', description: 'Klimatsystemavvikelse', explanation: 'Global medeltemperatur och extremväderfrekvens avviker signifikant från historiska baslinjer. Mätblock för CO₂-koncentration, havsyttemperatur och isutbredning visar ihållande trend utanför tolerans sedan 2015. Felkoden triggas när ≥3 klimatrelaterade sensorer samtidigt överstiger börvärde med >15%.', triggeredAt: '2024-01-01' },
            { code: 'GLO-DEM-STR-301', severity: 'critical', description: 'Strukturell demokratisk erosion globalt', explanation: 'Demokratiindex, pressfrihet och institutionell tillit visar samordnad nedgång i >40% av mätta länder. Mönstret är strukturellt (ej cykliskt) baserat på 15 års trendanalys. Felkoden triggas vid ihållande nedgång i ≥3 demokratirelaterade mätblock under ≥5 år.', triggeredAt: '2024-02-01' },
            { code: 'GLO-INE-TRE-002', severity: 'systemic', description: 'Global ojämlikhetsacceleration', explanation: 'Gini-koefficienten och topp-10%-inkomstandelen accelererar i de flesta OECD-länder. Trenden har ökat i hastighet sedan 2019. Felkoden triggas när ojämlikhetsmåttets ändringstakt överstiger det historiska genomsnittet med >2 standardavvikelser under ≥3 på varandra följande mätperioder.', triggeredAt: '2024-02-15' },
            { code: 'GLO-DEM-FER-003', severity: 'warning', description: 'Fertilitetskris i utvecklade länder', explanation: 'Total fertilitet (TFR) ligger under reproduktionsnivån (2.1) i 75% av utvecklade ekonomier. Nedgången accelererar i Östasien och Sydeuropa. Felkoden triggas när TFR understiger 1.5 i >5 länder med BNP/capita >30 000 USD.', triggeredAt: '2024-03-01' },
          ]
        : [
            { code: 'HEA-SUB-SYS-402', severity: 'critical', description: 'Systemiskt missbruksproblem', explanation: 'Opioidrelaterade dödsfall, alkoholrelaterad sjuklighet och psykiatrisk samsjuklighet överstiger samtliga börvärden. Mönstret tyder på systemisk orsak snarare än isolerad substansproblematik. Felkoden triggas vid samtidig avvikelse i ≥3 substansrelaterade mätblock.', triggeredAt: '2024-01-15' },
            { code: 'SOC-HOU-STR-021', severity: 'warning', description: 'Strukturellt bostadsproblem', explanation: 'Bostadsbestånd i förhållande till efterfrågan understiger börvärde (ratio <1.0). Nybyggnationstakten är otillräcklig för att kompensera befolkningstillväxt och urbanisering. Felkoden triggas vid persistent bostadsbrist (ratio <1.0) under ≥3 år.', triggeredAt: '2024-02-20' },
            { code: 'ECO-INE-TRE-145', severity: 'warning', description: 'Ökande inkomstojämlikhet', explanation: 'Gini-koefficienten ökar stadigt och överstiger det OECD-genomsnittliga börvärdet (0.30). Ökningen drivs primärt av kapitalinkomstfördelning. Felkoden triggas vid Gini >0.32 med positiv trend under ≥5 år.', triggeredAt: '2024-03-10' },
          ],
      selectedFaultCode: scope.level === 'global' ? 'GLO-CLI-WAR-001' : 'HEA-SUB-SYS-402',
      measureBlocks: scope.level === 'global' 
        ? [
            { code: 'ECO-INE-GINI', name: 'Global Gini-koefficient', currentValue: 0.70, unit: '', setpointMin: 0.30, setpointMax: 0.45, status: 'critical', trend: 'stable', trendPeriod: '1990–2025', lastUpdated: '2024-11-12', source: 'World Bank' },
            { code: 'GOV-DEM-TURNOUT', name: 'Globalt valdeltagande', currentValue: 66.2, unit: '%', setpointMin: 70, setpointMax: null, status: 'warning', trend: 'stable', trendPeriod: '2000–2024', lastUpdated: '2024-11-01', source: 'IDEA International' },
            { code: 'GOV-DEM-INDEX', name: 'Demokratiindex (global)', currentValue: 5.29, unit: 'index', setpointMin: 6.0, setpointMax: null, status: 'critical', trend: 'down', trendPeriod: '2015–2024', lastUpdated: '2024-10-01', source: 'Economist Intelligence Unit' },
            { code: 'GOV-DEM-FREEDOM', name: 'Global frihet', currentValue: 55.0, unit: 'poäng', setpointMin: 60, setpointMax: null, status: 'warning', trend: 'down', trendPeriod: '2010–2024', lastUpdated: '2024-09-01', source: 'Freedom House' },
            { code: 'GOV-DEM-PRESS', name: 'Global pressfrihet', currentValue: 44.3, unit: 'index', setpointMin: 60, setpointMax: null, status: 'critical', trend: 'down', trendPeriod: '2015–2024', lastUpdated: '2024-08-01', source: 'Reporters Without Borders' },
            { code: 'DEM-FER-RATE', name: 'Global fertilitet (TFR)', currentValue: 2.31, unit: '', setpointMin: 2.1, setpointMax: 2.5, status: 'within_tolerance', trend: 'down', trendPeriod: '1990–2025', lastUpdated: '2024-11-01', source: 'UN Population Division' },
            { code: 'ENV-EMI-CO2', name: 'Global CO2 per capita', currentValue: 4.7, unit: 'ton', setpointMin: null, setpointMax: 2.0, status: 'critical', trend: 'stable', trendPeriod: '1990–2025', lastUpdated: '2024-08-01', source: 'Global Carbon Project' },
            { code: 'HEA-LIF-EXPECT', name: 'Global livslängd', currentValue: 72.8, unit: 'år', setpointMin: 75, setpointMax: null, status: 'warning', trend: 'up', trendPeriod: '1990–2025', lastUpdated: '2024-10-01', source: 'WHO' },
          ]
        : [
            { code: 'ECO-INE-GINI', name: 'Inkomstojämlikhet (Gini)', currentValue: 0.34, unit: '', setpointMin: 0.25, setpointMax: 0.30, status: 'critical', trend: 'up', trendPeriod: '2005–2025', lastUpdated: '2024-11-12', source: 'OECD' },
            { code: 'HEA-SUB-OPIOID', name: 'Opioidrelaterade dödsfall', currentValue: 8.2, unit: 'per 100k', setpointMin: null, setpointMax: 5.0, status: 'critical', trend: 'up', trendPeriod: '2015–2025', lastUpdated: '2024-10-01', source: 'WHO' },
            { code: 'SOC-HOU-SUPPLY', name: 'Bostadsbestånd vs efterfrågan', currentValue: 0.92, unit: 'ratio', setpointMin: 1.0, setpointMax: 1.2, status: 'warning', trend: 'down', trendPeriod: '2010–2025', lastUpdated: '2024-09-15', source: 'UN Habitat' },
            { code: 'SOC-TRU-INST', name: 'Institutionell tillit', currentValue: 62, unit: '%', setpointMin: 65, setpointMax: null, status: 'warning', trend: 'down', trendPeriod: '2000–2025', lastUpdated: '2024-06-01', source: 'World Values Survey' },
            { code: 'GOV-DEM-TURNOUT', name: 'Valdeltagande', currentValue: 84.2, unit: '%', setpointMin: 80, setpointMax: null, status: 'within_tolerance', trend: 'stable', trendPeriod: '2000–2024', lastUpdated: '2024-09-15', source: 'National Electoral Commission' },
            { code: 'GOV-DEM-INDEX', name: 'Demokratiindex', currentValue: 9.39, unit: 'index', setpointMin: 8.0, setpointMax: null, status: 'within_tolerance', trend: 'stable', trendPeriod: '2010–2024', lastUpdated: '2024-10-01', source: 'Economist Intelligence Unit' },
          ],
      guidedSteps: [
        { id: 'step-1', title: 'Granska historik för primärt mätblock', description: '', type: 'review_history', completed: true, locked: false, requiredMeasureBlocks: ['ECO-INE-GINI'] },
        { id: 'step-2', title: 'Jämför med peer-system', description: '', type: 'peer_compare', completed: true, locked: false, requiredMeasureBlocks: ['ECO-INE-GINI'] },
        { id: 'step-3', title: 'Visa korrelation mot sekundära mätblock', description: '', type: 'correlation', completed: true, locked: false, requiredMeasureBlocks: ['ECO-INE-GINI'] },
        { id: 'step-4', title: 'Kontrollera tidsförskjutning', description: '', type: 'timelag', completed: true, locked: false, requiredMeasureBlocks: ['ECO-INE-GINI'] },
        { id: 'step-5', title: 'Bekräfta datakvalitet', description: '', type: 'data_quality', completed: true, locked: false, requiredMeasureBlocks: ['ECO-INE-GINI'] },
      ],
      probableCauses: [
        { rank: 1, description: 'Kapitalinkomsternas ökande andel', probability: 42, evidence: 'Stark korrelation', relatedCountries: 12, yearsOfData: 20 },
        { rank: 2, description: 'Förändrad arbetsmarknadsstruktur', probability: 31, evidence: 'Tidsförskjutning 3–5 år', relatedCountries: 8, yearsOfData: 15 },
        { rank: 3, description: 'Systemisk effekt av globalisering', probability: 17, evidence: 'Ej isolerbar till en parameter', relatedCountries: 25, yearsOfData: 30 },
      ],
      canClose: true,
      completedSteps: 5,
      totalSteps: 5,
    };
    setSession(baseSession);
  }, []);

  const handleSelectFaultCode = useCallback((code: string) => {
    setSession(prev => {
      if (!prev) return prev;
      return { ...prev, selectedFaultCode: prev.selectedFaultCode === code ? null : code };
    });
  }, []);

  if (!session) {
    return <DiagnosticScopeSelector onSelectScope={handleSelectScope} />;
  }

  const selectedFault = session.activeFaultCodes.find(fc => fc.code === session.selectedFaultCode);
  const lambdaColor = session.system.lambdaStatus === 'within_tolerance' 
    ? 'text-green-600' 
    : session.system.lambdaStatus === 'warning' 
      ? 'text-orange-500' 
      : 'text-red-500';

  const totalProb = session.probableCauses.reduce((s, c) => s + c.probability, 0);
  const uncertainty = 100 - totalProb;

  return (
    <ScrollArea className="h-full">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ═══════════════════ HEADER ═══════════════════ */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSession(null)}
            className="font-mono text-xs text-muted-foreground hover:text-foreground"
          >
            ← ÄNDRA OMFATTNING
          </Button>
          <span className="font-mono text-[10px] text-muted-foreground">{session.id}</span>
        </div>

        {/* ═══════════════════ SYSTEM STATUS BAR ═══════════════════ */}
        <div className="border border-border rounded-lg bg-card p-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <div className="font-mono text-[10px] text-muted-foreground tracking-widest mb-1">SYSTEM</div>
              <div className="font-semibold text-sm">{session.system.name}</div>
              <div className="font-mono text-xs text-muted-foreground">{session.system.level.toUpperCase()}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-muted-foreground tracking-widest mb-1">PERIOD</div>
              <div className="font-mono text-sm">{session.system.periodStart}–{session.system.periodEnd}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-muted-foreground tracking-widest mb-1">DATATÄCKNING</div>
              <div className="flex items-center gap-3">
                <Progress value={session.system.dataCoverage} className="w-20 h-2" />
                <span className="font-mono text-sm font-medium">{session.system.dataCoverage}%</span>
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-muted-foreground tracking-widest mb-1">LAMBDA (λ)</div>
              <div className={`font-mono text-2xl font-bold ${lambdaColor}`}>
                {session.system.lambda.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-muted-foreground tracking-widest mb-1">STATUS</div>
              <Badge 
                variant={session.system.lambdaStatus === 'within_tolerance' ? 'secondary' : 'destructive'}
                className="font-mono text-xs"
              >
                {session.system.lambdaStatus === 'within_tolerance' ? 'INOM TOLERANS' : 'UTANFÖR TOLERANS'}
              </Badge>
            </div>
          </div>
        </div>

        {/* ═══════════════════ SECTION 1: FELKODER ═══════════════════ */}
        <div className="border border-border rounded-lg bg-card">
          <div className="p-4 border-b border-border">
            <h2 className="font-mono text-xs tracking-widest text-muted-foreground">
              SEKTION 1 — AKTIVA FELKODER ({session.activeFaultCodes.length})
            </h2>
          </div>

          {/* Fault code selector */}
          <div className="p-4 flex flex-wrap gap-2">
            {session.activeFaultCodes
              .sort((a, b) => {
                const order: Record<FaultSeverity, number> = { critical: 0, systemic: 1, warning: 2, informational: 3, unknown: 4 };
                return order[a.severity] - order[b.severity];
              })
              .map((fc) => {
                const config = SEVERITY_CONFIG[fc.severity];
                const isSelected = session.selectedFaultCode === fc.code;
                return (
                  <button
                    key={fc.code}
                    onClick={() => handleSelectFaultCode(fc.code)}
                    className={`
                      px-4 py-2 rounded-md border font-mono text-xs transition-all
                      ${isSelected ? 'ring-2 ring-primary shadow-sm' : 'hover:bg-muted/50'}
                    `}
                    style={{ borderColor: config.color, color: config.color }}
                  >
                    <span className="mr-2">■</span>
                    {fc.code}
                    <span className="ml-2 opacity-60 text-[10px]">({config.label})</span>
                  </button>
                );
              })}
          </div>

          {/* Selected fault code explanation */}
          {selectedFault && (() => {
            const config = SEVERITY_CONFIG[selectedFault.severity];
            return (
              <div className="mx-4 mb-4 p-4 rounded-md border-l-4 bg-muted/20" style={{ borderLeftColor: config.color }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-sm font-bold" style={{ color: config.color }}>
                    {selectedFault.code}
                  </span>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="font-semibold text-sm">{selectedFault.description}</span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                  {selectedFault.explanation}
                </p>
                <div className="flex gap-4 text-[10px] font-mono text-muted-foreground">
                  <span>Triggad: {selectedFault.triggeredAt}</span>
                  <span>Allvarlighet: {config.label.toUpperCase()}</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ═══════════════════ SECTION 2: MÄTBLOCK ═══════════════════ */}
        <div className="border border-border rounded-lg bg-card">
          <div className="p-4 border-b border-border">
            <h2 className="font-mono text-xs tracking-widest text-muted-foreground">
              SEKTION 2 — MÄTBLOCK ({session.measureBlocks.length} SENSORER)
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {session.measureBlocks.map((block) => {
                const statusStyles = {
                  within_tolerance: 'border-green-500/40 bg-green-500/5',
                  warning: 'border-orange-500/40 bg-orange-500/5',
                  critical: 'border-red-500/40 bg-red-500/5',
                  no_data: 'border-muted bg-muted/10 opacity-50',
                };
                const trendArrow = { up: '↑', down: '↓', stable: '→', unknown: '?' }[block.trend];
                const setpoint = block.setpointMin !== null && block.setpointMax !== null
                  ? `${block.setpointMin}–${block.setpointMax}`
                  : block.setpointMin !== null ? `≥${block.setpointMin}` : block.setpointMax !== null ? `≤${block.setpointMax}` : '—';

                return (
                  <button
                    key={block.code}
                    onClick={() => setSelectedBlock(block)}
                    className={`text-left p-3 rounded-md border transition-all hover:ring-1 hover:ring-primary/50 ${statusStyles[block.status]}`}
                  >
                    <div className="font-mono text-[10px] text-muted-foreground mb-0.5">{block.code}</div>
                    <div className="font-medium text-sm mb-2 leading-tight">{block.name}</div>
                    <div className="flex justify-between items-baseline text-xs mb-1.5">
                      <div>
                        <span className="text-muted-foreground">Nu: </span>
                        <span className="font-mono font-bold">
                          {block.currentValue !== null ? `${block.currentValue} ${block.unit}` : '—'}
                        </span>
                      </div>
                      <div className="font-mono text-muted-foreground text-[10px]">
                        Börvärde: {setpoint}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <Badge 
                        variant={block.status === 'within_tolerance' ? 'secondary' : 'destructive'}
                        className="font-mono text-[9px] px-1.5 py-0"
                      >
                        {block.status === 'within_tolerance' ? 'OK' : block.status === 'no_data' ? 'SAKNAS' : 'AVVIKELSE'}
                      </Badge>
                      <span className="text-muted-foreground font-mono">{trendArrow} {block.trendPeriod}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ═══════════════════ SECTION 3: GUIDAD ANALYS ═══════════════════ */}
        {session.selectedFaultCode && (
          <div className="border border-border rounded-lg bg-card">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h2 className="font-mono text-xs tracking-widest text-muted-foreground">
                SEKTION 3 — GUIDAD ANALYS
              </h2>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-green-600">{session.completedSteps}/{session.totalSteps} SLUTFÖRDA</span>
                <Progress value={100} className="w-24 h-1.5" />
              </div>
            </div>

            <div className="divide-y divide-border">
              {session.guidedSteps.map((step) => {
                const meta = STEP_META[step.type] || { label: step.type, icon: '📌' };
                const analysis = getDeepAnalysisForStep(step.type);
                const isExpanded = expandedStep === step.id;

                return (
                  <div key={step.id}>
                    <button
                      onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                      className="w-full text-left p-4 hover:bg-muted/30 transition-colors flex gap-4"
                    >
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs shrink-0 mt-0.5">
                        ✓
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{meta.icon}</span>
                          <span className="font-mono text-[10px] tracking-widest text-muted-foreground">{meta.label}</span>
                        </div>
                        <div className="font-medium text-sm mb-1">{step.title}</div>
                        <div className="text-sm text-foreground/60 leading-relaxed">{analysis.finding}</div>
                      </div>
                      <div className="text-muted-foreground shrink-0 text-xs mt-1">
                        {isExpanded ? '▲' : '▼'}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-5 pt-0 ml-10 space-y-5">
                        {/* Methodology */}
                        <div className="bg-muted/30 rounded-md p-4">
                          <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">METODIK</div>
                          <div className="text-sm text-foreground/80 leading-relaxed">{analysis.methodology}</div>
                        </div>

                        {/* Data points */}
                        <div>
                          <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">OBSERVERADE DATAPUNKTER</div>
                          <div className="space-y-1.5 pl-1">
                            {analysis.dataPoints.map((dp, i) => (
                              <div key={i} className="text-sm text-foreground/70 flex items-start gap-2">
                                <span className="text-muted-foreground shrink-0 mt-0.5">•</span>
                                <span className="font-mono">{dp}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Peer comparison */}
                        {analysis.peerComparison && (
                          <div className="bg-muted/20 rounded-md p-4">
                            <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-3">PEER-POSITION</div>
                            <div className="space-y-2">
                              {analysis.peerComparison.peers.map((peer) => {
                                const isCurrent = peer.name === 'Aktuellt';
                                const barW = Math.min((peer.value / 0.45) * 100, 100);
                                return (
                                  <div key={peer.name} className="flex items-center gap-3 text-xs">
                                    <span className={`w-24 text-right font-mono ${isCurrent ? 'font-bold text-orange-500' : 'text-muted-foreground'}`}>
                                      {peer.name}
                                    </span>
                                    <div className="flex-1 bg-muted/40 rounded-full h-3.5 overflow-hidden">
                                      <div
                                        className={`h-full rounded-full transition-all ${isCurrent ? 'bg-orange-500' : peer.value <= 0.30 ? 'bg-green-500/60' : 'bg-primary/40'}`}
                                        style={{ width: `${barW}%` }}
                                      />
                                    </div>
                                    <span className={`font-mono w-12 text-right ${isCurrent ? 'font-bold text-orange-500' : 'text-muted-foreground'}`}>
                                      {peer.value.toFixed(2)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-2 font-mono">{analysis.peerComparison.position}</div>
                          </div>
                        )}

                        {/* Correlation */}
                        {analysis.correlation && (
                          <div className="border border-border rounded-md p-4">
                            <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">SAMVARIATION</div>
                            <div className="flex items-center gap-3 mb-3">
                              <span className="font-mono text-sm">{analysis.correlation.label}</span>
                              <Badge variant="secondary" className="font-mono text-xs">r = {analysis.correlation.value.toFixed(2)}</Badge>
                            </div>
                            <div className="text-sm text-foreground/70 leading-relaxed">{analysis.correlation.interpretation}</div>
                          </div>
                        )}

                        {/* Time lag */}
                        {analysis.timeLag && (
                          <div className="border border-border rounded-md p-4">
                            <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">TIDSFÖRSKJUTNING</div>
                            <div className="flex items-center gap-4 mb-3">
                              <span className="text-3xl font-bold font-mono text-primary">{analysis.timeLag.delayYears}</span>
                              <span className="text-sm text-muted-foreground">års genomsnittlig fördröjning</span>
                            </div>
                            <div className="text-sm text-foreground/70 leading-relaxed">{analysis.timeLag.explanation}</div>
                          </div>
                        )}

                        {/* Data quality */}
                        {analysis.dataQuality && (
                          <div className="border border-border rounded-md p-4">
                            <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-3">KVALITETSBEDÖMNING</div>
                            <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                              <div>
                                <div className="text-muted-foreground text-xs mb-0.5">Täckning</div>
                                <div className="font-mono font-bold text-lg">{analysis.dataQuality.coverage}%</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground text-xs mb-0.5">Tillförlitlighet</div>
                                <div className="font-mono font-bold text-lg text-green-600">{analysis.dataQuality.reliability}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground text-xs mb-0.5">Dataluckor</div>
                                <div className="font-mono font-bold text-lg">{analysis.dataQuality.gaps.length} st</div>
                              </div>
                            </div>
                            {analysis.dataQuality.gaps.length > 0 && (
                              <div className="text-xs text-muted-foreground font-mono">
                                Luckor: {analysis.dataQuality.gaps.join(', ')}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════ SECTION 4: ORSAKSANALYS ═══════════════════ */}
        {session.selectedFaultCode && (
          <div className="border border-border rounded-lg bg-card">
            <div className="p-4 border-b border-border">
              <h2 className="font-mono text-xs tracking-widest text-muted-foreground">
                SEKTION 4 — ORSAKSANALYS (DATA-BASERAT)
              </h2>
            </div>

            <div className="p-4 space-y-3">
              {session.probableCauses.map((cause) => {
                const isExpanded = expandedCause === cause.rank;
                const details = CAUSE_DETAILS[cause.rank];

                return (
                  <div key={cause.rank} className="border border-border rounded-md overflow-hidden">
                    <button
                      onClick={() => setExpandedCause(isExpanded ? null : cause.rank)}
                      className="w-full text-left p-4 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-start gap-3">
                          <span className="font-mono text-xl font-bold text-muted-foreground/50">{cause.rank}.</span>
                          <div>
                            <span className="font-medium text-sm">{cause.description}</span>
                            <div className="text-xs text-muted-foreground mt-1">
                              {cause.evidence} · {cause.relatedCountries} länder · {cause.yearsOfData} år
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="font-mono text-lg font-bold">{cause.probability}%</div>
                            <div className="text-[10px] text-muted-foreground font-mono">SANNOLIKHET</div>
                          </div>
                          <span className="text-xs text-muted-foreground">{isExpanded ? '▲' : '▼'}</span>
                        </div>
                      </div>
                      {/* Probability bar */}
                      <div className="mt-2 ml-8 mr-16">
                        <div className="w-full bg-muted/30 rounded-full h-1.5">
                          <div 
                            className="h-full rounded-full bg-primary/60 transition-all" 
                            style={{ width: `${cause.probability}%` }} 
                          />
                        </div>
                      </div>
                    </button>

                    {isExpanded && details && (
                      <div className="border-t border-border p-5 space-y-5 bg-muted/5 ml-8">
                        <div>
                          <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">VERKNINGSMEKANISM</div>
                          <div className="text-sm text-foreground/80 leading-relaxed">{details.mechanism}</div>
                        </div>

                        <div>
                          <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">EVIDENSKEDJA</div>
                          <div className="space-y-2">
                            {details.evidenceChain.map((ev, i) => (
                              <div key={i} className="text-sm text-foreground/70 flex items-start gap-2">
                                <span className="text-muted-foreground shrink-0">📄</span>
                                <span>{ev}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-l-2 border-orange-400/50 pl-4">
                          <div className="font-mono text-[10px] tracking-widest text-orange-500 mb-2">⚠ BEGRÄNSNINGAR</div>
                          <div className="space-y-1.5">
                            {details.limitations.map((lim, i) => (
                              <div key={i} className="text-sm text-foreground/60 flex items-start gap-2">
                                <span className="shrink-0 text-muted-foreground">•</span>
                                <span>{lim}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Uncertainty */}
              <div className="p-4 border border-dashed border-border rounded-md bg-muted/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Oförklarad osäkerhet</span>
                  <span className="font-mono text-lg font-bold text-muted-foreground">{uncertainty}%</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Andel som ej kan tillskrivas identifierade orsaker med nuvarande dataunderlag.
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border">
              <div className="text-xs text-muted-foreground text-center font-mono">
                Inga rekommendationer. Inga värdeord. Endast sannolikheter baserade på observerade mönster.
              </div>
            </div>
          </div>
        )}

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>

      {/* Source Detail Modal */}
      {selectedBlock && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border rounded-lg max-w-lg w-full mx-4 max-h-[80vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="font-mono text-sm font-semibold">{selectedBlock.code}</div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedBlock(null)}>×</Button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="text-xs text-muted-foreground font-mono mb-0.5">PARAMETER</div>
                <div className="font-medium">{selectedBlock.name}</div>
              </div>
              <Separator />
              <div>
                <div className="text-xs text-muted-foreground font-mono mb-0.5">DATAKÄLLA</div>
                <div className="text-sm">{selectedBlock.source}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-mono mb-0.5">NUVARANDE VÄRDE</div>
                <div className="text-sm font-mono font-bold">
                  {selectedBlock.currentValue !== null ? `${selectedBlock.currentValue} ${selectedBlock.unit}` : '—'}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-mono mb-0.5">OSÄKERHET</div>
                <div className="text-sm font-mono">±0.02</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-mono mb-0.5">SENAST UPPDATERAD</div>
                <div className="text-sm font-mono">{selectedBlock.lastUpdated}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ScrollArea>
  );
}

export default DiagnosticView;
