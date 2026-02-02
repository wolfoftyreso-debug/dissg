/**
 * Governance Page
 * 
 * Public page displaying the Institutional Governance Model.
 * URL: /governance
 * 
 * Three-tier governance structure: Builders → Stewards → Guardians
 */

import React from 'react';
import {
  GOVERNANCE_TIERS,
  VETO_TRIGGERS,
  VETO_CONSEQUENCES,
  OWNER_CAN,
  OWNER_CANNOT,
  CONFLICT_RESOLUTION_STEPS,
  CONFLICT_PRINCIPLE,
  SEPARATION_RULE,
  TIER_EXCLUSIVITY_RULE,
  GOVERNANCE_MODEL_DONE_CRITERIA,
  type GovernanceTier
} from '@/config/governanceModel';
import { Shield, Hammer, Scale, AlertTriangle, Check, X, ChevronRight, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const tierIcons: Record<GovernanceTier, React.ReactNode> = {
  builder: <Hammer className="h-6 w-6" />,
  steward: <Scale className="h-6 w-6" />,
  guardian: <Shield className="h-6 w-6" />
};

function TierCard({ tier }: { tier: GovernanceTier }) {
  const lang = 'sv';
  const t = GOVERNANCE_TIERS[tier];
  const label = lang === 'sv' && t.labelLocal.sv ? t.labelLocal.sv : t.label;
  const role = lang === 'sv' && t.roleLocal.sv ? t.roleLocal.sv : t.role;
  const description = lang === 'sv' && t.descriptionLocal.sv ? t.descriptionLocal.sv : t.description;
  const responsibilities = lang === 'sv' && t.responsibilitiesLocal.sv ? t.responsibilitiesLocal.sv : t.responsibilities;
  const prohibitions = lang === 'sv' && t.prohibitionsLocal.sv ? t.prohibitionsLocal.sv : t.prohibitions;

  return (
    <Card className={`border-l-4 ${tier === 'guardian' ? 'border-l-destructive' : tier === 'steward' ? 'border-l-primary' : 'border-l-muted-foreground'}`}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${tier === 'guardian' ? 'bg-destructive/10 text-destructive' : tier === 'steward' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
            {tierIcons[tier]}
          </div>
          <div>
            <CardTitle className="text-xl">{label}</CardTitle>
            <CardDescription className="text-sm font-medium">{role}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Ansvar</p>
          <ul className="space-y-1">
            {responsibilities.map((item, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {prohibitions.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Får INTE</p>
            <ul className="space-y-1">
              {prohibitions.map((item, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2 text-destructive/80">
                  <X className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function GovernancePage() {
  const lang = 'sv';

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Institutional Governance Model</h1>
          <p className="text-lg text-muted-foreground">
            Hur sanningslagret skyddas från politisering, kapning & urholkning
          </p>
        </header>

        {/* Core Principle */}
        <Card className="mb-8 bg-destructive/5 border-destructive/20">
          <CardContent className="py-6 text-center">
            <Lock className="h-6 w-6 mx-auto mb-3 text-destructive" />
            <p className="text-lg font-medium">
              {lang === 'sv' ? SEPARATION_RULE.sv : SEPARATION_RULE.en}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {lang === 'sv' ? TIER_EXCLUSIVITY_RULE.sv : TIER_EXCLUSIVITY_RULE.en}
            </p>
          </CardContent>
        </Card>

        {/* Three Tiers */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Tre-nivå-struktur</h2>
          
          {/* Flow diagram */}
          <div className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground">
            <Badge variant="secondary">Builders</Badge>
            <ChevronRight className="h-4 w-4" />
            <Badge variant="outline">Stewards</Badge>
            <ChevronRight className="h-4 w-4" />
            <Badge variant="destructive">Guardians</Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <TierCard tier="builder" />
            <TierCard tier="steward" />
            <TierCard tier="guardian" />
          </div>
        </section>

        <Separator className="my-8" />

        {/* Veto Mechanism */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Veto-mekanism
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">När veto kan användas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {VETO_TRIGGERS.map((trigger) => (
                    <li key={trigger.code} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium">
                          {lang === 'sv' && trigger.labelLocal.sv ? trigger.labelLocal.sv : trigger.label}
                        </span>
                        <p className="text-muted-foreground text-xs">
                          {lang === 'sv' && trigger.descriptionLocal.sv ? trigger.descriptionLocal.sv : trigger.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Veto-konsekvenser</CardTitle>
                <CardDescription>Alla konsekvenser är automatiska</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {VETO_CONSEQUENCES.map((consequence, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Badge variant="outline" className="text-xs shrink-0">Auto</Badge>
                      <span>
                        {lang === 'sv' && consequence.actionLocal.sv ? consequence.actionLocal.sv : consequence.action}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-4 italic">
                  Inget veto i det tysta.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Ownership Separation */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Ägarskap ≠ Kontroll</h2>
          <p className="text-muted-foreground mb-4">
            Oavsett om ägare är stat, företag, stiftelse eller konsortium.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Ägare KAN</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {OWNER_CAN.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{lang === 'sv' && item.actionLocal.sv ? item.actionLocal.sv : item.action}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-lg text-destructive">Ägare KAN INTE</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {OWNER_CANNOT.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-destructive/80">
                      <X className="h-4 w-4" />
                      <span>{lang === 'sv' && item.actionLocal.sv ? item.actionLocal.sv : item.action}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4 italic">
            Ägande är ekonomiskt, inte epistemiskt.
          </p>
        </section>

        <Separator className="my-8" />

        {/* Conflict Resolution */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Konflikthantering</h2>
          <p className="text-muted-foreground mb-4">
            När stater ifrågasätter data, företag anklagar plattformen, eller media skriker bias.
          </p>

          <Card>
            <CardContent className="py-6">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                {CONFLICT_RESOLUTION_STEPS.map((step, idx) => (
                  <React.Fragment key={step.order}>
                    <Badge variant="outline" className="text-sm">
                      {step.order}. {lang === 'sv' && step.actionLocal.sv ? step.actionLocal.sv : step.action}
                    </Badge>
                    {idx < CONFLICT_RESOLUTION_STEPS.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p className="text-center font-medium italic">
                {lang === 'sv' ? CONFLICT_PRINCIPLE.sv : CONFLICT_PRINCIPLE.en}
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* Definition of Done */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Definition of Done</h2>
          <Card className="bg-muted/50">
            <CardContent className="py-6">
              <ul className="grid sm:grid-cols-2 gap-3">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Ingen enskild aktör kan ändra sanningen</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>All makt är uppdelad</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Alla beslut lämnar spår</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Kritik kan besvaras utan ord</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          <p className="mb-2">
            Det här är skillnaden mellan ett kraftfullt verktyg och en global institution.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <a href="/charter" className="text-primary hover:underline">
              Läs Charter →
            </a>
            <a href="/trust-log" className="text-primary hover:underline">
              Se Trust Log →
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
