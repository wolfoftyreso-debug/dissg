import { useMemo } from 'react';

interface ScoreRadarProps {
  effect: number;
  cost: number;
  risk: number;
  reversibility: number;
  size?: number;
  showLabels?: boolean;
  className?: string;
}

const DIMENSIONS = [
  { key: 'effect', label: 'Effekt', angle: -90 },
  { key: 'cost', label: 'Kostnad', angle: 0 },
  { key: 'reversibility', label: 'Reversi.', angle: 90 },
  { key: 'risk', label: 'Risk', angle: 180, inverted: true },
];

export function ScoreRadar({
  effect,
  cost,
  risk,
  reversibility,
  size = 200,
  showLabels = true,
  className = '',
}: ScoreRadarProps) {
  const center = size / 2;
  const maxRadius = (size / 2) - (showLabels ? 30 : 10);

  const scores = useMemo(() => ({
    effect,
    cost,
    risk: 100 - risk, // Invert risk for display
    reversibility,
  }), [effect, cost, risk, reversibility]);

  const points = useMemo(() => {
    return DIMENSIONS.map((dim) => {
      const score = scores[dim.key as keyof typeof scores];
      const radius = (score / 100) * maxRadius;
      const angleRad = (dim.angle * Math.PI) / 180;
      return {
        x: center + radius * Math.cos(angleRad),
        y: center + radius * Math.sin(angleRad),
        labelX: center + (maxRadius + 20) * Math.cos(angleRad),
        labelY: center + (maxRadius + 20) * Math.sin(angleRad),
        ...dim,
        score: dim.key === 'risk' ? risk : score, // Show original risk value
      };
    });
  }, [scores, center, maxRadius]);

  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  // Grid circles
  const gridCircles = [25, 50, 75, 100];

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={`0 0 ${size} ${size}`}
      className={className}
    >
      {/* Background */}
      <circle 
        cx={center} 
        cy={center} 
        r={maxRadius} 
        fill="hsl(var(--muted)/0.3)" 
        stroke="hsl(var(--border))" 
        strokeWidth="1"
      />

      {/* Grid circles */}
      {gridCircles.map((pct) => (
        <circle
          key={pct}
          cx={center}
          cy={center}
          r={(pct / 100) * maxRadius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="0.5"
          strokeDasharray="2,2"
        />
      ))}

      {/* Axis lines */}
      {DIMENSIONS.map((dim) => {
        const angleRad = (dim.angle * Math.PI) / 180;
        const endX = center + maxRadius * Math.cos(angleRad);
        const endY = center + maxRadius * Math.sin(angleRad);
        return (
          <line
            key={dim.key}
            x1={center}
            y1={center}
            x2={endX}
            y2={endY}
            stroke="hsl(var(--border))"
            strokeWidth="1"
          />
        );
      })}

      {/* Score polygon */}
      <polygon
        points={polygonPoints}
        fill="hsl(var(--primary)/0.3)"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
      />

      {/* Score points */}
      {points.map((point) => (
        <circle
          key={point.key}
          cx={point.x}
          cy={point.y}
          r="5"
          fill="hsl(var(--primary))"
          stroke="hsl(var(--background))"
          strokeWidth="2"
        />
      ))}

      {/* Labels */}
      {showLabels && points.map((point) => (
        <g key={`label-${point.key}`}>
          <text
            x={point.labelX}
            y={point.labelY - 8}
            textAnchor="middle"
            className="text-[10px] fill-muted-foreground font-medium"
          >
            {point.label}
          </text>
          <text
            x={point.labelX}
            y={point.labelY + 8}
            textAnchor="middle"
            className="text-xs fill-foreground font-bold"
          >
            {point.score}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default ScoreRadar;
