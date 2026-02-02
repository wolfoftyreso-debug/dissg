import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, 
  Database, 
  Shield, 
  Users, 
  Clock, 
  Link2, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Layers,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// ═══════════════════════════════════════════════════════════════════════════
// OM SYSTEMET — Publik sida för allmänheten
// ═══════════════════════════════════════════════════════════════════════════

export default function AboutSystem() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4">Öppet samhällssystem</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Ett gemensamt facit för Sverige
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Vi visar hur det går, var det händer och varför. 
            Ingen agenda. Ingen åsikt. Bara fakta.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/">
                Se lägesbilden
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#hur-det-fungerar">Läs mer</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Tre kärnfrågor */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-12">
            Varje sida besvarar tre frågor
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <CardTitle>Hur går det?</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Aktuella värden med tydlig trendindikation. 
                Uppåt, nedåt eller stabilt — du ser det direkt.
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <span className="text-2xl">📍</span>
                </div>
                <CardTitle>Var händer det?</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Geografisk nedbrytning på region- och kommunnivå. 
                Se skillnader och jämför.
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <CardTitle>Varför?</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Korrelationer, tidsförskjutningar och samvariation. 
                Förklaringar, inte gissningar.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* Vad systemet är och inte är */}
      <section id="hur-det-fungerar" className="py-16 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-12">
            Vad systemet är — och inte är
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  Systemet ÄR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Eye className="h-4 w-4 mt-1 text-muted-foreground" />
                    <span>Ett <strong>informations- och analyslager</strong> med öppna data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Database className="h-4 w-4 mt-1 text-muted-foreground" />
                    <span>Ett <strong>offentligt referenssystem</strong> för samhällsstatistik</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Link2 className="h-4 w-4 mt-1 text-muted-foreground" />
                    <span>Ett <strong>ansvars- och utfallsarkiv</strong> som visar vem som hade mandatet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BookOpen className="h-4 w-4 mt-1 text-muted-foreground" />
                    <span>Ett <strong>pedagogiskt gränssnitt</strong> till komplex verklighet</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <XCircle className="h-5 w-5" />
                  Systemet är INTE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 mt-1 text-muted-foreground" />
                    <span>Ett politiskt verktyg</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 mt-1 text-muted-foreground" />
                    <span>Ett opinionssystem</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 mt-1 text-muted-foreground" />
                    <span>Ett beslutsmandat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 mt-1 text-muted-foreground" />
                    <span>En sanningsdomstol</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Principer */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-12">
            Grundprinciper
          </h2>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Fakta ≠ Analys ≠ Presentation</h3>
                    <p className="text-muted-foreground">
                      <strong>Fakta</strong> kommer från öppna myndighetsdata. 
                      <strong> Analys</strong> är systemgenererad enligt dokumenterad metod. 
                      <strong> Presentation</strong> är pedagogisk, aldrig normativ.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Allt är tidslinjebundet</h3>
                    <p className="text-muted-foreground">
                      Inget värde existerar utan startdatum, slutdatum och uppdateringsfrekvens.
                      Varje siffra kan spåras bakåt: värde → källa → metod → version.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Ingen individidentifiering</h3>
                    <p className="text-muted-foreground">
                      Endast aggregerad data visas. Segment, kluster och intervall — 
                      aldrig data som kan identifiera enskilda individer.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Ansvar, inte skuld</h3>
                    <p className="text-muted-foreground">
                      Systemet visar <em>vem som hade mandatet</em> när något förändrades. 
                      Vi pekar aldrig på skuld — bara på formellt ansvar.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Korrelation ≠ Orsak</h3>
                    <p className="text-muted-foreground">
                      All samvariation visas med styrka, stabilitet och osäkerhet. 
                      Vi säger aldrig att X orsakar Y — bara att de samvarierar.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* Datakällor */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Våra datakällor
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            All data kommer från öppna, verifierbara myndighetsdata. 
            Ingen data skapas eller modifieras av systemet.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'SCB', desc: 'Statistiska centralbyrån', status: 'active' },
              { name: 'Kolada', desc: 'Kommun- och regiondata', status: 'active' },
              { name: 'Svenska Kraftnät', desc: 'Elnät och energi', status: 'active' },
              { name: 'Socialstyrelsen', desc: 'Hälso- och sjukvård', status: 'planned' },
              { name: 'BRÅ', desc: 'Brottsförebyggande rådet', status: 'planned' },
              { name: 'Arbetsförmedlingen', desc: 'Arbetsmarknadsdata', status: 'planned' },
            ].map((source) => (
              <Card key={source.name} className="text-center">
                <CardContent className="pt-6">
                  <h3 className="font-semibold">{source.name}</h3>
                  <p className="text-sm text-muted-foreground">{source.desc}</p>
                  <Badge 
                    variant={source.status === 'active' ? 'default' : 'secondary'} 
                    className="mt-2"
                  >
                    {source.status === 'active' ? 'Aktiv' : 'Planerad'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Målbild */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-8">Målbild</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">2 min</div>
              <p className="text-muted-foreground">
                Tid för en gymnasieelev att förstå läget
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10 min</div>
              <p className="text-muted-foreground">
                Tid för en journalist att verifiera all data
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">∞</div>
              <p className="text-muted-foreground">
                Djup för en forskare att analysera
              </p>
            </div>
          </div>
          
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-lg italic">
                "Ett öppet, levande, faktabaserat nervsystem för ett land — 
                där verkligheten går att se, följa och förstå i valfri upplösning."
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Redo att se läget?
          </h2>
          <p className="mb-8 opacity-90">
            Utforska Sveriges 20 viktigaste nyckeltal och se hur det egentligen går.
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
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <p>NOGF — Nationellt Offentligt Gransknings-Facit</p>
          <p className="mt-2">Öppna data. Öppen metod. För folket.</p>
        </div>
      </footer>
    </div>
  );
}
