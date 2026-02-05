/**
 * ============================================================================
 * DISSG NATION EXPLORER
 * Diagnostic Information System for Societal Governance
 * ============================================================================
 * 
 * Hierarchy Level: NATION (Level 2 of 7)
 * Path: Civilisation → Världsdel → [Nation] → Region → System → Indikator → Datapunkt
 * 
 * Full-featured country data exploration with:
 * - Graph sandbox for any indicator
 * - Index comparisons (DISSG, HDI, etc.)
 * - Peer country benchmarking
 * - Historical timeline analysis
 * 
 * Core Principle: "Every number is clickable"
 */

 import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCountry, useCountries } from '@/hooks/useGlobalData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ClickableSourceCitation } from '@/components/ui/ClickableSourceCitation';
 import { TermLegend, ClickableIndexCard } from '@/components/data';

// Mock indicator data for the graph sandbox
const AVAILABLE_INDICATORS = [
  { code: 'life_exp', name: 'Medellivslängd', unit: 'år', category: 'health' },
  { code: 'gdp_pc', name: 'BNP per capita', unit: 'USD PPP', category: 'economy' },
  { code: 'hdi', name: 'Human Development Index', unit: 'index', category: 'composite' },
  { code: 'gini', name: 'Gini-koefficient', unit: 'index', category: 'equality' },
  { code: 'edu_years', name: 'Förväntad skolgång', unit: 'år', category: 'education' },
  { code: 'infant_mort', name: 'Spädbarnsdödlighet', unit: 'per 1000', category: 'health' },
  { code: 'co2_pc', name: 'CO₂ per capita', unit: 'ton', category: 'environment' },
  { code: 'pop_density', name: 'Befolkningstäthet', unit: 'per km²', category: 'demography' },
  { code: 'unemployment', name: 'Arbetslöshet', unit: '%', category: 'economy' },
  { code: 'fertility', name: 'Fertilitet', unit: 'barn/kvinna', category: 'demography' },
];

// Generate mock historical data
 function generateMockData(countryCode: string, indicator: string): Array<{year: number; value: number}> {
   // Use deterministic seed based on countryCode and indicator
   const seed = hashCode(`${countryCode}-${indicator}`);
   const baseValue = seededRandom(seed) * 50 + 30;
   const trend = seededRandom(seed + 1) * 0.5 - 0.25;
  
  return Array.from({ length: 30 }, (_, i) => ({
    year: 1995 + i,
     value: Math.max(0, baseValue + trend * i + (seededRandom(seed + i + 100) - 0.5) * 5),
  }));
}

// Generate comparison data for multiple countries
 function generateComparisonData(countries: string[], indicator: string): Array<Record<string, number | string>> {
  const years = Array.from({ length: 30 }, (_, i) => 1995 + i);
  
  return years.map(year => {
    const point: Record<string, number | string> = { year };
    countries.forEach(code => {
       // Use deterministic seed based on code, indicator, and year
       const seed = hashCode(`${code}-${indicator}`);
       // Add more variation between countries
       const countryOffset = hashCode(code) % 30;
       const baseValue = seededRandom(seed) * 30 + 40 + countryOffset;
       const trend = seededRandom(seed + 1) * 0.5 - 0.25;
       const yearIndex = year - 1995;
       point[code] = Math.max(0, baseValue + trend * yearIndex + (seededRandom(seed + yearIndex + 100) - 0.5) * 5);
    });
    return point;
  });
}
 
 // Simple hash function for deterministic seed
 function hashCode(str: string): number {
   let hash = 0;
   for (let i = 0; i < str.length; i++) {
     const char = str.charCodeAt(i);
     hash = ((hash << 5) - hash) + char;
     hash = hash & hash; // Convert to 32bit integer
   }
   return Math.abs(hash);
 }
 
 // Seeded random number generator (deterministic)
 function seededRandom(seed: number): number {
   const x = Math.sin(seed * 9999) * 10000;
   return x - Math.floor(x);
 }

// Color palette for comparison lines - NO icons, only colors
const COMPARISON_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function CountryExplorer() {
  const { code } = useParams<{ code: string }>();
  const countryCode = code?.toUpperCase() || 'SE';
  
  const { data: country, isLoading: loadingCountry } = useCountry(countryCode);
  const { data: allCountries } = useCountries();
  
  // Graph sandbox state
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['life_exp']);
  const [comparisonCountries, setComparisonCountries] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('sandbox');
  
  // Toggle indicator selection
  const toggleIndicator = (code: string) => {
    setSelectedIndicators(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code].slice(0, 4) // Max 4 indicators
    );
  };
  
  // Toggle comparison country
  const toggleComparisonCountry = (countryCode: string) => {
    setComparisonCountries(prev =>
      prev.includes(countryCode)
        ? prev.filter(c => c !== countryCode)
        : [...prev, countryCode].slice(0, 4) // Max 4 comparison countries
    );
  };
  
   // Get primary indicator data  
   const primaryIndicator = AVAILABLE_INDICATORS.find(i => i.code === selectedIndicators[0]);
   const allComparisonCountries = [countryCode, ...comparisonCountries];
    
   // Memoize chart data to prevent regeneration on every render
   const chartData = useMemo(() => {
     if (comparisonCountries.length > 0) {
       return generateComparisonData(allComparisonCountries, selectedIndicators[0]);
     }
     return generateMockData(countryCode, selectedIndicators[0]);
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [countryCode, JSON.stringify(comparisonCountries), selectedIndicators[0]]);
   
  if (loadingCountry) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  
  const displayName = country?.name || countryCode;
  
  // Index data for radar chart
  const indexData = [
    { domain: 'Hälsa', value: 75 + Math.random() * 20, fullMark: 100 },
    { domain: 'Utbildning', value: 70 + Math.random() * 25, fullMark: 100 },
    { domain: 'Ekonomi', value: 65 + Math.random() * 30, fullMark: 100 },
    { domain: 'Miljö', value: 55 + Math.random() * 35, fullMark: 100 },
    { domain: 'Jämlikhet', value: 60 + Math.random() * 30, fullMark: 100 },
    { domain: 'Säkerhet', value: 70 + Math.random() * 25, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1 font-mono">
                <Link to="/" className="hover:text-primary">[CIV]</Link>
                <span>/</span>
                <span>[{country?.region || 'Region'}]</span>
                <span>/</span>
                <span className="text-foreground">[{countryCode}]</span>
              </div>
              
              <h1 className="text-2xl font-bold">{displayName}</h1>
              <p className="text-sm text-muted-foreground">
                Utforska indikatorer, index och jämförelsedata
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="font-mono">{countryCode}</Badge>
              {country?.data_depth && (
                <Badge variant="secondary">Data: {country.data_depth}</Badge>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="sandbox" className="font-mono text-xs">[GRAF]</TabsTrigger>
            <TabsTrigger value="indices" className="font-mono text-xs">[INDEX]</TabsTrigger>
            <TabsTrigger value="compare" className="font-mono text-xs">[JÄMFÖR]</TabsTrigger>
            <TabsTrigger value="timeline" className="font-mono text-xs">[TIDSLINJE]</TabsTrigger>
          </TabsList>
          
          {/* GRAPH SANDBOX */}
          <TabsContent value="sandbox" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Indicator selector panel */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono">[VÄLJ INDIKATORER]</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {AVAILABLE_INDICATORS.map(indicator => (
                    <label
                      key={indicator.code}
                      className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded transition-colors"
                    >
                      <Checkbox
                        checked={selectedIndicators.includes(indicator.code)}
                        onCheckedChange={() => toggleIndicator(indicator.code)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{indicator.name}</p>
                        <p className="text-xs text-muted-foreground">{indicator.unit}</p>
                      </div>
                    </label>
                  ))}
                  <p className="text-xs text-muted-foreground mt-2">
                    Max 4 indikatorer samtidigt
                  </p>
                </CardContent>
              </Card>
              
              {/* Graph area */}
              <Card className="lg:col-span-3">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-mono">
                      [{primaryIndicator?.name.toUpperCase() || 'GRAF'}]
                    </CardTitle>
                    <ClickableSourceCitation sourceKey="undp-worldbank-who" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="year" 
                          tick={{ fontSize: 10 }}
                          className="text-muted-foreground"
                        />
                        <YAxis 
                          tick={{ fontSize: 10 }}
                          className="text-muted-foreground"
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px'
                          }}
                        />
                        <Legend />
                        
                        {comparisonCountries.length > 0 ? (
                          // Multiple country comparison
                          allComparisonCountries.map((cc, idx) => (
                            <Line
                              key={cc}
                              type="monotone"
                              dataKey={cc}
                              name={cc}
                              stroke={COMPARISON_COLORS[idx % COMPARISON_COLORS.length]}
                              strokeWidth={cc === countryCode ? 3 : 1.5}
                              dot={false}
                            />
                          ))
                        ) : (
                          // Single country
                          <Line
                            type="monotone"
                            dataKey="value"
                            name={displayName}
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={false}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Comparison country selector */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs font-mono text-muted-foreground mb-2">[LÄGG TILL JÄMFÖRELSELAND]</p>
                    <div className="flex flex-wrap gap-2">
                      {allCountries?.filter(c => c.code !== countryCode).slice(0, 12).map(c => (
                        <Button
                          key={c.code}
                          size="sm"
                          variant={comparisonCountries.includes(c.code) ? 'default' : 'outline'}
                          className="text-xs h-7"
                          onClick={() => toggleComparisonCountry(c.code)}
                        >
                          {c.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* INDEX VIEW */}
          <TabsContent value="indices" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Radar chart for composite indices */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono">[DOMÄNPROFIL]</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={indexData}>
                        <PolarGrid className="stroke-muted" />
                        <PolarAngleAxis 
                          dataKey="domain" 
                          tick={{ fontSize: 11 }}
                          className="text-muted-foreground"
                        />
                        <PolarRadiusAxis 
                          angle={30} 
                          domain={[0, 100]} 
                          tick={{ fontSize: 9 }}
                        />
                        <Radar
                          name={displayName}
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Key indices */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono">[NYCKELINDEX]</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   {[
                     { code: 'HDI', value: 0.85 + Math.random() * 0.1, rank: Math.floor(Math.random() * 30) + 1 },
                     { code: 'GMI', value: 72 + Math.random() * 15, rank: Math.floor(Math.random() * 50) + 1 },
                     { code: 'Gini', value: 25 + Math.random() * 15, rank: Math.floor(Math.random() * 40) + 1 },
                     { code: 'EPI', value: 55 + Math.random() * 30, rank: Math.floor(Math.random() * 60) + 1 },
                   ].map((index) => (
                     <ClickableIndexCard
                       key={index.code}
                       indexCode={index.code}
                       value={index.value}
                       rank={index.rank}
                       countryCode={countryCode}
                     />
                  ))}
                  
                  <ClickableSourceCitation sourceKey="undp-worldbank-who" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* COMPARE VIEW */}
          <TabsContent value="compare" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono">[PEER-JÄMFÖRELSE]</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Jämför {displayName} med liknande länder baserat på region, utvecklingsnivå eller specifika indikatorer.
                </p>
                
                {/* Bar chart comparison */}
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: displayName, hdi: 0.85 + Math.random() * 0.1, gdp: 45000 + Math.random() * 20000 },
                      { name: 'Peer 1', hdi: 0.80 + Math.random() * 0.15, gdp: 40000 + Math.random() * 25000 },
                      { name: 'Peer 2', hdi: 0.78 + Math.random() * 0.15, gdp: 35000 + Math.random() * 30000 },
                      { name: 'Peer 3', hdi: 0.82 + Math.random() * 0.12, gdp: 42000 + Math.random() * 22000 },
                      { name: 'OECD snitt', hdi: 0.80, gdp: 42000 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                      <Tooltip />
                       <Legend content={<TermLegend />} />
                      <Bar yAxisId="left" dataKey="hdi" name="HDI" fill="hsl(var(--chart-1))" />
                      <Bar yAxisId="right" dataKey="gdp" name="BNP/capita" fill="hsl(var(--chart-2))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <ClickableSourceCitation sourceKey="undp-worldbank-who" />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* TIMELINE VIEW */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono">[HISTORISK UTVECKLING]</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Långsiktig utveckling för {displayName} – från 1950 till idag med prognoser.
                </p>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateMockData(countryCode, 'life_exp')}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Medellivslängd"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <ClickableSourceCitation sourceKey="demographic-data" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
