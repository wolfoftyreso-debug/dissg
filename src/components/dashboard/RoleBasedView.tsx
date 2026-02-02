import { useUserRoles, AppRole } from '@/hooks/useUserRole';
import { getRoleConfig, RoleViewConfig } from '@/config/roleViewConfig';
import { Badge } from '@/components/ui/badge';
import { Shield, Building2, Crown, Users, FlaskConical, Globe } from 'lucide-react';

const ROLE_ICONS: Record<AppRole, React.ReactNode> = {
  public: <Globe className="h-4 w-4" />,
  researcher: <FlaskConical className="h-4 w-4" />,
  department_lead: <Building2 className="h-4 w-4" />,
  minister: <Shield className="h-4 w-4" />,
  prime_minister: <Crown className="h-4 w-4" />,
  system_admin: <Users className="h-4 w-4" />,
};

const ROLE_COLORS: Record<AppRole, string> = {
  public: 'bg-muted text-muted-foreground',
  researcher: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  department_lead: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  minister: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  prime_minister: 'bg-primary/10 text-primary',
  system_admin: 'bg-destructive/10 text-destructive',
};

interface RoleBadgeProps {
  role: AppRole;
  showDescription?: boolean;
}

export function RoleBadge({ role, showDescription = false }: RoleBadgeProps) {
  const config = getRoleConfig(role);
  
  return (
    <div className="flex items-center gap-2">
      <Badge className={`${ROLE_COLORS[role]} flex items-center gap-1.5`}>
        {ROLE_ICONS[role]}
        <span>{config.displayName}</span>
      </Badge>
      {showDescription && (
        <span className="text-xs text-muted-foreground">{config.description}</span>
      )}
    </div>
  );
}

interface RoleIndicatorProps {
  className?: string;
}

export function RoleIndicator({ className }: RoleIndicatorProps) {
  const { data, isLoading } = useUserRoles();
  
  if (isLoading) {
    return (
      <Badge variant="outline" className="animate-pulse">
        Laddar...
      </Badge>
    );
  }
  
  const role = data?.highestRole || 'public';
  
  return (
    <div className={className}>
      <RoleBadge role={role} />
    </div>
  );
}

interface RoleContextProps {
  children: (context: {
    role: AppRole;
    config: RoleViewConfig;
    isLoading: boolean;
  }) => React.ReactNode;
}

export function RoleContext({ children }: RoleContextProps) {
  const { data, isLoading } = useUserRoles();
  
  const role = data?.highestRole || 'public';
  const config = getRoleConfig(role);
  
  return <>{children({ role, config, isLoading })}</>;
}

interface FeatureGateProps {
  feature: keyof RoleViewConfig['features'];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({ feature, children, fallback = null }: FeatureGateProps) {
  const { data } = useUserRoles();
  
  const role = data?.highestRole || 'public';
  const config = getRoleConfig(role);
  
  if (!config.features[feature]) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

interface RoleRequiredProps {
  minRole: AppRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ROLE_HIERARCHY: AppRole[] = [
  'public',
  'researcher',
  'department_lead',
  'minister',
  'prime_minister',
  'system_admin',
];

export function RoleRequired({ minRole, children, fallback = null }: RoleRequiredProps) {
  const { data } = useUserRoles();
  
  const currentRole = data?.highestRole || 'public';
  const minIndex = ROLE_HIERARCHY.indexOf(minRole);
  const currentIndex = ROLE_HIERARCHY.indexOf(currentRole);
  
  if (currentIndex < minIndex) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}
