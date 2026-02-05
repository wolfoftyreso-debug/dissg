/**
 * LEGITIMACY DISPLAY
 * 
 * Shows why a decision is (or is not) legitimate.
 * Auto-generated. Structural. Not moral.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Scale,
} from 'lucide-react';
import type { LegitimacyCheck } from '@/core/query-dominance/legitimacy/types';
import { LEGITIMACY_CRITERIA } from '@/core/query-dominance/legitimacy/checker';

interface LegitimacyDisplayProps {
  check: LegitimacyCheck;
  showDetails?: boolean;
}

const STATUS_CONFIG = {
  legitimate: {
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    label: 'Legitimate',
    icon: CheckCircle2,
  },
  partially_legitimate: {
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    label: 'Partially Legitimate',
    icon: HelpCircle,
  },
  illegitimate: {
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    label: 'Not Legitimate',
    icon: XCircle,
  },
  unknown: {
    color: 'text-muted-foreground',
    bg: 'bg-muted/50',
    border: 'border-muted',
    label: 'Unknown',
    icon: HelpCircle,
  },
};

export function LegitimacyDisplay({ check, showDetails = true }: LegitimacyDisplayProps) {
  const config = STATUS_CONFIG[check.status];
  const StatusIcon = config.icon;

  return (
    <Card className={`${config.border} border-2`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.bg}`}>
              <Scale className={`h-5 w-5 ${config.color}`} />
            </div>
            <div>
              <CardTitle className="text-lg">Decision Legitimacy</CardTitle>
              <p className="text-sm text-muted-foreground">
                Procedural honesty assessment
              </p>
            </div>
          </div>
          <Badge variant="outline" className={`${config.color} ${config.border}`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Score */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Legitimacy Score</span>
            <span className="font-medium">{Math.round(check.legitimacy_score * 100)}%</span>
          </div>
          <Progress 
            value={check.legitimacy_score * 100} 
            className="h-2"
          />
        </div>
        
        {/* Statement */}
        <div className={`p-3 rounded-lg ${config.bg}`}>
          <p className="text-sm">{check.legitimacy_statement}</p>
        </div>
        
        {showDetails && (
          <>
            <Separator />
            
            {/* Criteria */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Criteria Assessment</h4>
              
              <div className="grid gap-2">
                {LEGITIMACY_CRITERIA.map((criterion) => {
                  const met = check.criteria_met.includes(criterion.id);
                  const failed = check.criteria_failed.includes(criterion.id);
                  
                  return (
                    <div 
                      key={criterion.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                    >
                      {met ? (
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : failed ? (
                        <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                      ) : (
                        <HelpCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{criterion.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {criterion.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Key Distinctions */}
            <Separator />
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground">Legitimacy IS:</p>
                <ul className="space-y-0.5 text-muted-foreground">
                  <li>• Procedural honesty</li>
                  <li>• Traceable accountability</li>
                  <li>• Proportional weight</li>
                </ul>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground">Legitimacy IS NOT:</p>
                <ul className="space-y-0.5 text-muted-foreground">
                  <li>• Correctness</li>
                  <li>• Good outcome</li>
                  <li>• Moral approval</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Compact legitimacy badge
 */
export function LegitimacyBadge({ check }: { check: LegitimacyCheck }) {
  const config = STATUS_CONFIG[check.status];
  const StatusIcon = config.icon;
  
  return (
    <Badge 
      variant="outline" 
      className={`${config.color} ${config.border} gap-1`}
    >
      <StatusIcon className="h-3 w-3" />
      <span>{Math.round(check.legitimacy_score * 100)}%</span>
    </Badge>
  );
}
