/**
 * INDEX EXPLORER - Professional Avanza-inspired Dashboard
 * 
 * Clean, dense, professional. Better than Avanza.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IndexWorldMap } from './IndexWorldMap';
import { IndexPanel } from './IndexPanel';
import { IndexDetailView } from './IndexDetailView';
import type { IndexDefinition } from '@/lib/lambda';
import { FileText, Bell, Star, AlertTriangle } from 'lucide-react';

interface IndexExplorerProps {
  className?: string;
}

// Mock data - text markers instead of emoji flags per no-icons-doctrine
const NORDIC_INDICES = [
  { code: 'SWE_RI', name: 'Sweden Reality Index', flag: 'SE', change: 0.31, value: 72.45, time: '17:29' },
  { code: 'NOR_RI', name: 'Norway Reality Index', flag: 'NO', change: 0.28, value: 74.12, time: '17:29' },
  { code: 'DEN_RI', name: 'Denmark Reality Index', flag: 'DK', change: -0.15, value: 73.88, time: '17:33' },
  { code: 'FIN_RI', name: 'Finland Reality Index', flag: 'FI', change: 0.42, value: 71.56, time: '17:30' },
  { code: 'ISL_RI', name: 'Iceland Reality Index', flag: 'IS', change: -0.08, value: 75.23, time: '17:30' },
];

const WORLD_INDICES = [
  { code: 'USA_RI', name: 'US Reality Index', flag: 'US', change: -0.67, value: 65.34, time: '22:04' },
  { code: 'CHN_RI', name: 'China Reality Index', flag: 'CN', change: -0.89, value: 58.92, time: '23:15' },
  { code: 'JPN_RI', name: 'Japan Reality Index', flag: 'JP', change: -0.34, value: 68.45, time: '22:04' },
  { code: 'GBR_RI', name: 'UK Reality Index', flag: 'GB', change: 0.21, value: 66.78, time: '18:00' },
  { code: 'AUS_RI', name: 'Australia Reality Index', flag: 'AU', change: 0.89, value: 70.12, time: '08:30' },
];

const EUROPEAN_INDICES = [
  { code: 'DEU_RI', name: 'Germany Reality Index', flag: 'DE', change: -0.52, value: 69.23, time: '18:00' },
  { code: 'FRA_RI', name: 'France Reality Index', flag: 'FR', change: 0.18, value: 67.45, time: '17:35' },
  { code: 'NLD_RI', name: 'Netherlands Reality Index', flag: 'NL', change: 0.34, value: 72.56, time: '18:15' },
  { code: 'CHE_RI', name: 'Switzerland Reality Index', flag: 'CH', change: 0.56, value: 76.89, time: '17:45' },
  { code: 'ESP_RI', name: 'Spain Reality Index', flag: 'ES', change: -0.23, value: 64.12, time: '18:00' },
];

const DOMAIN_INDICES = [
  { code: 'HEALTH_IDX', name: 'Hälsoindex', flag: '[H]', change: -0.45, value: 68.34, time: '00:30' },
  { code: 'ECON_IDX', name: 'Ekonomiindex', flag: '[E]', change: 0.82, value: 71.23, time: '00:30' },
  { code: 'EDU_IDX', name: 'Utbildningsindex', flag: '[U]', change: 0.12, value: 74.56, time: '00:30' },
  { code: 'ENV_IDX', name: 'Miljöindex', flag: '[M]', change: -0.67, value: 62.89, time: '00:30' },
  { code: 'SOC_IDX', name: 'Socialindex', flag: '[S]', change: 0.28, value: 69.45, time: '00:30' },
];

const SECTOR_INDICES = [
  { code: 'HOUSING_IDX', name: 'Bostadsindex', flag: '[B]', change: -1.23, value: 54.67, time: '00:26' },
  { code: 'LABOR_IDX', name: 'Arbetsmarknadsindex', flag: '[A]', change: 0.45, value: 67.89, time: '00:26' },
  { code: 'CRIME_IDX', name: 'Trygghetsindex', flag: '[T]', change: -0.89, value: 58.34, time: '00:26' },
  { code: 'TRUST_IDX', name: 'Tillitsindex', flag: '[F]', change: -0.34, value: 71.23, time: '00:26' },
  { code: 'DEMO_IDX', name: 'Demografiindex', flag: '[D]', change: -0.56, value: 63.45, time: '00:26' },
];

type TabType = 'today' | 'watchlist' | 'notes' | 'alerts';

export function IndexExplorer({ className }: IndexExplorerProps) {
  const [selectedIndex, setSelectedIndex] = useState<IndexDefinition | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('today');

  const handleBackToList = () => {
    setSelectedIndex(null);
  };

  // Detail view
  if (selectedIndex) {
    return (
      <IndexDetailView 
        index={selectedIndex}
        onBack={handleBackToList}
        className={className}
      />
    );
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'today', label: 'Index idag' },
    { id: 'watchlist', label: 'Mina bevakningar' },
    { id: 'notes', label: 'Anteckningar' },
    { id: 'alerts', label: 'Larm' },
  ];

  return (
    <div className={cn("flex flex-col h-full bg-background overflow-hidden", className)}>
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-card">
        <div className="px-6 pt-4">
          <h1 className="text-xl font-semibold text-foreground mb-3">Indexöversikt</h1>
          
          {/* Tab Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex gap-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors relative",
                    activeTab === tab.id 
                      ? "text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 pb-2">
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-normal">
                Index idag
                <span className="font-mono text-[10px]">[v]</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs font-normal">
                + Lägg till
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-normal">
                ↕ Sortera
              </Button>
              <span className="text-xs text-muted-foreground px-2">Drag and drop</span>
              <Button variant="secondary" size="sm" className="h-8 text-xs font-medium">
                Auto
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="flex-shrink-0 bg-status-warning/10 border-b border-status-warning/20 px-6 py-2">
        <p className="text-xs text-status-warning">
          <span className="font-semibold">Index innebär osäkerhet.</span>{' '}
          Att jämföra länder och regioner över tid är komplext. Index visar trender och relativa positioner, men ger inte fullständig bild. Klicka på valfritt index för fullständig metodbeskrivning.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'today' && (
          <div className="p-4 space-y-4">
            {/* World Map Section */}
            <IndexWorldMap />

            {/* Index Panels Grid - 5 columns on xl */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              <IndexPanel title="Nordiska index" items={NORDIC_INDICES} />
              <IndexPanel title="Världsindex" items={WORLD_INDICES} />
              <IndexPanel title="Europeiska index" items={EUROPEAN_INDICES} />
              <IndexPanel title="Domänindex" items={DOMAIN_INDICES} />
              <IndexPanel title="Sektorindex" items={SECTOR_INDICES} />
            </div>
          </div>
        )}

        {activeTab === 'watchlist' && (
          <div className="p-6">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Star className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h2 className="text-lg font-medium text-foreground mb-2">Mina bevakningar</h2>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                Lägg till index i din bevakningslista för att snabbt följa de länder och domäner du är mest intresserad av.
              </p>
              <Button variant="outline" size="sm">
                + Lägg till bevakning
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="p-6">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h2 className="text-lg font-medium text-foreground mb-2">Anteckningar</h2>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                Spara dina egna anteckningar om specifika index, trender eller observationer du vill komma ihåg.
              </p>
              <Button variant="outline" size="sm">
                + Ny anteckning
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="p-6">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h2 className="text-lg font-medium text-foreground mb-2">Larm</h2>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                Ställ in larm för att få notiser när ett index passerar en viss nivå eller förändras kraftigt.
              </p>
              <Button variant="outline" size="sm">
                + Skapa larm
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IndexExplorer;
