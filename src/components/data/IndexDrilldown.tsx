/**
 * Index Drilldown Dialog
 * 
 * Detailed view when clicking on an index row - infinite clickability
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { MiniSparkline } from './DataOverview';
import { TrendingUp, TrendingDown, Clock, Database, ExternalLink, ChevronRight, AlertTriangle, Info } from 'lucide-react';

interface IndexItem {
  id: string;
  code: string;
  name: string;
  value: number;
  change: number;
  time: string;
  flag?: string;
  sparkData?: number[];
}

// Generate extended history data
const generateHistory = (baseValue: number, trend: number) => {
  const data = [];
  let value = baseValue * 0.9;
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    value = value * (1 + (Math.random() - 0.5) * 0.02 + trend * 0.001);
    data.push({
      date: date.toISOString().split('T')[0],
      value: value,
      change: (Math.random() - 0.5) * 2
    });
  }
  return data;
};

// Key metric card
const MetricCard: React.FC<{
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: number;
  onClick?: () => void;
}> = ({ label, value, sublabel, trend, onClick }) => (
  <button
    onClick={onClick}
    className="text-left p-3 border rounded-lg hover:bg-muted/50 transition-colors w-full"
  >
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-lg font-semibold mt-1">{value}</p>
    {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
    {trend !== undefined && (
      <span className={cn(
        'text-xs font-mono',
        trend >= 0 ? 'text-emerald-600' : 'text-red-600'
      )}>
        {trend >= 0 ? '+' : ''}{trend.toFixed(2)}%
      </span>
    )}
  </button>
);

// History row
const HistoryRow: React.FC<{
  date: string;
  value: number;
  change: number;
  onClick?: () => void;
}> = ({ date, value, change, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between py-2 px-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0"
  >
    <span className="text-sm font-mono">{date}</span>
    <div className="flex items-center gap-4">
      <span className="text-sm font-mono">{value.toLocaleString('sv-SE', { minimumFractionDigits: 2 })}</span>
      <span className={cn(
        'text-sm font-mono min-w-[60px] text-right',
        change >= 0 ? 'text-emerald-600' : 'text-red-600'
      )}>
        {change >= 0 ? '+' : ''}{change.toFixed(2)}%
      </span>
    </div>
  </button>
);

// Source item
const SourceItem: React.FC<{
  name: string;
  type: string;
  reliability: number;
  lastUpdate: string;
  onClick?: () => void;
}> = ({ name, type, reliability, lastUpdate, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 text-left"
  >
    <div className="flex items-center gap-3">
      <div className={cn(
        'w-2 h-2 rounded-full',
        reliability >= 80 ? 'bg-emerald-500' : reliability >= 60 ? 'bg-amber-500' : 'bg-red-500'
      )} />
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{type} · {lastUpdate}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono">{reliability}%</span>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </div>
  </button>
);

// Related index item
const RelatedItem: React.FC<{
  name: string;
  code: string;
  correlation: number;
  change: number;
  onClick?: () => void;
}> = ({ name, code, correlation, change, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 text-left"
  >
    <div>
      <p className="text-sm font-medium">{name}</p>
      <p className="text-xs text-muted-foreground font-mono">{code}</p>
    </div>
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-xs text-muted-foreground">Korrelation</p>
        <p className={cn(
          'text-sm font-mono',
          correlation >= 0.7 ? 'text-emerald-600' : correlation >= 0.4 ? 'text-amber-600' : 'text-muted-foreground'
        )}>
          {correlation.toFixed(2)}
        </p>
      </div>
      <span className={cn(
        'text-sm font-mono min-w-[50px] text-right',
        change >= 0 ? 'text-emerald-600' : 'text-red-600'
      )}>
        {change >= 0 ? '+' : ''}{change.toFixed(1)}%
      </span>
    </div>
  </button>
);

export const IndexDrilldown: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: IndexItem | null;
}> = ({ open, onOpenChange, item }) => {
  const navigate = useNavigate();
  
  if (!item) return null;

  const isPositive = item.change >= 0;
  const history = generateHistory(item.value, item.change);
  const extendedSparkData = history.map(h => h.value);

  // Mock related data
  const sources = [
    { name: 'Nasdaq Nordic', type: 'Officiell börsdata', reliability: 98, lastUpdate: 'Realtid' },
    { name: 'Bloomberg Terminal', type: 'Finansdataleverantör', reliability: 95, lastUpdate: '< 1 min' },
    { name: 'Reuters Eikon', type: 'Finansdataleverantör', reliability: 94, lastUpdate: '< 1 min' },
  ];

  const relatedIndices = [
    { name: 'OMX Stockholm 30', code: 'OMXS30', correlation: 0.92, change: 0.99 },
    { name: 'DAX', code: 'DAX', correlation: 0.78, change: -0.72 },
    { name: 'S&P 500', code: 'SPX', correlation: 0.65, change: -0.51 },
    { name: 'Euro Stoxx 50', code: 'SX5E', correlation: 0.81, change: 0.34 },
  ];

  const limitations = [
    'Historiska värden kan justeras retroaktivt',
    'Valutaomräkning påverkar jämförbarhet',
    'Index kan ha olika sammansättningsmetodik',
    'Tidsförskjutning mellan marknader',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {item.flag && <span className="text-2xl">{item.flag}</span>}
                <DialogTitle className="text-xl">{item.name}</DialogTitle>
                <span className="text-sm bg-muted px-2 py-0.5 rounded font-mono">{item.code}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-semibold">
                  {item.value.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <div className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded',
                  isPositive ? 'bg-emerald-500/20 text-emerald-600' : 'bg-red-500/20 text-red-600'
                )}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="font-mono font-medium">
                    {isPositive ? '+' : ''}{item.change.toFixed(2)}%
                  </span>
                </div>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1">
          <div className="px-6 border-b">
            <TabsList className="bg-transparent gap-4">
              <TabsTrigger value="overview" className="data-[state=active]:bg-muted">Översikt</TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-muted">Historik</TabsTrigger>
              <TabsTrigger value="sources" className="data-[state=active]:bg-muted">Källor</TabsTrigger>
              <TabsTrigger value="related" className="data-[state=active]:bg-muted">Relaterade</TabsTrigger>
              <TabsTrigger value="limits" className="data-[state=active]:bg-muted">Begränsningar</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[50vh]">
            <div className="p-6">
              {/* Overview Tab */}
              <TabsContent value="overview" className="m-0 space-y-6">
                {/* Chart */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">30 dagars utveckling</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40">
                      <MiniSparkline 
                        data={extendedSparkData} 
                        color={isPositive ? 'positive' : 'negative'}
                        height={150}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Key Metrics */}
                <div className="grid grid-cols-4 gap-3">
                  <MetricCard 
                    label="Daglig förändring" 
                    value={`${isPositive ? '+' : ''}${item.change.toFixed(2)}%`}
                    onClick={() => {}}
                  />
                  <MetricCard 
                    label="Vecka" 
                    value="+1.23%"
                    trend={1.23}
                    onClick={() => {}}
                  />
                  <MetricCard 
                    label="Månad" 
                    value="-0.45%"
                    trend={-0.45}
                    onClick={() => {}}
                  />
                  <MetricCard 
                    label="År (YTD)" 
                    value="+8.72%"
                    trend={8.72}
                    onClick={() => {}}
                  />
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <MetricCard 
                    label="Högsta (52v)" 
                    value={(item.value * 1.15).toLocaleString('sv-SE', { maximumFractionDigits: 2 })}
                    sublabel="2025-12-15"
                    onClick={() => {}}
                  />
                  <MetricCard 
                    label="Lägsta (52v)" 
                    value={(item.value * 0.85).toLocaleString('sv-SE', { maximumFractionDigits: 2 })}
                    sublabel="2025-03-12"
                    onClick={() => {}}
                  />
                  <MetricCard 
                    label="Volatilitet" 
                    value="18.3%"
                    sublabel="Annualiserad"
                    onClick={() => {}}
                  />
                  <MetricCard 
                    label="Korrelation λ" 
                    value="0.34"
                    sublabel="Lambda SE"
                    onClick={() => navigate('/gdm')}
                  />
                </div>

                {/* Quick info */}
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium mb-1">Om detta index</p>
                        <p className="text-xs text-muted-foreground">
                          {item.name} ({item.code}) är ett kapitalviktat index som mäter utvecklingen 
                          för de mest omsatta aktierna. Indexet uppdateras i realtid under börsens öppettider.
                        </p>
                        <button 
                          className="text-xs text-primary hover:underline mt-2 flex items-center gap-1"
                          onClick={() => navigate('/index?code=' + item.code)}
                        >
                          Fullständig indexbeskrivning
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="m-0">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Historiska värden</CardTitle>
                      <span className="text-xs text-muted-foreground">Klicka på rad för detaljer</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-4 px-3 py-2 bg-muted/50 text-xs text-muted-foreground font-medium border-b">
                      <span>Datum</span>
                      <span className="text-right">Stängning</span>
                      <span className="text-right">+/−%</span>
                      <span></span>
                    </div>
                    {history.slice().reverse().map((h, i) => (
                      <HistoryRow
                        key={i}
                        date={h.date}
                        value={h.value}
                        change={h.change}
                        onClick={() => {}}
                      />
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sources Tab */}
              <TabsContent value="sources" className="m-0 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Datakällor</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {sources.map((source, i) => (
                      <SourceItem
                        key={i}
                        {...source}
                        onClick={() => {}}
                      />
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Database className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium mb-1">Dataproveniens</p>
                        <p className="text-xs text-muted-foreground">
                          Primärkälla: Nasdaq Nordic (officiell börsoperatör). Data hämtas via 
                          realtids-API och valideras mot sekundärkällor för konsistens.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Related Tab */}
              <TabsContent value="related" className="m-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Relaterade index</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {relatedIndices.map((rel, i) => (
                      <RelatedItem
                        key={i}
                        {...rel}
                        onClick={() => {
                          onOpenChange(false);
                          navigate(`/index?code=${rel.code}`);
                        }}
                      />
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Limitations Tab */}
              <TabsContent value="limits" className="m-0 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Vad detta index INTE visar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {limitations.map((lim, i) => (
                      <button
                        key={i}
                        onClick={() => {}}
                        className="w-full text-left p-3 border rounded hover:bg-muted/50 transition-colors flex items-center gap-3"
                      >
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center text-xs font-medium">
                          {i + 1}
                        </span>
                        <span className="text-sm">{lim}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                      </button>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-amber-500/50 bg-amber-500/5">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">
                      <strong>Epistemisk varning:</strong> Indexvärden representerar marknadspriser, 
                      inte underliggande ekonomisk verklighet. Kortsiktiga rörelser kan vara brus.
                      Jämförelser mellan olika index kräver förståelse för sammansättningsmetodik.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default IndexDrilldown;
