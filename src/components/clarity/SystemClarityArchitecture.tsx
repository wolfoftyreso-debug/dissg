import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  FolderOpen, 
  BarChart3,
  Layers,
  Shield,
  Heart,
  CheckCircle,
  XCircle,
  Info,
  Eye,
  FileText,
  Palette,
  Scale,
  Globe,
  ArrowRight
} from 'lucide-react';
import {
  LEVEL_1_FOLDERS,
  LEVEL_2_PERSPECTIVES,
  GRAPH_REQUIRED_ELEMENTS,
  COLOR_RULES,
  AGGREGATION_RULES,
  UNBREAKABLE_RULES,
  UX_GOALS,
  UX_PRINCIPLES,
  SYSTEM_IDENTITY,
  type GraphMetadata
} from '@/config/systemClarityConfig';

// Example graph with proper metadata
const EXAMPLE_GRAPH: GraphMetadata = {
  title: 'Energi per capita, globalt',
  whatAreYouLookingAt: 'Detta är utvecklingen av energianvändning per person i världen över tid.',
  whyIsThisShown: 'Denna indikator har stark koppling till mänskligt välbefinnande och ekonomisk utveckling.',
  howToInterpret: 'Upp = mer energi per person. Ned = mindre energi per person.\nDet betyder inte automatiskt bättre eller sämre – bara mer eller mindre.',
  timePeriod: { start: '1990', end: '2024' },
  geographicLevel: 'Global',
  dataSource: 'IEA World Energy Statistics',
  lastUpdated: '2024-06-15',
  uncertainty: 'Osäkerhet ±3% på grund av skillnader i nationell rapportering'
};

const SystemClarityArchitecture: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('architecture');
  const [selectedFolder, setSelectedFolder] = useState('humanity');

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">System Clarity Architecture</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {SYSTEM_IDENTITY.whatItIs}
        </p>
        <Badge variant="outline" className="text-sm">
          {SYSTEM_IDENTITY.requirement}
        </Badge>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="architecture">Arkitektur</TabsTrigger>
          <TabsTrigger value="graphs">Grafgrammatik</TabsTrigger>
          <TabsTrigger value="aggregation">Aggregering</TabsTrigger>
          <TabsTrigger value="rules">Regler</TabsTrigger>
          <TabsTrigger value="experience">Upplevelse</TabsTrigger>
        </TabsList>

        {/* ARCHITECTURE TAB */}
        <TabsContent value="architecture" className="space-y-6">
          {/* Level 1: Domain Folders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Nivå 1 — Världen (Default)
              </CardTitle>
              <CardDescription>
                Användaren ska aldrig behöva veta vad de letar efter. De börjar i verkligheten.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {LEVEL_1_FOLDERS.map((folder) => (
                  <div
                    key={folder.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedFolder === folder.id 
                        ? 'bg-primary/10 border-primary' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedFolder(folder.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{folder.icon}</span>
                      <span className="font-medium">{folder.nameSv}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{folder.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Level 2: Perspectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Nivå 2 — Perspektiv
              </CardTitle>
              <CardDescription>
                Varje huvudmapp bryts alltid ner i samma perspektiv. Samma struktur överallt = trygghet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-6">
                {LEVEL_2_PERSPECTIVES.map((perspective) => (
                  <div key={perspective.id} className="p-3 border rounded-lg text-center">
                    <div className="font-medium">{perspective.nameSv}</div>
                    <div className="text-xs text-muted-foreground mt-1">{perspective.question}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Level 3: Key Data */}
          <Card>
            <CardHeader>
              <CardTitle>Nivå 3 — Nyckeldata</CardTitle>
              <CardDescription>
                Här finns inte allt. Här finns det som förklarar mest. Ingen "databuffé".
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{LEVEL_1_FOLDERS.find(f => f.id === selectedFolder)?.icon}</span>
                  <span className="font-medium">{LEVEL_1_FOLDERS.find(f => f.id === selectedFolder)?.nameSv}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {LEVEL_1_FOLDERS.find(f => f.id === selectedFolder)?.keyIndicators.map((indicator) => (
                    <Badge key={indicator} variant="secondary">{indicator}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Level 4: Explore */}
          <Card>
            <CardHeader>
              <CardTitle>Nivå 4 — Utforska själv</CardTitle>
              <CardDescription>Men alltid från ett stabilt fundament</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-4">
                {['Jämförelser', 'Korrelationer', 'Lärdomar', '"Rita själv"'].map((item) => (
                  <div key={item} className="p-3 border rounded-lg text-center">
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GRAPHS TAB */}
        <TabsContent value="graphs" className="space-y-6">
          {/* Graph Grammar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Grafgrammatik
              </CardTitle>
              <CardDescription>
                Varje graf MÅSTE svara på tre frågor. Text först – grafik som stöd.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Example Graph Metadata */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3">{EXAMPLE_GRAPH.title}</h4>
                  
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="font-medium text-primary mb-1">1. Vad tittar jag på?</div>
                      <p className="text-muted-foreground">{EXAMPLE_GRAPH.whatAreYouLookingAt}</p>
                    </div>
                    
                    <div>
                      <div className="font-medium text-primary mb-1">2. Varför visas detta?</div>
                      <p className="text-muted-foreground">{EXAMPLE_GRAPH.whyIsThisShown}</p>
                    </div>
                    
                    <div>
                      <div className="font-medium text-primary mb-1">3. Hur ska jag tolka rörelsen?</div>
                      <p className="text-muted-foreground whitespace-pre-line">{EXAMPLE_GRAPH.howToInterpret}</p>
                    </div>
                  </div>
                </div>

                {/* Required Elements */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3">Obligatoriska element</h4>
                  <div className="space-y-2">
                    {GRAPH_REQUIRED_ELEMENTS.map((element) => (
                      <div key={element} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        {element}
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <h4 className="font-semibold mb-3">Exempeldata</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>Period: {EXAMPLE_GRAPH.timePeriod.start}–{EXAMPLE_GRAPH.timePeriod.end}</div>
                    <div>Nivå: {EXAMPLE_GRAPH.geographicLevel}</div>
                    <div>Källa: {EXAMPLE_GRAPH.dataSource}</div>
                    <div>Uppdaterad: {EXAMPLE_GRAPH.lastUpdated}</div>
                    <div>Osäkerhet: {EXAMPLE_GRAPH.uncertainty}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Färger (ingen emotion)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 rounded bg-primary/10">
                    <div className="w-6 h-6 rounded bg-primary" />
                    <span>{COLOR_RULES.blue}</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded bg-muted">
                    <div className="w-6 h-6 rounded bg-muted-foreground" />
                    <span>{COLOR_RULES.gray}</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded bg-warning/10">
                    <div className="w-6 h-6 rounded bg-warning" />
                    <span>{COLOR_RULES.orange}</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded bg-destructive/10">
                    <div className="w-6 h-6 rounded bg-destructive" />
                    <span>{COLOR_RULES.red}</span>
                  </div>
                </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Obrytbar regel</AlertTitle>
                  <AlertDescription>{COLOR_RULES.never}</AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AGGREGATION TAB */}
        <TabsContent value="aggregation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Aggregeringsregler
              </CardTitle>
              <CardDescription>Från data till förståelse</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {AGGREGATION_RULES.map((rule) => (
                  <div key={rule.id} className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-muted">
                      <h4 className="font-semibold">{rule.rule}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{rule.principle}</p>
                    </div>
                    <div className="grid md:grid-cols-2">
                      <div className="p-4 border-r border-b md:border-b-0">
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="h-4 w-4 text-destructive" />
                          <span className="text-sm font-medium text-destructive">Fel</span>
                        </div>
                        <pre className="text-sm bg-destructive/10 p-2 rounded whitespace-pre-wrap">
                          {rule.wrongExample}
                        </pre>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-primary">Rätt</span>
                        </div>
                        <pre className="text-sm bg-primary/10 p-2 rounded whitespace-pre-wrap">
                          {rule.correctExample}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RULES TAB */}
        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Obrytbara regler
              </CardTitle>
              <CardDescription>
                Ni bygger för hela mänskligheten, inte för experter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {UNBREAKABLE_RULES.map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="outline" className="text-lg font-bold">
                        {rule.code}
                      </Badge>
                      <h4 className="font-semibold">{rule.titleSv}</h4>
                    </div>
                    <p className="text-sm mb-3">{rule.rule}</p>
                    <div className="grid gap-2 md:grid-cols-2 text-sm">
                      <div className="p-2 bg-muted rounded">
                        <span className="font-medium">Test: </span>
                        <span className="text-muted-foreground">{rule.test}</span>
                      </div>
                      <div className="p-2 bg-destructive/10 rounded">
                        <span className="font-medium">Konsekvens: </span>
                        <span className="text-muted-foreground">{rule.consequence}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EXPERIENCE TAB */}
        <TabsContent value="experience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Vad användaren ska känna
              </CardTitle>
              <CardDescription>Efter 5 minuter i systemet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {UX_GOALS.map((goal, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-lg">"{goal.feelingSv}"</span>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="flex items-center justify-center gap-4">
                <div className="text-center p-4">
                  <XCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <span className="text-muted-foreground">{UX_PRINCIPLES.notStress}</span>
                </div>
                <div className="text-center p-4">
                  <XCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <span className="text-muted-foreground">{UX_PRINCIPLES.notGuilt}</span>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <CheckCircle className="h-8 w-8 mx-auto text-primary mb-2" />
                  <span className="font-medium text-primary">{UX_PRINCIPLES.understanding}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Identity */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground line-through">{SYSTEM_IDENTITY.whatItIsNot}</span>
                </div>
                <ArrowRight className="h-5 w-5 mx-auto text-primary" />
                <div className="flex items-center justify-center gap-2">
                  <Globe className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold text-primary">{SYSTEM_IDENTITY.whatItIs}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemClarityArchitecture;
