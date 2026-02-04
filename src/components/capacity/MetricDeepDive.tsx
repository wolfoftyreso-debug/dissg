/**
 * METRIC DEEP DIVE
 * 
 * Detaljerade grafer för regionala mätvärden:
 * - Befolkning (nedbruten på ålder/kön)
 * - Länder i regionen
 * - Medellivslängd (historik och jämförelse)
 */

import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { Users, Globe, Activity, TrendingUp, Calendar, MapPin } from 'lucide-react';

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
// MOCK DATA (Would come from database in production)
// ═══════════════════════════════════════════════════════════════

const getPopulationPyramid = (region: string) => {
  // Simplified age/gender distribution
  const ageGroups = ['0-4', '5-14', '15-24', '25-34', '35-44', '45-54', '55-64', '65-74', '75+'];
  const isYoungRegion = region.toLowerCase().includes('sahel') || region.toLowerCase().includes('afrika');
  
  return ageGroups.map((age, idx) => {
    const baseValue = isYoungRegion 
      ? Math.max(5, 20 - idx * 2) // Young population pyramid
      : Math.max(3, 12 - Math.abs(idx - 4) * 1.5); // More balanced
    
    return {
      ageGroup: age,
      male: -(baseValue + Math.random() * 2),
      female: baseValue + Math.random() * 2,
    };
  });
};

const getPopulationHistory = () => [
  { year: 1960, population: 120 },
  { year: 1970, population: 160 },
  { year: 1980, population: 210 },
  { year: 1990, population: 280 },
  { year: 2000, population: 340 },
  { year: 2010, population: 400 },
  { year: 2020, population: 450 },
  { year: 2024, population: 480 },
];

const getLifeExpectancyHistory = (current: number) => {
  return [
    { year: 1960, value: current - 25 },
    { year: 1970, value: current - 22 },
    { year: 1980, value: current - 18 },
    { year: 1990, value: current - 12 },
    { year: 2000, value: current - 8 },
    { year: 2010, value: current - 4 },
    { year: 2020, value: current - 1.5 },
    { year: 2024, value: current },
  ];
};

const getLifeExpectancyByGender = (avg: number) => [
  { gender: 'Kvinnor', value: avg + 3.5, fill: 'hsl(var(--chart-1))' },
  { gender: 'Män', value: avg - 2.5, fill: 'hsl(var(--chart-2))' },
];

const getLifeExpectancyComparison = (regionValue: number) => [
  { region: 'Denna region', value: regionValue, fill: 'hsl(var(--primary))' },
  { region: 'Världen', value: 73.4, fill: 'hsl(var(--muted-foreground))' },
  { region: 'Europa', value: 79.2, fill: 'hsl(var(--chart-1))' },
  { region: 'Afrika', value: 64.5, fill: 'hsl(var(--chart-2))' },
];

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

const PopulationView: React.FC<{ regionName: string; population: number }> = ({ regionName, population }) => {
  const pyramidData = getPopulationPyramid(regionName);
  const historyData = getPopulationHistory();
  
  return (
    <div className="space-y-6">
      {/* Current stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center bg-primary/5">
          <p className="text-2xl font-bold text-primary">{(population / 1_000_000).toFixed(0)}M</p>
          <p className="text-xs text-muted-foreground">Total befolkning</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">2.4%</p>
          <p className="text-xs text-muted-foreground">Årlig tillväxt</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">19.2</p>
          <p className="text-xs text-muted-foreground">Medianålder</p>
        </Card>
      </div>
      
      {/* Population pyramid */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
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
                <XAxis type="number" domain={[-25, 25]} tickFormatter={(v) => `${Math.abs(v)}%`} />
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
      
      {/* Historical trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Befolkningstillväxt 1960–2024
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
    </div>
  );
};

const CountriesView: React.FC<{ countries: string[] }> = ({ countries }) => {
  // Mock country data
  const countryData = countries.map((name, idx) => ({
    name,
    population: Math.floor(Math.random() * 100 + 10),
    hdi: (Math.random() * 0.3 + 0.5).toFixed(2),
    lifeExp: Math.floor(Math.random() * 15 + 60),
  })).sort((a, b) => b.population - a.population);
  
  const pieData = countryData.map((c, idx) => ({
    name: c.name,
    value: c.population,
    fill: `hsl(var(--chart-${(idx % 5) + 1}))`,
  }));
  
  return (
    <div className="space-y-6">
      {/* Countries count */}
      <Card className="p-4 text-center bg-primary/5">
        <Globe className="h-8 w-8 mx-auto text-primary mb-2" />
        <p className="text-3xl font-bold text-primary">{countries.length}</p>
        <p className="text-sm text-muted-foreground">Länder i regionen</p>
      </Card>
      
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
                  formatter={(value: number) => [`${value}M`, 'Befolkning']}
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
      
      {/* Country list */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Länder (sorterade efter befolkning)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {countryData.map((country, idx) => (
              <div 
                key={country.name} 
                className="flex items-center justify-between p-2 rounded border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                    {idx + 1}
                  </Badge>
                  <span className="font-medium text-sm">{country.name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{country.population}M</span>
                  <Badge variant="secondary">HDI {country.hdi}</Badge>
                  <span>{country.lifeExp} år</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const LifeExpectancyView: React.FC<{ lifeExpectancy: number; regionName: string }> = ({ lifeExpectancy, regionName }) => {
  const historyData = getLifeExpectancyHistory(lifeExpectancy);
  const genderData = getLifeExpectancyByGender(lifeExpectancy);
  const comparisonData = getLifeExpectancyComparison(lifeExpectancy);
  
  return (
    <div className="space-y-6">
      {/* Current stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center bg-primary/5">
          <p className="text-2xl font-bold text-primary">{lifeExpectancy}</p>
          <p className="text-xs text-muted-foreground">Medellivslängd (år)</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{(lifeExpectancy - 8).toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">Friska levnadsår</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">+0.4</p>
          <p className="text-xs text-muted-foreground">År/år förbättring</p>
        </Card>
      </div>
      
      {/* By gender */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Medellivslängd per kön
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" domain={[0, 85]} tick={{ fontSize: 11 }} />
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
      
      {/* Historical trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Historisk utveckling 1960–2024
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
      
      {/* Comparison */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Globe className="h-4 w-4" />
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
  population,
  countries,
  lifeExpectancy
}) => {
  const titles: Record<MetricType, { title: string; description: string; icon: React.ReactNode }> = {
    population: {
      title: 'Befolkning',
      description: 'Demografisk struktur och utveckling',
      icon: <Users className="h-5 w-5" />
    },
    countries: {
      title: 'Länder',
      description: 'Länder i regionen och deras nyckeltal',
      icon: <Globe className="h-5 w-5" />
    },
    lifeExpectancy: {
      title: 'Medellivslängd',
      description: 'Förväntad livslängd och hälsomått',
      icon: <Activity className="h-5 w-5" />
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
                <div className="p-2 rounded-lg bg-primary/10">
                  {config.icon}
                </div>
                <div>
                  <SheetTitle>{config.title}</SheetTitle>
                  <SheetDescription>{regionName}</SheetDescription>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{config.description}</p>
            </SheetHeader>
            
            {metricType === 'population' && (
              <PopulationView regionName={regionName} population={population} />
            )}
            
            {metricType === 'countries' && (
              <CountriesView countries={countries} />
            )}
            
            {metricType === 'lifeExpectancy' && (
              <LifeExpectancyView lifeExpectancy={lifeExpectancy} regionName={regionName} />
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
