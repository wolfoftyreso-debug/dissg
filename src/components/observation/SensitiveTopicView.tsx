/**
 * SENSITIVE TOPIC VIEW
 * 
 * 🔬 OBSERVATION MODE – NO INTERPRETATION
 * 
 * Used for: pandemic, diet/health, environment, immigration,
 * economy, pharmaceuticals, climate
 * 
 * ALL topics look identical. No special treatment. No opinion. No drama.
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { QuickAnswerBar, type QuickAnswerData } from './QuickAnswerBar';
import { ObservationSection, type ObservationData } from './sections/ObservationSection';
import { CoMovementSection, type CoMovementData } from './sections/CoMovementSection';
import { ComparisonSection, type ComparisonData } from './sections/ComparisonSection';
import { LimitationsSection, type LimitationsData } from './sections/LimitationsSection';
import { MisinterpretationRisk } from './MisinterpretationRisk';
import { ScenarioMode, type ScenarioData } from './sections/ScenarioMode';

// ============================================
// TYPES
// ============================================

export interface SensitiveTopicData {
  topic: string;
  generatedAt: string;
  quickAnswer: QuickAnswerData;
  observation: ObservationData;
  coMovement: CoMovementData;
  comparison: ComparisonData;
  limitations: LimitationsData;
  scenario?: ScenarioData;
}

interface SensitiveTopicViewProps {
  data: SensitiveTopicData;
  language?: 'en' | 'sv';
  showScenarioMode?: boolean;
  userTier?: 'guest' | 'observer' | 'analyst' | 'institutional';
}

// ============================================
// FIXED TEXTS (IMMUTABLE)
// ============================================

const FIXED_TEXTS = {
  subtitle: {
    en: 'This view presents aggregated public data, historical comparisons and uncertainty. No conclusions or recommendations are made.',
    sv: 'Denna vy presenterar aggregerad offentlig data, historiska jämförelser och osäkerhet. Inga slutsatser eller rekommendationer görs.',
  },
  sectionA: {
    title: { en: 'A. What was observed', sv: 'A. Vad observerades' },
    graphNote: {
      en: 'Observed change relative to historical baseline.',
      sv: 'Observerad förändring relativt historisk baslinje.',
    },
  },
  sectionB: {
    title: { en: 'B. What moved together', sv: 'B. Vad rörde sig tillsammans' },
    warning: {
      en: 'Correlation does not imply causation. Relationships shown are statistical co-movements only.',
      sv: 'Korrelation innebär inte orsakssamband. Visade samband är endast statistiska samvariationer.',
    },
  },
  sectionC: {
    title: { en: 'C. Peer comparison', sv: 'C. Jämförelse med liknande' },
    implicitQuestion: {
      en: 'How does this compare to similar contexts?',
      sv: 'Hur förhåller sig detta till liknande kontexter?',
    },
  },
  sectionD: {
    title: { en: 'D. What cannot be concluded', sv: 'D. Vad som inte kan fastställas' },
    required: { en: '(Mandatory section)', sv: '(Obligatorisk sektion)' },
    intro: {
      en: 'The following limitations prevent definitive conclusions.',
      sv: 'Följande begränsningar förhindrar definitiva slutsatser.',
    },
  },
  sectionE: {
    title: { en: 'E. Misinterpretation risks', sv: 'E. Feltolkningsrisker' },
  },
};

// ============================================
// MAIN COMPONENT
// ============================================

export function SensitiveTopicView({
  data,
  language = 'en',
  showScenarioMode = false,
  userTier = 'observer',
}: SensitiveTopicViewProps) {
  // CRITICAL: Block display if limitations section is empty
  if (!data.limitations || data.limitations.items.length === 0) {
    return <AnalysisBlockedView language={language} reason="limitations_empty" />;
  }

  const canAccessScenario = userTier === 'analyst' || userTier === 'institutional';

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      {/* HEADER */}
      <header className="border-b border-border py-6 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-xl font-medium tracking-tight text-foreground">
            Observed outcomes related to {data.topic}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-3xl">
            {FIXED_TEXTS.subtitle[language]}
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
            Generated: {new Date(data.generatedAt).toISOString()}
          </p>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
        {/* QUICK ANSWER BAR (30-second rule) */}
        <QuickAnswerBar data={data.quickAnswer} language={language} />

        <Separator />

        {/* SECTION A: What was observed */}
        <section aria-labelledby="section-a">
          <SectionHeader
            id="section-a"
            title={FIXED_TEXTS.sectionA.title[language]}
          />
          <ObservationSection 
            data={data.observation} 
            language={language}
            graphNote={FIXED_TEXTS.sectionA.graphNote[language]}
          />
        </section>

        <Separator />

        {/* SECTION B: What moved together */}
        <section aria-labelledby="section-b">
          <SectionHeader
            id="section-b"
            title={FIXED_TEXTS.sectionB.title[language]}
          />
          <FixedWarning text={FIXED_TEXTS.sectionB.warning[language]} />
          <CoMovementSection data={data.coMovement} language={language} />
        </section>

        <Separator />

        {/* SECTION C: Peer comparison */}
        <section aria-labelledby="section-c">
          <SectionHeader
            id="section-c"
            title={FIXED_TEXTS.sectionC.title[language]}
          />
          <p className="text-xs text-muted-foreground mb-4 italic">
            {FIXED_TEXTS.sectionC.implicitQuestion[language]}
          </p>
          <ComparisonSection data={data.comparison} language={language} />
        </section>

        <Separator />

        {/* SECTION D: What cannot be concluded (MANDATORY) */}
        <section aria-labelledby="section-d">
          <SectionHeader
            id="section-d"
            title={FIXED_TEXTS.sectionD.title[language]}
            required={FIXED_TEXTS.sectionD.required[language]}
          />
          <FixedWarning text={FIXED_TEXTS.sectionD.intro[language]} variant="emphasized" />
          <LimitationsSection data={data.limitations} language={language} />
        </section>

        <Separator />

        {/* SECTION E: Misinterpretation risks (ALWAYS VISIBLE) */}
        <section aria-labelledby="section-e">
          <SectionHeader
            id="section-e"
            title={FIXED_TEXTS.sectionE.title[language]}
          />
          <MisinterpretationRisk language={language} />
        </section>

        {/* ADVANCED MODE (Paid, user responsibility) */}
        {showScenarioMode && canAccessScenario && data.scenario && (
          <>
            <Separator />
            <ScenarioMode 
              data={data.scenario} 
              language={language} 
              userTier={userTier}
            />
          </>
        )}

        {showScenarioMode && !canAccessScenario && (
          <>
            <Separator />
            <LockedScenarioMode language={language} />
          </>
        )}
      </main>

      {/* FOOTER DISCLAIMER */}
      <footer className="border-t border-border py-6 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <p className="text-xs text-muted-foreground font-mono">
            {language === 'sv' 
              ? 'Denna plattform tillskriver ingen orsak, avsikt eller rekommendation.'
              : 'This platform does not assign cause, intent, or recommendation.'}
          </p>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function SectionHeader({ 
  id, 
  title, 
  required 
}: { 
  id: string; 
  title: string; 
  required?: string;
}) {
  return (
    <div className="mb-4">
      <h2 
        id={id}
        className="text-sm font-medium uppercase tracking-wider text-foreground"
      >
        {title}
      </h2>
      {required && (
        <span className="text-xs text-muted-foreground">{required}</span>
      )}
    </div>
  );
}

function FixedWarning({ 
  text, 
  variant = 'default' 
}: { 
  text: string; 
  variant?: 'default' | 'emphasized';
}) {
  const baseClass = "text-xs font-mono p-3 mb-4";
  const variantClass = variant === 'emphasized' 
    ? "bg-muted border-l-2 border-muted-foreground text-foreground"
    : "bg-muted/50 text-muted-foreground";
  
  return (
    <div className={`${baseClass} ${variantClass}`}>
      {text}
    </div>
  );
}

function AnalysisBlockedView({ 
  language, 
  reason 
}: { 
  language: 'en' | 'sv'; 
  reason: string;
}) {
  const title = language === 'sv' ? 'Analys blockerad' : 'Analysis blocked';
  const message = language === 'sv'
    ? 'Denna analys kan inte visas eftersom obligatoriska begränsningar saknas. Analys utan begränsningar visas aldrig.'
    : 'This analysis cannot be displayed because mandatory limitations are missing. Analysis without limitations is never shown.';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md border-muted-foreground">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-2 border-muted-foreground flex items-center justify-center">
            <span className="text-2xl font-mono">!</span>
          </div>
          <h2 className="font-medium text-foreground mb-2">{title}</h2>
          <p className="text-sm text-muted-foreground">{message}</p>
          <p className="text-xs text-muted-foreground/60 mt-4 font-mono">
            Reason: {reason}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function LockedScenarioMode({ language }: { language: 'en' | 'sv' }) {
  return (
    <Card className="border-dashed border-muted-foreground/30 bg-muted/20">
      <CardContent className="p-6 text-center">
        <h3 className="font-medium text-muted-foreground mb-2">
          {language === 'sv' ? 'Scenario-läge' : 'Scenario Mode'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {language === 'sv' 
            ? 'Tillgängligt för Analyst- och Institutional-nivåer.'
            : 'Available for Analyst and Institutional tiers.'}
        </p>
      </CardContent>
    </Card>
  );
}

export default SensitiveTopicView;
