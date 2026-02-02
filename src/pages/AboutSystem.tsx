import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Database,
  FileText,
  Link2,
  Eye,
  Clock,
  Layers,
  Shield,
  GitBranch,
  Server,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// ═══════════════════════════════════════════════════════════════════════════
// SYSTEMSPECIFIKATION — Teknisk beskrivning av systemets funktion och syfte
// ═══════════════════════════════════════════════════════════════════════════

export default function AboutSystem() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-12 md:py-16 px-6 border-b">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4 font-mono text-xs">
            v1.0 / Systemspecifikation
          </Badge>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Systemspecifikation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Teknisk dokumentation av systemets arkitektur, dataflöden och operativa principer.
          </p>
        </div>
      </header>

      {/* Syfte */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            1. Syfte
          </h2>
          
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-muted-foreground">
                Systemet aggregerar, strukturerar och tillgängliggör offentlig statistik 
                för att möjliggöra analys av samhällsutveckling över tid.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Primär funktion</p>
                  <p className="text-sm text-muted-foreground">Dataåtkomst och visualisering</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Geografisk täckning</p>
                  <p className="text-sm text-muted-foreground">Nationell, regional, kommunal</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Temporal upplösning</p>
                  <p className="text-sm text-muted-foreground">Dag till decennium</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Arkitektur */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Layers className="h-5 w-5 text-muted-foreground" />
            2. Arkitektur
          </h2>

          <div className="space-y-4">
            {/* Data layer */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  2.1 Datalager
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Systemet hämtar data från externa källor via standardiserade API:er och 
                  filformat. Ingen primärdata produceras internt.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="font-mono text-xs">SCB API</Badge>
                  <Badge variant="secondary" className="font-mono text-xs">Eurostat SDMX</Badge>
                  <Badge variant="secondary" className="font-mono text-xs">OECD.Stat</Badge>
                  <Badge variant="secondary" className="font-mono text-xs">Världsbanken</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Processing layer */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  2.2 Bearbetningslager
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Data transformeras enligt dokumenterade metoder. Alla transformationer 
                  loggas med tidsstämpel, version och checksumma.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Normalisering till gemensamma enheter
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Tidsseriejustering (säsong, kalender)
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Aggregering enligt NUTS-hierarki
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Presentation layer */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  2.3 Presentationslager
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Visualisering följer en standardiserad grammatik. Varje grafiskt element 
                  svarar på: vad (mätvärde), var (geografi), när (tidsperiod).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Operativa begränsningar */}
      <section className="py-12 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            3. Operativa begränsningar
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Systemet utför */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  Systemet utför
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 mt-1.5 shrink-0" />
                    Datainsamling från namngivna källor
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 mt-1.5 shrink-0" />
                    Transformation enligt dokumenterade metoder
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 mt-1.5 shrink-0" />
                    Visualisering av trender och fördelningar
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 mt-1.5 shrink-0" />
                    Koppling mellan uppdrag och tidsperioder
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 mt-1.5 shrink-0" />
                    Exponering av osäkerhet och datagap
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Systemet utför inte */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                  Systemet utför inte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 mt-1.5 shrink-0" />
                    Prognoser eller prediktioner
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 mt-1.5 shrink-0" />
                    Normativa bedömningar
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 mt-1.5 shrink-0" />
                    Policyrekommendationer
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 mt-1.5 shrink-0" />
                    Kausalitetspåståenden
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 mt-1.5 shrink-0" />
                    Interpolering av saknad data
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Datakontrakt */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Link2 className="h-5 w-5 text-muted-foreground" />
            4. Datakontrakt
          </h2>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-6">
                Varje datapunkt exponeras med obligatoriska metadatafält:
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { field: 'source_id', desc: 'Källa' },
                  { field: 'method_id', desc: 'Metod' },
                  { field: 'confidence', desc: 'Konfidens' },
                  { field: 'coverage', desc: 'Täckning' },
                  { field: 'period_start', desc: 'Periodstart' },
                  { field: 'period_end', desc: 'Periodslut' },
                  { field: 'collected_at', desc: 'Insamlingsdatum' },
                  { field: 'checksum', desc: 'Verifieringshash' },
                ].map((item) => (
                  <div key={item.field} className="p-3 bg-muted/50 rounded-lg">
                    <code className="text-xs font-mono text-foreground">{item.field}</code>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground mt-6">
                Data utan komplett metadata visas med tydlig osäkerhetsmarkering.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Spårbarhet */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-muted-foreground" />
            5. Spårbarhet
          </h2>

          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold mb-3">5.1 Versionshantering</h3>
                <p className="text-sm text-muted-foreground">
                  Alla metodändringar, viktjusteringar och källbyten loggas i en 
                  offentlig ändringslogg med tidsstämpel, beskrivning och ansvarig.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold mb-3">5.2 Revisionshistorik</h3>
                <p className="text-sm text-muted-foreground">
                  Tidigare versioner av dataserier arkiveras och är åtkomliga via 
                  versionerad API-endpoint.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold mb-3">5.3 Extern verifiering</h3>
                <p className="text-sm text-muted-foreground">
                  Checksummor publiceras för oberoende verifiering. 
                  Varje datapunkt kan spåras till ursprungskälla.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Uppdateringsfrekvens */}
      <section className="py-12 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            6. Uppdateringsfrekvens
          </h2>

          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-medium">Datakategori</th>
                      <th className="text-left py-2 pr-4 font-medium">Källfrekvens</th>
                      <th className="text-left py-2 font-medium">Systemfrekvens</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-muted">
                      <td className="py-2 pr-4">Ekonomiska indikatorer</td>
                      <td className="py-2 pr-4">Månad/Kvartal</td>
                      <td className="py-2">Daglig synkronisering</td>
                    </tr>
                    <tr className="border-b border-muted">
                      <td className="py-2 pr-4">Demografisk statistik</td>
                      <td className="py-2 pr-4">År</td>
                      <td className="py-2">Vid publicering</td>
                    </tr>
                    <tr className="border-b border-muted">
                      <td className="py-2 pr-4">Registerdata</td>
                      <td className="py-2 pr-4">Varierande</td>
                      <td className="py-2">Vid uppdatering</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Mandatperioder</td>
                      <td className="py-2 pr-4">Händelsebaserat</td>
                      <td className="py-2">Manuell verifiering</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Relaterad dokumentation */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Relaterad dokumentation</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/charter">
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    Datakonstitution
                    <ExternalLink className="h-3 w-3" />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Grundläggande principer för datahantering.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/trust-log">
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    Ändringslogg
                    <ExternalLink className="h-3 w-3" />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Komplett historik över systemändringar.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/governance">
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    Styrningsmodell
                    <ExternalLink className="h-3 w-3" />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Beslutsprocedurer och ansvarsfördelning.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t bg-muted/20">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Senast uppdaterad: {new Date().toISOString().split('T')[0]}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/public">Till översikten</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/onboarding">Introduktion</Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
