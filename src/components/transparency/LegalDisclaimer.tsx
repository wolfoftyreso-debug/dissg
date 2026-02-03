/**
 * Legal Disclaimer Components - Juridiska skyddsklausuler
 * NO ICONS - descriptive text only per design doctrine.
 * Every element is clickable with full explanation pyramid.
 */

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { legalDisclaimers } from '@/config/licensingConfig';
import { useState } from 'react';

// Explanation data for legal terms
const legalExplanations: Record<string, {
  observation: string;
  mechanism: string;
  method: string;
  limitations: string[];
  rawSource: string;
}> = {
  noAdvice: {
    observation: 'Tjänsten tillhandahåller systemgenererade indikationer baserade på öppna data. Informationen utgör inte rådgivning, rekommendationer eller beslut.',
    mechanism: 'Plattformen aggregerar och presenterar data från officiella källor. Användaren bör alltid konsultera relevanta experter innan beslut fattas.',
    method: 'Klassificering baseras på EU:s riktlinjer för beslutsstödssystem och svensk marknadsföringsrätt.',
    limitations: [
      'Visar inte individuella rekommendationer',
      'Ersätter inte professionell rådgivning',
      'Täcker inte alla relevanta faktorer för specifika beslut'
    ],
    rawSource: 'Marknadsföringslagen (2008:486), EU Directive 2000/31/EC'
  },
  noCausality: {
    observation: 'Visade samband indikerar samvariation över tid. Kausalitet fastställs inte av systemet.',
    mechanism: 'Statistiska mönster beräknas genom korrelationsanalys. Korrelation och orsakssamband är fundamentalt olika koncept.',
    method: 'Alla korrelationsberäkningar inkluderar konfidensintervall och stabilitetstester enligt peer-reviewed metodik.',
    limitations: [
      'Visar inte orsak-verkan-relationer',
      'Tar inte hänsyn till dolda variabler (confounders)',
      'Statistisk signifikans är inte samma som praktisk betydelse'
    ],
    rawSource: 'Pearl, J. (2009). Causality: Models, Reasoning, and Inference. Cambridge University Press.'
  },
  limitedLiability: {
    observation: 'Användaren ansvarar själv för hur informationen används i beslutsfattande. Plattformen ansvarar inte för konsekvenser av beslut baserade på presenterad information.',
    mechanism: 'Ansvarsfördelningen följer principen att den som fattar beslut också bär ansvar för beslutet.',
    method: 'Baserat på standardvillkor för informationstjänster och svensk skadeståndsrätt.',
    limitations: [
      'Täcker inte uppsåtlig vilseledning från plattformens sida',
      'Gäller inte vid grov vårdslöshet',
      'Nationell lagstiftning kan begränsa ansvarsfriskrivningar'
    ],
    rawSource: 'Skadeståndslagen (1972:207), Avtalslagen (1915:218)'
  },
  dataQuality: {
    observation: 'Plattformen ansvarar för aggregering, normalisering och presentation. Ansvar för underliggande källdata ligger hos respektive datakälla.',
    mechanism: 'All data visas med angivna osäkerhetsnivåer och senaste uppdateringstid för full transparens.',
    method: 'Datakvalitet bedöms enligt ISO 8000-standarden för datakvalitet.',
    limitations: [
      'Garanterar inte att källdata är korrekt',
      'Uppdateringsfrekvens varierar mellan källor',
      'Historiska revideringar kan påverka tidsserier'
    ],
    rawSource: 'ISO 8000:2022 Data Quality, SCB:s kvalitetsramverk för statistik'
  }
};

interface DisclaimerBadgeProps {
  type: keyof typeof legalDisclaimers;
  size?: 'sm' | 'md';
}

export function DisclaimerBadge({ type, size = 'sm' }: DisclaimerBadgeProps) {
  const disclaimer = legalDisclaimers[type];
  const [isOpen, setIsOpen] = useState(false);
  const explanation = legalExplanations[type] || legalExplanations.noAdvice;

  return (
    <>
      <Badge 
        variant="outline" 
        className={`cursor-pointer hover:bg-muted ${size === 'sm' ? 'text-xs' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        {disclaimer.shortText} →
      </Badge>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{disclaimer.title}</DialogTitle>
          </DialogHeader>
          <ExplanationPyramid explanation={explanation} />
        </DialogContent>
      </Dialog>
    </>
  );
}

// Reusable explanation pyramid component
function ExplanationPyramid({ explanation }: { explanation: typeof legalExplanations.noAdvice }) {
  return (
    <Tabs defaultValue="observation" className="mt-4">
      <TabsList className="grid w-full grid-cols-5 text-xs">
        <TabsTrigger value="observation">Vad?</TabsTrigger>
        <TabsTrigger value="mechanism">Varför?</TabsTrigger>
        <TabsTrigger value="method">Hur vet vi?</TabsTrigger>
        <TabsTrigger value="limitations">Begränsningar</TabsTrigger>
        <TabsTrigger value="source">Källa</TabsTrigger>
      </TabsList>

      <TabsContent value="observation" className="mt-4 space-y-3">
        <h3 className="font-semibold">Nivå 1: Observation</h3>
        <p className="text-sm text-muted-foreground">{explanation.observation}</p>
      </TabsContent>

      <TabsContent value="mechanism" className="mt-4 space-y-3">
        <h3 className="font-semibold">Nivå 2: Mekanism</h3>
        <p className="text-sm text-muted-foreground">{explanation.mechanism}</p>
      </TabsContent>

      <TabsContent value="method" className="mt-4 space-y-3">
        <h3 className="font-semibold">Nivå 3: Metodik</h3>
        <p className="text-sm text-muted-foreground">{explanation.method}</p>
      </TabsContent>

      <TabsContent value="limitations" className="mt-4 space-y-3">
        <h3 className="font-semibold">Nivå 4: Begränsningar</h3>
        <p className="text-sm font-medium text-muted-foreground mb-2">Vad detta INTE visar:</p>
        <ul className="space-y-2">
          {explanation.limitations.map((lim, i) => (
            <li key={i} className="text-sm text-muted-foreground pl-4 border-l-2 border-muted">
              {lim}
            </li>
          ))}
        </ul>
      </TabsContent>

      <TabsContent value="source" className="mt-4 space-y-3">
        <h3 className="font-semibold">Nivå 5: Rådata och källa</h3>
        <p className="text-sm text-muted-foreground">{explanation.rawSource}</p>
      </TabsContent>
    </Tabs>
  );
}

interface DisclaimerAlertProps {
  type: keyof typeof legalDisclaimers;
  variant?: 'default' | 'warning';
}

export function DisclaimerAlert({ type, variant = 'default' }: DisclaimerAlertProps) {
  const disclaimer = legalDisclaimers[type];
  const [isOpen, setIsOpen] = useState(false);
  const explanation = legalExplanations[type] || legalExplanations.noAdvice;

  return (
    <>
      <Alert 
        className={`cursor-pointer hover:bg-muted/50 transition-colors ${variant === 'warning' ? 'border-yellow-500/50 bg-yellow-500/10' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <AlertTitle className="flex items-center justify-between">
          {disclaimer.title}
          <span className="text-xs font-normal text-muted-foreground">Klicka för detaljer →</span>
        </AlertTitle>
        <AlertDescription className="text-sm">
          {disclaimer.fullText}
        </AlertDescription>
      </Alert>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{disclaimer.title}</DialogTitle>
          </DialogHeader>
          <ExplanationPyramid explanation={explanation} />
        </DialogContent>
      </Dialog>
    </>
  );
}

// Extracted disclaimer item component to properly use hooks
function DisclaimerItem({ 
  disclaimerKey, 
  disclaimer 
}: { 
  disclaimerKey: string;
  disclaimer: { title: string; fullText: string; shortText: string };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const explanation = legalExplanations[disclaimerKey as keyof typeof legalExplanations] || legalExplanations.noAdvice;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full text-left p-3 rounded-lg border bg-card/50 hover:bg-muted/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium">{disclaimer.title}</span>
          <span className="text-xs text-muted-foreground">Klicka för detaljer →</span>
        </div>
        <p className="text-sm text-muted-foreground">{disclaimer.fullText}</p>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{disclaimer.title}</DialogTitle>
          </DialogHeader>
          <ExplanationPyramid explanation={explanation} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AllDisclaimersCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Juridiska villkor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(legalDisclaimers).map(([key, disclaimer]) => (
          <DisclaimerItem key={key} disclaimerKey={key} disclaimer={disclaimer} />
        ))}
      </CardContent>
    </Card>
  );
}

export function CorrelationDisclaimer() {
  const [isOpen, setIsOpen] = useState(false);
  const explanation = legalExplanations.noCausality;

  return (
    <>
      <Alert 
        className="border-yellow-500/50 bg-yellow-500/10 cursor-pointer hover:bg-yellow-500/20 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <AlertTitle className="flex items-center justify-between">
          Korrelation ≠ Orsak
          <span className="text-xs font-normal">Klicka för detaljer →</span>
        </AlertTitle>
        <AlertDescription>
          Visade samband indikerar statistisk samvariation. Kausalitet fastställs inte.
          Tolka mönster med försiktighet och i sitt sammanhang.
        </AlertDescription>
      </Alert>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Korrelation ≠ Orsak</DialogTitle>
          </DialogHeader>
          <ExplanationPyramid explanation={explanation} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export function DataSourceDisclaimer({ sourceName, sourceUrl }: { sourceName: string; sourceUrl?: string }) {
  return (
    <div className="text-xs text-muted-foreground">
      <span>Källa: {sourceName}</span>
      {sourceUrl && (
        <a 
          href={sourceUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="ml-2 underline hover:no-underline"
        >
          Visa källa →
        </a>
      )}
    </div>
  );
}

interface FullLegalDialogProps {
  trigger?: React.ReactNode;
}

export function FullLegalDialog({ trigger }: FullLegalDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            Juridiska villkor →
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Juridiska villkor och ansvarsfriskrivningar</DialogTitle>
          <DialogDescription>
            Läs igenom dessa villkor noga. Genom att använda plattformen accepterar du dessa villkor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {Object.entries(legalDisclaimers).map(([key, disclaimer]) => (
            <div key={key} className="space-y-2">
              <h3 className="font-semibold">{disclaimer.title}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {disclaimer.fullText}
              </p>
            </div>
          ))}

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Datakategorier</h3>
            <div className="grid gap-3">
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <h4 className="font-medium text-green-600">Öppen källdata</h4>
                <p className="text-sm text-muted-foreground">
                  Data från myndigheter och officiella källor. Plattformen aggregerar och presenterar,
                  men äger inte underliggande data.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <h4 className="font-medium text-purple-600">Systemgenererad data</h4>
                <p className="text-sm text-muted-foreground">
                  Index, korrelationer, relevansscore och andra beräkningar som produceras av plattformen.
                  Licensieras enligt vald prenumerationsnivå.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground">
            <p>Version 1.0 • Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default {
  DisclaimerBadge,
  DisclaimerAlert,
  AllDisclaimersCard,
  CorrelationDisclaimer,
  DataSourceDisclaimer,
  FullLegalDialog,
};
