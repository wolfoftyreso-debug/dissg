/**
 * EXTRAS PAGE
 * 
 * Additional tools, utilities and configuration options for DISSG.
 * - System calibration
 * - Weight management
 * - Advanced settings
 * - Development tools
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ODISHeader, ODISFooter } from '@/components/gdis';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ToolCard {
  id: string;
  name: string;
  description: string;
  path: string;
  category: 'admin' | 'analysis' | 'config' | 'dev';
  status: 'active' | 'beta' | 'coming';
  requiresAuth?: boolean;
}

const TOOLS: ToolCard[] = [
  // Admin Tools
  { id: 'gmi-weights', name: 'GMI Weight Editor', description: 'Justera vikter för Global Master Index', path: '/gmi-weight-editor', category: 'admin', status: 'active', requiresAuth: true },
  { id: 'relevance-weights', name: 'Relevansvikter', description: 'Konfigurera prioriteringsalgoritm', path: '/relevance-weight-manager', category: 'admin', status: 'active', requiresAuth: true },
  { id: 'system-audit', name: 'System Audit', description: 'Granska systemkonfiguration', path: '/system-audit', category: 'admin', status: 'active' },
  
  // Analysis Tools
  { id: 'correlation', name: 'Korrelationsanalys', description: 'Utforska samband mellan indikatorer', path: '/correlation', category: 'analysis', status: 'active' },
  { id: 'scenario', name: 'Scenariolab', description: 'Testa "om-utifall" scenarier', path: '/scenario', category: 'analysis', status: 'beta' },
  { id: 'replay', name: 'Historisk Replay', description: 'Se hur data utvecklats över tid', path: '/replay', category: 'analysis', status: 'active' },
  { id: 'oscilloscope', name: 'Oscilloskop-vy', description: 'Realtidsövervakning av signaler', path: '/oscilloscope-view', category: 'analysis', status: 'active' },
  
  // Configuration
  { id: 'settings', name: 'Inställningar', description: 'Personliga preferenser', path: '/settings', category: 'config', status: 'active' },
  { id: 'governance', name: 'Governance', description: 'Systemprinciper och konstitution', path: '/governance', category: 'config', status: 'active' },
  { id: 'charter', name: 'Data Charter', description: 'Datahanteringsprinciper', path: '/charter', category: 'config', status: 'active' },
  
  // Development
  { id: 'smoke-test', name: 'Smoke Test', description: 'Snabb systemverifiering', path: '/smoke-test', category: 'dev', status: 'active' },
  { id: 'self-test', name: 'Self Test', description: 'Djupgående systemdiagnostik', path: '/self-test', category: 'dev', status: 'active' },
  { id: 'fault-codes', name: 'Felkoder', description: 'DTC-kodregister', path: '/fault-codes', category: 'dev', status: 'active' },
  { id: 'diagnostics', name: 'Diagnostik', description: 'Full systemdiagnostik', path: '/diagnostics', category: 'dev', status: 'active' },
];

const CATEGORY_LABELS = {
  admin: { label: 'Administration', marker: '[ADMIN]' },
  analysis: { label: 'Analysverktyg', marker: '[ANALYS]' },
  config: { label: 'Konfiguration', marker: '[CONFIG]' },
  dev: { label: 'Utveckling', marker: '[DEV]' },
};

export default function Extras() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const { user } = useAuth();
  
  // System settings state
  const [settings, setSettings] = useState({
    darkMode: true,
    compactView: false,
    showDebugInfo: false,
    enableBetaFeatures: false,
    autoRefresh: true,
    refreshInterval: 60,
  });

  const filteredTools = activeTab === 'all' 
    ? TOOLS 
    : TOOLS.filter(t => t.category === activeTab);

  return (
    <div className="min-h-screen bg-background font-mono">
      <ODISHeader 
        systemName="EXTRAS — Tools & Configuration"
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{TOOLS.filter(t => t.status === 'active').length}</div>
              <div className="text-xs text-muted-foreground">[AKTIVA VERKTYG]</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-status-warning">{TOOLS.filter(t => t.status === 'beta').length}</div>
              <div className="text-xs text-muted-foreground">[BETA]</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-muted-foreground">{TOOLS.filter(t => t.status === 'coming').length}</div>
              <div className="text-xs text-muted-foreground">[KOMMER]</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{Object.keys(CATEGORY_LABELS).length}</div>
              <div className="text-xs text-muted-foreground">[KATEGORIER]</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all" className="font-mono text-xs">[ALLA]</TabsTrigger>
            {Object.entries(CATEGORY_LABELS).map(([key, config]) => (
              <TabsTrigger key={key} value={key} className="font-mono text-xs">
                {config.marker}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {/* Tools Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map(tool => (
                <Card 
                  key={tool.id}
                  className={cn(
                    "transition-all hover:shadow-md",
                    tool.status === 'coming' && "opacity-60"
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm">{tool.name}</CardTitle>
                      <Badge 
                        variant={tool.status === 'active' ? 'default' : tool.status === 'beta' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {tool.status === 'active' ? '[OK]' : tool.status === 'beta' ? '[BETA]' : '[—]'}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {CATEGORY_LABELS[tool.category].marker}
                      </span>
                      {tool.status !== 'coming' ? (
                        <Link to={tool.path}>
                          <Button variant="outline" size="sm" className="text-xs">
                            [→] Öppna
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="ghost" size="sm" disabled className="text-xs">
                          [—] Kommer
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-8" />

        {/* Quick Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">[SNABBINSTÄLLNINGAR]</CardTitle>
            <CardDescription>
              Vanliga konfigurationsalternativ. Fullständiga inställningar finns under [CONFIG].
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="compact-view" className="text-sm">Kompakt vy</Label>
                  <Switch 
                    id="compact-view" 
                    checked={settings.compactView}
                    onCheckedChange={(v) => setSettings(s => ({ ...s, compactView: v }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="debug-info" className="text-sm">Visa debuginfo</Label>
                  <Switch 
                    id="debug-info" 
                    checked={settings.showDebugInfo}
                    onCheckedChange={(v) => setSettings(s => ({ ...s, showDebugInfo: v }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="beta-features" className="text-sm">Aktivera beta-funktioner</Label>
                  <Switch 
                    id="beta-features" 
                    checked={settings.enableBetaFeatures}
                    onCheckedChange={(v) => setSettings(s => ({ ...s, enableBetaFeatures: v }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-refresh" className="text-sm">Auto-uppdatering</Label>
                  <Switch 
                    id="auto-refresh" 
                    checked={settings.autoRefresh}
                    onCheckedChange={(v) => setSettings(s => ({ ...s, autoRefresh: v }))}
                  />
                </div>
                
                <div className="p-3 bg-muted/50 rounded text-xs text-muted-foreground">
                  <strong>Tips:</strong> Använd tangentbordsgenvägar för snabb navigering. 
                  Tryck <kbd className="px-1 py-0.5 bg-background rounded border">?</kbd> för att se alla.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">[SYSTEMINFORMATION]</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-muted/50 rounded">
                <div className="text-muted-foreground mb-1">Version</div>
                <div className="font-bold">DISSG v2.0.0</div>
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <div className="text-muted-foreground mb-1">Environment</div>
                <div className="font-bold">PRODUCTION</div>
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <div className="text-muted-foreground mb-1">Region</div>
                <div className="font-bold">EU-WEST-1</div>
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <div className="text-muted-foreground mb-1">Användare</div>
                <div className="font-bold">{user?.email || 'Gäst'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <ODISFooter />
    </div>
  );
}
