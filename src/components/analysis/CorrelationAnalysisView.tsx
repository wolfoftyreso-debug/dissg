import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CorrelationMatrix } from './CorrelationMatrix';
import { CorrelationScatterPlot } from './CorrelationScatterPlot';
import { 
  buildCorrelationMatrix,
  TimeSeriesPoint,
  CorrelationMatrix as CorrelationMatrixType
} from '@/lib/analysis/correlationAnalysis';
import { TrendingUp, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface KPITimeSeriesData {
  id: string;
  name: string;
  unit?: string;
  data: TimeSeriesPoint[];
}

interface CorrelationAnalysisViewProps {
  availableKpis: KPITimeSeriesData[];
  onClose?: () => void;
}

export function CorrelationAnalysisView({ 
  availableKpis,
  onClose 
}: CorrelationAnalysisViewProps) {
  const [selectedKpis, setSelectedKpis] = useState<string[]>(() => 
    availableKpis.slice(0, 4).map(k => k.id)
  );
  const [selectedPair, setSelectedPair] = useState<{ a: string; b: string } | null>(null);

  const toggleKpi = (kpiId: string) => {
    setSelectedKpis(prev => {
      if (prev.includes(kpiId)) {
        return prev.filter(id => id !== kpiId);
      }
      if (prev.length >= 8) {
        // Max 8 KPIs for readable matrix
        return prev;
      }
      return [...prev, kpiId];
    });
  };

  const correlationMatrix = useMemo((): CorrelationMatrixType | null => {
    if (selectedKpis.length < 2) return null;
    
    const kpiData = new Map<string, TimeSeriesPoint[]>();
    selectedKpis.forEach(kpiId => {
      const kpi = availableKpis.find(k => k.id === kpiId);
      if (kpi) {
        kpiData.set(kpiId, kpi.data);
      }
    });
    
    return buildCorrelationMatrix(kpiData);
  }, [selectedKpis, availableKpis]);

  const kpiNames = useMemo(() => {
    const map = new Map<string, string>();
    availableKpis.forEach(kpi => map.set(kpi.id, kpi.name));
    return map;
  }, [availableKpis]);

  const selectedPairData = useMemo(() => {
    if (!selectedPair) return null;
    const kpiA = availableKpis.find(k => k.id === selectedPair.a);
    const kpiB = availableKpis.find(k => k.id === selectedPair.b);
    if (!kpiA || !kpiB) return null;
    return { kpiA, kpiB };
  }, [selectedPair, availableKpis]);

  // Find strongest correlations
  const topCorrelations = useMemo(() => {
    if (!correlationMatrix) return [];
    return correlationMatrix.results
      .filter(r => r.strength !== 'none')
      .sort((a, b) => Math.abs(b.coefficient) - Math.abs(a.coefficient))
      .slice(0, 5);
  }, [correlationMatrix]);

  return (
    <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Korrelationsanalys</h2>
            <p className="text-sm text-muted-foreground">
              Utforska samband mellan valda KPI:er
            </p>
          </div>
        </div>
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px]"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Disclaimer card */}
      <Card className="bg-warning/10 border-warning/20">
        <CardContent className="py-3 flex items-start gap-3">
          <Info className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground">
              Korrelation ≠ Kausalitet
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Statistiska samband visar inte orsak-verkan. Använd för hypotesgenerering, inte slutsatser.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        {/* KPI Selector */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Välj KPI:er
              <Badge variant="outline">{selectedKpis.length}/8</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px]">
              <div className="p-4 space-y-2">
                {availableKpis.map(kpi => (
                  <label
                    key={kpi.id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                      "hover:bg-muted/50 min-h-[44px]",
                      selectedKpis.includes(kpi.id) && "bg-primary/5"
                    )}
                  >
                    <Checkbox
                      checked={selectedKpis.includes(kpi.id)}
                      onCheckedChange={() => toggleKpi(kpi.id)}
                      disabled={!selectedKpis.includes(kpi.id) && selectedKpis.length >= 8}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{kpi.name}</p>
                      {kpi.unit && (
                        <p className="text-xs text-muted-foreground">{kpi.unit}</p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {kpi.data.length}
                    </Badge>
                  </label>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main content */}
        <div className="space-y-4">
          {selectedKpis.length < 2 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Välj minst 2 KPI:er för att se korrelationer
                </p>
              </CardContent>
            </Card>
          ) : selectedPairData ? (
            <CorrelationScatterPlot
              kpiA={selectedPairData.kpiA}
              kpiB={selectedPairData.kpiB}
              onClose={() => setSelectedPair(null)}
            />
          ) : (
            <>
              {correlationMatrix && (
                <CorrelationMatrix
                  data={correlationMatrix}
                  kpiNames={kpiNames}
                  onCellClick={(a, b) => setSelectedPair({ a, b })}
                />
              )}

              {/* Top correlations */}
              {topCorrelations.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Starkaste samband
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {topCorrelations.map((corr, i) => (
                        <button
                          key={`${corr.kpiA}-${corr.kpiB}`}
                          onClick={() => setSelectedPair({ a: corr.kpiA, b: corr.kpiB })}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-lg",
                            "bg-muted/50 hover:bg-muted transition-colors",
                            "min-h-[44px] text-left"
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {kpiNames.get(corr.kpiA)} ↔ {kpiNames.get(corr.kpiB)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {corr.interpretation}
                            </p>
                          </div>
                          <Badge 
                            variant={corr.coefficient > 0 ? "default" : "destructive"}
                            className="ml-2 shrink-0"
                          >
                            r = {corr.coefficient.toFixed(2)}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
