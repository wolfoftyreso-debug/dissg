/**
 * PERFORMANCE QUADRANT VISUALIZATION
 * 
 * Plots regions on resource input vs outcome axes.
 * Identifies under/over-performers neutrally.
 * 
 * Quadrants:
 * - Top-left: Overperforming (low input, high outcome)
 * - Top-right: Expected high (high input, high outcome)
 * - Bottom-left: Expected low (low input, low outcome)
 * - Bottom-right: Underperforming (high input, low outcome)
 */

import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { PerformanceAnalysis, PerformanceClass } from '@/lib/lambda/index-types';
import { getPerformanceColor, getPerformanceClassLabel } from '@/lib/lambda/underperformance-detector';

interface PerformanceQuadrantProps {
  analyses: PerformanceAnalysis[];
  selectedGeoCode?: string;
  onRegionClick?: (geoCode: string) => void;
  width?: number;
  height?: number;
  language?: 'sv' | 'en';
  className?: string;
}

export function PerformanceQuadrant({
  analyses,
  selectedGeoCode,
  onRegionClick,
  width = 500,
  height = 400,
  language = 'sv',
  className,
}: PerformanceQuadrantProps) {
  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  
  // Scale functions (percentiles 0-100)
  const xScale = (percentile: number) => padding.left + (percentile / 100) * plotWidth;
  const yScale = (percentile: number) => padding.top + ((100 - percentile) / 100) * plotHeight;
  
  return (
    <TooltipProvider>
      <div className={cn('relative', className)}>
        <svg width={width} height={height} className="overflow-visible">
          {/* Background quadrants */}
          <defs>
            <pattern id="quadrantPattern" patternUnits="userSpaceOnUse" width="10" height="10">
              <line x1="0" y1="0" x2="10" y2="10" stroke="hsl(var(--border))" strokeWidth="0.5" strokeOpacity="0.3" />
            </pattern>
          </defs>
          
          {/* Quadrant backgrounds */}
          <rect
            x={padding.left}
            y={padding.top}
            width={plotWidth / 2}
            height={plotHeight / 2}
            fill="rgba(34, 197, 94, 0.05)" // Top-left: overperforming
          />
          <rect
            x={padding.left + plotWidth / 2}
            y={padding.top}
            width={plotWidth / 2}
            height={plotHeight / 2}
            fill="rgba(59, 130, 246, 0.05)" // Top-right: expected high
          />
          <rect
            x={padding.left}
            y={padding.top + plotHeight / 2}
            width={plotWidth / 2}
            height={plotHeight / 2}
            fill="rgba(156, 163, 175, 0.05)" // Bottom-left: expected low
          />
          <rect
            x={padding.left + plotWidth / 2}
            y={padding.top + plotHeight / 2}
            width={plotWidth / 2}
            height={plotHeight / 2}
            fill="rgba(239, 68, 68, 0.05)" // Bottom-right: underperforming
          />
          
          {/* Grid lines */}
          <line
            x1={xScale(50)}
            y1={padding.top}
            x2={xScale(50)}
            y2={height - padding.bottom}
            stroke="hsl(var(--border))"
            strokeDasharray="4 4"
          />
          <line
            x1={padding.left}
            y1={yScale(50)}
            x2={width - padding.right}
            y2={yScale(50)}
            stroke="hsl(var(--border))"
            strokeDasharray="4 4"
          />
          
          {/* Quadrant labels */}
          <text 
            x={padding.left + plotWidth * 0.25} 
            y={padding.top + 20} 
            textAnchor="middle"
            className="text-xs fill-muted-foreground"
          >
            {language === 'sv' ? 'Överpresterar' : 'Overperforming'}
          </text>
          <text 
            x={padding.left + plotWidth * 0.75} 
            y={padding.top + 20} 
            textAnchor="middle"
            className="text-xs fill-muted-foreground"
          >
            {language === 'sv' ? 'Förväntat resultat' : 'Expected result'}
          </text>
          <text 
            x={padding.left + plotWidth * 0.25} 
            y={height - padding.bottom - 10} 
            textAnchor="middle"
            className="text-xs fill-muted-foreground"
          >
            {language === 'sv' ? 'Låg insats' : 'Low input'}
          </text>
          <text 
            x={padding.left + plotWidth * 0.75} 
            y={height - padding.bottom - 10} 
            textAnchor="middle"
            className="text-xs fill-muted-foreground"
          >
            {language === 'sv' ? 'Underpresterar' : 'Underperforming'}
          </text>
          
          {/* Data points */}
          {analyses.map((analysis) => {
            const x = xScale(analysis.resource_percentile);
            const y = yScale(analysis.outcome_percentile);
            const color = getPerformanceColor(analysis.performance_class);
            const isSelected = analysis.geo_code === selectedGeoCode;
            
            return (
              <Tooltip key={analysis.geo_code}>
                <TooltipTrigger asChild>
                  <g
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => onRegionClick?.(analysis.geo_code)}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 10 : 7}
                      fill={color}
                      stroke={isSelected ? 'hsl(var(--foreground))' : 'transparent'}
                      strokeWidth={2}
                      opacity={isSelected ? 1 : 0.7}
                    />
                    {isSelected && (
                      <text
                        x={x}
                        y={y - 15}
                        textAnchor="middle"
                        className="text-xs font-medium fill-foreground"
                      >
                        {analysis.geo_code}
                      </text>
                    )}
                  </g>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-2">
                    <div className="font-medium">{analysis.geo_code}</div>
                    <div className="text-xs" style={{ color }}>
                      {getPerformanceClassLabel(analysis.performance_class, language)}
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <span className="text-muted-foreground">
                        {language === 'sv' ? 'Resursinsats' : 'Resource input'}:
                      </span>
                      <span className="font-mono">{analysis.resource_percentile.toFixed(0)}%</span>
                      
                      <span className="text-muted-foreground">
                        {language === 'sv' ? 'Utfall' : 'Outcome'}:
                      </span>
                      <span className="font-mono">{analysis.outcome_percentile.toFixed(0)}%</span>
                      
                      <span className="text-muted-foreground">
                        {language === 'sv' ? 'Effektivitet' : 'Efficiency'}:
                      </span>
                      <span className="font-mono">{analysis.efficiency_ratio.toFixed(2)}</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
          
          {/* Axes */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="hsl(var(--foreground))"
            strokeWidth={1}
          />
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="hsl(var(--foreground))"
            strokeWidth={1}
          />
          
          {/* Axis labels */}
          <text
            x={width / 2}
            y={height - 10}
            textAnchor="middle"
            className="text-sm fill-foreground"
          >
            {language === 'sv' ? 'Resursinsats (percentil)' : 'Resource Input (percentile)'}
          </text>
          <text
            x={15}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90, 15, ${height / 2})`}
            className="text-sm fill-foreground"
          >
            {language === 'sv' ? 'Utfall (percentil)' : 'Outcome (percentile)'}
          </text>
          
          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map(tick => (
            <g key={`x-${tick}`}>
              <line
                x1={xScale(tick)}
                y1={height - padding.bottom}
                x2={xScale(tick)}
                y2={height - padding.bottom + 5}
                stroke="hsl(var(--foreground))"
              />
              <text
                x={xScale(tick)}
                y={height - padding.bottom + 18}
                textAnchor="middle"
                className="text-xs fill-muted-foreground"
              >
                {tick}
              </text>
            </g>
          ))}
          {[0, 25, 50, 75, 100].map(tick => (
            <g key={`y-${tick}`}>
              <line
                x1={padding.left - 5}
                y1={yScale(tick)}
                x2={padding.left}
                y2={yScale(tick)}
                stroke="hsl(var(--foreground))"
              />
              <text
                x={padding.left - 10}
                y={yScale(tick) + 4}
                textAnchor="end"
                className="text-xs fill-muted-foreground"
              >
                {tick}
              </text>
            </g>
          ))}
        </svg>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 justify-center text-xs">
          {[
            { class: 'overperforming_low_resource' as PerformanceClass, sv: 'Överpresterar', en: 'Overperforming' },
            { class: 'overperforming_high_resource' as PerformanceClass, sv: 'Enligt förväntan', en: 'As expected' },
            { class: 'underperforming_low_resource' as PerformanceClass, sv: 'Låg insats', en: 'Low input' },
            { class: 'underperforming_high_resource' as PerformanceClass, sv: 'Underpresterar', en: 'Underperforming' },
            { class: 'structurally_locked' as PerformanceClass, sv: 'Strukturellt låst', en: 'Structurally locked' },
          ].map(item => (
            <div key={item.class} className="flex items-center gap-1.5">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: getPerformanceColor(item.class) }} 
              />
              <span className="text-muted-foreground">
                {language === 'sv' ? item.sv : item.en}
              </span>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

export default PerformanceQuadrant;
