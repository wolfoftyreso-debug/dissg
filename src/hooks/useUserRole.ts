import { useQuery } from '@tanstack/react-query';
import { getCurrentUser, getToken } from '@/lib/auth';

export type AppRole =
  | 'public'
  | 'researcher'
  | 'department_lead'
  | 'minister'
  | 'prime_minister'
  | 'system_admin'
  | 'statsminister'
  | 'departementsansvarig'
  | 'operativ';

export interface UserRole {
  role: AppRole;
  assigned_at: string;
}

export interface KPIResponsibility {
  kpi_id: string;
  responsibility_level: 'primary' | 'secondary' | 'observer';
}

const ROLE_HIERARCHY: AppRole[] = [
  'public',
  'researcher',
  'operativ',
  'department_lead',
  'departementsansvarig',
  'minister',
  'prime_minister',
  'statsminister',
  'system_admin',
];

async function apiFetch(path: string) {
  const token = getToken();
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`https://api.wavult.com/v1/dissg${path}`, { headers });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

export function useUserRoles() {
  return useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      const user = getCurrentUser();
      if (!user) return { roles: [] as UserRole[], highestRole: 'public' as AppRole };

      try {
        const data = await apiFetch(`/users/${user.sub}/roles`);
        const roles = (data.roles || []) as UserRole[];

        // Role from JWT payload takes precedence
        const jwtRole = user.role as AppRole | undefined;
        let highestRole: AppRole = 'public';

        const allRoles = [
          ...roles.map((r) => r.role),
          ...(jwtRole ? [jwtRole] : []),
        ];

        for (const r of allRoles) {
          const currentIndex = ROLE_HIERARCHY.indexOf(highestRole);
          const newIndex = ROLE_HIERARCHY.indexOf(r);
          if (newIndex > currentIndex) highestRole = r;
        }

        return { roles, highestRole };
      } catch {
        // Fallback: derive role from JWT claim only
        const jwtRole = (user.role as AppRole) || 'public';
        return {
          roles: [{ role: jwtRole, assigned_at: '' }] as UserRole[],
          highestRole: jwtRole,
        };
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useKPIResponsibilities() {
  return useQuery({
    queryKey: ['kpi-responsibilities'],
    queryFn: async () => {
      const user = getCurrentUser();
      if (!user) return [] as KPIResponsibility[];

      try {
        const data = await apiFetch(`/users/${user.sub}/responsibilities`);
        return (data.responsibilities || []) as KPIResponsibility[];
      } catch {
        return [] as KPIResponsibility[];
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useHasRole(requiredRole: AppRole) {
  const { data } = useUserRoles();
  if (!data) return false;
  const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  const currentIndex = ROLE_HIERARCHY.indexOf(data.highestRole);
  return currentIndex >= requiredIndex;
}

export function useIsResponsibleFor(kpiId: string) {
  const { data: responsibilities } = useKPIResponsibilities();
  if (!responsibilities) return false;
  return responsibilities.some((r) => r.kpi_id === kpiId);
}
