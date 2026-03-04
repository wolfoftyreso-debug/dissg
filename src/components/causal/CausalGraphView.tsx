/**
 * CAUSAL DAG VISUALIZATION
 * 
 * Visual representation of causal directed acyclic graphs.
 */

import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CausalDAG, createCausalDAG } from '@/core/causal-dag';
import type { CausalGraph, CausalNode, CausalEdge } from '@/core/causal-dag';

// =============================================================================
// DEMO GRAPH
// =============================================================================

const DEMO_GRAPH: CausalGraph = {
  id: 'demo-inequality',
  code: 'CAU-INE-001',
  title: 'Inkomstojämlikhet — Kausalmodell',
  description: 'DAG-baserad kausalanalys av strukturella drivkrafter bakom ökande inkomstojämlikhet',
  domain: 'economics',
  nodes: [
    { id: 'n1', code: 'INT-TAX', label: 'Skattepolitik', nodeType: 'intervention' },
    { id: 'n2', code: 'INT-LABOR', label: 'Arbetsmarknadsreglering', nodeType: 'intervention' },
    { id: 'n3', code: 'MEC-CAPITAL', label: 'Kapitalinkomstfördelning', nodeType: 'mechanism' },
    { id: 'n4', code: 'MEC-SKILL', label: 'Kompetensklyfta', nodeType: 'mechanism' },
    { id: 'n5', code: 'CON-GLOBAL', label: 'Globalisering', nodeType: 'confounder' },
    { id: 'n6', code: 'MED-WAGES', label: 'Lönespridning', nodeType: 'mediator' },
    { id: 'n7', code: 'OUT-GINI', label: 'Gini-koefficient', nodeType: 'outcome' },
    { id: 'n8', code: 'OUT-POVERTY', label: 'Fattigdomsgrad', nodeType: 'outcome' },
  ],
  edges: [
    { id: 'e1', sourceId: 'n1', targetId: 'n3', edgeType: 'causal', strength: 0.75, confidence: 0.82, lagMonths: 24, evidenceSummary: 'Skattepolitiska förändringar påverkar kapitalinkomstfördelningen', evidenceSources: ['OECD 2021', 'Piketty 2014'], mechanism: 'Skatteincitament driver kapitalackumulation', isFalsifiable: true, falsificationCriteria: 'Om skatteförändringar ej leder till förändrad kapitalandel inom 3 år' },
    { id: 'e2', sourceId: 'n2', targetId: 'n4', edgeType: 'causal', strength: 0.65, confidence: 0.71, lagMonths: 36, evidenceSummary: 'Arbetsmarknadsreglering påverkar kompetensklyftan', isFalsifiable: true },
    { id: 'e3', sourceId: 'n3', targetId: 'n6', edgeType: 'causal', strength: 0.80, confidence: 0.88, lagMonths: 12, isFalsifiable: true },
    { id: 'e4', sourceId: 'n4', targetId: 'n6', edgeType: 'causal', strength: 0.70, confidence: 0.76, lagMonths: 18, isFalsifiable: true },
    { id: 'e5', sourceId: 'n5', targetId: 'n3', edgeType: 'confounding', strength: 0.55, confidence: 0.60, isFalsifiable: true },
    { id: 'e6', sourceId: 'n5', targetId: 'n4', edgeType: 'confounding', strength: 0.50, confidence: 0.58, isFalsifiable: true },
    { id: 'e7', sourceId: 'n6', targetId: 'n7', edgeType: 'causal', strength: 0.90, confidence: 0.92, lagMonths: 12, isFalsifiable: true },
    { id: 'e8', sourceId: 'n7', targetId: 'n8', edgeType: 'causal', strength: 0.72, confidence: 0.80, lagMonths: 24, isFalsifiable: true },
  ],
};

// =============================================================================
// NODE TYPE STYLES
// =============================================================================

const NODE_TYPE_CONFIG: Record<string, { label: string; className: string; icon: string }> = {
  intervention: { label: 'INTERVENTION', className: 'border-blue-500 bg-blue-500/10 text-blue-700', icon: '🎯' },
  mechanism: { label: 'MEKANISM', className: 'border-primary bg-primary/10 text-primary', icon: '⚙️' },
  outcome: { label: 'UTFALL', className: 'border-green-500 bg-green-500/10 text-green-700', icon: '📊' },
  confounder: { label: 'STÖRFAKTOR', className: 'border-orange-500 bg-orange-500/10 text-orange-700', icon: '⚠️' },
  mediator: { label: 'MEDIATOR', className: 'border-purple-500 bg-purple-500/10 text-purple-700', icon: '🔗' },
  variable: { label: 'VARIABEL', className: 'border-muted bg-muted/10 text-muted-foreground', icon: '📌' },
};

const EDGE_TYPE_CONFIG: Record<string, { label: string; style: string }> = {
  causal: { label: 'Kausal', style: '━━→' },
  correlational: { label: 'Korrelation', style: '- - →' },
  confounding: { label: 'Störande', style: '~~→' },
  mediating: { label: 'Medierande', style: '──→' },
};

// =============================================================================
// COMPONENT
// =============================================================================

export function CausalGraphView() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  const dag = useMemo(() => createCausalDAG(DEMO_GRAPH), []);
  const validation = useMemo(() => dag.validate(), [dag]);
  const summary = useMemo(() => dag.getSummary(), [dag]);
  const topoOrder = useMemo(() => dag.getTopologicalOrder(), [dag]);

  const selectedNodeData = selectedNode ? DEMO_GRAPH.nodes.find(n => n.id === selectedNode) : null;
  const directCauses = selectedNode ? dag.getDirectCauses(selectedNode) : [];
  const directEffects = selectedNode ? dag.getDirectEffects(selectedNode) : [];
  const ancestors = selectedNode ? dag.getAncestors(selectedNode) : [];
  const descendants = selectedNode ? dag.getDescendants(selectedNode) : [];

  return (
    <ScrollArea className="h-full">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-mono text-xs tracking-widest text-muted-foreground mb-1">
            KAUSAL DAG — {DEMO_GRAPH.code}
          </h1>
          <p className="text-sm font-medium">{DEMO_GRAPH.title}</p>
          <p className="text-xs text-muted-foreground mt-1">{DEMO_GRAPH.description}</p>
        </div>

        {/* Validation & Summary */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="border border-border rounded-md p-3 bg-card">
            <div className="font-mono text-[10px] text-muted-foreground">NODER</div>
            <div className="font-mono text-xl font-bold">{summary.nodeCount}</div>
          </div>
          <div className="border border-border rounded-md p-3 bg-card">
            <div className="font-mono text-[10px] text-muted-foreground">KANTER</div>
            <div className="font-mono text-xl font-bold">{summary.edgeCount}</div>
          </div>
          <div className="border border-border rounded-md p-3 bg-card">
            <div className="font-mono text-[10px] text-muted-foreground">INTERVENTIONER</div>
            <div className="font-mono text-xl font-bold">{summary.interventionPoints}</div>
          </div>
          <div className="border border-border rounded-md p-3 bg-card">
            <div className="font-mono text-[10px] text-muted-foreground">UTFALL</div>
            <div className="font-mono text-xl font-bold">{summary.outcomes}</div>
          </div>
          <div className="border border-border rounded-md p-3 bg-card">
            <div className="font-mono text-[10px] text-muted-foreground">MEDELKONFIDENS</div>
            <div className="font-mono text-xl font-bold">{(summary.avgConfidence * 100).toFixed(0)}%</div>
          </div>
          <div className="border border-border rounded-md p-3 bg-card">
            <div className="font-mono text-[10px] text-muted-foreground">DAG VALID</div>
            <div className={`font-mono text-xl font-bold ${validation.isValid ? 'text-green-600' : 'text-destructive'}`}>
              {validation.isValid ? '✓' : '✗'}
            </div>
          </div>
        </div>

        {/* Topological Order (flow visualization) */}
        <div className="border border-border rounded-lg bg-card p-5">
          <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-4">
            KAUSAL FLÖDE (TOPOLOGISK ORDNING)
          </div>
          {topoOrder && (
            <div className="flex flex-wrap items-center gap-2">
              {topoOrder.map((node, idx) => {
                const config = NODE_TYPE_CONFIG[node.nodeType] ?? NODE_TYPE_CONFIG.variable;
                const isSelected = selectedNode === node.id;
                return (
                  <React.Fragment key={node.id}>
                    {idx > 0 && <span className="text-muted-foreground font-mono text-xs">→</span>}
                    <button
                      onClick={() => setSelectedNode(isSelected ? null : node.id)}
                      className={`px-3 py-2 rounded-md border text-xs font-mono transition-all ${config.className} ${isSelected ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'}`}
                    >
                      <span className="mr-1">{config.icon}</span>
                      {node.label}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>

        {/* Edge List */}
        <div className="border border-border rounded-lg bg-card">
          <div className="p-4 border-b border-border">
            <div className="font-mono text-[10px] tracking-widest text-muted-foreground">
              KAUSALA KOPPLINGAR ({DEMO_GRAPH.edges.length})
            </div>
          </div>
          <div className="divide-y divide-border">
            {DEMO_GRAPH.edges.map((edge) => {
              const source = DEMO_GRAPH.nodes.find(n => n.id === edge.sourceId);
              const target = DEMO_GRAPH.nodes.find(n => n.id === edge.targetId);
              const edgeConfig = EDGE_TYPE_CONFIG[edge.edgeType] ?? EDGE_TYPE_CONFIG.causal;
              return (
                <div key={edge.id} className="p-3 flex items-center gap-3 text-xs hover:bg-muted/20">
                  <span className="font-mono font-bold w-32 truncate">{source?.label}</span>
                  <span className="font-mono text-muted-foreground">{edgeConfig.style}</span>
                  <span className="font-mono font-bold w-32 truncate">{target?.label}</span>
                  <Badge variant="secondary" className="font-mono text-[10px]">{edgeConfig.label}</Badge>
                  {edge.confidence !== undefined && (
                    <span className="font-mono text-muted-foreground">
                      konf: {(edge.confidence * 100).toFixed(0)}%
                    </span>
                  )}
                  {edge.lagMonths !== undefined && (
                    <span className="font-mono text-muted-foreground">
                      lag: {edge.lagMonths} mån
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Detail */}
        {selectedNodeData && (
          <div className="border border-border rounded-lg bg-card p-5">
            <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-3">
              NODDETALJ — {selectedNodeData.code}
            </div>
            <div className="text-sm font-medium mb-4">{selectedNodeData.label}</div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-mono text-muted-foreground mb-1">DIREKTA ORSAKER ({directCauses.length})</div>
                {directCauses.map(n => (
                  <div key={n.id} className="font-mono py-0.5">{n.label}</div>
                ))}
                {directCauses.length === 0 && <div className="text-muted-foreground">Inga (rotnod)</div>}
              </div>
              <div>
                <div className="font-mono text-muted-foreground mb-1">DIREKTA EFFEKTER ({directEffects.length})</div>
                {directEffects.map(n => (
                  <div key={n.id} className="font-mono py-0.5">{n.label}</div>
                ))}
                {directEffects.length === 0 && <div className="text-muted-foreground">Inga (lövnod)</div>}
              </div>
              <div>
                <div className="font-mono text-muted-foreground mb-1">ALLA FÖRFÄDER ({ancestors.length})</div>
                {ancestors.map(n => (
                  <div key={n.id} className="font-mono py-0.5 text-muted-foreground">{n.label}</div>
                ))}
              </div>
              <div>
                <div className="font-mono text-muted-foreground mb-1">ALLA ÄTTLINGAR ({descendants.length})</div>
                {descendants.map(n => (
                  <div key={n.id} className="font-mono py-0.5 text-muted-foreground">{n.label}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

export default CausalGraphView;
