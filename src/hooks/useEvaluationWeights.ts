import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EvaluationWeights {
  id: string;
  name: string;
  description: string | null;
  effect_weight: number;
  cost_weight: number;
  risk_weight: number;
  reversibility_weight: number;
  is_active: boolean;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface WeightsInput {
  name: string;
  description?: string;
  effect_weight: number;
  cost_weight: number;
  risk_weight: number;
  reversibility_weight: number;
}

const DEFAULT_WEIGHTS: WeightsInput = {
  name: 'Standard',
  description: 'Standardvikter: Effekt 40%, Kostnad 25%, Risk 20%, Reversibilitet 15%',
  effect_weight: 0.40,
  cost_weight: 0.25,
  risk_weight: 0.20,
  reversibility_weight: 0.15,
};

export function useEvaluationWeights() {
  const [weights, setWeights] = useState<EvaluationWeights[]>([]);
  const [activeWeights, setActiveWeights] = useState<EvaluationWeights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Fetch all weights (system defaults + user's own)
  const fetchWeights = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('evaluation_weights')
        .select('*')
        .or(`user_id.is.null,user_id.eq.${user?.id || '00000000-0000-0000-0000-000000000000'}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWeights(data || []);
      
      // Find active weights (prefer user's active, then system default)
      const userActive = data?.find(w => w.is_active && w.user_id === user?.id);
      const systemActive = data?.find(w => w.is_active && w.user_id === null);
      setActiveWeights(userActive || systemActive || null);
    } catch (error) {
      console.error('Error fetching weights:', error);
      toast({
        title: 'Kunde inte hämta vikter',
        description: 'Försök igen senare',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Save new weights configuration
  const saveWeights = useCallback(async (input: WeightsInput, setAsActive = true) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Ej inloggad',
          description: 'Du måste vara inloggad för att spara vikter',
          variant: 'destructive',
        });
        return null;
      }

      // Validate weights sum to 1.0
      const sum = input.effect_weight + input.cost_weight + input.risk_weight + input.reversibility_weight;
      if (Math.abs(sum - 1.0) > 0.01) {
        toast({
          title: 'Ogiltiga vikter',
          description: `Vikterna måste summera till 100% (nu: ${(sum * 100).toFixed(0)}%)`,
          variant: 'destructive',
        });
        return null;
      }

      // If setting as active, deactivate user's other weights
      if (setAsActive) {
        await supabase
          .from('evaluation_weights')
          .update({ is_active: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await supabase
        .from('evaluation_weights')
        .insert({
          name: input.name,
          description: input.description || null,
          effect_weight: input.effect_weight,
          cost_weight: input.cost_weight,
          risk_weight: input.risk_weight,
          reversibility_weight: input.reversibility_weight,
          is_active: setAsActive,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Vikter sparade',
        description: `"${input.name}" har sparats`,
      });

      await fetchWeights();
      return data;
    } catch (error) {
      console.error('Error saving weights:', error);
      toast({
        title: 'Kunde inte spara vikter',
        description: error instanceof Error ? error.message : 'Försök igen senare',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [toast, fetchWeights]);

  // Update existing weights
  const updateWeights = useCallback(async (id: string, input: Partial<WeightsInput>) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Ej inloggad',
          description: 'Du måste vara inloggad för att uppdatera vikter',
          variant: 'destructive',
        });
        return false;
      }

      // Validate weights if all are provided
      if (input.effect_weight !== undefined && input.cost_weight !== undefined && 
          input.risk_weight !== undefined && input.reversibility_weight !== undefined) {
        const sum = input.effect_weight + input.cost_weight + input.risk_weight + input.reversibility_weight;
        if (Math.abs(sum - 1.0) > 0.01) {
          toast({
            title: 'Ogiltiga vikter',
            description: `Vikterna måste summera till 100% (nu: ${(sum * 100).toFixed(0)}%)`,
            variant: 'destructive',
          });
          return false;
        }
      }

      const { error } = await supabase
        .from('evaluation_weights')
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id); // Only update own weights

      if (error) throw error;

      toast({
        title: 'Vikter uppdaterade',
      });

      await fetchWeights();
      return true;
    } catch (error) {
      console.error('Error updating weights:', error);
      toast({
        title: 'Kunde inte uppdatera vikter',
        description: error instanceof Error ? error.message : 'Försök igen senare',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [toast, fetchWeights]);

  // Set a weight configuration as active
  const setActiveWeight = useCallback(async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Ej inloggad',
          variant: 'destructive',
        });
        return false;
      }

      // Deactivate all user's weights
      await supabase
        .from('evaluation_weights')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Activate the selected one
      const { error } = await supabase
        .from('evaluation_weights')
        .update({ is_active: true })
        .eq('id', id);

      if (error) throw error;

      await fetchWeights();
      return true;
    } catch (error) {
      console.error('Error setting active weight:', error);
      toast({
        title: 'Kunde inte aktivera vikter',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast, fetchWeights]);

  // Delete a weight configuration
  const deleteWeights = useCallback(async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return false;

      const { error } = await supabase
        .from('evaluation_weights')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Only delete own weights

      if (error) throw error;

      toast({
        title: 'Vikter borttagna',
      });

      await fetchWeights();
      return true;
    } catch (error) {
      console.error('Error deleting weights:', error);
      toast({
        title: 'Kunde inte ta bort vikter',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast, fetchWeights]);

  useEffect(() => {
    fetchWeights();
  }, [fetchWeights]);

  return {
    weights,
    activeWeights,
    isLoading,
    isSaving,
    saveWeights,
    updateWeights,
    setActiveWeight,
    deleteWeights,
    refetch: fetchWeights,
    DEFAULT_WEIGHTS,
  };
}
