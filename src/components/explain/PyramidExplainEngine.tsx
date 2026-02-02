/**
 * Explanation Pyramid Engine - Infinite Depth, Zero Confusion
 * 
 * Every statement is clickable downward (0→4).
 * User controls their own cognitive load.
 * No scroll-dump. No wall of text. Only on-demand depth.
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Database, Copy, FileText } from 'lucide-react';
import {
  EXPLANATION_LEVELS,
  type ExplanationLevel,
  type ExplanationNode,
  generateBreadcrumb,
  DEPTH_PROMPTS,
} from '@/config/explanationPyramid';

interface ExplainBlockProps {
  node: ExplanationNode;
  onDeeperClick?: (level: ExplanationLevel) => void;
  className?: string;
}

/**
 * Single explanation block at a specific level
 */
export function PyramidExplainBlock({ node, onDeeperClick, className }: ExplainBlockProps) {
  const levelConfig = EXPLANATION_LEVELS[node.level];
  const nextLevel = (node.level + 1) as ExplanationLevel;
  const hasDeeper = node.level < 4;
  
  return (
    <div className={cn('space-y-3', className)}>
      {/* Level indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="px-2 py-0.5 bg-muted rounded font-medium">
          L{node.level}
        </span>
        <span>{levelConfig.name}</span>
      </div>
      
      {/* Content */}
      <div className="text-foreground leading-relaxed">
        {node.content}
      </div>
      
      {/* Sources (if any) */}
      {node.sources.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Sources: {node.sources.join(', ')}
        </div>
      )}
      
      {/* Go deeper button */}
      {hasDeeper && onDeeperClick && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDeeperClick(nextLevel)}
          className="text-primary hover:text-primary/80 p-0 h-auto font-normal"
        >
          <ChevronDown className="h-4 w-4 mr-1" />
          {levelConfig.nextPrompt}
        </Button>
      )}
      
      {/* Level 4 actions */}
      {node.level === 4 && (
        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="outline" size="sm">
            <Database className="h-3 w-3 mr-1" />
            {DEPTH_PROMPTS.actions.api}
          </Button>
          <Button variant="outline" size="sm">
            <Copy className="h-3 w-3 mr-1" />
            {DEPTH_PROMPTS.actions.cite}
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-3 w-3 mr-1" />
            {DEPTH_PROMPTS.actions.download}
          </Button>
        </div>
      )}
    </div>
  );
}

interface PyramidExplainEngineProps {
  nodes: ExplanationNode[];
  initialLevel?: ExplanationLevel;
  className?: string;
}

/**
 * Full Pyramid Explain Engine - manages the 5-level explanation pyramid
 */
export function PyramidExplainEngine({ nodes, initialLevel = 0, className }: PyramidExplainEngineProps) {
  const [currentLevel, setCurrentLevel] = useState<ExplanationLevel>(initialLevel);
  const [expandedLevels, setExpandedLevels] = useState<Set<ExplanationLevel>>(new Set([initialLevel]));
  
  // Get nodes for current and expanded levels
  const visibleNodes = nodes.filter(n => expandedLevels.has(n.level));
  
  // Sort by level
  const sortedNodes = [...visibleNodes].sort((a, b) => a.level - b.level);
  
  // Generate breadcrumb for navigation
  const rootNode = nodes.find(n => n.level === 0);
  const breadcrumb = rootNode 
    ? generateBreadcrumb(rootNode.node_id, rootNode.scope, currentLevel)
    : [];
  
  function handleDeeperClick(level: ExplanationLevel) {
    setExpandedLevels(prev => new Set([...prev, level]));
    setCurrentLevel(level);
  }
  
  function handleLevelClick(level: ExplanationLevel) {
    // Collapse all levels deeper than clicked
    const newExpanded = new Set<ExplanationLevel>();
    for (let i = 0; i <= level; i++) {
      newExpanded.add(i as ExplanationLevel);
    }
    setExpandedLevels(newExpanded);
    setCurrentLevel(level);
  }
  
  return (
    <div className={cn('space-y-6', className)}>
      {/* Breadcrumb navigation */}
      <nav className="flex items-center gap-1 text-sm">
        {breadcrumb.map((item, i) => (
          <span key={item.level} className="flex items-center gap-1">
            {i > 0 && <span className="text-muted-foreground">→</span>}
            <button
              onClick={() => handleLevelClick(item.level)}
              className={cn(
                'hover:text-primary transition-colors',
                item.level === currentLevel 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground'
              )}
            >
              {item.label}
            </button>
          </span>
        ))}
      </nav>
      
      {/* Explanation blocks */}
      <div className="space-y-6">
        {sortedNodes.map((node) => (
          <div 
            key={node.node_id}
            className={cn(
              'border-l-2 pl-4 transition-all',
              node.level === currentLevel 
                ? 'border-primary' 
                : 'border-border/50'
            )}
          >
            <PyramidExplainBlock
              node={node}
              onDeeperClick={handleDeeperClick}
            />
          </div>
        ))}
      </div>
      
      {/* Back to top */}
      {currentLevel > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleLevelClick(0)}
          className="text-muted-foreground"
        >
          <ChevronUp className="h-4 w-4 mr-1" />
          {DEPTH_PROMPTS.goShallower[0]}
        </Button>
      )}
    </div>
  );
}

/**
 * Demo component showing the 5-level pyramid
 */
export function PyramidExplainDemo() {
  const demoNodes: ExplanationNode[] = [
    {
      node_id: 'demo-0',
      explains: null,
      level: 0,
      scope: 'Employment in Sweden',
      content: 'Employment rate in Sweden increased from 74% to 78% between 2015 and 2023.',
      sources: ['SCB'],
      limitations: [],
      children: ['demo-1'],
      created_at: new Date().toISOString(),
      version: 1,
      url: '/explain/employment-sweden',
      breadcrumb: [],
    },
    {
      node_id: 'demo-1',
      explains: 'demo-0',
      level: 1,
      scope: 'Employment in Sweden',
      content: 'This observation is based on the Labour Force Survey (LFS), measuring the share of population aged 15-74 in employment. Data is aggregated at national level from monthly surveys.',
      sources: ['SCB Labour Force Survey'],
      limitations: [],
      children: ['demo-2'],
      created_at: new Date().toISOString(),
      version: 1,
      url: '/explain/employment-sweden/mechanism',
      breadcrumb: [],
    },
    {
      node_id: 'demo-2',
      explains: 'demo-1',
      level: 2,
      scope: 'Employment in Sweden',
      content: 'Employment is defined as having worked at least 1 hour during the reference week, or having a job to return to. The survey samples approximately 29,500 individuals monthly. Standard error is ±0.4 percentage points.',
      sources: ['SCB Labour Force Survey Methodology Report 2023'],
      limitations: ['Sampling error', 'Non-response bias'],
      children: ['demo-3'],
      created_at: new Date().toISOString(),
      version: 1,
      url: '/explain/employment-sweden/method',
      breadcrumb: [],
    },
    {
      node_id: 'demo-3',
      explains: 'demo-2',
      level: 3,
      scope: 'Employment in Sweden',
      content: 'This data does not capture: informal employment, undeclared work, quality of employment (hours, wages, security), or employment among undocumented residents. The 1-hour threshold may overstate meaningful employment.',
      sources: [],
      limitations: ['Informal sector excluded', 'Quality not measured', 'Undocumented excluded'],
      children: ['demo-4'],
      created_at: new Date().toISOString(),
      version: 1,
      url: '/explain/employment-sweden/limitations',
      breadcrumb: [],
    },
    {
      node_id: 'demo-4',
      explains: 'demo-3',
      level: 4,
      scope: 'Employment in Sweden',
      content: 'Raw data available via SCB API. Dataset ID: AM0401. Time series: 1963-present. Update frequency: Monthly. License: CC0.',
      sources: ['https://api.scb.se/OV0104/v1/doris/sv/ssd/AM/AM0401'],
      limitations: [],
      children: [],
      created_at: new Date().toISOString(),
      version: 1,
      url: '/explain/employment-sweden/data',
      breadcrumb: [],
    },
  ];
  
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Explanation Pyramid Demo</h1>
        <p className="text-muted-foreground">
          Click to go deeper. Each level reveals more detail without forcing navigation.
        </p>
      </div>
      
      <PyramidExplainEngine nodes={demoNodes} />
    </div>
  );
}
