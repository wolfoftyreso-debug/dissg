/**
 * SUMMARY BLOCK COMPONENT
 * 
 * A single expandable block in the 6-block summary structure.
 * Every element is clickable to source data.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

interface SummaryBlockProps {
  number: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  generatedText: string;
  isRequired?: boolean;
  onClickSource?: () => void;
}

const blockTitles: Record<number, { sv: string; en: string }> = {
  1: { sv: 'Omfattning', en: 'Scope' },
  2: { sv: 'Observerade förändringar', en: 'Observed Changes' },
  3: { sv: 'Relativ position', en: 'Relative Position' },
  4: { sv: 'Samvariation & kontext', en: 'Co-movement & Context' },
  5: { sv: 'Stabilitet & signaler', en: 'Stability & Risk Signals' },
  6: { sv: 'Begränsningar', en: 'Limits & Non-claims' }
};

export function SummaryBlock({ 
  number, 
  title, 
  subtitle, 
  children, 
  generatedText,
  isRequired = true,
  onClickSource 
}: SummaryBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-medium">
            {number}
          </span>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-medium leading-snug">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          {isRequired && (
            <span className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
              Obligatoriskt
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {/* Generated neutral text */}
        <p className="text-sm text-foreground leading-relaxed">
          {generatedText}
        </p>
        
        {/* Expandable details */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            {isExpanded ? '▼' : '▶'} Visa detaljer
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-3 space-y-3">
            {children}
            
            {onClickSource && (
              <button
                onClick={onClickSource}
                className="text-xs text-primary hover:underline"
              >
                Visa källdata →
              </button>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
