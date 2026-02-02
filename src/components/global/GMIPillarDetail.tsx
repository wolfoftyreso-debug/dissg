import React from 'react';
import { gmiPillars, dataQualityConfig, DataQuality, GMIIndicator } from '@/config/gmiConfig';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  HelpCircle,
  ArrowUpDown
} from 'lucide-react';

interface IndicatorValue {
  code: string;
  value: number | null;
  normalizedValue: number | null;
  trend: 'up' | 'down' | 'stable' | null;
  trendPercent: number | null;
  source: string;
  lastUpdated: string;
  isEstimated: boolean;
  uncertainty?: number;
}

interface GMIPillarDetailProps {
  pillarId: string;
  countryCode: string;
  countryName: string;
  pillarScore: number;
  pillarTrend: 'up' | 'down' | 'stable';
  indicators: IndicatorValue[];
  dataQuality: DataQuality;
  weight: number;
  className?: string;
}

export function GMIPillarDetail({
  pillarId,
  countryCode,
  countryName,
  pillarScore,
  pillarTrend,
  indicators,
  dataQuality,
  weight,
  className,
}: GMIPillarDetailProps) {
  const pillar = gmiPillars.find(p => p.id === pillarId);
  if (!pillar) return null;

  const qualityConfig = dataQualityConfig[dataQuality];

  const getTrendIcon = (trend: 'up' | 'down' | 'stable' | null, inverted?: boolean) => {
    if (!trend) return <Minus className="h-4 w-4 text-muted-foreground" />;
    
    // If inverted (like mortality), up is bad
    const isPositive = inverted ? trend === 'down' : trend === 'up';
    const isNegative = inverted ? trend === 'up' : trend === 'down';
    
    if (isPositive) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (isNegative) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getIndicatorMeta = (code: string): GMIIndicator | undefined => {
    return pillar.indicators.find(i => i.code === code);
  };

  const availableCount = indicators.filter(i => i.value !== null).length;
  const totalCount = pillar.indicators.length;
  const coverage = (availableCount / totalCount) * 100;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-3">
              <span className="text-2xl">{pillar.icon}</span>
              <div>
                <span>{pillar.name}</span>
                <Badge variant="outline" className="ml-2">
                  Vikt: {(weight * 100).toFixed(0)}%
                </Badge>
              </div>
            </CardTitle>
            <CardDescription className="mt-1">
              {pillar.description} • {countryName}
            </CardDescription>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <span className="text-3xl font-bold" style={{ color: pillar.color }}>
                {pillarScore.toFixed(1)}
              </span>
              {getTrendIcon(pillarTrend)}
            </div>
            <Badge className={qualityConfig.color} variant="outline">
              {qualityConfig.label} datakvalitet
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Data coverage */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Datatäckning</span>
            <span className="font-medium">{availableCount} av {totalCount} indikatorer</span>
          </div>
          <Progress value={coverage} className="h-2" />
        </div>

        {/* Indicators table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Indikator</TableHead>
              <TableHead className="text-right">Värde</TableHead>
              <TableHead className="text-center">Trend</TableHead>
              <TableHead className="text-right">Normaliserat</TableHead>
              <TableHead className="text-center">Källa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pillar.indicators.map(indicatorDef => {
              const indicator = indicators.find(i => i.code === indicatorDef.code);
              const hasValue = indicator?.value !== null && indicator?.value !== undefined;
              
              return (
                <TableRow 
                  key={indicatorDef.code}
                  className={!hasValue ? 'opacity-50' : ''}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{indicatorDef.name}</span>
                      {indicatorDef.inverted && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Inverterad: lägre är bättre</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {indicator?.isEstimated && (
                        <Badge variant="outline" className="text-xs">Est.</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Tillgänglig: {indicatorDef.availability.toUpperCase()}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right font-mono">
                    {hasValue ? (
                      <div>
                        <span>{indicator!.value!.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          {indicatorDef.unit}
                        </span>
                        {indicator!.uncertainty && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ±{indicator!.uncertainty.toFixed(1)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  
                  <TableCell className="text-center">
                    {hasValue && indicator?.trend ? (
                      <div className="flex items-center justify-center gap-1">
                        {getTrendIcon(indicator.trend, indicatorDef.inverted)}
                        {indicator.trendPercent !== null && (
                          <span className="text-xs">
                            {indicator.trendPercent > 0 ? '+' : ''}
                            {indicator.trendPercent.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    {hasValue && indicator?.normalizedValue !== null ? (
                      <div className="flex items-center justify-end gap-2">
                        <Progress 
                          value={indicator!.normalizedValue!} 
                          className="w-16 h-2"
                        />
                        <span className="font-mono text-sm w-8">
                          {indicator!.normalizedValue!.toFixed(0)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="outline" className="text-xs">
                            {indicatorDef.source}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Datakälla: {indicatorDef.source}</p>
                          {indicator?.lastUpdated && (
                            <p className="text-xs text-muted-foreground">
                              Uppdaterad: {new Date(indicator.lastUpdated).toLocaleDateString('sv-SE')}
                            </p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Missing data note */}
        {availableCount < totalCount && (
          <div className="p-3 bg-muted/30 rounded-lg text-sm">
            <div className="flex items-start gap-2">
              <HelpCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-muted-foreground">
                  {totalCount - availableCount} indikator{totalCount - availableCount > 1 ? 'er' : ''} saknas 
                  för {countryName}. Pelarpoängen beräknas baserat på tillgänglig data.
                  {dataQuality === 'low' && ' Använd jämförelser med försiktighet.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
