/**
 * INCONSISTENCY DETECTION
 * 
 * Templates for how the system expresses when action ≠ outcome.
 * Always factual. Never accusatory.
 */

import React from 'react';
import { INCONSISTENCY_TEMPLATES, type InconsistencyTemplate } from '@/config/institutionalVoiceConfig';

interface InconsistencyDetectionProps {
  language?: 'en' | 'sv';
  variant?: 'full' | 'templates' | 'demo';
  className?: string;
}

export function InconsistencyDetection({
  language = 'en',
  variant = 'full',
  className = '',
}: InconsistencyDetectionProps) {
  const labels = {
    en: {
      title: 'Inconsistency Detection Language',
      subtitle: 'How the system expresses when action ≠ outcome',
      type: 'Type',
      severity: 'Severity',
      template: 'Template',
      placeholders: 'Placeholders',
    },
    sv: {
      title: 'Språk för inkonsekvensdetektering',
      subtitle: 'Hur systemet uttrycker när handling ≠ utfall',
      type: 'Typ',
      severity: 'Allvarlighet',
      template: 'Mall',
      placeholders: 'Platshållare',
    },
  }[language];

  const typeLabels = {
    mismatch: { en: 'Mismatch', sv: 'Avvikelse' },
    absence: { en: 'Absence', sv: 'Frånvaro' },
    contradiction: { en: 'Contradiction', sv: 'Motsägelse' },
    worsening: { en: 'Worsening', sv: 'Försämring' },
  };

  const severityLabels = {
    notice: { en: 'Notice', sv: 'Notering' },
    observation: { en: 'Observation', sv: 'Observation' },
    significant: { en: 'Significant', sv: 'Betydande' },
  };

  if (variant === 'templates') {
    return (
      <div className={`space-y-4 ${className}`}>
        {INCONSISTENCY_TEMPLATES.map((template) => (
          <InconsistencyTemplateCard 
            key={template.id} 
            template={template} 
            language={language}
            typeLabels={typeLabels}
            severityLabels={severityLabels}
          />
        ))}
      </div>
    );
  }

  if (variant === 'demo') {
    return (
      <div className={`space-y-4 ${className}`}>
        <InconsistencyDemo language={language} />
      </div>
    );
  }

  // Full variant
  return (
    <div className={`space-y-8 ${className}`}>
      <div className="text-center">
        <h2 className="text-xl font-bold">{labels.title}</h2>
        <p className="text-muted-foreground mt-1">{labels.subtitle}</p>
      </div>
      
      <div className="space-y-4">
        {INCONSISTENCY_TEMPLATES.map((template) => (
          <InconsistencyTemplateCard 
            key={template.id} 
            template={template} 
            language={language}
            typeLabels={typeLabels}
            severityLabels={severityLabels}
            showDetails
          />
        ))}
      </div>
    </div>
  );
}

function InconsistencyTemplateCard({
  template,
  language,
  typeLabels,
  severityLabels,
  showDetails = false,
}: {
  template: InconsistencyTemplate;
  language: 'en' | 'sv';
  typeLabels: Record<string, { en: string; sv: string }>;
  severityLabels: Record<string, { en: string; sv: string }>;
  showDetails?: boolean;
}) {
  const severityColors = {
    notice: 'bg-muted text-muted-foreground',
    observation: 'bg-primary/10 text-primary',
    significant: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 bg-muted font-mono uppercase">
            {typeLabels[template.type][language]}
          </span>
          <span className={`text-xs px-2 py-0.5 font-mono uppercase ${severityColors[template.severity]}`}>
            {severityLabels[template.severity][language]}
          </span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">{template.id}</span>
      </div>
      
      <p className="font-medium border-l-2 border-primary pl-3">
        "{template.template[language]}"
      </p>
      
      {showDetails && (
        <div className="flex flex-wrap gap-1 pt-2">
          {template.placeholders.map((ph) => (
            <span key={ph} className="text-xs px-2 py-0.5 bg-muted font-mono">
              {`{${ph}}`}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function InconsistencyDemo({ language }: { language: 'en' | 'sv' }) {
  const examples = [
    {
      label: { en: 'Example: Education spending', sv: 'Exempel: Utbildningssatsning' },
      output: {
        en: 'Stated objective: Improve reading comprehension by 10%. Observed outcome during 2020-2023: Reading comprehension declined by 4.2%.',
        sv: 'Angivet mål: Förbättra läsförståelse med 10%. Observerat utfall under 2020-2023: Läsförståelse sjönk med 4,2%.',
      },
    },
    {
      label: { en: 'Example: Healthcare reform', sv: 'Exempel: Vårdreform' },
      output: {
        en: 'No publicly available documentation was identified showing the basis for continuing the reform after the 2022 evaluation.',
        sv: 'Ingen offentligt tillgänglig dokumentation identifierades som visar underlaget för att fortsätta reformen efter 2022 års utvärdering.',
      },
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-center">
        {language === 'en' ? 'Live Examples' : 'Levande exempel'}
      </h3>
      
      {examples.map((ex, i) => (
        <div key={i} className="border-2 border-border bg-card p-4">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {ex.label[language]}
          </span>
          <div className="mt-2 p-3 bg-muted/50 border-l-4 border-primary">
            <p className="font-medium">{ex.output[language]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Utility function to fill in template placeholders
 */
export function renderInconsistencyTemplate(
  templateId: string,
  values: Record<string, string>,
  language: 'en' | 'sv' = 'en'
): string | null {
  const template = INCONSISTENCY_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return null;

  let result = template.template[language];
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(`{${key}}`, value);
  }
  return result;
}
