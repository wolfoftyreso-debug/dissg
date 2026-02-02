/**
 * EU KPI Overview - Visar alla EU-indikatorer med kategorier
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ConfidenceBar } from '@/components/dashboard/ConfidenceBar';
import { Database, CheckCircle, AlertTriangle, ShieldCheck, Shield, ShieldAlert } from 'lucide-react';
import { useEuKpiDefinitions } from '@/hooks/useEuData';
import { euKpiCategories, getEuComparabilityLevel, euComparabilityRules, type NutsLevel } from '@/config/euConfig';
import { cn } from '@/lib/utils';

// Get confidence level styling based on comparability score (0-1)
function getConfidenceConfig(score: number): {
  label: string;
  Icon: typeof ShieldCheck;
  className: string;
  bgClassName: string;
} {
  const percentage = score * 100;
  if (percentage >= 90) {
    return {
      label: 'Hög',
      Icon: ShieldCheck,
      className: 'text-status-positive',
      bgClassName: 'bg-status-positive/10'
    };
  }
  if (percentage >= 70) {
    return {
      label: 'Medel',
      Icon: Shield,
      className: 'text-status-warning',
      bgClassName: 'bg-status-warning/10'
    };
  }
  return {
    label: 'Låg',
    Icon: ShieldAlert,
    className: 'text-status-critical',
    bgClassName: 'bg-status-critical/10'
  };
}

interface EuKpiOverviewProps {
  nutsLevel: NutsLevel;
  countryCode?: string;
  category?: string;
}

export function EuKpiOverview({ nutsLevel, countryCode: _countryCode, category }: EuKpiOverviewProps) {
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
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">EU-indikatorer (NUTS {nutsLevel})</h2>
              <p className="text-muted-foreground">
                {kpiDefs?.length || 0} harmoniserade KPI:er från Eurostat
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-status-positive/20 text-status-positive">
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
  const confidenceConfig = getConfidenceConfig(kpi.comparability_score);
  const ConfidenceIcon = confidenceConfig.Icon;
  
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

        {/* Comparability / Data Quality */}
        <Tooltip>
          <TooltipTrigger>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Datakvalitet</div>
              <div className={cn(
                'flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium mt-0.5',
                confidenceConfig.bgClassName,
                confidenceConfig.className
              )}>
                <ConfidenceIcon className="h-3 w-3" />
                {Math.round(kpi.comparability_score * 100)}%
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-2">
              <div className="font-semibold flex items-center gap-1.5">
                <ConfidenceIcon className={cn('h-4 w-4', confidenceConfig.className)} />
                {comparabilityConfig.label}
              </div>
              <p className="text-xs text-muted-foreground">{comparabilityConfig.description}</p>
              <ConfidenceBar value={Math.round(kpi.comparability_score * 100)} className="mt-2" />
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Status */}
        {isAvailableAtLevel ? (
          <CheckCircle className="h-5 w-5 text-status-positive" />
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <AlertTriangle className="h-5 w-5 text-status-warning" />
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
