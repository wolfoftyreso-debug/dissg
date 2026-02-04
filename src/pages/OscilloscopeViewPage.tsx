/**
 * OSCILLOSCOPE VIEW PAGE - Pedagogisk version
 * 
 * En "pulstagare" för samhället - som en hjärtmonitor fast för hela Sverige.
 * Designad så en 15-åring kan förstå och använda den.
 */

import React, { useState, useEffect } from 'react';
import { OscilloscopeView } from '@/components/lambda';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  type OscilloscopeConfig,
  type SignalTrace,
  type SignalWarning,
  type SystemStatus,
  type TimeBase,
  type OscilloscopeChannel,
} from '@/lib/lambda/oscilloscope-mode';

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

// Signal presets med enkla förklaringar
const SIGNAL_PRESETS: Array<{ 
  id: string; 
  name: string; 
  simpleExplanation: string;
  channels: OscilloscopeChannel[];
}> = [
  {
    id: 'economic',
    name: 'Pengasignaler',
    simpleExplanation: 'Visar hur det går för Sveriges ekonomi - tjänar folk pengar, har de jobb?',
    channels: [
      createChannel('gdp', 'Hur rika vi blir (BNP)', 'hsl(142, 76%, 45%)'),
      createChannel('employment', 'Hur många som har jobb', 'hsl(217, 91%, 60%)'),
      createChannel('inflation', 'Hur dyrt allt blir', 'hsl(24, 95%, 53%)'),
    ],
  },
  {
    id: 'demographic',
    name: 'Befolkningssignaler',
    simpleExplanation: 'Visar hur Sveriges befolkning förändras - föds barn, flyttar folk hit?',
    channels: [
      createChannel('population', 'Antal människor', 'hsl(263, 70%, 50%)'),
      createChannel('birth_rate', 'Hur många barn föds', 'hsl(330, 81%, 60%)'),
      createChannel('migration', 'Flytt till/från Sverige', 'hsl(172, 66%, 50%)'),
    ],
  },
  {
    id: 'health',
    name: 'Hälsosignaler',
    simpleExplanation: 'Visar hur friska svenskarna är - lever vi länge, mår vi bra?',
    channels: [
      createChannel('life_exp', 'Hur länge vi lever', 'hsl(142, 76%, 45%)'),
      createChannel('healthcare_load', 'Tryck på sjukvården', 'hsl(0, 84%, 60%)'),
      createChannel('mental_health', 'Psykisk hälsa', 'hsl(270, 70%, 60%)'),
    ],
  },
  {
    id: 'education',
    name: 'Skolsignaler',
    simpleExplanation: 'Visar hur det går i skolan - lär sig eleverna, hoppar någon av?',
    channels: [
      createChannel('literacy', 'PISA-resultat', 'hsl(217, 91%, 60%)'),
      createChannel('enrollment', 'Antal i skolan', 'hsl(142, 76%, 45%)'),
      createChannel('dropout', 'Som hoppar av', 'hsl(0, 84%, 60%)'),
    ],
  },
];

// Pedagogisk onboarding-komponent
const WelcomeCard: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => (
  <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 mb-6">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <span className="text-4xl">💓</span>
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2">Vad är detta?</h2>
          <p className="text-muted-foreground mb-4">
            Tänk dig en <strong className="text-foreground">hjärtmonitor på sjukhus</strong> - den visar 
            hjärtats slag som en våglinje. Den här sidan gör samma sak, fast för <strong className="text-foreground">hela Sverige</strong>!
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-background/80">
              <p className="font-medium mb-1">[↑] Linjen går uppåt</p>
              <p className="text-sm text-muted-foreground">= Det ökar (fler jobb, mer pengar, osv.)</p>
            </div>
            <div className="p-3 rounded-lg bg-background/80">
              <p className="font-medium mb-1">[↓] Linjen går nedåt</p>
              <p className="text-sm text-muted-foreground">= Det minskar</p>
            </div>
            <div className="p-3 rounded-lg bg-background/80">
              <p className="font-medium mb-1">[~] Linjen hoppar mycket</p>
              <p className="text-sm text-muted-foreground">= Ostadig situation</p>
            </div>
          </div>
          <Button onClick={onDismiss} className="w-full sm:w-auto">
            Jag fattar – visa mig signalerna
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Hjälp-dialog med visuella förklaringar
const HelpDialog: React.FC = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" size="sm" className="gap-2">
        [?] Hur läser jag detta?
      </Button>
    </DialogTrigger>
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Så här läser du signalerna</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-semibold">De olika linjerna</h3>
          <p className="text-sm text-muted-foreground">
            Varje färgad linje representerar en mätning. Klicka på en linjes namn 
            längst ner för att dölja/visa den.
          </p>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-semibold">Vad betyder rörelserna?</h3>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-3 p-2 rounded bg-muted/50">
              <span className="text-lg">📈</span>
              <div>
                <p className="font-medium">Uppåt = ökning</p>
                <p className="text-muted-foreground">Värdet växer (t.ex. fler jobb)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded bg-muted/50">
              <span className="text-lg">📉</span>
              <div>
                <p className="font-medium">Nedåt = minskning</p>
                <p className="text-muted-foreground">Värdet krymper</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded bg-muted/50">
              <span className="text-lg">📊</span>
              <div>
                <p className="font-medium">Hoppig linje = osäkerhet</p>
                <p className="text-muted-foreground">Mycket förändring, svårare att förutsäga</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded bg-muted/50">
              <span className="text-lg">➡️</span>
              <div>
                <p className="font-medium">Rak linje = stabilt</p>
                <p className="text-muted-foreground">Inte mycket förändring</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-semibold">Det suddiga området</h3>
          <p className="text-sm text-muted-foreground">
            Den genomskinliga ytan runt varje linje visar <strong>osäkerheten</strong> i mätningen. 
            Bredare = mer osäker data. Smalare = pålitligare data.
          </p>
        </div>
        
        <div className="p-3 rounded-lg border bg-amber-500/10 border-amber-500/30">
          <p className="text-sm">
            <strong className="text-amber-700">Kom ihåg:</strong> Bara för att två linjer rör sig 
            samtidigt betyder det inte att den ena <em>orsakar</em> den andra. Det kan vara slump!
          </p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

// Preset-kort med tydlig förklaring
const PresetCard: React.FC<{
  preset: typeof SIGNAL_PRESETS[0];
  isActive: boolean;
  onClick: () => void;
}> = ({ preset, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      'p-4 rounded-lg border text-left transition-all w-full',
      isActive 
        ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
        : 'border-border hover:border-primary/50 hover:bg-muted/50'
    )}
  >
    <p className="font-semibold mb-1">{preset.name}</p>
    <p className="text-sm text-muted-foreground">{preset.simpleExplanation}</p>
    <div className="flex gap-2 mt-3">
      {preset.channels.map(ch => (
        <div 
          key={ch.id} 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: ch.color }}
          title={ch.label}
        />
      ))}
    </div>
  </button>
);

// Enkel signalstatus
const SignalStatusCard: React.FC<{
  channel: OscilloscopeChannel;
  trace: SignalTrace | undefined;
}> = ({ channel, trace }) => {
  if (!trace) return null;
  
  const current = trace.values[trace.values.length - 1] || 0;
  const prev = trace.values[trace.values.length - 2] || current;
  const change = current - prev;
  const isUp = change > 0.5;
  const isDown = change < -0.5;
  
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
      <div 
        className="w-4 h-4 rounded-full shrink-0"
        style={{ backgroundColor: channel.color }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{channel.label}</p>
      </div>
      <div className="text-right">
        <p className="font-mono font-bold text-lg">{current.toFixed(0)}</p>
        <p className={cn(
          'text-xs font-mono',
          isUp && 'text-emerald-600',
          isDown && 'text-red-600',
          !isUp && !isDown && 'text-muted-foreground'
        )}>
          {isUp ? '[↑]' : isDown ? '[↓]' : '[→]'} {isUp && '+'}{change.toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default function OscilloscopeViewPage() {
  const [showWelcome, setShowWelcome] = useState(true);
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
  
  const warnings: SignalWarning[] = [];
  
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
      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sveriges Pulstagare</h1>
            <p className="text-muted-foreground max-w-xl">
              Se hur det går för Sverige i realtid. Linjerna visar mätningar som uppdateras hela tiden.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <HelpDialog />
            <Button
              variant={isLive ? "destructive" : "default"}
              onClick={() => setIsLive(!isLive)}
              className="gap-2"
            >
              {isLive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Stoppa live
                </>
              ) : (
                '[▶] Starta live'
              )}
            </Button>
          </div>
        </div>
        
        {/* Welcome onboarding */}
        {showWelcome && <WelcomeCard onDismiss={() => setShowWelcome(false)} />}
        
        {/* Preset selection - mobile friendly */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            Vad vill du se? Välj en kategori:
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SIGNAL_PRESETS.map(preset => (
              <PresetCard
                key={preset.id}
                preset={preset}
                isActive={activePreset.id === preset.id}
                onClick={() => setActivePreset(preset)}
              />
            ))}
          </div>
        </div>
        
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
        
        {/* Simple signal cards */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Just nu visar signalerna:</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {activePreset.channels.filter(c => c.visible).map(channel => (
              <SignalStatusCard
                key={channel.id}
                channel={channel}
                trace={traces.find(t => t.channel_id === channel.id)}
              />
            ))}
          </div>
        </div>
        
        {/* Time selector - simpler */}
        <div className="mt-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            Hur långt tillbaka vill du se?
          </h2>
          <Tabs value={timeBase} onValueChange={(v) => setTimeBase(v as TimeBase)}>
            <TabsList>
              <TabsTrigger value="1m">1 månad</TabsTrigger>
              <TabsTrigger value="3m">3 månader</TabsTrigger>
              <TabsTrigger value="1y">1 år</TabsTrigger>
              <TabsTrigger value="5y">5 år</TabsTrigger>
              <TabsTrigger value="10y">10 år</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Footer with important disclaimer */}
        <Card className="mt-8 border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-amber-700 mb-1">Viktigt att förstå</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Korrelation ≠ orsak:</strong> Bara för att två linjer går åt samma håll betyder det inte att den ena påverkar den andra</li>
                  <li>• <strong>Data är inte hela sanningen:</strong> Det finns alltid saker som inte går att mäta</li>
                  <li>• <strong>Titta på trenden, inte enskilda hopp:</strong> Ett tillfälligt hopp kan vara slump</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
