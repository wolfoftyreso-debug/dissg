/**
 * INDEX PANEL - Avanza-style, refined
 * 
 * Compact, dense panel showing indices with professional formatting.
 * Pixel-perfect spacing and typography.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';

interface IndexItem {
  code: string;
  name: string;
  flag?: string;
  change: number;
  value: number;
  time: string;
}

interface IndexPanelProps {
  title: string;
  items: IndexItem[];
  className?: string;
  onSettings?: () => void;
}

// Refined mini sparkline
const Sparkline: React.FC<{ trend: 'up' | 'down' | 'flat'; className?: string }> = ({ trend, className }) => {
  const path = trend === 'up' 
    ? 'M0,8 L4,7 L8,8 L12,4 L16,5 L20,2'
    : trend === 'down'
    ? 'M0,2 L4,3 L8,2 L12,6 L16,5 L20,8'
    : 'M0,5 L4,4 L8,5 L12,4 L16,5 L20,4';
  
  return (
    <svg viewBox="0 0 20 10" className={cn("h-2.5 w-5", className)}>
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// Format number with Swedish locale
const formatNumber = (num: number) => {
  return num.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatChange = (num: number) => {
  const formatted = Math.abs(num).toFixed(2).replace('.', ',');
  return num >= 0 ? `+${formatted}%` : `−${formatted}%`;
};

export function IndexPanel({ title, items, className, onSettings }: IndexPanelProps) {
  const navigate = useNavigate();

  const handleRowClick = (code: string) => {
    navigate(`/index/${code}`);
  };

  return (
    <div className={cn("flex flex-col bg-card border rounded overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
        <button 
          className="p-1 rounded hover:bg-muted/50 transition-colors"
          onClick={onSettings}
        >
          <Settings className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-1 px-3 py-1.5 text-[11px] text-muted-foreground border-b bg-muted/20 font-medium">
        <span>Index</span>
        <span className="text-right w-14">+/−%</span>
        <span className="text-right w-12">Senast</span>
        <span className="text-right w-10">Tid</span>
      </div>

      {/* Rows */}
      <div className="flex-1">
        {items.map((item, idx) => {
          const isPositive = item.change >= 0;
          const trendColor = isPositive ? "text-trend-up" : "text-trend-down";
          
          return (
            <button
              key={item.code}
              onClick={() => handleRowClick(item.code)}
              className={cn(
                "w-full grid grid-cols-[1fr_auto_auto_auto] gap-1 px-3 py-1.5 text-[13px]",
                "hover:bg-muted/40 transition-colors",
                idx < items.length - 1 && "border-b border-border/40",
                "text-left items-center"
              )}
            >
              {/* Flag + Name + Sparkline */}
              <div className="flex items-center gap-1.5 min-w-0">
                {item.flag && <span className="text-sm flex-shrink-0">{item.flag}</span>}
                <span className="font-medium text-foreground truncate">{item.name}</span>
                <Sparkline 
                  trend={item.change > 0.05 ? 'up' : item.change < -0.05 ? 'down' : 'flat'}
                  className={cn("flex-shrink-0 ml-auto", trendColor)}
                />
              </div>

              {/* Change % */}
              <span className={cn("font-mono text-xs text-right w-14 font-medium", trendColor)}>
                {formatChange(item.change)}
              </span>

              {/* Value */}
              <span className={cn("font-mono text-xs text-right w-12", trendColor)}>
                {formatNumber(item.value)}
              </span>

              {/* Time */}
              <span className="font-mono text-xs text-muted-foreground text-right w-10">
                {item.time}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default IndexPanel;
