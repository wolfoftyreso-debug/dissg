/**
 * LINK REGISTRY
 * ═══════════════════════════════════════════════════════════════
 * 
 * Central structure for all navigation links in DISSG.
 * This is the backbone infrastructure for aggregated data.
 * Designed for machine-readability (AI grounding, search engines).
 * 
 * Structure: Global → Region → Country → Province → Municipal → District
 */

export type EntityType = 
  | 'global'
  | 'region' 
  | 'country' 
  | 'province' 
  | 'municipal'
  | 'district'
  | 'indicator'
  | 'index'
  | 'observation'
  | 'source'
  | 'mode'; // Navigation/instrument modes

export interface EntityLink {
  id: string;
  type: EntityType;
  code: string;
  name: string;
  name_local?: string;
  path: string;
  parent_id?: string;
  children_count?: number;
  data_tier?: 'A' | 'B' | 'C' | 'D';
  last_updated?: string;
}

export interface BreadcrumbItem {
  id: string;
  type: EntityType;
  code: string;
  name: string;
  name_local?: string;
  path: string;
  level: number;
}

// Canonical paths for each entity type
export const ENTITY_PATH_PATTERNS: Record<EntityType, string> = {
  global: '/',
  region: '/region/:code',
  country: '/country/:code',
  province: '/country/:countryCode/province/:code',
  municipal: '/country/:countryCode/municipal/:code',
  district: '/country/:countryCode/municipal/:municipalCode/district/:code',
  indicator: '/indicator/:code',
  index: '/index/:code',
  observation: '/observation/:id',
  source: '/source/:code',
  mode: '/:code', // Navigation modes
};

// Generate canonical path for an entity
export function generateEntityPath(entity: EntityLink, parents?: EntityLink[]): string {
  let path = ENTITY_PATH_PATTERNS[entity.type];
  
  path = path.replace(':code', entity.code);
  path = path.replace(':id', entity.id);
  
  if (parents) {
    const country = parents.find(p => p.type === 'country');
    const municipal = parents.find(p => p.type === 'municipal');
    
    if (country) {
      path = path.replace(':countryCode', country.code);
    }
    if (municipal) {
      path = path.replace(':municipalCode', municipal.code);
    }
  }
  
  return path;
}

// Build breadcrumb trail from current location
export function buildBreadcrumbs(
  current: EntityLink,
  ancestors: EntityLink[] = []
): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [];
  
  // Always start with global
  crumbs.push({
    id: 'global',
    type: 'global',
    code: 'GLOBAL',
    name: 'Global',
    path: '/',
    level: 0,
  });
  
  // Add ancestors in order
  ancestors.forEach((ancestor, index) => {
    crumbs.push({
      id: ancestor.id,
      type: ancestor.type,
      code: ancestor.code,
      name: ancestor.name,
      name_local: ancestor.name_local,
      path: ancestor.path,
      level: index + 1,
    });
  });
  
  // Add current if not global
  if (current.type !== 'global') {
    crumbs.push({
      id: current.id,
      type: current.type,
      code: current.code,
      name: current.name,
      name_local: current.name_local,
      path: current.path,
      level: crumbs.length,
    });
  }
  
  return crumbs;
}

// Machine-readable JSON-LD for an entity
export function generateEntityJsonLd(
  entity: EntityLink,
  breadcrumbs: BreadcrumbItem[],
  baseUrl: string = 'https://dissg.app'
): object {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': getSchemaType(entity.type),
    '@id': `${baseUrl}${entity.path}`,
    'identifier': entity.code,
    'name': entity.name,
  };
  
  if (entity.name_local && entity.name_local !== entity.name) {
    jsonLd['alternateName'] = entity.name_local;
  }
  
  if (entity.data_tier) {
    jsonLd['additionalProperty'] = {
      '@type': 'PropertyValue',
      'name': 'dataTier',
      'value': entity.data_tier,
    };
  }
  
  if (entity.last_updated) {
    jsonLd['dateModified'] = entity.last_updated;
  }
  
  // Add breadcrumb list
  jsonLd['breadcrumb'] = {
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': crumb.name_local || crumb.name,
      'item': `${baseUrl}${crumb.path}`,
    })),
  };
  
  // Add parent relationship
  if (breadcrumbs.length > 1) {
    const parent = breadcrumbs[breadcrumbs.length - 2];
    jsonLd['isPartOf'] = {
      '@type': getSchemaType(parent.type),
      '@id': `${baseUrl}${parent.path}`,
      'name': parent.name,
    };
  }
  
  return jsonLd;
}

// Map entity type to Schema.org type
function getSchemaType(type: EntityType): string {
  switch (type) {
    case 'global':
      return 'WebSite';
    case 'region':
      return 'Continent';
    case 'country':
      return 'Country';
    case 'province':
      return 'AdministrativeArea';
    case 'municipal':
      return 'City';
    case 'district':
      return 'AdministrativeArea';
    case 'indicator':
      return 'StatisticalVariable';
    case 'index':
      return 'Dataset';
    case 'observation':
      return 'Observation';
    case 'source':
      return 'Organization';
    default:
      return 'Thing';
  }
}

// Canonical cite URL for machine references
export function generateCiteUrl(entity: EntityLink, baseUrl: string = 'https://dissg.app'): string {
  return `${baseUrl}/cite/${entity.type}/${entity.code}`;
}

// API endpoint for machine access
export function generateApiUrl(entity: EntityLink, baseUrl: string = 'https://api.dissg.app'): string {
  return `${baseUrl}/v1/${entity.type}/${entity.code}`;
}

// Entity type hierarchy levels
export const ENTITY_LEVELS: Record<EntityType, number> = {
  global: 0,
  region: 1,
  country: 2,
  province: 3,
  municipal: 4,
  district: 5,
  indicator: 2, // Same level as country (cross-cutting)
  index: 2,
  observation: 3,
  source: 1,
  mode: 3, // Instrument modes
};

// Get parent entity type
export function getParentType(type: EntityType): EntityType | null {
  switch (type) {
    case 'global': return null;
    case 'region': return 'global';
    case 'country': return 'region';
    case 'province': return 'country';
    case 'municipal': return 'country';
    case 'district': return 'municipal';
    default: return 'global';
  }
}

// Get child entity types
export function getChildTypes(type: EntityType): EntityType[] {
  switch (type) {
    case 'global': return ['region'];
    case 'region': return ['country'];
    case 'country': return ['province', 'municipal'];
    case 'province': return ['municipal'];
    case 'municipal': return ['district'];
    default: return [];
  }
}
