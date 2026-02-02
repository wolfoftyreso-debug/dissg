import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  ArrowLeftRight,
  Trophy,
  AlertCircle,
} from 'lucide-react';
import { SWEDISH_REGIONS, getRegionByCode } from '@/config/regionsConfig';
import { useRegionComparison } from '@/hooks/useRegionalKPIData';

interface RegionVsRegionProps {
  initialRegion1?: string;
  initialRegion2?: string;
  className?: string;
}

export function RegionVsRegion({ initialRegion1 = '01', initialRegion2 = '12', className }: RegionVsRegionProps) {
  const [region1Code, setRegion1Code] = useState(initialRegion1);
  const [region2Code, setRegion2Code] = useState(initialRegion2);

  const { comparison, isLoading } = useRegionComparison(region1Code, region2Code);

  const region1 = getRegionByCode(region1Code);
  const region2 = getRegionByCode(region2Code);

  const region1Wins = comparison?.filter(c => c?.region1Better).length || 0;
  const region2Wins = comparison?.filter(c => c && !c.region1Better).length || 0;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5" />
          Jämför två län
        </CardTitle>
        <CardDescription>
          Sida vid sida – samma indikatorer, olika regioner
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Region Selectors */}
        <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
          <Select value={region1Code} onValueChange={setRegion1Code}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SWEDISH_REGIONS.filter(r => r.code !== region2Code).map(r => (
                <SelectItem key={r.code} value={r.code}>
                  {r.shortName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-muted-foreground font-medium">vs</span>

          <Select value={region2Code} onValueChange={setRegion2Code}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SWEDISH_REGIONS.filter(r => r.code !== region1Code).map(r => (
                <SelectItem key={r.code} value={r.code}>
                  {r.shortName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Score Summary */}
        <div className="grid grid-cols-3 gap-2">
          <div className={cn(
            "rounded-lg p-3 text-center",
            region1Wins > region2Wins ? "bg-chart-2/10" : "bg-muted/50"
          )}>
            <p className="text-2xl font-bold">{region1Wins}</p>
            <p className="text-xs text-muted-foreground">{region1?.shortName}</p>
          </div>
          
          <div className="rounded-lg p-3 text-center bg-muted/30 flex flex-col items-center justify-center">
            <Trophy className="h-5 w-5 text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">Bättre värden</p>
          </div>
          
          <div className={cn(
            "rounded-lg p-3 text-center",
            region2Wins > region1Wins ? "bg-chart-2/10" : "bg-muted/50"
          )}>
            <p className="text-2xl font-bold">{region2Wins}</p>
            <p className="text-xs text-muted-foreground">{region2?.shortName}</p>
          </div>
        </div>

        <Separator />

        {/* Comparison List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <span className="text-muted-foreground animate-pulse">Laddar jämförelse...</span>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {comparison?.map((item) => {
                if (!item) return null;

                const diffColor = item.region1Better ? 'text-chart-2' : 'text-destructive';
                const absDiff = Math.abs(item.difference);
                const absPercent = Math.abs(item.percentDiff);

                return (
                  <div 
                    key={item.kpiId}
                    className="border rounded-lg p-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium truncate flex-1">{item.kpiName}</p>
                      <Badge 
                        variant={item.region1Better ? 'default' : 'secondary'}
                        className="text-xs shrink-0 ml-2"
                      >
                        {item.region1Better ? region1?.shortName : region2?.shortName}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className={cn(
                        "text-center p-2 rounded",
                        item.region1Better ? "bg-chart-2/10" : "bg-muted/50"
                      )}>
                        <p className="font-mono font-bold">
                          {item.region1Value.toLocaleString('sv-SE', { maximumFractionDigits: 1 })}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.kpiUnit}</p>
                      </div>

                      <div className="text-center p-2 flex flex-col items-center justify-center">
                        <p className={cn("font-mono font-medium", diffColor)}>
                          {item.difference > 0 ? '+' : ''}{absDiff.toFixed(1)}
                        </p>
                        <p className={cn("text-xs", diffColor)}>
                          ({absPercent.toFixed(1)}%)
                        </p>
                      </div>

                      <div className={cn(
                        "text-center p-2 rounded",
                        !item.region1Better ? "bg-chart-2/10" : "bg-muted/50"
                      )}>
                        <p className="font-mono font-bold">
                          {item.region2Value.toLocaleString('sv-SE', { maximumFractionDigits: 1 })}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.kpiUnit}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}

        {/* Disclaimer */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            Jämförelser visar senaste tillgängliga data. Regionala skillnader kan bero på 
            demografiska, geografiska och strukturella faktorer.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default RegionVsRegion;
