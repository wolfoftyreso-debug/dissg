/**
 * Stat Drilldown Views
 * 
 * Detailed exploration views for dashboard stats
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { MiniSparkline } from './DataOverview';

// Generate mock sparkline
const generateSparkData = () => Array.from({ length: 12 }, () => Math.random() * 100);

// Source Detail Item
const SourceItem: React.FC<{
  source: {
    id: string;
    name: string;
    code: string;
    source_type: string;
    reliability_score: number;
    update_frequency: string;
    description?: string | null;
    last_successful_fetch?: string | null;
  };
  onClick?: () => void;
}> = ({ source, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 text-left"
  >
    <div className="flex-1">
      <div className="flex items-center gap-3">
        <span className={cn(
          'w-2 h-2 rounded-full',
          source.reliability_score >= 80 ? 'bg-emerald-500' : 
          source.reliability_score >= 60 ? 'bg-amber-500' : 'bg-red-500'
        )} />
        <p className="font-medium">{source.name}</p>
        <span className="text-xs bg-muted px-2 py-0.5 rounded font-mono">{source.code}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1 ml-5">
        {source.description || `${source.source_type} · ${source.update_frequency}`}
      </p>
    </div>
    <div className="text-right">
      <p className="font-mono text-sm">{source.reliability_score}%</p>
      <p className="text-xs text-muted-foreground">tillförlitlighet</p>
    </div>
  </button>
);

// Country Detail Item
const CountryItem: React.FC<{
  country: {
    id: string;
    name: string;
    code: string;
    region: string;
    population?: number | null;
    data_depth: string;
    data_quality_score?: number | null;
  };
  onClick?: () => void;
}> = ({ country, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 text-left"
  >
    <div className="flex-1">
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">{country.code}</span>
        <p className="font-medium">{country.name}</p>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {country.region} · {country.data_depth}
      </p>
    </div>
    <div className="text-right">
      {country.population && (
        <p className="font-mono text-sm">{(country.population / 1_000_000).toFixed(1)}M</p>
      )}
      <p className="text-xs text-muted-foreground">
        {country.data_quality_score ? `${country.data_quality_score}% kvalitet` : 'Datatäckning'}
      </p>
    </div>
  </button>
);

// KPI/Indicator Detail Item
const IndicatorItem: React.FC<{
  kpi: {
    id: string;
    name: string;
    code: string;
    category: string;
    unit?: string | null;
    description?: string | null;
  };
  trend?: number;
  onClick?: () => void;
}> = ({ kpi, trend = 0, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 text-left"
  >
    <div className="flex-1">
      <div className="flex items-center gap-3">
        <p className="font-medium">{kpi.name}</p>
        <span className="text-xs bg-muted px-2 py-0.5 rounded font-mono">{kpi.code}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {kpi.category} {kpi.unit && `· ${kpi.unit}`}
      </p>
    </div>
    <div className="flex items-center gap-4">
      <div className="w-16">
        <MiniSparkline 
          data={generateSparkData()} 
          color={trend >= 0 ? 'positive' : 'negative'}
          height={20}
        />
      </div>
      <span className={cn(
        'font-mono text-sm min-w-[50px] text-right',
        trend >= 0 ? 'text-emerald-600' : 'text-red-600'
      )}>
        {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
      </span>
    </div>
  </button>
);

// Table Detail Item
const TableItem: React.FC<{
  table: {
    name: string;
    label: string;
    count: number;
    description?: string;
  };
  onClick?: () => void;
}> = ({ table, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 text-left"
  >
    <div className="flex-1">
      <p className="font-mono font-medium">{table.name}</p>
      <p className="text-xs text-muted-foreground mt-1">{table.label}</p>
    </div>
    <div className="text-right">
      <p className="font-mono text-lg">{table.count.toLocaleString()}</p>
      <p className="text-xs text-muted-foreground">rader</p>
    </div>
  </button>
);

// Sources Drilldown
export const SourcesDrilldown: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  
  const { data: sources } = useQuery({
    queryKey: ['sources-drilldown'],
    queryFn: async () => {
      const { data } = await supabase
        .from('data_sources')
        .select('*')
        .eq('is_active', true)
        .order('reliability_score', { ascending: false });
      return data || [];
    },
    enabled: open
  });

  const byType = React.useMemo(() => {
    if (!sources) return {};
    return sources.reduce((acc, s) => {
      const type = s.source_type || 'other';
      if (!acc[type]) acc[type] = [];
      acc[type].push(s);
      return acc;
    }, {} as Record<string, typeof sources>);
  }, [sources]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-3xl font-semibold">{sources?.length || 0}</span>
            <span className="text-muted-foreground">Aktiva datakällor</span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(byType).map(([type, list]) => (
                <Card key={type}>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-semibold">{list.length}</p>
                    <p className="text-xs text-muted-foreground capitalize">{type.replace('_', ' ')}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Source List */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Alla källor (sorterat efter tillförlitlighet)</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {sources?.map((source) => (
                  <SourceItem
                    key={source.id}
                    source={source}
                    onClick={() => {
                      onOpenChange(false);
                      // Navigate to source detail
                    }}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// Countries Drilldown
export const CountriesDrilldown: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  
  const { data: countries } = useQuery({
    queryKey: ['countries-drilldown'],
    queryFn: async () => {
      const { data } = await supabase
        .from('countries')
        .select('*')
        .eq('is_active', true)
        .order('name');
      return data || [];
    },
    enabled: open
  });

  const byRegion = React.useMemo(() => {
    if (!countries) return {};
    return countries.reduce((acc, c) => {
      const region = c.region || 'Other';
      if (!acc[region]) acc[region] = [];
      acc[region].push(c);
      return acc;
    }, {} as Record<string, typeof countries>);
  }, [countries]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-3xl font-semibold">{countries?.length || 0}</span>
            <span className="text-muted-foreground">Länder med datatäckning</span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Region Summary */}
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(byRegion).slice(0, 6).map(([region, list]) => (
                <Card key={region}>
                  <CardContent className="p-4">
                    <p className="text-2xl font-semibold">{list.length}</p>
                    <p className="text-xs text-muted-foreground">{region}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Country List by Region */}
            {Object.entries(byRegion).map(([region, list]) => (
              <Card key={region}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{region} ({list.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {list.map((country) => (
                    <CountryItem
                      key={country.id}
                      country={country}
                      onClick={() => {
                        onOpenChange(false);
                        navigate(`/gdm?country=${country.code}`);
                      }}
                    />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// Indicators Drilldown
export const IndicatorsDrilldown: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  
  const { data: kpis } = useQuery({
    queryKey: ['kpis-drilldown'],
    queryFn: async () => {
      const { data } = await supabase
        .from('kpi_definitions')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });
      return data || [];
    },
    enabled: open
  });

  const byCategory = React.useMemo(() => {
    if (!kpis) return {};
    return kpis.reduce((acc, k) => {
      const cat = k.category || 'other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(k);
      return acc;
    }, {} as Record<string, typeof kpis>);
  }, [kpis]);

  const categoryLabels: Record<string, string> = {
    demografi_halsa: 'Demografi & Hälsa',
    ekonomisk_barkraft: 'Ekonomisk Bärkraft',
    social_stabilitet: 'Social Stabilitet',
    arbete_produktivitet: 'Arbete & Produktivitet',
    karnsystem_funktion: 'Systemfunktion',
    infrastruktur: 'Infrastruktur',
    utbildning_kompetens: 'Utbildning & Kompetens',
    systemrisk_styrning: 'Systemrisk & Styrning',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-3xl font-semibold">{kpis?.length || 0}</span>
            <span className="text-muted-foreground">Aktiva indikatorer</span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Category Summary */}
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(byCategory).slice(0, 8).map(([cat, list]) => (
                <Card key={cat} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <p className="text-2xl font-semibold">{list.length}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {categoryLabels[cat] || cat}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* KPI List by Category */}
            {Object.entries(byCategory).map(([cat, list]) => (
              <Card key={cat}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {categoryLabels[cat] || cat} ({list.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {list.map((kpi) => (
                    <IndicatorItem
                      key={kpi.id}
                      kpi={kpi}
                      trend={(Math.random() - 0.5) * 10}
                      onClick={() => {
                        onOpenChange(false);
                        navigate(`/index?kpi=${kpi.code}`);
                      }}
                    />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// Tables Drilldown
export const TablesDrilldown: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const { data: tables } = useQuery({
    queryKey: ['tables-drilldown'],
    queryFn: async () => {
      const [kpis, values, sources, countries, observations, bigQuestions, policies] = await Promise.all([
        supabase.from('kpi_definitions').select('id', { count: 'exact', head: true }),
        supabase.from('kpi_values').select('id', { count: 'exact', head: true }),
        supabase.from('data_sources').select('id', { count: 'exact', head: true }),
        supabase.from('countries').select('id', { count: 'exact', head: true }),
        supabase.from('observations').select('id', { count: 'exact', head: true }),
        supabase.from('big_questions').select('id', { count: 'exact', head: true }),
        supabase.from('policy_actions').select('id', { count: 'exact', head: true }),
      ]);
      
      return [
        { name: 'kpi_definitions', label: 'Indikatordefinitioner', count: kpis.count || 0, description: 'Alla KPI-definitioner med metadata och beräkningsmetoder' },
        { name: 'kpi_values', label: 'Indikatorvärden', count: values.count || 0, description: 'Historiska och aktuella värden för alla indikatorer' },
        { name: 'data_sources', label: 'Datakällor', count: sources.count || 0, description: 'Konfigurerade datakällor med API-endpoints och metadata' },
        { name: 'countries', label: 'Länder', count: countries.count || 0, description: 'Länderdefinitioner med datatäckning och kvalitetspoäng' },
        { name: 'observations', label: 'Observationer', count: observations.count || 0, description: 'Analyskedjor och systemobservationer' },
        { name: 'big_questions', label: 'Stora frågor', count: bigQuestions.count || 0, description: 'Rankade samhällsfrågor med underliggande indikatorer' },
        { name: 'policy_actions', label: 'Policyåtgärder', count: policies.count || 0, description: 'Registrerade policyåtgärder och deras utfall' },
      ];
    },
    enabled: open
  });

  const totalRows = tables?.reduce((sum, t) => sum + t.count, 0) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-3xl font-semibold">{tables?.length || 0}</span>
            <span className="text-muted-foreground">Datatabeller</span>
            <span className="text-sm text-muted-foreground ml-auto">
              Totalt {totalRows.toLocaleString()} rader
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-semibold">{tables?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Tabeller</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-semibold">{totalRows.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Totala rader</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-semibold">PostgreSQL</p>
                  <p className="text-xs text-muted-foreground">Databasmotor</p>
                </CardContent>
              </Card>
            </div>

            {/* Table List */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Alla tabeller</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {tables?.map((table) => (
                  <div
                    key={table.name}
                    className="p-4 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono font-medium">{table.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{table.label}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-lg">{table.count.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">rader</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{table.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
