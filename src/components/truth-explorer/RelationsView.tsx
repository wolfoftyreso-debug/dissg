/**
 * RELATIONS VIEW — Connected Systems
 * 
 * Shows what is connected to the current node.
 * All relationships are navigable.
 */

import React from 'react';
import { TruthNode, RelationLink, RelationType } from '@/core/truth-engine/ontology';

interface RelationsViewProps {
  node: TruthNode;
  onNodeSelect: (node: TruthNode) => void;
}

export function RelationsView({ node, onNodeSelect }: RelationsViewProps) {
  const allRelations = [
    ...node.relations.up.map(r => ({ ...r, direction: 'up' as const })),
    ...node.relations.down.map(r => ({ ...r, direction: 'down' as const })),
    ...node.relations.side.map(r => ({ ...r, direction: 'side' as const })),
    ...node.relations.forward.map(r => ({ ...r, direction: 'forward' as const })),
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="border-b border-border pb-6">
        <h1 className="text-2xl font-bold">[RELATIONS]</h1>
        <p className="text-muted-foreground mt-2">
          Connected systems for: {node.node_id}
        </p>
      </header>

      {/* Relation Categories */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Upward Relations (Context) */}
        <RelationCategory
          title="Context (Why this exists)"
          marker="⬆"
          relations={node.relations.up}
          onSelect={(id) => console.log('Navigate to:', id)}
        />

        {/* Downward Relations (Depth) */}
        <RelationCategory
          title="Depth (More granular)"
          marker="⬇"
          relations={node.relations.down}
          onSelect={(id) => console.log('Navigate to:', id)}
        />

        {/* Lateral Relations (Systems) */}
        <RelationCategory
          title="Systems (Connected)"
          marker="↔"
          relations={node.relations.side}
          onSelect={(id) => console.log('Navigate to:', id)}
        />

        {/* Forward Relations (Next Questions) */}
        <RelationCategory
          title="Next (Valid questions)"
          marker="➡"
          relations={node.relations.forward}
          onSelect={(id) => console.log('Navigate to:', id)}
        />

      </div>

      {/* Relation Legend */}
      <section className="border border-border rounded-lg p-6">
        <h2 className="text-sm font-semibold mb-4">[RELATIONSHIP TYPES]</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <RelationTypeLegend type="correlates_with" description="Statistical co-movement" />
          <RelationTypeLegend type="influences" description="Observed effect" />
          <RelationTypeLegend type="part_of" description="Component of larger system" />
          <RelationTypeLegend type="precedes" description="Temporal sequence" />
          <RelationTypeLegend type="contrasts_with" description="Opposite pattern" />
          <RelationTypeLegend type="similar_to" description="Analogous behavior" />
        </div>
      </section>

      {/* Disclaimer */}
      <div className="border border-border rounded-lg p-4 bg-muted/20 text-sm">
        <span className="font-semibold">[IMPORTANT]</span>
        <span className="text-muted-foreground ml-2">
          Correlation is not causation. Relationships show observed patterns, not causes.
        </span>
      </div>
    </div>
  );
}

interface RelationCategoryProps {
  title: string;
  marker: string;
  relations: readonly RelationLink[];
  onSelect: (id: string) => void;
}

function RelationCategory({ title, marker, relations, onSelect }: RelationCategoryProps) {
  return (
    <div className="border border-border rounded-lg p-6">
      <h2 className="flex items-center gap-2 font-semibold mb-4">
        <span>{marker}</span>
        <span>{title}</span>
      </h2>
      
      {relations.length > 0 ? (
        <div className="space-y-3">
          {relations.map((rel, i) => (
            <button
              key={i}
              onClick={() => onSelect(rel.target_id)}
              className="block w-full text-left border border-border rounded p-3 hover:bg-muted/30 transition-colors"
            >
              <div className="font-medium">{rel.target_id}</div>
              <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                <span>{formatRelationType(rel.relationship)}</span>
                <span>Strength: {(rel.strength * 100).toFixed(0)}%</span>
              </div>
              {rel.data_available && (
                <span className="text-xs text-primary">[DATA AVAILABLE]</span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground text-sm">
          No relations in this direction.
        </div>
      )}
    </div>
  );
}

interface RelationTypeLegendProps {
  type: RelationType;
  description: string;
}

function RelationTypeLegend({ type, description }: RelationTypeLegendProps) {
  return (
    <div>
      <div className="font-medium">{formatRelationType(type)}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
  );
}

function formatRelationType(type: RelationType): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
