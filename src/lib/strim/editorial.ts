/**
 * STRIM Editorial Process
 * 
 * Workflow för publicering utan att bryta Google-förtroende.
 * 
 * Principer:
 * - Alla ändringar versioneras
 * - Inga URL:er ändras eller tas bort
 * - Kvalitetsvalidering före publicering
 * - Checksums för att detektera oavsiktliga ändringar
 */

import { supabase } from '@/integrations/supabase/client';
import {
  validateSubstance,
  validateDiagnosis,
  validateTreatment,
  validateLegal,
  validateTerm,
} from './validation';
import type { StrimEntityType } from './api';

// =============================================================================
// TYPES
// =============================================================================

export interface EditorialStatus {
  status: 'draft' | 'pending_review' | 'approved' | 'published' | 'rejected';
  reviewer?: string;
  reviewed_at?: string;
  rejection_reason?: string;
}

export interface VersionInfo {
  version: number;
  checksum: string;
  created_at: string;
  change_summary?: string;
}

export interface PublishResult {
  success: boolean;
  entity_id?: string;
  canonical_url?: string;
  version?: number;
  errors?: string[];
}

// =============================================================================
// VALIDATION
// =============================================================================

export function validateEntity(type: StrimEntityType, data: unknown): { 
  valid: boolean; 
  errors: string[];
} {
  const validators: Record<StrimEntityType, (d: unknown) => { success: boolean; error?: { issues: Array<{ message: string }> } }> = {
    substance: validateSubstance,
    diagnosis: validateDiagnosis,
    treatment: validateTreatment,
    legal: validateLegal,
    statistic: () => ({ success: true }), // TODO: Add statistic validation
    term: validateTerm,
  };

  const result = validators[type](data);
  
  if (result.success) {
    return { valid: true, errors: [] };
  }

  return {
    valid: false,
    errors: result.error?.issues.map(i => i.message) || ['Unknown validation error'],
  };
}

// =============================================================================
// CHECKSUM GENERATION
// =============================================================================

function generateChecksum(data: Record<string, unknown>): string {
  // Remove volatile fields
  const stableData = { ...data };
  delete stableData.created_at;
  delete stableData.updated_at;
  delete stableData.id;
  
  const json = JSON.stringify(stableData, Object.keys(stableData).sort());
  
  // Use simple hash for browser compatibility
  let hash = 0;
  for (let i = 0; i < json.length; i++) {
    const char = json.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

// =============================================================================
// EDITORIAL WORKFLOW
// =============================================================================

/**
 * Pre-publish validation checklist
 */
export async function runPrePublishChecks(
  type: StrimEntityType,
  slug: string,
  data: Record<string, unknown>
): Promise<{ passed: boolean; checks: Array<{ name: string; passed: boolean; message: string }> }> {
  const checks: Array<{ name: string; passed: boolean; message: string }> = [];

  // 1. Schema validation
  const validation = validateEntity(type, data);
  checks.push({
    name: 'Schema Validation',
    passed: validation.valid,
    message: validation.valid 
      ? 'All required fields present and valid' 
      : `Validation errors: ${validation.errors.join(', ')}`,
  });

  // 2. Source verification
  const sources = (data.sources || []) as Array<{ type: string }>;
  const hasPrimarySource = sources.some(s => s.type === 'primary');
  checks.push({
    name: 'Primary Source Required',
    passed: hasPrimarySource,
    message: hasPrimarySource 
      ? 'At least one primary source provided' 
      : 'Missing primary source (government/international)',
  });

  // 3. Minimum source count
  const minSources = type === 'term' ? 1 : 2;
  checks.push({
    name: 'Minimum Sources',
    passed: sources.length >= minSources,
    message: sources.length >= minSources
      ? `${sources.length} sources provided`
      : `Need at least ${minSources} sources, have ${sources.length}`,
  });

  // 4. Slug format
  const slugValid = /^[a-z0-9-]+$/.test(slug);
  checks.push({
    name: 'Slug Format',
    passed: slugValid,
    message: slugValid
      ? 'Slug is URL-safe'
      : 'Slug must be lowercase alphanumeric with hyphens only',
  });

  // 5. Neutral language (sample check on definition)
  const definition = (data.definition || data.definition_sv || '') as string;
  const forbiddenWords = ['bör', 'måste', 'rekommenderas', 'bra', 'dålig'];
  const hasValueWords = forbiddenWords.some(w => definition.toLowerCase().includes(w));
  checks.push({
    name: 'Neutral Language',
    passed: !hasValueWords,
    message: hasValueWords
      ? 'Definition contains value-laden words'
      : 'Definition uses neutral language',
  });

  // 6. Checksum generated
  const checksum = generateChecksum(data);
  checks.push({
    name: 'Integrity Checksum',
    passed: true,
    message: `Checksum: ${checksum}`,
  });

  return {
    passed: checks.every(c => c.passed),
    checks,
  };
}

/**
 * Prepare entity for publication
 */
export function prepareForPublication(
  type: StrimEntityType,
  data: Record<string, unknown>
): Record<string, unknown> {
  const prepared = { ...data };
  
  // Set status to active
  prepared.status = 'active';
  
  // Increment version if exists
  prepared.version = ((data.version as number) || 0) + 1;
  
  // Generate checksum
  prepared.checksum = generateChecksum(data);
  
  // Set timestamps
  const now = new Date().toISOString();
  if (!prepared.created_at) {
    prepared.created_at = now;
  }
  prepared.updated_at = now;
  
  return prepared;
}

/**
 * Publish entity to database
 */
export async function publishEntity(
  type: StrimEntityType,
  data: Record<string, unknown>
): Promise<PublishResult> {
  const slug = data.canonical_slug as string;
  
  // Run pre-publish checks
  const preChecks = await runPrePublishChecks(type, slug, data);
  if (!preChecks.passed) {
    return {
      success: false,
      errors: preChecks.checks.filter(c => !c.passed).map(c => c.message),
    };
  }

  // Prepare data
  const prepared = prepareForPublication(type, data);

  const pathMap: Record<StrimEntityType, string> = {
    substance: 'substans',
    diagnosis: 'diagnos',
    treatment: 'behandling',
    legal: 'lag',
    statistic: 'statistik',
    term: 'begrepp',
  };

  try {
    // Upsert based on entity type - use any to bypass strict typing
    let result: Record<string, unknown> | null = null;
    let error: Error | null = null;

    if (type === 'substance') {
      const res = await supabase.from('strim_substances').upsert(prepared as any, { onConflict: 'canonical_slug' }).select().single();
      result = res.data as Record<string, unknown> | null;
      if (res.error) error = res.error;
    } else if (type === 'diagnosis') {
      const res = await supabase.from('strim_diagnoses').upsert(prepared as any, { onConflict: 'canonical_slug' }).select().single();
      result = res.data as Record<string, unknown> | null;
      if (res.error) error = res.error;
    } else if (type === 'treatment') {
      const res = await supabase.from('strim_treatments').upsert(prepared as any, { onConflict: 'canonical_slug' }).select().single();
      result = res.data as Record<string, unknown> | null;
      if (res.error) error = res.error;
    } else if (type === 'legal') {
      const res = await supabase.from('strim_legal').upsert(prepared as any, { onConflict: 'canonical_slug' }).select().single();
      result = res.data as Record<string, unknown> | null;
      if (res.error) error = res.error;
    } else if (type === 'statistic') {
      const res = await supabase.from('strim_statistics').upsert(prepared as any, { onConflict: 'canonical_slug' }).select().single();
      result = res.data as Record<string, unknown> | null;
      if (res.error) error = res.error;
    } else if (type === 'term') {
      const res = await supabase.from('strim_terms').upsert(prepared as any, { onConflict: 'canonical_slug' }).select().single();
      result = res.data as Record<string, unknown> | null;
      if (res.error) error = res.error;
    }

    if (error) throw error;
    if (!result) throw new Error('No result from upsert');

    const slug = data.canonical_slug as string;

    return {
      success: true,
      entity_id: result.id as string,
      canonical_url: `https://strim.se/data/${pathMap[type]}/${slug}`,
      version: prepared.version as number,
    };
  } catch (err) {
    return {
      success: false,
      errors: [(err as Error).message],
    };
  }
}

/**
 * Create relations between entities
 */
export async function createRelation(
  sourceType: StrimEntityType,
  sourceSlug: string,
  relationType: string,
  targetType: StrimEntityType,
  targetSlug: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get source ID based on type
    let sourceId: string | null = null;
    let targetId: string | null = null;

    // Fetch source
    if (sourceType === 'substance') {
      const { data } = await supabase.from('strim_substances').select('id').eq('canonical_slug', sourceSlug).single();
      sourceId = data?.id || null;
    } else if (sourceType === 'diagnosis') {
      const { data } = await supabase.from('strim_diagnoses').select('id').eq('canonical_slug', sourceSlug).single();
      sourceId = data?.id || null;
    } else if (sourceType === 'treatment') {
      const { data } = await supabase.from('strim_treatments').select('id').eq('canonical_slug', sourceSlug).single();
      sourceId = data?.id || null;
    } else if (sourceType === 'legal') {
      const { data } = await supabase.from('strim_legal').select('id').eq('canonical_slug', sourceSlug).single();
      sourceId = data?.id || null;
    } else if (sourceType === 'term') {
      const { data } = await supabase.from('strim_terms').select('id').eq('canonical_slug', sourceSlug).single();
      sourceId = data?.id || null;
    }

    // Fetch target
    if (targetType === 'substance') {
      const { data } = await supabase.from('strim_substances').select('id').eq('canonical_slug', targetSlug).single();
      targetId = data?.id || null;
    } else if (targetType === 'diagnosis') {
      const { data } = await supabase.from('strim_diagnoses').select('id').eq('canonical_slug', targetSlug).single();
      targetId = data?.id || null;
    } else if (targetType === 'treatment') {
      const { data } = await supabase.from('strim_treatments').select('id').eq('canonical_slug', targetSlug).single();
      targetId = data?.id || null;
    } else if (targetType === 'legal') {
      const { data } = await supabase.from('strim_legal').select('id').eq('canonical_slug', targetSlug).single();
      targetId = data?.id || null;
    } else if (targetType === 'term') {
      const { data } = await supabase.from('strim_terms').select('id').eq('canonical_slug', targetSlug).single();
      targetId = data?.id || null;
    }

    if (!sourceId || !targetId) {
      return { success: false, error: 'Source or target entity not found' };
    }

    const { error } = await supabase.from('strim_relations').insert({
      source_type: sourceType,
      source_id: sourceId,
      source_slug: sourceSlug,
      relation_type: relationType,
      target_type: targetType,
      target_id: targetId,
      target_slug: targetSlug,
    } as any);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// =============================================================================
// BATCH OPERATIONS
// =============================================================================

/**
 * Seed initial entities and relations
 */
export async function seedInitialData(): Promise<{
  success: boolean;
  published: number;
  relations_created: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let published = 0;
  let relations_created = 0;

  // Import seed data dynamically to avoid circular deps
  const { SEED_SUBSTANCES, SEED_DIAGNOSES, SEED_TREATMENTS, SEED_LEGAL, SEED_TERMS } = 
    await import('./seed-data');

  // Publish entities
  for (const substance of SEED_SUBSTANCES) {
    const result = await publishEntity('substance', substance as unknown as Record<string, unknown>);
    if (result.success) published++;
    else errors.push(`Substance ${substance.canonical_slug}: ${result.errors?.join(', ')}`);
  }

  for (const diagnosis of SEED_DIAGNOSES) {
    const result = await publishEntity('diagnosis', diagnosis as unknown as Record<string, unknown>);
    if (result.success) published++;
    else errors.push(`Diagnosis ${diagnosis.canonical_slug}: ${result.errors?.join(', ')}`);
  }

  for (const treatment of SEED_TREATMENTS) {
    const result = await publishEntity('treatment', treatment as unknown as Record<string, unknown>);
    if (result.success) published++;
    else errors.push(`Treatment ${treatment.canonical_slug}: ${result.errors?.join(', ')}`);
  }

  for (const legal of SEED_LEGAL) {
    const result = await publishEntity('legal', legal as unknown as Record<string, unknown>);
    if (result.success) published++;
    else errors.push(`Legal ${legal.canonical_slug}: ${result.errors?.join(', ')}`);
  }

  for (const term of SEED_TERMS) {
    const result = await publishEntity('term', term as unknown as Record<string, unknown>);
    if (result.success) published++;
    else errors.push(`Term ${term.canonical_slug}: ${result.errors?.join(', ')}`);
  }

  // Create relations
  const relations = [
    // Substances → Diagnoses
    { source: 'substance', sourceSlug: 'alkohol', rel: 'causes', target: 'diagnosis', targetSlug: 'alkoholberoende' },
    { source: 'substance', sourceSlug: 'heroin', rel: 'causes', target: 'diagnosis', targetSlug: 'opioidberoende' },
    { source: 'substance', sourceSlug: 'fentanyl', rel: 'causes', target: 'diagnosis', targetSlug: 'opioidberoende' },
    
    // Substances → Laws
    { source: 'substance', sourceSlug: 'alkohol', rel: 'regulated_by', target: 'legal', targetSlug: 'alkohollagen' },
    { source: 'substance', sourceSlug: 'heroin', rel: 'regulated_by', target: 'legal', targetSlug: 'narkotikalagstiftning' },
    { source: 'substance', sourceSlug: 'fentanyl', rel: 'regulated_by', target: 'legal', targetSlug: 'narkotikalagstiftning' },
    
    // Diagnoses → Treatments
    { source: 'diagnosis', sourceSlug: 'opioidberoende', rel: 'treated_by', target: 'treatment', targetSlug: 'laro' },
    
    // Terms → related
    { source: 'term', sourceSlug: 'beroende', rel: 'related_to', target: 'term', targetSlug: 'skademinimering' },
    { source: 'term', sourceSlug: 'skademinimering', rel: 'related_to', target: 'treatment', targetSlug: 'laro' },
  ];

  for (const rel of relations) {
    const result = await createRelation(
      rel.source as StrimEntityType,
      rel.sourceSlug,
      rel.rel,
      rel.target as StrimEntityType,
      rel.targetSlug
    );
    if (result.success) relations_created++;
    else errors.push(`Relation ${rel.sourceSlug}→${rel.targetSlug}: ${result.error}`);
  }

  return {
    success: errors.length === 0,
    published,
    relations_created,
    errors,
  };
}
