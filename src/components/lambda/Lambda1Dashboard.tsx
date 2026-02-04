/**
 * Lambda 1.0 Dashboard
 * 
 * Global Optimal Balance Index (GOBI) visualization.
 * Like engine diagnostics - shows system balance across 8 axes.
 */

import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  calculateLambda1,
  simulateLambdaChange,
  calculateRequiredChanges,
  getLambdaBand,
  getMockLambdaResult,
  LAMBDA_AXES,
  LAMBDA_INTERPRETATION_BANDS,
  MOCK_COUNTRY_DATA,
  type Lambda1Result,
  type LambdaAxis,
  type AxisValue,
} from '@/lib/lambda/lambda-1.0';

// =============================================================================
// LAMBDA GAUGE COMPONENT
// =============================================================================

function LambdaGauge({ result }: { result: Lambda1Result }) {
  const { lambda, band, confidenceInterval } = result;
  
  // Convert lambda to percentage for gauge (0.7-1.3 → 0-100)
  const percentage = ((lambda - 0.7) / 0.6) * 100;
  
  return (
    <div className="p-6 rounded-lg border-2" style={{ borderColor: band.color, backgroundColor: `${band.color}10` }}>
      <div className="text-center">
        <div className="text-xs text-muted-foreground font-mono mb-1">LAMBDA 1.0</div>
        <div className="text-5xl font-mono font-bold" style={{ color: band.color }}>
          λ = {lambda.toFixed(3)}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          ±{(result.uncertainty).toFixed(3)} ({confidenceInterval.lower.toFixed(3)} – {confidenceInterval.upper.toFixed(3)})
        </div>
        
        {/* Interpretation badge */}
        <div className="mt-3">
          <Badge 
            className="font-mono text-sm px-4 py-1"
            style={{ backgroundColor: band.color, color: 'white' }}
          >
            {band.label.sv}
          </Badge>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2 max-w-sm mx-auto">
          {band.description.sv}
        </div>
      </div>

      {/* Visual gauge */}
      <div className="mt-6">
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          {/* Band colors */}
          {LAMBDA_INTERPRETATION_BANDS.map((b) => {
            const left = ((b.min - 0.7) / 0.6) * 100;
            const width = ((b.max - b.min) / 0.6) * 100;
            return (
              <div
                key={b.interpretation}
                className="absolute top-0 h-full"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  backgroundColor: b.color,
                  opacity: 0.3,
                }}
              />
            );
          })}
          
          {/* Current position */}
          <div
            className="absolute top-0 w-1 h-full rounded-full shadow-lg"
            style={{
              left: `${Math.max(0, Math.min(100, percentage))}%`,
              backgroundColor: band.color,
              transform: 'translateX(-50%)',
            }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0.70</span>
          <span>0.85</span>
          <span>1.00</span>
          <span>1.15</span>
          <span>1.30</span>
        </div>
      </div>

      {/* GEDI Alert */}
      {result.triggersGEDIMaster && (
        <div className="mt-4 p-3 rounded bg-red-500/20 border border-red-500 text-sm">
          <div className="font-semibold text-red-500">⚠️ GEDI-MASTER AKTIV</div>
          <div className="text-xs text-muted-foreground mt-1">
            Lambda utanför optimalt intervall. {result.activeGEDICodes.length} GEDI-koder triggas.
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// AXIS CARD COMPONENT
// =============================================================================

function AxisCard({ 
  axisValue, 
  onClick,
  isSelected 
}: { 
  axisValue: AxisValue;
  onClick: () => void;
  isSelected: boolean;
}) {
  const axisDef = LAMBDA_AXES[axisValue.axis];
  const deviationColor = axisValue.deviation > 0.05 ? 'text-purple-500' :
                          axisValue.deviation < -0.05 ? 'text-orange-500' :
                          'text-blue-500';
  
  return (
    <div 
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isSelected 
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
          : 'border-muted hover:border-primary/50'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{axisDef.icon}</span>
          <div>
            <div className="font-semibold">{axisDef.name.sv}</div>
            <div className="text-xs text-muted-foreground">{axisDef.code}</div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`font-mono text-xl font-bold ${deviationColor}`}>
            {axisValue.value.toFixed(3)}
          </div>
          <div className="text-xs text-muted-foreground">
            {axisValue.deviation >= 0 ? '+' : ''}{axisValue.deviation.toFixed(3)}
          </div>
        </div>
      </div>
      
      {/* Progress bar showing distance from 1.0 */}
      <div className="mt-3">
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="absolute top-0 h-full bg-blue-500 opacity-30"
            style={{ left: '50%', width: '0', borderLeft: '2px solid hsl(var(--primary))' }}
          />
          <div
            className={`absolute top-0 h-full rounded-full ${
              axisValue.value >= 1.0 ? 'bg-purple-500' : 'bg-orange-500'
            }`}
            style={{
              left: axisValue.value < 1.0 
                ? `${((axisValue.value - 0.7) / 0.6) * 100}%`
                : '50%',
              width: `${Math.abs(axisValue.value - 1.0) / 0.6 * 100}%`,
            }}
          />
        </div>
      </div>
      
      {axisValue.isPrimaryDriver && (
        <Badge variant="secondary" className="mt-2 text-xs">
          Primär drivkraft #{axisValue.rankAmongAxes}
        </Badge>
      )}
    </div>
  );
}

// =============================================================================
// AXIS DETAIL PANEL
// =============================================================================

function AxisDetailPanel({ axisValue }: { axisValue: AxisValue }) {
  const axisDef = LAMBDA_AXES[axisValue.axis];
  
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border bg-muted/30">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{axisDef.icon}</span>
          <div>
            <div className="font-semibold text-lg">{axisDef.name.sv}</div>
            <div className="text-sm text-muted-foreground">{axisDef.description.sv}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 rounded border text-center">
          <div className="text-xs text-muted-foreground">Värde</div>
          <div className="font-mono text-xl font-bold">{axisValue.value.toFixed(3)}</div>
        </div>
        <div className="p-3 rounded border text-center">
          <div className="text-xs text-muted-foreground">Optimalt</div>
          <div className="font-mono text-xl">1.000</div>
        </div>
        <div className="p-3 rounded border text-center">
          <div className="text-xs text-muted-foreground">Avvikelse</div>
          <div className={`font-mono text-xl font-bold ${
            axisValue.deviation > 0 ? 'text-purple-500' : 
            axisValue.deviation < 0 ? 'text-orange-500' : 'text-blue-500'
          }`}>
            {axisValue.deviation >= 0 ? '+' : ''}{axisValue.deviation.toFixed(3)}
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <div className="font-mono text-sm font-semibold mb-2">UNDERLIGGANDE INDIKATORER</div>
        <div className="space-y-2">
          {axisValue.underlyingIndicators.map((ind) => (
            <div key={ind.code} className="flex justify-between items-center p-2 rounded bg-muted/30">
              <span className="text-sm font-mono">{ind.code}</span>
              <div className="flex items-center gap-2">
                <Progress value={ind.value} className="w-20 h-2" />
                <span className="text-sm font-mono w-12 text-right">{ind.value.toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {axisDef.relatedGEDICodes.length > 0 && (
        <>
          <Separator />
          <div>
            <div className="font-mono text-sm font-semibold mb-2">RELATERADE GEDI-KODER</div>
            <div className="flex gap-2 flex-wrap">
              {axisDef.relatedGEDICodes.map(code => (
                <Badge key={code} variant="outline" className="font-mono">{code}</Badge>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// =============================================================================
// SIMULATION PANEL (PRO FEATURE)
// =============================================================================

function SimulationPanel({ 
  result, 
  isPro 
}: { 
  result: Lambda1Result;
  isPro: boolean;
}) {
  const [changes, setChanges] = useState<Partial<Record<LambdaAxis, number>>>({});
  
  const simulatedResult = useMemo(() => {
    if (Object.keys(changes).length === 0) return null;
    return simulateLambdaChange(result, { name: 'Custom', axisChanges: changes });
  }, [result, changes]);

  const requiredForOptimal = useMemo(() => {
    return calculateRequiredChanges(result, 1.0);
  }, [result]);

  if (!isPro) {
    return (
      <div className="p-6 rounded-lg border-2 border-dashed border-muted text-center">
        <div className="text-4xl mb-3">🔒</div>
        <div className="font-semibold">PRO-funktion: Simulering</div>
        <div className="text-sm text-muted-foreground mt-1">
          Uppgradera för att köra "what-if" scenarier:
        </div>
        <ul className="text-xs text-muted-foreground mt-2 space-y-1">
          <li>• "Vad händer om vi höjer EDUC +5%?"</li>
          <li>• "Vad krävs för Lambda 1.0 år 2035?"</li>
          <li>• Exportera API</li>
          <li>• Generera PDF-rapport</li>
        </ul>
        <Button className="mt-4" size="sm">Uppgradera till PRO</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="font-mono text-sm font-semibold">SCENARIOSIMULERING</div>
      
      {/* Sliders for each axis */}
      <div className="space-y-3">
        {result.axes.map(av => (
          <div key={av.axis} className="flex items-center gap-3">
            <span className="w-16 text-sm font-mono">{av.axis}</span>
            <Slider
              value={[changes[av.axis] ?? 0]}
              min={-20}
              max={20}
              step={1}
              onValueChange={(v) => setChanges(c => ({ ...c, [av.axis]: v[0] }))}
              className="flex-1"
            />
            <span className="w-12 text-sm font-mono text-right">
              {(changes[av.axis] ?? 0) >= 0 ? '+' : ''}{changes[av.axis] ?? 0}
            </span>
          </div>
        ))}
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setChanges({})}
        disabled={Object.keys(changes).length === 0}
      >
        Återställ
      </Button>

      {simulatedResult && (
        <div className="p-4 rounded-lg border bg-muted/30">
          <div className="text-xs text-muted-foreground mb-1">SIMULERAT RESULTAT</div>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-muted-foreground">Nu: </span>
              <span className="font-mono font-bold">{result.lambda.toFixed(3)}</span>
            </div>
            <span className="text-muted-foreground">→</span>
            <div>
              <span className="text-muted-foreground">Simulerat: </span>
              <span className="font-mono font-bold" style={{ color: simulatedResult.band.color }}>
                {simulatedResult.lambda.toFixed(3)}
              </span>
            </div>
            <Badge style={{ backgroundColor: simulatedResult.band.color, color: 'white' }}>
              {simulatedResult.band.label.sv}
            </Badge>
          </div>
        </div>
      )}

      <Separator />

      <div>
        <div className="font-mono text-sm font-semibold mb-2">KRÄVS FÖR λ = 1.0</div>
        <div className="space-y-1">
          {Object.entries(requiredForOptimal).map(([axis, change]) => (
            <div key={axis} className="flex justify-between text-sm">
              <span className="font-mono">{axis}</span>
              <span className={`font-mono ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change >= 0 ? '+' : ''}{change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN DASHBOARD
// =============================================================================

export function Lambda1Dashboard() {
  const [geoCode, setGeoCode] = useState('SE');
  const [selectedAxis, setSelectedAxis] = useState<LambdaAxis | null>(null);
  const [isPro, setIsPro] = useState(true);
  const [view, setView] = useState<'overview' | 'simulation'>('overview');

  const result = useMemo(() => getMockLambdaResult(geoCode), [geoCode]);
  const selectedAxisValue = result.axes.find(av => av.axis === selectedAxis);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-mono text-lg font-semibold">
              LAMBDA 1.0 – Global Optimal Balance Index
            </h1>
            <p className="text-xs text-muted-foreground">
              Geometriskt medel av 8 axlar • λ = 1.0 är optimal balans
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Select value={geoCode} onValueChange={setGeoCode}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(MOCK_COUNTRY_DATA).map(code => (
                  <SelectItem key={code} value={code}>{code}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant={isPro ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPro(!isPro)}
            >
              {isPro ? 'PRO' : 'FREE'}
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Button 
            variant={view === 'overview' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setView('overview')}
          >
            Översikt
          </Button>
          <Button 
            variant={view === 'simulation' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setView('simulation')}
          >
            Simulering
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Panel - Lambda Gauge & Axes */}
        <div className="w-1/2 border-r overflow-hidden flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              <LambdaGauge result={result} />
              
              {/* Trend */}
              <div className="p-3 rounded border bg-muted/30">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Trend</span>
                  <Badge variant={
                    result.trend === 'improving' ? 'default' :
                    result.trend === 'declining' ? 'destructive' : 'secondary'
                  }>
                    {result.trend === 'improving' ? '↑ Förbättras' :
                     result.trend === 'declining' ? '↓ Försämras' : '→ Stabil'}
                  </Badge>
                </div>
                {result.lambda1yAgo && (
                  <div className="text-xs text-muted-foreground mt-1">
                    1 år sedan: λ = {result.lambda1yAgo.toFixed(3)} 
                    ({result.changeRate && result.changeRate >= 0 ? '+' : ''}{result.changeRate?.toFixed(3)})
                  </div>
                )}
              </div>

              <Separator />

              {/* Axis Grid */}
              <div>
                <div className="font-mono text-sm font-semibold mb-2">8 KÄRNAXLAR</div>
                <div className="grid grid-cols-2 gap-2">
                  {result.axes.map(av => (
                    <AxisCard
                      key={av.axis}
                      axisValue={av}
                      onClick={() => setSelectedAxis(av.axis)}
                      isSelected={selectedAxis === av.axis}
                    />
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 overflow-hidden">
          <ScrollArea className="h-full p-4">
            {view === 'simulation' ? (
              <SimulationPanel result={result} isPro={isPro} />
            ) : selectedAxisValue ? (
              <AxisDetailPanel axisValue={selectedAxisValue} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <div className="text-4xl mb-4">👈</div>
                  <div className="font-mono">Välj en axel</div>
                  <div className="text-sm mt-2">för att se detaljer</div>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t text-xs text-muted-foreground flex justify-between">
        <span>Metodversion: {result.methodologyVersion} • Beräknad: {new Date(result.calculatedAt).toLocaleString('sv-SE')}</span>
        <span>Datakvalitet: {result.dataCoverage.toFixed(0)}%</span>
      </div>
    </div>
  );
}

export default Lambda1Dashboard;
