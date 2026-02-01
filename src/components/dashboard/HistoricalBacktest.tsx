import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Activity,
  Shield,
  TrendingDown,
  Heart,
  Building,
  Users,
} from 'lucide-react';
import {
  HISTORICAL_EVENTS,
  HistoricalEvent,
  generateHistoricalData,
  HistoricalDataPoint,
} from '@/data/historicalEvents';

interface SimulationResult {
  event: HistoricalEvent;
  warningsIssued: WarningIssued[];
  leadTimeMonths: number;
  wouldHaveDetected: boolean;
  detectionScore: number; // 0-100
}

interface WarningIssued {
  date: string;
  kpiId: string;
  kpiName: string;
  severity: 'warning' | 'critical';
  value: number;
  threshold: number;
  leadTimeBeforeEvent: number;
}

const CATEGORY_ICONS = {
  economic: TrendingDown,
  health: Heart,
  security: Shield,
  social: Users,
  infrastructure: Building,
};

const SEVERITY_COLORS = {
  critical: 'bg-status-critical text-white',
  high: 'bg-status-warning text-white',
  moderate: 'bg-status-neutral text-white',
};

export function HistoricalBacktest() {
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [currentDataPoints, setCurrentDataPoints] = useState<HistoricalDataPoint[]>([]);

  // Run simulation for all events
  const runFullSimulation = async () => {
    setIsSimulating(true);
    setSimulationProgress(0);
    const results: SimulationResult[] = [];

    for (let i = 0; i < HISTORICAL_EVENTS.length; i++) {
      const event = HISTORICAL_EVENTS[i];
      
      // Generate historical data
      const historicalData = generateHistoricalData(event);
      
      // Analyze for warnings
      const warnings: WarningIssued[] = [];
      
      for (const indicator of event.leadIndicators) {
        const indicatorData = historicalData.filter(d => d.kpiId === indicator.kpiId);
        
        for (const dataPoint of indicatorData) {
          const isInverted = indicator.peakValue < indicator.normalValue;
          const threshold = indicator.normalValue + 
            (indicator.warningValue - indicator.normalValue) * 0.5;
          
          let shouldWarn = false;
          if (isInverted) {
            shouldWarn = dataPoint.value < threshold;
          } else {
            shouldWarn = dataPoint.value > threshold;
          }
          
          if (shouldWarn && (dataPoint.status === 'warning' || dataPoint.status === 'critical')) {
            const eventDate = new Date(event.date);
            const warningDate = new Date(dataPoint.date);
            const leadTimeMs = eventDate.getTime() - warningDate.getTime();
            const leadTimeMonths = Math.round(leadTimeMs / (30 * 24 * 60 * 60 * 1000));
            
            // Only add first warning per KPI
            if (!warnings.some(w => w.kpiId === indicator.kpiId)) {
              warnings.push({
                date: dataPoint.date,
                kpiId: indicator.kpiId,
                kpiName: indicator.kpiName,
                severity: dataPoint.status as 'warning' | 'critical',
                value: dataPoint.value,
                threshold,
                leadTimeBeforeEvent: leadTimeMonths,
              });
            }
          }
        }
      }
      
      // Calculate detection score
      const earlyWarnings = warnings.filter(w => w.leadTimeBeforeEvent > 0);
      const maxLeadTime = Math.max(...warnings.map(w => w.leadTimeBeforeEvent), 0);
      const detectionScore = Math.min(100, 
        (earlyWarnings.length / Math.max(1, event.leadIndicators.length)) * 50 +
        Math.min(50, maxLeadTime * 5)
      );
      
      results.push({
        event,
        warningsIssued: warnings.sort((a, b) => a.date.localeCompare(b.date)),
        leadTimeMonths: maxLeadTime,
        wouldHaveDetected: earlyWarnings.length > 0,
        detectionScore: Math.round(detectionScore),
      });
      
      setSimulationProgress(Math.round(((i + 1) / HISTORICAL_EVENTS.length) * 100));
      
      // Small delay for visual effect
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setSimulationResults(results);
    setIsSimulating(false);
  };

  const runEventSimulation = async (event: HistoricalEvent) => {
    setSelectedEvent(event);
    const data = generateHistoricalData(event);
    setCurrentDataPoints([]);
    
    // Animate through data points
    for (let i = 0; i < data.length; i++) {
      setCurrentDataPoints(data.slice(0, i + 1));
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const overallStats = useMemo(() => {
    if (simulationResults.length === 0) return null;
    
    const detected = simulationResults.filter(r => r.wouldHaveDetected).length;
    const avgLeadTime = simulationResults.reduce((sum, r) => sum + Math.max(0, r.leadTimeMonths), 0) / simulationResults.length;
    const avgScore = simulationResults.reduce((sum, r) => sum + r.detectionScore, 0) / simulationResults.length;
    
    return {
      detectionRate: Math.round((detected / simulationResults.length) * 100),
      avgLeadTime: Math.round(avgLeadTime),
      avgScore: Math.round(avgScore),
      totalEvents: simulationResults.length,
      detectedEvents: detected,
    };
  }, [simulationResults]);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Historisk Backtesting</CardTitle>
            </div>
            <Button
              onClick={runFullSimulation}
              disabled={isSimulating}
              size="sm"
            >
              {isSimulating ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Simulerar...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Kör Full Simulering
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Testa hur KPI-varningssystemet hade presterat mot kända historiska händelser i Sverige.
            Simuleringen kör genom retrodata och visar vilka varningar systemet hade utfärdat.
          </p>
          
          {isSimulating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Simulerar historiska händelser...</span>
                <span>{simulationProgress}%</span>
              </div>
              <Progress value={simulationProgress} className="h-2" />
            </div>
          )}
          
          {overallStats && !isSimulating && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {overallStats.detectionRate}%
                </div>
                <div className="text-xs text-muted-foreground">Detektionsgrad</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {overallStats.avgLeadTime} mån
                </div>
                <div className="text-xs text-muted-foreground">Snitt förvarning</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {overallStats.avgScore}/100
                </div>
                <div className="text-xs text-muted-foreground">Prestandapoäng</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event List */}
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="events">Händelser</TabsTrigger>
          <TabsTrigger value="timeline">Tidslinje</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events" className="space-y-3 mt-4">
          {HISTORICAL_EVENTS.map((event) => {
            const result = simulationResults.find(r => r.event.id === event.id);
            const CategoryIcon = CATEGORY_ICONS[event.category];
            
            return (
              <Card
                key={event.id}
                className={`cursor-pointer transition-all hover:border-primary ${
                  selectedEvent?.id === event.id ? 'border-primary ring-1 ring-primary' : ''
                }`}
                onClick={() => runEventSimulation(event)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${SEVERITY_COLORS[event.severity]}`}>
                        <CategoryIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm">{event.name}</h3>
                          <Badge variant="outline" className="text-[10px]">
                            {new Date(event.date).getFullYear()}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {event.description}
                        </p>
                        
                        {result && (
                          <div className="flex items-center gap-3 mt-2">
                            {result.wouldHaveDetected ? (
                              <div className="flex items-center gap-1 text-status-positive">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">Hade varnat</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-status-critical">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">Hade missat</span>
                              </div>
                            )}
                            {result.leadTimeMonths > 0 && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="text-xs">{result.leadTimeMonths} mån före</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {result && (
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          result.detectionScore > 70 ? 'text-status-positive' :
                          result.detectionScore > 40 ? 'text-status-warning' :
                          'text-status-critical'
                        }`}>
                          {result.detectionScore}
                        </div>
                        <div className="text-[10px] text-muted-foreground">poäng</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Lead Indicators */}
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs text-muted-foreground mb-2">Ledande indikatorer:</div>
                    <div className="flex flex-wrap gap-1">
                      {event.leadIndicators.map((ind) => (
                        <Badge
                          key={ind.kpiId}
                          variant="secondary"
                          className="text-[10px]"
                        >
                          {ind.kpiName}
                          {ind.leadTimeMonths > 0 && (
                            <span className="ml-1 text-status-positive">
                              +{ind.leadTimeMonths}m
                            </span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                
                {/* Events on timeline */}
                <div className="space-y-6">
                  {[...HISTORICAL_EVENTS]
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((event) => {
                      const result = simulationResults.find(r => r.event.id === event.id);
                      const CategoryIcon = CATEGORY_ICONS[event.category];
                      
                      return (
                        <div key={event.id} className="relative pl-10">
                          {/* Timeline dot */}
                          <div className={`absolute left-2 w-5 h-5 rounded-full flex items-center justify-center ${
                            result?.wouldHaveDetected 
                              ? 'bg-green-100 border-2 border-green-500'
                              : 'bg-red-100 border-2 border-red-500'
                          }`}>
                            <CategoryIcon className="w-2.5 h-2.5" />
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-muted-foreground">
                                {new Date(event.date).toLocaleDateString('sv-SE', {
                                  year: 'numeric',
                                  month: 'short',
                                })}
                              </span>
                              <Badge className={SEVERITY_COLORS[event.severity]} variant="default">
                                {event.severity}
                              </Badge>
                            </div>
                            <h4 className="font-medium text-sm mt-1">{event.name}</h4>
                            
                            {result && (
                              <div className="flex items-center gap-2 mt-1">
                                {result.warningsIssued.length > 0 && (
                                  <span className="text-xs text-status-positive">
                                    {result.warningsIssued.length} varning(ar) utfärdade
                                  </span>
                                )}
                                {result.leadTimeMonths > 0 && (
                                  <span className="text-xs text-muted-foreground">
                                    • {result.leadTimeMonths} månaders förvarning
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Selected Event Detail */}
      {selectedEvent && currentDataPoints.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">
                Simulering: {selectedEvent.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedEvent(null);
                  setCurrentDataPoints([]);
                }}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Data visualization */}
              <div className="h-32 bg-muted/50 rounded-lg p-3 relative overflow-hidden">
                <div className="absolute inset-0 flex items-end px-1">
                  {currentDataPoints.slice(-40).map((point, idx) => {
                    const maxVal = Math.max(...currentDataPoints.map(p => Math.abs(p.value)));
                    const height = (Math.abs(point.value) / maxVal) * 100;
                    
                    return (
                      <div
                        key={`${point.date}-${idx}`}
                        className="flex-1 mx-px transition-all duration-150"
                        style={{
                          height: `${height}%`,
                          backgroundColor: 
                            point.status === 'critical' ? 'hsl(var(--status-critical))' :
                            point.status === 'warning' ? 'hsl(var(--status-warning))' :
                            'hsl(var(--primary))',
                        }}
                      />
                    );
                  })}
                </div>
                
                {/* Threshold line */}
                <div 
                  className="absolute left-0 right-0 border-t-2 border-dashed border-status-warning"
                  style={{ top: '30%' }}
                />
              </div>
              
              {/* Latest readings */}
              <div className="grid grid-cols-2 gap-3">
                {selectedEvent.leadIndicators.map((indicator) => {
                  const latestPoint = currentDataPoints
                    .filter(p => p.kpiId === indicator.kpiId)
                    .slice(-1)[0];
                  
                  if (!latestPoint) return null;
                  
                  return (
                    <div
                      key={indicator.kpiId}
                      className={`p-3 rounded-lg border ${
                        latestPoint.status === 'critical' ? 'border-status-critical bg-status-critical/5' :
                        latestPoint.status === 'warning' ? 'border-status-warning bg-status-warning/5' :
                        'border-border bg-card'
                      }`}
                    >
                      <div className="text-xs text-muted-foreground">{indicator.kpiName}</div>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-lg font-bold">{latestPoint.value}</span>
                        <span className="text-xs text-muted-foreground">{indicator.unit}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        Normal: {indicator.normalValue} | Varning: {indicator.warningValue}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Outcome */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-xs font-medium mb-1">Verkligt utfall:</div>
                <p className="text-xs text-muted-foreground">{selectedEvent.actualOutcome}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default HistoricalBacktest;
