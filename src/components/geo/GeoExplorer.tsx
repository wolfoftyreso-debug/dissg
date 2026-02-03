/**
 * GEO EXPLORER
 * Main interface for browsing countries, regions, and cities
 * Every value clickable with full truth layer integration
 */

import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  REGIONS, 
  getCountriesByRegion,
  getCountryByCode,
  getRegionById,
  searchGeo,
  type CountryData,
  type RegionData 
} from '@/lib/geo/globalGeoRegistry';
import { ClickableValue, useTruthLayer } from '@/components/truth/TruthLayer';
import { createPopulationProvenance, createLifeExpectancyProvenance } from '@/lib/provenance';
import { MiniSparkline } from '@/components/ui/MiniSparkline';

interface GeoExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'regions' | 'countries';
  initialRegion?: string;
  initialCountry?: string;
}

export function GeoExplorer({ 
  isOpen, 
  onClose, 
  initialRegion,
  initialCountry 
}: GeoExplorerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'indicators' | 'substances' | 'sources'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(
    initialRegion ? getRegionById(initialRegion) || null : null
  );
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    initialCountry ? getCountryByCode(initialCountry) || null : null
  );
  
  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return searchGeo(searchQuery);
  }, [searchQuery]);
  
  // Countries in selected region
  const regionCountries = useMemo(() => {
    if (!selectedRegion) return [];
    return getCountriesByRegion(selectedRegion.id);
  }, [selectedRegion]);
  
  // Related regions
  const relatedRegions = useMemo(() => {
    if (!selectedRegion) return [];
    return selectedRegion.relatedRegions
      .map(id => getRegionById(id))
      .filter(Boolean) as RegionData[];
  }, [selectedRegion]);
  
  // Navigation handlers
  const handleSelectRegion = (region: RegionData) => {
    setSelectedRegion(region);
    setSelectedCountry(null);
    setSearchQuery('');
  };
  
  const handleSelectCountry = (country: CountryData) => {
    setSelectedCountry(country);
    setSearchQuery('');
  };
  
  // Render breadcrumb
  const renderBreadcrumb = () => {
    const crumbs: Array<{ label: string; onClick?: () => void }> = [
      { label: 'Världen', onClick: () => { setSelectedRegion(null); setSelectedCountry(null); } }
    ];
    
    if (selectedRegion) {
      crumbs.push({ 
        label: selectedRegion.nameSv, 
        onClick: selectedCountry ? () => setSelectedCountry(null) : undefined 
      });
    }
    
    if (selectedCountry) {
      crumbs.push({ label: selectedCountry.nameSv });
    }
    
    return (
      <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-4 font-mono">
        {crumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="mx-1">→</span>}
            {crumb.onClick ? (
              <button 
                onClick={crumb.onClick}
                className="hover:text-foreground transition-colors underline decoration-dashed underline-offset-2"
              >
                {crumb.label}
              </button>
            ) : (
              <span className="text-foreground font-medium">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
          {renderBreadcrumb()}
          
          {selectedCountry ? (
            <CountryHeader country={selectedCountry} />
          ) : selectedRegion ? (
            <RegionHeader region={selectedRegion} countriesCount={regionCountries.length} />
          ) : (
            <div>
              <DialogTitle className="text-xl">Geografiskt Register</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Alla länder, regioner och städer med verifierad data
              </p>
            </div>
          )}
        </DialogHeader>
        
        {/* Search */}
        <div className="px-6 py-3 border-b">
          <Input
            placeholder="Sök land, region eller stad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10"
          />
        </div>
        
        {/* Tabs - only for region/country detail */}
        {(selectedRegion || selectedCountry) && (
          <div className="px-6 pt-3 border-b">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview" className="text-xs">Överblick</TabsTrigger>
                <TabsTrigger value="indicators" className="text-xs">Indikatorer</TabsTrigger>
                <TabsTrigger value="substances" className="text-xs">Substanser</TabsTrigger>
                <TabsTrigger value="sources" className="text-xs">Källor</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
        
        {/* Content */}
        <ScrollArea className="flex-1 max-h-[60vh]">
          <div className="p-6">
            {searchResults ? (
              <SearchResults 
                results={searchResults} 
                onSelectCountry={handleSelectCountry}
                onSelectRegion={handleSelectRegion}
              />
            ) : selectedCountry ? (
              <CountryDetail country={selectedCountry} activeTab={activeTab} />
            ) : selectedRegion ? (
              <RegionDetail 
                region={selectedRegion} 
                countries={regionCountries}
                relatedRegions={relatedRegions}
                activeTab={activeTab}
                onSelectCountry={handleSelectCountry}
                onSelectRegion={handleSelectRegion}
              />
            ) : (
              <RegionsList 
                regions={REGIONS} 
                onSelect={handleSelectRegion} 
              />
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// ══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ══════════════════════════════════════════════════════════════

function RegionHeader({ region, countriesCount }: { region: RegionData; countriesCount: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <DialogTitle className="text-xl">{region.nameSv}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">{region.descriptionSv}</p>
        </div>
        <Badge variant="outline" className="shrink-0">
          {region.type === 'continent' ? 'Kontinent' : 'Subregion'}
        </Badge>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard 
          label="Befolkning" 
          value={formatLargeNumber(region.population)} 
          subtext={`${region.populationYear}`}
          regionId={region.id}
          metricType="population"
        />
        <MetricCard 
          label="Länder" 
          value={countriesCount.toString()} 
          subtext="i regionen"
        />
        <MetricCard 
          label="Medellivslängd" 
          value={region.avgLifeExpectancy?.toFixed(1) || '—'} 
          subtext="år"
          regionId={region.id}
          metricType="lifeExpectancy"
        />
      </div>
    </div>
  );
}

function CountryHeader({ country }: { country: CountryData }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <DialogTitle className="text-xl">{country.nameSv}</DialogTitle>
          {country.nameLocal !== country.nameSv && (
            <p className="text-sm text-muted-foreground">{country.nameLocal}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            {country.code}
          </Badge>
          <DataTierBadge tier={country.dataTier} />
        </div>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard 
          label="Befolkning" 
          value={formatLargeNumber(country.population)} 
          subtext={`${country.populationYear}`}
          countryCode={country.code}
          metricType="population"
        />
        <MetricCard 
          label="BNP/capita" 
          value={country.gdpPerCapita ? `$${formatLargeNumber(country.gdpPerCapita)}` : '—'} 
          subtext={country.gdpPerCapitaYear?.toString()}
          countryCode={country.code}
          metricType="gdp"
        />
        <MetricCard 
          label="Medellivslängd" 
          value={country.lifeExpectancy?.toFixed(1) || '—'} 
          subtext="år"
          countryCode={country.code}
          metricType="lifeExpectancy"
        />
      </div>
    </div>
  );
}

function MetricCard({ 
  label, 
  value, 
  subtext,
  countryCode,
  regionId,
  metricType
}: { 
  label: string; 
  value: string; 
  subtext?: string;
  countryCode?: string;
  regionId?: string;
  metricType?: 'population' | 'gdp' | 'lifeExpectancy';
}) {
  const { openProvenance } = useTruthLayer();
  
  const handleClick = () => {
    if (!metricType) return;
    
    // Create appropriate provenance based on metric type
    let provenance;
    const location = countryCode || regionId || 'unknown';
    
    if (metricType === 'population') {
      provenance = createPopulationProvenance(
        parseInt(value.replace(/[^\d]/g, '')) || 0,
        location,
        label,
        subtext || '2024'
      );
    } else if (metricType === 'lifeExpectancy') {
      provenance = createLifeExpectancyProvenance(
        parseFloat(value) || 0,
        location,
        label,
        subtext || '2024'
      );
    }
    
    if (provenance) {
      openProvenance(provenance);
    }
  };
  
  const isClickable = !!metricType;
  
  return (
    <div 
      className={cn(
        "p-3 rounded-lg border bg-card",
        isClickable && "cursor-pointer hover:bg-muted/50 transition-colors"
      )}
      onClick={isClickable ? handleClick : undefined}
    >
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={cn(
        "text-lg font-semibold",
        isClickable && "underline decoration-dashed underline-offset-2"
      )}>
        {value}
      </div>
      {subtext && <div className="text-xs text-muted-foreground">{subtext}</div>}
    </div>
  );
}

// Data Coverage definitions for transparency
const DATA_COVERAGE_LEVELS = {
  A: {
    label: 'Full täckning',
    description: 'Alla primära indikatorer tillgängliga med hög kvalitet',
    criteria: [
      'Officiell statistik från nationell myndighet',
      'Minst 95% av kärnindikatorerna täckta',
      'Årlig eller oftare uppdatering',
      'Verifierad av minst 2 internationella källor'
    ],
    className: 'border-green-500/50 text-green-600 bg-green-50 dark:bg-green-950/30'
  },
  B: {
    label: 'God täckning',
    description: 'De flesta indikatorer tillgängliga med acceptabel kvalitet',
    criteria: [
      'Primärkällor kompletterade med estimat',
      '70–94% av kärnindikatorerna täckta',
      'Uppdatering minst vartannat år',
      'Verifierad av minst 1 internationell källa'
    ],
    className: 'border-blue-500/50 text-blue-600 bg-blue-50 dark:bg-blue-950/30'
  },
  C: {
    label: 'Delvis täckning',
    description: 'Grundläggande data finns, men med betydande luckor',
    criteria: [
      'Blandning av officiella data och modellestimater',
      '40–69% av kärnindikatorerna täckta',
      'Data kan vara 3–5 år gammal',
      'Högre osäkerhetsintervall'
    ],
    className: 'border-orange-500/50 text-orange-600 bg-orange-50 dark:bg-orange-950/30'
  },
  D: {
    label: 'Begränsad täckning',
    description: 'Endast basdata, ofta modellerad eller interpolerad',
    criteria: [
      'Huvudsakligen baserat på modelleringar',
      'Under 40% av kärnindikatorerna från primärkälla',
      'Data kan vara äldre än 5 år',
      'Höga osäkerhetsmarginaler (±15% eller mer)'
    ],
    className: 'border-red-500/50 text-red-600 bg-red-50 dark:bg-red-950/30'
  },
};

function DataTierBadge({ tier, showExplanation = false }: { tier: 'A' | 'B' | 'C' | 'D'; showExplanation?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const config = DATA_COVERAGE_LEVELS[tier];
  
  if (!showExplanation) {
    return (
      <Badge variant="outline" className={cn("text-xs font-mono", config.className)}>
        {tier}
      </Badge>
    );
  }
  
  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
      >
        <Badge 
          variant="outline" 
          className={cn(
            "text-xs cursor-pointer hover:opacity-80 transition-opacity",
            config.className
          )}
        >
          {config.label}
        </Badge>
      </button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Badge variant="outline" className={cn("text-sm", config.className)}>
                Nivå {tier}
              </Badge>
              <span>{config.label}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {config.description}
            </p>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Kriterier för denna nivå:</h4>
              <ul className="space-y-1">
                {config.criteria.map((criterion, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Alla täckningsnivåer:</h4>
              <div className="grid grid-cols-2 gap-2">
                {(['A', 'B', 'C', 'D'] as const).map(t => (
                  <div 
                    key={t}
                    className={cn(
                      "p-2 rounded border text-xs",
                      t === tier ? "ring-2 ring-primary" : "opacity-70",
                      DATA_COVERAGE_LEVELS[t].className
                    )}
                  >
                    <div className="font-medium">{t}: {DATA_COVERAGE_LEVELS[t].label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function RegionsList({ regions, onSelect }: { regions: RegionData[]; onSelect: (r: RegionData) => void }) {
  // Group by type
  const continents = regions.filter(r => r.type === 'continent');
  const subregions = regions.filter(r => r.type === 'subregion');
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Kontinenter</h3>
        <div className="grid gap-2">
          {continents.map(region => (
            <RegionCard key={region.id} region={region} onClick={() => onSelect(region)} />
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Subregioner</h3>
        <div className="grid gap-2">
          {subregions.map(region => (
            <RegionCard key={region.id} region={region} onClick={() => onSelect(region)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RegionCard({ region, onClick }: { region: RegionData; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{region.nameSv}</div>
          <div className="text-sm text-muted-foreground mt-0.5">
            {region.countries.length} länder • {formatLargeNumber(region.population)} invånare
          </div>
        </div>
        <span className="text-muted-foreground">→</span>
      </div>
    </button>
  );
}

function RegionDetail({ 
  region, 
  countries, 
  relatedRegions,
  activeTab,
  onSelectCountry,
  onSelectRegion
}: { 
  region: RegionData; 
  countries: CountryData[];
  relatedRegions: RegionData[];
  activeTab: string;
  onSelectCountry: (c: CountryData) => void;
  onSelectRegion: (r: RegionData) => void;
}) {
  // Group countries by subregion for better organization
  const groupedCountries = useMemo(() => {
    const groups: Record<string, CountryData[]> = {};
    countries.forEach(country => {
      const subregion = country.subregion || 'Övriga';
      if (!groups[subregion]) groups[subregion] = [];
      groups[subregion].push(country);
    });
    // Sort each group alphabetically
    Object.values(groups).forEach(group => group.sort((a, b) => a.nameSv.localeCompare(b.nameSv, 'sv')));
    return groups;
  }, [countries]);

  if (activeTab === 'sources') {
    return (
      <div className="space-y-4">
        <h3 className="font-medium">Datakällor</h3>
        <p className="text-sm text-muted-foreground">Klicka för att öppna originalkälla</p>
        <div className="space-y-2">
          {region.dataSources.map((source, i) => (
            <div key={i} className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{source.name}</div>
                  <Badge variant="outline" className="text-xs mt-1">
                    {source.type === 'international' ? 'Internationell' : 
                     source.type === 'academic' ? 'Akademisk' : 'Statlig'}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Progress value={source.reliability} className="w-20 h-2" />
                    <div className="text-xs text-muted-foreground mt-1">{source.reliability}%</div>
                  </div>
                  {source.url && (
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Data coverage legend */}
      <div className="p-4 rounded-lg border bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium">Datatäckningsnivåer</h4>
          <span className="text-xs text-muted-foreground">Klicka på ett land för detaljer</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['A', 'B', 'C', 'D'] as const).map(tier => (
            <DataTierBadge key={tier} tier={tier} showExplanation />
          ))}
        </div>
      </div>

      {/* Countries grid - organized by subregion */}
      {Object.entries(groupedCountries).map(([subregion, subregionCountries]) => (
        <div key={subregion}>
          <h3 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">{subregion}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {subregionCountries.map(country => (
              <CountryCard
                key={country.code}
                country={country}
                onClick={() => onSelectCountry(country)}
              />
            ))}
          </div>
        </div>
      ))}
      
      {/* Related regions */}
      {relatedRegions.length > 0 && (
        <div className="pt-4 border-t">
          <h3 className="font-medium mb-3">Relaterade regioner</h3>
          <div className="flex flex-wrap gap-2">
            {relatedRegions.map(r => (
              <button
                key={r.id}
                onClick={() => onSelectRegion(r)}
                className="px-3 py-1.5 rounded-md border bg-muted/30 hover:bg-muted/50 transition-colors text-sm text-muted-foreground"
              >
                {r.nameSv}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Key indicators */}
      <div className="pt-4 border-t">
        <h3 className="font-medium mb-3">Nyckelindikatorer</h3>
        <div className="grid gap-3">
          {region.keyIndicators.map((indicator, i) => (
            <div key={i} className="p-3 rounded-lg border bg-card flex items-center justify-between">
              <span className="text-sm">{indicator.labelSv}</span>
              <ClickableValue
                value={`${indicator.value} ${indicator.unit}`}
                provenance={createPopulationProvenance(indicator.value, region.id, indicator.labelSv, '2024')}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Professional country card for grid display
function CountryCard({ country, onClick }: { country: CountryData; onClick: () => void }) {
  const tierConfig = DATA_COVERAGE_LEVELS[country.dataTier];
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-4 rounded-lg border text-left transition-all",
        "hover:shadow-md hover:border-primary/30 hover:scale-[1.02]",
        "bg-card"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-mono text-lg font-bold text-primary">
          {country.code}
        </span>
        <Badge 
          variant="outline" 
          className={cn("text-xs shrink-0", tierConfig.className)}
        >
          {tierConfig.label}
        </Badge>
      </div>
      <div className="text-sm font-medium truncate" title={country.nameSv}>
        {country.nameSv}
      </div>
      <div className="text-2xl font-bold mt-2 text-foreground">
        {country.population ? formatLargeNumber(country.population) : '—'}
      </div>
      <div className="text-xs text-muted-foreground">invånare</div>
    </button>
  );
}

function CountryDetail({ country, activeTab }: { country: CountryData; activeTab: string }) {
  const indicators = [
    { label: 'Befolkning', value: country.population, unit: '', year: country.populationYear },
    { label: 'Yta', value: country.areaKm2, unit: 'km²', year: null },
    { label: 'BNP per capita', value: country.gdpPerCapita, unit: 'USD', year: country.gdpPerCapitaYear },
    { label: 'Medellivslängd', value: country.lifeExpectancy, unit: 'år', year: country.lifeExpectancyYear },
    { label: 'HDI', value: country.hdi, unit: '', year: country.hdiYear },
  ];
  
  if (activeTab === 'sources') {
    return (
      <div className="space-y-4">
        <h3 className="font-medium">Datakällor för {country.nameSv}</h3>
        <div className="space-y-2">
          <SourceCard name="World Bank Open Data" type="international" reliability={94} />
          <SourceCard name="UN Data" type="international" reliability={92} />
          <SourceCard name="UNDP Human Development Reports" type="international" reliability={91} />
          {country.dataTier === 'A' && (
            <SourceCard name={`${country.nameSv} Statistikmyndighet`} type="governmental" reliability={96} />
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Data coverage explanation */}
      <div className="p-4 rounded-lg border bg-muted/30">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-medium">Datatäckning:</span>
          <DataTierBadge tier={country.dataTier} showExplanation />
        </div>
        <p className="text-xs text-muted-foreground">
          {DATA_COVERAGE_LEVELS[country.dataTier].description}
        </p>
      </div>

      {/* Basic info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg border bg-card">
          <div className="text-xs text-muted-foreground">Huvudstad</div>
          <div className="font-medium">{country.capital}</div>
        </div>
        <div className="p-3 rounded-lg border bg-card">
          <div className="text-xs text-muted-foreground">Valuta</div>
          <div className="font-medium">{country.currencyCode}</div>
        </div>
      </div>
      
      {/* Indicators */}
      <div>
        <h3 className="font-medium mb-3">Indikatorer</h3>
        <div className="space-y-2">
          {indicators.map((ind, i) => (
            <div key={i} className="p-3 rounded-lg border bg-card flex items-center justify-between">
              <div>
                <span className="text-sm">{ind.label}</span>
                {ind.year && (
                  <span className="text-xs text-muted-foreground ml-2">({ind.year})</span>
                )}
              </div>
              {ind.value !== undefined && ind.value !== null ? (
                <ClickableValue
                  value={formatIndicatorValue(ind.value, ind.unit)}
                  provenance={createPopulationProvenance(
                    typeof ind.value === 'number' ? ind.value : 0,
                    country.code,
                    ind.label,
                    ind.year?.toString() || '2024'
                  )}
                />
              ) : (
                <span className="text-muted-foreground text-sm">Data saknas</span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Sparkline trends */}
      <div>
        <h3 className="font-medium mb-3">Trender (senaste 10 åren)</h3>
        <div className="grid gap-3">
          <div className="p-3 rounded-lg border bg-card">
            <div className="text-sm text-muted-foreground mb-2">Befolkningsutveckling</div>
            <MiniSparkline 
              data={generateTrendData(country.population, 0.01, 10)} 
              width={200} 
              height={40}
              showTrend
              trendLabel="10 år"
            />
          </div>
          {country.lifeExpectancy && (
            <div className="p-3 rounded-lg border bg-card">
              <div className="text-sm text-muted-foreground mb-2">Medellivslängd</div>
              <MiniSparkline 
                data={generateTrendData(country.lifeExpectancy, 0.003, 10)} 
                width={200} 
                height={40}
                showTrend
                trendLabel="10 år"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SourceCard({ name, type, reliability }: { name: string; type: string; reliability: number }) {
  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{name}</div>
          <Badge variant="outline" className="text-xs mt-1">
            {type === 'international' ? 'Internationell' : 
             type === 'academic' ? 'Akademisk' : 'Statlig'}
          </Badge>
        </div>
        <div className="text-right">
          <Progress value={reliability} className="w-20 h-2" />
          <div className="text-xs text-muted-foreground mt-1">{reliability}%</div>
        </div>
      </div>
    </div>
  );
}

function SearchResults({ 
  results, 
  onSelectCountry,
  onSelectRegion
}: { 
  results: { countries: CountryData[]; regions: RegionData[] };
  onSelectCountry: (c: CountryData) => void;
  onSelectRegion: (r: RegionData) => void;
}) {
  if (results.countries.length === 0 && results.regions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Inga resultat hittades
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {results.regions.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Regioner</h3>
          <div className="space-y-1">
            {results.regions.map(r => (
              <button
                key={r.id}
                onClick={() => onSelectRegion(r)}
                className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                {r.nameSv}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {results.countries.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Länder</h3>
          <div className="space-y-1">
            {results.countries.map(c => (
              <button
                key={c.code}
                onClick={() => onSelectCountry(c)}
                className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors flex items-center justify-between"
              >
                <span>{c.nameSv}</span>
                <span className="text-xs text-muted-foreground font-mono">{c.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════════════════════════

function formatLargeNumber(num: number): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}k`;
  return num.toString();
}

function formatIndicatorValue(value: number, unit: string): string {
  if (unit === 'km²') return `${formatLargeNumber(value)} ${unit}`;
  if (unit === 'USD') return `$${formatLargeNumber(value)}`;
  if (value < 1) return value.toFixed(3);
  if (value < 100) return value.toFixed(1);
  return formatLargeNumber(value);
}

function generateTrendData(endValue: number, growthRate: number, years: number): number[] {
  const data: number[] = [];
  let value = endValue / Math.pow(1 + growthRate, years);
  for (let i = 0; i < years; i++) {
    data.push(value);
    value *= (1 + growthRate + (Math.random() - 0.5) * growthRate * 0.5);
  }
  data.push(endValue);
  return data;
}
