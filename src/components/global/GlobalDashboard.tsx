import React from 'react';
import { useGlobalStats, useCountries } from '@/hooks/useGlobalData';
import { dataDepthConfig, regions, regionalBlocs } from '@/config/globalExpansionConfig';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Globe, 
  BarChart3, 
  ArrowLeftRight,
  Database,
  Layers,
  Map
} from 'lucide-react';
import { GlobalRankingTable } from './GlobalRankingTable';
import { GlobalComparison } from './GlobalComparison';
import { DataDepthIndicator } from './DataDepthIndicator';

interface GlobalDashboardProps {
  className?: string;
}

export function GlobalDashboard({ className }: GlobalDashboardProps) {
  const { data: stats, isLoading: statsLoading } = useGlobalStats();
  const { data: countries } = useCountries();

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Globe className="h-6 w-6" />
          Global Expansion
        </h1>
        <p className="text-muted-foreground">
          Globalt samhälls-operativsystem med adaptivt djup per land. 
          Jämförbarhet är viktigare än perfektion.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Totalt länder</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-12 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.totalCountries || 0}</p>
                )}
              </div>
              <Globe className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Nationellt djup</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-12 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-purple-500">
                    {stats?.byDepth.national_deep || 0}
                  </p>
                )}
              </div>
              <Database className="h-8 w-8 text-purple-500/30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Regional bloc</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-12 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-blue-500">
                    {stats?.byDepth.regional_bloc || 0}
                  </p>
                )}
              </div>
              <Layers className="h-8 w-8 text-blue-500/30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Global baseline</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-12 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-green-500">
                    {stats?.byDepth.global_baseline || 0}
                  </p>
                )}
              </div>
              <Map className="h-8 w-8 text-green-500/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Depth Tiers */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Datalager</CardTitle>
          <CardDescription>
            Tre lager med olika upplösning beroende på datatillgång
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {(['global_baseline', 'regional_bloc', 'national_deep'] as const).map(depth => {
              const count = stats?.byDepth[depth] || 0;
              
              return (
                <Card key={depth} className={`border-2 ${depth === 'national_deep' ? 'border-purple-500/20' : 'border-transparent'}`}>
                  <CardContent className="p-4">
                    <DataDepthIndicator depth={depth} showFeatures />
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Antal länder</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="ranking" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ranking">
            <BarChart3 className="h-4 w-4 mr-2" />
            Ranking
          </TabsTrigger>
          <TabsTrigger value="compare">
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Jämför länder
          </TabsTrigger>
          <TabsTrigger value="coverage">
            <Map className="h-4 w-4 mr-2" />
            Täckning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ranking">
          <GlobalRankingTable />
        </TabsContent>

        <TabsContent value="compare">
          <GlobalComparison />
        </TabsContent>

        <TabsContent value="coverage">
          <Card>
            <CardHeader>
              <CardTitle>Geografisk täckning</CardTitle>
              <CardDescription>
                Antal länder per region och bloc
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* By Region */}
                <div>
                  <h4 className="font-medium mb-3">Per region</h4>
                  <div className="space-y-2">
                    {Object.entries(stats?.byRegion || {}).sort((a, b) => b[1] - a[1]).map(([region, count]) => {
                      const regionConfig = regions[region as keyof typeof regions];
                      return (
                        <div key={region} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                          <span className="flex items-center gap-2">
                            <span>{regionConfig?.emoji || '🌍'}</span>
                            <span className="capitalize">{regionConfig?.name || region}</span>
                          </span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* By Bloc */}
                <div>
                  <h4 className="font-medium mb-3">Per bloc</h4>
                  <div className="space-y-2">
                    {Object.entries(stats?.byBloc || {}).sort((a, b) => b[1] - a[1]).map(([bloc, count]) => {
                      const blocConfig = regionalBlocs[bloc as keyof typeof regionalBlocs];
                      return (
                        <div key={bloc} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                          <span className="uppercase font-medium">{blocConfig?.name || bloc}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Countries with deep data */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3">Länder med fullt djup</h4>
                <div className="flex flex-wrap gap-2">
                  {countries?.filter(c => c.data_depth === 'national_deep').map(country => (
                    <Badge key={country.code} className="bg-purple-500/20 text-purple-500">
                      {country.code} — {country.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
