import React from 'react';
import { 
  useFeedDefinitions, 
  useFeedSubscriptions, 
  useSubscribeToFeed,
  useUnsubscribeFromFeed,
  tierConfig 
} from '@/hooks/useIntelligenceFeeds';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Bell, 
  BellOff, 
  Zap, 
  TrendingUp, 
  MapPin, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Lock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface FeedCatalogProps {
  className?: string;
}

export function FeedCatalog({ className }: FeedCatalogProps) {
  const { user } = useAuth();
  const { data: feeds, isLoading: feedsLoading } = useFeedDefinitions();
  const { data: subscriptions, isLoading: subsLoading } = useFeedSubscriptions();
  const subscribeMutation = useSubscribeToFeed();
  const unsubscribeMutation = useUnsubscribeFromFeed();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'summary': return <TrendingUp className="h-4 w-4" />;
      case 'trends': return <Zap className="h-4 w-4" />;
      case 'regional': return <MapPin className="h-4 w-4" />;
      case 'demographic': return <Users className="h-4 w-4" />;
      case 'alerts': return <AlertTriangle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const isSubscribed = (feedId: string) => {
    return subscriptions?.some(s => s.feed_id === feedId);
  };

  const getSubscription = (feedId: string) => {
    return subscriptions?.find(s => s.feed_id === feedId);
  };

  const handleSubscribe = async (feedId: string) => {
    try {
      await subscribeMutation.mutateAsync({ feedId });
      toast.success('Prenumeration aktiverad');
    } catch {
      toast.error('Kunde inte aktivera prenumeration');
    }
  };

  const handleUnsubscribe = async (feedId: string) => {
    const sub = getSubscription(feedId);
    if (!sub) return;
    
    try {
      await unsubscribeMutation.mutateAsync(sub.id);
      toast.success('Prenumeration avslutad');
    } catch {
      toast.error('Kunde inte avsluta prenumeration');
    }
  };

  const groupedFeeds = feeds?.reduce((acc, feed) => {
    if (!acc[feed.tier]) acc[feed.tier] = [];
    acc[feed.tier].push(feed);
    return acc;
  }, {} as Record<string, typeof feeds>);

  if (feedsLoading || subsLoading) {
    return (
      <div className={className}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {(['open', 'plus', 'pro'] as const).map(tier => {
        const tierFeeds = groupedFeeds?.[tier] || [];
        if (tierFeeds.length === 0) return null;

        const config = tierConfig[tier];

        return (
          <div key={tier} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">{config.icon}</span>
              <h3 className="font-semibold text-lg">{config.label} Feeds</h3>
              <Badge variant="secondary" className={config.color}>
                {tierFeeds.length}
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tierFeeds.map(feed => {
                const subscribed = isSubscribed(feed.id);
                const canSubscribe = user || tier === 'open';

                return (
                  <Card 
                    key={feed.id} 
                    className={`relative overflow-hidden transition-all hover:border-primary/50 ${
                      subscribed ? 'border-primary/40 bg-primary/5' : ''
                    }`}
                  >
                    {subscribed && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                    )}

                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-2">
                        <div className={`p-2 rounded-lg ${config.color}`}>
                          {getCategoryIcon(feed.category)}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base">{feed.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs capitalize">
                              {feed.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {feed.default_frequency}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <CardDescription className="text-sm mb-4 line-clamp-2">
                        {feed.description}
                      </CardDescription>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Max {feed.max_events_per_day}/dag
                        </span>

                        {!canSubscribe ? (
                          <Button variant="outline" size="sm" disabled>
                            <Lock className="h-3 w-3 mr-1" />
                            Logga in
                          </Button>
                        ) : subscribed ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUnsubscribe(feed.id)}
                            disabled={unsubscribeMutation.isPending}
                          >
                            <BellOff className="h-3 w-3 mr-1" />
                            Avsluta
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleSubscribe(feed.id)}
                            disabled={subscribeMutation.isPending}
                          >
                            <Bell className="h-3 w-3 mr-1" />
                            Prenumerera
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
