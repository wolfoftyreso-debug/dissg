import { useState } from 'react';
import { AppRole } from '@/hooks/useUserRole';
import { getRoleConfig, ROLE_VIEW_CONFIGS } from '@/config/roleViewConfig';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Building2, Crown, Users, FlaskConical, Globe, Check, X } from 'lucide-react';

const ROLE_ICONS: Record<AppRole, React.ReactNode> = {
  public: <Globe className="h-4 w-4" />,
  researcher: <FlaskConical className="h-4 w-4" />,
  department_lead: <Building2 className="h-4 w-4" />,
  minister: <Shield className="h-4 w-4" />,
  prime_minister: <Crown className="h-4 w-4" />,
  system_admin: <Users className="h-4 w-4" />,
};

interface RoleSwitcherProps {
  currentRole: AppRole;
  onRoleChange: (role: AppRole) => void;
  isDemo?: boolean;
}

export function RoleSwitcher({ currentRole, onRoleChange, isDemo = true }: RoleSwitcherProps) {
  const config = getRoleConfig(currentRole);

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {isDemo ? 'Demo: Välj roll' : 'Aktiv roll'}
          </CardTitle>
          {isDemo && (
            <Badge variant="outline" className="text-xs">
              Demoläge
            </Badge>
          )}
        </div>
        <CardDescription className="text-xs">
          {isDemo 
            ? 'Byt roll för att se hur dashboarden anpassas'
            : 'Din tilldelade behörighetsnivå'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={currentRole} onValueChange={(v) => onRoleChange(v as AppRole)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ROLE_VIEW_CONFIGS).map((roleConfig) => (
              <SelectItem key={roleConfig.role} value={roleConfig.role}>
                <div className="flex items-center gap-2">
                  {ROLE_ICONS[roleConfig.role]}
                  <span>{roleConfig.displayName}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            {config.dashboardTitle}
          </p>
          <p className="text-xs text-muted-foreground">
            {config.description}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium">Fokusområden:</p>
          <div className="flex flex-wrap gap-1">
            {config.focusAreas.map((area) => (
              <Badge key={area} variant="secondary" className="text-xs">
                {area}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface FeatureComparisonProps {
  role: AppRole;
}

export function FeatureComparison({ role }: FeatureComparisonProps) {
  const config = getRoleConfig(role);
  
  const featureLabels: Record<keyof typeof config.features, string> = {
    canPrioritizeActions: 'Prioritera åtgärder',
    canViewAllKPIs: 'Se alla KPI:er',
    canViewDepartmentKPIs: 'Se departements-KPI:er',
    canViewAgencyKPIs: 'Se myndighets-KPI:er',
    canEditWeights: 'Redigera vikter',
    canAddActions: 'Lägga till åtgärder',
    canApproveActions: 'Godkänna åtgärder',
    canViewSensitiveData: 'Se känslig data',
    canExportData: 'Exportera data',
    canManageUsers: 'Hantera användare',
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Behörigheter</CardTitle>
        <CardDescription className="text-xs">
          Funktioner tillgängliga för {config.displayName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(config.features).map(([key, enabled]) => (
            <div
              key={key}
              className={`flex items-center gap-2 text-xs ${
                enabled ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {enabled ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <X className="h-3 w-3 text-muted-foreground" />
              )}
              <span>{featureLabels[key as keyof typeof config.features]}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
