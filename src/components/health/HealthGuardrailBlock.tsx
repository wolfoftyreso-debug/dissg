/**
 * HEALTH GUARDRAIL BLOCK
 * 
 * Displays when a query is blocked or needs warning.
 * Technical barrier against medical advice.
 */

import React from 'react';
import { ShieldAlert, AlertCircle, Stethoscope } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { GuardrailResponse } from '@/lib/health/guardrails';

interface HealthGuardrailBlockProps {
  response: GuardrailResponse;
  onDismiss?: () => void;
  className?: string;
}

export function HealthGuardrailBlock({
  response,
  onDismiss,
  className = ''
}: HealthGuardrailBlockProps) {
  if (response.warningLevel === 'none' || response.allowed === true && !response.reason) {
    return null;
  }

  if (response.warningLevel === 'blocked') {
    return (
      <div className={`rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-950/30 p-6 ${className}`}>
        <div className="flex gap-4">
          <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-400 flex-shrink-0" />
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
              Query Not Supported
            </h3>
            <p className="text-red-700 dark:text-red-300">
              {response.reason}
            </p>
            {response.suggestion && (
              <div className="bg-white dark:bg-slate-900 rounded p-3 border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-2">
                  <Stethoscope className="h-5 w-5 text-red-600 mt-0.5" />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {response.suggestion}
                  </p>
                </div>
              </div>
            )}
            <div className="pt-2">
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                What you can explore on this platform:
              </h4>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                <li>• Population-level health statistics</li>
                <li>• Historical trends in disease burden</li>
                <li>• Cross-country comparisons</li>
                <li>• Policy period analysis</li>
                <li>• Substance use prevalence data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Caution level
  return (
    <Alert className={`border-amber-500 bg-amber-50 dark:bg-amber-950/30 ${className}`}>
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800 dark:text-amber-200">
        Observational Data Only
      </AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-300">
        <p>{response.reason}</p>
        {response.suggestion && (
          <p className="mt-1 text-sm">{response.suggestion}</p>
        )}
      </AlertDescription>
      {onDismiss && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onDismiss}
          className="mt-2"
        >
          I understand, show results
        </Button>
      )}
    </Alert>
  );
}

/**
 * Interpretation guide block
 */
export function InterpretationGuide({
  shows,
  doesNotShow,
  className = ''
}: {
  shows: string[];
  doesNotShow: string[];
  className?: string;
}) {
  return (
    <div className={`grid md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border ${className}`}>
      <div>
        <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          This shows
        </h4>
        <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
          {shows.map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          This does NOT show
        </h4>
        <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
          {doesNotShow.map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HealthGuardrailBlock;
