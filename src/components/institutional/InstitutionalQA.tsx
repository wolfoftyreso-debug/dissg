/**
 * INSTITUTIONAL Q&A
 * 
 * Pre-prepared responses for institutional presentations.
 * "When (not if) someone asks..."
 */

import React, { useState } from 'react';
import { INSTITUTIONAL_QA, type QAResponse } from '@/config/institutionalBriefConfig';

interface InstitutionalQAProps {
  language?: 'en' | 'sv';
  variant?: 'full' | 'compact' | 'cards';
  className?: string;
}

export function InstitutionalQA({
  language = 'en',
  variant = 'full',
  className = '',
}: InstitutionalQAProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const labels = {
    en: {
      title: 'Institutional Q&A',
      subtitle: 'Pre-prepared responses for presentations',
      note: 'When (not if) someone asks...',
    },
    sv: {
      title: 'Institutionell Q&A',
      subtitle: 'Förberedda svar för presentationer',
      note: 'När (inte om) någon frågar...',
    },
  }[language];

  if (variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        <h3 className="text-sm font-semibold">{labels.title}</h3>
        <ul className="space-y-2 text-sm">
          {INSTITUTIONAL_QA.slice(0, 3).map((qa, i) => (
            <li key={i}>
              <span className="text-muted-foreground">"</span>
              {qa.question[language]}
              <span className="text-muted-foreground">"</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {INSTITUTIONAL_QA.map((qa, i) => (
          <QACard key={i} qa={qa} language={language} />
        ))}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h2 className="text-xl font-bold">{labels.title}</h2>
        <p className="text-sm text-muted-foreground">{labels.subtitle}</p>
        <p className="text-sm italic mt-2">{labels.note}</p>
      </div>

      <div className="space-y-2">
        {INSTITUTIONAL_QA.map((qa, i) => (
          <div
            key={i}
            className="border border-border bg-card"
          >
            <button
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-muted/50"
            >
              <span className="font-medium">"{qa.question[language]}"</span>
              <span className="text-muted-foreground">
                {expandedIndex === i ? '−' : '+'}
              </span>
            </button>
            
            {expandedIndex === i && (
              <div className="px-4 py-3 border-t border-border bg-primary/5">
                <p className="text-lg font-medium mb-2">
                  "{qa.response[language]}"
                </p>
                <span className="text-xs text-muted-foreground font-mono uppercase">
                  Tone: {qa.tone}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function QACard({ qa, language }: { qa: QAResponse; language: 'en' | 'sv' }) {
  return (
    <div className="border border-border bg-card p-4 space-y-3">
      <div className="text-sm text-muted-foreground">
        "{qa.question[language]}"
      </div>
      <div className="border-l-2 border-primary pl-3">
        <p className="font-medium">"{qa.response[language]}"</p>
      </div>
      <div className="text-xs text-muted-foreground font-mono">
        {qa.tone}
      </div>
    </div>
  );
}
