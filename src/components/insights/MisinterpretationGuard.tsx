/**
 * BLOCK TF — MISINTERPRETATION GUARD
 * "Denna slutsats stöds inte av den data som visas. Vill du se varför?"
 */

import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { 
  MISINTERPRETATION_WARNINGS, 
  type MisinterpretationType 
} from '@/config/personalInsightConfig';

interface MisinterpretationGuardProps {
  type: MisinterpretationType;
  onDismiss?: () => void;
  onLearnMore?: () => void;
}

export function MisinterpretationGuard({ 
  type, 
  onDismiss, 
  onLearnMore 
}: MisinterpretationGuardProps) {
  const [expanded, setExpanded] = useState(false);
  const warning = MISINTERPRETATION_WARNINGS[type];

  return (
    <Alert className="border-warning/50 bg-warning/10">
      <AlertTriangle className="h-4 w-4 text-warning" />
      <AlertTitle className="text-warning">{warning.titleSv}</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p className="text-sm">{warning.messageSv}</p>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Dölj
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                {warning.suggestionSv.split('?')[0]}?
              </>
            )}
          </Button>
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              Jag förstår
            </Button>
          )}
        </div>

        {expanded && (
          <Card className="mt-3 bg-card">
            <CardContent className="p-4 text-sm space-y-2">
              {type === 'causal_claim' && (
                <>
                  <p><strong>Varför kan vi inte dra denna slutsats?</strong></p>
                  <p className="text-muted-foreground">
                    Samvariation (korrelation) betyder att två variabler rör sig tillsammans, 
                    men säger inget om vad som orsakar vad. Det kan finnas:
                  </p>
                  <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                    <li>En tredje variabel som påverkar båda</li>
                    <li>Omvänd kausalitet (B orsakar A, inte tvärtom)</li>
                    <li>Slumpmässigt samband under denna period</li>
                  </ul>
                </>
              )}
              {type === 'incomparable_groups' && (
                <>
                  <p><strong>Varför är dessa grupper svåra att jämföra?</strong></p>
                  <p className="text-muted-foreground">
                    Strukturella skillnader gör att direkt jämförelse kan vara missvisande:
                  </p>
                  <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                    <li>Olika definitioner eller mätmetoder</li>
                    <li>Olika utgångslägen eller storlek</li>
                    <li>Olika externa förutsättningar</li>
                  </ul>
                </>
              )}
              {type === 'skipped_step' && (
                <>
                  <p><strong>Varför är detta steg viktigt?</strong></p>
                  <p className="text-muted-foreground">
                    Att hoppa över analyssteg kan leda till att viktig kontext missas, 
                    vilket ökar risken för felaktiga slutsatser.
                  </p>
                </>
              )}
              {type === 'overgeneralization' && (
                <>
                  <p><strong>Varför gäller detta inte överallt?</strong></p>
                  <p className="text-muted-foreground">
                    Mönster som observeras i en kontext kanske inte gäller i andra på grund av:
                  </p>
                  <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                    <li>Olika institutionella strukturer</li>
                    <li>Olika historiska förutsättningar</li>
                    <li>Olika kulturella faktorer</li>
                  </ul>
                </>
              )}
              {type === 'cherry_picking' && (
                <>
                  <p><strong>Vad menas med selektivt urval?</strong></p>
                  <p className="text-muted-foreground">
                    Att endast titta på data som stödjer en viss slutsats, medan 
                    motsägande data ignoreras, ger en skev bild av verkligheten.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </AlertDescription>
    </Alert>
  );
}

// Compact version for inline use
export function MisinterpretationBadge({ type }: { type: MisinterpretationType }) {
  const warning = MISINTERPRETATION_WARNINGS[type];
  
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-warning/10 border border-warning/30 rounded text-xs text-warning">
      <AlertTriangle className="h-3 w-3" />
      {warning.titleSv}
    </div>
  );
}
