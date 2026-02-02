/**
 * Simplicity Score Indicator
 * 
 * Displays the automatic simplicity score for a page.
 * Blocks deploy if score is too low.
 * 
 * Part of Block 54.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  SimplicityScore, 
  calculateSimplicityScore,
  SIMPLICITY_THRESHOLDS 
} from '@/config/selfLearningCoreConfig';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface SimplicityScoreIndicatorProps {
  wordCount: number;
  insightCount: number;
  clicksToSource: number;
  timeToUnderstanding: number;
  showDetails?: boolean;
  className?: string;
}

export function SimplicityScoreIndicator({
  wordCount,
  insightCount,
  clicksToSource,
  timeToUnderstanding,
  showDetails = false,
  className,
}: SimplicityScoreIndicatorProps) {
  const score = calculateSimplicityScore({
    wordCount,
    insightCount,
    clicksToSource,
    timeToUnderstanding,
  });

  const status = 
    score.overallScore >= SIMPLICITY_THRESHOLDS.excellentScore ? 'excellent' :
    score.overallScore >= SIMPLICITY_THRESHOLDS.targetScore ? 'good' :
    score.overallScore >= SIMPLICITY_THRESHOLDS.minScore ? 'acceptable' : 'blocked';

  const StatusIcon = 
    status === 'excellent' || status === 'good' ? CheckCircle :
    status === 'acceptable' ? AlertTriangle : XCircle;

  const statusColor = 
    status === 'excellent' ? 'text-status-positive' :
    status === 'good' ? 'text-status-positive' :
    status === 'acceptable' ? 'text-status-warning' : 'text-status-critical';

  const statusLabel = 
    status === 'excellent' ? 'Utmärkt' :
    status === 'good' ? 'Bra' :
    status === 'acceptable' ? 'Acceptabel' : 'Blockerad';

  return (
    <div className={cn('space-y-2', className)}>
      {/* Main score */}
      <div className="flex items-center gap-2">
        <StatusIcon className={cn('h-4 w-4', statusColor)} />
        <span className="text-sm font-medium">
          Enkelhet: {Math.round(score.overallScore)}
        </span>
        <span className={cn('text-xs', statusColor)}>
          ({statusLabel})
        </span>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <div className="space-y-1">
            <div className="font-medium">Ord/insikt</div>
            <div className={cn(
              score.wordsPerInsight <= 50 ? 'text-status-positive' : 
              score.wordsPerInsight <= 100 ? 'text-status-warning' : 'text-status-critical'
            )}>
              {Math.round(score.wordsPerInsight)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-medium">Klick/källa</div>
            <div className={cn(
              score.clicksPerSource <= 2 ? 'text-status-positive' : 
              score.clicksPerSource <= 3 ? 'text-status-warning' : 'text-status-critical'
            )}>
              {score.clicksPerSource}
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-medium">Tid (sek)</div>
            <div className={cn(
              score.timeToUnderstanding <= 5 ? 'text-status-positive' : 
              score.timeToUnderstanding <= 10 ? 'text-status-warning' : 'text-status-critical'
            )}>
              {Math.round(score.timeToUnderstanding)}
            </div>
          </div>
        </div>
      )}

      {/* Block warning */}
      {status === 'blocked' && (
        <div className="text-xs text-status-critical bg-status-critical/10 px-2 py-1 rounded">
          ⚠️ Deploy blockerad: Förenkla sidan först
        </div>
      )}
    </div>
  );
}

export default SimplicityScoreIndicator;
