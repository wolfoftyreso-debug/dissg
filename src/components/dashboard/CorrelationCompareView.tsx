/**
 * Side-by-side KPI comparison view for correlations
 * Shows two KPIs with their trends when a correlation is clicked
 */

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, TrendingUp, TrendingDown, Minus, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { KPI } from '@/types/kpi';
import { Sparkline } from './Sparkline';
import { cn } from '@/lib/utils';

interface Correlation {
  id: string;
  kpi1Id: string;
  kpi2Id: string;
  strength: number;
  lagMonths: number;
  confidence: number;
  description: string;
  isSignificant: boolean;
}

interface CorrelationCompareViewProps {
  correlation: Correlation;
  kpis: KPI[];
  onClose: () => void;
}

export function CorrelationCompareView({ correlation, kpis, onClose }: CorrelationCompareViewProps) {
  const kpi1 = kpis.find(k => k.id === correlation.kpi1Id);
  const kpi2 = kpis.find(k => k.id === correlation.kpi2Id);

  // Generate mock historical data for visualization
  const generateMockData = (kpi: KPI) => {
    const baseValue = kpi.value;
    const volatility = Math.abs(kpi.trendPercent) / 100 + 0.02;
    return Array.from({ length: 12 }, (_, i) => {
      const variation = (Math.random() - 0.5) * baseValue * volatility;
      const trendEffect = kpi.trend === 'up' 
        ? (i / 12) * baseValue * 0.1 
        : kpi.trend === 'down' 
          ? -(i / 12) * baseValue * 0.1 
          : 0;
      return baseValue - trendEffect + variation;
    });
  };

  const data1 = useMemo(() => kpi1 ? generateMockData(kpi1) : [], [kpi1?.id]);
  const data2 = useMemo(() => kpi2 ? generateMockData(kpi2) : [], [kpi2?.id]);

  if (!kpi1 || !kpi2) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive': return 'text-status-positive bg-status-positive/10';
      case 'warning': return 'text-status-warning bg-status-warning/10';
      case 'critical': return 'text-status-critical bg-status-critical/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4" />;
      case 'down': return <TrendingDown className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const getCorrelationColor = (strength: number) => {
    if (strength >= 0.7) return 'text-status-positive';
    if (strength <= -0.7) return 'text-status-critical';
    if (Math.abs(strength) >= 0.4) return 'text-status-warning';
    return 'text-muted-foreground';
  };

  const getSparklineStatus = (status: string): 'positive' | 'warning' | 'critical' | 'neutral' => {
    switch (status) {
      case 'positive': return 'positive';
      case 'warning': return 'warning';
      case 'critical': return 'critical';
      default: return 'neutral';
    }
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Jämförelse: Korrelerade KPI:er
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Correlation info banner */}
        <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-muted/50">
          <AlertTriangle className="h-4 w-4 text-status-warning shrink-0" />
          <span className="text-xs text-muted-foreground">
            Korrelation observerad, kausalitet ej fastställd. Styrka: 
            <span className={cn("font-mono font-bold ml-1", getCorrelationColor(correlation.strength))}>
              {correlation.strength > 0 ? '+' : ''}{correlation.strength.toFixed(2)}
            </span>
          </span>
          <Badge variant="outline" className="text-xs ml-auto gap-1">
            <Clock className="h-3 w-3" />
            {correlation.lagMonths} mån fördröjning
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6 relative">
          {/* KPI 1 */}
          <div className="space-y-3 p-4 rounded-lg border bg-card">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">Ledande indikator</Badge>
              <Badge className={getStatusColor(kpi1.status)}>{kpi1.status}</Badge>
            </div>
            
            <h3 className="font-semibold text-lg">{kpi1.name}</h3>
            
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums">
                {kpi1.value.toLocaleString('sv-SE')}
              </span>
              <span className="text-muted-foreground">{kpi1.unit}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-1 text-sm",
                kpi1.trend === 'up' 
                  ? (kpi1.inverted ? 'text-status-critical' : 'text-status-positive')
                  : kpi1.trend === 'down'
                    ? (kpi1.inverted ? 'text-status-positive' : 'text-status-critical')
                    : 'text-muted-foreground'
              )}>
                {getTrendIcon(kpi1.trend)}
                <span>{kpi1.trendPercent > 0 ? '+' : ''}{kpi1.trendPercent.toFixed(1)}%</span>
              </div>
              <span className="text-xs text-muted-foreground">senaste 12 mån</span>
            </div>
            
            <div className="h-20 mt-4">
              <Sparkline 
                data={data1} 
                status={getSparklineStatus(kpi1.status)}
                height={80}
                width={300}
              />
            </div>
            
            <p className="text-xs text-muted-foreground line-clamp-2">{kpi1.description}</p>
          </div>

          {/* Divider with arrow - centered between cards */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="p-2 rounded-full bg-primary text-primary-foreground shadow-lg">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>

          {/* KPI 2 */}
          <div className="space-y-3 p-4 rounded-lg border bg-card">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">Efterföljande indikator</Badge>
              <Badge className={getStatusColor(kpi2.status)}>{kpi2.status}</Badge>
            </div>
            
            <h3 className="font-semibold text-lg">{kpi2.name}</h3>
            
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums">
                {kpi2.value.toLocaleString('sv-SE')}
              </span>
              <span className="text-muted-foreground">{kpi2.unit}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-1 text-sm",
                kpi2.trend === 'up' 
                  ? (kpi2.inverted ? 'text-status-critical' : 'text-status-positive')
                  : kpi2.trend === 'down'
                    ? (kpi2.inverted ? 'text-status-positive' : 'text-status-critical')
                    : 'text-muted-foreground'
              )}>
                {getTrendIcon(kpi2.trend)}
                <span>{kpi2.trendPercent > 0 ? '+' : ''}{kpi2.trendPercent.toFixed(1)}%</span>
              </div>
              <span className="text-xs text-muted-foreground">senaste 12 mån</span>
            </div>
            
            <div className="h-20 mt-4">
              <Sparkline 
                data={data2} 
                status={getSparklineStatus(kpi2.status)}
                height={80}
                width={300}
              />
            </div>
            
            <p className="text-xs text-muted-foreground line-clamp-2">{kpi2.description}</p>
          </div>
        </div>

        {/* Interpretation */}
        <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
          <h4 className="font-medium mb-2">Tolkning</h4>
          <p className="text-sm text-muted-foreground">{correlation.description}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span>Konfidens: <strong>{correlation.confidence}%</strong></span>
            <span>Signifikant: <strong>{correlation.isSignificant ? 'Ja' : 'Nej'}</strong></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
