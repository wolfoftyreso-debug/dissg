/**
 * TRUTH EXPLORER — The First Public Surface
 * 
 * This is not a dashboard.
 * This is a map of reality.
 */

import React, { useState, useCallback } from 'react';
import { TruthNode, TruthNodeType } from '@/core/truth-engine/ontology';
import { OrientationView } from './OrientationView';
import { DepthView } from './DepthView';
import { RelationsView } from './RelationsView';
import { NavigationBar } from './NavigationBar';
import { ComplianceFooter } from './ComplianceFooter';

export type ExplorerView = 'orientation' | 'depth' | 'relations' | 'history';

interface TruthExplorerProps {
  initialNode?: TruthNode;
  domain?: string;
}

export function TruthExplorer({ initialNode, domain = 'general' }: TruthExplorerProps) {
  const [currentView, setCurrentView] = useState<ExplorerView>('orientation');
  const [selectedNode, setSelectedNode] = useState<TruthNode | null>(initialNode ?? null);
  const [navigationPath, setNavigationPath] = useState<string[]>([]);
  const [depthLevel, setDepthLevel] = useState(1);

  const handleNodeSelect = useCallback((node: TruthNode) => {
    setSelectedNode(node);
    setNavigationPath(prev => [...prev, node.node_id]);
    setCurrentView('depth');
  }, []);

  const handleNavigateUp = useCallback(() => {
    if (navigationPath.length > 1) {
      setNavigationPath(prev => prev.slice(0, -1));
      setDepthLevel(prev => Math.max(1, prev - 1));
    } else {
      setCurrentView('orientation');
      setSelectedNode(null);
    }
  }, [navigationPath]);

  const handleGoDeeper = useCallback(() => {
    setDepthLevel(prev => Math.min(5, prev + 1));
  }, []);

  const handleExploreRelation = useCallback((direction: 'up' | 'down' | 'side' | 'forward') => {
    if (direction === 'side') {
      setCurrentView('relations');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      {/* Navigation Bar */}
      <NavigationBar
        currentView={currentView}
        navigationPath={navigationPath}
        onViewChange={setCurrentView}
        onNavigateUp={handleNavigateUp}
        domain={domain}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === 'orientation' && (
          <OrientationView
            onNodeSelect={handleNodeSelect}
            domain={domain}
          />
        )}

        {currentView === 'depth' && selectedNode && (
          <DepthView
            node={selectedNode}
            depthLevel={depthLevel}
            onGoDeeper={handleGoDeeper}
            onExploreRelation={handleExploreRelation}
            onNavigateUp={handleNavigateUp}
          />
        )}

        {currentView === 'relations' && selectedNode && (
          <RelationsView
            node={selectedNode}
            onNodeSelect={handleNodeSelect}
          />
        )}
      </main>

      {/* Compliance Footer — Always Visible */}
      <ComplianceFooter
        selectedNode={selectedNode}
        domain={domain}
      />
    </div>
  );
}
