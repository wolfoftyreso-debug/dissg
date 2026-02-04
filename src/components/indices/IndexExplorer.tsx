/**
 * INDEX EXPLORER - Main Dashboard for Index System
 * 
 * Hierarchical navigation through all indices organized by category.
 * Follows ODIS diagnostic layout with tree navigation and detail panel.
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  ChevronRight,
  Info,
  ExternalLink,
  Layers,
  BarChart3,
  Globe2,
  Clock,
} from 'lucide-react';
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
  initialIndexCode?: string;
}

export function IndexExplorer({ 
  className, 
  initialCategory,
  initialIndexCode 
}: IndexExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<IndexCategory | null>(
    initialCategory || null
  );
  const [selectedIndex, setSelectedIndex] = useState<IndexDefinition | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'browse' | 'compare' | 'trends'>('browse');

  // Filter indices based on search
  const filteredIndices = useMemo(() => {
    if (!searchQuery.trim()) {
      return selectedCategory 
        ? getIndicesByCategory(selectedCategory)
        : INDEX_REGISTRY;
    }

    const query = searchQuery.toLowerCase();
    return INDEX_REGISTRY.filter(idx => 
      idx.name_sv.toLowerCase().includes(query) ||
      idx.name_en.toLowerCase().includes(query) ||
      idx.description.toLowerCase().includes(query) ||
      idx.code.toLowerCase().includes(query)
    );
  }, [searchQuery, selectedCategory]);

  // Group indices by category for overview
  const indexesByCategory = useMemo(() => {
    const grouped: Record<IndexCategory, IndexDefinition[]> = {} as any;
    INDEX_CATEGORIES.forEach(cat => {
      grouped[cat.code] = getIndicesByCategory(cat.code);
    });
    return grouped;
  }, []);

  // Stats
  const totalIndices = INDEX_REGISTRY.length;
  const categoriesCount = INDEX_CATEGORIES.length;

  const handleSelectIndex = (index: IndexDefinition) => {
    setSelectedIndex(index);
  };

  const handleBackToList = () => {
    setSelectedIndex(null);
  };

  // If an index is selected, show detail view
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
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b bg-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Layers className="h-6 w-6 text-primary" />
              Index Explorer
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {totalIndices} index i {categoriesCount} kategorier • Klicka för att utforska
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök index..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Category filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Alla
            </Button>
            {INDEX_CATEGORIES.map(cat => (
              <Button
                key={cat.code}
                variant={selectedCategory === cat.code ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.code)}
              >
                {cat.name_sv}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start px-4 pt-2 rounded-none border-b bg-transparent">
          <TabsTrigger value="browse" className="gap-2">
            <Layers className="h-4 w-4" />
            Utforska
          </TabsTrigger>
          <TabsTrigger value="compare" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Jämför
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2">
            <Activity className="h-4 w-4" />
            Trender
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              {/* Show categories or filtered results */}
              {!searchQuery && !selectedCategory ? (
                // Show all categories
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
                // Show filtered/category results
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      {selectedCategory 
                        ? INDEX_CATEGORIES.find(c => c.code === selectedCategory)?.name_sv
                        : 'Sökresultat'
                      }
                    </h2>
                    <Badge variant="secondary">
                      {filteredIndices.length} index
                    </Badge>
                  </div>
                  
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredIndices.map(idx => (
                        <IndexCard 
                          key={idx.code} 
                          index={idx} 
                          onClick={() => handleSelectIndex(idx)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredIndices.map(idx => (
                        <IndexListItem 
                          key={idx.code} 
                          index={idx} 
                          onClick={() => handleSelectIndex(idx)}
                        />
                      ))}
                    </div>
                  )}
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
            <Activity className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Trend-analys</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Visualisera historisk utveckling och prognoser för index. 
              Välj ett index ovan för att se detaljerad trend-data.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Index Card Component
function IndexCard({ 
  index, 
  onClick 
}: { 
  index: IndexDefinition; 
  onClick: () => void;
}) {
  const directionIcon = {
    higher_better: <TrendingUp className="h-3 w-3 text-trend-up" />,
    lower_better: <TrendingDown className="h-3 w-3 text-trend-down" />,
    neutral_optimal: <Minus className="h-3 w-3 text-trend-stable" />,
  };

  return (
    <Card 
      className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Badge variant="outline" className="text-xs font-mono">
            {index.code}
          </Badge>
          {directionIcon[index.direction]}
        </div>
        <CardTitle className="text-base group-hover:text-primary transition-colors">
          {index.name_sv}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {index.description}
        </p>
        
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {index.update_frequency === 'annual' ? 'Årlig' : 
             index.update_frequency === 'quarterly' ? 'Kvartalsvis' :
             index.update_frequency === 'monthly' ? 'Månatlig' : 'Veckovis'}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <Globe2 className="h-3 w-3 mr-1" />
            {index.geo_coverage === 'global' ? 'Global' :
             index.geo_coverage === 'oecd' ? 'OECD' :
             index.geo_coverage === 'eu' ? 'EU' : 'Regional'}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>{index.primary_sources[0]}</span>
          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  );
}

// Index List Item Component
function IndexListItem({ 
  index, 
  onClick 
}: { 
  index: IndexDefinition; 
  onClick: () => void;
}) {
  return (
    <div
      className="flex items-center gap-4 p-3 rounded-lg border hover:border-primary/50 hover:bg-muted/50 cursor-pointer transition-colors group"
      onClick={onClick}
    >
      <Badge variant="outline" className="font-mono shrink-0 w-32 justify-center">
        {index.code}
      </Badge>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium group-hover:text-primary transition-colors truncate">
          {index.name_sv}
        </h4>
        <p className="text-xs text-muted-foreground truncate">
          {index.description}
        </p>
      </div>
      
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant="secondary" className="text-xs">
          {index.update_frequency === 'annual' ? 'Årlig' : 
           index.update_frequency === 'quarterly' ? 'Kvartalsvis' :
           index.update_frequency === 'monthly' ? 'Månatlig' : 'Veckovis'}
        </Badge>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}

export default IndexExplorer;
