import { useState, useMemo } from 'react';
import { BarChart3, Search, Filter, ArrowUpDown, TrendingUp, TrendingDown, Minus, Database, Calendar, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { CATEGORIES, KPI, KPICategory } from '@/types/kpi';
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

  const filteredKPIs = useMemo(() => {
    let result = [...kpis];
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(kpi => 
        kpi.name.toLowerCase().includes(searchLower) ||
        kpi.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(kpi => kpi.category === categoryFilter);
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(kpi => kpi.status === statusFilter);
    }
    
    // Sorting
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
            Komplett översikt av alla 20 KPI:er med detaljerad datakvalitet
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
          </div>
        </CardContent>
      </Card>

      {/* KPI Table */}
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
                    Trend
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
                <div className="font-medium">Genomsnittlig konfidens</div>
                <div className="text-sm text-muted-foreground">
                  {Math.round(kpis.reduce((acc, k) => acc + k.confidence, 0) / kpis.length)}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
