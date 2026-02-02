import React, { useState } from 'react';
import { useGMIRanking, useGlobalStats } from '@/hooks/useGlobalData';
import { dataDepthConfig, regions } from '@/config/globalExpansionConfig';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  Globe,
  AlertCircle
} from 'lucide-react';

interface GlobalRankingTableProps {
  className?: string;
}

export function GlobalRankingTable({ className }: GlobalRankingTableProps) {
  const [filterBloc, setFilterBloc] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  
  const { data: ranking, isLoading } = useGMIRanking({
    bloc: filterBloc !== 'all' ? filterBloc : undefined,
    region: filterRegion !== 'all' ? filterRegion : undefined,
    limit: 50,
  });
  const { data: stats } = useGlobalStats();

  const getTrendIcon = (trend: string | null) => {
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

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Global Master Index Ranking
            </CardTitle>
            <CardDescription>
              {stats?.totalCountries} länder • Uppdaterad dagligen
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={filterBloc} onValueChange={setFilterBloc}>
              <SelectTrigger className="w-[120px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Bloc" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla</SelectItem>
                <SelectItem value="eu">EU</SelectItem>
                <SelectItem value="oecd">OECD</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger className="w-[140px]">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla regioner</SelectItem>
                {Object.entries(regions).map(([key, region]) => (
                  <SelectItem key={key} value={key}>
                    {region.emoji} {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {ranking && ranking.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Land</TableHead>
                <TableHead className="text-right">GMI Score</TableHead>
                <TableHead className="text-center">Trend</TableHead>
                <TableHead className="text-right">Datakvalitet</TableHead>
                <TableHead className="text-center">Djup</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranking.map((item) => {
                const country = item.country;
                if (!country) return null;
                
                const depthConfig = dataDepthConfig[country.data_depth];
                
                return (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="font-bold">
                      <div className="flex items-center gap-2">
                        {item.global_rank === 1 && '🥇'}
                        {item.global_rank === 2 && '🥈'}
                        {item.global_rank === 3 && '🥉'}
                        {item.global_rank && item.global_rank > 3 && `#${item.global_rank}`}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{country.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {country.code}
                        </Badge>
                        {country.bloc && (
                          <Badge variant="secondary" className="text-xs uppercase">
                            {country.bloc}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <span className={`font-mono font-bold text-lg ${getScoreColor(item.value)}`}>
                        {item.value.toFixed(1)}
                      </span>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getTrendIcon(item.trend)}
                        {item.trend_percent && (
                          <span className={`text-xs ${
                            item.trend === 'up' ? 'text-green-500' : 
                            item.trend === 'down' ? 'text-red-500' : 
                            'text-muted-foreground'
                          }`}>
                            {item.trend_percent > 0 ? '+' : ''}{item.trend_percent.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Progress 
                          value={item.data_completeness} 
                          className="w-16 h-2" 
                        />
                        <span className="text-xs text-muted-foreground w-8">
                          {item.data_completeness.toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <Badge className={`text-xs ${depthConfig.color}`}>
                        {depthConfig.label.split(' ')[0]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Ingen rankingdata tillgänglig</p>
            <p className="text-xs mt-1">Ladda testdata för att se ranking</p>
          </div>
        )}

        {/* Data gaps warning */}
        {ranking?.some(r => r.data_gaps && r.data_gaps.length > 0) && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Vissa länder har datalguckor som påverkar poängen. Se respektive lands profil för detaljer.</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
