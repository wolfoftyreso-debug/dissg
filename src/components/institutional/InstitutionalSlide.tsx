/**
 * INSTITUTIONAL SLIDE COMPONENT
 * 
 * A single slide for institutional presentations.
 * Designed for maximum neutrality and professionalism.
 */

import React from 'react';
import type { SlideData } from '@/config/institutionalBriefConfig';

interface InstitutionalSlideProps {
  slide: SlideData;
  language?: 'en' | 'sv';
  variant?: 'presentation' | 'preview' | 'print';
  className?: string;
}

export function InstitutionalSlide({
  slide,
  language = 'en',
  variant = 'presentation',
  className = '',
}: InstitutionalSlideProps) {
  const isPresentation = variant === 'presentation';
  const isPrint = variant === 'print';

  return (
    <div
      className={`
        ${isPresentation ? 'min-h-screen flex flex-col justify-center p-12 lg:p-24' : ''}
        ${isPrint ? 'page-break-after-always p-8' : ''}
        ${variant === 'preview' ? 'p-6 border border-border' : ''}
        ${className}
      `}
    >
      {/* Slide Number */}
      <div className="mb-8">
        <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
          Slide {slide.number} / 3
        </span>
      </div>

      {/* Title */}
      <h1 className={`
        font-bold leading-tight mb-12
        ${isPresentation ? 'text-4xl lg:text-5xl' : 'text-2xl'}
      `}>
        {slide.title[language]}
      </h1>

      {/* Bullets */}
      <ul className={`
        space-y-6 mb-12
        ${isPresentation ? 'text-xl lg:text-2xl' : 'text-base'}
      `}>
        {slide.bullets.map((bullet, index) => (
          <li key={index} className="flex items-start gap-4">
            <span className="flex-shrink-0 w-2 h-2 mt-3 bg-primary" />
            <span className="text-foreground/90">{bullet[language]}</span>
          </li>
        ))}
      </ul>

      {/* Key Statement or Closing Statement */}
      {'keyStatement' in slide && slide.keyStatement && (
        <div className={`
          border-l-4 border-primary pl-6 py-4 bg-primary/5
          ${isPresentation ? 'text-2xl lg:text-3xl' : 'text-lg'}
        `}>
          <p className="font-semibold">{slide.keyStatement[language]}</p>
        </div>
      )}

      {'closingStatement' in slide && slide.closingStatement && (
        <div className={`
          mt-auto pt-8 border-t border-border
          ${isPresentation ? 'text-lg lg:text-xl' : 'text-base'}
        `}>
          <p className="text-muted-foreground italic">
            {slide.closingStatement[language]}
          </p>
        </div>
      )}
    </div>
  );
}
