import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface KpiValueRevision {
  id: string;
  kpi_value_id: string;
  revision_number: number;
  value: number;
  previous_value: number | null;
  status: string;
  trend: string;
  confidence: number;
  checksum: string;
  previous_checksum: string | null;
  revision_type: string;
  revision_reason: string | null;
  created_at: string;
}

interface ObservationRevision {
  id: string;
  observation_id: string;
  revision_number: number;
  title: string;
  description: string;
  observation_type: string;
  confidence_level: number;
  signal_strength: number;
  checksum: string;
  previous_checksum: string | null;
  model_version: string;
  analysis_version: string;
  created_at: string;
}

interface LineageLink {
  id: string;
  source_type: string;
  source_id: string | null;
  source_checksum: string;
  target_type: string;
  target_id: string;
  target_checksum: string;
  link_type: string;
  transformation_applied: string | null;
  created_at: string;
}

// Hook to fetch KPI value revision history
export function useKpiValueRevisions(kpiValueId: string | null) {
  return useQuery({
    queryKey: ['kpi-value-revisions', kpiValueId],
    queryFn: async () => {
      if (!kpiValueId) return [];
      
      const { data, error } = await supabase
        .from('kpi_value_revisions')
        .select('*')
        .eq('kpi_value_id', kpiValueId)
        .order('revision_number', { ascending: false });
      
      if (error) throw error;
      return data as KpiValueRevision[];
    },
    enabled: !!kpiValueId,
  });
}

// Hook to fetch observation revision history
export function useObservationRevisions(observationId: string | null) {
  return useQuery({
    queryKey: ['observation-revisions', observationId],
    queryFn: async () => {
      if (!observationId) return [];
      
      const { data, error } = await supabase
        .from('observation_revisions')
        .select('*')
        .eq('observation_id', observationId)
        .order('revision_number', { ascending: false });
      
      if (error) throw error;
      return data as ObservationRevision[];
    },
    enabled: !!observationId,
  });
}

// Hook to fetch lineage for a specific entity
export function useEntityLineage(entityType: string, entityId: string | null) {
  return useQuery({
    queryKey: ['entity-lineage', entityType, entityId],
    queryFn: async () => {
      if (!entityId) return { upstream: [], downstream: [] };
      
      // Fetch upstream (sources that led to this entity)
      const { data: upstream, error: upError } = await supabase
        .from('lineage_chain_links')
        .select('*')
        .eq('target_type', entityType)
        .eq('target_id', entityId)
        .order('created_at', { ascending: false });
      
      if (upError) throw upError;
      
      // Fetch downstream (entities derived from this)
      const { data: downstream, error: downError } = await supabase
        .from('lineage_chain_links')
        .select('*')
        .eq('source_type', entityType)
        .eq('source_id', entityId)
        .order('created_at', { ascending: false });
      
      if (downError) throw downError;
      
      return {
        upstream: upstream as LineageLink[],
        downstream: downstream as LineageLink[],
      };
    },
    enabled: !!entityId,
  });
}

// Hook to trace complete lineage chain
export function useLineageTrace(entityType: string, entityId: string | null, depth: number = 3) {
  return useQuery({
    queryKey: ['lineage-trace', entityType, entityId, depth],
    queryFn: async () => {
      if (!entityId) return [];
      
      const trace: LineageLink[][] = [];
      let currentTargets = [{ type: entityType, id: entityId }];
      
      for (let i = 0; i < depth; i++) {
        if (currentTargets.length === 0) break;
        
        const levelLinks: LineageLink[] = [];
        
        for (const target of currentTargets) {
          const { data, error } = await supabase
            .from('lineage_chain_links')
            .select('*')
            .eq('target_type', target.type)
            .eq('target_id', target.id);
          
          if (!error && data) {
            levelLinks.push(...(data as LineageLink[]));
          }
        }
        
        if (levelLinks.length > 0) {
          trace.push(levelLinks);
          currentTargets = levelLinks
            .filter(l => l.source_id)
            .map(l => ({ type: l.source_type, id: l.source_id! }));
        } else {
          break;
        }
      }
      
      return trace;
    },
    enabled: !!entityId,
  });
}

// Verify checksum integrity
export function verifyChecksum(data: Record<string, unknown>): string {
  // Client-side checksum for verification (matches server function)
  const jsonStr = JSON.stringify(data);
  // Note: For true verification, compare with server-stored checksum
  return jsonStr; // Placeholder - actual verification should be server-side
}

// Format revision for display
export function formatRevision(revision: KpiValueRevision | ObservationRevision): string {
  const date = new Date(revision.created_at).toLocaleDateString('sv-SE');
  const time = new Date(revision.created_at).toLocaleTimeString('sv-SE');
  return `Rev ${revision.revision_number} (${date} ${time})`;
}

// Get revision diff
export function getRevisionDiff(
  current: KpiValueRevision,
  previous: KpiValueRevision | null
): { field: string; oldValue: unknown; newValue: unknown }[] {
  if (!previous) return [];
  
  const diffs: { field: string; oldValue: unknown; newValue: unknown }[] = [];
  
  if (current.value !== previous.value) {
    diffs.push({ field: 'value', oldValue: previous.value, newValue: current.value });
  }
  if (current.status !== previous.status) {
    diffs.push({ field: 'status', oldValue: previous.status, newValue: current.status });
  }
  if (current.trend !== previous.trend) {
    diffs.push({ field: 'trend', oldValue: previous.trend, newValue: current.trend });
  }
  if (current.confidence !== previous.confidence) {
    diffs.push({ field: 'confidence', oldValue: previous.confidence, newValue: current.confidence });
  }
  
  return diffs;
}
