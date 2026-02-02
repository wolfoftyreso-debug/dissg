import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import {
  Shield,
  Lock,
  AlertTriangle,
  Users,
  Database,
  Shuffle,
  ChevronDown,
  CheckCircle2,
  Info,
  Fingerprint,
  FileText,
} from 'lucide-react';

// =====================================================
// DEL XVIII — PRIVACY-BY-DESIGN
// =====================================================

interface PrivacyLevel {
  id: string;
  name: string;
  description: string;
  threshold: number;
  icon: React.ReactNode;
  status: 'active' | 'triggered' | 'safe';
}

const PRIVACY_BARRIERS: PrivacyLevel[] = [
  {
    id: 'min_n',
    name: 'Spärr 1: Minsta observationsstorlek (N)',
    description: 'Ingen vy visas om N < 30. Tröskeln justeras per KPI.',
    threshold: 30,
    icon: <Users className="h-4 w-4" />,
    status: 'safe',
  },
  {
    id: 'noise',
    name: 'Spärr 2: Brus vid djup zoom',
    description: 'Små slumpvariationer läggs på för att förstöra bakåtrekonstruktion.',
    threshold: 2, // 2% noise
    icon: <Shuffle className="h-4 w-4" />,
    status: 'active',
  },
  {
    id: 'segments',
    name: 'Spärr 3: Segment istället för individer',
    description: 'Aldrig person/hushåll. Alltid intervall, kluster, profiler.',
    threshold: 0,
    icon: <Database className="h-4 w-4" />,
    status: 'safe',
  },
  {
    id: 'synthetic',
    name: 'Spärr 4: Syntetiska exempel',
    description: 'Typfall baserade på statistik, aldrig verkliga personer.',
    threshold: 0,
    icon: <Fingerprint className="h-4 w-4" />,
    status: 'safe',
  },
];

interface SyntheticPersona {
  id: string;
  name: string;
  cluster: string;
  characteristics: string[];
  disclaimer: string;
}

const SYNTHETIC_PERSONAS: SyntheticPersona[] = [
  {
    id: 'typfall_a',
    name: 'Typfall A',
    cluster: 'Hög vårdkonsumtion + låg arbetsförmåga',
    characteristics: [
      'Ålder 50–59 år',
      'Långtidssjukskriven > 12 månader',
      'Återkommande vårdkontakt inom slutenvård',
      'Bor i storstadsområde',
      'Tidigare anställd inom tillverkning',
    ],
    disclaimer: 'Syntetisk profil baserad på aggregerad statistik. Representerar ingen verklig individ.',
  },
  {
    id: 'typfall_b',
    name: 'Typfall B',
    cluster: 'Ung befolkning + stigande sysselsättning',
    characteristics: [
      'Ålder 25–34 år',
      'Nyligen avslutad eftergymnasial utbildning',
      'Första fasta anställning < 2 år',
      'Bor i mellanstort stadsområde',
      'Arbetar inom tjänstesektor',
    ],
    disclaimer: 'Syntetisk profil baserad på aggregerad statistik. Representerar ingen verklig individ.',
  },
];

interface PrivacySpärrarProps {
  currentObservations: number;
  currentZoomLevel: number;
  className?: string;
}

export function PrivacySpärrar({ currentObservations, currentZoomLevel, className }: PrivacySpärrarProps) {
  const [expandedBarrier, setExpandedBarrier] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  // Beräkna status för varje spärr
  const getBarrierStatus = (barrier: PrivacyLevel): 'active' | 'triggered' | 'safe' => {
    if (barrier.id === 'min_n') {
      if (currentObservations < barrier.threshold) return 'triggered';
      if (currentObservations < barrier.threshold * 2) return 'active';
      return 'safe';
    }
    if (barrier.id === 'noise' && currentZoomLevel >= 2) {
      return 'active';
    }
    return barrier.status;
  };

  const isBlocked = currentObservations < 30;
  const noiseApplied = currentZoomLevel >= 2;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy-by-Design
            </CardTitle>
            <CardDescription className="text-xs">
              Integritetsskydd med fyra tekniska spärrar
            </CardDescription>
          </div>
          <Badge 
            variant={isBlocked ? 'destructive' : 'secondary'} 
            className="gap-1"
          >
            {isBlocked ? (
              <>
                <Lock className="h-3 w-3" />
                Spärrad
              </>
            ) : noiseApplied ? (
              <>
                <Shuffle className="h-3 w-3" />
                Brus aktivt
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3 w-3" />
                Skyddad
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Golden Rule */}
        <Alert className="bg-primary/5 border-primary/20">
          <Shield className="h-4 w-4 text-primary" />
          <AlertTitle className="text-sm">Gyllene regel</AlertTitle>
          <AlertDescription className="text-xs">
            Systemet får aldrig göra det möjligt att resonera bakåt till en verklig person.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="barriers">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="barriers" className="text-xs gap-1">
              <Lock className="h-3 w-3" />
              Spärrar
            </TabsTrigger>
            <TabsTrigger value="typfall" className="text-xs gap-1">
              <Fingerprint className="h-3 w-3" />
              Typfall
            </TabsTrigger>
          </TabsList>

          <TabsContent value="barriers" className="space-y-3 mt-4">
            {/* Current Status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Observationer</p>
                <p className="text-lg font-bold font-mono">
                  {currentObservations.toLocaleString('sv-SE')}
                </p>
                <Progress 
                  value={Math.min(100, (currentObservations / 100) * 100)} 
                  className={cn(
                    "h-1.5 mt-2",
                    isBlocked && "[&>div]:bg-destructive"
                  )}
                />
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Zoom-nivå</p>
                <p className="text-lg font-bold">{currentZoomLevel}/3</p>
                <Progress 
                  value={(currentZoomLevel / 3) * 100} 
                  className="h-1.5 mt-2"
                />
              </div>
            </div>

            <Separator />

            {/* Barrier List */}
            <div className="space-y-2">
              {PRIVACY_BARRIERS.map((barrier) => {
                const status = getBarrierStatus(barrier);
                return (
                  <Collapsible 
                    key={barrier.id}
                    open={expandedBarrier === barrier.id}
                    onOpenChange={(open) => setExpandedBarrier(open ? barrier.id : null)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-between p-3 h-auto",
                          status === 'triggered' && "bg-destructive/10 hover:bg-destructive/20",
                          status === 'active' && "bg-amber-500/10 hover:bg-amber-500/20"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "p-1.5 rounded-md",
                            status === 'triggered' ? "bg-destructive/20 text-destructive" :
                            status === 'active' ? "bg-amber-500/20 text-amber-600" :
                            "bg-muted text-muted-foreground"
                          )}>
                            {barrier.icon}
                          </div>
                          <span className="text-sm font-medium text-left">{barrier.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              status === 'triggered' ? 'destructive' :
                              status === 'active' ? 'secondary' : 'outline'
                            }
                            className="text-[10px]"
                          >
                            {status === 'triggered' ? 'UTLÖST' : 
                             status === 'active' ? 'AKTIV' : 'REDO'}
                          </Badge>
                          <ChevronDown className={cn(
                            "h-4 w-4 transition-transform",
                            expandedBarrier === barrier.id && "rotate-180"
                          )} />
                        </div>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pb-3">
                      <div className="bg-muted/30 rounded-lg p-3 mt-2">
                        <p className="text-xs text-muted-foreground">
                          {barrier.description}
                        </p>
                        {barrier.id === 'min_n' && (
                          <p className="text-xs mt-2">
                            <span className="font-medium">Tröskel:</span> N ≥ {barrier.threshold} observationer
                          </p>
                        )}
                        {barrier.id === 'noise' && (
                          <p className="text-xs mt-2">
                            <span className="font-medium">Brusnivå:</span> ±{barrier.threshold}% vid zoom ≥ 2
                          </p>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>

            {/* Blocked Message */}
            {isBlocked && (
              <Alert variant="destructive">
                <Lock className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Datat är för tunt för att visas på denna nivå. 
                  Minst 30 observationer krävs.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="typfall" className="space-y-4 mt-4">
            <Alert className="bg-muted/50">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Syntetiska typfall</strong> används för pedagogik. 
                De är konstruerade baserat på statistik och representerar 
                inga verkliga individer.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {SYNTHETIC_PERSONAS.map((persona) => (
                <div 
                  key={persona.id}
                  className={cn(
                    "border rounded-lg p-3 cursor-pointer transition-all",
                    selectedPersona === persona.id 
                      ? "border-primary bg-primary/5" 
                      : "hover:border-primary/50"
                  )}
                  onClick={() => setSelectedPersona(
                    selectedPersona === persona.id ? null : persona.id
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium flex items-center gap-2">
                        <Fingerprint className="h-4 w-4 text-muted-foreground" />
                        {persona.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {persona.cluster}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      Syntetisk
                    </Badge>
                  </div>

                  {selectedPersona === persona.id && (
                    <div className="mt-3 pt-3 border-t space-y-2">
                      <p className="text-xs font-medium">Typiska drag:</p>
                      <ul className="space-y-1">
                        {persona.characteristics.map((char, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-muted-foreground shrink-0" />
                            {char}
                          </li>
                        ))}
                      </ul>
                      <Alert className="bg-amber-500/5 border-amber-500/20 mt-3">
                        <AlertTriangle className="h-3 w-3 text-amber-600" />
                        <AlertDescription className="text-[10px] text-amber-700 dark:text-amber-400">
                          {persona.disclaimer}
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        {/* Data Point Disclaimer */}
        <div className="bg-muted/30 rounded-lg p-3 text-center">
          <p className="text-xs font-medium flex items-center justify-center gap-2">
            <FileText className="h-3 w-3" />
            Datapunkt = statistisk observation, inte en person
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            All data är aggregerad och anonymiserad enligt GDPR och Dataskyddslagen.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// PRIVACY INDICATOR (For inline use)
// =====================================================

interface DatapointDisclaimerProps {
  className?: string;
}

export function DatapointDisclaimer({ className }: DatapointDisclaimerProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground",
      className
    )}>
      <Database className="h-3 w-3" />
      <span>Datapunkt = statistisk observation, inte en person</span>
    </div>
  );
}
