import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Layers } from 'lucide-react';
import { 
  DepthNavigator, 
  SimulationPanel, 
  CausalChainViewer, 
  PrivacyInfoCard 
} from '@/components/depth';
import type { DepthLevel } from '@/config/depthModelConfig';

/**
 * DEL XV: Demo-sida för oändligt djup
 * 
 * Visar hela djupmodellen: navigation, simulering, orsakskedjor, integritetsskydd
 */
const DepthDemo = () => {
  const [currentLevel, setCurrentLevel] = useState<DepthLevel>(0);
  const [observationCount, setObservationCount] = useState(1000000);

  // Simulera minskat underlag vid djupare nivåer
  const handleLevelChange = (level: DepthLevel) => {
    setCurrentLevel(level);
    const counts = [1000000, 250000, 45000, 800, 120, 0];
    setObservationCount(counts[level] || 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <a href="/">
                <ArrowLeft className="h-5 w-5" />
              </a>
            </Button>
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Djupanalys (DEL XV Demo)
              </h1>
              <p className="text-sm text-muted-foreground">
                Oändligt analytiskt djup – aldrig identifierande djup
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Navigation & Privacy */}
          <div className="space-y-6">
            <DepthNavigator
              currentLevel={currentLevel}
              onLevelChange={handleLevelChange}
              observationCount={observationCount}
              selectedRegion="Stockholm"
              selectedKpi="Sysselsättning"
            />
            <PrivacyInfoCard />
          </div>

          {/* Middle Column: Simulation */}
          <div>
            <SimulationPanel />
          </div>

          {/* Right Column: Causal Chains */}
          <div>
            <CausalChainViewer kpiName="Sysselsättningsgrad" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DepthDemo;
