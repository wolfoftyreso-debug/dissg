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
 * 
 * CRITICAL: No action suggestions. Only state descriptions.
 */

import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, Database, Link2, TrendingUp } from 'lucide-react';
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
          <TabsTrigger value="active" className="flex items-center gap-2">
            {labels.active[language]}
            {activeCodes.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeCodes.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="historical">
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
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                
                {/* Code badge */}
                <Badge 
                  variant="outline" 
                  className="font-mono"
                  style={{ borderColor: severityColor, color: severityColor }}
                >
                  {formatDTCCode(code.code)}
                </Badge>
                
                {/* Severity */}
                <Badge variant="secondary" className="text-xs">
                  {getSeverityLabel(code.severity, language)}
                </Badge>
                
                {/* Domain */}
                <span className="text-xs text-muted-foreground">
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
                
                {/* Triangulation indicator */}
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
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {labels.detectedAt[language]}
                </div>
                <p className="text-sm font-mono">
                  {new Date(code.first_detected).toLocaleDateString()}
                </p>
                
                <div className="flex items-center gap-4 text-xs">
                  <span>
                    {labels.occurrences[language]}: <strong>{code.occurrence_count}</strong>
                  </span>
                  <span>
                    {code.duration_hours}h
                  </span>
                </div>
              </div>
              
              {/* Values */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  {labels.observed[language]} vs {labels.threshold[language]}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-mono font-bold">
                    {code.observed_value.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {code.threshold_value} {code.unit}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Affected indices */}
            {code.related_kpi_codes.length > 0 && (
              <div className="ml-7">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Database className="h-3 w-3" />
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
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Link2 className="h-3 w-3" />
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
            
            {/* Data sources */}
            <div className="ml-7 pt-2 border-t">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
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
                >
                  {language === 'sv' ? 'Visa detaljer' : 'View details'}
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
// TRIANGULATION BADGE
// =============================================================================

interface TriangulationBadgeProps {
  status: 'confirmed' | 'partial' | 'single_source';
  language: 'sv' | 'en';
}

function TriangulationBadge({ status, language }: TriangulationBadgeProps) {
  const config = {
    confirmed: {
      color: 'bg-blue-500',
      label: { sv: '3+ källor', en: '3+ sources' },
    },
    partial: {
      color: 'bg-amber-500',
      label: { sv: '2 källor', en: '2 sources' },
    },
    single_source: {
      color: 'bg-muted',
      label: { sv: '1 källa', en: '1 source' },
    },
  };
  
  const { color, label } = config[status];
  
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn('w-2 h-2 rounded-full', color)} />
      <span className="text-xs text-muted-foreground">
        {label[language]}
      </span>
    </div>
  );
}

export default DiagnosticCodeList;
