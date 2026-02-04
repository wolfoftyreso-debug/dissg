/**
 * OPEN DATA PANEL
 * 
 * Dashboard panel for viewing and managing open data sources.
 * Part of Data Channel B: Semi-official/Aggregated Sources.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  useWeatherData, 
  useNewsData, 
  useFinanceData, 
  useSportsData,
  useGovernmentData,
  type OpenDataCategory
} from '@/hooks/useOpenData';

interface OpenDataPanelProps {
  defaultCategory?: OpenDataCategory;
}

export function OpenDataPanel({ defaultCategory = 'news' }: OpenDataPanelProps) {
  const [activeCategory, setActiveCategory] = useState<OpenDataCategory>(defaultCategory);
  
  const weather = useWeatherData();
  const news = useNewsData();
  const finance = useFinanceData();
  const sports = useSportsData();
  const government = useGovernmentData();
  
  // Fetch data when category changes
  useEffect(() => {
    const fetchers: Record<OpenDataCategory, () => void> = {
      weather: weather.fetchData,
      news: news.fetchData,
      finance: finance.fetchData,
      sports: sports.fetchData,
      government: government.fetchData,
      transport: () => {}, // Not implemented yet
      social: () => {}, // Not implemented yet
    };
    
    fetchers[activeCategory]?.();
  }, [activeCategory]);
  
  const getActiveData = () => {
    switch (activeCategory) {
      case 'weather': return weather;
      case 'news': return news;
      case 'finance': return finance;
      case 'sports': return sports;
      case 'government': return government;
      default: return null;
    }
  };
  
  const activeData = getActiveData();
  
  return (
    <Card className="border-2 border-dashed border-muted-foreground/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-mono text-sm">
            <span className="text-muted-foreground">[ÖPPNA KÄLLOR]</span>
            <Badge variant="outline" className="font-mono text-xs">
              KANAL B
            </Badge>
          </CardTitle>
          
          {activeData?.data?.meta && (
            <span className="font-mono text-xs text-muted-foreground">
              [UPPDATERAD: {new Date(activeData.data.meta.fetched_at).toLocaleTimeString('sv-SE')}]
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as OpenDataCategory)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="news" className="font-mono text-xs">
              [NYHETER]
            </TabsTrigger>
            <TabsTrigger value="weather" className="font-mono text-xs">
              [VÄDER]
            </TabsTrigger>
            <TabsTrigger value="finance" className="font-mono text-xs">
              [FINANS]
            </TabsTrigger>
            <TabsTrigger value="sports" className="font-mono text-xs">
              [SPORT]
            </TabsTrigger>
            <TabsTrigger value="government" className="font-mono text-xs">
              [OFFENTLIG]
            </TabsTrigger>
          </TabsList>
          
          {/* News Tab */}
          <TabsContent value="news" className="mt-4">
            <NewsContent data={news.data} isLoading={news.isLoading} error={news.error} />
          </TabsContent>
          
          {/* Weather Tab */}
          <TabsContent value="weather" className="mt-4">
            <WeatherContent data={weather.data} isLoading={weather.isLoading} error={weather.error} />
          </TabsContent>
          
          {/* Finance Tab */}
          <TabsContent value="finance" className="mt-4">
            <FinanceContent data={finance.data} isLoading={finance.isLoading} error={finance.error} />
          </TabsContent>
          
          {/* Sports Tab */}
          <TabsContent value="sports" className="mt-4">
            <SportsContent data={sports.data} isLoading={sports.isLoading} error={sports.error} />
          </TabsContent>
          
          {/* Government Tab */}
          <TabsContent value="government" className="mt-4">
            <GovernmentContent data={government.data} isLoading={government.isLoading} error={government.error} />
          </TabsContent>
        </Tabs>
        
        {/* Source Attribution */}
        {activeData?.data?.source && (
          <div className="flex items-center justify-between border-t pt-3 mt-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">[KÄLLA]</span>
              <a 
                href={activeData.data.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                {activeData.data.source}
              </a>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              {activeData.data.license}
            </Badge>
          </div>
        )}
        
        {/* Refresh Button */}
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={activeData?.refetch}
            disabled={activeData?.isLoading}
            className="font-mono text-xs"
          >
            {activeData?.isLoading ? '[HÄMTAR...]' : '[↻ UPPDATERA]'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Sub-components for each data type
function NewsContent({ data, isLoading, error }: { data: any; isLoading: boolean; error: string | null }) {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data?.data?.length) return <EmptyState />;
  
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-3">
        {data.data.map((article: any, i: number) => (
          <a 
            key={i}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-sm border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-sm font-medium line-clamp-2">{article.title}</p>
                {article.summary && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {article.summary}
                  </p>
                )}
              </div>
              <Badge variant="outline" className="font-mono text-xs shrink-0">
                {article.category}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-mono">
              [{new Date(article.published_at).toLocaleDateString('sv-SE')}]
            </p>
          </a>
        ))}
      </div>
    </ScrollArea>
  );
}

function WeatherContent({ data, isLoading, error }: { data: any; isLoading: boolean; error: string | null }) {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data?.data?.length) return <EmptyState />;
  
  return (
    <ScrollArea className="h-[300px]">
      <div className="grid grid-cols-4 gap-2">
        {data.data.map((point: any, i: number) => (
          <div key={i} className="p-2 rounded-sm border text-center">
            <p className="text-xs text-muted-foreground font-mono">
              {new Date(point.timestamp).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-lg font-bold">
              {point.temperature !== undefined ? `${point.temperature}°` : '-'}
            </p>
            <p className="text-xs text-muted-foreground">
              {point.precipitation}mm
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function FinanceContent({ data, isLoading, error }: { data: any; isLoading: boolean; error: string | null }) {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data?.data?.length) return <EmptyState />;
  
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-xs text-muted-foreground">[BAS]</span>
          <Badge>{data.base_currency || 'SEK'}</Badge>
        </div>
        {data.data.map((rate: any, i: number) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-sm border">
            <span className="font-mono text-sm">{rate.currency}</span>
            <span className="font-mono text-sm font-medium">{rate.rate.toFixed(4)}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function SportsContent({ data, isLoading, error }: { data: any; isLoading: boolean; error: string | null }) {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data?.data?.length) return <EmptyState />;
  
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-2">
        {data.data.map((match: any, i: number) => (
          <div key={i} className="p-3 rounded-sm border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{match.home_team}</span>
              <span className="font-mono text-lg font-bold">
                {match.home_score ?? '-'} : {match.away_score ?? '-'}
              </span>
              <span className="text-sm font-medium text-right">{match.away_team}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground font-mono">[{match.date}]</span>
              <span className="text-xs text-muted-foreground">{match.venue}</span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function GovernmentContent({ data, isLoading, error }: { data: any; isLoading: boolean; error: string | null }) {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data?.data?.length) return <EmptyState />;
  
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-3">
        {data.data.map((dataset: any, i: number) => (
          <div key={i} className="p-3 rounded-sm border">
            <p className="text-sm font-medium line-clamp-2">{dataset.title}</p>
            {dataset.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {dataset.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground font-mono">[{dataset.publisher}]</span>
              {dataset.formats?.slice(0, 3).map((format: string, j: number) => (
                <Badge key={j} variant="secondary" className="text-xs">
                  {format}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-[200px]">
      <div className="text-center">
        <div className="animate-pulse font-mono text-sm text-muted-foreground">
          [HÄMTAR DATA...]
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="flex items-center justify-center h-[200px]">
      <div className="text-center">
        <p className="font-mono text-sm text-destructive">[FEL]</p>
        <p className="text-xs text-muted-foreground mt-1">{error}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center h-[200px]">
      <div className="text-center">
        <p className="font-mono text-sm text-muted-foreground">[INGEN DATA]</p>
        <p className="text-xs text-muted-foreground mt-1">Klicka på uppdatera för att hämta data</p>
      </div>
    </div>
  );
}
