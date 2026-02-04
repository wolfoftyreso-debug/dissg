/**
 * COUNTRY SELECTOR - Multi-select with search
 * 
 * Searchable dropdown for selecting multiple countries.
 * Groups by region, supports quick selection of common groups.
 * 
 * NO ICONS - text markers only per design doctrine.
 */

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { 
  WORLD_COUNTRIES, 
  COUNTRIES_BY_REGION, 
  REGIONS, 
  type CountryInfo 
} from '@/lib/data/world-countries';

interface CountrySelectorProps {
  selectedCountries: string[];
  onSelectionChange: (countries: string[]) => void;
  maxSelections?: number;
  className?: string;
}

// Quick selection presets
const PRESETS = [
  { id: 'nordic', label: '[NORD]', codes: ['SE', 'NO', 'DK', 'FI', 'IS'] },
  { id: 'eu', label: '[EU]', codes: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PL', 'SE', 'DK'] },
  { id: 'g7', label: '[G7]', codes: ['US', 'CA', 'GB', 'FR', 'DE', 'IT', 'JP'] },
  { id: 'brics', label: '[BRICS]', codes: ['BR', 'RU', 'IN', 'CN', 'ZA'] },
  { id: 'oecd', label: '[OECD]', codes: ['US', 'CA', 'MX', 'GB', 'DE', 'FR', 'IT', 'JP', 'KR', 'AU'] },
];

export function CountrySelector({
  selectedCountries,
  onSelectionChange,
  maxSelections = 10,
  className,
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set(['Europe']));

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return WORLD_COUNTRIES;
    
    const query = searchQuery.toLowerCase();
    return WORLD_COUNTRIES.filter(
      c => c.name_sv.toLowerCase().includes(query) ||
           c.name_en.toLowerCase().includes(query) ||
           c.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group filtered countries by region
  const groupedFiltered = useMemo(() => {
    return filteredCountries.reduce((acc, country) => {
      if (!acc[country.region]) {
        acc[country.region] = [];
      }
      acc[country.region].push(country);
      return acc;
    }, {} as Record<string, CountryInfo[]>);
  }, [filteredCountries]);

  const toggleCountry = (code: string) => {
    if (selectedCountries.includes(code)) {
      onSelectionChange(selectedCountries.filter(c => c !== code));
    } else if (selectedCountries.length < maxSelections) {
      onSelectionChange([...selectedCountries, code]);
    }
  };

  const removeCountry = (code: string) => {
    onSelectionChange(selectedCountries.filter(c => c !== code));
  };

  const applyPreset = (codes: string[]) => {
    onSelectionChange(codes.slice(0, maxSelections));
  };

  const toggleRegion = (region: string) => {
    const next = new Set(expandedRegions);
    if (next.has(region)) {
      next.delete(region);
    } else {
      next.add(region);
    }
    setExpandedRegions(next);
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className={cn("space-y-2 font-mono", className)}>
      {/* Selected countries display */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground shrink-0">Länder:</span>
        <div className="flex flex-wrap gap-1 flex-1">
          {selectedCountries.map(code => {
            const country = WORLD_COUNTRIES.find(c => c.code === code);
            return (
              <Badge 
                key={code}
                variant="default"
                className="gap-1 cursor-pointer hover:bg-destructive/80"
                onClick={() => removeCountry(code)}
              >
                {country?.name_sv || code}
                <span className="ml-1 opacity-70">[X]</span>
              </Badge>
            );
          })}
          {selectedCountries.length === 0 && (
            <span className="text-xs text-muted-foreground italic">Inga valda</span>
          )}
        </div>
        
        {/* Add button */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0 font-mono">
              [+] Lägg till
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-[400px] p-0 font-mono z-50 bg-popover" 
            align="end"
            sideOffset={5}
          >
            <div className="p-3 border-b bg-muted/30">
              <Input
                placeholder="[SÖK] Sök land..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 text-sm font-mono"
              />
            </div>

            {/* Presets */}
            <div className="p-2 border-b flex flex-wrap gap-1">
              {PRESETS.map(preset => (
                <Button
                  key={preset.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => applyPreset(preset.codes)}
                  className="h-6 px-2 text-xs"
                >
                  {preset.label}
                </Button>
              ))}
              {selectedCountries.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="h-6 px-2 text-xs text-destructive ml-auto"
                >
                  [RENSA]
                </Button>
              )}
            </div>

            {/* Country list */}
            <ScrollArea className="h-[300px]">
              <div className="p-2 space-y-1">
                {Object.entries(groupedFiltered).map(([region, countries]) => (
                  <div key={region} className="space-y-1">
                    {/* Region header */}
                    <button
                      onClick={() => toggleRegion(region)}
                      className="w-full flex items-center justify-between px-2 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted/50 rounded"
                    >
                      <span>{region}</span>
                      <span className="flex items-center gap-2">
                        <span>{countries.length}</span>
                        <span>{expandedRegions.has(region) ? '[−]' : '[+]'}</span>
                      </span>
                    </button>

                    {/* Countries in region */}
                    {expandedRegions.has(region) && (
                      <div className="grid grid-cols-2 gap-1 pl-2">
                        {countries.map(country => {
                          const isSelected = selectedCountries.includes(country.code);
                          const isDisabled = !isSelected && selectedCountries.length >= maxSelections;
                          
                          return (
                            <button
                              key={country.code}
                              onClick={() => !isDisabled && toggleCountry(country.code)}
                              disabled={isDisabled}
                              className={cn(
                                "flex items-center gap-2 px-2 py-1.5 text-xs rounded transition-colors text-left",
                                isSelected 
                                  ? "bg-primary text-primary-foreground" 
                                  : "hover:bg-muted/50",
                                isDisabled && "opacity-50 cursor-not-allowed"
                              )}
                            >
                              <span className="text-[10px] opacity-70">{country.code}</span>
                              <span className="flex-1 truncate">{country.name_sv}</span>
                              {isSelected && <span>[✓]</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-2 border-t bg-muted/30 text-xs text-muted-foreground flex justify-between">
              <span>{selectedCountries.length}/{maxSelections} valda</span>
              <span>{WORLD_COUNTRIES.length} länder tillgängliga</span>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default CountrySelector;
