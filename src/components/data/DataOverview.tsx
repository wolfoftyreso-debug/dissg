/**
 * Data Overview - Main dashboard with Avanza-inspired design
 * 
 * Shows live stats, trends, and quick navigation
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Mini sparkline component
export const MiniSparkline: React.FC<{ 
  data: number[]; 
  color?: 'positive' | 'negative' | 'neutral';
  height?: number;
}> = ({ data, color = 'neutral', height = 48 }) => {
  if (!data.length) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = height - ((v - min) / range) * (height - 8);
    return `${x},${y}`;
  }).join(' ');
  
  const colorClass = color === 'positive' 
    ? 'stroke-emerald-500' 
    : color === 'negative' 
    ? 'stroke-red-500' 
    : 'stroke-blue-500';
  
  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" style={{ height }}>
      <polyline
        points={points}
        fill="none"
        className={cn(colorClass, 'stroke-[2]')}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Index ticker item
const TickerItem: React.FC<{
  code: string;
  value: number;
  change: number;
  onClick?: () => void;
}> = ({ code, value, change, onClick }) => {
  const isPositive = change >= 0;
  
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-1 hover:bg-muted/50 transition-colors text-sm whitespace-nowrap"
    >
      <span className={cn(
        'font-mono text-xs px-1.5 py-0.5 rounded',
        isPositive ? 'bg-emerald-500/20 text-emerald-600' : 'bg-red-500/20 text-red-600'
      )}>
        {isPositive ? '↑' : '↓'}
      </span>
      <span className="font-medium">{code}</span>
      <span className="text-muted-foreground">{value.toFixed(1)}</span>
      <span className={cn(
        'font-mono',
        isPositive ? 'text-emerald-600' : 'text-red-600'
      )}>
        {isPositive ? '+' : ''}{change.toFixed(2)}%
      </span>
    </button>
  );
};

// Summary card with graph
const SummaryCard: React.FC<{
  title: string;
  value: string;
  subtitle?: string;
  change?: number;
  sparkData?: number[];
  onClick?: () => void;
}> = ({ title, value, subtitle, change, sparkData, onClick }) => {
  const isPositive = change && change >= 0;
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow group"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {title}
            </p>
            <p className={cn(
              'text-2xl font-semibold mt-1',
              change !== undefined && (isPositive ? 'text-emerald-600' : 'text-red-600')
            )}>
              {value}
            </p>
          </div>
          {change !== undefined && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{subtitle}</p>
              <p className={cn(
                'font-mono font-medium',
                isPositive ? 'text-emerald-600' : 'text-red-600'
              )}>
                {isPositive ? '+' : ''}{change.toFixed(2)}%
              </p>
            </div>
          )}
          <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">[→]</span>
        </div>
        {sparkData && (
          <MiniSparkline 
            data={sparkData} 
            color={isPositive ? 'positive' : change !== undefined ? 'negative' : 'neutral'}
          />
        )}
      </CardContent>
    </Card>
  );
};

// Indicator row with change
const IndicatorRow: React.FC<{
  name: string;
  value: string;
  change: number;
  isPositive?: boolean;
  onClick?: () => void;
}> = ({ name, value, change, isPositive, onClick }) => {
  const displayPositive = isPositive ?? change >= 0;
  
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between py-2.5 px-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0"
    >
      <div className="flex items-center gap-2">
        <span className={cn(
          'w-2 h-2 rounded-full',
          displayPositive ? 'bg-emerald-500' : 'bg-red-500'
        )} />
        <span className="text-sm">{name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{value}</span>
        <span className={cn(
          'font-mono text-sm min-w-[70px] text-right',
          displayPositive ? 'text-emerald-600' : 'text-red-600'
        )}>
          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
        </span>
      </div>
    </button>
  );
};

// Update item
const UpdateItem: React.FC<{
  indicator: string;
  title: string;
  summary: string;
  timestamp: string;
  onClick?: () => void;
}> = ({ indicator, title, summary, timestamp, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full text-left p-4 hover:bg-muted/50 transition-colors border-b border-border/50"
  >
    <div className="flex items-center gap-2 mb-1">
      <span className="text-sm font-medium text-primary">{indicator}</span>
      <span className="text-xs text-muted-foreground">{timestamp}</span>
    </div>
    <p className="font-medium mb-1">{title}</p>
    <p className="text-sm text-muted-foreground line-clamp-2">{summary}</p>
  </button>
);

// Generate mock sparkline data
const generateSparkData = (trend: number) => {
  const base = 50;
  return Array.from({ length: 20 }, (_, i) => 
    base + (Math.random() - 0.5) * 10 + (trend * i * 0.5)
  );
};

export const DataOverview: React.FC<{ className?: string }> = ({ className }) => {
  const navigate = useNavigate();

  // Fetch KPI data
  const { data: kpiData } = useQuery({
    queryKey: ['kpi-dashboard-summary'],
    queryFn: async () => {
      const { data: kpis } = await supabase
        .from('kpi_definitions')
        .select('id, code, name, category')
        .eq('is_active', true)
        .limit(50);
      
      return { kpis };
    }
  });

  // Aggregate by category for display
  const categoryMetrics = React.useMemo(() => {
    if (!kpiData?.kpis) return [];
    
    const categories = [
      { code: 'demografi_halsa', name: 'Demografi & Hälsa', trend: 0.8 },
      { code: 'ekonomisk_barkraft', name: 'Ekonomisk Bärkraft', trend: -1.2 },
      { code: 'social_stabilitet', name: 'Social Stabilitet', trend: -2.1 },
      { code: 'arbete_produktivitet', name: 'Arbete & Produktivitet', trend: 1.5 },
      { code: 'karnsystem_funktion', name: 'Systemfunktion', trend: -0.3 },
    ];
    
    return categories.map(cat => ({
      ...cat,
      count: kpiData.kpis?.filter(k => k.category === cat.code).length || 0,
      sparkData: generateSparkData(cat.trend)
    }));
  }, [kpiData]);

  // Best and worst performers
  const topPerformers = [
    { name: 'Sysselsättningsgrad', value: '78.2%', change: 2.3, isPositive: true },
    { name: 'Medellivslängd', value: '83.1 år', change: 0.4, isPositive: true },
    { name: 'BNP-tillväxt', value: '2.1%', change: 0.8, isPositive: true },
    { name: 'Energieffektivitet', value: '127 index', change: 3.2, isPositive: true },
  ];

  const worstPerformers = [
    { name: 'Vårdkötid', value: '127 dagar', change: 15.2, isPositive: false },
    { name: 'Skjutningar', value: '4.2/100k', change: 8.7, isPositive: false },
    { name: 'Boendesegregation', value: '42 index', change: 2.1, isPositive: false },
    { name: 'Lärarbrist', value: '18.3%', change: 4.6, isPositive: false },
  ];

  // Recent updates
  const recentUpdates = [
    {
      indicator: 'Fiskal migrationspåverkan',
      title: 'Ny data från SCB: Integrationsutfall Q4 2025',
      summary: 'Sysselsättningsgapet mellan inrikes och utrikes födda minskade med 1.2 procentenheter...',
      timestamp: 'Idag 14:30'
    },
    {
      indicator: 'Skjutningar',
      title: 'BRÅ-statistik visar nedgång i januari 2026',
      summary: 'Antalet bekräftade skjutningar minskade med 12% jämfört med samma period föregående år...',
      timestamp: 'Idag 09:15'
    },
    {
      indicator: 'Energiimport',
      title: 'Elkraftbalans: Nettoexport ökade under kall period',
      summary: 'Sverige exporterade 2.4 TWh el under januari trots högt inhemskt effektbehov...',
      timestamp: 'Igår 18:00'
    },
  ];

  // Index ticker data
  const tickerData = [
    { code: 'λ-SE', value: 0.94, change: -0.32 },
    { code: 'λ-EU', value: 0.91, change: -0.18 },
    { code: 'λ-GLOB', value: 0.87, change: -0.45 },
    { code: 'HDI-SE', value: 0.947, change: 0.12 },
    { code: 'GINI-SE', value: 28.8, change: 0.85 },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Top Ticker Bar */}
      <div className="border rounded-lg bg-muted/30 overflow-hidden">
        <div className="flex items-center overflow-x-auto scrollbar-hide">
          {tickerData.map((item) => (
            <TickerItem
              key={item.code}
              {...item}
              onClick={() => navigate(`/index?code=${item.code}`)}
            />
          ))}
          <button 
            className="px-4 py-1 text-sm text-primary hover:underline whitespace-nowrap"
            onClick={() => navigate('/index')}
          >
            Alla index →
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Just nu</h2>
          <p className="text-sm text-muted-foreground">Civilisatorisk systemstatus</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Summary Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Overview Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <SummaryCard
              title="Samhällsbalans idag"
              value="λ 0.94"
              subtitle="Förändring i år"
              change={-2.1}
              sparkData={generateSparkData(-0.5)}
              onClick={() => navigate('/gdm')}
            />
            <SummaryCard
              title="Systemhälsa (aggregat)"
              value="76.3 / 100"
              subtitle="Trend 12 mån"
              change={1.34}
              sparkData={generateSparkData(0.3)}
              onClick={() => navigate('/diagnostics')}
            />
          </div>

          {/* Best/Worst Today */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Bäst utveckling (12 mån)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {topPerformers.map((item, i) => (
                  <IndicatorRow
                    key={i}
                    {...item}
                    onClick={() => navigate('/index')}
                  />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Sämst utveckling (12 mån)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {worstPerformers.map((item, i) => (
                  <IndicatorRow
                    key={i}
                    {...item}
                    onClick={() => navigate('/index')}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Data Updates */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Senaste datauppdateringar</CardTitle>
                <span className="text-xs text-muted-foreground">Uppdaterad 15:42</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {recentUpdates.map((update, i) => (
                <UpdateItem
                  key={i}
                  {...update}
                  onClick={() => navigate('/index')}
                />
              ))}
              <button 
                className="w-full py-3 text-sm text-primary hover:underline"
                onClick={() => navigate('/diagnostics')}
              >
                Visa fler →
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Categories & Quick Access */}
        <div className="space-y-6">
          {/* Category Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Per domän</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {categoryMetrics.map((cat) => (
                <button
                  key={cat.code}
                  onClick={() => navigate(`/index?category=${cat.code}`)}
                  className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{cat.count} indikatorer</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16">
                      <MiniSparkline 
                        data={cat.sparkData} 
                        color={cat.trend >= 0 ? 'positive' : 'negative'}
                        height={24}
                      />
                    </div>
                    <span className={cn(
                      'font-mono text-sm min-w-[50px] text-right',
                      cat.trend >= 0 ? 'text-emerald-600' : 'text-red-600'
                    )}>
                      {cat.trend >= 0 ? '+' : ''}{cat.trend.toFixed(1)}%
                    </span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Lambda Insight */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <p className="text-sm font-medium mb-2">Lambda-insikt</p>
              <p className="text-xs text-muted-foreground mb-3">
                Aktuell systembalans: λ = 0.94 indikerar lätt suboptimal resursallokering 
                inom hälso- och integrationssektorn.
              </p>
              <button 
                onClick={() => navigate('/gdm')}
                className="text-xs text-primary hover:underline"
              >
                Öppna diagnostik →
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataOverview;
