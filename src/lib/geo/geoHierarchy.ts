/**
 * Global Geographic Hierarchy Model
 * Block B: Geo Engine
 * Unified geo hierarchy: World → Region → Country → State/Province → Municipality → District
 */

export type GeoLevel = 'world' | 'region' | 'country' | 'state' | 'municipality' | 'district';

export interface GeoNode {
  /** Global unique identifier (GMID format) */
  id: string;
  /** Display name */
  name: string;
  /** Localized name */
  nameLocal?: string;
  /** Geographic level */
  level: GeoLevel;
  /** Parent node ID */
  parentId?: string;
  /** ISO code (for countries) or NUTS code (for regions) */
  code?: string;
  /** ISO 3166-1 alpha-2 for countries */
  countryCode?: string;
  /** Population (for per-capita calculations) */
  population?: number;
  /** Area in km² (for per-area calculations) */
  areaKm2?: number;
  /** Data availability tier */
  dataTier?: 'A' | 'B' | 'C' | 'D';
  /** Whether data exists for this node */
  hasData: boolean;
  /** Coordinates [lat, lng] */
  coordinates?: [number, number];
}

export interface GeoPath {
  /** Full path from world to current node */
  nodes: GeoNode[];
  /** Current depth level */
  depth: number;
}

export interface GeoContext {
  /** Current selected node */
  current: GeoNode;
  /** Parent context */
  parent?: GeoNode;
  /** Sibling nodes at same level */
  siblings?: GeoNode[];
  /** Child nodes */
  children?: GeoNode[];
  /** Full path to root */
  path: GeoPath;
}

/**
 * Data tier definitions
 * A: Full coverage, high quality
 * B: Good coverage, some gaps
 * C: Partial coverage, significant gaps
 * D: Limited data, high uncertainty
 */
export const DATA_TIER_DEFINITIONS = {
  A: {
    label: 'Full täckning',
    description: 'Hög datakvalitet med komplett täckning',
    minCoverage: 0.9,
    uncertainty: 'low',
  },
  B: {
    label: 'God täckning',
    description: 'God datakvalitet med mindre luckor',
    minCoverage: 0.7,
    uncertainty: 'low',
  },
  C: {
    label: 'Partiell täckning',
    description: 'Begränsad data med betydande luckor',
    minCoverage: 0.4,
    uncertainty: 'medium',
  },
  D: {
    label: 'Begränsad data',
    description: 'Mycket begränsad data med hög osäkerhet',
    minCoverage: 0,
    uncertainty: 'high',
  },
} as const;

/**
 * Generate GMID (Global Municipality ID)
 * Format: {ISO3}-{ADMIN1}-{ADMIN2}-{LOCAL_CODE}
 */
export function generateGMID(
  countryCode: string,
  admin1Code?: string,
  admin2Code?: string,
  localCode?: string
): string {
  const parts = [countryCode.toUpperCase()];
  if (admin1Code) parts.push(admin1Code.toUpperCase());
  if (admin2Code) parts.push(admin2Code.toUpperCase());
  if (localCode) parts.push(localCode.toUpperCase());
  return parts.join('-');
}

/**
 * Parse GMID into components
 */
export function parseGMID(gmid: string): {
  countryCode: string;
  admin1Code?: string;
  admin2Code?: string;
  localCode?: string;
} {
  const parts = gmid.split('-');
  return {
    countryCode: parts[0],
    admin1Code: parts[1],
    admin2Code: parts[2],
    localCode: parts[3],
  };
}

/**
 * Get geo level from GMID depth
 */
export function getGeoLevelFromGMID(gmid: string): GeoLevel {
  const parts = gmid.split('-').length;
  switch (parts) {
    case 1: return 'country';
    case 2: return 'state';
    case 3: return 'municipality';
    case 4: return 'district';
    default: return 'country';
  }
}

/**
 * World regions for top-level grouping
 */
export const WORLD_REGIONS = [
  { id: 'EUROPE', name: 'Europe', nameLocal: 'Europa' },
  { id: 'NORTH_AMERICA', name: 'North America', nameLocal: 'Nordamerika' },
  { id: 'SOUTH_AMERICA', name: 'South America', nameLocal: 'Sydamerika' },
  { id: 'ASIA', name: 'Asia', nameLocal: 'Asien' },
  { id: 'AFRICA', name: 'Africa', nameLocal: 'Afrika' },
  { id: 'OCEANIA', name: 'Oceania', nameLocal: 'Oceanien' },
  { id: 'MIDDLE_EAST', name: 'Middle East', nameLocal: 'Mellanöstern' },
] as const;

/**
 * Geo level display labels
 */
export const GEO_LEVEL_LABELS: Record<GeoLevel, { en: string; sv: string }> = {
  world: { en: 'World', sv: 'Världen' },
  region: { en: 'Region', sv: 'Region' },
  country: { en: 'Country', sv: 'Land' },
  state: { en: 'State/Province', sv: 'Län/Region' },
  municipality: { en: 'Municipality', sv: 'Kommun' },
  district: { en: 'District', sv: 'Distrikt' },
};

/**
 * Check if two geo nodes are comparable
 */
export function areGeoNodesComparable(nodeA: GeoNode, nodeB: GeoNode): {
  comparable: boolean;
  reason?: string;
  warnings?: string[];
} {
  // Must be same level
  if (nodeA.level !== nodeB.level) {
    return {
      comparable: false,
      reason: `Kan inte jämföra ${GEO_LEVEL_LABELS[nodeA.level].sv} med ${GEO_LEVEL_LABELS[nodeB.level].sv}`,
    };
  }

  // Both must have data
  if (!nodeA.hasData || !nodeB.hasData) {
    return {
      comparable: false,
      reason: 'Data saknas för en eller båda platserna',
    };
  }

  const warnings: string[] = [];

  // Check data tier difference
  if (nodeA.dataTier && nodeB.dataTier && nodeA.dataTier !== nodeB.dataTier) {
    warnings.push(`Olika datakvalitet: ${nodeA.name} (${nodeA.dataTier}) vs ${nodeB.name} (${nodeB.dataTier})`);
  }

  // Check population difference (>10x suggests non-comparable contexts)
  if (nodeA.population && nodeB.population) {
    const ratio = Math.max(nodeA.population, nodeB.population) / Math.min(nodeA.population, nodeB.population);
    if (ratio > 10) {
      warnings.push(`Stor befolkningsskillnad (${Math.round(ratio)}x) kan påverka jämförbarheten`);
    }
  }

  return {
    comparable: true,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Fallback display for missing data
 */
export const MISSING_DATA_FALLBACK = {
  text: 'Data saknas för denna geografiska nivå',
  shortText: 'Data saknas',
  icon: 'alert-circle',
} as const;

/**
 * Build breadcrumb path from geo context
 */
export function buildGeoBreadcrumb(context: GeoContext): Array<{ id: string; name: string; level: GeoLevel }> {
  return context.path.nodes.map(node => ({
    id: node.id,
    name: node.name,
    level: node.level,
  }));
}
