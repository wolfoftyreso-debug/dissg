/**
 * REFERENCE CASE CARD
 * 
 * Public read-only format.
 * Everything clickable down to raw structure.
 */

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  GitBranch,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Building2,
  Landmark,
} from 'lucide-react';
import type { ReferenceCaseSummary } from '@/core/adoption/reference-cases/types';

interface ReferenceCaseCardProps {
  summary: ReferenceCaseSummary;
  onClick?: () => void;
}

const CATEGORY_CONFIG = {
  everyday_consumer: { label: 'Consumer', color: 'bg-blue-500/10 text-blue-600' },
  board_governance: { label: 'Governance', color: 'bg-purple-500/10 text-purple-600' },
  public_policy: { label: 'Policy', color: 'bg-amber-500/10 text-amber-600' },
  failed_outcome: { label: 'Failed Outcome', color: 'bg-red-500/10 text-red-600' },
  ignored_uncertainty: { label: 'Ignored Warning', color: 'bg-orange-500/10 text-orange-600' },
  learning_changed: { label: 'Learning', color: 'bg-green-500/10 text-green-600' },
};

const SCOPE_ICONS = {
  individual: Users,
  household: Users,
  team: Users,
  organization: Building2,
  municipal: Landmark,
  regional: Landmark,
  national: Landmark,
};

const OUTCOME_CONFIG = {
  positive: { icon: CheckCircle2, color: 'text-green-600', label: 'Positive' },
  mixed: { icon: AlertTriangle, color: 'text-amber-600', label: 'Mixed' },
  negative: { icon: XCircle, color: 'text-red-600', label: 'Negative' },
  unknown: { icon: Clock, color: 'text-muted-foreground', label: 'Unknown' },
  too_early: { icon: Clock, color: 'text-blue-600', label: 'Too Early' },
};

export function ReferenceCaseCard({ summary, onClick }: ReferenceCaseCardProps) {
  const categoryConfig = CATEGORY_CONFIG[summary.category];
  const ScopeIcon = SCOPE_ICONS[summary.scope];
  const outcomeConfig = summary.outcome ? OUTCOME_CONFIG[summary.outcome] : null;
  const OutcomeIcon = outcomeConfig?.icon;

  return (
    <Card 
      className="cursor-pointer hover:border-primary/50 transition-colors"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-mono">
                {summary.case_code}
              </Badge>
              <Badge className={`text-xs ${categoryConfig.color}`}>
                {categoryConfig.label}
              </Badge>
            </div>
            <h3 className="font-semibold text-sm leading-tight">
              {summary.title}
            </h3>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <ScopeIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="capitalize">{summary.scope}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{summary.time_horizon_years}y</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{summary.alternatives_count} alts</span>
          </div>
        </div>

        {/* DLS Score */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Decision Legibility</span>
            <span className="font-medium">
              {Math.round(summary.decision_legibility_score * 100)}%
            </span>
          </div>
          <Progress 
            value={summary.decision_legibility_score * 100} 
            className="h-1.5"
          />
        </div>

        {/* Outcome & Foreseeable */}
        {outcomeConfig && (
          <div className="flex items-center justify-between pt-1 border-t">
            <div className="flex items-center gap-1.5 text-xs">
              {OutcomeIcon && <OutcomeIcon className={`h-3.5 w-3.5 ${outcomeConfig.color}`} />}
              <span>Outcome: {outcomeConfig.label}</span>
            </div>
            {summary.was_deviation_foreseeable !== undefined && (
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  summary.was_deviation_foreseeable 
                    ? 'border-amber-500/50 text-amber-600' 
                    : 'border-muted text-muted-foreground'
                }`}
              >
                {summary.was_deviation_foreseeable ? 'Flagged Pre-Decision' : 'Not Foreseeable'}
              </Badge>
            )}
          </div>
        )}

        {/* Uncertainties indicator */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>{summary.uncertainties_count} uncertainties documented</span>
        </div>
      </CardContent>
    </Card>
  );
}
