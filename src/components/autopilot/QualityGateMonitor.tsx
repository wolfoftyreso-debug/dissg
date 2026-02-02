/**
 * 🔁 BLOCK 53 — QUALITY GATE MONITOR
 * 
 * Automated quality gates that block deploys when:
 * - TTFB increases
 * - HTML size increases
 * - More words without more clarity
 * - Uncertainty missing
 * - Sources missing
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Shield, ShieldAlert, ShieldCheck, X } from 'lucide-react';
import { 
  QUALITY_GATES, 
  checkQualityGates, 
  type PageMetrics 
} from '@/config/autopilotConfig';

interface QualityGateMonitorProps {
  metrics: PageMetrics;
  showDetails?: boolean;
  className?: string;
}

/**
 * Quality Gate Monitor
 * 
 * Shows pass/fail status for automated quality gates.
 * Blocking gates prevent deployment.
 */
export function QualityGateMonitor({
  metrics,
  showDetails = true,
  className,
}: QualityGateMonitorProps) {
  const { passed, failures } = checkQualityGates(metrics);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {passed ? (
            <ShieldCheck className="h-5 w-5 text-status-positive" />
          ) : (
            <ShieldAlert className="h-5 w-5 text-status-critical" />
          )}
          <span className="text-sm font-semibold text-foreground">
            Quality Gates
          </span>
        </div>
        <span className={cn(
          'text-xs px-2 py-1 rounded font-medium',
          passed 
            ? 'bg-status-positive/20 text-status-positive' 
            : 'bg-status-critical/20 text-status-critical'
        )}>
          {passed ? 'PASSED' : 'BLOCKED'}
        </span>
      </div>

      {/* Failures */}
      {!passed && failures.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-status-critical">
            Deploy Blocked
          </div>
          <ul className="space-y-1">
            {failures.map((failure, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <X className="h-4 w-4 text-status-critical" />
                <span className="text-foreground">{failure}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Details */}
      {showDetails && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-muted/30 rounded">
            <span className="text-muted-foreground">TTFB</span>
            <span className={cn(
              'block font-mono',
              metrics.ttfb <= 100 ? 'text-status-positive' : 'text-status-critical'
            )}>
              {metrics.ttfb}ms
            </span>
          </div>
          <div className="p-2 bg-muted/30 rounded">
            <span className="text-muted-foreground">HTML Size</span>
            <span className={cn(
              'block font-mono',
              metrics.htmlSize <= 30000 ? 'text-status-positive' : 'text-status-critical'
            )}>
              {(metrics.htmlSize / 1024).toFixed(1)}KB
            </span>
          </div>
          <div className="p-2 bg-muted/30 rounded">
            <span className="text-muted-foreground">Uncertainty</span>
            <span className={cn(
              'block font-mono',
              metrics.hasUncertainty ? 'text-status-positive' : 'text-status-critical'
            )}>
              {metrics.hasUncertainty ? '✓ Present' : '✗ Missing'}
            </span>
          </div>
          <div className="p-2 bg-muted/30 rounded">
            <span className="text-muted-foreground">Sources</span>
            <span className={cn(
              'block font-mono',
              metrics.hasSources ? 'text-status-positive' : 'text-status-critical'
            )}>
              {metrics.hasSources ? '✓ Present' : '✗ Missing'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact badge for quality gate status
 */
export function QualityGateBadge({ 
  metrics,
  className 
}: { 
  metrics: PageMetrics;
  className?: string;
}) {
  const { passed } = checkQualityGates(metrics);
  
  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium',
      passed 
        ? 'bg-status-positive/20 text-status-positive' 
        : 'bg-status-critical/20 text-status-critical',
      className
    )}>
      <Shield className="h-3 w-3" />
      {passed ? 'QG:OK' : 'QG:BLOCKED'}
    </div>
  );
}

export default QualityGateMonitor;
