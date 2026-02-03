/**
 * 🏙️ CITY-NODE TOTAL ROLLOUT
 * 
 * "One global truth, resolved where people live"
 * 
 * Extends the global reference system into every city-node while:
 * - Preserving identical definitions
 * - Preventing local distortion
 * - Enabling direct comparability
 * - Making outcomes personally understandable
 */

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  MapPin,
  Search,
  ChevronRight,
  ChevronDown,
  Clock,
  BarChart3,
  Users,
  Building2,
  Info,
  Layers
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// CITY DATABASE (Simulated - would come from backend)
// ============================================================================

interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  population: number;
  metropolitanPopulation?: number;
  coordinates: { lat: number; lng: number };
}

const CITIES: City[] = [
  { id: 'stockholm', name: 'Stockholm', country: 'Sverige', countryCode: 'SE', population: 975904, metropolitanPopulation: 2391000, coordinates: { lat: 59.33, lng: 18.07 } },
  { id: 'gothenburg', name: 'Göteborg', country: 'Sverige', countryCode: 'SE', population: 583056, metropolitanPopulation: 1025000, coordinates: { lat: 57.71, lng: 11.97 } },
  { id: 'malmo', name: 'Malmö', country: 'Sverige', countryCode: 'SE', population: 347949, metropolitanPopulation: 740000, coordinates: { lat: 55.60, lng: 13.00 } },
  { id: 'copenhagen', name: 'Köpenhamn', country: 'Danmark', countryCode: 'DK', population: 644431, metropolitanPopulation: 2057000, coordinates: { lat: 55.68, lng: 12.57 } },
  { id: 'oslo', name: 'Oslo', country: 'Norge', countryCode: 'NO', population: 709037, metropolitanPopulation: 1546000, coordinates: { lat: 59.91, lng: 10.75 } },
  { id: 'helsinki', name: 'Helsingfors', country: 'Finland', countryCode: 'FI', population: 658864, metropolitanPopulation: 1520000, coordinates: { lat: 60.17, lng: 24.94 } },
  { id: 'berlin', name: 'Berlin', country: 'Tyskland', countryCode: 'DE', population: 3644826, metropolitanPopulation: 6144000, coordinates: { lat: 52.52, lng: 13.41 } },
  { id: 'london', name: 'London', country: 'Storbritannien', countryCode: 'GB', population: 8982000, metropolitanPopulation: 14800000, coordinates: { lat: 51.51, lng: -0.13 } },
  { id: 'paris', name: 'Paris', country: 'Frankrike', countryCode: 'FR', population: 2161000, metropolitanPopulation: 12400000, coordinates: { lat: 48.86, lng: 2.35 } },
  { id: 'new-york', name: 'New York', country: 'USA', countryCode: 'US', population: 8336817, metropolitanPopulation: 20140000, coordinates: { lat: 40.71, lng: -74.01 } },
];

// ============================================================================
// CITY-NODE CORE DATASET
// ============================================================================

interface CityIndicator {
  code: string;
  name: string;
  category: 'population' | 'livelihood' | 'health' | 'education' | 'security' | 'resources';
  value: number | null;
  nationalValue: number | null;
  globalValue: number | null;
  percentileGlobal: number | null;
  trend: 'up' | 'down' | 'stable' | null;
  dataAvailable: boolean;
  source?: string;
  lastUpdated?: string;
}

interface CityNodeData {
  city: City;
  compositeScore: number;
  nationalScore: number;
  globalScore: number;
  percentileGlobal: number;
  trend: 'improving' | 'declining' | 'stable';
  velocity: number;
  indicators: CityIndicator[];
  dataCompleteness: number;
}

// Generate realistic city data
function generateCityData(city: City): CityNodeData {
  const seed = city.name.length * 17 + city.population / 10000;
  
  const indicators: CityIndicator[] = [
    // Population & Structure
    {
      code: 'population_growth',
      name: 'Befolkningstillväxt',
      category: 'population',
      value: 0.8 + Math.sin(seed) * 1.5,
      nationalValue: 0.6,
      globalValue: 1.0,
      percentileGlobal: 45 + Math.sin(seed) * 30,
      trend: Math.random() > 0.5 ? 'up' : 'stable',
      dataAvailable: true,
      source: 'SCB',
      lastUpdated: '2025-Q4'
    },
    {
      code: 'median_age',
      name: 'Medianålder',
      category: 'population',
      value: 38 + Math.cos(seed) * 8,
      nationalValue: 41,
      globalValue: 30,
      percentileGlobal: 70 + Math.cos(seed) * 15,
      trend: 'up',
      dataAvailable: true,
      source: 'SCB',
      lastUpdated: '2025-Q4'
    },
    // Livelihood & Work
    {
      code: 'employment_rate',
      name: 'Sysselsättningsgrad',
      category: 'livelihood',
      value: 72 + Math.sin(seed * 1.3) * 10,
      nationalValue: 69,
      globalValue: 58,
      percentileGlobal: 75 + Math.sin(seed) * 15,
      trend: Math.random() > 0.4 ? 'up' : 'stable',
      dataAvailable: true,
      source: 'Eurostat',
      lastUpdated: '2025-Q3'
    },
    {
      code: 'median_income',
      name: 'Medianinkomst (PPP)',
      category: 'livelihood',
      value: 32000 + Math.sin(seed * 1.5) * 15000,
      nationalValue: 28000,
      globalValue: 12000,
      percentileGlobal: 80 + Math.sin(seed) * 12,
      trend: 'up',
      dataAvailable: true,
      source: 'OECD',
      lastUpdated: '2024'
    },
    {
      code: 'cost_of_living',
      name: 'Levnadskostnadsindex',
      category: 'livelihood',
      value: 85 + Math.cos(seed) * 25,
      nationalValue: 78,
      globalValue: 50,
      percentileGlobal: 70 + Math.cos(seed) * 20,
      trend: 'up',
      dataAvailable: true,
      source: 'Numbeo',
      lastUpdated: '2025-Q4'
    },
    // Health
    {
      code: 'life_expectancy',
      name: 'Förväntad livslängd',
      category: 'health',
      value: 81 + Math.sin(seed * 0.8) * 3,
      nationalValue: 82,
      globalValue: 73,
      percentileGlobal: 85 + Math.sin(seed) * 10,
      trend: 'stable',
      dataAvailable: true,
      source: 'WHO',
      lastUpdated: '2024'
    },
    {
      code: 'healthcare_access',
      name: 'Vårdtillgänglighet',
      category: 'health',
      value: 78 + Math.cos(seed * 1.2) * 15,
      nationalValue: 82,
      globalValue: 55,
      percentileGlobal: 80 + Math.cos(seed) * 12,
      trend: Math.random() > 0.6 ? 'down' : 'stable',
      dataAvailable: true,
      source: 'SKR',
      lastUpdated: '2025-Q3'
    },
    // Education
    {
      code: 'tertiary_education',
      name: 'Högskoleutbildade',
      category: 'education',
      value: 45 + Math.sin(seed * 1.1) * 20,
      nationalValue: 38,
      globalValue: 25,
      percentileGlobal: 75 + Math.sin(seed) * 18,
      trend: 'up',
      dataAvailable: true,
      source: 'SCB',
      lastUpdated: '2024'
    },
    {
      code: 'skills_mismatch',
      name: 'Kompetensmismatch',
      category: 'education',
      value: 22 + Math.cos(seed * 0.9) * 12,
      nationalValue: 25,
      globalValue: 35,
      percentileGlobal: 60 + Math.cos(seed) * 20,
      trend: Math.random() > 0.5 ? 'up' : 'stable',
      dataAvailable: true,
      source: 'Arbetsförmedlingen',
      lastUpdated: '2025-Q4'
    },
    // Security & Stability
    {
      code: 'crime_rate',
      name: 'Brottsfrekvens (per 100k)',
      category: 'security',
      value: 85 + Math.sin(seed * 1.4) * 40,
      nationalValue: 75,
      globalValue: 120,
      percentileGlobal: 55 + Math.sin(seed) * 25,
      trend: Math.random() > 0.4 ? 'up' : 'stable',
      dataAvailable: true,
      source: 'BRÅ',
      lastUpdated: '2025-Q3'
    },
    {
      code: 'perceived_safety',
      name: 'Upplevd trygghet',
      category: 'security',
      value: 65 + Math.cos(seed * 1.3) * 20,
      nationalValue: 70,
      globalValue: 55,
      percentileGlobal: 65 + Math.cos(seed) * 20,
      trend: Math.random() > 0.6 ? 'down' : 'stable',
      dataAvailable: true,
      source: 'NTU',
      lastUpdated: '2024'
    },
    // Resources & Costs
    {
      code: 'housing_affordability',
      name: 'Bostadsöverkomlighet',
      category: 'resources',
      value: 35 + Math.sin(seed * 0.7) * 20,
      nationalValue: 45,
      globalValue: 50,
      percentileGlobal: 40 + Math.sin(seed) * 25,
      trend: 'down',
      dataAvailable: true,
      source: 'Boverket',
      lastUpdated: '2025-Q4'
    },
    {
      code: 'energy_cost',
      name: 'Energikostnad (index)',
      category: 'resources',
      value: 72 + Math.cos(seed * 1.1) * 20,
      nationalValue: 65,
      globalValue: 55,
      percentileGlobal: 60 + Math.cos(seed) * 25,
      trend: 'up',
      dataAvailable: true,
      source: 'Energimyndigheten',
      lastUpdated: '2025-Q4'
    },
  ];

  const availableIndicators = indicators.filter(i => i.dataAvailable);
  const compositeScore = Math.round(
    availableIndicators.reduce((acc, ind) => acc + (ind.percentileGlobal || 50), 0) / availableIndicators.length
  );

  const nationalScore = 65 + Math.sin(seed * 0.5) * 10;
  const velocity = (Math.random() - 0.5) * 3;

  return {
    city,
    compositeScore,
    nationalScore: Math.round(nationalScore),
    globalScore: 50,
    percentileGlobal: compositeScore,
    trend: velocity > 0.5 ? 'improving' : velocity < -0.5 ? 'declining' : 'stable',
    velocity: Math.round(velocity * 10) / 10,
    indicators,
    dataCompleteness: Math.round((availableIndicators.length / indicators.length) * 100),
  };
}

// ============================================================================
// COMPONENTS
// ============================================================================

function CitySearch({ 
  onSelect, 
  selectedCity 
}: { 
  onSelect: (city: City) => void;
  selectedCity: City | null;
}) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCities = useMemo(() => {
    if (!search) return CITIES.slice(0, 6);
    return CITIES.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Sök stad..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10"
        />
      </div>
      
      <AnimatePresence>
        {isOpen && filteredCities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-64 overflow-auto"
          >
            {filteredCities.map((city) => (
              <button
                key={city.id}
                onClick={() => {
                  onSelect(city);
                  setSearch('');
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-muted/50 transition-colors",
                  selectedCity?.id === city.id && "bg-muted"
                )}
              >
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <div className="font-medium">{city.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {city.country} · {city.population.toLocaleString()} inv.
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ComparisonBar({ 
  label, 
  cityValue, 
  nationalValue, 
  globalValue,
  percentile 
}: { 
  label: string;
  cityValue: number;
  nationalValue: number;
  globalValue: number;
  percentile: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">Percentil: {Math.round(percentile)}</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden relative">
        {/* Global baseline */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/50 z-10"
          style={{ left: `${globalValue}%` }}
        />
        {/* National marker */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-primary/50 z-10"
          style={{ left: `${nationalValue}%` }}
        />
        {/* City bar */}
        <motion.div 
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${cityValue}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-primary" /> Stad
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-0.5 bg-primary/50" /> Nation
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-0.5 bg-muted-foreground/50" /> Global
        </span>
      </div>
    </div>
  );
}

function CityScoreCard({ data }: { data: CityNodeData }) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
      case 'up':
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case 'declining':
      case 'down':
        return <TrendingDown className="h-4 w-4 text-rose-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* City Score */}
        <div className="text-center md:border-r border-border pr-6">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {data.city.name}
          </div>
          <motion.div 
            className="text-5xl font-bold"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {data.compositeScore}
          </motion.div>
          <div className="flex items-center justify-center gap-1 mt-2 text-sm">
            {getTrendIcon(data.trend)}
            <span>{data.velocity > 0 ? '+' : ''}{data.velocity}/år</span>
          </div>
        </div>

        {/* National Comparison */}
        <div className="text-center md:border-r border-border pr-6">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {data.city.country}
          </div>
          <div className="text-3xl font-semibold text-muted-foreground">
            {data.nationalScore}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {data.compositeScore > data.nationalScore ? (
              <span className="text-emerald-500">+{data.compositeScore - data.nationalScore} över nationellt</span>
            ) : data.compositeScore < data.nationalScore ? (
              <span className="text-rose-500">{data.compositeScore - data.nationalScore} under nationellt</span>
            ) : (
              <span>= nationellt snitt</span>
            )}
          </div>
        </div>

        {/* Global Percentile */}
        <div className="text-center md:border-r border-border pr-6">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Global percentil
          </div>
          <div className="text-3xl font-semibold">
            P{data.percentileGlobal}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Topp {100 - data.percentileGlobal}% globalt
          </div>
        </div>

        {/* Data Completeness */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Datatäckning
          </div>
          <div className="text-3xl font-semibold">
            {data.dataCompleteness}%
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {data.indicators.filter(i => i.dataAvailable).length} av {data.indicators.length} indikatorer
          </div>
        </div>
      </div>
    </Card>
  );
}

function IndicatorCategory({ 
  category, 
  indicators,
  isExpanded,
  onToggle
}: { 
  category: string;
  indicators: CityIndicator[];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const categoryLabels: Record<string, { label: string; icon: string }> = {
    population: { label: 'Befolkning & Struktur', icon: '👥' },
    livelihood: { label: 'Försörjning & Arbete', icon: '💼' },
    health: { label: 'Hälsa & Livslängd', icon: '❤️' },
    education: { label: 'Utbildning & Kompetens', icon: '📚' },
    security: { label: 'Säkerhet & Stabilitet', icon: '🛡️' },
    resources: { label: 'Resurser & Kostnader', icon: '🏠' },
  };

  const { label, icon } = categoryLabels[category] || { label: category, icon: '📊' };

  const getTrendIcon = (trend: string | null) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />;
      case 'down': return <TrendingDown className="h-3.5 w-3.5 text-rose-500" />;
      default: return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card className="overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left">
            <div className="flex items-center gap-3">
              <span className="text-xl">{icon}</span>
              <div>
                <div className="font-medium">{label}</div>
                <div className="text-xs text-muted-foreground">
                  {indicators.filter(i => i.dataAvailable).length} av {indicators.length} indikatorer tillgängliga
                </div>
              </div>
            </div>
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="border-t bg-muted/20 p-4 space-y-4">
            {indicators.map((indicator) => (
              <div key={indicator.code} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(indicator.trend)}
                    <span className="text-sm font-medium">{indicator.name}</span>
                  </div>
                  {indicator.dataAvailable ? (
                    <Badge variant="outline" className="text-xs">
                      {indicator.source}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Data saknas
                    </Badge>
                  )}
                </div>
                
                {indicator.dataAvailable && indicator.percentileGlobal !== null && (
                  <ComparisonBar
                    label=""
                    cityValue={indicator.percentileGlobal}
                    nationalValue={(indicator.nationalValue || 50) / (indicator.value || 1) * (indicator.percentileGlobal || 50)}
                    globalValue={50}
                    percentile={indicator.percentileGlobal}
                  />
                )}
                
                {!indicator.dataAvailable && (
                  <div className="p-2 rounded bg-muted/50 text-xs text-muted-foreground">
                    Denna indikator saknar data för denna stad. 
                    Ingen uppskattning görs – endast observerade värden visas.
                  </div>
                )}
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function CityTimeline({ data }: { data: CityNodeData }) {
  const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
  
  // Simulated historical data with policy markers
  const policyMarkers = [
    { year: '2020', label: 'Pandemistart', type: 'external' },
    { year: '2022', label: 'Energikris', type: 'external' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-semibold mb-1">Historisk utveckling – {data.city.name}</h3>
        <p className="text-sm text-muted-foreground">
          Stadens sammansatta poäng över tid, med externa händelser markerade
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-end justify-between h-48 gap-2 relative">
          {years.map((year, i) => {
            const baseHeight = 50 + i * 5 + Math.sin(i + data.city.name.length) * 10;
            const marker = policyMarkers.find(m => m.year === year);
            
            return (
              <div key={year} className="flex-1 flex flex-col items-center gap-2 relative">
                {marker && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <Badge variant="outline" className="text-xs">
                      {marker.label}
                    </Badge>
                  </div>
                )}
                <motion.div 
                  className={cn(
                    "w-full rounded-t relative group",
                    marker ? "bg-amber-500/30" : "bg-primary/20"
                  )}
                  initial={{ height: 0 }}
                  animate={{ height: `${baseHeight}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {Math.round(baseHeight)}
                  </div>
                </motion.div>
                <span className="text-xs text-muted-foreground">{year}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="p-4 rounded-lg bg-muted/30 border border-dashed">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p><strong>Tre frågor besvaras:</strong></p>
            <ol className="list-decimal ml-4 mt-1 space-y-0.5">
              <li>Går det upp eller ner? → <span className="text-foreground">Stabilt med tillfällig nedgång 2020-2021</span></li>
              <li>Hur snabbt? → <span className="text-foreground">{data.velocity > 0 ? '+' : ''}{data.velocity} poäng per år i snitt</span></li>
              <li>Varför? → <span className="text-foreground">Externa chocker (pandemi, energikris) synliga i data</span></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function WhatThisMeansPanel({ data }: { data: CityNodeData }) {
  const livelyhoodIndicators = data.indicators.filter(i => i.category === 'livelihood');
  const resourceIndicators = data.indicators.filter(i => i.category === 'resources');

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-1">Vad detta innebär lokalt</h3>
          <p className="text-sm text-muted-foreground">
            Hur förutsättningarna förändrats i {data.city.name} – utan värdering
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/30">
            <div className="font-medium mb-2 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Arbete & Inkomst
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {livelyhoodIndicators.slice(0, 3).map(ind => (
                <li key={ind.code} className="flex items-center gap-2">
                  {ind.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                  ) : ind.trend === 'down' ? (
                    <TrendingDown className="h-3 w-3 text-rose-500" />
                  ) : (
                    <Minus className="h-3 w-3" />
                  )}
                  <span>{ind.name}: P{Math.round(ind.percentileGlobal || 50)} globalt</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-muted/30">
            <div className="font-medium mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Boende & Kostnader
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {resourceIndicators.map(ind => (
                <li key={ind.code} className="flex items-center gap-2">
                  {ind.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                  ) : ind.trend === 'down' ? (
                    <TrendingDown className="h-3 w-3 text-rose-500" />
                  ) : (
                    <Minus className="h-3 w-3" />
                  )}
                  <span>{ind.name}: P{Math.round(ind.percentileGlobal || 50)} globalt</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-3 rounded bg-amber-500/10 border border-amber-500/20 text-sm">
          <strong>Systemet säger aldrig</strong> vad detta betyder för dig personligen, 
          eller vad du bör göra. Det visar endast hur förutsättningarna förändrats där du bor.
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function CityNode() {
  const [searchParams, setSearchParams] = useSearchParams();
  const cityId = searchParams.get('city') || 'stockholm';
  
  const [selectedCity, setSelectedCity] = useState<City | null>(
    CITIES.find(c => c.id === cityId) || CITIES[0]
  );
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['livelihood']);

  const cityData = useMemo(() => {
    if (!selectedCity) return null;
    return generateCityData(selectedCity);
  }, [selectedCity]);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setSearchParams({ city: city.id });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const categories = useMemo(() => {
    if (!cityData) return [];
    const cats = new Set(cityData.indicators.map(i => i.category));
    return Array.from(cats);
  }, [cityData]);

  if (!cityData) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Link to="/reality-index" className="hover:text-foreground transition-colors">
                  Reality Index
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span>City Node</span>
              </div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <MapPin className="h-8 w-8 text-primary" />
                {cityData.city.name}
              </h1>
              <p className="text-muted-foreground mt-1">
                {cityData.city.country} · {cityData.city.population.toLocaleString()} invånare
              </p>
            </div>
            
            <div className="w-full md:w-64">
              <CitySearch 
                onSelect={handleCitySelect}
                selectedCity={selectedCity}
              />
            </div>
          </div>

          {/* Score Card */}
          <CityScoreCard data={cityData} />
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="gap-2">
              <Layers className="h-4 w-4" />
              Översikt
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <Clock className="h-4 w-4" />
              Tidslinje
            </TabsTrigger>
            <TabsTrigger value="compare" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Jämför
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* What This Means */}
            <WhatThisMeansPanel data={cityData} />

            {/* Indicator Categories */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Indikatorer per domän</h2>
              {categories.map(category => (
                <IndicatorCategory
                  key={category}
                  category={category}
                  indicators={cityData.indicators.filter(i => i.category === category)}
                  isExpanded={expandedCategories.includes(category)}
                  onToggle={() => toggleCategory(category)}
                />
              ))}
            </div>

            {/* Transparency Note */}
            <Card className="p-4 bg-muted/20 border-dashed">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    <strong>Vad detta INTE visar:</strong> Livskvalitet, lycka, 
                    politisk framgång, eller vad som "borde" göras. 
                    Detta är en orienteringskompass, inte en dom.
                  </p>
                  <p>
                    <strong>Identisk metod:</strong> Samma indikatorer, normalisering 
                    och viktning används för alla städer globalt.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <CityTimeline data={cityData} />
          </TabsContent>

          <TabsContent value="compare" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Jämför med andra städer</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Jämförelse via distributionskurvor och percentiler – aldrig "bäst/sämst"-listor.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CITIES.filter(c => c.id !== cityData.city.id).slice(0, 4).map(city => {
                  const otherData = generateCityData(city);
                  return (
                    <button
                      key={city.id}
                      onClick={() => handleCitySelect(city)}
                      className="p-4 rounded-lg border hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="font-medium">{city.name}</div>
                      <div className="text-xs text-muted-foreground">{city.country}</div>
                      <div className="text-2xl font-bold mt-2">{otherData.compositeScore}</div>
                      <div className="text-xs text-muted-foreground">
                        P{otherData.percentileGlobal} globalt
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            <div className="p-4 rounded-lg bg-muted/30 border border-dashed">
              <div className="text-sm text-muted-foreground">
                <strong>Jämförelse utan ranking:</strong> Systemet visar var städer 
                befinner sig i global distribution, inte vem som är "bäst". 
                Ranking är valbart – aldrig förvalt.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
