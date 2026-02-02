/**
 * RESILIENCE CAPACITY MAP — Main Dashboard
 * Combines all resilience components into one view
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Shield, Info } from 'lucide-react';

import { ResilienceRadar } from './ResilienceRadar';
import { ShockMatcher } from './ShockMatcher';
import { StressResilienceMatrix } from './StressResilienceMatrix';
import { ErosionView } from './ErosionView';
import { ResilienceSnapshotCard } from './ResilienceSnapshot';

import { 
  EXAMPLE_PROFILES, 
  RESILIENCE_CLARIFICATION,
  RCM_CORE_PRINCIPLE,
  type GlobalResilienceSnapshot 
} from '@/config/systemResilienceConfig';

const EXAMPLE_SNAPSHOT: GlobalResilienceSnapshot = {
  status: 'pressured',
  statusSv: 'Pressad',
  averageScore: 58,
  regionalVariation: [
    { region: 'Nordic', regionSv: 'Norden', score: 68, trend: 'stable' },
    { region: 'Western Europe', regionSv: 'Västeuropa', score: 62, trend: 'declining' },
    { region: 'Southern Europe', regionSv: 'Sydeuropa', score: 52, trend: 'stable' },
    { region: 'Eastern Europe', regionSv: 'Östeuropa', score: 48, trend: 'improving' },
  ],
  lastUpdated: '2024-12-01',
};

const EXAMPLE_MATRIX_DATA = [
  { entityId: 'SE', entityName: 'Sverige', stress: 55, resilience: 64 },
  { entityId: 'NO', entityName: 'Norge', stress: 42, resilience: 72 },
  { entityId: 'DK', entityName: 'Danmark', stress: 48, resilience: 68 },
  { entityId: 'FI', entityName: 'Finland', stress: 52, resilience: 66 },
  { entityId: 'DE', entityName: 'Tyskland', stress: 65, resilience: 58 },
  { entityId: 'IT', entityName: 'Italien', stress: 72, resilience: 45 },
];

const EXAMPLE_EROSION_DATA = [
  { date: '2020', value: 72 },
  { date: '2021', value: 70 },
  { date: '2022', value: 66 },
  { date: '2023', value: 63 },
  { date: '2024', value: 58 },
];

export function ResilienceDashboard() {
  const [selectedEntity, setSelectedEntity] = useState('SE');
  const profile = EXAMPLE_PROFILES.find(p => p.entityId === selectedEntity) || EXAMPLE_PROFILES[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Resilience Capacity Map</h1>
                <p className="text-sm text-muted-foreground">
                  Var finns buffertar, redundans och återhämtningsförmåga?
                </p>
              </div>
            </div>
            <Select value={selectedEntity} onValueChange={setSelectedEntity}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Välj land" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SE">Sverige</SelectItem>
                <SelectItem value="NO">Norge</SelectItem>
                <SelectItem value="DK">Danmark</SelectItem>
                <SelectItem value="FI">Finland</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Core principle */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {RCM_CORE_PRINCIPLE.statement}
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="shocks">Chocktyper</TabsTrigger>
            <TabsTrigger value="matrix">Stress/Resiliens</TabsTrigger>
            <TabsTrigger value="erosion">Erosion</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <ResilienceRadar profile={profile} />
              
              {/* Dimension details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dimensioner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.dimensions.map((dim) => (
                    <div 
                      key={dim.dimensionId}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          {dim.dimensionId.replace(/_/g, ' ')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last: {dim.metrics.currentLoad}% • Marginal: {dim.metrics.spareCapacity}%
                        </div>
                      </div>
                      <Badge variant="outline">{dim.overallScore}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* What resilience is NOT */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Vad resiliens inte är</div>
                    <p className="text-sm text-muted-foreground">
                      {RESILIENCE_CLARIFICATION.sv}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shock Matching Tab */}
          <TabsContent value="shocks">
            <ShockMatcher profile={profile} />
          </TabsContent>

          {/* Stress/Resilience Matrix Tab */}
          <TabsContent value="matrix">
            <StressResilienceMatrix 
              data={EXAMPLE_MATRIX_DATA}
              highlightEntity={selectedEntity}
            />
          </TabsContent>

          {/* Erosion Tab */}
          <TabsContent value="erosion" className="space-y-6">
            <ErosionView
              dimensionId="economic_elasticity"
              data={EXAMPLE_EROSION_DATA}
              erosionRate={-2.8}
              projectedValue={55}
            />
            <ErosionView
              dimensionId="social_cohesion"
              data={[
                { date: '2020', value: 75 },
                { date: '2021', value: 73 },
                { date: '2022', value: 71 },
                { date: '2023', value: 69 },
                { date: '2024', value: 68 },
              ]}
              erosionRate={-1.4}
              projectedValue={66}
            />
          </TabsContent>

          {/* Global Tab */}
          <TabsContent value="global">
            <div className="grid md:grid-cols-2 gap-6">
              <ResilienceSnapshotCard snapshot={EXAMPLE_SNAPSHOT} />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Jämförande resiliens</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Länder med liknande stressnivåer kan ha olika återhämtningsförmåga.
                  </p>
                  <div className="space-y-3">
                    {EXAMPLE_MATRIX_DATA.slice(0, 4).map((entity) => (
                      <div 
                        key={entity.entityId}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded"
                      >
                        <span className="font-medium">{entity.entityName}</span>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-muted-foreground">
                            Stress: {entity.stress}
                          </span>
                          <span className="font-medium">
                            Resiliens: {entity.resilience}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
