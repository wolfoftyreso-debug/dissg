import { useAuth } from '@/contexts/AuthContext';
import { useUserRoles } from '@/hooks/useUserRole';
import { getRoleConfig } from '@/config/roleViewConfig';
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
import { User, LogOut, Shield, Settings, Crown, Building2, FlaskConical, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ROLE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  public: Globe,
  researcher: FlaskConical,
  department_lead: Building2,
  minister: Shield,
  prime_minister: Crown,
  system_admin: Settings,
  statsminister: Crown,
  departementsansvarig: Building2,
  operativ: Shield,
};

export function UserMenu() {
  const { user, signOut } = useAuth();
  const { data: roleData } = useUserRoles();
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

  const roleConfig = roleData ? getRoleConfig(roleData.highestRole) : null;
  const RoleIcon = roleData ? ROLE_ICONS[roleData.highestRole] : User;
  
  // Skapa initialer från email
  const initials = user.email
    ? user.email.split('@')[0].slice(0, 2).toUpperCase()
    : 'AN';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

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
            {user.user_metadata?.display_name || user.email?.split('@')[0]}
          </span>
          {roleConfig && (
            <Badge variant="outline" className="hidden md:flex text-xs gap-1">
              <RoleIcon className="h-3 w-3" />
              <span className="hidden lg:inline">{roleConfig.displayName}</span>
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.user_metadata?.display_name || 'Användare'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        {roleConfig && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-2">
                <RoleIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium">{roleConfig.displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {roleConfig.description}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => navigate('/admin')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Inställningar</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logga ut</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
