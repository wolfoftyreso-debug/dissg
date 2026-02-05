/**
 * DATA VIEW COMPONENT
 * 
 * Visualization component for individual decision nodes.
 * Supports: Line charts, histograms, comparisons, correlations, signals.
 * 
 * Displays DATA only. No interpretations or recommendations.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, GitCompare, Activity, AlertTriangle } from "lucide-react";

interface DataPoint {
  label: string;
  value: number;
  meta?: Record<string, unknown>;
}

interface DataViewProps {
  nodeId: string;
  question: string;
  answerType: string;
  summary: string;
  confidence: number;
  data: {
    trend?: DataPoint[];
    distribution?: DataPoint[];
    comparison?: DataPoint[];
    correlation?: { x: string; y: string; value: number }[];
    signal?: DataPoint[];
  };
  limitations: string[];
  sources: number;
  freshnessDays: number;
}

export function DataView({
  nodeId: _nodeId,
  question,
  answerType: _answerType,
  summary,
  confidence,
  data,
  limitations,
  sources,
  freshnessDays,
}: DataViewProps) {
  const availableViews = [
    data.trend && 'trend',
    data.distribution && 'distribution',
    data.comparison && 'comparison',
    data.correlation && 'correlation',
    data.signal && 'signal',
  ].filter(Boolean) as string[];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg">{question}</CardTitle>
            <CardDescription className="mt-2">{summary}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={confidence >= 0.7 ? 'default' : 'secondary'}>
              {Math.round(confidence * 100)}% confidence
            </Badge>
            <span className="text-xs text-muted-foreground">
              {sources} sources · {freshnessDays}d old
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {availableViews.length > 0 ? (
          <Tabs defaultValue={availableViews[0]} className="w-full">
            <TabsList className="mb-4">
              {data.trend && (
                <TabsTrigger value="trend" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trend
                </TabsTrigger>
              )}
              {data.distribution && (
                <TabsTrigger value="distribution" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Distribution
                </TabsTrigger>
              )}
              {data.comparison && (
                <TabsTrigger value="comparison" className="gap-2">
                  <GitCompare className="h-4 w-4" />
                  Comparison
                </TabsTrigger>
              )}
              {data.signal && (
                <TabsTrigger value="signal" className="gap-2">
                  <Activity className="h-4 w-4" />
                  Signal
                </TabsTrigger>
              )}
            </TabsList>
            
            {data.trend && (
              <TabsContent value="trend">
                <TrendChart data={data.trend} />
              </TabsContent>
            )}
            {data.distribution && (
              <TabsContent value="distribution">
                <DistributionChart data={data.distribution} />
              </TabsContent>
            )}
            {data.comparison && (
              <TabsContent value="comparison">
                <ComparisonChart data={data.comparison} />
              </TabsContent>
            )}
            {data.signal && (
              <TabsContent value="signal">
                <SignalChart data={data.signal} />
              </TabsContent>
            )}
          </Tabs>
        ) : (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            No visualization available for this data type
          </div>
        )}
        
        {/* Limitations */}
        {limitations.length > 0 && (
          <div className="mt-6 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-yellow-700">
              <AlertTriangle className="h-4 w-4" />
              Limitations
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {limitations.map((limitation, i) => (
                <li key={i}>• {limitation}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Placeholder chart components - would integrate with Recharts
function TrendChart({ data }: { data: DataPoint[] }) {
  return (
    <div className="h-64 rounded-lg border bg-muted/20 p-4">
      <div className="mb-2 text-sm font-medium">Trend Over Time</div>
      <div className="flex h-48 items-end gap-1">
        {data.map((point, i) => (
          <div key={i} className="flex flex-1 flex-col items-center">
            <div
              className="w-full bg-primary/80 rounded-t"
              style={{ height: `${(point.value / Math.max(...data.map(d => d.value))) * 100}%` }}
            />
            <span className="mt-1 text-xs text-muted-foreground">{point.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DistributionChart({ data }: { data: DataPoint[] }) {
  return (
    <div className="h-64 rounded-lg border bg-muted/20 p-4">
      <div className="mb-2 text-sm font-medium">Distribution</div>
      <div className="flex h-48 items-end gap-1">
        {data.map((point, i) => (
          <div key={i} className="flex flex-1 flex-col items-center">
            <div
              className="w-full bg-secondary rounded-t"
              style={{ height: `${(point.value / Math.max(...data.map(d => d.value))) * 100}%` }}
            />
            <span className="mt-1 text-xs text-muted-foreground">{point.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonChart({ data }: { data: DataPoint[] }) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
      <div className="text-sm font-medium">Comparison</div>
      {data.map((point, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{point.label}</span>
            <span className="font-medium">{point.value}</span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${(point.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function SignalChart({ data }: { data: DataPoint[] }) {
  return (
    <div className="h-64 rounded-lg border bg-muted/20 p-4">
      <div className="mb-2 text-sm font-medium">Signal Activity</div>
      <div className="flex h-12 items-center gap-0.5">
        {data.map((point, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-primary/60"
            style={{ height: `${Math.min(point.value, 100)}%` }}
            title={`${point.label}: ${point.value}`}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

export default DataView;
