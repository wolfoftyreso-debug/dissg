/**
 * Step 2: Axis Selection
 * 
 * User must select primary fault axis (max 1) and secondary axes (max 2).
 * Forces focus and prevents narrative flum.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, ChevronRight } from 'lucide-react';
import type { AxisStatus } from '../types';
import type { LambdaAxis } from '@/lib/lambda/lambda-1.0';

interface StepAxisSelectionProps {
  axes: AxisStatus[];
  onConfirm: (primary: LambdaAxis, secondary: LambdaAxis[]) => void;
}

export function StepAxisSelection({ axes, onConfirm }: StepAxisSelectionProps) {
  const [primaryAxis, setPrimaryAxis] = useState<LambdaAxis | null>(null);
  const [secondaryAxes, setSecondaryAxes] = useState<LambdaAxis[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return '#dc2626';
      case 'warning': return '#f59e0b';
      default: return '#22c55e';
    }
  };

  const handleSecondaryToggle = (axis: LambdaAxis) => {
    if (axis === primaryAxis) return;
    
    if (secondaryAxes.includes(axis)) {
      setSecondaryAxes(prev => prev.filter(a => a !== axis));
    } else if (secondaryAxes.length < 2) {
      setSecondaryAxes(prev => [...prev, axis]);
    }
  };

  const canProceed = primaryAxis !== null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-4 font-mono">STEG 2 / 8</Badge>
        <h2 className="text-2xl font-bold mb-2">Systemkomponenter</h2>
        <p className="text-muted-foreground">
          Välj primär felaxel och upp till 2 sekundära axlar för djupanalys
        </p>
      </div>

      {/* Axis table */}
      <div className="bg-card border rounded-xl overflow-hidden mb-6">
        <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 text-xs font-mono text-muted-foreground border-b">
          <div className="col-span-1">PRIMÄR</div>
          <div className="col-span-1">SEK.</div>
          <div className="col-span-3">AXEL</div>
          <div className="col-span-2 text-center">STATUS</div>
          <div className="col-span-2 text-center">AVVIKELSE</div>
          <div className="col-span-3">BIDRAG TILL TOTAL</div>
        </div>

        {axes.map((axisData) => {
          const isPrimary = primaryAxis === axisData.axis;
          const isSecondary = secondaryAxes.includes(axisData.axis);
          const isDisabledSecondary = isPrimary || (!isSecondary && secondaryAxes.length >= 2);

          return (
            <div 
              key={axisData.axis}
              className={`grid grid-cols-12 gap-4 p-4 items-center border-b last:border-b-0 transition-colors ${
                isPrimary ? 'bg-primary/10' : isSecondary ? 'bg-secondary/10' : 'hover:bg-muted/30'
              }`}
            >
              {/* Primary radio */}
              <div className="col-span-1">
                <RadioGroup value={primaryAxis || ''} onValueChange={(v) => {
                  setPrimaryAxis(v as LambdaAxis);
                  setSecondaryAxes(prev => prev.filter(a => a !== v));
                }}>
                  <RadioGroupItem value={axisData.axis} id={`primary-${axisData.axis}`} />
                </RadioGroup>
              </div>

              {/* Secondary checkbox */}
              <div className="col-span-1">
                <Checkbox
                  id={`secondary-${axisData.axis}`}
                  checked={isSecondary}
                  disabled={isDisabledSecondary}
                  onCheckedChange={() => handleSecondaryToggle(axisData.axis)}
                />
              </div>

              {/* Axis name */}
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium">{axisData.axis}</span>
                  <span className="text-muted-foreground">{axisData.name.sv}</span>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2 text-center">
                <Badge 
                  style={{ 
                    backgroundColor: `${getStatusColor(axisData.status)}20`, 
                    color: getStatusColor(axisData.status),
                    borderColor: getStatusColor(axisData.status),
                  }}
                  variant="outline"
                >
                  {axisData.status === 'critical' ? '🔴 Kritisk' : 
                   axisData.status === 'warning' ? '🟡 Varning' : '🟢 Normal'}
                </Badge>
              </div>

              {/* Deviation */}
              <div className="col-span-2 text-center">
                <span className={`font-mono text-lg ${
                  axisData.deviation < 0 ? 'text-red-500' : 
                  axisData.deviation > 0 ? 'text-green-500' : 'text-muted-foreground'
                }`}>
                  {axisData.deviation > 0 ? '+' : ''}{axisData.deviation}%
                </span>
              </div>

              {/* Contribution bar */}
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <Progress 
                    value={axisData.contribution} 
                    className="h-2 flex-1"
                    style={{ 
                      ['--progress-background' as string]: getStatusColor(axisData.status),
                    }}
                  />
                  <span className="text-xs font-mono w-8 text-right">{axisData.contribution}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection summary */}
      <div className="bg-muted/30 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">PRIMÄR AXEL</div>
            {primaryAxis ? (
              <Badge className="font-mono">{primaryAxis}</Badge>
            ) : (
              <span className="text-sm text-muted-foreground">Ej vald</span>
            )}
          </div>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">SEKUNDÄRA AXLAR ({secondaryAxes.length}/2)</div>
            {secondaryAxes.length > 0 ? (
              <div className="flex gap-2">
                {secondaryAxes.map(axis => (
                  <Badge key={axis} variant="secondary" className="font-mono">{axis}</Badge>
                ))}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Ej valda (valfritt)</span>
            )}
          </div>
        </div>
      </div>

      {/* Warning */}
      {!primaryAxis && (
        <div className="flex items-center gap-2 text-amber-500 text-sm mb-6">
          <AlertCircle className="h-4 w-4" />
          <span>Du måste välja en primär axel för att fortsätta</span>
        </div>
      )}

      {/* Action button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          disabled={!canProceed}
          onClick={() => primaryAxis && onConfirm(primaryAxis, secondaryAxes)}
          className="font-mono"
        >
          Fortsätt till mätvärden
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
