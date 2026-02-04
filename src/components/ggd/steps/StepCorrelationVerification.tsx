/**
 * Step 6: Correlation & Verification
 * 
 * User must verify or reject each top cause based on data.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Check, X, Info } from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from 'recharts';
import type { ProbableCause, CorrelationData } from '../types';
import { getCorrelationData } from '../mockData';

interface StepCorrelationVerificationProps {
  causes: ProbableCause[];
  onConfirm: (verdicts: Record<string, 'supported' | 'rejected'>) => void;
}

export function StepCorrelationVerification({ causes, onConfirm }: StepCorrelationVerificationProps) {
  const [currentCauseIndex, setCurrentCauseIndex] = useState(0);
  const [verdicts, setVerdicts] = useState<Record<string, 'supported' | 'rejected'>>({});

  const currentCause = causes[currentCauseIndex];
  const correlationData = getCorrelationData(currentCause?.id || '');

  const handleVerdict = (verdict: 'supported' | 'rejected') => {
    const newVerdicts = { ...verdicts, [currentCause.id]: verdict };
    setVerdicts(newVerdicts);

    if (currentCauseIndex < causes.length - 1) {
      setCurrentCauseIndex(currentCauseIndex + 1);
    }
  };

  const allVerified = causes.every(c => verdicts[c.id] !== undefined);
  const verifiedCount = Object.keys(verdicts).length;

  const getR2Color = (r2: number) => {
    if (r2 >= 0.7) return '#22c55e';
    if (r2 >= 0.4) return '#f59e0b';
    return '#6b7280';
  };

  if (!currentCause) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold mb-4">Verifiering slutförd</h2>
        <Button size="lg" onClick={() => onConfirm(verdicts)} className="font-mono">
          Fortsätt
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <Badge variant="outline" className="mb-4 font-mono">STEG 6 / 8</Badge>
        <h2 className="text-2xl font-bold mb-2">Korrelation & Verifiering</h2>
        <p className="text-muted-foreground">
          Granska korrelationerna och verifiera eller avvisa varje orsak
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Orsak {currentCauseIndex + 1} av {causes.length}</span>
          <span>{verifiedCount} verifierade</span>
        </div>
        <Progress value={(verifiedCount / causes.length) * 100} className="h-2" />
      </div>

      {/* Current cause card */}
      <div className="bg-card border rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Badge className="mb-2 font-mono">Rank #{currentCause.rank}</Badge>
            <h3 className="text-xl font-bold">{currentCause.name.sv}</h3>
            <p className="text-sm text-muted-foreground mt-1">{currentCause.description.sv}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-primary">
              {currentCause.probability}%
            </div>
            <div className="text-xs text-muted-foreground">sannolikhet</div>
          </div>
        </div>
      </div>

      {/* Correlations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {correlationData.correlations.map((corr, index) => (
          <div key={index} className="bg-card border rounded-lg p-4">
            <div className="text-sm font-medium mb-2">{corr.indicator}</div>
            
            {/* Mini chart */}
            <div className="h-32 mb-3">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="x" tick={{ fontSize: 8 }} />
                  <YAxis tick={{ fontSize: 8 }} />
                  <Tooltip 
                    contentStyle={{ fontSize: 10, background: 'rgba(0,0,0,0.9)', border: 'none' }}
                  />
                  <Scatter data={corr.chartData} fill={getR2Color(corr.r2)} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-muted-foreground">R²</div>
                <div className="font-mono font-bold" style={{ color: getR2Color(corr.r2) }}>
                  {corr.r2.toFixed(2)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">Lag</div>
                <div className="font-mono">{corr.lagMonths}m</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">p-värde</div>
                <div className="font-mono">{corr.significance}</div>
              </div>
            </div>

            {/* Direction */}
            <div className="mt-2 text-center">
              <Badge variant="outline" className="text-xs">
                {corr.direction === 'positive' ? '↗ Positiv' : '↘ Negativ'}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Overall strength */}
      <div className="bg-muted/30 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Övergripande korrelationsstyrka</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress 
              value={correlationData.overallStrength * 100} 
              className="w-32 h-2"
            />
            <span className="font-mono font-bold">
              {(correlationData.overallStrength * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Verdict buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <Button
          size="lg"
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-500/10"
          onClick={() => handleVerdict('rejected')}
        >
          <X className="mr-2 h-5 w-5" />
          Avvisas av data
        </Button>
        <Button
          size="lg"
          className="bg-green-600 hover:bg-green-700"
          onClick={() => handleVerdict('supported')}
        >
          <Check className="mr-2 h-5 w-5" />
          Stöds av data
        </Button>
      </div>

      {/* Skip to finish if all reviewed */}
      {allVerified && (
        <div className="text-center">
          <Button
            size="lg"
            onClick={() => onConfirm(verdicts)}
            className="font-mono"
          >
            Slutför verifiering
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Previous verdicts */}
      {verifiedCount > 0 && (
        <div className="mt-6 pt-6 border-t">
          <div className="text-xs text-muted-foreground mb-2">TIDIGARE VERIFIERINGAR</div>
          <div className="flex flex-wrap gap-2">
            {causes.filter(c => verdicts[c.id]).map(cause => (
              <Badge 
                key={cause.id}
                variant="outline"
                className={verdicts[cause.id] === 'supported' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}
              >
                {verdicts[cause.id] === 'supported' ? '✓' : '✗'} {cause.name.sv}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
