/**
 * RESPONSIBILITY GATE UI
 * 
 * Each gate is a mandatory passage.
 * No gate → No decision.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Lock,
  GitBranch,
  HelpCircle,
  TrendingUp,
  CheckCircle2,
  Circle,
  ChevronRight,
} from 'lucide-react';
import type {
  GateType,
  GateStatus,
  ScopeLockGate,
  AlternativesExposureGate,
  AlternativeOption,
  UncertaintyItem,
  ConsequenceProjection,
} from '@/core/query-dominance/responsibility/types';
import { GATE_DEFINITIONS } from '@/core/query-dominance/responsibility/gates';

interface ResponsibilityGateProps {
  gate: GateType;
  status: GateStatus;
  onComplete: (data: Record<string, unknown>) => void;
  uxWeight?: {
    tempo_multiplier: number;
    color_saturation: number;
  };
}

const GATE_ICONS: Record<GateType, React.ReactNode> = {
  scope_lock: <Lock className="h-5 w-5" />,
  alternatives_exposure: <GitBranch className="h-5 w-5" />,
  uncertainty_acknowledgement: <HelpCircle className="h-5 w-5" />,
  consequence_projection: <TrendingUp className="h-5 w-5" />,
};

export function ResponsibilityGate({
  gate,
  status,
  onComplete,
  uxWeight,
}: ResponsibilityGateProps) {
  const definition = GATE_DEFINITIONS[gate];
  const Icon = GATE_ICONS[gate];
  
  const transitionStyle = uxWeight ? {
    transition: `all ${0.3 / uxWeight.tempo_multiplier}s ease-in-out`,
    filter: `saturate(${uxWeight.color_saturation}%)`,
  } : {};

  if (status.passed) {
    return (
      <Card className="border-primary/30 bg-primary/5" style={transitionStyle}>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <span className="font-medium">{definition.name}</span>
            <Badge variant="outline" className="ml-auto">Passed</Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card style={transitionStyle}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          {Icon}
          <div>
            <CardTitle className="text-lg">{definition.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{definition.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Purpose:</p>
            <p>{definition.purpose}</p>
          </div>
          
          <Separator />
          
          {/* Gate-specific content */}
          {gate === 'scope_lock' && (
            <ScopeLockContent onComplete={onComplete} />
          )}
          {gate === 'alternatives_exposure' && (
            <AlternativesContent onComplete={onComplete} />
          )}
          {gate === 'uncertainty_acknowledgement' && (
            <UncertaintyContent onComplete={onComplete} />
          )}
          {gate === 'consequence_projection' && (
            <ConsequenceContent onComplete={onComplete} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ScopeLockContent({ onComplete }: { onComplete: (data: Record<string, unknown>) => void }) {
  const [whoAffected, setWhoAffected] = useState('');
  const [whenAffected, setWhenAffected] = useState('');
  const [duration, setDuration] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const canComplete = whoAffected && whenAffected && duration && confirmed;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Who is affected by this decision?</Label>
        <Input
          value={whoAffected}
          onChange={(e) => setWhoAffected(e.target.value)}
          placeholder="e.g., Myself, Family, Team..."
        />
      </div>
      
      <div className="space-y-2">
        <Label>When does the impact begin?</Label>
        <Input
          value={whenAffected}
          onChange={(e) => setWhenAffected(e.target.value)}
          placeholder="e.g., Immediately, Next month..."
        />
      </div>
      
      <div className="space-y-2">
        <Label>How long will the effects last?</Label>
        <Input
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="e.g., 1 year, 5 years, Permanently..."
        />
      </div>
      
      <label className="flex items-start gap-3 cursor-pointer">
        <Checkbox
          checked={confirmed}
          onCheckedChange={(c) => setConfirmed(c === true)}
        />
        <span className="text-sm">
          I confirm this scope definition is accurate and complete
        </span>
      </label>
      
      <Button
        onClick={() => onComplete({
          who_affected: whoAffected.split(',').map(s => s.trim()),
          when_affected: whenAffected,
          duration,
          user_confirmed: true,
        })}
        disabled={!canComplete}
        className="w-full gap-2"
      >
        Lock Scope
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function AlternativesContent({ onComplete }: { onComplete: (data: Record<string, unknown>) => void }) {
  const [alternatives] = useState<AlternativeOption[]>([
    {
      id: '1',
      title: 'Primary Option',
      description: 'The option you are currently considering',
      trade_offs: ['Investment of resources', 'Commitment required'],
      viewed: false,
    },
    {
      id: '2',
      title: 'Do Nothing',
      description: 'Maintain current state',
      trade_offs: ['Status quo preserved', 'Opportunity cost'],
      viewed: false,
    },
    {
      id: '3',
      title: 'Alternative Approach',
      description: 'A different way to achieve similar goals',
      trade_offs: ['Different trade-offs', 'Potentially different timeline'],
      viewed: false,
    },
  ]);
  
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  
  const allViewed = alternatives.every(a => viewed.has(a.id));

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Review all alternatives before proceeding:
      </p>
      
      {alternatives.map((alt) => (
        <Card
          key={alt.id}
          className={`cursor-pointer transition-colors ${
            viewed.has(alt.id) ? 'border-primary/30 bg-primary/5' : 'hover:border-muted-foreground/30'
          }`}
          onClick={() => setViewed(new Set([...viewed, alt.id]))}
        >
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              {viewed.has(alt.id) ? (
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
              )}
              <div>
                <p className="font-medium">{alt.title}</p>
                <p className="text-sm text-muted-foreground">{alt.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {alt.trade_offs.map((t, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{t}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button
        onClick={() => onComplete({ 
          alternatives_shown: alternatives,
          all_viewed: true,
        })}
        disabled={!allViewed}
        className="w-full gap-2"
      >
        {allViewed ? (
          <>
            Confirm Alternatives Reviewed
            <ChevronRight className="h-4 w-4" />
          </>
        ) : (
          `View all alternatives (${viewed.size}/${alternatives.length})`
        )}
      </Button>
    </div>
  );
}

function UncertaintyContent({ onComplete }: { onComplete: (data: Record<string, unknown>) => void }) {
  const uncertainties: UncertaintyItem[] = [
    {
      dimension: 'Future conditions',
      level: 'medium',
      what_is_unknown: 'How external conditions will change',
      why_unknown: 'Future states cannot be predicted with certainty',
    },
    {
      dimension: 'Implementation',
      level: 'low',
      what_is_unknown: 'Exact execution challenges',
      why_unknown: 'Details emerge during implementation',
    },
    {
      dimension: 'Outcome variance',
      level: 'medium',
      what_is_unknown: 'Precise results',
      why_unknown: 'Multiple factors affect outcomes',
    },
  ];
  
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        The following uncertainties exist:
      </p>
      
      {uncertainties.map((u, i) => (
        <div key={i} className="p-3 bg-muted/50 rounded-lg space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{u.dimension}</span>
            <Badge variant="outline" className="text-xs">{u.level}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{u.what_is_unknown}</p>
          <p className="text-xs text-muted-foreground italic">Why: {u.why_unknown}</p>
        </div>
      ))}
      
      <label className="flex items-start gap-3 cursor-pointer">
        <Checkbox
          checked={acknowledged}
          onCheckedChange={(c) => setAcknowledged(c === true)}
        />
        <span className="text-sm">
          I acknowledge these uncertainties and understand they cannot be eliminated
        </span>
      </label>
      
      <Button
        onClick={() => onComplete({ 
          uncertainties,
          user_acknowledged: true,
        })}
        disabled={!acknowledged}
        className="w-full gap-2"
      >
        Acknowledge Uncertainties
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function ConsequenceContent({ onComplete }: { onComplete: (data: Record<string, unknown>) => void }) {
  const projections: ConsequenceProjection[] = [
    {
      scenario: 'best',
      probability_range: [0.15, 0.25],
      description: 'Optimal outcome with favorable conditions',
      impact_dimensions: ['Positive ROI', 'Goals exceeded'],
    },
    {
      scenario: 'expected',
      probability_range: [0.50, 0.65],
      description: 'Most likely outcome based on available information',
      impact_dimensions: ['Goals met', 'Reasonable trade-offs'],
    },
    {
      scenario: 'worst',
      probability_range: [0.10, 0.20],
      description: 'Unfavorable outcome under adverse conditions',
      impact_dimensions: ['Goals not met', 'Resources consumed'],
    },
  ];
  
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const allReviewed = projections.every(p => reviewed.has(p.scenario));

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Review all outcome scenarios:
      </p>
      
      {projections.map((p) => (
        <Card
          key={p.scenario}
          className={`cursor-pointer transition-colors ${
            reviewed.has(p.scenario) ? 'border-primary/30 bg-primary/5' : 'hover:border-muted-foreground/30'
          }`}
          onClick={() => setReviewed(new Set([...reviewed, p.scenario]))}
        >
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              {reviewed.has(p.scenario) ? (
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">{p.scenario} Case</span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(p.probability_range[0] * 100)}-{Math.round(p.probability_range[1] * 100)}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.impact_dimensions.map((d, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{d}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button
        onClick={() => onComplete({ 
          projections,
          user_reviewed: true,
        })}
        disabled={!allReviewed}
        className="w-full gap-2"
      >
        {allReviewed ? (
          <>
            Confirm Scenarios Reviewed
            <ChevronRight className="h-4 w-4" />
          </>
        ) : (
          `Review all scenarios (${reviewed.size}/${projections.length})`
        )}
      </Button>
    </div>
  );
}
