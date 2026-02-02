/**
 * INSTITUTIONAL VOICE OVERVIEW
 * 
 * Complete presentation of how the system communicates:
 * - Voice principle (auditor, not activist)
 * - Forbidden vs institutional expressions
 * - Inconsistency detection templates
 * - Graceful accountability
 */

import React from 'react';
import { VoicePrinciple, InstitutionalExpressions } from './VoicePrinciple';
import { InconsistencyDetection } from './InconsistencyDetection';
import { GracefulAccountability } from './GracefulAccountability';

interface InstitutionalVoiceOverviewProps {
  language?: 'en' | 'sv';
  className?: string;
}

export function InstitutionalVoiceOverview({
  language = 'en',
  className = '',
}: InstitutionalVoiceOverviewProps) {
  const labels = {
    en: {
      title: 'Institutional Voice',
      subtitle: 'Same content. Irrefutable language.',
      section1: 'The Core Principle',
      section2: 'What the System Says',
      section3: 'Inconsistency Detection',
      section4: 'Enabling Accountability',
    },
    sv: {
      title: 'Institutionellt språk',
      subtitle: 'Samma innehåll. Oemotsägligt språk.',
      section1: 'Kärnprincipen',
      section2: 'Vad systemet säger',
      section3: 'Inkonsekvensdetektering',
      section4: 'Möjliggör ansvarsutkrävande',
    },
  }[language];

  return (
    <div className={`space-y-16 ${className}`}>
      {/* Header */}
      <header className="text-center space-y-4">
        <h1 className="text-3xl lg:text-4xl font-bold">{labels.title}</h1>
        <p className="text-lg text-muted-foreground">{labels.subtitle}</p>
      </header>

      {/* Section 1: Core Principle */}
      <section>
        <SectionHeader number={1} title={labels.section1} />
        <VoicePrinciple language={language} variant="full" />
      </section>

      {/* Section 2: What the System Says */}
      <section>
        <SectionHeader number={2} title={labels.section2} />
        <InstitutionalExpressions language={language} variant="full" />
      </section>

      {/* Section 3: Inconsistency Detection */}
      <section>
        <SectionHeader number={3} title={labels.section3} />
        <InconsistencyDetection language={language} variant="full" />
      </section>

      {/* Section 4: Enabling Accountability */}
      <section>
        <SectionHeader number={4} title={labels.section4} />
        <GracefulAccountability language={language} variant="full" />
      </section>
    </div>
  );
}

function SectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="w-10 h-10 border-2 border-primary flex items-center justify-center font-bold text-primary">
        {number}
      </span>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}
