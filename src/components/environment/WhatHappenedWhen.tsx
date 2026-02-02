/**
 * "WHAT HAPPENED WHEN..." VIEWER
 * 
 * Focus on outcomes, not rhetoric.
 * Show historical examples across multiple countries and periods.
 * Always show exceptions.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ENVIRONMENT_INDICATORS,
  type EnvironmentCoreIndicators,
  type WhatHappenedWhenResult,
  type AttributionConfidence
} from '@/lib/environment';
import { CorrelationWarning } from './CorrelationWarning';
import { Search, TrendingUp, TrendingDown, AlertCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface WhatHappenedWhenProps {
  availableQueries: {
    id: string;
    label: string;
    condition: string;
  }[];
  result?: WhatHappenedWhenResult;
  onSearch: (queryId: string) => void;
  isSearching?: boolean;
}

function AttributionBadge({ confidence }: { confidence: AttributionConfidence }) {
  const getColor = () => {
    switch (confidence.level) {
      case 'very_high': return 'border-chart-2 text-chart-2';
      case 'high': return 'border-chart-2/70 text-chart-2/70';
      case 'medium': return 'border-warning text-warning';
      case 'low': return 'border-destructive/70 text-destructive/70';
      case 'very_low': return 'border-destructive text-destructive';
    }
  };
  
  const getLabel = () => {
    switch (confidence.level) {
      case 'very_high': return 'Mycket hög';
      case 'high': return 'Hög';
      case 'medium': return 'Måttlig';
      case 'low': return 'Låg';
      case 'very_low': return 'Mycket låg';
    }
  };
  
  return (
    <Badge variant="outline" className={cn("text-xs", getColor())}>
      {getLabel()} attribuering
    </Badge>
  );
}

function CaseCard({ 
  caseData 
}: { 
  caseData: WhatHappenedWhenResult['cases'][0];
}) {
  const [expanded, setExpanded] = useState(false);
  
  const changePercent = caseData.conditionChange.before !== 0 
    ? ((caseData.conditionChange.after - caseData.conditionChange.before) / Math.abs(caseData.conditionChange.before)) * 100
    : 0;
  
  const indicatorChangePercent = caseData.indicatorChange.before !== 0
    ? ((caseData.indicatorChange.after - caseData.indicatorChange.before) / Math.abs(caseData.indicatorChange.before)) * 100
    : 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-medium">{caseData.countryOrRegion}</p>
            <p className="text-sm text-muted-foreground">
              {caseData.periodStart}–{caseData.periodEnd}
            </p>
          </div>
          <AttributionBadge confidence={caseData.attributionConfidence} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          {/* Condition change */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Villkorsförändring</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold tabular-nums">
                {changePercent > 0 ? '+' : ''}{changePercent.toFixed(0)}%
              </span>
              {changePercent > 0 ? (
                <TrendingUp className="w-4 h-4 text-chart-2" />
              ) : changePercent < 0 ? (
                <TrendingDown className="w-4 h-4 text-destructive" />
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground">
              {caseData.conditionChange.before} → {caseData.conditionChange.after} {caseData.conditionChange.unit}
            </p>
          </div>
          
          {/* Indicator change */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Indikatorförändring</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold tabular-nums">
                {indicatorChangePercent > 0 ? '+' : ''}{indicatorChangePercent.toFixed(0)}%
              </span>
              {indicatorChangePercent > 0 ? (
                <TrendingUp className="w-4 h-4 text-chart-2" />
              ) : indicatorChangePercent < 0 ? (
                <TrendingDown className="w-4 h-4 text-destructive" />
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground">
              {caseData.indicatorChange.before} → {caseData.indicatorChange.after} {caseData.indicatorChange.unit}
            </p>
          </div>
        </div>
        
        {/* Confounding factors */}
        {caseData.confoundingFactors.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-sm text-muted-foreground min-h-[44px] pt-2 border-t border-border"
          >
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {caseData.confoundingFactors.length} potentiella confounders
            </span>
            <ChevronRight className={cn(
              "w-4 h-4 transition-transform",
              expanded && "rotate-90"
            )} />
          </button>
        )}
        
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-2">
                <p className="text-xs font-medium text-destructive">
                  Faktorer som kan påverka sambandet:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {caseData.confoundingFactors.map((factor, i) => (
                    <li key={i}>• {factor}</li>
                  ))}
                </ul>
                
                {caseData.attributionConfidence.alternativeExplanations.length > 0 && (
                  <>
                    <p className="text-xs font-medium text-warning mt-3">
                      Alternativa förklaringar:
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {caseData.attributionConfidence.alternativeExplanations.map((alt, i) => (
                        <li key={i}>• {alt}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export function WhatHappenedWhen({
  availableQueries,
  result,
  onSearch,
  isSearching
}: WhatHappenedWhenProps) {
  const [selectedQuery, setSelectedQuery] = useState('');

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">What Happened When...</h2>
        <p className="text-sm text-muted-foreground">
          Utforska historiska utfall – inte retorik
        </p>
      </div>

      {/* LOCKED correlation warning */}
      <CorrelationWarning language="sv" />

      {/* Query selector */}
      <Card>
        <CardContent className="py-4 space-y-4">
          <Select value={selectedQuery} onValueChange={setSelectedQuery}>
            <SelectTrigger className="min-h-[44px]">
              <SelectValue placeholder="Välj fråga att utforska..." />
            </SelectTrigger>
            <SelectContent>
              {availableQueries.map(q => (
                <SelectItem key={q.id} value={q.id}>
                  {q.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={() => onSearch(selectedQuery)}
            className="w-full min-h-[44px]"
            disabled={!selectedQuery || isSearching}
          >
            {isSearching ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Söker historiska fall...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Visa historiska utfall
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result.query.condition}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Query summary */}
            <Card className="bg-muted/30">
              <CardContent className="py-3">
                <p className="text-sm">
                  <span className="text-muted-foreground">Fråga:</span>{' '}
                  <span className="font-medium">"{result.query.condition}"</span>
                  <span className="text-muted-foreground">
                    {' '}({result.query.timePeriod.start}–{result.query.timePeriod.end})
                  </span>
                </p>
              </CardContent>
            </Card>

            {/* Cases */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">
                {result.cases.length} historiska fall
              </h3>
              
              {result.cases.map((c, i) => (
                <CaseCard key={`${c.countryOrRegion}-${c.periodStart}`} caseData={c} />
              ))}
            </div>

            {/* Observed pattern */}
            {result.observedPattern && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="py-4">
                  <h4 className="text-sm font-medium mb-2">Observerat mönster</h4>
                  <p className="text-sm">{result.observedPattern.statement}</p>
                  
                  <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="text-chart-2">
                      {result.observedPattern.casesSupporting} stödjer
                    </span>
                    <span className="text-destructive">
                      {result.observedPattern.casesContradicting} motsäger
                    </span>
                  </div>
                  
                  {result.observedPattern.limitations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs font-medium text-destructive mb-1">
                        Begränsningar:
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-0.5">
                        {result.observedPattern.limitations.map((lim, i) => (
                          <li key={i}>• {lim}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* What this does NOT show */}
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="py-4">
                <h4 className="text-sm font-medium text-destructive mb-2">
                  Vad denna analys INTE visar:
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {result.whatThisDoesNotShow.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
