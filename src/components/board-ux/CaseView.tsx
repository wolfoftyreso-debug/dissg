/**
 * CASE VIEW — THREE FIXED COLUMNS
 * 
 * Context | Reality | Alternatives
 * Nothing else may be shown here.
 */

import { cn } from '@/lib/utils';
import type { DecisionPreparationDocument } from '@/core/board-decision/types';
import type { CaseStatus, FrictionCheckpoint } from './types';

interface CaseViewProps {
  dpd: DecisionPreparationDocument;
  status: CaseStatus;
  frictionCheckpoints: FrictionCheckpoint[];
  onCheckpointComplete: (checkpointId: string) => void;
}

export function CaseView({ dpd, status, frictionCheckpoints, onCheckpointComplete }: CaseViewProps) {
  const isLocked = status === 'locked';
  
  return (
    <div className={cn(
      "min-h-screen bg-background",
      isLocked && "opacity-60"
    )}>
      {/* Header */}
      <header className="border-b p-4 md:p-6">
        <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground mb-2">
          <span>[{dpd.dpd_id}]</span>
          <span>|</span>
          <span>{dpd.overview.organization_type}</span>
        </div>
        <h1 className="font-mono text-lg">
          {dpd.overview.decision_subject}
        </h1>
      </header>

      {/* Three columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
        {/* Column 1: Context */}
        <ContextColumn dpd={dpd} />
        
        {/* Column 2: Reality */}
        <RealityColumn 
          dpd={dpd} 
          checkpoints={frictionCheckpoints}
          onCheckpointComplete={onCheckpointComplete}
        />
        
        {/* Column 3: Alternatives */}
        <AlternativesColumn dpd={dpd} />
      </div>
    </div>
  );
}

/**
 * COLUMN 1: CONTEXT
 * What the decision is about, who is affected, how irreversible
 */
function ContextColumn({ dpd }: { dpd: DecisionPreparationDocument }) {
  return (
    <div className="p-4 md:p-6">
      <h2 className="font-mono text-sm text-muted-foreground mb-4">
        KONTEXT
      </h2>
      
      <div className="space-y-6 font-mono text-sm">
        {/* What */}
        <section>
          <h3 className="text-muted-foreground mb-2">Vad gäller beslutet</h3>
          <p>{dpd.overview.decision_subject}</p>
        </section>

        {/* Who */}
        <section>
          <h3 className="text-muted-foreground mb-2">Vem påverkas</h3>
          <p>{dpd.overview.population_affected.toLocaleString()} personer</p>
          <p className="text-muted-foreground">{dpd.overview.geo_scope}</p>
        </section>

        {/* Irreversibility */}
        <section>
          <h3 className="text-muted-foreground mb-2">Irreversibilitet</h3>
          <div className={cn(
            "inline-block px-2 py-1 border",
            dpd.overview.irreversibility === 'high' && "border-foreground",
            dpd.overview.irreversibility === 'permanent' && "border-foreground bg-foreground text-background"
          )}>
            {dpd.overview.irreversibility.toUpperCase()}
          </div>
        </section>

        {/* Time horizon */}
        <section>
          <h3 className="text-muted-foreground mb-2">Tidshorisont</h3>
          <p>{dpd.overview.time_horizon}</p>
        </section>

        {/* Constraints */}
        {dpd.constraints_acknowledged.length > 0 && (
          <section>
            <h3 className="text-muted-foreground mb-2">Begränsningar</h3>
            <ul className="space-y-1">
              {dpd.constraints_acknowledged.map((c, i) => (
                <li key={i} className="text-muted-foreground">— {c}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

/**
 * COLUMN 2: REALITY
 * Relevant data, indexes, uncertainties, what is NOT known
 */
function RealityColumn({ 
  dpd, 
  checkpoints,
  onCheckpointComplete 
}: { 
  dpd: DecisionPreparationDocument;
  checkpoints: FrictionCheckpoint[];
  onCheckpointComplete: (id: string) => void;
}) {
  const uncertaintyCheckpoint = checkpoints.find(c => c.id === 'uncertainty');
  
  return (
    <div className="p-4 md:p-6">
      <h2 className="font-mono text-sm text-muted-foreground mb-4">
        VERKLIGHET
      </h2>
      
      <div className="space-y-6 font-mono text-sm">
        {/* Data */}
        <section>
          <h3 className="text-muted-foreground mb-2">Relevant data</h3>
          <div className="space-y-2">
            {dpd.relevant_data.map((d, i) => (
              <div key={i} className="border p-2">
                <div className="flex justify-between">
                  <span>{d.metric}</span>
                  <span className="text-muted-foreground">
                    {d.trend === 'improving' && '[↑]'}
                    {d.trend === 'declining' && '[↓]'}
                    {d.trend === 'stable' && '[—]'}
                  </span>
                </div>
                <div className="text-muted-foreground text-xs mt-1">
                  Osäkerhet: {(d.uncertainty * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Indexes */}
        <section>
          <h3 className="text-muted-foreground mb-2">Index</h3>
          <div className="space-y-1">
            {dpd.relevant_indexes.map((idx, i) => (
              <div key={i} className="flex justify-between">
                <span>{idx.index_name}</span>
                <span>{idx.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FRICTION ZONE: Uncertainties - must scroll through */}
        <section 
          className="border-2 border-dashed p-4 -mx-2"
          onScroll={() => {
            if (uncertaintyCheckpoint && !uncertaintyCheckpoint.completed) {
              onCheckpointComplete('uncertainty');
            }
          }}
        >
          <h3 className="text-muted-foreground mb-2">
            OSÄKERHETER
            {uncertaintyCheckpoint && !uncertaintyCheckpoint.completed && (
              <span className="ml-2">[MÅSTE LÄSAS]</span>
            )}
          </h3>
          
          {/* Known */}
          <div className="mb-4">
            <h4 className="text-xs text-muted-foreground">KÄNT</h4>
            <ul className="mt-1 space-y-1">
              {dpd.knowledge_status.known.map((k, i) => (
                <li key={i}>+ {k}</li>
              ))}
            </ul>
          </div>

          {/* Uncertain */}
          <div className="mb-4">
            <h4 className="text-xs text-muted-foreground">OSÄKERT</h4>
            <ul className="mt-1 space-y-1">
              {dpd.knowledge_status.uncertain.map((u, i) => (
                <li key={i}>? {u}</li>
              ))}
            </ul>
          </div>

          {/* Unknown */}
          <div>
            <h4 className="text-xs text-muted-foreground">OKÄNT</h4>
            <ul className="mt-1 space-y-1">
              {dpd.knowledge_status.unknown.map((u, i) => (
                <li key={i}>— {u}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * COLUMN 3: ALTERNATIVES
 * A/B/C, assumptions per alternative, consequence surfaces
 */
function AlternativesColumn({ dpd }: { dpd: DecisionPreparationDocument }) {
  return (
    <div className="p-4 md:p-6">
      <h2 className="font-mono text-sm text-muted-foreground mb-4">
        ALTERNATIV
      </h2>
      
      <div className="space-y-6 font-mono text-sm">
        {dpd.alternatives.map((alt) => (
          <div key={alt.id} className="border p-4">
            {/* Alternative header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 border flex items-center justify-center font-bold">
                {alt.id}
              </span>
              <span className="font-medium">{alt.label}</span>
            </div>

            {/* Description */}
            {alt.description && (
              <p className="text-muted-foreground mb-3">{alt.description}</p>
            )}

            {/* Assumptions */}
            <div className="mb-3">
              <h4 className="text-xs text-muted-foreground mb-1">ANTAGANDEN</h4>
              <ul className="space-y-1">
                {alt.assumptions.map((a, i) => (
                  <li key={i} className="text-muted-foreground">• {a}</li>
                ))}
              </ul>
            </div>

            {/* Consequences */}
            {dpd.consequence_surfaces[alt.id] && (
              <div>
                <h4 className="text-xs text-muted-foreground mb-1">KONSEKVENSER</h4>
                <div className="space-y-1">
                  {dpd.consequence_surfaces[alt.id].map((c, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span>{c.dimension}</span>
                      <span className={cn(
                        c.uncertainty === 'high' && "font-bold"
                      )}>
                        {c.uncertainty === 'high' && '[!]'}
                        {c.uncertainty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Blocks */}
            {alt.blocks && alt.blocks.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <h4 className="text-xs text-muted-foreground mb-1">BLOCKERAR</h4>
                <ul className="space-y-1">
                  {alt.blocks.map((b, i) => (
                    <li key={i} className="text-xs text-muted-foreground">× {b}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
