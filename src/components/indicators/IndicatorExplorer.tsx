/**
 * INDICATOR EXPLORER
 * 
 * Deep-dive into any indicator with:
 * - Long time series (up to 2000 years for historical data)
 * - City/Nation/Global scope switching
 * - Overlay comparison with other indicators
 * - Full explanation pyramid
 */

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Globe,
  Building2,
  Plus,
  Clock,
  ExternalLink,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface IndicatorData {
  code: string;
  name: string;
  category: string;
  value: number | null;
  nationalValue: number | null;
  globalValue: number | null;
  percentileGlobal: number | null;
  trend: 'up' | 'down' | 'stable' | null;
  dataAvailable: boolean;
  source?: string;
  lastUpdated?: string;
}

interface TimeSeriesPoint {
  year: number;
  city?: number | null;
  nation?: number | null;
  global?: number | null;
  label?: string;
}

interface IndicatorExplorerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  indicator: IndicatorData;
  cityName: string;
  countryName: string;
  allIndicators: IndicatorData[];
}

// ============================================================================
// TIME PERIOD DEFINITIONS
// ============================================================================

const TIME_PERIODS = [
  { id: 'recent', label: 'Senaste 10 år', years: 10, startYear: 2015 },
  { id: 'modern', label: 'Modern era (50 år)', years: 50, startYear: 1975 },
  { id: 'century', label: 'Senaste seklet', years: 100, startYear: 1925 },
  { id: 'industrial', label: 'Industriell era', years: 200, startYear: 1825 },
  { id: 'historical', label: 'Historiskt (500 år)', years: 500, startYear: 1525, isEstimate: true },
  { id: 'longue', label: 'Longue durée (2000 år)', years: 2000, startYear: 25, isEstimate: true },
];

const SCOPE_OPTIONS = [
  { id: 'city', label: 'Stad', icon: MapPin },
  { id: 'nation', label: 'Nation', icon: Building2 },
  { id: 'global', label: 'Global', icon: Globe },
];

// ============================================================================
// INDICATOR METADATA (Explanation Pyramid)
// ============================================================================

const INDICATOR_METADATA: Record<string, {
  definition: string;
  methodology: string;
  limitations: string[];
  sources: { name: string; url?: string; reliability: number }[];
  historicalNote?: string;
}> = {
  median_age: {
    definition: 'Medianålder är den ålder som delar befolkningen i två lika stora halvor – hälften är yngre, hälften äldre.',
    methodology: 'Beräknas från befolkningsregister med fullständig åldersfördelning. För historiska perioder används rekonstruktioner baserade på kyrkböcker och folkräkningar.',
    limitations: [
      'Historiska värden före 1850 är estimat med betydande osäkerhet',
      'Definitioner av "befolkning" varierar (medborgare vs boende)',
      'Kan inte fånga åldersfördelningens form, endast mittpunkten',
    ],
    sources: [
      { name: 'SCB Befolkningsstatistik', url: 'https://scb.se', reliability: 98 },
      { name: 'Eurostat Demographics', url: 'https://ec.europa.eu/eurostat', reliability: 95 },
      { name: 'UN World Population Prospects', reliability: 90 },
    ],
    historicalNote: 'Data före 1850 är rekonstruerade estimat baserade på historisk demografi och ska tolkas med försiktighet.',
  },
  population_growth: {
    definition: 'Årlig procentuell förändring av total befolkning, inklusive födslar, dödsfall och nettomigration.',
    methodology: 'Beräknas som (P2 - P1) / P1 × 100 där P1 och P2 är befolkning vid periodens start och slut.',
    limitations: [
      'Inkluderar inte informell befolkning som inte registrerats',
      'Migrationssiffror kan vara osäkra för vissa perioder',
      'Negativ tillväxt kan bero på både emigration och låga födelsetal',
    ],
    sources: [
      { name: 'SCB', reliability: 98 },
      { name: 'Eurostat', reliability: 95 },
    ],
  },
  employment_rate: {
    definition: 'Andel av befolkningen 15-64 år som är sysselsatta (har arbetat minst 1 timme under referensveckan).',
    methodology: 'Arbetskraftsundersökningar (AKU) med standardiserad ILO-definition.',
    limitations: [
      '1-timmesregeln ger hög sysselsättning även vid deltid',
      'Exkluderar "dold arbetslöshet" (studenter som vill jobba)',
      'Säsongsvariation kan ge missvisande momentanbilder',
    ],
    sources: [
      { name: 'Eurostat LFS', reliability: 95 },
      { name: 'OECD Employment Outlook', reliability: 93 },
    ],
  },
};

// ============================================================================
// DATA GENERATION (Simulated)
// ============================================================================

function generateTimeSeriesData(
  indicator: IndicatorData,
  period: typeof TIME_PERIODS[0],
  cityName: string
): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = [];
  const seed = cityName.length + indicator.code.length;
  const currentYear = 2025;
  
  // Historical events that affect indicators
  const events: Record<number, string> = {
    1918: 'Spanska sjukan',
    1929: 'Börskraschen',
    1939: 'WW2 start',
    1945: 'WW2 slut',
    1973: 'Oljekrisen',
    1991: 'Finanskrisen SE',
    2008: 'Finanskrisen',
    2020: 'Pandemin',
  };

  for (let year = period.startYear; year <= currentYear; year++) {
    const yearIndex = year - period.startYear;
    const progress = yearIndex / (currentYear - period.startYear);
    
    // Base trend with some randomness
    const baseTrend = Math.sin(yearIndex * 0.1 + seed) * 5;
    const longTermTrend = progress * 15;
    
    // Add historical volatility
    const volatility = period.isEstimate ? 10 : 3;
    const noise = (Math.sin(yearIndex * 0.5 + seed * 2) + Math.cos(yearIndex * 0.3)) * volatility;
    
    // City is slightly different from national
    const cityOffset = Math.sin(seed) * 8;
    
    data.push({
      year,
      city: Math.round((50 + baseTrend + longTermTrend + noise + cityOffset) * 10) / 10,
      nation: Math.round((50 + baseTrend + longTermTrend + noise) * 10) / 10,
      global: Math.round((45 + longTermTrend * 0.8 + noise * 0.5) * 10) / 10,
      label: events[year],
    });
  }
  
  return data;
}

// ============================================================================
// COMPONENTS
// ============================================================================

function ScopeToggle({
  scope,
  onScopeChange,
}: {
  scope: string[];
  onScopeChange: (scope: string[]) => void;
}) {
  const toggleScope = (id: string) => {
    if (scope.includes(id)) {
      if (scope.length > 1) {
        onScopeChange(scope.filter(s => s !== id));
      }
    } else {
      onScopeChange([...scope, id]);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {SCOPE_OPTIONS.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant={scope.includes(id) ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleScope(id)}
          className="gap-2"
        >
          <Icon className="h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  );
}

function ComparisonIndicatorSelector({
  allIndicators,
  selectedCodes,
  onSelect,
  currentCode,
}: {
  allIndicators: IndicatorData[];
  selectedCodes: string[];
  onSelect: (codes: string[]) => void;
  currentCode: string;
}) {
  const availableIndicators = allIndicators.filter(
    i => i.code !== currentCode && i.dataAvailable
  );

  return (
    <Card className="p-4">
      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Lägg till jämförelseindikator
      </h4>
      <ScrollArea className="h-48">
        <div className="space-y-2">
          {availableIndicators.map(indicator => (
            <label
              key={indicator.code}
              className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer"
            >
              <Checkbox
                checked={selectedCodes.includes(indicator.code)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelect([...selectedCodes, indicator.code]);
                  } else {
                    onSelect(selectedCodes.filter(c => c !== indicator.code));
                  }
                }}
              />
              <span className="text-sm">{indicator.name}</span>
              <Badge variant="outline" className="ml-auto text-xs">
                P{indicator.percentileGlobal}
              </Badge>
            </label>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

function ExplanationPyramidSection({
  indicator,
}: {
  indicator: IndicatorData;
}) {
  const metadata = INDICATOR_METADATA[indicator.code] || {
    definition: `${indicator.name} är en indikator inom kategorin ${indicator.category}.`,
    methodology: 'Standardiserad insamlingsmetodik från officiella statistikbyråer.',
    limitations: ['Täckningsgrad kan variera mellan regioner', 'Definitioner kan skilja sig historiskt'],
    sources: indicator.source ? [{ name: indicator.source, reliability: 90 }] : [],
  };

  return (
    <div className="space-y-6">
      {/* Level 1: Definition */}
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
            1
          </div>
          <div>
            <h4 className="font-medium mb-2">Vad mäts?</h4>
            <p className="text-sm text-muted-foreground">{metadata.definition}</p>
          </div>
        </div>
      </Card>

      {/* Level 2: Methodology */}
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
            2
          </div>
          <div>
            <h4 className="font-medium mb-2">Hur mäts det?</h4>
            <p className="text-sm text-muted-foreground">{metadata.methodology}</p>
          </div>
        </div>
      </Card>

      {/* Level 3: Sources */}
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
            3
          </div>
          <div className="flex-1">
            <h4 className="font-medium mb-2">Varifrån kommer data?</h4>
            <div className="space-y-2">
              {metadata.sources.map((source, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{source.name}</span>
                    {source.url && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {source.reliability}% tillförlitlighet
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Level 4: Limitations */}
      <Card className="p-4 border-amber-500/30 bg-amber-500/5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-sm font-bold text-amber-600 shrink-0">
            4
          </div>
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Begränsningar
            </h4>
            <ul className="space-y-1">
              {metadata.limitations.map((lim, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  {lim}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Historical Note */}
      {metadata.historicalNote && (
        <Card className="p-4 border-dashed">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <h4 className="font-medium mb-1 text-sm">Historisk anmärkning</h4>
              <p className="text-xs text-muted-foreground">{metadata.historicalNote}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function IndicatorExplorer({
  open,
  onOpenChange,
  indicator,
  cityName,
  countryName,
  allIndicators,
}: IndicatorExplorerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('recent');
  const [scope, setScope] = useState<string[]>(['city', 'nation']);
  const [comparisonIndicators, setComparisonIndicators] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('chart');

  const period = TIME_PERIODS.find(p => p.id === selectedPeriod) || TIME_PERIODS[0];
  
  const timeSeriesData = useMemo(() => {
    return generateTimeSeriesData(indicator, period, cityName);
  }, [indicator, period, cityName]);

  const getTrendIcon = (trend: string | null) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-rose-500" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const CHART_COLORS = {
    city: 'hsl(var(--primary))',
    nation: 'hsl(var(--chart-2))',
    global: 'hsl(var(--chart-3))',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getTrendIcon(indicator.trend)}
            <span>{indicator.name}</span>
            <Badge variant="outline">{indicator.source}</Badge>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {cityName}, {countryName} · Senast uppdaterad: {indicator.lastUpdated || '2025'}
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Tidsserie</TabsTrigger>
            <TabsTrigger value="compare">Jämför indikatorer</TabsTrigger>
            <TabsTrigger value="explain">Förklaringspyramid</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="chart" className="mt-0 space-y-4">
              {/* Controls */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Visa:</span>
                  <ScopeToggle scope={scope} onScopeChange={setScope} />
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_PERIODS.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.label}
                          {p.isEstimate && (
                            <span className="text-xs text-amber-500 ml-2">estimat</span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Historical data warning */}
              {period.isEstimate && (
                <Card className="p-3 bg-amber-500/10 border-amber-500/30">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-600">
                      <strong>Historiskt estimat:</strong> Data före 1850 är rekonstruerade baserade på 
                      historiska källor och demografiska modeller. Osäkerheten ökar med avståndet i tid.
                    </p>
                  </div>
                </Card>
              )}

              {/* Main Chart */}
              <Card className="p-4">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="year" 
                      className="text-xs"
                      tickFormatter={(year) => period.years > 100 ? `${year}` : `${year}`}
                    />
                    <YAxis className="text-xs" domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      labelFormatter={(year) => `År ${year}`}
                    />
                    <Legend />
                    
                    {/* Reference lines for historical events */}
                    {timeSeriesData
                      .filter(d => d.label)
                      .map(d => (
                        <ReferenceLine 
                          key={d.year}
                          x={d.year} 
                          stroke="hsl(var(--muted-foreground))"
                          strokeDasharray="3 3"
                          label={{ value: d.label, position: 'top', fontSize: 10 }}
                        />
                      ))
                    }
                    
                    {scope.includes('city') && (
                      <Line 
                        type="monotone" 
                        dataKey="city" 
                        name={cityName}
                        stroke={CHART_COLORS.city}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    )}
                    {scope.includes('nation') && (
                      <Line 
                        type="monotone" 
                        dataKey="nation" 
                        name={countryName}
                        stroke={CHART_COLORS.nation}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    )}
                    {scope.includes('global') && (
                      <Line 
                        type="monotone" 
                        dataKey="global" 
                        name="Global"
                        stroke={CHART_COLORS.global}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Nuvarande värde</div>
                  <div className="text-2xl font-bold">{indicator.value?.toFixed(1) || 'N/A'}</div>
                  <div className="text-xs text-muted-foreground">
                    P{indicator.percentileGlobal} globalt
                  </div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Nationellt snitt</div>
                  <div className="text-2xl font-bold">{indicator.nationalValue?.toFixed(1) || 'N/A'}</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Globalt snitt</div>
                  <div className="text-2xl font-bold">{indicator.globalValue?.toFixed(1) || 'N/A'}</div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="compare" className="mt-0 space-y-4">
              <ComparisonIndicatorSelector
                allIndicators={allIndicators}
                selectedCodes={comparisonIndicators}
                onSelect={setComparisonIndicators}
                currentCode={indicator.code}
              />

              {comparisonIndicators.length > 0 && (
                <Card className="p-4">
                  <h4 className="font-medium mb-4">Jämförelsediagram</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="year" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="city" 
                        name={indicator.name}
                        stroke={CHART_COLORS.city}
                        strokeWidth={2}
                        dot={false}
                      />
                      {comparisonIndicators.map((code, i) => {
                        const compInd = allIndicators.find(ind => ind.code === code);
                        if (!compInd) return null;
                        const compData = generateTimeSeriesData(compInd, period, cityName);
                        // This is simplified - in real implementation would merge datasets
                        return (
                          <Line 
                            key={code}
                            type="monotone" 
                            dataKey="city"
                            data={compData}
                            name={compInd.name}
                            stroke={`hsl(${(i + 1) * 60}, 70%, 50%)`}
                            strokeWidth={2}
                            dot={false}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {comparisonIndicators.length === 0 && (
                <Card className="p-8 text-center">
                  <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Välj en eller flera indikatorer ovan för att jämföra trender
                  </p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="explain" className="mt-0">
              <ExplanationPyramidSection indicator={indicator} />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// CLICKABLE INDICATOR ROW COMPONENT
// ============================================================================

export function ClickableIndicatorRow({
  indicator,
  cityName,
  countryName,
  allIndicators,
  children,
}: {
  indicator: IndicatorData;
  cityName: string;
  countryName: string;
  allIndicators: IndicatorData[];
  children: React.ReactNode;
}) {
  const [explorerOpen, setExplorerOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setExplorerOpen(true)}
        className="w-full text-left group cursor-pointer hover:bg-muted/30 rounded-lg transition-colors -mx-2 px-2 py-1"
      >
        <div className="flex items-center justify-between">
          {children}
          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </button>

      <IndicatorExplorer
        open={explorerOpen}
        onOpenChange={setExplorerOpen}
        indicator={indicator}
        cityName={cityName}
        countryName={countryName}
        allIndicators={allIndicators}
      />
    </>
  );
}
