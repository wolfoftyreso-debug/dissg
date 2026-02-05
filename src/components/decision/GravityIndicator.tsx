/**
 * DECISION GRAVITY INDICATOR
 * 
 * Visual indicator for decision gravity.
 * Friction is a feature — heavy decisions feel heavy.
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Clock, 
  Users, 
  RotateCcw,
  TrendingUp,
  Shield,
} from 'lucide-react';
import type { DecisionGravity } from '@/core/query-dominance/shaping/types';
import { getGravitySummary } from '@/core/query-dominance/shaping/gravity-scorer';

interface GravityIndicatorProps {
  gravity: DecisionGravity;
  showComponents?: boolean;
  compact?: boolean;
}

export function GravityIndicator({
  gravity,
  showComponents = false,
  compact = false,
}: GravityIndicatorProps) {
  const summary = getGravitySummary(gravity);
  
  const colorClasses = {
    green: 'bg-green-500/10 text-green-700 border-green-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    orange: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
    red: 'bg-red-500/10 text-red-700 border-red-500/20',
  };
  
  const progressColor = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  if (compact) {
    return (
      <Badge 
        variant="outline" 
        className={`${colorClasses[summary.color]} gap-1.5`}
      >
        <AlertTriangle className="h-3 w-3" />
        {summary.badge}
      </Badge>
    );
  }

  return (
    <Card className={`border-l-4 ${
      summary.color === 'red' ? 'border-l-red-500' :
      summary.color === 'orange' ? 'border-l-orange-500' :
      summary.color === 'yellow' ? 'border-l-yellow-500' :
      'border-l-green-500'
    }`}>
      <CardContent className="pt-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`${colorClasses[summary.color]}`}
              >
                {summary.badge}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Score: {gravity.numeric_score}/100
              </span>
            </div>
            <p className="text-sm mt-2">{summary.description}</p>
          </div>
        </div>

        {/* Gravity Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low Stakes</span>
            <span>Critical</span>
          </div>
          <div className="relative">
            <Progress value={gravity.numeric_score} className="h-2" />
            <div 
              className={`absolute top-0 left-0 h-2 rounded-full ${progressColor[summary.color]}`}
              style={{ width: `${gravity.numeric_score}%` }}
            />
          </div>
        </div>

        {/* Reasons */}
        {gravity.reasons.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {gravity.reasons.map((reason, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {reason}
              </Badge>
            ))}
          </div>
        )}

        {/* Components Breakdown */}
        {showComponents && (
          <div className="space-y-3 pt-2 border-t">
            <p className="text-xs font-medium text-muted-foreground">
              Gravity Components:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <ComponentBadge
                icon={<Users className="h-3 w-3" />}
                label="Population"
                value={gravity.components.population_affected.value}
                contribution={gravity.components.population_affected.contribution}
              />
              <ComponentBadge
                icon={<Clock className="h-3 w-3" />}
                label="Time Horizon"
                value={gravity.components.time_horizon.value}
                contribution={gravity.components.time_horizon.contribution}
              />
              <ComponentBadge
                icon={<RotateCcw className="h-3 w-3" />}
                label="Reversibility"
                value={gravity.components.reversibility.value}
                contribution={gravity.components.reversibility.contribution}
              />
              <ComponentBadge
                icon={<Shield className="h-3 w-3" />}
                label="Uncertainty"
                value={gravity.components.uncertainty.value}
                contribution={gravity.components.uncertainty.contribution}
              />
              <ComponentBadge
                icon={<TrendingUp className="h-3 w-3" />}
                label="Financial"
                value={gravity.components.financial_exposure.value}
                contribution={gravity.components.financial_exposure.contribution}
                className="col-span-2"
              />
            </div>
          </div>
        )}

        {/* UX Behavior Info */}
        {gravity.ux_behavior.friction_level >= 3 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              {summary.recommendation}
            </p>
            {gravity.ux_behavior.cooling_off_suggested && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Consider waiting before finalizing this decision
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ComponentBadge({
  icon,
  label,
  value,
  contribution,
  className = '',
}: {
  icon: React.ReactNode;
  label: string;
  value: 'low' | 'medium' | 'high';
  contribution: number;
  className?: string;
}) {
  const valueColor = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-red-600',
  };

  return (
    <div className={`flex items-center gap-2 text-xs ${className}`}>
      {icon}
      <span className="text-muted-foreground">{label}:</span>
      <span className={valueColor[value]}>{value}</span>
      <span className="text-muted-foreground">({contribution})</span>
    </div>
  );
}
