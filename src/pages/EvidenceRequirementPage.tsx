/**
 * Evidence Requirement Page
 * 
 * Public page explaining the evidence requirement system.
 * URL: /evidence
 * 
 * "If you claim an action will improve an outcome, show the evidence report."
 */

import React from 'react';
import {
  LEGITIMACY_LEVELS,
  REPORT_DEFINITION,
  EVIDENCE_QUESTION,
  EVIDENCE_RULE,
  EVIDENCE_EFFECTS,
  EVIDENCE_LINK_FORMAT,
  DECISION_MAKER_TEMPLATE,
  DECISION_MAKER_BENEFITS,
  type LegitimacyLevel
} from '@/config/evidenceRequirement';
import { FileText, Link2, CheckCircle2, XCircle, AlertCircle, ArrowRight, Quote, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const levelIcons: Record<LegitimacyLevel, React.ReactNode> = {
  none: <XCircle className="h-5 w-5" />,
  unsupported: <AlertCircle className="h-5 w-5" />,
  supported: <CheckCircle2 className="h-5 w-5" />
};

const levelColors: Record<LegitimacyLevel, string> = {
  none: 'border-destructive/50 bg-destructive/5',
  unsupported: 'border-yellow-500/50 bg-yellow-500/5',
  supported: 'border-primary/50 bg-primary/5'
};

function LegitimacyCard({ level }: { level: LegitimacyLevel }) {
  const lang = 'sv';
  const l = LEGITIMACY_LEVELS[level];
  const label = lang === 'sv' && l.labelLocal.sv ? l.labelLocal.sv : l.label;
  const description = lang === 'sv' && l.descriptionLocal.sv ? l.descriptionLocal.sv : l.description;
  const indicators = lang === 'sv' && l.indicatorsLocal.sv ? l.indicatorsLocal.sv : l.indicators;
  const verdict = lang === 'sv' && l.verdictLocal.sv ? l.verdictLocal.sv : l.verdict;

  return (
    <Card className={`${levelColors[level]} border-l-4`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Badge variant={level === 'none' ? 'destructive' : level === 'unsupported' ? 'outline' : 'default'}>
            Nivå {l.code}
          </Badge>
          <span className={level === 'none' ? 'text-destructive' : level === 'unsupported' ? 'text-yellow-600' : 'text-primary'}>
            {levelIcons[level]}
          </span>
        </div>
        <CardTitle className="text-lg">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{description}</p>
        
        <ul className="space-y-1 text-sm">
          {indicators.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="pt-2 border-t">
          <p className="text-sm font-medium">
            ➡️ {verdict}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function EvidenceRequirementPage() {
  const lang = 'sv';

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">The Evidence Requirement</h1>
          <p className="text-lg text-muted-foreground">
            Inget beslut utan underlag · Ingen åtgärd utan spårbar rapport
          </p>
        </header>

        {/* Core Rule */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="py-6 text-center">
            <p className="text-lg font-medium italic">
              "{lang === 'sv' ? EVIDENCE_RULE.sv : EVIDENCE_RULE.en}"
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              Detta är inte moral. Det är metod.
            </p>
          </CardContent>
        </Card>

        {/* What is a Report */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Vad är en "rapport"?</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg text-primary flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  En rapport ÄR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(lang === 'sv' ? REPORT_DEFINITION.isReportLocal.sv : REPORT_DEFINITION.isReport).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-lg text-destructive flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  En rapport är INTE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(lang === 'sv' ? REPORT_DEFINITION.isNotReportLocal.sv : REPORT_DEFINITION.isNotReport).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-destructive/80">
                      <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4 italic">
            Rapporten säger inte vad man ska göra. Den säger vad datan faktiskt pekar på.
          </p>
        </section>

        <Separator className="my-8" />

        {/* Legitimacy Levels */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Tre nivåer av legitimitet</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <LegitimacyCard level="none" />
            <LegitimacyCard level="unsupported" />
            <LegitimacyCard level="supported" />
          </div>
        </section>

        <Separator className="my-8" />

        {/* The Question */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Hur detta används i praktiken</h2>
          
          <Card>
            <CardContent className="py-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Quote className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                  <p className="text-lg italic">
                    {lang === 'sv' ? EVIDENCE_QUESTION.trigger.sv : EVIDENCE_QUESTION.trigger.en}
                  </p>
                </div>
                
                <div className="flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-medium text-primary">
                    {lang === 'sv' ? EVIDENCE_QUESTION.response.sv : EVIDENCE_QUESTION.response.en}
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 mt-6">
                  {EVIDENCE_QUESTION.outcomes.map((outcome, idx) => (
                    <Card key={idx} className={`${outcome.result === 'supported' ? 'border-primary/30' : outcome.result === 'none' ? 'border-destructive/30' : 'border-yellow-500/30'}`}>
                      <CardContent className="py-3 text-center text-sm">
                        <p className="font-medium mb-1">
                          {lang === 'sv' && outcome.conditionLocal.sv ? outcome.conditionLocal.sv : outcome.condition}
                        </p>
                        <p className="text-muted-foreground">
                          → {lang === 'sv' && outcome.actionLocal.sv ? outcome.actionLocal.sv : outcome.action}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <p className="text-center text-sm text-muted-foreground mt-4 italic">
                  Inget argument behövs. Bara länk.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* Evidence Link */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Evidence Link
          </h2>
          
          <Card>
            <CardContent className="py-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Varje rapport får:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline">ID</Badge>
                      <span>Permanent identifierare</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline">QR</Badge>
                      <span>Skannbar QR-kod</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline">URL</Badge>
                      <span>Kanonisk länk</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Exempel:</p>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    <p>Policy X references</p>
                    <p className="text-primary font-semibold">Evidence Report #{EVIDENCE_LINK_FORMAT.example}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Format: {EVIDENCE_LINK_FORMAT.pattern}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* Decision Maker Protection */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Skydd för beslutsfattare
          </h2>
          
          <Card className="bg-muted/50">
            <CardContent className="py-6">
              <p className="text-sm text-muted-foreground mb-4">
                Detta är inte ett hot mot makthavare. Det är ett skydd.
              </p>
              
              <blockquote className="border-l-4 border-primary pl-4 py-2 italic text-muted-foreground whitespace-pre-line">
                {lang === 'sv' ? DECISION_MAKER_TEMPLATE.sv : DECISION_MAKER_TEMPLATE.en}
              </blockquote>

              <div className="flex flex-wrap gap-2 mt-4">
                {DECISION_MAKER_BENEFITS.map((benefit, idx) => (
                  <Badge key={idx} variant="outline">
                    {lang === 'sv' ? benefit.sv : benefit.en}
                  </Badge>
                ))}
              </div>

              <p className="text-sm text-muted-foreground mt-4 italic">
                Det är så man tar ansvar utan att låtsas vara allvetande.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* Global Effects */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Global effekt</h2>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(EVIDENCE_EFFECTS).map(([key, effect]) => (
              <Card key={key}>
                <CardContent className="py-4 text-center">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    {key === 'journalists' ? 'Journalister' : 
                     key === 'ai' ? 'AI-system' : 
                     key === 'voters' ? 'Väljare' : 'Organisationer'}
                  </p>
                  <p className="text-sm font-medium">
                    {lang === 'sv' ? effect.sv : effect.en}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6 italic">
            Det blir pinsamt att inte ha "rent mjöl i påsen".
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-muted-foreground mb-4">
            En gemensam spelplan där ansvar börjar med bevis.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <a href="/charter" className="text-primary hover:underline">
              Läs Charter →
            </a>
            <a href="/governance" className="text-primary hover:underline">
              Se Governance →
            </a>
            <a href="/trust-log" className="text-primary hover:underline">
              Trust Log →
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
