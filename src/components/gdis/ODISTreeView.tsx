/**
 * ODIS-STYLE TREE VIEW
 * 
 * Hierarkisk trädstruktur med expanderbara noder.
 * Visar diagnosresultat sorterade efter relevans.
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface TreeNode {
  id: string;
  label: string;
  status: 'ok' | 'warning' | 'error' | 'info' | 'pending';
  children?: TreeNode[];
  details?: string;
  code?: string;
  priority?: number;
  metadata?: Record<string, string | number>;
}

interface ODISTreeViewProps {
  title?: string;
  subtitle?: string;
  nodes: TreeNode[];
  onNodeClick?: (node: TreeNode) => void;
  selectedNodeId?: string;
}

export const ODISTreeView: React.FC<ODISTreeViewProps> = ({
  title = 'Tests in current test plan',
  subtitle = 'Tests (sorted according to chances of success)',
  nodes,
  onNodeClick,
  selectedNodeId,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleExpand = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getStatusIndicator = (status: TreeNode['status']) => {
    switch (status) {
      case 'ok':
        return <span className="font-mono text-xs text-emerald-600">[OK]</span>;
      case 'warning':
        return <span className="font-mono text-xs text-amber-600">[-]</span>;
      case 'error':
        return <span className="font-mono text-xs text-red-600">[X]</span>;
      case 'info':
        return <span className="font-mono text-xs text-blue-600">[i]</span>;
      case 'pending':
        return <span className="font-mono text-xs text-muted-foreground">[?]</span>;
    }
  };

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNodeId === node.id;

    return (
      <div key={node.id}>
        {/* Node row */}
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpand(node.id);
            }
            onNodeClick?.(node);
          }}
          className={cn(
            "w-full flex items-start gap-2 px-2 py-1.5 text-left hover:bg-muted/50 transition-colors border-b border-border/50",
            isSelected && "bg-primary/10",
            depth > 0 && "bg-muted/20"
          )}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
        >
          {/* Status column */}
          <div className="w-8 shrink-0 pt-0.5">
            {getStatusIndicator(node.status)}
          </div>

          {/* Expand indicator */}
          {hasChildren && (
            <span className="font-mono text-xs text-muted-foreground w-4 shrink-0">
              {isExpanded ? '[-]' : '[+]'}
            </span>
          )}
          {!hasChildren && <span className="w-4 shrink-0" />}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {node.code && (
                <Badge variant="outline" className="font-mono text-[10px] px-1 py-0">
                  {node.code}
                </Badge>
              )}
              <span className={cn(
                "text-sm truncate",
                node.status === 'error' && "text-destructive font-medium",
                node.status === 'warning' && "text-amber-700 dark:text-amber-400"
              )}>
                {node.label}
              </span>
            </div>
            {node.details && (
              <div className="text-xs text-muted-foreground mt-0.5 font-mono">
                {node.details}
              </div>
            )}
          </div>
        </button>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col border border-border rounded-sm bg-background overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border bg-muted/30">
        <div className="text-xs font-medium text-foreground">{title}</div>
        <div className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</div>
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-2 px-2 py-1 border-b border-border bg-muted/20 text-[10px] text-muted-foreground uppercase tracking-wider">
        <div className="w-8 shrink-0">Status</div>
        <div className="w-4 shrink-0"></div>
        <div className="flex-1">Test / Module / Indicator</div>
      </div>

      {/* Tree content */}
      <div className="flex-1 overflow-y-auto">
        {nodes.map(node => renderNode(node, 0))}
      </div>

      {/* Footer info */}
      <div className="px-3 py-1.5 border-t border-border bg-muted/20">
        <span className="font-mono text-[10px] text-muted-foreground">
          {nodes.length} top-level items
        </span>
      </div>
    </div>
  );
};

export default ODISTreeView;
