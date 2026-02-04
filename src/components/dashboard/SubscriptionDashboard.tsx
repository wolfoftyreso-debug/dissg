/**
 * SUBSCRIPTION DASHBOARD
 * 
 * Shows subscription-based dashboard instead of admin-assigned roles.
 * Users can upgrade their subscription in "Mina sidor" (My Account).
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Sparkles,
  Eye,
  BarChart3,
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileText,
  Lock,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  useSubscription, 
  useCurrentTier,
} from '@/hooks/useSubscription';
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from '@/config/monetizationConfig';

const TIER_ICONS: Record<SubscriptionTier, typeof Eye> = {
  guest: Eye,
  observer: Eye,
  analyst: BarChart3,
  institutional: Building2,
};

interface SubscriptionDashboardProps {
  children?: React.ReactNode;
}

export function SubscriptionDashboard({ children }: SubscriptionDashboardProps) {
  const { data: subscription, isLoading } = useSubscription();
  const tier = useCurrentTier();
  const plan = SUBSCRIPTION_TIERS[tier];
  const navigate = useNavigate();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const Icon = TIER_ICONS[tier];
  const tierName = plan.name.sv;
  const tierDescription = plan.description.sv;

  // Badge styling based on tier
  const badgeColors: Record<SubscriptionTier, string> = {
    guest: 'bg-muted text-muted-foreground',
    observer: 'bg-secondary text-secondary-foreground',
    analyst: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
    institutional: 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
  };

  return (
    <div className="space-y-6">
      {/* Subscription Header */}
      <Card className={`${badgeColors[tier]} border`}>
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-background/80 flex items-center justify-center shadow-sm">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-lg">{tierName}</h2>
                <Badge variant="secondary" className="text-xs">
                  {subscription?.status === 'active' ? 'Aktiv' : 'Gratis'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{tierDescription}</p>
            </div>
          </div>
          
          {tier !== 'institutional' && (
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => navigate('/settings/subscription')}
            >
              <Sparkles className="h-4 w-4" />
              Uppgradera
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Feature access based on tier */}
      {tier === 'guest' && <GuestView onNavigate={() => navigate('/auth')} />}
      {tier === 'observer' && <ObserverView onUpgrade={() => navigate('/settings/subscription')} />}
      {tier === 'analyst' && <AnalystView />}
      {tier === 'institutional' && <InstitutionalView />}

      {children}
    </div>
  );
}

// Guest view - not logged in
function GuestView({ onNavigate }: { onNavigate: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Logga in för full åtkomst
        </CardTitle>
        <CardDescription>
          Skapa ett gratis konto för att spara dina inställningar och få tillgång till fler funktioner.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onNavigate} className="gap-2">
          <Zap className="h-4 w-4" />
          Skapa konto
        </Button>
      </CardContent>
    </Card>
  );
}

// Observer view - free tier
function ObserverView({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Tillgängliga KPI:er"
          value="184"
          changeLabel="nationella indikatorer"
          icon={BarChart3}
          status="neutral"
        />
        <MetricCard
          title="Historik"
          value="10 år"
          changeLabel="tillgänglig data"
          icon={TrendingUp}
          status="positive"
        />
        <MetricCard
          title="Länder"
          value="47"
          changeLabel="med datatäckning"
          icon={Building2}
          status="neutral"
        />
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-4 w-4 text-muted-foreground" />
            Lås upp fler funktioner
          </CardTitle>
          <CardDescription>
            Uppgradera till Analyst för export, simuleringar och avancerade analyser.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="flex-1 text-sm text-muted-foreground">
            <ul className="space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Export till CSV, Excel, JSON
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Scenario Lab (vad händer om...)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Korrelationsanalys
              </li>
            </ul>
          </div>
          <Button onClick={onUpgrade} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Uppgradera
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Analyst view - paid tier
function AnalystView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Exporter"
          value="47/100"
          changeLabel="denna månad"
          icon={FileText}
          status="neutral"
        />
        <MetricCard
          title="Simuleringar"
          value="12/50"
          changeLabel="denna månad"
          icon={BarChart3}
          status="neutral"
        />
        <MetricCard
          title="Sparade vyer"
          value="8"
          change={2}
          changeLabel="nya denna vecka"
          icon={CheckCircle}
          status="positive"
        />
        <MetricCard
          title="Kritiska larm"
          value="3"
          changeLabel="kräver uppmärksamhet"
          icon={AlertTriangle}
          status="warning"
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="exports">Mina exporter</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Lab</TabsTrigger>
          <TabsTrigger value="alerts">Larm</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Din analysöversikt</CardTitle>
              <CardDescription>Anpassad vy baserat på dina sparade indikatorer</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Dina bevakade KPI:er</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="exports" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Exporthistorik</CardTitle>
              <CardDescription>Dina senaste exporter och nedladdningar</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Exporthistorik</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="scenarios" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Lab</CardTitle>
              <CardDescription>Simulera "vad händer om..."-scenarier</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Scenariosimuleringar</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="alerts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Aktiva larm</CardTitle>
              <CardDescription>KPI:er som passerat dina tröskelvärden</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Larmöversikt</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Institutional view - enterprise tier
function InstitutionalView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="API-anrop"
          value="12.4k"
          change={8}
          changeLabel="% denna vecka"
          icon={Zap}
          status="neutral"
        />
        <MetricCard
          title="Teammedlemmar"
          value="8"
          change={2}
          changeLabel="nya denna månad"
          icon={Building2}
          status="positive"
        />
        <MetricCard
          title="Integrationer"
          value="4"
          changeLabel="aktiva kopplingar"
          icon={CheckCircle}
          status="neutral"
        />
        <MetricCard
          title="SLA-status"
          value="99.9%"
          changeLabel="upptid"
          icon={TrendingUp}
          status="positive"
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="integrations">Integrationer</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Institutionell översikt</CardTitle>
              <CardDescription>Samlad vy för din organisation</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Organisationsöversikt</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Teamhantering</CardTitle>
              <CardDescription>Hantera användare och behörigheter</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Teammedlemmar</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="api" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>API-dashboard</CardTitle>
              <CardDescription>Övervaka API-användning och generera nycklar</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Zap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>API-statistik</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="integrations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrationer</CardTitle>
              <CardDescription>Koppla DISSG till era interna system</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aktiva integrationer</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Metric card component
interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel: string;
  icon: typeof Eye;
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

export default SubscriptionDashboard;
