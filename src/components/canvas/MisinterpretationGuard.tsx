/**
 * BLOCK PH — MISINTERPRETATION GUARD (STÄNDIGT SYNLIG)
 * 
 * En diskret men tydlig ruta:
 * ⚠️ Detta är observerade samband över tid.
 * Samband kan påverkas av andra faktorer.
 * Systemet visar mönster, inte orsaker.
 * 
 * 📌 Detta är epistemisk hygien.
 */

import React from 'react';
import { MISINTERPRETATION_GUARD } from '@/config/correlationLearningCanvasConfig';
import { TRUTH_ORACLE_DOCTRINE } from '@/config/truthOracleDoctrineConfig';

interface MisinterpretationGuardProps {
  language?: 'sv' | 'en';
}

export function MisinterpretationGuard({ language = 'sv' }: MisinterpretationGuardProps) {
  const disclaimer = TRUTH_ORACLE_DOCTRINE.platformDisclaimer[language];
  
  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 bg-card/95 backdrop-blur border-t py-2 px-4">
      <div className="container mx-auto flex items-center gap-3 text-sm">
        <span className="flex-shrink-0 w-5 h-5 border border-border flex items-center justify-center text-xs font-mono">
          !
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-muted-foreground">
          <span>Detta är observerade samband över tid.</span>
          <span className="hidden sm:inline text-muted-foreground/50">•</span>
          <span>Samband kan påverkas av andra faktorer.</span>
          <span className="hidden sm:inline text-muted-foreground/50">•</span>
          <span className="font-medium text-foreground">{disclaimer}</span>
        </div>
      </div>
    </div>
  );
}
