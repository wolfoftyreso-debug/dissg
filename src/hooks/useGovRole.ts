import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Swedish government roles
export type GovRole = 
  | 'statsminister'      // Prime Minister - highest access
  | 'departementsansvarig' // Department head - department-level access
  | 'operativ';           // Operational - regional/municipal access

// Map to display names
export const GOV_ROLE_LABELS: Record<GovRole, string> = {
  statsminister: 'Statsminister',
  departementsansvarig: 'Departementsansvarig',
  operativ: 'Operativ nivå',
};

// Role hierarchy (lower index = higher authority)
const ROLE_HIERARCHY: GovRole[] = ['statsminister', 'departementsansvarig', 'operativ'];

export interface UserGovRole {
  id: string;
  user_id: string;
  role: GovRole;
  department?: string;
  region?: string;
  assigned_at: string;
}

export function useGovRole() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['gov-role', user?.id],
    queryFn: async (): Promise<UserGovRole | null> => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .in('role', ['statsminister', 'departementsansvarig', 'operativ'])
        .order('assigned_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching gov role:', error);
        return null;
      }

      return data as UserGovRole | null;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllGovRoles() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['all-gov-roles'],
    queryFn: async (): Promise<(UserGovRole & { display_name?: string; email?: string })[]> => {
      if (!user) return [];

      // Get all gov roles with profile info
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          profiles:user_id (display_name)
        `)
        .in('role', ['statsminister', 'departementsansvarig', 'operativ'])
        .order('assigned_at', { ascending: false });

      if (error) {
        console.error('Error fetching all gov roles:', error);
        return [];
      }

      return (data || []).map((item: any) => ({
        ...item,
        display_name: item.profiles?.display_name,
      }));
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAssignGovRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      role,
      department,
      region,
    }: {
      userId: string;
      role: GovRole;
      department?: string;
      region?: string;
    }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role,
          department,
          region,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gov-role'] });
      queryClient.invalidateQueries({ queryKey: ['all-gov-roles'] });
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
    },
  });
}

export function useRevokeGovRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gov-role'] });
      queryClient.invalidateQueries({ queryKey: ['all-gov-roles'] });
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
    },
  });
}

// Check if current user has at least the specified role level
export function useHasGovRole(requiredRole: GovRole) {
  const { data: userRole } = useGovRole();

  if (!userRole) return false;

  const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  const currentIndex = ROLE_HIERARCHY.indexOf(userRole.role as GovRole);

  // Lower index = higher authority
  return currentIndex <= requiredIndex;
}

// Check if user is statsminister
export function useIsStatsminister() {
  const { data: userRole } = useGovRole();
  return userRole?.role === 'statsminister';
}

// Check if user is departementsansvarig for a specific department
export function useIsDepartmentHead(department?: string) {
  const { data: userRole } = useGovRole();
  
  if (!userRole) return false;
  if (userRole.role === 'statsminister') return true; // Statsminister has access to all
  if (userRole.role !== 'departementsansvarig') return false;
  if (!department) return true; // If no specific department, just check if departementsansvarig
  
  return userRole.department === department;
}

// Check if user is operativ for a specific region
export function useIsOperativFor(region?: string) {
  const { data: userRole } = useGovRole();
  
  if (!userRole) return false;
  if (userRole.role === 'statsminister' || userRole.role === 'departementsansvarig') return true;
  if (userRole.role !== 'operativ') return false;
  if (!region) return true;
  
  return userRole.region === region;
}
