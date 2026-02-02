/**
 * INSTITUTIONAL ABOUT PAGE
 * 
 * Publik "About"-text baserad på Monster-Masterprompt.
 * Institutionell, neutral, WEF/Davos-kompatibel.
 */

import React from 'react';
import { TRANSPARENCY_LAYER_PROMPT } from '@/config/masterPromptConfig';

interface InstitutionalAboutProps {
  language?: 'en' | 'sv';
}

export function InstitutionalAbout({ language = 'en' }: InstitutionalAboutProps) {
  const p = TRANSPARENCY_LAYER_PROMPT;

  const content = {
    en: {
      title: 'Global Transparency Reference Layer',
      subtitle: 'Public Data Infrastructure for Informed Decision-Making',
      whatWeAre: 'What This Platform Is',
      whatWeAreNot: 'What This Platform Is Not',
      purpose: 'Purpose',
      audiences: 'Who This Serves',
      dataStandards: 'Data Standards',
      neutrality: 'Political Neutrality',
      transparency: 'Transparency Principle',
      closing: 'Closing Statement',
    },
    sv: {
      title: 'Globalt Transparensreferenslager',
      subtitle: 'Offentlig Datainfrastruktur för Informerat Beslutsfattande',
      whatWeAre: 'Vad Plattformen Är',
      whatWeAreNot: 'Vad Plattformen Inte Är',
      purpose: 'Syfte',
      audiences: 'Vem Detta Tjänar',
      dataStandards: 'Datastandarder',
      neutrality: 'Politisk Neutralitet',
      transparency: 'Transparensprincip',
      closing: 'Slutord',
    },
  };

  const t = content[language];

  return (
    <div className="max-w-4xl mx-auto bg-card border border-border">
      {/* Header */}
      <div className="p-8 border-b border-border text-center">
        <h1 className="text-3xl font-bold text-foreground tracking-wide mb-2">
          {t.title}
        </h1>
        <p className="text-muted-foreground">
          {t.subtitle}
        </p>
      </div>

      {/* What We Are / Are Not */}
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
            {t.whatWeAre}
          </h2>
          <ul className="space-y-2">
            {p.systemRole.is.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-foreground mt-1">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 p-3 border border-border bg-muted/20 text-center">
            <span className="text-sm font-medium text-foreground">
              {p.systemRole.coreIdentity}
            </span>
          </div>
        </div>

        <div className="p-6 bg-muted/10">
          <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
            {t.whatWeAreNot}
          </h2>
          <ul className="space-y-2">
            {p.systemRole.isNot.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-destructive mt-1">×</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Purpose */}
      <div className="p-6 border-t border-border">
        <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
          {t.purpose}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase">
              {language === 'en' ? 'Enables' : 'Möjliggör'}
            </h3>
            <ul className="space-y-1">
              {p.purpose.enablesAudiencesTo.map((item, i) => (
                <li key={i} className="text-sm text-foreground">• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase">
              {language === 'en' ? 'Replaces' : 'Ersätter'}
            </h3>
            <ul className="space-y-1">
              {p.purpose.replaces.map((item, i) => (
                <li key={i} className="text-sm text-foreground">• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Audiences */}
      <div className="p-6 border-t border-border bg-muted/20">
        <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
          {t.audiences}
        </h2>
        <div className="flex flex-wrap gap-2">
          {p.purpose.servedAudiences.map((audience, i) => (
            <span 
              key={i}
              className="px-3 py-1 border border-border bg-background text-sm text-foreground"
            >
              {audience}
            </span>
          ))}
        </div>
      </div>

      {/* Data Standards */}
      <div className="p-6 border-t border-border">
        <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
          {t.dataStandards}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase">
              {language === 'en' ? 'All data must be' : 'All data måste vara'}
            </h3>
            <ul className="space-y-1">
              {p.dataRequirements.mandatory.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-foreground">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase">
              {language === 'en' ? 'Never permitted' : 'Aldrig tillåtet'}
            </h3>
            <ul className="space-y-1">
              {p.dataRequirements.forbidden.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-destructive">×</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Political Neutrality */}
      <div className="p-6 border-t border-border bg-muted/10">
        <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
          {t.neutrality}
        </h2>
        <div className="space-y-3">
          <p className="text-muted-foreground">{p.politicalNeutrality.statement}</p>
          <p className="text-muted-foreground">{p.politicalNeutrality.principle}</p>
          <p className="text-foreground font-medium">{p.politicalNeutrality.disclaimer}</p>
        </div>
      </div>

      {/* Transparency Principle */}
      <div className="p-6 border-t border-border">
        <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
          {t.transparency}
        </h2>
        <div className="space-y-4">
          <div className="p-4 border border-border bg-muted/20">
            <p className="text-sm text-foreground">{p.transparencyPrinciple.ifWellGrounded}</p>
          </div>
          <div className="p-4 border border-border bg-muted/20">
            <p className="text-sm text-foreground">{p.transparencyPrinciple.ifUngrounded}</p>
          </div>
          <p className="text-center text-muted-foreground italic">
            {p.transparencyPrinciple.nature}
          </p>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-6 border-t-2 border-foreground bg-foreground text-background">
        <p className="text-center font-medium">
          {p.mandatoryDisclaimer[language]}
        </p>
      </div>

      {/* Closing Principle */}
      <div className="p-6 border-t border-border text-center">
        <p className="text-lg font-medium text-foreground">
          {p.closingPrinciple[language]}
        </p>
      </div>
    </div>
  );
}
