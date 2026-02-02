import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Globe, 
  Map, 
  Building2, 
  MapPin, 
  Settings2, 
  BarChart3,
  CircleDot,
  ZoomIn,
  ZoomOut,
  Clock,
  Eye,
  Users,
  User,
  Calendar,
  ChevronRight,
  Info,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Minus,
  Layers
} from 'lucide-react';
import {
  SCALE_HIERARCHY,
  TIME_DEPTHS,
  PERSPECTIVE_LENSES,
  SIGNIFICANCE_LEVELS,
  BIG_TRUTHS,
  EXAMPLE_CIVILIZATION_VIEW,
  PERSPECTIVE_PRINCIPLE,
  SYSTEM_DIFFERENTIATION,
  generateZoomInContext,
  type ScaleLevel,
  type TimeDepth,
  type PerspectiveLens
} from '@/config/perspectiveEngineConfig';

const PerspectiveEngine: React.FC = () => {
  const [currentScale, setCurrentScale] = useState<ScaleLevel>('civilization');
  const [timeDepth, setTimeDepth] = useState<TimeDepth>('civilizational');
  const [selectedLens, setSelectedLens] = useState<PerspectiveLens>('global');
  const [showBigTruths, setShowBigTruths] = useState(false);
  
  const civData = EXAMPLE_CIVILIZATION_VIEW;
  
  const getScaleIcon = (scale: ScaleLevel) => {
    const icons: Record<ScaleLevel, React.ReactNode> = {
      civilization: <Globe className="h-5 w-5" />,
      continent: <Map className="h-5 w-5" />,
      nation: <Building2 className="h-5 w-5" />,
      region: <MapPin className="h-5 w-5" />,
      system: <Settings2 className="h-5 w-5" />,
      indicator: <BarChart3 className="h-5 w-5" />,
      datapoint: <CircleDot className="h-5 w-5" />
    };
    return icons[scale];
  };

  const getLensIcon = (lens: PerspectiveLens) => {
    const icons: Record<PerspectiveLens, React.ReactNode> = {
      global: <Globe className="h-4 w-4" />,
      national: <Building2 className="h-4 w-4" />,
      personal: <User className="h-4 w-4" />,
      generational: <Calendar className="h-4 w-4" />
    };
    return icons[lens];
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving' || trend === 'growing') return <TrendingUp className="h-4 w-4 text-primary" />;
    if (trend === 'declining') return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const currentScaleIndex = SCALE_HIERARCHY.findIndex(s => s.level === currentScale);
  const canZoomIn = currentScaleIndex < SCALE_HIERARCHY.length - 1;
  const canZoomOut = currentScaleIndex > 0;

  const handleZoomIn = () => {
    if (canZoomIn) {
      setCurrentScale(SCALE_HIERARCHY[currentScaleIndex + 1].level);
    }
  };

  const handleZoomOut = () => {
    if (canZoomOut) {
      setCurrentScale(SCALE_HIERARCHY[currentScaleIndex - 1].level);
    }
  };

  const timeDepthValue = timeDepth === 'short' ? 0 : timeDepth === 'structural' ? 50 : 100;

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Perspective Engine</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Visa verkligheten på rätt skala – och låt människor zooma in utan att tappa sanningen.
        </p>
      </div>

      {/* Big Truths Panel (Collapsible) */}
      <Card className="border-primary/20">
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => setShowBigTruths(!showBigTruths)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-primary" />
              Grundläggande realiteter
            </CardTitle>
            <Badge variant="outline">{showBigTruths ? 'Dölj' : 'Visa'}</Badge>
          </div>
          <CardDescription>Inte åsikter. Observationer över 25 000 generationer.</CardDescription>
        </CardHeader>
        {showBigTruths && (
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {BIG_TRUTHS.map((truth) => (
                <div key={truth.id} className="p-3 bg-muted rounded-lg">
                  <div className="font-medium text-sm">{truth.statement}</div>
                  <div className="text-xs text-muted-foreground mt-1">{truth.explanation}</div>
                  <div className="text-xs text-primary/60 mt-1">Evidens: {truth.evidenceHorizon}</div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Civilization View (Default) */}
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-background to-muted/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              Civilization View
            </CardTitle>
            <Badge className="bg-primary text-primary-foreground">Standardvy</Badge>
          </div>
          <CardDescription className="text-lg">{civData.headline}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <div className="text-center p-4 bg-background rounded-lg border">
              <div className="text-3xl font-bold">{civData.humanWellbeingIndex}</div>
              <div className="text-sm text-muted-foreground">Välbefinnande</div>
              <div className="flex justify-center mt-1">{getTrendIcon(civData.trend)}</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg border">
              <div className="text-3xl font-bold">{(civData.energyPerCapita / 1000).toFixed(0)}k</div>
              <div className="text-sm text-muted-foreground">kWh/capita</div>
              <div className="flex justify-center mt-1">{getTrendIcon(civData.energyTrend)}</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg border">
              <div className="text-3xl font-bold">{civData.population}B</div>
              <div className="text-sm text-muted-foreground">Befolkning</div>
              <div className="flex justify-center mt-1">{getTrendIcon(civData.populationTrend)}</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg border">
              <div className="text-3xl font-bold">{civData.resilienceIndex}</div>
              <div className="text-sm text-muted-foreground">Resiliens</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg border">
              <div className="text-3xl font-bold">{civData.stressIndex}</div>
              <div className="text-sm text-muted-foreground">Stress</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg border">
              <div className="text-xl font-bold capitalize">{civData.longArcPhase}</div>
              <div className="text-sm text-muted-foreground">Fas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scale Navigator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Skalhierarki
          </CardTitle>
          <CardDescription>Obrytbar hierarki – man kan aldrig hoppa över nivåer</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Scale Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {SCALE_HIERARCHY.slice(0, currentScaleIndex + 1).map((scale, idx) => (
              <React.Fragment key={scale.level}>
                <Button
                  variant={scale.level === currentScale ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentScale(scale.level)}
                  className="flex items-center gap-1"
                >
                  {getScaleIcon(scale.level)}
                  <span className="hidden sm:inline">{scale.nameSv}</span>
                </Button>
                {idx < currentScaleIndex && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </React.Fragment>
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              onClick={handleZoomOut} 
              disabled={!canZoomOut}
              className="flex items-center gap-2"
            >
              <ZoomOut className="h-4 w-4" />
              Zooma ut
            </Button>
            
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center">
                {getScaleIcon(currentScale)}
                <span className="font-semibold text-lg">
                  {SCALE_HIERARCHY.find(s => s.level === currentScale)?.nameSv}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {SCALE_HIERARCHY.find(s => s.level === currentScale)?.description}
              </span>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleZoomIn} 
              disabled={!canZoomIn}
              className="flex items-center gap-2"
            >
              Zooma in
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Context Preserved Alert */}
          {currentScale !== 'civilization' && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Kontext bevarad</AlertTitle>
              <AlertDescription>
                {generateZoomInContext(currentScale, SCALE_HIERARCHY.find(s => s.level === currentScale)?.exampleScope || '')}
              </AlertDescription>
            </Alert>
          )}

          {/* All Scale Levels */}
          <div className="grid gap-2 mt-4">
            {SCALE_HIERARCHY.map((scale) => (
              <div 
                key={scale.level}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  scale.level === currentScale 
                    ? 'bg-primary/10 border-primary' 
                    : scale.order <= currentScaleIndex + 1 
                      ? 'bg-muted/50 hover:bg-muted' 
                      : 'opacity-50'
                }`}
                onClick={() => {
                  if (scale.order <= currentScaleIndex + 1) {
                    setCurrentScale(scale.level);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{scale.icon}</span>
                    <div>
                      <div className="font-medium">{scale.nameSv}</div>
                      <div className="text-xs text-muted-foreground">{scale.description}</div>
                    </div>
                  </div>
                  <Badge variant="outline">{scale.typicalTimeframe}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Depth Slider */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Tidsdjup
          </CardTitle>
          <CardDescription>Standard är alltid längsta rimliga – detta bryter nyhetslogiken</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="px-4">
              <Slider
                value={[timeDepthValue]}
                onValueChange={(v) => {
                  if (v[0] < 25) setTimeDepth('short');
                  else if (v[0] < 75) setTimeDepth('structural');
                  else setTimeDepth('civilizational');
                }}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="grid gap-3 md:grid-cols-3">
              {TIME_DEPTHS.map((depth) => (
                <div
                  key={depth.depth}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    depth.depth === timeDepth ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                  }`}
                  onClick={() => setTimeDepth(depth.depth)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{depth.nameSv}</span>
                    {depth.isDefault && <Badge variant="secondary">Standard</Badge>}
                  </div>
                  <div className="text-lg font-bold text-primary">{depth.range}</div>
                  <div className="text-sm text-muted-foreground">{depth.description}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Perspective Lenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Perspektivlinser
          </CardTitle>
          <CardDescription>Samma data. Olika linser. "Visa detta i mitt perspektiv"</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            {PERSPECTIVE_LENSES.map((lens) => (
              <div
                key={lens.lens}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  lens.lens === selectedLens ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedLens(lens.lens)}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getLensIcon(lens.lens)}
                  <span className="font-medium">{lens.nameSv}</span>
                </div>
                <div className="text-sm text-muted-foreground italic">"{lens.question}"</div>
              </div>
            ))}
          </div>
          
          <Alert className="mt-4">
            <Eye className="h-4 w-4" />
            <AlertTitle>Vald lins: {PERSPECTIVE_LENSES.find(l => l.lens === selectedLens)?.nameSv}</AlertTitle>
            <AlertDescription>
              {PERSPECTIVE_LENSES.find(l => l.lens === selectedLens)?.description}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Significance Levels */}
      <Card>
        <CardHeader>
          <CardTitle>"This Matters at This Scale"</CardTitle>
          <CardDescription>Varje datapunkt märks med dess faktiska betydelse</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {SIGNIFICANCE_LEVELS.map((sig) => (
              <div key={sig.level} className="p-4 border rounded-lg">
                <div className="font-medium mb-2">{sig.nameSv}</div>
                <div className="text-sm text-muted-foreground mb-3">{sig.description}</div>
                <div className="space-y-1">
                  {sig.examples.map((ex, i) => (
                    <Badge key={i} variant="outline" className="mr-1 mb-1">{ex}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Core Principle */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-lg text-muted-foreground">{PERSPECTIVE_PRINCIPLE.problem}</div>
            <div className="text-2xl font-bold text-primary">{PERSPECTIVE_PRINCIPLE.solution}</div>
            <Separator />
            <div className="text-sm text-muted-foreground max-w-2xl mx-auto">
              {PERSPECTIVE_PRINCIPLE.method}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Differentiation */}
      <Card>
        <CardHeader>
          <CardTitle>Varför detta system är annorlunda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-2">De flesta system svarar på:</div>
              <div className="text-lg font-medium">"{SYSTEM_DIFFERENTIATION.mostSystems}"</div>
            </div>
            <div className="p-4 border rounded-lg bg-primary/10 border-primary">
              <div className="text-sm text-primary/80 mb-2">Detta system svarar på:</div>
              <div className="text-lg font-medium text-primary">"{SYSTEM_DIFFERENTIATION.thisSystem}"</div>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {SYSTEM_DIFFERENTIATION.userOutcome.map((outcome, i) => (
              <Badge key={i} variant="secondary" className="capitalize">{outcome}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerspectiveEngine;
