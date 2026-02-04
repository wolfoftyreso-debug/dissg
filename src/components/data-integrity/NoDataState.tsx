/**
 * NO DATA STATE COMPONENT
 * 
 * Displays when data is not available from verified sources.
 * Follows system principle: "Silence over speculation"
 * 
 * NEVER show simulated, mock, or generated data.
 * Display this state instead.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface NoDataStateProps {
  title?: string;
  description?: string;
  reason?: 'no_source' | 'pending_verification' | 'insufficient_coverage' | 'api_unavailable';
  className?: string;
  compact?: boolean;
}

const REASON_MESSAGES = {
  no_source: {
    title: 'Ingen datakälla ansluten',
    description: 'Denna indikator kräver verifierade datakällor för att visa värden.'
  },
  pending_verification: {
    title: 'Väntar på verifiering',
    description: 'Data har mottagits men genomgår kvalitetskontroll.'
  },
  insufficient_coverage: {
    title: 'Otillräcklig täckning',
    description: 'Datatäckningen understiger minimikravet för visning.'
  },
  api_unavailable: {
    title: 'Datakälla otillgänglig',
    description: 'Extern datakälla svarar inte. Försök igen senare.'
  }
};

export function NoDataState({ 
  title, 
  description, 
  reason = 'no_source',
  className,
  compact = false
}: NoDataStateProps) {
  const messages = REASON_MESSAGES[reason];
  const displayTitle = title || messages.title;
  const displayDescription = description || messages.description;

  if (compact) {
    return (
      <div className={cn(
        "flex items-center gap-2 text-muted-foreground font-mono text-sm",
        className
      )}>
        <span className="text-amber-600 dark:text-amber-400">[—]</span>
        <span>{displayTitle}</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-6 text-center",
      "border border-dashed border-border rounded-lg bg-muted/20",
      className
    )}>
      <div className="text-3xl font-mono text-muted-foreground mb-2">—</div>
      <h3 className="font-semibold text-foreground mb-1">{displayTitle}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{displayDescription}</p>
      <div className="mt-3 text-xs font-mono text-amber-600 dark:text-amber-400">
        [DATA_UNAVAILABLE]
      </div>
    </div>
  );
}

/**
 * Placeholder value component - shows dash instead of fake numbers
 */
export function DataPlaceholder({ 
  label,
  unit,
  className 
}: { 
  label?: string;
  unit?: string;
  className?: string;
}) {
  return (
    <div className={cn("text-center", className)}>
      {label && <p className="text-xs text-muted-foreground mb-1">{label}</p>}
      <p className="font-mono text-lg text-muted-foreground">—</p>
      {unit && <p className="text-xs text-muted-foreground">{unit}</p>}
    </div>
  );
}

/**
 * Chart placeholder - for when time series data is unavailable
 */
export function ChartNoData({ 
  message = 'Historisk data ej tillgänglig',
  className 
}: { 
  message?: string;
  className?: string;
}) {
  return (
    <div className={cn(
      "flex items-center justify-center h-48",
      "border border-dashed border-border rounded-lg bg-muted/10",
      className
    )}>
      <div className="text-center">
        <div className="text-4xl font-mono text-muted-foreground/50 mb-2">📊</div>
        <p className="text-sm text-muted-foreground">{message}</p>
        <p className="text-xs font-mono text-amber-600 dark:text-amber-400 mt-1">
          [NO_TIME_SERIES]
        </p>
      </div>
    </div>
  );
}

/**
 * Stats row with proper "no data" handling
 */
export function StatsRow({ 
  stats,
  className 
}: { 
  stats: Array<{ label: string; value: number | null; unit?: string }>;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4", className)} style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
      {stats.map((stat, idx) => (
        <div key={idx} className="text-center p-2 rounded border border-border bg-card">
          <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
          <p className={cn(
            "font-mono text-lg",
            stat.value === null ? "text-muted-foreground" : "text-foreground"
          )}>
            {stat.value === null ? '—' : stat.value.toLocaleString('sv-SE')}
          </p>
          {stat.unit && stat.value !== null && (
            <p className="text-xs text-muted-foreground">{stat.unit}</p>
          )}
        </div>
      ))}
    </div>
  );
}
