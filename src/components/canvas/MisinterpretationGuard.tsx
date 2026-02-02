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
import { AlertTriangle } from 'lucide-react';
import { MISINTERPRETATION_GUARD } from '@/config/correlationLearningCanvasConfig';

export function MisinterpretationGuard() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur border-t py-3 px-4">
      <div className="container mx-auto flex items-center gap-3 text-sm">
        <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-muted-foreground">
          <span>Detta är observerade samband över tid.</span>
          <span className="hidden sm:inline text-muted-foreground/50">•</span>
          <span>Samband kan påverkas av andra faktorer.</span>
          <span className="hidden sm:inline text-muted-foreground/50">•</span>
          <span className="font-medium text-foreground">Systemet visar mönster, inte orsaker.</span>
        </div>
      </div>
    </div>
  );
}
