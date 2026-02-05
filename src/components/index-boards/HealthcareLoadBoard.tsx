/**
 * HEALTHCARE LOAD BOARD
 * 
 * Index-first dashboard showing healthcare system load.
 * Click any index → opens relevant Decision Graphs.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  TrendingDown, 
  TrendingUp, 
  Clock,
  Users,
  MapPin,
  Calendar,
  ChevronRight,
  Info,
  Stethoscope,
} from "lucide-react";

interface LoadMetricProps {
  label: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  status: 'normal' | 'elevated' | 'critical';
  onClick?: () => void;
}

function LoadMetric({ label, value, subtext, icon: Icon, status, onClick }: LoadMetricProps) {
  const statusColors = {
    normal: 'bg-green-500/10 border-green-500/30 text-green-700',
    elevated: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700',
    critical: 'bg-red-500/10 border-red-500/30 text-red-700',
  };
  
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md border ${statusColors[status]}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            status === 'normal' ? 'bg-green-500/20' :
            status === 'elevated' ? 'bg-yellow-500/20' : 'bg-red-500/20'
          }`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs opacity-70 mt-1">{subtext}</p>
          </div>
          <ChevronRight className="h-4 w-4 opacity-50 shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}

interface RegionalComparisonProps {
  regions: { name: string; load: number; trend: 'up' | 'down' | 'stable' }[];
}

function RegionalComparison({ regions }: RegionalComparisonProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Regional Load
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {regions.map(region => (
          <div key={region.name} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>{region.name}</span>
              <span className="flex items-center gap-1">
                {region.load}%
                {region.trend === 'up' && <TrendingUp className="h-3 w-3 text-red-500" />}
                {region.trend === 'down' && <TrendingDown className="h-3 w-3 text-green-500" />}
              </span>
            </div>
            <Progress 
              value={region.load} 
              className={`h-2 ${
                region.load > 90 ? '[&>div]:bg-red-500' :
                region.load > 75 ? '[&>div]:bg-yellow-500' : ''
              }`}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

interface SeasonalPatternProps {
  data: { month: string; avgLoad: number }[];
}

function SeasonalPattern({ data }: SeasonalPatternProps) {
  const max = Math.max(...data.map(d => d.avgLoad));
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Seasonal Pattern
        </CardTitle>
        <CardDescription>Historical monthly average</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-1 h-24">
          {data.map(d => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full bg-primary/20 rounded-t"
                style={{ height: `${(d.avgLoad / max) * 80}px` }}
              />
              <span className="text-[10px] text-muted-foreground">{d.month}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Current month: historical high period
        </p>
      </CardContent>
    </Card>
  );
}

interface HealthcareLoadBoardProps {
  region?: string;
  onMetricClick?: (metricId: string) => void;
}

export function HealthcareLoadBoard({ region = 'Stockholm', onMetricClick }: HealthcareLoadBoardProps) {
  const metrics = [
    { id: 'load', label: 'Load Index', value: '87%', subtext: 'Above 85% threshold', icon: Activity, status: 'elevated' as const },
    { id: 'wait_time', label: 'Wait-time Pressure', value: '142 min', subtext: 'vs 95 min normal', icon: Clock, status: 'critical' as const },
    { id: 'stress', label: 'Regional Stress', value: 'Moderate', subtext: '3 of 8 regions elevated', icon: MapPin, status: 'elevated' as const },
    { id: 'seasonal', label: 'Seasonal Deviation', value: '+12%', subtext: 'vs historical average', icon: Calendar, status: 'elevated' as const },
  ];
  
  const regions = [
    { name: 'Stockholm City', load: 92, trend: 'up' as const },
    { name: 'Stockholm South', load: 87, trend: 'stable' as const },
    { name: 'Stockholm North', load: 78, trend: 'down' as const },
    { name: 'Stockholm West', load: 84, trend: 'up' as const },
  ];
  
  const seasonalData = [
    { month: 'J', avgLoad: 75 },
    { month: 'F', avgLoad: 82 },
    { month: 'M', avgLoad: 78 },
    { month: 'A', avgLoad: 70 },
    { month: 'M', avgLoad: 65 },
    { month: 'J', avgLoad: 60 },
    { month: 'J', avgLoad: 58 },
    { month: 'A', avgLoad: 62 },
    { month: 'S', avgLoad: 72 },
    { month: 'O', avgLoad: 78 },
    { month: 'N', avgLoad: 85 },
    { month: 'D', avgLoad: 88 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Healthcare Load Board
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {region} Region · Real-time indicators
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Info className="h-3 w-3" />
          Metrics only, no recommendations
        </Badge>
      </div>

      {/* Main Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(metric => (
          <LoadMetric
            key={metric.id}
            {...metric}
            onClick={() => onMetricClick?.(metric.id)}
          />
        ))}
      </div>

      {/* Detail Panels */}
      <div className="grid gap-4 lg:grid-cols-2">
        <RegionalComparison regions={regions} />
        <SeasonalPattern data={seasonalData} />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="gap-1">
          <Users className="h-3.5 w-3.5" />
          Capacity Planning Graph
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <Clock className="h-3.5 w-3.5" />
          Wait Time Analysis
        </Button>
        <Button variant="ghost" size="sm" className="ml-auto text-xs text-muted-foreground">
          View all metrics →
        </Button>
      </div>

      {/* Principle */}
      <p className="text-xs text-muted-foreground text-center pt-4 border-t">
        Load Index shows pressure · Decision Graph shows structure · You decide response
      </p>
    </div>
  );
}
