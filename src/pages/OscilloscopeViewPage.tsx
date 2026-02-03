/**
 * OSCILLOSCOPE VIEW PAGE
 * 
 * Full-page oscilloscope mode for viewing societal signals as raw waveforms.
 * No interpretation - just signal traces like an ECU diagnostic.
 */

import React, { useState, useEffect } from 'react';
import { OscilloscopeView } from '@/components/lambda';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Zap, AlertTriangle, TrendingUp, TrendingDown, Minus, Radio } from 'lucide-react';
import {
  type OscilloscopeConfig,
  type SignalTrace,
  type SignalWarning,
  type SystemStatus,
  type TimeBase,
  type OscilloscopeChannel,
} from '@/lib/lambda/oscilloscope-mode';
import { cn } from '@/lib/utils';

// Generate synthetic signal data for demo
function generateSignalData(points: number, baseValue: number, volatility: number): number[] {
  const values: number[] = [];
  let current = baseValue;
  
  for (let i = 0; i < points; i++) {
    const trend = Math.sin(i / (points / 4)) * volatility * 0.3;
    const noise = (Math.random() - 0.5) * volatility * 0.2;
    const spike = Math.random() > 0.95 ? (Math.random() - 0.5) * volatility : 0;
    
    current = current + trend + noise + spike;
    current = Math.max(0, Math.min(100, current));
    values.push(current);
  }
  
  return values;
}

function generateNoiseFloor(points: number): number[] {
  return Array(points).fill(0).map(() => 0.02 + Math.random() * 0.05);
}

// Helper to create channel
function createChannel(id: string, label: string, color: string): OscilloscopeChannel {
  return {
    id,
    label,
    color,
    visible: true,
    signal_type: 'amplitude',
    source_kpi_code: id.toUpperCase(),
    scale: 'auto',
  };
}

// Demo signal presets
const SIGNAL_PRESETS: Array<{ id: string; name: string; channels: OscilloscopeChannel[] }> = [
  {
    id: 'economic',
    name: 'Ekonomiska signaler',
    channels: [
      createChannel('gdp', 'BNP-tillväxt', 'hsl(142, 76%, 45%)'),
      createChannel('employment', 'Sysselsättning', 'hsl(217, 91%, 60%)'),
      createChannel('inflation', 'Inflation', 'hsl(24, 95%, 53%)'),
    ],
  },
  {
    id: 'demographic',
    name: 'Demografiska signaler',
    channels: [
      createChannel('population', 'Befolkning', 'hsl(263, 70%, 50%)'),
      createChannel('birth_rate', 'Födelseantal', 'hsl(330, 81%, 60%)'),
      createChannel('migration', 'Nettomigration', 'hsl(172, 66%, 50%)'),
    ],
  },
  {
    id: 'health',
    name: 'Hälsosignaler',
    channels: [
      createChannel('life_exp', 'Livslängd', 'hsl(142, 76%, 45%)'),
      createChannel('healthcare_load', 'Vårdbelastning', 'hsl(0, 84%, 60%)'),
      createChannel('mental_health', 'Psykisk hälsa', 'hsl(270, 70%, 60%)'),
    ],
  },
  {
    id: 'education',
    name: 'Utbildningssignaler',
    channels: [
      createChannel('literacy', 'PISA-resultat', 'hsl(217, 91%, 60%)'),
      createChannel('enrollment', 'Inskrivning', 'hsl(142, 76%, 45%)'),
      createChannel('dropout', 'Avhopp', 'hsl(0, 84%, 60%)'),
    ],
  },
];

// Signal diagnostics
const SIGNAL_DIAGNOSTICS = [
  { code: 'SIG-001', description: 'Hög volatilitet i BNP-signal', severity: 'warning' as const },
  { code: 'SIG-002', description: 'Fas-förskjutning mellan sysselsättning och tillväxt', severity: 'info' as const },
  { code: 'SIG-003', description: 'Anomali detekterad i migrationsdata', severity: 'critical' as const },
  { code: 'SIG-004', description: 'Signal-brus ratio låg för hälsoindex', severity: 'warning' as const },
];

export default function OscilloscopeViewPage() {
  const [activePreset, setActivePreset] = useState(SIGNAL_PRESETS[0]);
  const [timeBase, setTimeBase] = useState<TimeBase>('1y');
  const [traces, setTraces] = useState<SignalTrace[]>([]);
  const [isLive, setIsLive] = useState(false);
  
  const config: OscilloscopeConfig = {
    channels: activePreset.channels,
    time_base: timeBase,
    view_mode: 'realtime',
    show_grid: true,
    show_noise_floor: true,
    show_warning_thresholds: true,
  };
  
  const warnings: SignalWarning[] = [
    {
      channel_id: 'gdp',
      signal_type: 'amplitude',
      status: 'warning',
      value: 2.3,
      threshold: 3.0,
      message_sv: 'Ökad volatilitet senaste 6 månader',
      message_en: 'Increased volatility last 6 months',
      first_detected: new Date().toISOString(),
      duration_hours: 48,
    },
  ];
  
  const systemStatus: SystemStatus = {
    overall_health: 'stable',
    active_channels: activePreset.channels.filter(c => c.visible).length,
    noise_level: 'low',
    clarity_score: 87,
    data_freshness_hours: 2,
  };
  
  // Generate initial traces
  useEffect(() => {
    const points = 100;
    const newTraces: SignalTrace[] = activePreset.channels.map((channel, idx) => ({
      channel_id: channel.id,
      values: generateSignalData(points, 50 + idx * 10, 15),
      noise_floor: generateNoiseFloor(points),
      timestamps: Array(points).fill(0).map((_, i) => new Date(Date.now() - (points - i) * 86400000).toISOString()),
      quality_markers: Array(points).fill('reliable' as const),
    }));
    setTraces(newTraces);
  }, [activePreset]);
  
  // Live update simulation
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setTraces(prev => prev.map(trace => {
        const newValues = trace.values.slice(1);
        const lastVal = newValues[newValues.length - 1];
        newValues.push(lastVal + (Math.random() - 0.5) * 3);
        return { ...trace, values: newValues };
      }));
    }, 500);
    
    return () => clearInterval(interval);
  }, [isLive]);
  
  const handleChannelToggle = (channelId: string) => {
    setActivePreset(prev => ({
      ...prev,
      channels: prev.channels.map(c => 
        c.id === channelId ? { ...c, visible: !c.visible } : c
      ),
    }));
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Oscilloskop-läge</h1>
              {isLive && (
                <Badge variant="destructive" className="animate-pulse">
                  <Radio className="h-3 w-3 mr-1" />
                  LIVE
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Råa signalspår utan tolkning. Systemet visar vad som mäts – inte vad det betyder.
              Som att läsa av en ECU-diagnostik för civilisationen.
            </p>
          </div>
          
          <Button
            variant={isLive ? "destructive" : "outline"}
            onClick={() => setIsLive(!isLive)}
          >
            <Zap className="h-4 w-4 mr-2" />
            {isLive ? 'Stoppa live' : 'Starta live'}
          </Button>
        </div>
        
        {/* Signal preset tabs */}
        <Tabs value={activePreset.id} onValueChange={(v) => {
          const preset = SIGNAL_PRESETS.find(p => p.id === v);
          if (preset) setActivePreset(preset);
        }}>
          <TabsList className="mb-4">
            {SIGNAL_PRESETS.map(preset => (
              <TabsTrigger key={preset.id} value={preset.id}>
                {preset.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {/* Main oscilloscope */}
        <OscilloscopeView
          config={config}
          traces={traces}
          warnings={warnings}
          systemStatus={systemStatus}
          onTimeBaseChange={setTimeBase}
          onChannelToggle={handleChannelToggle}
          language="sv"
        />
        
        {/* Signal diagnostics */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Signaldiagnostik
              </CardTitle>
              <CardDescription>Automatiskt detekterade signalavvikelser</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {SIGNAL_DIAGNOSTICS.map((diag, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      "p-3 rounded-lg border flex items-start gap-3",
                      diag.severity === 'critical' && "bg-destructive/10 border-destructive/30",
                      diag.severity === 'warning' && "bg-orange-500/10 border-orange-500/30",
                      diag.severity === 'info' && "bg-blue-500/10 border-blue-500/30",
                    )}
                  >
                    <code className="text-xs font-mono text-muted-foreground shrink-0">
                      {diag.code}
                    </code>
                    <span className="text-sm">{diag.description}</span>
                    <Badge 
                      variant={diag.severity === 'critical' ? 'destructive' : 'secondary'}
                      className="ml-auto shrink-0"
                    >
                      {diag.severity === 'critical' ? 'Kritisk' : 
                       diag.severity === 'warning' ? 'Varning' : 'Info'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Signal metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Signalmetrik</CardTitle>
              <CardDescription>Tekniska mätvärden för aktiva kanaler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activePreset.channels.filter(c => c.visible).map((channel) => {
                  const trace = traces.find(t => t.channel_id === channel.id);
                  if (!trace) return null;
                  
                  const current = trace.values[trace.values.length - 1] || 0;
                  const prev = trace.values[trace.values.length - 2] || current;
                  const change = current - prev;
                  const avg = trace.values.reduce((a, b) => a + b, 0) / trace.values.length;
                  const volatility = Math.sqrt(
                    trace.values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / trace.values.length
                  );
                  
                  return (
                    <div key={channel.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div 
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: channel.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{channel.label}</div>
                        <div className="text-xs text-muted-foreground">
                          Volatilitet: {volatility.toFixed(1)} | Snitt: {avg.toFixed(1)}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold">{current.toFixed(1)}</div>
                        <div className={cn(
                          "text-xs flex items-center gap-1 justify-end",
                          change > 0 ? "text-green-500" : change < 0 ? "text-red-500" : "text-muted-foreground"
                        )}>
                          {change > 0 ? <TrendingUp className="h-3 w-3" /> : 
                           change < 0 ? <TrendingDown className="h-3 w-3" /> : 
                           <Minus className="h-3 w-3" />}
                          {change > 0 ? '+' : ''}{change.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Footer disclaimer */}
        <div className="mt-8 p-4 rounded-lg border bg-muted/30 text-sm text-muted-foreground text-center">
          <strong>Oscilloskop-principer:</strong> Visa, tolka inte • Korrelation ≠ kausalitet • 
          Signalen ÄR datan • Brus är information • Ingen politisk färg
        </div>
      </div>
    </div>
  );
}
