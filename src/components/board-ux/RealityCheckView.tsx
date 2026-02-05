/**
 * REALITY CHECK VIEW — PDRC UX
 * 
 * Two columns: Then (expected) | Now (outcome)
 * Marks deviations, whether known, whether ignored.
 * No red warnings. Just clear structure.
 */

import { cn } from '@/lib/utils';
import type { RealityCheckResult, ExpectedRange, ObservedOutcome, Deviation, LearningPoint } from '@/core/board-decision/reality-check';

interface RealityCheckViewProps {
  result: RealityCheckResult;
}

export function RealityCheckView({ result }: RealityCheckViewProps) {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="font-mono text-sm text-muted-foreground mb-2">
          [PDRC] {result.reality_check_id}
        </div>
        <h1 className="font-mono text-lg">
          Verklighetsavstämning
        </h1>
        <p className="font-mono text-sm text-muted-foreground mt-1">
          Beslut: {result.decision_taken} | DPD: {result.dpd_id}
        </p>
      </header>

      {/* Summary */}
      <div className="border p-4 mb-8 font-mono text-sm">
        <h2 className="text-muted-foreground mb-2">SAMMANFATTNING</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-muted-foreground">DIMENSIONER</div>
            <div>{result.summary.total_dimensions}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">INOM FÖRVÄNTAN</div>
            <div>{result.summary.deviations_within_expected}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">UTANFÖR FÖRVÄNTAN</div>
            <div className={cn(
              result.summary.deviations_outside_expected > 0 && "font-bold"
            )}>
              {result.summary.deviations_outside_expected}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">EJ FLAGGADE RISKER</div>
            <div className={cn(
              result.summary.unflagged_risks_materialized > 0 && "font-bold"
            )}>
              {result.summary.unflagged_risks_materialized}
            </div>
          </div>
        </div>
      </div>

      {/* Two columns: Then | Now */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* THEN - Expected at decision time */}
        <div className="border p-4 md:p-6">
          <h2 className="font-mono text-sm text-muted-foreground mb-4">
            DÅ (ANTAGET VID BESLUT)
          </h2>
          
          <div className="space-y-4 font-mono text-sm">
            {result.expected_ranges.map((range, i) => (
              <ExpectedRangeRow key={i} range={range} />
            ))}
          </div>
        </div>

        {/* NOW - Observed outcomes */}
        <div className="border p-4 md:p-6">
          <h2 className="font-mono text-sm text-muted-foreground mb-4">
            NU (OBSERVERAT UTFALL)
          </h2>
          
          <div className="space-y-4 font-mono text-sm">
            {result.actual_outcomes.map((outcome, i) => (
              <ObservedOutcomeRow 
                key={i} 
                outcome={outcome} 
                deviation={result.deviations.find(d => d.dimension === outcome.dimension)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Deviations */}
      {result.deviations.length > 0 && (
        <div className="border p-4 md:p-6 mb-8">
          <h2 className="font-mono text-sm text-muted-foreground mb-4">
            AVVIKELSER
          </h2>
          
          <div className="space-y-4 font-mono text-sm">
            {result.deviations.map((deviation, i) => (
              <DeviationRow key={i} deviation={deviation} />
            ))}
          </div>
        </div>
      )}

      {/* Learnings */}
      {result.learning.length > 0 && (
        <div className="border p-4 md:p-6">
          <h2 className="font-mono text-sm text-muted-foreground mb-4">
            LÄRDOMAR
          </h2>
          
          <div className="space-y-3 font-mono text-sm">
            {result.learning.map((learning, i) => (
              <LearningRow key={i} learning={learning} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ExpectedRangeRow({ range }: { range: ExpectedRange }) {
  return (
    <div className="border-l-2 border-muted pl-3">
      <div className="text-muted-foreground text-xs mb-1">
        {range.dimension.toUpperCase()}
        {range.was_flagged && <span className="ml-2">[FLAGGAD]</span>}
      </div>
      <div>
        {range.expected}
      </div>
      <div className="text-muted-foreground text-xs mt-1">
        Osäkerhet vid beslut: {range.uncertainty_level}
      </div>
    </div>
  );
}

function ObservedOutcomeRow({ 
  outcome, 
  deviation 
}: { 
  outcome: ObservedOutcome; 
  deviation?: Deviation;
}) {
  const hasDeviation = deviation && (deviation.severity === 'high' || deviation.severity === 'critical');
  
  return (
    <div className={cn(
      "border-l-2 pl-3",
      hasDeviation ? "border-foreground" : "border-muted"
    )}>
      <div className="text-muted-foreground text-xs mb-1">
        {outcome.dimension.toUpperCase()}
        {hasDeviation && <span className="ml-2">[AVVIKELSE]</span>}
      </div>
      <div className={cn(hasDeviation && "font-bold")}>
        {outcome.observed}
      </div>
      <div className="text-muted-foreground text-xs mt-1">
        Källa: {outcome.data_source} | {outcome.measurement_date}
      </div>
    </div>
  );
}

function DeviationRow({ deviation }: { deviation: Deviation }) {
  return (
    <div className="border p-3">
      <div className="flex justify-between items-start mb-2">
        <span className="font-bold">{deviation.dimension.toUpperCase()}</span>
        <span className={cn(
          "text-xs px-2 py-0.5 border",
          deviation.severity === 'high' && "border-foreground",
          deviation.severity === 'critical' && "bg-foreground text-background"
        )}>
          {deviation.severity.toUpperCase()}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-2">
        <div>
          <div className="text-xs">FÖRVÄNTAT</div>
          <div>{deviation.expected}</div>
        </div>
        <div>
          <div className="text-xs">OBSERVERAT</div>
          <div>{deviation.observed}</div>
        </div>
      </div>
      
      <div className="flex gap-4 text-xs">
        <span className={cn(
          deviation.was_flagged_pre_decision 
            ? "text-foreground" 
            : "text-muted-foreground"
        )}>
          {deviation.was_flagged_pre_decision 
            ? "[KÄND PRE-BESLUT]" 
            : "[EJ FLAGGAD]"}
        </span>
        <span className={cn(
          deviation.within_expected_uncertainty 
            ? "text-muted-foreground" 
            : "text-foreground"
        )}>
          {deviation.within_expected_uncertainty 
            ? "[INOM FÖRVÄNTAN]" 
            : "[UTANFÖR FÖRVÄNTAN]"}
        </span>
      </div>
    </div>
  );
}

function LearningRow({ learning }: { learning: LearningPoint }) {
  return (
    <div className="border-l-2 border-muted pl-3">
      <div className={cn(
        "text-xs mb-1",
        learning.category === 'assumption_error' && "text-foreground",
        learning.category === 'external_shock' && "font-bold"
      )}>
        {learning.category === 'assumption_error' && '[ANTAGANDEFEL]'}
        {learning.category === 'data_gap' && '[DATAGAP]'}
        {learning.category === 'external_shock' && '[EXTERN CHOCK]'}
        {learning.category === 'model_limitation' && '[MODELLBEGRÄNSNING]'}
        {learning.actionable && <span className="ml-2">[ÅTGÄRDBAR]</span>}
      </div>
      <div>{learning.description}</div>
    </div>
  );
}
