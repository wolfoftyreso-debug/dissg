/**
 * GovRoleDashboard — Rollbaserad dashboard för svenska regeringsroller
 */

import { useGovRole, GovRole, GOV_ROLE_LABELS } from '@/hooks/useGovRole';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Crown, 
  Building2, 
  Briefcase, 
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Map,
  FileText,
  Users
} from 'lucide-react';

const ROLE_ICONS: Record<GovRole, typeof Crown> = {
  statsminister: Crown,
  departementsansvarig: Building2,
  operativ: Briefcase,
};

const ROLE_GRADIENTS: Record<GovRole, string> = {
  statsminister: 'from-amber-500/10 to-amber-500/5 border-amber-500/20',
  departementsansvarig: 'from-blue-500/10 to-blue-500/5 border-blue-500/20',
  operativ: 'from-green-500/10 to-green-500/5 border-green-500/20',
};

interface GovRoleDashboardProps {
  children?: React.ReactNode;
}

export function GovRoleDashboard({ children }: GovRoleDashboardProps) {
  const { data: govRole, isLoading } = useGovRole();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!govRole) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Ingen roll tilldelad</AlertTitle>
        <AlertDescription>
          Du har inte tilldelats någon roll i systemet. Kontakta en administratör för att få åtkomst till fullständig funktionalitet.
        </AlertDescription>
      </Alert>
    );
  }

  const role = govRole.role as GovRole;
  const Icon = ROLE_ICONS[role];

  return (
    <div className="space-y-6">
      {/* Roll-header */}
      <Card className={`bg-gradient-to-r ${ROLE_GRADIENTS[role]} border`}>
        <CardContent className="flex items-center gap-4 py-4">
          <div className="h-12 w-12 rounded-full bg-background/80 flex items-center justify-center shadow-sm">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-lg">{GOV_ROLE_LABELS[role]}</h2>
            <p className="text-sm text-muted-foreground">
              {role === 'statsminister' && 'Full åtkomst till alla funktioner och nationell översikt'}
              {role === 'departementsansvarig' && `Åtkomst till ${govRole.department || 'ditt departement'} och relaterade KPI:er`}
              {role === 'operativ' && `Operativ vy för ${govRole.region || 'din region'} med lokala indikatorer`}
            </p>
          </div>
          <Badge variant="outline" className="hidden md:flex">
            {govRole.department || govRole.region || 'Nationell nivå'}
          </Badge>
        </CardContent>
      </Card>

      {/* Rollspecifikt innehåll */}
      {role === 'statsminister' && <StatsministerView />}
      {role === 'departementsansvarig' && <DepartementsansvarigView department={govRole.department} />}
      {role === 'operativ' && <OperativView region={govRole.region} />}

      {children}
    </div>
  );
}

// Statsminister-vy
function StatsministerView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Kritiska KPI:er"
          value="3"
          change={-1}
          changeLabel="sedan förra veckan"
          icon={AlertTriangle}
          status="warning"
        />
        <MetricCard
          title="Förbättrade"
          value="12"
          change={4}
          changeLabel="senaste månaden"
          icon={TrendingUp}
          status="positive"
        />
        <MetricCard
          title="Aktiva beslut"
          value="28"
          change={2}
          changeLabel="nya denna vecka"
          icon={FileText}
          status="neutral"
        />
        <MetricCard
          title="Departement"
          value="11"
          changeLabel="med aktiv rapportering"
          icon={Building2}
          status="neutral"
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="departments">Per departement</TabsTrigger>
          <TabsTrigger value="critical">Kritiska områden</TabsTrigger>
          <TabsTrigger value="decisions">Beslut</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Nationell översikt</CardTitle>
              <CardDescription>Sammanfattning av alla KPI:er och trender</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nationella KPI-trender</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="departments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Departementsöversikt</CardTitle>
              <CardDescription>Status per departement</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Departementsdata</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="critical" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Kritiska områden</CardTitle>
              <CardDescription>KPI:er som kräver omedelbar uppmärksamhet</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Kritiska KPI:er</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="decisions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Aktiva beslut</CardTitle>
              <CardDescription>Pågående beslut och deras effekter</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Beslutsspårning</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Departementsansvarig-vy
function DepartementsansvarigView({ department }: { department?: string }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Mina KPI:er"
          value="8"
          change={1}
          changeLabel="förbättrad"
          icon={BarChart3}
          status="positive"
        />
        <MetricCard
          title="Väntande beslut"
          value="4"
          changeLabel="kräver åtgärd"
          icon={Clock}
          status="warning"
        />
        <MetricCard
          title="Milstolpar"
          value="12"
          change={3}
          changeLabel="denna månad"
          icon={CheckCircle}
          status="neutral"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{department || 'Mitt departement'}</CardTitle>
          <CardDescription>KPI:er och beslut inom ditt ansvarsområde</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Departementsspecifik data</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Operativ-vy
function OperativView({ region }: { region?: string }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Lokala indikatorer"
          value="15"
          change={2}
          changeLabel="uppdaterade"
          icon={Map}
          status="neutral"
        />
        <MetricCard
          title="Rapporter"
          value="3"
          changeLabel="att skicka"
          icon={FileText}
          status="warning"
        />
        <MetricCard
          title="Uppgifter"
          value="7"
          change={2}
          changeLabel="slutförda idag"
          icon={CheckCircle}
          status="positive"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{region ? `Region ${region}` : 'Min region'}</CardTitle>
          <CardDescription>Operativ överblick och lokala indikatorer</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Map className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Regional data</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// MetricCard komponent
interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel: string;
  icon: typeof Crown;
  status: 'positive' | 'warning' | 'neutral';
}

function MetricCard({ title, value, change, changeLabel, icon: Icon, status }: MetricCardProps) {
  const statusConfig = {
    positive: 'text-status-positive',
    warning: 'text-status-warning',
    neutral: 'text-muted-foreground',
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            <div className={`flex items-center gap-1 mt-1 text-xs ${statusConfig[status]}`}>
              {change !== undefined && (
                <span className="font-medium">{change > 0 ? '+' : ''}{change}</span>
              )}
              <span>{changeLabel}</span>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-20 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
