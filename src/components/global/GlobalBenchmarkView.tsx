/**
 * WAVE 10: BLOCK CF — BENCHMARK COMPARISON VIEW
 * 
 * Jämför med peer countries, similar regions, historical self.
 * Alltid med jämförbarhetsflagga.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  AlertTriangle, 
  Info,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  type BenchmarkType,
  type BenchmarkResult,
  COMPARABILITY_FACTORS 
} from '@/config/benchmarkConfig';

interface GlobalBenchmarkViewProps {
  entityId: string;
  entityName: string;
  kpiCode: string;
  kpiName: string;
  value: number;
  unit: string;
}

export function GlobalBenchmarkView({
  entityName,
  kpiName,
  value,
  unit
}: GlobalBenchmarkViewProps) {
  const [benchmarkType, setBenchmarkType] = useState<BenchmarkType>('peer_countries');
  const [showComparability, setShowComparability] = useState(false);

  // Mock benchmark result
  const benchmarkResult: BenchmarkResult = {
    subject: {
      id: 'se',
      name: entityName,
      value: value
    },
    benchmark: {
      type: benchmarkType,
      group_name: 'Nordiska länder',
      group_size: 5,
      min: 4.2,
      max: 9.1,
      median: 6.5,
      mean: 6.3,
      std_dev: 1.8,
      percentile: 65,
      rank: 2
    },
    comparability: {
      score: 0.85,
      level: 'high',
      factors: [
        { factor: 'population_size', match: true, note: 'Alla länder 5-10 miljoner' },
        { factor: 'gdp_per_capita', match: true, note: 'Liknande inkomstnivå' },
        { factor: 'definition_match', match: true },
        { factor: 'methodology_match', match: false, note: 'Norge använder annan insamlingsmetod' },
        { factor: 'temporal_coverage', match: true }
      ],
      warnings: ['Norges definition avviker något från övriga']
    },
    period: {
      subject_period: '2024-Q1',
      benchmark_period: '2024-Q1',
      period_match: true
    },
    method: {
      subject_method: 'SCB standardmetod',
      benchmark_method: 'Eurostat harmoniserad',
      method_match: false
    }
  };

  const getComparabilityColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-status-positive';
      case 'moderate': return 'text-status-warning';
      default: return 'text-status-critical';
    }
  };

  const getComparabilityBadge = (level: string) => {
    switch (level) {
      case 'high': return <Badge className="bg-status-positive text-primary-foreground">Hög jämförbarhet</Badge>;
      case 'moderate': return <Badge className="bg-status-warning text-primary-foreground">Måttlig jämförbarhet</Badge>;
      default: return <Badge variant="destructive">Låg jämförbarhet</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Benchmark: {kpiName}
          </CardTitle>
          {getComparabilityBadge(benchmarkResult.comparability.level)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Benchmark Type Selector */}
        <Select value={benchmarkType} onValueChange={(v) => setBenchmarkType(v as BenchmarkType)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Välj jämförelsegrupp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="peer_countries">Jämförbara länder</SelectItem>
            <SelectItem value="similar_regions">Liknande regioner</SelectItem>
            <SelectItem value="historical_self">Historisk utveckling</SelectItem>
            <SelectItem value="best_quartile">Bästa kvartilen</SelectItem>
            <SelectItem value="median">Median</SelectItem>
          </SelectContent>
        </Select>

        {/* Subject Value */}
        <div className="p-4 bg-primary/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">{entityName}</span>
              <div className="text-2xl font-mono font-bold">{value} {unit}</div>
            </div>
            <div className="text-right">
              <span className="text-sm text-muted-foreground">Rank</span>
              <div className="text-2xl font-mono font-bold">
                #{benchmarkResult.benchmark.rank}/{benchmarkResult.benchmark.group_size}
              </div>
            </div>
          </div>
        </div>

        {/* Benchmark Distribution */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Jämförelsegrupp: {benchmarkResult.benchmark.group_name}</span>
            <span className="text-muted-foreground">{benchmarkResult.benchmark.group_size} enheter</span>
          </div>
          
          <div className="relative h-8 bg-muted rounded">
            {/* Distribution bar */}
            <div className="absolute inset-y-0 left-0 bg-muted-foreground/20 rounded" 
                 style={{ left: '0%', width: '100%' }} />
            
            {/* Median marker */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-primary"
              style={{ left: `${((benchmarkResult.benchmark.median - benchmarkResult.benchmark.min) / (benchmarkResult.benchmark.max - benchmarkResult.benchmark.min)) * 100}%` }}
            />
            
            {/* Subject marker */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background"
              style={{ left: `${((value - benchmarkResult.benchmark.min) / (benchmarkResult.benchmark.max - benchmarkResult.benchmark.min)) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Min: {benchmarkResult.benchmark.min}</span>
            <span>Median: {benchmarkResult.benchmark.median}</span>
            <span>Max: {benchmarkResult.benchmark.max}</span>
          </div>
        </div>

        {/* Percentile */}
        <div className="flex items-center gap-4">
          <span className="text-sm">Percentil:</span>
          <Progress value={benchmarkResult.benchmark.percentile} className="flex-1" />
          <span className="text-sm font-mono">{benchmarkResult.benchmark.percentile}%</span>
        </div>

        {/* Comparability Details (Collapsible) */}
        <Collapsible open={showComparability} onOpenChange={setShowComparability}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className={`h-4 w-4 ${getComparabilityColor(benchmarkResult.comparability.level)}`} />
                Jämförbarhetsbedömning
              </span>
              {showComparability ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-3 mt-2">
            {/* Comparability Score */}
            <div className="flex items-center gap-3">
              <span className="text-sm">Jämförbarhetspoäng:</span>
              <Progress value={benchmarkResult.comparability.score * 100} className="flex-1" />
              <span className={`text-sm font-mono ${getComparabilityColor(benchmarkResult.comparability.level)}`}>
                {(benchmarkResult.comparability.score * 100).toFixed(0)}%
              </span>
            </div>

            {/* Factor Breakdown */}
            <div className="space-y-2">
              {benchmarkResult.comparability.factors.map((factor, idx) => {
                const factorConfig = COMPARABILITY_FACTORS.find(f => f.factor === factor.factor);
                return (
                  <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                    <div className="flex items-center gap-2">
                      {factor.match 
                        ? <CheckCircle className="h-4 w-4 text-status-positive" />
                        : <XCircle className="h-4 w-4 text-status-critical" />
                      }
                      <span>{factorConfig?.description || factor.factor}</span>
                    </div>
                    {factor.note && (
                      <span className="text-xs text-muted-foreground">{factor.note}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Warnings */}
            {benchmarkResult.comparability.warnings.length > 0 && (
              <div className="p-2 bg-status-warning/10 rounded">
                <span className="text-xs font-medium text-status-warning">Varningar:</span>
                <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  {benchmarkResult.comparability.warnings.map((warning, idx) => (
                    <li key={idx}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Method Match */}
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
              <span>Metodöverensstämmelse:</span>
              {benchmarkResult.method.method_match 
                ? <Badge variant="outline" className="text-xs text-status-positive">Samma metod</Badge>
                : <Badge variant="outline" className="text-xs text-status-warning">Olika metoder</Badge>
              }
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <p>
            Jämförbarheten bedöms automatiskt baserat på definitioner, metoder och täckning.
            Gul/röd flagga indikerar att jämförelsen kräver försiktighet vid tolkning.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default GlobalBenchmarkView;
