/**
 * Step 1: Symptom Definition
 * 
 * User must confirm the deviation they want to analyze.
 * No progress without explicit confirmation.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, TrendingDown, TrendingUp, Minus, CheckCircle2 } from 'lucide-react';
import type { SymptomData } from '../types';

interface StepSymptomDefinitionProps {
  symptomData: SymptomData;
  geoName: string;
  onConfirm: () => void;
}

export function StepSymptomDefinition({ symptomData, geoName, onConfirm }: StepSymptomDefinitionProps) {
  const [confirmed, setConfirmed] = useState(false);

  const TrendIcon = symptomData.trend === 'increasing' 
    ? TrendingUp 
    : symptomData.trend === 'decreasing' 
      ? TrendingDown 
      : Minus;

  const trendColor = symptomData.trend === 'increasing' 
    ? 'text-green-500' 
    : symptomData.trend === 'decreasing' 
      ? 'text-red-500' 
      : 'text-yellow-500';

  const getLambdaColor = (lambda: number) => {
    if (lambda < 0.85) return '#dc2626';
    if (lambda < 0.95) return '#f97316';
    if (lambda <= 1.05) return '#3b82f6';
    return '#a855f7';
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500 rounded-lg mb-4">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <span className="text-amber-500 font-mono text-sm">SYSTEM DIAGNOSTIC MODE</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Följande avvikelse har identifierats</h2>
        <p className="text-muted-foreground">
          Granska informationen nedan och bekräfta att detta är avvikelsen du vill analysera
        </p>
      </div>

      {/* Main deviation card */}
      <div className="bg-card border rounded-xl p-8 mb-6">
        <div className="text-center mb-8">
          <div className="text-sm text-muted-foreground mb-2">{geoName}</div>
          <div className="flex items-center justify-center gap-8">
            {/* Current Lambda */}
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">AKTUELLT</div>
              <div 
                className="text-5xl font-mono font-bold"
                style={{ color: getLambdaColor(symptomData.currentLambda) }}
              >
                λ = {symptomData.currentLambda.toFixed(2)}
              </div>
            </div>

            {/* Arrow */}
            <div className="text-4xl text-muted-foreground">→</div>

            {/* Target Lambda */}
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">BÖRVÄRDE</div>
              <div className="text-5xl font-mono font-bold text-blue-500">
                λ = {symptomData.targetLambda.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Deviation metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1">AVVIKELSE</div>
            <div className={`text-2xl font-mono font-bold ${symptomData.deviationPercent < 0 ? 'text-red-500' : 'text-green-500'}`}>
              {symptomData.deviationPercent > 0 ? '+' : ''}{symptomData.deviationPercent}%
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1">UPPSTOD</div>
            <div className="text-2xl font-mono font-bold">
              {symptomData.deviationStart}
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1">TREND</div>
            <div className={`text-2xl font-mono font-bold flex items-center justify-center gap-2 ${trendColor}`}>
              <TrendIcon className="h-5 w-5" />
              {symptomData.trend === 'increasing' ? 'Ökande' : symptomData.trend === 'decreasing' ? 'Minskande' : 'Stabil'}
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1">KONFIDENS</div>
            <div className="text-2xl font-mono font-bold">
              {symptomData.confidence}%
            </div>
          </div>
        </div>

        {/* Trend velocity */}
        <div className="bg-muted/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Förändringshastighet</span>
            <span className={`font-mono text-lg ${symptomData.trendVelocity < 0 ? 'text-red-500' : 'text-green-500'}`}>
              {symptomData.trendVelocity > 0 ? '+' : ''}{symptomData.trendVelocity.toFixed(3)} λ/år
            </span>
          </div>
        </div>

        {/* Confirmation checkbox */}
        <div className="border-t pt-6">
          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
            <Checkbox
              id="confirm"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked === true)}
              className="mt-1"
            />
            <label htmlFor="confirm" className="text-sm cursor-pointer">
              <span className="font-medium">Jag bekräftar att detta är avvikelsen jag vill analysera</span>
              <p className="text-muted-foreground mt-1">
                Genom att bekräfta går du in i guidat diagnosläge. Alla steg måste genomföras i ordning.
              </p>
            </label>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          disabled={!confirmed}
          onClick={onConfirm}
          className="font-mono"
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Bekräfta och fortsätt
        </Button>
      </div>

      {/* Footer note */}
      <div className="mt-6 text-center text-xs text-muted-foreground">
        Ingen genväg finns. Varje steg måste verifieras innan nästa.
      </div>
    </div>
  );
}
