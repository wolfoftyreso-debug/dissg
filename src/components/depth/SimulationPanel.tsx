import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  PlayCircle,
  RotateCcw,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  History,
} from 'lucide-react';
import { SIMULATION_CONFIG, SIMULATION_EXAMPLES } from '@/config/depthModelConfig';

interface SimulationPanelProps {
  onSimulate?: (changes: SimulationChange[]) => void;
}

interface SimulationChange {
  indicator: string;
  originalValue: number;
  newValue: number;
  changePercent: number;
}

interface IndicatorAdjustment {
  id: string;
  name: string;
  currentValue: number;
  unit: string;
  adjustment: number;
}

const DEMO_INDICATORS: IndicatorAdjustment[] = [
  { id: 'working_age_functional', name: 'Arbetsför befolkning', currentValue: 70.6, unit: '%', adjustment: 0 },
  { id: 'employment_rate', name: 'Sysselsättningsgrad', currentValue: 68.2, unit: '%', adjustment: 0 },
  { id: 'productivity_per_hour', name: 'Produktivitet/timme', currentValue: 582, unit: 'SEK', adjustment: 0 },
  { id: 'life_expectancy', name: 'Medellivslängd', currentValue: 83.1, unit: 'år', adjustment: 0 },
  { id: 'violent_crime_rate', name: 'Våldsbrott per 100k', currentValue: 127, unit: '/100k', adjustment: 0 },
];

export function SimulationPanel({ onSimulate: _onSimulate }: SimulationPanelProps) {
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<{ masterIndexChange: number; affectedRegions: number } | null>(null);

  const handleAdjustment = (indicatorId: string, value: number) => {
    setAdjustments(prev => ({ ...prev, [indicatorId]: value }));
    setResults(null);
  };

  const resetAll = () => {
    setAdjustments({});
    setResults(null);
  };

  const runSimulation = () => {
    setIsSimulating(true);
    // Demo: beräkna simulerade effekter
    setTimeout(() => {
      const totalChange = Object.values(adjustments).reduce((sum, adj) => sum + adj, 0);
      setResults({
        masterIndexChange: totalChange * 0.15, // Demo-koefficient
        affectedRegions: Math.abs(Math.round(totalChange * 2.1)),
      });
      setIsSimulating(false);
    }, 800);
  };

  const hasChanges = Object.values(adjustments).some(v => v !== 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Simulering
            </CardTitle>
            <CardDescription>
              Utforska hur förändringar påverkar helheten
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Simulerat
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Disclaimer */}
        <Alert className="bg-amber-500/5 border-amber-500/20">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-600">
            {SIMULATION_CONFIG.disclaimer}
          </AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground">
            Justeringar nedan påverkar endast denna vy och lagras inte.
          </AlertDescription>
        </Alert>

        {/* Indicator Sliders */}
        <div className="space-y-4">
          {DEMO_INDICATORS.map((indicator) => {
            const adjustment = adjustments[indicator.id] || 0;
            const newValue = indicator.currentValue * (1 + adjustment / 100);
            
            return (
              <div key={indicator.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{indicator.name}</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                      {indicator.currentValue} {indicator.unit}
                    </span>
                    {adjustment !== 0 && (
                      <>
                        <span className="text-muted-foreground">→</span>
                        <span className={adjustment > 0 ? 'text-[hsl(var(--status-positive))]' : 'text-[hsl(var(--status-critical))]'}>
                          {newValue.toFixed(1)} {indicator.unit}
                        </span>
                        <Badge 
                          variant={adjustment > 0 ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {adjustment > 0 ? '+' : ''}{adjustment}%
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
                <Slider
                  value={[adjustment]}
                  onValueChange={([value]) => handleAdjustment(indicator.id, value)}
                  min={-SIMULATION_CONFIG.maxAdjustment}
                  max={SIMULATION_CONFIG.maxAdjustment}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>-{SIMULATION_CONFIG.maxAdjustment}%</span>
                  <span>0</span>
                  <span>+{SIMULATION_CONFIG.maxAdjustment}%</span>
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Quick Examples */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Snabbsimuleringar</p>
          <div className="flex flex-wrap gap-2">
            {SIMULATION_EXAMPLES.map((example) => (
              <Button
                key={example.id}
                variant="outline"
                size="sm"
                onClick={() => handleAdjustment(example.indicator, example.change)}
                className="text-xs"
              >
                {example.title}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={resetAll}
            disabled={!hasChanges}
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Återställ
          </Button>
          <Button
            onClick={runSimulation}
            disabled={!hasChanges || isSimulating}
            className="flex-1"
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            {isSimulating ? 'Beräknar...' : 'Simulera'}
          </Button>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium flex items-center gap-2">
              <History className="h-4 w-4" />
              Simulerade effekter
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Masterindex-förändring</p>
                <p className="text-2xl font-bold flex items-center gap-1">
                  {results.masterIndexChange > 0 ? (
                    <TrendingUp className="h-5 w-5 text-status-positive" />
                  ) : results.masterIndexChange < 0 ? (
                    <TrendingDown className="h-5 w-5 text-status-critical" />
                  ) : (
                    <Minus className="h-5 w-5 text-muted-foreground" />
                  )}
                  {results.masterIndexChange > 0 ? '+' : ''}{results.masterIndexChange.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Påverkade regioner</p>
                <p className="text-2xl font-bold">
                  {results.affectedRegions}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic">
              Baserat på historiska känsligheter. Faktisk effekt kan variera.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
