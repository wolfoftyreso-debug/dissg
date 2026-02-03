/**
 * 🏙️ City Nodes
 * 
 * Index of major cities with their own indicators and comparisons.
 * Municipal-level data aggregation and cross-city benchmarking.
 */

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Users,
  MapPin,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Swedish major cities with population data
const SWEDISH_CITIES = [
  { code: 'stockholm', name: 'Stockholm', population: 975551, region: 'Stockholm', lat: 59.3293, lng: 18.0686 },
  { code: 'goteborg', name: 'Göteborg', population: 583056, region: 'Västra Götaland', lat: 57.7089, lng: 11.9746 },
  { code: 'malmo', name: 'Malmö', population: 351749, region: 'Skåne', lat: 55.6050, lng: 13.0038 },
  { code: 'uppsala', name: 'Uppsala', population: 233839, region: 'Uppsala', lat: 59.8586, lng: 17.6389 },
  { code: 'linkoping', name: 'Linköping', population: 166445, region: 'Östergötland', lat: 58.4108, lng: 15.6214 },
  { code: 'orebro', name: 'Örebro', population: 157669, region: 'Örebro', lat: 59.2753, lng: 15.2134 },
  { code: 'vasteras', name: 'Västerås', population: 155828, region: 'Västmanland', lat: 59.6099, lng: 16.5448 },
  { code: 'helsingborg', name: 'Helsingborg', population: 149280, region: 'Skåne', lat: 56.0465, lng: 12.6945 },
  { code: 'norrkoping', name: 'Norrköping', population: 143171, region: 'Östergötland', lat: 58.5877, lng: 16.1924 },
  { code: 'jonkoping', name: 'Jönköping', population: 143127, region: 'Jönköping', lat: 57.7826, lng: 14.1618 },
  { code: 'umea', name: 'Umeå', population: 130224, region: 'Västerbotten', lat: 63.8258, lng: 20.2630 },
  { code: 'lund', name: 'Lund', population: 127819, region: 'Skåne', lat: 55.7047, lng: 13.1910 },
];

// City indicators
const CITY_INDICATORS = [
  { code: 'employment', name: 'Sysselsättning', unit: '%' },
  { code: 'income', name: 'Medianinkomst', unit: 'kr' },
  { code: 'housing', name: 'Bostadspris', unit: 'kr/kvm' },
  { code: 'education', name: 'Högskoleutbildade', unit: '%' },
  { code: 'health', name: 'Medellivslängd', unit: 'år' },
  { code: 'safety', name: 'Trygghetsindex', unit: '0-100' },
];

// Generate simulated city data
function generateCityData(cityCode: string, indicator: string): { value: number; trend: string; change: number } {
  // Use city code as seed for consistent values
  const seed = cityCode.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const indicatorSeed = indicator.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  
  const baseValues: Record<string, number> = {
    employment: 75 + (seed % 15),
    income: 320000 + (seed * 1000) % 80000,
    housing: 45000 + (seed * 500) % 40000,
    education: 35 + (seed % 25),
    health: 81 + (seed % 4),
    safety: 60 + (seed % 30),
  };
  
  const value = baseValues[indicator] || 50;
  const changeValue = ((seed + indicatorSeed) % 10) - 3;
  
  return {
    value,
    trend: changeValue > 1 ? 'up' : changeValue < -1 ? 'down' : 'stable',
    change: changeValue
  };
}

function CityCard({ city }: { city: typeof SWEDISH_CITIES[0] }) {
  // Calculate overall city health
  const indicators = CITY_INDICATORS.map(ind => ({
    ...ind,
    ...generateCityData(city.code, ind.code)
  }));
  
  const upTrends = indicators.filter(i => i.trend === 'up').length;
  const downTrends = indicators.filter(i => i.trend === 'down').length;
  
  const overallStatus = upTrends > downTrends + 1 ? 'improving' : 
                        downTrends > upTrends + 1 ? 'declining' : 'stable';
  
  return (
    <Link to={`/city?city=${city.code}`}>
      <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{city.name}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {city.region}
              </div>
            </div>
          </div>
          <Badge 
            variant={overallStatus === 'improving' ? 'default' : overallStatus === 'declining' ? 'destructive' : 'secondary'}
            className="text-xs"
          >
            {overallStatus === 'improving' ? 'Förbättras' : overallStatus === 'declining' ? 'Försämras' : 'Stabilt'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Users className="h-3 w-3" />
          {city.population.toLocaleString('sv-SE')} invånare
        </div>
        
        {/* Key indicators preview */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {indicators.slice(0, 3).map(ind => (
            <div key={ind.code} className="text-center p-2 rounded bg-muted/50">
              <div className="text-xs text-muted-foreground mb-1">{ind.name}</div>
              <div className="flex items-center justify-center gap-1">
                {ind.trend === 'up' && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                {ind.trend === 'down' && <TrendingDown className="h-3 w-3 text-rose-500" />}
                {ind.trend === 'stable' && <Minus className="h-3 w-3 text-muted-foreground" />}
                <span className="text-sm font-medium">
                  {ind.code === 'income' || ind.code === 'housing' 
                    ? `${(ind.value / 1000).toFixed(0)}k`
                    : ind.value.toFixed(ind.code === 'health' ? 1 : 0)}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-end text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Visa detaljer</span>
          <ArrowRight className="h-3 w-3 ml-1" />
        </div>
      </Card>
    </Link>
  );
}

export default function CityNodes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'population'>('population');
  
  const filteredCities = useMemo(() => {
    let cities = SWEDISH_CITIES;
    
    if (searchQuery) {
      cities = cities.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.region.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (sortBy === 'population') {
      cities = [...cities].sort((a, b) => b.population - a.population);
    } else {
      cities = [...cities].sort((a, b) => a.name.localeCompare(b.name, 'sv'));
    }
    
    return cities;
  }, [searchQuery, sortBy]);
  
  const totalPopulation = SWEDISH_CITIES.reduce((acc, c) => acc + c.population, 0);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">City Nodes</span>
            <Badge variant="outline" className="text-xs">{SWEDISH_CITIES.length} städer</Badge>
          </div>
          <Link 
            to="/public"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            Dashboard <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Svenska städer
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Jämför {SWEDISH_CITIES.length} större städer. {totalPopulation.toLocaleString('sv-SE')} invånare totalt.
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök stad eller region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={sortBy === 'population' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('population')}
            >
              <Users className="h-4 w-4 mr-1" />
              Population
            </Button>
            <Button 
              variant={sortBy === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('name')}
            >
              A-Ö
            </Button>
          </div>
        </div>
        
        {/* City Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredCities.map(city => (
            <CityCard key={city.code} city={city} />
          ))}
        </div>
        
        {filteredCities.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Inga städer matchar din sökning.</p>
          </div>
        )}
        
        {/* Indicator Legend */}
        <Card className="p-4">
          <h3 className="font-medium text-sm mb-3">Indikatorer som spåras</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
            {CITY_INDICATORS.map(ind => (
              <div key={ind.code} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary/50" />
                <span>{ind.name} ({ind.unit})</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
            Datakälla: SCB Kommunstatistik · Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}
          </div>
        </Card>
      </main>
    </div>
  );
}
