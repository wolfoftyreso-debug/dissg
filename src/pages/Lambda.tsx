/**
 * LAMBDA 1.0 – GLOBAL REALITY SETPOINT
 * 
 * Main documentation and demonstration page for the Lambda system.
 * "When someone says 'we do this to improve society', you can answer: 'Show how it affects Lambda.'"
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Gauge, 
  Activity, 
  Globe, 
  BookOpen,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Layers,
  Cpu,
  Scale,
  GraduationCap
} from 'lucide-react';
import {
  LAMBDA_DEFINITION,
  LAMBDA_LEVELS,
  LAMBDA_SENSORS,
  SYSTEM_STRESS_INDICATORS,
  SYSTEM_SAYS,
} from '@/config/lambdaSetpointConfig';
import { 
  LambdaSetpointDisplay, 
  LambdaBadge,
  LambdaSensorBreakdown 
} from '@/components/global/LambdaSetpointDisplay';
import { LambdaPedagogicalView } from '@/components/global/LambdaPedagogicalView';

const LambdaPage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>('national');
  
  // Demo values
  const demoEntities = [
    { name: 'World', level: 'global' as const, value: 0.94, previous: 0.95, stressors: ['Climate Adaptation', 'Debt Levels'] },
    { name: 'Sweden', level: 'national' as const, value: 0.97, previous: 0.96, stressors: ['Housing Affordability'] },
    { name: 'Germany', level: 'national' as const, value: 0.92, previous: 0.94, stressors: ['Energy Transition', 'Demographics'] },
    { name: 'Stockholm', level: 'regional' as const, value: 0.95, previous: 0.95, stressors: ['Housing'] },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-primary/10 border">
              <Gauge className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Lambda 1.0</h1>
              <p className="text-xl text-muted-foreground">Global Reality Setpoint</p>
            </div>
          </div>
          
          <blockquote className="text-2xl font-light italic text-muted-foreground border-l-4 border-primary pl-6 my-8">
            "In a combustion engine, Lambda 1.0 means perfect balance.<br/>
            For the world, it means the same."
          </blockquote>
          
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="text-4xl font-mono font-bold text-primary">λ = 1.0</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Maximum efficiency • Minimal stress • Stable operation
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="text-4xl font-mono font-bold text-secondary-foreground">λ &lt; 0.9</div>
                <p className="text-sm text-muted-foreground mt-2">
                  System overload • "Too rich" • Inefficiency buildup
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="text-4xl font-mono font-bold text-destructive">λ &gt; 1.1</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Resource strain • "Too lean" • Collapse risk
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto px-4 py-12">
        <Tabs defaultValue="pedagogy" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pedagogy" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Förklaring
            </TabsTrigger>
            <TabsTrigger value="definition" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Definition
            </TabsTrigger>
            <TabsTrigger value="demo" className="gap-2">
              <Activity className="h-4 w-4" />
              Live Demo
            </TabsTrigger>
            <TabsTrigger value="sensors" className="gap-2">
              <Cpu className="h-4 w-4" />
              Sensors
            </TabsTrigger>
            <TabsTrigger value="levels" className="gap-2">
              <Layers className="h-4 w-4" />
              Levels
            </TabsTrigger>
          </TabsList>

          {/* Pedagogy Tab - NEW */}
          <TabsContent value="pedagogy" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Lambda förklarad i 5 lager
                </CardTitle>
                <CardDescription>
                  Från 18-åring (15 sekunder) till ISO-specifikation (full transparens)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LambdaPedagogicalView 
                  startLevel="L0" 
                  language="sv"
                  entityName="Världen"
                  lambdaValue={0.94}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Definition Tab */}
          <TabsContent value="definition" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Formal Definition
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-muted/50 rounded-lg border">
                  <p className="text-lg leading-relaxed">
                    {LAMBDA_DEFINITION.formalDefinition.en}
                  </p>
                  <div className="mt-4 font-mono text-sm text-muted-foreground">
                    Formula: {LAMBDA_DEFINITION.formula}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 text-emerald-600 mb-4">
                      <CheckCircle2 className="h-5 w-5" />
                      What Lambda 1.0 IS
                    </h3>
                    <ul className="space-y-2">
                      {LAMBDA_DEFINITION.whatLambdaIs.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="h-4 w-4 mt-0.5 text-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 text-red-600 mb-4">
                      <XCircle className="h-5 w-5" />
                      What Lambda 1.0 is NOT
                    </h3>
                    <ul className="space-y-2">
                      {LAMBDA_DEFINITION.whatLambdaIsNot.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm">
                          <XCircle className="h-4 w-4 mt-0.5 text-red-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What the System Says */}
            <Card>
              <CardHeader>
                <CardTitle>What the System Says (and Doesn't Say)</CardTitle>
                <CardDescription>
                  Lambda provides measurements, not judgments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-emerald-600 mb-3">The system SAYS:</h4>
                    <ul className="space-y-2">
                      {SYSTEM_SAYS.examples.map((example) => (
                        <li key={example} className="text-sm p-2 bg-emerald-500/10 rounded border border-emerald-500/20 font-mono">
                          "{example}"
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-red-600 mb-3">The system NEVER says:</h4>
                    <ul className="space-y-2">
                      {SYSTEM_SAYS.neverSays.map((example) => (
                        <li key={example} className="text-sm p-2 bg-red-500/10 rounded border border-red-500/20 font-mono line-through opacity-60">
                          "{example}"
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* The Decisive Point */}
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold">The Decisive Point</h3>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    When someone says:
                  </p>
                  <blockquote className="text-xl italic py-4">
                    "We do this to improve society"
                  </blockquote>
                  <p className="text-lg text-muted-foreground">
                    You can now answer:
                  </p>
                  <div className="text-2xl font-bold text-primary py-4">
                    "Show how it affects Lambda."
                  </div>
                  <Separator className="my-4" />
                  <p className="text-sm text-muted-foreground">
                    If they cannot → it's not serious. It's rhetoric. It's feeling.<br/>
                    <strong>Lambda is the final measuring stick.</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {demoEntities.map((entity) => (
                <LambdaSetpointDisplay
                  key={entity.name}
                  value={entity.value}
                  level={entity.level}
                  entityName={entity.name}
                  previousValue={entity.previous}
                  primaryStressors={entity.stressors}
                  dataCoverage={0.78 + Math.random() * 0.15}
                  uncertainty={0.02 + Math.random() * 0.03}
                  showDefinition={entity.name === 'Sweden'}
                />
              ))}
            </div>
            
            <LambdaSensorBreakdown />
          </TabsContent>

          {/* Sensors Tab */}
          <TabsContent value="sensors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Sensor Layer
                </CardTitle>
                <CardDescription>
                  Like an ECU, Lambda aggregates signals from multiple sensors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {LAMBDA_SENSORS.map((sensor) => (
                    <div key={sensor.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{sensor.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {(sensor.weight * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {sensor.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="secondary" className="capitalize">
                          {sensor.category}
                        </Badge>
                        <span className="text-muted-foreground">
                          {sensor.direction === 'higher_better' ? '↑ better' :
                           sensor.direction === 'lower_better' ? '↓ better' :
                           '⟷ optimal range'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Stress Analysis</CardTitle>
                <CardDescription>
                  How close is the system to hitting walls?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {SYSTEM_STRESS_INDICATORS.map((indicator) => (
                    <div key={indicator.id} className="p-4 border rounded-lg">
                      <h4 className="font-medium">{indicator.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {indicator.description}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Badge variant="outline" className="text-emerald-600">Low: {indicator.thresholds.low}</Badge>
                        <Badge variant="outline" className="text-amber-600">Med: {indicator.thresholds.medium}</Badge>
                        <Badge variant="outline" className="text-red-600">High: {indicator.thresholds.high}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Levels Tab */}
          <TabsContent value="levels" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Fractal Scalability
                </CardTitle>
                <CardDescription>
                  Same mathematics. Same logic. Different resolution.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(LAMBDA_LEVELS).map(([key, level]) => (
                    <div 
                      key={key}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedLevel === key ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedLevel(key)}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{level.emoji}</span>
                        <div className="flex-1">
                          <h4 className="font-medium">{level.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {level.description}
                          </p>
                        </div>
                        <LambdaBadge 
                          value={0.9 + Math.random() * 0.15} 
                          showTrend 
                          previousValue={0.95}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Why Lambda Wins */}
            <Card className="bg-gradient-to-br from-background to-muted/30">
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Why This Becomes the World's Trust Layer
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <span>We show raw data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <span>We show how it's aggregated</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <span>We show uncertainties</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <span>We show history</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <span>Anyone can replicate the calculation</span>
                  </li>
                </ul>
                <Separator className="my-6" />
                <p className="text-sm text-muted-foreground">
                  We do what central banks, politicians, and authorities should have built – but never did.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LambdaPage;
