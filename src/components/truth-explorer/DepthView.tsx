/**
 * DEPTH VIEW — HCAL in UI Form
 * 
 * When user clicks, they get:
 * - Why is this important?
 * - What is normal?
 * - What deviates?
 * - How long has it been going on?
 * - What is connected?
 * - What don't we know?
 */

import React from 'react';
import { TruthNode } from '@/core/truth-engine/ontology';

interface DepthViewProps {
  node: TruthNode;
  depthLevel: number;
  onGoDeeper: () => void;
  onExploreRelation: (direction: 'up' | 'down' | 'side' | 'forward') => void;
  onNavigateUp: () => void;
}

export function DepthView({ 
  node, 
  depthLevel, 
  onGoDeeper, 
  onExploreRelation,
  onNavigateUp 
}: DepthViewProps) {
  return (
    <div className="space-y-8">
      {/* Node Header */}
      <header className="border-b border-border pb-6">
        <button 
          onClick={onNavigateUp}
          className="text-xs text-muted-foreground hover:text-foreground mb-2 flex items-center gap-1"
        >
          [← BACK]
        </button>
        <div className="flex items-center gap-3">
          <ImportanceMarker importance={node.semantic_importance} />
          <h1 className="text-2xl font-bold">{node.node_id}</h1>
        </div>
        <p className="text-muted-foreground mt-2">
          {node.type.toUpperCase()} · {node.scope.geo.name} · {node.scope.time.start}
        </p>
      </header>

      {/* Depth Level Indicator */}
      <DepthIndicator level={depthLevel} maxLevel={5} />

      {/* HCAL Questions — Progressive Disclosure */}
      <div className="grid gap-6">
        
        {/* Level 1: Orientation (always visible) */}
        <HCALSection
          level={1}
          currentLevel={depthLevel}
          title="Why is this important?"
          marker="[IMPORTANCE]"
        >
          <p className="text-foreground">
            {node.semantic_importance.importance_rationale || 
              'Affects multiple interconnected systems with persistent impact.'}
          </p>
          <div className="mt-2 text-sm text-muted-foreground">
            Confidence: {(node.confidence * 100).toFixed(0)}%
          </div>
        </HCALSection>

        {/* Level 2: Baseline & Deviation */}
        <HCALSection
          level={2}
          currentLevel={depthLevel}
          title="What is normal? What deviates?"
          marker="[BASELINE]"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-border rounded p-4">
              <div className="text-xs text-muted-foreground">[NORMAL RANGE]</div>
              <div className="text-lg font-semibold mt-1">Historical baseline</div>
              <div className="text-sm text-muted-foreground mt-2">
                Based on 10-year average with seasonal adjustment
              </div>
            </div>
            <div className="border border-primary/30 rounded p-4">
              <div className="text-xs text-muted-foreground">[CURRENT STATE]</div>
              <div className="text-lg font-semibold mt-1">Above normal</div>
              <div className="text-sm text-muted-foreground mt-2">
                +2.3 standard deviations from baseline
              </div>
            </div>
          </div>
        </HCALSection>

        {/* Level 3: Duration & Persistence */}
        <HCALSection
          level={3}
          currentLevel={depthLevel}
          title="How long? Is it persistent?"
          marker="[PERSISTENCE]"
        >
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Duration observed:</span>
              <span className="font-semibold">18 months</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Trend direction:</span>
              <span className="font-semibold">Increasing</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Classification:</span>
              <span className="font-semibold">Structural (not transient)</span>
            </div>
          </div>
        </HCALSection>

        {/* Level 4: Connections */}
        <HCALSection
          level={4}
          currentLevel={depthLevel}
          title="What is connected?"
          marker="[COUPLING]"
        >
          <div className="space-y-3">
            {node.relations.side.length > 0 ? (
              node.relations.side.map((rel, i) => (
                <button 
                  key={i}
                  onClick={() => onExploreRelation('side')}
                  className="block w-full text-left border border-border rounded p-3 hover:bg-muted/30"
                >
                  <div className="text-sm font-medium">{rel.target_id}</div>
                  <div className="text-xs text-muted-foreground">
                    {rel.relationship} · Strength: {(rel.strength * 100).toFixed(0)}%
                  </div>
                </button>
              ))
            ) : (
              <div className="text-muted-foreground text-sm">
                Exploring connections... [→ VIEW RELATIONS]
              </div>
            )}
            <button 
              onClick={() => onExploreRelation('side')}
              className="text-xs text-primary"
            >
              [EXPLORE ALL CONNECTIONS →]
            </button>
          </div>
        </HCALSection>

        {/* Level 5: Uncertainty */}
        <HCALSection
          level={5}
          currentLevel={depthLevel}
          title="What don't we know?"
          marker="[UNCERTAINTY]"
        >
          <div className="space-y-3">
            {node.limitations.length > 0 ? (
              node.limitations.map((limit, i) => (
                <div key={i} className="border border-border rounded p-3 bg-muted/20">
                  <div className="text-sm">{limit}</div>
                </div>
              ))
            ) : (
              <div className="border border-border rounded p-3 bg-muted/20">
                <div className="text-sm text-muted-foreground">
                  Data gaps: Self-report bias in underlying surveys
                </div>
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              These limitations affect interpretation confidence.
            </div>
          </div>
        </HCALSection>

      </div>

      {/* Go Deeper Button */}
      {depthLevel < 5 && (
        <button
          onClick={onGoDeeper}
          className="w-full border border-border rounded-lg p-4 text-center hover:bg-muted/30 transition-colors"
        >
          <span className="text-sm">[GO DEEPER → LEVEL {depthLevel + 1}]</span>
        </button>
      )}

      {/* 4-Way Navigation */}
      <FourWayNav
        node={node}
        onNavigate={onExploreRelation}
      />
    </div>
  );
}

interface DepthIndicatorProps {
  level: number;
  maxLevel: number;
}

function DepthIndicator({ level, maxLevel }: DepthIndicatorProps) {
  const labels = ['Orientation', 'Relationships', 'Mechanisms', 'History', 'Uncertainties'];
  
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-muted-foreground">[DEPTH]</span>
      {Array.from({ length: maxLevel }, (_, i) => (
        <span 
          key={i}
          className={`px-2 py-1 rounded ${
            i < level ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
          }`}
        >
          {i + 1}
        </span>
      ))}
      <span className="text-muted-foreground ml-2">{labels[level - 1]}</span>
    </div>
  );
}

interface HCALSectionProps {
  level: number;
  currentLevel: number;
  title: string;
  marker: string;
  children: React.ReactNode;
}

function HCALSection({ level, currentLevel, title, marker, children }: HCALSectionProps) {
  if (level > currentLevel) return null;
  
  return (
    <section className="border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-muted-foreground">{marker}</span>
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

interface ImportanceMarkerProps {
  importance: TruthNode['semantic_importance'];
}

function ImportanceMarker({ importance }: ImportanceMarkerProps) {
  if (importance.structural) {
    return <span className="text-xl" title="Structural">🧱</span>;
  }
  if (importance.acute) {
    return <span className="text-xl" title="Acute">⚡</span>;
  }
  return <span className="text-xl" title="Contextual">🌊</span>;
}

interface FourWayNavProps {
  node: TruthNode;
  onNavigate: (direction: 'up' | 'down' | 'side' | 'forward') => void;
}

function FourWayNav({ node, onNavigate }: FourWayNavProps) {
  return (
    <div className="border border-border rounded-lg p-6">
      <h3 className="text-sm font-semibold mb-4">[NAVIGATION]</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NavButton
          direction="up"
          label="Context"
          description="Why this exists"
          count={node.relations.up.length}
          onClick={() => onNavigate('up')}
        />
        <NavButton
          direction="down"
          label="Depth"
          description="More granular"
          count={node.relations.down.length}
          onClick={() => onNavigate('down')}
        />
        <NavButton
          direction="side"
          label="Relations"
          description="Connected systems"
          count={node.relations.side.length}
          onClick={() => onNavigate('side')}
        />
        <NavButton
          direction="forward"
          label="Next"
          description="Valid questions"
          count={node.relations.forward.length}
          onClick={() => onNavigate('forward')}
        />
      </div>
    </div>
  );
}

interface NavButtonProps {
  direction: 'up' | 'down' | 'side' | 'forward';
  label: string;
  description: string;
  count: number;
  onClick: () => void;
}

function NavButton({ direction, label, description, count, onClick }: NavButtonProps) {
  const arrows = { up: '⬆', down: '⬇', side: '↔', forward: '➡' };
  
  return (
    <button
      onClick={onClick}
      className="border border-border rounded p-3 text-left hover:bg-muted/30 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span>{arrows[direction]}</span>
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-xs text-muted-foreground mt-1">{description}</div>
      <div className="text-xs text-primary mt-2">[{count} paths]</div>
    </button>
  );
}
