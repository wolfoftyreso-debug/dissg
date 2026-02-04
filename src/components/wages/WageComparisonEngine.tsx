/**
 * WAGE COMPARISON ENGINE
 * 
 * Multi-country, multi-occupation wage comparison with:
 * - Time series development
 * - Political overlay (government periods)
 * - Multiple simultaneous diagrams
 * - PPP/Nominal/Relative unit switching
 * 
 * DESIGN: "Tysk fabriksprecision med världens bästa semantik"
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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
import { PoliticalOverlay } from '@/components/political/PoliticalOverlay';
import { LeadershipPanel } from '@/components/political/LeadershipPanel';
import { GovernmentPeriod, getGovernmentsInRange } from '@/lib/political/politicalRegistry';
import {
  WageDataPoint,
  WageUnit,
  OccupationCategory,
  OCCUPATION_METADATA,
  WAGE_DATA,
  getWageData,
  getOccupationName,
  getAvailableOccupations,
  getAvailableCountriesForWages,
} from '@/lib/wages/wageRegistry';
import { cn } from '@/lib/utils';

// Chart configuration
interface ChartConfig {
  id: string;
  occupation: OccupationCategory;
  countries: string[];
  startYear: number;
  endYear: number;
  unit: WageUnit;
  showPoliticalOverlay: boolean;
}

// Country colors for consistent visualization
const COUNTRY_COLORS: Record<string, string> = {
  'SE': 'hsl(210, 100%, 50%)', // Blue
  'DE': 'hsl(0, 0%, 30%)',     // Dark gray
  'US': 'hsl(0, 70%, 50%)',    // Red
  'NO': 'hsl(210, 70%, 40%)',  // Navy
  'DK': 'hsl(0, 80%, 45%)',    // Danish red
  'FI': 'hsl(210, 90%, 60%)',  // Finnish blue
  'UK': 'hsl(340, 80%, 45%)',  // UK magenta
};

const COUNTRY_NAMES: Record<string, string> = {
  'SE': 'Sverige',
  'DE': 'Tyskland',
  'US': 'USA',
  'NO': 'Norge',
  'DK': 'Danmark',
  'FI': 'Finland',
  'UK': 'Storbritannien',
};

export const WageComparisonEngine: React.FC = () => {
  const [charts, setCharts] = useState<ChartConfig[]>([
    {
      id: 'chart-1',
      occupation: 'teacher_primary',
      countries: ['SE', 'DE', 'US'],
      startYear: 2005,
      endYear: 2023,
      unit: 'ppp_usd',
      showPoliticalOverlay: true,
    }
  ]);
  
  const [selectedPeriod, setSelectedPeriod] = useState<GovernmentPeriod | null>(null);
  const [selectedCountryForPolitics, setSelectedCountryForPolitics] = useState<string | null>(null);
  
  // Add new chart
  const addChart = useCallback(() => {
    const newId = `chart-${Date.now()}`;
    setCharts(prev => [...prev, {
      id: newId,
      occupation: 'nurse',
      countries: ['SE', 'NO'],
      startYear: 2010,
      endYear: 2023,
      unit: 'ppp_usd',
      showPoliticalOverlay: true,
    }]);
  }, []);
  
  // Remove chart
  const removeChart = useCallback((id: string) => {
    setCharts(prev => prev.filter(c => c.id !== id));
  }, []);
  
  // Update chart config
  const updateChart = useCallback((id: string, updates: Partial<ChartConfig>) => {
    setCharts(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ));
  }, []);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lönejämförelse</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Jämför lönenivåer mellan länder och yrken över tid
          </p>
        </div>
        <Button onClick={addChart} variant="outline">
          <span className="font-mono mr-1">[+]</span>
          Lägg till diagram
        </Button>
      </div>
      
      {/* Pedagogical intro */}
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-mono text-[10px] text-muted-foreground block mb-1">PPP-JUSTERAT</span>
              <span className="font-medium">Köpkraftsjusterat</span>
              <p className="text-xs text-muted-foreground mt-1">
                Vad kan du köpa för lönen? Justerar för olika prisnivåer mellan länder.
              </p>
            </div>
            <div>
              <span className="font-mono text-[10px] text-muted-foreground block mb-1">NOMINELLT</span>
              <span className="font-medium">Växelkursbaserat</span>
              <p className="text-xs text-muted-foreground mt-1">
                Lönen omräknad till USD med dagskurs. Bra för internationella transaktioner.
              </p>
            </div>
            <div>
              <span className="font-mono text-[10px] text-muted-foreground block mb-1">RELATIVT</span>
              <span className="font-medium">Andel av median</span>
              <p className="text-xs text-muted-foreground mt-1">
                Hur mycket tjänar yrket jämfört med medellönen i samma land?
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Charts */}
      <div className="space-y-6">
        {charts.map((chart) => (
          <WageChart 
            key={chart.id}
            config={chart}
            onUpdate={(updates) => updateChart(chart.id, updates)}
            onRemove={() => removeChart(chart.id)}
            onPeriodClick={(period, country) => {
              setSelectedPeriod(period);
              setSelectedCountryForPolitics(country);
            }}
            canRemove={charts.length > 1}
          />
        ))}
      </div>
      
      {/* Leadership panel modal */}
      {selectedPeriod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedPeriod(null)}>
          <div onClick={e => e.stopPropagation()}>
            <LeadershipPanel 
              period={selectedPeriod}
              onClose={() => setSelectedPeriod(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Individual wage chart component
interface WageChartProps {
  config: ChartConfig;
  onUpdate: (updates: Partial<ChartConfig>) => void;
  onRemove: () => void;
  onPeriodClick: (period: GovernmentPeriod, countryCode: string) => void;
  canRemove: boolean;
}

const WageChart: React.FC<WageChartProps> = ({
  config,
  onUpdate,
  onRemove,
  onPeriodClick,
  canRemove,
}) => {
  const availableCountries = getAvailableCountriesForWages();
  const availableOccupations = getAvailableOccupations();
  
  // Prepare chart data
  const chartData = prepareChartData(config);
  
  // Get unit label
  const getUnitLabel = (unit: WageUnit): string => {
    switch (unit) {
      case 'ppp_usd': return 'USD (PPP)';
      case 'nominal_usd': return 'USD (nominellt)';
      case 'relative_median': return '% av median';
    }
  };
  
  // Toggle country
  const toggleCountry = (country: string) => {
    const newCountries = config.countries.includes(country)
      ? config.countries.filter(c => c !== country)
      : [...config.countries, country];
    
    if (newCountries.length > 0) {
      onUpdate({ countries: newCountries });
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg">
                {getOccupationName(config.occupation, 'sv')}
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                ILO {OCCUPATION_METADATA[config.occupation].iloCode}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {OCCUPATION_METADATA[config.occupation].description}
            </p>
          </div>
          
          {canRemove && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRemove}
              className="text-muted-foreground hover:text-destructive"
            >
              <span className="font-mono">[×]</span>
            </Button>
          )}
        </div>
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          {/* Occupation selector */}
          <div>
            <Label className="text-xs font-mono text-muted-foreground">YRKE</Label>
            <Select 
              value={config.occupation} 
              onValueChange={(v) => onUpdate({ occupation: v as OccupationCategory })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableOccupations.map(occ => (
                  <SelectItem key={occ} value={occ}>
                    {getOccupationName(occ, 'sv')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Unit selector */}
          <div>
            <Label className="text-xs font-mono text-muted-foreground">ENHET</Label>
            <Select 
              value={config.unit} 
              onValueChange={(v) => onUpdate({ unit: v as WageUnit })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ppp_usd">PPP (köpkraft)</SelectItem>
                <SelectItem value="nominal_usd">Nominellt (USD)</SelectItem>
                <SelectItem value="relative_median">% av median</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Time range */}
          <div>
            <Label className="text-xs font-mono text-muted-foreground">PERIOD</Label>
            <div className="flex gap-2 mt-1">
              <Select 
                value={config.startYear.toString()} 
                onValueChange={(v) => onUpdate({ startYear: parseInt(v) })}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2000, 2005, 2010, 2015, 2018, 2020].map(y => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="self-center text-muted-foreground">–</span>
              <Select 
                value={config.endYear.toString()} 
                onValueChange={(v) => onUpdate({ endYear: parseInt(v) })}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2020, 2021, 2022, 2023, 2024].map(y => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Political overlay toggle */}
          <div className="flex items-end gap-2 pb-1">
            <Switch 
              id={`political-${config.id}`}
              checked={config.showPoliticalOverlay}
              onCheckedChange={(v) => onUpdate({ showPoliticalOverlay: v })}
            />
            <Label htmlFor={`political-${config.id}`} className="text-sm cursor-pointer">
              Visa regeringsperioder
            </Label>
          </div>
        </div>
        
        {/* Country toggles */}
        <div className="mt-4">
          <Label className="text-xs font-mono text-muted-foreground block mb-2">LÄNDER</Label>
          <div className="flex flex-wrap gap-2">
            {availableCountries.map(country => {
              const isSelected = config.countries.includes(country);
              return (
                <Button
                  key={country}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleCountry(country)}
                  className="text-xs"
                  style={isSelected ? { backgroundColor: COUNTRY_COLORS[country] } : undefined}
                >
                  {COUNTRY_NAMES[country] || country}
                </Button>
              );
            })}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Political overlays */}
        {config.showPoliticalOverlay && (
          <div className="mb-4 space-y-1">
            {config.countries.map(country => (
              <div key={country} className="flex items-center gap-2">
                <span className="text-xs font-mono w-8">{country}</span>
                <div className="flex-1">
                  <PoliticalOverlay
                    countryCode={country}
                    startDate={new Date(config.startYear, 0, 1)}
                    endDate={new Date(config.endYear, 11, 31)}
                    chartWidth={800}
                    height={20}
                    onPeriodClick={(period) => onPeriodClick(period, country)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="year" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.toString()}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => 
                  config.unit === 'relative_median' 
                    ? `${value}%` 
                    : `$${(value/1000).toFixed(1)}k`
                }
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  config.unit === 'relative_median' 
                    ? `${value}%` 
                    : `$${value.toLocaleString()}/mån`,
                  COUNTRY_NAMES[name] || name
                ]}
                labelFormatter={(label) => `År ${label}`}
              />
              <Legend 
                formatter={(value) => COUNTRY_NAMES[value] || value}
              />
              {config.countries.map(country => (
                <Line
                  key={country}
                  type="monotone"
                  dataKey={country}
                  stroke={COUNTRY_COLORS[country]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Data quality note */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="font-mono text-[10px] text-muted-foreground">[i]</span>
            <p className="text-xs text-muted-foreground">
              <strong>Datakällor:</strong> ILO ILOSTAT, OECD, nationella statistikbyråer (SCB, Destatis, BLS, SSB).
              Löner avser bruttomånadslön för heltidsanställda. PPP-omräkning baserad på OECD/Eurostat PPP-index.
              Yrkeskategorier standardiserade enligt ISCO-08.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Prepare chart data from wage registry
function prepareChartData(config: ChartConfig): Array<Record<string, number | string>> {
  const years = Array.from(
    { length: config.endYear - config.startYear + 1 },
    (_, i) => config.startYear + i
  );
  
  return years.map(year => {
    const point: Record<string, number | string> = { year };
    
    config.countries.forEach(country => {
      const wageData = WAGE_DATA.find(
        d => d.countryCode === country && 
             d.occupation === config.occupation && 
             d.year === year
      );
      
      if (wageData) {
        switch (config.unit) {
          case 'ppp_usd':
            point[country] = wageData.monthlyWagePPP;
            break;
          case 'nominal_usd':
            point[country] = wageData.monthlyWageNominal;
            break;
          case 'relative_median':
            point[country] = wageData.relativeToMedian;
            break;
        }
      }
    });
    
    return point;
  });
}

export default WageComparisonEngine;
