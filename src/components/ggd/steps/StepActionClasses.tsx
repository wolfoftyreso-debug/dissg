/**
 * Step 8: Action Classes
 * 
 * Shows historically effective action classes - NOT political recommendations.
 * Only empirical effectiveness data.
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronRight, Info, Clock, BarChart3, Globe } from 'lucide-react';
import type { ActionClass } from '../types';

interface StepActionClassesProps {
  actionClasses: ActionClass[];
  onConfirm: () => void;
}

export function StepActionClasses({ actionClasses, onConfirm }: StepActionClassesProps) {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return '#22c55e';
      case 'medium': return '#f59e0b';
      default: return '#dc2626';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <Badge variant="outline" className="mb-4 font-mono">STEG 8 / 10</Badge>
        <h2 className="text-2xl font-bold mb-2">Åtgärdsklasser</h2>
        <p className="text-muted-foreground">
          Historiskt effektiva åtgärdskategorier baserat på empiriska data
        </p>
      </div>

      {/* Important notice */}
      <Alert className="mb-6 bg-blue-500/10 border-blue-500">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-500">
          <strong>OBS:</strong> Systemet säger aldrig vad som ska göras. 
          Det visar endast vilka åtgärdsklasser som historiskt har haft effekt.
          Ingen ideologi – endast empirisk effekt.
        </AlertDescription>
      </Alert>

      {/* Action classes */}
      <div className="space-y-4 mb-8">
        {actionClasses.map((action) => (
          <div 
            key={action.id}
            className="bg-card border rounded-xl p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge variant="outline" className="mb-2">{action.category}</Badge>
                <h3 className="text-lg font-bold">{action.name.sv}</h3>
                <p className="text-sm text-muted-foreground mt-1">{action.description.sv}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-mono font-bold text-primary">
                  {action.historicalEffectiveness}%
                </div>
                <div className="text-xs text-muted-foreground">historisk effekt</div>
              </div>
            </div>

            {/* Effectiveness bar */}
            <div className="mb-4">
              <Progress value={action.historicalEffectiveness} className="h-2" />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Tid till effekt</div>
                  <div className="font-mono text-sm">{action.timeToEffect} månader</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Komplexitet</div>
                  <Badge 
                    variant="outline"
                    style={{ 
                      borderColor: getComplexityColor(action.complexity),
                      color: getComplexityColor(action.complexity),
                    }}
                  >
                    {action.complexity === 'low' ? 'Låg' : 
                     action.complexity === 'medium' ? 'Medel' : 'Hög'}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Relevanta axlar</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {action.relevantAxes.map(axis => (
                    <Badge key={axis} variant="secondary" className="text-xs font-mono">
                      {axis}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Historical examples */}
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Globe className="h-3 w-3" />
                HISTORISKA EXEMPEL
              </div>
              <div className="space-y-2">
                {action.examples.map((example, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{example.country}</span>
                      <span className="text-muted-foreground ml-2">({example.year})</span>
                    </div>
                    <Badge variant="outline" className="text-green-500 border-green-500">
                      {example.outcome}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Final notice */}
      <div className="bg-muted/30 rounded-lg p-4 text-center text-sm text-muted-foreground mb-6">
        Historisk effektivitet garanterar inte framtida resultat. 
        Varje implementation kräver kontextanpassning.
      </div>

      {/* Action button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={onConfirm}
          className="font-mono"
        >
          Fortsätt till simulering
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
