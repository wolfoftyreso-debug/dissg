/**
 * 🔬 Correlation Explorer
 * 
 * Allows users to explore correlations WITH DISCIPLINE:
 * - Always shows correlation ≠ causation
 * - Shows what is NOT measured
 * - Full source signature
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Info, BarChart3, Download, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CorrelationResult, CorrelationRequest } from '@/types/realityCheck';

interface Indicator {
  id: string;
  name: string;
  nameSv: string;
  category: string;
}

interface Region {
  code: string;
  name: string;
  nameSv: string;
}

interface CorrelationExplorerProps {
  indicators: Indicator[];
  regions: Region[];
  onCalculate?: (request: CorrelationRequest) => Promise<CorrelationResult>;
  result?: CorrelationResult;
  className?: string;
}

export function CorrelationExplorer({
  indicators,
  regions,
  onCalculate,
  result,
  className,
}: CorrelationExplorerProps) {
  const [variableA, setVariableA] = useState<string>('');
  const [variableB, setVariableB] = useState<string>('');
  const [selectedRegions, _setSelectedRegions] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    if (!onCalculate || !variableA || !variableB) return;
    
    setIsCalculating(true);
    try {
      await onCalculate({
        variableA,
        variableB,
        geoScope: selectedRegions.length > 0 ? selectedRegions : regions.map(r => r.code),
        timeRange: { start: '2020-01-01', end: '2024-12-31' },
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const strengthLabel = (strength: string): string => {
    const labels: Record<string, string> = {
      very_weak: 'Mycket svagt',
      weak: 'Svagt',
      moderate: 'Måttligt',
      strong: 'Starkt',
      very_strong: 'Mycket starkt',
    };
    return labels[strength] || strength;
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Korrelationsutforskare</h2>
        <p className="text-muted-foreground">
          Utforska samband mellan variabler – med full transparens om vad detta visar och inte visar.
        </p>
      </div>

      {/* MANDATORY disclaimer - always visible */}
      <div className="p-4 bg-status-warning/10 border border-status-warning/30 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-status-warning shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-status-warning">Korrelation ≠ Kausalitet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Ett statistiskt samband mellan två variabler betyder INTE att den ena orsakar den andra.
              Detta verktyg visar endast observerade korrelationer – inga orsaker, förklaringar eller rekommendationer.
            </p>
          </div>
        </div>
      </div>

      {/* Variable selection */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Variabel A</label>
          <Select value={variableA} onValueChange={setVariableA}>
            <SelectTrigger>
              <SelectValue placeholder="Välj variabel..." />
            </SelectTrigger>
            <SelectContent>
              {indicators.map((ind) => (
                <SelectItem key={ind.id} value={ind.id}>
                  {ind.nameSv}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Variabel B</label>
          <Select value={variableB} onValueChange={setVariableB}>
            <SelectTrigger>
              <SelectValue placeholder="Välj variabel..." />
            </SelectTrigger>
            <SelectContent>
              {indicators.filter(i => i.id !== variableA).map((ind) => (
                <SelectItem key={ind.id} value={ind.id}>
                  {ind.nameSv}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calculate button */}
      <Button 
        onClick={handleCalculate}
        disabled={!variableA || !variableB || isCalculating}
        className="w-full"
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        {isCalculating ? 'Beräknar...' : 'Beräkna korrelation'}
      </Button>

      {/* Result display */}
      {result && (
        <div className="space-y-4 p-6 border rounded-lg">
          {/* Correlation coefficient */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Korrelationskoefficient</p>
            <p className="text-5xl font-mono font-bold">
              {result.coefficient.toFixed(3)}
            </p>
            <p className={cn(
              'text-lg mt-2',
              result.direction === 'positive' && 'text-status-positive',
              result.direction === 'negative' && 'text-status-negative',
              result.direction === 'none' && 'text-muted-foreground'
            )}>
              {strengthLabel(result.strength)} {result.direction === 'positive' ? 'positivt' : result.direction === 'negative' ? 'negativt' : ''} samband
            </p>
          </div>
          
          {/* Statistical significance */}
          <div className="flex justify-center gap-4 text-sm">
            <span className="text-muted-foreground">
              p-värde: {result.pValue.toFixed(4)}
            </span>
            <span className={result.isSignificant ? 'text-status-positive' : 'text-muted-foreground'}>
              {result.isSignificant ? '✓ Statistiskt signifikant' : '○ Ej signifikant'}
            </span>
          </div>

          {/* MANDATORY disclaimers section */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium flex items-center gap-2">
              <Info className="h-4 w-4" />
              Vad detta INTE visar
            </h4>
            
            <div className="grid gap-2 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">Kausalitet</p>
                <p className="text-muted-foreground">
                  {result.disclaimers.correlationNotCausation && 
                    'Detta samband säger inget om orsak och verkan.'}
                </p>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">Omätade variabler</p>
                <ul className="text-muted-foreground">
                  {result.disclaimers.unmeasuredVariables.map((v, i) => (
                    <li key={i}>• {v}</li>
                  ))}
                </ul>
              </div>
              
              {result.disclaimers.confoundingFactors.length > 0 && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">Möjliga confounders</p>
                  <ul className="text-muted-foreground">
                    {result.disclaimers.confoundingFactors.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">Tidsbegränsning</p>
                <p className="text-muted-foreground">
                  {result.disclaimers.temporalLimitations}
                </p>
              </div>
            </div>
          </div>

          {/* Source signature */}
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Källsignatur</h4>
            <div className="text-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Inkluderade källor:</span>
                <span>{result.sourceSignature.includedSources.length}</span>
              </div>
              {result.sourceSignature.excludedSources.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Exkluderade källor:</span>
                  <span className="text-status-warning">{result.sourceSignature.excludedSources.length}</span>
                </div>
              )}
              {result.sourceSignature.exclusionImpact?.isSignificant && (
                <div className="p-2 bg-status-warning/10 rounded text-status-warning">
                  ⚠ Exkludering påverkar resultatet med {Math.abs(result.sourceSignature.exclusionImpact.differencePercent).toFixed(1)}%
                </div>
              )}
            </div>
          </div>

          {/* Verification */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" className="flex-1">
              <QrCode className="h-4 w-4 mr-2" />
              Verifiera
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Ladda ner data
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
