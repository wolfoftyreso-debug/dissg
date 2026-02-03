/**
 * 📜 Historical Replay Engine
 * 
 * "We should have seen this" – retrospective analysis of ignored signals.
 * Counterfactual exploration without hindsight bias.
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  History, 
  AlertTriangle, 
  TrendingDown,
  Calendar,
  Eye,
  EyeOff,
  ChevronRight,
  ExternalLink,
  Info,
  Play,
  Pause
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Historical case studies with signals that were available
const HISTORICAL_CASES = [
  {
    id: 'financial-crisis-2008',
    title: 'Finanskrisen 2008',
    subtitle: 'Kreditbubblan som syntes i data',
    date: '2008-09',
    impactLevel: 'critical',
    signals: [
      { 
        date: '2006-Q2', 
        indicator: 'Hushållens skuldsättning',
        value: '165% av disponibel inkomst',
        deviation: '+23% över 5-årssnitt',
        visibleAt: 0.3
      },
      { 
        date: '2007-Q1', 
        indicator: 'Bostadsprisökning',
        value: '+12% årlig takt',
        deviation: '3x historiskt snitt',
        visibleAt: 0.5
      },
      { 
        date: '2007-Q3', 
        indicator: 'Kreditspreadar',
        value: '+180 baspunkter',
        deviation: 'Högsta på 4 år',
        visibleAt: 0.7
      },
      { 
        date: '2008-Q2', 
        indicator: 'Interbankräntor',
        value: 'LIBOR-OIS +85bp',
        deviation: 'Stresstillstånd',
        visibleAt: 0.9
      }
    ],
    outcome: 'BNP föll 5.2% under 2009. Arbetslösheten steg från 6.1% till 8.9%.',
    lessonsAvailable: [
      'Skuldsättningsindikatorer var tillgängliga',
      'Avvikelser från historiska medelvärden synliga',
      'Stresstester i bankdata publicerades'
    ],
    caveat: 'Att signaler fanns betyder inte att timing var förutsägbar.'
  },
  {
    id: 'covid-second-wave-2020',
    title: 'Covid-19 andra vågen',
    subtitle: 'Signaler som föregick hösten 2020',
    date: '2020-10',
    impactLevel: 'high',
    signals: [
      { 
        date: '2020-07', 
        indicator: 'R-tal Stockholm',
        value: '0.8 → 1.2',
        deviation: 'Vändning uppåt',
        visibleAt: 0.2
      },
      { 
        date: '2020-08', 
        indicator: 'IVA-beläggning trend',
        value: '+15% månad-över-månad',
        deviation: 'Brott mot nedåttrend',
        visibleAt: 0.4
      },
      { 
        date: '2020-09', 
        indicator: 'Positivitetsgrad tester',
        value: '2.1% → 4.8%',
        deviation: '+129% ökning',
        visibleAt: 0.6
      },
      { 
        date: '2020-09', 
        indicator: 'Mobilitetsdata (arbetsplatser)',
        value: '+18% vs sommaren',
        deviation: 'Återgång till kontorsarbete',
        visibleAt: 0.8
      }
    ],
    outcome: 'Andra vågen resulterade i fler dödsfall än första vågen.',
    lessonsAvailable: [
      'R-tal vände uppåt 6 veckor före toppen',
      'Mobilitetsdata visade beteendeförändring',
      'Testkapacitet maskerade initial spridning'
    ],
    caveat: 'Att signaler fanns betyder inte att exakt tidpunkt var förutsägbar.'
  },
  {
    id: 'inflation-2022',
    title: 'Inflationschocken 2022',
    subtitle: 'Prissignaler som ackumulerades',
    date: '2022-06',
    impactLevel: 'high',
    signals: [
      { 
        date: '2021-Q2', 
        indicator: 'Producentpriser (PPI)',
        value: '+8.1% årsbasis',
        deviation: 'Högsta sedan 2008',
        visibleAt: 0.25
      },
      { 
        date: '2021-Q3', 
        indicator: 'Fraktpriser (Baltic Dry)',
        value: '+280% YoY',
        deviation: 'Historisk peak',
        visibleAt: 0.4
      },
      { 
        date: '2021-Q4', 
        indicator: 'Energipriser spot',
        value: 'El +340%, Gas +520%',
        deviation: 'Alla rekord slagna',
        visibleAt: 0.55
      },
      { 
        date: '2022-Q1', 
        indicator: 'Kärninflation (KPIF-XE)',
        value: '3.4%',
        deviation: 'Bryter 2%-målet',
        visibleAt: 0.75
      }
    ],
    outcome: 'KPIF nådde 10.2% i december 2022. Riksbanken höjde räntan snabbast sedan 90-talet.',
    lessonsAvailable: [
      'PPI ledde KPI med 6-9 månader',
      'Energimarknader signalerade tidigt',
      'Centralbanksprognoser underskattade konsekvent'
    ],
    caveat: 'Att signaler fanns betyder inte att politisk respons var självklar.'
  }
];

function SignalTimeline({ 
  signals, 
  currentPosition 
}: { 
  signals: typeof HISTORICAL_CASES[0]['signals'];
  currentPosition: number;
}) {
  return (
    <div className="space-y-3">
      {signals.map((signal, idx) => {
        const isVisible = signal.visibleAt <= currentPosition;
        
        return (
          <div 
            key={idx}
            className={cn(
              "p-3 rounded-lg border transition-all duration-500",
              isVisible 
                ? "bg-card border-border" 
                : "bg-muted/30 border-dashed opacity-50"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                {isVisible ? (
                  <Eye className="h-4 w-4 text-amber-500" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <div className="font-medium text-sm">{signal.indicator}</div>
                  <div className="text-xs text-muted-foreground">{signal.date}</div>
                </div>
              </div>
              {isVisible && (
                <div className="text-right">
                  <div className="text-sm font-mono">{signal.value}</div>
                  <div className="text-xs text-amber-600">{signal.deviation}</div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CaseCard({ 
  caseData, 
  isExpanded, 
  onToggle 
}: { 
  caseData: typeof HISTORICAL_CASES[0];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [timePosition, setTimePosition] = useState([0]);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Auto-play effect
  useState(() => {
    if (isPlaying && isExpanded) {
      const interval = setInterval(() => {
        setTimePosition(prev => {
          const newVal = Math.min(prev[0] + 0.05, 1);
          if (newVal >= 1) setIsPlaying(false);
          return [newVal];
        });
      }, 200);
      return () => clearInterval(interval);
    }
  });
  
  return (
    <Card className="overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              caseData.impactLevel === 'critical' ? 'bg-rose-500/10' : 'bg-amber-500/10'
            )}>
              <AlertTriangle className={cn(
                "h-5 w-5",
                caseData.impactLevel === 'critical' ? 'text-rose-500' : 'text-amber-500'
              )} />
            </div>
            <div>
              <h3 className="font-semibold">{caseData.title}</h3>
              <p className="text-sm text-muted-foreground">{caseData.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              {caseData.date}
            </Badge>
            <ChevronRight className={cn(
              "h-5 w-5 transition-transform",
              isExpanded && "rotate-90"
            )} />
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 pt-0 border-t">
          {/* Time slider */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                Tidslinje: {(timePosition[0] * 100).toFixed(0)}% mot händelsen
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
            <Slider
              value={timePosition}
              onValueChange={setTimePosition}
              max={1}
              step={0.05}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Tidiga signaler</span>
              <span>Händelsen inträffar</span>
            </div>
          </div>
          
          {/* Signal timeline */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Observerade signaler</h4>
            <SignalTimeline signals={caseData.signals} currentPosition={timePosition[0]} />
          </div>
          
          {/* Outcome */}
          <div className="p-3 rounded-lg bg-muted/50 mb-4">
            <div className="flex items-start gap-2">
              <TrendingDown className="h-4 w-4 text-rose-500 mt-0.5" />
              <div>
                <div className="text-sm font-medium">Utfall</div>
                <div className="text-sm text-muted-foreground">{caseData.outcome}</div>
              </div>
            </div>
          </div>
          
          {/* Lessons */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Vad som var observerbart</h4>
            <ul className="space-y-1">
              {caseData.lessonsAvailable.map((lesson, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {lesson}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Caveat */}
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-600 mt-0.5" />
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Viktig begränsning:</strong> {caseData.caveat}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function HistoricalReplay() {
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">Historical Replay</span>
            <Badge variant="outline" className="text-xs">Retrospektiv</Badge>
          </div>
          <Link 
            to="/public"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            Dashboard <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            "Vi borde sett detta"
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Historiska händelser och de signaler som var tillgängliga innan de inträffade.
            Inte hindsight bias – endast data som faktiskt publicerades.
          </p>
        </div>
        
        {/* Methodology notice */}
        <Card className="p-4 mb-8 bg-muted/30 border-dashed">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Vad detta visar:</strong> Indikatorer som publicerades före händelsen och avvek från historiska normer.</p>
              <p><strong>Vad detta inte visar:</strong> Att händelsen var förutsägbar eller att rätt respons var uppenbar.</p>
              <p><strong>Syfte:</strong> Förstå vilken information som var tillgänglig – inte skuldbelägga.</p>
            </div>
          </div>
        </Card>
        
        {/* Case studies */}
        <div className="space-y-4">
          {HISTORICAL_CASES.map(caseData => (
            <CaseCard 
              key={caseData.id}
              caseData={caseData}
              isExpanded={expandedCase === caseData.id}
              onToggle={() => setExpandedCase(
                expandedCase === caseData.id ? null : caseData.id
              )}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
