/**
 * API Policy & Licensing Page - Full overview of licensing and API terms
 * NO ICONS - descriptive text only per design doctrine.
 * Every element is clickable with full explanation pyramid.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { LicenseTierComparison } from '@/components/transparency/LicenseTierCard';
import { AllDisclaimersCard, FullLegalDialog } from '@/components/transparency/LegalDisclaimer';
import { 
  dataCategories, 
  antiMisusePolicy, 
  jurisdictionAdditions,
  platformIdentity,
  pricingLogic 
} from '@/config/licensingConfig';
import { useState } from 'react';

// Explanation data for all clickable elements
const explanations = {
  openSourceData: {
    observation: 'Öppen källdata omfattar alla dataset som härstammar från myndigheter, statistikbyråer och internationella organisationer.',
    mechanism: 'Dessa data är per definition offentliga och ägs inte av plattformen. Vi aggregerar, normaliserar och presenterar dem i ett enhetligt format.',
    method: 'Data hämtas via officiella API:er och publicerade dataportaler. Varje datapunkt inkluderar källhänvisning och uppdateringstid.',
    limitations: [
      'Plattformen ansvarar inte för fel i källdata',
      'Uppdateringsfrekvens styrs av respektive källa',
      'Historiska revideringar kan påverka tidsserier retroaktivt'
    ],
    rawSource: 'SCB, Eurostat, OECD, Världsbanken, nationella statistikbyråer'
  },
  systemGeneratedData: {
    observation: 'Systemgenererad data omfattar index, korrelationer, relevansscore och andra beräkningar som produceras av plattformens algoritmer.',
    mechanism: 'Dessa beräkningar tillför värde genom aggregering, viktning och analys. Detta är plattformens intellektuella egendom.',
    method: 'Alla beräkningsmetoder är dokumenterade och vikter är synliga. Versionskontroll säkerställer spårbarhet.',
    limitations: [
      'Beräkningar baseras på tillgänglig data – luckor påverkar resultatet',
      'Viktning reflekterar metodologiska val, inte objektiv sanning',
      'Historiska index kan revideras vid metodförändringar'
    ],
    rawSource: 'Intern dokumentation, metodbeskrivningar tillgängliga på begäran'
  },
  prohibited: {
    observation: 'Förbjuden användning omfattar aktiviteter som strider mot plattformens syfte eller svensk/EU-lagstiftning.',
    mechanism: 'Restriktionerna skyddar dataintegritet, förhindrar manipulation och säkerställer att plattformen används för legitima ändamål.',
    method: 'Användning övervakas genom API-loggar, mönsterigenkänning och manuell granskning vid misstänkt aktivitet.',
    limitations: [
      'Detektionssystem fångar inte all missbruk',
      'Gränsen mellan legitim och förbjuden användning kan vara otydlig',
      'Nya missbruksmönster kan uppstå innan regler uppdateras'
    ],
    rawSource: 'Användarvillkor v1.0, GDPR Art. 6, Upphovsrättslagen (1960:729)'
  },
  technicalProtections: {
    observation: 'Tekniska skydd förhindrar otillåten användning genom automatiserade kontroller och begränsningar.',
    mechanism: 'Rate limiting, API-nycklar och användarkvoter säkerställer rättvis tillgång och förhindrar överbelastning.',
    method: 'Skyddsåtgärder implementeras på servernivå och loggas för revision.',
    limitations: [
      'Tekniska skydd kan kringgås av avancerade aktörer',
      'Legitima användare kan påverkas av falska positiva',
      'Skyddsnivå balanseras mot användarvänlighet'
    ],
    rawSource: 'OWASP Best Practices, ISO 27001'
  },
  jurisdiction: {
    observation: 'Jurisdiktionsspecifika villkor anpassar tjänsten till lokala lagkrav.',
    mechanism: 'Olika regioner har olika krav på dataskydd, ansvarsbegränsning och konsumentskydd.',
    method: 'Villkor granskas av juridisk expertis i respektive jurisdiktion.',
    limitations: [
      'Juridisk tolkning kan variera mellan domstolar',
      'Lagstiftning förändras – villkor kan bli inaktuella',
      'Internationella konflikter kan uppstå'
    ],
    rawSource: 'GDPR (EU), CCPA (Kalifornien), nationella implementeringar'
  }
};

function ClickableSection({ 
  title, 
  children, 
  explanation 
}: { 
  title: string;
  children: React.ReactNode;
  explanation: typeof explanations.openSourceData;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full text-left p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">{title}</span>
          <span className="text-xs text-muted-foreground">Klicka för detaljer →</span>
        </div>
        {children}
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <ExplanationTabs explanation={explanation} />
        </DialogContent>
      </Dialog>
    </>
  );
}

// Extracted ExplanationTabs component to avoid repetition
function ExplanationTabs({ explanation }: { explanation: typeof explanations.openSourceData }) {
  return (
    <Tabs defaultValue="observation" className="mt-4">
      <TabsList className="grid w-full grid-cols-5 text-xs">
        <TabsTrigger value="observation">Vad?</TabsTrigger>
        <TabsTrigger value="mechanism">Varför?</TabsTrigger>
        <TabsTrigger value="method">Hur vet vi?</TabsTrigger>
        <TabsTrigger value="limitations">Begränsningar</TabsTrigger>
        <TabsTrigger value="source">Källa</TabsTrigger>
      </TabsList>

      <TabsContent value="observation" className="mt-4">
        <h3 className="font-semibold mb-2">Nivå 1: Observation</h3>
        <p className="text-sm text-muted-foreground">{explanation.observation}</p>
      </TabsContent>

      <TabsContent value="mechanism" className="mt-4">
        <h3 className="font-semibold mb-2">Nivå 2: Mekanism</h3>
        <p className="text-sm text-muted-foreground">{explanation.mechanism}</p>
      </TabsContent>

      <TabsContent value="method" className="mt-4">
        <h3 className="font-semibold mb-2">Nivå 3: Metodik</h3>
        <p className="text-sm text-muted-foreground">{explanation.method}</p>
      </TabsContent>

      <TabsContent value="limitations" className="mt-4">
        <h3 className="font-semibold mb-2">Nivå 4: Begränsningar</h3>
        <p className="text-sm font-medium text-muted-foreground mb-2">Vad detta INTE visar:</p>
        <ul className="space-y-2">
          {explanation.limitations.map((lim, i) => (
            <li key={i} className="text-sm text-muted-foreground pl-4 border-l-2 border-muted">
              {lim}
            </li>
          ))}
        </ul>
      </TabsContent>

      <TabsContent value="source" className="mt-4">
        <h3 className="font-semibold mb-2">Nivå 5: Rådata och källa</h3>
        <p className="text-sm text-muted-foreground">{explanation.rawSource}</p>
      </TabsContent>
    </Tabs>
  );
}

// Jurisdiction item component to properly use hooks
function JurisdictionItem({ jurisdiction }: { jurisdiction: { name: string; notes: string; additionalTerms: string[] } }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full text-left p-3 rounded-lg border bg-card/50 hover:bg-muted/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="font-medium">{jurisdiction.name}</span>
          <span className="text-xs text-muted-foreground">→</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{jurisdiction.notes}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {jurisdiction.additionalTerms.map((term, i) => (
            <Badge key={i} variant="outline" className="text-xs">{term}</Badge>
          ))}
        </div>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{jurisdiction.name}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="observation" className="mt-4">
            <TabsList className="grid w-full grid-cols-5 text-xs">
              <TabsTrigger value="observation">Vad?</TabsTrigger>
              <TabsTrigger value="mechanism">Varför?</TabsTrigger>
              <TabsTrigger value="method">Hur vet vi?</TabsTrigger>
              <TabsTrigger value="limitations">Begränsningar</TabsTrigger>
              <TabsTrigger value="source">Källa</TabsTrigger>
            </TabsList>

            <TabsContent value="observation" className="mt-4">
              <h3 className="font-semibold mb-2">Nivå 1: Observation</h3>
              <p className="text-sm text-muted-foreground">{jurisdiction.notes}</p>
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Tillägg:</p>
                <ul className="space-y-1">
                  {jurisdiction.additionalTerms.map((term, i) => (
                    <li key={i} className="text-sm text-muted-foreground">• {term}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="mechanism" className="mt-4">
              <h3 className="font-semibold mb-2">Nivå 2: Mekanism</h3>
              <p className="text-sm text-muted-foreground">{explanations.jurisdiction.mechanism}</p>
            </TabsContent>

            <TabsContent value="method" className="mt-4">
              <h3 className="font-semibold mb-2">Nivå 3: Metodik</h3>
              <p className="text-sm text-muted-foreground">{explanations.jurisdiction.method}</p>
            </TabsContent>

            <TabsContent value="limitations" className="mt-4">
              <h3 className="font-semibold mb-2">Nivå 4: Begränsningar</h3>
              <ul className="space-y-2">
                {explanations.jurisdiction.limitations.map((lim, i) => (
                  <li key={i} className="text-sm text-muted-foreground pl-4 border-l-2 border-muted">
                    {lim}
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="source" className="mt-4">
              <h3 className="font-semibold mb-2">Nivå 5: Källa</h3>
              <p className="text-sm text-muted-foreground">{explanations.jurisdiction.rawSource}</p>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function ApiLicensingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 py-12">
          <Link to="/public" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            ← Tillbaka
          </Link>
          <div className="max-w-3xl">
            <Badge className="mb-4">API Policy & Licensing</Badge>
            <h1 className="text-4xl font-bold mb-4">
              {platformIdentity.tagline}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              All data är öppen att se. All intelligens är möjlig att köpa.
              Ett globalt ramverk för transparent dataanvändning.
            </p>
            <div className="flex gap-3">
              <Button size="lg">
                Kom igång →
              </Button>
              <FullLegalDialog trigger={
                <Button variant="outline" size="lg">
                  Fullständiga villkor →
                </Button>
              } />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="licenses" className="space-y-8">
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="licenses">Licenser</TabsTrigger>
            <TabsTrigger value="data">Datakategorier</TabsTrigger>
            <TabsTrigger value="legal">Juridik</TabsTrigger>
            <TabsTrigger value="policy">Policy</TabsTrigger>
            <TabsTrigger value="pricing">Prissättning</TabsTrigger>
          </TabsList>

          {/* Licenses */}
          <TabsContent value="licenses" className="space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl font-bold mb-2">Licensnivåer</h2>
              <p className="text-muted-foreground">
                Välj den nivå som passar din användning. Alla licenser inkluderar tillgång
                till öppen data – skillnaden ligger i behörigheter och funktioner.
              </p>
            </div>
            <LicenseTierComparison />
          </TabsContent>

          {/* Data Categories */}
          <TabsContent value="data" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Open Source Data */}
              <ClickableSection 
                title={dataCategories.openSource.name}
                explanation={explanations.openSourceData}
              >
                <p className="text-sm text-muted-foreground mb-3">
                  {dataCategories.openSource.description}
                </p>
                <Badge variant="outline" className="mb-3">{dataCategories.openSource.ownership}</Badge>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Policy:</div>
                  <ul className="space-y-1">
                    {dataCategories.openSource.policy.map((p, i) => (
                      <li key={i} className="text-sm text-muted-foreground">• {p}</li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3 mt-3 border-t text-xs text-muted-foreground">
                  Exempel: {dataCategories.openSource.examples.join(', ')}
                </div>
              </ClickableSection>

              {/* System Generated Data */}
              <ClickableSection 
                title={dataCategories.systemGenerated.name}
                explanation={explanations.systemGeneratedData}
              >
                <p className="text-sm text-muted-foreground mb-3">
                  {dataCategories.systemGenerated.description}
                </p>
                <Badge className="mb-3 bg-primary">{dataCategories.systemGenerated.ownership}</Badge>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Policy:</div>
                  <ul className="space-y-1">
                    {dataCategories.systemGenerated.policy.map((p, i) => (
                      <li key={i} className="text-sm text-muted-foreground">• {p}</li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3 mt-3 border-t text-xs text-muted-foreground">
                  Exempel: {dataCategories.systemGenerated.examples.join(', ')}
                </div>
              </ClickableSection>
            </div>

            <Alert className="cursor-default">
              <AlertDescription>
                <strong>Grundhållning:</strong> Vi licensierar inte fakta. Vi licensierar bearbetning, 
                aggregering, intelligens och leverans. Detta är globalt accepterad praxis inom 
                finansiell data, risk analytics och beslutsstöd.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Legal */}
          <TabsContent value="legal" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <AllDisclaimersCard />
              
              <Card>
                <CardHeader>
                  <CardTitle>Jurisdiktioner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(jurisdictionAdditions).map(([key, jurisdiction]) => (
                    <JurisdictionItem key={key} jurisdiction={jurisdiction} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Policy */}
          <TabsContent value="policy" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Prohibited */}
              <ClickableSection
                title="Förbjuden användning"
                explanation={explanations.prohibited}
              >
                <ul className="space-y-2 mt-2">
                  {antiMisusePolicy.prohibited.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      ✕ {item}
                    </li>
                  ))}
                </ul>
              </ClickableSection>

              {/* Technical Protections */}
              <ClickableSection
                title="Tekniska skydd"
                explanation={explanations.technicalProtections}
              >
                <ul className="space-y-2 mt-2">
                  {antiMisusePolicy.technicalProtections.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      ✓ {item}
                    </li>
                  ))}
                </ul>
              </ClickableSection>
            </div>

            {/* Violation Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Konsekvenser vid överträdelse</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <Badge className="bg-yellow-600 mb-2">Varning</Badge>
                    <p className="text-sm">{antiMisusePolicy.violationActions.warning}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                    <Badge className="bg-orange-600 mb-2">Tillfällig blockering</Badge>
                    <p className="text-sm">{antiMisusePolicy.violationActions.temporaryBlock}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                    <Badge className="bg-red-600 mb-2">Permanent blockering</Badge>
                    <p className="text-sm">{antiMisusePolicy.violationActions.permanentBlock}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing */}
          <TabsContent value="pricing" className="space-y-8">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Prissättningslogik</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Vad som påverkar priset</h3>
                    <ul className="space-y-2">
                      {pricingLogic.basedOn.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          ✓ {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-3">Vad som INTE påverkar priset</h3>
                    <ul className="space-y-2">
                      {pricingLogic.notBasedOn.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          ✕ {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Alert className="bg-primary/5 border-primary/20">
                    <AlertDescription>
                      <strong>Transparens som konkurrensfördel:</strong> Våra metoder är öppna, 
                      vikter synliga, versioner spårbara och historik oföränderlig. Detta bygger 
                      förtroende och gör oss till referens i branschen.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Platform Principles */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">{platformIdentity.name} Principer</h2>
          <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
            {platformIdentity.principles.map((principle, i) => (
              <div key={i} className="p-4 rounded-lg border bg-card/50 text-sm">
                {principle}
              </div>
            ))}
          </div>
          <p className="mt-8 text-muted-foreground">
            {platformIdentity.mission}
          </p>
        </div>
      </div>
    </div>
  );
}
