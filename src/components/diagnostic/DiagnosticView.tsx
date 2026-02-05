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
import { Checkbox } from '@/components/ui/checkbox';
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
// GUIDED FAULT FINDING
// =============================================================================

interface GuidedFaultFindingProps {
  steps: GuidedStep[];
  currentStep: number;
  onCompleteStep: (stepId: string) => void;
  selectedFaultCode: string | null;
}

function GuidedFaultFinding({ steps, currentStep, onCompleteStep, selectedFaultCode }: GuidedFaultFindingProps) {
  if (!selectedFaultCode) {
    return (
      <div className="p-6 text-center">
        <div className="text-muted-foreground text-sm">
          Välj en felkod ovan för att starta guidad analys
        </div>
      </div>
    );
  }

  const completedCount = steps.filter(s => s.completed).length;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="font-mono text-sm font-semibold">
          GUIDAD ANALYS – STEG {currentStep + 1} AV {steps.length}
        </div>
        <Progress value={(completedCount / steps.length) * 100} className="w-32 h-2" />
      </div>

      <div className="space-y-2">
        {steps.map((step, index) => {
          const isCurrent = index === currentStep;
          const isPast = index < currentStep;
          const isFuture = index > currentStep;

          return (
            <div
              key={step.id}
              className={`
                flex items-start gap-3 p-3 rounded border transition-all
                ${isCurrent ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''}
                ${isPast ? 'border-green-500/50 bg-green-500/5' : ''}
                ${isFuture ? 'border-muted bg-muted/20 opacity-50' : ''}
              `}
            >
              <div className="pt-0.5">
                {step.completed ? (
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                    ✓
                  </div>
                ) : (
                  <Checkbox
                    checked={step.completed}
                    disabled={step.locked || isFuture}
                    onCheckedChange={() => onCompleteStep(step.id)}
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="font-mono text-xs text-muted-foreground">
                  {step.type.toUpperCase().replace(/_/g, ' ')}
                </div>
                <div className={`text-sm ${isFuture ? 'text-muted-foreground' : ''}`}>
                  {step.title}
                </div>
                {isCurrent && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </div>
                )}
              </div>
              {step.locked && isFuture && (
                <Badge variant="outline" className="text-[10px]">LÅST</Badge>
              )}
            </div>
          );
        })}
      </div>

      {completedCount < steps.length && (
        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
          Alla steg måste slutföras innan orsaksanalys visas
        </div>
      )}
    </div>
  );
}

// =============================================================================
// CAUSE ANALYSIS (ONLY AFTER ALL STEPS)
// =============================================================================

interface CauseAnalysisProps {
  causes: ProbableCause[];
  isUnlocked: boolean;
}

function CauseAnalysis({ causes, isUnlocked }: CauseAnalysisProps) {
  if (!isUnlocked) {
    return (
      <div className="p-6 text-center border rounded bg-muted/20">
        <div className="text-muted-foreground text-sm font-mono">
          ORSAKSANALYS LÅST
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Slutför alla obligatoriska steg för att låsa upp
        </div>
      </div>
    );
  }

  const totalProbability = causes.reduce((sum, c) => sum + c.probability, 0);
  const uncertainty = 100 - totalProbability;

  return (
    <div className="p-4 space-y-4">
      <div className="font-mono text-sm font-semibold">
        SANNOLIKA ORSAKER (DATA-BASERAT)
      </div>

      <div className="space-y-3">
        {causes.map((cause) => (
          <div key={cause.rank} className="p-3 border rounded bg-card">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-muted-foreground">
                  {cause.rank}.
                </span>
                <span className="font-medium">{cause.description}</span>
              </div>
              <Badge variant="secondary" className="font-mono">
                {cause.probability}%
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-2 ml-6">
              ({cause.evidence}, {cause.relatedCountries} länder, {cause.yearsOfData} år)
            </div>
          </div>
        ))}

        <div className="p-3 border rounded bg-muted/30">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">OSÄKERHET</span>
            <Badge variant="outline" className="font-mono">{uncertainty}%</Badge>
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground text-center border-t border-border pt-3">
        Inga rekommendationer. Inga värdeord. Endast sannolikheter.
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
            { code: 'GLO-CLI-WAR-001', severity: 'critical', description: 'Klimatsystemavvikelse', triggeredAt: '2024-01-01' },
            { code: 'GLO-DEM-STR-301', severity: 'critical', description: 'Strukturell demokratisk erosion globalt', triggeredAt: '2024-02-01' },
            { code: 'GLO-INE-TRE-002', severity: 'systemic', description: 'Global ojämlikhetsacceleration', triggeredAt: '2024-02-15' },
            { code: 'GLO-DEM-FER-003', severity: 'warning', description: 'Fertilitetskris i utvecklade länder', triggeredAt: '2024-03-01' },
          ]
        : [
            { code: 'HEA-SUB-SYS-402', severity: 'critical', description: 'Systemiskt missbruksproblem', triggeredAt: '2024-01-15' },
            { code: 'SOC-HOU-STR-021', severity: 'warning', description: 'Strukturellt bostadsproblem', triggeredAt: '2024-02-20' },
            { code: 'ECO-INE-TRE-145', severity: 'warning', description: 'Ökande inkomstojämlikhet', triggeredAt: '2024-03-10' },
          ],
      selectedFaultCode: null,
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
        { id: 'step-1', title: 'Granska historik för primärt mätblock', description: 'Öppna och granska den historiska trenden för det primära mätblocket kopplat till felkoden.', type: 'review_history', completed: false, locked: false, requiredMeasureBlocks: ['ECO-INE-GINI'] },
        { id: 'step-2', title: 'Jämför med peer-system', description: 'Jämför nuvarande värde med liknande system för att fastställa relativ position.', type: 'peer_compare', completed: false, locked: true, requiredMeasureBlocks: ['ECO-INE-GINI'] },
        { id: 'step-3', title: 'Visa korrelation mot sekundära mätblock', description: 'Undersök korrelationen mellan primärt mätblock och potentiellt påverkande faktorer.', type: 'correlation', completed: false, locked: true, requiredMeasureBlocks: ['ECO-INE-GINI', 'SOC-POV-RATE'] },
        { id: 'step-4', title: 'Kontrollera tidsförskjutning', description: 'Analysera om det finns en tidsförskjutning mellan orsak och effekt.', type: 'timelag', completed: false, locked: true, requiredMeasureBlocks: ['ECO-INE-GINI'] },
        { id: 'step-5', title: 'Bekräfta datakvalitet', description: 'Verifiera att datakvaliteten är tillräcklig för att dra slutsatser.', type: 'data_quality', completed: false, locked: true, requiredMeasureBlocks: ['ECO-INE-GINI'] },
      ],
      probableCauses: [
        { rank: 1, description: 'Kapitalinkomsternas ökande andel', probability: 42, evidence: 'Stark korrelation', relatedCountries: 12, yearsOfData: 20 },
        { rank: 2, description: 'Förändrad arbetsmarknadsstruktur', probability: 31, evidence: 'Tidsförskjutning 3–5 år', relatedCountries: 8, yearsOfData: 15 },
        { rank: 3, description: 'Systemisk effekt av globalisering', probability: 17, evidence: 'Ej isolerbar till en parameter', relatedCountries: 25, yearsOfData: 30 },
      ],
      canClose: false,
      completedSteps: 0,
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

      {/* Session Lock Banner */}
      <SessionLockBanner
        canClose={session.canClose}
        completedSteps={session.completedSteps}
        totalSteps={session.totalSteps}
        onClose={handleCloseSession}
      />

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
