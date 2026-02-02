import React from 'react';
import { gmiPillars, dataQualityConfig, DataQuality } from '@/config/gmiConfig';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle,
  Info,
  ChevronRight
} from 'lucide-react';

interface PillarScore {
  pillarId: string;
  value: number;
  normalizedValue: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  dataQuality: DataQuality;
  indicatorCount: number;
  indicatorsAvailable: number;
}

interface GMIOverviewProps {
  countryCode: string;
  countryName: string;
  gmiScore: number;
  gmiTrend: 'up' | 'down' | 'stable';
  gmiTrendPercent: number;
  pillarScores: PillarScore[];
  dataQuality: DataQuality;
  comparability: 'full' | 'partial' | 'limited';
  lastUpdated: string;
  className?: string;
  onPillarClick?: (pillarId: string) => void;
}

export function GMIOverview({
  countryCode,
  countryName,
  gmiScore,
  gmiTrend,
  gmiTrendPercent,
  pillarScores,
  dataQuality,
  comparability,
  lastUpdated,
  className,
  onPillarClick,
}: GMIOverviewProps) {
  const qualityConfig = dataQualityConfig[dataQuality];

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    if (score >= 25) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl font-bold">{countryCode}</span>
              <span>{countryName}</span>
            </CardTitle>
            <CardDescription>
              Global Master Index • Uppdaterad {new Date(lastUpdated).toLocaleDateString('sv-SE')}
            </CardDescription>
          </div>
          
          {/* Data quality indicator */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge 
                  variant="outline" 
                  className={`${qualityConfig.color} border-current`}
                >
                  {dataQuality === 'low' && <AlertTriangle className="h-3 w-3 mr-1" />}
                  Datakvalitet: {qualityConfig.label}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{qualityConfig.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main GMI Score */}
        <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-lg">
          <div 
            className="relative w-24 h-24 flex items-center justify-center rounded-full border-4"
            style={{ 
              borderColor: `hsl(var(--primary) / ${qualityConfig.opacity})`,
              opacity: qualityConfig.opacity 
            }}
          >
            <span className={`text-3xl font-bold ${getScoreColor(gmiScore)}`}>
              {gmiScore.toFixed(1)}
            </span>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-medium">Global Master Index</span>
              {getTrendIcon(gmiTrend)}
              <span className={`text-sm ${
                gmiTrend === 'up' ? 'text-green-500' : 
                gmiTrend === 'down' ? 'text-red-500' : 
                'text-muted-foreground'
              }`}>
                {gmiTrendPercent > 0 ? '+' : ''}{gmiTrendPercent.toFixed(1)}%
              </span>
            </div>
            
            <Progress value={gmiScore} className="h-2" />
            
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>Jämförbarhet: {comparability}</span>
              <span>•</span>
              <span>{pillarScores.reduce((sum, p) => sum + p.indicatorsAvailable, 0)} indikatorer</span>
            </div>
          </div>
        </div>

        {/* Pillar Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Pelare
          </h4>
          
          {pillarScores.map(score => {
            const pillar = gmiPillars.find(p => p.id === score.pillarId);
            if (!pillar) return null;
            
            const pillarQuality = dataQualityConfig[score.dataQuality];
            
            return (
              <div 
                key={score.pillarId}
                className="p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer"
                style={{ opacity: pillarQuality.opacity }}
                onClick={() => onPillarClick?.(score.pillarId)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{pillar.icon}</span>
                    <span className="font-medium">{pillar.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {(pillar.defaultWeight * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-bold ${getScoreColor(score.normalizedValue)}`}>
                      {score.normalizedValue.toFixed(1)}
                    </span>
                    {getTrendIcon(score.trend)}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Progress 
                    value={score.normalizedValue} 
                    className="flex-1 h-1.5"
                    style={{ backgroundColor: `${pillar.color}20` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {score.indicatorsAvailable}/{score.indicatorCount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Data quality warning */}
        {dataQuality !== 'high' && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-700 dark:text-yellow-400">
                  {dataQuality === 'low' ? 'Begränsad datatillgång' : 'Viss data saknas'}
                </p>
                <p className="text-muted-foreground mt-1">
                  {dataQuality === 'low' 
                    ? 'Betydande dataluckor påverkar tillförlitligheten. Jämför med försiktighet.'
                    : 'Vissa indikatorer är estimerade eller saknas. Se respektive pelare för detaljer.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
