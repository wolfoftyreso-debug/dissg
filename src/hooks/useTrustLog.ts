/**
 * Trust Log Hook
 * 
 * Fetches and manages trust log entries.
 * Part of Block 55: Public Trust Log & Governance.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TrustLogEntry, ChangeType, ReviewStatus } from '@/config/trustLogConfig';

interface UseTrustLogOptions {
  limit?: number;
  changeType?: ChangeType;
  scope?: string;
}

export function useTrustLog(options: UseTrustLogOptions = {}) {
  const { limit = 50, changeType, scope } = options;

  return useQuery({
    queryKey: ['trust-log', limit, changeType, scope],
    queryFn: async (): Promise<TrustLogEntry[]> => {
      let query = supabase
        .from('trust_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (changeType) {
        query = query.eq('change_type', changeType);
      }

      if (scope) {
        query = query.ilike('scope', `%${scope}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching trust log:', error);
        return [];
      }

      return (data || []) as TrustLogEntry[];
    },
  });
}

export function useTrustLogEntry(logId: string) {
  return useQuery({
    queryKey: ['trust-log-entry', logId],
    queryFn: async (): Promise<TrustLogEntry | null> => {
      const { data, error } = await supabase
        .from('trust_log')
        .select('*')
        .eq('log_id', logId)
        .single();

      if (error) {
        console.error('Error fetching trust log entry:', error);
        return null;
      }

      return data as TrustLogEntry;
    },
    enabled: !!logId,
  });
}

export function useTrustLogStats() {
  return useQuery({
    queryKey: ['trust-log-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trust_log')
        .select('change_type, review_status, created_at');

      if (error) {
        console.error('Error fetching trust log stats:', error);
        return null;
      }

      const entries = data || [];
      
      // Count by type
      const byType: Record<string, number> = {};
      const byStatus: Record<string, number> = {};
      
      entries.forEach((entry: any) => {
        byType[entry.change_type] = (byType[entry.change_type] || 0) + 1;
        byStatus[entry.review_status] = (byStatus[entry.review_status] || 0) + 1;
      });

      // Recent activity (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentCount = entries.filter(
        (e: any) => new Date(e.created_at) > thirtyDaysAgo
      ).length;

      return {
        total: entries.length,
        byType,
        byStatus,
        recentCount,
      };
    },
  });
}

export default useTrustLog;
