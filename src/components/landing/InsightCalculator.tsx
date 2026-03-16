/**
 * SYSTEM EXPLANATION SECTION
 * 
 * Tydlig, pedagogisk förklaring av vad DISSG är och hur det fungerar.
 * Designad så en 12-åring förstår.
 */

import React, { useState } from 'react';
import { 
  Activity, TrendingUp, MapPin, Search, ChevronRight, 
  ArrowDown, CheckCircle2, AlertTriangle, Eye, 
  Database, BarChart3, Globe2, Lightbulb, ShieldCheck
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// ── Steg-för-steg förklaring ──────────────────────────────────────────

interface Step {
  number: number;
  emoji: string;
  title: string;
  simple: string;
  analogy: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  details: {
    whatHappens: string;
    example: string;
    whyItMatters: string;
  };
}

const STEPS: Step[] = [
  {
    number: 1,
    emoji: '📊',
    title: 'Vi samlar in fakta',
    simple: 'Vi hämtar siffror från myndigheter i hela världen – arbetslöshet, hälsa, utbildning, trygghet, ekonomi.',
    analogy: 'Som att samla alla provresultat från alla skolor i världen i en enda mapp.',
    icon: <Database className="h-5 w-5" />,
    color: 'text-primary',
    bg: 'bg-primary/10',
    details: {
      whatHappens: 'Varje dag hämtar systemet ny statistik från SCB, Eurostat, WHO, Världsbanken och OECD. Datan kontrolleras automatiskt så att fel inte smyger sig in.',
      example: 'T.ex. "Arbetslösheten i Sverige var 7.4% i mars 2025 (källa: SCB)"',
      whyItMatters: 'Utan tillförlitlig data kan vi inte veta hur samhället faktiskt mår.',
    },
  },
  {
    number: 2,
    emoji: '📈',
    title: 'Vi visar trender',
    simple: 'Blir det bättre eller sämre? Vi visar riktningen med enkla grafer – uppåt, nedåt eller platt.',
    analogy: 'Som att se din längdkurva hos skolsköterskan – fast för hela landet.',
    icon: <BarChart3 className="h-5 w-5" />,
    color: 'text-emerald-600',
    bg: 'bg-emerald-500/10',
    details: {
      whatHappens: 'Vi analyserar hur siffror förändras över tid. Om arbetslösheten var 8% förra året och 7% i år – visar vi en grön pil nedåt (bra!).',
      example: 'Medellivslängden i Sverige: 78.2 (2000) → 83.1 (2024) = uppåttrend ↑',
      whyItMatters: 'En enskild siffra säger lite. Men riktningen visar om vi är på rätt väg.',
    },
  },
  {
    number: 3,
    emoji: '🌍',
    title: 'Vi jämför länder',
    simple: 'Hur ligger Sverige till jämfört med Finland, Danmark eller Japan? Vi rangordnar utan att döma.',
    analogy: 'Som en resultattavla i sportens värld – vi visar poängen, inte vem som "borde" vinna.',
    icon: <Globe2 className="h-5 w-5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-500/10',
    details: {
      whatHappens: 'Vi lägger ländernas siffror bredvid varandra och visar vem som har högst/lägst. Vi tar hänsyn till saker som befolkningsstorlek.',
      example: 'Utbildningspoäng: Finland 92 | Sverige 84 | OECD-snitt 78',
      whyItMatters: 'Utan jämförelse vet vi inte om en siffra är bra eller dålig. Kontext är allt.',
    },
  },
  {
    number: 4,
    emoji: '🔍',
    title: 'Du drar egna slutsatser',
    simple: 'Vi berättar aldrig vad du SKA tycka. Vi visar datan – du bestämmer vad den betyder.',
    analogy: 'Som att ge dig en karta och en kompass. Vart du går bestämmer du själv.',
    icon: <Lightbulb className="h-5 w-5" />,
    color: 'text-amber-600',
    bg: 'bg-amber-500/10',
    details: {
      whatHappens: 'Systemet visar mönster och samband, men säger aldrig "detta borde ni göra". Det visar vad som händer, inte vad som borde hända.',
      example: 'Vi kan visa att länder med hög utbildning ofta har lägre brottslighet – men vi säger inte att det ena orsakar det andra.',
      whyItMatters: 'Ett neutralt system som ingen äger och ingen styr ger dig friheten att tänka själv.',
    },
  },
];

// ── Principkort ───────────────────────────────────────────────────────

const PRINCIPLES = [
  { icon: <Eye className="h-4 w-4" />, label: 'Observation först', desc: 'Vi visar vad som händer, inte vad som borde hända' },
  { icon: <ShieldCheck className="h-4 w-4" />, label: 'Ingen dold agenda', desc: 'Ingen äger systemet. Ingen styr resultaten.' },
  { icon: <AlertTriangle className="h-4 w-4" />, label: 'Öppen osäkerhet', desc: 'Vi visar alltid när vi INTE vet tillräckligt' },
  { icon: <CheckCircle2 className="h-4 w-4" />, label: 'Spårbart till källan', desc: 'Varje siffra går att klicka tillbaka till originalet' },
];

export const InsightCalculator: React.FC = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        {/* Rubrik */}
        <div className="text-center mb-16">
          <p className="text-sm font-mono text-muted-foreground tracking-widest uppercase mb-3">
            Systemförklaring
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
            Vad är DISSG?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Tänk dig en <strong className="text-foreground">hälsoapp – men för hela samhället</strong>. 
            Istället för att mäta din puls och sömn, mäter vi arbetslöshet, utbildningsnivå och trygghet 
            för 195 länder.
          </p>
        </div>

        {/* Steg-för-steg */}
        <div className="space-y-4 mb-16">
          {STEPS.map((step, i) => (
            <div key={step.number}>
              <button
                onClick={() => setExpandedStep(expandedStep === step.number ? null : step.number)}
                className="w-full bg-card border rounded-xl p-5 md:p-6 text-left transition-all hover:shadow-md hover:border-primary/20 group"
              >
                <div className="flex items-start gap-4">
                  {/* Stegnummer */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full ${step.bg} flex items-center justify-center font-bold text-lg ${step.color}`}>
                    {step.number}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-lg">
                        <span className="mr-2">{step.emoji}</span>
                        {step.title}
                      </h3>
                      <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform flex-shrink-0 ${expandedStep === step.number ? 'rotate-90' : ''}`} />
                    </div>
                    <p className="text-muted-foreground">{step.simple}</p>
                    <p className="text-sm text-muted-foreground/70 mt-1 italic">
                      💡 {step.analogy}
                    </p>
                  </div>
                </div>
                
                {/* Expanderad detalj */}
                {expandedStep === step.number && (
                  <div className="mt-5 ml-14 space-y-4 border-t pt-5" onClick={(e) => e.stopPropagation()}>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">🔧 Vad händer under huven?</h4>
                      <p className="text-sm text-muted-foreground">{step.details.whatHappens}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <h4 className="text-sm font-semibold mb-1">📋 Exempel</h4>
                      <p className="text-sm text-muted-foreground font-mono">{step.details.example}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">❓ Varför är detta viktigt?</h4>
                      <p className="text-sm text-muted-foreground">{step.details.whyItMatters}</p>
                    </div>
                  </div>
                )}
              </button>
              
              {/* Pil mellan steg */}
              {i < STEPS.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="h-4 w-4 text-muted-foreground/40" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Principer */}
        <div className="mb-12">
          <h3 className="text-center text-sm font-mono text-muted-foreground tracking-widest uppercase mb-6">
            Grundprinciper
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <div key={i} className="flex items-start gap-3 bg-card border rounded-lg p-4">
                <div className="p-1.5 rounded bg-muted text-muted-foreground">
                  {p.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sammanfattning */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-3 bg-card border-2 border-primary/20 rounded-2xl px-8 py-6 max-w-lg">
            <span className="text-3xl">🔬</span>
            <p className="text-base text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Kort sagt:</strong> DISSG är en röntgenbild av samhället. 
              Vi visar vad som händer – du bestämmer vad det betyder.
            </p>
            <p className="text-xs text-muted-foreground/60 font-mono">
              Inga rekommendationer. Inga dolda algoritmer. All data öppen och spårbar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsightCalculator;
