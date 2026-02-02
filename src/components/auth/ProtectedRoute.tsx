import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoles, AppRole } from '@/hooks/useUserRole';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: AppRole;
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { data: roleData, isLoading: rolesLoading } = useUserRoles();
  const location = useLocation();

  // Visa laddningsindikator medan auth kontrolleras
  if (authLoading || (user && rolesLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Laddar...</p>
        </div>
      </div>
    );
  }

  // Omdirigera till login om inte inloggad
  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Kontrollera rollkrav om specificerat
  if (requiredRole && roleData) {
    const roleHierarchy: AppRole[] = [
      'public',
      'researcher', 
      'department_lead',
      'minister',
      'prime_minister',
      'system_admin'
    ];
    
    const requiredIndex = roleHierarchy.indexOf(requiredRole);
    const currentIndex = roleHierarchy.indexOf(roleData.highestRole);
    
    if (currentIndex < requiredIndex) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4 max-w-md p-6">
            <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto">
              <svg
                className="h-8 w-8 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Åtkomst nekad</h2>
            <p className="text-sm text-muted-foreground">
              Du har inte behörighet att visa denna sida. Din nuvarande roll är{' '}
              <strong>{roleData.highestRole}</strong>, men sidan kräver minst{' '}
              <strong>{requiredRole}</strong>.
            </p>
            <a 
              href="/"
              className="inline-block mt-4 text-primary hover:underline"
            >
              Gå till startsidan
            </a>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
