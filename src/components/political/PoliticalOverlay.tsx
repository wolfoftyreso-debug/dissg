/**
 * POLITICAL OVERLAY COMPONENT
 * 
 * Reusable visualization of government periods on ANY time-series graph.
 * Shows colored background bands + clickable markers at transitions.
 * 
 * DESIGN: "Tysk fabriksprecision" - no decorative elements, pure information.
 */

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  GovernmentPeriod, 
  BLOC_COLORS, 
  getGovernmentsInRange 
} from '@/lib/political/politicalRegistry';
import { cn } from '@/lib/utils';

interface PoliticalOverlayProps {
  countryCode: string;
  startDate: Date;
  endDate: Date;
  /** Width of the chart area in pixels */
  chartWidth: number;
  /** Height of overlay band */
  height?: number;
  /** Whether to show government change markers */
  showMarkers?: boolean;
  /** Callback when a government period is clicked */
  onPeriodClick?: (period: GovernmentPeriod) => void;
}

export const PoliticalOverlay: React.FC<PoliticalOverlayProps> = ({
  countryCode,
  startDate,
  endDate,
  chartWidth,
  height = 24,
  showMarkers = true,
  onPeriodClick,
}) => {
  const [hoveredPeriod, setHoveredPeriod] = useState<string | null>(null);
  
  const governments = getGovernmentsInRange(countryCode, startDate, endDate);
  const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  
  // Calculate pixel position for a date
  const getXPosition = (date: Date): number => {
    const dayOffset = (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    return (dayOffset / totalDays) * chartWidth;
  };
  
  // Calculate width for a period
  const getPeriodWidth = (period: GovernmentPeriod): number => {
    const pStart = new Date(Math.max(new Date(period.startDate).getTime(), startDate.getTime()));
    const pEnd = period.endDate 
      ? new Date(Math.min(new Date(period.endDate).getTime(), endDate.getTime()))
      : endDate;
    
    const startX = getXPosition(pStart);
    const endX = getXPosition(pEnd);
    return endX - startX;
  };
  
  if (governments.length === 0) {
    return (
      <div 
        className="w-full bg-muted/30 flex items-center justify-center text-xs text-muted-foreground font-mono"
        style={{ height }}
      >
        [INGEN POLITISK DATA FÖR {countryCode}]
      </div>
    );
  }
  
  return (
    <div className="relative" style={{ width: chartWidth, height }}>
      {/* Government period bands */}
      {governments.map((gov) => {
        const pStart = new Date(Math.max(new Date(gov.startDate).getTime(), startDate.getTime()));
        const startX = getXPosition(pStart);
        const width = getPeriodWidth(gov);
        const colors = BLOC_COLORS[gov.bloc];
        const isHovered = hoveredPeriod === gov.id;
        
        return (
          <div
            key={gov.id}
            className={cn(
              "absolute top-0 h-full transition-all cursor-pointer",
              colors.bg,
              "border-r",
              colors.border,
              isHovered && "ring-2 ring-primary/50"
            )}
            style={{ left: startX, width }}
            onMouseEnter={() => setHoveredPeriod(gov.id)}
            onMouseLeave={() => setHoveredPeriod(null)}
            onClick={() => onPeriodClick?.(gov)}
          >
            {/* Period label - only show if wide enough */}
            {width > 80 && (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <span className="text-[10px] font-mono truncate px-1 opacity-70">
                  {gov.leaderName.split(' ').pop()}
                </span>
              </div>
            )}
          </div>
        );
      })}
      
      {/* Government change markers */}
      {showMarkers && governments.map((gov, idx) => {
        if (idx === 0) return null; // No marker for first visible government
        
        const markerDate = new Date(gov.startDate);
        if (markerDate < startDate || markerDate > endDate) return null;
        
        const x = getXPosition(markerDate);
        
        return (
          <div
            key={`marker-${gov.id}`}
            className="absolute top-0 h-full w-0.5 bg-foreground/40"
            style={{ left: x }}
          >
            <div 
              className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-foreground cursor-pointer hover:scale-150 transition-transform"
              title={`${gov.leaderName} tillträder`}
            />
          </div>
        );
      })}
      
      {/* Hover tooltip */}
      {hoveredPeriod && (
        <HoverTooltip 
          period={governments.find(g => g.id === hoveredPeriod)!}
        />
      )}
    </div>
  );
};

// Hover tooltip component
const HoverTooltip: React.FC<{ period: GovernmentPeriod }> = ({ period }) => {
  const colors = BLOC_COLORS[period.bloc];
  
  return (
    <div className="absolute z-50 top-full mt-2 left-1/2 -translate-x-1/2 w-64">
      <Card className={cn("shadow-lg", colors.bg, colors.border)}>
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-sm font-semibold">
            {period.leaderName}
          </CardTitle>
          <p className="text-[11px] text-muted-foreground">
            {period.leaderTitle} • {period.leaderParty}
          </p>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-mono text-[10px] text-muted-foreground block">PERIOD</span>
              {period.startDate.split('-')[0]} – {period.endDate?.split('-')[0] || 'pågående'}
            </div>
            <div>
              <span className="font-mono text-[10px] text-muted-foreground block">BLOCK</span>
              <Badge variant="outline" className="text-[10px] h-5">
                {colors.label}
              </Badge>
            </div>
          </div>
          
          {period.coalitionParties.length > 1 && (
            <div className="mt-2">
              <span className="font-mono text-[10px] text-muted-foreground block">KOALITION</span>
              <p className="text-xs">{period.coalitionParties.join(', ')}</p>
            </div>
          )}
          
          <div className="mt-2 flex gap-2">
            {period.minorityGovernment && (
              <Badge variant="secondary" className="text-[10px]">Minoritet</Badge>
            )}
            {period.parliamentaryMajority && (
              <Badge variant="secondary" className="text-[10px]">Majoritet</Badge>
            )}
          </div>
          
          <p className="text-[10px] text-muted-foreground mt-2 font-mono">
            [KLICKA FÖR FULLSTÄNDIG VY]
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PoliticalOverlay;
