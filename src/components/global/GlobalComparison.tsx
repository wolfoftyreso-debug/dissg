import React, { useState } from 'react';
import { useCountries, useCountryComparability, useGlobalKPIValues } from '@/hooks/useGlobalData';
import { 
  dataDepthConfig, 
  comparabilityConfig, 
  getComparabilityLevel 
} from '@/config/globalExpansionConfig';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  ArrowLeftRight, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GlobalComparisonProps {
  className?: string;
}

export function GlobalComparison({ className }: GlobalComparisonProps) {
  const [countryA, setCountryA] = useState<string>('SE');
  const [countryB, setCountryB] = useState<string>('DE');
  
  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: comparability } = useCountryComparability(countryA, countryB);
  const { data: kpisA } = useGlobalKPIValues({ countryCode: countryA });
  const { data: kpisB } = useGlobalKPIValues({ countryCode: countryB });

  const countryAData = countries?.find(c => c.code === countryA);
  const countryBData = countries?.find(c => c.code === countryB);
  
  // Get overall comparability
  const overallComparability = comparability?.find(c => c.kpi_code === null);
  const comparabilityLevel = overallComparability 
    ? getComparabilityLevel(overallComparability.score) 
    : 'partial';
  const compConfig = comparabilityConfig[comparabilityLevel];

  if (countriesLoading) {
    return (
      <div className={className}>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Country Selectors */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Jämför länder
          </CardTitle>
          <CardDescription>
            Välj två länder att jämföra. Jämförbarheten visas tydligt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={countryA} onValueChange={setCountryA}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries?.map(country => (
                    <SelectItem key={country.code} value={country.code}>
                      <span className="flex items-center gap-2">
                        <span>{country.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {country.code}
                        </Badge>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
            
            <div className="flex-1">
              <Select value={countryB} onValueChange={setCountryB}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries?.filter(c => c.code !== countryA).map(country => (
                    <SelectItem key={country.code} value={country.code}>
                      <span className="flex items-center gap-2">
                        <span>{country.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {country.code}
                        </Badge>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparability Alert */}
      <Alert className="mb-6" variant={comparabilityLevel === 'full' ? 'default' : 'destructive'}>
        {comparabilityLevel === 'full' ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <AlertTriangle className="h-4 w-4" />
        )}
        <AlertDescription className="flex items-center justify-between">
          <span>
            <strong className={compConfig.color}>{compConfig.label}:</strong>{' '}
            {overallComparability?.comparability_notes || compConfig.description}
          </span>
          <Badge variant="outline">
            {Math.round((overallComparability?.score || 0.5) * 100)}% jämförbarhet
          </Badge>
        </AlertDescription>
      </Alert>

      {/* Country Cards */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {[
          { country: countryAData, kpis: kpisA },
          { country: countryBData, kpis: kpisB },
        ].map(({ country, kpis }) => {
          if (!country) return null;
          const depthConfig = dataDepthConfig[country.data_depth];
          
          return (
            <Card key={country.code}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{country.code_alpha3}</span>
                      {country.name}
                    </CardTitle>
                    <CardDescription>{country.name_local}</CardDescription>
                  </div>
                  <Badge className={depthConfig.color}>
                    {depthConfig.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Basic info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Befolkning</span>
                    <p className="font-semibold">
                      {(country.population / 1000000).toFixed(1)} milj
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">BNP/capita</span>
                    <p className="font-semibold">
                      ${country.gdp_per_capita?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Region</span>
                    <p className="font-semibold capitalize">{country.subregion || country.region}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Bloc</span>
                    <p className="font-semibold uppercase">{country.bloc || '—'}</p>
                  </div>
                </div>

                {/* Data quality */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Datakvalitet</span>
                    <span>{country.data_quality_score}%</span>
                  </div>
                  <Progress value={country.data_quality_score} />
                </div>

                {/* Feature availability */}
                <div className="flex flex-wrap gap-2">
                  {country.has_regional_data && (
                    <Badge variant="outline" className="text-xs">Regional data</Badge>
                  )}
                  {country.has_municipal_data && (
                    <Badge variant="outline" className="text-xs">Kommundata</Badge>
                  )}
                  {country.has_responsibility_model && (
                    <Badge variant="outline" className="text-xs">Ansvarsmodell</Badge>
                  )}
                  {country.has_feeds_enabled && (
                    <Badge variant="outline" className="text-xs">Feeds</Badge>
                  )}
                </div>

                {/* Recent KPIs */}
                {kpis && kpis.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-2">Senaste indikatorer</h4>
                    <div className="space-y-2">
                      {kpis.slice(0, 3).map(kpi => (
                        <div key={kpi.id} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground truncate flex-1">
                            {kpi.kpi_code}
                          </span>
                          <span className="font-mono flex items-center gap-1">
                            {kpi.value.toFixed(1)} {kpi.unit}
                            {kpi.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                            {kpi.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                            {kpi.trend === 'stable' && <Minus className="h-3 w-3 text-muted-foreground" />}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Methodology note */}
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Om jämförbarhet</p>
              <p>
                Jämförbarheten beror på datakällor, definitioner och metodik. 
                {comparabilityLevel === 'full' && ' Båda länderna använder harmoniserade EU/OECD-standarder.'}
                {comparabilityLevel === 'partial' && ' Vissa metodskillnader kan påverka direkta jämförelser.'}
                {comparabilityLevel === 'limited' && ' Betydande skillnader i definitioner begränsar jämförbarheten.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
