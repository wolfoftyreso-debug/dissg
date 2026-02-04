/**
 * SUBSCRIPTION DASHBOARD
 * 
 * Shows subscription-based dashboard instead of admin-assigned roles.
 * Uses text markers instead of icons per design doctrine.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { 
  useSubscription, 
  useCurrentTier,
} from '@/hooks/useSubscription';
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from '@/config/monetizationConfig';

const TIER_MARKERS: Record<SubscriptionTier, string> = {
  guest: '[GÄST]',
  observer: '[OBS]',
  analyst: '[ANALYS]',
  institutional: '[INST]',
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

  const tierMarker = TIER_MARKERS[tier];
  const tierName = plan.name.sv;
  const tierDescription = plan.description.sv;

  const badgeColors: Record<SubscriptionTier, string> = {
    guest: 'bg-muted text-muted-foreground',
    observer: 'bg-secondary text-secondary-foreground',
    analyst: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
    institutional: 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Subscription Header */}
      <Card className={`${badgeColors[tier]} border`}>
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-background/80 flex items-center justify-center shadow-sm text-xs font-bold">
              {tierMarker}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-lg font-mono">{tierName}</h2>
                <Badge variant="secondary" className="text-xs font-mono">
                  {subscription?.status === 'active' ? '[AKTIV]' : '[GRATIS]'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-mono">{tierDescription}</p>
            </div>
          </div>
          
          {tier !== 'institutional' && (
            <Button 
              variant="outline" 
              className="font-mono"
              onClick={() => navigate('/settings/subscription')}
            >
              [+] Uppgradera
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

function GuestView({ onNavigate }: { onNavigate: () => void }) {
  return (
    <Card className="font-mono">
      <CardHeader>
        <CardTitle className="font-mono">[LÅST] Logga in för full åtkomst</CardTitle>
        <CardDescription className="font-mono">
          Skapa ett gratis konto för att spara dina inställningar och få tillgång till fler funktioner.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onNavigate} className="font-mono">
          [+] Skapa konto
        </Button>
      </CardContent>
    </Card>
  );
}

function ObserverView({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="space-y-6 font-mono">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Tillgängliga KPI:er"
          value="184"
          changeLabel="nationella indikatorer"
          status="neutral"
        />
        <MetricCard
          title="Historik"
          value="10 år"
          changeLabel="tillgänglig data"
          status="positive"
        />
        <MetricCard
          title="Länder"
          value="47"
          changeLabel="med datatäckning"
          status="neutral"
        />
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg font-mono">[LÅST] Lås upp fler funktioner</CardTitle>
          <CardDescription className="font-mono">
            Uppgradera till Analyst för export, simuleringar och avancerade analyser.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="flex-1 text-sm text-muted-foreground">
            <ul className="space-y-1">
              <li>[OK] Export till CSV, Excel, JSON</li>
              <li>[OK] Scenario Lab (vad händer om...)</li>
              <li>[OK] Korrelationsanalys</li>
            </ul>
          </div>
          <Button onClick={onUpgrade} className="font-mono">
            [+] Uppgradera
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalystView() {
  return (
    <div className="space-y-6 font-mono">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Exporter"
          value="47/100"
          changeLabel="denna månad"
          status="neutral"
        />
        <MetricCard
          title="Simuleringar"
          value="12/50"
          changeLabel="denna månad"
          status="neutral"
        />
        <MetricCard
          title="Sparade vyer"
          value="8"
          change={2}
          changeLabel="nya denna vecka"
          status="positive"
        />
        <MetricCard
          title="Kritiska larm"
          value="3"
          changeLabel="kräver uppmärksamhet"
          status="warning"
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="font-mono">
          <TabsTrigger value="overview" className="font-mono">Översikt</TabsTrigger>
          <TabsTrigger value="exports" className="font-mono">Mina exporter</TabsTrigger>
          <TabsTrigger value="scenarios" className="font-mono">Scenario Lab</TabsTrigger>
          <TabsTrigger value="alerts" className="font-mono">Larm</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">Din analysöversikt</CardTitle>
              <CardDescription className="font-mono">Anpassad vy baserat på dina sparade indikatorer</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground font-mono">
                <p className="text-2xl mb-2">[DATA]</p>
                <p>Dina bevakade KPI:er</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="exports" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">Exporthistorik</CardTitle>
              <CardDescription className="font-mono">Dina senaste exporter och nedladdningar</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground font-mono">
                <p className="text-2xl mb-2">[EXPORT]</p>
                <p>Exporthistorik</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="scenarios" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">Scenario Lab</CardTitle>
              <CardDescription className="font-mono">Simulera "vad händer om..."-scenarier</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground font-mono">
                <p className="text-2xl mb-2">[SIM]</p>
                <p>Scenariosimuleringar</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="alerts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">Aktiva larm</CardTitle>
              <CardDescription className="font-mono">KPI:er som passerat dina tröskelvärden</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground font-mono">
                <p className="text-2xl mb-2">[!]</p>
                <p>Larmöversikt</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InstitutionalView() {
  return (
    <div className="space-y-6 font-mono">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="API-anrop"
          value="12.4k"
          change={8}
          changeLabel="% denna vecka"
          status="neutral"
        />
        <MetricCard
          title="Teammedlemmar"
          value="8"
          change={2}
          changeLabel="nya denna månad"
          status="positive"
        />
        <MetricCard
          title="Integrationer"
          value="4"
          changeLabel="aktiva kopplingar"
          status="neutral"
        />
        <MetricCard
          title="SLA-status"
          value="99.9%"
          changeLabel="upptid"
          status="positive"
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="font-mono">
          <TabsTrigger value="overview" className="font-mono">Översikt</TabsTrigger>
          <TabsTrigger value="team" className="font-mono">Team</TabsTrigger>
          <TabsTrigger value="api" className="font-mono">API</TabsTrigger>
          <TabsTrigger value="integrations" className="font-mono">Integrationer</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">Institutionell översikt</CardTitle>
              <CardDescription className="font-mono">Samlad vy för din organisation</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground font-mono">
                <p className="text-2xl mb-2">[ORG]</p>
                <p>Organisationsöversikt</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">Teamhantering</CardTitle>
              <CardDescription className="font-mono">Hantera användare och behörigheter</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground font-mono">
                <p className="text-2xl mb-2">[TEAM]</p>
                <p>Teammedlemmar</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="api" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">API-dashboard</CardTitle>
              <CardDescription className="font-mono">Övervaka API-användning och generera nycklar</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground font-mono">
                <p className="text-2xl mb-2">[API]</p>
                <p>API-statistik</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="integrations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">Integrationer</CardTitle>
              <CardDescription className="font-mono">Koppla DISSG till era interna system</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground font-mono">
                <p className="text-2xl mb-2">[KOPPLING]</p>
                <p>Aktiva integrationer</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel: string;
  status: 'positive' | 'warning' | 'neutral';
}

function MetricCard({ title, value, change, changeLabel, status }: MetricCardProps) {
  const statusMarkers = {
    positive: '[+]',
    warning: '[!]',
    neutral: '[−]',
  };

  const statusConfig = {
    positive: 'text-status-positive',
    warning: 'text-status-warning',
    neutral: 'text-muted-foreground',
  };

  return (
    <Card className="font-mono">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            <div className={`flex items-center gap-1 mt-1 text-xs ${statusConfig[status]}`}>
              <span>{statusMarkers[status]}</span>
              {change !== undefined && (
                <span className="font-medium">{change > 0 ? '+' : ''}{change}</span>
              )}
              <span>{changeLabel}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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
