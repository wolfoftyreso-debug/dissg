/**
 * ORIENTATION VIEW — Starting Point
 * 
 * Not content. Semantic orientation.
 * - What is happening now? → Index orientation
 * - What is structurally important? → UIE
 * - What is changing? → Signals
 */

import React from 'react';
import { TruthNode } from '@/core/truth-engine/ontology';

interface OrientationViewProps {
  onNodeSelect: (node: TruthNode) => void;
  domain: string;
}

export function OrientationView({ onNodeSelect, domain }: OrientationViewProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="border-b border-border pb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          [TRUTH EXPLORER]
        </h1>
        <p className="text-muted-foreground mt-2">
          Semantic orientation. Not content.
        </p>
      </header>

      {/* Three Entry Points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* What is happening now? */}
        <OrientationCard
          marker="[INDEX]"
          title="What is happening now?"
          description="Current state across domains"
          importance="structural"
          onClick={() => {/* Navigate to index view */}}
        />

        {/* What is structurally important? */}
        <OrientationCard
          marker="[UIE]"
          title="What matters systemically?"
          description="Persistent forces shaping outcomes"
          importance="structural"
          onClick={() => {/* Navigate to importance view */}}
        />

        {/* What is changing? */}
        <OrientationCard
          marker="[SIGNAL]"
          title="What is changing?"
          description="Recent deviations from baseline"
          importance="acute"
          onClick={() => {/* Navigate to signals view */}}
        />

      </div>

      {/* Domain Context */}
      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-lg font-semibold mb-4">[DOMAIN: {domain.toUpperCase()}]</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <DomainStat label="Active Indicators" value="247" />
          <DomainStat label="Last Update" value="2h ago" />
          <DomainStat label="Data Coverage" value="94%" />
          <DomainStat label="Active Signals" value="12" />
        </div>
      </section>

      {/* Attention Guidance */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">[ATTENTION MARKERS]</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <AttentionMarker type="structural" label="Structural" description="Persistent, systemic" />
          <AttentionMarker type="acute" label="Acute" description="Recent deviation" />
          <AttentionMarker type="contextual" label="Background" description="Normal variation" />
        </div>
      </section>
    </div>
  );
}

interface OrientationCardProps {
  marker: string;
  title: string;
  description: string;
  importance: 'structural' | 'acute' | 'contextual';
  onClick: () => void;
}

function OrientationCard({ marker, title, description, importance, onClick }: OrientationCardProps) {
  const borderClass = importance === 'structural' 
    ? 'border-muted-foreground/50' 
    : importance === 'acute' 
    ? 'border-primary/50' 
    : 'border-border';

  return (
    <button
      onClick={onClick}
      className={`border ${borderClass} rounded-lg p-6 text-left hover:bg-muted/30 transition-colors`}
    >
      <span className="text-xs text-muted-foreground">{marker}</span>
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
      <span className="inline-block mt-4 text-xs text-primary">[EXPLORE →]</span>
    </button>
  );
}

interface DomainStatProps {
  label: string;
  value: string;
}

function DomainStat({ label, value }: DomainStatProps) {
  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

interface AttentionMarkerProps {
  type: 'structural' | 'acute' | 'contextual';
  label: string;
  description: string;
}

function AttentionMarker({ type, label, description }: AttentionMarkerProps) {
  const symbol = type === 'structural' ? '🧱' : type === 'acute' ? '⚡' : '🌊';
  const colorClass = type === 'structural' 
    ? 'bg-muted' 
    : type === 'acute' 
    ? 'bg-primary/10' 
    : 'bg-muted/50';

  return (
    <div className={`${colorClass} px-3 py-2 rounded flex items-center gap-2`}>
      <span>{symbol}</span>
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}
