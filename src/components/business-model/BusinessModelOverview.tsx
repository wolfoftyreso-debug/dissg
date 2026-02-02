/**
 * BUSINESS MODEL OVERVIEW
 * 
 * Complete presentation of license structure, value proposition, and pricing.
 */

import React from 'react';
import { LicenseTierGrid } from './LicenseTierCard';
import { ResponsibilityDisclaimer } from './ResponsibilityDisclaimer';
import { ValueProposition } from './ValueProposition';
import { LICENSE_TIERS, PUBLIC_PREMIUM_DISTINCTION, INDUSTRY_STANDARD } from '@/config/businessModelConfig';

interface BusinessModelOverviewProps {
  language?: 'en' | 'sv';
  className?: string;
}

export function BusinessModelOverview({ language = 'en', className = '' }: BusinessModelOverviewProps) {
  const labels = {
    en: {
      title: 'Business Model',
      subtitle: 'Infrastructure for serious thinking',
      section1: 'Responsibility Model',
      section2: 'License Tiers',
      section3: 'Public vs Premium',
      section4: 'Value Proposition',
      section5: 'Industry Standard',
    },
    sv: {
      title: 'Affärsmodell',
      subtitle: 'Infrastruktur för seriöst tänkande',
      section1: 'Ansvarsmodell',
      section2: 'Licensnivåer',
      section3: 'Publik vs Premium',
      section4: 'Värdeerbjudande',
      section5: 'Branschstandard',
    },
  }[language];

  return (
    <div className={`space-y-16 ${className}`}>
      <header className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto border-4 border-primary flex items-center justify-center text-4xl">💼</div>
        <h1 className="text-3xl lg:text-4xl font-bold">{labels.title}</h1>
        <p className="text-lg text-muted-foreground">{labels.subtitle}</p>
      </header>

      <section>
        <SectionHeader number={1} title={labels.section1} />
        <ResponsibilityDisclaimer language={language} variant="full" />
      </section>

      <section>
        <SectionHeader number={2} title={labels.section2} />
        <LicenseTierGrid tiers={LICENSE_TIERS} language={language} highlightedTier="institutional" />
      </section>

      <section>
        <SectionHeader number={3} title={labels.section3} />
        <PublicPremiumSection language={language} />
      </section>

      <section>
        <SectionHeader number={4} title={labels.section4} />
        <ValueProposition language={language} />
      </section>

      <section>
        <SectionHeader number={5} title={labels.section5} />
        <IndustryStandardSection language={language} />
      </section>

      <ResponsibilityDisclaimer language={language} variant="legal" />
    </div>
  );
}

function SectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="w-10 h-10 border-2 border-primary flex items-center justify-center font-bold text-primary">{number}</span>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}

function PublicPremiumSection({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="border-2 border-border bg-card p-6 space-y-6">
      <div className="text-center p-4 border-2 border-primary/30 bg-primary/5">
        <p className="font-bold text-lg">{PUBLIC_PREMIUM_DISTINCTION.principle[language]}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <span>🌐</span>
            {PUBLIC_PREMIUM_DISTINCTION.public.label[language]}
          </h3>
          <ul className="space-y-2">
            {PUBLIC_PREMIUM_DISTINCTION.public.items.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="text-primary">✓</span>
                {item[language]}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <span>💎</span>
            {PUBLIC_PREMIUM_DISTINCTION.premium.label[language]}
          </h3>
          <ul className="space-y-2">
            {PUBLIC_PREMIUM_DISTINCTION.premium.items.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="text-amber-600">→</span>
                {item[language]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function IndustryStandardSection({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="border-2 border-border bg-card p-6 space-y-6">
      <h3 className="font-bold">{INDUSTRY_STANDARD.title[language]}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {language === 'en' ? 'Similar Platforms' : 'Liknande plattformar'}
          </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {INDUSTRY_STANDARD.similarPlatforms.map((platform, i) => (
              <span key={i} className="px-3 py-1 bg-muted text-sm font-medium">{platform[language]}</span>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {language === 'en' ? 'Shared Principles' : 'Delade principer'}
          </span>
          <ul className="mt-2 space-y-1">
            {INDUSTRY_STANDARD.sharedPrinciples.map((principle, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="text-primary">✓</span>
                {principle[language]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center pt-4 border-t border-border">
        <p className="font-bold text-primary">{INDUSTRY_STANDARD.conclusion[language]}</p>
      </div>
    </div>
  );
}
