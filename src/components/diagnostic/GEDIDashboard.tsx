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
import { Separator } from '@/components/ui/separator';
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

function GuidedAnalysisPanel({ result }: { result: GEDICodeResult }) {
  const definition = getGEDICode(result.code);
  const [currentStep, setCurrentStep] = useState(0);

  if (!definition) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 rounded-lg border bg-muted/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{GEDI_CATEGORY_LABELS[definition.category].icon}</span>
          <div>
            <div className="font-mono font-semibold">{result.code}</div>
            <div className="text-sm">{definition.title.sv}</div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {definition.description.sv}
        </p>
      </div>

      {/* Probable Causes */}
      {result.probableCauses.length > 0 && (
        <div>
          <h3 className="font-mono text-sm font-semibold mb-2">TROLIGA ORSAKER</h3>
          <div className="space-y-2">
            {result.probableCauses.map((cause) => (
              <ProbableCauseCard key={cause.causeId} cause={cause} />
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Guided Steps */}
      <div>
        <h3 className="font-mono text-sm font-semibold mb-2">GUIDAD ANALYS</h3>
        <div className="space-y-2">
          {definition.guidedAnalysisSteps.map((step, index) => (
            <div 
              key={step.order}
              className={`p-3 rounded border ${
                index === currentStep
                  ? 'border-primary bg-primary/5'
                  : index < currentStep
                    ? 'border-green-500/50 bg-green-500/5'
                    : 'border-muted'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                  }`}>
                    {index < currentStep ? '✓' : step.order}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{step.title.sv}</div>
                    <div className="text-xs text-muted-foreground">{step.expectedDuration}</div>
                  </div>
                </div>
                
                {index === currentStep && (
                  <Button 
                    size="sm" 
                    onClick={() => setCurrentStep(s => Math.min(s + 1, definition.guidedAnalysisSteps.length - 1))}
                  >
                    Slutför steg
                  </Button>
                )}
              </div>
              
              {index === currentStep && (
                <div className="mt-3 pl-8">
                  <p className="text-xs text-muted-foreground mb-2">{step.instruction.sv}</p>
                  <div className="flex gap-1 flex-wrap">
                    {step.requiredIndicators.map(ind => (
                      <Badge key={ind} variant="outline" className="text-[10px]">{ind}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Metadata */}
      <div className="text-xs text-muted-foreground space-y-1">
        <div><span className="font-semibold">Internationell grund:</span> {definition.internationalBasis}</div>
        <div><span className="font-semibold">Tolerans:</span> {definition.toleranceDefinition}</div>
        <div><span className="font-semibold">Krav datatäckning:</span> {definition.requiredDataCoverage}%</div>
      </div>
    </div>
  );
}

// =============================================================================
// PROBABLE CAUSE CARD
// =============================================================================

function ProbableCauseCard({ cause }: { cause: ProbableCause }) {
  return (
    <div className="p-3 rounded border bg-muted/20">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-mono font-bold">
            {cause.rank}
          </div>
          <div>
            <div className="text-sm font-semibold">{cause.title.sv}</div>
            <div className="text-xs text-muted-foreground">
              Korrelation: {(cause.correlationStrength * 100).toFixed(0)}%
              {cause.historicalPrecedent && ' • Historiskt precedent'}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-lg font-bold text-primary">{cause.probability}%</div>
          <div className="text-[10px] text-muted-foreground">sannolikhet</div>
        </div>
      </div>
      
      <div className="mt-2 flex gap-1 flex-wrap">
        {cause.affectedIndicators.map(ind => (
          <Badge key={ind} variant="secondary" className="text-[10px]">{ind}</Badge>
        ))}
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
