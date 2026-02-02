/**
 * EU KPI Overview - Visar alla EU-indikatorer med kategorier
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  TrendingUp, TrendingDown, Minus, Info, Database, 
  CheckCircle, AlertTriangle, ExternalLink 
} from 'lucide-react';
import { useEuKpiDefinitions } from '@/hooks/useEuData';
import { euKpiCategories, getEuComparabilityLevel, euComparabilityRules, type NutsLevel } from '@/config/euConfig';

interface EuKpiOverviewProps {
  nutsLevel: NutsLevel;
  countryCode?: string;
  category?: string;
}

export function EuKpiOverview({ nutsLevel, countryCode, category }: EuKpiOverviewProps) {
  const { data: kpiDefs, isLoading } = useEuKpiDefinitions(category);

  // Group by category
  const kpisByCategory = kpiDefs?.reduce((acc, kpi) => {
    if (!acc[kpi.category]) acc[kpi.category] = [];
    acc[kpi.category].push(kpi);
    return acc;
  }, {} as Record<string, typeof kpiDefs>) || {};

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 h-32" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">EU-indikatorer (NUTS {nutsLevel})</h2>
              <p className="text-muted-foreground">
                {kpiDefs?.length || 0} harmoniserade KPI:er från Eurostat
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Harmoniserad data
              </Badge>
              <Badge variant="outline">
                <Database className="h-3 w-3 mr-1" />
                Eurostat
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs by category */}
      {Object.entries(euKpiCategories).map(([categoryKey, categoryConfig]) => {
        const categoryKpis = kpisByCategory[categoryKey] || [];
        if (categoryKpis.length === 0 && category) return null;

        return (
          <Card key={categoryKey}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{categoryConfig.icon}</span>
                {categoryConfig.name}
                <Badge variant="secondary" className="ml-auto">
                  {categoryKpis.length} KPI:er
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{categoryConfig.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {categoryKpis.map(kpi => (
                  <KpiCard key={kpi.id} kpi={kpi} nutsLevel={nutsLevel} />
                ))}
                {categoryKpis.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    Inga KPI:er i denna kategori
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

interface KpiCardProps {
  kpi: {
    id: string;
    code: string;
    name: string;
    description: string | null;
    unit: string;
    is_inverted: boolean;
    eurostat_indicator_code: string | null;
    gmi_component: string | null;
    comparability_score: number;
    min_nuts_level: number;
    max_nuts_level: number;
  };
  nutsLevel: NutsLevel;
}

function KpiCard({ kpi, nutsLevel }: KpiCardProps) {
  const comparabilityLevel = getEuComparabilityLevel(kpi.comparability_score);
  const comparabilityConfig = euComparabilityRules[comparabilityLevel];
  
  const isAvailableAtLevel = nutsLevel >= kpi.min_nuts_level && nutsLevel <= kpi.max_nuts_level;

  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg border ${isAvailableAtLevel ? 'bg-card' : 'bg-muted/50 opacity-60'}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium">{kpi.name}</span>
          {kpi.is_inverted && (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="text-xs">↓ bättre</Badge>
              </TooltipTrigger>
              <TooltipContent>Lägre värde = bättre resultat</TooltipContent>
            </Tooltip>
          )}
        </div>
        {kpi.description && (
          <p className="text-sm text-muted-foreground truncate">{kpi.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="text-xs">{kpi.unit}</Badge>
          {kpi.eurostat_indicator_code && (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="text-xs gap-1">
                  <Database className="h-2 w-2" />
                  {kpi.eurostat_indicator_code}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Eurostat-tabellkod</TooltipContent>
            </Tooltip>
          )}
          {kpi.gmi_component && (
            <Badge variant="outline" className="text-xs">
              GMI: {kpi.gmi_component}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* NUTS availability */}
        <Tooltip>
          <TooltipTrigger>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">NUTS</div>
              <div className="text-sm font-medium">
                {kpi.min_nuts_level}-{kpi.max_nuts_level}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            Tillgänglig på NUTS {kpi.min_nuts_level} till {kpi.max_nuts_level}
          </TooltipContent>
        </Tooltip>

        {/* Comparability */}
        <Tooltip>
          <TooltipTrigger>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Jämförbarhet</div>
              <Badge className={comparabilityConfig.color.replace('text-', 'bg-').replace('-500', '-500/20')}>
                {Math.round(kpi.comparability_score * 100)}%
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <div className="font-semibold">{comparabilityConfig.label}</div>
              <div className="text-xs">{comparabilityConfig.description}</div>
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Status */}
        {isAvailableAtLevel ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </TooltipTrigger>
            <TooltipContent>
              Ej tillgänglig på NUTS {nutsLevel}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

export default EuKpiOverview;
