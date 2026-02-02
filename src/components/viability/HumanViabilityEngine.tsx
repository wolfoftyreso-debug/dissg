import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Brain, 
  Home, 
  Sparkles, 
  Users, 
  Zap, 
  Scale, 
  TrendingDown,
  TrendingUp,
  Minus,
  AlertTriangle,
  Info,
  FileText,
  Triangle,
  Clock,
  Target,
  Eye
} from 'lucide-react';
import {
  CORE_ASSUMPTIONS,
  CORE_QUESTION,
  HWI_COMPONENTS,
  DEBT_COMPONENTS,
  DEBT_LEVEL_THRESHOLDS,
  ENERGY_TRUTHS,
  RESPONSIBILITY_FRAMING,
  STATUS_DEFINITIONS,
  SYSTEM_PURPOSE,
  EXAMPLE_SWEDEN_HVE,
  type DebtLevel,
  type NationalStatus
} from '@/config/humanViabilityConfig';

const HumanViabilityEngine: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const data = EXAMPLE_SWEDEN_HVE;

  const getComponentIcon = (id: string) => {
    const icons: Record<string, React.ReactNode> = {
      'physical-health': <Heart className="h-4 w-4" />,
      'mental-health': <Brain className="h-4 w-4" />,
      'material-security': <Home className="h-4 w-4" />,
      'future-prospects': <Sparkles className="h-4 w-4" />,
      'autonomy': <Target className="h-4 w-4" />,
      'social-stability': <Users className="h-4 w-4" />,
      'energy-access': <Zap className="h-4 w-4" />,
      'debt-pressure': <Scale className="h-4 w-4" />
    };
    return icons[id] || <Info className="h-4 w-4" />;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-primary" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getDebtColor = (level: DebtLevel) => DEBT_LEVEL_THRESHOLDS[level].color;
  const getStatusColor = (status: NationalStatus) => STATUS_DEFINITIONS[status].color;

  const calculateOverallHWI = () => {
    const total = data.hwi.reduce((sum, item) => {
      const component = HWI_COMPONENTS.find(c => c.id === item.componentId);
      if (!component) return sum;
      const value = component.inverted ? (100 - item.value) : item.value;
      return sum + (value * component.weight);
    }, 0);
    return Math.round(total);
  };

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Human Viability Engine</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {CORE_QUESTION}
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="hwi">Välbefinnande</TabsTrigger>
          <TabsTrigger value="debt">Skuldbörda</TabsTrigger>
          <TabsTrigger value="energy">Energi</TabsTrigger>
          <TabsTrigger value="projection">Projektion</TabsTrigger>
          <TabsTrigger value="purpose">Syfte</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* National Status */}
          <Card style={{ borderLeftColor: getStatusColor(data.nationalStatus.status), borderLeftWidth: '4px' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{data.nationalStatus.headline}</CardTitle>
                <Badge 
                  variant="outline" 
                  style={{ 
                    backgroundColor: getStatusColor(data.nationalStatus.status),
                    color: 'white'
                  }}
                >
                  {STATUS_DEFINITIONS[data.nationalStatus.status].label}
                </Badge>
              </div>
              <CardDescription>{data.nationalStatus.explanation}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Centrala indikatorer</h4>
                  <div className="space-y-2">
                    {data.nationalStatus.keyIndicators.map((ind, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span>{ind.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={ind.severity === 'high' ? 'destructive' : ind.severity === 'moderate' ? 'secondary' : 'outline'}>
                            {ind.severity === 'high' ? 'Hög' : ind.severity === 'moderate' ? 'Måttlig' : 'Låg'}
                          </Badge>
                          {getTrendIcon(ind.trend === 'improving' ? 'up' : ind.trend === 'declining' ? 'down' : 'stable')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Handlingsutrymme</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={
                          data.nationalStatus.actionSpaceRemaining === 'ample' ? 80 :
                          data.nationalStatus.actionSpaceRemaining === 'limited' ? 50 :
                          data.nationalStatus.actionSpaceRemaining === 'narrow' ? 25 : 10
                        } 
                        className="flex-1" 
                      />
                      <span className="text-sm capitalize">{data.nationalStatus.actionSpaceRemaining}</span>
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2 mt-4">Osäkerheter</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {data.nationalStatus.uncertainties.map((u, i) => (
                      <li key={i}>• {u}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Triangle View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Triangle className="h-5 w-5" />
                Population × Energi × Välbefinnande
              </CardTitle>
              <CardDescription>Den centrala balansen som avgör om människor har det bra</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{data.triangle.population}M</div>
                  <div className="text-sm text-muted-foreground">Befolkning</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{(data.triangle.energyPerCapita / 1000).toFixed(0)}k</div>
                  <div className="text-sm text-muted-foreground">kWh/capita/år</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{data.triangle.institutionalEfficiency}%</div>
                  <div className="text-sm text-muted-foreground">Institutionell effektivitet</div>
                </div>
              </div>
              <Alert variant={data.triangle.overallBalance === 'balanced' ? 'default' : 'destructive'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>
                  Flaskhals: {data.triangle.bottleneck === 'none' ? 'Ingen' : 
                    data.triangle.bottleneck === 'institutions' ? 'Institutioner' :
                    data.triangle.bottleneck === 'energy' ? 'Energi' : 
                    data.triangle.bottleneck === 'population' ? 'Befolkning' : 'Multipla'}
                </AlertTitle>
                <AlertDescription>{data.triangle.explanation}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Core Assumptions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Ontologiska antaganden
              </CardTitle>
              <CardDescription>Systemets grundantaganden – deklarerade, inte dolda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {CORE_ASSUMPTIONS.map((assumption) => (
                  <div key={assumption.id} className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">{assumption.statement}</div>
                    <div className="text-xs text-muted-foreground mt-1">{assumption.implication}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HWI TAB */}
        <TabsContent value="hwi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Human Well-Being Index (HWI)</CardTitle>
              <CardDescription>Inte lycka, inte BNP – bara levbarhet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-5xl font-bold">{calculateOverallHWI()}</div>
                  <div className="text-muted-foreground">Sammanvägt index</div>
                </div>
              </div>

              <div className="space-y-4">
                {HWI_COMPONENTS.map((component) => {
                  const value = data.hwi.find(h => h.componentId === component.id);
                  if (!value) return null;
                  
                  return (
                    <div key={component.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getComponentIcon(component.id)}
                          <span className="font-medium">{component.nameSv}</span>
                          <span className="text-xs text-muted-foreground">({Math.round(component.weight * 100)}%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{value.value}</span>
                          {getTrendIcon(value.trend)}
                        </div>
                      </div>
                      <Progress value={value.value} className="h-2" />
                      <p className="text-xs text-muted-foreground">{component.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DEBT TAB */}
        <TabsContent value="debt" className="space-y-6">
          <Card style={{ borderLeftColor: getDebtColor(data.birthDebt.level), borderLeftWidth: '4px' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                "Born with Debt" Detector
              </CardTitle>
              <CardDescription>Vilken strukturell belastning föds en genomsnittlig människa in i?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <Badge 
                  className="text-lg px-4 py-2"
                  style={{ 
                    backgroundColor: getDebtColor(data.birthDebt.level),
                    color: 'white'
                  }}
                >
                  {data.birthDebt.level === 'low' ? 'Låg' : 
                   data.birthDebt.level === 'moderate' ? 'Måttlig' :
                   data.birthDebt.level === 'high' ? 'Hög' : 'Ohållbar'}
                </Badge>
                <p className="text-muted-foreground mt-2">{data.birthDebt.description}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {DEBT_COMPONENTS.map((component) => {
                  const value = component.id === 'public-debt' ? data.birthDebt.publicDebtPerCapita :
                                component.id === 'pension-gap' ? data.birthDebt.pensionGap :
                                component.id === 'infrastructure-deficit' ? data.birthDebt.infrastructureDeficit :
                                data.birthDebt.ecologicalDebt;
                  
                  return (
                    <Card key={component.id}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{component.nameSv}</span>
                          <span className="text-xs text-muted-foreground">{Math.round(component.weight * 100)}%</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {component.unit === 'SEK' || component.unit === 'SEK per capita' 
                            ? `${(value / 1000).toFixed(0)}k SEK`
                            : value
                          }
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{component.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Moral utan moralism</AlertTitle>
                <AlertDescription>
                  Detta är inte en moralisk dom. Det är en mätning av strukturell belastning som begränsar 
                  framtida generationers handlingsutrymme.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ENERGY TAB */}
        <TabsContent value="energy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Energy Reality Layer
              </CardTitle>
              <CardDescription>Ingen romantik. Bara konsekvens.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Energy Truths */}
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Grundläggande sanningar</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {ENERGY_TRUTHS.map((truth, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {truth}
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid gap-4 md:grid-cols-4 mb-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{(data.energy.energyPerCapita / 1000).toFixed(0)}k</div>
                  <div className="text-sm text-muted-foreground">kWh/capita/år</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{data.energy.energyCost}%</div>
                  <div className="text-sm text-muted-foreground">Av inkomst</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{data.energy.importDependency}%</div>
                  <div className="text-sm text-muted-foreground">Importberoende</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{data.energy.gridReliability}%</div>
                  <div className="text-sm text-muted-foreground">Nättillförlitlighet</div>
                </div>
              </div>

              {/* Energy Sources */}
              <h4 className="font-semibold mb-3">Energikällor och trade-offs</h4>
              <div className="space-y-3">
                {data.energy.energySources.map((source) => (
                  <div key={source.type} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{source.type}</span>
                      <span className="text-lg font-bold">{source.share}%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-2">
                      <div>Tillförlitlighet: {source.reliability}%</div>
                      <div>Kostnad: {source.cost} SEK/kWh</div>
                      <div>CO₂: {source.carbonIntensity} g/kWh</div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {source.tradeoffs.map((t, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Alert className="mt-4" variant={data.energy.scarcityRisk === 'low' ? 'default' : 'destructive'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Bristrisknivå: {
                  data.energy.scarcityRisk === 'low' ? 'Låg' :
                  data.energy.scarcityRisk === 'moderate' ? 'Måttlig' :
                  data.energy.scarcityRisk === 'elevated' ? 'Förhöjd' : 'Kritisk'
                }</AlertTitle>
                <AlertDescription>
                  Vad som händer när energi blir knapp: ekonomisk kontraktion, social stress, 
                  reducerad rörlighet, försämrad vård.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PROJECTION TAB */}
        <TabsContent value="projection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                "If Nothing Changes" – Human Outcome
              </CardTitle>
              <CardDescription>Inte katastrof-retorik. Inte optimism. Bara riktning.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-muted rounded-lg mb-6">
                <div className="text-center mb-4">
                  <Badge variant="outline" className="mb-2">{data.projection.horizon} horisont</Badge>
                  <div className="text-lg font-medium">
                    Om observerade trender fortsätter, {
                      data.projection.direction === 'improving' ? 'pekar data på förbättring' :
                      data.projection.direction === 'stable' ? 'indikerar data stabilitet' :
                      data.projection.direction === 'declining' ? 'pekar data på gradvis försämring' :
                      'visar data på accelererande försämring'
                    } av mänskligt välbefinnande.
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Konfidens: {Math.round(data.projection.confidence * 100)}%
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Nyckeldrivare</h4>
                  <ul className="space-y-2">
                    {data.projection.keyDrivers.map((driver, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <TrendingDown className="h-4 w-4 text-destructive" />
                        {driver}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Osäkerheter</h4>
                  <ul className="space-y-2">
                    {data.projection.uncertainties.map((unc, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Info className="h-4 w-4" />
                        {unc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Shared Responsibility */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">Delat ansvar</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground line-through">
                    {RESPONSIBILITY_FRAMING.notPolitician}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground line-through">
                    {RESPONSIBILITY_FRAMING.notMarket}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground line-through">
                    {RESPONSIBILITY_FRAMING.notPeople}
                  </div>
                  <div className="flex items-center gap-2 font-medium mt-4">
                    <Target className="h-4 w-4" />
                    {RESPONSIBILITY_FRAMING.shared}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PURPOSE TAB */}
        <TabsContent value="purpose" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Systemets verkliga syfte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 mb-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3 text-destructive">Inte</h4>
                  <ul className="space-y-2">
                    {SYSTEM_PURPOSE.not.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-destructive" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 border rounded-lg bg-muted">
                  <h4 className="font-semibold mb-3 text-primary">Utan</h4>
                  <p className="text-lg">{SYSTEM_PURPOSE.is}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {SYSTEM_PURPOSE.for.map((item, i) => (
                      <Badge key={i} variant="secondary">{item}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-primary/5 rounded-lg border-l-4 border-primary">
                <p className="whitespace-pre-line text-lg leading-relaxed">
                  {SYSTEM_PURPOSE.principle}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HumanViabilityEngine;
