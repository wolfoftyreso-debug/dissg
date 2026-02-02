/**
 * PRIORITERAD STARTSIDA
 * ═══════════════════════════════════════════════════════════════
 * 
 * Visar:
 * - Topp 5 mest relevanta
 * - Topp 5 förbättringar
 * - Topp 5 försämringar
 * 
 * Med "Varför visas detta?" för varje post.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RelevanceExplainer } from './RelevanceExplainer';
import { TrendingUp, TrendingDown, AlertTriangle, ArrowUp, ArrowDown, Minus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RelevanceScore {
  id: string;
  object_id: string;
  object_code: string;
  total_score: number;
  rank: number;
  impact_raw: number;
  acceleration_raw: number;
  breadth_raw: number;
  persistence_raw: number;
  responsibility_raw: number;
  data_confidence_raw: number;
  impact_weighted: number;
  acceleration_weighted: number;
  breadth_weighted: number;
  persistence_weighted: number;
  responsibility_weighted: number;
  data_confidence_contribution: number;
  primary_reason: string;
  secondary_reasons: string[];
  should_highlight: boolean;
  calculation_details: Record<string, string>;
  calculated_at: string;
  weight_version_id: string;
}

interface KPIDefinition {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  is_inverted: boolean;
}

interface KPIValue {
  kpi_id: string;
  value: number;
  trend: string;
  trend_percent: number | null;
  status: string;
}

interface TopRelevantItem {
  id: string;
  code: string;
  score: number;
  reason: string;
}

interface TopChangeItem {
  id: string;
  code: string;
  change: number;
  name: string;
}

interface DailySnapshot {
  snapshot_date: string;
  top_relevant: TopRelevantItem[];
  top_improvements: TopChangeItem[];
  top_declines: TopChangeItem[];
  total_objects_scored: number;
  calculation_duration_ms: number;
}

export function PrioritizedDashboard() {
  // Hämta dagens snapshot
  const { data: snapshot, isLoading: snapshotLoading } = useQuery({
    queryKey: ['daily-priority-snapshot'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_priority_snapshots')
        .select('*')
        .eq('snapshot_date', today)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      // Safely cast JSONB fields
      return {
        snapshot_date: data.snapshot_date,
        top_relevant: (data.top_relevant as unknown as TopRelevantItem[]) ?? [],
        top_improvements: (data.top_improvements as unknown as TopChangeItem[]) ?? [],
        top_declines: (data.top_declines as unknown as TopChangeItem[]) ?? [],
        total_objects_scored: data.total_objects_scored,
        calculation_duration_ms: data.calculation_duration_ms,
      } as DailySnapshot;
    },
  });

  // Hämta relevans-scores
  const { data: scores, isLoading: scoresLoading } = useQuery({
    queryKey: ['relevance-scores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('relevance_scores')
        .select('*')
        .eq('object_type', 'kpi')
        .order('total_score', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as RelevanceScore[];
    },
  });

  // Hämta KPI-definitioner
  const { data: kpiDefs } = useQuery({
    queryKey: ['kpi-definitions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpi_definitions')
        .select('id, code, name, category, unit, is_inverted');
      
      if (error) throw error;
      return data as KPIDefinition[];
    },
  });

  // Hämta senaste KPI-värden
  const { data: kpiValues } = useQuery({
    queryKey: ['latest-kpi-values'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpi_values')
        .select('kpi_id, value, trend, trend_percent, status')
        .order('period_end', { ascending: false });
      
      if (error) throw error;
      
      // Deduplicate to get latest per KPI
      const latest = new Map<string, KPIValue>();
      for (const val of data) {
        if (!latest.has(val.kpi_id)) {
          latest.set(val.kpi_id, val);
        }
      }
      return latest;
    },
  });

  const kpiDefMap = new Map(kpiDefs?.map(d => [d.id, d]) ?? []);

  const handleRefreshRelevance = async () => {
    try {
      toast.loading('Beräknar relevans...', { id: 'relevance-calc' });
      
      const response = await supabase.functions.invoke('calculate-relevance');
      
      if (response.error) throw response.error;
      
      toast.success(`Beräknade relevans för ${response.data?.summary?.totalScored ?? 0} KPI:er`, {
        id: 'relevance-calc',
      });
      
      // Refetch data
      window.location.reload();
    } catch (error) {
      toast.error('Kunde inte beräkna relevans', { id: 'relevance-calc' });
      console.error(error);
    }
  };

  const isLoading = snapshotLoading || scoresLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  const hasData = scores && scores.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Prioriterad översikt</h2>
          <p className="text-muted-foreground">
            Det som påverkar flest människor mest just nu
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefreshRelevance}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Beräkna relevans
        </Button>
      </div>

      {!hasData ? (
        <Card className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">Ingen relevansdata tillgänglig</h3>
          <p className="text-muted-foreground mb-4">
            Klicka på "Beräkna relevans" för att generera prioriterad data.
          </p>
          <Button onClick={handleRefreshRelevance}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Beräkna nu
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Topp 5 mest relevanta */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Kräver uppmärksamhet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scores?.slice(0, 5).map((score, index) => {
                const kpiDef = kpiDefMap.get(score.object_id);
                const kpiValue = kpiValues?.get(score.object_id);
                
                return (
                  <div 
                    key={score.id} 
                    className="flex items-start justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <span className="font-medium truncate">
                          {kpiDef?.name ?? score.object_code}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {score.primary_reason}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={score.total_score >= 75 ? 'destructive' : score.total_score >= 50 ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {score.total_score.toFixed(0)}
                        </Badge>
                        {kpiValue && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            {kpiValue.trend === 'up' ? (
                              <ArrowUp className="h-3 w-3 text-green-500" />
                            ) : kpiValue.trend === 'down' ? (
                              <ArrowDown className="h-3 w-3 text-red-500" />
                            ) : (
                              <Minus className="h-3 w-3" />
                            )}
                            {kpiValue.trend_percent?.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <RelevanceExplainer
                      totalScore={score.total_score}
                      breakdown={{
                        impactRaw: score.impact_raw,
                        accelerationRaw: score.acceleration_raw,
                        breadthRaw: score.breadth_raw,
                        persistenceRaw: score.persistence_raw,
                        responsibilityRaw: score.responsibility_raw,
                        dataConfidenceRaw: score.data_confidence_raw,
                        impactWeighted: score.impact_weighted,
                        accelerationWeighted: score.acceleration_weighted,
                        breadthWeighted: score.breadth_weighted,
                        persistenceWeighted: score.persistence_weighted,
                        responsibilityWeighted: score.responsibility_weighted,
                        dataConfidenceContribution: score.data_confidence_contribution,
                        calculationDetails: score.calculation_details,
                      }}
                      primaryReason={score.primary_reason}
                      secondaryReasons={score.secondary_reasons}
                      calculatedAt={score.calculated_at}
                      kpiName={kpiDef?.name}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Topp 5 förbättringar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Förbättringar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {snapshot?.top_improvements && snapshot.top_improvements.length > 0 ? (
                snapshot.top_improvements.map((item, index) => {
                  const kpiDef = kpiDefMap.get(item.id);
                  return (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 hover:bg-green-500/10 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 border-green-200">
                            #{index + 1}
                          </Badge>
                          <span className="font-medium truncate">
                            {kpiDef?.name ?? item.name ?? item.code}
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-green-500 text-white">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        {Math.abs(item.change).toFixed(1)}%
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Inga signifikanta förbättringar
                </p>
              )}
            </CardContent>
          </Card>

          {/* Topp 5 försämringar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingDown className="h-5 w-5 text-red-500" />
                Försämringar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {snapshot?.top_declines && snapshot.top_declines.length > 0 ? (
                snapshot.top_declines.map((item, index) => {
                  const kpiDef = kpiDefMap.get(item.id);
                  return (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 hover:bg-red-500/10 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs bg-red-500/10 text-red-700 border-red-200">
                            #{index + 1}
                          </Badge>
                          <span className="font-medium truncate">
                            {kpiDef?.name ?? item.name ?? item.code}
                          </span>
                        </div>
                      </div>
                      <Badge variant="destructive">
                        <ArrowDown className="h-3 w-3 mr-1" />
                        {Math.abs(item.change).toFixed(1)}%
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Inga signifikanta försämringar
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Metadata */}
      {snapshot && (
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>Beräknad: {new Date(snapshot.snapshot_date).toLocaleDateString('sv-SE')}</span>
          <span>•</span>
          <span>{snapshot.total_objects_scored} indikatorer analyserade</span>
          <span>•</span>
          <span>{snapshot.calculation_duration_ms}ms</span>
        </div>
      )}
    </div>
  );
}
