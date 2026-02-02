/**
 * EU Comparison View - Jämför regioner och länder
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRightLeft, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
import { useEuCountries, useNutsRegions, useEuCorrelations } from '@/hooks/useEuData';
import { euKpiCategories, type NutsLevel } from '@/config/euConfig';

interface EuComparisonViewProps {
  nutsLevel: NutsLevel;
  countryCode?: string;
}

export function EuComparisonView({ nutsLevel, countryCode }: EuComparisonViewProps) {
  const [regionA, setRegionA] = useState<string>('');
  const [regionB, setRegionB] = useState<string>('');
  const [selectedKpiCategory, setSelectedKpiCategory] = useState<string>('workforce');

  const { data: countries } = useEuCountries();
  const { data: regions } = useNutsRegions(countryCode, nutsLevel);
  const { data: correlations } = useEuCorrelations(undefined, nutsLevel);

  const regionsOrCountries = nutsLevel === 0 ? countries : regions;

  return (
    <div className="space-y-6">
      {/* Comparison selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Jämför {nutsLevel === 0 ? 'länder' : 'regioner'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Region A</label>
              <Select value={regionA} onValueChange={setRegionA}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj region..." />
                </SelectTrigger>
                <SelectContent>
                  {regionsOrCountries?.map(r => (
                    <SelectItem key={r.code} value={r.code}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end justify-center">
              <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Region B</label>
              <Select value={regionB} onValueChange={setRegionB}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj region..." />
                </SelectTrigger>
                <SelectContent>
                  {regionsOrCountries?.map(r => (
                    <SelectItem key={r.code} value={r.code}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={selectedKpiCategory} onValueChange={setSelectedKpiCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="KPI-kategori" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(euKpiCategories).map(([key, cat]) => (
                  <SelectItem key={key} value={key}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button disabled={!regionA || !regionB}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Jämför
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comparability notice */}
      <Alert>
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertDescription>
          <strong>Full EU-jämförbarhet:</strong> Alla indikatorer använder harmoniserade Eurostat-definitioner
          och är direkt jämförbara mellan EU-länder och regioner.
        </AlertDescription>
      </Alert>

      {/* Correlations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Korrelationsanalys (NUTS {nutsLevel})
            <Badge variant="outline" className="ml-auto">
              {correlations?.length || 0} signifikanta samband
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Korrelation ≠ orsak:</strong> Dessa samband visar statistiska mönster,
              inte orsakssamband. Tolka med försiktighet.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            {correlations?.slice(0, 10).map(corr => (
              <CorrelationCard key={corr.id} correlation={corr} />
            ))}
            {(!correlations || correlations.length === 0) && (
              <div className="text-center text-muted-foreground py-8">
                Inga korrelationer beräknade ännu för denna NUTS-nivå
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface CorrelationCardProps {
  correlation: {
    id: string;
    correlation_coefficient: number;
    time_lag_months: number;
    stability_score: number | null;
    is_significant: boolean;
    interpretation: string | null;
    kpi_a?: { code: string; name: string; category: string };
    kpi_b?: { code: string; name: string; category: string };
  };
}

function CorrelationCard({ correlation }: CorrelationCardProps) {
  const coefficient = correlation.correlation_coefficient;
  const isPositive = coefficient > 0;
  const strength = Math.abs(coefficient);
  
  const strengthLabel = strength > 0.7 ? 'Stark' : strength > 0.4 ? 'Måttlig' : 'Svag';
  const strengthColor = strength > 0.7 ? 'text-green-500' : strength > 0.4 ? 'text-yellow-500' : 'text-muted-foreground';

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
      <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
        {isPositive ? (
          <TrendingUp className="h-5 w-5 text-green-500" />
        ) : (
          <TrendingDown className="h-5 w-5 text-red-500" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">{correlation.kpi_a?.name || 'KPI A'}</Badge>
          <span className="text-muted-foreground">↔</span>
          <Badge variant="secondary">{correlation.kpi_b?.name || 'KPI B'}</Badge>
        </div>
        {correlation.interpretation && (
          <p className="text-sm text-muted-foreground mt-1 truncate">
            {correlation.interpretation}
          </p>
        )}
      </div>

      <div className="text-right">
        <div className={`text-lg font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {coefficient > 0 ? '+' : ''}{(coefficient * 100).toFixed(0)}%
        </div>
        <div className={`text-xs ${strengthColor}`}>{strengthLabel}</div>
      </div>

      {correlation.time_lag_months !== 0 && (
        <Badge variant="outline">
          {correlation.time_lag_months > 0 ? '+' : ''}{correlation.time_lag_months} mån
        </Badge>
      )}

      {correlation.stability_score !== null && (
        <Badge variant={correlation.stability_score > 0.7 ? 'default' : 'secondary'}>
          Stabilitet: {Math.round(correlation.stability_score * 100)}%
        </Badge>
      )}
    </div>
  );
}

export default EuComparisonView;
