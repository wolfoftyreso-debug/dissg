import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  BarChart3,
  TrendingUp,
  TrendingDown,
  HelpCircle,
  FileText,
  MapPin,
  Clock,
  Sparkles,
  Users,
  Building,
  X,
} from 'lucide-react';

/**
 * DEL XXII — ONBOARDING FÖR ALLMÄNHETEN (2 MINUTER)
 * 
 * Fem steg som gör vem som helst redo att använda systemet:
 * 1. Vad är detta?
 * 2. Hur läser jag siffrorna?
 * 3. Var i landet?
 * 4. Vem ansvarar?
 * 5. Vill du fördjupa?
 */

interface OnboardingStep {
  id: number;
  title: string;
  content: React.ReactNode;
  icon: React.ReactNode;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: 'Vad är detta?',
    icon: <BarChart3 className="h-5 w-5" />,
    content: (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed">
          Detta är en <strong>öppen instrumentpanel</strong> som visar hur Sverige 
          utvecklas över tid – baserat på öppna källor från myndigheter.
        </p>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-primary">20</p>
            <p className="text-xs text-muted-foreground">Nyckeltal</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-primary">290</p>
            <p className="text-xs text-muted-foreground">Kommuner</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-primary">50+</p>
            <p className="text-xs text-muted-foreground">År historik</p>
          </div>
        </div>

        <Alert className="bg-primary/5 border-primary/20">
          <Check className="h-4 w-4 text-primary" />
          <AlertDescription className="text-xs">
            All data kommer från officiella källor som SCB, Kolada och Eurostat. 
            Systemet gör inga egna mätningar.
          </AlertDescription>
        </Alert>
      </div>
    ),
  },
  {
    id: 2,
    title: 'Hur läser jag siffrorna?',
    icon: <TrendingUp className="h-5 w-5" />,
    content: (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed">
          Varje nyckeltal visas med <strong>två rader</strong>: aktuellt värde och förändring.
        </p>

        {/* Demo KPI Card */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sysselsättningsgrad</span>
            <div className="flex items-center gap-1 text-[hsl(var(--trend-warning))]">
              <TrendingDown className="h-4 w-4" />
              <span className="text-xs">Minskar</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold">71,8 %</p>
            <p className="text-xs text-muted-foreground">−0,8 p.e. sedan 12 månader</p>
          </div>
          <Progress value={95} className="h-1" />
          <p className="text-[10px] text-muted-foreground">95% konfidens</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium">Tre knappar finns alltid:</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1">
              <HelpCircle className="h-3 w-3" />
              Visa varför
            </Badge>
            <Badge variant="outline" className="gap-1">
              <FileText className="h-3 w-3" />
              Visa hur vi vet
            </Badge>
            <Badge variant="outline" className="gap-1">
              <MapPin className="h-3 w-3" />
              Visa på karta
            </Badge>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: 'Var i landet?',
    icon: <MapPin className="h-5 w-5" />,
    content: (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed">
          Klicka <strong>"Visa på karta"</strong> för att se hur det ser ut i olika delar av Sverige.
        </p>

        {/* Zoom levels */}
        <div className="space-y-2">
          <p className="text-xs font-medium">Fyra zoom-nivåer:</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { level: 0, name: 'Nation', desc: 'Hela Sverige' },
              { level: 1, name: 'Län', desc: '21 regioner' },
              { level: 2, name: 'Kommun', desc: '290 kommuner' },
              { level: 3, name: 'Kluster', desc: 'Liknande områden' },
            ].map((zoom) => (
              <div key={zoom.level} className="bg-muted/50 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">{zoom.level}</Badge>
                  <span className="text-xs font-medium">{zoom.name}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{zoom.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertDescription className="text-xs">
            På nivå 3 visas <strong>kluster</strong> – områden som liknar varandra 
            statistiskt, oavsett var de ligger geografiskt.
          </AlertDescription>
        </Alert>
      </div>
    ),
  },
  {
    id: 4,
    title: 'Vem ansvarar?',
    icon: <Building className="h-5 w-5" />,
    content: (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed">
          Varje nyckeltal har en <strong>ansvarsstruktur</strong> – nationell, 
          regional eller kommunal nivå.
        </p>

        <div className="space-y-2">
          {[
            { level: 'Nationell', example: 'Finanspolitik, lagstiftning', icon: <Building className="h-4 w-4" /> },
            { level: 'Regional', example: 'Sjukvård, kollektivtrafik', icon: <Users className="h-4 w-4" /> },
            { level: 'Kommunal', example: 'Skola, äldreomsorg', icon: <MapPin className="h-4 w-4" /> },
          ].map((item) => (
            <div key={item.level} className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{item.level}</p>
                <p className="text-xs text-muted-foreground">{item.example}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Visa historik
          </Badge>
          <span className="text-xs text-muted-foreground">
            → Se utveckling under olika styrperioder
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: 'Vill du fördjupa?',
    icon: <Sparkles className="h-5 w-5" />,
    content: (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed">
          Slå på <strong>Simulering</strong> för att testa "vad händer om...?"
        </p>

        <div className="bg-[hsl(var(--simulation-bg))] border border-[hsl(var(--simulation-border))] rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[hsl(var(--simulation-text))]" />
            <span className="text-sm font-medium">Simuleringsläge</span>
            <Badge variant="outline" className="text-[10px]">Påverkar ej verklig data</Badge>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Testa "+1 procentenhet sysselsättning" och se hur det påverkar 
            andra nyckeltal baserat på historiska mönster.
          </p>

          <div className="flex items-center gap-2 text-xs">
            <Badge variant="secondary">1. Välj förändring</Badge>
            <ChevronRight className="h-3 w-3" />
            <Badge variant="secondary">2. Se påverkan</Badge>
            <ChevronRight className="h-3 w-3" />
            <Badge variant="secondary">3. Utforska</Badge>
          </div>
        </div>

        <Alert className="bg-primary/5 border-primary/20">
          <Check className="h-4 w-4 text-primary" />
          <AlertDescription className="text-xs">
            <strong>Du är redo!</strong> Systemet är oändligt djupt – varje vy 
            har fler filter, jämförelser och "varför". Utforska i din egen takt.
          </AlertDescription>
        </Alert>
      </div>
    ),
  },
];

interface PublicOnboardingProps {
  onComplete?: () => void;
  onSkip?: () => void;
  className?: string;
}

export function PublicOnboarding({ onComplete, onSkip, className }: PublicOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <Card className={cn("max-w-md w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {step.icon}
            </div>
            <div>
              <CardTitle className="text-base">{step.title}</CardTitle>
              <CardDescription className="text-xs">
                Steg {currentStep + 1} av {ONBOARDING_STEPS.length}
              </CardDescription>
            </div>
          </div>
          {onSkip && (
            <Button variant="ghost" size="icon" onClick={onSkip} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Progress value={progress} className="h-1 mt-3" />
      </CardHeader>

      <CardContent className="space-y-4">
        {step.content}

        <Separator />

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Tillbaka
          </Button>

          <div className="flex gap-1">
            {ONBOARDING_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  idx === currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>

          <Button
            size="sm"
            onClick={handleNext}
            className="gap-1"
          >
            {currentStep === ONBOARDING_STEPS.length - 1 ? (
              <>
                <Check className="h-4 w-4" />
                Klar
              </>
            ) : (
              <>
                Nästa
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for embedding
export function OnboardingTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="gap-2"
    >
      <HelpCircle className="h-4 w-4" />
      Så här utforskar du Sverige
    </Button>
  );
}
