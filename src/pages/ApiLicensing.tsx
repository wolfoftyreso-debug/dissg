/**
 * API Policy & Licensing Page - Full overview of licensing and API terms
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { Shield, Globe, FileText, Lock, Check, X, AlertTriangle, Zap, ArrowLeft } from 'lucide-react';
import { LicenseTierComparison } from '@/components/transparency/LicenseTierCard';
import { AllDisclaimersCard, FullLegalDialog } from '@/components/transparency/LegalDisclaimer';
import { 
  dataCategories, 
  antiMisusePolicy, 
  jurisdictionAdditions,
  platformIdentity,
  pricingLogic 
} from '@/config/licensingConfig';

export default function ApiLicensingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <div className="container mx-auto px-4 py-12">
          <Link to="/public" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Tillbaka
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
                <Zap className="h-5 w-5 mr-2" />
                Kom igång
              </Button>
              <FullLegalDialog trigger={
                <Button variant="outline" size="lg">
                  <FileText className="h-5 w-5 mr-2" />
                  Fullständiga villkor
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
              <Card className="border-green-500/30 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <Globe className="h-5 w-5" />
                    {dataCategories.openSource.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {dataCategories.openSource.description}
                  </p>
                  <div>
                    <Badge variant="outline" className="mb-2">{dataCategories.openSource.ownership}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Policy:</div>
                    <ul className="space-y-1">
                      {dataCategories.openSource.policy.map((p, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Check className="h-3 w-3 text-green-500" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="text-xs text-muted-foreground">
                      Exempel: {dataCategories.openSource.examples.join(', ')}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Generated Data */}
              <Card className="border-purple-500/30 bg-purple-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-600">
                    <Lock className="h-5 w-5" />
                    {dataCategories.systemGenerated.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {dataCategories.systemGenerated.description}
                  </p>
                  <div>
                    <Badge className="mb-2 bg-purple-500">{dataCategories.systemGenerated.ownership}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Policy:</div>
                    <ul className="space-y-1">
                      {dataCategories.systemGenerated.policy.map((p, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Check className="h-3 w-3 text-purple-500" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="text-xs text-muted-foreground">
                      Exempel: {dataCategories.systemGenerated.examples.join(', ')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
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
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Jurisdiktioner
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(jurisdictionAdditions).map(([key, jurisdiction]) => (
                    <div key={key} className="p-3 rounded-lg border bg-card/50">
                      <div className="font-medium">{jurisdiction.name}</div>
                      <p className="text-sm text-muted-foreground mt-1">{jurisdiction.notes}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {jurisdiction.additionalTerms.map((term, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{term}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Policy */}
          <TabsContent value="policy" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Prohibited */}
              <Card className="border-red-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-500">
                    <X className="h-5 w-5" />
                    Förbjuden användning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {antiMisusePolicy.prohibited.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Technical Protections */}
              <Card className="border-blue-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-500">
                    <Shield className="h-5 w-5" />
                    Tekniska skydd
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {antiMisusePolicy.technicalProtections.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Violation Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Konsekvenser vid överträdelse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <Badge className="bg-yellow-500 mb-2">Varning</Badge>
                    <p className="text-sm">{antiMisusePolicy.violationActions.warning}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                    <Badge className="bg-orange-500 mb-2">Tillfällig blockering</Badge>
                    <p className="text-sm">{antiMisusePolicy.violationActions.temporaryBlock}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                    <Badge className="bg-red-500 mb-2">Permanent blockering</Badge>
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
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Vad som påverkar priset
                    </h3>
                    <ul className="space-y-2">
                      {pricingLogic.basedOn.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <X className="h-4 w-4 text-red-500" />
                      Vad som INTE påverkar priset
                    </h3>
                    <ul className="space-y-2">
                      {pricingLogic.notBasedOn.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Alert className="bg-primary/5 border-primary/20">
                    <Shield className="h-4 w-4" />
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
