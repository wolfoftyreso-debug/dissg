/**
 * INDEX COMPARISON VIEW
 * 
 * Compare multiple indices side by side.
 * Supports cross-country and cross-index comparisons.
 * 
 * NO ICONS - text markers only per design doctrine.
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { IndexDefinition, IndexCategory } from '@/lib/lambda';
import { INDEX_CATEGORIES } from '@/lib/lambda';

interface IndexComparisonViewProps {
  indices: IndexDefinition[];
  className?: string;
}

// Direction markers
const DIRECTION_MARKERS = {
  higher_better: '[+]',
  lower_better: '[−]',
  neutral_optimal: '[~]',
};

// Mock country data for demonstration
const DEMO_COUNTRIES = [
  { code: 'SE', name: 'Sverige' },
  { code: 'NO', name: 'Norge' },
  { code: 'DK', name: 'Danmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'DE', name: 'Tyskland' },
  { code: 'FR', name: 'Frankrike' },
  { code: 'US', name: 'USA' },
  { code: 'JP', name: 'Japan' },
];

// Generate mock values for demo
function generateMockValue(indexCode: string, countryCode: string): number {
  // Deterministic pseudo-random based on codes
  const hash = (indexCode + countryCode).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return Math.abs(hash % 100);
}

export function IndexComparisonView({ indices, className }: IndexComparisonViewProps) {
  const [selectedIndices, setSelectedIndices] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['SE', 'NO', 'DK']);
  const [categoryFilter, setCategoryFilter] = useState<IndexCategory | 'all'>('all');

  // Filter indices by category
  const filteredIndices = useMemo(() => {
    if (categoryFilter === 'all') return indices;
    return indices.filter(idx => idx.category === categoryFilter);
  }, [indices, categoryFilter]);

  // Group by category for selection panel
  const indicesByCategory = useMemo(() => {
    const grouped: Record<IndexCategory, IndexDefinition[]> = {} as any;
    filteredIndices.forEach(idx => {
      if (!grouped[idx.category]) {
        grouped[idx.category] = [];
      }
      grouped[idx.category].push(idx);
    });
    return grouped;
  }, [filteredIndices]);

  const toggleIndex = (code: string) => {
    setSelectedIndices(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const toggleCountry = (code: string) => {
    setSelectedCountries(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const selectedIndexDefs = useMemo(() => 
    selectedIndices.map(code => indices.find(i => i.code === code)).filter(Boolean) as IndexDefinition[],
    [selectedIndices, indices]
  );

  return (
    <div className={cn("flex h-full font-mono", className)}>
      {/* Selection Panel */}
      <div className="w-80 border-r bg-muted/30 flex flex-col shrink-0">
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-3">Välj index att jämföra</h3>
          
          {/* Category filter */}
          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as any)}>
            <SelectTrigger className="w-full font-mono">
              <SelectValue placeholder="Filtrera kategori" />
            </SelectTrigger>
            <SelectContent className="bg-popover font-mono">
              <SelectItem value="all">Alla kategorier</SelectItem>
              {INDEX_CATEGORIES.map(cat => (
                <SelectItem key={cat.code} value={cat.code}>
                  {cat.name_sv}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {Object.entries(indicesByCategory).map(([category, categoryIndices]) => {
              const categoryInfo = INDEX_CATEGORIES.find(c => c.code === category);
              return (
                <div key={category} className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {categoryInfo?.name_sv || category}
                  </h4>
                  <div className="space-y-1">
                    {categoryIndices.map(idx => (
                      <div 
                        key={idx.code}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
                          selectedIndices.includes(idx.code) 
                            ? "bg-primary/10 border border-primary/30" 
                            : "hover:bg-muted"
                        )}
                        onClick={() => toggleIndex(idx.code)}
                      >
                        <Checkbox 
                          checked={selectedIndices.includes(idx.code)}
                          className="pointer-events-none"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{idx.name_sv}</p>
                          <p className="text-xs text-muted-foreground font-mono">{idx.code}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground">
            {selectedIndices.length} index valda
          </p>
        </div>
      </div>

      {/* Comparison Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Country selector */}
        <div className="p-4 border-b flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium">Länder:</span>
          {DEMO_COUNTRIES.map(country => (
            <Badge
              key={country.code}
              variant={selectedCountries.includes(country.code) ? 'default' : 'outline'}
              className="cursor-pointer font-mono"
              onClick={() => toggleCountry(country.code)}
            >
              {country.name}
              {selectedCountries.includes(country.code) && (
                <span className="ml-1">[X]</span>
              )}
            </Badge>
          ))}
        </div>

        {/* Comparison table or empty state */}
        {selectedIndices.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <span className="text-4xl font-mono text-muted-foreground mb-4">[JÄMFÖR]</span>
            <h3 className="text-lg font-semibold mb-2">Välj index att jämföra</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Markera index i panelen till vänster för att se en jämförelse
              mellan länder. Du kan välja flera index samtidigt.
            </p>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Index</TableHead>
                    {selectedCountries.map(countryCode => {
                      const country = DEMO_COUNTRIES.find(c => c.code === countryCode);
                      return (
                        <TableHead key={countryCode} className="text-center">
                          {country?.name || countryCode}
                        </TableHead>
                      );
                    })}
                    <TableHead className="text-center">Riktning</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedIndexDefs.map(idx => (
                    <TableRow key={idx.code}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{idx.name_sv}</p>
                          <p className="text-xs text-muted-foreground font-mono">{idx.code}</p>
                        </div>
                      </TableCell>
                      {selectedCountries.map(countryCode => {
                        const value = generateMockValue(idx.code, countryCode);
                        return (
                          <TableCell key={countryCode} className="text-center">
                            <span className={cn(
                              "font-mono font-medium",
                              idx.direction === 'higher_better' && value > 70 && 'text-trend-up',
                              idx.direction === 'higher_better' && value < 30 && 'text-trend-down',
                              idx.direction === 'lower_better' && value < 30 && 'text-trend-up',
                              idx.direction === 'lower_better' && value > 70 && 'text-trend-down',
                            )}>
                              {value.toFixed(1)}
                            </span>
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-center font-mono">
                        {DIRECTION_MARKERS[idx.direction]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Legend */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Tolkningsguide</h4>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="text-trend-up">[+]</span>
                    <span>Högre är bättre</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-trend-down">[−]</span>
                    <span>Lägre är bättre</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-trend-stable">[~]</span>
                    <span>Optimalt intervall</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Värden är normaliserade till skala 0-100. Grön indikerar positivt utfall relativt riktning.
                </p>
              </div>
            </div>
          </ScrollArea>
        )}

        {/* Actions */}
        {selectedIndices.length > 0 && (
          <div className="p-4 border-t flex items-center justify-between bg-card">
            <Button variant="outline" size="sm" onClick={() => setSelectedIndices([])} className="font-mono">
              [↺] Rensa urval
            </Button>
            <Button size="sm" className="font-mono">
              [↓] Exportera
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default IndexComparisonView;
