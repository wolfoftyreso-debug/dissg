/**
 * BLOCK AH — GLOBAL KNOWLEDGE GRAPH
 * Configuration for graph nodes and edges
 */

// AH1: Graph Node Types
export interface NodeTypeConfig {
  type: string;
  label: string;
  description: string;
  sourceTable: string;
  primaryLabel: string; // Field to use as label
  propertyFields: string[]; // Fields to include in properties
  color: string;
  icon: string;
}

export const NODE_TYPES: NodeTypeConfig[] = [
  {
    type: 'kpi',
    label: 'KPI',
    description: 'Key Performance Indicator',
    sourceTable: 'kpi_definitions',
    primaryLabel: 'name',
    propertyFields: ['code', 'category', 'unit', 'description'],
    color: '#3b82f6',
    icon: 'BarChart3'
  },
  {
    type: 'index',
    label: 'Index',
    description: 'Composite index or aggregated measure',
    sourceTable: 'calculated_indicators',
    primaryLabel: 'name',
    propertyFields: ['formula', 'weights'],
    color: '#8b5cf6',
    icon: 'Layers'
  },
  {
    type: 'country',
    label: 'Country',
    description: 'Nation state',
    sourceTable: 'countries',
    primaryLabel: 'name',
    propertyFields: ['code', 'region', 'population', 'gdp_per_capita'],
    color: '#22c55e',
    icon: 'Globe'
  },
  {
    type: 'region',
    label: 'Region',
    description: 'Sub-national region (NUTS, län, kommun)',
    sourceTable: 'regions',
    primaryLabel: 'name',
    propertyFields: ['code', 'nuts_level', 'parent_region'],
    color: '#10b981',
    icon: 'MapPin'
  },
  {
    type: 'event',
    label: 'Event',
    description: 'Global event from taxonomy',
    sourceTable: 'global_events',
    primaryLabel: 'title',
    propertyFields: ['event_time', 'geo_country', 'intensity', 'confidence_score'],
    color: '#f59e0b',
    icon: 'Zap'
  },
  {
    type: 'media_cluster',
    label: 'Media Cluster',
    description: 'Cluster of related news coverage',
    sourceTable: 'media_volume_aggregates',
    primaryLabel: 'topic',
    propertyFields: ['date', 'article_count', 'intensity_score'],
    color: '#ec4899',
    icon: 'Newspaper'
  },
  {
    type: 'policy',
    label: 'Policy',
    description: 'Policy decision or document',
    sourceTable: 'policy_decisions',
    primaryLabel: 'title',
    propertyFields: ['decision_date', 'status', 'responsible_department'],
    color: '#6366f1',
    icon: 'FileText'
  },
  {
    type: 'organization',
    label: 'Organization',
    description: 'Government body, agency, or institution',
    sourceTable: 'organizations',
    primaryLabel: 'name',
    propertyFields: ['type', 'country', 'level'],
    color: '#14b8a6',
    icon: 'Building2'
  },
  {
    type: 'person',
    label: 'Person',
    description: 'Public official or key figure',
    sourceTable: 'public_officials',
    primaryLabel: 'name',
    propertyFields: ['role', 'party', 'start_date'],
    color: '#f97316',
    icon: 'User'
  }
];

// AH2: Graph Edge Types
export interface EdgeTypeConfig {
  type: string;
  label: string;
  description: string;
  validSourceTypes: string[];
  validTargetTypes: string[];
  isDirected: boolean;
  defaultWeight: number;
  color: string;
}

export const EDGE_TYPES: EdgeTypeConfig[] = [
  {
    type: 'affects',
    label: 'Affects',
    description: 'Source has measurable effect on target',
    validSourceTypes: ['event', 'policy', 'media_cluster'],
    validTargetTypes: ['kpi', 'index', 'region'],
    isDirected: true,
    defaultWeight: 0.5,
    color: '#ef4444'
  },
  {
    type: 'correlates_with',
    label: 'Correlates With',
    description: 'Statistical correlation between entities',
    validSourceTypes: ['kpi', 'index', 'media_cluster'],
    validTargetTypes: ['kpi', 'index', 'media_cluster'],
    isDirected: false,
    defaultWeight: 0.5,
    color: '#3b82f6'
  },
  {
    type: 'occurs_in',
    label: 'Occurs In',
    description: 'Event or activity happens in location',
    validSourceTypes: ['event', 'media_cluster', 'policy'],
    validTargetTypes: ['country', 'region'],
    isDirected: true,
    defaultWeight: 1.0,
    color: '#22c55e'
  },
  {
    type: 'reported_by',
    label: 'Reported By',
    description: 'Media coverage of entity',
    validSourceTypes: ['event', 'policy', 'person', 'organization'],
    validTargetTypes: ['media_cluster'],
    isDirected: true,
    defaultWeight: 1.0,
    color: '#ec4899'
  },
  {
    type: 'responsible_for',
    label: 'Responsible For',
    description: 'Entity has responsibility over target',
    validSourceTypes: ['person', 'organization'],
    validTargetTypes: ['kpi', 'policy', 'region'],
    isDirected: true,
    defaultWeight: 0.8,
    color: '#8b5cf6'
  },
  {
    type: 'preceded_by',
    label: 'Preceded By',
    description: 'Temporal sequence relationship',
    validSourceTypes: ['event', 'policy'],
    validTargetTypes: ['event', 'policy'],
    isDirected: true,
    defaultWeight: 0.7,
    color: '#f59e0b'
  },
  {
    type: 'caused_by',
    label: 'Caused By',
    description: 'Causal relationship (requires evidence)',
    validSourceTypes: ['event', 'kpi'],
    validTargetTypes: ['event', 'policy', 'kpi'],
    isDirected: true,
    defaultWeight: 0.3,
    color: '#ef4444'
  },
  {
    type: 'contains',
    label: 'Contains',
    description: 'Hierarchical containment',
    validSourceTypes: ['country', 'region', 'organization', 'index'],
    validTargetTypes: ['region', 'person', 'kpi'],
    isDirected: true,
    defaultWeight: 1.0,
    color: '#6366f1'
  },
  {
    type: 'member_of',
    label: 'Member Of',
    description: 'Membership relationship',
    validSourceTypes: ['person', 'country'],
    validTargetTypes: ['organization'],
    isDirected: true,
    defaultWeight: 1.0,
    color: '#14b8a6'
  },
  {
    type: 'measures',
    label: 'Measures',
    description: 'KPI measures aspect of entity',
    validSourceTypes: ['kpi'],
    validTargetTypes: ['country', 'region', 'organization'],
    isDirected: true,
    defaultWeight: 1.0,
    color: '#3b82f6'
  }
];

// Graph query types
export interface GraphQuery {
  code: string;
  name: string;
  description: string;
  template: string;
}

export const GRAPH_QUERIES: GraphQuery[] = [
  {
    code: 'CONTEXT',
    name: 'What happens around this?',
    description: 'Find all related entities and recent events',
    template: 'MATCH (n)-[r]-(related) WHERE n.id = $entityId RETURN n, r, related LIMIT 50'
  },
  {
    code: 'IMPACT_PATH',
    name: 'Impact path',
    description: 'Trace how an event affects KPIs',
    template: 'MATCH path = (e:event)-[:affects*1..3]->(k:kpi) WHERE e.id = $eventId RETURN path'
  },
  {
    code: 'RESPONSIBILITY',
    name: 'Who is responsible?',
    description: 'Find responsible entities for a KPI or policy',
    template: 'MATCH (p)-[:responsible_for]->(target) WHERE target.id = $targetId RETURN p'
  },
  {
    code: 'CORRELATION_NETWORK',
    name: 'Correlation network',
    description: 'Find all correlated KPIs',
    template: 'MATCH (k1:kpi)-[r:correlates_with]-(k2:kpi) WHERE k1.id = $kpiId RETURN k1, r, k2'
  },
  {
    code: 'TIMELINE',
    name: 'Event timeline',
    description: 'Temporal sequence of events affecting entity',
    template: 'MATCH (e:event)-[:affects]->(target) WHERE target.id = $targetId RETURN e ORDER BY e.event_time'
  }
];

// Helper functions
export function getNodeTypeConfig(type: string): NodeTypeConfig | undefined {
  return NODE_TYPES.find(n => n.type === type);
}

export function getEdgeTypeConfig(type: string): EdgeTypeConfig | undefined {
  return EDGE_TYPES.find(e => e.type === type);
}

export function validateEdge(
  sourceType: string,
  targetType: string,
  edgeType: string
): { valid: boolean; message?: string } {
  const config = getEdgeTypeConfig(edgeType);
  if (!config) {
    return { valid: false, message: `Unknown edge type: ${edgeType}` };
  }
  if (!config.validSourceTypes.includes(sourceType)) {
    return { valid: false, message: `${edgeType} cannot have source of type ${sourceType}` };
  }
  if (!config.validTargetTypes.includes(targetType)) {
    return { valid: false, message: `${edgeType} cannot have target of type ${targetType}` };
  }
  return { valid: true };
}

// ============================================================
// WAVE 9: BT3 — TIDSAXEL I GRAFEN
// ============================================================

export interface GraphSnapshot {
  id: string;
  timestamp: string;
  nodeCount: number;
  edgeCount: number;
  metadata: {
    coverage: string[];
    generatedAt: string;
  };
}

export interface TimelineConfig {
  startYear: number;
  endYear: number;
  granularity: 'year' | 'quarter' | 'month';
  animationSpeed: 'slow' | 'normal' | 'fast';
}

// Extended edge types for Wave 9
export const EXTENDED_EDGE_TYPES = [
  'amplifies',       // Förstärker effekt
  'dampens',         // Dämpar effekt
  'coincides_with',  // Sammanfaller tidsmässigt
  'conditioned_by',  // Villkoras av
  'contradicts'      // Motsäger mönster
] as const;

// Edge analysis methods
export type EdgeAnalysisMethod = 
  | 'statistical_correlation'
  | 'time_series_analysis'
  | 'granger_causality'
  | 'difference_in_differences'
  | 'regression_analysis'
  | 'temporal_coincidence'
  | 'expert_assessment'
  | 'literature_review'
  | 'machine_learning'
  | 'observational';

// Extended edge with Wave 9 requirements
export interface ExtendedEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
  
  // OBLIGATORISKT: Ingen kant utan metod
  strength: number;
  lag?: number;
  confidence: number;
  method: EdgeAnalysisMethod;
  
  // Temporal validity
  validFrom?: string;
  validTo?: string;
  
  // Evidence
  sampleSize?: number;
  pValue?: number;
  sources: string[];
  limitations?: string[];
}

// Neutral phrases for edge types
export const EDGE_NEUTRAL_PHRASES: Record<string, { sv: string; en: string }> = {
  correlates_with: { sv: 'korrelerar med', en: 'correlates with' },
  affects: { sv: 'påverkar', en: 'affects' },
  preceded_by: { sv: 'föregicks av', en: 'preceded by' },
  caused_by: { sv: 'samvarierar med', en: 'co-varies with' }, // Försiktigare
  contains: { sv: 'innehåller', en: 'contains' },
  measures: { sv: 'mäter', en: 'measures' },
  amplifies: { sv: 'förstärker', en: 'amplifies' },
  dampens: { sv: 'dämpar', en: 'dampens' },
  coincides_with: { sv: 'sammanfaller med', en: 'coincides with' },
  conditioned_by: { sv: 'villkoras av', en: 'conditioned by' },
  contradicts: { sv: 'motsäger', en: 'contradicts' }
};
