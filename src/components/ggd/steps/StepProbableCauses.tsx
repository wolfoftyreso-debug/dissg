/**
 * Step 5: Probable Causes
 * 
 * Ranked causal hypotheses with probability-based inference.
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronRight, AlertTriangle, ArrowRight, Info } from 'lucide-react';
import type { ProbableCause } from '../types';

interface StepProbableCausesProps {
  causes: ProbableCause[];
  onConfirm: () => void;
}

export function StepProbableCauses({ causes, onConfirm }: StepProbableCausesProps) {
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return '#22c55e';
      case 'moderate': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <Badge variant="outline" className="mb-4 font-mono">STEG 5 / 8</Badge>
        <h2 className="text-2xl font-bold mb-2">Troliga orsaker (rankade)</h2>
        <p className="text-muted-foreground">
          Systemet har identifierat följande orsakshypoteser
        </p>
      </div>

      {/* Warning */}
      <Alert className="mb-6 bg-amber-500/10 border-amber-500">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-amber-500">
          <strong>OBS:</strong> Detta är sannolikhetsbaserad inferens – inte sanning. 
          Varje orsak måste verifieras mot data.
        </AlertDescription>
      </Alert>

      {/* Causes list */}
      <div className="space-y-4 mb-8">
        {causes.map((cause, index) => (
          <div 
            key={cause.id}
            className="bg-card border rounded-xl p-6 transition-all hover:border-primary/50"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-mono font-bold text-primary">
                  {cause.rank}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{cause.name.sv}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline" 
                      style={{ 
                        borderColor: getStrengthColor(cause.evidenceStrength),
                        color: getStrengthColor(cause.evidenceStrength),
                      }}
                    >
                      {cause.evidenceStrength === 'strong' ? 'Stark evidens' : 
                       cause.evidenceStrength === 'moderate' ? 'Måttlig evidens' : 'Svag evidens'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-mono font-bold text-primary">
                  {cause.probability}%
                </div>
                <div className="text-xs text-muted-foreground">sannolikhet</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4">
              {cause.description.sv}
            </p>

            {/* Probability bar */}
            <div className="mb-4">
              <Progress value={cause.probability} className="h-2" />
            </div>

            {/* Mechanism chain */}
            <div className="mb-4">
              <div className="text-xs text-muted-foreground mb-2">ORSAKSMEKANISM</div>
              <div className="flex items-center flex-wrap gap-2">
                {cause.mechanismChain.map((step, i) => (
                  <React.Fragment key={i}>
                    <Badge variant="secondary" className="text-xs">
                      {step}
                    </Badge>
                    {i < cause.mechanismChain.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Related indicators */}
            <div>
              <div className="text-xs text-muted-foreground mb-2">RELATERADE INDIKATORER</div>
              <div className="flex flex-wrap gap-2">
                {cause.relatedIndicators.map(ind => (
                  <Badge key={ind} variant="outline" className="text-xs font-mono">
                    {ind}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Probability sum note */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Info className="h-4 w-4" />
        <span>
          Total sannolikhet: {causes.reduce((sum, c) => sum + c.probability, 0)}% 
          (kan överlappa då orsaker kan samverka)
        </span>
      </div>

      {/* Action button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={onConfirm}
          className="font-mono"
        >
          Fortsätt till verifiering
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
