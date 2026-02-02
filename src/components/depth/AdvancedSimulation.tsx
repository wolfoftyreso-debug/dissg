import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  PlayCircle,
  RotateCcw,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Target,
  MapPin,
  BarChart3,
  Lightbulb,
  Lock,
  History,
  Zap,
} from 'lucide-react';

// =====================================================
// DEL XVII — SIMULERING & "LEK MED TALEN"
// =====================================================

interface SimulationResult {
  masterIndexChange: number;
  affectedIndicators: {
    id: string;
    name: string;
    change: number;
    direction: 'positive' | 'negative' | 'neutral';
  }[];
  affectedRegions: number;
  confidenceLevel: number;
  historicalBasis: string;
}

interface IndicatorConfig {
  id: string;
  name: string;
  currentValue: number;
  unit: string;
  category: string;
  sensitivity: number; // 0-1, hur mycket det påverkar master
}

const INDICATORS: IndicatorConfig[] = [
  { id: 'employment_rate', name: 'Sysselsättningsgrad', currentValue: 68.2, unit: '%', category: 'Arbete', sensitivity: 0.85 },
  { id: 'working_age_functional', name: 'Arbetsför befolkning', currentValue: 70.6, unit: '%', category: 'Demografi', sensitivity: 0.72 },
  { id: 'productivity_per_hour', name: 'Produktivitet/timme', currentValue: 582, unit: 'SEK', category: 'Ekonomi', sensitivity: 0.68 },
  { id: 'life_expectancy', name: 'Medellivslängd', currentValue: 83.1, unit: 'år', category: 'Hälsa', sensitivity: 0.45 },
  { id: 'violent_crime_rate', name: 'Våldsbrott per 100k', currentValue: 127, unit: '/100k', category: 'Trygghet', sensitivity: 0.55 },
  { id: 'education_completion', name: 'Gymnasieexamen', currentValue: 87.3, unit: '%', category: 'Utbildning', sensitivity: 0.62 },
];

const SCOPE_OPTIONS = [
  { id: 'national', name: 'Hela Sverige', icon: <Target className="h-4 w-4" /> },
  { id: 'regional', name: 'Specifik region', icon: <MapPin className="h-4 w-4" /> },
  { id: 'cluster', name: 'Klustertyp', icon: <BarChart3 className="h-4 w-4" /> },
];

interface AdvancedSimulationProps {
  className?: string;
  userRole?: string;
  userDepartment?: string;
}

export function AdvancedSimulation({ className, userRole, userDepartment }: AdvancedSimulationProps) {
  const [activeTab, setActiveTab] = useState<'explore' | 'sandbox'>('explore');
  const [changes, setChanges] = useState<Record<string, number>>({});
  const [scope, setScope] = useState<'national' | 'regional' | 'cluster'>('national');
  const [scopeId, setScopeId] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [showSensitivity, setShowSensitivity] = useState(true);

  const hasChanges = Object.values(changes).some(v => v !== 0);

  const handleChange = (indicatorId: string, value: number) => {
    setChanges(prev => ({ ...prev, [indicatorId]: value }));
    setResults(null);
  };

  const resetAll = () => {
    setChanges({});
    setResults(null);
  };

  const runSimulation = () => {
    setIsSimulating(true);
    
    // Simulerad beräkning baserad på historisk känslighet
    setTimeout(() => {
      const totalWeightedChange = INDICATORS.reduce((sum, ind) => {
        const change = changes[ind.id] || 0;
        return sum + (change * ind.sensitivity);
      }, 0);

      // Beräkna påverkade indikatorer baserat på korrelationer
      const affectedIndicators = INDICATORS
        .filter(ind => (changes[ind.id] || 0) !== 0)
        .map(ind => ({
          id: ind.id,
          name: ind.name,
          change: changes[ind.id] || 0,
          direction: (changes[ind.id] || 0) > 0 ? 'positive' as const : 'negative' as const,
        }));

      setResults({
        masterIndexChange: totalWeightedChange * 0.15,
        affectedIndicators,
        affectedRegions: Math.max(1, Math.abs(Math.round(totalWeightedChange * 2))),
        confidenceLevel: Math.max(40, 85 - Math.abs(totalWeightedChange) * 2),
        historicalBasis: 'Baserat på data 2015–2024',
      });
      
      setIsSimulating(false);
    }, 1000);
  };

  // Beräkna aggregerad påverkan
  const aggregatedImpact = useMemo(() => {
    return INDICATORS.reduce((sum, ind) => {
      const change = changes[ind.id] || 0;
      return sum + (change * ind.sensitivity);
    }, 0);
  }, [changes]);

  const canAccessSandbox = userRole && ['department_lead', 'minister', 'prime_minister', 'system_admin'].includes(userRole);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Simulering
            </CardTitle>
            <CardDescription className="text-xs">
              Utforska hur förändringar påverkar systemet
            </CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className="bg-amber-500/10 text-amber-600 border-amber-500/30 gap-1"
          >
            <AlertTriangle className="h-3 w-3" />
            Simulerat
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Permanent Disclaimer */}
        <Alert className="bg-amber-500/5 border-amber-500/20">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-sm text-amber-700 dark:text-amber-400">
            ⚠️ Simulering – detta påverkar inte verklig data
          </AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground mt-1">
            Justeringar nedan visualiserar möjliga effekter baserat på historiska samband.
            Detta är inte en prognos utan ett verktyg för förståelse.
          </AlertDescription>
        </Alert>

        {/* Mode Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'explore' | 'sandbox')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="explore" className="text-xs gap-1">
              <Lightbulb className="h-3 w-3" />
              Utforska
            </TabsTrigger>
            <TabsTrigger 
              value="sandbox" 
              disabled={!canAccessSandbox}
              className="text-xs gap-1"
            >
              <Target className="h-3 w-3" />
              Besluts-sandbox
              {!canAccessSandbox && <Lock className="h-3 w-3" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-4 mt-4">
            {/* Scope Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Omfattning</label>
              <div className="flex gap-2">
                {SCOPE_OPTIONS.map((option) => (
                  <Button
                    key={option.id}
                    variant={scope === option.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setScope(option.id as typeof scope)}
                    className="flex-1 text-xs gap-1"
                  >
                    {option.icon}
                    {option.name.split(' ')[0]}
                  </Button>
                ))}
              </div>
            </div>

            {scope !== 'national' && (
              <Select value={scopeId} onValueChange={setScopeId}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder={scope === 'regional' ? 'Välj region...' : 'Välj kluster...'} />
                </SelectTrigger>
                <SelectContent>
                  {scope === 'regional' ? (
                    <>
                      <SelectItem value="01">Stockholms län</SelectItem>
                      <SelectItem value="12">Skåne län</SelectItem>
                      <SelectItem value="14">Västra Götalands län</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="cluster_1">Hög vårdkonsumtion + låg arbetsförmåga</SelectItem>
                      <SelectItem value="cluster_2">Ung befolkning + stigande sysselsättning</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            )}

            <Separator />

            {/* Indicator Adjustments */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">Justera indikatorer</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Visa känslighet</span>
                  <Switch 
                    checked={showSensitivity} 
                    onCheckedChange={setShowSensitivity}
                    className="scale-75"
                  />
                </div>
              </div>

              {INDICATORS.map((indicator) => {
                const change = changes[indicator.id] || 0;
                const newValue = indicator.currentValue * (1 + change / 100);

                return (
                  <div key={indicator.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{indicator.name}</span>
                        {showSensitivity && (
                          <Progress 
                            value={indicator.sensitivity * 100} 
                            className="w-12 h-1.5"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground font-mono">
                          {indicator.currentValue} {indicator.unit}
                        </span>
                        {change !== 0 && (
                          <>
                            <span className="text-muted-foreground">→</span>
                            <span className={cn(
                              "font-mono",
                              change > 0 ? 'text-emerald-600' : 'text-red-600'
                            )}>
                              {newValue.toFixed(1)} {indicator.unit}
                            </span>
                            <Badge 
                              variant={change > 0 ? 'default' : 'destructive'}
                              className="text-[10px] px-1"
                            >
                              {change > 0 ? '+' : ''}{change}%
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                    <Slider
                      value={[change]}
                      onValueChange={([v]) => handleChange(indicator.id, v)}
                      min={-20}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>
                );
              })}
            </div>

            {/* Aggregated Impact Preview */}
            {hasChanges && (
              <div className="bg-muted/50 rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Beräknad påverkan:</span>
                <div className="flex items-center gap-2">
                  {aggregatedImpact > 0 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  ) : aggregatedImpact < 0 ? (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ) : (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={cn(
                    "text-lg font-bold",
                    aggregatedImpact > 0 ? 'text-emerald-600' : aggregatedImpact < 0 ? 'text-red-600' : ''
                  )}>
                    {aggregatedImpact > 0 ? '+' : ''}{(aggregatedImpact * 0.15).toFixed(2)}%
                  </span>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sandbox" className="space-y-4 mt-4">
            {canAccessSandbox ? (
              <>
                <Alert className="bg-primary/5 border-primary/20">
                  <Target className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-xs">
                    <strong>Besluts-sandbox</strong>: Koppla simulering till ditt ansvarsområde
                    ({userDepartment || 'Ej definierat'}) och se hur dina KPI:er påverkar masterindex.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <p className="text-sm font-medium">Dina ansvarsområden</p>
                  <div className="grid grid-cols-2 gap-2">
                    {INDICATORS.slice(0, 4).map((ind) => (
                      <div 
                        key={ind.id}
                        className="p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <p className="text-xs font-medium">{ind.name}</p>
                        <p className="text-lg font-bold">{ind.currentValue} {ind.unit}</p>
                        <Progress value={ind.sensitivity * 100} className="h-1 mt-2" />
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Känslighet: {(ind.sensitivity * 100).toFixed(0)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert className="bg-amber-500/5 border-amber-500/20">
                  <Lightbulb className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-xs">
                    <strong>Marginalnyttan är störst</strong> inom områden med hög känslighet och 
                    stor förbättringspotential.
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <div className="text-center py-8">
                <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Besluts-sandbox kräver inloggning som departementschef eller högre.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Separator />

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={resetAll}
            disabled={!hasChanges}
            className="flex-1 text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Återställ
          </Button>
          <Button
            onClick={runSimulation}
            disabled={!hasChanges || isSimulating}
            className="flex-1 text-xs"
          >
            {isSimulating ? (
              <>
                <Zap className="h-3 w-3 mr-1 animate-pulse" />
                Beräknar...
              </>
            ) : (
              <>
                <PlayCircle className="h-3 w-3 mr-1" />
                Simulera
              </>
            )}
          </Button>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Simulerade effekter</p>
              <Badge variant="secondary" className="text-[10px]">
                {results.confidenceLevel}% konfidens
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Masterindex-förändring</p>
                <p className="text-2xl font-bold flex items-center gap-1">
                  {results.masterIndexChange > 0 ? (
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                  ) : results.masterIndexChange < 0 ? (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  ) : (
                    <Minus className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={cn(
                    results.masterIndexChange > 0 ? 'text-emerald-600' : 
                    results.masterIndexChange < 0 ? 'text-red-600' : ''
                  )}>
                    {results.masterIndexChange > 0 ? '+' : ''}{results.masterIndexChange.toFixed(2)}%
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Påverkade regioner</p>
                <p className="text-2xl font-bold">{results.affectedRegions}</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground italic">
              "Historiskt har en förbättring i detta område haft störst påverkan här."
              <br />
              {results.historicalBasis}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
