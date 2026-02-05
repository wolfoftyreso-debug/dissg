/**
 * COMPLIANCE FOOTER — Always Visible
 * 
 * Every view shows clearly:
 * - What this does NOT mean
 * - What this cannot be used for
 * - Where the limits are
 * 
 * This builds trust directly.
 */

import React, { useState } from 'react';
import { TruthNode } from '@/core/truth-engine/ontology';

interface ComplianceFooterProps {
  selectedNode: TruthNode | null;
  domain: string;
}

export function ComplianceFooter({ selectedNode, domain }: ComplianceFooterProps) {
  const [expanded, setExpanded] = useState(false);

  const domainCompliance = getDomainCompliance(domain);

  return (
    <footer className="border-t border-border bg-muted/20 mt-auto">
      <div className="container mx-auto px-4">
        {/* Collapsed View */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-3 flex items-center justify-between text-sm"
        >
          <span className="text-muted-foreground">
            [COMPLIANCE] · Population-level data only · No individual inference · No recommendations
          </span>
          <span className="text-xs text-muted-foreground">
            [{expanded ? 'COLLAPSE' : 'EXPAND'}]
          </span>
        </button>

        {/* Expanded View */}
        {expanded && (
          <div className="pb-6 space-y-6">
            {/* What This Does NOT Mean */}
            <section>
              <h3 className="text-sm font-semibold mb-3">[WHAT THIS DOES NOT MEAN]</h3>
              <ul className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✗</span>
                  <span>Individual diagnosis or prognosis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✗</span>
                  <span>Recommendation for action</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✗</span>
                  <span>Causal claims (unless explicitly marked)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✗</span>
                  <span>Prediction of future outcomes</span>
                </li>
              </ul>
            </section>

            {/* What This Cannot Be Used For */}
            <section>
              <h3 className="text-sm font-semibold mb-3">[CANNOT BE USED FOR]</h3>
              <ul className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✗</span>
                  <span>Individual decision-making without professional guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✗</span>
                  <span>Proof of any political claim</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✗</span>
                  <span>Definitive conclusions without stated caveats</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✗</span>
                  <span>Comparison across incompatible definitions</span>
                </li>
              </ul>
            </section>

            {/* Domain-Specific Compliance */}
            {domainCompliance && (
              <section>
                <h3 className="text-sm font-semibold mb-3">
                  [DOMAIN: {domain.toUpperCase()}]
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {domainCompliance.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Node-Specific Limitations */}
            {selectedNode && selectedNode.limitations.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold mb-3">[SPECIFIC LIMITATIONS]</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {selectedNode.limitations.map((limit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>{limit}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Data Provenance */}
            <section className="border-t border-border pt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Methodology Version: 1.0.0</span>
                <span>Last Updated: {new Date().toISOString().split('T')[0]}</span>
                <a href="#" className="text-primary hover:underline">
                  [VIEW FULL METHODOLOGY]
                </a>
              </div>
            </section>
          </div>
        )}
      </div>
    </footer>
  );
}

function getDomainCompliance(domain: string): string[] | null {
  const compliance: Record<string, string[]> = {
    healthcare: [
      'Never replaces professional medical advice',
      'Population statistics do not predict individual outcomes',
      'Consult healthcare provider for personal concerns',
      'Crisis resources: Mind Självmordslinjen 90101',
    ],
    economy: [
      'Not financial advice',
      'Past performance does not indicate future results',
      'All projections are scenarios, not predictions',
      'Consult qualified advisor for investment decisions',
    ],
    youth: [
      'Data reflects population patterns, not individual experiences',
      'Your experience may differ from statistical patterns',
      'Seek support if you are struggling',
      'You are not a statistic',
    ],
    environment: [
      'Climate data has inherent uncertainty',
      'Models are scenarios, not forecasts',
      'Local conditions may differ from regional patterns',
      'Methodology differences affect cross-study comparison',
    ],
  };

  return compliance[domain] || null;
}
