/**
 * 🛑 BLOCK 51 — DATA STATUS BAR
 * 
 * Every page must show this at the top.
 * User should understand the data situation in 2 seconds.
 * 
 * Shows:
 * - Data level (verified/observed/estimated/weak/missing)
 * - Uncertainty level
 * - Causality status
 * - Source openness
 */

import React from 'react';
import { cn } from '@/lib/utils';
import {
  type DataStatus,
  DATA_STATUS_LABELS,
  UNCERTAINTY_LABELS,
  CAUSALITY_LABELS,
  SOURCE_LABELS,
} from '@/config/zeroSpeculationConfig';

interface DataStatusBarProps {
  status: DataStatus;
  className?: string;
  compact?: boolean;
}

/**
 * Data Status Bar
 * 
 * Displays current data quality status at a glance.
 * Must be visible at top of every data page.
 */
export function DataStatusBar({ status, className, compact = false }: DataStatusBarProps) {
  const dataLabel = DATA_STATUS_LABELS[status.dataLevel];
  const uncertaintyLabel = UNCERTAINTY_LABELS[status.uncertainty];
  const causalityLabel = CAUSALITY_LABELS[status.causality];
  const sourceLabel = SOURCE_LABELS[status.sourceOpenness];

  if (compact) {
    return (
      <div className={cn(
        'flex flex-wrap items-center gap-3 text-xs font-mono',
        'bg-muted/50 border border-border rounded px-3 py-2',
        className
      )}>
        <span className={dataLabel.className}>{dataLabel.icon} {status.dataLevel}</span>
        <span className="text-muted-foreground/50">•</span>
        <span className={uncertaintyLabel.className}>{uncertaintyLabel.icon} {status.uncertainty} uncertainty</span>
        <span className="text-muted-foreground/50">•</span>
        <span className={causalityLabel.className}>{causalityLabel.icon} {status.causality === 'none' ? 'no causation' : status.causality}</span>
      </div>
    );
  }

  return (
    <div className={cn(
      'bg-card border border-border rounded-lg p-4',
      className
    )}>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Data Status
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Data Level */}
        <div className="flex items-center gap-2">
          <span className={cn('text-sm', dataLabel.className)}>
            {dataLabel.icon}
          </span>
          <span className="text-sm text-foreground">
            {dataLabel.text}
          </span>
        </div>

        {/* Uncertainty */}
        <div className="flex items-center gap-2">
          <span className={cn('text-sm', uncertaintyLabel.className)}>
            {uncertaintyLabel.icon}
          </span>
          <span className="text-sm text-foreground">
            {uncertaintyLabel.text}
          </span>
        </div>

        {/* Causality */}
        <div className="flex items-center gap-2">
          <span className={cn('text-sm', causalityLabel.className)}>
            {causalityLabel.icon}
          </span>
          <span className="text-sm text-foreground">
            {causalityLabel.text}
          </span>
        </div>

        {/* Source Openness */}
        <div className="flex items-center gap-2">
          <span className={cn('text-sm', sourceLabel.className)}>
            {sourceLabel.icon}
          </span>
          <span className="text-sm text-foreground">
            {sourceLabel.text}
          </span>
        </div>
      </div>

      {/* Custom Warnings */}
      {status.customWarnings && status.customWarnings.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          {status.customWarnings.map((warning, index) => (
            <div key={index} className="flex items-start gap-2 text-sm text-status-warning">
              <span>⚠</span>
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DataStatusBar;
