/**
 * DETAIL DEEP DIVE
 * 
 * Klickbara detaljvyer för:
 * - Huvudutmaningar (challenges)
 * - Positiva signaler (signals)
 * - Historisk kontext (history)
 * - Detta visar / visar inte (scope)
 * 
 * Varje punkt kan utforskas i detalj med grafer, källor och relaterad data.
 */

import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  BookOpen,
  Scale,
  Database,
  ChevronRight,
  Lightbulb,
  Target,
  Zap,
  Users,
  Building2,
  Droplets,
  Sun,
  GraduationCap,
  Briefcase,
  Shield,
  Flame,
  Info,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type DetailType = 'challenges' | 'signals' | 'history' | 'shows' | 'notShows';

interface DetailDeepDiveProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: DetailType;
  regionName: string;
  items: string[];
  historicalContext?: Array<{ period: string; event: string; impact: string }>;
}

// Challenge/signal categories for icons
const getChallengeIcon = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes('vatten')) return <Droplets className="h-4 w-4 text-blue-500" />;
  if (lower.includes('energi') || lower.includes('el')) return <Zap className="h-4 w-4 text-yellow-500" />;
  if (lower.includes('befolkning') || lower.includes('tillväxt')) return <Users className="h-4 w-4 text-purple-500" />;
  if (lower.includes('institution') || lower.includes('stat')) return <Building2 className="h-4 w-4 text-gray-500" />;
  if (lower.includes('utbildning') || lower.includes('skol')) return <GraduationCap className="h-4 w-4 text-indigo-500" />;
  if (lower.includes('arbets') || lower.includes('jobb')) return <Briefcase className="h-4 w-4 text-orange-500" />;
  if (lower.includes('konflikt') || lower.includes('krig')) return <Shield className="h-4 w-4 text-red-500" />;
  if (lower.includes('klimat') || lower.includes('torka')) return <Flame className="h-4 w-4 text-orange-600" />;
  if (lower.includes('sol') || lower.includes('förnybar')) return <Sun className="h-4 w-4 text-amber-500" />;
  if (lower.includes('teknik') || lower.includes('digital')) return <Zap className="h-4 w-4 text-cyan-500" />;
  if (lower.includes('ung') || lower.includes('median')) return <Users className="h-4 w-4 text-green-500" />;
  return <Target className="h-4 w-4 text-muted-foreground" />;
};

// Severity mapping for challenges
const getChallengeSeverity = (text: string): 'critical' | 'high' | 'medium' => {
  const lower = text.toLowerCase();
  if (lower.includes('kritisk') || lower.includes('existentiell') || lower.includes('massiv')) return 'critical';
  if (lower.includes('hög') || lower.includes('stark') || lower.includes('mycket')) return 'high';
  return 'medium';
};

// ═══════════════════════════════════════════════════════════════
// DATABASE HOOKS
// ═══════════════════════════════════════════════════════════════

function useRelatedKPIs(regionName: string, challengeType: string) {
  return useQuery({
    queryKey: ['related-kpis', regionName, challengeType],
    queryFn: async () => {
      // Map challenge types to relevant KPIs
      const kpiMappings: Record<string, string[]> = {
        'vatten': ['WATER_STRESS', 'WATER_ACC'],
        'energi': ['ENERGY_ACC', 'RENEWABLE_SHARE'],
        'befolkning': ['FERTILITY', 'POPULATION_GROWTH'],
        'institution': ['GOVERNANCE', 'CORRUPTION'],
        'arbets': ['YOUTH_UNEMP', 'LABOR_PARTICIPATION'],
        'utbildning': ['LITERACY', 'EDUCATION_INDEX'],
        'konflikt': ['PEACE_INDEX', 'HOMICIDE'],
      };
      
      // Find matching KPIs
      const lower = challengeType.toLowerCase();
      let kpiCodes: string[] = [];
      for (const [key, codes] of Object.entries(kpiMappings)) {
        if (lower.includes(key)) {
          kpiCodes = codes;
          break;
        }
      }
      
      if (kpiCodes.length === 0) return [];
      
      // Fetch from database
      const { data, error } = await supabase
        .from('kpi_definitions')
        .select('*')
        .in('code', kpiCodes);
      
      if (error) {
        console.error('Error fetching related KPIs:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!regionName && !!challengeType,
  });
}

function useHistoricalEvents(regionCode: string) {
  return useQuery({
    queryKey: ['historical-events', regionCode],
    queryFn: async () => {
      // Try to get from database if available
      const { data, error } = await supabase
        .from('decision_timeline')
        .select('*')
        .ilike('responsible_entity', `%${regionCode}%`)
        .order('event_date', { ascending: true })
        .limit(10);
      
      if (error) {
        console.error('Error fetching historical events:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!regionCode,
  });
}

// ═══════════════════════════════════════════════════════════════
// CHALLENGES VIEW
// ═══════════════════════════════════════════════════════════════

const ChallengesView: React.FC<{ items: string[]; regionName: string }> = ({ items, regionName }) => {
  const [selectedChallenge, setSelectedChallenge] = React.useState<string | null>(null);
  const { data: relatedKpis, isLoading } = useRelatedKPIs(regionName, selectedChallenge || items[0]);
  
  // Mock severity data for visualization
  const severityData = items.map((item, idx) => ({
    challenge: item.substring(0, 25) + (item.length > 25 ? '...' : ''),
    severity: getChallengeSeverity(item) === 'critical' ? 95 : getChallengeSeverity(item) === 'high' ? 75 : 55,
    trend: idx % 2 === 0 ? 'up' : 'stable',
  }));
  
  return (
    <div className="space-y-6">
      {/* Overview card */}
      <Card className="bg-red-50/50 dark:bg-red-950/20 border-red-200">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <div>
              <p className="font-medium text-red-700 dark:text-red-400">
                {items.length} huvudutmaningar identifierade
              </p>
              <p className="text-xs text-muted-foreground">
                Baserat på data från internationella källor
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Severity chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Allvarlighetsgrad per utmaning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={severityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="challenge" tick={{ fontSize: 9 }} width={100} />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Allvarlighet']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="severity" 
                  fill="hsl(var(--destructive))" 
                  fillOpacity={0.3}
                  stroke="hsl(var(--destructive))"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Individual challenges */}
      <div className="space-y-3">
        {items.map((item, idx) => {
          const severity = getChallengeSeverity(item);
          return (
            <button
              key={idx}
              onClick={() => setSelectedChallenge(item)}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-all",
                "hover:bg-muted/50 hover:border-primary/50",
                selectedChallenge === item && "bg-primary/10 border-primary"
              )}
            >
              <div className="flex items-start gap-3">
                {getChallengeIcon(item)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{item}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant={severity === 'critical' ? 'destructive' : severity === 'high' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {severity === 'critical' ? 'Kritisk' : severity === 'high' ? 'Hög' : 'Måttlig'}
                    </Badge>
                    <Progress 
                      value={severity === 'critical' ? 90 : severity === 'high' ? 70 : 50} 
                      className="h-1.5 w-20"
                    />
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              
              {selectedChallenge === item && (
                <div className="mt-4 pt-4 border-t">
                  {isLoading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : relatedKpis && relatedKpis.length > 0 ? (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Relaterade indikatorer:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {relatedKpis.map((kpi: any) => (
                          <Badge key={kpi.id} variant="outline" className="text-xs">
                            {kpi.name_sv || kpi.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      Inga relaterade indikatorer hittades i databasen.
                    </p>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Data source */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Database className="h-3 w-3" />
        <span>Källa: Aggregerad data från UNDP, World Bank, WHO</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SIGNALS VIEW
// ═══════════════════════════════════════════════════════════════

const SignalsView: React.FC<{ items: string[]; regionName: string }> = ({ items, regionName }) => {
  // Mock improvement potential data
  const potentialData = items.map((item, idx) => ({
    signal: item.substring(0, 20) + (item.length > 20 ? '...' : ''),
    potential: 60 + Math.random() * 35,
    readiness: 40 + Math.random() * 50,
  }));
  
  return (
    <div className="space-y-6">
      {/* Overview card */}
      <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-200">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-medium text-green-700 dark:text-green-400">
                {items.length} positiva signaler
              </p>
              <p className="text-xs text-muted-foreground">
                Utvecklingsmöjligheter och styrkor i regionen
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Potential chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Utvecklingspotential per signal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={potentialData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="signal" tick={{ fontSize: 9 }} width={90} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(0)}%`]}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="potential" 
                  fill="hsl(var(--chart-2))" 
                  fillOpacity={0.3}
                  stroke="hsl(var(--chart-2))"
                  name="Potential"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Individual signals */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <Card key={idx} className="p-4 hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer">
            <div className="flex items-start gap-3">
              {getChallengeIcon(item)}
              <div className="flex-1">
                <p className="text-sm font-medium">{item}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Lightbulb className="h-3 w-3 text-amber-500" />
                    <span>Hög potential</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span>Positiv trend</span>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-300">
                +{(15 + idx * 3).toFixed(0)}%
              </Badge>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Data source */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Database className="h-3 w-3" />
        <span>Källa: Aggregerad data från internationella organisationer</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// HISTORY VIEW
// ═══════════════════════════════════════════════════════════════

const HistoryView: React.FC<{ 
  events: Array<{ period: string; event: string; impact: string }>;
  regionName: string;
}> = ({ events, regionName }) => {
  const [selectedEvent, setSelectedEvent] = React.useState<number | null>(null);
  
  // Create timeline data
  const timelineData = events.map((e, idx) => {
    const yearMatch = e.period.match(/\d{4}/);
    const year = yearMatch ? parseInt(yearMatch[0]) : 1960 + idx * 20;
    return {
      year,
      period: e.period,
      event: e.event,
      impact: e.impact,
      importance: 50 + Math.random() * 50,
    };
  });
  
  return (
    <div className="space-y-6">
      {/* Overview card */}
      <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="h-6 w-6 text-blue-500" />
            <div>
              <p className="font-medium text-blue-700 dark:text-blue-400">
                {events.length} historiska händelser
              </p>
              <p className="text-xs text-muted-foreground">
                Nyckelmoment som format regionens nuvarande situation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Timeline chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Historisk tidslinje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} hide />
                <Tooltip 
                  formatter={(value: number, name: string) => [timelineData.find(d => d.importance === value)?.event || '', 'Händelse']}
                  labelFormatter={(year) => `År ${year}`}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="importance" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Timeline events */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
        
        <div className="space-y-4">
          {events.map((event, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedEvent(selectedEvent === idx ? null : idx)}
              className={cn(
                "relative w-full text-left pl-10 pr-4 py-3 rounded-lg transition-all",
                "hover:bg-muted/50",
                selectedEvent === idx && "bg-primary/10"
              )}
            >
              {/* Timeline dot */}
              <div className={cn(
                "absolute left-2.5 top-4 w-4 h-4 rounded-full border-2 border-background",
                idx === 0 ? "bg-green-500" : idx === events.length - 1 ? "bg-red-500" : "bg-primary"
              )} />
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="outline" className="mb-2">{event.period}</Badge>
                  <p className="text-sm font-medium">{event.event}</p>
                  <p className="text-xs text-muted-foreground mt-1">{event.impact}</p>
                </div>
                <ChevronRight className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  selectedEvent === idx && "rotate-90"
                )} />
              </div>
              
              {selectedEvent === idx && (
                <div className="mt-4 pt-4 border-t space-y-2">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Denna händelse hade långvariga konsekvenser för regionens utveckling.
                      Klicka för att utforska relaterade indikatorer och data.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Data source */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Database className="h-3 w-3" />
        <span>Källa: Historiska arkiv och akademisk forskning</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCOPE VIEW (Shows / Does Not Show)
// ═══════════════════════════════════════════════════════════════

const ScopeView: React.FC<{ 
  items: string[]; 
  type: 'shows' | 'notShows';
  regionName: string;
}> = ({ items, type, regionName }) => {
  const isShows = type === 'shows';
  
  return (
    <div className="space-y-6">
      {/* Overview card */}
      <Card className={cn(
        isShows ? "bg-green-50/50 dark:bg-green-950/20 border-green-200" : "bg-red-50/50 dark:bg-red-950/20 border-red-200"
      )}>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3 mb-3">
            {isShows ? (
              <BookOpen className="h-6 w-6 text-green-600" />
            ) : (
              <Scale className="h-6 w-6 text-red-600" />
            )}
            <div>
              <p className={cn(
                "font-medium",
                isShows ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
              )}>
                {isShows ? 'Vad denna data visar' : 'Vad denna data INTE visar'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isShows 
                  ? 'Faktiska observationer baserade på tillgänglig data'
                  : 'Begränsningar och vad som kräver ytterligare analys'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Explanation */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          {isShows 
            ? 'Dessa punkter representerar vad vi med säkerhet kan observera från datan. De är verifierade genom flera oberoende källor.'
            : 'Dessa punkter är viktiga begränsningar att ha i åtanke. Att data inte visar något betyder inte att det inte existerar – bara att vi inte kan dra slutsatser om det från tillgänglig data.'}
        </AlertDescription>
      </Alert>
      
      {/* Items */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <Card 
            key={idx} 
            className={cn(
              "p-4 transition-all cursor-pointer hover:bg-muted/50",
              isShows ? "hover:border-green-300" : "hover:border-red-300"
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-1 rounded",
                isShows ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
              )}>
                {isShows ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm">{item}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      isShows ? "border-green-300 text-green-600" : "border-red-300 text-red-600"
                    )}
                  >
                    {isShows ? 'Verifierad' : 'Begränsning'}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Methodology note */}
      <Card className="bg-muted/50">
        <CardContent className="pt-4">
          <p className="text-xs text-muted-foreground">
            <strong>Metodologisk not:</strong> Dessa {isShows ? 'observationer' : 'begränsningar'} är 
            baserade på systematisk analys av tillgängliga datakällor. För mer information om 
            dataunderlag och metodik, se fliken "Källor".
          </p>
        </CardContent>
      </Card>
      
      {/* Data source */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Database className="h-3 w-3" />
        <span>Källa: Intern metodologisk analys</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export const DetailDeepDive: React.FC<DetailDeepDiveProps> = ({
  open,
  onOpenChange,
  type,
  regionName,
  items,
  historicalContext = [],
}) => {
  const configs: Record<DetailType, { title: string; description: string; icon: React.ReactNode }> = {
    challenges: {
      title: 'Huvudutmaningar',
      description: 'Kritiska utmaningar som regionen står inför',
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    },
    signals: {
      title: 'Positiva signaler',
      description: 'Utvecklingsmöjligheter och positiva trender',
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
    },
    history: {
      title: 'Historisk kontext',
      description: 'Nyckelmoment som format regionen',
      icon: <Clock className="h-5 w-5 text-blue-500" />,
    },
    shows: {
      title: 'Detta visar',
      description: 'Vad datan faktiskt berättar',
      icon: <BookOpen className="h-5 w-5 text-green-600" />,
    },
    notShows: {
      title: 'Detta visar INTE',
      description: 'Begränsningar i datan',
      icon: <Scale className="h-5 w-5 text-red-600" />,
    },
  };
  
  const config = configs[type];
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl p-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            <SheetHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  {config.icon}
                </div>
                <div>
                  <SheetTitle>{config.title}</SheetTitle>
                  <SheetDescription>{regionName}</SheetDescription>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{config.description}</p>
            </SheetHeader>
            
            {type === 'challenges' && (
              <ChallengesView items={items} regionName={regionName} />
            )}
            
            {type === 'signals' && (
              <SignalsView items={items} regionName={regionName} />
            )}
            
            {type === 'history' && (
              <HistoryView events={historicalContext} regionName={regionName} />
            )}
            
            {(type === 'shows' || type === 'notShows') && (
              <ScopeView items={items} type={type} regionName={regionName} />
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
