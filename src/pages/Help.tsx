/**
 * HELP PAGE
 * 
 * Comprehensive documentation, tutorials, and support for DISSG.
 * - System documentation
 * - FAQ
 * - Tutorials
 * - Contact/Support
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ODISHeader, ODISFooter } from '@/components/gdis';
import { Link } from 'react-router-dom';

interface DocSection {
  id: string;
  title: string;
  description: string;
  path?: string;
  content?: string;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const DOC_SECTIONS: DocSection[] = [
  { 
    id: 'getting-started', 
    title: 'Komma igång', 
    description: 'Grundläggande introduktion till DISSG-systemet',
    content: `
## Välkommen till DISSG

DISSG (Diagnostic Information System for Societal Governance) är ett kliniskt diagnostiksystem 
för samhällsstyrning. Systemet fungerar som ett "oscilloskop för civilisationen" – det mäter, 
visualiserar och analyserar samhällets tillstånd utan att ta ställning politiskt.

### Grundprinciper

1. **Data utan narrativ** – Vi visar vad som händer, inte vad som borde hända
2. **Full transparens** – Varje siffra är klickbar till källdata
3. **Ingen spekulation** – Om data saknas, säger vi det
4. **Oberoende** – Systemet påverkas inte av politiska intressen

### Första stegen

1. Utforska huvuddashboarden för att se aktuellt läge
2. Klicka på valfri indikator för djupare analys
3. Använd tidslinjen för att se utveckling över tid
4. Jämför länder och regioner i indexvyn
    `
  },
  { 
    id: 'indicators', 
    title: 'Indikatorer & Index', 
    description: 'Hur systemet mäter samhällets tillstånd',
    content: `
## Indikatorer i DISSG

Systemet använder hundratals verifierade indikatorer för att mäta samhällets hälsa.

### Indikatortyper

- **Vitality [VIT]** – Liv & Hälsa
- **Livelihood [FÖR]** – Försörjning
- **Capacity [KAP]** – Kapacitet
- **Stability [STA]** – Stabilitet
- **Sustainability [HÅL]** – Hållbarhet

### Lambda-värdet (λ)

Lambda är systemets centrala balansmått där 1,0 representerar optimal jämvikt.

- λ < 1.0 = Ineffektivitet (underutnyttjade resurser)
- λ = 1.0 = Optimal balans
- λ > 1.0 = Stress (överbelastning)
    `
  },
  { 
    id: 'data-sources', 
    title: 'Datakällor', 
    description: 'Varifrån systemet hämtar sin information',
    path: '/data'
  },
  { 
    id: 'api', 
    title: 'API-dokumentation', 
    description: 'Programmatisk access till DISSG-data',
    path: '/api-policy'
  },
  { 
    id: 'governance', 
    title: 'Systemprinciper', 
    description: 'De immutabla principerna som styr systemet',
    path: '/governance'
  },
  { 
    id: 'charter', 
    title: 'Data Charter', 
    description: 'Hur vi hanterar och skyddar data',
    path: '/charter'
  },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Vad är DISSG?',
    answer: 'DISSG (Diagnostic Information System for Societal Governance) är ett neutralt diagnostiksystem som mäter och visualiserar samhällets tillstånd. Det fungerar som ett "oscilloskop för civilisationen" – det visar vad som händer utan att ta ställning till vad som borde hända.',
    category: 'general'
  },
  {
    question: 'Varifrån kommer datan?',
    answer: 'All data kommer från verifierade, officiella källor som Eurostat, SCB, WHO, Världsbanken och nationella statistikbyråer. Varje datapunkt kan spåras till sin ursprungskälla.',
    category: 'data'
  },
  {
    question: 'Hur ofta uppdateras datan?',
    answer: 'Uppdateringsfrekvensen varierar beroende på källan. Vissa indikatorer uppdateras dagligen, andra månadsvis eller årligen. Varje indikator visar senaste uppdateringstid.',
    category: 'data'
  },
  {
    question: 'Vad betyder Lambda (λ)?',
    answer: 'Lambda är systemets centrala balansmått. λ = 1,0 representerar optimal jämvikt. Värden under 1,0 indikerar ineffektivitet, värden över 1,0 indikerar stress eller överbelastning.',
    category: 'technical'
  },
  {
    question: 'Kan jag lita på analyserna?',
    answer: 'DISSG presenterar bara faktiska data och statistiska observationer – aldrig spekulationer eller åsikter. Varje analys visar konfidensintervall och begränsningar. Vi säger hellre "vet ej" än att gissa.',
    category: 'technical'
  },
  {
    question: 'Hur får jag API-access?',
    answer: 'API-access finns i olika nivåer beroende på användningsfall. Se API-dokumentationen för licensieringsalternativ och prissättning.',
    category: 'api'
  },
  {
    question: 'Varför visar vissa fält streck (—)?',
    answer: 'Ett streck betyder att data inte är tillgänglig från någon verifierad källa. Vi visar aldrig simulerad eller påhittad data – tystnad framför spekulation.',
    category: 'data'
  },
  {
    question: 'Hur kan jag bidra med data?',
    answer: 'Vi välkomnar samarbeten med officiella datakällor. Kontakta oss för att diskutera datapartnerskap och integrationer.',
    category: 'general'
  },
  {
    question: 'Är systemet politiskt oberoende?',
    answer: 'Ja. DISSG är designat för att vara helt oberoende av politiska intressen. Vi rekommenderar aldrig policy, vi mäter bara verkligheten. Systemets konstitution förbjuder normativa uttalanden.',
    category: 'general'
  },
  {
    question: 'Vad kostar det?',
    answer: 'Grundläggande tillgång är gratis för alla (Observer-nivå). Avancerade funktioner som export, scenariolab och API-access kräver prenumeration. Se prissättning för detaljer.',
    category: 'general'
  },
];

const FAQ_CATEGORIES = [
  { id: 'all', label: 'Alla' },
  { id: 'general', label: 'Allmänt' },
  { id: 'data', label: 'Data' },
  { id: 'technical', label: 'Tekniskt' },
  { id: 'api', label: 'API' },
];

const KEYBOARD_SHORTCUTS = [
  { keys: ['?'], description: 'Visa tangentbordsgenvägar' },
  { keys: ['/', 'Ctrl+K'], description: 'Öppna sökfält' },
  { keys: ['Esc'], description: 'Stäng dialoger' },
  { keys: ['←', '→'], description: 'Navigera i tid' },
  { keys: ['1-5'], description: 'Byt vy (1=Diagnosis, 2=Modules, etc.)' },
  { keys: ['D'], description: 'Gå till Dashboard' },
  { keys: ['I'], description: 'Gå till Index' },
  { keys: ['H'], description: 'Gå till Hjälp' },
];

export default function Help() {
  const [activeTab, setActiveTab] = useState('docs');
  const [searchQuery, setSearchQuery] = useState('');
  const [faqCategory, setFaqCategory] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState<DocSection | null>(null);

  const filteredFAQ = FAQ_ITEMS.filter(item => {
    if (faqCategory !== 'all' && item.category !== faqCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return item.question.toLowerCase().includes(query) || 
             item.answer.toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background font-mono">
      <ODISHeader 
        systemName="HELP — Documentation & Support"
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <Input
              placeholder="Sök i dokumentation och FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="font-mono"
            />
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="docs" className="font-mono text-xs">[DOCS]</TabsTrigger>
            <TabsTrigger value="faq" className="font-mono text-xs">[FAQ]</TabsTrigger>
            <TabsTrigger value="shortcuts" className="font-mono text-xs">[GENVÄGAR]</TabsTrigger>
            <TabsTrigger value="contact" className="font-mono text-xs">[KONTAKT]</TabsTrigger>
          </TabsList>

          {/* DOCUMENTATION TAB */}
          <TabsContent value="docs" className="mt-4">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Doc Navigation */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-sm">[INNEHÅLL]</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {DOC_SECTIONS.map(section => (
                    <Button
                      key={section.id}
                      variant={selectedDoc?.id === section.id ? 'default' : 'ghost'}
                      className="w-full justify-start text-left text-sm"
                      onClick={() => {
                        if (section.path) {
                          window.location.href = section.path;
                        } else {
                          setSelectedDoc(section);
                        }
                      }}
                    >
                      <span className="truncate">{section.title}</span>
                      {section.path && <span className="ml-auto text-xs">[→]</span>}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Doc Content */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm">
                    {selectedDoc?.title || 'Välj ett avsnitt'}
                  </CardTitle>
                  <CardDescription>
                    {selectedDoc?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDoc?.content ? (
                    <ScrollArea className="h-[400px]">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {selectedDoc.content}
                        </pre>
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <p>Välj ett avsnitt från menyn till vänster för att läsa dokumentationen.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FAQ TAB */}
          <TabsContent value="faq" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <CardTitle className="text-sm">[VANLIGA FRÅGOR]</CardTitle>
                  <div className="flex gap-2">
                    {FAQ_CATEGORIES.map(cat => (
                      <Badge
                        key={cat.id}
                        variant={faqCategory === cat.id ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setFaqCategory(cat.id)}
                      >
                        {cat.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredFAQ.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>Inga frågor matchar din sökning.</p>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFAQ.map((item, idx) => (
                      <AccordionItem key={idx} value={`item-${idx}`}>
                        <AccordionTrigger className="text-sm text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SHORTCUTS TAB */}
          <TabsContent value="shortcuts" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">[TANGENTBORDSGENVÄGAR]</CardTitle>
                <CardDescription>
                  Snabbkommandon för effektiv navigering.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {KEYBOARD_SHORTCUTS.map((shortcut, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex gap-2">
                        {shortcut.keys.map((key, i) => (
                          <kbd 
                            key={i}
                            className="px-2 py-1 bg-background border rounded text-xs font-mono"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CONTACT TAB */}
          <TabsContent value="contact" className="mt-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">[SUPPORT]</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Teknisk support</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      För tekniska frågor och bugrapporter.
                    </p>
                    <p className="font-mono text-sm">support@dissg.org</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">API & Licenser</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Frågor om API-access och licensiering.
                    </p>
                    <p className="font-mono text-sm">api@dissg.org</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Datapartnerskap</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      För officiella datakällor som vill integrera.
                    </p>
                    <p className="font-mono text-sm">data@dissg.org</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">[RESURSER]</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link to="/om">
                    <Button variant="outline" className="w-full justify-start">
                      [→] Om systemet
                    </Button>
                  </Link>
                  <Link to="/governance">
                    <Button variant="outline" className="w-full justify-start">
                      [→] Governance & Principer
                    </Button>
                  </Link>
                  <Link to="/api-policy">
                    <Button variant="outline" className="w-full justify-start">
                      [→] API-dokumentation
                    </Button>
                  </Link>
                  <Link to="/trust-log">
                    <Button variant="outline" className="w-full justify-start">
                      [→] Trust Log
                    </Button>
                  </Link>
                  
                  <div className="p-4 bg-muted/50 rounded text-xs text-muted-foreground">
                    <strong>Svarstid:</strong> Vi svarar normalt inom 24–48 timmar på vardagar.
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <ODISFooter />
    </div>
  );
}
