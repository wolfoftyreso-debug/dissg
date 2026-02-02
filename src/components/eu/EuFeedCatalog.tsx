/**
 * EU Feed Catalog - Prenumererbara EU-datafeeds
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Rss, Bell, TrendingUp, AlertTriangle, BarChart3, 
  Users, Lock, Globe, Zap, Clock 
} from 'lucide-react';
import { useEuFeeds } from '@/hooks/useEuData';
import { euFeedTiers } from '@/config/euConfig';

export function EuFeedCatalog() {
  const { data: feeds, isLoading } = useEuFeeds();

  // Group feeds by tier
  const feedsByTier = feeds?.reduce((acc, feed) => {
    const tier = feed.tier as keyof typeof euFeedTiers;
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(feed);
    return acc;
  }, {} as Record<string, typeof feeds>) || {};

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 h-64" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-orange-500/20">
              <Rss className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">EU Intelligence Feeds</h2>
              <p className="text-muted-foreground">
                Prenumerera på automatiserade signaler och uppdateringar från EU-data.
                Feeds levereras via webhook, API eller SSE beroende på prenumerationstyp.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feed tiers */}
      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(euFeedTiers).map(([tierKey, tierConfig]) => (
          <Card key={tierKey} className="relative overflow-hidden">
            {tierKey === 'pro' && (
              <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                Premium
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {tierKey === 'open' && <Globe className="h-5 w-5 text-green-500" />}
                {tierKey === 'plus' && <Zap className="h-5 w-5 text-blue-500" />}
                {tierKey === 'pro' && <Lock className="h-5 w-5 text-purple-500" />}
                {tierConfig.label}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{tierConfig.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {(feedsByTier[tierKey] || []).map(feed => (
                <FeedCard key={feed.id} feed={feed} />
              ))}
              
              {(feedsByTier[tierKey] || []).length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  Inga feeds i denna kategori
                </div>
              )}
              
              <div className="pt-4 border-t">
                <Button 
                  variant={tierKey === 'pro' ? 'default' : 'outline'} 
                  className="w-full"
                  disabled={tierKey === 'open'}
                >
                  {tierKey === 'open' ? (
                    <>
                      <Globe className="h-4 w-4 mr-2" />
                      Gratis tillgång
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4 mr-2" />
                      Prenumerera
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Use cases */}
      <Card>
        <CardHeader>
          <CardTitle>Användningsområden</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <UseCaseCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Media & Journalistik"
              description="Automatiska notiser om viktiga EU-trender för nyhetsbevakning"
            />
            <UseCaseCard
              icon={<Users className="h-5 w-5" />}
              title="Policy & Forskning"
              description="Strukturerade data för analys och beslutsunderlag"
            />
            <UseCaseCard
              icon={<TrendingUp className="h-5 w-5" />}
              title="Företag & Investering"
              description="Regional intelligens för marknadsbeslut"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface FeedCardProps {
  feed: {
    id: string;
    code: string;
    name: string;
    description: string | null;
    category: string;
    max_events_per_day: number;
    min_nuts_level: number;
    include_clusters: boolean;
  };
}

function FeedCard({ feed }: FeedCardProps) {
  const categoryIcon = {
    summary: <BarChart3 className="h-4 w-4" />,
    anomaly: <AlertTriangle className="h-4 w-4" />,
    trend: <TrendingUp className="h-4 w-4" />,
    alert: <Bell className="h-4 w-4" />,
    policy: <Globe className="h-4 w-4" />,
  }[feed.category] || <Rss className="h-4 w-4" />;

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card/50">
      <div className="p-2 rounded-lg bg-muted">
        {categoryIcon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{feed.name}</div>
        {feed.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {feed.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="text-xs">
            <Clock className="h-2 w-2 mr-1" />
            Max {feed.max_events_per_day}/dag
          </Badge>
          {feed.include_clusters && (
            <Badge variant="outline" className="text-xs">
              <Users className="h-2 w-2 mr-1" />
              Kluster
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

function UseCaseCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border bg-card/50">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default EuFeedCatalog;
