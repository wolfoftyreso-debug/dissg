/**
 * DATA ACCESS PAGE
 * 
 * Central hub for accessing all system data:
 * - Data sources and their status
 * - Export functionality
 * - Raw data viewer
 * - API documentation links
 * 
 * Principle: Full data transparency - users can see and verify everything.
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ODISHeader, ODISFooter } from '@/components/gdis';
import { Link } from 'react-router-dom';

const DATA_TABLES = [
  { id: 'kpi_definitions', name: 'KPI-definitioner', description: 'Alla indikatordefinitioner' },
  { id: 'kpi_values', name: 'KPI-värden', description: 'Historiska mätvärden' },
  { id: 'countries', name: 'Länder', description: 'Landsregister med metadata' },
  { id: 'data_sources', name: 'Datakällor', description: 'Registrerade datakällor' },
  { id: 'observations', name: 'Observationer', description: 'Systemobservationer' },
  { id: 'policy_actions', name: 'Policyåtgärder', description: 'Registrerade åtgärder' },
  { id: 'big_questions', name: 'Stora frågor', description: 'Prioriterade samhällsfrågor' },
];

const EXPORT_FORMATS = [
  { id: 'json', label: 'JSON', description: 'Strukturerad data' },
  { id: 'csv', label: 'CSV', description: 'Tabellformat' },
  { id: 'xml', label: 'XML', description: 'Maskinläsbar' },
];

export default function DataAccess() {
  const [activeTab, setActiveTab] = useState('sources');
  const [selectedTable, setSelectedTable] = useState('kpi_definitions');
  const [exportFormat, setExportFormat] = useState('json');

  // Fetch data sources
  const { data: dataSources } = useQuery({
    queryKey: ['data-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_sources')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch countries for stats
  const { data: countries } = useQuery({
    queryKey: ['countries-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('code, name, is_active, data_depth, last_data_update')
        .order('name');
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch KPI count
  const { data: kpiCount } = useQuery({
    queryKey: ['kpi-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('kpi_definitions')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch sample data for preview
  const { data: tablePreview } = useQuery({
    queryKey: ['table-preview', selectedTable],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(selectedTable as any)
        .select('*')
        .limit(10);
      if (error) throw error;
      return data || [];
    },
  });

  const handleExport = async () => {
    try {
      const { data, error } = await supabase
        .from(selectedTable as any)
        .select('*');
      
      if (error) throw error;
      
      let content: string;
      let mimeType: string;
      let extension: string;

      if (exportFormat === 'json') {
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        extension = 'json';
      } else if (exportFormat === 'csv') {
        const headers = data && data.length > 0 ? Object.keys(data[0]).join(',') : '';
        const rows = data?.map(row => Object.values(row).map(v => 
          typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v
        ).join(','));
        content = [headers, ...(rows || [])].join('\n');
        mimeType = 'text/csv';
        extension = 'csv';
      } else {
        // XML
        const xmlRows = data?.map(row => {
          const fields = Object.entries(row).map(([k, v]) => 
            `    <${k}>${v}</${k}>`
          ).join('\n');
          return `  <row>\n${fields}\n  </row>`;
        }).join('\n');
        content = `<?xml version="1.0" encoding="UTF-8"?>\n<data>\n${xmlRows}\n</data>`;
        mimeType = 'application/xml';
        extension = 'xml';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTable}_export.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const activeSourcesCount = dataSources?.filter(s => s.is_active).length || 0;
  const activeCountriesCount = countries?.filter(c => c.is_active).length || 0;

  return (
    <div className="min-h-screen bg-background font-mono">
      <ODISHeader 
        systemName="DATA ACCESS — Sources, Export & Raw Data"
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Data Overview */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{activeSourcesCount}</div>
              <div className="text-xs text-muted-foreground">[AKTIVA KÄLLOR]</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{activeCountriesCount}</div>
              <div className="text-xs text-muted-foreground">[LÄNDER]</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{kpiCount}</div>
              <div className="text-xs text-muted-foreground">[INDIKATORER]</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{DATA_TABLES.length}</div>
              <div className="text-xs text-muted-foreground">[DATATABELLER]</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="sources" className="font-mono text-xs">[KÄLLOR]</TabsTrigger>
            <TabsTrigger value="export" className="font-mono text-xs">[EXPORT]</TabsTrigger>
            <TabsTrigger value="raw" className="font-mono text-xs">[RÅDATA]</TabsTrigger>
            <TabsTrigger value="api" className="font-mono text-xs">[API]</TabsTrigger>
          </TabsList>

          {/* DATA SOURCES TAB */}
          <TabsContent value="sources" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">[REGISTRERADE DATAKÄLLOR]</CardTitle>
                <CardDescription>
                  Alla datakällor som matar systemet med verifierad information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!dataSources || dataSources.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-3xl mb-2">—</div>
                    <p className="text-muted-foreground">Inga datakällor konfigurerade</p>
                    <p className="text-xs font-mono text-status-warning mt-2">[NO_SOURCES]</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dataSources.map(source => (
                      <div 
                        key={source.id}
                        className="p-4 border rounded-lg flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <div className="font-semibold flex items-center gap-2">
                            [{source.code}] {source.name}
                            <Badge variant={source.is_active ? 'default' : 'secondary'}>
                              {source.is_active ? 'AKTIV' : 'INAKTIV'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{source.description}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Typ: {source.source_type}</span>
                            <span>Frekvens: {source.update_frequency}</span>
                            <span>Tillförlitlighet: {(source.reliability_score * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          {source.last_successful_fetch 
                            ? `Senast: ${format(parseISO(source.last_successful_fetch), 'yyyy-MM-dd HH:mm')}`
                            : 'Aldrig hämtad'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* EXPORT TAB */}
          <TabsContent value="export" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">[DATAEXPORT]</CardTitle>
                <CardDescription>
                  Exportera data i valfritt format. Ingen data döljs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Välj tabell</label>
                    <Select value={selectedTable} onValueChange={setSelectedTable}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DATA_TABLES.map(table => (
                          <SelectItem key={table.id} value={table.id}>
                            {table.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {DATA_TABLES.find(t => t.id === selectedTable)?.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Exportformat</label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPORT_FORMATS.map(fmt => (
                          <SelectItem key={fmt.id} value={fmt.id}>
                            {fmt.label} - {fmt.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleExport} className="w-full">
                  [↓] Exportera {selectedTable}
                </Button>

                <div className="p-3 bg-muted/50 rounded text-xs text-muted-foreground">
                  <strong>OBS:</strong> Export inkluderar all tillgänglig data utan filter. 
                  För API-access med fler alternativ, se API-dokumentationen.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RAW DATA TAB */}
          <TabsContent value="raw" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">[RÅDATA-VISARE]</CardTitle>
                <CardDescription>
                  Förhandsgranskning av rå databasinformation (10 första rader).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Select value={selectedTable} onValueChange={setSelectedTable}>
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DATA_TABLES.map(table => (
                        <SelectItem key={table.id} value={table.id}>
                          {table.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <ScrollArea className="h-[400px] border rounded">
                  {!tablePreview || tablePreview.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <div className="text-3xl mb-2">—</div>
                      <p>Ingen data i tabellen</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {Object.keys(tablePreview[0] || {}).slice(0, 6).map(key => (
                            <TableHead key={key} className="font-mono text-xs">
                              {key}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tablePreview.map((row, idx) => (
                          <TableRow key={idx}>
                            {Object.values(row).slice(0, 6).map((val, i) => (
                              <TableCell key={i} className="font-mono text-xs truncate max-w-[200px]">
                                {val === null ? '—' : String(val).slice(0, 50)}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API TAB */}
          <TabsContent value="api" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">[API DOKUMENTATION]</CardTitle>
                <CardDescription>
                  Programmatisk access till all DISSG-data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">[REST API]</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Standard REST-endpoints för alla datatabeller med stöd för filtrering, 
                      paginering och sortering.
                    </p>
                    <Link to="/api-policy">
                      <Button variant="outline" size="sm">[→] API Licensiering & Policy</Button>
                    </Link>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">[GRAPHQL]</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      GraphQL-endpoint för komplexa queries över flera tabeller.
                    </p>
                    <Badge variant="secondary">[KOMMER SNART]</Badge>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">[WEBHOOKS]</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Realtidsnotifieringar vid datauppdateringar.
                    </p>
                    <Badge variant="secondary">[KOMMER SNART]</Badge>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">[CITATION API]</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Generera verifierbara citeringar för all DISSG-data.
                    </p>
                    <Link to="/cite">
                      <Button variant="outline" size="sm">[→] Citation API</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <ODISFooter />
    </div>
  );
}
