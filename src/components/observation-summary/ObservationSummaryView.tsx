/**
 * OBSERVATION SUMMARY VIEW
 * 
 * Complete 6-block summary display.
 * Every statement is clickable to raw data.
 * Text-only design following spotless UI protocol.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SummaryBlock } from './SummaryBlock';
import type { ObservationSummary } from '@/types/observation-summary';

interface ObservationSummaryViewProps {
  summary: ObservationSummary;
  onViewRawData?: (link: string) => void;
  language?: 'en' | 'sv';
}

export function ObservationSummaryView({ 
  summary, 
  onViewRawData,
  language = 'sv' 
}: ObservationSummaryViewProps) {
  
  const labels = {
    title: language === 'sv' ? 'Observationssammanfattning' : 'Observation Summary',
    subtitle: language === 'sv' 
      ? 'Under den valda perioden visar data följande' 
      : 'During the selected period, data shows the following',
    scope: language === 'sv' ? 'Omfattning' : 'Scope',
    scopeSubtitle: language === 'sv' ? 'Vad tittar vi på?' : 'What are we looking at?',
    changes: language === 'sv' ? 'Observerade förändringar' : 'Observed Changes',
    changesSubtitle: language === 'sv' ? 'Vad rörde sig?' : 'What moved?',
    position: language === 'sv' ? 'Relativ position' : 'Relative Position',
    positionSubtitle: language === 'sv' ? 'Hur står det i relation till andra?' : 'How does it compare?',
    context: language === 'sv' ? 'Samvariation & kontext' : 'Co-movement & Context',
    contextSubtitle: language === 'sv' ? 'Vad rörde sig samtidigt?' : 'What moved together?',
    stability: language === 'sv' ? 'Stabilitet & signaler' : 'Stability & Risk Signals',
    stabilitySubtitle: language === 'sv' ? 'Hur stabilt är mönstret?' : 'How stable is the pattern?',
    limits: language === 'sv' ? 'Begränsningar' : 'Limits & Non-claims',
    limitsSubtitle: language === 'sv' ? 'Vad säger detta inte?' : 'What does this NOT say?'
  };
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">{labels.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{labels.subtitle}</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>Domän: {summary.domain}</span>
            <span>Period: {summary.scope.period_start} – {summary.scope.period_end}</span>
            <span>Version: {summary.version}</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Block 1: Scope */}
      <SummaryBlock
        number={1}
        title={labels.scope}
        subtitle={labels.scopeSubtitle}
        generatedText={summary.scope.generated_text}
      >
        <div className="space-y-2 text-xs">
          <div>
            <span className="text-muted-foreground">Objekt: </span>
            <span className="font-medium">{summary.scope.object_name}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Period: </span>
            <span>{summary.scope.period_start} till {summary.scope.period_end}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Källor: </span>
            {summary.scope.data_sources.map((source, i) => (
              <button
                key={i}
                onClick={() => onViewRawData?.(source.url || `/source/${source.code}`)}
                className="text-primary hover:underline mr-2"
              >
                {source.name}
              </button>
            ))}
          </div>
        </div>
      </SummaryBlock>
      
      {/* Block 2: Observed Changes */}
      <SummaryBlock
        number={2}
        title={labels.changes}
        subtitle={labels.changesSubtitle}
        generatedText={summary.observed_changes.generated_text}
      >
        <div className="space-y-2">
          {summary.observed_changes.changes.map((change, i) => (
            <div 
              key={i} 
              className="flex justify-between items-center text-xs p-2 rounded bg-muted/50 border border-border/50"
            >
              <div>
                <button
                  onClick={() => onViewRawData?.(change.raw_data_link)}
                  className="font-medium hover:text-primary hover:underline"
                >
                  {change.indicator_name}
                </button>
                <span className="text-muted-foreground ml-2">
                  {change.direction === 'increased' && '↑'}
                  {change.direction === 'decreased' && '↓'}
                  {change.direction === 'varied' && '↕'}
                  {change.direction === 'remained_stable' && '—'}
                  {' '}{change.direction.replace('_', ' ')}
                </span>
              </div>
              <span className="text-muted-foreground px-2 py-0.5 rounded bg-background border border-border">
                {change.change_type.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </SummaryBlock>
      
      {/* Block 3: Relative Position */}
      <SummaryBlock
        number={3}
        title={labels.position}
        subtitle={labels.positionSubtitle}
        generatedText={summary.relative_position.generated_text}
      >
        <div className="space-y-2 text-xs">
          {summary.relative_position.comparisons.map((comp, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-muted-foreground">
                vs {comp.reference_group} ({comp.reference_group_size} enheter)
              </span>
              <span className="px-2 py-0.5 rounded bg-muted border border-border">
                {comp.position.replace('_', ' ')}
                {comp.percentile && ` (P${comp.percentile})`}
              </span>
            </div>
          ))}
        </div>
      </SummaryBlock>
      
      {/* Block 4: Co-movement & Context */}
      <SummaryBlock
        number={4}
        title={labels.context}
        subtitle={labels.contextSubtitle}
        generatedText={summary.comovement_context.generated_text}
      >
        <div className="space-y-3 text-xs">
          {/* Co-movements */}
          {summary.comovement_context.comovements.length > 0 && (
            <div>
              <p className="text-muted-foreground mb-1">Samvariation:</p>
              <div className="space-y-1">
                {summary.comovement_context.comovements.map((cm, i) => (
                  <div key={i} className="flex justify-between items-center p-1.5 rounded bg-muted/50">
                    <span>{cm.variable_name}</span>
                    <span className="font-mono">r={cm.correlation.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Also moved */}
          {summary.comovement_context.also_moved.length > 0 && (
            <div>
              <p className="text-muted-foreground mb-1">Rörde sig också:</p>
              <div className="flex flex-wrap gap-1">
                {summary.comovement_context.also_moved.map((v, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-muted border border-border">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Didn't move */}
          {summary.comovement_context.did_not_move.length > 0 && (
            <div>
              <p className="text-muted-foreground mb-1">Rörde sig inte:</p>
              <div className="flex flex-wrap gap-1">
                {summary.comovement_context.did_not_move.map((v, i) => (
                  <span key={i} className="px-2 py-0.5 rounded border border-border opacity-60">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </SummaryBlock>
      
      {/* Block 5: Stability & Risk Signals */}
      <SummaryBlock
        number={5}
        title={labels.stability}
        subtitle={labels.stabilitySubtitle}
        generatedText={summary.stability_risk.generated_text}
      >
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Övergripande stabilitet:</span>
            <span className="px-2 py-0.5 rounded bg-muted border border-border font-medium">
              {summary.stability_risk.overall_stability}
            </span>
          </div>
          
          {summary.stability_risk.signals.map((signal, i) => (
            <div key={i} className="flex justify-between items-center p-1.5 rounded bg-muted/50">
              <span className="text-muted-foreground">{signal.dimension}</span>
              <span>{signal.signal_type} ({Math.round(signal.score * 100)}%)</span>
            </div>
          ))}
        </div>
      </SummaryBlock>
      
      {/* Block 6: Limits & Non-claims (MOST IMPORTANT) */}
      <SummaryBlock
        number={6}
        title={labels.limits}
        subtitle={labels.limitsSubtitle}
        generatedText={summary.limits_nonclaims.generated_text}
        isRequired={true}
      >
        <div className="space-y-3 text-xs">
          {/* Does not assess */}
          <div>
            <p className="text-muted-foreground font-medium mb-1">
              {language === 'sv' ? 'Bedömer INTE:' : 'Does NOT assess:'}
            </p>
            <ul className="space-y-0.5 ml-4">
              {summary.limits_nonclaims.does_not_assess.map((item, i) => (
                <li key={i} className="list-disc text-muted-foreground">{item}</li>
              ))}
            </ul>
          </div>
          
          {/* Data limitations */}
          <div>
            <p className="text-muted-foreground font-medium mb-1">
              {language === 'sv' ? 'Databegränsningar:' : 'Data limitations:'}
            </p>
            <ul className="space-y-0.5 ml-4">
              {summary.limits_nonclaims.data_limitations.map((item, i) => (
                <li key={i} className="list-disc text-muted-foreground">{item}</li>
              ))}
            </ul>
          </div>
          
          {/* Methodology caveats */}
          {summary.limits_nonclaims.methodology_caveats.length > 0 && (
            <div>
              <p className="text-muted-foreground font-medium mb-1">
                {language === 'sv' ? 'Metodförvarningar:' : 'Methodology caveats:'}
              </p>
              <ul className="space-y-0.5 ml-4">
                {summary.limits_nonclaims.methodology_caveats.map((item, i) => (
                  <li key={i} className="list-disc text-muted-foreground">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </SummaryBlock>
      
      {/* Mandatory Disclaimer */}
      <Card className="border-border bg-muted/30">
        <CardContent className="py-3">
          <p className="text-xs text-muted-foreground italic text-center">
            {summary.disclaimer}
          </p>
          <p className="text-[10px] text-muted-foreground text-center mt-2 font-mono">
            Hash: {summary.verification_hash.slice(0, 24)}...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
