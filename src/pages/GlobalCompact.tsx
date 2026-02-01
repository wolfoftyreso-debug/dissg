import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  Scale, 
  FileCheck, 
  Lock, 
  Users, 
  MessageSquare, 
  Archive, 
  Calendar,
  CheckCircle2,
  BookOpen,
  Globe,
  Eye,
  GitBranch,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

// Core principles (Block IA)
const CORE_PRINCIPLES = [
  {
    id: 1,
    name: 'Öppenhet',
    description: 'All offentlig data är synlig för alla, utan undantag.',
    icon: Eye,
  },
  {
    id: 2,
    name: 'Spårbarhet',
    description: 'Varje siffra kan följas till källa och metod.',
    icon: GitBranch,
  },
  {
    id: 3,
    name: 'Icke-normativitet',
    description: 'Systemet beskriver verkligheten, det föreskriver inte handling.',
    icon: Scale,
  },
  {
    id: 4,
    name: 'Relevans före volym',
    description: 'Påverkan på samhället styr synlighet, inte datamängd.',
    icon: Sparkles,
  },
  {
    id: 5,
    name: 'Rättssäkerhet',
    description: 'Ansvar visas strukturellt och transparent, aldrig dömande.',
    icon: Shield,
  },
  {
    id: 6,
    name: 'Federation',
    description: 'Ingen central ägare av sanning. Distribuerad verifiering.',
    icon: Globe,
  },
  {
    id: 7,
    name: 'Reproducerbarhet',
    description: 'All analys kan återskapas av vem som helst.',
    icon: BookOpen,
  },
];

// Rights (Block IB)
const RIGHTS = [
  'Rätten att se all offentlig data',
  'Rätten att ifrågasätta metod och källor',
  'Rätten att återskapa alla analyser',
  'Rätten att bygga egna vyer och tolkningar',
];

// Duties (Block IB)
const DUTIES = [
  'Visa källor för all data',
  'Visa metod för alla beräkningar',
  'Märka osäkerhet tydligt',
  'Inte påstå kausalitet utan empiriskt stöd',
];

// Operator oath (Block IC)
const OATH_POINTS = [
  'Inte manipulera prioritering politiskt',
  'Inte dölja obekväm data',
  'Inte sälja exklusiv verklighetsbild',
  'Avgå hellre än att bryta kontraktet',
];

// Enforcement mechanisms (Block ID)
const ENFORCEMENT = [
  { name: 'Metadatakrav', description: 'Hårda krav på metadata vid all datainmatning' },
  { name: 'Renderingsblockering', description: 'Data visas inte utan källa och metod' },
  { name: 'Publik logg', description: 'Alla avvikelser loggas publikt i realtid' },
  { name: 'Automatisk validering', description: 'Tekniska kontroller före publicering' },
];

// Blocks for navigation
const BLOCKS = [
  { id: 'ia', name: 'Kärnprinciper', icon: Shield },
  { id: 'ib', name: 'Rättigheter & Skyldigheter', icon: Scale },
  { id: 'ic', name: 'Operatörsed', icon: FileCheck },
  { id: 'id', name: 'Teknisk Efterlevnad', icon: Lock },
  { id: 'ie', name: 'Signatärprogram', icon: Users },
  { id: 'if', name: 'Oenighetshantering', icon: MessageSquare },
  { id: 'ig', name: 'Arkivgaranti', icon: Archive },
  { id: 'ih', name: 'Global Reality Day', icon: Calendar },
];

export default function GlobalCompact() {
  const [activeBlock, setActiveBlock] = useState('ia');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Tillbaka</span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-lg font-semibold text-foreground">Global Reality Compact</h1>
                <p className="text-xs text-muted-foreground">Version 3.0 — Slutgiltig</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Aktiv
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-6">
            <Globe className="h-4 w-4" />
            Global Reality OS v3.0
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Det öppna samhällskontraktet
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Spelreglerna för öppen, verifierbar verklighetsanalys. 
            Ingen äger sanningen. Alla kan verifiera.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {BLOCKS.map((block) => (
              <Button
                key={block.id}
                variant={activeBlock === block.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setActiveBlock(block.id);
                  document.getElementById(block.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <block.icon className="h-3.5 w-3.5 mr-1.5" />
                {block.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-12">
        
        {/* Block IA: Core Principles */}
        <section id="ia" className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Block IA — Kärnprinciper</h3>
              <p className="text-sm text-muted-foreground">Ofrånkomliga principer för systemet</p>
            </div>
            <Badge className="ml-auto">Konstitutionella</Badge>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CORE_PRINCIPLES.map((principle, index) => (
              <Card key={principle.id} className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {principle.id}
                    </div>
                    <CardTitle className="text-base">{principle.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground italic">
              📌 Dessa principer är konstitutionella för systemet och kan inte ändras utan fullständig konsensus.
            </p>
          </div>
        </section>

        <Separator />

        {/* Block IB: Rights & Duties */}
        <section id="ib" className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Scale className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Block IB — Rättigheter & Skyldigheter</h3>
              <p className="text-sm text-muted-foreground">För användare, noder och operatörer</p>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Rättigheter
                </CardTitle>
                <CardDescription>Vad alla har rätt till</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {RIGHTS.map((right, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-sm">{right}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-amber-500" />
                  Skyldigheter
                </CardTitle>
                <CardDescription>Vad alla måste uppfylla</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {DUTIES.map((duty, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-sm">{duty}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground italic">
              📌 Missbruk hanteras genom transparens, inte censur.
            </p>
          </div>
        </section>

        <Separator />

        {/* Block IC: Operator Oath */}
        <section id="ic" className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-violet-500/10">
              <FileCheck className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Block IC — Operatörsed</h3>
              <p className="text-sm text-muted-foreground">Det offentliga åtagandet</p>
            </div>
            <Badge variant="outline" className="ml-auto">Bindande</Badge>
          </div>
          
          <Card className="border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-background">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <p className="text-lg font-medium text-foreground">
                  "Som operatör av detta system lovar jag att:"
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {OATH_POINTS.map((point, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/10 text-violet-500 text-xs font-semibold">
                      {i + 1}
                    </div>
                    <span className="text-sm">{point}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground italic">
                  📌 Detta är institutionell heder. Ingen kompromiss.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Block ID: Technical Enforcement */}
        <section id="id" className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-rose-500/10">
              <Lock className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Block ID — Teknisk Efterlevnad</h3>
              <p className="text-sm text-muted-foreground">Principer kodade, inte policyer</p>
            </div>
            <Badge variant="destructive" className="ml-auto">Kodlåst</Badge>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {ENFORCEMENT.map((item, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-rose-500/10">
                      <Lock className="h-4 w-4 text-rose-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-4 p-4 rounded-lg bg-rose-500/5 border border-rose-500/20">
            <p className="text-sm text-rose-600 dark:text-rose-400 italic">
              📌 Man kan inte "råka" bryta kontraktet. Systemet förhindrar det.
            </p>
          </div>
        </section>

        <Separator />

        {/* Block IE: Signatory Program */}
        <section id="ie" className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Users className="h-5 w-5 text-cyan-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Block IE — Signatärprogram</h3>
              <p className="text-sm text-muted-foreground">Frivillig anslutning för länder och institutioner</p>
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3">Signatärer förbinder sig att:</h4>
                  <ul className="space-y-2">
                    {[
                      'Acceptera Global Reality Compact',
                      'Publicera data enligt standard',
                      'Genomgå publik granskning',
                      'Visa verifieringsbadge'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-cyan-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center p-6 rounded-xl border-2 border-dashed border-cyan-500/30 bg-cyan-500/5">
                    <Badge className="bg-cyan-500/10 text-cyan-600 border-cyan-500/30 text-lg px-4 py-2">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Verifierad Signatär
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-3">
                      Legitimitet genom efterlevnad
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Block IF: Dispute Mechanism */}
        <section id="if" className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <MessageSquare className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Block IF — Oenighetshantering</h3>
              <p className="text-sm text-muted-foreground">Oenighet hanteras öppet</p>
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-orange-500/10 shrink-0">
                    <MessageSquare className="h-4 w-4 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Hur det fungerar</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Alternativa analyser samexisterar i systemet</li>
                      <li>• Skillnader visas sida vid sida</li>
                      <li>• Metoder jämförs transparent</li>
                      <li>• Läsaren avgör själv</li>
                    </ul>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                    📌 Konsensus är inte ett krav. Transparens är.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Block IG: Archival Guarantee */}
        <section id="ig" className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-slate-500/10">
              <Archive className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Block IG — Arkivgaranti</h3>
              <p className="text-sm text-muted-foreground">Kunskap bevaras över generationer</p>
            </div>
            <Badge variant="secondary" className="ml-auto">Permanent</Badge>
          </div>
          
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { icon: FileCheck, label: 'Öppna format', desc: 'Standardiserade, läsbara' },
              { icon: Globe, label: 'Långtidsspegling', desc: 'Geografiskt distribuerat' },
              { icon: Archive, label: 'Publika snapshots', desc: 'Regelbundna säkerhetskopior' },
              { icon: Users, label: 'Oberoende noder', desc: 'Decentraliserad lagring' },
            ].map((item, i) => (
              <Card key={i} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center mb-3">
                    <item.icon className="h-5 w-5 text-slate-500" />
                  </div>
                  <h4 className="font-medium text-sm">{item.label}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground italic">
              📌 Systemet överlever epoker. Data förblir tillgänglig.
            </p>
          </div>
        </section>

        <Separator />

        {/* Block IH: Global Reality Day */}
        <section id="ih" className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Calendar className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Block IH — Global Reality Day</h3>
              <p className="text-sm text-muted-foreground">Årlig gemensam lägesbild</p>
            </div>
            <Badge variant="outline" className="ml-auto bg-amber-500/10 text-amber-600 border-amber-500/30">
              Årlig Ritual
            </Badge>
          </div>
          
          <Card className="bg-gradient-to-br from-amber-500/5 to-background border-amber-500/20">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <Calendar className="h-12 w-12 text-amber-500 mx-auto mb-3" />
                <h4 className="text-lg font-semibold">Årlig Sammanfattning</h4>
                <p className="text-sm text-muted-foreground">Ödmjukhet institutionaliserad</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  'Hur världen förändrats sedan förra året',
                  'Vilka antaganden som visade sig felaktiga',
                  'Vilka mönster som stärktes',
                  'Vad vi fortfarande inte vet',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold">
                      {i + 1}
                    </div>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Version Freeze Section */}
        <section className="scroll-mt-20">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-background overflow-hidden">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                <Badge className="bg-primary/10 text-primary border-primary/30 text-lg px-4 py-2">
                  Global Reality OS v3.0 — Complete
                </Badge>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">System Slutstatus</h3>
                  <p className="text-muted-foreground">Alla moduler implementerade och verifierade</p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-5 max-w-3xl mx-auto">
                  {[
                    { label: 'Verklighet', value: 'Modellerad' },
                    { label: 'Relevans', value: 'Rangordnad' },
                    { label: 'Ansvar', value: 'Spårbart' },
                    { label: 'Medvetande', value: 'Synligt' },
                    { label: 'Styrning', value: 'Federerad' },
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-lg bg-background border border-border">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-semibold text-primary">{item.value}</p>
                    </div>
                  ))}
                </div>
                
                <Separator className="max-w-md mx-auto" />
                
                <div className="max-w-xl mx-auto p-6 rounded-xl bg-foreground/5">
                  <p className="text-lg font-medium italic text-foreground">
                    "Vi visar världen sådan den är. Inte sådan någon vill att den ska vara."
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Vi pekar. Vi förklarar. Vi döljer inget.
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Bygge: KLART</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Arkitektur: SLUTGILTIG</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Principer: KODADE</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Ägande av sanning: INGEN</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Tillgång: ALLA</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Global Reality Compact v3.0 — Det öppna samhällskontraktet för verifierbar verklighet
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/" className="text-sm text-primary hover:underline">
              Tillbaka till Dashboard
            </Link>
            <Link to="/public" className="text-sm text-primary hover:underline">
              Publik Vy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
