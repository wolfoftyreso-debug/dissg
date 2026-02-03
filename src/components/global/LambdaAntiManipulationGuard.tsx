/**
 * LAMBDA ANTI-MANIPULATION GUARD
 * 
 * Wrapper component that enforces all anti-manipulation rules
 * before allowing any Lambda visualization to render.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  QrCode
} from 'lucide-react';
import {
  type PartialViewWarning,
  type TimeWindowValidation,
  type TransparencyRequirements,
  type ComparisonValidation,
  PARTIAL_VIEW_DISCLAIMER,
  TIME_WINDOW_WARNING,
  TRANSPARENCY_BLOCK_MESSAGE,
  COMPARISON_BLOCKED_MESSAGE,
  COMPARISON_ISSUE_LABELS,
  checkTransparency,
  CHERRY_PICKING_THRESHOLD,
  ANTI_MANIPULATION_DOCTRINE,
  VERIFICATION_PROMPT,
} from '@/config/lambdaAntiManipulation';

interface LambdaAntiManipulationGuardProps {
  children: React.ReactNode;
  
  // Validation inputs
  partialView?: PartialViewWarning;
  timeWindow?: TimeWindowValidation;
  transparency?: TransparencyRequirements;
  comparison?: ComparisonValidation;
  
  // Verification
  verificationUrl?: string;
  contentHash?: string;
  
  language?: 'sv' | 'en';
  showProtectionBadge?: boolean;
}

export const LambdaAntiManipulationGuard: React.FC<LambdaAntiManipulationGuardProps> = ({
  children,
  partialView,
  timeWindow,
  transparency,
  comparison,
  verificationUrl,
  contentHash,
  language = 'sv',
  showProtectionBadge = true,
}) => {
  // Check all guards
  const warnings: React.ReactNode[] = [];
  let isBlocked = false;
  let blockReason = '';

  // 1. Check transparency requirements (BLOCKING)
  if (transparency) {
    const { valid } = checkTransparency(transparency);
    if (!valid) {
      isBlocked = true;
      blockReason = TRANSPARENCY_BLOCK_MESSAGE[language];
    }
  }

  // 2. Check comparison validity (BLOCKING)
  if (comparison && !comparison.isValid) {
    isBlocked = true;
    blockReason = COMPARISON_BLOCKED_MESSAGE[language];
  }

  // 3. Check partial view (WARNING)
  if (partialView?.isPartial && partialView.coveragePercent < CHERRY_PICKING_THRESHOLD * 100) {
    warnings.push(
      <Alert key="partial" variant="destructive" className="border-orange-500/50 bg-orange-500/10">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{language === 'sv' ? 'Partiell vy' : 'Partial View'}</AlertTitle>
        <AlertDescription>
          {PARTIAL_VIEW_DISCLAIMER[language]}
          <span className="block mt-1 text-xs">
            {language === 'sv' 
              ? `Visar ${partialView.visibleSensors} av ${partialView.totalSensors} sensorer (${partialView.coveragePercent.toFixed(0)}%)`
              : `Showing ${partialView.visibleSensors} of ${partialView.totalSensors} sensors (${partialView.coveragePercent.toFixed(0)}%)`}
          </span>
        </AlertDescription>
      </Alert>
    );
  }

  // 4. Check time window (WARNING)
  if (timeWindow && !timeWindow.isStandard) {
    warnings.push(
      <Alert key="timewindow" className="border-secondary">
        <Clock className="h-4 w-4" />
        <AlertTitle>{language === 'sv' ? 'Anpassat tidsintervall' : 'Custom Time Window'}</AlertTitle>
        <AlertDescription>
          {TIME_WINDOW_WARNING[language]}
          <span className="block mt-1 text-xs">
            {language === 'sv'
              ? `Valt: ${timeWindow.selectedMonths} mån. Närmaste standard: ${timeWindow.nearestStandard} mån.`
              : `Selected: ${timeWindow.selectedMonths} mo. Nearest standard: ${timeWindow.nearestStandard} mo.`}
          </span>
        </AlertDescription>
      </Alert>
    );
  }

  // If blocked, show block screen
  if (isBlocked) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            {language === 'sv' ? 'Visualisering blockerad' : 'Visualization Blocked'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{blockReason}</p>
          
          {comparison && !comparison.isValid && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                {language === 'sv' ? 'Problem:' : 'Issues:'}
              </p>
              <div className="flex flex-wrap gap-1">
                {comparison.issues.map((issue) => (
                  <Badge key={issue} variant="outline" className="text-xs">
                    {COMPARISON_ISSUE_LABELS[issue][language]}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground italic">
              {ANTI_MANIPULATION_DOCTRINE[language]}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Warnings (non-blocking) */}
      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings}
        </div>
      )}

      {/* Protection badge */}
      {showProtectionBadge && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>{language === 'sv' ? 'Manipulationsskydd aktivt' : 'Manipulation protection active'}</span>
          </div>
          
          {verificationUrl && contentHash && (
            <Button variant="ghost" size="sm" className="h-6 text-xs" asChild>
              <a href={verificationUrl} target="_blank" rel="noopener noreferrer">
                <QrCode className="h-3 w-3 mr-1" />
                {VERIFICATION_PROMPT[language]}
              </a>
            </Button>
          )}
        </div>
      )}

      {/* Protected content */}
      {children}
    </div>
  );
};

export default LambdaAntiManipulationGuard;
