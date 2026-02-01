import { useState } from 'react';
import { FileCheck, Calendar, Search, ChevronRight, Building2, Target, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

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

// Mock data för demonstration
const MOCK_DECISIONS: PolicyDecision[] = [
  {
    id: '1',
    title: 'Reformpaket för arbetsmarknaden 2025',
    description: 'Omfattande reform av arbetsmarknadspolitiken med fokus på snabbare matchning och ökad rörlighet.',
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
    description: 'Lagstadgad garanti för vård inom 30 dagar för prioriterade diagnoser.',
    decision_date: '2024-11-20',
    status: 'active',
    expected_effect: 'Reducera medianväntetid med 30%',
    measured_effect: 'Ännu ej mätbart',
    effectiveness_score: null,
    target_kpis: ['47a0800c-a5eb-42dc-9790-2d7d5d581dbf'],
  },
  {
    id: '3',
    title: 'Nationell strategi mot gängkriminalitet',
    description: 'Intensifierad brottsbekämpning och förebyggande insatser.',
    decision_date: '2024-09-01',
    status: 'active',
    expected_effect: 'Minska grova våldsbrott med 10% på 2 år',
    measured_effect: 'Ingen mätbar förändring ännu',
    effectiveness_score: 35,
    target_kpis: ['5987e149-c730-4e07-9c66-61533eeaacd7', 'ebe5e4a7-f507-4f72-9c1e-517582e50af1'],
  },
  {
    id: '4',
    title: 'Skattereform för ökad tillväxt',
    description: 'Sänkt skatt på arbete och höjd skatt på konsumtion.',
    decision_date: '2024-06-15',
    status: 'completed',
    expected_effect: 'Öka skattebasen med 1% årligen',
    measured_effect: 'Skattebasen ökade med 0.3% under H2 2024',
    effectiveness_score: 55,
    target_kpis: ['fd9918a5-ae65-4375-98dd-a3cab51390dc'],
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
    responsible_entity: 'SKR',
    responsible_level: 'regional',
    affected_kpi_ids: ['47a0800c-a5eb-42dc-9790-2d7d5d581dbf'],
    decision_id: '2',
  },
  {
    id: 't3',
    event_title: 'Mätpunkt: Sysselsättning Q4',
    event_description: 'Kvartalsdata visar fortsatt nedgång i sysselsättningsgrad.',
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
    event_description: 'Årlig rapport visar oförändrad nivå av gängrelaterat våld.',
    event_date: '2025-01-20',
    event_type: 'report',
    responsible_entity: 'BRÅ',
    responsible_level: 'national',
    affected_kpi_ids: ['5987e149-c730-4e07-9c66-61533eeaacd7'],
    decision_id: '3',
  },
];

export function DecisionsTimelinePanel() {
  const [decisions] = useState<PolicyDecision[]>(MOCK_DECISIONS);
  const [timeline] = useState<TimelineEvent[]>(MOCK_TIMELINE);
  const [search, setSearch] = useState('');
  const [selectedDecision, setSelectedDecision] = useState<PolicyDecision | null>(null);
  const [view, setView] = useState<'decisions' | 'timeline'>('decisions');

  const filteredDecisions = decisions.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.description?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-amber-500" />;
    }
  };

  const getEventTypeColor = (type: string | null) => {
    switch (type) {
      case 'decision': return 'bg-primary';
      case 'implementation': return 'bg-emerald-500';
      case 'measurement': return 'bg-blue-500';
      case 'report': return 'bg-purple-500';
      default: return 'bg-muted';
    }
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
        
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'decisions' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('decisions')}
          >
            Beslut
          </Button>
          <Button
            variant={view === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('timeline')}
          >
            Tidslinje
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Sök beslut..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {view === 'decisions' ? (
        /* Decisions List */
        <div className="space-y-4">
          {filteredDecisions.map((decision) => (
            <Card 
              key={decision.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedDecision(decision)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(decision.status)}
                      <h3 className="font-semibold">{decision.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
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
                      {decision.effectiveness_score !== null && (
                        <Badge 
                          variant={decision.effectiveness_score >= 50 ? 'default' : 'secondary'}
                          className="gap-1"
                        >
                          Effektivitet: {decision.effectiveness_score}%
                        </Badge>
                      )}
                    </div>
                    
                    {decision.expected_effect && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Förväntat utfall: </span>
                        <span>{decision.expected_effect}</span>
                      </div>
                    )}
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Timeline View */
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
              
              <div className="space-y-6">
                {timeline.map((event, index) => (
                  <div key={event.id} className="relative pl-10">
                    {/* Timeline dot */}
                    <div className={cn(
                      "absolute left-2.5 w-3 h-3 rounded-full border-2 border-background",
                      getEventTypeColor(event.event_type)
                    )} />
                    
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {format(new Date(event.event_date), 'd MMM yyyy', { locale: sv })}
                        </Badge>
                        {event.responsible_entity && (
                          <Badge variant="secondary" className="gap-1">
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
                  <Badge variant="outline">{selectedDecision.status}</Badge>
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
                          selectedDecision.effectiveness_score >= 70 ? 'bg-emerald-500' :
                          selectedDecision.effectiveness_score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                        )}
                        style={{ width: `${selectedDecision.effectiveness_score}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm">{selectedDecision.effectiveness_score}%</span>
                  </div>
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
