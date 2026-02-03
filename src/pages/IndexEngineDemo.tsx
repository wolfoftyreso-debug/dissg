/**
 * BLOCK 2: INDEX ENGINE DEMO PAGE
 * 
 * Shows all core indices with unified viewer
 */

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SystemBreadcrumbs, HierarchyPathComponent } from '@/components/navigation';
import { UnifiedIndexViewer } from '@/components/indices';
import { 
  INDEX_DEFINITIONS, 
  INDEX_COMPONENTS,
  calculateIndexValue,
  type CompositeIndex,
  type IndexComponent 
} from '@/config/coreIndexEngineConfig';
import type { DataQualityMetrics } from '@/components/quality';

// Generate mock data for demo
const generateMockIndex = (code: string): CompositeIndex => {
  const def = INDEX_DEFINITIONS[code];
  const componentDefs = INDEX_COMPONENTS[code] || [];
  
  const components: IndexComponent[] = componentDefs.map(c => ({
    id: c.id,
    name: c.name,
    nameSv: c.nameSv,
    weight: c.defaultWeight,
    value: Math.random() * 40 + 40, // 40-80
    rawValue: Math.random() * 100,
    unit: c.unit,
    trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
    uncertainty: Math.floor(Math.random() * 15) + 5,
    source: ['Världsbanken', 'OECD', 'Eurostat', 'SCB'][Math.floor(Math.random() * 4)],
    lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    methodology: 'Normaliserat till 0-100 baserat på global min/max.'
  }));

  const value = calculateIndexValue(components, def.aggregationMethod);
  const prevValue = value + (Math.random() - 0.5) * 10;
  const changePercent = ((value - prevValue) / prevValue) * 100;

  return {
    ...def,
    value,
    components,
    trend: changePercent > 1 ? 'up' : changePercent < -1 ? 'down' : 'stable',
    changePercent,
    changeAbsolute: value - prevValue,
    overallUncertainty: Math.floor(Math.random() * 10) + 8,
    dataQuality: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
    coverageCountries: Math.floor(Math.random() * 50) + 150,
    lastCalculated: new Date()
  };
};

const generateMockQuality = (): DataQualityMetrics => ({
  completeness: Math.floor(Math.random() * 20) + 75,
  freshness: Math.floor(Math.random() * 25) + 70,
  reliability: Math.floor(Math.random() * 15) + 80,
  consistency: Math.floor(Math.random() * 20) + 75,
  hasBiasRisk: Math.random() > 0.8,
  hasMethodDrift: Math.random() > 0.9,
  isEstimated: Math.random() > 0.7,
  hasCensorshipRisk: Math.random() > 0.95,
  lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  sourceCount: Math.floor(Math.random() * 10) + 3,
  coverageCountries: Math.floor(Math.random() * 50) + 150,
  missingDataPoints: Math.floor(Math.random() * 20),
  qualityNotes: ['Viss eftersläpning i Afrikas data', 'Ny metodversion 2024']
});

const IndexEngineDemo: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState('GRI');
  
  const indices = Object.keys(INDEX_DEFINITIONS);
  const currentIndex = generateMockIndex(activeIndex);
  const currentQuality = generateMockQuality();

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      {/* Navigation */}
      <SystemBreadcrumbs
        items={[
          { id: 'world', label: 'World', labelSv: 'Världen', level: 'world', href: '/' },
          { id: 'indices', label: 'Indices', labelSv: 'Index', level: 'indicator', href: '/indices' },
          { id: 'current', label: currentIndex.code, labelSv: currentIndex.code, level: 'method' }
        ]}
      />

      <HierarchyPathComponent
        path={{
          civilization: 'Global',
          system: 'Index Engine',
          indicator: currentIndex.nameSv
        }}
      />

      {/* Index selector */}
      <Tabs value={activeIndex} onValueChange={setActiveIndex}>
        <TabsList className="grid grid-cols-6 w-full">
          {indices.map(code => (
            <TabsTrigger key={code} value={code} className="text-xs">
              {code}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Index viewer */}
      <UnifiedIndexViewer
        index={currentIndex}
        dataQuality={currentQuality}
        showMethodology={true}
        compact={false}
      />
    </div>
  );
};

export default IndexEngineDemo;
