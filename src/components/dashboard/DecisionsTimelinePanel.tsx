import { useState, useMemo } from 'react';
import { FileCheck, Calendar, Search, ChevronRight, Building2, Target, CheckCircle2, XCircle, Clock, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { format, differenceInDays, parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PolicyDecision {
  id: string;
  title: string;
  description: string | null;
  decision_date: string;
  status: string;
  expected_effect: string | null;
  measured_effect: string | null;
  effectiveness_score: number | null;
  target_kpis: string[];
}

interface TimelineEvent {
  id: string;
  event_title: string;
  event_description: string | null;
  event_date: string;
  event_type: string | null;
  responsible_entity: string | null;
  responsible_level: string | null;
  affected_kpi_ids: string[];
  decision_id: string | null;
}

// Enhanced mock data
const MOCK_DECISIONS: PolicyDecision[] = [
  {
    id: '1',
    title: 'Reformpaket för arbetsmarknaden 2025',
    description: 'Omfattande reform av arbetsmarknadspolitiken med fokus på snabbare matchning och ökad rörlighet. Inkluderar förenklad anställningsskydd och nya incitament för arbetsgivare.',
    decision_date: '2024-12-15',
    status: 'active',
    expected_effect: 'Minska arbetslösheten med 0.5 procentenheter inom 12 månader',
    measured_effect: null,
    effectiveness_score: null,
    target_kpis: ['9a6ef79a-a719-4133-be03-76bdc4bccf0a', 'f6718a4b-5f81-4f7d-8b81-c9382d167cf3'],
  },
  {
    id: '2',
    title: 'Förstärkt vårdgaranti',
    description: 'Lagstadgad garanti för vård inom 30 dagar för prioriterade diagnoser. Regioner får riktade statsbidrag för kapacitetsutbyggnad.',
    decision_date: '2024-11-20',
    status: 'active',
    expected_effect: 'Reducera medianväntetid med 30%',
    measured_effect: 'Ännu ej mätbart (implementeringsfas)',
    effectiveness_score: null,
    target_kpis: ['47a0800c-a5eb-42dc-9790-2d7d5d581dbf'],
  },
  {
    id: '3',
    title: 'Nationell strategi mot gängkriminalitet',
    description: 'Intensifierad brottsbekämpning och förebyggande insatser. Utökade polisbefogenheter, visitationszoner och satsning på avhopparprogram.',
    decision_date: '2024-09-01',
    status: 'active',
    expected_effect: 'Minska grova våldsbrott med 10% på 2 år',
    measured_effect: 'Ingen statistiskt signifikant förändring ännu',
    effectiveness_score: 35,
    target_kpis: ['5987e149-c730-4e07-9c66-61533eeaacd7', 'ebe5e4a7-f507-4f72-9c1e-517582e50af1'],
  },
  {
    id: '4',
    title: 'Skattereform för ökad tillväxt',
    description: 'Sänkt skatt på arbete och höjd skatt på konsumtion för att främja arbetsutbud och tillväxt.',
    decision_date: '2024-06-15',
    status: 'completed',
    expected_effect: 'Öka skattebasen med 1% årligen',
    measured_effect: 'Skattebasen ökade med 0.3% under H2 2024',
    effectiveness_score: 55,
    target_kpis: ['fd9918a5-ae65-4375-98dd-a3cab51390dc'],
  },
  {
    id: '5',
    title: 'Bostadsbyggnadspaketet',
    description: 'Regelförenklingar och statliga garantier för att öka bostadsbyggandet med 20 000 enheter per år.',
    decision_date: '2024-03-01',
    status: 'active',
    expected_effect: 'Öka bostadsbyggandet till 60 000 per år',
    measured_effect: 'Byggstarter ökade med 12% i Q3-Q4',
    effectiveness_score: 62,
    target_kpis: ['b6b35c35-c639-44b1-8355-52755b5446ef'],
  },
  {
    id: '6',
    title: 'Integrationsprogram 2024',
    description: 'Förstärkt språkutbildning och arbetsmarknadsinsatser för nyanlända.',
    decision_date: '2024-01-15',
    status: 'completed',
    expected_effect: 'Förbättra sysselsättningsgraden bland nyanlända med 15%',
    measured_effect: 'Sysselsättningsgraden ökade med 8% för målgruppen',
    effectiveness_score: 53,
    target_kpis: ['9a6ef79a-a719-4133-be03-76bdc4bccf0a', 'f6718a4b-5f81-4f7d-8b81-c9382d167cf3'],
  },
];

const MOCK_TIMELINE: TimelineEvent[] = [
  {
    id: 't1',
    event_title: 'Riksdagsbeslut: Reformpaket för arbetsmarknaden',
    event_description: 'Riksdagen röstade igenom reformpaketet med 184-165.',
    event_date: '2024-12-15',
    event_type: 'decision',
    responsible_entity: 'Riksdagen',
    responsible_level: 'national',
    affected_kpi_ids: ['9a6ef79a-a719-4133-be03-76bdc4bccf0a'],
    decision_id: '1',
  },
  {
    id: 't2',
    event_title: 'Implementeringsstart: Vårdgaranti',
    event_description: 'Regionerna påbörjar implementering av den nya vårdgarantin.',
    event_date: '2025-01-01',
    event_type: 'implementation',
    responsible_entity: 'SKR / Regionerna',
    responsible_level: 'regional',
    affected_kpi_ids: ['47a0800c-a5eb-42dc-9790-2d7d5d581dbf'],
    decision_id: '2',
  },
  {
    id: 't3',
    event_title: 'Mätpunkt: Sysselsättning Q4',
    event_description: 'Kvartalsdata visar fortsatt svag utveckling i sysselsättningsgrad.',
    event_date: '2025-01-15',
    event_type: 'measurement',
    responsible_entity: 'SCB',
    responsible_level: 'national',
    affected_kpi_ids: ['9a6ef79a-a719-4133-be03-76bdc4bccf0a'],
    decision_id: null,
  },
  {
    id: 't4',
    event_title: 'BRÅ-rapport: Gängkriminalitet 2024',
    event_description: 'Årlig rapport visar oförändrad nivå av gängrelaterat våld trots insatser.',
    event_date: '2025-01-20',
    event_type: 'report',
    responsible_entity: 'BRÅ',
    responsible_level: 'national',
    affected_kpi_ids: ['5987e149-c730-4e07-9c66-61533eeaacd7'],
    decision_id: '3',
  },
  {
    id: 't5',
    event_title: 'Halvtidsutvärdering: Bostadspaket',
    event_description: 'Boverket rapporterar positiva tidiga signaler för bostadsbyggandet.',
    event_date: '2024-10-01',
    event_type: 'evaluation',
    responsible_entity: 'Boverket',
    responsible_level: 'national',
    affected_kpi_ids: ['b6b35c35-c639-44b1-8355-52755b5446ef'],
    decision_id: '5',
  },
  {
    id: 't6',
    event_title: 'Ny lagstiftning: Visitationszoner',
    event_description: 'Lag om visitationszoner träder i kraft i utvalda områden.',
    event_date: '2024-11-01',
    event_type: 'legislation',
    responsible_entity: 'Justitiedepartementet',
    responsible_level: 'national',
    affected_kpi_ids: ['5987e149-c730-4e07-9c66-61533eeaacd7'],
    decision_id: '3',
  },
];

export function DecisionsTimelinePanel() {
  const [search, setSearch] = useState('');
  const [selectedDecision, setSelectedDecision] = useState<PolicyDecision | null>(null);
  const [view, setView] = useState<'decisions' | 'timeline' | 'effectiveness'>('decisions');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Try to fetch from database
  const { data: dbDecisions } = useQuery({
    queryKey: ['policy_decisions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policy_decisions')
        .select('*')
        .order('decision_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: dbTimeline } = useQuery({
    queryKey: ['decision_timeline'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('decision_timeline')
        .select('*')
        .order('event_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Use database data if available, otherwise mock
  const decisions = useMemo(() => {
    if (dbDecisions && dbDecisions.length > 0) {
      return dbDecisions.map(d => ({
        ...d,
        target_kpis: d.target_kpis || [],
      })) as PolicyDecision[];
    }
    return MOCK_DECISIONS;
  }, [dbDecisions]);

  const timeline = useMemo(() => {
    if (dbTimeline && dbTimeline.length > 0) {
      return dbTimeline.map(t => ({
        ...t,
        affected_kpi_ids: t.affected_kpi_ids || [],
      })) as TimelineEvent[];
    }
    return MOCK_TIMELINE;
  }, [dbTimeline]);

  const filteredDecisions = useMemo(() => {
    let result = [...decisions];
    
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(d =>
        d.title.toLowerCase().includes(searchLower) ||
        d.description?.toLowerCase().includes(searchLower)
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(d => d.status === statusFilter);
    }
    
    return result;
  }, [decisions, search, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const active = decisions.filter(d => d.status === 'active').length;
    const completed = decisions.filter(d => d.status === 'completed').length;
    const withScore = decisions.filter(d => d.effectiveness_score !== null);
    const avgEffectiveness = withScore.length > 0
      ? Math.round(withScore.reduce((acc, d) => acc + (d.effectiveness_score || 0), 0) / withScore.length)
      : null;
    
    return { active, completed, total: decisions.length, avgEffectiveness };
  }, [decisions]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  const getEventTypeColor = (type: string | null) => {
    switch (type) {
      case 'decision': return 'bg-primary';
      case 'implementation': return 'bg-emerald-500';
      case 'measurement': return 'bg-blue-500';
      case 'report': return 'bg-purple-500';
      case 'evaluation': return 'bg-amber-500';
      case 'legislation': return 'bg-indigo-500';
      default: return 'bg-muted';
    }
  };

  const getEventTypeLabel = (type: string | null) => {
    switch (type) {
      case 'decision': return 'Beslut';
      case 'implementation': return 'Implementering';
      case 'measurement': return 'Mätpunkt';
      case 'report': return 'Rapport';
      case 'evaluation': return 'Utvärdering';
      case 'legislation': return 'Lagstiftning';
      default: return 'Händelse';
    }
  };

  const getDaysSince = (dateStr: string) => {
    return differenceInDays(new Date(), parseISO(dateStr));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-primary" />
            Beslut & Tidslinje
          </h2>
          <p className="text-muted-foreground mt-1">
            Policybeslut kopplade till KPI-förändringar över tid
          </p>
        </div>
        
        <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
          <TabsList>
            <TabsTrigger value="decisions">Beslut</TabsTrigger>
            <TabsTrigger value="timeline">Tidslinje</TabsTrigger>
            <TabsTrigger value="effectiveness">Effektivitet</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aktiva beslut</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Genomförda</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Händelser</p>
                <p className="text-2xl font-bold">{timeline.length}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Snitt effektivitet</p>
                <p className="text-2xl font-bold">
                  {stats.avgEffectiveness !== null ? `${stats.avgEffectiveness}%` : '–'}
                </p>
              </div>
              <div className="p-2 rounded-full bg-primary/10">
                <BarChart2 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sök beslut..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Alla status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla status</SelectItem>
            <SelectItem value="active">Aktiva</SelectItem>
            <SelectItem value="completed">Genomförda</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {view === 'decisions' && (
        /* Decisions List */
        <div className="space-y-4">
          {filteredDecisions.map((decision) => (
            <Card 
              key={decision.id}
              className={cn(
                "cursor-pointer hover:shadow-md transition-all",
                decision.effectiveness_score !== null && decision.effectiveness_score < 40 && "border-amber-200 dark:border-amber-800"
              )}
              onClick={() => setSelectedDecision(decision)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(decision.status)}
                      <h3 className="font-semibold">{decision.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {decision.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(decision.decision_date), 'd MMMM yyyy', { locale: sv })}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Target className="h-3 w-3" />
                        {decision.target_kpis.length} KPI:er
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {getDaysSince(decision.decision_date)} dagar sedan
                      </Badge>
                      {decision.effectiveness_score !== null && (
                        <Badge 
                          variant={decision.effectiveness_score >= 50 ? 'default' : 'secondary'}
                          className={cn(
                            "gap-1",
                            decision.effectiveness_score >= 60 && "bg-emerald-500",
                            decision.effectiveness_score >= 40 && decision.effectiveness_score < 60 && "bg-amber-500",
                            decision.effectiveness_score < 40 && "bg-red-500"
                          )}
                        >
                          {decision.effectiveness_score}% effektivitet
                        </Badge>
                      )}
                    </div>
                    
                    {decision.expected_effect && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Mål: </span>
                        <span>{decision.expected_effect}</span>
                      </div>
                    )}
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredDecisions.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Inga beslut matchar din sökning
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {view === 'timeline' && (
        /* Timeline View */
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
              
              <div className="space-y-6">
                {timeline.map((event) => (
                  <div key={event.id} className="relative pl-10">
                    {/* Timeline dot */}
                    <div className={cn(
                      "absolute left-2.5 w-3 h-3 rounded-full border-2 border-background",
                      getEventTypeColor(event.event_type)
                    )} />
                    
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {format(new Date(event.event_date), 'd MMM yyyy', { locale: sv })}
                          </Badge>
                          <Badge 
                            variant="secondary" 
                            className={cn("text-xs", getEventTypeColor(event.event_type), "text-white")}
                          >
                            {getEventTypeLabel(event.event_type)}
                          </Badge>
                        </div>
                        {event.responsible_entity && (
                          <Badge variant="outline" className="gap-1">
                            <Building2 className="h-3 w-3" />
                            {event.responsible_entity}
                          </Badge>
                        )}
                      </div>
                      
                      <h4 className="font-medium mb-1">{event.event_title}</h4>
                      {event.event_description && (
                        <p className="text-sm text-muted-foreground">
                          {event.event_description}
                        </p>
                      )}
                      
                      {event.affected_kpi_ids.length > 0 && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <Target className="h-3 w-3" />
                          Påverkar {event.affected_kpi_ids.length} KPI:er
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {view === 'effectiveness' && (
        /* Effectiveness View */
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Effektivitetsöversikt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Beslut med mätbar effekt sorterade efter effektivitetspoäng
              </p>
              <div className="space-y-4">
                {decisions
                  .filter(d => d.effectiveness_score !== null)
                  .sort((a, b) => (b.effectiveness_score || 0) - (a.effectiveness_score || 0))
                  .map((decision) => (
                    <div 
                      key={decision.id} 
                      className="p-4 rounded-lg border cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedDecision(decision)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{decision.title}</h4>
                        <Badge 
                          variant="outline"
                          className={cn(
                            (decision.effectiveness_score || 0) >= 60 && "text-emerald-600 border-emerald-300",
                            (decision.effectiveness_score || 0) >= 40 && (decision.effectiveness_score || 0) < 60 && "text-amber-600 border-amber-300",
                            (decision.effectiveness_score || 0) < 40 && "text-red-600 border-red-300"
                          )}
                        >
                          {decision.effectiveness_score}%
                        </Badge>
                      </div>
                      <Progress 
                        value={decision.effectiveness_score || 0} 
                        className={cn(
                          "h-2",
                          (decision.effectiveness_score || 0) >= 60 && "[&>div]:bg-emerald-500",
                          (decision.effectiveness_score || 0) >= 40 && (decision.effectiveness_score || 0) < 60 && "[&>div]:bg-amber-500",
                          (decision.effectiveness_score || 0) < 40 && "[&>div]:bg-red-500"
                        )}
                      />
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span>Förväntat: {decision.expected_effect}</span>
                        {decision.measured_effect && (
                          <span>Uppmätt: {decision.measured_effect}</span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Decisions without score yet */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Väntar på mätning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {decisions
                  .filter(d => d.effectiveness_score === null)
                  .map((decision) => (
                    <div 
                      key={decision.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium text-sm">{decision.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {getDaysSince(decision.decision_date)} dagar sedan beslut
                        </p>
                      </div>
                      <Badge variant="outline">
                        {decision.status === 'active' ? 'Implementering pågår' : decision.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detail Dialog */}
      {selectedDecision && (
        <Dialog open={!!selectedDecision} onOpenChange={() => setSelectedDecision(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getStatusIcon(selectedDecision.status)}
                {selectedDecision.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Beskrivning</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedDecision.description || 'Ingen beskrivning tillgänglig.'}
                </p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Beslutsdatum</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedDecision.decision_date), 'd MMMM yyyy', { locale: sv })}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Status</h4>
                  <Badge variant="outline" className="capitalize">
                    {selectedDecision.status === 'active' ? 'Aktiv' : 
                     selectedDecision.status === 'completed' ? 'Genomförd' : selectedDecision.status}
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Förväntat utfall</h4>
                <p className="text-sm bg-muted/50 p-3 rounded-lg">
                  {selectedDecision.expected_effect || 'Ej definierat'}
                </p>
              </div>
              
              {selectedDecision.measured_effect && (
                <div>
                  <h4 className="font-medium mb-2">Uppmätt effekt</h4>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg">
                    {selectedDecision.measured_effect}
                  </p>
                </div>
              )}
              
              {selectedDecision.effectiveness_score !== null && (
                <div>
                  <h4 className="font-medium mb-2">Effektivitetspoäng</h4>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all",
                          selectedDecision.effectiveness_score >= 60 ? 'bg-emerald-500' :
                          selectedDecision.effectiveness_score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                        )}
                        style={{ width: `${selectedDecision.effectiveness_score}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm">{selectedDecision.effectiveness_score}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {selectedDecision.effectiveness_score >= 60 ? 'God måluppfyllelse' :
                     selectedDecision.effectiveness_score >= 40 ? 'Delvis måluppfyllelse' : 'Låg måluppfyllelse'}
                  </p>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground pt-4 border-t">
                Berör {selectedDecision.target_kpis.length} nyckeltal. 
                Klicka på respektive KPI för att se dess utveckling före och efter beslutet.
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}