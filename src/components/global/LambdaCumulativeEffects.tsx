/**
 * LAMBDA CUMULATIVE EFFECTS
 * 
 * Decisions are NOT assessed in isolation but CUMULATIVELY.
 * 
 * Example: 12 small decisions → 1 large Lambda shift
 * 
 * This PREVENTS scapegoating.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  type CumulativeEffect,
  getCumulativeStatement,
  ALLOWED_IMPROVEMENT_PHRASES,
  ALLOWED_WORSENING_PHRASES,
  CORE_INSIGHT,
} from '@/config/lambdaDecisionMapping';

interface LambdaCumulativeEffectsProps {
  effect: CumulativeEffect;
  language?: 'sv' | 'en';
}

export const LambdaCumulativeEffects: React.FC<LambdaCumulativeEffectsProps> = ({
  effect,
  language = 'sv',
}) => {
  const DirectionIcon = 
    effect.dominantDirection === 'positive' ? TrendingUp :
    effect.dominantDirection === 'negative' ? TrendingDown : Minus;

  const directionLabel = {
    positive: { sv: 'Mot stabilitet', en: 'Toward stability' },
    negative: { sv: 'Bort från stabilitet', en: 'Away from stability' },
    mixed: { sv: 'Blandad', en: 'Mixed' },
  };

  // Get appropriate phrase based on direction
  const getStatusPhrase = () => {
    if (effect.netLambdaChange > 0.02) {
      // Moving toward 1.0 (improving)
      const phrases = ALLOWED_IMPROVEMENT_PHRASES[language];
      return phrases[0]; // "System stress decreased"
    } else if (effect.netLambdaChange < -0.02) {
      // Moving away from 1.0 (worsening)
      const phrases = ALLOWED_WORSENING_PHRASES[language];
      return phrases[0]; // "System is moving away from stability"
    }
    return language === 'sv' ? 'Systemet är relativt stabilt' : 'System is relatively stable';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DirectionIcon className="h-5 w-5" />
          {language === 'sv' ? 'Ackumulerad effekt' : 'Cumulative Effect'}
        </CardTitle>
        <CardDescription>
          {getCumulativeStatement(effect, language)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-mono font-bold">{effect.totalDecisions}</div>
            <div className="text-xs text-muted-foreground">
              {language === 'sv' ? 'Beslut' : 'Decisions'}
            </div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-mono font-bold">
              {effect.netLambdaChange > 0 ? '+' : ''}{effect.netLambdaChange.toFixed(3)}
            </div>
            <div className="text-xs text-muted-foreground">
              {language === 'sv' ? 'Netto Δλ' : 'Net Δλ'}
            </div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <Badge variant="outline" className="mt-1">
              {directionLabel[effect.dominantDirection][language]}
            </Badge>
          </div>
        </div>

        {/* Status phrase (using allowed language only) */}
        <div className="p-4 border rounded-lg bg-background">
          <p className="font-medium text-center">
            {getStatusPhrase()}
          </p>
        </div>

        {/* Period info */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{language === 'sv' ? 'Period' : 'Period'}:</span>
          <span className="font-mono">
            {effect.periodStart} → {effect.periodEnd}
          </span>
        </div>

        {/* Core insight */}
        <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-primary">
            {CORE_INSIGHT[language]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LambdaCumulativeEffects;
