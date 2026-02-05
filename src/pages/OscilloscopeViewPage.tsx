/**
 * OSCILLOSCOPE VIEW PAGE - Signalöversikt
 * 
 * En professionell "pulstagare" för civilisationen.
 * GLOBAL FIRST: Startar på global nivå med drill-down.
 * 
 * Design: Klinisk, tydlig, myndighetsdesign.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useGeo } from '@/contexts/GeoContext';
import { OscilloscopeView } from '@/components/lambda';
import { OscilloscopeControlPanel, type GeoSelection } from '@/components/oscilloscope';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  type OscilloscopeConfig,
  type SignalTrace,
  type SignalWarning,
  type SystemStatus,
  type TimeBase,
  type OscilloscopeChannel,
} from '@/lib/lambda/oscilloscope-mode';

// ============================================
// SIGNAL DATA GENERATION
// ============================================

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

// ============================================
// INDICATOR DEFINITIONS
// ============================================

const ALL_INDICATORS: Record<string, { name: string; color: string }> = {
  gdp_growth: { name: 'BNP-tillväxt', color: 'hsl(142, 76%, 45%)' },
  employment: { name: 'Sysselsättning', color: 'hsl(217, 91%, 60%)' },
  inflation: { name: 'Inflation', color: 'hsl(24, 95%, 53%)' },
  trade_balance: { name: 'Handelsbalans', color: 'hsl(263, 70%, 50%)' },
  debt_gdp: { name: 'Statsskuld/BNP', color: 'hsl(330, 81%, 60%)' },
  population: { name: 'Befolkning', color: 'hsl(263, 70%, 50%)' },
  birth_rate: { name: 'Födelsetal', color: 'hsl(330, 81%, 60%)' },
  median_age: { name: 'Medianålder', color: 'hsl(172, 66%, 50%)' },
  dependency_ratio: { name: 'Försörjningskvot', color: 'hsl(45, 93%, 47%)' },
  migration_net: { name: 'Nettomigration', color: 'hsl(199, 89%, 48%)' },
  life_exp: { name: 'Medellivslängd', color: 'hsl(142, 76%, 45%)' },
  infant_mortality: { name: 'Barnadödlighet', color: 'hsl(0, 84%, 60%)' },
  disease_burden: { name: 'Sjukdomsbörda', color: 'hsl(270, 70%, 60%)' },
  healthcare_spending: { name: 'Vårdkostnader', color: 'hsl(199, 89%, 48%)' },
  literacy: { name: 'Läskunnighet', color: 'hsl(217, 91%, 60%)' },
  mean_schooling: { name: 'Skolår (genomsnitt)', color: 'hsl(142, 76%, 45%)' },
  tertiary_enrollment: { name: 'Högskoledeltagande', color: 'hsl(330, 81%, 60%)' },
  co2_emissions: { name: 'CO2-utsläpp', color: 'hsl(45, 93%, 47%)' },
  renewable_energy: { name: 'Förnybar energi', color: 'hsl(142, 76%, 45%)' },
  air_quality: { name: 'Luftkvalitet', color: 'hsl(199, 89%, 48%)' },
};

// ============================================
// SIGNAL STATUS CARD
// ============================================

interface SignalStatusCardProps {
  channel: OscilloscopeChannel;
  trace: SignalTrace | undefined;
  geoName: string;
}

const SignalStatusCard: React.FC<SignalStatusCardProps> = ({ channel, trace, geoName }) => {
  if (!trace) return null;
  
  const current = trace.values[trace.values.length - 1] || 0;
  const prev = trace.values[trace.values.length - 2] || current;
  const change = current - prev;
  const isUp = change > 0.5;
  const isDown = change < -0.5;
  
  return (
    <article className="flex items-center gap-3 p-4 bg-muted/30 border border-border">
      <div 
        className="w-4 h-4 rounded-full shrink-0"
        style={{ backgroundColor: channel.color }}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{channel.label}</p>
        <p className="text-xs text-muted-foreground font-mono">{geoName}</p>
      </div>
      <div className="text-right">
        <p className="font-mono font-bold text-xl tabular-nums">{current.toFixed(0)}</p>
        <p className={cn(
          'text-xs font-mono',
          isUp && 'text-status-stable',
          isDown && 'text-status-critical',
          !isUp && !isDown && 'text-muted-foreground'
        )}>
          {isUp ? '[+]' : isDown ? '[-]' : '[=]'} {isUp && '+'}{change.toFixed(1)}
        </p>
      </div>
    </article>
  );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function OscilloscopeViewPage() {
  useGeo(); // Access context for future geo integration
  
  // Control panel state
  const [geoSelections, setGeoSelections] = useState<GeoSelection[]>([
    { level: 'global', code: 'GLOBAL', name: 'Global' }
  ]);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([
    'gdp_growth', 'employment', 'inflation'
  ]);
  const [timeSpan, setTimeSpan] = useState<string>('1y');
  
  // Oscilloscope state
  const [traces, setTraces] = useState<SignalTrace[]>([]);
  const [isLive, setIsLive] = useState(false);
  
  // Build channels from selected indicators
  const channels: OscilloscopeChannel[] = useMemo(() => {
    return selectedIndicators.map(code => {
      const ind = ALL_INDICATORS[code];
      if (!ind) return null;
      return {
        id: code,
        label: ind.name,
        color: ind.color,
        visible: true,
        signal_type: 'amplitude' as const,
        source_kpi_code: code.toUpperCase(),
        scale: 'auto' as const,
      };
    }).filter(Boolean) as OscilloscopeChannel[];
  }, [selectedIndicators]);
  
  const config: OscilloscopeConfig = {
    channels,
    time_base: timeSpan as TimeBase,
    view_mode: 'realtime',
    show_grid: true,
    show_noise_floor: true,
    show_warning_thresholds: true,
  };
  
  const warnings: SignalWarning[] = [];
  
  const systemStatus: SystemStatus = {
    overall_health: 'stable',
    active_channels: channels.filter(c => c.visible).length,
    noise_level: 'low',
    clarity_score: 87,
    data_freshness_hours: 2,
  };
  
  // Generate traces when indicators change
  useEffect(() => {
    const points = 100;
    const newTraces: SignalTrace[] = channels.map((channel, idx) => ({
      channel_id: channel.id,
      values: generateSignalData(points, 50 + idx * 10, 15),
      noise_floor: generateNoiseFloor(points),
      timestamps: Array(points).fill(0).map((_, i) => 
        new Date(Date.now() - (points - i) * 86400000).toISOString()
      ),
      quality_markers: Array(points).fill('reliable' as const),
    }));
    setTraces(newTraces);
  }, [channels]);
  
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
    if (selectedIndicators.includes(channelId)) {
      setSelectedIndicators(prev => prev.filter(i => i !== channelId));
    }
  };
  
  // Get geo scope title
  const getScopeTitle = () => {
    if (geoSelections.length === 0) return 'Signalöversikt';
    if (geoSelections.length === 1) return `${geoSelections[0].name} Signalöversikt`;
    return `Signalöversikt (${geoSelections.length} områden)`;
  };
  
  const currentDate = new Date().toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  
  return (
    <main className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-start justify-between">
            <div>
              <nav className="text-xs font-mono text-muted-foreground mb-2" aria-label="Breadcrumb">
                <span>{geoSelections[0]?.name || 'Global'}</span>
                <span className="mx-2">[/]</span>
                <span className="text-foreground">Signalöversikt</span>
              </nav>
              <h1 className="text-2xl font-bold">{getScopeTitle()}</h1>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <time className="font-mono text-muted-foreground" dateTime={new Date().toISOString()}>
                {currentDate} · CET
              </time>
              <Button
                variant={isLive ? "destructive" : "default"}
                onClick={() => setIsLive(!isLive)}
                className="font-mono"
              >
                {isLive ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-2" />
                    LIVE
                  </>
                ) : (
                  '[PLAY] Starta live'
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* CONTROL PANEL */}
        <OscilloscopeControlPanel
          geoSelections={geoSelections}
          selectedIndicators={selectedIndicators}
          timeSpan={timeSpan}
          onGeoChange={setGeoSelections}
          onIndicatorsChange={setSelectedIndicators}
          onTimeSpanChange={setTimeSpan}
        />
        
        {/* MAIN OSCILLOSCOPE */}
        {channels.length > 0 ? (
          <OscilloscopeView
            config={config}
            traces={traces}
            warnings={warnings}
            systemStatus={systemStatus}
            onTimeBaseChange={(tb) => setTimeSpan(tb)}
            onChannelToggle={handleChannelToggle}
            language="sv"
          />
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground font-mono">
                [!] Välj minst en indikator för att visa signaler
              </p>
            </CardContent>
          </Card>
        )}
        
        {/* SIGNAL STATUS CARDS */}
        {channels.length > 0 && (
          <section aria-labelledby="signal-status-heading">
            <h2 id="signal-status-heading" className="text-lg font-semibold mb-4">
              Just nu visar signalerna:
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {channels.filter(c => c.visible).map(channel => (
                <SignalStatusCard
                  key={channel.id}
                  channel={channel}
                  trace={traces.find(t => t.channel_id === channel.id)}
                  geoName={geoSelections[0]?.name || 'Global'}
                />
              ))}
            </div>
          </section>
        )}
        
        {/* FOOTER DISCLAIMER */}
        <footer className="pt-6">
          <Card className="border-status-warning/30 bg-status-warning/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="font-mono text-lg text-status-warning">[!]</span>
                <div>
                  <p className="font-semibold text-status-warning mb-1">Viktigt att förstå</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Signalerna visar <strong>observerade mönster</strong>, inte orsaker eller förutsägelser</li>
                    <li>Korrelation mellan signaler innebär inte automatiskt kausalitet</li>
                    <li>Data kan ha olika kvalitet beroende på källa och geografiskt område</li>
                    <li>Alla värden normaliseras för jämförbarhet – se ursprungsdata för absoluta tal</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </footer>
      </div>
    </main>
  );
}
