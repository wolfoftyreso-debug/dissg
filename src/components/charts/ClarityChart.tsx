/**
 * Clarity Chart Component
 * 
 * A graph must be understood correctly in 3 seconds –
 * and fully explained in 3 clicks.
 * 
 * Implements all GRAPH_RULES from extremeClarityVisuals
 */

import { useState, useMemo } from 'react';
import { 
  Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine, Area, ComposedChart 
} from 'recharts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Info, Database, AlertTriangle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  GRAPH_DEPTH_LEVELS,
  validateGraphQuality,
} from '@/config/extremeClarityVisuals';

// ============================================
// TYPES
// ============================================

interface DataPoint {
  period: string;
  value: number;
  uncertainty?: [number, number]; // [lower, upper]
  isEstimate?: boolean;
}

interface ChartMarker {
  period: string;
  label: string;
  type: 'policy' | 'dataChange' | 'trendShift' | 'methodChange';
}

interface ChartDepth {
  explanation: {
    whatIsMeasured: string;
    comparedToWhat: string;
  };
  method: {
    sources: string[];
    aggregation: string;
    timeResolution: string;
  };
  limitations: string[];
  rawData: {
    apiEndpoint?: string;
    downloadUrl?: string;
    lastUpdated: string;
  };
}

interface ClarityChartProps {
  // The ONE question this graph answers
  question: string;
  questionSv: string;
  
  // Data
  data: DataPoint[];
  comparisonData?: DataPoint[];
  comparisonLabel?: string;
  
  // Metadata
  unit: string;
  definition: string;
  depth: ChartDepth;
  
  // Optional
  markers?: ChartMarker[];
  showUncertainty?: boolean;
  baseline?: number;
  baselineLabel?: string;
  
  className?: string;
}

// ============================================
// MARKER TYPE COLORS (Factual only)
// ============================================

const MARKER_COLORS: Record<ChartMarker['type'], string> = {
  policy: 'hsl(var(--primary))',
  dataChange: 'hsl(var(--status-warning))',
  trendShift: 'hsl(var(--accent))',
  methodChange: 'hsl(var(--secondary))',
};

// ============================================
// MAIN COMPONENT
// ============================================

export function ClarityChart({
  question,
  questionSv,
  data,
  comparisonData,
  comparisonLabel,
  unit,
  definition,
  depth,
  markers = [],
  showUncertainty = false,
  baseline,
  baselineLabel,
  className,
}: ClarityChartProps) {
  const [depthLevel, setDepthLevel] = useState<1 | 2 | 3 | 4 | null>(null);
  const [showLimitations, setShowLimitations] = useState(false);

  // Combine data with comparison if available
  const chartData = useMemo(() => {
    return data.map((d, i) => ({
      ...d,
      comparison: comparisonData?.[i]?.value,
      uncertaintyLower: d.uncertainty?.[0],
      uncertaintyUpper: d.uncertainty?.[1],
    }));
  }, [data, comparisonData]);

  // Quality validation
  const quality = useMemo(() => validateGraphQuality({
    hasDefinition: !!definition,
    hasComparison: !!comparisonData || !!baseline,
    hasUncertainty: showUncertainty || data.some(d => d.uncertainty),
    hasLimitations: depth.limitations.length > 0,
    hasSingleQuestion: true, // Enforced by component design
    hasClickDepth: true, // Built into component
  }), [definition, comparisonData, baseline, showUncertainty, data, depth.limitations]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Question header - the ONE question this answers */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{questionSv}</h3>
        <button 
          onClick={() => setDepthLevel(1)}
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          <Info className="h-3 w-3" />
          {definition}
        </button>
      </div>

      {/* The chart itself */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="period" 
              tick={{ fontSize: 11 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              tick={{ fontSize: 11 }}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(v) => `${v}${unit ? ` ${unit}` : ''}`}
            />
            <Tooltip content={<ClarityTooltip unit={unit} />} />

            {/* Uncertainty band */}
            {showUncertainty && (
              <Area
                type="monotone"
                dataKey="uncertaintyUpper"
                stroke="none"
                fill="hsl(var(--primary) / 0.1)"
                fillOpacity={1}
              />
            )}

            {/* Baseline reference */}
            {baseline !== undefined && (
              <ReferenceLine 
                y={baseline} 
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="5 5"
                label={{ 
                  value: baselineLabel || 'Baseline', 
                  position: 'right',
                  fontSize: 10,
                  fill: 'hsl(var(--muted-foreground))'
                }}
              />
            )}

            {/* Comparison line (gray) */}
            {comparisonData && (
              <Line
                type="monotone"
                dataKey="comparison"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1.5}
                dot={false}
                name={comparisonLabel}
              />
            )}

            {/* Main data line (color) */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5 }}
            />

            {/* Event markers */}
            {markers.map((marker, i) => (
              <ReferenceLine
                key={i}
                x={marker.period}
                stroke={MARKER_COLORS[marker.type]}
                strokeDasharray="3 3"
                label={{
                  value: '📍',
                  position: 'top',
                  fontSize: 12,
                }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Event markers legend */}
      {markers.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs">
          {markers.map((marker, i) => (
            <span 
              key={i}
              className="flex items-center gap-1 px-2 py-1 bg-muted rounded"
            >
              <span 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: MARKER_COLORS[marker.type] }}
              />
              {marker.label}
            </span>
          ))}
        </div>
      )}

      {/* Depth controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {([1, 2, 3, 4] as const).map((level) => (
          <Button
            key={level}
            variant={depthLevel === level ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDepthLevel(depthLevel === level ? null : level)}
            className="text-xs"
          >
            {GRAPH_DEPTH_LEVELS[level].labelSv}
          </Button>
        ))}
      </div>

      {/* Limitations toggle (always visible) */}
      <button
        onClick={() => setShowLimitations(!showLimitations)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <AlertTriangle className="h-3 w-3" />
        Vad detta inte visar
        {showLimitations ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {showLimitations && (
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded space-y-1">
          {depth.limitations.map((lim, i) => (
            <p key={i}>• {lim}</p>
          ))}
        </div>
      )}

      {/* Depth dialog */}
      <Dialog open={depthLevel !== null} onOpenChange={() => setDepthLevel(null)}>
        <DialogContent>
          {depthLevel && (
            <ChartDepthView 
              level={depthLevel} 
              depth={depth}
              unit={unit}
              onChangeLevel={setDepthLevel}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================
// TOOLTIP
// ============================================

function ClarityTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-medium">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-muted-foreground">
          <span style={{ color: entry.stroke }}>{entry.name || 'Värde'}: </span>
          <span className="font-mono">{entry.value?.toFixed(1)}{unit}</span>
        </p>
      ))}
    </div>
  );
}

// ============================================
// DEPTH VIEW
// ============================================

interface ChartDepthViewProps {
  level: 1 | 2 | 3 | 4;
  depth: ChartDepth;
  unit: string;
  onChangeLevel: (level: 1 | 2 | 3 | 4) => void;
}

function ChartDepthView({ level, depth, unit, onChangeLevel }: ChartDepthViewProps) {
  const levelConfig = GRAPH_DEPTH_LEVELS[level];

  return (
    <>
      <DialogHeader>
        <DialogTitle>{levelConfig.labelSv}</DialogTitle>
      </DialogHeader>

      {/* Level tabs */}
      <div className="flex gap-1">
        {([1, 2, 3, 4] as const).map((l) => (
          <button
            key={l}
            onClick={() => onChangeLevel(l)}
            className={cn(
              'px-3 py-1 text-xs rounded transition-colors',
              l === level
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4 py-4">
        {level === 1 && (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Vad mäts?</p>
              <p className="text-sm">{depth.explanation.whatIsMeasured}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Jämfört med vad?</p>
              <p className="text-sm">{depth.explanation.comparedToWhat}</p>
            </div>
          </div>
        )}

        {level === 2 && (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Datakällor</p>
              <ul className="text-sm">
                {depth.method.sources.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Aggregering</p>
              <p className="text-sm">{depth.method.aggregation}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Tidsupplösning</p>
              <p className="text-sm">{depth.method.timeResolution}</p>
            </div>
          </div>
        )}

        {level === 3 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Begränsningar</p>
            {depth.limitations.map((lim, i) => (
              <p key={i} className="text-sm">• {lim}</p>
            ))}
          </div>
        )}

        {level === 4 && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Senast uppdaterad: {depth.rawData.lastUpdated}
            </p>
            <div className="grid gap-2">
              {depth.rawData.apiEndpoint && (
                <Button variant="outline" size="sm" className="justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  API: {depth.rawData.apiEndpoint}
                </Button>
              )}
              {depth.rawData.downloadUrl && (
                <Button variant="outline" size="sm" className="justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ladda ner data
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ============================================
// DEMO
// ============================================

export function ClarityChartDemo() {
  const demoData: DataPoint[] = [
    { period: '2020-Q1', value: 7.2, uncertainty: [6.8, 7.6] },
    { period: '2020-Q2', value: 9.1, uncertainty: [8.5, 9.7] },
    { period: '2020-Q3', value: 8.5, uncertainty: [8.0, 9.0] },
    { period: '2020-Q4', value: 8.3, uncertainty: [7.9, 8.7] },
    { period: '2021-Q1', value: 8.8, uncertainty: [8.3, 9.3] },
    { period: '2021-Q2', value: 8.2, uncertainty: [7.8, 8.6] },
    { period: '2021-Q3', value: 7.5, uncertainty: [7.1, 7.9] },
    { period: '2021-Q4', value: 7.1, uncertainty: [6.7, 7.5] },
  ];

  const comparisonData: DataPoint[] = [
    { period: '2020-Q1', value: 6.5 },
    { period: '2020-Q2', value: 7.8 },
    { period: '2020-Q3', value: 7.5 },
    { period: '2020-Q4', value: 7.3 },
    { period: '2021-Q1', value: 7.6 },
    { period: '2021-Q2', value: 7.2 },
    { period: '2021-Q3', value: 6.8 },
    { period: '2021-Q4', value: 6.5 },
  ];

  const markers: ChartMarker[] = [
    { period: '2020-Q2', label: 'Pandemiåtgärder infördes', type: 'policy' },
    { period: '2021-Q2', label: 'Återöppning', type: 'policy' },
  ];

  const depth: ChartDepth = {
    explanation: {
      whatIsMeasured: 'Andel av arbetskraften (15-74 år) som är arbetslös och aktivt söker arbete.',
      comparedToWhat: 'EU-genomsnitt för samma period. Grå linje visar EU:s genomsnitt.',
    },
    method: {
      sources: ['SCB Arbetskraftsundersökningen', 'Eurostat LFS'],
      aggregation: 'Kvartalsmedel, säsongsrensat',
      timeResolution: 'Kvartalsvis',
    },
    limitations: [
      'Inkluderar inte personer som gett upp jobbsökandet',
      'Deltidsarbetslöshet räknas inte',
      'Definitioner kan skilja något mellan länder',
      'Tidsfördröjning på 6-8 veckor i rapportering',
    ],
    rawData: {
      apiEndpoint: '/api/v1/unemployment/SE',
      downloadUrl: '/data/unemployment-se.csv',
      lastUpdated: '2024-01-15',
    },
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <ClarityChart
        question="How did unemployment change in Sweden 2020-2021?"
        questionSv="Hur förändrades arbetslösheten i Sverige 2020-2021?"
        data={demoData}
        comparisonData={comparisonData}
        comparisonLabel="EU-genomsnitt"
        unit="%"
        definition="Arbetslöshet enligt ILO-definition"
        depth={depth}
        markers={markers}
        showUncertainty
        baseline={7.0}
        baselineLabel="2019 nivå"
      />
    </div>
  );
}
