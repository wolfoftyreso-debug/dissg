import { useState, useMemo } from 'react';
import { BarChart3, Search, ArrowUpDown, TrendingUp, TrendingDown, Minus, Database, Calendar, RefreshCw, Download, Eye, Sparkles, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CATEGORIES, KPI, KPICategory } from '@/types/kpi';
import { Sparkline } from './Sparkline';
import { HistoricalTimelineChart } from './HistoricalTimelineChart';
import { MultiKPITimelineChart } from './MultiKPITimelineChart';
import { cn } from '@/lib/utils';

interface IndicatorsPanelProps {
  kpis: KPI[];
  onKPIClick: (kpi: KPI) => void;
}

export function IndicatorsPanel({ kpis, onKPIClick }: IndicatorsPanelProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<KPICategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'positive' | 'warning' | 'critical'>('all');
  const [sortBy, setSortBy] = useState<'index' | 'name' | 'value' | 'trend' | 'confidence'>('index');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'compact' | 'timeline'>('table');

  const filteredKPIs = useMemo(() => {
    let result = [...kpis];
    
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(kpi => 
        kpi.name.toLowerCase().includes(searchLower) ||
        kpi.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (categoryFilter !== 'all') {
      result = result.filter(kpi => kpi.category === categoryFilter);
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(kpi => kpi.status === statusFilter);
    }
    
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'index':
          comparison = a.index - b.index;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'value':
          comparison = a.value - b.value;
          break;
        case 'trend':
          comparison = a.trendPercent - b.trendPercent;
          break;
        case 'confidence':
          comparison = a.confidence - b.confidence;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [kpis, search, categoryFilter, statusFilter, sortBy, sortOrder]);

  const statusCounts = useMemo(() => ({
    total: kpis.length,
    positive: kpis.filter(k => k.status === 'positive').length,
    warning: kpis.filter(k => k.status === 'warning').length,
    critical: kpis.filter(k => k.status === 'critical').length,
  }), [kpis]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4" />;
      case 'down': return <TrendingDown className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-muted';
    }
  };

  const toggleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getCategoryName = (categoryId: KPICategory) => {
    return CATEGORIES.find(c => c.id === categoryId)?.name || categoryId;
  };

  const handleExportCSV = () => {
    const headers = ['Index', 'Namn', 'Kategori', 'Värde', 'Enhet', 'Trend %', 'Status', 'Konfidens'];
    const rows = filteredKPIs.map(kpi => [
      kpi.index,
      kpi.name,
      getCategoryName(kpi.category),
      kpi.value,
      kpi.unit,
      kpi.trendPercent,
      kpi.status,
      kpi.confidence
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `indikatorer_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Alla Indikatorer
          </h2>
          <p className="text-muted-foreground mt-1">
            Komplett översikt av alla {kpis.length} KPI:er med detaljerad datakvalitet
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 text-emerald-600">
            {statusCounts.positive} positiva
          </Badge>
          <Badge variant="outline" className="gap-1 text-amber-600">
            {statusCounts.warning} varning
          </Badge>
          <Badge variant="outline" className="gap-1 text-red-600">
            {statusCounts.critical} kritiska
          </Badge>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-background dark:from-emerald-950/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Positiv trend</p>
                <p className="text-2xl font-bold text-emerald-600">{statusCounts.positive}</p>
              </div>
              <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-background dark:from-amber-950/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Under observation</p>
                <p className="text-2xl font-bold text-amber-600">{statusCounts.warning}</p>
              </div>
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <Eye className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-background dark:from-red-950/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kritiska</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.critical}</p>
              </div>
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Snittkonfidens</p>
                <p className="text-2xl font-bold">
                  {Math.round(kpis.reduce((acc, k) => acc + k.confidence, 0) / kpis.length)}%
                </p>
              </div>
              <div className="p-2 rounded-full bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Sök indikator..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as KPICategory | 'all')}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Alla kategorier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla kategorier</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.code}. {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Alla status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla status</SelectItem>
                <SelectItem value="positive">Positiva</SelectItem>
                <SelectItem value="warning">Varning</SelectItem>
                <SelectItem value="critical">Kritiska</SelectItem>
              </SelectContent>
            </Select>
            
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)} className="hidden md:block">
              <TabsList className="h-9">
                <TabsTrigger value="table" className="text-xs">Tabell</TabsTrigger>
                <TabsTrigger value="cards" className="text-xs">Kort</TabsTrigger>
                <TabsTrigger value="compact" className="text-xs">Kompakt</TabsTrigger>
                <TabsTrigger value="timeline" className="text-xs">Tidslinje</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2">
              <Download className="h-4 w-4" />
              Exportera
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="space-y-6">
          {/* Multi-KPI comparison chart */}
          <MultiKPITimelineChart 
            defaultSelected={filteredKPIs.slice(0, 3).map(k => k.id)}
          />
          
          {/* Individual KPI timeline */}
          {filteredKPIs.length > 0 && (
            <HistoricalTimelineChart
              kpiId={filteredKPIs[0].id}
              kpiName={filteredKPIs[0].name}
              showEvents={true}
            />
          )}
        </div>
      )}

      {/* Content based on view mode */}
      {viewMode === 'table' && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="w-12 cursor-pointer"
                    onClick={() => toggleSort('index')}
                  >
                    <div className="flex items-center gap-1">
                      #
                      {sortBy === 'index' && <ArrowUpDown className="h-3 w-3" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => toggleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Indikator
                      {sortBy === 'name' && <ArrowUpDown className="h-3 w-3" />}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Kategori</TableHead>
                  <TableHead className="hidden lg:table-cell w-[100px]">Trend</TableHead>
                  <TableHead 
                    className="text-right cursor-pointer"
                    onClick={() => toggleSort('value')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Värde
                      {sortBy === 'value' && <ArrowUpDown className="h-3 w-3" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-center cursor-pointer"
                    onClick={() => toggleSort('trend')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Δ
                      {sortBy === 'trend' && <ArrowUpDown className="h-3 w-3" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="hidden md:table-cell cursor-pointer"
                    onClick={() => toggleSort('confidence')}
                  >
                    <div className="flex items-center gap-1">
                      Konfidens
                      {sortBy === 'confidence' && <ArrowUpDown className="h-3 w-3" />}
                    </div>
                  </TableHead>
                  <TableHead className="w-20">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKPIs.map((kpi) => (
                  <TableRow 
                    key={kpi.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onKPIClick(kpi)}
                  >
                    <TableCell className="font-mono text-muted-foreground">
                      {kpi.index}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{kpi.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                          {kpi.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {getCategoryName(kpi.category)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Sparkline 
                        data={[kpi.previousValue || kpi.value * 0.95, kpi.value * 0.97, kpi.value]} 
                        status={kpi.status}
                        height={24}
                        width={80}
                      />
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {kpi.value.toLocaleString('sv-SE')} {kpi.unit}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={cn(
                        "inline-flex items-center gap-1 text-sm",
                        kpi.trend === 'up' && (kpi.inverted ? 'text-red-600' : 'text-emerald-600'),
                        kpi.trend === 'down' && (kpi.inverted ? 'text-emerald-600' : 'text-red-600'),
                        kpi.trend === 'stable' && 'text-muted-foreground'
                      )}>
                        {getTrendIcon(kpi.trend)}
                        {kpi.trendPercent > 0 && '+'}{kpi.trendPercent.toFixed(1)}%
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Progress value={kpi.confidence} className="h-2 w-16" />
                        <span className="text-xs text-muted-foreground">{kpi.confidence}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={cn("w-3 h-3 rounded-full", getStatusColor(kpi.status))} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {viewMode === 'cards' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredKPIs.map((kpi) => (
            <Card 
              key={kpi.id} 
              className={cn(
                "cursor-pointer hover:shadow-md transition-all",
                kpi.status === 'critical' && "border-red-200 dark:border-red-800"
              )}
              onClick={() => onKPIClick(kpi)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">#{kpi.index}</span>
                    <div className={cn("w-2 h-2 rounded-full", getStatusColor(kpi.status))} />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getCategoryName(kpi.category).split(' ')[0]}
                  </Badge>
                </div>
                
                <h3 className="font-semibold mb-1">{kpi.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{kpi.description}</p>
                
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold">{kpi.value.toLocaleString('sv-SE')}</div>
                    <div className="text-xs text-muted-foreground">{kpi.unit}</div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "flex items-center gap-1 text-sm",
                      kpi.trend === 'up' && (kpi.inverted ? 'text-red-600' : 'text-emerald-600'),
                      kpi.trend === 'down' && (kpi.inverted ? 'text-emerald-600' : 'text-red-600')
                    )}>
                      {getTrendIcon(kpi.trend)}
                      {kpi.trendPercent > 0 && '+'}{kpi.trendPercent.toFixed(1)}%
                    </div>
                    <Sparkline 
                      data={[kpi.previousValue || kpi.value * 0.95, kpi.value * 0.97, kpi.value]} 
                      status={kpi.status}
                      height={20}
                      width={60}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {viewMode === 'compact' && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid gap-2 md:grid-cols-2">
              {filteredKPIs.map((kpi) => (
                <div 
                  key={kpi.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => onKPIClick(kpi)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", getStatusColor(kpi.status))} />
                    <span className="font-mono text-xs text-muted-foreground">#{kpi.index}</span>
                    <span className="font-medium text-sm">{kpi.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm">{kpi.value.toLocaleString('sv-SE')} {kpi.unit}</span>
                    <div className={cn(
                      "flex items-center gap-1 text-xs",
                      kpi.trend === 'up' && (kpi.inverted ? 'text-red-600' : 'text-emerald-600'),
                      kpi.trend === 'down' && (kpi.inverted ? 'text-emerald-600' : 'text-red-600')
                    )}>
                      {getTrendIcon(kpi.trend)}
                      {kpi.trendPercent > 0 && '+'}{kpi.trendPercent.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Sources Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4" />
            Datakällor & Uppdateringsfrekvens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <RefreshCw className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Daglig uppdatering</div>
                <div className="text-sm text-muted-foreground">
                  {kpis.filter(k => k.dataSources.some(ds => ds.updateFrequency === 'daily')).length} indikatorer
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Månadsvis uppdatering</div>
                <div className="text-sm text-muted-foreground">
                  {kpis.filter(k => k.dataSources.some(ds => ds.updateFrequency === 'monthly')).length} indikatorer
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Database className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Unika datakällor</div>
                <div className="text-sm text-muted-foreground">
                  {new Set(kpis.flatMap(k => k.dataSources.map(ds => ds.name))).size} källor
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
