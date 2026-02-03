/**
 * LAMBDA PUBLIC EXPLAINER
 * 
 * "Lambda för alla" – written so an 18-year-old understands,
 * without compromising one millimeter on correctness.
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Gauge,
  Activity,
  BarChart3,
  History,
  CheckCircle2,
  XCircle,
  Scale,
  Eye,
  MessageSquare,
  Users,
  Lightbulb,
  Car,
  Factory,
  Stethoscope,
  Cpu
} from 'lucide-react';

export const LambdaPublicExplainer: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* Hero */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold mb-2">🌍 LAMBDA 1.0</h1>
        <p className="text-lg text-muted-foreground">Förklarat så alla förstår</p>
      </div>

      {/* Section 1: The Core Question */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">1</div>
            <h2 className="text-xl font-semibold">Grundfrågan</h2>
          </div>
          
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mb-4">
            <p className="text-lg font-medium text-center">
              Går det bra eller dåligt för ett land / världen – <em>egentligen?</em>
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 bg-destructive/5 rounded border border-destructive/20">
              <p className="text-sm font-medium text-destructive mb-2">Inte:</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• vad folk tycker</li>
                <li>• vad politiker säger</li>
                <li>• vad som trendat i media</li>
              </ul>
            </div>
            <div className="p-3 bg-primary/5 rounded border border-primary/20">
              <p className="text-sm font-medium text-primary mb-2">Utan:</p>
              <p className="text-sm font-semibold">hur systemet faktiskt mår</p>
              <p className="text-lg font-bold mt-2">Det är Lambda.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: The Engine Analogy */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">2</div>
            <h2 className="text-xl font-semibold">Tänk på världen som en motor</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-3">En motor har:</p>
              <div className="flex flex-wrap gap-2">
                {['luft', 'bränsle', 'temperatur', 'tryck', 'varvtal'].map(item => (
                  <Badge key={item} variant="outline">{item}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-primary/5 rounded">
                <p className="text-sm">
                  <strong>Allt i balans →</strong> motorn går mjukt, starkt, länge
                </p>
              </div>
              <div className="p-3 bg-destructive/5 rounded">
                <p className="text-sm">
                  <strong>Något är fel →</strong> slitage, förbrukning, haveri
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-medium">Samhället är exakt likadant, bara större.</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: What Lambda Means */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">3</div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Vad betyder Lambda?
            </h2>
          </div>
          
          <p className="text-lg font-medium mb-4">Lambda = balansmått</p>
          
          <div className="space-y-3">
            <div className="p-4 rounded-lg border-2 border-primary bg-primary/5">
              <div className="flex items-center gap-3 mb-2">
                <code className="text-2xl font-mono font-bold">λ ≈ 1.0</code>
                <Badge className="bg-primary">Stabilt</Badge>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>→ systemet är i balans</li>
                <li>→ människor mår relativt bra</li>
                <li>→ framtiden är stabil</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg border border-secondary bg-secondary/50">
              <div className="flex items-center gap-3 mb-2">
                <code className="text-2xl font-mono font-bold">λ &lt; 1.0</code>
                <Badge variant="secondary">Överbelastat</Badge>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>→ systemet är överbelastat</li>
                <li>→ stress, konflikter, ineffektivitet</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
              <div className="flex items-center gap-3 mb-2">
                <code className="text-2xl font-mono font-bold">λ &gt; 1.0</code>
                <Badge variant="destructive">Resursstress</Badge>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>→ systemet är för pressat på resurser</li>
                <li>→ risk för kollaps längre fram</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-muted rounded text-center">
            <p className="text-sm">Det är ingen åsikt. <strong>Det är ett mätvärde.</strong></p>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: What's Actually Measured */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">4</div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Vad mäts egentligen?
            </h2>
          </div>
          
          <p className="text-muted-foreground mb-4">
            Lambda räknas inte på en sak. Det räknas på många saker samtidigt:
          </p>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              'hur länge folk lever',
              'om folk har jobb att leva på',
              'om bostäder går att få',
              'hur tryggt det är',
              'hur dyr energi är',
              'hur mycket skuld som byggs',
              'hur naturen belastas',
            ].map((item, i) => (
              <div key={i} className="p-2 bg-muted rounded text-sm flex items-center gap-2">
                <span className="text-primary">•</span>
                {item}
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-secondary rounded text-center">
            <p className="text-sm">
              Inget av detta ensamt avgör något.<br/>
              <strong>Tillsammans visar de hur systemet mår.</strong>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Why Not Before */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">5</div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <History className="h-5 w-5" />
              Varför har vi inte haft detta tidigare?
            </h2>
          </div>
          
          <ul className="space-y-2 mb-4">
            {[
              'data har varit utspridd',
              'ingen har aggregerat helheten',
              'beslut har tagits sektor för sektor',
              'ansvar har varit uppdelat',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-muted-foreground">
                <XCircle className="h-4 w-4 text-destructive" />
                {item}
              </li>
            ))}
          </ul>
          
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm italic text-center">
              Det är som att försöka köra bil genom att <strong>bara titta på hastighetsmätaren</strong>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 6: What Lambda Does */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">6</div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Vad Lambda gör (och inte gör)
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Lambda GÖR:
              </h3>
              <ul className="space-y-2 text-sm">
                <li>✓ visar om utvecklingen går åt rätt eller fel håll</li>
                <li>✓ visar var problemen faktiskt sitter</li>
                <li>✓ visar om åtgärder hjälper eller inte</li>
              </ul>
            </div>
            
            <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
              <h3 className="font-semibold text-destructive mb-3 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Lambda gör INTE:
              </h3>
              <ul className="space-y-2 text-sm">
                <li>✗ säga vad du ska tycka</li>
                <li>✗ säga vad du ska rösta på</li>
                <li>✗ säga exakt vad som ska göras</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-medium">Lambda säger:</p>
            <p className="text-lg font-bold mt-1">"Så här ser verkligheten ut just nu."</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 7: Why It's Fair */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">7</div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Varför detta är rättvist
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium mb-2">Alla:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• ser samma siffror</li>
                <li>• ser samma källor</li>
                <li>• ser samma historik</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Du kan:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• klicka ner till rådata</li>
                <li>• se hur värdet räknas</li>
                <li>• se osäkerheter</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-primary/10 rounded text-center">
            <p className="font-bold">Inget är dolt. Inget är hemligt.</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 8: Concrete Example */}
      <Card className="border-2 border-secondary">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">8</div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Exempel (konkret)
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded">
              <p className="text-sm text-muted-foreground mb-2">Säg att ett land:</p>
              <ul className="text-sm space-y-1">
                <li>• sänker skatter kraftigt</li>
                <li>• lånar mycket</li>
                <li>• ignorerar bostadsbrist</li>
              </ul>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-orange-500/10 rounded border border-orange-500/20">
                <p className="text-sm font-medium mb-2">Politiker kan säga:</p>
                <p className="italic">"Ekonomin går starkt!"</p>
              </div>
              
              <div className="p-3 bg-primary/10 rounded border border-primary/20">
                <p className="text-sm font-medium mb-2">Lambda kan visa:</p>
                <ul className="text-sm space-y-1">
                  <li>• kortsiktig förbättring</li>
                  <li>• långsiktig systemstress</li>
                  <li>• ökande obalans</li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-secondary rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Det betyder inte att politiken är "fel".</p>
              <p className="font-medium mt-1">Det betyder: <strong>"Detta ökar risken på sikt."</strong></p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 9: Democracy */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">9</div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Varför detta hjälper demokrati
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-destructive/5 rounded border border-destructive/20">
              <p className="font-medium text-destructive mb-2">Utan Lambda:</p>
              <p className="text-sm">debatt = åsikter mot åsikter</p>
            </div>
            <div className="p-4 bg-primary/5 rounded border border-primary/20">
              <p className="font-medium text-primary mb-2">Med Lambda:</p>
              <p className="text-sm">debatt = "Hur påverkar detta systembalansen?"</p>
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm mb-2">Det gör samtalet:</p>
          <div className="flex flex-wrap gap-2">
            {['lugnare', 'mer sakligt', 'svårare att ljuga i'].map(item => (
              <Badge key={item} variant="secondary">{item}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 10: The Key Sentence */}
      <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-background">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">10</div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Den viktigaste meningen
            </h2>
          </div>
          
          <div className="text-center py-6">
            <p className="text-xl">Lambda talar inte om vad som är rätt.</p>
            <p className="text-2xl font-bold mt-2">Lambda visar vad som händer.</p>
            <p className="text-muted-foreground mt-4">Det är upp till människor att välja.</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 11: Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">11</div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Sammanfattning
            </h2>
          </div>
          
          <div className="space-y-2">
            {[
              'Lambda är ett balansmått',
              'det visar hur ett samhälle mår',
              'det bygger på verklig data',
              'det är öppet och granskningsbart',
              'det ersätter inte åsikter – det grundar dem',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-muted rounded">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Why This Isn't Radical */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4 text-center">Varför detta inte är radikalt</h3>
          
          <div className="flex justify-center gap-4 mb-4">
            <div className="flex flex-col items-center gap-1">
              <Car className="h-8 w-8 text-muted-foreground" />
              <span className="text-xs">Flyg</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Factory className="h-8 w-8 text-muted-foreground" />
              <span className="text-xs">Industri</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Stethoscope className="h-8 w-8 text-muted-foreground" />
              <span className="text-xs">Medicin</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Cpu className="h-8 w-8 text-muted-foreground" />
              <span className="text-xs">Teknik</span>
            </div>
          </div>
          
          <p className="text-sm text-center text-muted-foreground">
            I dessa områden är detta självklart.
          </p>
          <p className="text-sm text-center font-medium mt-2">
            Att samhället saknat det är det verkligt märkliga.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LambdaPublicExplainer;
