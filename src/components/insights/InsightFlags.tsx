/**
 * Insight Flag Components
 * Block D: UI for displaying detected deviations
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, TrendingDown, AlertCircle, BarChart3, 
  ChevronRight, Users, Calendar, HelpCircle 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { InsightFlag, DeviationType, PeerGroup } from '@/lib/insights/insightFlags';
import { generateInsightStatement, DEVIATION_TYPE_LABELS } from '@/lib/insights/insightFlags';

interface InsightFlagCardProps {
  flag: InsightFlag;
  onDeepen?: () => void;
  onViewPeerGroup?: () => void;
  compact?: boolean;
  className?: string;
}

export function InsightFlagCard({
  flag,
  onDeepen,
  onViewPeerGroup,
  compact = false,
  className,
}: InsightFlagCardProps) {
  const statement = generateInsightStatement(flag);
  const isAbove = flag.deviationType.includes('above');
  
  const DeviationIcon = isAbove ? TrendingUp : TrendingDown;
  
  if (compact) {
    return (
      <button
        onClick={onDeepen}
        className={cn(
          'w-full text-left p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors min-h-[44px]',
          className
        )}
      >
        <div className="flex items-start gap-3">
          <DeviationIcon className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{flag.entityName}</p>
            <p className="text-xs text-muted-foreground">
              {DEVIATION_TYPE_LABELS[flag.deviationType].sv} • {flag.metricName}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 text-xs">
            {flag.isPercentage ? `${flag.deviationMagnitude > 0 ? '+' : ''}${flag.deviationMagnitude.toFixed(1)}%` : flag.deviationMagnitude.toFixed(2)}
          </Badge>
        </div>
      </button>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 rounded-lg bg-muted">
            <DeviationIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">{flag.entityName}</span>
              <Badge variant="secondary" className="text-xs">
                {DEVIATION_TYPE_LABELS[flag.deviationType].sv}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{flag.metricName}</p>
          </div>
        </div>

        {/* Statement */}
        <p className="text-sm mb-3">{statement}</p>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-center p-2 rounded bg-muted/50">
            <p className="text-xs text-muted-foreground">Observerat värde</p>
            <p className="font-semibold">
              {flag.currentValue.toLocaleString()} <span className="text-xs font-normal">{flag.unit}</span>
            </p>
          </div>
          <div className="text-center p-2 rounded bg-muted/50">
            <p className="text-xs text-muted-foreground">Jämförelsevärde</p>
            <p className="font-semibold">
              {flag.comparisonValue.toLocaleString()} <span className="text-xs font-normal">{flag.unit}</span>
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {flag.period.start} – {flag.period.end}
          </span>
          {flag.peerGroup && (
            <button
              onClick={onViewPeerGroup}
              className="flex items-center gap-1 hover:text-foreground underline"
            >
              <Users className="h-3 w-3" />
              {flag.peerGroup.name}
            </button>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-1 cursor-help">
                <HelpCircle className="h-3 w-3" />
                Konfidens: {Math.round(flag.confidence * 100)}%
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium mb-1">Metodik</p>
              <p className="text-xs">{flag.methodology}</p>
              {flag.uncertaintyFactors.length > 0 && (
                <>
                  <p className="font-medium mt-2 mb-1">Osäkerhetsfaktorer</p>
                  <ul className="text-xs list-disc list-inside">
                    {flag.uncertaintyFactors.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </>
              )}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* CTA */}
        {onDeepen && (
          <Button onClick={onDeepen} className="w-full min-h-[44px]">
            Fördjupa
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface InsightFlagListProps {
  flags: InsightFlag[];
  onSelectFlag: (flag: InsightFlag) => void;
  maxVisible?: number;
  className?: string;
}

export function InsightFlagList({ 
  flags, 
  onSelectFlag, 
  maxVisible = 5,
  className 
}: InsightFlagListProps) {
  const [showAll, setShowAll] = React.useState(false);
  const displayFlags = showAll ? flags : flags.slice(0, maxVisible);
  const hasMore = flags.length > maxVisible;

  if (flags.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p>Inga avvikelser observerade för aktuell period</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {displayFlags.map(flag => (
        <InsightFlagCard
          key={flag.id}
          flag={flag}
          compact
          onDeepen={() => onSelectFlag(flag)}
        />
      ))}
      
      {hasMore && !showAll && (
        <Button
          variant="ghost"
          className="w-full min-h-[44px]"
          onClick={() => setShowAll(true)}
        >
          Visa {flags.length - maxVisible} fler observationer
        </Button>
      )}
    </div>
  );
}

interface PeerGroupDisplayProps {
  peerGroup: PeerGroup;
  currentEntityId?: string;
  onSelectMember?: (memberId: string) => void;
  className?: string;
}

export function PeerGroupDisplay({
  peerGroup,
  currentEntityId,
  onSelectMember,
  className,
}: PeerGroupDisplayProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          {peerGroup.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{peerGroup.description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {peerGroup.members.map(memberId => (
            <button
              key={memberId}
              onClick={() => onSelectMember?.(memberId)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm border min-h-[36px]',
                memberId === currentEntityId
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted hover:bg-muted/80 border-transparent'
              )}
            >
              {memberId}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          {peerGroup.memberCount} medlemmar i gruppen
        </p>
      </CardContent>
    </Card>
  );
}
