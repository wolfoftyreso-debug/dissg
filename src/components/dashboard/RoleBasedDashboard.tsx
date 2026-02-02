import { useState, useMemo } from 'react';
import { AppRole } from '@/hooks/useUserRole';
import { getRoleConfig, DEPARTMENT_CATEGORIES } from '@/config/roleViewConfig';
import { KPI, CATEGORIES } from '@/types/kpi';
import { RoleSwitcher, FeatureComparison } from './RoleSwitcher';
import { RoleBadge } from './RoleBasedView';
import { ArchitectureVisualization } from './ArchitectureVisualization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Building2,
  BarChart3,
  FileText,
  Users,
  Activity,
  Clock,
  Layers
} from 'lucide-react';

interface RoleBasedDashboardProps {
  kpis: KPI[];
  onKPIClick: (kpi: KPI) => void;
}

export function RoleBasedDashboard({ kpis, onKPIClick }: RoleBasedDashboardProps) {
  const [demoRole, setDemoRole] = useState<AppRole>('prime_minister');
  const config = getRoleConfig(demoRole);

  // Filter KPIs based on role
  const filteredKPIs = useMemo(() => {
    if (config.kpiFilters.showAll) {
      return kpis;
    }

    if (config.kpiFilters.categories?.length) {
      return kpis.filter(k => config.kpiFilters.categories?.includes(k.category));
    }

    return kpis;
  }, [kpis, config]);

  // Get priority actions based on role threshold
  const criticalKPIs = filteredKPIs.filter(k => k.status === 'critical');
  const warningKPIs = filteredKPIs.filter(k => k.status === 'warning');

  return (
    <div className="space-y-6">
      {/* Role Switcher (Demo Mode) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RoleSwitcher 
          currentRole={demoRole} 
          onRoleChange={setDemoRole}
          isDemo={true}
        />
        <FeatureComparison role={demoRole} />
      </div>

      {/* Role-specific Dashboard Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{config.dashboardTitle}</CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </div>
            <RoleBadge role={demoRole} />
          </div>
        </CardHeader>
        <CardContent>
          {/* Quick Stats Grid - Role-specific focus */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickStat
              label="Kritiska"
              value={criticalKPIs.length}
              icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
              trend="critical"
            />
            <QuickStat
              label="Varningar"
              value={warningKPIs.length}
              icon={<Activity className="h-4 w-4 text-amber-500" />}
              trend="warning"
            />
            <QuickStat
              label="Positiv trend"
              value={filteredKPIs.filter(k => k.trend === 'up' && !k.inverted).length}
              icon={<TrendingUp className="h-4 w-4 text-green-500" />}
              trend="positive"
            />
            <QuickStat
              label="Bevakning"
              value={filteredKPIs.length}
              icon={<Target className="h-4 w-4 text-muted-foreground" />}
              trend="neutral"
            />
          </div>
        </CardContent>
      </Card>

      {/* Role-specific Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          {config.allowedNavItems.includes('overview') && (
            <TabsTrigger value="overview">Översikt</TabsTrigger>
          )}
          {config.allowedNavItems.includes('indicators') && (
            <TabsTrigger value="indicators">Indikatorer</TabsTrigger>
          )}
          {config.allowedNavItems.includes('responsibility') && (
            <TabsTrigger value="responsibility">Ansvar</TabsTrigger>
          )}
          {config.allowedNavItems.includes('analysis') && (
            <TabsTrigger value="analysis">Analys</TabsTrigger>
          )}
          {config.allowedNavItems.includes('decisions') && (
            <TabsTrigger value="decisions">Beslut</TabsTrigger>
          )}
          <TabsTrigger value="architecture" className="flex items-center gap-1">
            <Layers className="h-3 w-3" />
            Arkitektur
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <RoleOverviewContent role={demoRole} kpis={filteredKPIs} onKPIClick={onKPIClick} />
        </TabsContent>

        <TabsContent value="indicators" className="mt-4">
          <RoleIndicatorsContent role={demoRole} kpis={filteredKPIs} onKPIClick={onKPIClick} />
        </TabsContent>

        <TabsContent value="responsibility" className="mt-4">
          <RoleResponsibilityContent role={demoRole} kpis={filteredKPIs} />
        </TabsContent>

        <TabsContent value="analysis" className="mt-4">
          <RoleAnalysisContent role={demoRole} kpis={filteredKPIs} />
        </TabsContent>

        <TabsContent value="decisions" className="mt-4">
          <RoleDecisionsContent role={demoRole} />
        </TabsContent>

        <TabsContent value="architecture" className="mt-4">
          <ArchitectureVisualization />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface QuickStatProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  trend: 'critical' | 'warning' | 'positive' | 'neutral';
}

function QuickStat({ label, value, icon, trend }: QuickStatProps) {
  const bgColors = {
    critical: 'bg-destructive/10',
    warning: 'bg-amber-500/10',
    positive: 'bg-green-500/10',
    neutral: 'bg-muted',
  };

  return (
    <div className={`p-4 rounded-lg ${bgColors[trend]}`}>
      <div className="flex items-center justify-between">
        {icon}
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

// Role-specific Overview Content
function RoleOverviewContent({ role, kpis, onKPIClick }: { role: AppRole; kpis: KPI[]; onKPIClick: (kpi: KPI) => void }) {
  const config = getRoleConfig(role);

  if (role === 'prime_minister') {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Systemkritiska indikatorer
            </CardTitle>
            <CardDescription>Kräver omedelbar uppmärksamhet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {kpis.filter(k => k.status === 'critical').map(kpi => (
                <KPIQuickCard key={kpi.id} kpi={kpi} onClick={() => onKPIClick(kpi)} />
              ))}
              {kpis.filter(k => k.status === 'critical').length === 0 && (
                <p className="text-sm text-muted-foreground">Inga kritiska indikatorer just nu</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Departementsöversikt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(DEPARTMENT_CATEGORIES).map(([dept, cats]) => {
                const deptKpis = kpis.filter(k => cats.includes(k.category));
                const critCount = deptKpis.filter(k => k.status === 'critical').length;
                const warnCount = deptKpis.filter(k => k.status === 'warning').length;
                
                return (
                  <Card key={dept} className="p-3">
                    <p className="text-sm font-medium truncate">{dept.replace('departementet', '')}</p>
                    <div className="flex gap-2 mt-2">
                      {critCount > 0 && (
                        <Badge variant="destructive" className="text-xs">{critCount} krit</Badge>
                      )}
                      {warnCount > 0 && (
                        <Badge variant="outline" className="text-xs text-amber-600">{warnCount} varn</Badge>
                      )}
                      {critCount === 0 && warnCount === 0 && (
                        <Badge variant="secondary" className="text-xs">OK</Badge>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (role === 'minister') {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Departementets prioriteringar</CardTitle>
            <CardDescription>Fokuserade indikatorer för ditt ansvarsområde</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {kpis.slice(0, 5).map(kpi => (
                <KPIQuickCard key={kpi.id} kpi={kpi} onClick={() => onKPIClick(kpi)} showDetails />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (role === 'department_lead') {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Myndighetens KPI:er
            </CardTitle>
            <CardDescription>Indikatorer under ditt direkta ansvar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {kpis.slice(0, 4).map(kpi => (
                <KPIQuickCard key={kpi.id} kpi={kpi} onClick={() => onKPIClick(kpi)} showDetails />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default/public view
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sveriges lägesbild</CardTitle>
          <CardDescription>Översikt av nyckelindikatorer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.slice(0, 6).map(cat => {
              const catKpis = kpis.filter(k => k.category === cat.id);
              return (
                <Card key={cat.id} className="p-3">
                  <p className="text-sm font-medium">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{catKpis.length} indikatorer</p>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Role-specific Indicators Content
function RoleIndicatorsContent({ role, kpis, onKPIClick }: { role: AppRole; kpis: KPI[]; onKPIClick: (kpi: KPI) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Alla indikatorer</CardTitle>
        <CardDescription>{kpis.length} indikatorer i bevakning</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {kpis.map(kpi => (
            <KPIQuickCard key={kpi.id} kpi={kpi} onClick={() => onKPIClick(kpi)} showDetails />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Role-specific Responsibility Content
function RoleResponsibilityContent({ role, kpis }: { role: AppRole; kpis: KPI[] }) {
  const config = getRoleConfig(role);

  if (!config.features.canViewDepartmentKPIs) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Du har inte behörighet att se ansvarsinformation
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ansvarsmatris</CardTitle>
        <CardDescription>Koppling mellan KPI:er och ansvariga nivåer</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {CATEGORIES.map(cat => {
            const catKpis = kpis.filter(k => k.category === cat.id);
            if (catKpis.length === 0) return null;
            
            return (
              <div key={cat.id}>
                <h4 className="text-sm font-medium mb-2">{cat.name}</h4>
                <div className="grid gap-2">
                  {catKpis.map(kpi => (
                    <div key={kpi.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <span className="text-sm">{kpi.name}</span>
                      <Badge variant="outline">Nationell</Badge>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Role-specific Analysis Content
function RoleAnalysisContent({ role, kpis }: { role: AppRole; kpis: KPI[] }) {
  const config = getRoleConfig(role);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Trendanalys
        </CardTitle>
        <CardDescription>Automatisk analys av indikatormönster</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AnalysisSummaryCard
            title="Positiv utveckling"
            count={kpis.filter(k => k.trend === 'up').length}
            icon={<TrendingUp className="h-5 w-5 text-green-500" />}
            color="green"
          />
          <AnalysisSummaryCard
            title="Stabil"
            count={kpis.filter(k => k.trend === 'stable').length}
            icon={<Activity className="h-5 w-5 text-blue-500" />}
            color="blue"
          />
          <AnalysisSummaryCard
            title="Negativ utveckling"
            count={kpis.filter(k => k.trend === 'down').length}
            icon={<TrendingDown className="h-5 w-5 text-red-500" />}
            color="red"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function AnalysisSummaryCard({ title, count, icon, color }: { title: string; count: number; icon: React.ReactNode; color: string }) {
  const bgColors: Record<string, string> = {
    green: 'bg-green-500/10',
    blue: 'bg-blue-500/10',
    red: 'bg-red-500/10',
  };

  return (
    <div className={`p-4 rounded-lg ${bgColors[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-medium">{title}</span>
      </div>
      <span className="text-3xl font-bold">{count}</span>
    </div>
  );
}

// Role-specific Decisions Content
function RoleDecisionsContent({ role }: { role: AppRole }) {
  const config = getRoleConfig(role);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Beslut & åtgärder
        </CardTitle>
        <CardDescription>
          {config.features.canApproveActions 
            ? 'Granska och godkänn prioriterade åtgärder'
            : 'Se pågående och planerade åtgärder'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Beslutsöversikt laddas från databasen</p>
          <p className="text-xs mt-2">
            Prioritetsgräns: {config.priorityThreshold}+ poäng visas
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Quick KPI Card Component
function KPIQuickCard({ kpi, onClick, showDetails = false }: { kpi: KPI; onClick: () => void; showDetails?: boolean }) {
  const statusColors = {
    critical: 'border-l-destructive bg-destructive/5',
    warning: 'border-l-amber-500 bg-amber-500/5',
    positive: 'border-l-green-500 bg-green-500/5',
    neutral: 'border-l-muted-foreground bg-muted',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border-l-4 ${statusColors[kpi.status]} hover:opacity-80 transition-opacity`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-sm">{kpi.name}</p>
          {showDetails && (
            <p className="text-xs text-muted-foreground mt-1">
              {kpi.value} {kpi.unit} • {kpi.trendPercent > 0 ? '+' : ''}{kpi.trendPercent}%
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {kpi.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
          {kpi.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
          <Badge 
            variant={kpi.status === 'critical' ? 'destructive' : 'secondary'}
            className="text-xs"
          >
            {kpi.confidence}%
          </Badge>
        </div>
      </div>
    </button>
  );
}
