/**
 * LEADERSHIP PANEL
 * 
 * Full detail view of a government period / leader.
 * Opened when clicking on a political overlay period.
 * 
 * DESIGN: Pedagogiskt tillgängligt + ingenjörsprecision.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  GovernmentPeriod, 
  BLOC_COLORS 
} from '@/lib/political/politicalRegistry';
import { cn } from '@/lib/utils';

interface LeadershipPanelProps {
  period: GovernmentPeriod;
  onClose: () => void;
  /** Optional: KPI changes during this period */
  kpiChanges?: Array<{
    name: string;
    startValue: number;
    endValue: number;
    unit: string;
  }>;
}

export const LeadershipPanel: React.FC<LeadershipPanelProps> = ({
  period,
  onClose,
  kpiChanges,
}) => {
  const colors = BLOC_COLORS[period.bloc];
  const startYear = period.startDate.split('-')[0];
  const endYear = period.endDate?.split('-')[0] || 'pågående';
  const durationYears = period.endDate 
    ? ((new Date(period.endDate).getTime() - new Date(period.startDate).getTime()) / (1000 * 60 * 60 * 24 * 365)).toFixed(1)
    : ((Date.now() - new Date(period.startDate).getTime()) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);
  
  return (
    <Card className={cn("w-full max-w-lg shadow-xl", colors.bg, colors.border)}>
      <CardHeader className="relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground font-mono text-sm"
        >
          [×]
        </button>
        
        <div className="flex items-start gap-4">
          {/* Leader avatar placeholder */}
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
            {period.leaderName.split(' ').map(n => n[0]).join('')}
          </div>
          
          <div className="flex-1">
            <CardTitle className="text-xl">{period.leaderName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {period.leaderTitle} för {period.leaderParty}
            </p>
            <div className="flex gap-2 mt-2">
              <Badge className={cn("text-xs", colors.border)}>{colors.label}</Badge>
              {period.minorityGovernment && (
                <Badge variant="outline" className="text-xs">Minoritetsregering</Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Period info */}
        <div className="grid grid-cols-3 gap-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <span className="font-mono text-[10px] text-muted-foreground block">TILLTRÄDDE</span>
            <span className="text-lg font-semibold">{startYear}</span>
          </div>
          <div className="text-center">
            <span className="font-mono text-[10px] text-muted-foreground block">AVGICK</span>
            <span className="text-lg font-semibold">{endYear}</span>
          </div>
          <div className="text-center">
            <span className="font-mono text-[10px] text-muted-foreground block">PERIOD</span>
            <span className="text-lg font-semibold">{durationYears} år</span>
          </div>
        </div>
        
        {/* Coalition */}
        <div>
          <h4 className="font-mono text-[11px] text-muted-foreground mb-2">REGERINGSUNDERLAG</h4>
          <div className="flex flex-wrap gap-2">
            {period.coalitionParties.map((party, idx) => (
              <Badge key={idx} variant="secondary" className="text-sm">
                {party}
              </Badge>
            ))}
          </div>
          
          {/* Pedagogical explanation */}
          <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/30 rounded">
            {period.parliamentaryMajority 
              ? 'Dessa partier hade tillsammans fler än hälften av platserna i parlamentet, vilket gav dem majoritet att driva igenom lagförslag.'
              : 'Dessa partier hade tillsammans färre än hälften av platserna i parlamentet och behövde därför söka stöd från andra partier för att få igenom sina förslag.'
            }
          </p>
        </div>
        
        <Separator />
        
        {/* KPI changes during period */}
        {kpiChanges && kpiChanges.length > 0 && (
          <div>
            <h4 className="font-mono text-[11px] text-muted-foreground mb-2">
              NYCKELTAL UNDER DENNA PERIOD
            </h4>
            <p className="text-[11px] text-muted-foreground mb-3">
              Observerade förändringar – ingen kausalitet påstås.
            </p>
            
            <div className="space-y-2">
              {kpiChanges.map((kpi, idx) => {
                const change = kpi.endValue - kpi.startValue;
                const changePercent = ((change / kpi.startValue) * 100).toFixed(1);
                const isPositive = change > 0;
                
                return (
                  <div key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                    <span>{kpi.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {kpi.startValue} → {kpi.endValue} {kpi.unit}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          isPositive ? "text-green-600" : "text-red-600"
                        )}
                      >
                        {isPositive ? '+' : ''}{changePercent}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Important disclaimer */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <h4 className="font-mono text-[11px] text-amber-700 dark:text-amber-400 mb-1">
            [OBSERVATIONELL NOTERING]
          </h4>
          <p className="text-xs text-amber-800 dark:text-amber-300">
            Statistiken visar vad som hände under denna period, inte vad som orsakades av regeringen. 
            Effekter av politiska beslut har ofta flera års fördröjning. 
            Många faktorer utanför politisk kontroll påverkar utfallen.
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs" asChild>
            <a href={period.sourceUrl || '#'} target="_blank" rel="noopener noreferrer">
              <span className="font-mono mr-1">[→]</span>
              Officiell källa
            </a>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            <span className="font-mono mr-1">[↻]</span>
            Jämför med annan period
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadershipPanel;
