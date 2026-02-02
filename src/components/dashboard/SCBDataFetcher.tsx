import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Database, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { toast } from 'sonner';

interface SCBFetchResult {
  success: boolean;
  value?: number;
  period?: string;
  trend?: 'up' | 'down' | 'stable';
  trend_percent?: number;
  unit?: string;
  error?: string;
}

const AVAILABLE_TABLES = [
  { key: 'life_expectancy', label: 'Förväntad livslängd', description: 'Återstående medellivslängd vid födelsen', kpi: 'A1', code: 'life_expectancy' },
  { key: 'excess_mortality_monthly', label: 'Döda/månad', description: 'Antal döda per månad för överdödlighetsberäkning', kpi: 'A2', code: 'excess_mortality' },
  { key: 'working_age_population', label: 'Arbetsför befolkning', description: 'Befolkning 18-64 år', kpi: 'B1', code: 'working_age_functional' },
  { key: 'employment_rate', label: 'Sysselsättningsgrad', description: 'Sysselsättningsgrad 20-64 år', kpi: 'B2', code: 'employment_rate_net' },
  { key: 'productivity', label: 'Produktivitet', description: 'BNP per arbetad timme', kpi: 'B3', code: 'productivity_per_hour' },
  { key: 'unemployment', label: 'Arbetslöshet', description: 'Arbetslöshet 15-74 år', kpi: 'D1', code: 'long_term_exclusion' },
  { key: 'tax_base', label: 'Skattebasen', description: 'Beskattningsbar förvärvsinkomst per invånare', kpi: 'C1', code: 'tax_base_growth' },
  { key: 'housing', label: 'Bostadsbyggande', description: 'Färdigställda bostäder per år', kpi: 'F1', code: 'housing_turnover' },
  { key: 'total_population', label: 'Total befolkning', description: 'Sveriges totala befolkning', kpi: 'A', code: 'total_population' },
];

export function SCBDataFetcher() {
  const [results, setResults] = useState<Record<string, SCBFetchResult>>({});
  const queryClient = useQueryClient();

  const fetchMutation = useMutation({
    mutationFn: async (tableKey: string) => {
      const response = await supabase.functions.invoke('scb-fetch', {
        body: { table_key: tableKey },
      });
      
      if (response.error) throw response.error;
      return { tableKey, result: response.data as SCBFetchResult };
    },
    onSuccess: ({ tableKey, result }) => {
      setResults(prev => ({ ...prev, [tableKey]: result }));
      if (result.success) {
        toast.success(`Hämtade ${result.value} ${result.unit || ''} från SCB`);
        queryClient.invalidateQueries({ queryKey: ['kpi_values'] });
      } else {
        toast.error(result.error || 'Kunde inte hämta data');
      }
    },
    onError: (error) => {
      console.error('SCB fetch error:', error);
      toast.error('Kunde inte ansluta till SCB API');
    },
  });

  const fetchAllMutation = useMutation({
    mutationFn: async () => {
      // Use the batch API with kpi_codes for efficiency
      const kpiCodes = AVAILABLE_TABLES.map(t => t.code);
      const response = await supabase.functions.invoke('scb-fetch', {
        body: { kpi_codes: kpiCodes },
      });
      
      if (response.error) throw response.error;
      
      // Transform the response to match expected format
      const results = response.data.results || {};
      return AVAILABLE_TABLES.map(table => ({
        tableKey: table.key,
        result: results[table.key] ? {
          success: results[table.key].success as boolean,
          value: results[table.key].value as number | undefined,
          period: results[table.key].period as string | undefined,
          error: results[table.key].error as string | undefined,
          trend: 'stable' as const,
          trend_percent: 0,
        } : { success: false, error: 'No data' } as SCBFetchResult
      }));
    },
    onSuccess: (allResults) => {
      const newResults: Record<string, SCBFetchResult> = {};
      for (const { tableKey, result } of allResults) {
        newResults[tableKey] = result;
      }
      setResults(prev => ({ ...prev, ...newResults }));
      
      const successCount = allResults.filter(r => r.result?.success).length;
      toast.success(`Hämtade data från ${successCount}/${allResults.length} tabeller`);
      queryClient.invalidateQueries({ queryKey: ['kpi_values'] });
    },
    onError: (error) => {
      console.error('SCB fetch all error:', error);
      toast.error('Kunde inte hämta all data från SCB');
    },
  });

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">SCB PxWebApi Integration</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAllMutation.mutate()}
            disabled={fetchAllMutation.isPending}
          >
            {fetchAllMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Uppdatera alla
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Hämta officiell statistik direkt från Statistiska Centralbyrån (SCB).
        </p>

        <div className="grid gap-3">
          {AVAILABLE_TABLES.map((table) => {
            const result = results[table.key];
            const isLoading = fetchMutation.isPending && fetchMutation.variables === table.key;
            
            return (
              <div
                key={table.key}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{table.label}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {table.kpi}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{table.description}</p>
                  
                  {result?.success && result.value !== undefined && (
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-lg font-bold">
                        {result.value.toFixed(2)} {result.unit || ''}
                      </span>
                      <div className="flex items-center gap-1">
                        <TrendIcon trend={result.trend || 'stable'} />
                        <span className={`text-xs ${
                          result.trend === 'up' ? 'text-green-600' : 
                          result.trend === 'down' ? 'text-red-600' : 
                          'text-muted-foreground'
                        }`}>
                          {(result.trend_percent || 0) > 0 ? '+' : ''}{(result.trend_percent || 0).toFixed(2)}%
                        </span>
                      </div>
                      {result.period && (
                        <Badge variant="secondary" className="text-[10px]">
                          {result.period}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {result?.success && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  {result && !result.success && (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fetchMutation.mutate(table.key)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t space-y-1">
          <div><span className="font-medium">Källa:</span> api.scb.se • PxWebApi 2.0 • Öppen data</div>
          <div><span className="font-medium">Rate limit:</span> 30 req/min • 10 000 req/dag</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SCBDataFetcher;
