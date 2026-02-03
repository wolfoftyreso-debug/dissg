/**
 * EXPLANATION CARD
 * 
 * Displays the three understanding levels with "This means" block.
 * Follows strict language discipline and context awareness.
 */

import { useState } from 'react';
import { ChevronDown, ChevronRight, AlertTriangle, Info, BookOpen, Database, Eye, Lightbulb, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { 
  ExplanationLevel, 
  ThisMeansBlock, 
  ContextWarning,
  IntuitiveComparison 
} from '@/lib/lambda/explanation-engine';

interface ExplanationCardProps {
  levels: [ExplanationLevel, ExplanationLevel, ExplanationLevel];
  thisMeans: ThisMeansBlock;
  intuitive?: IntuitiveComparison;
  warnings?: ContextWarning[];
  language?: 'sv' | 'en';
  className?: string;
}

export function ExplanationCard({
  levels,
  thisMeans,
  intuitive,
  warnings = [],
  language = 'sv',
  className,
}: ExplanationCardProps) {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  
  const labels = {
    thisMeans: { sv: 'Detta betyder', en: 'This means' },
    thisDoesNotMean: { sv: 'Detta betyder inte', en: 'This does not mean' },
    intuitive: { sv: 'Vardagligt uttryckt', en: 'In everyday terms' },
    confidence: {
      high: { sv: 'Hög tillförlitlighet', en: 'High confidence' },
      medium: { sv: 'Medel tillförlitlighet', en: 'Medium confidence' },
      low: { sv: 'Låg tillförlitlighet', en: 'Low confidence' },
    },
    levels: {
      1: { sv: 'Vad ser jag?', en: 'What do I see?' },
      2: { sv: 'Varför ser det ut så?', en: 'Why does it look like this?' },
      3: { sv: 'Hur vet vi detta?', en: 'How do we know this?' },
    },
  };
  
  const levelIcons = {
    1: Eye,
    2: Lightbulb,
    3: Database,
  };
  
  const confidenceColors = {
    high: 'bg-primary/10 text-primary',
    medium: 'bg-warning/10 text-warning',
    low: 'bg-muted text-muted-foreground',
  };
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* Context Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((warning, idx) => (
            <WarningBanner key={idx} warning={warning} language={language} />
          ))}
        </div>
      )}
      
      {/* "This means" block - ALWAYS VISIBLE */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">
                  {labels.thisMeans[language]}:
                </h4>
                <Badge 
                  variant="outline" 
                  className={cn('text-xs', confidenceColors[thisMeans.confidence])}
                >
                  {labels.confidence[thisMeans.confidence][language]}
                </Badge>
              </div>
              
              <p className="text-base leading-relaxed">
                {thisMeans.statement[language]}
              </p>
              
              {/* Caveats */}
              {thisMeans.caveats.length > 0 && (
                <div className="pt-2 border-t mt-3">
                  <p className="text-xs text-muted-foreground font-medium mb-1">
                    {labels.thisDoesNotMean[language]}:
                  </p>
                  <ul className="space-y-1">
                    {thisMeans.caveats.map((caveat, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-destructive mt-0.5">✕</span>
                        {caveat[language]}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Intuitive comparison */}
      {intuitive && (
        <Card className="bg-muted/30">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 text-sm">
              <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground font-medium">
                {labels.intuitive[language]}:
              </span>
              <span>{intuitive.explanation[language]}</span>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Three understanding levels */}
      <div className="space-y-2">
        {levels.map((level) => {
          const Icon = levelIcons[level.level];
          const isExpanded = expandedLevel === level.level;
          
          // Level 1 is always visible, others are collapsible
          if (level.level === 1) {
            return (
              <Card key={level.level}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-mono">
                      1
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-muted-foreground mb-1">
                        {labels.levels[1][language]}
                      </h5>
                      <p className="text-sm leading-relaxed">
                        {level.content[language]}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }
          
          return (
            <Collapsible
              key={level.level}
              open={isExpanded}
              onOpenChange={(open) => setExpandedLevel(open ? level.level : null)}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardContent className="py-3 cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-mono">
                        {level.level}
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {labels.levels[level.level as 2 | 3][language]}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 pb-4">
                    <p className="text-sm leading-relaxed pl-9">
                      {level.content[language]}
                    </p>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// WARNING BANNER
// =============================================================================

interface WarningBannerProps {
  warning: ContextWarning;
  language: 'sv' | 'en';
}

function WarningBanner({ warning, language }: WarningBannerProps) {
  const severityConfig = {
    info: {
      icon: Info,
      className: 'bg-muted/50 border-muted-foreground/20',
      iconClass: 'text-muted-foreground',
    },
    warning: {
      icon: AlertTriangle,
      className: 'bg-warning/10 border-warning/20',
      iconClass: 'text-warning',
    },
    critical: {
      icon: AlertTriangle,
      className: 'bg-destructive/10 border-destructive/20',
      iconClass: 'text-destructive',
    },
  };
  
  const config = severityConfig[warning.severity];
  const Icon = config.icon;
  
  return (
    <div className={cn('rounded-lg border p-3', config.className)}>
      <div className="flex items-start gap-3">
        <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', config.iconClass)} />
        <div className="space-y-1">
          <p className="text-sm">{warning.message[language]}</p>
          <p className="text-xs text-muted-foreground">{warning.suggestion[language]}</p>
        </div>
      </div>
    </div>
  );
}

export default ExplanationCard;
