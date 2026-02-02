/**
 * DAVOS POSITIONING
 * 
 * Why this works in institutional rooms.
 * "Davos is not about truth. It is about coordination without chaos."
 */

import React from 'react';
import { DAVOS_POSITIONING } from '@/config/institutionalBriefConfig';

interface DavosPositioningProps {
  language?: 'en' | 'sv';
  variant?: 'full' | 'insight' | 'principles';
  className?: string;
}

export function DavosPositioning({
  language = 'en',
  variant = 'full',
  className = '',
}: DavosPositioningProps) {
  const labels = {
    en: {
      title: 'Why This Works in Institutional Rooms',
      subtitle: 'Positioning for Davos, UN, OECD, Central Banks',
    },
    sv: {
      title: 'Varför detta fungerar i institutionella rum',
      subtitle: 'Positionering för Davos, FN, OECD, Centralbanker',
    },
  }[language];

  if (variant === 'insight') {
    return (
      <blockquote className={`border-l-4 border-primary pl-4 py-2 italic ${className}`}>
        <p className="text-lg">{DAVOS_POSITIONING.insight[language]}</p>
      </blockquote>
    );
  }

  if (variant === 'principles') {
    return (
      <ul className={`space-y-2 ${className}`}>
        {DAVOS_POSITIONING.principles.map((p, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="w-6 h-6 border border-primary flex items-center justify-center text-xs text-primary">
              ✓
            </span>
            <span>{p[language]}</span>
          </li>
        ))}
      </ul>
    );
  }

  // Full variant
  return (
    <div className={`border-2 border-border bg-card p-6 space-y-6 ${className}`}>
      <div>
        <h2 className="text-xl font-bold">{labels.title}</h2>
        <p className="text-sm text-muted-foreground">{labels.subtitle}</p>
      </div>

      <ul className="space-y-3">
        {DAVOS_POSITIONING.principles.map((p, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="w-8 h-8 border-2 border-primary flex items-center justify-center text-primary">
              ✓
            </span>
            <span className="text-lg">{p[language]}</span>
          </li>
        ))}
      </ul>

      <div className="pt-4 border-t border-border">
        <p className="text-lg font-semibold text-center italic">
          {DAVOS_POSITIONING.insight[language]}
        </p>
      </div>
    </div>
  );
}
