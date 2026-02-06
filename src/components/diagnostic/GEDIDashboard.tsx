/**
 * GEDI Dashboard
 * 
 * Global Equivalent Diagnostic Interface - Regulatory Level View
 * Like EOBD/OBD-II status for societal systems.
 */

import React, { useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GEDI_CATEGORY_LABELS,
  getGEDICode,
  runGEDIAssessment,
  getGEDIAssessmentSummary,
  type GEDIAssessment,
  type GEDICodeResult,
  type GEDIStatus,
  type ProbableCause,
} from '@/lib/gedi';

// =============================================================================
// STATUS BADGE COMPONENT
// =============================================================================

function StatusBadge({ status }: { status: GEDIStatus }) {
  const config: Record<GEDIStatus, { className: string; label: string }> = {
    PASS: { className: 'bg-green-500 text-white', label: 'PASS' },
    FAIL: { className: 'bg-red-500 text-white', label: 'FAIL' },
    PENDING: { className: 'bg-yellow-500 text-black', label: 'PENDING' },
    INSUFFICIENT_DATA: { className: 'bg-gray-500 text-white', label: 'NO DATA' },
  };

  const { className, label } = config[status];
  return <Badge className={`font-mono ${className}`}>{label}</Badge>;
}

// =============================================================================
// OVERALL STATUS COMPONENT
// =============================================================================

function OverallStatusPanel({ assessment }: { assessment: GEDIAssessment }) {
  const summary = getGEDIAssessmentSummary(assessment);
  
  const statusConfig: Record<GEDIStatus, { bg: string; border: string; text: string }> = {
    PASS: { bg: 'bg-green-500/10', border: 'border-green-500', text: 'GODKÄND' },
    FAIL: { bg: 'bg-red-500/10', border: 'border-red-500', text: 'UNDERKÄND' },
    PENDING: { bg: 'bg-yellow-500/10', border: 'border-yellow-500', text: 'PÅGÅENDE' },
    INSUFFICIENT_DATA: { bg: 'bg-gray-500/10', border: 'border-gray-500', text: 'DATA SAKNAS' },
  };

  const config = statusConfig[assessment.overallStatus];

  return (
    <div className={`p-6 rounded-lg border-2 ${config.bg} ${config.border}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-xs text-muted-foreground font-mono">GEDI DIAGNOSTIK</div>
          <div className="font-mono text-2xl font-bold mt-1">{config.text}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {assessment.geoScope} • {assessment.period.start} – {assessment.period.end}
          </div>
        </div>
        
        {assessment.certificationHash && (
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Certifikat</div>
            <div className="font-mono text-sm">{assessment.certificationHash}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="p-3 rounded bg-green-500/20">
          <div className="font-mono text-2xl text-green-500">{summary.passCount}</div>
          <div className="text-xs text-muted-foreground">PASS</div>
        </div>
        <div className="p-3 rounded bg-red-500/20">
          <div className="font-mono text-2xl text-red-500">{summary.failCount}</div>
          <div className="text-xs text-muted-foreground">FAIL</div>
        </div>
        <div className="p-3 rounded bg-yellow-500/20">
          <div className="font-mono text-2xl text-yellow-600">{summary.pendingCount}</div>
          <div className="text-xs text-muted-foreground">PENDING</div>
        </div>
        <div className="p-3 rounded bg-gray-500/20">
          <div className="font-mono text-2xl text-gray-500">{summary.insufficientDataCount}</div>
          <div className="text-xs text-muted-foreground">NO DATA</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Datakvalitet</span>
          <span>{assessment.dataQualityScore}%</span>
        </div>
        <Progress value={assessment.dataQualityScore} className="h-2" />
      </div>
    </div>
  );
}

// =============================================================================
// CODE RESULT CARD
// =============================================================================

function CodeResultCard({ 
  result, 
  onSelect,
  isSelected 
}: { 
  result: GEDICodeResult;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const definition = getGEDICode(result.code);
  if (!definition) return null;

  const category = GEDI_CATEGORY_LABELS[definition.category];

  return (
    <div 
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isSelected 
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
          : result.status === 'FAIL'
            ? 'border-red-500/50 bg-red-500/5 hover:bg-red-500/10'
            : 'border-muted hover:bg-muted/50'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{category.icon}</span>
            <span className="font-mono font-semibold">{result.code}</span>
          </div>
          <div className="text-sm mt-1">{definition.title.sv}</div>
        </div>
        <StatusBadge status={result.status} />
      </div>

      {result.status === 'FAIL' && result.currentValue !== null && (
        <div className="mt-3 p-2 rounded bg-red-500/10 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nuvarande:</span>
            <span className="font-mono font-semibold">{result.currentValue.toFixed(2)}</span>
          </div>
          {result.toleranceRange && (
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">Tolerans:</span>
              <span className="font-mono">
                {result.toleranceRange.min.toFixed(2)} – {result.toleranceRange.max.toFixed(2)}
              </span>
            </div>
          )}
          {result.deviation !== null && (
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">Avvikelse:</span>
              <span className="font-mono text-red-500">
                {result.deviationDirection === 'above' ? '+' : '-'}{result.deviation.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}

      {result.probableCauses.length > 0 && (
        <div className="mt-2 text-xs text-muted-foreground">
          {result.probableCauses.length} troliga orsaker identifierade
        </div>
      )}
    </div>
  );
}

// =============================================================================
// GUIDED ANALYSIS PANEL
// =============================================================================
// GUIDED ANALYSIS PANEL (Apple Health-inspired, pedagogical)
// =============================================================================

function GuidedAnalysisPanel({ result }: { result: GEDICodeResult }) {
  const definition = getGEDICode(result.code);
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedCause, setExpandedCause] = useState<string | null>(null);

  if (!definition) return null;

  // Friendly step descriptions
  const STEP_EXPLANATIONS: Record<string, { icon: string; friendlyTitle: string; whyImportant: string }> = {
    'PEER_COMPARE': { 
      icon: '🌍', 
      friendlyTitle: 'Jämför med liknande länder',
      whyImportant: 'Vi kollar hur det ser ut i länder med liknande ekonomi och befolkning för att se om avvikelsen är unik.'
    },
    'CORRELATION': { 
      icon: '🔗', 
      friendlyTitle: 'Hitta samband',
      whyImportant: 'Vi undersöker om andra faktorer har förändrats samtidigt - det kan ge ledtrådar om vad som ligger bakom.'
    },
    'TIMELAG': { 
      icon: '⏱️', 
      friendlyTitle: 'Kolla tidsförskjutning',
      whyImportant: 'Ibland tar det år innan en förändring syns i data. Vi kollar om något hände tidigare som kan förklara nuläget.'
    },
    'DATA_QUALITY': { 
      icon: '✅', 
      friendlyTitle: 'Granska datakvaliteten',
      whyImportant: 'Innan vi drar slutsatser måste vi vara säkra på att siffrorna är tillförlitliga.'
    },
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Friendly Header Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl">
            {GEDI_CATEGORY_LABELS[definition.category].icon}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900">{definition.title.sv}</h2>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {definition.description.sv}
            </p>
          </div>
        </div>
        
        {/* What this analysis does - pedagogical explanation */}
        <div className="mt-4 p-4 rounded-xl bg-white/70 border border-white">
          <div className="flex items-center gap-2 text-slate-700 mb-2">
            <span className="text-lg">💡</span>
            <span className="font-medium">Vad gör den här analysen?</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Den här guiden hjälper dig att förstå <strong>varför</strong> en indikator avviker från det förväntade. 
            Istället för att gissa går vi systematiskt igenom möjliga förklaringar – steg för steg.
          </p>
        </div>
      </div>

      {/* Probable Causes - Friendly Cards */}
      {result.probableCauses.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <span className="text-xl">🔍</span>
            <h3 className="font-semibold text-slate-800">Vad kan förklara detta?</h3>
          </div>
          <p className="text-sm text-slate-500 px-1 -mt-1">
            Baserat på mönster i data har vi identifierat dessa möjliga förklaringar, rankade efter sannolikhet:
          </p>
          
          <div className="space-y-2">
            {result.probableCauses.map((cause) => (
              <ProbableCauseCard 
                key={cause.causeId} 
                cause={cause} 
                isExpanded={expandedCause === cause.causeId}
                onToggle={() => setExpandedCause(expandedCause === cause.causeId ? null : cause.causeId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Guided Steps - Friendly Progress */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <span className="text-xl">📋</span>
          <h3 className="font-semibold text-slate-800">Verifieringssteg</h3>
        </div>
        <p className="text-sm text-slate-500 px-1 -mt-1">
          Gå igenom dessa steg för att bekräfta eller utesluta förklaringarna ovan:
        </p>
        
        <div className="space-y-2">
          {definition.guidedAnalysisSteps.map((step, index) => {
            const stepInfo = STEP_EXPLANATIONS[step.title.en] || {
              icon: '📌',
              friendlyTitle: step.title.sv,
              whyImportant: step.instruction.sv
            };
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div 
                key={step.order}
                className={`rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-blue-200 bg-blue-50 shadow-sm'
                    : isCompleted
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-slate-100 bg-white'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Step indicator */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 text-slate-400'
                    }`}>
                      {isCompleted ? '✓' : stepInfo.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`font-medium ${
                          isCompleted ? 'text-emerald-700' : isCurrent ? 'text-blue-700' : 'text-slate-600'
                        }`}>
                          {stepInfo.friendlyTitle}
                        </h4>
                        <span className="text-xs text-slate-400 shrink-0">
                          {step.expectedDuration}
                        </span>
                      </div>
                      
                      {isCurrent && (
                        <div className="mt-2 space-y-3">
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {stepInfo.whyImportant}
                          </p>
                          
                          {/* What to look for */}
                          <div className="p-3 rounded-lg bg-white border border-blue-100">
                            <div className="text-xs font-medium text-slate-500 mb-1">
                              📊 Indikatorer att granska:
                            </div>
                            <div className="flex gap-1.5 flex-wrap">
                              {step.requiredIndicators.map(ind => (
                                <span 
                                  key={ind} 
                                  className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium"
                                >
                                  {ind}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => setCurrentStep(s => Math.min(s + 1, definition.guidedAnalysisSteps.length - 1))}
                          >
                            ✓ Jag har granskat detta
                          </Button>
                        </div>
                      )}
                      
                      {isCompleted && (
                        <p className="text-sm text-emerald-600 mt-1">
                          ✓ Granskat
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Context/Metadata - More Friendly */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
        <div className="flex items-center gap-2 text-slate-600 mb-3">
          <span>ℹ️</span>
          <span className="text-sm font-medium">Om denna analys</span>
        </div>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Internationell standard:</span>
            <span className="text-slate-700 font-medium">{definition.internationalBasis}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Normalintervall:</span>
            <span className="text-slate-700 font-medium">{definition.toleranceDefinition}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Datatäckning krävs:</span>
            <span className="text-slate-700 font-medium">{definition.requiredDataCoverage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// PROBABLE CAUSE CARD (Redesigned - Apple Health style)
// =============================================================================

function ProbableCauseCard({ 
  cause, 
  isExpanded, 
  onToggle 
}: { 
  cause: ProbableCause; 
  isExpanded: boolean;
  onToggle: () => void;
}) {
  // Friendly explanations for cause types
  const getFriendlyExplanation = (causeId: string): string => {
    const explanations: Record<string, string> = {
      'capital_income_share': 'En större andel av inkomsterna i samhället går till kapitalägare istället för löner. Detta kan påverka hur resurser fördelas.',
      'labor_market_change': 'Arbetsmarknaden har förändrats strukturellt – exempelvis genom automatisering, gig-ekonomi eller förändrade anställningsformer.',
      'globalization_effect': 'Globala ekonomiska förändringar påverkar lokala förhållanden. Effekten är svår att isolera från andra faktorer.',
      'demographic_shift': 'Befolkningens sammansättning har ändrats – exempelvis åldrande befolkning eller migration.',
      'policy_change': 'Politiska beslut eller regeländringar har påverkat utfallet.',
    };
    return explanations[causeId] || 'Klicka för att läsa mer om denna möjliga förklaring.';
  };

  return (
    <div 
      className={`rounded-xl border bg-white overflow-hidden transition-all cursor-pointer ${
        isExpanded ? 'shadow-md border-blue-200' : 'hover:shadow-sm hover:border-slate-200'
      }`}
      onClick={onToggle}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Rank indicator */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            {cause.rank}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-slate-800">{cause.title.sv}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              {cause.historicalPrecedent && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  📜 Historiskt belagt
                </span>
              )}
            </div>
          </div>
          
          {/* Probability meter */}
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold text-blue-600">{cause.probability}%</div>
            <div className="text-xs text-slate-400">sannolikhet</div>
          </div>
        </div>
        
        {/* Correlation bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Styrka i sambandet</span>
            <span>{(cause.correlationStrength * 100).toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all"
              style={{ width: `${cause.correlationStrength * 100}%` }}
            />
          </div>
        </div>
        
        {/* Expanded content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 animate-in fade-in duration-200">
            <p className="text-sm text-slate-600 leading-relaxed">
              {getFriendlyExplanation(cause.causeId)}
            </p>
            
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
              <div className="flex items-start gap-2">
                <span className="text-blue-500">💡</span>
                <p className="text-xs text-blue-700 leading-relaxed">
                  <strong>Vad betyder detta?</strong> Korrelationen visar hur starkt sambandet är i data. 
                  En hög korrelation betyder inte automatiskt att detta är orsaken – 
                  det betyder att vi bör undersöka det närmare.
                </p>
              </div>
            </div>

            {/* Data context */}
            <div className="text-xs text-slate-500">
              <span className="font-medium">Analysunderlag:</span>{' '}
              {cause.correlationStrength > 0.7 
                ? 'Starkt datamaterial från flera källor'
                : cause.correlationStrength > 0.4
                  ? 'Måttligt datamaterial'
                  : 'Begränsat datamaterial'
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function GEDIDashboard() {
  const [geoScope, setGeoScope] = useState('SE');
  const [assessment, setAssessment] = useState<GEDIAssessment | null>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runAssessment = useCallback(() => {
    setIsRunning(true);
    setSelectedCode(null);
    
    // Simulate delay
    setTimeout(() => {
      const result = runGEDIAssessment(geoScope);
      setAssessment(result);
      setIsRunning(false);
    }, 1000);
  }, [geoScope]);

  const selectedResult = assessment?.codeResults.find(r => r.code === selectedCode);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-mono text-lg font-semibold">
              GEDI – Global Equivalent Diagnostic Interface
            </h1>
            <p className="text-xs text-muted-foreground">
              Regulatorisk diagnostik • Motsvarar EOBD/OBD-II för fordon
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Select value={geoScope} onValueChange={setGeoScope}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SE">Sverige</SelectItem>
                <SelectItem value="US">USA</SelectItem>
                <SelectItem value="GLOBAL">Global</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={runAssessment} disabled={isRunning}>
              {isRunning ? 'Kör diagnostik...' : 'Kör GEDI-diagnostik'}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {!assessment ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="text-4xl mb-4">🔍</div>
              <div className="font-mono">Ingen diagnostik genomförd</div>
              <div className="text-sm mt-2">Välj geografiskt område och kör GEDI-diagnostik</div>
            </div>
          </div>
        ) : (
          <div className="h-full flex">
            {/* Left Panel - Overview & Codes */}
            <div className="w-1/2 border-r overflow-hidden flex flex-col">
              <div className="p-4">
                <OverallStatusPanel assessment={assessment} />
              </div>
              
              <div className="flex-1 overflow-hidden">
                <div className="px-4 pb-2">
                  <h2 className="font-mono text-sm font-semibold">GEDI-KODER</h2>
                </div>
                <ScrollArea className="h-full px-4 pb-4">
                  <div className="space-y-2">
                    {assessment.codeResults.map(result => (
                      <CodeResultCard 
                        key={result.code} 
                        result={result}
                        onSelect={() => setSelectedCode(result.code)}
                        isSelected={selectedCode === result.code}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Right Panel - Guided Analysis */}
            <div className="w-1/2 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  {selectedResult ? (
                    <GuidedAnalysisPanel result={selectedResult} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <div className="text-4xl mb-4">👈</div>
                        <div className="font-mono">Välj en GEDI-kod</div>
                        <div className="text-sm mt-2">för guidad analys</div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GEDIDashboard;
