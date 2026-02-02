/**
 * Ingest Pipeline Hooks - Monitor and manage data pipelines
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Fetch all ingest sources
export function useIngestSources(options?: { isActive?: boolean }) {
  return useQuery({
    queryKey: ['ingest-sources', options],
    queryFn: async () => {
      let query = supabase
        .from('ingest_sources')
        .select('*')
        .order('name');

      if (options?.isActive !== undefined) {
        query = query.eq('is_active', options.isActive);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

// Fetch a single source
export function useIngestSource(code: string) {
  return useQuery({
    queryKey: ['ingest-source', code],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingest_sources')
        .select('*')
        .eq('code', code)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!code,
  });
}

// Fetch pipeline runs
export function usePipelineRuns(options?: { 
  sourceCode?: string; 
  status?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['pipeline-runs', options],
    queryFn: async () => {
      let query = supabase
        .from('ingest_pipeline_runs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(options?.limit || 50);

      if (options?.sourceCode) {
        query = query.eq('source_code', options.sourceCode);
      }
      if (options?.status) {
        query = query.eq('status', options.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

// Fetch schemas for a source
export function useIngestSchemas(sourceCode: string) {
  return useQuery({
    queryKey: ['ingest-schemas', sourceCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingest_schemas')
        .select('*')
        .eq('source_code', sourceCode)
        .order('version', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!sourceCode,
  });
}

// Fetch mappings for a source
export function useIngestMappings(sourceCode: string) {
  return useQuery({
    queryKey: ['ingest-mappings', sourceCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingest_mappings')
        .select('*')
        .eq('source_code', sourceCode)
        .eq('is_active', true)
        .order('target_kpi_code');
      
      if (error) throw error;
      return data;
    },
    enabled: !!sourceCode,
  });
}

// Fetch validation rules
export function useValidationRules(sourceCode?: string) {
  return useQuery({
    queryKey: ['validation-rules', sourceCode],
    queryFn: async () => {
      let query = supabase
        .from('ingest_validation_rules')
        .select('*')
        .eq('is_active', true);

      if (sourceCode) {
        query = query.or(`source_code.eq.${sourceCode},source_code.is.null`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

// Fetch semantic concepts
export function useSemanticConcepts(category?: string) {
  return useQuery({
    queryKey: ['semantic-concepts', category],
    queryFn: async () => {
      let query = supabase
        .from('semantic_concepts')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

// Pipeline stats
export function useIngestStats() {
  return useQuery({
    queryKey: ['ingest-stats'],
    queryFn: async () => {
      const [sourcesResult, runsResult, conceptsResult] = await Promise.all([
        supabase.from('ingest_sources').select('id, is_active, consecutive_failures'),
        supabase.from('ingest_pipeline_runs').select('id, status, started_at').gte('started_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('semantic_concepts').select('id', { count: 'exact' }),
      ]);

      const sources = sourcesResult.data || [];
      const runs = runsResult.data || [];

      return {
        totalSources: sources.length,
        activeSources: sources.filter(s => s.is_active).length,
        failingSources: sources.filter(s => s.consecutive_failures > 0).length,
        runsLast24h: runs.length,
        successfulRuns: runs.filter(r => r.status === 'complete').length,
        failedRuns: runs.filter(r => r.status === 'failed').length,
        totalConcepts: conceptsResult.count || 0,
      };
    },
  });
}
