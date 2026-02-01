import { useState, useEffect } from 'react';
import { Eye, Filter, AlertTriangle, TrendingDown, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ObservationCard } from './ObservationCard';
import { AnalysisDrillDown } from './AnalysisDrillDown';
import { Observation } from '@/types/observation';
import { supabase } from '@/integrations/supabase/client';

// Mock observations för demonstration
const MOCK_OBSERVATIONS: Observation[] = [
  {
    id: 'obs-1',
    observation_type: 'trend_deviation',
    title: 'Sysselsättningsgrad avviker från trend',
    description: 'Indikatorn har försämrats kontinuerligt i 7 veckor. Förändringen sammanfaller tidsmässigt med konjunkturavmattning och säsongsvariation.',
    kpi_id: '9a6ef79a-a719-4133-be03-76bdc4bccf0a',
    kpi_name: 'Sysselsättningsgrad (netto)',
    signal_strength: 78,
    confidence_level: 85,
    observation_period_start: '2025-11-01',
    observation_period_end: '2025-12-31',
    detected_at: '2026-01-15T10:30:00Z',
    status: 'completed',
    analysis_version: '2.1',
    model_version: '1.0.3',
    created_at: '2026-01-15T10:30:00Z',
  },
  {
    id: 'obs-2',
    observation_type: 'lag_signal',
    title: 'Tidsfördröjd signal från ungdomsutanförskap',
    description: 'Mönstret sammanfaller med historiska data från perioden 2015-2018. Korrelation observerad med 18-24 månaders fördröjning till brottslighet.',
    kpi_id: 'ebe5e4a7-f507-4f72-9c1e-517582e50af1',
    kpi_name: 'Unga Män Utanför System',
    signal_strength: 65,
    confidence_level: 72,
    observation_period_start: '2024-06-01',
    observation_period_end: '2025-12-31',
    detected_at: '2026-01-10T08:15:00Z',
    status: 'completed',
    analysis_version: '2.1',
    model_version: '1.0.3',
    created_at: '2026-01-10T08:15:00Z',
  },
  {
    id: 'obs-3',
    observation_type: 'threshold_breach',
    title: 'Vårdkö passerar kritiskt tröskelvärde',
    description: 'Medianväntetiden har passerat 90 dagar för första gången sedan 2021. Inga registrerade förändringar eller beslut har kopplats till indikatorn under perioden.',
    kpi_id: '47a0800c-a5eb-42dc-9790-2d7d5d581dbf',
    kpi_name: 'Vårdkö (funktionell)',
    signal_strength: 92,
    confidence_level: 95,
    observation_period_start: '2025-10-01',
    observation_period_end: '2025-12-31',
    detected_at: '2026-01-05T14:00:00Z',
    status: 'verified',
    acknowledged_at: '2026-01-06T09:00:00Z',
    acknowledged_by: 'Systemadministratör',
    analysis_version: '2.1',
    model_version: '1.0.3',
    created_at: '2026-01-05T14:00:00Z',
  },
  {
    id: 'obs-4',
    observation_type: 'correlation_detected',
    title: 'Korrelation mellan energipris och produktivitet',
    description: 'Korrelation observerad, kausalitet ej fastställd. Energiprisvolatilitet samvarierar med produktivitetsmått under Q4 2025.',
    kpi_id: 'c063a645-b198-4f9b-9f70-bbebe736dff4',
    kpi_name: 'Energibalans & Prisvolatilitet',
    signal_strength: 58,
    confidence_level: 68,
    observation_period_start: '2025-09-01',
    observation_period_end: '2025-12-31',
    detected_at: '2025-12-20T11:45:00Z',
    status: 'completed',
    analysis_version: '2.1',
    model_version: '1.0.3',
    created_at: '2025-12-20T11:45:00Z',
  },
  {
    id: 'obs-5',
    observation_type: 'anomaly',
    title: 'Statistisk anomali i regional divergens',
    description: 'Data indikerar ovanligt snabb ökning av regional ojämlikhet. Avvikelsen är 2.4 standardavvikelser från historiskt medelvärde.',
    kpi_id: 'b6b13cba-542d-47c6-a85a-ea56c91d1c39',
    kpi_name: 'Regional Divergens-Index',
    signal_strength: 71,
    confidence_level: 88,
    observation_period_start: '2025-07-01',
    observation_period_end: '2025-12-31',
    detected_at: '2025-12-15T16:30:00Z',
    status: 'pending',
    analysis_version: '2.1',
    model_version: '1.0.3',
    created_at: '2025-12-15T16:30:00Z',
  },
];

export function ObservationsPanel() {
  const [observations, setObservations] = useState<Observation[]>(MOCK_OBSERVATIONS);
  const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'critical'>('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Filtrera observationer baserat på flik
  const filteredObservations = observations.filter(obs => {
    if (activeTab === 'pending') return obs.status === 'pending';
    if (activeTab === 'critical') return obs.signal_strength >= 80;
    return true;
  });
  
  const handleShowAnalysis = (observationId: string) => {
    const obs = observations.find(o => o.id === observationId);
    if (obs) {
      setSelectedObservation(obs);
    }
  };
  
  const pendingCount = observations.filter(o => o.status === 'pending').length;
  const criticalCount = observations.filter(o => o.signal_strength >= 80).length;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Eye className="h-6 w-6 text-primary" />
              Iakttagelser
            </h2>
            <p className="text-muted-foreground mt-1">
              Systematiserade observationer med fullständig spårbarhet
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {pendingCount} väntande
            </Badge>
            <Badge variant="destructive" className="gap-1">
              <Activity className="h-3 w-3" />
              {criticalCount} kritiska
            </Badge>
          </div>
        </div>
        
        {/* Principen */}
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Grundregel (icke-förhandlingsbar)</p>
                <p className="text-sm text-muted-foreground">
                  Inget påstående i systemet får existera utan en klickbar, fullständig spårkedja 
                  tillbaka till rå datapunkt. Detta är inte AI-rekommendationer — detta är 
                  systematiserade iakttagelser.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              Alla
              <Badge variant="secondary" className="ml-1">{observations.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              Väntande
              <Badge variant="secondary" className="ml-1">{pendingCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="critical" className="gap-2">
              Kritiska signaler
              <Badge variant="destructive" className="ml-1">{criticalCount}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {filteredObservations.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Inga iakttagelser i denna kategori.</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredObservations.map(obs => (
                    <ObservationCard
                      key={obs.id}
                      observation={obs}
                      onShowAnalysis={handleShowAnalysis}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        {/* Disclaimer */}
        <div className="text-xs text-muted-foreground text-center pt-4 border-t">
          Systemet använder endast observationsspråk. Beslut är alltid människans.
        </div>
      </div>
      
      {/* Drill-down modal */}
      {selectedObservation && (
        <AnalysisDrillDown
          observation={selectedObservation}
          onClose={() => setSelectedObservation(null)}
        />
      )}
    </>
  );
}
