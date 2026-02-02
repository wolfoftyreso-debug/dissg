import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Minus,
  Clock,
  Users,
  Database,
  Shield,
  AlertTriangle,
  FileText,
  Link2,
  Target,
  Eye,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// ═══════════════════════════════════════════════════════════════════════════
// OM SYSTEMET — Publik sida (kontrakt med allmänheten)
// ═══════════════════════════════════════════════════════════════════════════

export default function AboutSystem() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-16 md:py-24 px-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="outline" className="mb-4">Öppet samhällssystem</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Om systemet
          </h1>
          <p className="text-xl text-muted-foreground">
            En öppen instrumentpanel för Sverige
          </p>
        </div>
      </section>

      {/* Kort version */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-muted/50 border-2">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Kort version</h2>
              <p className="text-muted-foreground mb-4">
                Detta är ett öppet system som visar hur Sverige utvecklas över tid, baserat på öppna data.
                Systemet sammanställer information, visar trender och kopplar utfall till ansvar – utan att ta politisk ställning.
              </p>
              <p className="font-medium mb-3">Du ser:</p>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  hur det går
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  var det går bättre eller sämre
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  hur utvecklingen har sett ut historiskt
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  vilka mandat som gällde när förändringar skedde
                </li>
              </ul>
              <p className="font-semibold text-foreground">
                Du drar själv slutsatserna.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-3xl mx-auto" />

      {/* Varför finns detta? */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Varför finns detta system?</h2>
          
          <p className="text-muted-foreground mb-4">
            I ett modernt samhälle fattas beslut som påverkar:
          </p>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
            {['människors liv', 'ekonomi', 'hälsa', 'trygghet', 'framtida möjligheter'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>

          <p className="text-muted-foreground mb-4">
            Trots det saknas ofta:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              en gemensam lägesbild
            </li>
            <li className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              tydlig uppföljning
            </li>
            <li className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              öppen historik över utfall
            </li>
          </ul>

          <p className="font-medium text-foreground">
            Detta system finns för att fylla det tomrummet.
          </p>
        </div>
      </section>

      <Separator className="max-w-3xl mx-auto" />

      {/* Vad systemet gör / inte gör */}
      <section className="py-12 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Gör */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Vad systemet gör
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Database className="h-4 w-4 mt-1 shrink-0" />
                  hämtar data från öppna källor (myndigheter, officiell statistik, Wikipedia)
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-1 shrink-0" />
                  sammanställer data enligt öppet redovisade metoder
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-1 shrink-0" />
                  visar utveckling över tid
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="h-4 w-4 mt-1 shrink-0" />
                  gör informationen lätt att förstå
                </li>
                <li className="flex items-start gap-2">
                  <Link2 className="h-4 w-4 mt-1 shrink-0" />
                  låter dig fördjupa dig så långt du vill
                </li>
              </ul>
              <p className="mt-4 text-sm font-medium">
                Allt är klickbart bakåt till källa och metod.
              </p>
            </div>

            {/* Gör inte */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="h-5 w-5 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 text-xs font-bold">✕</span>
                Vad systemet inte gör
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>ger inga rekommendationer</li>
                <li>tar inga politiska positioner</li>
                <li>bedömer inte intentioner</li>
                <li>tillskriver inte skuld</li>
                <li>säger inte vad som "borde" göras</li>
              </ul>
              <p className="mt-4 text-sm font-semibold text-foreground">
                Systemet visar vad som hänt, inte vad du ska tycka.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator className="max-w-3xl mx-auto" />

      {/* Hur läsa informationen */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Hur ska informationen läsas?</h2>
          
          <p className="text-muted-foreground mb-6">Fokusera på tre saker:</p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <div className="flex gap-1">
                    <ArrowUp className="h-4 w-4 text-green-600" />
                    <ArrowDown className="h-4 w-4 text-red-600" />
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="font-semibold mb-1">Riktning</h3>
                <p className="text-sm text-muted-foreground">
                  Går det upp, ner eller står det still?
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Tid</h3>
                <p className="text-sm text-muted-foreground">
                  Hur länge har utvecklingen pågått?
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Omfattning</h3>
                <p className="text-sm text-muted-foreground">
                  Hur många berörs?
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="font-medium mb-3">Vill du förstå mer:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  klicka på <span className="font-medium text-foreground">Visa varför</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  klicka på <span className="font-medium text-foreground">Visa hur vi vet</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  klicka på <span className="font-medium text-foreground">Visa på karta</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-3xl mx-auto" />

      {/* Om ansvar och mandat */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Om ansvar och mandat</h2>
          
          <p className="text-muted-foreground mb-4">Systemet visar:</p>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-1 text-primary" />
              vilka formella uppdrag och mandat som gällde under olika perioder
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-1 text-primary" />
              hur relevanta mätvärden utvecklades under dessa perioder
            </li>
          </ul>

          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
            <CardContent className="pt-6">
              <p className="text-sm">
                <strong>Det betyder inte</strong> att en enskild person "orsakade" ett utfall.
              </p>
              <p className="text-sm mt-2">
                <strong>Det betyder</strong> att ansvaret låg där när utvecklingen skedde.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-3xl mx-auto" />

      {/* Data, kvalitet, osäkerhet */}
      <section className="py-12 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Om data, kvalitet och osäkerhet</h2>
          
          <p className="text-muted-foreground mb-4">All data har:</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: Link2, label: 'Källa' },
              { icon: Clock, label: 'Uppdateringsdatum' },
              { icon: FileText, label: 'Metodbeskrivning' },
              { icon: AlertTriangle, label: 'Osäkerhetsnivå' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {label}
              </div>
            ))}
          </div>

          <p className="font-medium text-foreground">
            Om data är otillräcklig visas det tydligt. Systemet gissar aldrig.
          </p>
        </div>
      </section>

      {/* Känsliga uppgifter */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Om känsliga uppgifter
          </h2>
          
          <p className="text-muted-foreground mb-4">Systemet använder endast:</p>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              aggregerad statistik
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              populationsdata
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              intervall och kluster
            </li>
          </ul>

          <p className="font-semibold text-foreground">
            Inga individer kan identifieras. Ingen persondata visas.
          </p>
        </div>
      </section>

      <Separator className="max-w-3xl mx-auto" />

      {/* Simulering och rättelser */}
      <section className="py-12 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Om simulering och jämförelser</h2>
            <p className="text-muted-foreground mb-4">
              Vissa vyer tillåter simuleringar och jämförelser.
              Dessa är tydligt märkta och påverkar inte verklig data.
            </p>
            <p className="text-sm font-medium">
              Syftet är förståelse – inte prognoser.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Om rättelser</h2>
            <p className="text-muted-foreground mb-4">
              Biografiska fakta om offentliga uppdrag hämtas från Wikipedia.
              Rättelser görs via ursprungskällan och synkroniseras regelbundet.
            </p>
            <p className="text-sm text-muted-foreground">
              Statistiska rättelser sker hos respektive dataleverantör.
            </p>
          </div>
        </div>
      </section>

      {/* Vem står bakom */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Vem står bakom systemet?</h2>
          
          <p className="text-muted-foreground mb-4">
            Systemet är ett fristående informationslager.
            Det är inte kopplat till något politiskt parti, myndighet eller intresseorganisation.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Badge variant="outline" className="text-sm py-1">All metodik är öppen</Badge>
            <Badge variant="outline" className="text-sm py-1">All data är spårbar</Badge>
          </div>
        </div>
      </section>

      <Separator className="max-w-3xl mx-auto" />

      {/* Mål */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Target className="h-6 w-6" />
            Vad är målet?
          </h2>
          
          <ul className="space-y-3 mb-6">
            {[
              'göra samhällsutveckling begriplig',
              'minska gissningar och ryktesspridning',
              'ge alla samma faktiska utgångspunkt',
              'möjliggöra ansvarsfull debatt',
            ].map((goal) => (
              <li key={goal} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>{goal}</span>
              </li>
            ))}
          </ul>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-lg font-medium text-center">
                Ett samhälle fungerar bättre när verkligheten är synlig.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sammanfattning */}
      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-6">Sammanfattning</h2>
          
          <p className="text-lg mb-6 opacity-90">Detta system är:</p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {['öppet', 'faktabaserat', 'transparent', 'djupt', 'lätt att använda'].map((attr) => (
              <Badge key={attr} variant="secondary" className="text-sm py-1 px-3">
                {attr}
              </Badge>
            ))}
          </div>

          <p className="text-lg font-medium mb-8">
            Det är byggt för att hålla över tid – oavsett vem som styr.
          </p>

          <Button size="lg" variant="secondary" asChild>
            <Link to="/">
              Öppna lägesbilden
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t">
        <div className="max-w-3xl mx-auto text-center text-sm text-muted-foreground">
          <p>NOGF — Nationellt Offentligt Gransknings-Facit</p>
          <p className="mt-2">Öppna data. Öppen metod. För folket.</p>
        </div>
      </footer>
    </div>
  );
}
