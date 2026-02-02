/**
 * SYSTEM LIMITATIONS DISCLOSURE
 * 
 * Visar var systemet är svagt, osäkert eller ofullständigt.
 * "Self-criticism = legitimacy"
 */

import React from 'react';
import { TRANSPARENCY_LAYER_PROMPT_PART_II } from '@/config/masterPromptConfig';

interface DataLimitation {
  coverage?: number;
  timeGaps?: string[];
  methodologyChanges?: string[];
  knownBiases?: string[];
}

interface SystemLimitationsDisclosureProps {
  language?: 'sv' | 'en';
  limitations?: DataLimitation;
  variant?: 'inline' | 'panel' | 'footer';
  className?: string;
}

export function SystemLimitationsDisclosure({
  language = 'en',
  limitations,
  variant = 'panel',
  className = '',
}: SystemLimitationsDisclosureProps) {
  const config = TRANSPARENCY_LAYER_PROMPT_PART_II.selfLimitation;
  const standardText = config.standardFormulation[language];

  const labels = {
    en: {
      title: 'Data Limitations',
      coverage: 'Data Coverage',
      timeGaps: 'Time Gaps',
      methodChanges: 'Methodology Changes',
      knownBiases: 'Known Biases',
      noLimitations: 'No specific limitations identified for this view.',
    },
    sv: {
      title: 'Databegränsningar',
      coverage: 'Datatäckning',
      timeGaps: 'Tidsluckor',
      methodChanges: 'Metodbyten',
      knownBiases: 'Kända biaser',
      noLimitations: 'Inga specifika begränsningar identifierade för denna vy.',
    },
  }[language];

  if (variant === 'inline') {
    return (
      <span className={`text-xs text-muted-foreground italic ${className}`}>
        {standardText}
      </span>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`border-t border-border py-3 text-center ${className}`}>
        <p className="text-sm text-muted-foreground">{standardText}</p>
      </div>
    );
  }

  // Panel variant
  return (
    <div className={`border border-border bg-muted/30 p-4 space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 border border-border flex items-center justify-center text-xs font-mono">
          ⚠
        </span>
        <h4 className="font-medium text-sm">{labels.title}</h4>
      </div>

      {limitations ? (
        <div className="space-y-3 text-sm">
          {limitations.coverage !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{labels.coverage}</span>
              <span className="font-mono">{limitations.coverage}%</span>
            </div>
          )}

          {limitations.timeGaps && limitations.timeGaps.length > 0 && (
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wide">
                {labels.timeGaps}
              </span>
              <ul className="mt-1 space-y-1">
                {limitations.timeGaps.map((gap, i) => (
                  <li key={i} className="text-xs font-mono text-muted-foreground">
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {limitations.methodologyChanges && limitations.methodologyChanges.length > 0 && (
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wide">
                {labels.methodChanges}
              </span>
              <ul className="mt-1 space-y-1">
                {limitations.methodologyChanges.map((change, i) => (
                  <li key={i} className="text-xs text-muted-foreground">
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {limitations.knownBiases && limitations.knownBiases.length > 0 && (
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wide">
                {labels.knownBiases}
              </span>
              <ul className="mt-1 space-y-1">
                {limitations.knownBiases.map((bias, i) => (
                  <li key={i} className="text-xs text-muted-foreground">
                    {bias}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{labels.noLimitations}</p>
      )}

      <div className="pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground italic">{standardText}</p>
      </div>
    </div>
  );
}
