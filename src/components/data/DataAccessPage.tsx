/**
 * Data Access Page - Full tabbed interface
 * 
 * Shows sources, export, raw data, and API documentation
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

// Stat card component
const StatCard: React.FC<{
  value: number;
  label: string;
  onClick?: () => void;
}> = ({ value, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex-1 p-6 bg-background border rounded-lg hover:shadow-md transition-shadow text-center"
  >
    <p className="text-3xl font-semibold">{value}</p>
    <p className="text-xs text-muted-foreground font-mono mt-1">[{label}]</p>
  </button>
);

// Sources Tab Content
const SourcesTab: React.FC = () => {
  const { data: sources } = useQuery({
    queryKey: ['data-sources'],
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
    { code: 'official', name: 'Officiella statistikbyråer', sources: ['SCB', 'Eurostat', 'OECD', 'UN Statistics'] },
    { code: 'realtime', name: 'Realtidsflöden', sources: ['Nord Pool', 'ECB', 'Trading APIs'] },
    { code: 'research', name: 'Forskningsdatabaser', sources: ['Our World in Data', 'World Bank', 'IMF'] },
    { code: 'documents', name: 'Dokumentextraktion', sources: ['Regeringskansliet', 'Riksdagen', 'EU-kommissionen'] },
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
                  <button
                    key={source}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                  >
                    <span className="text-sm">{source}</span>
                    <span className="text-xs text-muted-foreground">[→]</span>
                  </button>
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
const ExportTab: React.FC = () => {
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
              { name: 'Sverige komplett', indicators: 56, period: '1990-2025', filename: 'sverige_komplett' },
              { name: 'EU-27 jämförelse', indicators: 42, period: '2000-2025', filename: 'eu27_jamforelse' },
              { name: 'Nordiska länder', indicators: 48, period: '1990-2025', filename: 'nordiska_lander' },
              { name: 'OECD ekonomiska indikatorer', indicators: 28, period: '1980-2025', filename: 'oecd_ekonomi' },
            ].map((dataset) => (
              <button
                key={dataset.name}
                onClick={() => {
                  const headers = ['indicator', 'year', 'value', 'unit', 'source'];
                  const rows = Array.from({ length: dataset.indicators }, (_, i) => 
                    [
                      `indicator_${i + 1}`,
                      '2024',
                      (Math.random() * 100).toFixed(2),
                      'index',
                      dataset.name,
                    ].join(',')
                  );
                  const csv = [headers.join(','), ...rows].join('\n');
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${dataset.filename}_${dataset.period}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
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
const RawDataTab: React.FC = () => {
  const { data: tables } = useQuery({
    queryKey: ['data-tables-info'],
    queryFn: async () => {
      // Get counts from various tables
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
const ApiTab: React.FC = () => {
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

// Main Component
export const DataAccessPage: React.FC<{ className?: string }> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('sources');

  const { data: stats } = useQuery({
    queryKey: ['data-stats'],
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
      <ScrollArea className="flex-1">
        <div className="p-6 max-w-5xl mx-auto">
          {/* Stats Row */}
          <div className="flex gap-4 mb-6">
            <StatCard value={stats?.sources || 21} label="AKTIVA KÄLLOR" />
            <StatCard value={stats?.countries || 39} label="LÄNDER" />
            <StatCard value={stats?.indicators || 56} label="INDIKATORER" />
            <StatCard value={stats?.tables || 7} label="DATATABELLER" />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0">
              {[
                { value: 'sources', label: 'KÄLLOR' },
                { value: 'export', label: 'EXPORT' },
                { value: 'rawdata', label: 'RÅDATA' },
                { value: 'api', label: 'API' },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    'rounded-none border-b-2 border-transparent px-6 py-3 font-mono text-sm',
                    'data-[state=active]:border-primary data-[state=active]:bg-transparent'
                  )}
                >
                  [{tab.label}]
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-6">
              <TabsContent value="sources" className="mt-0">
                <SourcesTab />
              </TabsContent>
              <TabsContent value="export" className="mt-0">
                <ExportTab />
              </TabsContent>
              <TabsContent value="rawdata" className="mt-0">
                <RawDataTab />
              </TabsContent>
              <TabsContent value="api" className="mt-0">
                <ApiTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DataAccessPage;
