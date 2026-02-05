/**
 * OSCILLOSCOPE CONTROL PANEL
 * 
 * Avancerad kontrollpanel för oscilloskopvyn.
 * Hanterar val av geografi, indikatorer och tidsspann.
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// ============================================
// TYPES
// ============================================

export type GeoLevel = 'global' | 'region' | 'country' | 'city';

export interface GeoSelection {
  level: GeoLevel;
  code: string;
  name: string;
}

export interface IndicatorOption {
  code: string;
  name: string;
  category: string;
  color: string;
}

export interface TimeSpanOption {
  value: string;
  label: string;
  labelShort: string;
}

// ============================================
// DATA
// ============================================

const GEO_LEVELS: { value: GeoLevel; label: string }[] = [
  { value: 'global', label: 'Global' },
  { value: 'region', label: 'Region/Kontinent' },
  { value: 'country', label: 'Land' },
  { value: 'city', label: 'Stad' },
];

const REGIONS = [
  { code: 'EU', name: 'Europa' },
  { code: 'NA', name: 'Nordamerika' },
  { code: 'SA', name: 'Sydamerika' },
  { code: 'AS', name: 'Asien' },
  { code: 'AF', name: 'Afrika' },
  { code: 'OC', name: 'Oceanien' },
  { code: 'NORDIC', name: 'Norden' },
  { code: 'OECD', name: 'OECD' },
];

const COUNTRIES = [
  { code: 'SE', name: 'Sverige' },
  { code: 'NO', name: 'Norge' },
  { code: 'DK', name: 'Danmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'DE', name: 'Tyskland' },
  { code: 'FR', name: 'Frankrike' },
  { code: 'GB', name: 'Storbritannien' },
  { code: 'US', name: 'USA' },
  { code: 'CN', name: 'Kina' },
  { code: 'JP', name: 'Japan' },
  { code: 'IN', name: 'Indien' },
  { code: 'BR', name: 'Brasilien' },
];

const CITIES = [
  { code: 'SE-STO', name: 'Stockholm' },
  { code: 'SE-GBG', name: 'Göteborg' },
  { code: 'SE-MMO', name: 'Malmö' },
  { code: 'NO-OSL', name: 'Oslo' },
  { code: 'DK-CPH', name: 'Köpenhamn' },
  { code: 'FI-HEL', name: 'Helsingfors' },
];

const INDICATOR_CATEGORIES = [
  {
    name: 'Ekonomi',
    indicators: [
      { code: 'gdp_growth', name: 'BNP-tillväxt', color: 'hsl(142, 76%, 45%)' },
      { code: 'employment', name: 'Sysselsättning', color: 'hsl(217, 91%, 60%)' },
      { code: 'inflation', name: 'Inflation', color: 'hsl(24, 95%, 53%)' },
      { code: 'trade_balance', name: 'Handelsbalans', color: 'hsl(263, 70%, 50%)' },
      { code: 'debt_gdp', name: 'Statsskuld/BNP', color: 'hsl(330, 81%, 60%)' },
    ],
  },
  {
    name: 'Demografi',
    indicators: [
      { code: 'population', name: 'Befolkning', color: 'hsl(263, 70%, 50%)' },
      { code: 'birth_rate', name: 'Födelsetal', color: 'hsl(330, 81%, 60%)' },
      { code: 'median_age', name: 'Medianålder', color: 'hsl(172, 66%, 50%)' },
      { code: 'dependency_ratio', name: 'Försörjningskvot', color: 'hsl(45, 93%, 47%)' },
      { code: 'migration_net', name: 'Nettomigration', color: 'hsl(199, 89%, 48%)' },
    ],
  },
  {
    name: 'Hälsa',
    indicators: [
      { code: 'life_exp', name: 'Medellivslängd', color: 'hsl(142, 76%, 45%)' },
      { code: 'infant_mortality', name: 'Barnadödlighet', color: 'hsl(0, 84%, 60%)' },
      { code: 'disease_burden', name: 'Sjukdomsbörda', color: 'hsl(270, 70%, 60%)' },
      { code: 'healthcare_spending', name: 'Vårdkostnader', color: 'hsl(199, 89%, 48%)' },
    ],
  },
  {
    name: 'Utbildning',
    indicators: [
      { code: 'literacy', name: 'Läskunnighet', color: 'hsl(217, 91%, 60%)' },
      { code: 'mean_schooling', name: 'Skolår (genomsnitt)', color: 'hsl(142, 76%, 45%)' },
      { code: 'tertiary_enrollment', name: 'Högskoledeltagande', color: 'hsl(330, 81%, 60%)' },
    ],
  },
  {
    name: 'Miljö',
    indicators: [
      { code: 'co2_emissions', name: 'CO2-utsläpp', color: 'hsl(45, 93%, 47%)' },
      { code: 'renewable_energy', name: 'Förnybar energi', color: 'hsl(142, 76%, 45%)' },
      { code: 'air_quality', name: 'Luftkvalitet', color: 'hsl(199, 89%, 48%)' },
    ],
  },
];

const TIME_SPANS: TimeSpanOption[] = [
  { value: '1m', label: '1 månad', labelShort: '1M' },
  { value: '3m', label: '3 månader', labelShort: '3M' },
  { value: '6m', label: '6 månader', labelShort: '6M' },
  { value: '1y', label: '1 år', labelShort: '1Å' },
  { value: '2y', label: '2 år', labelShort: '2Å' },
  { value: '5y', label: '5 år', labelShort: '5Å' },
  { value: '10y', label: '10 år', labelShort: '10Å' },
  { value: '25y', label: '25 år', labelShort: '25Å' },
  { value: '50y', label: '50 år', labelShort: '50Å' },
  { value: 'max', label: 'Max historik', labelShort: 'MAX' },
];

// ============================================
// COMPONENT
// ============================================

interface OscilloscopeControlPanelProps {
  // Current selections
  geoSelections: GeoSelection[];
  selectedIndicators: string[];
  timeSpan: string;
  
  // Callbacks
  onGeoChange: (selections: GeoSelection[]) => void;
  onIndicatorsChange: (indicators: string[]) => void;
  onTimeSpanChange: (span: string) => void;
  
  className?: string;
}

export function OscilloscopeControlPanel({
  geoSelections,
  selectedIndicators,
  timeSpan,
  onGeoChange,
  onIndicatorsChange,
  onTimeSpanChange,
  className,
}: OscilloscopeControlPanelProps) {
  const [geoLevel, setGeoLevel] = useState<GeoLevel>('global');
  const [geoPopoverOpen, setGeoPopoverOpen] = useState(false);
  const [indicatorPopoverOpen, setIndicatorPopoverOpen] = useState(false);
  
  // Get available geo options based on level
  const getGeoOptions = () => {
    switch (geoLevel) {
      case 'global':
        return [{ code: 'GLOBAL', name: 'Global' }];
      case 'region':
        return REGIONS;
      case 'country':
        return COUNTRIES;
      case 'city':
        return CITIES;
      default:
        return [];
    }
  };
  
  // Toggle geo selection
  const toggleGeoSelection = (code: string, name: string) => {
    const exists = geoSelections.find(g => g.code === code);
    if (exists) {
      onGeoChange(geoSelections.filter(g => g.code !== code));
    } else {
      onGeoChange([...geoSelections, { level: geoLevel, code, name }]);
    }
  };
  
  // Toggle indicator selection
  const toggleIndicator = (code: string) => {
    if (selectedIndicators.includes(code)) {
      onIndicatorsChange(selectedIndicators.filter(i => i !== code));
    } else {
      onIndicatorsChange([...selectedIndicators, code]);
    }
  };
  
  // Get indicator by code
  const getIndicator = (code: string): IndicatorOption | undefined => {
    for (const cat of INDICATOR_CATEGORIES) {
      const ind = cat.indicators.find(i => i.code === code);
      if (ind) return { ...ind, category: cat.name };
    }
    return undefined;
  };
  
  return (
    <section 
      className={cn('bg-card border border-border p-4', className)}
      aria-label="Oscilloskop-kontroller"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* GEO SELECTOR */}
        <fieldset className="space-y-2">
          <legend className="text-xs font-mono text-muted-foreground uppercase tracking-wide mb-2">
            [GEO] Geografisk omfattning
          </legend>
          
          <div className="flex gap-2">
            <Select value={geoLevel} onValueChange={(v) => setGeoLevel(v as GeoLevel)}>
              <SelectTrigger className="flex-1 h-9 text-sm font-mono bg-background border-border">
                <SelectValue placeholder="Välj nivå" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                {GEO_LEVELS.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Popover open={geoPopoverOpen} onOpenChange={setGeoPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-9 px-3 font-mono text-sm">
                  [+] Lägg till
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0 bg-popover border-border z-50" align="start">
                <ScrollArea className="h-64">
                  <div className="p-2 space-y-1">
                    {getGeoOptions().map(opt => {
                      const isSelected = geoSelections.some(g => g.code === opt.code);
                      return (
                        <button
                          key={opt.code}
                          onClick={() => toggleGeoSelection(opt.code, opt.name)}
                          className={cn(
                            'w-full flex items-center gap-2 p-2 text-sm text-left rounded transition-colors',
                            isSelected 
                              ? 'bg-primary/10 text-primary' 
                              : 'hover:bg-muted'
                          )}
                        >
                          <Checkbox checked={isSelected} className="pointer-events-none" />
                          <span className="font-mono text-xs text-muted-foreground">{opt.code}</span>
                          <span>{opt.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Selected geo badges */}
          {geoSelections.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {geoSelections.map(geo => (
                <Badge 
                  key={geo.code} 
                  variant="secondary" 
                  className="font-mono text-xs cursor-pointer hover:bg-destructive/20"
                  onClick={() => toggleGeoSelection(geo.code, geo.name)}
                >
                  {geo.name} [x]
                </Badge>
              ))}
            </div>
          )}
        </fieldset>
        
        {/* INDICATOR SELECTOR */}
        <fieldset className="space-y-2">
          <legend className="text-xs font-mono text-muted-foreground uppercase tracking-wide mb-2">
            [DATA] Datapunkter / Indikatorer
          </legend>
          
          <Popover open={indicatorPopoverOpen} onOpenChange={setIndicatorPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-9 justify-between font-mono text-sm">
                <span>
                  {selectedIndicators.length === 0 
                    ? 'Välj indikatorer...' 
                    : `${selectedIndicators.length} valda`}
                </span>
                <span className="text-muted-foreground">[v]</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-popover border-border z-50" align="start">
              <ScrollArea className="h-80">
                <div className="p-2">
                  {INDICATOR_CATEGORIES.map(category => (
                    <div key={category.name} className="mb-3">
                      <div className="text-xs font-mono text-muted-foreground uppercase tracking-wide px-2 py-1 bg-muted/50">
                        {category.name}
                      </div>
                      <div className="space-y-0.5 mt-1">
                        {category.indicators.map(ind => {
                          const isSelected = selectedIndicators.includes(ind.code);
                          return (
                            <button
                              key={ind.code}
                              onClick={() => toggleIndicator(ind.code)}
                              className={cn(
                                'w-full flex items-center gap-2 p-2 text-sm text-left rounded transition-colors',
                                isSelected 
                                  ? 'bg-primary/10' 
                                  : 'hover:bg-muted'
                              )}
                            >
                              <Checkbox checked={isSelected} className="pointer-events-none" />
                              <div 
                                className="w-3 h-3 rounded-full shrink-0" 
                                style={{ backgroundColor: ind.color }} 
                              />
                              <span>{ind.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
          
          {/* Selected indicators as colored badges */}
          {selectedIndicators.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {selectedIndicators.map(code => {
                const ind = getIndicator(code);
                if (!ind) return null;
                return (
                  <Badge 
                    key={code} 
                    className="font-mono text-xs cursor-pointer"
                    style={{ 
                      backgroundColor: `${ind.color}20`, 
                      color: ind.color,
                      borderColor: ind.color,
                    }}
                    onClick={() => toggleIndicator(code)}
                  >
                    <div 
                      className="w-2 h-2 rounded-full mr-1" 
                      style={{ backgroundColor: ind.color }} 
                    />
                    {ind.name} [x]
                  </Badge>
                );
              })}
            </div>
          )}
        </fieldset>
        
        {/* TIME SPAN SELECTOR */}
        <fieldset className="space-y-2">
          <legend className="text-xs font-mono text-muted-foreground uppercase tracking-wide mb-2">
            [TIME] Tidsspann
          </legend>
          
          <Select value={timeSpan} onValueChange={onTimeSpanChange}>
            <SelectTrigger className="w-full h-9 text-sm font-mono bg-background border-border">
              <SelectValue placeholder="Välj tidsspann" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              {TIME_SPANS.map(ts => (
                <SelectItem key={ts.value} value={ts.value}>
                  {ts.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Quick time buttons */}
          <div className="flex flex-wrap gap-1 pt-1">
            {TIME_SPANS.slice(0, 6).map(ts => (
              <Button
                key={ts.value}
                variant={timeSpan === ts.value ? "default" : "outline"}
                size="sm"
                className="h-6 px-2 text-xs font-mono"
                onClick={() => onTimeSpanChange(ts.value)}
              >
                {ts.labelShort}
              </Button>
            ))}
          </div>
        </fieldset>
      </div>
      
      {/* Summary bar */}
      <Separator className="my-4" />
      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>[GEO] {geoSelections.length === 0 ? 'Ingen vald' : geoSelections.map(g => g.name).join(', ')}</span>
          <span>[DATA] {selectedIndicators.length} indikatorer</span>
          <span>[TIME] {TIME_SPANS.find(t => t.value === timeSpan)?.label || timeSpan}</span>
        </div>
        <span className="text-[10px]">Korrelation innebär inte kausalitet</span>
      </div>
    </section>
  );
}

export default OscilloscopeControlPanel;
