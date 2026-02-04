/**
 * INDEX EXPLORER - Avanza-inspired Dashboard
 * 
 * Clean, professional financial app aesthetic.
 * Data-dense but readable. No decorative elements.
 * 
 * NO ICONS - text markers only per design doctrine.
 */

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  INDEX_REGISTRY,
  INDEX_CATEGORIES,
  getIndicesByCategory,
  type IndexDefinition,
  type IndexCategory,
} from '@/lib/lambda';
import { IndexCategoryPanel } from './IndexCategoryPanel';
import { IndexDetailView } from './IndexDetailView';
import { IndexComparisonView } from './IndexComparisonView';

interface IndexExplorerProps {
  className?: string;
  initialCategory?: IndexCategory;
}

export function IndexExplorer({ 
  className, 
  initialCategory,
}: IndexExplorerProps) {
  const [selectedCategory] = useState<IndexCategory | null>(
    initialCategory || null
  );
  const [selectedIndex, setSelectedIndex] = useState<IndexDefinition | null>(null);
  const [searchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'browse' | 'compare' | 'trends'>('browse');

  // Group indices by category
  const indexesByCategory = useMemo(() => {
    const grouped: Record<IndexCategory, IndexDefinition[]> = {} as any;
    INDEX_CATEGORIES.forEach(cat => {
      grouped[cat.code] = getIndicesByCategory(cat.code);
    });
    return grouped;
  }, []);

  const handleSelectIndex = (index: IndexDefinition) => {
    setSelectedIndex(index);
  };

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

  return (
    <div className={cn("flex flex-col h-full bg-muted/30", className)}>
      {/* Compact Tab Navigation - Avanza style */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
        <div className="flex-shrink-0 bg-card border-b">
          <div className="flex items-center justify-between px-4 py-2">
            {/* Tabs */}
            <TabsList className="bg-transparent p-0 h-auto gap-1">
              <TabsTrigger 
                value="browse" 
                className="font-mono text-sm px-3 py-1.5 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
              >
                [UTFORSKA] Utforska
              </TabsTrigger>
              <TabsTrigger 
                value="compare" 
                className="font-mono text-sm px-3 py-1.5 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
              >
                [JÄMFÖR] Jämför
              </TabsTrigger>
              <TabsTrigger 
                value="trends" 
                className="font-mono text-sm px-3 py-1.5 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
              >
                [TREND] Trender
              </TabsTrigger>
            </TabsList>

            {/* View Toggle */}
            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="font-mono text-xs h-7 px-2"
              >
                [RUTNÄT]
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="font-mono text-xs h-7 px-2"
              >
                [LISTA]
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="browse" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {/* Show all categories */}
              {!searchQuery && !selectedCategory ? (
                INDEX_CATEGORIES.map(category => (
                  <IndexCategoryPanel
                    key={category.code}
                    category={category}
                    indices={indexesByCategory[category.code]}
                    viewMode={viewMode}
                    onSelectIndex={handleSelectIndex}
                  />
                ))
              ) : (
                // Filtered view placeholder
                <div className="text-center py-8 font-mono text-muted-foreground">
                  [FILTER] Filtrerad vy
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="compare" className="flex-1 m-0 overflow-hidden">
          <IndexComparisonView indices={INDEX_REGISTRY} />
        </TabsContent>

        <TabsContent value="trends" className="flex-1 m-0 p-4">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <span className="text-4xl font-mono text-muted-foreground mb-4">[TREND]</span>
            <h3 className="text-lg font-semibold mb-2 font-mono">Trend-analys</h3>
            <p className="text-sm text-muted-foreground max-w-md font-mono">
              Visualisera historisk utveckling och prognoser för index. 
              Välj ett index ovan för att se detaljerad trend-data.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default IndexExplorer;
