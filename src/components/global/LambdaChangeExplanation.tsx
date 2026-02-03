/**
 * LAMBDA CHANGE EXPLANATION
 * 
 * REQUIRED when change > ±0.02
 * 
 * Shows ONLY correlation, NO interpretation.
 * "Lambda decreased primarily due to: [factors]"
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import { CHANGE_THRESHOLD } from '@/config/lambdaVisualizationRules';

interface LambdaChangeExplanationProps {
  previousValue: number;
  currentValue: number;
  primaryFactors: string[];
  period: string; // e.g., "Q4 2025"
  language?: 'sv' | 'en';
}

export const LambdaChangeExplanation: React.FC<LambdaChangeExplanationProps> = ({
  previousValue,
  currentValue,
  primaryFactors,
  period,
  language = 'sv',
}) => {
  const change = currentValue - previousValue;
  const absChange = Math.abs(change);
  
  // Only show if change exceeds threshold
  if (absChange < CHANGE_THRESHOLD) {
    return null;
  }

  const direction = change > 0 ? 'increase' : 'decrease';
  const DirectionIcon = change > 0 ? TrendingUp : TrendingDown;

  const directionText = {
    increase: { sv: 'ökade', en: 'increased' },
    decrease: { sv: 'minskade', en: 'decreased' },
  };

  const causeText = {
    increase: { sv: 'på grund av', en: 'due to' },
    decrease: { sv: 'primärt på grund av', en: 'primarily due to' },
  };

  return (
    <Card className="border-secondary">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <DirectionIcon className="h-5 w-5" />
          {language === 'sv' ? 'Varför Lambda förändrades' : 'Why Lambda changed'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Change summary */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{period}:</span>
          <Badge variant="outline">
            λ {directionText[direction][language]} {change > 0 ? '+' : ''}{change.toFixed(3)}
          </Badge>
          <span className="text-muted-foreground">
            ({previousValue.toFixed(2)} → {currentValue.toFixed(2)})
          </span>
        </div>

        {/* Primary factors - NO interpretation */}
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm mb-2">
            Lambda {directionText[direction][language]} {causeText[direction][language]}:
          </p>
          <ul className="space-y-1">
            {primaryFactors.map((factor, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-primary">•</span>
                {factor}
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
          <p>
            {language === 'sv'
              ? 'Korrelation, inte orsakssamband. Klicka på varje faktor för metodbeskrivning.'
              : 'Correlation, not causation. Click each factor for methodology.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LambdaChangeExplanation;
