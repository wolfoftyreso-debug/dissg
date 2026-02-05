/**
 * PIPELINE STAGE 3: ENTITY RESOLUTION
 * 
 * What the question is about.
 * Separate, deterministic step.
 * No conclusions — only identification.
 */

import type { ResolvedEntity, EntityStub, EntityType } from './types';

/**
 * Entity ontology registry
 */
const entityRegistry: Map<string, ResolvedEntity> = new Map();
const stubRegistry: Map<string, EntityStub> = new Map();

/**
 * Resolve entity from query/text
 */
export function resolveEntity(
  entityName: string,
  context?: string
): ResolvedEntity | EntityStub {
  // Check known entities first
  const knownEntity = findKnownEntity(entityName);
  if (knownEntity) {
    return knownEntity;
  }
  
  // Try to classify unknown entity
  const entityType = classifyEntityType(entityName, context);
  
  // If high confidence, create resolved entity
  if (entityType.confidence >= 0.8) {
    const resolved: ResolvedEntity = {
      entity_id: generateEntityId(entityName),
      entity_name: entityName,
      entity_type: entityType.type,
      ontology_path: buildOntologyPath(entityType.type, entityName),
      confidence: entityType.confidence,
      fallback: false,
      alternatives: findAlternatives(entityName, entityType.type),
    };
    
    entityRegistry.set(resolved.entity_id, resolved);
    return resolved;
  }
  
  // Otherwise create stub
  return createEntityStub(entityName, entityType.type);
}

/**
 * Find known entity in registry
 */
function findKnownEntity(name: string): ResolvedEntity | undefined {
  const normalized = name.toLowerCase().trim();
  
  for (const entity of entityRegistry.values()) {
    if (entity.entity_name.toLowerCase() === normalized) {
      return entity;
    }
  }
  
  return undefined;
}

/**
 * Classify entity type from name and context
 */
function classifyEntityType(
  name: string,
  context?: string
): { type: EntityType; confidence: number } {
  const nameLower = name.toLowerCase();
  const contextLower = (context || '').toLowerCase();
  
  // Vehicle detection
  if (isLikelyVehicle(nameLower, contextLower)) {
    return { type: 'vehicle_model', confidence: 0.9 };
  }
  
  // Financial instrument detection
  if (isLikelyFinancial(nameLower, contextLower)) {
    return { type: 'financial_instrument', confidence: 0.85 };
  }
  
  // Medical detection
  if (isLikelyMedical(nameLower, contextLower)) {
    return { type: 'medical_condition', confidence: 0.8 };
  }
  
  // Policy detection
  if (isLikelyPolicy(nameLower, contextLower)) {
    return { type: 'policy', confidence: 0.8 };
  }
  
  // Consumer product (default for product queries)
  if (isLikelyConsumerProduct(nameLower, contextLower)) {
    return { type: 'consumer_product', confidence: 0.75 };
  }
  
  // Unknown
  return { type: 'unknown', confidence: 0.3 };
}

/**
 * Vehicle detection heuristics
 */
function isLikelyVehicle(name: string, context: string): boolean {
  const vehicleBrands = [
    'volkswagen', 'vw', 'toyota', 'honda', 'ford', 'bmw', 'mercedes',
    'audi', 'volvo', 'tesla', 'hyundai', 'kia', 'mazda', 'subaru'
  ];
  const vehicleTerms = ['car', 'vehicle', 'suv', 'sedan', 'truck', 'model'];
  
  return vehicleBrands.some(b => name.includes(b)) ||
         vehicleTerms.some(t => name.includes(t) || context.includes(t));
}

/**
 * Financial detection heuristics
 */
function isLikelyFinancial(name: string, context: string): boolean {
  const financialTerms = [
    'stock', 'bond', 'fund', 'etf', 'investment', 'bitcoin', 'crypto',
    'forex', 'options', 'futures', 'index'
  ];
  
  return financialTerms.some(t => name.includes(t) || context.includes(t));
}

/**
 * Medical detection heuristics
 */
function isLikelyMedical(name: string, context: string): boolean {
  const medicalTerms = [
    'disease', 'condition', 'syndrome', 'treatment', 'medication',
    'symptom', 'diagnosis', 'therapy'
  ];
  
  return medicalTerms.some(t => name.includes(t) || context.includes(t));
}

/**
 * Policy detection heuristics
 */
function isLikelyPolicy(name: string, context: string): boolean {
  const policyTerms = [
    'policy', 'law', 'regulation', 'reform', 'tax', 'subsidy',
    'mandate', 'legislation', 'act', 'bill'
  ];
  
  return policyTerms.some(t => name.includes(t) || context.includes(t));
}

/**
 * Consumer product detection
 */
function isLikelyConsumerProduct(name: string, context: string): boolean {
  const productTerms = [
    'buy', 'purchase', 'product', 'brand', 'model', 'review',
    'price', 'worth'
  ];
  
  return productTerms.some(t => context.includes(t));
}

/**
 * Generate entity ID
 */
function generateEntityId(name: string): string {
  const slug = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  return `entity_${slug}_${Date.now()}`;
}

/**
 * Build ontology path
 */
function buildOntologyPath(type: EntityType, name: string): string[] {
  const paths: Record<EntityType, string[]> = {
    vehicle_model: ['products', 'vehicles', 'models'],
    vehicle_brand: ['products', 'vehicles', 'brands'],
    consumer_product: ['products', 'consumer'],
    service: ['services'],
    financial_instrument: ['finance', 'instruments'],
    policy: ['governance', 'policies'],
    medical_condition: ['health', 'conditions'],
    treatment: ['health', 'treatments'],
    phenomenon: ['phenomena'],
    organization: ['organizations'],
    location: ['geography', 'locations'],
    unknown: ['unclassified'],
  };
  
  return [...paths[type], name.toLowerCase().replace(/\s+/g, '_')];
}

/**
 * Find alternative entities (for comparison)
 */
function findAlternatives(name: string, type: EntityType): string[] {
  // In production, this would query a database
  // For now, return placeholder based on type
  const alternatives: Record<EntityType, string[]> = {
    vehicle_model: ['Alternative Model A', 'Alternative Model B'],
    vehicle_brand: [],
    consumer_product: ['Alternative Product A', 'Alternative Product B'],
    service: ['Alternative Service A'],
    financial_instrument: ['Alternative Investment A'],
    policy: ['Alternative Policy A'],
    medical_condition: [],
    treatment: ['Alternative Treatment A', 'Alternative Treatment B'],
    phenomenon: [],
    organization: [],
    location: [],
    unknown: [],
  };
  
  return alternatives[type] || [];
}

/**
 * Create entity stub for unknown entities
 */
function createEntityStub(name: string, provisionalType: EntityType): EntityStub {
  const stub: EntityStub = {
    stub_id: `stub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    provisional_name: name,
    provisional_type: provisionalType,
    created_at: new Date().toISOString(),
    pending_data: ['basic_info', 'category_confirmation', 'alternatives'],
    status: 'pending',
  };
  
  stubRegistry.set(stub.stub_id, stub);
  return stub;
}

/**
 * Check if result is a stub
 */
export function isEntityStub(
  result: ResolvedEntity | EntityStub
): result is EntityStub {
  return 'stub_id' in result;
}

/**
 * Get all stubs pending resolution
 */
export function getPendingStubs(): EntityStub[] {
  return Array.from(stubRegistry.values()).filter(s => s.status === 'pending');
}

/**
 * ENTITY RESOLVER MASTERPROMPT
 */
export const ENTITY_RESOLVER_MASTERPROMPT = `
You perform ENTITY RESOLUTION.

PRINCIPLE:
Separate, deterministic step.
No conclusions here — only identification.

PROCESS:
1. Identify entity (product, service, policy, phenomenon)
2. Match against ontology
3. If unknown → create Entity Stub (pending data)

OUTPUT:
{
  "entity": "Volkswagen Golf",
  "entity_type": "vehicle_model",
  "confidence": 0.98,
  "fallback": false
}

RULES:
- Deterministic classification
- High confidence (≥0.8) → Resolved Entity
- Low confidence → Entity Stub
- No conclusions, only identification
- Always find alternatives for comparison
- Build ontology path

ENTITY TYPES:
- vehicle_model, vehicle_brand
- consumer_product, service
- financial_instrument
- policy
- medical_condition, treatment
- phenomenon, organization, location
- unknown

STUBS:
When entity is unknown:
{
  "stub_id": "stub_xxx",
  "provisional_name": "Unknown Product",
  "provisional_type": "unknown",
  "status": "pending",
  "pending_data": ["basic_info", "category_confirmation"]
}
`;
