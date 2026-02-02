import { KPI } from '@/types/kpi';
import { StatusBadge } from './StatusBadge';
import { ClearTrendIndicator } from './ClearTrendIndicator';
import { SimpleExplanationButton } from './SimpleExplanationButton';
import { Sparkline } from './Sparkline';
import { cn } from '@/lib/utils';
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getSimpleExplanation } from '@/config/simpleExplanations';

interface ClearKPICardProps {
  kpi: KPI;
  onClick?: () => void;
}

/**
 * Crystal-clear KPI card following the "Supertydlighet" principles:
 * 1. No symbols without words
 * 2. Every change answers: What changed? Compared to what? Over what time?
 * 3. Absolute values vs changes are clearly separated
 * 4. "Förklara enkelt" button for plain-language explanation
 */

// Generate mock sparkline data based on current value and trend
function generateSparklineData(value: number, trend: string, percent: number): number[] {
  const points = 12;
  const data: number[] = [];
  
  let current = value;
  const changePerPoint = (value * (percent / 100)) / points;
  
  for (let i = 0; i < points; i++) {
    const noise = (Math.random() - 0.5) * changePerPoint * 0.5;
    data.unshift(current + noise);
    
    if (trend === 'up') {
      current -= changePerPoint;
    } else if (trend === 'down') {
      current += changePerPoint;
    } else {
      current += (Math.random() - 0.5) * changePerPoint;
    }
  }
  
  return data;
}

// Calculate the actual change between current and previous value
function calculateChange(current: number, previous: number, unit: string): { value: number; unit: string } {
  const diff = current - previous;
  
  // For percentage units, the change is in percentage points
  if (unit.includes('%')) {
    return { value: Math.abs(diff), unit: 'procentenheter' };
  }
  
  // For years
  if (unit === 'år') {
    return { value: Math.abs(diff), unit: 'år' };
  }
  
  // For days
  if (unit.includes('dagar')) {
    return { value: Math.abs(diff), unit: 'dagar' };
  }
  
  // For ratios
  if (unit.includes('/')) {
    return { value: Math.abs(diff), unit: 'enheter' };
  }
  
  // For SEK
  if (unit.includes('SEK')) {
    return { value: Math.abs(diff), unit: 'SEK' };
  }
  
  // For index values
  if (unit.includes('index')) {
    return { value: Math.abs(diff), unit: 'indexenheter' };
  }
  
  // For per 100,000
  if (unit.includes('100 000') || unit.includes('100000')) {
    return { value: Math.abs(diff), unit: 'fall per 100 000' };
  }
  
  // Default
  return { value: Math.abs(diff), unit: unit };
}

// Get trend text with direction
function getTrendText(direction: 'up' | 'down' | 'stable', inverted?: boolean): string {
  const isPositive = inverted ? direction === 'down' : direction === 'up';
  const isNegative = inverted ? direction === 'up' : direction === 'down';
  
  if (direction === 'stable') return 'Stabil trend';
  if (isPositive) return 'Positiv utveckling';
  if (isNegative) return 'Negativ utveckling';
  return '';
}

export function ClearKPICard({ kpi, onClick }: ClearKPICardProps) {
  const sparklineData = generateSparklineData(kpi.value, kpi.trend, kpi.trendPercent);
  const isCritical = kpi.status === 'critical';
  const hasActiveWarning = isCritical && kpi.redFlags.length > 0;
  const explanation = getSimpleExplanation(kpi.id);
  const change = calculateChange(kpi.value, kpi.previousValue, kpi.unit);
  
  // Determine if this is a percentage type value (showing %)
  const isPercentageType = kpi.unit.includes('%');
  
  // Format value nicely
  const formattedValue = typeof kpi.value === 'number' && kpi.value >= 1000 
    ? kpi.value.toLocaleString('sv-SE') 
    : typeof kpi.value === 'number' 
      ? kpi.value.toFixed(1)
      : kpi.value;

  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex w-full flex-col gap-3 rounded-md border bg-card p-4 text-left transition-all',
        'hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
        isCritical 
          ? 'border-status-critical/40 bg-status-critical/[0.02]' 
          : 'border-border'
      )}
    >
      {/* Header: Icon, Name, Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <span className="text-xl shrink-0" title={explanation.oneLiner}>
            {explanation.icon}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold leading-tight text-foreground">
              {kpi.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {kpi.description}
            </p>
          </div>
        </div>
        <StatusBadge status={kpi.status} compact />
      </div>

      {/* Current Value Section - Clearly labeled as "NULÄGE" */}
      <div className="bg-muted/30 rounded-md p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          Nuläge
        </p>
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <span className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
              {formattedValue}
            </span>
            <span className="ml-1.5 text-sm text-muted-foreground">{kpi.unit}</span>
          </div>
          <Sparkline 
            data={sparklineData} 
            status={kpi.status}
            width={60}
            height={24}
          />
        </div>
      </div>

      {/* Change Section - Always with full context */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Förändring
        </p>
        <ClearTrendIndicator
          direction={kpi.trend}
          changeValue={change.value}
          changeUnit={change.unit}
          comparisonPeriod="samma period förra året"
          inverted={kpi.inverted}
        />
        
        {/* Long-term trend */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {kpi.trend === 'up' ? (
            <TrendingUp className="h-3 w-3" />
          ) : kpi.trend === 'down' ? (
            <TrendingDown className="h-3 w-3" />
          ) : (
            <Minus className="h-3 w-3" />
          )}
          <span>📉 Trend: {kpi.longTermTrend}</span>
        </div>
      </div>

      {/* Warning & Explain Simply */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        {hasActiveWarning ? (
          <div className="flex items-center gap-1.5 text-status-critical bg-status-critical/10 px-2 py-1 rounded">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">
              ⚠️ Kräver uppföljning
            </span>
          </div>
        ) : (
          <div />
        )}
        <SimpleExplanationButton
          kpiId={kpi.id}
          kpiName={kpi.name}
          currentTrend={kpi.trend}
          isInverted={kpi.inverted}
        />
      </div>
    </button>
  );
}
