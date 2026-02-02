import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Database,
  Play
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';

export function DataSourceManager() {
  const queryClient = useQueryClient();

  // Fetch data sources
  const { data: dataSources, isLoading, refetch } = useQuery({
    queryKey: ['data-sources-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_sources')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Trigger ingest for a data source
  const triggerIngestMutation = useMutation({
    mutationFn: async (sourceCode: string) => {
      const functionMap: Record<string, string> = {
        'scb_px': 'scb-fetch',
        'kolada': 'kolada-ingest',
        'svk': 'svk-ingest',
      };

      const functionName = functionMap[sourceCode];
      if (!functionName) {
        throw new Error(`Ingen ingest-funktion tillgänglig för ${sourceCode}`);
      }

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { forceRefresh: true },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, sourceCode) => {
      toast.success(`Ingest för ${sourceCode} slutförd`, {
        description: `${data.recordsProcessed || 0} poster bearbetade`,
      });
      queryClient.invalidateQueries({ queryKey: ['data-sources-admin'] });
    },
    onError: (error, sourceCode) => {
      toast.error(`Ingest för ${sourceCode} misslyckades`, {
        description: error.message,
      });
    },
  });

  const getStatusBadge = (source: typeof dataSources extends (infer T)[] ? T : never) => {
    if (!source.is_active) {
      return <Badge variant="secondary">Inaktiv</Badge>;
    }
    if (source.last_fetch_error) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Fel
        </Badge>
      );
    }
    if (source.last_successful_fetch) {
      return (
        <Badge className="flex items-center gap-1 bg-primary text-primary-foreground">
          <CheckCircle className="h-3 w-3" />
          OK
        </Badge>
      );
    }
    return <Badge variant="outline">Ej körts</Badge>;
  };

  const getSourceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'api': 'API',
      'file_feed': 'Fil-feed',
      'manual': 'Manuell',
      'calculated': 'Beräknad',
    };
    return labels[type] || type;
  };

  const getFrequencyLabel = (freq: string) => {
    const labels: Record<string, string> = {
      'realtime': 'Realtid',
      'daily': 'Dagligen',
      'weekly': 'Veckovis',
      'monthly': 'Månadsvis',
      'quarterly': 'Kvartalsvis',
      'yearly': 'Årligen',
    };
    return labels[freq] || freq;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Datakällor
            </CardTitle>
            <CardDescription>
              Hantera och övervaka datakällor för KPI-insamling
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Uppdatera
          </Button>
        </CardHeader>
      </Card>

      {/* Data Sources List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4">
          {dataSources?.map((source) => (
            <Card key={source.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{source.name}</h3>
                      {getStatusBadge(source)}
                      <Badge variant="outline">{getSourceTypeLabel(source.source_type)}</Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {source.description || 'Ingen beskrivning'}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getFrequencyLabel(source.update_frequency)}
                      </span>
                      <span>
                        Tillförlitlighet: {source.reliability_score}%
                      </span>
                      {source.base_url && (
                        <a 
                          href={source.base_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {new URL(source.base_url).hostname}
                        </a>
                      )}
                    </div>

                    {source.last_successful_fetch && (
                      <p className="text-xs text-muted-foreground">
                        Senast hämtad: {formatDistanceToNow(new Date(source.last_successful_fetch), { 
                          addSuffix: true, 
                          locale: sv 
                        })}
                      </p>
                    )}

                    {source.last_fetch_error && (
                      <p className="text-xs text-destructive">
                        Fel: {source.last_fetch_error.slice(0, 100)}...
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {source.source_type === 'api' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => triggerIngestMutation.mutate(source.code)}
                        disabled={triggerIngestMutation.isPending}
                      >
                        {triggerIngestMutation.isPending && 
                         triggerIngestMutation.variables === source.code ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Play className="h-4 w-4 mr-2" />
                        )}
                        Kör ingest
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sammanfattning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold">{dataSources?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Totalt</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <div className="text-2xl font-bold text-primary">
                {dataSources?.filter(s => s.is_active && s.last_successful_fetch && !s.last_fetch_error).length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Aktiva OK</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-destructive/10">
              <div className="text-2xl font-bold text-destructive">
                {dataSources?.filter(s => s.last_fetch_error).length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Med fel</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold">
                {dataSources?.filter(s => s.source_type === 'api').length || 0}
              </div>
              <div className="text-sm text-muted-foreground">API-källor</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
