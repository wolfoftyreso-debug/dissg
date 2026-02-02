/**
 * CORRELATION TIMELINE
 * All domains on same time axis - no interpretation
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { DOMAIN_CONFIGS, type CorrelationDomain } from '@/types/correlation';

interface Props {
  domains: CorrelationDomain[];
}

// Mock data for demonstration
const MOCK_TIMELINE_DATA = [
  { date: '2020-01', health: 100, policy: 20, economy: 100, sector: 100 },
  { date: '2020-03', health: 180, policy: 80, economy: 95, sector: 85 },
  { date: '2020-06', health: 120, policy: 60, economy: 88, sector: 90 },
  { date: '2020-09', health: 140, policy: 50, economy: 92, sector: 105 },
  { date: '2020-12', health: 200, policy: 70, economy: 94, sector: 120 },
  { date: '2021-03', health: 160, policy: 65, economy: 98, sector: 135 },
  { date: '2021-06', health: 80, policy: 40, economy: 102, sector: 145 },
  { date: '2021-09', health: 100, policy: 30, economy: 105, sector: 150 },
  { date: '2021-12', health: 150, policy: 35, economy: 104, sector: 148 },
  { date: '2022-03', health: 130, policy: 25, economy: 103, sector: 152 },
  { date: '2022-06', health: 70, policy: 15, economy: 101, sector: 155 },
];

const POLICY_EVENTS = [
  { date: '2020-03', label: 'Restrictions begin' },
  { date: '2021-01', label: 'Vaccination starts' },
  { date: '2022-02', label: 'Restrictions lifted' },
];

export function CorrelationTimeline({ domains }: Props) {
  const [timeRange, setTimeRange] = useState('all');

  const domainToDataKey: Record<CorrelationDomain, string> = {
    health_outcomes: 'health',
    policy_actions: 'policy',
    macro_economy: 'economy',
    sector_economics: 'sector',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tidslinje / Timeline</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="2020">2020</SelectItem>
            <SelectItem value="2021">2021</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {/* Disclaimer */}
        <div className="mb-4 p-3 bg-muted/50 rounded-lg text-sm">
          <p className="text-muted-foreground">
            This view shows variables on the same time axis. 
            <strong> Co-movement does not imply causation.</strong>
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-4">
          {domains.map(domain => (
            <div key={domain} className="flex items-center gap-2">
              <div 
                className="w-4 h-1 rounded"
                style={{ backgroundColor: DOMAIN_CONFIGS[domain].color }}
              />
              <span className="text-sm">{DOMAIN_CONFIGS[domain].nameSv}</span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_TIMELINE_DATA}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              
              {/* Policy event markers */}
              {POLICY_EVENTS.map(event => (
                <ReferenceLine
                  key={event.date}
                  x={event.date}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="3 3"
                  label={{ 
                    value: event.label, 
                    position: 'top',
                    fontSize: 10,
                    fill: 'hsl(var(--muted-foreground))',
                  }}
                />
              ))}

              {/* Domain lines */}
              {domains.map(domain => (
                <Line
                  key={domain}
                  type="monotone"
                  dataKey={domainToDataKey[domain]}
                  stroke={DOMAIN_CONFIGS[domain].color}
                  strokeWidth={2}
                  dot={false}
                  name={DOMAIN_CONFIGS[domain].nameSv}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Policy events legend */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Policy markers:</span>
          {POLICY_EVENTS.map(event => (
            <Badge key={event.date} variant="outline" className="text-xs">
              {event.date}: {event.label}
            </Badge>
          ))}
        </div>

        {/* What this shows / doesn't show */}
        <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-primary/5 rounded-lg">
            <p className="font-medium text-primary">What this shows:</p>
            <ul className="mt-1 text-muted-foreground">
              <li>• Time series on same axis</li>
              <li>• Simultaneous movements</li>
              <li>• Policy event markers</li>
            </ul>
          </div>
          <div className="p-3 bg-destructive/5 rounded-lg">
            <p className="font-medium text-destructive">What this does NOT show:</p>
            <ul className="mt-1 text-muted-foreground">
              <li>• Causation</li>
              <li>• Policy effectiveness</li>
              <li>• "Good" or "bad" outcomes</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
