/**
 * LAMBDA DECISION TIMELINE
 * 
 * Visualizes decisions on the Lambda timeline with:
 * - Vertical lines = decisions
 * - Color = decision type (neutral)
 * - Click → decision card
 * 
 * NO value words. Only facts.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  AlertCircle, 
  Calendar, 
  Clock, 
  Building2, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  type DecisionLifecycle,
  type DecisionType,
  DECISION_TYPE_LABELS,
  LATENCY_RULES,
  isEffectWindowOpen,
  getEffectWindowMessage,
  getCorrelationStatement,
  PROTECTION_DISCLAIMER,
  RESPONSIBILITY_LEVEL_LABELS,
  type ResponsibilityLevel,
} from '@/config/lambdaDecisionMapping';

// Decision type colors (neutral, no value judgment)
const DECISION_COLORS: Record<DecisionType, string> = {
  legislation: 'hsl(var(--primary))',
  budget: 'hsl(var(--secondary))',
  tax_change: 'hsl(200, 70%, 50%)',
  regulation: 'hsl(var(--muted-foreground))',
  infrastructure: 'hsl(35, 70%, 50%)',
  international: 'hsl(280, 50%, 50%)',
  reform: 'hsl(160, 60%, 45%)',
  crisis_response: 'hsl(0, 60%, 50%)',
};

interface Decision {
  id: string;
  title: string;
  type: DecisionType;
  decisionDate: string;
  effectiveDate: string;
  responsibilityLevel: ResponsibilityLevel;
  institution: string;
  expectedImpactAreas: string[];
  sourceUrl?: string;
  sourceDocument?: string;
  lifecycle: Partial<DecisionLifecycle>;
}

interface LambdaDecisionTimelineProps {
  decisions: Decision[];
  lambdaData: { date: string; value: number; uncertainty: number }[];
  language?: 'sv' | 'en';
  onDecisionClick?: (decisionId: string) => void;
}

export const LambdaDecisionTimeline: React.FC<LambdaDecisionTimelineProps> = ({
  decisions,
  lambdaData,
  language = 'sv',
  onDecisionClick,
}) => {
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);

  // Sort decisions by date
  const sortedDecisions = [...decisions].sort(
    (a, b) => new Date(a.decisionDate).getTime() - new Date(b.decisionDate).getTime()
  );

  // Calculate timeline range
  const dates = [...lambdaData.map(d => new Date(d.date)), ...decisions.map(d => new Date(d.decisionDate))];
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
  const range = maxDate.getTime() - minDate.getTime();

  const getPositionPercent = (dateStr: string) => {
    const date = new Date(dateStr);
    return ((date.getTime() - minDate.getTime()) / range) * 100;
  };

  // Calculate Lambda min/max for Y axis
  const lambdaValues = lambdaData.map(d => d.value);
  const minLambda = Math.min(...lambdaValues) - 0.1;
  const maxLambda = Math.max(...lambdaValues) + 0.1;
  const lambdaRange = maxLambda - minLambda;

  const getLambdaYPercent = (value: number) => {
    return 100 - ((value - minLambda) / lambdaRange) * 100;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {language === 'sv' ? 'Beslut & Lambda-tidslinje' : 'Decisions & Lambda Timeline'}
          </CardTitle>
          <CardDescription>
            {language === 'sv'
              ? 'Vertikala linjer = beslut. Klicka för detaljer.'
              : 'Vertical lines = decisions. Click for details.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Timeline Chart Area */}
          <div className="relative h-64 border rounded-lg p-4 bg-muted/20">
            {/* Lambda reference line at 1.0 */}
            <div 
              className="absolute left-4 right-4 border-t border-dashed border-muted-foreground/30"
              style={{ top: `${getLambdaYPercent(1.0)}%` }}
            >
              <span className="absolute -left-1 -translate-y-1/2 text-xs text-muted-foreground font-mono">
                1.0
              </span>
            </div>

            {/* Lambda line (simplified) */}
            <svg className="absolute inset-4" preserveAspectRatio="none">
              {/* Uncertainty band */}
              <path
                d={lambdaData.map((d, i) => {
                  const x = (i / (lambdaData.length - 1)) * 100;
                  const yTop = getLambdaYPercent(d.value + d.uncertainty);
                  return `${i === 0 ? 'M' : 'L'} ${x}% ${yTop}%`;
                }).join(' ') + lambdaData.slice().reverse().map((d, i) => {
                  const x = ((lambdaData.length - 1 - i) / (lambdaData.length - 1)) * 100;
                  const yBottom = getLambdaYPercent(d.value - d.uncertainty);
                  return `L ${x}% ${yBottom}%`;
                }).join(' ') + ' Z'}
                fill="hsl(var(--primary) / 0.1)"
              />
              
              {/* Main Lambda line */}
              <path
                d={lambdaData.map((d, i) => {
                  const x = (i / (lambdaData.length - 1)) * 100;
                  const y = getLambdaYPercent(d.value);
                  return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
                }).join(' ')}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
              />
            </svg>

            {/* Decision markers */}
            {sortedDecisions.map((decision) => {
              const xPos = getPositionPercent(decision.decisionDate);
              const isOpen = isEffectWindowOpen(decision.effectiveDate, decision.type);
              
              return (
                <button
                  key={decision.id}
                  onClick={() => setSelectedDecision(decision)}
                  className="absolute top-0 bottom-0 w-px hover:w-1 transition-all cursor-pointer group"
                  style={{ 
                    left: `calc(${xPos}% + 1rem)`,
                    backgroundColor: DECISION_COLORS[decision.type],
                    opacity: isOpen ? 1 : 0.5,
                  }}
                  title={decision.title}
                >
                  {/* Marker dot */}
                  <div 
                    className="absolute top-0 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-background"
                    style={{ backgroundColor: DECISION_COLORS[decision.type] }}
                  />
                  
                  {/* Tooltip on hover */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                      {decision.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
            {Object.entries(DECISION_TYPE_LABELS).map(([type, labels]) => (
              <div key={type} className="flex items-center gap-1.5 text-xs">
                <div 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: DECISION_COLORS[type as DecisionType] }}
                />
                <span className="text-muted-foreground">{labels[language]}</span>
              </div>
            ))}
          </div>

          {/* Protection disclaimer */}
          <div className="flex items-start gap-2 mt-4 p-3 bg-muted rounded-lg">
            <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              {PROTECTION_DISCLAIMER[language]}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Decision Detail Dialog */}
      <Dialog open={!!selectedDecision} onOpenChange={() => setSelectedDecision(null)}>
        <DialogContent className="max-w-lg">
          {selectedDecision && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-start gap-2">
                  <div 
                    className="w-3 h-3 rounded-full mt-1 shrink-0"
                    style={{ backgroundColor: DECISION_COLORS[selectedDecision.type] }}
                  />
                  {selectedDecision.title}
                </DialogTitle>
                <DialogDescription>
                  {DECISION_TYPE_LABELS[selectedDecision.type][language]}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {language === 'sv' ? 'Beslutsdatum' : 'Decision Date'}
                    </div>
                    <div className="font-mono text-sm">{selectedDecision.decisionDate}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {language === 'sv' ? 'Ikraftträdande' : 'Effective Date'}
                    </div>
                    <div className="font-mono text-sm">{selectedDecision.effectiveDate}</div>
                  </div>
                </div>

                {/* Responsibility */}
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {language === 'sv' ? 'Ansvar' : 'Responsibility'}
                  </div>
                  <div className="text-sm">
                    {RESPONSIBILITY_LEVEL_LABELS[selectedDecision.responsibilityLevel][language]}: {selectedDecision.institution}
                  </div>
                </div>

                {/* Latency window */}
                <div className="p-3 bg-muted rounded-lg space-y-2">
                  <div className="text-xs font-medium">
                    {language === 'sv' ? 'Effektfönster' : 'Effect Window'}
                  </div>
                  <div className="text-sm">
                    {LATENCY_RULES[selectedDecision.type].minMonths}–{LATENCY_RULES[selectedDecision.type].maxMonths} {language === 'sv' ? 'månader' : 'months'}
                    <span className="text-muted-foreground ml-2">
                      ({language === 'sv' ? 'typiskt' : 'typical'}: {LATENCY_RULES[selectedDecision.type].typical} {language === 'sv' ? 'mån' : 'mo'})
                    </span>
                  </div>
                  
                  {/* Effect window status */}
                  {(() => {
                    const message = getEffectWindowMessage(selectedDecision.effectiveDate, selectedDecision.type, language);
                    if (message) {
                      return (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {message}
                        </Badge>
                      );
                    }
                    return (
                      <Badge variant="secondary" className="text-xs">
                        {language === 'sv' ? 'Effektfönster öppet' : 'Effect window open'}
                      </Badge>
                    );
                  })()}
                </div>

                {/* Expected impact areas */}
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    {language === 'sv' ? 'Förväntade påverkansområden' : 'Expected Impact Areas'}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedDecision.expectedImpactAreas.map((area) => (
                      <Badge key={area} variant="outline" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Observed effect (if available) */}
                {selectedDecision.lifecycle.observedEffect && (
                  <div className="p-3 border rounded-lg space-y-2">
                    <div className="text-xs font-medium">
                      {language === 'sv' ? 'Observerad effekt' : 'Observed Effect'}
                    </div>
                    <p className="text-sm">
                      {getCorrelationStatement(selectedDecision.lifecycle.observedEffect.confidence, language)}
                    </p>
                  </div>
                )}

                {/* Source */}
                {selectedDecision.sourceUrl && (
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={selectedDecision.sourceUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {selectedDecision.sourceDocument || (language === 'sv' ? 'Källa' : 'Source')}
                    </a>
                  </Button>
                )}

                {/* No value words disclaimer */}
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Info className="h-3 w-3 mt-0.5 shrink-0" />
                  <p>
                    {language === 'sv'
                      ? 'Endast fakta visas. Inga värdeord eller tolkningar.'
                      : 'Only facts shown. No value words or interpretations.'}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LambdaDecisionTimeline;
