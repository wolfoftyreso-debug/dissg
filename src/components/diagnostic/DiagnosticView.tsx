/**
 * OEM-Class Diagnostic View
 * 
 * VIDA/ODIS-equivalent main diagnostic interface.
 * Fixed layout. No free navigation. Guided workflow.
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
// SYSTEM IDENTITY HEADER
// =============================================================================

function SystemIdentityHeader({ system }: { system: SystemIdentity }) {
  const lambdaColor = system.lambdaStatus === 'within_tolerance' 
    ? 'text-blue-500' 
    : system.lambdaStatus === 'warning' 
      ? 'text-orange-500' 
      : 'text-red-500';

  const levelLabels: Record<DiagnosticScopeLevel, string> = {
    global: 'GLOBAL',
    continent: 'VÄRLDSDEL',
    country: 'NATION',
    city: 'STAD',
  };

  return (
    <div className="bg-muted/30 border-b border-border p-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm font-mono">
        <div>
          <div className="text-muted-foreground text-xs">SYSTEM</div>
          <div className="font-semibold">{levelLabels[system.level]}: {system.name}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">PERIOD</div>
          <div>{system.periodStart}–{system.periodEnd}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">DATATÄCKNING</div>
          <div className="flex items-center gap-2">
            <Progress value={system.dataCoverage} className="w-16 h-2" />
            <span>{system.dataCoverage}%</span>
          </div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">LAMBDA</div>
          <div className={`font-bold ${lambdaColor}`}>
            {system.lambda.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">STATUS</div>
          <Badge 
            variant={system.lambdaStatus === 'within_tolerance' ? 'secondary' : 'destructive'}
            className="font-mono text-xs"
          >
            {system.lambdaStatus === 'within_tolerance' ? 'INOM TOLERANS' : 'UTANFÖR TOLERANS'}
          </Badge>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// FAULT CODE PANEL
// =============================================================================

interface FaultCodePanelProps {
  faultCodes: ActiveFaultCode[];
  selectedCode: string | null;
  onSelectCode: (code: string) => void;
}

function FaultCodePanel({ faultCodes, selectedCode, onSelectCode }: FaultCodePanelProps) {
  const sortedCodes = [...faultCodes].sort((a, b) => {
    const severityOrder: Record<FaultSeverity, number> = {
      critical: 0, systemic: 1, warning: 2, informational: 3, unknown: 4
    };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return (
    <div className="border-b border-border p-4">
      <div className="text-xs font-mono text-muted-foreground mb-2">AKTIVA FELKODER</div>
      <div className="flex flex-wrap gap-2">
        {sortedCodes.length === 0 ? (
          <span className="text-sm text-muted-foreground">Inga aktiva felkoder</span>
        ) : (
          sortedCodes.map((fc) => {
            const config = SEVERITY_CONFIG[fc.severity];
            const isSelected = selectedCode === fc.code;
            return (
              <button
                key={fc.code}
                onClick={() => onSelectCode(fc.code)}
                className={`
                  px-3 py-1.5 rounded border font-mono text-xs transition-all
                  ${isSelected 
                    ? 'ring-2 ring-primary bg-primary/10' 
                    : 'hover:bg-muted/50'
                  }
                `}
                style={{ 
                  borderColor: config.color,
                  color: config.color,
                }}
              >
                <span className="mr-2">■</span>
                {fc.code}
                <span className="ml-2 text-[10px] opacity-70">({config.label})</span>
              </button>
            );
          })
        )}
      </div>
      {selectedCode && (
        <div className="mt-2 text-xs text-muted-foreground">
          Vald felkod låser vyn till guidad analys
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MEASURE BLOCK DISPLAY
// =============================================================================

interface MeasureBlockDisplayProps {
  block: MeasureBlock;
  onClick: () => void;
  disabled: boolean;
}

function MeasureBlockDisplay({ block, onClick, disabled }: MeasureBlockDisplayProps) {
  const statusColors = {
    within_tolerance: 'border-blue-500/50 bg-blue-500/5',
    warning: 'border-orange-500/50 bg-orange-500/5',
    critical: 'border-red-500/50 bg-red-500/5',
    no_data: 'border-muted bg-muted/20 opacity-50',
  };

  const trendArrows = {
    up: '↑',
    down: '↓',
    stable: '→',
    unknown: '?',
  };

  const setpointText = block.setpointMin !== null && block.setpointMax !== null
    ? `${block.setpointMin}–${block.setpointMax}`
    : block.setpointMin !== null
      ? `≥${block.setpointMin}`
      : block.setpointMax !== null
        ? `≤${block.setpointMax}`
        : '—';

  return (
    <button
      onClick={onClick}
      disabled={disabled || block.status === 'no_data'}
      className={`
        w-full text-left p-3 rounded border transition-all
        ${statusColors[block.status]}
        ${disabled ? 'cursor-not-allowed' : 'hover:ring-1 hover:ring-primary cursor-pointer'}
      `}
    >
      <div className="font-mono text-xs text-muted-foreground mb-1">{block.code}</div>
      <div className="font-semibold text-sm mb-2">{block.name}</div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">NU: </span>
          <span className="font-mono font-bold">
            {block.currentValue !== null ? `${block.currentValue} ${block.unit}` : '—'}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">BÖRVÄRDE: </span>
          <span className="font-mono">{setpointText}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2 text-xs">
        <Badge 
          variant={block.status === 'within_tolerance' ? 'secondary' : 'destructive'}
          className="font-mono text-[10px]"
        >
          {block.status === 'within_tolerance' ? 'INOM TOLERANS' : 
           block.status === 'no_data' ? 'SAKNAR DATA' : 'UTANFÖR TOLERANS'}
        </Badge>
        <span className="text-muted-foreground">
          TREND: {trendArrows[block.trend]} {block.trendPeriod}
        </span>
      </div>
    </button>
  );
}

// =============================================================================
// DEEP ANALYSIS CONTENT PER STEP
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

function getDeepAnalysisForStep(type: string, faultCode: string): DeepAnalysis {
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
      methodology: 'Pearson-korrelation med Granger-kausalitetstest. Kontrollerat för BNP/capita, urbaniseringsgrad och demografisk struktur. Placebo-test: 3 slumpmässiga variabler testade – ingen visade signifikant korrelation.',
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

const STEP_TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  review_history: { label: 'HISTORISK GRANSKNING', icon: '📊' },
  peer_compare: { label: 'PEER-JÄMFÖRELSE', icon: '⚖️' },
  correlation: { label: 'KORRELATIONSANALYS', icon: '🔗' },
  timelag: { label: 'TIDSFÖRSKJUTNING', icon: '⏱️' },
  data_quality: { label: 'DATAKVALITET', icon: '✅' },
};

// =============================================================================
// GUIDED FAULT FINDING (AUTO-COMPLETED)
// =============================================================================

interface GuidedFaultFindingProps {
  steps: GuidedStep[];
  currentStep: number;
  onCompleteStep: (stepId: string) => void;
  selectedFaultCode: string | null;
}

function GuidedFaultFinding({ steps, selectedFaultCode }: GuidedFaultFindingProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  if (!selectedFaultCode) {
    return (
      <div className="p-6 text-center">
        <div className="text-muted-foreground text-sm">
          Välj en felkod ovan för att visa guidad analys
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-center mb-2">
        <div className="font-mono text-sm font-semibold">
          GUIDAD ANALYS – {steps.length} STEG SLUTFÖRDA
        </div>
        <Progress value={100} className="w-32 h-2" />
      </div>

      <div className="space-y-2">
        {steps.map((step) => {
          const meta = STEP_TYPE_LABELS[step.type] || { label: step.type.toUpperCase(), icon: '📌' };
          const analysis = getDeepAnalysisForStep(step.type, selectedFaultCode);
          const isExpanded = expandedStep === step.id;

          return (
            <div key={step.id} className="border border-green-500/30 bg-green-500/5 rounded overflow-hidden">
              <button
                onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                className="w-full flex items-start gap-3 p-3 text-left hover:bg-green-500/10 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs mt-0.5 shrink-0">
                  ✓
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs text-muted-foreground">
                    {meta.icon} {meta.label}
                  </div>
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{analysis.finding}</div>
                </div>
                <div className="text-xs text-muted-foreground shrink-0 mt-1">
                  {isExpanded ? '▲' : '▼'}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-green-500/20 p-4 space-y-4 bg-card/50">
                  {/* Methodology */}
                  <div>
                    <div className="font-mono text-[10px] text-muted-foreground mb-1">METODIK</div>
                    <div className="text-sm text-foreground/80">{analysis.methodology}</div>
                  </div>

                  {/* Data points */}
                  <div>
                    <div className="font-mono text-[10px] text-muted-foreground mb-1">OBSERVERADE DATAPUNKTER</div>
                    <div className="space-y-1">
                      {analysis.dataPoints.map((dp, i) => (
                        <div key={i} className="text-xs text-foreground/70 flex items-start gap-2">
                          <span className="text-muted-foreground shrink-0">•</span>
                          <span className="font-mono">{dp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Peer comparison visualization */}
                  {analysis.peerComparison && (
                    <div>
                      <div className="font-mono text-[10px] text-muted-foreground mb-2">PEER-POSITION</div>
                      <div className="space-y-1">
                        {analysis.peerComparison.peers.map((peer) => {
                          const isCurrentSystem = peer.name === 'Aktuellt';
                          const barWidth = Math.min((peer.value / 0.45) * 100, 100);
                          return (
                            <div key={peer.name} className="flex items-center gap-2 text-xs">
                              <span className={`w-20 text-right font-mono ${isCurrentSystem ? 'font-bold text-orange-500' : 'text-muted-foreground'}`}>
                                {peer.name}
                              </span>
                              <div className="flex-1 bg-muted/30 rounded-full h-3 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${isCurrentSystem ? 'bg-orange-500' : peer.value <= 0.30 ? 'bg-green-500/70' : 'bg-blue-500/50'}`}
                                  style={{ width: `${barWidth}%` }}
                                />
                              </div>
                              <span className={`font-mono w-10 ${isCurrentSystem ? 'font-bold text-orange-500' : 'text-muted-foreground'}`}>
                                {peer.value.toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1 font-mono">{analysis.peerComparison.position}</div>
                    </div>
                  )}

                  {/* Correlation detail */}
                  {analysis.correlation && (
                    <div className="border border-border rounded p-3 bg-muted/20">
                      <div className="font-mono text-[10px] text-muted-foreground mb-1">SAMVARIATION</div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-xs">{analysis.correlation.label}</span>
                        <Badge variant="secondary" className="font-mono text-xs">
                          r = {analysis.correlation.value.toFixed(2)}
                        </Badge>
                      </div>
                      <div className="text-xs text-foreground/70">{analysis.correlation.interpretation}</div>
                    </div>
                  )}

                  {/* Time lag detail */}
                  {analysis.timeLag && (
                    <div className="border border-border rounded p-3 bg-muted/20">
                      <div className="font-mono text-[10px] text-muted-foreground mb-1">TIDSFÖRSKJUTNING</div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold font-mono text-primary">{analysis.timeLag.delayYears}</span>
                        <span className="text-xs text-muted-foreground">års genomsnittlig fördröjning</span>
                      </div>
                      <div className="text-xs text-foreground/70">{analysis.timeLag.explanation}</div>
                    </div>
                  )}

                  {/* Data quality detail */}
                  {analysis.dataQuality && (
                    <div className="border border-border rounded p-3 bg-muted/20">
                      <div className="font-mono text-[10px] text-muted-foreground mb-1">KVALITETSBEDÖMNING</div>
                      <div className="grid grid-cols-3 gap-3 text-xs mb-2">
                        <div>
                          <div className="text-muted-foreground">Täckning</div>
                          <div className="font-mono font-bold">{analysis.dataQuality.coverage}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Tillförlitlighet</div>
                          <div className="font-mono font-bold text-green-600">{analysis.dataQuality.reliability}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Luckor</div>
                          <div className="font-mono">{analysis.dataQuality.gaps.length} st</div>
                        </div>
                      </div>
                      {analysis.dataQuality.gaps.length > 0 && (
                        <div className="text-[10px] text-muted-foreground">
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
  );
}

// =============================================================================
// CAUSE ANALYSIS (ALWAYS VISIBLE)
// =============================================================================

interface CauseAnalysisProps {
  causes: ProbableCause[];
  isUnlocked: boolean;
}

function CauseAnalysis({ causes }: CauseAnalysisProps) {
  const [expandedCause, setExpandedCause] = useState<number | null>(null);
  const totalProbability = causes.reduce((sum, c) => sum + c.probability, 0);
  const uncertainty = 100 - totalProbability;

  const causeDetails: Record<number, { mechanism: string; evidenceChain: string[]; limitations: string[] }> = {
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

  return (
    <div className="p-4 space-y-4">
      <div className="font-mono text-sm font-semibold">
        SANNOLIKA ORSAKER (DATA-BASERAT)
      </div>

      <div className="space-y-3">
        {causes.map((cause) => {
          const isExpanded = expandedCause === cause.rank;
          const details = causeDetails[cause.rank];

          return (
            <div key={cause.rank} className="border rounded bg-card overflow-hidden">
              <button
                onClick={() => setExpandedCause(isExpanded ? null : cause.rank)}
                className="w-full p-3 text-left hover:bg-muted/30 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-bold text-muted-foreground">
                      {cause.rank}.
                    </span>
                    <span className="font-medium">{cause.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">
                      {cause.probability}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1 ml-6">
                  ({cause.evidence}, {cause.relatedCountries} länder, {cause.yearsOfData} år)
                </div>
              </button>

              {isExpanded && details && (
                <div className="border-t border-border p-4 space-y-4 bg-muted/10">
                  <div>
                    <div className="font-mono text-[10px] text-muted-foreground mb-1">VERKNINGSMEKANISM</div>
                    <div className="text-sm text-foreground/80">{details.mechanism}</div>
                  </div>

                  <div>
                    <div className="font-mono text-[10px] text-muted-foreground mb-1">EVIDENSKEDJA</div>
                    <div className="space-y-1">
                      {details.evidenceChain.map((ev, i) => (
                        <div key={i} className="text-xs text-foreground/70 flex items-start gap-2">
                          <span className="text-muted-foreground shrink-0">📄</span>
                          <span>{ev}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="font-mono text-[10px] text-orange-500 mb-1">⚠️ BEGRÄNSNINGAR</div>
                    <div className="space-y-1">
                      {details.limitations.map((lim, i) => (
                        <div key={i} className="text-xs text-foreground/60 flex items-start gap-2">
                          <span className="shrink-0">•</span>
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

        <div className="p-3 border rounded bg-muted/30">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">OSÄKERHET</span>
            <Badge variant="outline" className="font-mono">{uncertainty}%</Badge>
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground text-center border-t border-border pt-3">
        Inga rekommendationer. Inga värdeord. Endast sannolikheter baserade på observerade mönster.
      </div>
    </div>
  );
}

// =============================================================================
// SOURCE DETAIL VIEW
// =============================================================================

interface SourceDetailProps {
  block: MeasureBlock | null;
  onClose: () => void;
}

function SourceDetail({ block, onClose }: SourceDetailProps) {
  if (!block) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg max-w-lg w-full mx-4 max-h-[80vh] overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="font-mono text-sm font-semibold">{block.code}</div>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <div className="text-xs text-muted-foreground font-mono">PARAMETER</div>
            <div className="font-medium">{block.name}</div>
          </div>
          <Separator />
          <div>
            <div className="text-xs text-muted-foreground font-mono">DATASOURCE</div>
            <div className="text-sm">{block.source}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-mono">METOD</div>
            <div className="text-sm">Standardiserad beräkningsmetod enligt källa</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-mono">OSÄKERHET</div>
            <div className="text-sm font-mono">±0.02</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-mono">SENAST UPPDATERAD</div>
            <div className="text-sm font-mono">{block.lastUpdated}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SESSION LOCK BANNER
// =============================================================================

interface SessionLockBannerProps {
  canClose: boolean;
  completedSteps: number;
  totalSteps: number;
  onClose: () => void;
}

function SessionLockBanner({ canClose, completedSteps, totalSteps, onClose }: SessionLockBannerProps) {
  return (
    <div className={`
      p-3 border-t flex justify-between items-center
      ${canClose ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}
    `}>
      <div className="text-xs font-mono">
        {canClose ? (
          <span className="text-green-600">DIAGNOSSESSION KOMPLETT – KAN AVSLUTAS</span>
        ) : (
          <span className="text-red-600">
            KAN EJ AVSLUTAS – {totalSteps - completedSteps} STEG ÅTERSTÅR
          </span>
        )}
      </div>
      <Button 
        variant={canClose ? 'default' : 'ghost'}
        size="sm"
        disabled={!canClose}
        onClick={onClose}
        className="font-mono text-xs"
      >
        {canClose ? 'AVSLUTA SESSION' : 'LÅST'}
      </Button>
    </div>
  );
}

// =============================================================================
// MAIN DIAGNOSTIC VIEW
// =============================================================================

export function DiagnosticView() {
  // Demo session state - initialized when scope is selected
  const [session, setSession] = useState<DiagnosticSession | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<MeasureBlock | null>(null);

  // Handle scope selection
  const handleSelectScope = useCallback((scope: DiagnosticScope) => {
    // Initialize session based on selected scope
    const baseSession: DiagnosticSession = {
      id: `diag-${Date.now()}`,
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
      selectedFaultCode: scope.level === 'global' 
        ? 'GLO-CLI-WAR-001'
        : 'HEA-SUB-SYS-402',
      measureBlocks: scope.level === 'global' 
        ? [
            // Economic
            { code: 'ECO-INE-GINI', name: 'Global Gini-koefficient', currentValue: 0.70, unit: '', setpointMin: 0.30, setpointMax: 0.45, status: 'critical', trend: 'stable', trendPeriod: '1990–2025', lastUpdated: '2024-11-12', source: 'World Bank' },
            // Democratic Health
            { code: 'GOV-DEM-TURNOUT', name: 'Globalt valdeltagande', currentValue: 66.2, unit: '%', setpointMin: 70, setpointMax: null, status: 'warning', trend: 'stable', trendPeriod: '2000–2024', lastUpdated: '2024-11-01', source: 'IDEA International' },
            { code: 'GOV-DEM-INDEX', name: 'Demokratiindex (global)', currentValue: 5.29, unit: 'index', setpointMin: 6.0, setpointMax: null, status: 'critical', trend: 'down', trendPeriod: '2015–2024', lastUpdated: '2024-10-01', source: 'Economist Intelligence Unit' },
            { code: 'GOV-DEM-FREEDOM', name: 'Global frihet', currentValue: 55.0, unit: 'poäng', setpointMin: 60, setpointMax: null, status: 'warning', trend: 'down', trendPeriod: '2010–2024', lastUpdated: '2024-09-01', source: 'Freedom House' },
            { code: 'GOV-DEM-PRESS', name: 'Global pressfrihet', currentValue: 44.3, unit: 'index', setpointMin: 60, setpointMax: null, status: 'critical', trend: 'down', trendPeriod: '2015–2024', lastUpdated: '2024-08-01', source: 'Reporters Without Borders' },
            // Demographics
            { code: 'DEM-FER-RATE', name: 'Global fertilitet (TFR)', currentValue: 2.31, unit: '', setpointMin: 2.1, setpointMax: 2.5, status: 'within_tolerance', trend: 'down', trendPeriod: '1990–2025', lastUpdated: '2024-11-01', source: 'UN Population Division' },
            // Environment
            { code: 'ENV-EMI-CO2', name: 'Global CO2 per capita', currentValue: 4.7, unit: 'ton', setpointMin: null, setpointMax: 2.0, status: 'critical', trend: 'stable', trendPeriod: '1990–2025', lastUpdated: '2024-08-01', source: 'Global Carbon Project' },
            // Health
            { code: 'HEA-LIF-EXPECT', name: 'Global livslängd', currentValue: 72.8, unit: 'år', setpointMin: 75, setpointMax: null, status: 'warning', trend: 'up', trendPeriod: '1990–2025', lastUpdated: '2024-10-01', source: 'WHO' },
          ]
        : [
            { code: 'ECO-INE-GINI', name: 'Inkomstojämlikhet (Gini)', currentValue: 0.34, unit: '', setpointMin: 0.25, setpointMax: 0.30, status: 'critical', trend: 'up', trendPeriod: '2005–2025', lastUpdated: '2024-11-12', source: 'OECD Income Distribution Database' },
            { code: 'HEA-SUB-OPIOID', name: 'Opioidrelaterade dödsfall', currentValue: 8.2, unit: 'per 100k', setpointMin: null, setpointMax: 5.0, status: 'critical', trend: 'up', trendPeriod: '2015–2025', lastUpdated: '2024-10-01', source: 'WHO Global Health Observatory' },
            { code: 'SOC-HOU-SUPPLY', name: 'Bostadsbestånd vs efterfrågan', currentValue: 0.92, unit: 'ratio', setpointMin: 1.0, setpointMax: 1.2, status: 'warning', trend: 'down', trendPeriod: '2010–2025', lastUpdated: '2024-09-15', source: 'UN Habitat' },
            { code: 'SOC-TRU-INST', name: 'Institutionell tillit', currentValue: 62, unit: '%', setpointMin: 65, setpointMax: null, status: 'warning', trend: 'down', trendPeriod: '2000–2025', lastUpdated: '2024-06-01', source: 'World Values Survey' },
            { code: 'GOV-DEM-TURNOUT', name: 'Valdeltagande', currentValue: 84.2, unit: '%', setpointMin: 80, setpointMax: null, status: 'within_tolerance', trend: 'stable', trendPeriod: '2000–2024', lastUpdated: '2024-09-15', source: 'National Electoral Commission' },
            { code: 'GOV-DEM-INDEX', name: 'Demokratiindex', currentValue: 9.39, unit: 'index', setpointMin: 8.0, setpointMax: null, status: 'within_tolerance', trend: 'stable', trendPeriod: '2010–2024', lastUpdated: '2024-10-01', source: 'Economist Intelligence Unit' },
            { code: 'DEM-FER-RATE', name: 'Fertilitet (TFR)', currentValue: 1.52, unit: '', setpointMin: 2.1, setpointMax: null, status: 'critical', trend: 'down', trendPeriod: '1990–2025', lastUpdated: '2024-11-01', source: 'UN Population Division' },
            { code: 'ENV-EMI-CO2', name: 'CO2-utsläpp per capita', currentValue: 4.2, unit: 'ton', setpointMin: null, setpointMax: 2.0, status: 'warning', trend: 'down', trendPeriod: '1990–2025', lastUpdated: '2024-08-01', source: 'Global Carbon Project' },
          ],
      guidedSteps: [
        { id: 'step-1', title: 'Granska historik för primärt mätblock', description: 'Historisk trend analyserad.', type: 'review_history', completed: true, locked: false, requiredMeasureBlocks: ['ECO-INE-GINI'] },
        { id: 'step-2', title: 'Jämför med peer-system', description: 'Peer-jämförelse utförd.', type: 'peer_compare', completed: true, locked: false, requiredMeasureBlocks: ['ECO-INE-GINI'] },
        { id: 'step-3', title: 'Visa korrelation mot sekundära mätblock', description: 'Korrelationsanalys genomförd.', type: 'correlation', completed: true, locked: false, requiredMeasureBlocks: ['ECO-INE-GINI', 'SOC-POV-RATE'] },
        { id: 'step-4', title: 'Kontrollera tidsförskjutning', description: 'Tidsförskjutning analyserad.', type: 'timelag', completed: true, locked: false, requiredMeasureBlocks: ['ECO-INE-GINI'] },
        { id: 'step-5', title: 'Bekräfta datakvalitet', description: 'Datakvalitet verifierad.', type: 'data_quality', completed: true, locked: false, requiredMeasureBlocks: ['ECO-INE-GINI'] },
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
      return {
        ...prev,
        selectedFaultCode: prev.selectedFaultCode === code ? null : code,
      };
    });
  }, []);

  const handleCompleteStep = useCallback((stepId: string) => {
    setSession(prev => {
      if (!prev) return prev;
      const newSteps = prev.guidedSteps.map((step, index) => {
        if (step.id === stepId) {
          return { ...step, completed: true };
        }
        // Unlock next step
        if (index > 0 && prev.guidedSteps[index - 1]?.id === stepId) {
          return { ...step, locked: false };
        }
        return step;
      });

      const completedCount = newSteps.filter(s => s.completed).length;

      return {
        ...prev,
        guidedSteps: newSteps,
        completedSteps: completedCount,
        canClose: completedCount === prev.totalSteps,
      };
    });
  }, []);

  const handleCloseSession = useCallback(() => {
    if (session?.canClose) {
      // Would generate diagnostic log here
      alert('Diagnoslogg genererad. Session avslutad.');
      // Reset to scope selection
      setSession(null);
    }
  }, [session?.canClose]);

  // Handle going back to scope selection
  const handleBackToScopeSelection = useCallback(() => {
    setSession(null);
  }, []);

  // Show scope selector if no session is active
  if (!session) {
    return <DiagnosticScopeSelector onSelectScope={handleSelectScope} />;
  }

  const currentStepIndex = session.guidedSteps.findIndex(s => !s.completed);
  const allStepsComplete = session.completedSteps === session.totalSteps;

  return (
    <div className="flex flex-col bg-background h-full min-h-0">
      {/* System Identity Header with back button */}
      <div className="bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2 p-2 border-b border-border/50">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToScopeSelection}
            className="font-mono text-xs"
          >
            ← ÄNDRA OMFATTNING
          </Button>
          <span className="text-xs text-muted-foreground">|</span>
          <span className="text-xs font-mono text-muted-foreground">
            SESSION: {session.id}
          </span>
        </div>
        <SystemIdentityHeader system={session.system} />
      </div>

      {/* Fault Code Panel */}
      <FaultCodePanel 
        faultCodes={session.activeFaultCodes}
        selectedCode={session.selectedFaultCode}
        onSelectCode={handleSelectFaultCode}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row min-h-0">
        {/* Left: Measure Blocks */}
        <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-border flex flex-col min-h-0">
          <div className="p-3 border-b border-border">
            <div className="font-mono text-xs text-muted-foreground">HUVUDMÄTBLOCK</div>
          </div>
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-3 grid grid-cols-2 gap-2">
              {session.measureBlocks.map((block) => (
                <MeasureBlockDisplay
                  key={block.code}
                  block={block}
                  onClick={() => setSelectedBlock(block)}
                  disabled={!session.selectedFaultCode}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right: Guided Fault Finding + Cause Analysis */}
        <div className="w-full md:w-1/2 flex flex-col min-h-0">
          <div className="flex-1 border-b border-border overflow-auto">
            <div className="p-3 border-b border-border">
              <div className="font-mono text-xs text-muted-foreground">
                GUIDAD ANALYS
              </div>
            </div>
            <GuidedFaultFinding
              steps={session.guidedSteps}
              currentStep={currentStepIndex >= 0 ? currentStepIndex : session.totalSteps - 1}
              onCompleteStep={handleCompleteStep}
              selectedFaultCode={session.selectedFaultCode}
            />
          </div>

          <div className="flex-1 overflow-auto">
            <div className="p-3 border-b border-border">
              <div className="font-mono text-xs text-muted-foreground">
                ORSAKSANALYS
              </div>
            </div>
            <CauseAnalysis
              causes={session.probableCauses}
              isUnlocked={allStepsComplete}
            />
          </div>
        </div>
      </div>


      {/* Source Detail Modal */}
      {selectedBlock && (
        <SourceDetail 
          block={selectedBlock} 
          onClose={() => setSelectedBlock(null)} 
        />
      )}
    </div>
  );
}

export default DiagnosticView;
