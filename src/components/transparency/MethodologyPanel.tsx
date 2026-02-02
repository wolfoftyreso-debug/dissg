/**
 * METHODOLOGY PANEL
 * 
 * Metod är inte fotnot. Metod är förstasida.
 * "Reproducibility is currency in the Davos world."
 */

import React, { useState } from 'react';
import { TRANSPARENCY_LAYER_PROMPT_PART_II } from '@/config/masterPromptConfig';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface MethodologyDetails {
  selectionCriteria: string;
  comparisonMethod: string;
  calculationSteps: string[];
  dataSources: string[];
  timeframe: string;
  limitations?: string[];
  reproducibilityNotes?: string;
}

interface MethodologyPanelProps {
  language?: 'sv' | 'en';
  methodology?: MethodologyDetails;
  variant?: 'button' | 'inline' | 'panel';
  className?: string;
}

export function MethodologyPanel({
  language = 'en',
  methodology,
  variant = 'button',
  className = '',
}: MethodologyPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const config = TRANSPARENCY_LAYER_PROMPT_PART_II.methodPrimacy;
  const standardText = config.standardFormulation[language];

  const labels = {
    en: {
      buttonText: 'Method',
      title: 'Methodology',
      selection: 'Selection Criteria',
      comparison: 'Comparison Method',
      calculation: 'Calculation Steps',
      sources: 'Data Sources',
      timeframe: 'Timeframe',
      limitations: 'Limitations',
      reproducibility: 'Reproducibility',
      noMethod: 'Methodology documentation not yet available for this output.',
    },
    sv: {
      buttonText: 'Metod',
      title: 'Metodik',
      selection: 'Urvalskriterier',
      comparison: 'Jämförelsemetod',
      calculation: 'Beräkningssteg',
      sources: 'Datakällor',
      timeframe: 'Tidsram',
      limitations: 'Begränsningar',
      reproducibility: 'Reproducerbarhet',
      noMethod: 'Metoddokumentation ännu inte tillgänglig för denna output.',
    },
  }[language];

  const MethodContent = () => (
    <div className="space-y-4">
      {methodology ? (
        <>
          <section>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              {labels.selection}
            </h4>
            <p className="text-sm">{methodology.selectionCriteria}</p>
          </section>

          <section>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              {labels.comparison}
            </h4>
            <p className="text-sm">{methodology.comparisonMethod}</p>
          </section>

          <section>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              {labels.calculation}
            </h4>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              {methodology.calculationSteps.map((step, i) => (
                <li key={i} className="text-muted-foreground">
                  <span className="text-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              {labels.sources}
            </h4>
            <ul className="text-sm space-y-1">
              {methodology.dataSources.map((source, i) => (
                <li key={i} className="font-mono text-xs">{source}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              {labels.timeframe}
            </h4>
            <p className="text-sm font-mono">{methodology.timeframe}</p>
          </section>

          {methodology.limitations && methodology.limitations.length > 0 && (
            <section>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {labels.limitations}
              </h4>
              <ul className="text-sm space-y-1">
                {methodology.limitations.map((limit, i) => (
                  <li key={i} className="text-muted-foreground">• {limit}</li>
                ))}
              </ul>
            </section>
          )}

          {methodology.reproducibilityNotes && (
            <section>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {labels.reproducibility}
              </h4>
              <p className="text-sm">{methodology.reproducibilityNotes}</p>
            </section>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground italic">{labels.noMethod}</p>
      )}

      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground italic">{standardText}</p>
      </div>
    </div>
  );

  if (variant === 'inline') {
    return (
      <div className={`text-xs text-muted-foreground ${className}`}>
        <span className="font-mono">[M]</span> {standardText}
      </div>
    );
  }

  if (variant === 'panel') {
    return (
      <div className={`border border-border bg-card p-4 ${className}`}>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span className="w-6 h-6 border border-border flex items-center justify-center text-xs font-mono">
            M
          </span>
          {labels.title}
        </h3>
        <MethodContent />
      </div>
    );
  }

  // Button variant (default)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`font-mono text-xs ${className}`}
        >
          <span className="mr-1">[M]</span>
          {labels.buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="w-6 h-6 border border-border flex items-center justify-center text-xs font-mono">
              M
            </span>
            {labels.title}
          </DialogTitle>
        </DialogHeader>
        <MethodContent />
      </DialogContent>
    </Dialog>
  );
}
