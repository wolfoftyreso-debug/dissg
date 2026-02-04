/**
 * SYSTEM LOG PAGE
 * 
 * Complete audit trail for DISSG system.
 * Shows all data changes, API calls, user actions, and system events.
 * 
 * Principle: Full transparency - every action is logged and traceable.
 */

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ODISHeader, ODISFooter } from '@/components/gdis';

type LogLevel = 'info' | 'warning' | 'error' | 'critical' | 'debug';
type LogCategory = 'data' | 'api' | 'auth' | 'system' | 'user' | 'security';

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  action: string;
  entity_type?: string;
  entity_id?: string;
  actor?: string;
  ip_address?: string;
  details?: string;
  context?: Record<string, unknown>;
}

const LEVEL_CONFIG: Record<LogLevel, { label: string; color: string }> = {
  debug: { label: '[DEBUG]', color: 'text-muted-foreground' },
  info: { label: '[INFO]', color: 'text-foreground' },
  warning: { label: '[WARN]', color: 'text-status-warning' },
  error: { label: '[ERROR]', color: 'text-status-critical' },
  critical: { label: '[CRIT]', color: 'text-status-critical font-bold' },
};

const CATEGORY_CONFIG: Record<LogCategory, { label: string; marker: string }> = {
  data: { label: 'Dataändringar', marker: '[DATA]' },
  api: { label: 'API-anrop', marker: '[API]' },
  auth: { label: 'Autentisering', marker: '[AUTH]' },
  system: { label: 'Systemhändelser', marker: '[SYS]' },
  user: { label: 'Användaråtgärder', marker: '[USER]' },
  security: { label: 'Säkerhet', marker: '[SEC]' },
};

const TIME_RANGES = [
  { id: '1h', label: '1 timme', hours: 1 },
  { id: '24h', label: '24 timmar', hours: 24 },
  { id: '7d', label: '7 dagar', hours: 168 },
  { id: '30d', label: '30 dagar', hours: 720 },
  { id: 'all', label: 'Alla', hours: 8760 },
];

export default function SystemLog() {
  const [activeTab, setActiveTab] = useState<LogCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('24h');
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'all'>('all');

  // Fetch audit logs from database
  const { data: auditLogs } = useQuery({
    queryKey: ['audit-logs', timeRange],
    queryFn: async () => {
      const range = TIME_RANGES.find(r => r.id === timeRange);
      const since = subDays(new Date(), (range?.hours || 24) / 24);
      
      const { data, error } = await supabase
        .from('analysis_audit_log')
        .select('*')
        .gte('logged_at', since.toISOString())
        .order('logged_at', { ascending: false })
        .limit(500);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch API usage logs
  const { data: apiLogs } = useQuery({
    queryKey: ['api-usage-logs', timeRange],
    queryFn: async () => {
      const range = TIME_RANGES.find(r => r.id === timeRange);
      const since = subDays(new Date(), (range?.hours || 24) / 24);
      
      const { data, error } = await supabase
        .from('api_usage_log')
        .select('*')
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: false })
        .limit(500);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch trust log entries
  const { data: trustLogs } = useQuery({
    queryKey: ['trust-logs', timeRange],
    queryFn: async () => {
      const range = TIME_RANGES.find(r => r.id === timeRange);
      const since = subDays(new Date(), (range?.hours || 24) / 24);
      
      const { data, error } = await supabase
        .from('trust_log')
        .select('*')
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: false })
        .limit(500);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Combine all logs into unified format
  const allLogs = useMemo<LogEntry[]>(() => {
    const logs: LogEntry[] = [];

    // Convert audit logs
    auditLogs?.forEach(log => {
      logs.push({
        id: log.id,
        timestamp: log.logged_at,
        level: 'info',
        category: 'data',
        action: log.action,
        entity_type: log.entity_type,
        entity_id: log.entity_id,
        actor: log.actor || undefined,
        context: log.context as Record<string, unknown> || undefined,
      });
    });

    // Convert API logs
    apiLogs?.forEach(log => {
      const isError = log.response_status && log.response_status >= 400;
      logs.push({
        id: log.id,
        timestamp: log.created_at || '',
        level: isError ? 'error' : 'info',
        category: 'api',
        action: `${log.method} ${log.endpoint}`,
        details: `Status: ${log.response_status || 'N/A'}, ${log.response_time_ms || 0}ms`,
        ip_address: log.ip_address?.toString(),
        context: log.query_params as Record<string, unknown> || undefined,
      });
    });

    // Convert trust logs
    trustLogs?.forEach(log => {
      logs.push({
        id: log.id,
        timestamp: log.created_at || '',
        level: 'info',
        category: 'system',
        action: log.change_type,
        entity_type: log.scope,
        entity_id: log.id,
        details: log.reason || undefined,
      });
    });

    // Sort by timestamp descending
    return logs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [auditLogs, apiLogs, trustLogs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return allLogs.filter(log => {
      // Category filter
      if (activeTab !== 'all' && log.category !== activeTab) return false;
      
      // Level filter
      if (levelFilter !== 'all' && log.level !== levelFilter) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesAction = log.action.toLowerCase().includes(query);
        const matchesEntity = log.entity_type?.toLowerCase().includes(query);
        const matchesDetails = log.details?.toLowerCase().includes(query);
        const matchesActor = log.actor?.toLowerCase().includes(query);
        if (!matchesAction && !matchesEntity && !matchesDetails && !matchesActor) {
          return false;
        }
      }
      
      return true;
    });
  }, [allLogs, activeTab, levelFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => ({
    total: allLogs.length,
    errors: allLogs.filter(l => l.level === 'error' || l.level === 'critical').length,
    warnings: allLogs.filter(l => l.level === 'warning').length,
    api: allLogs.filter(l => l.category === 'api').length,
    security: allLogs.filter(l => l.category === 'security').length,
  }), [allLogs]);

  return (
    <div className="min-h-screen bg-background font-mono">
      <ODISHeader 
        systemName="SYSTEM LOG — Audit Trail & Event History"
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">[TOTAL]</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-status-critical">{stats.errors}</div>
              <div className="text-xs text-muted-foreground">[ERRORS]</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-status-warning">{stats.warnings}</div>
              <div className="text-xs text-muted-foreground">[WARNINGS]</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.api}</div>
              <div className="text-xs text-muted-foreground">[API CALLS]</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.security}</div>
              <div className="text-xs text-muted-foreground">[SECURITY]</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <Input
                placeholder="Sök i loggar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs font-mono"
              />
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_RANGES.map(range => (
                    <SelectItem key={range.id} value={range.id}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={levelFilter} onValueChange={(v) => setLevelFilter(v as LogLevel | 'all')}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Nivå" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla nivåer</SelectItem>
                  {Object.entries(LEVEL_CONFIG).map(([level, config]) => (
                    <SelectItem key={level} value={level}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="ml-auto text-sm text-muted-foreground">
                Visar {filteredLogs.length} av {allLogs.length} poster
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Log Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LogCategory | 'all')}>
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="all" className="font-mono text-xs">[ALLA]</TabsTrigger>
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <TabsTrigger key={key} value={key} className="font-mono text-xs">
                {config.marker}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardHeader className="py-3 px-4 border-b">
                <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground font-bold">
                  <div className="col-span-2">TIMESTAMP</div>
                  <div className="col-span-1">LEVEL</div>
                  <div className="col-span-1">CATEGORY</div>
                  <div className="col-span-4">ACTION</div>
                  <div className="col-span-2">ENTITY</div>
                  <div className="col-span-2">ACTOR</div>
                </div>
              </CardHeader>
              <ScrollArea className="h-[500px]">
                <CardContent className="p-0">
                  {filteredLogs.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <div className="text-2xl mb-2">—</div>
                      <p>Inga loggposter matchar filtret</p>
                      <p className="text-xs mt-1">[NO_LOGS]</p>
                    </div>
                  ) : (
                    filteredLogs.map((log, idx) => (
                      <div 
                        key={log.id}
                        className={cn(
                          "grid grid-cols-12 gap-2 px-4 py-2 text-xs border-b hover:bg-muted/50 transition-colors",
                          idx % 2 === 0 && "bg-muted/20"
                        )}
                      >
                        <div className="col-span-2 text-muted-foreground">
                          {log.timestamp ? format(parseISO(log.timestamp), 'yyyy-MM-dd HH:mm:ss') : '—'}
                        </div>
                        <div className={cn("col-span-1", LEVEL_CONFIG[log.level].color)}>
                          {LEVEL_CONFIG[log.level].label}
                        </div>
                        <div className="col-span-1">
                          {CATEGORY_CONFIG[log.category].marker}
                        </div>
                        <div className="col-span-4 truncate" title={log.action}>
                          {log.action}
                        </div>
                        <div className="col-span-2 truncate text-muted-foreground">
                          {log.entity_type && log.entity_id 
                            ? `${log.entity_type}:${log.entity_id.slice(0, 8)}...`
                            : '—'}
                        </div>
                        <div className="col-span-2 truncate text-muted-foreground">
                          {log.actor || log.ip_address || '—'}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Real-time Log Stream (placeholder for future WebSocket integration) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-mono">[LIVE STREAM]</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/50 rounded border border-dashed">
              <p className="text-sm text-muted-foreground">
                Real-time loggström kommer att aktiveras när WebSocket-integration är konfigurerad.
              </p>
              <p className="text-xs font-mono text-status-warning mt-2">[PENDING_WEBSOCKET]</p>
            </div>
          </CardContent>
        </Card>
      </main>

      <ODISFooter />
    </div>
  );
}
