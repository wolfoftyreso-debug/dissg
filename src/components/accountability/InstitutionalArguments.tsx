/**
 * INSTITUTIONAL ARGUMENTS
 * 
 * Why no serious institution can argue against the accountability principle.
 * Central Banks, Governments, International Organizations.
 */

import React from 'react';
import { INSTITUTIONAL_ARGUMENTS, type InstitutionalArgument } from '@/config/accountabilityPrincipleConfig';

interface InstitutionalArgumentsProps {
  language?: 'en' | 'sv';
  variant?: 'full' | 'compact' | 'cards';
  className?: string;
}

export function InstitutionalArguments({
  language = 'en',
  variant = 'full',
  className = '',
}: InstitutionalArgumentsProps) {
  const labels = {
    en: {
      title: 'Why No Serious Institution Can Argue Against',
      manages: 'Manages',
      withoutSharedLayer: 'Without shared data layer',
    },
    sv: {
      title: 'Varför ingen seriös institution kan säga emot',
      manages: 'Styr',
      withoutSharedLayer: 'Utan gemensamt datalager',
    },
  }[language];

  if (variant === 'compact') {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="font-semibold">{labels.title}</h3>
        <div className="flex flex-wrap gap-2">
          {INSTITUTIONAL_ARGUMENTS.map((arg, i) => (
            <span key={i} className="px-3 py-1 bg-muted text-sm">
              {arg.icon} {arg.institution[language]}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
        {INSTITUTIONAL_ARGUMENTS.map((arg, i) => (
          <InstitutionalArgumentCard key={i} argument={arg} language={language} labels={labels} />
        ))}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`space-y-8 ${className}`}>
      <h2 className="text-xl font-bold text-center">{labels.title}</h2>
      
      <div className="space-y-6">
        {INSTITUTIONAL_ARGUMENTS.map((arg, i) => (
          <InstitutionalArgumentFull key={i} argument={arg} language={language} labels={labels} />
        ))}
      </div>
    </div>
  );
}

function InstitutionalArgumentCard({
  argument,
  language,
  labels,
}: {
  argument: InstitutionalArgument;
  language: 'en' | 'sv';
  labels: { manages: string; withoutSharedLayer: string };
}) {
  return (
    <div className="border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{argument.icon}</span>
        <h3 className="font-bold">{argument.institution[language]}</h3>
      </div>
      
      <div>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{labels.manages}</span>
        <ul className="mt-1 text-sm space-y-0.5">
          {argument.manages[language].map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
      </div>
      
      <div className="pt-3 border-t border-border">
        <p className="text-sm font-medium text-destructive">
          {argument.consequence[language]}
        </p>
      </div>
    </div>
  );
}

function InstitutionalArgumentFull({
  argument,
  language,
  labels,
}: {
  argument: InstitutionalArgument;
  language: 'en' | 'sv';
  labels: { manages: string; withoutSharedLayer: string };
}) {
  return (
    <div className="border-2 border-border bg-card p-6">
      <div className="flex items-start gap-4">
        <span className="text-4xl flex-shrink-0">{argument.icon}</span>
        
        <div className="flex-1 space-y-4">
          <h3 className="text-xl font-bold">{argument.institution[language]}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {labels.manages}
              </span>
              <ul className="mt-2 space-y-1">
                {argument.manages[language].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {labels.withoutSharedLayer}
              </span>
              <ul className="mt-2 space-y-1">
                {argument.withoutSharedLayer[language].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-destructive">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <p className="font-semibold text-destructive">
              👉 {argument.consequence[language]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
