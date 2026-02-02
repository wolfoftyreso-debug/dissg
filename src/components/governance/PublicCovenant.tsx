/**
 * PUBLIC COVENANT
 * 
 * Det som alla ser. Alltid tillgängligt.
 * Short. Rock-solid. Unassailable.
 */

import React from 'react';
import { PUBLIC_COVENANT } from '@/config/immutablePrinciplesConfig';

interface PublicCovenantProps {
  language?: 'sv' | 'en';
  variant?: 'banner' | 'card' | 'prominent' | 'footer';
  className?: string;
}

export function PublicCovenant({
  language = 'en',
  variant = 'card',
  className = '',
}: PublicCovenantProps) {
  const text = PUBLIC_COVENANT.shortVersion[language];

  if (variant === 'footer') {
    return (
      <div className={`border-t border-border py-6 text-center ${className}`}>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {text}
        </p>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-primary/5 border-y border-primary/20 py-4 px-6 ${className}`}>
        <p className="text-center text-sm max-w-3xl mx-auto">{text}</p>
      </div>
    );
  }

  if (variant === 'prominent') {
    return (
      <div className={`border-4 border-border bg-card p-8 text-center space-y-4 ${className}`}>
        <div className="w-12 h-12 border-2 border-primary mx-auto flex items-center justify-center text-2xl">
          📜
        </div>
        <h2 className="text-xl font-bold tracking-wide">PUBLIC COVENANT</h2>
        <p className="text-lg leading-relaxed max-w-2xl mx-auto">{text}</p>
        <div className="flex justify-center gap-4 pt-4">
          {PUBLIC_COVENANT.properties.map((prop) => (
            <span
              key={prop}
              className="text-xs px-3 py-1 bg-muted text-muted-foreground font-mono uppercase"
            >
              {prop}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Card variant (default)
  return (
    <div className={`border border-border bg-card p-5 space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 border border-border flex items-center justify-center text-sm">
          📜
        </span>
        <h3 className="font-semibold text-sm uppercase tracking-wider">Public Covenant</h3>
      </div>
      <p className="text-sm leading-relaxed">{text}</p>
      <div className="text-xs text-muted-foreground italic">
        {PUBLIC_COVENANT.visibility}
      </div>
    </div>
  );
}
