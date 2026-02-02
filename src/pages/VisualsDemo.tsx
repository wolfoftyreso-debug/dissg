/**
 * Extreme Clarity Visuals Demo Page
 * 
 * Demonstrates:
 * - Clarity Charts (Avanza++)
 * - Annual Reports (Country Wrapped)
 * - Entity Comparison
 */

import React, { useState } from 'react';
import { ClarityChartDemo } from '@/components/charts/ClarityChart';
import { AnnualReportDemo } from '@/components/reports/AnnualReport';
import { EntityComparisonDemo } from '@/components/comparison/EntityComparison';
import { SystemBreadcrumbs } from '@/components/navigation/SystemBreadcrumbs';
import { DESIGN_PRINCIPLES } from '@/config/extremeClarityVisuals';

type DemoTab = 'charts' | 'reports' | 'comparison';

const VisualsDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DemoTab>('charts');

  const tabs: { id: DemoTab; label: string }[] = [
    { id: 'charts', label: 'Grafer' },
    { id: 'reports', label: 'Årsrapporter' },
    { id: 'comparison', label: 'Jämförelse' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <SystemBreadcrumbs 
            items={[
              { label: 'System', labelSv: 'System', level: 'world', href: '/' },
              { label: 'Visuals', labelSv: 'Visualiseringar', level: 'indicator' },
            ]}
          />
          <h1 className="text-3xl font-bold">Extreme Clarity Visual System</h1>
          <p className="text-muted-foreground">
            Grafer · Rapporter · Årssammanfattningar · Global jämförbarhet
          </p>
        </div>

        {/* Core principle */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm font-medium text-primary">Grundprincip</p>
          <p className="text-sm text-muted-foreground mt-1">
            En graf ska kunna förstås korrekt på 3 sekunder – och kunna förklaras 
            fullständigt på 3 klick. Om inte → grafen är fel.
          </p>
        </div>

        {/* Tab navigation */}
        <nav className="flex gap-2 border-b pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="min-h-[600px]">
          {activeTab === 'charts' && (
            <div className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Clarity Chart</h2>
                <p className="text-sm text-muted-foreground">
                  En graf = en fråga. 4-nivås klickdjup. Obligatoriska element: 
                  definition, jämförelse, osäkerhet, begränsningar.
                </p>
                
                {/* Graph rules reminder */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-muted rounded">✓ Max 1 färg/variabel</div>
                  <div className="p-2 bg-muted rounded">✓ Grått = historik</div>
                  <div className="p-2 bg-muted rounded">✗ Aldrig 3D</div>
                  <div className="p-2 bg-muted rounded">✗ Aldrig dubbla axlar</div>
                </div>
              </section>
              
              <div className="border rounded-lg">
                <ClarityChartDemo />
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Årsrapport ("Country Wrapped")</h2>
                <p className="text-sm text-muted-foreground">
                  Detta är inte marketing. Det är årets faktabokslut. Fast struktur 
                  för ALLA länder och städer.
                </p>
                
                {/* Report sections */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 bg-muted rounded">1. Så gick det</span>
                  <span className="px-2 py-1 bg-muted rounded">2. Årets kurva</span>
                  <span className="px-2 py-1 bg-muted rounded">3. Jämförelse</span>
                  <span className="px-2 py-1 bg-muted rounded">4. Förändringar</span>
                  <span className="px-2 py-1 bg-muted rounded">5. Stabilt</span>
                  <span className="px-2 py-1 bg-muted rounded">6. Begränsningar</span>
                </div>
              </section>
              
              <div className="border rounded-lg">
                <AnnualReportDemo />
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Jämförelsevy</h2>
                <p className="text-sm text-muted-foreground">
                  2–5 enheter, 1 indikator. Systemet blockerar ojämförbara kombinationer.
                  Hellre säga "kan inte jämföras" än visa fel.
                </p>
                
                {/* Comparison rules */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded">✓ Samma skala</span>
                  <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded">✓ Samma period</span>
                  <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded">✓ Samma metod</span>
                  <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded">✓ Samma definition</span>
                </div>
              </section>
              
              <div className="border rounded-lg">
                <EntityComparisonDemo />
              </div>
            </div>
          )}
        </div>

        {/* Design principles footer */}
        <footer className="pt-8 border-t">
          <blockquote className="italic text-muted-foreground text-sm">
            "{DESIGN_PRINCIPLES.essence}"
          </blockquote>
        </footer>
      </div>
    </div>
  );
};

export default VisualsDemo;
