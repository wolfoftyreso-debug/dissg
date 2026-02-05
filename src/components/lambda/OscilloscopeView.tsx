/**
 * OSCILLOSCOPE VIEW COMPONENT
 * 
 * Main visualization component for Oscilloscope Mode.
 * Displays real-time signal traces without interpretation.
 * 
 * DESIGN: Light, clinical, strict diagnostic instrument.
 * No decorative elements. Maximum clarity.
 */

import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type OscilloscopeConfig,
  type SignalTrace,
  type SignalWarning,
  type SystemStatus,
  type TimeBase,
  getStatusColor,
  getStatusLabel,
  formatTimeBase,
  OSCILLOSCOPE_PRINCIPLES,
  OSCILLOSCOPE_UI_CONFIG,
} from '@/lib/lambda/oscilloscope-mode';

 // Helper to generate time axis labels based on time base
 function getTimeLabels(timeBase: TimeBase): string[] {
   const now = new Date();
   switch (timeBase) {
     case '1h':
       return ['-60m', '-45m', '-30m', '-15m', 'Nu'];
     case '1d':
       return ['-24h', '-18h', '-12h', '-6h', 'Nu'];
     case '1w':
       return ['-7d', '-5d', '-3d', '-1d', 'Nu'];
     case '1m':
       return ['-4v', '-3v', '-2v', '-1v', 'Nu'];
     case '3m':
       return ['-3m', '-2m', '-1m', 'Nu'];
     case '1y': {
       const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
       const currentMonth = now.getMonth();
       return [
         months[(currentMonth - 11 + 12) % 12],
         months[(currentMonth - 8 + 12) % 12],
         months[(currentMonth - 5 + 12) % 12],
         months[(currentMonth - 2 + 12) % 12],
         months[currentMonth],
       ];
     }
     case '5y': {
       const year = now.getFullYear();
       return [`${year - 4}`, `${year - 3}`, `${year - 2}`, `${year - 1}`, `${year}`];
     }
     case '10y': {
       const year = now.getFullYear();
       return [`${year - 10}`, `${year - 7}`, `${year - 5}`, `${year - 2}`, `${year}`];
     }
     case 'max':
       return ['1990', '2000', '2010', '2020', 'Nu'];
     default:
       return ['', '', '', '', 'Nu'];
   }
 }
 
 // Benchmark reference lines
 interface BenchmarkLine {
   value: number; // 0-1 normalized
   label: string;
   style: 'solid' | 'dashed';
   color: string;
 }
 
 const DEFAULT_BENCHMARKS: BenchmarkLine[] = [
   { value: 0.5, label: 'Medel', style: 'dashed', color: 'hsl(210, 15%, 70%)' },
   { value: 0.75, label: '+1σ', style: 'dashed', color: 'hsl(160, 30%, 50%)' },
   { value: 0.25, label: '-1σ', style: 'dashed', color: 'hsl(0, 35%, 50%)' },
 ];
 
interface OscilloscopeViewProps {
  config: OscilloscopeConfig;
  traces: SignalTrace[];
  warnings: SignalWarning[];
  systemStatus: SystemStatus;
  onTimeBaseChange?: (timeBase: TimeBase) => void;
  onChannelToggle?: (channelId: string) => void;
  language?: 'sv' | 'en';
  className?: string;
}

export function OscilloscopeView({
  config,
  traces,
  warnings,
  systemStatus,
  onTimeBaseChange,
  onChannelToggle,
  language = 'sv',
  className,
}: OscilloscopeViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  
  // Draw oscilloscope grid and traces
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = dimensions;
     const padding = { top: 30, right: 70, bottom: 50, left: 80 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    
     // Clear canvas - Light clinical background
     ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    
     // Draw plot area background - subtle off-white
     ctx.fillStyle = 'hsl(210, 20%, 98%)';
     ctx.fillRect(padding.left, padding.top, plotWidth, plotHeight);
 
     // Draw grid - Very subtle
     ctx.strokeStyle = 'hsl(210, 15%, 92%)';
    ctx.lineWidth = 0.5;
    
    // Minor grid lines
    const minorDivisions = OSCILLOSCOPE_UI_CONFIG.grid.major_divisions * OSCILLOSCOPE_UI_CONFIG.grid.minor_divisions;
    for (let i = 0; i <= minorDivisions; i++) {
      const x = padding.left + (i / minorDivisions) * plotWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
      
      const y = padding.top + (i / minorDivisions) * plotHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }
    
    // Major grid lines
     ctx.strokeStyle = 'hsl(210, 15%, 85%)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= OSCILLOSCOPE_UI_CONFIG.grid.major_divisions; i++) {
      const x = padding.left + (i / OSCILLOSCOPE_UI_CONFIG.grid.major_divisions) * plotWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
      
      const y = padding.top + (i / OSCILLOSCOPE_UI_CONFIG.grid.major_divisions) * plotHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }
     
     // Draw benchmark reference lines
     DEFAULT_BENCHMARKS.forEach(benchmark => {
       const y = padding.top + (1 - benchmark.value) * plotHeight;
       ctx.strokeStyle = benchmark.color;
       ctx.lineWidth = 1;
       if (benchmark.style === 'dashed') {
         ctx.setLineDash([4, 4]);
       } else {
         ctx.setLineDash([]);
       }
       ctx.beginPath();
       ctx.moveTo(padding.left, y);
       ctx.lineTo(width - padding.right, y);
       ctx.stroke();
       ctx.setLineDash([]);
       
       // Benchmark label on right
       ctx.fillStyle = benchmark.color;
       ctx.font = '10px monospace';
       ctx.textAlign = 'left';
       ctx.fillText(benchmark.label, width - padding.right + 8, y + 3);
     });
     
     // Draw Y-axis labels (percentage scale)
     ctx.fillStyle = 'hsl(210, 15%, 45%)';
     ctx.font = '10px monospace';
     ctx.textAlign = 'right';
     const yLabels = ['100%', '75%', '50%', '25%', '0%'];
     yLabels.forEach((label, i) => {
       const y = padding.top + (i / (yLabels.length - 1)) * plotHeight;
       ctx.fillText(label, padding.left - 8, y + 3);
     });
     
     // Draw X-axis time labels
     const timeLabels = getTimeLabels(config.time_base);
     ctx.textAlign = 'center';
     timeLabels.forEach((label, i) => {
       const x = padding.left + (i / (timeLabels.length - 1)) * plotWidth;
       ctx.fillText(label, x, height - padding.bottom + 20);
     });
     
     // Draw axis border
     ctx.strokeStyle = 'hsl(210, 15%, 75%)';
     ctx.lineWidth = 1;
     ctx.strokeRect(padding.left, padding.top, plotWidth, plotHeight);
    
    // Draw traces
    traces.forEach((trace, traceIdx) => {
      const channel = config.channels.find(c => c.id === trace.channel_id);
      if (!channel || !channel.visible) return;
      
      const color = channel.color || OSCILLOSCOPE_UI_CONFIG.channel_colors[traceIdx % OSCILLOSCOPE_UI_CONFIG.channel_colors.length];
      
       // Use normalized 0-1 range for consistent display
       const minVal = 0;
       const maxVal = 1;
       const range = 1;
       
       // Normalize trace values to 0-1 range
       const traceMin = Math.min(...trace.values);
       const traceMax = Math.max(...trace.values);
       const traceRange = traceMax - traceMin || 1;
       const normalizedValues = trace.values.map(v => (v - traceMin) / traceRange);
      
      // Draw noise floor (fill)
      if (config.show_noise_floor && trace.noise_floor.length > 0) {
        ctx.fillStyle = color.replace(')', `, ${OSCILLOSCOPE_UI_CONFIG.noise_floor.fill_opacity})`).replace('rgb', 'rgba');
        ctx.beginPath();
        
         normalizedValues.forEach((val, i) => {
           const x = padding.left + (i / (normalizedValues.length - 1)) * plotWidth;
          const noise = trace.noise_floor[i] || 0;
          const yTop = padding.top + ((maxVal - (val + noise * range)) / range) * plotHeight;
          
          if (i === 0) {
            ctx.moveTo(x, yTop);
          } else {
            ctx.lineTo(x, yTop);
          }
        });
        
        // Draw back along bottom
         for (let i = normalizedValues.length - 1; i >= 0; i--) {
           const x = padding.left + (i / (normalizedValues.length - 1)) * plotWidth;
          const noise = trace.noise_floor[i] || 0;
           const yBottom = padding.top + ((maxVal - (normalizedValues[i] - noise * range)) / range) * plotHeight;
          ctx.lineTo(x, yBottom);
        }
        
        ctx.closePath();
        ctx.fill();
      }
      
       // Draw trace line with thicker stroke for visibility
      ctx.strokeStyle = color;
       ctx.lineWidth = 2;
      ctx.beginPath();
      
       normalizedValues.forEach((val, i) => {
         const x = padding.left + (i / (normalizedValues.length - 1)) * plotWidth;
        const y = padding.top + ((maxVal - val) / range) * plotHeight;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
       // NO glow effect - strict clinical appearance
       
       // Draw current value label at end of trace
       const lastValue = normalizedValues[normalizedValues.length - 1];
       const lastX = padding.left + plotWidth;
       const lastY = padding.top + ((maxVal - lastValue) / range) * plotHeight;
       
       // Value indicator dot
       ctx.fillStyle = color;
       ctx.beginPath();
       ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
       ctx.fill();
    });
    
  }, [config, traces, dimensions]);
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: Math.max(300, container.clientWidth * 0.5),
        });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
     <Card className={cn('bg-white border border-border shadow-none', className)}>
       <CardHeader className="pb-2 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <span className="font-mono text-muted-foreground">[~]</span>
            <div>
              <CardTitle className="text-lg">
                {language === 'sv' ? 'Oscilloskop-läge' : 'Oscilloscope Mode'}
              </CardTitle>
               <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                {OSCILLOSCOPE_PRINCIPLES[language].join(' • ')}
              </p>
            </div>
          </div>
          
          {/* System status indicator */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div 
                 className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getStatusColor(systemStatus.overall_health) }}
              />
               <span className="text-xs font-mono">
                {getStatusLabel(systemStatus.overall_health, language)}
              </span>
            </div>
            
            <Select 
              value={config.time_base} 
              onValueChange={(v) => onTimeBaseChange?.(v as TimeBase)}
            >
               <SelectTrigger className="w-[100px] h-7 text-xs font-mono border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(['1h', '1d', '1w', '1m', '3m', '1y', '5y', '10y', 'max'] as TimeBase[]).map(tb => (
                  <SelectItem key={tb} value={tb}>
                    {formatTimeBase(tb, language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
         {/* Warnings bar - Strict text-only format */}
        {warnings.length > 0 && (
           <div className="flex gap-4 mt-3 flex-wrap border-t border-dashed border-border pt-2">
            {warnings.map((warning, idx) => (
               <span 
                key={idx}
                 className={cn(
                   "text-[10px] font-mono",
                   warning.status === 'critical' ? 'text-status-critical' : 'text-status-warning'
                 )}
              >
                 [{warning.status === 'critical' ? '!' : '?'}] {language === 'sv' ? warning.message_sv : warning.message_en}
               </span>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {/* Oscilloscope display */}
         <div className="relative overflow-hidden border border-border bg-white">
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full"
          />
          
           {/* Channel legend - Strict text format */}
           <div className="absolute bottom-2 left-2 flex gap-4 bg-white/90 px-2 py-1 border border-border">
            {config.channels.map((channel, idx) => (
              <Button
                key={channel.id}
                variant="ghost"
                size="sm"
                className={cn(
                   'h-5 px-1 text-[10px] font-mono rounded-none',
                  !channel.visible && 'opacity-40'
                )}
                onClick={() => onChannelToggle?.(channel.id)}
              >
                <div 
                   className="w-3 h-0.5 mr-1.5"
                  style={{ backgroundColor: channel.color || OSCILLOSCOPE_UI_CONFIG.channel_colors[idx] }}
                />
                {channel.label}
              </Button>
            ))}
          </div>
          
          {/* Clarity score */}
           <div className="absolute top-2 right-2 flex items-center gap-2 text-[10px] font-mono text-muted-foreground bg-white/90 px-2 py-1 border border-border">
             <span>[~]</span>
             <span>{language === 'sv' ? 'Signalklarhet' : 'Signal clarity'}: {systemStatus.clarity_score.toFixed(0)}%</span>
          </div>
           
           {/* Y-axis label */}
           <div className="absolute top-1/2 left-1 -translate-y-1/2 -rotate-90 text-[9px] font-mono text-muted-foreground whitespace-nowrap">
             Normaliserat index (0-100%)
           </div>
           
           {/* X-axis label */}
           <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-mono text-muted-foreground">
             Tidsaxel [{formatTimeBase(config.time_base, language)}]
           </div>
        </div>
        
        {/* Bottom info bar */}
         <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-[10px] font-mono text-muted-foreground">
           <div className="flex items-center gap-6">
             <span>[≡] {systemStatus.active_channels} {language === 'sv' ? 'kanaler' : 'channels'}</span>
            <span>
              {language === 'sv' ? 'Brus' : 'Noise'}: {systemStatus.noise_level}
            </span>
          </div>
          
          <div>
            {language === 'sv' 
              ? 'Korrelation innebär inte kausalitet'
              : 'Correlation does not imply causation'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default OscilloscopeView;
