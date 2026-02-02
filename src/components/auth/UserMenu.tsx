import { useAuth } from '@/contexts/AuthContext';
import { useGovRole, GovRole, GOV_ROLE_LABELS } from '@/hooks/useGovRole';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Settings, Crown, Building2, Briefcase, Shield } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const ROLE_ICONS: Record<GovRole, React.ComponentType<{ className?: string }>> = {
  statsminister: Crown,
  departementsansvarig: Building2,
  operativ: Briefcase,
};

const ROLE_COLORS: Record<GovRole, string> = {
  statsminister: 'bg-amber-500/20 text-amber-600 border-amber-500/30',
  departementsansvarig: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  operativ: 'bg-green-500/20 text-green-600 border-green-500/30',
};

export function UserMenu() {
  const { user, signOut } = useAuth();
  const { data: govRole, isLoading } = useGovRole();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
          Logga in
        </Button>
        <Button size="sm" onClick={() => navigate('/register')}>
          Registrera
        </Button>
      </div>
    );
  }

  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'Användare';
  
  // Skapa initialer
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const role = govRole?.role as GovRole | undefined;
  const RoleIcon = role ? ROLE_ICONS[role] : Shield;
  const roleColor = role ? ROLE_COLORS[role] : '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline text-xs font-medium truncate max-w-[120px]">
            {displayName}
          </span>
          {role && !isLoading && (
            <Badge variant="outline" className={`hidden md:flex text-xs gap-1 ${roleColor}`}>
              <RoleIcon className="h-3 w-3" />
              <span className="hidden lg:inline">{GOV_ROLE_LABELS[role]}</span>
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        {govRole && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-2">
                <RoleIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium">{GOV_ROLE_LABELS[role!]}</p>
                  {govRole.department && (
                    <p className="text-xs text-muted-foreground">{govRole.department}</p>
                  )}
                  {govRole.region && (
                    <p className="text-xs text-muted-foreground">{govRole.region}</p>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Inställningar</span>
          </Link>
        </DropdownMenuItem>
        
        {role === 'statsminister' && (
          <DropdownMenuItem asChild>
            <Link to="/admin">
              <Shield className="mr-2 h-4 w-4" />
              <span>Administration</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logga ut</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
