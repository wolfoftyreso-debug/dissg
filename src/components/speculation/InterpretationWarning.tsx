/**
 * 🛑 BLOCK 51 — INTERPRETATION WARNING
 * 
 * Anti-misuse flagging for:
 * - Cherry-picking (too short time intervals)
 * - Missing baselines
 * - Incompatible method comparisons
 * - Exaggerated correlations
 * 
 * Displayed as:
 * ⚠ Interpretation warning: [specific issue]
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import {
  type InterpretationWarning as WarningType,
  type WarningType as WarningCategory,
  WARNING_DEFINITIONS,
} from '@/config/zeroSpeculationConfig';

interface InterpretationWarningProps {
  warnings: WarningType[];
  className?: string;
  showTechnicalDetails?: boolean;
}

const SEVERITY_STYLES = {
  info: {
    container: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    icon: Info,
    iconColor: 'text-blue-500',
    text: 'text-blue-800 dark:text-blue-200',
  },
  warning: {
    container: 'bg-status-warning/10 border-status-warning/30',
    icon: AlertTriangle,
    iconColor: 'text-status-warning',
    text: 'text-status-warning',
  },
  critical: {
    container: 'bg-status-critical/10 border-status-critical/30',
    icon: AlertCircle,
    iconColor: 'text-status-critical',
    text: 'text-status-critical',
  },
};

/**
 * Single Warning Item
 */
function WarningItem({ 
  warning, 
  showTechnicalDetails 
}: { 
  warning: WarningType; 
  showTechnicalDetails: boolean;
}) {
  const style = SEVERITY_STYLES[warning.severity];
  const Icon = style.icon;

  return (
    <div className={cn(
      'flex items-start gap-3 p-3 rounded border',
      style.container
    )}>
      <Icon className={cn('h-4 w-4 mt-0.5 flex-shrink-0', style.iconColor)} />
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium', style.text)}>
          Interpretation warning
        </p>
        <p className="text-sm text-foreground/80 mt-1">
          {warning.message}
        </p>
        {showTechnicalDetails && warning.technicalDetail && (
          <p className="text-xs text-muted-foreground mt-2 font-mono">
            {warning.technicalDetail}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Interpretation Warning Component
 * 
 * Displays anti-misuse warnings when data interpretation risks exist.
 */
export function InterpretationWarning({ 
  warnings, 
  className,
  showTechnicalDetails = false 
}: InterpretationWarningProps) {
  if (warnings.length === 0) return null;

  // Sort by severity (critical first)
  const sortedWarnings = [...warnings].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className={cn('space-y-2', className)}>
      {sortedWarnings.map((warning, index) => (
        <WarningItem 
          key={`${warning.type}-${index}`}
          warning={warning}
          showTechnicalDetails={showTechnicalDetails}
        />
      ))}
    </div>
  );
}

/**
 * Create a warning from type
 */
export function createWarning(
  type: WarningCategory,
  technicalDetail?: string
): WarningType {
  return {
    ...WARNING_DEFINITIONS[type],
    technicalDetail,
  };
}

/**
 * Quick warning for cherry-picking detection
 */
export function CherryPickingWarning({ 
  periodMonths,
  availableMonths,
  className 
}: { 
  periodMonths: number;
  availableMonths: number;
  className?: string;
}) {
  // Flag if showing less than 30% of available data
  const ratio = periodMonths / availableMonths;
  if (ratio > 0.3) return null;

  return (
    <InterpretationWarning
      warnings={[createWarning(
        'cherry_picking',
        `Showing ${periodMonths} of ${availableMonths} available months (${(ratio * 100).toFixed(0)}%)`
      )]}
      className={className}
      showTechnicalDetails
    />
  );
}

/**
 * Warning banner for incomplete context
 */
export function IncompleteContextBanner({ className }: { className?: string }) {
  return (
    <div className={cn(
      'flex items-center gap-2 px-4 py-2 bg-status-warning/10 border border-status-warning/30 rounded text-sm',
      className
    )}>
      <AlertTriangle className="h-4 w-4 text-status-warning flex-shrink-0" />
      <span className="text-status-warning font-medium">
        Interpretation warning: incomplete context
      </span>
    </div>
  );
}

export default InterpretationWarning;
