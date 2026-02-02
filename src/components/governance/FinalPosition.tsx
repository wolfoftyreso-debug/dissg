/**
 * FINAL POSITION
 * 
 * "If you have clean hands, this is protection.
 *  If you do not – it is still just light."
 * 
 * "We judge no one. We illuminate the room."
 */

import React from 'react';
import { FINAL_POSITION, PRACTICAL_IMPACT, COMPLETION_CRITERIA } from '@/config/immutablePrinciplesConfig';

interface FinalPositionProps {
  language?: 'sv' | 'en';
  variant?: 'full' | 'quote' | 'impact';
  className?: string;
}

export function FinalPosition({
  language = 'en',
  variant = 'full',
  className = '',
}: FinalPositionProps) {
  if (variant === 'quote') {
    return (
      <blockquote className={`border-l-4 border-primary pl-4 py-2 ${className}`}>
        <p className="text-lg italic">{FINAL_POSITION.thesis[language]}</p>
        <footer className="text-sm text-muted-foreground mt-2">
          {FINAL_POSITION.stance[language]}
        </footer>
      </blockquote>
    );
  }

  if (variant === 'impact') {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          {language === 'en' ? 'Practical Impact' : 'Praktisk effekt'}
        </h3>
        <ul className="space-y-2">
          {PRACTICAL_IMPACT.effects.map((effect, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className="text-primary">→</span>
              {effect}
            </li>
          ))}
        </ul>
        <p className="text-sm italic text-muted-foreground">{PRACTICAL_IMPACT.note}</p>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`border-2 border-border bg-card p-8 space-y-8 ${className}`}>
      {/* Thesis */}
      <div className="text-center space-y-4">
        <p className="text-xl font-semibold leading-relaxed max-w-xl mx-auto">
          {FINAL_POSITION.thesis[language]}
        </p>
        <p className="text-lg text-primary">
          {FINAL_POSITION.stance[language]}
        </p>
      </div>

      {/* Impact */}
      <div className="pt-6 border-t border-border">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4 text-center">
          {language === 'en' ? 'When This Is In Place' : 'När detta är på plats'}
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
          {PRACTICAL_IMPACT.effects.map((effect, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className="w-5 h-5 border border-primary flex items-center justify-center text-xs text-primary">
                ✓
              </span>
              {effect}
            </li>
          ))}
        </ul>
        <p className="text-center text-sm italic text-muted-foreground mt-4">
          {PRACTICAL_IMPACT.note}
        </p>
      </div>

      {/* Completion Criteria */}
      <div className="pt-6 border-t border-border">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4 text-center">
          {language === 'en' ? 'Completion Criteria' : 'Klart-kriterium'}
        </h3>
        <ul className="space-y-2 max-w-md mx-auto">
          {COMPLETION_CRITERIA.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <span className={`w-5 h-5 border flex items-center justify-center text-xs ${
                item.achieved 
                  ? 'border-primary bg-primary text-primary-foreground' 
                  : 'border-muted-foreground/50'
              }`}>
                {item.achieved ? '✓' : '○'}
              </span>
              {item.criterion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
