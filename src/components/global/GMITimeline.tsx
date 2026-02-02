import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Zap,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface TimelineDataPoint {
  date: string;
  value: number;
  uncertainty?: number;
  isEstimated?: boolean;
}

interface GMITimelineProps {
  countryCode: string;
  countryName: string;
  data: TimelineDataPoint[];
  currentValue: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  acceleration: 'accelerating' | 'decelerating' | 'stable';
  comparisonData?: {
    label: string;
    data: TimelineDataPoint[];
    color: string;
  }[];
  className?: string;
}

export function GMITimeline({
  countryCode,
  countryName,
  data,
  currentValue,
  trend,
  trendPercent,
  acceleration,
  comparisonData,
  className,
}: GMITimelineProps) {
  const [timeRange, setTimeRange] = useState<'1y' | '3y' | '5y' | 'all'>('3y');
  const [showUncertainty, setShowUncertainty] = useState(true);

  const filterDataByRange = (d: TimelineDataPoint[]) => {
    const now = new Date();
    let cutoff: Date;
    
    switch (timeRange) {
      case '1y':
        cutoff = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case '3y':
        cutoff = new Date(now.setFullYear(now.getFullYear() - 3));
        break;
      case '5y':
        cutoff = new Date(now.setFullYear(now.getFullYear() - 5));
        break;
      default:
        return d;
    }
    
    return d.filter(point => new Date(point.date) >= cutoff);
  };

  const filteredData = filterDataByRange(data);

  // Prepare chart data with uncertainty bands
  const chartData = filteredData.map(point => ({
    date: point.date,
    value: point.value,
    upperBound: point.uncertainty ? point.value + point.uncertainty : point.value,
    lowerBound: point.uncertainty ? point.value - point.uncertainty : point.value,
    isEstimated: point.isEstimated,
    ...comparisonData?.reduce((acc, comp) => {
      const compPoint = filterDataByRange(comp.data).find(p => p.date === point.date);
      return { ...acc, [comp.label]: compPoint?.value };
    }, {}),
  }));

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getAccelerationBadge = () => {
    switch (acceleration) {
      case 'accelerating':
        return (
          <Badge className="bg-green-500/20 text-green-500">
            <Zap className="h-3 w-3 mr-1" />
            Accelererar
          </Badge>
        );
      case 'decelerating':
        return (
          <Badge className="bg-orange-500/20 text-orange-500">
            <Zap className="h-3 w-3 mr-1" />
            Bromsar
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Stabil takt
          </Badge>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              GMI Tidslinje — {countryName}
            </CardTitle>
            <CardDescription>
              Nivå, trend och acceleration över tid
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Current metrics */}
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-2xl font-bold">{currentValue.toFixed(1)}</span>
                {getTrendIcon()}
              </div>
              <div className="flex items-center gap-2 justify-end mt-1">
                <span className={`text-sm ${
                  trend === 'up' ? 'text-green-500' : 
                  trend === 'down' ? 'text-red-500' : 
                  'text-muted-foreground'
                }`}>
                  {trendPercent > 0 ? '+' : ''}{trendPercent.toFixed(1)}% (24 mån)
                </span>
                {getAccelerationBadge()}
              </div>
            </div>
          </div>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-2 mt-4">
          {(['1y', '3y', '5y', 'all'] as const).map(range => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range === 'all' ? 'Alla' : range.replace('y', ' år')}
            </Button>
          ))}
          
          <div className="flex-1" />
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUncertainty(!showUncertainty)}
          >
            {showUncertainty ? 'Dölj' : 'Visa'} osäkerhet
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('sv-SE', { 
                  year: '2-digit', 
                  month: 'short' 
                })}
                className="text-xs"
              />
              <YAxis 
                domain={['auto', 'auto']}
                className="text-xs"
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  
                  return (
                    <div className="bg-popover border rounded-lg p-3 shadow-lg">
                      <p className="font-medium mb-2">
                        {new Date(label).toLocaleDateString('sv-SE', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </p>
                      {payload.map((entry: any) => (
                        <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                          />
                          <span>{entry.dataKey}:</span>
                          <span className="font-mono font-medium">{entry.value?.toFixed(1)}</span>
                        </div>
                      ))}
                      {payload[0]?.payload?.isEstimated && (
                        <div className="flex items-center gap-1 text-xs text-yellow-500 mt-2">
                          <AlertTriangle className="h-3 w-3" />
                          Estimerat värde
                        </div>
                      )}
                    </div>
                  );
                }}
              />
              
              {/* Uncertainty band */}
              {showUncertainty && (
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  stroke="none"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                />
              )}
              
              {/* Main line */}
              <Line
                type="monotone"
                dataKey="value"
                name={countryCode}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              
              {/* Comparison lines */}
              {comparisonData?.map(comp => (
                <Line
                  key={comp.label}
                  type="monotone"
                  dataKey={comp.label}
                  name={comp.label}
                  stroke={comp.color}
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                />
              ))}
              
              {/* Reference line for current value */}
              <ReferenceLine
                y={currentValue}
                stroke="hsl(var(--primary))"
                strokeDasharray="3 3"
                strokeOpacity={0.5}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-primary" />
            <span>{countryCode}</span>
          </div>
          {comparisonData?.map(comp => (
            <div key={comp.label} className="flex items-center gap-2">
              <div 
                className="w-4 h-0.5" 
                style={{ backgroundColor: comp.color, borderStyle: 'dashed' }}
              />
              <span>{comp.label}</span>
            </div>
          ))}
          {showUncertainty && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-primary/20 rounded" />
              <span>Osäkerhetsintervall</span>
            </div>
          )}
        </div>

        {/* Interpretation */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg text-sm">
          <p className="text-muted-foreground">
            <strong className="text-foreground">Tolkning:</strong>{' '}
            {trend === 'up' && 'GMI förbättras'}
            {trend === 'down' && 'GMI försämras'}
            {trend === 'stable' && 'GMI är stabilt'}
            {' '}
            ({Math.abs(trendPercent).toFixed(1)}% över 24 månader)
            {acceleration === 'accelerating' && ' och förbättringen accelererar'}
            {acceleration === 'decelerating' && ' men takten avtar'}
            . Detta baseras på {data.filter(d => !d.isEstimated).length} faktiska och{' '}
            {data.filter(d => d.isEstimated).length} estimerade datapunkter.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
