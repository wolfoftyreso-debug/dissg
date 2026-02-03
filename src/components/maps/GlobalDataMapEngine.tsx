/**
 * GLOBAL DATA MAP ENGINE (GDME)
 * 
 * "Visa strukturella skillnader mellan länder – på ett sätt som går att förstå, jämföra och ifrågasätta."
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  Globe,
  Info,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  EyeOff,
  MapPin
} from 'lucide-react';
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
  MAP_PRINCIPLES,
  MAP_CORE_MESSAGE,
  COLOR_LEVELS,
  COLOR_PRINCIPLE,
  INDICATOR_CATEGORIES,
  MAP_INDICATORS,
  COMPARISON_MODES,
  REGIONS,
  COUNTRY_MAP_DATA,
  MAP_DISCLAIMERS,
  SYSTEM_NEVER_DOES,
  SYSTEM_IDENTITY,
  getColorForValue,
  getLevelForValue,
  getIndicatorById,
  type MapIndicator,
  type CountryMapData
} from '@/config/globalDataMapConfig';

// Coverage badge
const CoverageBadge: React.FC<{ coverage: 'full' | 'partial' | 'estimated' }> = ({ coverage }) => {
  const styles = {
    full: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
    partial: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
    estimated: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
  };
  const labels = { full: 'Full täckning', partial: 'Delvis', estimated: 'Uppskattad' };
  
  return (
    <Badge variant="outline" className={`text-xs ${styles[coverage]}`}>
      {labels[coverage]}
    </Badge>
  );
};

// Color legend
const ColorLegend: React.FC = () => (
  <div className="flex items-center gap-1 text-xs">
    {COLOR_LEVELS.map(level => (
      <div key={level.level} className="flex flex-col items-center">
        <div 
          className="w-6 h-4 rounded-sm" 
          style={{ backgroundColor: level.color }}
        />
        <span className="text-[10px] text-muted-foreground mt-1">{level.level}</span>
      </div>
    ))}
  </div>
);

// Country card on map
const CountryMapCard: React.FC<{
  country: CountryMapData;
  indicator: MapIndicator;
  isSelected: boolean;
  onClick: () => void;
  globalMin: number;
  globalMax: number;
}> = ({ country, indicator, isSelected, onClick, globalMin, globalMax }) => {
  const data = country.indicators[indicator.id];
  if (!data) return null;
  
  const color = getColorForValue(data.value, globalMin, globalMax);
  
  return (
    <button
      onClick={onClick}
      className={`relative p-3 rounded-lg border-2 transition-all text-left ${
        isSelected ? 'ring-2 ring-primary' : 'hover:scale-105'
      }`}
      style={{ 
        backgroundColor: color,
        borderColor: isSelected ? 'var(--primary)' : 'transparent'
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-white text-shadow-sm">{country.code}</span>
        <CoverageBadge coverage={data.coverage} />
      </div>
      <div className="text-white text-shadow-sm">
        <div className="text-lg font-bold">{data.value.toLocaleString()}</div>
        <div className="text-xs opacity-90">{indicator.unit}</div>
      </div>
      {data.uncertainty > 20 && (
        <div className="absolute top-1 right-1">
          <AlertTriangle className="h-3 w-3 text-white/70" />
        </div>
      )}
    </button>
  );
};

// Country detail panel
const CountryDetailPanel: React.FC<{
  country: CountryMapData;
  indicator: MapIndicator;
  globalMin: number;
  globalMax: number;
  globalAvg: number;
}> = ({ country, indicator, globalMin, globalMax, globalAvg }) => {
  const data = country.indicators[indicator.id];
  if (!data) return null;
  
  const level = getLevelForValue(data.value, globalMin, globalMax);
  const diffFromGlobal = ((data.value - globalAvg) / globalAvg * 100).toFixed(1);
  const isAboveGlobal = data.value > globalAvg;
  
  // Generate mock time series
  const timeSeries = Array.from({ length: 10 }, (_, i) => ({
    year: 2014 + i,
    value: data.value * (0.8 + Math.random() * 0.4),
    global: globalAvg * (0.85 + Math.random() * 0.3)
  }));
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: level.color }}
            >
              {country.code}
            </div>
            <div>
              <CardTitle>{country.nameSv}</CardTitle>
              <CardDescription>{country.regionSv}</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{data.value.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">{indicator.unit}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comparison to global */}
        <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
          {isAboveGlobal ? (
            <TrendingUp className="h-5 w-5 text-blue-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-purple-500" />
          )}
          <span className="text-sm">
            <strong>{Math.abs(Number(diffFromGlobal))}%</strong> {isAboveGlobal ? 'över' : 'under'} globalt snitt
          </span>
        </div>
        
        {/* Data quality */}
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="p-2 bg-muted/20 rounded">
            <div className="font-medium">{data.year}</div>
            <div className="text-xs text-muted-foreground">År</div>
          </div>
          <div className="p-2 bg-muted/20 rounded">
            <div className="font-medium">±{data.uncertainty}%</div>
            <div className="text-xs text-muted-foreground">Osäkerhet</div>
          </div>
          <div className="p-2 bg-muted/20 rounded">
            <CoverageBadge coverage={data.coverage} />
            <div className="text-xs text-muted-foreground mt-1">Täckning</div>
          </div>
        </div>
        
        {/* Source */}
        <div className="text-xs text-muted-foreground">
          <strong>Källa:</strong> {data.source}
        </div>
        
        {/* Notes if any */}
        {data.notes && (
          <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">{data.notes}</AlertDescription>
          </Alert>
        )}
        
        {/* Time series chart */}
        <div>
          <h4 className="text-sm font-medium mb-2">Utveckling över tid</h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeries}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ fontSize: 12 }}
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
      </CardContent>
    </Card>
  );
};

// Map grid view (stylized geographic layout)
const MapGridView: React.FC<{
  countries: CountryMapData[];
  indicator: MapIndicator;
  selectedCountry: CountryMapData | null;
  onSelectCountry: (country: CountryMapData) => void;
}> = ({ countries, indicator, selectedCountry, onSelectCountry }) => {
  // Calculate global min/max for this indicator
  const values = countries
    .map(c => c.indicators[indicator.id]?.value)
    .filter((v): v is number => v !== undefined);
  const globalMin = Math.min(...values);
  const globalMax = Math.max(...values);
  
  // Group by region
  const byRegion = REGIONS.map(region => ({
    ...region,
    countries: countries.filter(c => c.region === region.id)
  }));
  
  return (
    <div className="space-y-4">
      {byRegion.filter(r => r.countries.length > 0).map(region => (
        <div key={region.id}>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">{region.labelSv}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {region.countries.map(country => (
              <CountryMapCard
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
      ))}
    </div>
  );
};

// What this map does not show
const DisclaimerPanel: React.FC = () => (
  <Card className="bg-muted/30 border-dashed">
    <CardHeader className="pb-2">
      <div className="flex items-center gap-2">
        <EyeOff className="h-4 w-4 text-muted-foreground" />
        <CardTitle className="text-sm">Denna karta visar inte:</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <ul className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
        {MAP_DISCLAIMERS.doesNotShow.sv.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <span className="text-red-400">✕</span> {item}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

// System never does
const SystemNeverPanel: React.FC = () => (
  <Alert className="bg-red-50 dark:bg-red-950/20 border-red-200">
    <AlertTriangle className="h-4 w-4" />
    <AlertTitle className="text-sm">Systemet gör aldrig:</AlertTitle>
    <AlertDescription>
      <ul className="text-xs space-y-1 mt-2">
        {SYSTEM_NEVER_DOES.map((item, i) => (
          <li key={i}>❌ {item.sv}</li>
        ))}
      </ul>
      <p className="text-xs mt-2 font-medium">{SYSTEM_IDENTITY.sv}</p>
    </AlertDescription>
  </Alert>
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
  
  if (!indicator) return null;
  
  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Global Data Map</h1>
        </div>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Visa strukturella skillnader mellan länder – på ett sätt som går att förstå, jämföra och ifrågasätta.
        </p>
      </div>
      
      {/* Core principles */}
      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Grundprincip:</strong> {MAP_CORE_MESSAGE.sv}
        </AlertDescription>
      </Alert>
      
      {/* Selectors */}
      <div className="grid gap-3 md:grid-cols-3">
        {/* Category */}
        <div>
          <label className="text-sm font-medium mb-1 block">Kategori</label>
          <Select value={selectedCategory} onValueChange={(v) => {
            setSelectedCategory(v);
            const firstInd = MAP_INDICATORS.find(ind => ind.category === v);
            if (firstInd) setSelectedIndicator(firstInd.id);
          }}>
            <SelectTrigger>
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
        </div>
        
        {/* Indicator */}
        <div>
          <label className="text-sm font-medium mb-1 block">Indikator</label>
          <Select value={selectedIndicator} onValueChange={setSelectedIndicator}>
            <SelectTrigger>
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
        </div>
        
        {/* Mode */}
        <div>
          <label className="text-sm font-medium mb-1 block">Jämförelseläge</label>
          <Select value={selectedMode} onValueChange={setSelectedMode}>
            <SelectTrigger>
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
      
      {/* Indicator description */}
      <Card className="bg-muted/20">
        <CardContent className="pt-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-medium">{indicator.labelSv}</h3>
              <p className="text-sm text-muted-foreground">{indicator.descriptionSv}</p>
              {indicator.dataNoteSv && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  📌 {indicator.dataNoteSv}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {indicator.sensitivity === 'high' && (
                <Badge variant="destructive" className="text-xs">Känslig data</Badge>
              )}
              <Badge variant="outline">{indicator.unit}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Color legend */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Nivå:</span>
          <ColorLegend />
        </div>
        <p className="text-xs text-muted-foreground italic">{COLOR_PRINCIPLE.sv}</p>
      </div>
      
      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Map grid */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Klicka på ett land för detaljer
          </h3>
          <MapGridView
            countries={COUNTRY_MAP_DATA}
            indicator={indicator}
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
          />
        </div>
        
        {/* Detail panel */}
        <div className="space-y-4">
          {selectedCountry ? (
            <CountryDetailPanel
              country={selectedCountry}
              indicator={indicator}
              globalMin={globalStats.min}
              globalMax={globalStats.max}
              globalAvg={globalStats.avg}
            />
          ) : (
            <Card className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Välj ett land för att se detaljer</p>
              </div>
            </Card>
          )}
          
          <DisclaimerPanel />
        </div>
      </div>
      
      {/* Global stats bar */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-muted-foreground">Min:</span>{' '}
              <strong>{globalStats.min.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-muted-foreground">Globalt snitt:</span>{' '}
              <strong>{globalStats.avg.toFixed(0).toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-muted-foreground">Max:</span>{' '}
              <strong>{globalStats.max.toLocaleString()}</strong>
            </div>
          </div>
          <Progress 
            value={(globalStats.avg - globalStats.min) / (globalStats.max - globalStats.min) * 100} 
            className="h-2 mt-2"
          />
        </CardContent>
      </Card>
      
      {/* System constraints - embedded in HTML for SEO/accessibility but hidden from UI */}
      <div className="sr-only" aria-hidden="true">
        <SystemNeverPanel />
      </div>
      
      {/* Principles - embedded but hidden */}
      <div className="sr-only" aria-hidden="true">
        <div>
          <h4>Grundprinciper för alla kartvyer:</h4>
          <ul>
            {MAP_PRINCIPLES.map((p, i) => (
              <li key={i}>{p.sv}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GlobalDataMapEngine;
