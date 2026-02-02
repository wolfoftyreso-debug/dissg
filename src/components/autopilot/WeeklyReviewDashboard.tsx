/**
 * 🔁 BLOCK 53 — WEEKLY BORING REVIEW DASHBOARD
 * 
 * Every week:
 * 1. List 10 worst-performing pages
 * 2. Simplify them
 * 3. Publish
 * 4. Measure again
 * 
 * No roadmap. No discussion. Just improvement.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingDown, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { WEEKLY_REVIEW_CONFIG, getWorstPerformingPages } from '@/config/autopilotConfig';

interface PagePerformance {
  id: string;
  title: string;
  url: string;
  metrics: {
    backtrackingRate: number;
    earlyExitRate: number;
    ttfi: number;
    scrollDepth: number;
  };
  status: 'pending' | 'simplified' | 'published' | 'measured';
}

interface WeeklyReviewDashboardProps {
  pages: PagePerformance[];
  weekNumber: number;
  onSimplify?: (pageId: string) => void;
  onPublish?: (pageId: string) => void;
  className?: string;
}

/**
 * Weekly Boring Review Dashboard
 * 
 * Shows worst-performing pages and tracks improvement cycle.
 */
export function WeeklyReviewDashboard({
  pages,
  weekNumber,
  onSimplify,
  onPublish,
  className,
}: WeeklyReviewDashboardProps) {
  const worstPages = getWorstPerformingPages(pages, WEEKLY_REVIEW_CONFIG.pagesToReview);

  const statusCounts = {
    pending: worstPages.filter(p => p.status === 'pending').length,
    simplified: worstPages.filter(p => p.status === 'simplified').length,
    published: worstPages.filter(p => p.status === 'published').length,
    measured: worstPages.filter(p => p.status === 'measured').length,
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Weekly Review — Week {weekNumber}
          </h2>
          <p className="text-sm text-muted-foreground">
            No roadmap. No discussion. Just improvement.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-muted-foreground">
            {statusCounts.pending} pending
          </span>
          <span className="text-status-warning">
            {statusCounts.simplified} simplified
          </span>
          <span className="text-primary">
            {statusCounts.published} published
          </span>
          <span className="text-status-positive">
            {statusCounts.measured} measured
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {['Simplify', 'Publish', 'Measure'].map((step, index) => (
          <React.Fragment key={step}>
            <div className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg',
              index === 0 && statusCounts.pending > 0 && 'bg-primary/10 text-primary',
              index === 1 && statusCounts.simplified > 0 && 'bg-primary/10 text-primary',
              index === 2 && statusCounts.published > 0 && 'bg-primary/10 text-primary',
            )}>
              <span className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold',
                'bg-muted text-muted-foreground'
              )}>
                {index + 1}
              </span>
              <span className="text-sm font-medium">{step}</span>
            </div>
            {index < 2 && (
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Pages List */}
      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Worst Performing Pages ({worstPages.length})
        </div>
        
        {worstPages.map((page, index) => (
          <div
            key={page.id}
            className={cn(
              'flex items-center gap-4 p-4 rounded-lg border',
              page.status === 'pending' && 'bg-muted/30 border-border',
              page.status === 'simplified' && 'bg-status-warning/5 border-status-warning/30',
              page.status === 'published' && 'bg-primary/5 border-primary/30',
              page.status === 'measured' && 'bg-status-positive/5 border-status-positive/30',
            )}
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-semibold text-muted-foreground">
                {index + 1}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground truncate">
                  {page.title}
                </span>
                {page.metrics.backtrackingRate > 0.3 && (
                  <AlertTriangle className="h-4 w-4 text-status-warning" />
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span>Backtrack: {(page.metrics.backtrackingRate * 100).toFixed(0)}%</span>
                <span>Exit: {(page.metrics.earlyExitRate * 100).toFixed(0)}%</span>
                <span>TTFI: {(page.metrics.ttfi / 1000).toFixed(1)}s</span>
                <span>Scroll: {page.metrics.scrollDepth}%</span>
              </div>
            </div>

            {/* Status */}
            <div className="flex-shrink-0">
              {page.status === 'pending' && (
                <button
                  onClick={() => onSimplify?.(page.id)}
                  className="px-3 py-1.5 text-xs font-medium rounded bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Simplify
                </button>
              )}
              {page.status === 'simplified' && (
                <button
                  onClick={() => onPublish?.(page.id)}
                  className="px-3 py-1.5 text-xs font-medium rounded bg-status-warning/20 text-status-warning hover:bg-status-warning/30"
                >
                  Publish
                </button>
              )}
              {page.status === 'published' && (
                <span className="px-3 py-1.5 text-xs font-medium rounded bg-primary/20 text-primary">
                  Measuring…
                </span>
              )}
              {page.status === 'measured' && (
                <CheckCircle className="h-5 w-5 text-status-positive" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Rules reminder */}
      <div className="p-3 bg-muted/30 rounded-lg border border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingDown className="h-4 w-4" />
          <span>Goal: System becomes simpler and clearer over time</span>
        </div>
      </div>
    </div>
  );
}

export default WeeklyReviewDashboard;
