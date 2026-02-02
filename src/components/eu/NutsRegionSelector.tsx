/**
 * NUTS Region Selector - Hierarkisk navigering av EU-regioner
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, MapPin, Users, Search, ChevronDown } from 'lucide-react';
import { useNutsRegions } from '@/hooks/useEuData';
import { nutsLevelConfig, type NutsLevel } from '@/config/euConfig';

interface NutsRegionSelectorProps {
  nutsLevel: NutsLevel;
  countryCode?: string;
  onSelectRegion: (code: string) => void;
}

export function NutsRegionSelector({ nutsLevel, countryCode, onSelectRegion }: NutsRegionSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCodes, setExpandedCodes] = useState<Set<string>>(new Set());

  const { data: regions, isLoading } = useNutsRegions(countryCode);

  // Group regions by level
  const regionsByLevel = regions?.reduce((acc, region) => {
    const level = region.nuts_level as NutsLevel;
    if (!acc[level]) acc[level] = [];
    acc[level].push(region);
    return acc;
  }, {} as Record<NutsLevel, typeof regions>) || {};

  // Filter by search
  const filteredRegions = regions?.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.name_local?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (code: string) => {
    const newExpanded = new Set(expandedCodes);
    if (newExpanded.has(code)) {
      newExpanded.delete(code);
    } else {
      newExpanded.add(code);
    }
    setExpandedCodes(newExpanded);
  };

  const getChildRegions = (parentCode: string) => {
    return regions?.filter(r => r.parent_code === parentCode) || [];
  };

  const formatPopulation = (pop: number | null) => {
    if (!pop) return 'N/A';
    if (pop >= 1000000) return `${(pop / 1000000).toFixed(1)}M`;
    if (pop >= 1000) return `${(pop / 1000).toFixed(0)}k`;
    return pop.toString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Laddar regioner...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Sök region eller kod..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* NUTS Level info */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <MapPin className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <div className="font-semibold">{nutsLevelConfig[nutsLevel].label}</div>
            <div className="text-sm text-muted-foreground">{nutsLevelConfig[nutsLevel].description}</div>
          </div>
          <Badge variant="outline">
            {regionsByLevel[nutsLevel]?.length || 0} regioner
          </Badge>
        </CardContent>
      </Card>

      {/* Regions list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {searchQuery ? 'Sökresultat' : 'NUTS-hierarki'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {searchQuery ? (
              // Search results
              <div className="space-y-2">
                {filteredRegions?.map(region => (
                  <RegionCard
                    key={region.id}
                    region={region}
                    onSelect={() => onSelectRegion(region.code)}
                    formatPopulation={formatPopulation}
                  />
                ))}
                {filteredRegions?.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    Inga regioner matchar sökningen
                  </div>
                )}
              </div>
            ) : (
              // Hierarchical view
              <div className="space-y-2">
                {(regionsByLevel[0] || []).map(country => (
                  <div key={country.id}>
                    <div
                      className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted cursor-pointer"
                      onClick={() => toggleExpand(country.code)}
                    >
                      {expandedCodes.has(country.code) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <span className="font-semibold">{country.name}</span>
                      <Badge variant="secondary" className="ml-auto">
                        NUTS 0
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatPopulation(country.population)}
                      </span>
                    </div>
                    
                    {/* NUTS 1 children */}
                    {expandedCodes.has(country.code) && (
                      <div className="ml-6 space-y-1 border-l pl-4 mt-1">
                        {getChildRegions(country.code).map(nuts1 => (
                          <div key={nuts1.id}>
                            <div
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer text-sm"
                              onClick={() => toggleExpand(nuts1.code)}
                            >
                              {getChildRegions(nuts1.code).length > 0 ? (
                                expandedCodes.has(nuts1.code) ? (
                                  <ChevronDown className="h-3 w-3" />
                                ) : (
                                  <ChevronRight className="h-3 w-3" />
                                )
                              ) : (
                                <div className="w-3" />
                              )}
                              <span>{nuts1.name}</span>
                              <Badge variant="outline" className="ml-auto text-xs">
                                NUTS 1
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatPopulation(nuts1.population)}
                              </span>
                            </div>
                            
                            {/* NUTS 2 children */}
                            {expandedCodes.has(nuts1.code) && (
                              <div className="ml-4 space-y-1 border-l pl-3 mt-1">
                                {getChildRegions(nuts1.code).map(nuts2 => (
                                  <div
                                    key={nuts2.id}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 cursor-pointer text-sm"
                                    onClick={() => onSelectRegion(nuts2.code)}
                                  >
                                    <MapPin className="h-3 w-3 text-primary" />
                                    <span>{nuts2.name}</span>
                                    <Badge variant="default" className="ml-auto text-xs">
                                      NUTS 2
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {formatPopulation(nuts2.population)}
                                    </span>
                                    <ChevronRight className="h-3 w-3" />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function RegionCard({ 
  region, 
  onSelect, 
  formatPopulation 
}: { 
  region: { code: string; name: string; name_local: string | null; nuts_level: number; population: number | null };
  onSelect: () => void;
  formatPopulation: (pop: number | null) => string;
}) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted cursor-pointer transition-colors"
      onClick={onSelect}
    >
      <div className="p-2 rounded-lg bg-primary/10">
        <MapPin className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{region.name}</div>
        {region.name_local && region.name_local !== region.name && (
          <div className="text-xs text-muted-foreground truncate">{region.name_local}</div>
        )}
      </div>
      <Badge variant="secondary">
        NUTS {region.nuts_level}
      </Badge>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Users className="h-3 w-3" />
        {formatPopulation(region.population)}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}

export default NutsRegionSelector;
