/**
 * ACCOUNTABILITY OVERVIEW
 * 
 * Complete presentation of the accountability principle,
 * institutional arguments, reframing, and minimum standard.
 */

import React from 'react';
import { AccountabilityPrinciple } from './AccountabilityPrinciple';
import { InstitutionalArguments } from './InstitutionalArguments';
import { CriticalReframing, InstitutionalClaims } from './CriticalReframing';
import { MinimumStandard, FinalInsight } from './MinimumStandard';

interface AccountabilityOverviewProps {
  language?: 'en' | 'sv';
  className?: string;
}

export function AccountabilityOverview({
  language = 'en',
  className = '',
}: AccountabilityOverviewProps) {
  const labels = {
    en: {
      section1: 'The Principle That Locks Everything',
      section2: 'Why No Institution Can Argue Against',
      section3: 'The Critical Reframing',
      section4: 'What They Already Claim',
      section5: 'The Minimum Standard',
    },
    sv: {
      section1: 'Principen som låser allt',
      section2: 'Varför ingen institution kan säga emot',
      section3: 'Den avgörande omformuleringen',
      section4: 'Vad de redan påstår',
      section5: 'Minimistandarden',
    },
  }[language];

  return (
    <div className={`space-y-16 ${className}`}>
      {/* Section 1: The Principle */}
      <section>
        <SectionHeader number={1} title={labels.section1} />
        <AccountabilityPrinciple language={language} variant="full" />
      </section>

      {/* Section 2: Institutional Arguments */}
      <section>
        <SectionHeader number={2} title={labels.section2} />
        <InstitutionalArguments language={language} variant="full" />
      </section>

      {/* Section 3: Critical Reframing */}
      <section>
        <SectionHeader number={3} title={labels.section3} />
        <CriticalReframing language={language} variant="full" />
      </section>

      {/* Section 4: What They Claim */}
      <section>
        <SectionHeader number={4} title={labels.section4} />
        <InstitutionalClaims language={language} />
      </section>

      {/* Section 5: Minimum Standard */}
      <section>
        <SectionHeader number={5} title={labels.section5} />
        <MinimumStandard language={language} variant="full" />
      </section>

      {/* Final Insight */}
      <section className="border-t-4 border-border pt-8">
        <FinalInsight language={language} />
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
