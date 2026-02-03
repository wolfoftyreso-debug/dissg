/**
 * DIAGNOSTIC CODE LIST COMPONENT
 * 
 * "Vad är fel, var, hur länge – och varför?"
 * 
 * Shows:
 * - Active and historical diagnostic codes
 * - Neutral descriptions
 * - Affected indices
 * - When detected
 * - Historical comparisons
 * - Confidence level
 * - PROBABLE CAUSES with examination schema
 * 
 * CRITICAL: No action suggestions. Only state descriptions.
 * NO ICONS - text only as per design doctrine.
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { DiagnosticCode } from '@/lib/lambda/diagnostic-codes';
import { 
  getSeverityColor, 
  getSeverityLabel, 
  getDomainLabel,
  formatDTCCode 
} from '@/lib/lambda/diagnostic-codes';
import { 
  analyzeProbableCauses, 
  formatProbability,
  getConfidenceLabel,
  type CauseAnalysis,
  type ProbableCause,
} from '@/lib/lambda/probable-cause-engine';

interface DiagnosticCodeListProps {
  activeCodes: DiagnosticCode[];
  historicalCodes: DiagnosticCode[];
  onCodeSelect?: (code: DiagnosticCode) => void;
  language?: 'sv' | 'en';
  className?: string;
}

export function DiagnosticCodeList({
  activeCodes,
  historicalCodes,
  onCodeSelect,
  language = 'sv',
  className,
}: DiagnosticCodeListProps) {
  const [expandedCodes, setExpandedCodes] = useState<Set<string>>(new Set());
  
  const toggleExpanded = (code: string) => {
    const next = new Set(expandedCodes);
    if (next.has(code)) {
      next.delete(code);
    } else {
      next.add(code);
    }
    setExpandedCodes(next);
  };
  
  const labels = {
    active: { sv: 'Aktiva', en: 'Active' },
    historical: { sv: 'Historik', en: 'Historical' },
    noActiveCodes: { sv: 'Inga aktiva diagnostikkoder', en: 'No active diagnostic codes' },
    noHistoricalCodes: { sv: 'Ingen historik tillgänglig', en: 'No history available' },
    detectedAt: { sv: 'Upptäckt', en: 'Detected' },
    lastConfirmed: { sv: 'Senast bekräftad', en: 'Last confirmed' },
    occurrences: { sv: 'Förekomster', en: 'Occurrences' },
    confidence: { sv: 'Konfidens', en: 'Confidence' },
    affectedIndices: { sv: 'Påverkade index', en: 'Affected indices' },
    relatedCodes: { sv: 'Relaterade koder', en: 'Related codes' },
    threshold: { sv: 'Tröskel', en: 'Threshold' },
    observed: { sv: 'Observerat', en: 'Observed' },
    triangulation: { sv: 'Triangulering', en: 'Triangulation' },
    sources: { sv: 'Källor', en: 'Sources' },
    stateOnly: { sv: 'Endast tillståndsbeskrivning – inga åtgärdsförslag', en: 'State description only – no action suggestions' },
    probableCauses: { sv: 'Sannolika orsaker', en: 'Probable causes' },
    examinationSchema: { sv: 'Kontrollschema', en: 'Examination schema' },
    unexplained: { sv: 'Oförklarat', en: 'Unexplained' },
  };
  
  return (
    <div className={cn('space-y-6', className)}>
      {/* Mandatory disclaimer */}
      <div className="rounded-lg border border-dashed p-4 bg-muted/30">
        <p className="text-sm text-muted-foreground text-center">
          {labels.stateOnly[language]}
        </p>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="active" className="flex items-center gap-2 font-mono text-xs">
            {labels.active[language]}
            {activeCodes.length > 0 && (
              <Badge variant="secondary" className="ml-1 font-mono">
                {activeCodes.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="historical" className="font-mono text-xs">
            {labels.historical[language]}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4 space-y-3">
          {activeCodes.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {labels.noActiveCodes[language]}
              </CardContent>
            </Card>
          ) : (
            activeCodes.map((code) => (
              <DiagnosticCodeCard
                key={code.code}
                code={code}
                isExpanded={expandedCodes.has(code.code)}
                onToggle={() => toggleExpanded(code.code)}
                onSelect={onCodeSelect}
                language={language}
                labels={labels}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="historical" className="mt-4 space-y-3">
          {historicalCodes.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {labels.noHistoricalCodes[language]}
              </CardContent>
            </Card>
          ) : (
            historicalCodes.map((code) => (
              <DiagnosticCodeCard
                key={`${code.code}-${code.first_detected}`}
                code={code}
                isExpanded={expandedCodes.has(code.code)}
                onToggle={() => toggleExpanded(code.code)}
                onSelect={onCodeSelect}
                language={language}
                labels={labels}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// =============================================================================
// DIAGNOSTIC CODE CARD
// =============================================================================

interface DiagnosticCodeCardProps {
  code: DiagnosticCode;
  isExpanded: boolean;
  onToggle: () => void;
  onSelect?: (code: DiagnosticCode) => void;
  language: 'sv' | 'en';
  labels: Record<string, Record<'sv' | 'en', string>>;
}

function DiagnosticCodeCard({
  code,
  isExpanded,
  onToggle,
  onSelect,
  language,
  labels,
}: DiagnosticCodeCardProps) {
  const severityColor = getSeverityColor(code.severity);
  
  // Get probable causes analysis
  const causeAnalysis = isExpanded 
    ? analyzeProbableCauses(code.code, 'GLOBAL')
    : null;
  
  return (
    <Card className={cn(
      'transition-colors',
      code.status === 'active' && 'border-l-4',
    )} style={{ borderLeftColor: code.status === 'active' ? severityColor : undefined }}>
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Expand indicator - text */}
                <span className="text-xs text-muted-foreground font-mono w-4">
                  {isExpanded ? '−' : '+'}
                </span>
                
                {/* Code badge */}
                <Badge 
                  variant="outline" 
                  className="font-mono"
                  style={{ borderColor: severityColor, color: severityColor }}
                >
                  {formatDTCCode(code.code)}
                </Badge>
                
                {/* Severity */}
                <Badge variant="secondary" className="text-xs font-mono">
                  {getSeverityLabel(code.severity, language)}
                </Badge>
                
                {/* Domain */}
                <span className="text-xs text-muted-foreground font-mono">
                  {getDomainLabel(code.domain, language)}
                </span>
              </div>
              
              {/* Confidence */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">
                    {labels.confidence[language]}
                  </span>
                  <span className="ml-2 font-mono text-sm">
                    {(code.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                
                {/* Triangulation indicator - text only */}
                <TriangulationBadge status={code.triangulation_status} language={language} />
              </div>
            </div>
            
            {/* Title */}
            <CardTitle className="text-base font-medium mt-2 ml-7">
              {language === 'sv' ? code.title_sv : code.title_en}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4 space-y-4">
            {/* Description */}
            <p className="text-sm text-muted-foreground ml-7">
              {language === 'sv' ? code.description_sv : code.description_en}
            </p>
            
            {/* Details grid */}
            <div className="grid gap-4 md:grid-cols-2 ml-7">
              {/* Timing */}
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {labels.detectedAt[language]}
                </div>
                <p className="text-sm font-mono">
                  {new Date(code.first_detected).toLocaleDateString()}
                </p>
                
                <div className="flex items-center gap-4 text-xs">
                  <span>
                    {labels.occurrences[language]}: <strong className="font-mono">{code.occurrence_count}</strong>
                  </span>
                  <span className="font-mono">
                    {code.duration_hours}h
                  </span>
                </div>
              </div>
              
              {/* Values */}
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {labels.observed[language]} vs {labels.threshold[language]}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-mono font-bold">
                    {code.observed_value.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground font-mono">
                    / {code.threshold_value} {code.unit}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Affected indices */}
            {code.related_kpi_codes.length > 0 && (
              <div className="ml-7">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
                  {labels.affectedIndices[language]}
                </div>
                <div className="flex flex-wrap gap-1">
                  {code.related_kpi_codes.map((kpi) => (
                    <Badge key={kpi} variant="outline" className="text-xs font-mono">
                      {kpi}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Related codes */}
            {code.related_dtcs.length > 0 && (
              <div className="ml-7">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
                  {labels.relatedCodes[language]}
                </div>
                <div className="flex flex-wrap gap-1">
                  {code.related_dtcs.map((dtc) => (
                    <Badge key={dtc} variant="secondary" className="text-xs font-mono">
                      {formatDTCCode(dtc)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* PROBABLE CAUSES SECTION */}
            {causeAnalysis && causeAnalysis.probable_causes.length > 0 && (
              <div className="ml-7 mt-6 pt-4 border-t">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">
                  {labels.probableCauses[language]}
                </div>
                
                <ProbableCausesList 
                  analysis={causeAnalysis} 
                  language={language}
                  labels={labels}
                />
              </div>
            )}
            
            {/* Data sources */}
            <div className="ml-7 pt-2 border-t">
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                {labels.sources[language]}
              </div>
              <p className="text-xs font-mono text-muted-foreground">
                {code.data_sources.join(', ')}
              </p>
            </div>
            
            {/* Action button */}
            {onSelect && (
              <div className="ml-7 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelect(code)}
                  className="font-mono text-xs"
                >
                  {language === 'sv' ? 'Visa detaljer →' : 'View details →'}
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

// =============================================================================
// PROBABLE CAUSES LIST
// =============================================================================

interface ProbableCausesListProps {
  analysis: CauseAnalysis;
  language: 'sv' | 'en';
  labels: Record<string, Record<'sv' | 'en', string>>;
}

function ProbableCausesList({ analysis, language, labels }: ProbableCausesListProps) {
  return (
    <div className="space-y-3">
      {analysis.probable_causes.map((cause, index) => (
        <ProbableCauseItem 
          key={cause.id} 
          cause={cause} 
          rank={index + 1}
          language={language}
          labels={labels}
        />
      ))}
      
      {/* Unexplained variance */}
      <div className="flex items-center justify-between p-3 rounded bg-muted/50">
        <span className="text-sm text-muted-foreground">
          {labels.unexplained[language]} / {language === 'sv' ? 'Okänd faktor' : 'Unknown factor'}
        </span>
        <span className="font-mono text-sm font-medium">
          {formatProbability(analysis.unexplained_variance)}
        </span>
      </div>
      
      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground italic mt-2">
        {analysis.disclaimer}
      </p>
    </div>
  );
}

// =============================================================================
// PROBABLE CAUSE ITEM
// =============================================================================

interface ProbableCauseItemProps {
  cause: ProbableCause;
  rank: number;
  language: 'sv' | 'en';
  labels: Record<string, Record<'sv' | 'en', string>>;
}

function ProbableCauseItem({ cause, rank, language, labels }: ProbableCauseItemProps) {
  const [showSchema, setShowSchema] = useState(false);
  
  return (
    <div className="border rounded-lg p-3 space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-mono font-bold">
            {rank}
          </span>
          <div>
            <h5 className="text-sm font-medium">
              {language === 'sv' ? cause.cause_sv : cause.cause_en}
            </h5>
            <p className="text-xs text-muted-foreground">
              {language === 'sv' ? cause.mechanism_sv : cause.mechanism_en}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-mono font-bold">
            {formatProbability(cause.probability)}
          </span>
          <p className="text-xs text-muted-foreground">
            {getConfidenceLabel(cause.confidence_level, language)}
          </p>
        </div>
      </div>
      
      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>
          {language === 'sv' ? 'Historiska fall' : 'Historical cases'}: {cause.historical_occurrences}
        </span>
        <span className="font-mono">
          {cause.geo_contexts.slice(0, 3).join(', ')}
        </span>
      </div>
      
      {/* Examination schema toggle */}
      <button
        onClick={() => setShowSchema(!showSchema)}
        className="text-xs text-primary hover:underline font-medium"
      >
        {showSchema 
          ? (language === 'sv' ? 'Dölj kontrollschema' : 'Hide examination schema')
          : (language === 'sv' ? 'Visa kontrollschema →' : 'Show examination schema →')
        }
      </button>
      
      {/* Examination schema */}
      {showSchema && cause.examination_schema.length > 0 && (
        <div className="mt-2 pt-2 border-t space-y-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {labels.examinationSchema[language]}
          </p>
          <div className="space-y-1">
            {cause.examination_schema.map((item) => (
              <div key={item.indicator_code} className="flex items-center justify-between text-xs p-2 rounded bg-muted/30">
                <div>
                  <span className="font-mono">{item.indicator_code}</span>
                  <span className="text-muted-foreground ml-2">
                    {language === 'sv' ? item.indicator_name_sv : item.indicator_name_en}
                  </span>
                </div>
                <span className="text-muted-foreground font-mono">
                  {item.expected_if_cause_true}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// TRIANGULATION BADGE - TEXT ONLY
// =============================================================================

interface TriangulationBadgeProps {
  status: 'confirmed' | 'partial' | 'single_source';
  language: 'sv' | 'en';
}

function TriangulationBadge({ status, language }: TriangulationBadgeProps) {
  const config = {
    confirmed: {
      color: 'text-blue-500',
      label: { sv: '3+ källor', en: '3+ sources' },
    },
    partial: {
      color: 'text-amber-500',
      label: { sv: '2 källor', en: '2 sources' },
    },
    single_source: {
      color: 'text-muted-foreground',
      label: { sv: '1 källa', en: '1 source' },
    },
  };
  
  const { color, label } = config[status];
  
  return (
    <span className={cn('text-xs font-mono', color)}>
      [{label[language]}]
    </span>
  );
}

export default DiagnosticCodeList;
