/**
 * STEP 2: ENTITY RESOLUTION
 * 
 * Identifies what the question is about.
 * If confidence < 0.8 → create Entity Stub and stop further build.
 */

import type { RawQuery, NormalizedIntent, ResolvedEntity, EntityType } from '../types';

// ═══════════════════════════════════════════════════════════════════
//                         ENTITY PATTERNS
// ═══════════════════════════════════════════════════════════════════

interface EntityPattern {
  readonly pattern: RegExp;
  readonly type: EntityType;
}

const ENTITY_PATTERNS: readonly EntityPattern[] = [
  // Vehicle models
  { pattern: /\b(volkswagen|vw)\s*(golf|passat|polo|tiguan|arteon)\b/i, type: 'vehicle_model' },
  { pattern: /\b(toyota)\s*(corolla|camry|rav4|prius|yaris)\b/i, type: 'vehicle_model' },
  { pattern: /\b(bmw)\s*(\d{1,3}|x\d|m\d)\b/i, type: 'vehicle_model' },
  { pattern: /\b(mercedes|benz)\s*([a-z]-?class|[a-z]{2,3}\s*\d{2,3})\b/i, type: 'vehicle_model' },
  { pattern: /\b(tesla)\s*(model\s*[3sxy]|cybertruck)\b/i, type: 'vehicle_model' },
  { pattern: /\b(ford)\s*(focus|fiesta|mustang|explorer)\b/i, type: 'vehicle_model' },
  
  // Generic vehicle
  { pattern: /\b(car|vehicle|suv|sedan|hatchback|truck)\b/i, type: 'vehicle_model' },
  
  // Services
  { pattern: /\b(netflix|spotify|amazon\s*prime|disney\+|hulu)\b/i, type: 'service' },
  
  // Locations
  { pattern: /\b(stockholm|london|new\s*york|berlin|paris|tokyo)\b/i, type: 'location' },
  
  // Organizations
  { pattern: /\b(google|apple|microsoft|amazon|meta|openai)\b/i, type: 'organization' },
  
  // Educational
  { pattern: /\b(university|college|mba|phd|masters|degree)\b/i, type: 'educational_program' },
] as const;

// ═══════════════════════════════════════════════════════════════════
//                         RESOLVER
// ═══════════════════════════════════════════════════════════════════

export function resolveEntity(query: RawQuery, intent: NormalizedIntent): ResolvedEntity {
  const text = query.query_text;
  
  for (const pattern of ENTITY_PATTERNS) {
    const match = text.match(pattern.pattern);
    if (match) {
      const entityName = match[0].trim();
      
      // Calculate confidence based on match quality
      const confidence = calculateConfidence(entityName, intent);
      
      return {
        name: capitalizeEntity(entityName),
        type: pattern.type,
        confidence,
        is_stub: confidence < 0.8,
      };
    }
  }
  
  // No specific entity found - create stub based on intent
  return createEntityStub(intent);
}

function calculateConfidence(entityName: string, intent: NormalizedIntent): number {
  // Higher confidence for longer, more specific names
  let confidence = 0.5;
  
  if (entityName.length > 5) confidence += 0.1;
  if (entityName.length > 10) confidence += 0.1;
  if (entityName.includes(' ')) confidence += 0.2; // Multi-word = more specific
  if (intent.confidence > 0.5) confidence += 0.1;
  
  return Math.min(confidence, 1);
}

function capitalizeEntity(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function createEntityStub(intent: NormalizedIntent): ResolvedEntity {
  const stubTypes: Record<string, EntityType> = {
    consumer_product_evaluation: 'product',
    service_comparison: 'service',
    location_assessment: 'location',
    investment_analysis: 'investment',
    career_decision: 'career_path',
    health_choice: 'health_intervention',
    educational_path: 'educational_program',
    policy_impact: 'policy',
  };
  
  return {
    name: 'Unspecified Entity',
    type: stubTypes[intent.intent_id] || 'unknown',
    confidence: 0,
    is_stub: true,
  };
}
