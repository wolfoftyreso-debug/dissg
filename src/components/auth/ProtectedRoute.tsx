import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGovRole, GovRole, GOV_ROLE_LABELS } from '@/hooks/useGovRole';
import { Loader2, Shield, Crown, Building2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Rollhierarki för svenska roller (lägre index = högre behörighet)
type SupportedRole = GovRole | 'operativ' | 'departementsansvarig' | 'statsminister';

const ROLE_HIERARCHY: SupportedRole[] = [
  'statsminister',      // Högst
  'departementsansvarig',
  'operativ',           // Lägst av de svenska rollerna
];

const ROLE_ICONS: Record<GovRole, typeof Crown> = {
  statsminister: Crown,
  departementsansvarig: Building2,
  operativ: Briefcase,
};

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: SupportedRole;
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { data: govRole, isLoading: rolesLoading } = useGovRole();
  const location = useLocation();

  // Visa laddningsindikator medan auth kontrolleras
  if (authLoading || (user && rolesLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Verifierar behörighet...</p>
        </div>
      </div>
    );
  }

  // Omdirigera till login om inte inloggad
  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Kontrollera rollkrav om specificerat
  if (requiredRole) {
    // Om användaren inte har någon gov-roll
    if (!govRole) {
      return (
        <AccessDeniedScreen 
          requiredRole={requiredRole}
          currentRole={null}
        />
      );
    }

    const currentRole = govRole.role as GovRole;
    const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
    const currentIndex = ROLE_HIERARCHY.indexOf(currentRole);
    
    // Lägre index = högre behörighet
    if (currentIndex > requiredIndex || currentIndex === -1) {
      return (
        <AccessDeniedScreen 
          requiredRole={requiredRole}
          currentRole={currentRole}
          department={govRole.department}
          region={govRole.region}
        />
      );
    }
  }

  return <>{children}</>;
}

// Åtkomst nekad-skärm
interface AccessDeniedScreenProps {
  requiredRole: SupportedRole;
  currentRole: GovRole | null;
  department?: string;
  region?: string;
}

function AccessDeniedScreen({ requiredRole, currentRole, department, region }: AccessDeniedScreenProps) {
  const RequiredIcon = ROLE_ICONS[requiredRole as GovRole] || Shield;
  const CurrentIcon = currentRole ? ROLE_ICONS[currentRole] : Shield;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto">
          <Shield className="h-12 w-12 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Åtkomst nekad</h2>
          <p className="text-muted-foreground">
            Du har inte behörighet att visa denna sida.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-muted space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Kräver:</span>
            <div className="flex items-center gap-2 font-medium">
              <RequiredIcon className="h-4 w-4" />
              {GOV_ROLE_LABELS[requiredRole as GovRole] || requiredRole}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Din roll:</span>
            <div className="flex items-center gap-2">
              {currentRole ? (
                <>
                  <CurrentIcon className="h-4 w-4" />
                  <span>{GOV_ROLE_LABELS[currentRole]}</span>
                  {department && <span className="text-muted-foreground">({department})</span>}
                  {region && <span className="text-muted-foreground">({region})</span>}
                </>
              ) : (
                <span className="text-muted-foreground">Ingen roll tilldelad</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button asChild>
            <Link to="/">Gå till startsidan</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/public">Visa publik dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
