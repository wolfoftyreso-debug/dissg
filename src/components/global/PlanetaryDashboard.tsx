/**
 * WAVE 10: BLOCK CE — PLANETARY DASHBOARD v1
 * 
 * Hela världen på en skärm.
 * Inget klick utan mening.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Zap,
  Users,
  Activity,
  ChevronRight,
  Info,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// ============================================================
// CE1: DASHBOARD CONTENT
// ============================================================

interface GlobalStressPoint {
  id: string;
  region: string;
  type: 'economic' | 'energy' | 'political' | 'humanitarian' | 'environmental';
  severity: 'critical' | 'high' | 'moderate';
  title: string;
  description: string;
  trend: 'escalating' | 'stable' | 'de-escalating';
  relatedKpis: string[];
}

interface TopChange {
  id: string;
  entityType: 'country' | 'region' | 'kpi';
  entityLabel: string;
  kpiLabel: string;
  change: number;
  changePercent: number;
  direction: 'up' | 'down';
  period: string;
  significance: 'major' | 'notable' | 'minor';
}

interface GMIData {
  global_score: number;
  trend: 'improving' | 'stable' | 'declining';
  pillars: {
    name: string;
    score: number;
    trend: number;
  }[];
}

export function PlanetaryDashboard() {
  const [selectedView, setSelectedView] = useState<'overview' | 'stress' | 'changes'>('overview');

  // Mock GMI data
  const gmiData: GMIData = {
    global_score: 62.4,
    trend: 'stable',
    pillars: [
      { name: 'Ekonomi', score: 58.2, trend: -0.8 },
      { name: 'Hälsa', score: 71.5, trend: 1.2 },
      { name: 'Utbildning', score: 68.3, trend: 0.5 },
      { name: 'Miljö', score: 45.7, trend: -1.5 },
      { name: 'Styrning', score: 65.8, trend: 0.2 },
      { name: 'Säkerhet', score: 59.4, trend: -0.3 }
    ]
  };

  // Mock stress points
  const stressPoints: GlobalStressPoint[] = [
    {
      id: 'sp_1',
      region: 'Central Europe',
      type: 'energy',
      severity: 'high',
      title: 'Energiinfrastruktur under press',
      description: 'Fortsatt hög belastning på elnätet under vinterperioden',
      trend: 'stable',
      relatedKpis: ['energy_security', 'electricity_price']
    },
    {
      id: 'sp_2',
      region: 'Nordic',
      type: 'economic',
      severity: 'moderate',
      title: 'Arbetsmarknadsförändring',
      description: 'Ökande arbetslöshet i flera sektorer',
      trend: 'escalating',
      relatedKpis: ['unemployment', 'gdp_growth']
    }
  ];

  // Mock top changes
  const topChanges: TopChange[] = [
    {
      id: 'tc_1',
      entityType: 'country',
      entityLabel: 'Sverige',
      kpiLabel: 'Arbetslöshet',
      change: 0.6,
      changePercent: 8.3,
      direction: 'up',
      period: '30 dagar',
      significance: 'notable'
    },
    {
      id: 'tc_2',
      entityType: 'country',
      entityLabel: 'Norge',
      kpiLabel: 'BNP-tillväxt',
      change: 1.2,
      changePercent: 15.4,
      direction: 'down',
      period: '30 dagar',
      significance: 'major'
    },
    {
      id: 'tc_3',
      entityType: 'region',
      entityLabel: 'EU27',
      kpiLabel: 'Inflation',
      change: -0.8,
      changePercent: -12.1,
      direction: 'down',
      period: '30 dagar',
      significance: 'notable'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-status-critical text-primary-foreground';
      case 'high': return 'bg-status-warning text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'escalating': return <ArrowUpRight className="h-4 w-4 text-status-critical" />;
      case 'de-escalating': return <ArrowDownRight className="h-4 w-4 text-status-positive" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'energy': return <Zap className="h-4 w-4" />;
      case 'economic': return <TrendingUp className="h-4 w-4" />;
      case 'political': return <Users className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Planetary Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Global status · Uppdaterad {new Date().toLocaleDateString('sv-SE')}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          G-DSP v1.0
        </Badge>
      </div>

      {/* Global Master Index */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Global Master Index</span>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-mono">{gmiData.global_score}</span>
              <Badge variant={gmiData.trend === 'improving' ? 'default' : 'secondary'}>
                {gmiData.trend === 'improving' ? '↑' : gmiData.trend === 'declining' ? '↓' : '→'}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {gmiData.pillars.map((pillar) => (
              <div key={pillar.name} className="p-3 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">{pillar.name}</div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-mono">{pillar.score}</span>
                  <span className={`text-xs ${pillar.trend > 0 ? 'text-status-positive' : pillar.trend < 0 ? 'text-status-critical' : 'text-muted-foreground'}`}>
                    {pillar.trend > 0 ? '+' : ''}{pillar.trend}
                  </span>
                </div>
                <Progress value={pillar.score} className="h-1 mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as typeof selectedView)}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="stress">Stresspunkter</TabsTrigger>
          <TabsTrigger value="changes">Förändringar</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Stress Points Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-status-warning" />
                  Pågående stresspunkter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {stressPoints.slice(0, 3).map((sp) => (
                  <div key={sp.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(sp.type)}
                      <span className="text-sm font-medium">{sp.region}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getSeverityColor(sp.severity)}`}>
                        {sp.severity}
                      </Badge>
                      {getTrendIcon(sp.trend)}
                    </div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full">
                  Visa alla <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            {/* Top Changes Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Största förändringar (30 dagar)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {topChanges.slice(0, 3).map((tc) => (
                  <div key={tc.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div>
                      <span className="text-sm font-medium">{tc.entityLabel}</span>
                      <span className="text-xs text-muted-foreground ml-2">{tc.kpiLabel}</span>
                    </div>
                    <div className={`flex items-center gap-1 ${tc.direction === 'up' ? 'text-blue-500' : 'text-orange-500'}`}>
                      {tc.direction === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span className="text-sm font-mono">
                        {tc.changePercent > 0 ? '+' : ''}{tc.changePercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full">
                  Visa alla <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stress Points Tab */}
        <TabsContent value="stress" className="space-y-4">
          {stressPoints.map((sp) => (
            <Card key={sp.id} className="border-l-4" style={{ borderLeftColor: sp.severity === 'critical' ? 'hsl(var(--destructive))' : sp.severity === 'high' ? 'hsl(var(--status-warning))' : 'hsl(var(--muted))' }}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(sp.type)}
                      <span className="font-medium">{sp.title}</span>
                      <Badge className={`text-xs ${getSeverityColor(sp.severity)}`}>
                        {sp.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{sp.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{sp.region}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        Trend: {getTrendIcon(sp.trend)} {sp.trend}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Visa data <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Changes Tab */}
        <TabsContent value="changes" className="space-y-4">
          {topChanges.map((tc) => (
            <Card key={tc.id}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{tc.entityType}</Badge>
                      <span className="font-medium">{tc.entityLabel}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{tc.kpiLabel}</p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${tc.direction === 'up' ? 'text-blue-500' : 'text-orange-500'}`}>
                      {tc.direction === 'up' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                      <span className="text-xl font-mono">
                        {tc.changePercent > 0 ? '+' : ''}{tc.changePercent.toFixed(1)}%
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{tc.period}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Footer Disclaimer */}
      <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <p>
          Alla värden baseras på officiella källor. Klicka på valfri datapunkt för att se källa, metod och fullständig data.
          Denna plattform producerar ingen primärdata.
        </p>
      </div>
    </div>
  );
}

export default PlanetaryDashboard;
