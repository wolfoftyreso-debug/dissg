/**
 * EU Dashboard - Huvudvy för EU-data med NUTS-hierarki
 */

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Map, BarChart3, Users, TrendingUp, Database, Layers, Filter } from 'lucide-react';
import { useEuCountries, useNutsRegions, useEuKpiDefinitions, useEuClusters } from '@/hooks/useEuData';
import { euKpiCategories, nutsLevelConfig, type NutsLevel } from '@/config/euConfig';
import { NutsRegionSelector } from './NutsRegionSelector';
import { EuKpiOverview } from './EuKpiOverview';
import { EuClusterView } from './EuClusterView';
import { EuComparisonView } from './EuComparisonView';
import { EuFeedCatalog } from './EuFeedCatalog';

export function EuDashboard() {
  const [selectedNutsLevel, setSelectedNutsLevel] = useState<NutsLevel>(2);
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const { data: countries } = useEuCountries();
  const { data: regions } = useNutsRegions(selectedCountry, selectedNutsLevel);
  const { data: kpiDefs } = useEuKpiDefinitions(selectedCategory);
  const { data: clusters } = useEuClusters();

  const euStats = {
    countries: countries?.length || 27,
    regions: regions?.length || 0,
    kpis: kpiDefs?.length || 18,
    clusters: clusters?.length || 8,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">EU Dashboard</h1>
              <p className="text-muted-foreground text-sm">
                Harmoniserad statistik från Eurostat • NUTS 0-3 • Full jämförbarhet
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Globe} label="EU-länder" value={euStats.countries} />
            <StatCard icon={Map} label={`NUTS ${selectedNutsLevel} regioner`} value={euStats.regions} />
            <StatCard icon={BarChart3} label="KPI:er" value={euStats.kpis} />
            <StatCard icon={Users} label="Kluster" value={euStats.clusters} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={String(selectedNutsLevel)} onValueChange={(v) => setSelectedNutsLevel(Number(v) as NutsLevel)}>
            <SelectTrigger className="w-[180px]">
              <Layers className="h-4 w-4 mr-2" />
              <SelectValue placeholder="NUTS-nivå" />
            </SelectTrigger>
            <SelectContent>
              {([0, 1, 2, 3] as NutsLevel[]).map((level) => (
                <SelectItem key={level} value={String(level)}>
                  {nutsLevelConfig[level].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCountry || 'all'} onValueChange={(v) => setSelectedCountry(v === 'all' ? undefined : v)}>
            <SelectTrigger className="w-[180px]">
              <Globe className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Välj land" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla EU-länder</SelectItem>
              {countries?.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory || 'all'} onValueChange={(v) => setSelectedCategory(v === 'all' ? undefined : v)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="KPI-kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla kategorier</SelectItem>
              {Object.entries(euKpiCategories).map(([key, cat]) => (
                <SelectItem key={key} value={key}>
                  {cat.icon} {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1" />

          <Badge variant="outline" className="gap-2">
            <Database className="h-3 w-3" />
            Eurostat-harmoniserat
          </Badge>
          <Badge variant="outline" className="text-green-600 gap-2">
            ✓ Full jämförbarhet
          </Badge>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 pb-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Översikt
            </TabsTrigger>
            <TabsTrigger value="regions" className="gap-2">
              <Map className="h-4 w-4" />
              Regioner
            </TabsTrigger>
            <TabsTrigger value="clusters" className="gap-2">
              <Users className="h-4 w-4" />
              Kluster
            </TabsTrigger>
            <TabsTrigger value="compare" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Jämför
            </TabsTrigger>
            <TabsTrigger value="feeds" className="gap-2">
              <Globe className="h-4 w-4" />
              Feeds
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <EuKpiOverview 
              nutsLevel={selectedNutsLevel} 
              countryCode={selectedCountry}
              category={selectedCategory}
            />
          </TabsContent>

          <TabsContent value="regions" className="space-y-6">
            <NutsRegionSelector 
              nutsLevel={selectedNutsLevel}
              countryCode={selectedCountry}
              onSelectRegion={(code) => console.log('Selected region:', code)}
            />
          </TabsContent>

          <TabsContent value="clusters" className="space-y-6">
            <EuClusterView />
          </TabsContent>

          <TabsContent value="compare" className="space-y-6">
            <EuComparisonView 
              nutsLevel={selectedNutsLevel}
              countryCode={selectedCountry}
            />
          </TabsContent>

          <TabsContent value="feeds" className="space-y-6">
            <EuFeedCatalog />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Stat card component
function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <Card className="bg-card/50">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default EuDashboard;
