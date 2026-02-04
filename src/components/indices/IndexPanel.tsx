/**
 * INDEX PANEL - Avanza-style
 * 
 * Compact panel showing a category of indices with performance data.
 * Each row is clickable for drill-down.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

// Mini sparkline
const MiniSparkline: React.FC<{ trend: 'up' | 'down' | 'flat'; className?: string }> = ({ trend, className }) => {
  const path = trend === 'up' 
    ? 'M0,10 L5,8 L10,9 L15,5 L20,6 L25,2'
    : trend === 'down'
    ? 'M0,2 L5,4 L10,3 L15,7 L20,6 L25,10'
    : 'M0,6 L5,5 L10,6 L15,5 L20,6 L25,5';
  
  return (
    <svg viewBox="0 0 25 12" className={cn("h-3 w-8", className)} style={{ overflow: 'visible' }}>
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export function IndexPanel({ title, items, className, onSettings }: IndexPanelProps) {
  const navigate = useNavigate();

  const handleRowClick = (code: string) => {
    navigate(`/index/${code}`);
  };

  return (
    <div className={cn("flex flex-col bg-card border rounded-lg overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
        <h3 className="font-semibold text-sm">{title}</h3>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onSettings}>
          <Settings className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-2 px-3 py-1.5 text-xs font-mono text-muted-foreground border-b bg-muted/20">
        <span>Index</span>
        <span></span>
        <span className="text-right">+/-%</span>
        <span className="text-right">Senast</span>
        <span className="text-right">Tid</span>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-auto">
        {items.map((item) => (
          <button
            key={item.code}
            onClick={() => handleRowClick(item.code)}
            className={cn(
              "w-full grid grid-cols-[auto_1fr_auto_auto_auto] gap-2 px-3 py-2 text-sm",
              "hover:bg-muted/40 transition-colors border-b border-border/50 last:border-0",
              "text-left items-center"
            )}
          >
            {/* Flag + Name */}
            <div className="flex items-center gap-1.5 min-w-0">
              {item.flag && <span className="text-base">{item.flag}</span>}
              <span className="font-medium truncate">{item.name}</span>
            </div>

            {/* Sparkline */}
            <div className="flex items-center justify-end">
              <MiniSparkline 
                trend={item.change > 0.05 ? 'up' : item.change < -0.05 ? 'down' : 'flat'}
                className={item.change >= 0 ? "text-trend-up" : "text-trend-down"}
              />
            </div>

            {/* Change % */}
            <span className={cn(
              "font-mono text-xs text-right",
              item.change >= 0 ? "text-trend-up" : "text-trend-down"
            )}>
              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
            </span>

            {/* Value */}
            <span className={cn(
              "font-mono text-xs text-right",
              item.change >= 0 ? "text-trend-up" : "text-trend-down"
            )}>
              {item.value.toFixed(2)}
            </span>

            {/* Time */}
            <span className="font-mono text-xs text-muted-foreground text-right">
              {item.time}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default IndexPanel;
