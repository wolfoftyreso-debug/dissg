/**
 * DE FACTO STANDARD OVERVIEW
 * 
 * Complete presentation of how the platform becomes the standard
 * without law, conflict, or power plays.
 */

import React from 'react';
import { AdoptionPattern } from './AdoptionPattern';
import { CriticalUsers } from './CriticalUsers';
import { DecisiveMoment } from './DecisiveMoment';
import { PlatformRole, OppositionImpossibility, StandardConclusion } from './PlatformRole';
import { PLATFORM_POSITIONING } from '@/config/deFactoStandardConfig';

interface DeFactoStandardOverviewProps {
  language?: 'en' | 'sv';
  className?: string;
}

export function DeFactoStandardOverview({
  language = 'en',
  className = '',
}: DeFactoStandardOverviewProps) {
  const labels = {
    en: {
      title: 'How It Becomes the De Facto Standard',
      subtitle: 'Without law · Without conflict · Without power plays',
      disclaimer: 'This is not strategy. This is mechanics.',
      section1: 'How Standards Are Actually Adopted',
      section2: 'Reference, Not Decision Support',
      section3: 'The Critical Users',
      section4: 'The Decisive Moment',
      section5: 'Why Opposition Is Impossible',
      section6: 'Your Role',
    },
    sv: {
      title: 'Hur det blir de facto-standard',
      subtitle: 'Utan lag · Utan konflikt · Utan maktspel',
      disclaimer: 'Detta är inte strategi. Detta är mekanik.',
      section1: 'Hur standarder faktiskt antas',
      section2: 'Referens, inte beslutsstöd',
      section3: 'De kritiska användarna',
      section4: 'Det avgörande ögonblicket',
      section5: 'Varför motstånd är omöjligt',
      section6: 'Er roll',
    },
  }[language];

  return (
    <div className={`space-y-16 ${className}`}>
      {/* Header */}
      <header className="text-center space-y-4">
        <h1 className="text-3xl lg:text-4xl font-bold">{labels.title}</h1>
        <p className="text-lg text-muted-foreground">{labels.subtitle}</p>
        <p className="text-sm font-mono uppercase tracking-wider text-primary">{labels.disclaimer}</p>
      </header>

      {/* Section 1: Adoption Pattern */}
      <section>
        <SectionHeader number={1} title={labels.section1} />
        <AdoptionPattern language={language} variant="full" />
      </section>

      {/* Section 2: Reference Not Decision Support */}
      <section>
        <SectionHeader number={2} title={labels.section2} />
        <ReferencePositioning language={language} />
      </section>

      {/* Section 3: Critical Users */}
      <section>
        <SectionHeader number={3} title={labels.section3} />
        <CriticalUsers language={language} variant="full" />
      </section>

      {/* Section 4: Decisive Moment */}
      <section>
        <SectionHeader number={4} title={labels.section4} />
        <DecisiveMoment language={language} variant="full" />
      </section>

      {/* Section 5: Opposition Impossibility */}
      <section>
        <SectionHeader number={5} title={labels.section5} />
        <OppositionImpossibility language={language} />
      </section>

      {/* Section 6: Platform Role */}
      <section>
        <SectionHeader number={6} title={labels.section6} />
        <PlatformRole language={language} variant="full" />
      </section>

      {/* Conclusion */}
      <section className="border-t-4 border-border pt-8">
        <StandardConclusion language={language} />
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

function ReferencePositioning({ language }: { language: 'en' | 'sv' }) {
  const pos = PLATFORM_POSITIONING;
  
  return (
    <div className="border-2 border-border bg-card p-6 lg:p-8 space-y-6">
      <h3 className="text-lg font-bold">{pos.title[language]}</h3>
      
      {/* Not Selling vs Offering */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="text-xs text-destructive uppercase tracking-wider font-mono">
            {pos.notSelling.label[language]}
          </span>
          <div className="mt-3 space-y-2">
            {pos.notSelling.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground">
                <span className="text-destructive">✗</span>
                <span className="line-through">{item[language]}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-primary/5 border-l-4 border-primary p-4">
          <span className="text-xs text-primary uppercase tracking-wider font-mono">
            {pos.offering.label[language]}
          </span>
          <p className="text-xl font-bold mt-3">
            "{pos.offering.statement[language]}"
          </p>
        </div>
      </div>
      
      {/* Consequence */}
      <div className="pt-4 border-t border-border space-y-3">
        <p className="text-muted-foreground">{pos.consequence.when[language]}</p>
        <p className="font-medium">{pos.consequence.nextQuestion[language]}</p>
        <p className="text-primary font-medium">{pos.consequence.ifNotYou[language]}</p>
      </div>
      
      {/* Key Insight */}
      <div className="text-center pt-4 border-t border-border">
        <p className="text-lg font-semibold text-primary">
          📌 {pos.keyInsight[language]}
        </p>
      </div>
    </div>
  );
}
