import React from 'react';
import { useFeedStats, useFeedSubscriptions } from '@/hooks/useIntelligenceFeeds';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  Zap,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Settings,
  ExternalLink,
} from 'lucide-react';
import { FeedCatalog } from './FeedCatalog';
import { FeedEventViewer } from './FeedEventViewer';
import { FeedSubscriptionManager } from './FeedSubscriptionManager';

import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface FeedDashboardProps {
  className?: string;
}

export function FeedDashboard({ className }: FeedDashboardProps) {
  const { data: stats, isLoading: statsLoading } = useFeedStats();
  const { data: subscriptions } = useFeedSubscriptions();

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Intelligence Feeds</h1>
        <p className="text-muted-foreground">
          Prenumerera på signaler och låt systemet meddela dig när något är värt uppmärksamhet.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Dagens händelser</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-12 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.todayEvents || 0}</p>
                )}
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Senaste veckan</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-12 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.weekEvents || 0}</p>
                )}
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Kritiska varningar</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-12 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-red-500">
                    {stats?.criticalEvents || 0}
                  </p>
                )}
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500/30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Aktiva feeds</p>
                <p className="text-2xl font-bold text-primary">
                  {subscriptions?.length || 0}
                </p>
              </div>
              <Bell className="h-8 w-8 text-primary/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Value proposition */}
      <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Låt systemet jobba åt dig</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Istället för att manuellt leta efter förändringar – prenumerera på feeds
                och få meddelanden när något är värt din uppmärksamhet. Feeds är push,
                inte pull; kontinuerliga, inte ad hoc; filtrerade, inte brusiga.
              </p>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <Badge variant="outline" className="bg-green-500/20 text-green-400">
                    🟢 Öppen
                  </Badge>
                  Sammanfattningar
                </span>
                <span className="flex items-center gap-1">
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-400">
                    🔵 Plus
                  </Badge>
                  Tidiga signaler
                </span>
                <span className="flex items-center gap-1">
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-400">
                    🟣 Pro
                  </Badge>
                  Prioriterade varningar
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">
            <Zap className="h-4 w-4 mr-2" />
            Senaste händelser
          </TabsTrigger>
          <TabsTrigger value="catalog">
            <Bell className="h-4 w-4 mr-2" />
            Feed-katalog
          </TabsTrigger>
          <TabsTrigger value="subscriptions">
            <Settings className="h-4 w-4 mr-2" />
            Mina feeds
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <FeedEventViewer maxHeight="700px" />
        </TabsContent>

        <TabsContent value="catalog">
          <FeedCatalog />
        </TabsContent>

        <TabsContent value="subscriptions">
          <div className="grid gap-6 lg:grid-cols-2">
            <FeedSubscriptionManager />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">API & Webhooks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Integrera feeds direkt i dina system via API, webhooks eller SSE.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">REST API</p>
                      <p className="text-xs text-muted-foreground">Poll-baserad hämtning</p>
                    </div>
                    <Badge variant="outline">Aktiv</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Webhooks</p>
                      <p className="text-xs text-muted-foreground">Push till din endpoint</p>
                    </div>
                    <Badge variant="outline">Konfigurera</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Server-Sent Events</p>
                      <p className="text-xs text-muted-foreground">Realtidsström</p>
                    </div>
                    <Badge variant="outline">Beta</Badge>
                  </div>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <Link to="/om">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    API-dokumentation
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
