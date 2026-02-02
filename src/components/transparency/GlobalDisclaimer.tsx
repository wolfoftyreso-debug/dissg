import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Info, Scale, BookOpen, Shield, ExternalLink } from 'lucide-react';
import { DATA_LAYERS, LEGAL_DISCLAIMERS } from '@/config/publicProfileConfig';

interface GlobalDisclaimerProps {
  variant?: 'banner' | 'footer' | 'dialog-trigger';
  className?: string;
}

/**
 * DEL XIV: Global systemdisclaimer
 * 
 * Fast text i systemets "Om"-sektion som förklarar:
 * - Tre-lager-modellen
 * - Aggregering ≠ Värdering
 * - Dataansvar
 */
export function GlobalDisclaimer({ variant = 'banner', className = '' }: GlobalDisclaimerProps) {
  if (variant === 'footer') {
    return (
      <footer className={`text-xs text-muted-foreground border-t pt-6 mt-8 ${className}`}>
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-start gap-3">
            <Scale className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-1">Om systemet</p>
              <p className="whitespace-pre-line">{LEGAL_DISCLAIMERS.globalSystem.text}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-start gap-3">
            <Shield className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="whitespace-pre-line">{LEGAL_DISCLAIMERS.aggregation.text}</p>
          </div>
          
          <div className="flex items-center gap-4 text-[10px] pt-2">
            <span>© {new Date().getFullYear()} NOGF</span>
            <a href="/om" className="underline underline-offset-2 hover:text-foreground">Om systemet</a>
            <a href="/metod" className="underline underline-offset-2 hover:text-foreground">Metod</a>
            <a href="/kallor" className="underline underline-offset-2 hover:text-foreground">Datakällor</a>
          </div>
        </div>
      </footer>
    );
  }

  if (variant === 'dialog-trigger') {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className={className}>
            <Info className="h-4 w-4 mr-2" />
            Om systemet
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              {LEGAL_DISCLAIMERS.globalSystem.title}
            </DialogTitle>
            <DialogDescription>
              Nationellt Observationssystem för Grundläggande Funktioner (NOGF)
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6 pr-4">
              {/* Huvudprincip */}
              <section>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Kärnprincip
                </h4>
                <Alert>
                  <AlertDescription className="text-sm">
                    {LEGAL_DISCLAIMERS.globalSystem.text}
                  </AlertDescription>
                </Alert>
              </section>
              
              <Separator />
              
              {/* Tre-lager-modellen */}
              <section>
                <h4 className="text-sm font-semibold mb-3">Tre-lager-modellen</h4>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Lager A: {DATA_LAYERS.sourceData.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {DATA_LAYERS.sourceData.description}
                    </p>
                    <p className="text-xs italic mt-2">{DATA_LAYERS.sourceData.disclaimer}</p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Lager B: {DATA_LAYERS.aggregation.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {DATA_LAYERS.aggregation.description}
                    </p>
                    <p className="text-xs italic mt-2">{DATA_LAYERS.aggregation.disclaimer}</p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Lager C: {DATA_LAYERS.presentation.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {DATA_LAYERS.presentation.description}
                    </p>
                    <p className="text-xs italic mt-2">{DATA_LAYERS.presentation.disclaimer}</p>
                  </div>
                </div>
              </section>
              
              <Separator />
              
              {/* Aggregering ≠ Värdering */}
              <section>
                <h4 className="text-sm font-semibold mb-2">Aggregering ≠ Värdering</h4>
                <Alert variant="default" className="bg-muted/50">
                  <AlertDescription className="text-sm">
                    {LEGAL_DISCLAIMERS.aggregation.text}
                  </AlertDescription>
                </Alert>
              </section>
              
              <Separator />
              
              {/* Dataansvar */}
              <section>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Om data och ansvar
                </h4>
                <Alert>
                  <AlertDescription className="text-sm">
                    {LEGAL_DISCLAIMERS.dataResponsibility.text}
                  </AlertDescription>
                </Alert>
              </section>
              
              <Separator />
              
              {/* Metod */}
              <section>
                <h4 className="text-sm font-semibold mb-2">Metodtransparens</h4>
                <p className="text-sm text-muted-foreground">
                  Varje datapunkt i systemet har en "Så här är detta beräknat"-länk
                  som visar exakt datakälla, tidsintervall, klassificeringsregler
                  och aggregeringsmetod.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Vi behöver aldrig försvara siffran — vi pekar på metoden.</strong>
                </p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }

  // Banner variant (default)
  return (
    <Alert variant="default" className={`bg-muted/30 ${className}`}>
      <Scale className="h-4 w-4" />
      <AlertTitle>{LEGAL_DISCLAIMERS.globalSystem.title}</AlertTitle>
      <AlertDescription className="text-sm whitespace-pre-line">
        {LEGAL_DISCLAIMERS.globalSystem.text}
      </AlertDescription>
    </Alert>
  );
}
