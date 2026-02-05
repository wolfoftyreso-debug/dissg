/**
 * RESPONSIBILITY FLOW
 * 
 * Complete flow through all required gates.
 * Weight scales with gravity.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Scale,
  Clock,
  Shield,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ResponsibilityGate } from './ResponsibilityGate';
import {
  createResponsibilitySession,
  calculateUXWeight,
  getConfirmationConfig,
  allGatesPassed,
  getNextGate,
} from '@/core/query-dominance/responsibility';
import type {
  GravityInput,
  ResponsibilitySession,
  GateStatus,
} from '@/core/query-dominance/responsibility/types';

interface ResponsibilityFlowProps {
  decisionId: string;
  decisionTitle: string;
  gravityInput: GravityInput;
  actorType: 'human' | 'ai_agent';
  actorId: string;
  onComplete: (session: ResponsibilitySession) => void;
  onCancel: () => void;
}

export function ResponsibilityFlow({
  decisionId,
  decisionTitle,
  gravityInput,
  actorType,
  actorId,
  onComplete,
  onCancel,
}: ResponsibilityFlowProps) {
  const [session, setSession] = useState<ResponsibilitySession>(() =>
    createResponsibilitySession(decisionId, actorType, actorId, gravityInput)
  );
  
  const [timeSpent, setTimeSpent] = useState(0);
  const [confirmations, setConfirmations] = useState<Set<string>>(new Set());
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  
  const uxWeight = calculateUXWeight(session.gravity_result);
  const confirmConfig = getConfirmationConfig(uxWeight, session.gravity_result.class);
  
  const currentGate = getNextGate(session.gate_statuses);
  const progress = session.gate_statuses.filter(g => g.passed).length / 
                   session.gate_statuses.length * 100;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update session time
  useEffect(() => {
    setSession(s => ({
      ...s,
      time_on_gates_seconds: timeSpent,
    }));
  }, [timeSpent]);

  const handleGateComplete = (gate: string, data: Record<string, unknown>) => {
    setSession(prev => ({
      ...prev,
      gate_statuses: prev.gate_statuses.map(g =>
        g.gate === gate
          ? { ...g, passed: true, passed_at: new Date().toISOString(), data }
          : g
      ),
    }));
  };

  const handleConfirmationToggle = (text: string) => {
    const newConfirmations = new Set(confirmations);
    if (newConfirmations.has(text)) {
      newConfirmations.delete(text);
    } else {
      newConfirmations.add(text);
    }
    setConfirmations(newConfirmations);
  };

  const canProceedToFinal = 
    allGatesPassed(session.gate_statuses) &&
    timeSpent >= session.gravity_result.minimum_review_time_seconds;

  const canComplete = 
    canProceedToFinal &&
    confirmConfig.checkboxes.every(c => confirmations.has(c));

  const handleComplete = () => {
    const finalSession: ResponsibilitySession = {
      ...session,
      all_gates_passed: true,
      decision_made: true,
      decision_timestamp: new Date().toISOString(),
    };
    onComplete(finalSession);
  };

  // Apply UX weight styles
  const containerStyle: React.CSSProperties = {
    filter: `saturate(${uxWeight.color_saturation}%)`,
    transition: `all ${0.3 / uxWeight.tempo_multiplier}s ease-in-out`,
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6" style={containerStyle}>
      {/* Header */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                <CardTitle className="text-lg">Responsibility Review</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {decisionTitle}
              </p>
            </div>
            <Badge 
              variant="outline" 
              className={
                session.gravity_result.class === 'extreme' ? 'border-destructive text-destructive' :
                session.gravity_result.class === 'critical' ? 'border-destructive/70 text-destructive' :
                session.gravity_result.class === 'high' ? 'border-orange-500 text-orange-600' :
                ''
              }
            >
              {session.gravity_result.class.toUpperCase()} gravity
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Gate Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Time tracking */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Time: {formatTime(timeSpent)}</span>
            </div>
            {session.gravity_result.minimum_review_time_seconds > 0 && (
              <div className="text-muted-foreground">
                Min: {formatTime(session.gravity_result.minimum_review_time_seconds)}
              </div>
            )}
            {session.gravity_result.cooling_off_hours > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>{session.gravity_result.cooling_off_hours}h cooling-off</span>
              </div>
            )}
          </div>
          
          {/* Actor info */}
          <div className="text-xs text-muted-foreground">
            Actor: {actorType === 'ai_agent' ? 'AI Agent' : 'Human'} ({actorId})
          </div>
        </CardContent>
      </Card>

      {/* Gates */}
      <div className="space-y-4">
        {session.gate_statuses.map((status) => (
          <ResponsibilityGate
            key={status.gate}
            gate={status.gate}
            status={status}
            onComplete={(data) => handleGateComplete(status.gate, data)}
            uxWeight={{
              tempo_multiplier: uxWeight.tempo_multiplier,
              color_saturation: uxWeight.color_saturation,
            }}
          />
        ))}
      </div>

      {/* Final Confirmation */}
      {canProceedToFinal && !showFinalConfirm && (
        <Button
          onClick={() => setShowFinalConfirm(true)}
          className="w-full"
          size="lg"
        >
          Proceed to Final Confirmation
        </Button>
      )}

      {showFinalConfirm && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Final Confirmation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {confirmConfig.checkboxes.length > 0 && (
              <div className="space-y-3">
                {confirmConfig.checkboxes.map((text, i) => (
                  <label key={i} className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={confirmations.has(text)}
                      onCheckedChange={() => handleConfirmationToggle(text)}
                    />
                    <span className="text-sm">{text}</span>
                  </label>
                ))}
              </div>
            )}
            
            <Separator />
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleComplete}
                disabled={!canComplete}
                className="flex-1 gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Confirm Decision
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
