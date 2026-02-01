import { useMemo } from 'react';
import { KPIStatus } from '@/types/kpi';

interface SparklineProps {
  data: number[];
  status: KPIStatus;
  width?: number;
  height?: number;
  className?: string;
}

export function Sparkline({ 
  data, 
  status, 
  width = 60, 
  height = 24,
  className = ''
}: SparklineProps) {
  const pathD = useMemo(() => {
    if (data.length < 2) return '';

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const padding = 2;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const points = data.map((value, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((value - min) / range) * chartHeight;
      return `${x},${y}`;
    });

    return `M${points.join(' L')}`;
  }, [data, width, height]);

  const strokeColor = useMemo(() => {
    switch (status) {
      case 'positive':
        return 'hsl(var(--status-positive))';
      case 'warning':
        return 'hsl(var(--status-warning))';
      case 'critical':
        return 'hsl(var(--status-critical))';
      default:
        return 'hsl(var(--status-neutral))';
    }
  }, [status]);

  if (data.length < 2) {
    return (
      <div 
        className={`flex items-center justify-center text-muted-foreground ${className}`}
        style={{ width, height }}
      >
        <span className="text-[10px]">–</span>
      </div>
    );
  }

  return (
    <svg 
      width={width} 
      height={height} 
      className={className}
      viewBox={`0 0 ${width} ${height}`}
    >
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      {data.length > 0 && (
        <circle
          cx={width - 2}
          cy={2 + (height - 4) - ((data[data.length - 1] - Math.min(...data)) / (Math.max(...data) - Math.min(...data) || 1)) * (height - 4)}
          r={2}
          fill={strokeColor}
        />
      )}
    </svg>
  );
}
