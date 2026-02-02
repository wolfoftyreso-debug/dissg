/**
 * FormulaExplainer — Visar matematiska formler med förklaring
 * 
 * Renderar formler med:
 * - LaTeX-liknande notation
 * - Variabelförklaringar
 * - Tolkningstabell
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Calculator, Info } from 'lucide-react';
import { FORMULA_DOCUMENTATION, type AnalysisResult, STATUS_COLORS } from '@/config/analysisRulesEngine';

interface FormulaExplainerProps {
  formulaKey: keyof typeof FORMULA_DOCUMENTATION;
  currentValues?: Record<string, number>;
  result?: number;
  className?: string;
}

export function FormulaExplainer({ 
  formulaKey, 
  currentValues,
  result,
  className 
}: FormulaExplainerProps) {
  const doc = FORMULA_DOCUMENTATION[formulaKey];

  return (
    <Card className={cn('bg-card/50 border-border/50', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calculator size={16} />
          {doc.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formel */}
        <div className="p-3 bg-muted rounded-lg font-mono text-center text-lg">
          {doc.formula}
        </div>

        {/* Variabler */}
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Variabler
          </h4>
          <div className="grid gap-1">
            {Object.entries(doc.variables).map(([symbol, description]) => (
              <div key={symbol} className="flex items-center gap-2 text-sm">
                <code className="px-1.5 py-0.5 bg-muted rounded font-mono text-xs">
                  {symbol}
                </code>
                <span className="text-muted-foreground">{description}</span>
                {currentValues?.[symbol] !== undefined && (
                  <Badge variant="secondary" className="ml-auto font-mono text-xs">
                    {currentValues[symbol].toFixed(2)}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Resultat */}
        {result !== undefined && (
          <div className="p-2 bg-primary/10 rounded border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Resultat:</span>
              <span className="font-mono font-bold text-lg">{result.toFixed(3)}</span>
            </div>
          </div>
        )}

        {/* Tolkning */}
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Tolkning
          </h4>
          <div className="grid gap-1">
            {Object.entries(doc.interpretation).map(([range, meaning]) => (
              <div key={range} className="flex items-center gap-2 text-sm">
                <code className="px-1.5 py-0.5 bg-muted rounded font-mono text-xs min-w-[80px]">
                  {range}
                </code>
                <span className="text-muted-foreground">{meaning}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Kompakt formelvisning för tooltips
interface CompactFormulaProps {
  formula: string;
  variables?: Record<string, string | number>;
}

export function CompactFormula({ formula, variables }: CompactFormulaProps) {
  return (
    <div className="space-y-2">
      <div className="font-mono text-sm bg-muted p-2 rounded">
        {formula}
      </div>
      {variables && Object.keys(variables).length > 0 && (
        <div className="text-xs space-y-0.5">
          {Object.entries(variables).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <code>{key}</code>
              <span className="font-mono">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Threshold visualizer
interface ThresholdVisualizerProps {
  value: number;
  greenThreshold: number;
  yellowThreshold: number;
  redThreshold: number;
  inverted: boolean;
  unit: string;
  className?: string;
}

export function ThresholdVisualizer({
  value,
  greenThreshold,
  yellowThreshold,
  redThreshold,
  inverted,
  unit,
  className
}: ThresholdVisualizerProps) {
  // Beräkna range
  const min = inverted 
    ? Math.min(value * 0.5, greenThreshold * 0.8)
    : Math.min(value * 0.5, redThreshold * 0.8);
  const max = inverted
    ? Math.max(value * 1.2, redThreshold * 1.2)
    : Math.max(value * 1.2, greenThreshold * 1.2);
  
  const range = max - min;
  
  const getPosition = (v: number) => ((v - min) / range) * 100;
  
  const valuePos = getPosition(value);
  const greenPos = getPosition(greenThreshold);
  const yellowPos = getPosition(yellowThreshold);
  const redPos = getPosition(redThreshold);

  // Bestäm nuvarande status
  let currentColor: string;
  if (inverted) {
    if (value <= greenThreshold) currentColor = STATUS_COLORS.green.hex;
    else if (value <= yellowThreshold) currentColor = STATUS_COLORS.yellow.hex;
    else currentColor = STATUS_COLORS.red.hex;
  } else {
    if (value >= greenThreshold) currentColor = STATUS_COLORS.green.hex;
    else if (value >= yellowThreshold) currentColor = STATUS_COLORS.yellow.hex;
    else currentColor = STATUS_COLORS.red.hex;
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Visuell bar */}
      <div className="relative h-6 bg-muted rounded overflow-hidden">
        {/* Zoner */}
        {inverted ? (
          <>
            <div 
              className="absolute inset-y-0 left-0 bg-status-positive/30"
              style={{ width: `${greenPos}%` }}
            />
            <div 
              className="absolute inset-y-0 bg-status-warning/30"
              style={{ left: `${greenPos}%`, width: `${yellowPos - greenPos}%` }}
            />
            <div 
              className="absolute inset-y-0 right-0 bg-status-critical/30"
              style={{ left: `${yellowPos}%` }}
            />
          </>
        ) : (
          <>
            <div 
              className="absolute inset-y-0 left-0 bg-status-critical/30"
              style={{ width: `${yellowPos}%` }}
            />
            <div 
              className="absolute inset-y-0 bg-status-warning/30"
              style={{ left: `${yellowPos}%`, width: `${greenPos - yellowPos}%` }}
            />
            <div 
              className="absolute inset-y-0 right-0 bg-status-positive/30"
              style={{ left: `${greenPos}%` }}
            />
          </>
        )}

        {/* Tröskelmarkörer */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-status-positive"
          style={{ left: `${greenPos}%` }}
        />
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-status-warning"
          style={{ left: `${yellowPos}%` }}
        />

        {/* Värdemarkör */}
        <div 
          className="absolute top-0 bottom-0 w-1 rounded"
          style={{ 
            left: `${valuePos}%`, 
            backgroundColor: currentColor,
            transform: 'translateX(-50%)'
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground font-mono">
        <span>{min.toFixed(1)} {unit}</span>
        <span className="font-bold" style={{ color: currentColor }}>
          {value.toFixed(1)} {unit}
        </span>
        <span>{max.toFixed(1)} {unit}</span>
      </div>

      {/* Tröskelinfo */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-status-positive" />
          <span>≥{greenThreshold} {unit}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-status-warning" />
          <span>≥{yellowThreshold} {unit}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-status-critical" />
          <span>&lt;{yellowThreshold} {unit}</span>
        </div>
      </div>
    </div>
  );
}

// Tabell med alla trösklar
interface ThresholdTableProps {
  thresholds: Record<string, {
    target: number;
    greenThreshold: number;
    yellowThreshold: number;
    redThreshold: number;
    unit: string;
    inverted: boolean;
  }>;
  className?: string;
}

export function ThresholdTable({ thresholds, className }: ThresholdTableProps) {
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>KPI</TableHead>
          <TableHead className="text-center">Mål</TableHead>
          <TableHead className="text-center text-status-positive">🟢 Grön</TableHead>
          <TableHead className="text-center text-status-warning">🟡 Gul</TableHead>
          <TableHead className="text-center text-status-critical">🔴 Röd</TableHead>
          <TableHead className="text-center">Typ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(thresholds).map(([id, config]) => (
          <TableRow key={id}>
            <TableCell className="font-medium">{id}</TableCell>
            <TableCell className="text-center font-mono">
              {config.target} {config.unit}
            </TableCell>
            <TableCell className="text-center font-mono">
              {config.inverted ? '≤' : '≥'}{config.greenThreshold}
            </TableCell>
            <TableCell className="text-center font-mono">
              {config.inverted ? '≤' : '≥'}{config.yellowThreshold}
            </TableCell>
            <TableCell className="text-center font-mono">
              {config.inverted ? '>' : '<'}{config.yellowThreshold}
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="outline" className="text-xs">
                {config.inverted ? 'Lägre bättre' : 'Högre bättre'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
