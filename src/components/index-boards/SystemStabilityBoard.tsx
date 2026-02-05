/**
 * SYSTEM STABILITY BOARD
 * 
 * Index-first dashboard showing system stability indicators.
 * Click any index → opens relevant Decision Graphs.
 * 
 * This shows "something is moving", NOT "what to do about it".
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle,
  ChevronRight,
  Info,
  BarChart3,
} from "lucide-react";

interface IndexCardProps {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  sparklineData?: number[];
  onClick?: () => void;
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 80;
    const y = 20 - ((v - min) / range) * 16;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg className="w-20 h-6" viewBox="0 0 80 24">
      <polyline
        points={points}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IndexCard({ name, value, change, trend, confidence, sparklineData, onClick }: IndexCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity;
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground';
  
  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{name}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{value.toFixed(1)}</span>
              <span className={`text-sm flex items-center gap-0.5 ${trendColor}`}>
                <TrendIcon className="h-3 w-3" />
                {change > 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
            </div>
          </div>
          {sparklineData && <Sparkline data={sparklineData} />}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Confidence</span>
            <Progress value={confidence * 100} className="h-1.5 w-16" />
            <span className="text-xs">{Math.round(confidence * 100)}%</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

interface SystemStabilityBoardProps {
  country?: string;
  onIndexClick?: (indexId: string) => void;
}

export function SystemStabilityBoard({ country = 'SE', onIndexClick }: SystemStabilityBoardProps) {
  // Mock data - in production this comes from API
  const indices = [
    { 
      id: 'stability',
      name: 'Stability Index', 
      value: 72.4, 
      change: -2.3, 
      trend: 'down' as const, 
      confidence: 0.84,
      sparklineData: [75, 74, 73, 74, 72, 71, 72, 73, 72, 71, 72, 72],
    },
    { 
      id: 'volatility',
      name: 'Volatility Index', 
      value: 18.7, 
      change: 5.2, 
      trend: 'up' as const, 
      confidence: 0.79,
      sparklineData: [15, 16, 17, 16, 18, 19, 18, 17, 18, 19, 18, 19],
    },
    { 
      id: 'event_frequency',
      name: 'Event Frequency', 
      value: 3.2, 
      change: 0.1, 
      trend: 'stable' as const, 
      confidence: 0.91,
      sparklineData: [3, 3, 4, 3, 3, 3, 4, 3, 3, 3, 3, 3],
    },
    { 
      id: 'confidence_drift',
      name: 'Confidence Drift', 
      value: -1.8, 
      change: -0.4, 
      trend: 'down' as const, 
      confidence: 0.76,
      sparklineData: [0, -1, -1, -1, -2, -2, -1, -2, -2, -2, -2, -2],
    },
  ];
  
  const alerts = [
    { level: 'warning', message: 'Volatility Index above 90th percentile historical range' },
    { level: 'info', message: 'Stability trend continues 3-month decline' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            System Stability Board
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {country} · Last updated 2 hours ago
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Info className="h-3 w-3" />
          Orientation, not advice
        </Badge>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <div 
              key={i}
              className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                alert.level === 'warning' 
                  ? 'bg-yellow-500/10 text-yellow-700 border border-yellow-500/30' 
                  : 'bg-blue-500/10 text-blue-700 border border-blue-500/30'
              }`}
            >
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{alert.message}</span>
              <Button variant="ghost" size="sm" className="ml-auto h-6 text-xs">
                View Graph
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Index Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {indices.map(index => (
          <IndexCard
            key={index.id}
            name={index.name}
            value={index.value}
            change={index.change}
            trend={index.trend}
            confidence={index.confidence}
            sparklineData={index.sparklineData}
            onClick={() => onIndexClick?.(index.id)}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="gap-1">
          <Activity className="h-3.5 w-3.5" />
          Open Stability Graph
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <TrendingUp className="h-3.5 w-3.5" />
          Compare Periods
        </Button>
        <Button variant="ghost" size="sm" className="ml-auto text-xs text-muted-foreground">
          What this shows →
        </Button>
      </div>

      {/* Principle reminder */}
      <p className="text-xs text-muted-foreground text-center pt-4 border-t">
        Index = "something is moving" · Decision Graph = "here's what we can measure"
      </p>
    </div>
  );
}
