import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserRoles, useHasRole } from '@/hooks/useUserRole';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Key, Database, Users, Loader2, Layers } from 'lucide-react';
import { APIKeyManager } from '@/components/admin/APIKeyManager';
import { ManualDataEntry } from '@/components/admin/ManualDataEntry';
import { DataSourceManager } from '@/components/admin/DataSourceManager';
import { IngestPipelineMonitor } from '@/components/admin/IngestPipelineMonitor';

const Admin = () => {
  const navigate = useNavigate();
  const { data: roleData, isLoading: rolesLoading } = useUserRoles();
  const isAdmin = useHasRole('system_admin');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading while checking auth and roles
  if (isAuthenticated === null || rolesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Kontrollerar behörighet...</span>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-destructive" />
              Inloggning krävs
            </CardTitle>
            <CardDescription>
              Du måste vara inloggad för att komma åt adminpanelen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Gå till startsidan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-destructive" />
              Behörighet saknas
            </CardTitle>
            <CardDescription>
              Du har inte behörighet att komma åt adminpanelen.
              <br />
              <span className="text-xs text-muted-foreground mt-2 block">
                Din roll: {roleData?.highestRole || 'public'}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tillbaka till dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Adminpanel
                </h1>
                <p className="text-sm text-muted-foreground">
                  Hantera datakällor, API-nycklar och manuell datainmatning
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Inloggad som: {roleData?.highestRole}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="api-keys" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="api-keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API-nycklar
            </TabsTrigger>
            <TabsTrigger value="manual-data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Manuell data
            </TabsTrigger>
            <TabsTrigger value="data-sources" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Datakällor
            </TabsTrigger>
            <TabsTrigger value="ingest" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Global Ingest
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys">
            <APIKeyManager />
          </TabsContent>

          <TabsContent value="manual-data">
            <ManualDataEntry />
          </TabsContent>

          <TabsContent value="data-sources">
            <DataSourceManager />
          </TabsContent>

          <TabsContent value="ingest">
            <IngestPipelineMonitor />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
