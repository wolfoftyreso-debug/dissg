/**
 * Evidence Mechanism Page
 * 
 * Public page explaining how the evidence system works in practice.
 * URL: /mechanism
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Cog, 
  FileText, 
  Link2, 
  Eye, 
  Newspaper, 
  Bot, 
  Shield,
  ArrowRight,
  ArrowLeftRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClaimCard } from '@/components/evidence/ClaimCard';
import { ReportEmbed } from '@/components/evidence/ReportEmbed';
import { 
  EVIDENCE_STATUSES, 
  REPORT_ID_SPEC,
  AI_GROUNDING_SPEC,
  EXPECTED_EFFECTS,
  VALUE_DRIVEN_TEMPLATE,
  generateEmbedCode
} from '@/config/evidenceMechanism';

// Demo claim for illustration
const demoClaims = [
  {
    id: '1',
    claimText: 'This reform will reduce unemployment by 15%',
    claimTextLocal: { sv: 'Denna reform kommer minska arbetslösheten med 15%' },
    linkedReportId: null,
    linkedReportCode: null,
    evidenceStatus: 'unsupported' as const,
    claimedBy: 'Ministry of Finance',
    claimedAt: '2026-01-15',
    context: 'Budget proposal 2026',
    isValueDriven: false
  },
  {
    id: '2',
    claimText: 'Investments in education correlate with GDP growth',
    claimTextLocal: { sv: 'Investeringar i utbildning korrelerar med BNP-tillväxt' },
    linkedReportId: 'abc123',
    linkedReportCode: 'GL-2026-00417',
    evidenceStatus: 'supported' as const,
    claimedBy: 'OECD Analysis',
    claimedAt: '2026-02-01',
    context: 'Education Policy Report',
    isValueDriven: false
  },
  {
    id: '3',
    claimText: 'We prioritize environmental protection',
    claimTextLocal: { sv: 'Vi prioriterar miljöskydd' },
    linkedReportId: null,
    linkedReportCode: null,
    evidenceStatus: 'unsupported' as const,
    claimedBy: 'Government',
    claimedAt: '2026-01-20',
    context: 'Policy declaration',
    isValueDriven: true,
    valueStatement: 'Value-driven priority'
  }
];

export default function EvidenceMechanismPage() {
  const lang = 'sv';

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cog className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">The Evidence Mechanism</h1>
          <p className="text-lg text-muted-foreground">
            Hur "inget beslut utan rapport" blir standard i praktiken
          </p>
        </header>

        {/* Core Idea */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="py-6 text-center">
            <p className="text-lg font-medium">
              Kräv inte ansvar. <br />
              <span className="text-primary">Gör ansvar till det enda fungerande alternativet.</span>
            </p>
          </CardContent>
        </Card>

        {/* 1. Evidence Report = First-Class Object */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">1. Evidence Report = Förstaklassigt objekt</h2>
          </div>
          
          <Card>
            <CardContent className="py-6">
              <p className="text-muted-foreground mb-4">
                En Evidence Report är inte ett PDF-dokument. Det är ett systemobjekt, lika grundläggande som en URL.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Varje rapport har:</p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">{REPORT_ID_SPEC.example}</Badge>
                      <span>Unikt ID</span>
                    </li>
                    <li>• Permanent länk</li>
                    <li>• Versionshistorik</li>
                    <li>• Scope-definition</li>
                    <li>• Datatäckning</li>
                    <li>• Osäkerhetsprofil</li>
                  </ul>
                </div>
                <div className="bg-muted p-4 rounded">
                  <p className="text-xs text-muted-foreground mb-2">Format:</p>
                  <code className="text-lg font-mono text-primary">{REPORT_ID_SPEC.format}</code>
                  <p className="text-xs text-muted-foreground mt-2">
                    Rapporter är citerbara byggklossar, inte texter.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 2. Claim → Evidence Linking */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">2. Claim → Evidence (obligatorisk struktur)</h2>
          </div>
          
          <Card>
            <CardContent className="py-6">
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded font-mono text-sm">
                  <p className="text-muted-foreground">CLAIM:</p>
                  <p className="font-medium">"We will do X to improve Y"</p>
                  <Separator className="my-2" />
                  <p className="text-muted-foreground">REQUIRED:</p>
                  <p className="text-primary">Linked Evidence Report ID</p>
                </div>
                
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                  <p className="text-yellow-800">
                    <strong>Utan länk:</strong> Claim får status "Unsupported" – visas fortfarande, men med tydlig märkning.
                  </p>
                </div>
                
                <p className="text-sm text-muted-foreground italic text-center">
                  Ni förbjuder inget. Ni klassificerar.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 3. Visual Status */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">3. Visuell status</h2>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {Object.values(EVIDENCE_STATUSES).map((status) => (
              <Card key={status.status} className={`${status.bgColor} ${status.borderColor} border`}>
                <CardContent className="py-4 text-center">
                  <span className="text-2xl">{status.code}</span>
                  <p className={`font-medium ${status.color}`}>
                    {status.labelLocal.sv || status.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {status.descriptionLocal.sv || status.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-sm text-muted-foreground text-center italic">
            Status baseras inte på åsikt – utan på rapportens innehåll och osäkerhet.
          </p>
        </section>

        <Separator className="my-8" />

        {/* 4. Live Examples */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Exempel på klassificerade påståenden</h2>
          
          <div className="space-y-4">
            {demoClaims.map((claim) => (
              <ClaimCard key={claim.id} claim={claim} lang={lang} />
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* 5. Media Adaptation */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">4. Media-anpassning</h2>
          </div>
          
          <Card>
            <CardContent className="py-6">
              <p className="text-muted-foreground mb-4">
                Gör det extremt lätt för media att länka, bädda in och referera.
              </p>
              
              <Tabs defaultValue="examples">
                <TabsList>
                  <TabsTrigger value="examples">Exempel</TabsTrigger>
                  <TabsTrigger value="embeds">Embed-stilar</TabsTrigger>
                  <TabsTrigger value="code">Embed-kod</TabsTrigger>
                </TabsList>
                
                <TabsContent value="examples" className="mt-4 space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-800">
                      "The proposed reform is supported by <span className="font-mono font-medium">Evidence Report GL-2026-00417</span>."
                    </p>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-800">
                      "No supporting evidence report could be identified."
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    Journalister slipper bedöma – de refererar.
                  </p>
                </TabsContent>
                
                <TabsContent value="embeds" className="mt-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Badge:</p>
                      <ReportEmbed 
                        reportCode="GL-2026-00417" 
                        status="supported" 
                        style="badge" 
                      />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Inline:</p>
                      <ReportEmbed 
                        reportCode="GL-2026-00417" 
                        status="supported" 
                        style="inline" 
                        lang={lang}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-muted-foreground mb-2">Card:</p>
                      <ReportEmbed 
                        reportCode="GL-2026-00417"
                        title="Utbildningsinvesteringar och ekonomisk tillväxt"
                        status="supported"
                        uncertainty="moderate"
                        style="card"
                        showUncertainty
                        lang={lang}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="code" className="mt-4">
                  <div className="bg-muted p-4 rounded overflow-x-auto">
                    <code className="text-xs whitespace-pre">
                      {generateEmbedCode({
                        reportCode: 'GL-2026-00417',
                        style: 'card',
                        theme: 'light',
                        showUncertainty: true,
                        showScope: false,
                        language: 'sv'
                      })}
                    </code>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* 6. AI Integration */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">5. AI-integration</h2>
          </div>
          
          <Card>
            <CardContent className="py-6">
              <p className="text-muted-foreground mb-4">
                AI-system får ett enkelt val: svara med rapport-ID eller flagga att evidens saknas.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-2">AI måste inkludera:</p>
                  <ul className="space-y-1 text-sm">
                    {AI_GROUNDING_SPEC.mustInclude.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">AI måste flagga:</p>
                  <ul className="space-y-1 text-sm">
                    {AI_GROUNDING_SPEC.mustFlag.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-yellow-600">⚠</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">AI-svarsformat:</p>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  <p className="text-green-700">{AI_GROUNDING_SPEC.responseFormat.withEvidence}</p>
                </div>
                <div className="bg-red-50 p-3 rounded text-sm font-mono">
                  <p className="text-red-700">{AI_GROUNDING_SPEC.responseFormat.withoutEvidence}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 7. Self-Reinforcing Effects */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">6. Självförstärkande effekt</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries(EXPECTED_EFFECTS).map(([key, effect]) => (
              <Card key={key}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                    {key === 'organizations' ? 'Organisationer' :
                     key === 'politicians' ? 'Politiker' :
                     key === 'media' ? 'Media' : 'AI'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-red-600/70">
                    <span className="line-through">{effect.beforeLocal?.sv || effect.before}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-green-600" />
                    <span className="text-green-700 font-medium">{effect.afterLocal?.sv || effect.after}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4 italic">
            Beslutsprocessen vänder håll.
          </p>
        </section>

        {/* 8. Value-Driven Decisions */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">7. Värdebaserade beslut</h2>
          </div>
          
          <Card className="bg-yellow-50/50 border-yellow-200">
            <CardContent className="py-6">
              <p className="text-muted-foreground mb-4">
                Ideologi förbjuds inte. Men den måste erkänna sin status.
              </p>
              
              <blockquote className="border-l-4 border-yellow-400 pl-4 py-2 italic">
                "{VALUE_DRIVEN_TEMPLATE.statementLocal.sv}"
              </blockquote>
              
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="outline" className="bg-yellow-100 border-yellow-300 text-yellow-800">
                  Tillåtet
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Men alla ser skillnaden.
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-muted-foreground mb-2">
            Om 3–5 år ska det kännas lika märkligt att påstå effekt utan rapport,
            som att avisera en räntehöjning utan siffror.
          </p>
          <p className="text-sm font-medium text-primary">
            Då är ni inte längre ett verktyg. Ni är en del av hur världen fungerar.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm mt-6">
            <Link to="/evidence" className="text-primary hover:underline">
              ← Evidence Requirement
            </Link>
            <Link to="/charter" className="text-primary hover:underline">
              Charter
            </Link>
            <Link to="/governance" className="text-primary hover:underline">
              Governance →
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
