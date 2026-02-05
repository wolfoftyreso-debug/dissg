/**
 * TRUTH NODE EXPLORER
 * 
 * V2: Built for extreme clarity.
 * Fixed layout, no scroll-article.
 * Each section: short, dense, clickable.
 * 
 * Feels: stable, calm, exact.
 */

import { DomainOrientationBar } from './DomainOrientationBar';
import { PriorityMap } from './PriorityMap';
import { CurrentState } from './CurrentState';
import { WhyThisMatters } from './WhyThisMatters';
import { WhatThisDoesNotMean } from './WhatThisDoesNotMean';
import { UncertaintyPanel } from './UncertaintyPanel';
import { GoDeeper } from './GoDeeper';
import type { HealthTruthNode } from '@/core/truth-engine/data/health-truth-nodes';

interface TruthNodeExplorerProps {
  node: HealthTruthNode;
  onNavigate: (nodeId: string) => void;
  onBack?: () => void;
}

export function TruthNodeExplorer({ node, onNavigate, onBack }: TruthNodeExplorerProps) {
  // Extract priority items from importance
  const structural = node.importance.structural 
    ? node.importance.rationale.map(r => ({ text: r }))
    : [];
  const acute = node.importance.acute 
    ? [{ text: 'Recent elevated activity detected' }]
    : [];
  const contextual = node.importance.contextual 
    ? [{ text: 'Contextual factors present' }]
    : [];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Back navigation */}
      {onBack && (
        <div className="p-2 border-b border-border">
          <button 
            onClick={onBack}
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            [←] Back
          </button>
        </div>
      )}
      
      {/* Domain Orientation Bar */}
      <DomainOrientationBar
        domain={node.type === 'answer' ? 'Health' : node.type}
        population={node.scope.population}
        geo={node.scope.geo}
        time={node.scope.time}
        confidence={node.uncertainty.confidence}
      />
      
      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Node Title */}
          <div className="space-y-1">
            <h1 className="font-mono text-xs text-muted-foreground">
              [{node.node_id}]
            </h1>
            <p className="text-lg font-medium">
              {node.orientation.baseline}
            </p>
          </div>
          
          {/* Priority Map */}
          <PriorityMap
            structural={structural}
            acute={acute}
            contextual={contextual}
          />
          
          {/* Current State */}
          <CurrentState
            baseline={{
              label: 'Historical range',
              min: 0,
              max: 100,
              unit: 'index'
            }}
            current={{
              value: node.orientation.magnitude === 'high' ? 85 : 
                     node.orientation.magnitude === 'medium' ? 65 : 45,
              asOf: '2024'
            }}
            direction={node.orientation.direction}
            magnitude={node.orientation.magnitude}
          />
          
          {/* Why This Matters */}
          <WhyThisMatters reasons={node.why_it_matters} />
          
          {/* What This Does Not Mean */}
          <WhatThisDoesNotMean exclusions={node.what_it_does_not_mean} />
          
          {/* Uncertainty Panel */}
          <UncertaintyPanel
            dataSources={node.uncertainty.sources}
            knownBiases={[]}
            missingData={node.uncertainty.data_gaps}
            confidence={node.uncertainty.confidence}
          />
          
          {/* Go Deeper */}
          <GoDeeper
            deeper={[
              { id: 'regional_breakdown', label: 'Regional breakdown' },
              { id: 'time_series', label: 'Extended time series' }
            ]}
            related={[
              { id: 'health.sleep_insufficiency.youth.v1', label: 'Sleep insufficiency' },
              { id: 'health.stress_prevalence.adults.v1', label: 'Stress prevalence' }
            ]}
            nextQuestions={node.next_valid_questions}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
}
