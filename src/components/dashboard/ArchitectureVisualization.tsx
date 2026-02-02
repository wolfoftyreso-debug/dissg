import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Database, 
  Shield, 
  BarChart3, 
  Layers, 
  Globe, 
  ArrowDown,
  Cpu,
  Lock,
  Zap,
  Building2,
  Crown,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

type LayerType = 'sources' | 'ingestion' | 'storage' | 'analysis' | 'presentation' | 'access';

interface LayerConfig {
  id: LayerType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  components: {
    name: string;
    description: string;
    status: 'active' | 'planned' | 'beta';
  }[];
}

const LAYERS: LayerConfig[] = [
  {
    id: 'sources',
    title: 'Datakällor',
    subtitle: 'Externa myndighetsdata',
    icon: <Globe className="h-5 w-5" />,
    color: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400',
    components: [
      { name: 'SCB PxWeb API', description: 'Befolkning, ekonomi, arbetsmarknad', status: 'active' },
      { name: 'Kolada API', description: 'Kommunal nyckeltal', status: 'active' },
      { name: 'Svenska Kraftnät', description: 'Elproduktion, konsumtion', status: 'beta' },
      { name: 'Riksdagen API', description: 'Beslut, motioner, voteringar', status: 'planned' },
    ],
  },
  {
    id: 'ingestion',
    title: 'Datainsamling',
    subtitle: 'Edge Functions',
    icon: <Zap className="h-5 w-5" />,
    color: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
    components: [
      { name: 'scb-fetch', description: 'Schemalagd hämtning från SCB', status: 'active' },
      { name: 'kolada-ingest', description: 'Kommundata-ingest', status: 'active' },
      { name: 'kpi-ingest', description: 'Generisk KPI-pipeline', status: 'active' },
      { name: 'svk-ingest', description: 'Kraftnätsdata', status: 'beta' },
    ],
  },
  {
    id: 'storage',
    title: 'Datalager',
    subtitle: 'PostgreSQL + RLS',
    icon: <Database className="h-5 w-5" />,
    color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
    components: [
      { name: 'kpi_definitions', description: '20 nationella indikatorer', status: 'active' },
      { name: 'kpi_values', description: 'Tidsserierade mätvärden', status: 'active' },
      { name: 'observations', description: 'AI-detekterade mönster', status: 'active' },
      { name: 'data_lineage', description: 'Fullständig spårbarhet', status: 'active' },
    ],
  },
  {
    id: 'analysis',
    title: 'Analysmotor',
    subtitle: 'AI + Statistik',
    icon: <Cpu className="h-5 w-5" />,
    color: 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400',
    components: [
      { name: 'analyze-kpi', description: 'Trendanalys, anomalidetektion', status: 'active' },
      { name: 'kpi-forecast', description: 'Prediktion med konfidensintervall', status: 'active' },
      { name: 'prioritize-actions', description: 'Åtgärdsprioritering', status: 'active' },
      { name: 'Djupanalys', description: '6-nivå orsakskedjor', status: 'beta' },
    ],
  },
  {
    id: 'presentation',
    title: 'Presentationslager',
    subtitle: 'React + TypeScript',
    icon: <BarChart3 className="h-5 w-5" />,
    color: 'bg-pink-500/10 border-pink-500/30 text-pink-600 dark:text-pink-400',
    components: [
      { name: 'Dashboard', description: 'Rollbaserad huvudvy', status: 'active' },
      { name: 'KPI-kort', description: 'Interaktiva indikatorer', status: 'active' },
      { name: 'Djupnavigering', description: 'Oändlig drilldown', status: 'beta' },
      { name: 'Simulering', description: '"What-if"-scenarier', status: 'beta' },
    ],
  },
  {
    id: 'access',
    title: 'Behörighetslager',
    subtitle: 'Supabase Auth + RLS',
    icon: <Shield className="h-5 w-5" />,
    color: 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400',
    components: [
      { name: 'Statsminister', description: 'Full systemöversikt', status: 'active' },
      { name: 'Statsråd', description: 'Departementsfokus', status: 'active' },
      { name: 'Myndighetschef', description: 'Ansvarsområden', status: 'active' },
      { name: 'Allmänhet', description: 'Transparensvy', status: 'active' },
    ],
  },
];

const ROLE_HIERARCHY = [
  { role: 'Allmänhet', icon: <Globe className="h-4 w-4" />, level: 0 },
  { role: 'Forskare', icon: <FlaskConical className="h-4 w-4" />, level: 1 },
  { role: 'Myndighetschef', icon: <Building2 className="h-4 w-4" />, level: 2 },
  { role: 'Statsråd', icon: <Shield className="h-4 w-4" />, level: 3 },
  { role: 'Statsminister', icon: <Crown className="h-4 w-4" />, level: 4 },
];

interface ArchitectureVisualizationProps {
  className?: string;
}

export function ArchitectureVisualization({ className }: ArchitectureVisualizationProps) {
  const [selectedLayer, setSelectedLayer] = useState<LayerType | null>(null);
  const [expandedView, setExpandedView] = useState(false);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Systemarkitektur
            </CardTitle>
            <CardDescription className="text-xs">
              NOGF – Nationellt Ledningssystem för Offentlig Styrning
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setExpandedView(!expandedView)}
            className="text-xs"
          >
            {expandedView ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Kompakt
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Expandera
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Flödesdiagram */}
        <div className="space-y-1">
          {LAYERS.map((layer, index) => (
            <div key={layer.id}>
              {/* Layer box */}
              <button
                onClick={() => setSelectedLayer(selectedLayer === layer.id ? null : layer.id)}
                className={cn(
                  "w-full p-3 rounded-lg border transition-all text-left",
                  "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50",
                  layer.color,
                  selectedLayer === layer.id && "ring-2 ring-primary shadow-md"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-background/50">
                      {layer.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{layer.title}</p>
                      <p className="text-xs opacity-70">{layer.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {layer.components.filter(c => c.status === 'active').length} aktiva
                    </Badge>
                    <Info className="h-3.5 w-3.5 opacity-50" />
                  </div>
                </div>
                
                {/* Expanderad info */}
                {(selectedLayer === layer.id || expandedView) && (
                  <div className="mt-3 pt-3 border-t border-current/10 grid grid-cols-2 gap-2">
                    {layer.components.map((comp) => (
                      <div 
                        key={comp.name}
                        className="flex items-start gap-2 p-2 rounded bg-background/30"
                      >
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                          comp.status === 'active' && "bg-emerald-500",
                          comp.status === 'beta' && "bg-amber-500",
                          comp.status === 'planned' && "bg-muted-foreground"
                        )} />
                        <div>
                          <p className="text-xs font-medium">{comp.name}</p>
                          <p className="text-[10px] opacity-70">{comp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </button>
              
              {/* Arrow between layers */}
              {index < LAYERS.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown className="h-4 w-4 text-muted-foreground/30" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Rollhierarki */}
        <div className="pt-4 border-t">
          <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            Behörighetsnivåer
          </p>
          <div className="flex items-end justify-between gap-1 h-20">
            {ROLE_HIERARCHY.map((role, index) => (
              <div 
                key={role.role}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div 
                  className={cn(
                    "w-full rounded-t-md flex items-center justify-center transition-all",
                    "bg-gradient-to-t from-primary/20 to-primary/5 border border-primary/20",
                    "hover:from-primary/30 hover:to-primary/10"
                  )}
                  style={{ height: `${20 + role.level * 15}px` }}
                >
                  {role.icon}
                </div>
                <p className="text-[9px] text-muted-foreground text-center leading-tight">
                  {role.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="pt-3 border-t flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Aktiv</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Beta</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-muted-foreground" />
            <span>Planerad</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
