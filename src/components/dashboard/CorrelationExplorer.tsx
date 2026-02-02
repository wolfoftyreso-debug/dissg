// Korrelationsutforskare med disciplinerade skyddsräcken
// "Korrelation ≠ orsak" visas alltid

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Info, HelpCircle, ArrowRightLeft, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { 
  analyzeCorrelation,
  CORRELATION_DISCLAIMERS,
  CORRELATION_THRESHOLDS,
  CORRELATION_UI_CONFIG,
  type CorrelationMethod,
  type CorrelationResult
} from '@/config/correlationConfig';
import { cn } from '@/lib/utils';

interface KPIOption {
  id: string;
  name: string;
  category: string;
  values: number[];
  dates: string[];
}

interface CorrelationExplorerProps {
  kpiOptions: KPIOption[];
}

function StrengthIndicator({ strength }: { strength: CorrelationResult['interpretation']['strength'] }) {
  const colorClass = CORRELATION_UI_CONFIG.strengthColors[strength];
  const bars = {
    none: 0,
    weak: 1,
    moderate: 2,
    strong: 3,
    very_strong: 4,
  }[strength];

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className={cn(
            "w-2 h-4 rounded-sm",
            i <= bars ? colorClass.replace('text-', 'bg-') : "bg-muted"
          )}
        />
      ))}
    </div>
  );
}

function MethodologyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 text-xs">
          <HelpCircle className="h-3 w-3" />
          Så här beräknades detta
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Metodik för korrelationsanalys</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium mb-1">Pearson-korrelation</h4>
            <p className="text-muted-foreground">
              Mäter linjärt samband mellan två variabler. Värde mellan -1 och 1.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Spearman-korrelation</h4>
            <p className="text-muted-foreground">
              Mäter monotont samband baserat på rangordning. Mer robust mot extremvärden.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Tidsförskjutning (lag)</h4>
            <p className="text-muted-foreground">
              Testar om en variabel leder den andra med en viss fördröjning.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Stabilitet</h4>
            <p className="text-muted-foreground">
              Mäter om korrelationen är konsekvent över tid genom att testa olika tidsperioder.
            </p>
          </div>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {CORRELATION_DISCLAIMERS.primary}
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CorrelationExplorer({ kpiOptions }: CorrelationExplorerProps) {
  const [kpi1Id, setKpi1Id] = useState<string>('');
  const [kpi2Id, setKpi2Id] = useState<string>('');
  const [method, setMethod] = useState<CorrelationMethod>('pearson');
  const [maxLag, setMaxLag] = useState<number>(12);
  const [result, setResult] = useState<CorrelationResult | null>(null);

  const kpi1 = kpiOptions.find(k => k.id === kpi1Id);
  const kpi2 = kpiOptions.find(k => k.id === kpi2Id);

  const canAnalyze = kpi1 && kpi2 && kpi1.id !== kpi2.id;

  const handleAnalyze = () => {
    if (!kpi1 || !kpi2) return;

    const analysis = analyzeCorrelation({
      kpiId1: kpi1.id,
      kpiId2: kpi2.id,
      values1: kpi1.values,
      values2: kpi2.values,
      dates: kpi1.dates,
    }, method);

    setResult(analysis);
  };

  return (
    <div className="space-y-6">
      {/* Obligatorisk disclaimer - alltid synlig */}
      <Alert className="border-chart-4/50 bg-chart-4/5">
        <AlertTriangle className="h-4 w-4 text-chart-4" />
        <AlertDescription className="text-sm">
          <strong>Viktig påminnelse:</strong> {CORRELATION_DISCLAIMERS.primary}
        </AlertDescription>
      </Alert>

      {/* Val av KPI:er */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Välj indikatorer att jämföra
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Första indikatorn</label>
              <Select value={kpi1Id} onValueChange={setKpi1Id}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj indikator..." />
                </SelectTrigger>
                <SelectContent>
                  {kpiOptions.map(kpi => (
                    <SelectItem key={kpi.id} value={kpi.id} disabled={kpi.id === kpi2Id}>
                      {kpi.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Andra indikatorn</label>
              <Select value={kpi2Id} onValueChange={setKpi2Id}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj indikator..." />
                </SelectTrigger>
                <SelectContent>
                  {kpiOptions.map(kpi => (
                    <SelectItem key={kpi.id} value={kpi.id} disabled={kpi.id === kpi1Id}>
                      {kpi.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Avancerade inställningar */}
          <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
            <div className="space-y-2">
              <label className="text-sm font-medium">Metod</label>
              <Select value={method} onValueChange={(v) => setMethod(v as CorrelationMethod)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pearson">Pearson (linjärt samband)</SelectItem>
                  <SelectItem value="spearman">Spearman (rangordning)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Max tidsförskjutning: {maxLag} månader
              </label>
              <Slider
                value={[maxLag]}
                onValueChange={([v]) => setMaxLag(v)}
                min={1}
                max={24}
                step={1}
              />
            </div>
          </div>

          <Button 
            onClick={handleAnalyze} 
            disabled={!canAnalyze}
            className="w-full"
          >
            Analysera korrelation
          </Button>
        </CardContent>
      </Card>

      {/* Resultat */}
      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Resultat</CardTitle>
              <MethodologyDialog />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Huvudresultat */}
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-4 mb-4">
                <StrengthIndicator strength={result.interpretation.strength} />
                <span className={cn(
                  "text-4xl font-bold tabular-nums",
                  CORRELATION_UI_CONFIG.strengthColors[result.interpretation.strength]
                )}>
                  {result.coefficient.toFixed(2)}
                </span>
              </div>
              <p className="text-lg font-medium">{result.interpretation.label}</p>
              <p className="text-sm text-muted-foreground">
                {result.interpretation.description}
              </p>
            </div>

            {/* Detaljer */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Clock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Tidsförskjutning</p>
                <p className="text-lg font-semibold">
                  {result.lag === 0 ? 'Ingen' : `${Math.abs(result.lag)} mån`}
                </p>
                {result.lag !== 0 && (
                  <p className="text-xs text-muted-foreground">
                    {result.lag > 0 ? 'Första leder' : 'Andra leder'}
                  </p>
                )}
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <TrendingUp className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Stabilitet</p>
                <p className="text-lg font-semibold">
                  {(result.stability * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {result.stability >= 0.7 ? 'Stabil' : result.stability >= 0.4 ? 'Varierande' : 'Instabil'}
                </p>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Info className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Konfidensintervall</p>
                <p className="text-lg font-semibold tabular-nums">
                  [{result.confidenceInterval.lower.toFixed(2)}, {result.confidenceInterval.upper.toFixed(2)}]
                </p>
                <p className="text-xs text-muted-foreground">95% konfidensintervall</p>
              </div>
            </div>

            {/* Varningar */}
            {result.warnings.length > 0 && (
              <div className="space-y-2">
                {result.warnings.map((warning, i) => (
                  <Alert key={i} variant="default" className="bg-muted/50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{warning}</AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {/* Statistik */}
            <div className="text-xs text-muted-foreground border-t pt-4 space-y-1">
              <p>Metod: {method === 'pearson' ? 'Pearson' : 'Spearman'}</p>
              <p>Datapunkter: {result.sampleSize}</p>
              <p>P-värde: {result.pValue < 0.001 ? '<0.001' : result.pValue.toFixed(3)}</p>
              {result.pValue > CORRELATION_THRESHOLDS.significanceLevel && (
                <Badge variant="outline" className="text-chart-5 border-chart-5">
                  Ej statistiskt signifikant
                </Badge>
              )}
            </div>

            {/* Påminnelse */}
            <Alert className="border-muted bg-muted/30">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {CORRELATION_DISCLAIMERS.secondary}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
