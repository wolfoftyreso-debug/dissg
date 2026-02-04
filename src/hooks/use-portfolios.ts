/**
 * COUNTRY PORTFOLIOS HOOK
 * ═══════════════════════════════════════════════════════════════
 * 
 * Premium feature för Analyst/Institutional tiers.
 * Hantera landsportföljer för aggregerad statistik.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioItem {
  id: string;
  portfolio_id: string;
  country_code: string;
  added_at: string;
  notes: string | null;
}

export interface PortfolioWithItems extends Portfolio {
  items: PortfolioItem[];
}

/**
 * Fetch all portfolios for current user
 */
export function usePortfolios() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['portfolios', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('country_portfolios')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Portfolio[];
    },
    enabled: !!user,
  });
}

/**
 * Fetch a single portfolio with its items
 */
export function usePortfolio(portfolioId: string | null) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['portfolio', portfolioId],
    queryFn: async () => {
      if (!user || !portfolioId) return null;
      
      // Fetch portfolio
      const { data: portfolio, error: portfolioError } = await supabase
        .from('country_portfolios')
        .select('*')
        .eq('id', portfolioId)
        .single();
      
      if (portfolioError) throw portfolioError;
      
      // Fetch items
      const { data: items, error: itemsError } = await supabase
        .from('country_portfolio_items')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .order('added_at', { ascending: true });
      
      if (itemsError) throw itemsError;
      
      return {
        ...portfolio,
        items: items || [],
      } as PortfolioWithItems;
    },
    enabled: !!user && !!portfolioId,
  });
}

/**
 * Create a new portfolio
 */
export function useCreatePortfolio() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      if (!user) throw new Error('Ej inloggad');
      
      const { data: portfolio, error } = await supabase
        .from('country_portfolios')
        .insert({
          user_id: user.id,
          name: data.name,
          description: data.description || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return portfolio as Portfolio;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      toast.success('Portfölj skapad');
    },
    onError: (error: Error) => {
      toast.error('Kunde inte skapa portfölj: ' + error.message);
    },
  });
}

/**
 * Update portfolio
 */
export function useUpdatePortfolio() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { id: string; name?: string; description?: string }) => {
      const { data: portfolio, error } = await supabase
        .from('country_portfolios')
        .update({
          name: data.name,
          description: data.description,
        })
        .eq('id', data.id)
        .select()
        .single();
      
      if (error) throw error;
      return portfolio as Portfolio;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio', variables.id] });
      toast.success('Portfölj uppdaterad');
    },
    onError: (error: Error) => {
      toast.error('Kunde inte uppdatera portfölj: ' + error.message);
    },
  });
}

/**
 * Delete portfolio
 */
export function useDeletePortfolio() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (portfolioId: string) => {
      const { error } = await supabase
        .from('country_portfolios')
        .delete()
        .eq('id', portfolioId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      toast.success('Portfölj raderad');
    },
    onError: (error: Error) => {
      toast.error('Kunde inte radera portfölj: ' + error.message);
    },
  });
}

/**
 * Add country to portfolio
 */
export function useAddToPortfolio() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { portfolioId: string; countryCode: string; notes?: string }) => {
      const { data: item, error } = await supabase
        .from('country_portfolio_items')
        .insert({
          portfolio_id: data.portfolioId,
          country_code: data.countryCode,
          notes: data.notes || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return item as PortfolioItem;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', variables.portfolioId] });
      toast.success('Land tillagt i portfölj');
    },
    onError: (error: Error) => {
      if (error.message.includes('duplicate')) {
        toast.error('Landet finns redan i portföljen');
      } else {
        toast.error('Kunde inte lägga till land: ' + error.message);
      }
    },
  });
}

/**
 * Remove country from portfolio
 */
export function useRemoveFromPortfolio() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { itemId: string; portfolioId: string }) => {
      const { error } = await supabase
        .from('country_portfolio_items')
        .delete()
        .eq('id', data.itemId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', variables.portfolioId] });
      toast.success('Land borttaget från portfölj');
    },
    onError: (error: Error) => {
      toast.error('Kunde inte ta bort land: ' + error.message);
    },
  });
}
