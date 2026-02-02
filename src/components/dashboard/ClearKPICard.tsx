import { KPI } from '@/types/kpi';
import { StatusBadge } from './StatusBadge';
import { ClearTrendIndicator } from './ClearTrendIndicator';
import { SimpleExplanationButton } from './SimpleExplanationButton';
import { Sparkline } from './Sparkline';
import { ConfidenceBar } from './ConfidenceBar';
import { cn } from '@/lib/utils';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { getSimpleExplanation } from '@/config/simpleExplanations';
import { HowWeKnowLink } from '@/components/transparency/HowWeKnowSection';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ClearKPICardProps {
  kpi: KPI;
  onClick?: () => void;
}

// Get confidence level label and styling
function getConfidenceLevel(confidence: number): { 
  label: string; 
  shortLabel: string;
  description: string;
  Icon: typeof ShieldCheck;
  className: string;
  bgClassName: string;
} {
  if (confidence >= 90) {
    return {
      label: 'Hög datakvalitet',
      shortLabel: 'Hög',
      description: 'Verifierad data från officiella källor med full täckning',
      Icon: ShieldCheck,
      className: 'text-status-positive',
      bgClassName: 'bg-status-positive/10'
    };
  }
  if (confidence >= 70) {
    return {
      label: 'Medelhög datakvalitet',
      shortLabel: 'Medel',
      description: 'Data från pålitliga källor, viss osäkerhet kan förekomma',
      Icon: Shield,
      className: 'text-status-warning',
      bgClassName: 'bg-status-warning/10'
    };
  }
  return {
    label: 'Låg datakvalitet',
    shortLabel: 'Låg',
    description: 'Preliminär eller ofullständig data, tolka med försiktighet',
    Icon: ShieldAlert,
    className: 'text-status-critical',
    bgClassName: 'bg-status-critical/10'
  };
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

// Identify KPI type for special handling
function getKPIType(kpiId: string, unit: string): 'baseline_deviation' | 'percentage' | 'absolute' | 'per_capita' | 'time' | 'index' | 'ratio' | 'currency' {
  // Baseline deviation types (like excess mortality)
  if (kpiId === 'excess_mortality' || unit.includes('baslinjen') || unit.includes('över baslinjen')) {
    return 'baseline_deviation';
  }
  // Percentage of population
  if (unit.includes('%') && !unit.includes('baslinjen')) {
    return 'percentage';
  }
  // Per capita / per 100,000
  if (unit.includes('100 000') || unit.includes('100000') || unit.includes('per 100')) {
    return 'per_capita';
  }
  // Time duration
  if (unit.includes('dagar') || unit.includes('dag') || unit === 'dagar (brott→dom)' || unit.includes('median')) {
    return 'time';
  }
  // Index values
  if (unit.includes('index') || unit.includes('stabilitetsindex')) {
    return 'index';
  }
  // Ratio
  if (unit.includes('/') || unit.includes('försörjda')) {
    return 'ratio';
  }
  // Currency
  if (unit.includes('SEK')) {
    return 'currency';
  }
  // Default to absolute
  return 'absolute';
}

// Calculate the actual change between current and previous value with proper unit handling
function calculateChange(current: number, previous: number, unit: string, kpiId: string): { 
  value: number; 
  unit: string; 
  clarification?: string;
} {
  const diff = current - previous;
  const kpiType = getKPIType(kpiId, unit);
  
  switch (kpiType) {
    case 'baseline_deviation':
      return { 
        value: Math.abs(diff), 
        unit: 'procentenheter',
        clarification: 'Detta visar hur avvikelsen från det normala har förändrats – inte den totala dödligheten.'
      };
    case 'percentage':
      return { value: Math.abs(diff), unit: 'procentenheter' };
    case 'per_capita':
      return { value: Math.abs(diff), unit: 'fall per 100 000' };
    case 'time':
      return { value: Math.abs(Math.round(diff)), unit: 'dagar' };
    case 'index':
      return { value: Math.abs(Math.round(diff)), unit: 'indexenheter' };
    case 'ratio':
      return { value: Math.abs(diff), unit: 'enheter' };
    case 'currency':
      return { value: Math.abs(Math.round(diff)), unit: 'SEK' };
    default:
      return { value: Math.abs(diff), unit: unit };
  }
}

export function ClearKPICard({ kpi, onClick }: ClearKPICardProps) {
  const sparklineData = generateSparklineData(kpi.value, kpi.trend, kpi.trendPercent);
  const isCritical = kpi.status === 'critical';
  const hasActiveWarning = isCritical && kpi.redFlags.length > 0;
  const explanation = getSimpleExplanation(kpi.id);
  const change = calculateChange(kpi.value, kpi.previousValue, kpi.unit, kpi.id);
  const confidenceLevel = getConfidenceLevel(kpi.confidence);
  const ConfidenceIcon = confidenceLevel.Icon;
  
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
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Nuläge
          </p>
          {/* Confidence badge inline */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                'flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium cursor-help',
                confidenceLevel.bgClassName,
                confidenceLevel.className
              )}>
                <ConfidenceIcon className="h-3 w-3" />
                <span>{kpi.confidence}%</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-2">
                <div className="font-semibold flex items-center gap-1.5">
                  <ConfidenceIcon className={cn('h-4 w-4', confidenceLevel.className)} />
                  {confidenceLevel.label}
                </div>
                <p className="text-xs text-muted-foreground">
                  {confidenceLevel.description}
                </p>
                <ConfidenceBar value={kpi.confidence} className="mt-2" />
                <div className="text-xs text-muted-foreground pt-1 border-t">
                  <span className="font-medium">Källor:</span>{' '}
                  {kpi.dataSources.map(s => s.name).join(', ')}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
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
          clarification={change.clarification}
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

      {/* Warning & Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        {hasActiveWarning ? (
          <div className="flex items-center gap-1.5 text-status-critical bg-status-critical/10 px-2 py-1 rounded">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">
              ⚠️ Kräver uppföljning
            </span>
          </div>
        ) : (
          <HowWeKnowLink kpiId={kpi.id} kpiName={kpi.name} />
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
