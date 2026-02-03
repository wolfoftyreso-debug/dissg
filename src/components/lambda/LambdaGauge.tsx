/**
 * LAMBDA GAUGE VISUALIZATION
 * 
 * Neutral, clinical visualization of Lambda values.
 * No moral colors (no green for "good").
 * 
 * Color scheme:
 * - Blue (0.90-1.10): Balanced
 * - Orange (<0.90): Warning - inefficiency
 * - Purple (>1.10): Warning - overheating
 * - Red (<0.70 or >1.30): Critical
 */

import { cn } from '@/lib/utils';
import { getLambdaBand, type LambdaBand } from '@/lib/lambda/lambda-calculator';

interface LambdaGaugeProps {
  lambda: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showUncertainty?: boolean;
  uncertaintyRange?: { lower: number; upper: number };
  language?: 'sv' | 'en';
  className?: string;
}

export function LambdaGauge({
  lambda,
  size = 'md',
  showLabel = true,
  showUncertainty = true,
  uncertaintyRange,
  language = 'sv',
  className,
}: LambdaGaugeProps) {
  const band = getLambdaBand(lambda);
  
  // Size configurations
  const sizeConfig = {
    sm: { width: 120, height: 80, fontSize: 'text-lg', labelSize: 'text-xs' },
    md: { width: 200, height: 120, fontSize: 'text-2xl', labelSize: 'text-sm' },
    lg: { width: 300, height: 180, fontSize: 'text-4xl', labelSize: 'text-base' },
  };
  
  const config = sizeConfig[size];
  
  // Calculate gauge position (0-180 degrees for semicircle)
  // Lambda 0.5 = 0°, Lambda 1.0 = 90°, Lambda 1.5 = 180°
  const normalizedLambda = Math.max(0.5, Math.min(1.5, lambda));
  const angle = (normalizedLambda - 0.5) * 180;
  
  // Calculate needle endpoint
  const needleLength = config.width * 0.35;
  const centerX = config.width / 2;
  const centerY = config.height - 10;
  const angleRad = (180 - angle) * (Math.PI / 180);
  const needleX = centerX + needleLength * Math.cos(angleRad);
  const needleY = centerY - needleLength * Math.sin(angleRad);
  
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <svg 
        width={config.width} 
        height={config.height} 
        viewBox={`0 0 ${config.width} ${config.height}`}
        className="overflow-visible"
      >
        {/* Background arc segments */}
        <defs>
          <linearGradient id="criticalLowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="warningLowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <linearGradient id="balancedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="warningHighGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#c026d3" />
          </linearGradient>
          <linearGradient id="criticalHighGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c026d3" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
        </defs>
        
        {/* Arc segments - from left (0.5) to right (1.5) */}
        <path
          d={describeArc(centerX, centerY, needleLength + 15, 180, 144)} // 0.5-0.7 Critical low
          fill="none"
          stroke="#dc2626"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d={describeArc(centerX, centerY, needleLength + 15, 144, 108)} // 0.7-0.9 Warning low
          fill="none"
          stroke="#f97316"
          strokeWidth="10"
        />
        <path
          d={describeArc(centerX, centerY, needleLength + 15, 108, 72)} // 0.9-1.1 Balanced
          fill="none"
          stroke="#3b82f6"
          strokeWidth="10"
        />
        <path
          d={describeArc(centerX, centerY, needleLength + 15, 72, 36)} // 1.1-1.3 Warning high
          fill="none"
          stroke="#a855f7"
          strokeWidth="10"
        />
        <path
          d={describeArc(centerX, centerY, needleLength + 15, 36, 0)} // 1.3-1.5 Critical high
          fill="none"
          stroke="#be123c"
          strokeWidth="10"
          strokeLinecap="round"
        />
        
        {/* Uncertainty range indicator */}
        {showUncertainty && uncertaintyRange && (
          <path
            d={describeArc(
              centerX, 
              centerY, 
              needleLength + 25,
              180 - ((uncertaintyRange.lower - 0.5) * 180),
              180 - ((uncertaintyRange.upper - 0.5) * 180)
            )}
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="3"
            strokeOpacity="0.5"
            strokeDasharray="4 2"
          />
        )}
        
        {/* Needle */}
        <line
          x1={centerX}
          y1={centerY}
          x2={needleX}
          y2={needleY}
          stroke="hsl(var(--foreground))"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Center circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r="8"
          fill="hsl(var(--background))"
          stroke="hsl(var(--foreground))"
          strokeWidth="2"
        />
        
        {/* Scale labels */}
        <text x="10" y={centerY + 5} fontSize="10" fill="hsl(var(--muted-foreground))">0.5</text>
        <text x={centerX - 8} y="15" fontSize="10" fill="hsl(var(--muted-foreground))">1.0</text>
        <text x={config.width - 25} y={centerY + 5} fontSize="10" fill="hsl(var(--muted-foreground))">1.5</text>
      </svg>
      
      {/* Value display */}
      <div className="text-center">
        <div className={cn(config.fontSize, 'font-mono font-bold')} style={{ color: band.color }}>
          λ = {lambda.toFixed(3)}
        </div>
        
        {showUncertainty && uncertaintyRange && (
          <div className="text-muted-foreground text-xs font-mono">
            ± {((uncertaintyRange.upper - uncertaintyRange.lower) / 2).toFixed(3)}
          </div>
        )}
        
        {showLabel && (
          <div className={cn(config.labelSize, 'text-muted-foreground mt-1')}>
            {language === 'sv' ? band.label_sv : band.label_en}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to describe SVG arc
function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = startAngle - endAngle <= 180 ? "0" : "1";
  
  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY - (radius * Math.sin(angleInRadians))
  };
}

export default LambdaGauge;
