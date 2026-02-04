/**
 * METRIC DEEP DIVE
 * 
 * Detaljerade grafer för regionala mätvärden:
 * - Befolkning (nedbruten på ålder/kön)
 * - Länder i regionen
 * - Medellivslängd (historik och jämförelse)
 * 
 * ALL DATA FRÅN DATABASEN - INGEN MOCK-DATA
 */

import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
// NO ICONS - Text markers only per design doctrine
import { ClickableSourceCitation } from '@/components/ui/ClickableSourceCitation';
import {
  useRegionalDemographics,
  usePopulationHistory,
  useLifeExpectancyHistory,
  useRegionalCountries,
  useRegionalStats,
  useLifeExpectancyComparison,
} from '@/hooks/useRegionalDemographics';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type MetricType = 'population' | 'countries' | 'lifeExpectancy';

interface MetricDeepDiveProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metricType: MetricType;
  regionName: string;
  population: number;
  countries: string[];
  lifeExpectancy: number;
}

// ═══════════════════════════════════════════════════════════════
// LOADING & ERROR STATES
// ═══════════════════════════════════════════════════════════════

const LoadingState: React.FC<{ message?: string }> = ({ message = 'Laddar data från databasen...' }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="font-mono text-[10px]">[DB]</span>
      <span>{message}</span>
    </div>
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-48 w-full" />
    <Skeleton className="h-32 w-full" />
  </div>
);

const EmptyState: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <Alert>
    <AlertDescription>
      <span className="font-mono text-[10px] mr-1">[!]</span>
      <span className="font-medium">{title}</span>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </AlertDescription>
  </Alert>
);

// ═══════════════════════════════════════════════════════════════
// POPULATION VIEW - DATA FROM DATABASE
// ═══════════════════════════════════════════════════════════════

const PopulationView: React.FC<{ regionName: string }> = ({ regionName }) => {
  const { data: demographics, isLoading: loadingDemo, error: demoError } = useRegionalDemographics(regionName);
  const { data: history, isLoading: loadingHistory } = usePopulationHistory(regionName);
  const { data: stats, isLoading: loadingStats } = useRegionalStats(regionName);
  
  if (loadingDemo || loadingHistory || loadingStats) {
    return <LoadingState message="Hämtar befolkningsdata..." />;
  }
  
  if (demoError || !demographics?.length) {
    return (
      <EmptyState 
        title="Ingen befolkningsdata" 
        description={`Ingen demografisk data finns för ${regionName} i databasen än.`}
      />
    );
  }
  
  // Transform demographic data for pyramid chart
  const pyramidData = demographics.map(d => ({
    ageGroup: d.age_group,
    male: -d.male_percent,
    female: d.female_percent,
  }));
  
  // Transform history for line chart
  const historyData = history?.map(h => ({
    year: h.year,
    population: h.population_millions,
  })) || [];
  
  return (
    <div className="space-y-6">
      {/* Current stats from database */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center bg-primary/5">
          <p className="text-2xl font-bold text-primary">{stats?.population.toFixed(0)}M</p>
          <p className="text-xs text-muted-foreground">Total befolkning</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{stats?.growthRate?.toFixed(1) || '–'}%</p>
          <p className="text-xs text-muted-foreground">Årlig tillväxt</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{stats?.medianAge?.toFixed(1) || '–'}</p>
          <p className="text-xs text-muted-foreground">Medianålder</p>
        </Card>
      </div>
      
      {/* Data source indicator - CLICKABLE */}
      <ClickableSourceCitation sourceKey="demographic-data" />
      
      {/* Population pyramid from database */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="font-mono text-[10px]">[POP]</span>
            Befolkningspyramid (ålder × kön)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pyramidData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" domain={[-15, 15]} tickFormatter={(v) => `${Math.abs(v)}%`} />
                <YAxis type="category" dataKey="ageGroup" tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(value: number) => [`${Math.abs(value).toFixed(1)}%`]}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))'
                  }}
                />
                <Bar dataKey="male" fill="hsl(var(--chart-2))" name="Män" />
                <Bar dataKey="female" fill="hsl(var(--chart-1))" name="Kvinnor" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded bg-[hsl(var(--chart-2))]" />
              <span>Män</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded bg-[hsl(var(--chart-1))]" />
              <span>Kvinnor</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Historical trend from database */}
      {historyData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="font-mono text-[10px]">[TID]</span>
              Befolkningstillväxt {historyData[0]?.year}–{historyData[historyData.length - 1]?.year}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}M`} />
                  <Tooltip 
                    formatter={(value: number) => [`${value}M`, 'Befolkning']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="population" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// COUNTRIES VIEW - DATA FROM DATABASE
// ═══════════════════════════════════════════════════════════════

const CountriesView: React.FC<{ regionName: string }> = ({ regionName }) => {
  const { data: countries, isLoading, error } = useRegionalCountries(regionName);
  
  if (isLoading) {
    return <LoadingState message="Hämtar landsdata..." />;
  }
  
  if (error || !countries?.length) {
    return (
      <EmptyState 
        title="Ingen landsdata" 
        description={`Ingen landsdata finns för ${regionName} i databasen än.`}
      />
    );
  }
  
  // Chart colors
  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];
  
  const pieData = countries.map((c, idx) => ({
    name: c.country_name,
    value: c.population_millions,
    fill: COLORS[idx % COLORS.length],
  }));
  
  return (
    <div className="space-y-6">
      {/* Countries count */}
      <Card className="p-4 text-center bg-primary/5">
        <span className="font-mono text-2xl text-primary block mb-2">[GEO]</span>
        <p className="text-3xl font-bold text-primary">{countries.length}</p>
        <p className="text-sm text-muted-foreground">Länder i regionen</p>
      </Card>
      
      {/* Data source - CLICKABLE */}
      <ClickableSourceCitation sourceKey="undp-worldbank-who" />
      
      {/* Population distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Befolkningsfördelning per land</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}M`, 'Befolkning']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Country list from database */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="font-mono text-[10px]">[LOK]</span>
            Länder (sorterade efter befolkning)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {countries.map((country, idx) => (
              <div 
                key={country.country_code} 
                className="flex items-center justify-between p-2 rounded border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                    {idx + 1}
                  </Badge>
                  <span className="font-medium text-sm">{country.country_name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{country.population_millions.toFixed(1)}M</span>
                  {country.hdi && <Badge variant="secondary">HDI {country.hdi.toFixed(2)}</Badge>}
                  {country.life_expectancy && <span>{country.life_expectancy.toFixed(0)} år</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// LIFE EXPECTANCY VIEW - DATA FROM DATABASE
// ═══════════════════════════════════════════════════════════════

const LifeExpectancyView: React.FC<{ regionName: string }> = ({ regionName }) => {
  const { data: history, isLoading: loadingHistory } = useLifeExpectancyHistory(regionName);
  const { data: stats, isLoading: loadingStats } = useRegionalStats(regionName);
  const { data: comparison, isLoading: loadingComparison } = useLifeExpectancyComparison();
  
  if (loadingHistory || loadingStats || loadingComparison) {
    return <LoadingState message="Hämtar livslängdsdata..." />;
  }
  
  if (!history?.length) {
    return (
      <EmptyState 
        title="Ingen livslängdsdata" 
        description={`Ingen livslängdsdata finns för ${regionName} i databasen än.`}
      />
    );
  }
  
  // Calculate year-over-year improvement
  const latestYear = history[history.length - 1];
  const previousYear = history[history.length - 2];
  const yearlyImprovement = latestYear && previousYear
    ? (latestYear.life_expectancy_overall - previousYear.life_expectancy_overall) / (latestYear.year - previousYear.year)
    : 0;
  
  // Gender data from database
  const genderData = [
    { gender: 'Kvinnor', value: stats?.lifeExpectancyFemale || 0, fill: 'hsl(var(--chart-1))' },
    { gender: 'Män', value: stats?.lifeExpectancyMale || 0, fill: 'hsl(var(--chart-2))' },
  ];
  
  // History for chart
  const historyData = history.map(h => ({
    year: h.year,
    value: h.life_expectancy_overall,
  }));
  
  // Comparison data from database
  const comparisonData = [
    { 
      region: regionName.substring(0, 15), 
      value: stats?.lifeExpectancy || 0, 
      fill: 'hsl(var(--primary))' 
    },
    { 
      region: 'Världen (snitt)', 
      value: comparison?.globalAverage || 73.4, 
      fill: 'hsl(var(--muted-foreground))' 
    },
    ...(comparison?.regions
      ?.filter(r => r.region_name !== regionName)
      ?.slice(0, 2)
      ?.map((r, idx) => ({
        region: r.region_name.substring(0, 12),
        value: r.life_expectancy_overall,
        fill: `hsl(var(--chart-${idx + 1}))`,
      })) || []),
  ];
  
  return (
    <div className="space-y-6">
      {/* Current stats from database */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center bg-primary/5">
          <p className="text-2xl font-bold text-primary">{stats?.lifeExpectancy?.toFixed(1) || '–'}</p>
          <p className="text-xs text-muted-foreground">Medellivslängd (år)</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{stats?.healthyLifeYears?.toFixed(1) || '–'}</p>
          <p className="text-xs text-muted-foreground">Friska levnadsår</p>
        </Card>
        <Card className="p-4 text-center">
          <p className={`text-2xl font-bold ${yearlyImprovement > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {yearlyImprovement > 0 ? '+' : ''}{yearlyImprovement.toFixed(1)}
          </p>
          <p className="text-xs text-muted-foreground">År/år förbättring</p>
        </Card>
      </div>
      
      {/* Data source - CLICKABLE */}
      <ClickableSourceCitation sourceKey="demographic-data" />
      
      {/* By gender from database */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="font-mono text-[10px]">[KÖN]</span>
            Medellivslängd per kön
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" domain={[0, 90]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="gender" tick={{ fontSize: 12 }} width={80} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)} år`]}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Historical trend from database */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="font-mono text-[10px]">[↑]</span>
            Historisk utveckling {historyData[0]?.year}–{historyData[historyData.length - 1]?.year}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[40, 85]} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)} år`]}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Comparison from database */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="font-mono text-[10px]">[GEO]</span>
            Jämförelse med andra regioner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="region" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[50, 85]} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)} år`]}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))'
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export const MetricDeepDive: React.FC<MetricDeepDiveProps> = ({
  open,
  onOpenChange,
  metricType,
  regionName,
}) => {
  // Text markers only - NO ICONS
  const titles: Record<MetricType, { title: string; description: string; marker: string }> = {
    population: {
      title: 'Befolkning',
      description: 'Demografisk struktur och utveckling',
      marker: '[POP]'
    },
    countries: {
      title: 'Länder',
      description: 'Länder i regionen och deras nyckeltal',
      marker: '[GEO]'
    },
    lifeExpectancy: {
      title: 'Medellivslängd',
      description: 'Förväntad livslängd och hälsomått',
      marker: '[LIV]'
    }
  };
  
  const config = titles[metricType];
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl p-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            <SheetHeader>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-primary bg-primary/10 px-2 py-1 rounded">
                  {config.marker}
                </span>
                <div>
                  <SheetTitle>{config.title}</SheetTitle>
                  <SheetDescription>{regionName}</SheetDescription>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{config.description}</p>
            </SheetHeader>
            
            {metricType === 'population' && (
              <PopulationView regionName={regionName} />
            )}
            
            {metricType === 'countries' && (
              <CountriesView regionName={regionName} />
            )}
            
            {metricType === 'lifeExpectancy' && (
              <LifeExpectancyView regionName={regionName} />
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
