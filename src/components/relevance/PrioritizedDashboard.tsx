/**
 * PRIORITERAD STARTSIDA
 * ═══════════════════════════════════════════════════════════════
 * 
 * Visar:
 * - Topp 5 mest relevanta
 * - Topp 5 förbättringar
 * - Topp 5 försämringar
 * 
 * Med klickbar fördjupning och "Varför visas detta?" för varje post.
 * Följer NO ICONS-doktrinen: endast text-markörer.
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RelevanceExplainer } from './RelevanceExplainer';
import { IndexItemDetailDialog } from './IndexItemDetailDialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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

interface SelectedItem {
  id: string;
  code: string;
  name: string;
  change: number;
  score?: number;
  primaryReason?: string;
  category?: string;
}

export function PrioritizedDashboard() {
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [detailType, setDetailType] = useState<'improvement' | 'decline' | 'attention'>('attention');
  const [dialogOpen, setDialogOpen] = useState(false);

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
      
      window.location.reload();
    } catch (error) {
      toast.error('Kunde inte beräkna relevans', { id: 'relevance-calc' });
      console.error(error);
    }
  };

  const handleItemClick = (
    item: { id: string; code: string; name: string; change: number; score?: number; primaryReason?: string },
    type: 'improvement' | 'decline' | 'attention'
  ) => {
    setSelectedItem(item);
    setDetailType(type);
    setDialogOpen(true);
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
          <h2 className="text-2xl font-bold font-mono">[PRIORITERAD ÖVERSIKT]</h2>
          <p className="text-muted-foreground text-sm">
            Det som påverkar flest människor mest just nu
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefreshRelevance} className="font-mono">
          [↻] Beräkna relevans
        </Button>
      </div>

      {!hasData ? (
        <Card className="p-8 text-center">
          <div className="text-4xl font-mono mb-4">[!]</div>
          <h3 className="font-medium mb-2">Ingen relevansdata tillgänglig</h3>
          <p className="text-muted-foreground mb-4">
            Klicka på "Beräkna relevans" för att generera prioriterad data.
          </p>
          <Button onClick={handleRefreshRelevance} className="font-mono">
            [↻] Beräkna nu
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Topp 5 mest relevanta */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-mono">
                <span className="text-amber-600">[!]</span>
                Kräver uppmärksamhet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scores?.slice(0, 5).map((score, index) => {
                const kpiDef = kpiDefMap.get(score.object_id);
                const kpiValue = kpiValues?.get(score.object_id);
                const name = kpiDef?.name ?? score.object_code;
                
                return (
                  <button
                    key={score.id}
                    onClick={() => handleItemClick({
                      id: score.object_id,
                      code: score.object_code,
                      name,
                      change: kpiValue?.trend_percent ?? 0,
                      score: score.total_score,
                      primaryReason: score.primary_reason,
                    }, 'attention')}
                    className="w-full text-left flex items-start justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer border border-transparent hover:border-border"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs font-mono">
                          #{index + 1}
                        </Badge>
                        <span className="font-medium truncate">
                          {name}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {score.primary_reason}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={score.total_score >= 75 ? 'destructive' : score.total_score >= 50 ? 'default' : 'secondary'}
                          className="text-xs font-mono"
                        >
                          {score.total_score.toFixed(0)}
                        </Badge>
                        {kpiValue && (
                          <span className="text-xs text-muted-foreground font-mono">
                            {kpiValue.trend === 'up' ? '↑' : kpiValue.trend === 'down' ? '↓' : '→'}
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
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Topp 5 förbättringar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-mono">
                <span className="text-emerald-600">[↑]</span>
                Förbättringar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {snapshot?.top_improvements && snapshot.top_improvements.length > 0 ? (
                snapshot.top_improvements.map((item, index) => {
                  const kpiDef = kpiDefMap.get(item.id);
                  const name = kpiDef?.name ?? item.name ?? item.code;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick({
                        id: item.id,
                        code: item.code,
                        name,
                        change: item.change,
                      }, 'improvement')}
                      className={cn(
                        "w-full text-left flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer",
                        "bg-emerald-500/5 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-200"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-mono bg-emerald-500/10 text-emerald-700 border-emerald-200">
                            #{index + 1}
                          </Badge>
                          <span className="font-medium truncate">
                            {name}
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500 text-white font-mono">
                        ↑ {Math.abs(item.change).toFixed(1)}%
                      </Badge>
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8 font-mono">
                  [—] Inga signifikanta förbättringar
                </p>
              )}
            </CardContent>
          </Card>

          {/* Topp 5 försämringar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-mono">
                <span className="text-red-600">[↓]</span>
                Försämringar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {snapshot?.top_declines && snapshot.top_declines.length > 0 ? (
                snapshot.top_declines.map((item, index) => {
                  const kpiDef = kpiDefMap.get(item.id);
                  const name = kpiDef?.name ?? item.name ?? item.code;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick({
                        id: item.id,
                        code: item.code,
                        name,
                        change: item.change,
                      }, 'decline')}
                      className={cn(
                        "w-full text-left flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer",
                        "bg-red-500/5 hover:bg-red-500/10 border border-transparent hover:border-red-200"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-mono bg-red-500/10 text-red-700 border-red-200">
                            #{index + 1}
                          </Badge>
                          <span className="font-medium truncate">
                            {name}
                          </span>
                        </div>
                      </div>
                      <Badge variant="destructive" className="font-mono">
                        ↓ {Math.abs(item.change).toFixed(1)}%
                      </Badge>
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8 font-mono">
                  [—] Inga signifikanta försämringar
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Metadata */}
      {snapshot && (
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground font-mono">
          <span>[DATUM] {new Date(snapshot.snapshot_date).toLocaleDateString('sv-SE')}</span>
          <span>•</span>
          <span>[N] {snapshot.total_objects_scored} indikatorer</span>
          <span>•</span>
          <span>[TID] {snapshot.calculation_duration_ms}ms</span>
        </div>
      )}

      {/* Detail Dialog */}
      <IndexItemDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={selectedItem}
        type={detailType}
      />
    </div>
  );
}
