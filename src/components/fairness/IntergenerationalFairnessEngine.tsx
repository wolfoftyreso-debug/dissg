/**
 * INTERGENERATIONAL FAIRNESS ENGINE (IFE)
 * 
 * "Vem får nyttan – och vem betalar, över generationer?"
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StructuralPositionAlert, DecisionCorrelationAlert } from '@/components/ui/ExpandableInfoAlert';
import {
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Info,
  Scale,
  Baby,
  Globe,
  Calendar
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  IFE_CORE_QUESTION,
  IFE_WARNING,
  DEBT_CATEGORIES,
  COHORT_DATA,
  BENEFIT_COST_EXAMPLES,
  TIME_RESPONSIBILITY,
  GLOBAL_FAIRNESS_DATA,
  KEY_MESSAGES,
  SWEDEN_MANDATE_PERIODS
} from '@/config/intergenerationalFairnessConfig';

// Trend icon helper
const TrendIcon: React.FC<{ trend: string; size?: number }> = ({ trend, size = 16 }) => {
  if (trend === 'improving') return <TrendingUp size={size} className="text-green-500" />;
  if (trend === 'worsening') return <TrendingDown size={size} className="text-red-500" />;
  return <Minus size={size} className="text-muted-foreground" />;
};

// Debt level badge
const DebtLevelBadge: React.FC<{ level: string }> = ({ level }) => {
  const config = {
    low: { color: 'bg-green-500', label: '🟢 Låg' },
    moderate: { color: 'bg-yellow-500', label: '🟡 Måttlig' },
    high: { color: 'bg-red-500', label: '🔴 Hög' },
    unsustainable: { color: 'bg-black', label: '⚫ Ohållbar' },
    critical: { color: 'bg-red-700', label: '🔴 Kritisk' }
  };
  const c = config[level as keyof typeof config] || config.moderate;
  return <Badge variant="outline" className="text-xs">{c.label}</Badge>;
};

// Debt categories panel
const DebtCategoriesPanel: React.FC = () => (
  <div className="grid gap-4 md:grid-cols-2">
    {DEBT_CATEGORIES.map(cat => (
      <Card key={cat.id} className={`${
        cat.currentLevel === 'critical' || cat.currentLevel === 'high' 
          ? 'border-red-200 bg-red-50/30 dark:bg-red-950/20' 
          : ''
      }`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{cat.icon}</span>
              <CardTitle className="text-sm">{cat.labelSv}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <DebtLevelBadge level={cat.currentLevel} />
              <TrendIcon trend={cat.trendDirection} size={14} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">{cat.descriptionSv}</p>
          <div className="flex flex-wrap gap-1">
            {cat.components.map(c => (
              <Badge key={c.id} variant="secondary" className="text-xs">{c.labelSv}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Cohort selector and view
const CohortViewPanel: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('1990');
  const cohort = COHORT_DATA.find(c => c.birthYear.toString() === selectedYear) || COHORT_DATA[3];

  const radarData = [
    { axis: 'Energitillgång', value: cohort.energyAccess },
    { axis: 'Bostadsmarknad', value: cohort.housingAffordability },
    { axis: 'Arbetsmarknad', value: cohort.laborMarketAccess },
    { axis: 'Framtidsutsikter', value: cohort.futureOutlook }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Baby className="h-5 w-5" />
          <CardTitle className="text-base">Generationskohort-vy</CardTitle>
        </div>
        <CardDescription>Strukturell startposition vid födelse</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Födelseår:</span>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COHORT_DATA.map(c => (
                <SelectItem key={c.birthYear} value={c.birthYear.toString()}>
                  {c.birthYear}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline">{cohort.labelSv}</Badge>
        </div>

        <StructuralPositionAlert statement={KEY_MESSAGES.structuralPosition.sv} />

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Stats */}
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Skuld vid födsel</span>
                <DebtLevelBadge level={cohort.bornWithDebtLevel} />
              </div>
              <p className="text-2xl font-bold">{cohort.debtAtBirth.toLocaleString()} kr</p>
              <p className="text-xs text-muted-foreground">per capita</p>
            </div>

            <div className="p-3 border rounded-lg">
              <span className="text-sm font-medium">Strukturell belastning</span>
              <p className="text-sm text-muted-foreground mt-1">{cohort.structuralBurdenSv}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 border rounded text-center">
                <p className="text-lg font-bold">{cohort.energyAccess}</p>
                <p className="text-xs text-muted-foreground">Energitillgång</p>
              </div>
              <div className="p-2 border rounded text-center">
                <p className="text-lg font-bold">{cohort.housingAffordability}</p>
                <p className="text-xs text-muted-foreground">Bostadsmarknad</p>
              </div>
              <div className="p-2 border rounded text-center">
                <p className="text-lg font-bold">{cohort.laborMarketAccess}</p>
                <p className="text-xs text-muted-foreground">Arbetsmarknad</p>
              </div>
              <div className="p-2 border rounded text-center">
                <p className="text-lg font-bold">{cohort.futureOutlook}</p>
                <p className="text-xs text-muted-foreground">Framtidsutsikter</p>
              </div>
            </div>
          </div>

          {/* Radar */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Index"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Historical debt timeline
const DebtTimelinePanel: React.FC = () => {
  const chartData = COHORT_DATA.map(c => ({
    year: c.birthYear,
    debt: c.debtAtBirth / 1000,
    housing: c.housingAffordability,
    outlook: c.futureOutlook
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Skuld vid födsel över tid</CardTitle>
        <CardDescription>Tusen kronor per capita</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))'
                }}
                formatter={(value: number) => [`${value}k kr`, 'Skuld']}
              />
              <Line
                type="monotone"
                dataKey="debt"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--destructive))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Benefit vs Cost examples
const BenefitCostPanel: React.FC = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <Scale className="h-5 w-5" />
        <CardTitle className="text-base">Nytta vs kostnad över tid</CardTitle>
      </div>
      <CardDescription>Vem fick nyttan – vem betalar kostnaden</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {BENEFIT_COST_EXAMPLES.map(ex => (
        <div key={ex.id} className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">{ex.decisionSv}</span>
            <Badge variant="outline">{ex.year}</Badge>
          </div>
          
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded">
              <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                Omedelbar nytta
              </p>
              <p className="text-sm">{ex.immediateBenefitSv}</p>
            </div>
            
            <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded">
              <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">
                Långsiktig kostnad
              </p>
              <p className="text-sm">{ex.longTermCostSv}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Tidsförskjutning: {ex.timeShift} år</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>Kostnadsbärare: {ex.costBearersSv}</span>
            </div>
          </div>
        </div>
      ))}

      <Alert className="bg-primary/5">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          📌 {KEY_MESSAGES.populismVisible.sv}
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
);

// Time responsibility panel
const TimeResponsibilityPanel: React.FC = () => (
  <Card className="border-yellow-200 bg-yellow-50/30 dark:bg-yellow-950/20">
    <CardHeader>
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-yellow-600" />
        <CardTitle className="text-base">Tidsansvar</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="p-4 bg-background rounded-lg text-center">
        <p className="text-sm mb-2">Exempel: Infrastrukturunderskott</p>
        <p className="text-xl font-bold">
          {TIME_RESPONSIBILITY.template.sv.replace('{x}', '15')}
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm font-medium">
          {TIME_RESPONSIBILITY.principle.sv}
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
);

// Global comparison
const GlobalComparisonPanel: React.FC = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <Globe className="h-5 w-5" />
        <CardTitle className="text-base">Global jämförelse</CardTitle>
      </div>
      <CardDescription>Vilka länder skjuter kostnader framåt?</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {GLOBAL_FAIRNESS_DATA.sort((a, b) => a.futureShiftScore - b.futureShiftScore).map(country => (
          <div key={country.code} className="p-3 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{country.nameSv}</span>
                <TrendIcon trend={country.trend} size={14} />
              </div>
              <Badge variant={country.futureShiftScore > 60 ? 'destructive' : country.futureShiftScore > 40 ? 'secondary' : 'outline'}>
                Framtidsförskjutning: {country.futureShiftScore}%
              </Badge>
            </div>
            
            <div className="grid gap-2 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Investering för framtiden</span>
                  <span>{country.investmentScore}%</span>
                </div>
                <Progress value={country.investmentScore} className="h-1.5" />
              </div>
              <div className="text-muted-foreground">
                Skuld per ung person: {country.debtPerYouth.toLocaleString()} kr
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Mandate period correlation
const MandatePeriodPanel: React.FC = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        <CardTitle className="text-base">Mandatperioder & skuldutveckling</CardTitle>
      </div>
      <CardDescription>Spårbarhet utan anklagelse</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {SWEDEN_MANDATE_PERIODS.map((period, i) => (
          <div key={i} className="flex items-center gap-3 p-2 border rounded text-sm">
            <Badge variant="outline" className="shrink-0">
              {period.start}–{period.end}
            </Badge>
            <span className="flex-1">{period.leader} ({period.party})</span>
            <div className="flex items-center gap-2 text-xs">
              <span className={period.debtChange > 0 ? 'text-red-500' : 'text-green-500'}>
                Skuld: {period.debtChange > 0 ? '+' : ''}{period.debtChange}%
              </span>
              <span className="text-muted-foreground">
                Infrastruktur: {period.infrastructureInvestment}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <DecisionCorrelationAlert statement={KEY_MESSAGES.decisionCorrelation.sv} className="mt-4" />
    </CardContent>
  </Card>
);

// Main component
const IntergenerationalFairnessEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Intergenerational Fairness Engine</h1>
        </div>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Vem får nyttan – och vem betalar, över generationer?
        </p>
      </div>

      {/* Core question */}
      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Kärnfråga:</strong> {IFE_CORE_QUESTION.sv}
        </AlertDescription>
      </Alert>

      {/* Warning */}
      <Alert variant="destructive" className="bg-destructive/10">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          {IFE_WARNING.sv}
        </AlertDescription>
      </Alert>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Skuldtyper</TabsTrigger>
          <TabsTrigger value="cohorts">Generationer</TabsTrigger>
          <TabsTrigger value="decisions">Beslut</TabsTrigger>
          <TabsTrigger value="global">Globalt</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-6">
          <DebtCategoriesPanel />
          <Alert className="bg-muted/30">
            <AlertDescription className="text-xs">
              📌 {KEY_MESSAGES.workShifted.sv}
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="cohorts" className="mt-4 space-y-6">
          <CohortViewPanel />
          <DebtTimelinePanel />
        </TabsContent>

        <TabsContent value="decisions" className="mt-4 space-y-6">
          <BenefitCostPanel />
          <TimeResponsibilityPanel />
          <MandatePeriodPanel />
        </TabsContent>

        <TabsContent value="global" className="mt-4 space-y-6">
          <GlobalComparisonPanel />
        </TabsContent>
      </Tabs>

      {/* Core message */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6 text-center">
          <p className="text-sm font-medium max-w-lg mx-auto">
            {KEY_MESSAGES.civilizationWarning.sv}
          </p>
          <Separator className="my-4" />
          <p className="text-xs text-muted-foreground">
            Detta är inte moral. Detta är bokföring över tid.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntergenerationalFairnessEngine;
