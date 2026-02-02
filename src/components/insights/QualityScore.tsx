/**
 * BLOCK TG — INSIGHT QUALITY SCORE
 * "Din analys uppfyller: ✅ ⚠️ ❌"
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, X, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QUALITY_CRITERIA, type QualityCheck } from '@/config/personalInsightConfig';

interface QualityScoreProps {
  checks: QualityCheck[];
  overallScore?: number;
}

export function QualityScore({ checks, overallScore }: QualityScoreProps) {
  const passedCount = checks.filter(c => c.status === 'passed').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;
  const failedCount = checks.filter(c => c.status === 'failed').length;

  const calculatedScore = overallScore ?? Math.round(
    (passedCount * 100 + warningCount * 50) / checks.length
  );

  const getScoreLabel = () => {
    if (calculatedScore >= 80) return { label: 'Stark analys', color: 'text-success' };
    if (calculatedScore >= 60) return { label: 'Godkänd analys', color: 'text-warning' };
    return { label: 'Behöver förbättras', color: 'text-destructive' };
  };

  const scoreInfo = getScoreLabel();

  const StatusIcon = ({ status }: { status: QualityCheck['status'] }) => {
    switch (status) {
      case 'passed':
        return <Check className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'failed':
        return <X className="h-4 w-4 text-destructive" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Analyskvalitet
          </CardTitle>
          <Badge className={cn("text-sm", scoreInfo.color)}>
            {calculatedScore}/100
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Din analys uppfyller följande kriterier:
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Criteria list */}
        <div className="space-y-2">
          {checks.map((check) => (
            <div 
              key={check.criterion}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg",
                check.status === 'passed' && "bg-success/10",
                check.status === 'warning' && "bg-warning/10",
                check.status === 'failed' && "bg-destructive/10"
              )}
            >
              <div className="flex items-center gap-3">
                <StatusIcon status={check.status} />
                <div>
                  <div className="text-sm font-medium">{check.labelSv}</div>
                  {check.noteSv && (
                    <div className="text-xs text-muted-foreground">{check.noteSv}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">{scoreInfo.label}</span>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-success">✅ {passedCount}</span>
            <span className="text-warning">⚠️ {warningCount}</span>
            <span className="text-destructive">❌ {failedCount}</span>
          </div>
        </div>

        {/* Note */}
        <p className="text-xs text-muted-foreground italic text-center">
          Detta tränar tänkande, inte åsikt.
        </p>
      </CardContent>
    </Card>
  );
}
