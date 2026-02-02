/**
 * WAVE 9: BLOCK BT — GLOBAL REALITY GRAPH VISUALIZATION
 * 
 * Visualiserar kunskapsgrafen med noder och kanter.
 * Allt är en nod. Inget är sekundärt.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Network, 
  Globe, 
  TrendingUp, 
  FileText, 
  Zap, 
  Users,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Info
} from 'lucide-react';
import { NODE_TYPES, EDGE_NEUTRAL_PHRASES } from '@/config/knowledgeGraphConfig';

interface GraphNode {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  connections: number;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  strength: number;
  confidence: number;
}

interface GlobalRealityGraphProps {
  selectedYear?: number;
  onNodeClick?: (nodeId: string) => void;
}

export function GlobalRealityGraph({ selectedYear = 2024, onNodeClick }: GlobalRealityGraphProps) {
  const [currentYear, setCurrentYear] = useState(selectedYear);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNodeType, setSelectedNodeType] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Mock graph data
  const nodes: GraphNode[] = [
    { id: 'kpi_gdp', type: 'kpi', label: 'BNP', x: 50, y: 50, connections: 12 },
    { id: 'kpi_unemp', type: 'kpi', label: 'Arbetslöshet', x: 30, y: 30, connections: 8 },
    { id: 'country_se', type: 'country', label: 'Sverige', x: 70, y: 40, connections: 25 },
    { id: 'policy_rate', type: 'policy', label: 'Räntebesked', x: 40, y: 70, connections: 6 },
    { id: 'event_energy', type: 'event', label: 'Energikris 2022', x: 60, y: 60, connections: 15 },
    { id: 'demo_youth', type: 'person', label: 'Unga 18-25', x: 25, y: 55, connections: 4 }
  ];

  const edges: GraphEdge[] = [
    { id: 'e1', source: 'policy_rate', target: 'kpi_gdp', type: 'affects', strength: 0.65, confidence: 0.8 },
    { id: 'e2', source: 'kpi_gdp', target: 'kpi_unemp', type: 'correlates_with', strength: 0.72, confidence: 0.85 },
    { id: 'e3', source: 'event_energy', target: 'kpi_gdp', type: 'affects', strength: 0.45, confidence: 0.7 },
    { id: 'e4', source: 'kpi_unemp', target: 'demo_youth', type: 'measures', strength: 0.9, confidence: 0.95 }
  ];

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'kpi': return <TrendingUp className="h-4 w-4" />;
      case 'country': return <Globe className="h-4 w-4" />;
      case 'policy': return <FileText className="h-4 w-4" />;
      case 'event': return <Zap className="h-4 w-4" />;
      case 'person': return <Users className="h-4 w-4" />;
      default: return <Network className="h-4 w-4" />;
    }
  };

  const getNodeColor = (type: string) => {
    const config = NODE_TYPES.find(n => n.type === type);
    return config?.color || '#6b7280';
  };

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    onNodeClick?.(node.id);
  };

  const filteredNodes = selectedNodeType === 'all' 
    ? nodes 
    : nodes.filter(n => n.type === selectedNodeType);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Global Reality Graph
          </CardTitle>
          <Badge variant="outline">{currentYear}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Alla samband är explicit typade med styrka, fördröjning och metod
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex items-center gap-4 flex-wrap">
          <Select value={selectedNodeType} onValueChange={setSelectedNodeType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Nodtyp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla typer</SelectItem>
              {NODE_TYPES.slice(0, 6).map(type => (
                <SelectItem key={type.type} value={type.type}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Timeline controls */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setCurrentYear(y => Math.max(2000, y - 1))}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setCurrentYear(y => Math.min(2024, y + 1))}>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Slider
              value={[currentYear]}
              onValueChange={([v]) => setCurrentYear(v)}
              min={2000}
              max={2024}
              step={1}
            />
          </div>
        </div>

        {/* Graph Visualization (simplified) */}
        <div className="relative bg-muted/30 rounded-lg p-4 min-h-[300px]">
          {/* SVG for edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {edges.map(edge => {
              const source = nodes.find(n => n.id === edge.source);
              const target = nodes.find(n => n.id === edge.target);
              if (!source || !target) return null;
              
              return (
                <line
                  key={edge.id}
                  x1={`${source.x}%`}
                  y1={`${source.y}%`}
                  x2={`${target.x}%`}
                  y2={`${target.y}%`}
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={edge.strength * 3}
                  strokeOpacity={edge.confidence}
                  strokeDasharray={edge.type === 'correlates_with' ? '4 2' : undefined}
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {filteredNodes.map(node => (
            <button
              key={node.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-background border-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                selectedNode?.id === node.id ? 'ring-2 ring-primary' : ''
              }`}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                borderColor: getNodeColor(node.type)
              }}
              onClick={() => handleNodeClick(node)}
            >
              <div className="flex flex-col items-center gap-1">
                {getNodeIcon(node.type)}
                <span className="text-xs font-medium whitespace-nowrap">{node.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Node Details */}
        {selectedNode && (
          <div className="p-3 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getNodeIcon(selectedNode.type)}
                <span className="font-medium">{selectedNode.label}</span>
                <Badge variant="outline" className="text-xs">
                  {NODE_TYPES.find(n => n.type === selectedNode.type)?.label}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {selectedNode.connections} kopplingar
              </span>
            </div>
            
            {/* Connected edges */}
            <div className="space-y-1">
              {edges
                .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                .map(edge => {
                  const otherNodeId = edge.source === selectedNode.id ? edge.target : edge.source;
                  const otherNode = nodes.find(n => n.id === otherNodeId);
                  const phrase = EDGE_NEUTRAL_PHRASES[edge.type]?.sv || edge.type;
                  
                  return (
                    <div key={edge.id} className="text-sm flex items-center gap-2">
                      <span className="text-muted-foreground">{phrase}</span>
                      <span className="font-medium">{otherNode?.label}</span>
                      <span className="text-xs text-muted-foreground">
                        (styrka: {(edge.strength * 100).toFixed(0)}%, konf: {(edge.confidence * 100).toFixed(0)}%)
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-3 pt-2 border-t">
          {NODE_TYPES.slice(0, 6).map(type => (
            <div key={type.type} className="flex items-center gap-1.5 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: type.color }}
              />
              <span>{type.label}</span>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <p>
            Alla relationer visas med explicit metod och konfidensnivå. 
            Grafen visar observerade samband, inte nödvändigtvis kausala samband.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default GlobalRealityGraph;
