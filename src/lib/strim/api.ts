/**
 * STRIM API Client
 * 
 * Client-side functions for accessing STRIM data.
 * Uses the public read-only API endpoints.
 */

import { supabase } from '@/integrations/supabase/client';

// =============================================================================
// TYPES (inline to avoid circular dependency)
// =============================================================================

export type StrimEntityType =
  | 'substance'
  | 'diagnosis'
  | 'treatment'
  | 'legal'
  | 'statistic'
  | 'term';

export type StrimEntityStatus = 'active' | 'historical' | 'deprecated' | 'draft';

export interface StrimSource {
  name: string;
  url?: string;
  retrieved_at: string;
}

export interface StrimBaseEntity {
  id: string;
  canonical_slug: string;
  status: StrimEntityStatus;
  sources: StrimSource[];
  created_at: string;
  updated_at: string;
  version: number;
}

export interface StrimListOptions {
  page?: number;
  perPage?: number;
  status?: 'active' | 'historical' | 'all';
}

export interface StrimListResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

// =============================================================================
// SUBSTANCES
// =============================================================================

export async function getSubstances(options: StrimListOptions = {}): Promise<StrimListResult<StrimBaseEntity>> {
  const { page = 1, perPage = 50, status = 'active' } = options;
  const offset = (page - 1) * perPage;

  let query = supabase
    .from('strim_substances')
    .select('*', { count: 'exact' });

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, count, error } = await query
    .order('canonical_slug')
    .range(offset, offset + perPage - 1);

  if (error) throw error;

  return {
    data: (data || []) as unknown as StrimBaseEntity[],
    total: count || 0,
    page,
    perPage,
    hasMore: (count || 0) > offset + perPage,
  };
}

export async function getSubstanceBySlug(slug: string): Promise<StrimBaseEntity | null> {
  const { data, error } = await supabase
    .from('strim_substances')
    .select('*')
    .eq('canonical_slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as unknown as StrimBaseEntity;
}

// =============================================================================
// DIAGNOSES
// =============================================================================

export async function getDiagnoses(options: StrimListOptions = {}): Promise<StrimListResult<StrimBaseEntity>> {
  const { page = 1, perPage = 50, status = 'active' } = options;
  const offset = (page - 1) * perPage;

  let query = supabase
    .from('strim_diagnoses')
    .select('*', { count: 'exact' });

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, count, error } = await query
    .order('canonical_slug')
    .range(offset, offset + perPage - 1);

  if (error) throw error;

  return {
    data: (data || []) as unknown as StrimBaseEntity[],
    total: count || 0,
    page,
    perPage,
    hasMore: (count || 0) > offset + perPage,
  };
}

export async function getDiagnosisBySlug(slug: string): Promise<StrimBaseEntity | null> {
  const { data, error } = await supabase
    .from('strim_diagnoses')
    .select('*')
    .eq('canonical_slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as unknown as StrimBaseEntity;
}

// =============================================================================
// TREATMENTS
// =============================================================================

export async function getTreatments(options: StrimListOptions = {}): Promise<StrimListResult<StrimBaseEntity>> {
  const { page = 1, perPage = 50, status = 'active' } = options;
  const offset = (page - 1) * perPage;

  let query = supabase
    .from('strim_treatments')
    .select('*', { count: 'exact' });

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, count, error } = await query
    .order('canonical_slug')
    .range(offset, offset + perPage - 1);

  if (error) throw error;

  return {
    data: (data || []) as unknown as StrimBaseEntity[],
    total: count || 0,
    page,
    perPage,
    hasMore: (count || 0) > offset + perPage,
  };
}

export async function getTreatmentBySlug(slug: string): Promise<StrimBaseEntity | null> {
  const { data, error } = await supabase
    .from('strim_treatments')
    .select('*')
    .eq('canonical_slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as unknown as StrimBaseEntity;
}

// =============================================================================
// LEGAL
// =============================================================================

export async function getLegalFrameworks(options: StrimListOptions = {}): Promise<StrimListResult<StrimBaseEntity>> {
  const { page = 1, perPage = 50, status = 'active' } = options;
  const offset = (page - 1) * perPage;

  let query = supabase
    .from('strim_legal')
    .select('*', { count: 'exact' });

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, count, error } = await query
    .order('canonical_slug')
    .range(offset, offset + perPage - 1);

  if (error) throw error;

  return {
    data: (data || []) as unknown as StrimBaseEntity[],
    total: count || 0,
    page,
    perPage,
    hasMore: (count || 0) > offset + perPage,
  };
}

export async function getLegalBySlug(slug: string): Promise<StrimBaseEntity | null> {
  const { data, error } = await supabase
    .from('strim_legal')
    .select('*')
    .eq('canonical_slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as unknown as StrimBaseEntity;
}

// =============================================================================
// STATISTICS
// =============================================================================

export async function getStatistics(options: StrimListOptions = {}): Promise<StrimListResult<StrimBaseEntity>> {
  const { page = 1, perPage = 50, status = 'active' } = options;
  const offset = (page - 1) * perPage;

  let query = supabase
    .from('strim_statistics')
    .select('*', { count: 'exact' });

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, count, error } = await query
    .order('canonical_slug')
    .range(offset, offset + perPage - 1);

  if (error) throw error;

  return {
    data: (data || []) as unknown as StrimBaseEntity[],
    total: count || 0,
    page,
    perPage,
    hasMore: (count || 0) > offset + perPage,
  };
}

export async function getStatisticBySlug(slug: string): Promise<StrimBaseEntity | null> {
  const { data, error } = await supabase
    .from('strim_statistics')
    .select('*')
    .eq('canonical_slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as unknown as StrimBaseEntity;
}

// =============================================================================
// TERMS
// =============================================================================

export async function getTerms(options: StrimListOptions = {}): Promise<StrimListResult<StrimBaseEntity>> {
  const { page = 1, perPage = 50, status = 'active' } = options;
  const offset = (page - 1) * perPage;

  let query = supabase
    .from('strim_terms')
    .select('*', { count: 'exact' });

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, count, error } = await query
    .order('canonical_slug')
    .range(offset, offset + perPage - 1);

  if (error) throw error;

  return {
    data: (data || []) as unknown as StrimBaseEntity[],
    total: count || 0,
    page,
    perPage,
    hasMore: (count || 0) > offset + perPage,
  };
}

export async function getTermBySlug(slug: string): Promise<StrimBaseEntity | null> {
  const { data, error } = await supabase
    .from('strim_terms')
    .select('*')
    .eq('canonical_slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as unknown as StrimBaseEntity;
}

// =============================================================================
// RELATIONS
// =============================================================================

export interface StrimRelation {
  id: string;
  source_type: StrimEntityType;
  source_id: string;
  source_slug: string;
  relation_type: string;
  target_type: StrimEntityType;
  target_id: string;
  target_slug: string;
}

export async function getRelationsFor(
  _entityType: StrimEntityType,
  entitySlug: string
): Promise<StrimRelation[]> {
  const { data, error } = await supabase
    .from('strim_relations')
    .select('*')
    .or(`source_slug.eq.${entitySlug},target_slug.eq.${entitySlug}`);

  if (error) throw error;

  return (data || []) as unknown as StrimRelation[];
}

export async function getRelationsBetween(
  sourceType: StrimEntityType,
  targetType: StrimEntityType
): Promise<StrimRelation[]> {
  const { data, error } = await supabase
    .from('strim_relations')
    .select('*')
    .eq('source_type', sourceType)
    .eq('target_type', targetType);

  if (error) throw error;

  return (data || []) as unknown as StrimRelation[];
}

// =============================================================================
// ENTITY COUNTS
// =============================================================================

export async function getEntityCounts(): Promise<Record<StrimEntityType, number>> {
  const tables: Array<{ type: StrimEntityType; table: string }> = [
    { type: 'substance', table: 'strim_substances' },
    { type: 'diagnosis', table: 'strim_diagnoses' },
    { type: 'treatment', table: 'strim_treatments' },
    { type: 'legal', table: 'strim_legal' },
    { type: 'statistic', table: 'strim_statistics' },
    { type: 'term', table: 'strim_terms' },
  ];

  const counts = await Promise.all(
    tables.map(async ({ type, table }) => {
      // Use type assertion to handle dynamic table names
      const { count } = await (supabase
        .from(table as 'strim_substances')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'));
      return { type, count: count || 0 };
    })
  );

  return counts.reduce((acc, { type, count }) => {
    acc[type] = count;
    return acc;
  }, {} as Record<StrimEntityType, number>);
}

// =============================================================================
// SEARCH
// =============================================================================

export async function searchStrim(
  query: string,
  options: { types?: StrimEntityType[]; limit?: number } = {}
): Promise<Array<{ type: StrimEntityType; slug: string; name: string; match_field: string }>> {
  const { types = ['substance', 'diagnosis', 'treatment', 'legal', 'statistic', 'term'], limit = 20 } = options;
  
  const searchPattern = `%${query}%`;

  // Search each type
  const searches = types.map(async (type) => {
    let data: Array<{ canonical_slug: string; name_sv?: string; indicator_name_sv?: string; term_sv?: string }> | null = null;
    let nameField = 'name_sv';

    if (type === 'substance') {
      const result = await supabase.from('strim_substances').select('canonical_slug, name_sv').eq('status', 'active').ilike('name_sv', searchPattern).limit(Math.ceil(limit / types.length));
      data = result.data;
    } else if (type === 'diagnosis') {
      const result = await supabase.from('strim_diagnoses').select('canonical_slug, name_sv').eq('status', 'active').ilike('name_sv', searchPattern).limit(Math.ceil(limit / types.length));
      data = result.data;
    } else if (type === 'treatment') {
      const result = await supabase.from('strim_treatments').select('canonical_slug, name_sv').eq('status', 'active').ilike('name_sv', searchPattern).limit(Math.ceil(limit / types.length));
      data = result.data;
    } else if (type === 'legal') {
      const result = await supabase.from('strim_legal').select('canonical_slug, name_sv').eq('status', 'active').ilike('name_sv', searchPattern).limit(Math.ceil(limit / types.length));
      data = result.data;
    } else if (type === 'statistic') {
      const result = await supabase.from('strim_statistics').select('canonical_slug, indicator_name_sv').eq('status', 'active').ilike('indicator_name_sv', searchPattern).limit(Math.ceil(limit / types.length));
      data = result.data;
      nameField = 'indicator_name_sv';
    } else if (type === 'term') {
      const result = await supabase.from('strim_terms').select('canonical_slug, term_sv').eq('status', 'active').ilike('term_sv', searchPattern).limit(Math.ceil(limit / types.length));
      data = result.data;
      nameField = 'term_sv';
    }

    return (data || []).map((item) => ({
      type,
      slug: item.canonical_slug,
      name: (item as Record<string, unknown>)[nameField] as string,
      match_field: nameField,
    }));
  });

  const searchResults = await Promise.all(searches);
  return searchResults.flat().slice(0, limit);
}
