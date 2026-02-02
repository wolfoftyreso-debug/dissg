import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type FeedTier = 'open' | 'plus' | 'pro';
export type FeedSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface FeedDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  tier: FeedTier;
  category: string;
  default_frequency: string;
  min_effect_threshold: number;
  max_events_per_day: number;
  is_active: boolean;
}

export interface FeedSubscription {
  id: string;
  feed_id: string;
  delivery_method: 'api' | 'webhook' | 'sse' | 'kafka';
  webhook_url?: string;
  region_filter?: string[];
  kpi_category_filter?: string[];
  min_severity: FeedSeverity;
  is_active: boolean;
  is_paused: boolean;
  created_at: string;
  feed_definitions?: FeedDefinition;
}

export interface FeedEvent {
  id: string;
  feed_id: string;
  severity: FeedSeverity;
  scope_type: string;
  scope_code?: string;
  summary: string;
  why_now: string[];
  metrics: Array<{
    kpi?: string;
    name?: string;
    delta?: string;
    period?: string;
    [key: string]: any;
  }>;
  kpi_ids: string[];
  confidence: string;
  data_sources: string[];
  explore_url?: string;
  generated_at: string;
  feed_definitions?: FeedDefinition;
}

// Fetch available feeds
export function useFeedDefinitions() {
  return useQuery({
    queryKey: ['feed-definitions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feed_definitions')
        .select('*')
        .eq('is_active', true)
        .order('tier', { ascending: true });

      if (error) throw error;
      return data as FeedDefinition[];
    },
  });
}

// Fetch user's subscriptions
export function useFeedSubscriptions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['feed-subscriptions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('feed_subscriptions')
        .select(`
          *,
          feed_definitions(*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      return data as FeedSubscription[];
    },
    enabled: !!user,
  });
}

// Subscribe to a feed
export function useSubscribeToFeed() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      feedId,
      deliveryMethod = 'api',
      webhookUrl,
      filters,
    }: {
      feedId: string;
      deliveryMethod?: 'api' | 'webhook' | 'sse' | 'kafka';
      webhookUrl?: string;
      filters?: {
        regions?: string[];
        categories?: string[];
        minSeverity?: FeedSeverity;
      };
    }) => {
      if (!user) throw new Error('Must be logged in to subscribe');

      const { data, error } = await supabase
        .from('feed_subscriptions')
        .insert({
          user_id: user.id,
          feed_id: feedId,
          delivery_method: deliveryMethod,
          webhook_url: webhookUrl,
          region_filter: filters?.regions,
          kpi_category_filter: filters?.categories,
          min_severity: filters?.minSeverity || 'low',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed-subscriptions'] });
    },
  });
}

// Unsubscribe from a feed
export function useUnsubscribeFromFeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { error } = await supabase
        .from('feed_subscriptions')
        .delete()
        .eq('id', subscriptionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed-subscriptions'] });
    },
  });
}

// Pause/unpause subscription
export function useToggleFeedPause() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subscriptionId, isPaused }: { subscriptionId: string; isPaused: boolean }) => {
      const { error } = await supabase
        .from('feed_subscriptions')
        .update({ is_paused: isPaused })
        .eq('id', subscriptionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed-subscriptions'] });
    },
  });
}

// Fetch feed events
export function useFeedEvents(feedId?: string, options?: {
  severity?: FeedSeverity;
  limit?: number;
  since?: string;
}) {
  return useQuery({
    queryKey: ['feed-events', feedId, options],
    queryFn: async () => {
      let query = supabase
        .from('feed_events')
        .select(`
          *,
          feed_definitions(code, name, tier)
        `)
        .order('generated_at', { ascending: false })
        .limit(options?.limit || 50);

      if (feedId) {
        query = query.eq('feed_id', feedId);
      }
      if (options?.severity) {
        query = query.eq('severity', options.severity);
      }
      if (options?.since) {
        query = query.gte('generated_at', options.since);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Transform to match FeedEvent interface
      return (data || []).map((item: any) => ({
        ...item,
        feed_definitions: item.feed_definitions ? {
          ...item.feed_definitions,
          id: feedId || '',
          description: '',
          category: '',
          default_frequency: '',
          min_effect_threshold: 0,
          max_events_per_day: 10,
          is_active: true,
        } : undefined,
      })) as FeedEvent[];
    },
  });
}

// Log event interaction
export function useLogFeedInteraction() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      eventId,
      interactionType,
      context,
    }: {
      eventId: string;
      interactionType: 'viewed' | 'clicked' | 'explored' | 'shared' | 'dismissed' | 'reported';
      context?: Record<string, any>;
    }) => {
      if (!user) return;

      const { error } = await supabase
        .from('feed_event_interactions')
        .insert({
          event_id: eventId,
          user_id: user.id,
          interaction_type: interactionType,
          interaction_context: context,
        });

      if (error) throw error;
    },
  });
}

// Get feed stats
export function useFeedStats() {
  return useQuery({
    queryKey: ['feed-stats'],
    queryFn: async () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // Today's events
      const { count: todayCount } = await supabase
        .from('feed_events')
        .select('*', { count: 'exact', head: true })
        .gte('generated_at', `${today}T00:00:00Z`);

      // Week's events
      const { count: weekCount } = await supabase
        .from('feed_events')
        .select('*', { count: 'exact', head: true })
        .gte('generated_at', weekAgo);

      // Critical events
      const { count: criticalCount } = await supabase
        .from('feed_events')
        .select('*', { count: 'exact', head: true })
        .eq('severity', 'critical')
        .gte('generated_at', weekAgo);

      return {
        todayEvents: todayCount || 0,
        weekEvents: weekCount || 0,
        criticalEvents: criticalCount || 0,
      };
    },
  });
}

// Tier colors and labels
export const tierConfig = {
  open: { label: 'Öppen', color: 'bg-green-500/20 text-green-400', icon: '🟢' },
  plus: { label: 'Plus', color: 'bg-blue-500/20 text-blue-400', icon: '🔵' },
  pro: { label: 'Pro', color: 'bg-purple-500/20 text-purple-400', icon: '🟣' },
};

export const severityConfig = {
  low: { label: 'Låg', color: 'text-muted-foreground', bgColor: 'bg-muted/30' },
  medium: { label: 'Medium', color: 'text-yellow-500', bgColor: 'bg-yellow-500/20' },
  high: { label: 'Hög', color: 'text-orange-500', bgColor: 'bg-orange-500/20' },
  critical: { label: 'Kritisk', color: 'text-red-500', bgColor: 'bg-red-500/20' },
};
