/**
 * 🧠 BLOCK 52 — QUALITY GATE COMPONENT
 * 
 * Visual checklist for quality review.
 * Nothing goes live without passing these gates.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X, AlertTriangle } from 'lucide-react';
import { QUALITY_GATES, type QualityGate } from '@/config/qualityReviewConfig';

interface GateResult {
  gateId: string;
  passed: boolean;
  notes?: string;
}

interface QualityGateChecklistProps {
  results: GateResult[];
  className?: string;
}

/**
 * Quality Gate Checklist
 * 
 * Shows pass/fail status for each quality requirement.
 * Blocking gates prevent deployment if failed.
 */
export function QualityGateChecklist({ results, className }: QualityGateChecklistProps) {
  const getGateResult = (gate: QualityGate): GateResult | undefined => {
    return results.find(r => r.gateId === gate.id);
  };

  const blockingFailed = QUALITY_GATES
    .filter(g => g.blocking)
    .some(g => {
      const result = getGateResult(g);
      return result && !result.passed;
    });

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Quality Gates
        </h3>
        {blockingFailed ? (
          <span className="text-xs px-2 py-1 rounded bg-status-critical/20 text-status-critical font-medium">
            BLOCKED
          </span>
        ) : results.length === QUALITY_GATES.length ? (
          <span className="text-xs px-2 py-1 rounded bg-status-positive/20 text-status-positive font-medium">
            PASSED
          </span>
        ) : (
          <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground font-medium">
            INCOMPLETE
          </span>
        )}
      </div>

      {/* Gate List */}
      <div className="space-y-2">
        {QUALITY_GATES.map((gate) => {
          const result = getGateResult(gate);
          const status = result ? (result.passed ? 'pass' : 'fail') : 'pending';

          return (
            <div
              key={gate.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded border',
                status === 'pass' && 'bg-status-positive/5 border-status-positive/30',
                status === 'fail' && 'bg-status-critical/5 border-status-critical/30',
                status === 'pending' && 'bg-muted/50 border-border',
              )}
            >
              {/* Status Icon */}
              <div className="mt-0.5">
                {status === 'pass' && (
                  <Check className="h-4 w-4 text-status-positive" />
                )}
                {status === 'fail' && (
                  <X className="h-4 w-4 text-status-critical" />
                )}
                {status === 'pending' && (
                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-sm font-medium',
                    status === 'pass' && 'text-status-positive',
                    status === 'fail' && 'text-status-critical',
                    status === 'pending' && 'text-foreground',
                  )}>
                    {gate.requirement}
                  </span>
                  {gate.blocking && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      blocking
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {gate.test}
                </p>
                {result?.notes && (
                  <p className="text-xs text-foreground/80 mt-2 italic">
                    Note: {result.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Compact quality summary for page headers
 */
export function QualityBadge({ 
  passed, 
  total,
  className 
}: { 
  passed: number; 
  total: number;
  className?: string;
}) {
  const ratio = total > 0 ? passed / total : 0;
  
  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 text-xs font-mono',
      ratio === 1 && 'text-status-positive',
      ratio >= 0.5 && ratio < 1 && 'text-status-warning',
      ratio < 0.5 && 'text-status-critical',
      className
    )}>
      {ratio === 1 ? (
        <Check className="h-3 w-3" />
      ) : ratio >= 0.5 ? (
        <AlertTriangle className="h-3 w-3" />
      ) : (
        <X className="h-3 w-3" />
      )}
      <span>{passed}/{total}</span>
    </div>
  );
}

export default QualityGateChecklist;
