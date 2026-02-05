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
    const padding = { top: 20, right: 60, bottom: 40, left: 60 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    
     // Clear canvas - Light clinical background
     ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    
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
    
    // Draw traces
    traces.forEach((trace, traceIdx) => {
      const channel = config.channels.find(c => c.id === trace.channel_id);
      if (!channel || !channel.visible) return;
      
      const color = channel.color || OSCILLOSCOPE_UI_CONFIG.channel_colors[traceIdx % OSCILLOSCOPE_UI_CONFIG.channel_colors.length];
      
      // Find value range
      const minVal = Math.min(...trace.values);
      const maxVal = Math.max(...trace.values);
      const range = maxVal - minVal || 1;
      
      // Draw noise floor (fill)
      if (config.show_noise_floor && trace.noise_floor.length > 0) {
        ctx.fillStyle = color.replace(')', `, ${OSCILLOSCOPE_UI_CONFIG.noise_floor.fill_opacity})`).replace('rgb', 'rgba');
        ctx.beginPath();
        
        trace.values.forEach((val, i) => {
          const x = padding.left + (i / (trace.values.length - 1)) * plotWidth;
          const noise = trace.noise_floor[i] || 0;
          const yTop = padding.top + ((maxVal - (val + noise * range)) / range) * plotHeight;
          const yBottom = padding.top + ((maxVal - (val - noise * range)) / range) * plotHeight;
          
          if (i === 0) {
            ctx.moveTo(x, yTop);
          } else {
            ctx.lineTo(x, yTop);
          }
        });
        
        // Draw back along bottom
        for (let i = trace.values.length - 1; i >= 0; i--) {
          const x = padding.left + (i / (trace.values.length - 1)) * plotWidth;
          const noise = trace.noise_floor[i] || 0;
          const yBottom = padding.top + ((maxVal - (trace.values[i] - noise * range)) / range) * plotHeight;
          ctx.lineTo(x, yBottom);
        }
        
        ctx.closePath();
        ctx.fill();
      }
      
      // Draw trace line
      ctx.strokeStyle = color;
      ctx.lineWidth = OSCILLOSCOPE_UI_CONFIG.trace.line_width;
      ctx.beginPath();
      
      trace.values.forEach((val, i) => {
        const x = padding.left + (i / (trace.values.length - 1)) * plotWidth;
        const y = padding.top + ((maxVal - val) / range) * plotHeight;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
       // NO glow effect - strict clinical appearance
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
