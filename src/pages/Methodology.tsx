/**
 * PUBLIC TRANSPARENCY: METHODOLOGY
 * 
 * How data is normalized.
 * How indexes are built.
 * How uncertainty is shown.
 * 
 * No marketing. Just facts.
 */

import { getFreezeStatus, PUBLIC_RULEBOOK } from '@/core/governance';
import { GDG_ANSWER_TYPES } from '@/core/truth-engine/standards';
import { SIGNAL_GUARDRAILS, DETECTION_THRESHOLDS } from '@/core/signals';

export default function Methodology() {
  const freezeStatus = getFreezeStatus();
  
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <header className="border-b border-border pb-8">
          <h1 className="text-2xl font-mono font-bold">Methodology</h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm">
            How we process, structure, and present data. No interpretation.
          </p>
        </header>

        {/* Data Normalization */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold">Data Normalization</h2>
          <div className="bg-muted/30 p-4 rounded border border-border font-mono text-sm space-y-3">
            <div>
              <span className="text-muted-foreground">[SOURCES]</span>
              <p className="ml-4">All data from official statistical agencies + peer-reviewed research</p>
            </div>
            <div>
              <span className="text-muted-foreground">[VALIDATION]</span>
              <p className="ml-4">Checksums on all truth artifacts. Version-locked contracts.</p>
            </div>
            <div>
              <span className="text-muted-foreground">[BASELINE]</span>
              <p className="ml-4">Historical baselines required before any signal is valid</p>
            </div>
            <div>
              <span className="text-muted-foreground">[SEASONAL]</span>
              <p className="ml-4">Seasonal adjustment applied where applicable</p>
            </div>
          </div>
        </section>

        {/* Index Construction */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold">Index Construction</h2>
          <div className="bg-muted/30 p-4 rounded border border-border font-mono text-sm space-y-3">
            <div>
              <span className="text-muted-foreground">[COMPOSITION]</span>
              <p className="ml-4">Each index aggregates multiple Truth Nodes with explicit weights</p>
            </div>
            <div>
              <span className="text-muted-foreground">[VERSIONING]</span>
              <p className="ml-4">All index definitions are versioned and append-only</p>
            </div>
            <div>
              <span className="text-muted-foreground">[METHODOLOGY]</span>
              <p className="ml-4">Methodology documented per index. Changes require manifest.</p>
            </div>
          </div>
        </section>

        {/* Answer Types */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold">Valid Answer Types</h2>
          <div className="grid grid-cols-2 gap-2">
            {GDG_ANSWER_TYPES.map(type => (
              <div 
                key={type} 
                className="bg-muted/30 p-2 rounded border border-border font-mono text-xs"
              >
                {type}
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-xs font-mono">
            All outputs must conform to one of these types. No exceptions.
          </p>
        </section>

        {/* Uncertainty Display */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold">Uncertainty Presentation</h2>
          <div className="bg-muted/30 p-4 rounded border border-border font-mono text-sm space-y-3">
            <div>
              <span className="text-muted-foreground">[CONFIDENCE]</span>
              <p className="ml-4">0.0–1.0 scale. Based on data coverage + source reliability.</p>
            </div>
            <div>
              <span className="text-muted-foreground">[THRESHOLDS]</span>
              <ul className="ml-4 space-y-1">
                <li>• &lt;0.5: Insufficient data (suppressed)</li>
                <li>• 0.5–0.7: Low confidence (flagged)</li>
                <li>• 0.7–0.9: Standard confidence</li>
                <li>• &gt;0.9: High confidence</li>
              </ul>
            </div>
            <div>
              <span className="text-muted-foreground">[VISIBILITY]</span>
              <p className="ml-4">Uncertainty is as visible as data. Never hidden.</p>
            </div>
          </div>
        </section>

        {/* Signal Detection */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold">Signal Detection</h2>
          <div className="bg-muted/30 p-4 rounded border border-border font-mono text-sm space-y-3">
            <div>
              <span className="text-muted-foreground">[SPIKE]</span>
              <p className="ml-4">
                z-score ≥ {DETECTION_THRESHOLDS.spike.zscore_min} (min), 
                ≥ {DETECTION_THRESHOLDS.spike.zscore_high} (high), 
                ≥ {DETECTION_THRESHOLDS.spike.zscore_extreme} (extreme)
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">[PERSISTENCE]</span>
              <p className="ml-4">
                ≥ {DETECTION_THRESHOLDS.persistence.min_hours}h (min), 
                ≥ {DETECTION_THRESHOLDS.persistence.significant_hours}h (significant)
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">[GUARDRAILS]</span>
              <ul className="ml-4 space-y-1">
                {SIGNAL_GUARDRAILS.signal_is_not.map(item => (
                  <li key={item}>• Signal ≠ {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Core Freeze Status */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold">Core Component Status</h2>
          <div className="space-y-2">
            {freezeStatus.components.map(component => (
              <div 
                key={component.name}
                className="flex items-center justify-between bg-muted/30 p-3 rounded border border-border font-mono text-sm"
              >
                <span>{component.name} v{component.version}</span>
                <span className={component.frozen ? 'text-blue-500' : 'text-amber-500'}>
                  {component.frozen ? '🔒 FROZEN' : '🔓 MUTABLE'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Governance Rules */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold">Governance Rules</h2>
          <div className="space-y-2">
            {PUBLIC_RULEBOOK.rules.map(rule => (
              <div 
                key={rule.id}
                className="bg-muted/30 p-3 rounded border border-border font-mono text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">[{rule.id}]</span>
                  <span className="font-medium">{rule.name}</span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">
                    {rule.enforcement}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs mt-1">{rule.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-8 text-center">
          <p className="font-mono text-xs text-muted-foreground">
            Rulebook v{PUBLIC_RULEBOOK.version} • Updated {PUBLIC_RULEBOOK.last_updated}
          </p>
        </footer>
      </div>
    </div>
  );
}
