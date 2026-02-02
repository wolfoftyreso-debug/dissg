import { ReactNode } from 'react';
import { useGovRole, GovRole } from '@/hooks/useGovRole';
import { Shield, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface RoleBasedAccessProps {
  requiredRole: GovRole;
  children: ReactNode;
  fallback?: ReactNode;
  showAccessDenied?: boolean;
}

const ROLE_HIERARCHY: GovRole[] = ['statsminister', 'departementsansvarig', 'operativ'];

export function RoleBasedAccess({ 
  requiredRole, 
  children, 
  fallback,
  showAccessDenied = false 
}: RoleBasedAccessProps) {
  const { data: userRole, isLoading } = useGovRole();

  if (isLoading) {
    return (
      <div className="animate-pulse bg-muted h-20 rounded-lg" />
    );
  }

  if (!userRole) {
    if (fallback) return <>{fallback}</>;
    if (showAccessDenied) return <AccessDeniedCard requiredRole={requiredRole} />;
    return null;
  }

  const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  const currentIndex = ROLE_HIERARCHY.indexOf(userRole.role as GovRole);

  // Lower index = higher authority
  const hasAccess = currentIndex <= requiredIndex;

  if (!hasAccess) {
    if (fallback) return <>{fallback}</>;
    if (showAccessDenied) return <AccessDeniedCard requiredRole={requiredRole} />;
    return null;
  }

  return <>{children}</>;
}

function AccessDeniedCard({ requiredRole }: { requiredRole: GovRole }) {
  const roleLabels: Record<GovRole, string> = {
    statsminister: 'Statsminister',
    departementsansvarig: 'Departementsansvarig',
    operativ: 'Operativ nivå',
  };

  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center">
          <Lock className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <h3 className="font-semibold">Åtkomst nekad</h3>
          <p className="text-sm text-muted-foreground">
            Denna funktion kräver minst rollen <strong>{roleLabels[requiredRole]}</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Higher-order component for role-based route protection
export function withRoleAccess<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole: GovRole
) {
  return function RoleProtectedComponent(props: P) {
    return (
      <RoleBasedAccess requiredRole={requiredRole} showAccessDenied>
        <WrappedComponent {...props} />
      </RoleBasedAccess>
    );
  };
}

// Badge showing current role
export function RoleBadge() {
  const { data: userRole, isLoading } = useGovRole();

  if (isLoading || !userRole) return null;

  const roleColors: Record<GovRole, string> = {
    statsminister: 'bg-amber-500/20 text-amber-600 border-amber-500/30',
    departementsansvarig: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
    operativ: 'bg-green-500/20 text-green-600 border-green-500/30',
  };

  const roleLabels: Record<GovRole, string> = {
    statsminister: 'Statsminister',
    departementsansvarig: 'Departementsansvarig',
    operativ: 'Operativ',
  };

  const role = userRole.role as GovRole;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${roleColors[role]}`}>
      <Shield className="h-3 w-3" />
      {roleLabels[role]}
      {userRole.department && (
        <span className="opacity-70">• {userRole.department}</span>
      )}
    </div>
  );
}
