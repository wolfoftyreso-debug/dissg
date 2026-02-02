/**
 * INSTITUTIONAL BRIEF PREVIEW
 * 
 * All 3 slides in preview mode, with Q&A and positioning.
 */

import React, { useState } from 'react';
import { InstitutionalSlide } from './InstitutionalSlide';
import { InstitutionalBriefPresenter } from './InstitutionalBriefPresenter';
import { InstitutionalQA } from './InstitutionalQA';
import { DavosPositioning } from './DavosPositioning';
import { INSTITUTIONAL_BRIEF_SLIDES } from '@/config/institutionalBriefConfig';

interface InstitutionalBriefPreviewProps {
  language?: 'en' | 'sv';
  className?: string;
}

export function InstitutionalBriefPreview({
  language = 'en',
  className = '',
}: InstitutionalBriefPreviewProps) {
  const [presenterOpen, setPresenterOpen] = useState(false);
  const [startSlide, setStartSlide] = useState(0);

  const labels = {
    en: {
      title: 'Institutional Brief',
      subtitle: '3 Neutral Slides for Global Institutions',
      goal: 'Not to sell. Not to convince. Just to show that this should already exist.',
      startPresentation: 'Start Presentation',
      preview: 'Preview',
    },
    sv: {
      title: 'Institutionell Brief',
      subtitle: '3 Neutrala Slides för Globala Institutioner',
      goal: 'Inte sälja. Inte övertyga. Bara visa att detta redan borde finnas.',
      startPresentation: 'Starta Presentation',
      preview: 'Förhandsgranskning',
    },
  }[language];

  const openPresenter = (slideIndex: number = 0) => {
    setStartSlide(slideIndex);
    setPresenterOpen(true);
  };

  if (presenterOpen) {
    return (
      <InstitutionalBriefPresenter
        language={language}
        startSlide={startSlide}
        onClose={() => setPresenterOpen(false)}
      />
    );
  }

  return (
    <div className={`space-y-12 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4 pb-6 border-b border-border">
        <span className="inline-block text-xs font-mono text-muted-foreground uppercase tracking-widest px-3 py-1 border border-border">
          🏛️ WEF / UN / OECD Compatible
        </span>
        <h1 className="text-3xl font-bold">{labels.title}</h1>
        <p className="text-lg text-muted-foreground">{labels.subtitle}</p>
        <p className="text-sm italic max-w-md mx-auto">{labels.goal}</p>
        
        <button
          onClick={() => openPresenter(0)}
          className="mt-4 px-6 py-3 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          {labels.startPresentation} →
        </button>
      </div>

      {/* Slide Previews */}
      <div>
        <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">
          {labels.preview}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {INSTITUTIONAL_BRIEF_SLIDES.map((slide, index) => (
            <button
              key={index}
              onClick={() => openPresenter(index)}
              className="text-left hover:ring-2 ring-primary transition-all"
            >
              <InstitutionalSlide
                slide={slide}
                language={language}
                variant="preview"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Q&A Section */}
      <div className="pt-8 border-t border-border">
        <InstitutionalQA language={language} variant="full" />
      </div>

      {/* Davos Positioning */}
      <div className="pt-8 border-t border-border">
        <DavosPositioning language={language} variant="full" />
      </div>
    </div>
  );
}
