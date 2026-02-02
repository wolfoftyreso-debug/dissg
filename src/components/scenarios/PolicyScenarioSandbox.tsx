/**
 * POLICY SCENARIO SANDBOX (PSS)
 * 
 * "Visa vad historien säger om liknande förändringar – inte vad som kommer hända."
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FlaskConical,
  ArrowRight,
  AlertTriangle,
  Clock,
  Scale,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  GitCompare,
  Shield,
  Info,
  History,
  Target,
  Shuffle
} from 'lucide-react';
import {
  SCENARIO_VARIABLES,
  CHANGE_DIRECTIONS,
  CONTEXT_OPTIONS,
  SCENARIO_DISCLAIMERS,
  MISUSE_PROTECTIONS,
  HUMAN_IMPACT_CATEGORIES,
  PSS_CORE_PRINCIPLE,
  generateMockScenarioResponse,
  type ScenarioVariable,
  type ChangeDirection,
  type ContextOption,
  type ScenarioResponse
} from '@/config/policyScenarioConfig';

// Step indicator
const StepIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center gap-2 mb-4">
    {Array.from({ length: total }, (_, i) => (
      <React.Fragment key={i}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          i + 1 === current ? 'bg-primary text-primary-foreground' :
          i + 1 < current ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
        }`}>
          {i + 1}
        </div>
        {i < total - 1 && (
          <div className={`h-0.5 w-8 ${i + 1 < current ? 'bg-primary/50' : 'bg-muted'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// Variable selector
const VariableSelector: React.FC<{
  selected: ScenarioVariable | null;
  onSelect: (v: ScenarioVariable) => void;
}> = ({ selected, onSelect }) => {
  const categories = [...new Set(SCENARIO_VARIABLES.map(v => v.category))];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Steg 1: Vad ändras?</h3>
      <p className="text-sm text-muted-foreground">
        Välj en mätbar variabel att utforska.
      </p>
      
      {categories.map(cat => (
        <div key={cat} className="space-y-2">
          <h4 className="text-xs font-medium uppercase text-muted-foreground">{cat}</h4>
          <div className="grid gap-2 md:grid-cols-2">
            {SCENARIO_VARIABLES.filter(v => v.category === cat).map(variable => (
              <Card
                key={variable.id}
                className={`cursor-pointer transition-all hover:border-primary/50 ${
                  selected?.id === variable.id ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => onSelect(variable)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{variable.labelSv}</p>
                      <p className="text-xs text-muted-foreground">{variable.descriptionSv}</p>
                    </div>
                    {variable.historicalDataAvailable && (
                      <Badge variant="outline" className="text-xs shrink-0">
                        <History className="h-3 w-3 mr-1" />
                        Data
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Direction selector
const DirectionSelector: React.FC<{
  selected: ChangeDirection | null;
  onSelect: (d: ChangeDirection) => void;
  variable: ScenarioVariable;
}> = ({ selected, onSelect, variable }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Steg 2: I vilken riktning?</h3>
    <p className="text-sm text-muted-foreground">
      Hur förändras <span className="font-medium">{variable.labelSv}</span>?
    </p>
    
    <div className="grid gap-3 md:grid-cols-2">
      {CHANGE_DIRECTIONS.map(dir => (
        <Card
          key={dir.id}
          className={`cursor-pointer transition-all hover:border-primary/50 ${
            selected === dir.id ? 'border-primary bg-primary/5' : ''
          }`}
          onClick={() => onSelect(dir.id)}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <span className="text-2xl">{dir.icon}</span>
            <span className="font-medium">{dir.labelSv}</span>
          </CardContent>
        </Card>
      ))}
    </div>
    
    <Alert>
      <Info className="h-4 w-4" />
      <AlertDescription className="text-xs">
        Inga procentsatser anges i detta steg. Systemet visar historiska mönster oavsett exakt storlek.
      </AlertDescription>
    </Alert>
  </div>
);

// Context selector
const ContextSelector: React.FC<{
  selected: ContextOption | null;
  onSelect: (c: ContextOption) => void;
}> = ({ selected, onSelect }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Steg 3: Kontext</h3>
    <p className="text-sm text-muted-foreground">
      Vilka historiska paralleller ska sökas?
    </p>
    
    <div className="grid gap-3">
      {CONTEXT_OPTIONS.map(ctx => (
        <Card
          key={ctx.id}
          className={`cursor-pointer transition-all hover:border-primary/50 ${
            selected?.id === ctx.id ? 'border-primary bg-primary/5' : ''
          }`}
          onClick={() => onSelect(ctx)}
        >
          <CardContent className="p-4">
            <p className="font-medium">{ctx.labelSv}</p>
            <p className="text-xs text-muted-foreground mt-1">{ctx.descriptionSv}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// Results display
const ScenarioResults: React.FC<{ response: ScenarioResponse }> = ({ response }) => {
  const [activeTab, setActiveTab] = useState('parallels');
  const dirLabel = CHANGE_DIRECTIONS.find(d => d.id === response.direction)?.labelSv;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            <span className="font-semibold">Scenario:</span>
          </div>
          <p className="text-lg">
            {response.variable.labelSv} <span className="text-primary font-medium">{dirLabel?.toLowerCase()}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Kontext: {response.context.labelSv}
          </p>
        </CardContent>
      </Card>

      {/* Main disclaimer */}
      <Alert className="bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800 dark:text-yellow-200 text-sm">
          Viktigt att förstå
        </AlertTitle>
        <AlertDescription className="text-yellow-700 dark:text-yellow-300 text-sm">
          {response.disclaimerSv}
        </AlertDescription>
      </Alert>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="parallels" className="text-xs">
            <History className="h-3 w-3 mr-1" />
            Paralleller
          </TabsTrigger>
          <TabsTrigger value="outcomes" className="text-xs">
            <Target className="h-3 w-3 mr-1" />
            Utfall
          </TabsTrigger>
          <TabsTrigger value="tradeoffs" className="text-xs">
            <Scale className="h-3 w-3 mr-1" />
            Trade-offs
          </TabsTrigger>
          <TabsTrigger value="human" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            Mänsklig
          </TabsTrigger>
        </TabsList>

        <TabsContent value="parallels" className="mt-4 space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {SCENARIO_DISCLAIMERS.parallelsFound.sv.replace('{count}', String(response.parallels.length))}
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            {response.parallels.map(p => (
              <Card key={p.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{p.country}</span>
                        <Badge variant="outline" className="text-xs">{p.period}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{p.descriptionSv}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">Likhet</span>
                      <Progress value={p.similarity * 100} className="w-16 h-2 mt-1" />
                      <span className="text-xs font-medium">{Math.round(p.similarity * 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="outcomes" className="mt-4 space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {SCENARIO_DISCLAIMERS.outcomeVariation.sv}
            </AlertDescription>
          </Alert>
          
          <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-700 dark:text-blue-300">
              {SCENARIO_DISCLAIMERS.timeLag.sv
                .replace('{min}', String(response.variable.typicalLagYears[0]))
                .replace('{max}', String(response.variable.typicalLagYears[1]))}
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            {response.outcomes.map((outcome, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      outcome.direction === 'positive' ? 'bg-green-100 text-green-600' :
                      outcome.direction === 'negative' ? 'bg-red-100 text-red-600' :
                      outcome.direction === 'mixed' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {outcome.direction === 'positive' ? <TrendingUp className="h-4 w-4" /> :
                       outcome.direction === 'negative' ? <TrendingDown className="h-4 w-4" /> :
                       <Minus className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{outcome.indicatorSv}</p>
                      <p className="text-xs text-muted-foreground mt-1">{outcome.noteSv}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Frekvens: {Math.round(outcome.frequency * 100)}%</span>
                        <span>Lagg: {outcome.lagYears[0]}–{outcome.lagYears[1]} år</span>
                        <Badge variant="outline" className="text-xs">{outcome.magnitude}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tradeoffs" className="mt-4 space-y-4">
          <Alert>
            <Scale className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Vuxen politik kräver förståelse för att förbättringar i en dimension ofta sammanfaller med försämringar i en annan.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            {response.tradeOffs.map((tradeoff, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 text-right">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {tradeoff.improvedSv}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shuffle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{Math.round(tradeoff.frequency * 100)}%</span>
                    </div>
                    <div className="flex-1">
                      <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        {tradeoff.worsenedSv}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="human" className="mt-4 space-y-4">
          <Alert>
            <Users className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {SCENARIO_DISCLAIMERS.humanImpact.sv}
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-3 md:grid-cols-2">
            {HUMAN_IMPACT_CATEGORIES.map(cat => {
              const impact = response.humanImpact[cat.id as keyof typeof response.humanImpact];
              return (
                <Card key={cat.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{cat.icon}</span>
                      <span className="font-medium text-sm">{cat.labelSv}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{impact}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Misuse protection display
const MisuseProtectionBadge: React.FC = () => (
  <Card className="bg-muted/30">
    <CardContent className="pt-4">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm">Skydd mot missbruk</span>
      </div>
      <div className="grid gap-2 md:grid-cols-2 text-xs text-muted-foreground">
        {Object.values(MISUSE_PROTECTIONS).map((p, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>{p.sv}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Main component
const PolicyScenarioSandbox: React.FC = () => {
  const [step, setStep] = useState(1);
  const [variable, setVariable] = useState<ScenarioVariable | null>(null);
  const [direction, setDirection] = useState<ChangeDirection | null>(null);
  const [context, setContext] = useState<ContextOption | null>(null);
  const [response, setResponse] = useState<ScenarioResponse | null>(null);
  const [comparing, setComparing] = useState(false);
  const [comparison, setComparison] = useState<ScenarioResponse | null>(null);

  const handleRun = () => {
    if (variable && direction && context) {
      const result = generateMockScenarioResponse(variable, direction, context);
      if (comparing && response) {
        setComparison(result);
      } else {
        setResponse(result);
      }
    }
  };

  const handleReset = () => {
    setStep(1);
    setVariable(null);
    setDirection(null);
    setContext(null);
    setResponse(null);
    setComparison(null);
    setComparing(false);
  };

  const handleCompare = () => {
    setComparing(true);
    setStep(1);
    setVariable(null);
    setDirection(null);
    setContext(null);
  };

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <FlaskConical className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Policy Scenario Sandbox</h1>
        </div>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Visa vad historien säger om liknande förändringar – inte vad som kommer hända.
        </p>
      </div>

      {/* Core principle */}
      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Systemets logik:</strong> "{PSS_CORE_PRINCIPLE.whatSystemDoes.sv}"
        </AlertDescription>
      </Alert>

      {/* Main content */}
      {!response ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bygg scenario</CardTitle>
            <CardDescription>
              {comparing ? 'Skapa ett andra scenario för jämförelse' : 'Välj variabel, riktning och kontext'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <StepIndicator current={step} total={3} />
            
            {step === 1 && (
              <VariableSelector
                selected={variable}
                onSelect={(v) => { setVariable(v); setStep(2); }}
              />
            )}
            
            {step === 2 && variable && (
              <DirectionSelector
                selected={direction}
                onSelect={(d) => { setDirection(d); setStep(3); }}
                variable={variable}
              />
            )}
            
            {step === 3 && (
              <ContextSelector
                selected={context}
                onSelect={setContext}
              />
            )}
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Tillbaka
              </Button>
              
              {step === 3 && context && (
                <Button onClick={handleRun}>
                  Kör scenario
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Comparison view or single view */}
          {comparison ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Badge>A</Badge> Scenario 1
                </h3>
                <ScenarioResults response={response} />
              </div>
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Badge variant="secondary">B</Badge> Scenario 2
                </h3>
                <ScenarioResults response={comparison} />
              </div>
            </div>
          ) : (
            <ScenarioResults response={response} />
          )}
          
          {/* Actions */}
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" onClick={handleReset}>
              Nytt scenario
            </Button>
            {!comparison && (
              <Button variant="secondary" onClick={handleCompare}>
                <GitCompare className="h-4 w-4 mr-2" />
                Jämför med annat scenario
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Misuse protection */}
      <MisuseProtectionBadge />

      {/* Footer */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4 text-center">
          <p className="text-sm text-muted-foreground">
            🎯 Folk kan diskutera verkliga val – utan att systemet säger vad de ska göra.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyScenarioSandbox;
