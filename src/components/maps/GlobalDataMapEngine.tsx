/**
 * GLOBAL DATA MAP ENGINE (GDME)
 * 
 * Clean, professional layout for comparing country data
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  MAP_CORE_MESSAGE,
  COLOR_LEVELS,
  INDICATOR_CATEGORIES,
  MAP_INDICATORS,
  COMPARISON_MODES,
  REGIONS,
  COUNTRY_MAP_DATA,
  MAP_DISCLAIMERS,
  
  getLevelForValue,
  getIndicatorById,
  type MapIndicator,
  type CountryMapData
} from '@/config/globalDataMapConfig';

// Compact coverage indicator
const CoverageIndicator: React.FC<{ coverage: 'full' | 'partial' | 'estimated' }> = ({ coverage }) => {
  const config = {
    full: { color: 'bg-emerald-500', label: 'Full' },
    partial: { color: 'bg-amber-500', label: 'Delvis' },
    estimated: { color: 'bg-red-500', label: 'Est.' }
  };
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${config[coverage].color}`} title={config[coverage].label} />
  );
};

// Minimal country tile
const CountryTile: React.FC<{
  country: CountryMapData;
  indicator: MapIndicator;
  isSelected: boolean;
  onClick: () => void;
  globalMin: number;
  globalMax: number;
}> = ({ country, indicator, isSelected, onClick, globalMin, globalMax }) => {
  const data = country.indicators[indicator.id];
  if (!data) return null;
  
  const level = getLevelForValue(data.value, globalMin, globalMax);
  
  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col p-2.5 rounded-md border transition-all text-left min-w-[72px]
        ${isSelected 
          ? 'ring-2 ring-primary border-primary bg-primary/5' 
          : 'border-border/50 hover:border-border hover:bg-muted/30'
        }
      `}
    >
      {/* Top row: Code + Coverage */}
      <div className="flex items-center justify-between gap-1 mb-1">
        <span 
          className="text-xs font-bold px-1.5 py-0.5 rounded text-white"
          style={{ backgroundColor: level.color }}
        >
          {country.code}
        </span>
        <CoverageIndicator coverage={data.coverage} />
      </div>
      
      {/* Value */}
      <div className="text-lg font-semibold leading-tight">
        {data.value.toLocaleString('sv-SE')}
      </div>
      <div className="text-[10px] text-muted-foreground leading-tight">
        {indicator.unit}
      </div>
      
      {/* Uncertainty warning */}
      {data.uncertainty > 20 && (
        <span className="absolute top-1 right-1 font-mono text-[9px] text-amber-500">[!]</span>
      )}
    </button>
  );
};

// Region section
const RegionSection: React.FC<{
  region: typeof REGIONS[0];
  countries: CountryMapData[];
  indicator: MapIndicator;
  selectedCountry: CountryMapData | null;
  onSelectCountry: (country: CountryMapData) => void;
  globalMin: number;
  globalMax: number;
}> = ({ region, countries, indicator, selectedCountry, onSelectCountry, globalMin, globalMax }) => {
  if (countries.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {region.labelSv}
      </h4>
      <div className="flex flex-wrap gap-2">
        {countries.map(country => (
          <CountryTile
            key={country.code}
            country={country}
            indicator={indicator}
            isSelected={selectedCountry?.code === country.code}
            onClick={() => onSelectCountry(country)}
            globalMin={globalMin}
            globalMax={globalMax}
          />
        ))}
      </div>
    </div>
  );
};

// Country detail panel - cleaner layout
const CountryDetailPanel: React.FC<{
  country: CountryMapData;
  indicator: MapIndicator;
  globalMin: number;
  globalMax: number;
  globalAvg: number;
  onClose: () => void;
}> = ({ country, indicator, globalMin, globalMax, globalAvg, onClose }) => {
  const data = country.indicators[indicator.id];
  if (!data) return null;
  
  const level = getLevelForValue(data.value, globalMin, globalMax);
  const diffFromGlobal = ((data.value - globalAvg) / globalAvg * 100).toFixed(1);
  const isAboveGlobal = data.value > globalAvg;
  
  // Generate time series
  const timeSeries = Array.from({ length: 10 }, (_, i) => ({
    year: 2014 + i,
    value: data.value * (0.8 + Math.random() * 0.4),
    global: globalAvg * (0.85 + Math.random() * 0.3)
  }));
  
  return (
    <Card className="border-l-4" style={{ borderLeftColor: level.color }}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ backgroundColor: level.color }}
            >
              {country.code}
            </div>
            <div>
              <CardTitle className="text-lg">{country.nameSv}</CardTitle>
              <CardDescription className="text-xs">{country.regionSv}</CardDescription>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold">{data.value.toLocaleString('sv-SE')}</div>
              <div className="text-xs text-muted-foreground">{indicator.unit}</div>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded hover:bg-muted/50 text-muted-foreground font-mono text-sm"
            >
              [x]
            </button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Global comparison */}
        <div className="flex items-center gap-2 p-2.5 bg-muted/30 rounded-lg">
          <span className="font-mono text-sm shrink-0">
            {isAboveGlobal ? '[↑]' : '[↓]'}
          </span>
          <span className="text-sm">
            <strong>{Math.abs(Number(diffFromGlobal))}%</strong> {isAboveGlobal ? 'över' : 'under'} globalt snitt
          </span>
        </div>
        
        {/* Metadata grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-muted/20 rounded-lg">
            <div className="text-sm font-semibold">{data.year}</div>
            <div className="text-[10px] text-muted-foreground">År</div>
          </div>
          <div className="p-2 bg-muted/20 rounded-lg">
            <div className="text-sm font-semibold">±{data.uncertainty}%</div>
            <div className="text-[10px] text-muted-foreground">Osäkerhet</div>
          </div>
          <div className="p-2 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center gap-1">
              <CoverageIndicator coverage={data.coverage} />
              <span className="text-sm font-medium capitalize">
                {data.coverage === 'full' ? 'Full' : data.coverage === 'partial' ? 'Delvis' : 'Est.'}
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground">Täckning</div>
          </div>
        </div>
        
        {/* Source */}
        <div className="text-xs text-muted-foreground border-t pt-3">
          <span className="font-medium">Källa:</span> {data.source}
        </div>
        
        {/* Chart */}
        <div>
          <h4 className="text-xs font-medium mb-2 text-muted-foreground">Utveckling över tid</h4>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeries}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="year" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={35} />
                <Tooltip 
                  contentStyle={{ fontSize: 11, padding: '4px 8px' }}
                  formatter={(value: number) => value.toFixed(0)}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={level.color} 
                  strokeWidth={2}
                  name={country.nameSv}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="global" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  name="Globalt snitt"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Disclaimers */}
        <div className="border-t pt-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <span className="font-mono">[~]</span>
            <span className="font-medium">Denna karta visar inte:</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {MAP_DISCLAIMERS.doesNotShow.sv.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="font-mono text-destructive shrink-0">[x]</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Color legend - horizontal compact
const ColorLegend: React.FC = () => (
  <div className="flex items-center gap-0.5">
    {COLOR_LEVELS.map(level => (
      <div 
        key={level.level} 
        className="w-5 h-3 first:rounded-l last:rounded-r" 
        style={{ backgroundColor: level.color }}
        title={String(level.level)}
      />
    ))}
  </div>
);

// Main component
const GlobalDataMapEngine: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('economy');
  const [selectedIndicator, setSelectedIndicator] = useState<string>('gdp_per_capita');
  const [selectedMode, setSelectedMode] = useState<string>('absolute');
  const [selectedCountry, setSelectedCountry] = useState<CountryMapData | null>(null);
  
  const indicator = useMemo(() => 
    getIndicatorById(selectedIndicator), 
    [selectedIndicator]
  );
  
  const categoryIndicators = useMemo(() => 
    MAP_INDICATORS.filter(ind => ind.category === selectedCategory),
    [selectedCategory]
  );
  
  // Calculate global stats
  const globalStats = useMemo(() => {
    if (!indicator) return { min: 0, max: 100, avg: 50 };
    const values = COUNTRY_MAP_DATA
      .map(c => c.indicators[indicator.id]?.value)
      .filter((v): v is number => v !== undefined);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length
    };
  }, [indicator]);
  
  // Group countries by region
  const regionGroups = useMemo(() => 
    REGIONS.map(region => ({
      ...region,
      countries: COUNTRY_MAP_DATA.filter(c => c.region === region.id)
    })).filter(r => r.countries.length > 0),
    []
  );
  
  if (!indicator) return null;
  
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-primary">[MAP]</span>
              <div>
                <h1 className="text-lg font-semibold">Global Data Map</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Strukturella skillnader mellan länder
                </p>
              </div>
            </div>
            
            {/* Selectors */}
            <div className="flex items-center gap-2">
              <Select value={selectedCategory} onValueChange={(v: string) => {
                setSelectedCategory(v);
                const firstInd = MAP_INDICATORS.find(ind => ind.category === v);
                if (firstInd) setSelectedIndicator(firstInd.id);
                setSelectedCountry(null);
              }}>
                <SelectTrigger className="w-[130px] h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INDICATOR_CATEGORIES.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.labelSv}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedIndicator} onValueChange={(v) => {
                setSelectedIndicator(v);
                setSelectedCountry(null);
              }}>
                <SelectTrigger className="w-[180px] h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryIndicators.map(ind => (
                    <SelectItem key={ind.id} value={ind.id}>
                      {ind.labelSv}
                      {ind.sensitivity === 'high' && ' ⚠️'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedMode} onValueChange={setSelectedMode}>
                <SelectTrigger className="w-[120px] h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPARISON_MODES.map(mode => (
                    <SelectItem key={mode.id} value={mode.id}>
                      {mode.labelSv}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Indicator info bar */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium">{indicator.labelSv}</span>
              <Badge variant="outline" className="text-xs h-5">{indicator.unit}</Badge>
              {indicator.sensitivity === 'high' && (
                <Badge variant="destructive" className="text-xs h-5">Känslig</Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Låg</span>
                <ColorLegend />
                <span>Hög</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Country grid */}
        <div className={`flex-1 ${selectedCountry ? 'hidden lg:block lg:w-1/2' : 'w-full'}`}>
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6 max-w-4xl">
              {/* Info banner */}
              <Alert className="bg-primary/5 border-primary/20 py-2">
                <span className="font-mono text-xs mr-2">[i]</span>
                <AlertDescription className="text-xs inline">
                  {MAP_CORE_MESSAGE.sv}
                </AlertDescription>
              </Alert>
              
              {/* Region sections */}
              {regionGroups.map(region => (
                <RegionSection
                  key={region.id}
                  region={region}
                  countries={region.countries}
                  indicator={indicator}
                  selectedCountry={selectedCountry}
                  onSelectCountry={setSelectedCountry}
                  globalMin={globalStats.min}
                  globalMax={globalStats.max}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Detail panel */}
        {selectedCountry && (
          <div className="w-full lg:w-1/2 border-l bg-card/30">
            <ScrollArea className="h-full">
              <div className="p-4">
                <CountryDetailPanel
                  country={selectedCountry}
                  indicator={indicator}
                  globalMin={globalStats.min}
                  globalMax={globalStats.max}
                  globalAvg={globalStats.avg}
                  onClose={() => setSelectedCountry(null)}
                />
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalDataMapEngine;
