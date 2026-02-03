/**
 * LAMBDA COMPARISON WARNING
 * 
 * When comparing two entities:
 * - Same time period
 * - Same indicators  
 * - Same weighting
 * 
 * Otherwise: SHOW CLEAR WARNING
 */

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
import { 
  type ComparisonValidity, 
  getComparisonWarning 
} from '@/config/lambdaVisualizationRules';

interface LambdaComparisonWarningProps {
  validity: ComparisonValidity;
  entityA: string;
  entityB: string;
  language?: 'sv' | 'en';
}

export const LambdaComparisonWarning: React.FC<LambdaComparisonWarningProps> = ({
  validity,
  entityA,
  entityB,
  language = 'sv',
}) => {
  const warning = getComparisonWarning(validity, language);
  
  // If comparison is fully valid, show subtle confirmation
  if (!warning) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-muted rounded">
        <Info className="h-3 w-3" />
        {language === 'sv'
          ? 'Jämförelse giltig: samma period, indikatorer och viktning'
          : 'Comparison valid: same period, indicators, and weighting'}
      </div>
    );
  }

  // Calculate severity
  const issues = [];
  if (!validity.sameTimePeriod) issues.push(language === 'sv' ? 'olika tidsperiod' : 'different time period');
  if (!validity.sameIndicators) issues.push(language === 'sv' ? 'olika indikatorer' : 'different indicators');
  if (!validity.sameWeighting) issues.push(language === 'sv' ? 'olika viktning' : 'different weighting');
  if (validity.dataCoverageDifference > 10) {
    issues.push(language === 'sv' 
      ? `datatäckning skiljer ${validity.dataCoverageDifference.toFixed(0)}%` 
      : `data coverage differs ${validity.dataCoverageDifference.toFixed(0)}%`
    );
  }

  const isSevere = !validity.sameTimePeriod || !validity.sameIndicators;

  return (
    <Alert variant={isSevere ? 'destructive' : 'default'} className="border-secondary">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>
        {language === 'sv' ? 'Jämförelsevarning' : 'Comparison Warning'}
      </AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{warning}</p>
        <p className="text-xs">
          {language === 'sv' ? 'Problem:' : 'Issues:'} {issues.join(', ')}
        </p>
        <p className="text-xs text-muted-foreground">
          {language === 'sv'
            ? `Jämförelse mellan ${entityA} och ${entityB} bör tolkas med försiktighet.`
            : `Comparison between ${entityA} and ${entityB} should be interpreted with caution.`}
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default LambdaComparisonWarning;
