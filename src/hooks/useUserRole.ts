import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 
  | 'public' 
  | 'researcher' 
  | 'department_lead' 
  | 'minister' 
  | 'prime_minister' 
  | 'system_admin';

export interface UserRole {
  role: AppRole;
  assigned_at: string;
}

export interface KPIResponsibility {
  kpi_id: string;
  responsibility_level: 'primary' | 'secondary' | 'observer';
}

export function useUserRoles() {
  return useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { roles: [] as UserRole[], highestRole: 'public' as AppRole };
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role, assigned_at')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user roles:', error);
        return { roles: [] as UserRole[], highestRole: 'public' as AppRole };
      }

      const roles = (data || []) as UserRole[];
      
      // Determine highest role
      const roleHierarchy: AppRole[] = [
        'public',
        'researcher', 
        'department_lead',
        'minister',
        'prime_minister',
        'system_admin'
      ];
      
      let highestRole: AppRole = 'public';
      for (const r of roles) {
        const currentIndex = roleHierarchy.indexOf(highestRole);
        const newIndex = roleHierarchy.indexOf(r.role);
        if (newIndex > currentIndex) {
          highestRole = r.role;
        }
      }

      return { roles, highestRole };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useKPIResponsibilities() {
  return useQuery({
    queryKey: ['kpi-responsibilities'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [] as KPIResponsibility[];
      }

      const { data, error } = await supabase
        .from('role_responsibilities')
        .select('kpi_id, responsibility_level')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching KPI responsibilities:', error);
        return [] as KPIResponsibility[];
      }

      return (data || []) as KPIResponsibility[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useHasRole(requiredRole: AppRole) {
  const { data } = useUserRoles();
  
  if (!data) return false;
  
  const roleHierarchy: AppRole[] = [
    'public',
    'researcher', 
    'department_lead',
    'minister',
    'prime_minister',
    'system_admin'
  ];
  
  const requiredIndex = roleHierarchy.indexOf(requiredRole);
  const currentIndex = roleHierarchy.indexOf(data.highestRole);
  
  return currentIndex >= requiredIndex;
}

export function useIsResponsibleFor(kpiId: string) {
  const { data: responsibilities } = useKPIResponsibilities();
  
  if (!responsibilities) return false;
  
  return responsibilities.some(r => r.kpi_id === kpiId);
}
