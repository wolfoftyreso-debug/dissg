import React from 'react';
import {
  useFeedSubscriptions,
  useUnsubscribeFromFeed,
  useToggleFeedPause,
  severityConfig,
  tierConfig,
} from '@/hooks/useIntelligenceFeeds';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bell,
  BellOff,
  Pause,
  Play,
  Settings,
  Trash2,
  Webhook,
  Radio,
  Rss,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface FeedSubscriptionManagerProps {
  className?: string;
}

export function FeedSubscriptionManager({ className }: FeedSubscriptionManagerProps) {
  const { user } = useAuth();
  const { data: subscriptions, isLoading } = useFeedSubscriptions();
  const unsubscribeMutation = useUnsubscribeFromFeed();
  const togglePauseMutation = useToggleFeedPause();

  const handleTogglePause = async (subscriptionId: string, currentPaused: boolean) => {
    try {
      await togglePauseMutation.mutateAsync({
        subscriptionId,
        isPaused: !currentPaused,
      });
      toast.success(currentPaused ? 'Prenumeration återaktiverad' : 'Prenumeration pausad');
    } catch {
      toast.error('Kunde inte uppdatera prenumeration');
    }
  };

  const handleUnsubscribe = async (subscriptionId: string) => {
    try {
      await unsubscribeMutation.mutateAsync(subscriptionId);
      toast.success('Prenumeration avslutad');
    } catch {
      toast.error('Kunde inte avsluta prenumeration');
    }
  };

  const getDeliveryIcon = (method: string) => {
    switch (method) {
      case 'webhook':
        return <Webhook className="h-4 w-4" />;
      case 'sse':
        return <Radio className="h-4 w-4" />;
      default:
        return <Rss className="h-4 w-4" />;
    }
  };

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <BellOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-muted-foreground">Logga in för att hantera prenumerationer</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Mina prenumerationer
        </CardTitle>
        <CardDescription>
          Hantera dina aktiva feed-prenumerationer
        </CardDescription>
      </CardHeader>

      <CardContent>
        {subscriptions && subscriptions.length > 0 ? (
          <div className="space-y-3">
            {subscriptions.map((sub) => {
              const feed = sub.feed_definitions;
              const tier = feed?.tier
                ? tierConfig[feed.tier as keyof typeof tierConfig]
                : null;
              const minSeverity = severityConfig[sub.min_severity];

              return (
                <Card
                  key={sub.id}
                  className={`${sub.is_paused ? 'opacity-60' : ''} transition-opacity`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {tier && (
                            <span className="text-sm">{tier.icon}</span>
                          )}
                          <span className="font-medium">
                            {feed?.name || 'Okänd feed'}
                          </span>
                          {sub.is_paused && (
                            <Badge variant="secondary" className="text-xs">
                              Pausad
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {getDeliveryIcon(sub.delivery_method)}
                            {sub.delivery_method.toUpperCase()}
                          </span>
                          <span className="flex items-center gap-1">
                            Min: {minSeverity.label}
                          </span>
                          {sub.region_filter && sub.region_filter.length > 0 && (
                            <span>
                              Regioner: {sub.region_filter.length}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePause(sub.id, sub.is_paused)}
                          disabled={togglePauseMutation.isPending}
                        >
                          {sub.is_paused ? (
                            <Play className="h-4 w-4" />
                          ) : (
                            <Pause className="h-4 w-4" />
                          )}
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Avsluta prenumeration?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Du kommer inte längre att få notifikationer från denna feed.
                                Du kan prenumerera igen när som helst.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Avbryt</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleUnsubscribe(sub.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Avsluta
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Inga aktiva prenumerationer</p>
            <p className="text-xs mt-1">
              Bläddra i feedkatalogen för att prenumerera på signaler
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
