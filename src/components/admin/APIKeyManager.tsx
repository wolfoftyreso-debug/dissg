import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Key, 
  Check, 
  X, 
  ExternalLink, 
  Loader2,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface APIKeyConfig {
  id: string;
  name: string;
  description: string;
  envVar: string;
  docUrl?: string;
  isConfigured: boolean;
}

// Define available API keys that can be configured
const API_KEY_CONFIGS: Omit<APIKeyConfig, 'id' | 'isConfigured'>[] = [
  {
    name: 'ENTSO-E Transparency',
    description: 'Europeisk eldata - produktion, förbrukning, priser',
    envVar: 'ENTSOE_API_KEY',
    docUrl: 'https://transparency.entsoe.eu/content/static_content/Static%20content/web%20api/Guide.html',
  },
  {
    name: 'OpenAI',
    description: 'AI-analys och textgenerering',
    envVar: 'OPENAI_API_KEY',
    docUrl: 'https://platform.openai.com/api-keys',
  },
  {
    name: 'SCB API',
    description: 'Statistiska centralbyrån - nyckel för utökad åtkomst',
    envVar: 'SCB_API_KEY',
    docUrl: 'https://www.scb.se/vara-tjanster/oppna-data/api-for-statistikdatabasen/',
  },
];

export function APIKeyManager() {

  // Check which keys are configured by calling edge function
  const { data: configuredKeys, isLoading, refetch } = useQuery({
    queryKey: ['api-keys-status'],
    queryFn: async () => {
      // We can't directly read secrets, but we can check which data sources have API keys configured
      const { data: sources } = await supabase
        .from('data_sources')
        .select('code, metadata, last_successful_fetch')
        .eq('requires_auth', true);
      
      // For now, return the known configs with mock status
      // In production, you'd have an edge function that checks env vars
      return API_KEY_CONFIGS.map((config, index) => ({
        ...config,
        id: `key-${index}`,
        isConfigured: sources?.some(s => 
          s.metadata && 
          typeof s.metadata === 'object' && 
          'api_key_env' in s.metadata && 
          s.metadata.api_key_env === config.envVar
        ) || false,
      }));
    },
  });

  // Test API key by calling edge function
  const testKeyMutation = useMutation({
    mutationFn: async (envVar: string) => {
      // Call appropriate edge function to test the key
      const functionMap: Record<string, string> = {
        'ENTSOE_API_KEY': 'svk-ingest',
        'SCB_API_KEY': 'scb-fetch',
      };

      const functionName = functionMap[envVar];
      if (!functionName) {
        throw new Error('Ingen testfunktion tillgänglig för denna nyckel');
      }

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { test: true },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('API-nyckel fungerar korrekt');
    },
    onError: (error) => {
      toast.error(`Test misslyckades: ${error.message}`);
    },
  });

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API-nycklar
          </CardTitle>
          <CardDescription>
            Hantera API-nycklar för externa datakällor. Nycklar lagras säkert som miljövariabler.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              <strong>Säkerhetsinfo:</strong> API-nycklar visas aldrig i klartext efter att de sparats.
              Kontakta systemadministratör för att uppdatera nycklar via Lovable Cloud.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Existing Keys */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Konfigurerade nycklar</CardTitle>
            <CardDescription>Status för externa API-integrationer</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Uppdatera
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {configuredKeys?.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${key.isConfigured ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'}`}>
                      <Key className={`h-4 w-4 ${key.isConfigured ? 'text-green-600' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{key.name}</span>
                        <Badge variant={key.isConfigured ? 'default' : 'secondary'}>
                          {key.isConfigured ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Konfigurerad
                            </>
                          ) : (
                            <>
                              <X className="h-3 w-3 mr-1" />
                              Ej konfigurerad
                            </>
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{key.description}</p>
                      <code className="text-xs text-muted-foreground">{key.envVar}</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {key.docUrl && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={key.docUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {key.isConfigured && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testKeyMutation.mutate(key.envVar)}
                        disabled={testKeyMutation.isPending}
                      >
                        {testKeyMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Testa'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lägga till ny API-nyckel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            För att lägga till eller uppdatera en API-nyckel:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Öppna Lovable Cloud Console</li>
            <li>Gå till Settings → Secrets</li>
            <li>Lägg till nyckeln med rätt miljövariabelnamn (t.ex. ENTSOE_API_KEY)</li>
            <li>Deploya om edge functions för att aktivera</li>
          </ol>
          <div className="pt-4">
            <Button variant="outline" asChild>
              <a 
                href="https://lovable.dev/projects" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Öppna Lovable Cloud
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
