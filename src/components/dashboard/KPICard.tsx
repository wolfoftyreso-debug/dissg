import { KPI } from '@/types/kpi';
import { StatusBadge } from './StatusBadge';
import { TrendIndicator } from './TrendIndicator';
import { Sparkline } from './Sparkline';
import { ConfidenceBar } from './ConfidenceBar';
import { cn } from '@/lib/utils';
import { AlertTriangle, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface KPICardProps {
  kpi: KPI;
  onClick?: () => void;
}

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

// Get confidence level label and styling
function getConfidenceLevel(confidence: number): { 
  label: string; 
  description: string;
  Icon: typeof ShieldCheck;
  className: string;
} {
  if (confidence >= 90) {
    return {
      label: 'Hög',
      description: 'Verifierad data från officiella källor med full täckning',
      Icon: ShieldCheck,
      className: 'text-status-positive'
    };
  }
  if (confidence >= 70) {
    return {
      label: 'Medel',
      description: 'Data från pålitliga källor, viss osäkerhet kan förekomma',
      Icon: Shield,
      className: 'text-status-warning'
    };
  }
  return {
    label: 'Låg',
    description: 'Preliminär eller ofullständig data, tolka med försiktighet',
    Icon: ShieldAlert,
    className: 'text-status-critical'
  };
}

export function KPICard({ kpi, onClick }: KPICardProps) {
  const sparklineData = generateSparklineData(kpi.value, kpi.trend, kpi.trendPercent);
  const isCritical = kpi.status === 'critical';
  const hasActiveWarning = isCritical && kpi.redFlags.length > 0;
  const confidenceLevel = getConfidenceLevel(kpi.confidence);
  const ConfidenceIcon = confidenceLevel.Icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex w-full flex-col gap-2 rounded-sm border bg-card p-3 text-left transition-all',
        'hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
        isCritical 
          ? 'border-status-critical/40 bg-status-critical/[0.02]' 
          : 'border-border'
      )}
    >
      {/* Top row: Name and Status */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-tight text-foreground">
          {kpi.name}
        </h3>
        <StatusBadge status={kpi.status} compact />
      </div>

      {/* Middle: Value and Sparkline */}
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <span className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">
            {typeof kpi.value === 'number' && kpi.value >= 1000 
              ? kpi.value.toLocaleString('sv-SE') 
              : typeof kpi.value === 'number' 
                ? kpi.value.toFixed(1)
                : kpi.value}
          </span>
          <span className="ml-1 text-xs text-muted-foreground">{kpi.unit}</span>
        </div>
        <Sparkline 
          data={sparklineData} 
          status={kpi.status}
          width={52}
          height={20}
        />
      </div>

      {/* Bottom: Trend + Confidence + Warning */}
      <div className="flex items-center justify-between border-t border-border pt-2">
        <div className="flex items-center gap-3">
          <TrendIndicator
            direction={kpi.trend}
            percent={kpi.trendPercent}
            inverted={kpi.inverted}
            compact
          />
          
          {/* Confidence indicator */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 cursor-help">
                <ConfidenceIcon className={cn('h-3.5 w-3.5', confidenceLevel.className)} />
                <span className={cn('text-[10px] font-medium', confidenceLevel.className)}>
                  {kpi.confidence}%
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <ConfidenceIcon className={cn('h-3.5 w-3.5', confidenceLevel.className)} />
                  Datakvalitet: {confidenceLevel.label}
                </div>
                <p className="text-xs text-muted-foreground">
                  {confidenceLevel.description}
                </p>
                <ConfidenceBar value={kpi.confidence} className="mt-2" />
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
        
        {hasActiveWarning && (
          <div className="flex items-center gap-1 text-status-critical">
            <AlertTriangle className="h-3 w-3" />
            <span className="text-[10px] font-semibold uppercase tracking-wide">
              Varning
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
