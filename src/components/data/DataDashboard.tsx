/**
 * Data Dashboard - Full tabbed data access interface
 * 
 * Combines Overview + Sources/Export/RawData/API tabs
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DataOverview } from './DataOverview';
import { 
  SourcesDrilldown, 
  CountriesDrilldown, 
  IndicatorsDrilldown, 
  TablesDrilldown 
} from './StatDrilldown';
import { Globe, ChevronDown, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

// Country context with flag emoji
const COUNTRY_OPTIONS = [
  { code: 'SE', name: 'Sverige', flag: '🇸🇪', local: 'Sverige' },
  { code: 'NO', name: 'Norge', flag: '🇳🇴', local: 'Norge' },
  { code: 'DK', name: 'Danmark', flag: '🇩🇰', local: 'Danmark' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', local: 'Suomi' },
  { code: 'DE', name: 'Tyskland', flag: '🇩🇪', local: 'Deutschland' },
  { code: 'EU', name: 'EU-27', flag: '🇪🇺', local: 'European Union' },
  { code: 'GLOBAL', name: 'Globalt', flag: '🌍', local: 'Global' },
];

// Stat card component
const StatCard: React.FC<{
  value: number;
  label: string;
  onClick?: () => void;
}> = ({ value, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex-1 p-4 md:p-6 bg-background border rounded-lg hover:shadow-md transition-shadow text-center min-w-0"
  >
    <p className="text-2xl md:text-3xl font-semibold">{value}</p>
    <p className="text-xs text-muted-foreground font-mono mt-1 truncate">[{label}]</p>
  </button>
);

// Country Context Header
const CountryContextHeader: React.FC<{
  currentCountry: typeof COUNTRY_OPTIONS[0];
  onCountryChange: (country: typeof COUNTRY_OPTIONS[0]) => void;
}> = ({ currentCountry, onCountryChange }) => (
  <div className="flex items-center justify-between mb-6 p-4 bg-muted/30 rounded-lg border">
    <div className="flex items-center gap-4">
      <div className="text-4xl">{currentCountry.flag}</div>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{currentCountry.name}</h2>
          <Badge variant="outline" className="font-mono text-xs">
            {currentCountry.code}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {currentCountry.code === 'GLOBAL' 
            ? 'Visar global data' 
            : currentCountry.code === 'EU'
            ? 'Visar aggregerad EU-27 data'
            : `Visar data för ${currentCountry.name}`}
        </p>
      </div>
    </div>
    
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Globe className="h-4 w-4" />
          Byt land
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
          Välj geografiskt fokus
        </div>
        <DropdownMenuSeparator />
        {COUNTRY_OPTIONS.map((country) => (
          <DropdownMenuItem
            key={country.code}
            onClick={() => onCountryChange(country)}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              currentCountry.code === country.code && "bg-primary/10"
            )}
          >
            <span className="text-lg">{country.flag}</span>
            <span>{country.name}</span>
            <span className="ml-auto font-mono text-xs text-muted-foreground">
              {country.code}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

export const DataDashboard: React.FC<{ className?: string }> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [countriesOpen, setCountriesOpen] = useState(false);
  const [indicatorsOpen, setIndicatorsOpen] = useState(false);
  const [tablesOpen, setTablesOpen] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(COUNTRY_OPTIONS[0]); // Default: Sweden

  const { data: stats } = useQuery({
    queryKey: ['data-dashboard-stats'],
    queryFn: async () => {
      const [sources, countries, kpis] = await Promise.all([
        supabase.from('data_sources').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('countries').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('kpi_definitions').select('id', { count: 'exact', head: true }).eq('is_active', true),
      ]);
      
      return {
        sources: sources.count || 21,
        countries: countries.count || 39,
        indicators: kpis.count || 56,
        tables: 7,
      };
    }
  });

  return (
    <div className={cn('h-full flex flex-col bg-background', className)}>
      {/* Drilldown Dialogs */}
      <SourcesDrilldown open={sourcesOpen} onOpenChange={setSourcesOpen} />
      <CountriesDrilldown open={countriesOpen} onOpenChange={setCountriesOpen} />
      <IndicatorsDrilldown open={indicatorsOpen} onOpenChange={setIndicatorsOpen} />
      <TablesDrilldown open={tablesOpen} onOpenChange={setTablesOpen} />

      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Country Context Header - Always visible */}
          <CountryContextHeader 
            currentCountry={currentCountry} 
            onCountryChange={setCurrentCountry}
          />
          {/* Stats Row */}
          <div className="flex gap-2 md:gap-4 mb-6">
            <StatCard 
              value={stats?.sources || 21} 
              label="AKTIVA KÄLLOR" 
              onClick={() => setSourcesOpen(true)}
            />
            <StatCard 
              value={stats?.countries || 39} 
              label="LÄNDER" 
              onClick={() => setCountriesOpen(true)}
            />
            <StatCard 
              value={stats?.indicators || 56} 
              label="INDIKATORER" 
              onClick={() => setIndicatorsOpen(true)}
            />
            <StatCard 
              value={stats?.tables || 7} 
              label="DATATABELLER" 
              onClick={() => setTablesOpen(true)}
            />
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 overflow-x-auto">
              {[
                { value: 'overview', label: 'ÖVERSIKT' },
                { value: 'sources', label: 'KÄLLOR' },
                { value: 'export', label: 'EXPORT' },
                { value: 'rawdata', label: 'RÅDATA' },
                { value: 'api', label: 'API' },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    'rounded-none border-b-2 border-transparent px-4 md:px-6 py-3 font-mono text-sm whitespace-nowrap',
                    'data-[state=active]:border-primary data-[state=active]:bg-transparent'
                  )}
                >
                  [{tab.label}]
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-6">
              <TabsContent value="overview" className="mt-0">
                <DataOverview />
              </TabsContent>
              <TabsContent value="sources" className="mt-0">
                <SourcesTabContent />
              </TabsContent>
              <TabsContent value="export" className="mt-0">
                <ExportTabContent />
              </TabsContent>
              <TabsContent value="rawdata" className="mt-0">
                <RawDataTabContent />
              </TabsContent>
              <TabsContent value="api" className="mt-0">
                <ApiTabContent />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};

// Sources Tab Content
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SourcesTabContent: React.FC = () => {
  const { data: sources } = useQuery({
    queryKey: ['data-sources-list'],
    queryFn: async () => {
      const { data } = await supabase
        .from('data_sources')
        .select('*')
        .eq('is_active', true)
        .order('name');
      return data || [];
    }
  });

  const sourceCategories = [
    { code: 'official', name: 'Officiella statistikbyråer', sources: [
      { name: 'SCB', url: 'https://www.scb.se/hitta-statistik/statistik-efter-amne/' },
      { name: 'Eurostat', url: 'https://ec.europa.eu/eurostat/web/main/data/database' },
      { name: 'OECD', url: 'https://data.oecd.org/' },
      { name: 'UN Statistics', url: 'https://unstats.un.org/UNSDWebsite/' },
    ]},
    { code: 'realtime', name: 'Realtidsflöden', sources: [
      { name: 'Nord Pool', url: 'https://www.nordpoolgroup.com/en/Market-data1/' },
      { name: 'ECB', url: 'https://data.ecb.europa.eu/' },
      { name: 'Trading APIs', url: 'https://www.tradingview.com/' },
    ]},
    { code: 'research', name: 'Forskningsdatabaser', sources: [
      { name: 'Our World in Data', url: 'https://ourworldindata.org/' },
      { name: 'World Bank', url: 'https://data.worldbank.org/' },
      { name: 'IMF', url: 'https://www.imf.org/en/Data' },
    ]},
    { code: 'documents', name: 'Dokumentextraktion', sources: [
      { name: 'Regeringskansliet', url: 'https://www.regeringen.se/rapporter/' },
      { name: 'Riksdagen', url: 'https://www.riksdagen.se/sv/dokument-och-lagar/' },
      { name: 'EU-kommissionen', url: 'https://commission.europa.eu/publications_en' },
    ]},
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {sourceCategories.map((cat) => (
          <Card key={cat.code}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{cat.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cat.sources.map((source) => (
                  <a
                    key={source.name}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                  >
                    <span className="text-sm text-primary group-hover:underline">{source.name}</span>
                    <span className="text-xs text-muted-foreground">[→]</span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alla aktiva datakällor ({sources?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-auto">
            {sources?.map((source) => (
              <button
                key={source.id}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0"
              >
                <div>
                  <p className="font-medium text-sm">{source.name}</p>
                  <p className="text-xs text-muted-foreground">{source.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    Tillförlitlighet: {source.reliability_score}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {source.update_frequency}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Export Tab Content  
const ExportTabContent: React.FC = () => {
  const exportFormats = [
    { code: 'csv', name: 'CSV', desc: 'Kommaseparerade värden, kompatibelt med Excel' },
    { code: 'json', name: 'JSON', desc: 'Strukturerad data för programmatisk användning' },
    { code: 'xlsx', name: 'Excel', desc: 'Native Excel-format med formatering' },
    { code: 'parquet', name: 'Parquet', desc: 'Kolumnformat för big data-analys' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Exportformat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {exportFormats.map((format) => (
              <button
                key={format.code}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
              >
                <p className="font-mono font-medium">[{format.name}]</p>
                <p className="text-sm text-muted-foreground mt-1">{format.desc}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Förkonfigurerade dataset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Sverige komplett', indicators: 56, period: '1990-2025' },
              { name: 'EU-27 jämförelse', indicators: 42, period: '2000-2025' },
              { name: 'Nordiska länder', indicators: 48, period: '1990-2025' },
              { name: 'OECD ekonomiska indikatorer', indicators: 28, period: '1980-2025' },
            ].map((dataset) => (
              <button
                key={dataset.name}
                className="w-full flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{dataset.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {dataset.indicators} indikatorer · {dataset.period}
                  </p>
                </div>
                <span className="text-sm text-primary">[Ladda ned]</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Raw Data Tab Content
const RawDataTabContent: React.FC = () => {
  const { data: tables } = useQuery({
    queryKey: ['data-tables-counts'],
    queryFn: async () => {
      const [kpis, values, sources, countries] = await Promise.all([
        supabase.from('kpi_definitions').select('id', { count: 'exact', head: true }),
        supabase.from('kpi_values').select('id', { count: 'exact', head: true }),
        supabase.from('data_sources').select('id', { count: 'exact', head: true }),
        supabase.from('countries').select('id', { count: 'exact', head: true }),
      ]);
      
      return [
        { name: 'kpi_definitions', label: 'Indikatordefinitioner', count: kpis.count || 0 },
        { name: 'kpi_values', label: 'Indikatorvärden', count: values.count || 0 },
        { name: 'data_sources', label: 'Datakällor', count: sources.count || 0 },
        { name: 'countries', label: 'Länder', count: countries.count || 0 },
      ];
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datatabeller</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {tables?.map((table) => (
            <button
              key={table.name}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0"
            >
              <div>
                <p className="font-mono text-sm">{table.name}</p>
                <p className="text-xs text-muted-foreground">{table.label}</p>
              </div>
              <div className="text-right">
                <p className="font-mono">{table.count.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">rader</p>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Query Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/30 rounded-lg font-mono text-sm">
            <p className="text-muted-foreground">// Exempel: Hämta alla svenska KPI:er</p>
            <p className="mt-2">
              <span className="text-blue-500">SELECT</span> * <span className="text-blue-500">FROM</span> kpi_values
            </p>
            <p>
              <span className="text-blue-500">WHERE</span> country_code = <span className="text-green-600">'SE'</span>
            </p>
            <p>
              <span className="text-blue-500">ORDER BY</span> period_end <span className="text-blue-500">DESC</span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            [KOMMER SNART] Visuell query builder för att bygga egna förfrågningar
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// API Tab Content
import { useNavigate } from 'react-router-dom';

const ApiTabContent: React.FC = () => {
  const navigate = useNavigate();

  const apiSections = [
    {
      title: 'REST API',
      desc: 'Standard REST-endpoints för alla datatabeller med stöd för filtrering, paginering och sortering.',
      status: 'active',
      links: [{ label: 'API Licensiering & Policy', path: '/licensing' }]
    },
    {
      title: 'GRAPHQL',
      desc: 'GraphQL-endpoint för komplexa queries över flera tabeller.',
      status: 'coming'
    },
    {
      title: 'WEBHOOKS',
      desc: 'Realtidsnotifieringar vid datauppdateringar.',
      status: 'coming'
    },
    {
      title: 'CITATION API',
      desc: 'Generera verifierbara citeringar för all DISSG-data.',
      status: 'active',
      links: [{ label: 'Citation API', path: '/cite' }]
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-mono">[API DOKUMENTATION]</CardTitle>
          <p className="text-sm text-muted-foreground">
            Programmatisk access till all DISSG-data.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiSections.map((section) => (
            <div key={section.title} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-mono font-medium">[{section.title}]</h3>
                {section.status === 'coming' && (
                  <span className="text-xs bg-muted px-2 py-1 rounded font-mono">
                    [KOMMER SNART]
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">{section.desc}</p>
              {section.links?.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 border rounded hover:bg-muted/50 transition-colors text-sm"
                >
                  <span>[→]</span>
                  <span>{link.label}</span>
                </button>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Snabbstart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/30 rounded-lg font-mono text-sm space-y-2">
            <p className="text-muted-foreground"># Hämta alla svenska indikatorer</p>
            <p>
              <span className="text-purple-500">curl</span>{' '}
              <span className="text-green-600">"https://api.dissg.se/v1/indicators?country=SE"</span>
            </p>
            <p className="text-muted-foreground mt-4"># Med API-nyckel</p>
            <p>
              <span className="text-purple-500">curl</span> -H{' '}
              <span className="text-green-600">"Authorization: Bearer YOUR_API_KEY"</span> \
            </p>
            <p className="pl-4">
              <span className="text-green-600">"https://api.dissg.se/v1/kpis/lambda_se/timeseries"</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataDashboard;
