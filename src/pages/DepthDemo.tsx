import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Layers, MapPin, Sparkles, Shield, Scale, Repeat } from 'lucide-react';
import { 
  DepthNavigator, 
  CausalChainViewer, 
  MapExplorer,
  AdvancedSimulation,
  PrivacySpärrar,
  DatapointDisclaimer,
  ClusterExplainerDetailed,
  InfiniteDepthEngine,
} from '@/components/depth';
import type { DepthLevel } from '@/config/depthModelConfig';

/**
 * DEL XV-XIX: Demo-sida för oändligt djup
 * 
 * Visar hela djupmodellen:
 * - Kart-UX med 4 zoom-nivåer (DEL XVI)
 * - Klusterlogik med datapunkter (DEL XVI)
 * - Simulering & sandbox (DEL XVII)
 * - Privacy-by-design spärrar (DEL XVIII)
 * - Rekursiv design med oändliga "varför" (DEL XIX)
 */
const DepthDemo = () => {
  const [currentLevel, setCurrentLevel] = useState<DepthLevel>(0);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [observationCount, setObservationCount] = useState(1000000);
  const [activeTab, setActiveTab] = useState('map');
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  // Simulera minskat underlag vid djupare nivåer
  const handleLevelChange = (level: DepthLevel) => {
    setCurrentLevel(level);
    const counts = [1000000, 250000, 45000, 800, 120, 0];
    setObservationCount(counts[level] || 0);
    setZoomLevel(Math.min(level, 3) as 0 | 1 | 2 | 3);
  };

  const handleRegionSelect = (_regionId: string, zoom: number) => {
    setZoomLevel(zoom);
    setObservationCount(Math.max(50, 100000 / Math.pow(10, zoom)));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="/">
                  <ArrowLeft className="h-5 w-5" />
                </a>
              </Button>
              <div>
                <h1 className="text-xl font-semibold flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Djupanalys
                  <Badge variant="outline" className="ml-2 text-xs gap-1">
                    <Scale className="h-3 w-3" />
                    DEL XV-XIX
                  </Badge>
                </h1>
                <p className="text-sm text-muted-foreground">
                  Oändligt analytiskt djup – aldrig identifierande djup
                </p>
              </div>
            </div>
            <DatapointDisclaimer />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="map" className="gap-1.5">
              <MapPin className="h-4 w-4" />
              Karta (XVI)
            </TabsTrigger>
            <TabsTrigger value="clusters" className="gap-1.5">
              <Layers className="h-4 w-4" />
              Kluster (XVI)
            </TabsTrigger>
            <TabsTrigger value="simulation" className="gap-1.5">
              <Sparkles className="h-4 w-4" />
              Simulering (XVII)
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-1.5">
              <Shield className="h-4 w-4" />
              Privacy (XVIII)
            </TabsTrigger>
            <TabsTrigger value="infinite" className="gap-1.5">
              <Repeat className="h-4 w-4" />
              Oändligt (XIX)
            </TabsTrigger>
          </TabsList>

          {/* DEL XVI - Kart-UX */}
          <TabsContent value="map" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MapExplorer 
                  onRegionSelect={handleRegionSelect}
                  className="h-full"
                />
              </div>
              <div className="space-y-6">
                <PrivacySpärrar 
                  currentObservations={observationCount}
                  currentZoomLevel={zoomLevel}
                />
              </div>
            </div>
          </TabsContent>

          {/* DEL XVI - Klusterlogik */}
          <TabsContent value="clusters" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClusterExplainerDetailed 
                selectedClusterId={selectedCluster ?? undefined}
                onClusterSelect={setSelectedCluster}
              />
              <div className="space-y-6">
                <DepthNavigator
                  currentLevel={currentLevel}
                  onLevelChange={handleLevelChange}
                  observationCount={observationCount}
                  selectedRegion="Kluster"
                  selectedKpi="Sysselsättning"
                />
                <PrivacySpärrar 
                  currentObservations={observationCount}
                  currentZoomLevel={zoomLevel}
                />
              </div>
            </div>
          </TabsContent>

          {/* DEL XVII - Simulering */}
          <TabsContent value="simulation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdvancedSimulation 
                userRole="researcher"
                userDepartment="Arbetsmarknadsdepartementet"
              />
              <CausalChainViewer kpiName="Sysselsättningsgrad" />
            </div>
          </TabsContent>

          {/* DEL XVIII - Privacy */}
          <TabsContent value="privacy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PrivacySpärrar 
                currentObservations={observationCount}
                currentZoomLevel={zoomLevel}
              />
              <div className="space-y-6">
                <DepthNavigator
                  currentLevel={currentLevel}
                  onLevelChange={handleLevelChange}
                  observationCount={observationCount}
                  selectedRegion="Stockholm"
                  selectedKpi="Sysselsättning"
                />
              </div>
            </div>
          </TabsContent>

          {/* DEL XIX - Oändligt djup */}
          <TabsContent value="infinite" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InfiniteDepthEngine />
              <div className="space-y-6">
                <CausalChainViewer kpiName="Sysselsättningsgrad" />
                <PrivacySpärrar 
                  currentObservations={observationCount}
                  currentZoomLevel={currentLevel}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DepthDemo;